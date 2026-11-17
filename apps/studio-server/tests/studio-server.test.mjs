import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createStudioServer } from '../src/server.mjs';

// 임시 폴더에 서버를 띄워 실제 HTTP로 시험한다. 실제 원고 폴더는 건드리지 않는다.
async function boot() {
  const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-test-'));
  const app = createStudioServer({ dataRoot, uiPorts: [5173] });
  const port = await app.listen(0);
  const base = `http://127.0.0.1:${port}/api/studio`;
  const call = async (method, url, body, headers = {}) => {
    const res = await fetch(base + url, {
      method,
      headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return { status: res.status, body: await res.json(), headers: res.headers };
  };
  const stop = async () => {
    await app.close();
    fs.rmSync(dataRoot, { recursive: true, force: true });
  };
  return { call, stop, dataRoot, port };
}

async function newWork(call) {
  const { body } = await call('POST', '/works', { title: '시험 작품' });
  const work = body.work;
  return { work, wid: work.id, sid: work.docs[0].id };
}

test('작품을 만들고 원고를 저장하면 rev가 오른다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid, sid } = await newWork(call);
    const empty = await call('GET', `/works/${wid}/docs/${sid}`);
    assert.equal(empty.body.scene.rev, 0);
    const a = await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '첫 문장.' });
    assert.equal(a.status, 200);
    assert.equal(a.body.rev, 1);
    const b = await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 1, text: '첫 문장. 둘째 문장.' });
    assert.equal(b.body.rev, 2);
    const got = await call('GET', `/works/${wid}/docs/${sid}`);
    assert.equal(got.body.scene.text, '첫 문장. 둘째 문장.');
    assert.equal((await call('GET', '/works')).body.works.length, 1);
  } finally {
    await stop();
  }
});

test('오래된 rev로 저장하면 거절하고, 서버 내용은 그대로다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid, sid } = await newWork(call);
    await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '탭 A의 글' });
    const late = await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '탭 B의 글' });
    assert.equal(late.status, 409);
    assert.equal(late.body.code, 'conflict');
    assert.equal(late.body.current.text, '탭 A의 글');
    assert.equal(late.body.current.rev, 1);
    const got = await call('GET', `/works/${wid}/docs/${sid}`);
    assert.equal(got.body.scene.text, '탭 A의 글');
  } finally {
    await stop();
  }
});

test('충돌 뒤 내 글로 덮어쓰면 밀려난 글이 복구본에 남는다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid, sid } = await newWork(call);
    await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '탭 A의 글' });
    const forced = await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 1, text: '탭 B의 글', keepPrevious: true });
    assert.equal(forced.status, 200);
    const list = (await call('GET', `/works/${wid}/docs/${sid}/recovery`)).body.recovery;
    const kept = list.find((r) => r.reason === 'overwrite');
    assert.ok(kept);
    const item = (await call('GET', `/works/${wid}/docs/${sid}/recovery/${kept.key}`)).body.item;
    assert.equal(item.text, '탭 A의 글');
  } finally {
    await stop();
  }
});

test('판은 여러 개 남고 서로 다르며, 나중 판이 앞 판을 덮지 않는다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid, sid } = await newWork(call);
    await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '초고' });
    const v1 = await call('POST', `/works/${wid}/docs/${sid}/versions`, { baseRev: 1, label: '초고' });
    assert.equal(v1.body.version.n, 1);
    const same = await call('POST', `/works/${wid}/docs/${sid}/versions`, { baseRev: 1, label: '또' });
    assert.equal(same.body.version.unchanged, true);
    await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 1, text: '퇴고본' });
    const v2 = await call('POST', `/works/${wid}/docs/${sid}/versions`, { baseRev: 2, label: '퇴고' });
    assert.equal(v2.body.version.n, 2);
    const list = (await call('GET', `/works/${wid}/docs/${sid}/versions`)).body.versions;
    assert.deepEqual(list.map((v) => v.n), [2, 1]);
    assert.equal((await call('GET', `/works/${wid}/docs/${sid}/versions/1`)).body.version.text, '초고');
    assert.equal((await call('GET', `/works/${wid}/docs/${sid}/versions/2`)).body.version.text, '퇴고본');
    const stale = await call('POST', `/works/${wid}/docs/${sid}/versions`, { baseRev: 1, label: '옛 rev' });
    assert.equal(stale.status, 409);
  } finally {
    await stop();
  }
});

test('이전 판으로 되돌려도 되돌리기 직전 내용을 되찾을 수 있다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid, sid } = await newWork(call);
    await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '초고' });
    await call('POST', `/works/${wid}/docs/${sid}/versions`, { baseRev: 1, label: '초고' });
    await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 1, text: '한참 더 쓴 글' });
    const restored = await call('POST', `/works/${wid}/docs/${sid}/restore`, { baseRev: 2, from: { kind: 'version', n: 1 } });
    assert.equal(restored.body.scene.text, '초고');
    assert.equal(restored.body.scene.rev, 3);
    const list = (await call('GET', `/works/${wid}/docs/${sid}/recovery`)).body.recovery;
    const before = list.find((r) => r.reason === 'restore');
    assert.ok(before);
    const back = await call('POST', `/works/${wid}/docs/${sid}/restore`, { baseRev: 3, from: { kind: 'recovery', key: before.key } });
    assert.equal(back.body.scene.text, '한참 더 쓴 글');
    assert.equal((await call('GET', `/works/${wid}/docs/${sid}/versions/1`)).body.version.text, '초고');
  } finally {
    await stop();
  }
});

test('목차는 rev를 비교하고, 형식이 틀리면 받지 않는다', async () => {
  const { call, stop } = await boot();
  try {
    const { work, wid } = await newWork(call);
    const docs = [...work.docs, { id: 'd-new', title: '2화' }];
    const ok = await call('PUT', `/works/${wid}`, { baseRev: 1, title: work.title, docs });
    assert.equal(ok.body.work.rev, 2);
    assert.equal((await call('PUT', `/works/${wid}`, { baseRev: 1, title: work.title, docs })).status, 409);
    const dup = [{ id: 'd-x', title: '' }, { id: 'd-x', title: '' }];
    assert.equal((await call('PUT', `/works/${wid}`, { baseRev: 2, title: work.title, docs: dup })).status, 400);
    assert.equal((await call('PUT', `/works/${wid}`, { baseRev: 2, title: work.title, docs: [{ id: '../x' }] })).status, 400);
    assert.equal((await call('PUT', `/works/${wid}`, { baseRev: 2, title: work.title, docs: [] })).status, 400);
    // 목차에 새로 넣은 장면은 파일이 없어도 빈 장면으로 읽힌다.
    assert.equal((await call('GET', `/works/${wid}/docs/d-new`)).body.scene.rev, 0);
    assert.equal((await call('GET', `/works/${wid}/docs/d-none`)).status, 404);
  } finally {
    await stop();
  }
});

test('잘못된 요청은 받지 않는다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid, sid } = await newWork(call);
    assert.equal((await call('PUT', `/works/${wid}/docs/${sid}`, { text: 'rev 없음' })).status, 400);
    assert.equal((await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: 123 })).status, 400);
    assert.equal((await call('GET', `/works/..%2F..%2Fx/docs/${sid}`)).status, 400);
    assert.equal((await call('GET', '/works/w-none')).status, 404);
  } finally {
    await stop();
  }
});

test('다른 사이트에서 온 요청은 거절하고, CORS 허용 응답을 내지 않는다', async () => {
  const { call, stop, port } = await boot();
  try {
    const { wid, sid } = await newWork(call);
    const evil = await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '침입' }, { Origin: 'https://evil.example' });
    assert.equal(evil.status, 403);
    const read = await call('GET', `/works/${wid}/docs/${sid}`, undefined, { Origin: 'https://evil.example' });
    assert.equal(read.status, 403);
    const cross = await call('GET', '/works', undefined, { 'Sec-Fetch-Site': 'cross-site' });
    assert.equal(cross.status, 403);
    const ok = await call('GET', '/works', undefined, { Origin: 'http://localhost:5173' });
    assert.equal(ok.status, 200);
    assert.equal(ok.headers.get('access-control-allow-origin'), null);
    // 다른 이름으로 이 PC를 가리키게 만든 주소(Host 위조)도 거절한다.
    const res = await new Promise((resolve, reject) => {
      import('node:http').then(({ default: http }) => {
        http.get({ host: '127.0.0.1', port, path: '/api/studio/works', headers: { Host: 'evil.example' } }, (r) => resolve(r.statusCode)).on('error', reject);
      });
    });
    assert.equal(res, 403);
    const form = await fetch(`http://127.0.0.1:${port}/api/studio/works`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: '{"title":"x"}' });
    assert.equal(form.status, 415);
    assert.equal((await call('GET', `/works/${wid}/docs/${sid}`)).body.scene.text, '');
  } finally {
    await stop();
  }
});

test('제목 없이도 작품이 만들어진다', async () => {
  const { call, stop } = await boot();
  try {
    const made = await call('POST', '/works', {});
    assert.equal(made.status, 200);
    assert.equal(made.body.work.title, '제목 없는 작품');
    assert.equal(made.body.work.docs.length, 1);
  } finally {
    await stop();
  }
});

test('메모와 마지막 위치를 저장한다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid, sid } = await newWork(call);
    const n1 = await call('PUT', `/works/${wid}/notes`, { baseRev: 0, characters: '정순', world: '', threads: '' });
    assert.equal(n1.body.rev, 1);
    assert.equal((await call('PUT', `/works/${wid}/notes`, { baseRev: 0, characters: 'x', world: '', threads: '' })).status, 409);
    assert.equal((await call('GET', `/works/${wid}/notes`)).body.notes.characters, '정순');
    await call('PUT', `/works/${wid}/last`, { docId: sid, caret: 12, scroll: 340 });
    const got = await call('GET', `/works/${wid}`);
    assert.equal(got.body.last.caret, 12);
    assert.equal(got.body.last.docId, sid);
  } finally {
    await stop();
  }
});

test('깨진 원고 파일 위에는 덮어쓰지 않는다', async () => {
  const { call, stop, dataRoot } = await boot();
  try {
    const { wid, sid } = await newWork(call);
    await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '멀쩡한 글' });
    const file = path.join(dataRoot, 'works', wid, 'docs', `${sid}.json`);
    fs.writeFileSync(file, '{ 깨짐');
    assert.equal((await call('GET', `/works/${wid}/docs/${sid}`)).status, 500);
    assert.equal((await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '덮어쓰기' })).status, 500);
    assert.equal(fs.readFileSync(file, 'utf8'), '{ 깨짐');
  } finally {
    await stop();
  }
});

test('목록에서 뺀 원고는 사라지지 않고, 되돌릴 수 있다', async () => {
  const { call, stop } = await boot();
  try {
    const { work, wid, sid } = await newWork(call);
    await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '뺄 원고의 글' });
    await call('POST', `/works/${wid}/docs/${sid}/versions`, { baseRev: 1, label: '초고' });
    const two = [...work.docs, { id: 'd-two', title: '2화' }];
    await call('PUT', `/works/${wid}`, { baseRev: 1, title: work.title, docs: two });
    // 어디에도 남기지 않고 없애는 요청은 거절한다.
    const vanish = await call('PUT', `/works/${wid}`, { baseRev: 2, title: work.title, docs: [two[1]] });
    assert.equal(vanish.status, 400);
    const out = await call('PUT', `/works/${wid}`, { baseRev: 2, title: work.title, docs: [two[1]], removed: [two[0]] });
    assert.equal(out.status, 200);
    assert.equal(out.body.work.removed[0].id, sid);
    assert.ok(out.body.work.removed[0].removedAt);
    // 뺀 뒤에도 본문과 판을 읽을 수 있다.
    assert.equal((await call('GET', `/works/${wid}/docs/${sid}`)).body.scene.text, '뺄 원고의 글');
    assert.equal((await call('GET', `/works/${wid}/docs/${sid}/versions`)).body.versions.length, 1);
    // 뺀 목록에서도 없앨 수 없다.
    assert.equal((await call('PUT', `/works/${wid}`, { baseRev: 3, title: work.title, docs: [two[1]], removed: [] })).status, 400);
    const back = await call('PUT', `/works/${wid}`, { baseRev: 3, title: work.title, docs: [two[1], two[0]], removed: [] });
    assert.equal(back.status, 200);
    assert.deepEqual(back.body.work.docs.map((d) => d.id), ['d-two', sid]);
    assert.equal((await call('GET', `/works/${wid}/docs/${sid}`)).body.scene.text, '뺄 원고의 글');
  } finally {
    await stop();
  }
});

test('메모 충돌에서 고르지 않은 쪽도 남는다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid } = await newWork(call);
    await call('PUT', `/works/${wid}/notes`, { baseRev: 0, characters: '다른 탭의 인물', world: '다른 탭의 설정', threads: '' });
    // 내 메모로 덮어쓴다 → 밀려난 서버 쪽이 남는다.
    const mine = await call('PUT', `/works/${wid}/notes`, { baseRev: 1, characters: '내 인물', world: '', threads: '', keepPrevious: true });
    assert.equal(mine.status, 200);
    // 다른 곳의 메모를 쓰기로 했다 → 화면이 내 메모를 맡긴다.
    await call('POST', `/works/${wid}/notes/recovery`, { characters: '버려질 뻔한 내 메모', world: '', threads: '' });
    const list = (await call('GET', `/works/${wid}/notes/recovery`)).body.recovery;
    assert.equal(list.find((r) => r.reason === 'overwrite').world, '다른 탭의 설정');
    assert.equal(list.find((r) => r.reason === 'stash').characters, '버려질 뻔한 내 메모');
  } finally {
    await stop();
  }
});

test('자동 복구본을 정리해도 충돌·복원 때 남긴 것은 지우지 않는다', async () => {
  const { createStore, LIMITS } = await import('../src/store.mjs');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-prune-'));
  try {
    let clock = Date.parse('2026-01-01T00:00:00Z');
    const store = createStore(root, { now: () => new Date(clock) });
    const work = store.createWork({ title: '정리 시험' });
    const did = work.docs[0].id;
    store.putScene(work.id, did, { baseRev: 0, text: '상대 탭의 글' });
    store.putScene(work.id, did, { baseRev: 1, text: '내 글 0', keepPrevious: true });
    for (let i = 1; i <= LIMITS.recoveryKeep + 15; i++) {
      clock += LIMITS.recoveryGapMs + 1000;
      store.putScene(work.id, did, { baseRev: i + 1, text: `내 글 ${i}` });
    }
    const list = store.listRecovery(work.id, did);
    assert.equal(list.filter((r) => r.reason === 'auto').length, LIMITS.recoveryKeep);
    const kept = list.find((r) => r.reason === 'overwrite');
    assert.ok(kept);
    assert.equal(store.getRecovery(work.id, did, kept.key).text, '상대 탭의 글');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

// ── 연결 지도 ──────────────────────────────────────────────────────────────

test('연결 지도: 카드와 이름 붙은 연결을 저장하고, rev가 다르면 거절한다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid, sid } = await newWork(call);
    assert.deepEqual((await call('GET', `/works/${wid}/map`)).body.map.cards, []);
    const cards = [
      { id: 'c-a', kind: 'person', title: '해원', note: '', source: '', docIds: [] },
      { id: 'c-b', kind: 'person', title: '도윤', note: '', source: '', docIds: [] },
      { id: 'c-e', kind: 'event', title: '정전 사건', note: '', source: '', docIds: [sid] },
      { id: 'c-s1', kind: 'source', title: '당직 일지', note: '3쪽', source: '관리사무소 보관', docIds: [] },
      { id: 'c-s2', kind: 'source', title: '배전표 정정본', note: '', source: '', docIds: [] },
    ];
    const links = [
      { id: 'l-1', from: 'c-a', to: 'c-b', label: '남매' },
      { id: 'l-2', from: 'c-a', to: 'c-e', label: '목격했다' },
      { id: 'l-3', from: 'c-s1', to: 'c-s2', label: '서로 어긋난다' },
    ];
    const saved = await call('PUT', `/works/${wid}/map`, { baseRev: 0, cards, links });
    assert.equal(saved.status, 200);
    assert.equal(saved.body.rev, 1);
    const got = (await call('GET', `/works/${wid}/map`)).body.map;
    assert.deepEqual(got.links.map((l) => l.label), ['남매', '목격했다', '서로 어긋난다']);
    assert.equal(got.cards.find((c) => c.id === 'c-s1').source, '관리사무소 보관');
    // 이름을 바꿔도 ID로 이어져 있어 연결이 끊기지 않는다.
    const renamed = cards.map((c) => (c.id === 'c-a' ? { ...c, title: '서해원' } : c));
    assert.equal((await call('PUT', `/works/${wid}/map`, { baseRev: 1, cards: renamed, links })).status, 200);
    const after = (await call('GET', `/works/${wid}/map`)).body.map;
    assert.equal(after.links.length, 3);
    assert.equal(after.cards.find((c) => c.id === after.links[0].from).title, '서해원');
    // 오래된 rev
    const late = await call('PUT', `/works/${wid}/map`, { baseRev: 1, cards: [], links: [] });
    assert.equal(late.status, 409);
    assert.equal(late.body.current.cards.length, 5);
  } finally {
    await stop();
  }
});

test('연결 지도: 형식이 틀리거나 다른 작품의 회차를 가리키면 받지 않는다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid } = await newWork(call);
    const other = await newWork(call);
    const card = (extra) => ({ id: 'c-a', kind: 'person', title: '해원', note: '', source: '', docIds: [], ...extra });
    const put = (cards, links = []) => call('PUT', `/works/${wid}/map`, { baseRev: 0, cards, links });
    assert.equal((await put([card({ kind: 'robot' })])).status, 400);
    assert.equal((await put([card({ docIds: [other.sid] })])).status, 400);
    assert.equal((await put([card({ docIds: ['d-none'] })])).status, 400);
    assert.equal((await put([card()], [{ id: 'l-1', from: 'c-a', to: 'c-zz', label: '없는 카드' }])).status, 400);
    assert.equal((await put([card()], [{ id: 'l-1', from: 'c-a', to: 'c-a', label: '자기 자신' }])).status, 400);
    assert.equal((await put([card(), card()])).status, 400);
    assert.equal((await call('GET', `/works/${wid}/map`)).body.map.rev, 0);
    // 다른 작품의 지도와 섞이지 않는다.
    assert.equal((await put([card()])).status, 200);
    assert.deepEqual((await call('GET', `/works/${other.wid}/map`)).body.map.cards, []);
  } finally {
    await stop();
  }
});

test('연결 지도: 회차를 목록에서 빼도 연결은 남고, 충돌에서 고르지 않은 쪽도 남는다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid, sid, work } = await newWork(call);
    await call('PUT', `/works/${wid}`, { baseRev: work.rev, title: work.title, docs: [...work.docs, { id: 'd-two', title: '2화' }], removed: [] });
    const cards = [{ id: 'c-e', kind: 'event', title: '정전 사건', note: '', source: '', docIds: ['d-two'] }];
    await call('PUT', `/works/${wid}/map`, { baseRev: 0, cards, links: [] });
    await call('PUT', `/works/${wid}`, { baseRev: work.rev + 1, title: work.title, docs: [{ id: sid, title: '1화' }], removed: [{ id: 'd-two', title: '2화' }] });
    // 뺀 뒤에도 그 회차를 가리키는 지도를 다시 저장할 수 있다.
    const again = await call('PUT', `/works/${wid}/map`, { baseRev: 1, cards: [{ ...cards[0], note: '빼도 남는다' }], links: [] });
    assert.equal(again.status, 200);
    assert.deepEqual((await call('GET', `/works/${wid}/map`)).body.map.cards[0].docIds, ['d-two']);
    // 충돌: 내 지도로 덮으면 밀려난 쪽이, 다른 곳의 지도를 쓰면 내 쪽이 남는다.
    await call('PUT', `/works/${wid}/map`, { baseRev: 2, cards: [{ ...cards[0], title: '내 쪽 이름' }], links: [], keepPrevious: true });
    await call('POST', `/works/${wid}/map/recovery`, { cards: [{ ...cards[0], title: '버려질 뻔한 카드' }], links: [] });
    const list = (await call('GET', `/works/${wid}/map/recovery`)).body.recovery;
    assert.equal(list.find((r) => r.reason === 'overwrite').cards[0].note, '빼도 남는다');
    assert.equal(list.find((r) => r.reason === 'stash').cards[0].title, '버려질 뻔한 카드');
  } finally {
    await stop();
  }
});

// ── 백업과 복원 ────────────────────────────────────────────────────────────

test('백업: 원고 폴더 밖에 한 벌을 쓰고, 새 빈 폴더에 복원하면 원본과 같다', async () => {
  const { createStudioServer: make } = await import('../src/server.mjs');
  const { compareWork, restoreBackup, checkBundle } = await import('../src/backup.mjs');
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-backup-'));
  const dataRoot = path.join(base, 'data');
  const backupRoot = path.join(base, 'backups');
  const app = make({ dataRoot, backupRoot, uiPorts: [5173] });
  const port = await app.listen(0);
  const call = async (method, url, body) => {
    const res = await fetch(`http://127.0.0.1:${port}/api/studio${url}`, { method, headers: { 'Content-Type': 'application/json' }, body: body !== undefined ? JSON.stringify(body) : method === 'GET' ? undefined : '{}' });
    return { status: res.status, body: await res.json() };
  };
  try {
    const { wid, sid, work } = await newWork(call);
    await call('PUT', `/works/${wid}`, { baseRev: work.rev, title: '백업 시험 작품', docs: [{ id: 'd-two', title: '2화' }, { id: sid, title: '1화' }, { id: 'd-three', title: '3화' }], removed: [] });
    await call('PUT', `/works/${wid}`, { baseRev: work.rev + 1, title: '백업 시험 작품', docs: [{ id: 'd-two', title: '2화' }, { id: sid, title: '1화' }], removed: [{ id: 'd-three', title: '3화' }] });
    await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '첫 회차.\n\n둘째 문단 — “따옴표”와 한글.' });
    await call('POST', `/works/${wid}/docs/${sid}/versions`, { baseRev: 1, label: '초고' });
    await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 1, text: '첫 회차를 고쳤다.', keepPrevious: true });
    await call('PUT', `/works/${wid}/docs/d-two`, { baseRev: 0, text: '둘째 회차.' });
    await call('PUT', `/works/${wid}/docs/d-three`, { baseRev: 0, text: '빼 둔 셋째 회차.' });
    await call('PUT', `/works/${wid}/notes`, { baseRev: 0, characters: '해원', world: '항구 도시', threads: '배전표' });
    await call('PUT', `/works/${wid}/notes`, { baseRev: 1, characters: '해원, 도윤', world: '', threads: '', keepPrevious: true });
    await call('PUT', `/works/${wid}/last`, { docId: 'd-two', caret: 3, scroll: 0 });
    await call('PUT', `/works/${wid}/map`, { baseRev: 0, cards: [{ id: 'c-a', kind: 'person', title: '해원', docIds: ['d-two'] }, { id: 'c-b', kind: 'source', title: '당직 일지', source: '관리사무소' }], links: [{ id: 'l-1', from: 'c-a', to: 'c-b', label: '썼다' }] });

    const made = await call('POST', `/works/${wid}/backup`);
    assert.equal(made.status, 200);
    const info = made.body.backup;
    assert.ok(path.relative(dataRoot, info.file).startsWith('..'), '백업은 원고 폴더 밖에 있어야 한다');
    assert.deepEqual({ docs: info.counts.docs, removed: info.counts.removed, versions: info.counts.versions, cards: info.counts.cards, links: info.counts.links }, { docs: 2, removed: 1, versions: 1, cards: 2, links: 1 });
    assert.ok(info.counts.recovery >= 1 && info.counts.notesRecovery === 1 && info.counts.docFiles === 3);

    const bundle = checkBundle(JSON.parse(fs.readFileSync(info.file, 'utf8')));
    const target = path.join(base, 'restored');
    restoreBackup(bundle, target);
    const report = compareWork(dataRoot, target, wid);
    assert.deepEqual(report.differences, []);
    assert.ok(report.same && report.sameOrder);
    // 복원본을 저장 서버로 열어도 같은 순서·본문이 보인다.
    const { createStore } = await import('../src/store.mjs');
    const restored = createStore(target);
    assert.deepEqual(restored.getWork(wid).docs.map((d) => d.id), ['d-two', sid]);
    assert.equal(restored.getScene(wid, 'd-three').text, '빼 둔 셋째 회차.');
    assert.equal(restored.getMap(wid).links[0].label, '썼다');
    // 이미 무언가 있는 폴더에는 복원하지 않는다.
    assert.throws(() => restoreBackup(bundle, target), /비어 있지 않습니다/);
    // 손상된 백업은 복원하지 않는다.
    const broken = JSON.parse(JSON.stringify(bundle));
    broken.files[`docs/${sid}.json`].text = '몰래 바뀐 글';
    assert.throws(() => restoreBackup(broken, path.join(base, 'restored-2')), /손상/);
    // 원본이 그 뒤에 바뀌면 비교가 차이를 잡는다.
    await call('PUT', `/works/${wid}/docs/d-two`, { baseRev: 1, text: '백업 뒤에 고친 글.' });
    assert.equal(compareWork(dataRoot, target, wid).same, false);
  } finally {
    await app.close();
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('백업 폴더가 원고 폴더 안이면 서버를 만들지 않는다', async () => {
  const { createStudioServer: make } = await import('../src/server.mjs');
  const dataRoot = path.join(os.tmpdir(), 'studio-backup-inside');
  assert.throws(() => make({ dataRoot, backupRoot: path.join(dataRoot, 'backups') }), /밖에/);
  assert.throws(() => make({ dataRoot, backupRoot: dataRoot }), /밖에/);
});

test('찾기: 목록에 있는 회차의 제목·본문에서 찾아 회차 순서대로 돌려준다', async () => {
  const { call, stop } = await boot();
  try {
    const { wid, sid, work } = await newWork(call);
    const other = await newWork(call);
    await call('PUT', `/works/${other.wid}/docs/${other.sid}`, { baseRev: 0, text: '다른 작품의 정전.' });
    await call('PUT', `/works/${wid}`, { baseRev: work.rev, title: '찾기 시험', docs: [{ id: sid, title: '1화' }, { id: 'd-two', title: '2화 정전의 밤' }, { id: 'd-three', title: '3화' }], removed: [] });
    await call('PUT', `/works/${wid}`, { baseRev: work.rev + 1, title: '찾기 시험', docs: [{ id: 'd-two', title: '2화 정전의 밤' }, { id: sid, title: '1화' }], removed: [{ id: 'd-three', title: '3화' }] });
    await call('PUT', `/works/${wid}/docs/${sid}`, { baseRev: 0, text: '항구의 불이 꺼졌다.\n\n정전은 03시 10분에 시작됐다. 사람들은 정전을 오래 기억했다. Blackout 이라고 적힌 표.' });
    await call('PUT', `/works/${wid}/docs/d-two`, { baseRev: 0, text: '당직실 문은 반쯤 열려 있었다.' });
    await call('PUT', `/works/${wid}/docs/d-three`, { baseRev: 0, text: '빼 둔 회차의 정전.' });

    const r = await call('POST', `/works/${wid}/search`, { q: ' 정전 ' });
    assert.equal(r.status, 200);
    assert.equal(r.body.q, '정전');
    // 회차 순서(2화가 먼저), 뺀 회차와 다른 작품은 나오지 않는다.
    assert.deepEqual(r.body.docs.map((d) => [d.id, d.titleHit, d.count]), [['d-two', true, 0], [sid, false, 2]]);
    const first = r.body.docs[1].snippets[0];
    assert.equal(first.match, '정전');
    assert.ok(first.before.endsWith('꺼졌다. ') && !first.before.includes('\n') && first.after.startsWith('은 03시'));
    assert.equal(first.at, '항구의 불이 꺼졌다.\n\n'.length);
    // 대소문자를 가리지 않는다.
    assert.equal((await call('POST', `/works/${wid}/search`, { q: 'blackout' })).body.docs[0].snippets[0].match, 'Blackout');
    assert.deepEqual((await call('POST', `/works/${wid}/search`, { q: '없는말' })).body.docs, []);
    // 빈 말·너무 긴 말·없는 작품은 받지 않는다.
    assert.equal((await call('POST', `/works/${wid}/search`, { q: '  ' })).status, 400);
    assert.equal((await call('POST', `/works/${wid}/search`, { q: '가'.repeat(101) })).status, 400);
    assert.equal((await call('POST', '/works/w-none/search', { q: '정전' })).status, 404);
    // 찾기는 아무것도 고치지 않는다.
    assert.equal((await call('GET', `/works/${wid}/docs/${sid}`)).body.scene.rev, 1);
  } finally {
    await stop();
  }
});
