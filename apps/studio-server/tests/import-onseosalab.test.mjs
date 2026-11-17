import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { fingerprint, planImport } from '../scripts/import-onseosalab.mjs';

// 기존 집필실 형식을 흉내 낸 가상 자료. 실제 원고가 아니다.
const legacy = {
  savedAt: '2026-01-01T00:00:00.000Z',
  works: [
    { id: 'work-1', title: '가상 작품', storyBible: '설정 글', characterSheet: '인물 글', episodePlan: '회차 설계 글', storySeed: '씨앗', styleProfileId: 'p1' },
    { id: 'Work_2', title: '빈 작품' },
  ],
  scenes: [
    { id: 'scene-b', title: '둘째로 만든 장면', content: '나중에 만들었지만 배열에서는 먼저.', outputType: 'webnovel', workId: 'work-1' },
    { id: 'scene-a', title: '첫 장면', content: '한글 본문\n줄바꿈 포함.', outputType: 'webnovel', workId: 'work-1' },
    { id: 'blog-1', title: '블로그 글', content: '소설이 아님', outputType: 'blog', workId: 'work-1' },
    { id: 'lost', title: '주인 없는 장면', content: '작품이 지워짐', outputType: 'webnovel', workId: 'gone' },
  ],
};

const sha = (t) => crypto.createHash('sha256').update(t, 'utf8').digest('hex');

test('개수·순서·본문 지문이 원본과 같다', () => {
  const plan = planImport(legacy);
  assert.equal(plan.works.length, 2);
  const scenes = plan.works[0].docs;
  assert.deepEqual(scenes.map((s) => s.legacyId), ['scene-b', 'scene-a']);
  for (const s of scenes) {
    const source = legacy.scenes.find((x) => x.id === s.legacyId);
    assert.equal(s.text, source.content);
    assert.equal(s.sha256, sha(source.content));
    assert.equal(s.chars, source.content.length);
  }
  assert.equal(plan.totals.scenes, 2);
  assert.equal(plan.totals.chars, legacy.scenes[0].content.length + legacy.scenes[1].content.length);
});

test('소설 외 유형과 주인 없는 장면은 옮기지 않고 따로 센다', () => {
  const plan = planImport(legacy);
  assert.deepEqual(plan.skipped.map((s) => s.legacyId), ['blog-1']);
  assert.deepEqual(plan.orphans.map((s) => s.legacyId), ['lost']);
});

test('기획 글은 메모로 가고, 자리가 없는 항목은 이름을 남긴다', () => {
  const [w] = planImport(legacy).works;
  assert.deepEqual(w.notes, { world: '설정 글', characters: '인물 글', threads: '회차 설계 글' });
  assert.deepEqual(w.legacyKeys.sort(), ['storySeed', 'styleProfileId']);
});

test('새 형식에 맞는 ID는 유지하고, 안 맞는 ID만 바꾼다', () => {
  const plan = planImport(legacy);
  assert.equal(plan.works[0].id, 'work-1');
  assert.notEqual(plan.works[1].id, 'Work_2');
  assert.match(plan.works[1].id, /^[a-z0-9][a-z0-9-]{0,39}$/);
  const ids = [...plan.works.map((w) => w.id), ...plan.works.flatMap((w) => w.docs.map((s) => s.id))];
  assert.equal(new Set(ids).size, ids.length);
});

test('{ state: … } 로 감싼 형식도 읽고, 지문 요약에는 본문이 없다', () => {
  const plan = planImport({ state: legacy });
  assert.equal(plan.totals.scenes, 2);
  assert.ok(!JSON.stringify(fingerprint(plan)).includes('한글 본문'));
});
