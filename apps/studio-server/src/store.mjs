import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/*
 * 원고 저장소. 작품마다 폴더 하나, 원고(회차나 장 한 편)마다 파일 하나.
 *
 *   works/<작품ID>/work.json                 제목, 원고 순서 (rev)
 *   works/<작품ID>/last.json                 마지막으로 쓰던 자리
 *   works/<작품ID>/notes.json                인물·설정·복선 메모 (rev)
 *   works/<작품ID>/docs/<원고ID>.json        본문 (rev)
 *   works/<작품ID>/versions/<원고ID>/0001.json  작가가 남긴 판. 한 번 쓰면 고치지 않는다.
 *   works/<작품ID>/recovery/<원고ID>/...     자동 복구본. 오래된 자동분만 정리한다.
 *   works/<작품ID>/map.json                  작품 연결 지도: 카드와 이름 붙은 연결 (rev)
 *   works/<작품ID>/map-recovery/...          지도 충돌에서 고르지 않은 쪽
 *
 * 모든 쓰기는 "내가 본 rev"를 받아 비교한다. 다르면 거절하고 지금 내용을 돌려준다.
 * 파일 작업은 동기 호출이라, 비교와 쓰기 사이에 다른 요청이 끼어들지 못한다.
 */

const ID = /^[a-z0-9][a-z0-9-]{0,39}$/;

export const LIMITS = {
  sceneChars: 2_000_000,
  noteChars: 500_000,
  title: 200,
  label: 80,
  docs: 20000,
  recoveryKeep: 40,
  recoveryGapMs: 5 * 60 * 1000,
  mapCards: 2000,
  mapLinks: 10000,
  cardNote: 5000,
  cardSource: 1000,
  searchQuery: 100,
};

// 연결 지도의 카드 종류: 등장인물 · 주제 · 주요 사건 · 조사 자료
export const CARD_KINDS = ['person', 'theme', 'event', 'source'];

export class StoreError extends Error {
  constructor(status, code, message, extra) {
    super(message);
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}

const bad = (message) => new StoreError(400, 'invalid', message);
const missing = (message) => new StoreError(404, 'not_found', message);

function assertId(id, what) {
  if (typeof id !== 'string' || !ID.test(id)) throw bad(`${what} ID 형식이 맞지 않습니다.`);
  return id;
}

function assertText(value, limit, what) {
  if (typeof value !== 'string') throw bad(`${what}은(는) 글이어야 합니다.`);
  if (value.length > limit) throw bad(`${what}이(가) 너무 깁니다.`);
  return value;
}

function assertRev(value) {
  if (!Number.isInteger(value) || value < 0) throw bad('baseRev가 필요합니다.');
  return value;
}

// 글에서 낱말이 나온 횟수와, 앞뒤를 조금 붙인 발췌(처음 몇 곳). 화면도 같은 모양으로 쓴다.
export function findInText(text, q, { max = 3, pad = 28 } = {}) {
  const hay = text.toLowerCase();
  const needle = q.toLowerCase();
  const snippets = [];
  let count = 0;
  if (!needle || hay.length !== text.length) return { count, snippets }; // 길이가 달라지는 글자는 드물다. 그때는 발췌 자리가 어긋나므로 찾지 않는다.
  for (let at = hay.indexOf(needle); at !== -1; at = hay.indexOf(needle, at + needle.length)) {
    count += 1;
    if (snippets.length < max) {
      const flat = (s) => s.replace(/\s+/g, ' ');
      snippets.push({ at, before: flat(text.slice(Math.max(0, at - pad), at)), match: text.slice(at, at + needle.length), after: flat(text.slice(at + needle.length, at + needle.length + pad)) });
    }
  }
  return { count, snippets };
}

export function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;
}

const sha = (text) => crypto.createHash('sha256').update(text, 'utf8').digest('hex');

function readJson(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
  try {
    return JSON.parse(raw);
  } catch {
    // 깨진 파일을 빈 것으로 취급하면 그 위에 덮어쓰게 된다. 멈추고 알린다.
    throw new StoreError(500, 'corrupt', `파일을 읽을 수 없습니다: ${path.basename(file)}`);
  }
}

// 임시 파일에 쓰고 디스크까지 내려보낸 뒤 이름을 바꾼다. 쓰다가 꺼져도 원래 파일은 온전하다.
export function writeJsonAtomic(file, data, { exclusive = false } = {}) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (exclusive && fs.existsSync(file)) throw new StoreError(409, 'exists', '이미 있는 파일은 고치지 않습니다.');
  const tmp = `${file}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  const fd = fs.openSync(tmp, 'w');
  try {
    fs.writeSync(fd, JSON.stringify(data, null, 2));
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  try {
    fs.renameSync(tmp, file);
  } catch (e) {
    fs.rmSync(tmp, { force: true });
    throw e;
  }
}

export function createStore(root, { now = () => new Date() } = {}) {
  const worksDir = path.join(root, 'works');
  const workDir = (wid) => path.join(worksDir, assertId(wid, '작품'));
  const sceneFile = (wid, sid) => path.join(workDir(wid), 'docs', `${assertId(sid, '원고')}.json`);
  const versionDir = (wid, sid) => path.join(workDir(wid), 'versions', assertId(sid, '원고'));
  const recoveryDir = (wid, sid) => path.join(workDir(wid), 'recovery', assertId(sid, '원고'));
  const stamp = () => now().toISOString();

  function getWork(wid) {
    const work = readJson(path.join(workDir(wid), 'work.json'));
    if (!work) throw missing('작품을 찾을 수 없습니다.');
    return work;
  }

  function assertSceneInWork(wid, sid) {
    const work = getWork(wid);
    // 목록에서 뺀 원고도 읽고 쓸 수 있다. 다른 탭에서 쓰던 글이 갈 곳을 잃지 않게 하기 위해서다.
    if (![...work.docs, ...(work.removed ?? [])].some((d) => d.id === sid)) throw missing('이 작품에 없는 원고입니다.');
    return work;
  }

  function cleanDocs(input, seen = new Set(), allowEmpty = false) {
    if (!Array.isArray(input) || (input.length === 0 && !allowEmpty)) throw bad('원고가 하나 이상 있어야 합니다.');
    if (input.length > LIMITS.docs) throw bad('원고가 너무 많습니다.');
    return input.map((d) => {
      if (!d || typeof d !== 'object') throw bad('원고 형식이 맞지 않습니다.');
      const id = assertId(d.id, '원고');
      if (seen.has(id)) throw bad('같은 ID가 두 번 나옵니다.');
      seen.add(id);
      return { id, title: assertText(d.title ?? '', LIMITS.title, '원고 제목') };
    });
  }

  function listWorks() {
    let names = [];
    try {
      names = fs.readdirSync(worksDir);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    const out = [];
    for (const name of names) {
      if (!ID.test(name)) continue;
      const work = readJson(path.join(worksDir, name, 'work.json'));
      if (!work) continue;
      out.push({
        id: work.id,
        title: work.title,
        updatedAt: work.updatedAt,
        docCount: work.docs.length,
      });
    }
    return out.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }

  function createWork(input) {
    // 제목 없이도 만든다. 쓰기 전에 입력을 요구하지 않기 위해서다.
    const title = assertText(input?.title ?? '', LIMITS.title, '작품 제목').trim() || '제목 없는 작품';
    const at = stamp();
    const work = {
      id: newId('w'),
      rev: 1,
      title,
      docs: [{ id: newId('d'), title: '1화' }],
      removed: [],
      createdAt: at,
      updatedAt: at,
    };
    writeJsonAtomic(path.join(workDir(work.id), 'work.json'), work, { exclusive: true });
    return work;
  }

  function putWork(wid, input) {
    const cur = getWork(wid);
    const baseRev = assertRev(input?.baseRev);
    if (baseRev !== cur.rev) throw new StoreError(409, 'conflict', '목차가 다른 곳에서 바뀌었습니다.', { current: cur });
    const title = assertText(input.title ?? cur.title, LIMITS.title, '작품 제목').trim() || cur.title;
    // 원고는 목록(docs)이나 뺀 목록(removed) 어느 한쪽에 반드시 남는다. 어디에도 없게 만드는 요청은 받지 않는다.
    const seen = new Set();
    const docs = cleanDocs(input.docs, seen);
    const before = new Map((cur.removed ?? []).map((d) => [d.id, d.removedAt]));
    const at = stamp();
    const removed = cleanDocs(input.removed ?? cur.removed ?? [], seen, true).map((d) => ({ ...d, removedAt: before.get(d.id) ?? at }));
    for (const d of [...cur.docs, ...(cur.removed ?? [])]) {
      if (!seen.has(d.id)) throw bad('원고를 목록에서 완전히 없앨 수는 없습니다. 뺀 원고 목록으로 옮겨야 합니다.');
    }
    const next = { ...cur, rev: cur.rev + 1, title, docs, removed, updatedAt: at };
    writeJsonAtomic(path.join(workDir(wid), 'work.json'), next);
    return next;
  }

  function getLast(wid) {
    getWork(wid);
    return readJson(path.join(workDir(wid), 'last.json'));
  }

  function putLast(wid, input) {
    getWork(wid);
    const last = {
      docId: assertId(input?.docId, '원고'),
      caret: Number.isInteger(input.caret) && input.caret >= 0 ? input.caret : 0,
      scroll: Number.isFinite(input.scroll) && input.scroll >= 0 ? Math.round(input.scroll) : 0,
      at: stamp(),
    };
    writeJsonAtomic(path.join(workDir(wid), 'last.json'), last);
    return last;
  }

  function getScene(wid, sid) {
    assertSceneInWork(wid, sid);
    return readJson(sceneFile(wid, sid)) ?? { id: sid, rev: 0, text: '', updatedAt: null };
  }

  function listRecovery(wid, sid) {
    assertSceneInWork(wid, sid);
    return recoveryNames(wid, sid)
      .map((name) => {
        const r = readJson(path.join(recoveryDir(wid, sid), name));
        return r ? { key: name.replace(/\.json$/, ''), at: r.at, reason: r.reason, chars: r.text.length } : null;
      })
      .filter(Boolean)
      .reverse();
  }

  function recoveryNames(wid, sid) {
    try {
      return fs.readdirSync(recoveryDir(wid, sid)).filter((n) => n.endsWith('.json')).sort();
    } catch (e) {
      if (e.code === 'ENOENT') return [];
      throw e;
    }
  }

  // reason: auto(일정 간격) · overwrite(충돌 때 밀려난 쪽) · restore(복원 직전) · stash(화면이 맡긴 글)
  function saveRecovery(wid, sid, text, reason, rev) {
    if (!text) return null;
    const names = recoveryNames(wid, sid);
    const lastName = names[names.length - 1];
    if (lastName) {
      const last = readJson(path.join(recoveryDir(wid, sid), lastName));
      if (last && last.text === text) return lastName.replace(/\.json$/, '');
    }
    const at = stamp();
    const key = `${at.replace(/[-:.]/g, '')}-${reason}-${crypto.randomBytes(2).toString('hex')}`;
    writeJsonAtomic(path.join(recoveryDir(wid, sid), `${key}.json`), { at, reason, rev, text, sha256: sha(text) }, { exclusive: true });
    // 자동분만 정리한다. 충돌·복원 때 남긴 것은 지우지 않는다.
    const autos = recoveryNames(wid, sid).filter((n) => n.includes('-auto-'));
    for (const old of autos.slice(0, Math.max(0, autos.length - LIMITS.recoveryKeep))) {
      fs.rmSync(path.join(recoveryDir(wid, sid), old), { force: true });
    }
    return key;
  }

  function lastAutoRecoveryAt(wid, sid) {
    const autos = recoveryNames(wid, sid).filter((n) => n.includes('-auto-'));
    const last = autos[autos.length - 1];
    if (!last) return 0;
    const r = readJson(path.join(recoveryDir(wid, sid), last));
    return r ? Date.parse(r.at) : 0;
  }

  function writeScene(wid, sid, cur, text) {
    const next = { id: sid, rev: cur.rev + 1, text, updatedAt: stamp() };
    writeJsonAtomic(sceneFile(wid, sid), next);
    return next;
  }

  function putScene(wid, sid, input) {
    const cur = getScene(wid, sid);
    const baseRev = assertRev(input?.baseRev);
    const text = assertText(input.text, LIMITS.sceneChars, '본문');
    if (baseRev !== cur.rev) {
      throw new StoreError(409, 'conflict', '이 원고가 다른 곳에서 고쳐졌습니다.', { current: cur });
    }
    if (text === cur.text && cur.rev > 0) return { rev: cur.rev, updatedAt: cur.updatedAt };
    if (input.keepPrevious) saveRecovery(wid, sid, cur.text, 'overwrite', cur.rev);
    else if (now().getTime() - lastAutoRecoveryAt(wid, sid) >= LIMITS.recoveryGapMs) saveRecovery(wid, sid, cur.text, 'auto', cur.rev);
    const next = writeScene(wid, sid, cur, text);
    return { rev: next.rev, updatedAt: next.updatedAt };
  }

  function stashRecovery(wid, sid, input) {
    const cur = getScene(wid, sid);
    const text = assertText(input?.text, LIMITS.sceneChars, '본문');
    return { key: saveRecovery(wid, sid, text, 'stash', cur.rev) };
  }

  function getRecovery(wid, sid, key) {
    assertSceneInWork(wid, sid);
    if (typeof key !== 'string' || !/^[0-9A-Za-z-]{1,80}$/.test(key)) throw bad('복구본 이름이 맞지 않습니다.');
    const r = readJson(path.join(recoveryDir(wid, sid), `${key}.json`));
    if (!r) throw missing('복구본을 찾을 수 없습니다.');
    return { key, at: r.at, reason: r.reason, text: r.text };
  }

  function versionNumbers(wid, sid) {
    try {
      return fs
        .readdirSync(versionDir(wid, sid))
        .map((n) => /^(\d{4,})\.json$/.exec(n))
        .filter(Boolean)
        .map((m) => Number(m[1]))
        .sort((a, b) => a - b);
    } catch (e) {
      if (e.code === 'ENOENT') return [];
      throw e;
    }
  }

  const versionFile = (wid, sid, n) => path.join(versionDir(wid, sid), `${String(n).padStart(4, '0')}.json`);

  function getVersion(wid, sid, n) {
    assertSceneInWork(wid, sid);
    if (!Number.isInteger(n) || n < 1) throw bad('판 번호가 맞지 않습니다.');
    const v = readJson(versionFile(wid, sid, n));
    if (!v) throw missing('판을 찾을 수 없습니다.');
    return v;
  }

  function listVersions(wid, sid) {
    assertSceneInWork(wid, sid);
    return versionNumbers(wid, sid)
      .map((n) => readJson(versionFile(wid, sid, n)))
      .filter(Boolean)
      .map((v) => ({ n: v.n, label: v.label, createdAt: v.createdAt, chars: v.text.length }))
      .reverse();
  }

  // 서버에 저장된 지금 본문을 판으로 남긴다. 화면은 먼저 저장을 끝내고 부른다.
  function createVersion(wid, sid, input) {
    const cur = getScene(wid, sid);
    const baseRev = assertRev(input?.baseRev);
    if (baseRev !== cur.rev) throw new StoreError(409, 'conflict', '저장이 끝난 뒤에 판을 남길 수 있습니다.', { current: cur });
    const label = assertText(input.label ?? '', LIMITS.label, '판 이름').trim();
    const numbers = versionNumbers(wid, sid);
    const lastN = numbers[numbers.length - 1] ?? 0;
    if (lastN) {
      const last = readJson(versionFile(wid, sid, lastN));
      if (last && last.text === cur.text) return { unchanged: true, n: last.n, label: last.label, createdAt: last.createdAt, chars: last.text.length };
    }
    const version = { n: lastN + 1, label, createdAt: stamp(), sceneRev: cur.rev, sha256: sha(cur.text), text: cur.text };
    writeJsonAtomic(versionFile(wid, sid, version.n), version, { exclusive: true });
    return { unchanged: false, n: version.n, label, createdAt: version.createdAt, chars: cur.text.length };
  }

  // 판이나 복구본으로 되돌린다. 되돌리기 직전 내용은 복구본으로 먼저 남긴다.
  function restoreScene(wid, sid, input) {
    const cur = getScene(wid, sid);
    const baseRev = assertRev(input?.baseRev);
    if (baseRev !== cur.rev) throw new StoreError(409, 'conflict', '이 원고가 다른 곳에서 고쳐졌습니다.', { current: cur });
    const from = input.from ?? {};
    const text = from.kind === 'version' ? getVersion(wid, sid, from.n).text : from.kind === 'recovery' ? getRecovery(wid, sid, from.key).text : null;
    if (text === null) throw bad('무엇으로 되돌릴지 알 수 없습니다.');
    if (text === cur.text) return cur;
    saveRecovery(wid, sid, cur.text, 'restore', cur.rev);
    return writeScene(wid, sid, cur, text);
  }

  const EMPTY_NOTES = { rev: 0, characters: '', world: '', threads: '', updatedAt: null };

  function getNotes(wid) {
    getWork(wid);
    return readJson(path.join(workDir(wid), 'notes.json')) ?? EMPTY_NOTES;
  }

  // 메모 충돌에서 고르지 않은 쪽을 남겨 둔다. reason: overwrite(밀려난 서버 쪽) · stash(화면이 맡긴 내 메모)
  function saveNotesRecovery(wid, notes, reason) {
    const body = { characters: notes.characters ?? '', world: notes.world ?? '', threads: notes.threads ?? '' };
    if (!body.characters && !body.world && !body.threads) return null;
    const at = stamp();
    const key = `${at.replace(/[-:.]/g, '')}-${reason}-${crypto.randomBytes(2).toString('hex')}`;
    writeJsonAtomic(path.join(workDir(wid), 'notes-recovery', `${key}.json`), { at, reason, ...body }, { exclusive: true });
    return key;
  }

  function stashNotes(wid, input) {
    getWork(wid);
    return {
      key: saveNotesRecovery(
        wid,
        {
          characters: assertText(input?.characters ?? '', LIMITS.noteChars, '인물 메모'),
          world: assertText(input?.world ?? '', LIMITS.noteChars, '설정 메모'),
          threads: assertText(input?.threads ?? '', LIMITS.noteChars, '복선 메모'),
        },
        'stash',
      ),
    };
  }

  function listNotesRecovery(wid) {
    getWork(wid);
    let names = [];
    try {
      names = fs.readdirSync(path.join(workDir(wid), 'notes-recovery')).filter((n) => n.endsWith('.json')).sort();
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    return names.map((n) => readJson(path.join(workDir(wid), 'notes-recovery', n))).filter(Boolean).reverse();
  }

  function putNotes(wid, input) {
    const cur = getNotes(wid);
    const baseRev = assertRev(input?.baseRev);
    if (baseRev !== cur.rev) throw new StoreError(409, 'conflict', '메모가 다른 곳에서 고쳐졌습니다.', { current: cur });
    if (input.keepPrevious) saveNotesRecovery(wid, cur, 'overwrite');
    const next = {
      rev: cur.rev + 1,
      characters: assertText(input.characters ?? '', LIMITS.noteChars, '인물 메모'),
      world: assertText(input.world ?? '', LIMITS.noteChars, '설정 메모'),
      threads: assertText(input.threads ?? '', LIMITS.noteChars, '복선 메모'),
      updatedAt: stamp(),
    };
    writeJsonAtomic(path.join(workDir(wid), 'notes.json'), next);
    return { rev: next.rev, updatedAt: next.updatedAt };
  }

  /*
   * 작품 연결 지도. 작가가 직접 만든 카드와, 두 카드 사이의 이름 붙은 연결만 담는다.
   * 본문이나 자유 메모를 읽어 만들지 않는다. 회차는 기존 원고 ID로만 가리킨다.
   */
  const EMPTY_MAP = { rev: 0, cards: [], links: [], updatedAt: null };
  const mapFile = (wid) => path.join(workDir(wid), 'map.json');

  function getMap(wid) {
    getWork(wid);
    return readJson(mapFile(wid)) ?? EMPTY_MAP;
  }

  function cleanMap(wid, input) {
    const work = getWork(wid);
    // 뺀 회차도 가리킬 수 있다. 빼도 연결은 남고, 되돌리면 다시 쓴다.
    const docIds = new Set([...work.docs, ...(work.removed ?? [])].map((d) => d.id));
    if (!Array.isArray(input?.cards) || !Array.isArray(input?.links)) throw bad('지도 형식이 맞지 않습니다.');
    if (input.cards.length > LIMITS.mapCards || input.links.length > LIMITS.mapLinks) throw bad('지도가 너무 큽니다.');
    const cardIds = new Set();
    const cards = input.cards.map((c) => {
      if (!c || typeof c !== 'object') throw bad('카드 형식이 맞지 않습니다.');
      const id = assertId(c.id, '카드');
      if (cardIds.has(id)) throw bad('같은 카드 ID가 두 번 나옵니다.');
      cardIds.add(id);
      if (!CARD_KINDS.includes(c.kind)) throw bad('카드 종류가 맞지 않습니다.');
      if (!Array.isArray(c.docIds ?? [])) throw bad('카드의 회차 연결 형식이 맞지 않습니다.');
      const linked = [...new Set((c.docIds ?? []).map((d) => assertId(d, '원고')))];
      for (const d of linked) if (!docIds.has(d)) throw bad('이 작품에 없는 회차를 가리키는 카드가 있습니다.');
      return {
        id,
        kind: c.kind,
        title: assertText(c.title ?? '', LIMITS.title, '카드 이름'),
        note: assertText(c.note ?? '', LIMITS.cardNote, '카드 메모'),
        source: assertText(c.source ?? '', LIMITS.cardSource, '출처'),
        docIds: linked,
      };
    });
    const linkIds = new Set();
    const links = input.links.map((l) => {
      if (!l || typeof l !== 'object') throw bad('연결 형식이 맞지 않습니다.');
      const id = assertId(l.id, '연결');
      if (linkIds.has(id)) throw bad('같은 연결 ID가 두 번 나옵니다.');
      linkIds.add(id);
      const from = assertId(l.from, '카드');
      const to = assertId(l.to, '카드');
      if (!cardIds.has(from) || !cardIds.has(to)) throw bad('없는 카드를 잇는 연결이 있습니다.');
      if (from === to) throw bad('카드를 자기 자신과 이을 수는 없습니다.');
      return { id, from, to, label: assertText(l.label ?? '', LIMITS.label, '연결 이름') };
    });
    return { cards, links };
  }

  // reason: overwrite(밀려난 서버 쪽) · stash(화면이 맡긴 내 지도)
  function saveMapRecovery(wid, map, reason) {
    if (!map.cards.length && !map.links.length) return null;
    const at = stamp();
    const key = `${at.replace(/[-:.]/g, '')}-${reason}-${crypto.randomBytes(2).toString('hex')}`;
    writeJsonAtomic(path.join(workDir(wid), 'map-recovery', `${key}.json`), { at, reason, cards: map.cards, links: map.links }, { exclusive: true });
    return key;
  }

  function putMap(wid, input) {
    const cur = getMap(wid);
    const baseRev = assertRev(input?.baseRev);
    if (baseRev !== cur.rev) throw new StoreError(409, 'conflict', '연결 지도가 다른 곳에서 고쳐졌습니다.', { current: cur });
    const body = cleanMap(wid, input);
    if (input.keepPrevious) saveMapRecovery(wid, cur, 'overwrite');
    const next = { rev: cur.rev + 1, ...body, updatedAt: stamp() };
    writeJsonAtomic(mapFile(wid), next);
    return { rev: next.rev, updatedAt: next.updatedAt };
  }

  function stashMap(wid, input) {
    return { key: saveMapRecovery(wid, cleanMap(wid, input), 'stash') };
  }

  function listMapRecovery(wid) {
    getWork(wid);
    const dir = path.join(workDir(wid), 'map-recovery');
    let names = [];
    try {
      names = fs.readdirSync(dir).filter((n) => n.endsWith('.json')).sort();
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    return names.map((n) => readJson(path.join(dir, n))).filter(Boolean).reverse();
  }

  /*
   * 작품 안에서 찾기. 목록에 있는 회차의 제목과 본문에서 낱말을 찾아, 회차 순서대로 돌려준다.
   * 대소문자는 가리지 않는다. 저장된 글만 본다(화면에서 아직 저장하지 않은 글은 화면이 따로 본다).
   * 카드(이름·메모·출처)는 화면이 지도에서 직접 찾는다.
   */
  function searchWork(wid, input) {
    const work = getWork(wid);
    const q = assertText(input?.q ?? '', LIMITS.searchQuery, '찾을 말').trim();
    if (!q) throw bad('찾을 말을 적어 주세요.');
    const docs = [];
    for (const d of work.docs) {
      const text = (readJson(sceneFile(wid, d.id)) ?? { text: '' }).text;
      const hit = findInText(text, q);
      const titleHit = d.title.toLowerCase().includes(q.toLowerCase());
      if (hit.count || titleHit) docs.push({ id: d.id, title: d.title, titleHit, ...hit });
    }
    return { q, docs };
  }

  return {
    root,
    searchWork,
    getMap,
    putMap,
    stashMap,
    listMapRecovery,
    listWorks,
    createWork,
    getWork,
    putWork,
    getLast,
    putLast,
    getScene,
    putScene,
    stashRecovery,
    listRecovery,
    getRecovery,
    listVersions,
    getVersion,
    createVersion,
    restoreScene,
    getNotes,
    putNotes,
    stashNotes,
    listNotesRecovery,
  };
}
