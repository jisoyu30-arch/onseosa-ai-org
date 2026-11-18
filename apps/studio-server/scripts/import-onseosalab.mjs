import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

/*
 * 기존 집필실(OnseosaLab)의 current-project.json → 새 집필실 구조. 지금은 모의 실행만 한다.
 *
 *   node scripts/import-onseosalab.mjs --input=<복사본 경로>
 *
 * - 원본을 직접 읽지 않는다. 복사본을 만들어 그 경로를 준다. 원래 폴더 안의 파일을 주면 멈춘다.
 * - 아무것도 쓰지 않는다. 무엇이 어떻게 옮겨질지 개수·글자 수·해시(지문)만 보고한다.
 * - 본문은 출력하지 않는다. 제목은 --show-titles 를 줄 때만 보여 준다.
 *
 * 옮기는 규칙 (코드로 확인한 기존 형식 기준):
 *   works[]  → 작품. 바이블·인물·회차 설계 글은 메모(설정·인물·복선 칸)로.
 *   scenes[] → 원고. 기존 장면 하나가 원고 한 편이 된다. workId 로 작품에 붙이고, 배열 순서를 그대로 쓴다.
 *   장면을 합치거나 나누지 않는다. 제목으로 회차를 추측하지 않는다.
 *   소설이 아닌 유형(outputType)의 장면은 옮기지 않고 세기만 한다.
 */

const ID = /^[a-z0-9][a-z0-9-]{0,39}$/;
const NOVEL_TYPES = new Set(['webnovel', 'novel', '']);
const sha = (text) => crypto.createHash('sha256').update(text, 'utf8').digest('hex');

export function planImport(raw) {
  const state = raw && typeof raw === 'object' && raw.state && Array.isArray(raw.state.scenes) ? raw.state : raw;
  if (!state || !Array.isArray(state.scenes)) throw new Error('scenes 배열을 찾지 못했습니다. 기존 집필실의 프로젝트 파일이 맞는지 확인해 주세요.');
  const works = Array.isArray(state.works) ? state.works : [];
  const plan = { works: [], skipped: [], orphans: [], totals: { scenes: 0, chars: 0, skipped: 0 } };
  const byWork = new Map(works.map((w) => [w.id, { source: w, scenes: [] }]));
  const used = new Set();
  const safeId = (legacy, prefix) => {
    let id = typeof legacy === 'string' && ID.test(legacy) && !used.has(legacy) ? legacy : `${prefix}-${sha(String(legacy) + used.size).slice(0, 12)}`;
    while (used.has(id)) id = `${prefix}-${sha(id).slice(0, 12)}`;
    used.add(id);
    return id;
  };

  state.scenes.forEach((scene, index) => {
    const text = typeof scene.content === 'string' ? scene.content : '';
    const type = scene.outputType ?? '';
    const item = { legacyId: scene.id, index, title: scene.title ?? '', type, chars: text.length, sha256: sha(text), text };
    if (!NOVEL_TYPES.has(type)) return plan.skipped.push(item);
    const home = byWork.get(scene.workId);
    if (!home) return plan.orphans.push(item);
    home.scenes.push(item);
  });

  for (const [legacyId, { source, scenes }] of byWork) {
    const notes = {
      world: source.storyBible ?? '',
      characters: source.characterSheet ?? '',
      threads: source.episodePlan ?? '',
    };
    plan.works.push({
      id: safeId(legacyId, 'w'),
      legacyId,
      title: source.title ?? '',
      notes,
      noteChars: { world: notes.world.length, characters: notes.characters.length, threads: notes.threads.length },
      // 메모 칸에 자리가 없는 값. 버리지 않고 legacy 로 그대로 싣는다.
      legacyKeys: Object.keys(source).filter((k) => !['id', 'title', 'storyBible', 'characterSheet', 'episodePlan'].includes(k)),
      docs: scenes.map((s) => ({ ...s, id: safeId(s.legacyId, 'd') })),
    });
    plan.totals.scenes += scenes.length;
    plan.totals.chars += scenes.reduce((n, s) => n + s.chars, 0);
  }
  plan.totals.skipped = plan.skipped.length;
  return plan;
}

// 옮긴 뒤에 원본과 같은지 견줄 때 쓰는 요약. 본문 없이 지문만 남긴다.
export function fingerprint(plan) {
  return plan.works.map((w) => ({
    work: w.legacyId,
    docs: w.docs.map((s) => ({ legacyId: s.legacyId, id: s.id, chars: s.chars, sha256: s.sha256 })),
  }));
}

function main() {
  const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
  const input = arg('input');
  const showTitles = process.argv.includes('--show-titles');
  if (!input) {
    console.error('사용법: node scripts/import-onseosalab.mjs --input=<current-project.json 의 복사본> [--show-titles]');
    process.exit(2);
  }
  const file = path.resolve(input);
  if (/[\\/]OnseosaLab[\\/]projects[\\/]/i.test(file)) {
    console.error('원본 폴더 안의 파일입니다. 다른 곳에 복사한 뒤 그 복사본 경로를 주세요. (원본은 읽지 않습니다.)');
    process.exit(2);
  }
  if (process.argv.includes('--write')) {
    console.error('실제로 옮기는 기능은 아직 없습니다. 지금은 모의 실행만 합니다.');
    process.exit(2);
  }
  const plan = planImport(JSON.parse(fs.readFileSync(file, 'utf8')));
  const name = (t) => (showTitles ? ` "${t}"` : '');
  console.log(`모의 실행 — 아무것도 쓰지 않았습니다.\n입력: ${file}\n`);
  console.log(`작품 ${plan.works.length}개 · 옮길 원고 ${plan.totals.scenes}편 · 본문 ${plan.totals.chars.toLocaleString()}자`);
  for (const w of plan.works) {
    const scenes = w.docs;
    console.log(`\n[작품]${name(w.title)} ${w.legacyId} → ${w.id}`);
    console.log(`  원고 ${scenes.length}편 · ${scenes.reduce((n, s) => n + s.chars, 0).toLocaleString()}자`);
    console.log(`  메모로 옮길 글: 설정 ${w.noteChars.world.toLocaleString()}자 · 인물 ${w.noteChars.characters.toLocaleString()}자 · 복선(회차 설계) ${w.noteChars.threads.toLocaleString()}자`);
    if (w.legacyKeys.length) console.log(`  그대로 보존할 나머지 항목: ${w.legacyKeys.join(', ')}`);
    scenes.forEach((s, i) => console.log(`  ${String(i + 1).padStart(3)}.${name(s.title)} ${s.chars.toLocaleString()}자 · ${s.sha256.slice(0, 12)} · ${s.legacyId === s.id ? 'ID 유지' : `ID ${s.legacyId} → ${s.id}`}`));
  }
  if (plan.skipped.length) {
    const byType = {};
    for (const s of plan.skipped) byType[s.type] = (byType[s.type] ?? 0) + 1;
    console.log(`\n옮기지 않는 장면(소설 외 유형) ${plan.skipped.length}개: ${Object.entries(byType).map(([t, n]) => `${t} ${n}`).join(', ')}`);
  }
  if (plan.orphans.length) console.log(`\n작품을 찾지 못한 장면 ${plan.orphans.length}개 — 옮기기 전에 어디에 둘지 정해야 합니다.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
