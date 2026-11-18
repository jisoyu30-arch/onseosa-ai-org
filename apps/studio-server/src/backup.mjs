import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { StoreError, writeJsonAtomic } from './store.mjs';

/*
 * 작품 한 벌 백업과 복원.
 *
 * 백업 파일 하나에 작품 폴더의 모든 파일을 그대로 담는다:
 * 회차 순서(work.json), 본문, 뺀 원고, 메모, 남긴 판, 자동 복구본, 연결 지도, 충돌 때 남긴 것들.
 * 원고 폴더 밖(백업 폴더)에 쓴다. 같은 작품 폴더 안의 "판"은 백업이 아니다.
 *
 * 복원은 새 빈 폴더에만 한다. 이미 무언가 있는 폴더에는 쓰지 않는다.
 */

export const BACKUP_FORMAT = 'onseosa-work-backup';
export const BACKUP_VERSION = 1;

const ID = '[a-z0-9][a-z0-9-]{0,39}';
const KEY = '[0-9A-Za-z-]{1,80}';
// 작품 폴더 안에서 백업에 담는 파일. 여기 없는 이름은 담지 않고 따로 알린다.
const ALLOWED = new RegExp(
  `^(?:(?:work|last|notes|map)\\.json|docs/${ID}\\.json|versions/${ID}/\\d{4,}\\.json|recovery/${ID}/${KEY}\\.json|(?:notes-recovery|map-recovery)/${KEY}\\.json)$`,
);
const WORK_ID = new RegExp(`^${ID}$`);

const sha = (text) => crypto.createHash('sha256').update(text, 'utf8').digest('hex');
const canon = (data) => JSON.stringify(data, null, 2);

export function defaultBackupRoot(dataRoot) {
  const root = path.resolve(dataRoot);
  return path.join(path.dirname(root), `${path.basename(root)}-backups`);
}

function walk(dir, prefix = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(path.join(dir, entry.name), rel));
    else out.push(rel);
  }
  return out;
}

function assertWorkId(wid) {
  if (typeof wid !== 'string' || !WORK_ID.test(wid)) throw new StoreError(400, 'invalid', '작품 ID 형식이 맞지 않습니다.');
  return wid;
}

// 작품 폴더를 읽어 백업 묶음을 만든다. 읽지 못하는 파일이 하나라도 있으면 멈춘다(빠진 백업을 완료라 하지 않는다).
export function exportWork(dataRoot, wid, now = new Date()) {
  const dir = path.join(dataRoot, 'works', assertWorkId(wid));
  if (!fs.existsSync(path.join(dir, 'work.json'))) throw new StoreError(404, 'not_found', '작품을 찾을 수 없습니다.');
  const files = {};
  const manifest = [];
  const skipped = [];
  for (const rel of walk(dir)) {
    if (rel.endsWith('.tmp')) continue; // 쓰다 만 임시 파일
    if (!ALLOWED.test(rel)) {
      skipped.push(rel);
      continue;
    }
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8'));
    } catch {
      throw new StoreError(500, 'corrupt', `읽을 수 없는 파일이 있어 백업을 만들지 않았습니다: ${rel}`);
    }
    files[rel] = data;
    manifest.push({ path: rel, sha256: sha(canon(data)) });
  }
  const work = files['work.json'];
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    workId: wid,
    title: work.title,
    counts: countFiles(files),
    skipped,
    manifest,
    files,
  };
}

function countFiles(files) {
  const names = Object.keys(files);
  const work = files['work.json'] ?? {};
  const map = files['map.json'] ?? {};
  return {
    docs: (work.docs ?? []).length,
    removed: (work.removed ?? []).length,
    docFiles: names.filter((n) => n.startsWith('docs/')).length,
    versions: names.filter((n) => n.startsWith('versions/')).length,
    recovery: names.filter((n) => n.startsWith('recovery/')).length,
    notes: names.includes('notes.json') ? 1 : 0,
    notesRecovery: names.filter((n) => n.startsWith('notes-recovery/')).length,
    cards: (map.cards ?? []).length,
    links: (map.links ?? []).length,
    mapRecovery: names.filter((n) => n.startsWith('map-recovery/')).length,
    files: names.length,
  };
}

// 묶음이 온전한지 확인한다. 손상됐으면 이유를 던진다.
export function checkBundle(bundle) {
  if (!bundle || bundle.format !== BACKUP_FORMAT) throw new Error('온서사 작품 백업 파일이 아닙니다.');
  if (bundle.version !== BACKUP_VERSION) throw new Error(`이 프로그램이 모르는 백업 판(${bundle.version})입니다.`);
  assertWorkId(bundle.workId);
  if (!bundle.files || typeof bundle.files !== 'object' || !bundle.files['work.json']) throw new Error('백업에 작품 정보(work.json)가 없습니다.');
  const listed = new Map((bundle.manifest ?? []).map((m) => [m.path, m.sha256]));
  for (const [rel, data] of Object.entries(bundle.files)) {
    if (!ALLOWED.test(rel)) throw new Error(`백업에 허용되지 않은 파일 이름이 있습니다: ${rel}`);
    if (listed.get(rel) !== sha(canon(data))) throw new Error(`백업 파일이 손상됐습니다: ${rel}`);
  }
  if (listed.size !== Object.keys(bundle.files).length) throw new Error('백업의 파일 목록과 내용의 개수가 다릅니다.');
  if (bundle.files['work.json'].id !== bundle.workId) throw new Error('백업의 작품 ID가 서로 다릅니다.');
  return bundle;
}

// 백업 폴더(원고 폴더 밖)에 파일 하나로 쓴다. 쓴 뒤 다시 읽어 확인한다.
export function writeBackup(dataRoot, backupRoot, wid, now = new Date()) {
  const bundle = exportWork(dataRoot, wid, now);
  const name = `backup-${now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')}-${crypto.randomBytes(2).toString('hex')}.json`;
  const file = path.join(backupRoot, wid, name);
  writeJsonAtomic(file, bundle, { exclusive: true });
  checkBundle(JSON.parse(fs.readFileSync(file, 'utf8')));
  return { file, bytes: fs.statSync(file).size, exportedAt: bundle.exportedAt, counts: bundle.counts, skipped: bundle.skipped };
}

// 새 빈 폴더에 복원한다. 비어 있지 않으면 아무것도 쓰지 않는다.
export function restoreBackup(bundle, targetRoot) {
  checkBundle(bundle);
  const root = path.resolve(targetRoot);
  if (fs.existsSync(root) && fs.readdirSync(root).length > 0) throw new Error(`복원할 폴더가 비어 있지 않습니다. 새 빈 폴더를 지정해 주세요: ${root}`);
  const dir = path.join(root, 'works', bundle.workId);
  for (const [rel, data] of Object.entries(bundle.files)) writeJsonAtomic(path.join(dir, ...rel.split('/')), data, { exclusive: true });
  return { root, workId: bundle.workId, counts: countFiles(bundle.files) };
}

// 두 원고 폴더의 같은 작품을 파일 단위로 비교한다. 회차 ID와 순서는 따로 한 번 더 본다.
export function compareWork(rootA, rootB, wid) {
  const a = exportWork(rootA, wid);
  const b = exportWork(rootB, wid);
  const differences = [];
  const names = new Set([...Object.keys(a.files), ...Object.keys(b.files)]);
  for (const rel of [...names].sort()) {
    if (!(rel in a.files)) differences.push(`원본에 없음: ${rel}`);
    else if (!(rel in b.files)) differences.push(`복원본에 없음: ${rel}`);
    else if (canon(a.files[rel]) !== canon(b.files[rel])) differences.push(`내용 다름: ${rel}`);
  }
  const order = (w) => JSON.stringify({ docs: (w.docs ?? []).map((d) => d.id), removed: (w.removed ?? []).map((d) => d.id) });
  const sameOrder = order(a.files['work.json']) === order(b.files['work.json']);
  if (!sameOrder) differences.push('회차 ID나 순서가 다름');
  return { same: differences.length === 0, sameOrder, differences, counts: a.counts, countsRestored: b.counts };
}
