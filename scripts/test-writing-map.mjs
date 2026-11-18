import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

/*
 * 집필실 합격 시연: 원고 보존(충돌·목록 장애·내보내기·백업 복원), 작품 연결 지도 왕복,
 * 쓰던 회차에서 자료 찾기 → 지도 → 관련 회차 → 쓰던 곳으로(390·580·1280).
 *
 *   pnpm test:writing-map
 *   node scripts/test-writing-map.mjs --output=<결과 폴더>
 *
 * 새 임시 원고 폴더·검수용 화면(5197)·숨김 브라우저 프로필만 쓴다.
 * 실제 OnseosaData, 기존 OnseosaData-test, 다른 검수 화면은 건드리지 않는다.
 * 글은 모두 이 스크립트가 지어낸 샘플이다. 한글 조합 입력은 브라우저의 조합 이벤트를 흉내 낸 것이고,
 * 실제 OS 한글 입력기로 친 것은 아니다.
 */

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputArg = process.argv.find((x) => x.startsWith('--output='));
const out = outputArg ? path.resolve(outputArg.slice('--output='.length)) : fs.mkdtempSync(path.join(os.tmpdir(), 'writing-map-'));
fs.mkdirSync(out, { recursive: true });
const require = createRequire(`${repo}/apps/control-room/package.json`);
const { createServer } = await import(pathToFileURL(require.resolve('vite')));
const { createStudioServer } = await import(pathToFileURL(`${repo}/apps/studio-server/src/server.mjs`));
const { checkBundle, compareWork, restoreBackup } = await import(pathToFileURL(`${repo}/apps/studio-server/src/backup.mjs`));
const { createStore } = await import(pathToFileURL(`${repo}/apps/studio-server/src/store.mjs`));

const UI_PORT = 5197;
const dataRoot = fs.mkdtempSync(path.join(out, 'sample-data-'));
const backupRoot = fs.mkdtempSync(path.join(out, 'sample-backups-'));
const downloads = fs.mkdtempSync(path.join(out, 'downloads-'));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'writing-map-browser-'));
const results = [];
const errors = [];
const chaos = { docs: false, list: false, map: false, search: false, holdDocs: false, held: [], stashFail: false, stashDelay: 0, stashSeen: 0 };
let vite, api, browser, debugPort;
const connections = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const J = JSON.stringify;

function record(name, passed, details = {}) {
  const row = { name, passed: !!passed, ...details };
  results.push(row);
  console.log(J(row));
}

async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let seq = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject, timer } = pending.get(message.id);
      pending.delete(message.id); clearTimeout(timer);
      message.error ? reject(new Error(J(message.error))) : resolve(message.result);
    } else if (message.method === 'Page.javascriptDialogOpening') {
      void send('Page.handleJavaScriptDialog', { accept: true });
    } else if (message.method === 'Runtime.exceptionThrown') {
      errors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
    }
  };
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++seq;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
      pending.set(id, { resolve, reject, timer });
      ws.send(J({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if (result.exceptionDetails) throw new Error(J(result.exceptionDetails.exception?.description ?? result.exceptionDetails));
    return result.result.value;
  }
  async function wait(expression, timeout = 12000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) { if (await evaluate(`Boolean(${expression})`)) return; await sleep(80); }
    throw new Error(`UI timeout: ${expression}`);
  }
  const BODY = 'textarea[aria-label="본문"]';
  const page = {
    send, evaluate, wait, BODY,
    // scope 안에서 글자가 정확히 같은 버튼을 누른다.
    click: (text, scope = 'document') => evaluate(`(() => { const root=${scope === 'document' ? 'document' : `document.querySelector(${J(scope)})`}; if(!root) throw Error('Missing scope '+${J(scope)}); const el=[...root.querySelectorAll('button')].find(e=>e.textContent.trim()===${J(text)}); if(!el) throw Error('Missing button '+${J(text)}); if(el.disabled) throw Error('Disabled button '+${J(text)}); el.click(); })()`),
    // 진짜 마우스 클릭. 브라우저는 사람이 누른 것만 파일 받기를 여러 번 허용한다.
    mouseClick: async (text, scope) => {
      const pt = await evaluate(`(() => { const el=[...document.querySelector(${J(scope)}).querySelectorAll('button')].find(e=>e.textContent.trim()===${J(text)}); if(!el||el.disabled) throw Error('Missing button '+${J(text)}); el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; })()`);
      for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: pt.x, y: pt.y, button: 'left', clickCount: 1 });
    },
    // 글상자 값을 통째로 바꾼다(붙여넣기와 같은 경로).
    input: (selector, text) => evaluate(`(() => {const el=document.querySelector(${J(selector)}); if(!el)throw Error('Missing input '+${J(selector)}); const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:el.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${J(text)}); el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));})()`),
    // 실제 키 입력처럼, 지금 커서 자리에 글자를 넣는다.
    type: (text) => send('Input.insertText', { text }),
    text: () => evaluate(`document.querySelector(${J(BODY)})?.value`),
    caret: () => evaluate(`document.querySelector(${J(BODY)}).selectionStart`),
    setCaret: (n) => evaluate(`(() => {const el=document.querySelector(${J(BODY)}); el.focus(); el.setSelectionRange(${n},${n});})()`),
    saved: () => wait(`document.querySelector('.wr-save').dataset.state==='saved'`),
    state: () => evaluate(`document.querySelector('.wr-save').dataset.state`),
    title: () => evaluate(`document.querySelector('.wr-title').textContent`),
    size: (width, height = 820) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }),
    screenshot: async (name) => { const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); fs.writeFileSync(path.join(out, name), Buffer.from(data, 'base64')); },
    reload: async () => {
      await evaluate('window.__old = true');
      await send('Page.reload');
      await wait(`!window.__old && document.querySelector(${J(BODY)}) && !document.querySelector(${J(BODY)})?.readOnly`);
    },
    close: () => ws.close(),
  };
  connections.push(page);
  await send('Page.enable'); await send('Runtime.enable');
  await send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads });
  return page;
}

async function startServers() {
  api = createStudioServer({ dataRoot, backupRoot, uiPorts: [UI_PORT], label: '검수 전용 샘플' });
  const apiPort = await api.listen(0);
  process.env.STUDIO_UI_PORT = String(UI_PORT);
  process.env.STUDIO_PORT = String(apiPort);
  vite = await createServer({
    root: `${repo}/apps/control-room`,
    configFile: `${repo}/apps/control-room/vite.config.ts`,
    server: { host: '127.0.0.1', port: UI_PORT, strictPort: true },
    logLevel: 'warn',
    plugins: [{ name: 'review-failure-injection', configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0];
        const fail = (message) => { res.statusCode = 503; res.setHeader('Content-Type', 'application/json'); res.end(J({ error: message, code: 'audit_outage' })); };
        if (req.method === 'POST' && /\/docs\/[^/]+\/recovery$/.test(url)) {
          chaos.stashSeen += 1;
          if (chaos.stashFail) return fail('검수용 보관 실패');
          if (chaos.stashDelay) return void setTimeout(next, chaos.stashDelay);
        }
        if (req.method === 'PUT' && chaos.list && /\/works\/[^/]+$/.test(url)) return fail('검수용 목록 장애');
        if (req.method === 'PUT' && chaos.map && /\/map$/.test(url)) return fail('검수용 지도 장애');
        if (req.method === 'PUT' && chaos.docs && /\/docs\/[^/]+$/.test(url)) return fail('검수용 저장 장애');
        if (req.method === 'POST' && chaos.search && /\/search$/.test(url)) return fail('검수용 찾기 장애');
        // 본문 저장을 붙잡아 둔다. "저장 중"인 채로 다른 회차에 다녀오는 경우를 만들기 위해서다.
        if (req.method === 'PUT' && chaos.holdDocs && /\/docs\/[^/]+$/.test(url)) return void chaos.held.push(next);
        next();
      });
    } }],
  });
  await vite.listen();
}

async function stopServers() {
  if (vite) await vite.close();
  if (api) await api.close();
  vite = api = undefined;
}

async function newPage(width = 1280) {
  const target = await (await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' })).json();
  const page = await connect(target.webSocketDebuggerUrl);
  await page.size(width);
  await page.send('Page.navigate', { url: `http://127.0.0.1:${UI_PORT}/#write` });
  await page.wait(`document.querySelector(${J(page.BODY)}) && !document.querySelector(${J(page.BODY)}).readOnly`);
  return page;
}

// ── 지도 화면 조작 ─────────────────────────────────────────────────────────
const MAP = '.wr-drawer.map';
const cardExpr = (name) => `[...document.querySelectorAll('${MAP} .wr-card')].find(e=>e.querySelector('.wr-card-title').textContent===${J(name)})`;
const mapSaved = (p) => p.wait(`document.querySelector('${MAP} .wr-map-bar [role="status"]').textContent.includes('저장됨')`);
async function openMap(p) {
  if (!(await p.evaluate(`!!document.querySelector('${MAP}')`))) await p.click('연결 지도', '.wr-top');
  await p.wait(`document.querySelector('${MAP} .wr-map-add button') && !document.querySelector('${MAP} .wr-map-add button').disabled`);
}
async function selectCard(p, name) {
  await p.wait(cardExpr(name));
  if (!(await p.evaluate(`${cardExpr(name)}.dataset.selected==='true'`))) await p.evaluate(`${cardExpr(name)}.click()`);
  await p.wait(`${cardExpr(name)}.dataset.selected==='true'`);
}
async function addCard(p, kindLabel, name, extra = {}) {
  await p.click(`+ ${kindLabel}`, MAP);
  await p.wait(`document.querySelector('${MAP} input[aria-label="카드 이름"]')`);
  await p.input(`${MAP} input[aria-label="카드 이름"]`, name);
  if (extra.source) await p.input(`${MAP} input[aria-label="출처"]`, extra.source);
  if (extra.note) await p.input(`${MAP} textarea[aria-label="카드 메모"]`, extra.note);
  await p.wait(cardExpr(name));
}
async function link(p, from, to, label) {
  await selectCard(p, from);
  const toId = await p.evaluate(`${cardExpr(to)}.dataset.cardId`);
  await p.input(`${MAP} select[aria-label="이을 카드"]`, toId);
  await p.input(`${MAP} input[aria-label="새 연결 이름"]`, label);
  await p.click('잇기', MAP);
  await p.wait(`[...document.querySelectorAll('${MAP} .wr-labels text')].some(t=>t.textContent===${J(label)})`);
}
// 선택한 카드에서 화면이 실제로 강조해 보여 주는 것: 이웃 카드, 굵은 선의 이름과 길이, 상세의 연결 이름, 관련 회차
const highlight = (p) => p.evaluate(`(() => {
  const root=document.querySelector('${MAP}');
  const vis=(el)=>{const r=el.getBoundingClientRect(); return r.width>0&&r.height>0;};
  return {
    selected:[...root.querySelectorAll('.wr-card[data-selected="true"]')].map(e=>e.querySelector('.wr-card-title').textContent),
    neighbours:[...root.querySelectorAll('.wr-card[data-linked="true"]')].filter(vis).map(e=>e.querySelector('.wr-card-kind').textContent+':'+e.querySelector('.wr-card-title').textContent).sort(),
    dimmed:[...root.querySelectorAll('.wr-card:not([data-selected="true"]):not([data-linked="true"])')].filter(e=>getComputedStyle(e).color!==getComputedStyle(root.querySelector('.wr-card[data-selected="true"]')).color).map(e=>e.querySelector('.wr-card-title').textContent).sort(),
    activeLines:[...root.querySelectorAll('.wr-lines path[data-active="true"]')].map(l=>{const t=root.querySelector('.wr-labels text[data-link-id="'+l.dataset.linkId+'"]'); const tb=t.getBoundingClientRect(); const covers=[...root.querySelectorAll('.wr-card')].some(c=>{const r=c.getBoundingClientRect(); return tb.left<r.right-2&&tb.right>r.left+2&&tb.top<r.bottom-2&&tb.bottom>r.top+2;}); const m=root.getBoundingClientRect(); return {label:t.textContent, length:Math.round(l.getTotalLength()), width:parseFloat(getComputedStyle(l).strokeWidth), bold:t.dataset.active==='true'&&parseInt(getComputedStyle(t).fontWeight)>=700, labelOnCard:covers, labelCut: tb.left<m.left||tb.right>m.left+root.clientWidth};}).sort((a,b)=>a.label.localeCompare(b.label)),
    faintLines:[...root.querySelectorAll('.wr-lines path:not([data-active="true"])')].filter(g=>getComputedStyle(g).opacity<0.5).length,
    detailLinks:[...root.querySelectorAll('[data-link-row]')].map(li=>li.querySelector('button').textContent.trim().replace(/\\s+/g,' ')+' = '+li.querySelector('input').value).sort(),
    docs:[...root.querySelectorAll('[data-doc-row]')].map(li=>li.querySelector('span').textContent),
  };
})()`);

// ── 이 회차의 자료 화면 조작 ────────────────────────────────────────────────
const REFS = '.wr-drawer.refs';
async function openRefs(p) {
  if (!(await p.evaluate(`!!document.querySelector('${REFS}')`))) await p.click('자료', '.wr-top');
  await p.wait(`document.querySelector('${REFS} input[type="search"]') || document.querySelector('${REFS} [data-ref-detail]')`);
}
// 목록에 보이는 줄: "종류:이름". 종류 표시가 비어 있으면 그대로 드러난다.
const refRows = (p, scope) => p.evaluate(`[...document.querySelectorAll('${REFS} ${scope} .wr-row.card')].map(e=>e.querySelector('.wr-card-kind').textContent.trim()+':'+e.querySelector('.wr-ref-name').textContent)`);
const follow = async (p, name) => {
  await p.evaluate(`(() => { const b=[...document.querySelectorAll('${MAP} [data-link-row] > button.line')].find(e=>e.textContent.includes(${J(name)})); if(!b) throw Error('Missing link row '+${J(name)}); b.click(); })()`);
  await p.wait(`${cardExpr(name)}.dataset.selected==='true'`);
};
const rels = (p) => p.evaluate(`[...document.querySelectorAll('${MAP} [data-rel]')].map(e=>e.textContent).sort()`);
const sameSet = (a, b) => J([...a].sort()) === J([...b].sort());
const releaseHeld = () => { chaos.holdDocs = false; for (const go of chaos.held.splice(0)) go(); };

/*
 * 작가가 하는 순서 그대로 한 번. 새 가상 작품을 만들어 주어진 창 폭에서 끝까지 간다.
 * 2화를 쓰다가 → 자료에서 '정전' 찾기 → 일지의 출처 보기 → 지도에서 보기 → 사건·주제 따라가기 → 관련 1화 열기
 * → 쓰던 곳으로(2화의 원래 커서·스크롤) → 한 문장 더.
 * 1280에서는 "저장이 끝나기 전에 돌아온" 경우를, 좁은 창에서는 "떠나 있는 동안 저장이 끝난" 경우를 본다.
 */
async function authorFlow(p, width) {
  const BODY = p.BODY;
  const narrow = width < 900;
  const tag = `[${width}px] `;
  await p.size(width, 800);
  await sleep(250);
  const listShown = () => p.evaluate(`!!document.querySelector('.wr-side')`);
  const showList = async () => { if (!(await listShown())) await p.click('목록', '.wr-top'); await p.wait(`document.querySelector('.wr-side')`); };
  const hideList = async () => { if (await listShown()) await p.click('목록', '.wr-top'); await p.wait(`!document.querySelector('.wr-side')`); };
  const bodyState = () => p.evaluate(`(() => { const el=document.querySelector(${J(BODY)}); return { caret: el.selectionStart, scroll: Math.round(el.scrollTop), focused: document.activeElement===el, value: el.value }; })()`);

  // 새 가상 작품, 1화와 2화
  const known = new Set(api.store.listWorks().map((w) => w.id));
  await showList();
  await p.click('+ 새 작품', '.wr-side');
  let wid = '';
  for (let i = 0; i < 100 && !wid; i++) { wid = api.store.listWorks().find((w) => !known.has(w.id))?.id ?? ''; if (!wid) await sleep(50); }
  await p.wait(`document.querySelector(${J(BODY)})?.value==='' && !document.querySelector(${J(BODY)}).readOnly && document.querySelector('.wr-title').textContent.includes('1화')`);
  const d1 = api.store.getWork(wid).docs[0].id;
  const one = `1화 샘플(${width}).\n\n항구의 불이 한꺼번에 꺼졌다. 그날의 정전은 03시 10분에 시작됐다.\n\n해원은 창가에서 그 순간을 보았다.`;
  await p.input(BODY, one);
  await p.saved();
  await showList();
  await p.click('+ 새 원고', '.wr-side');
  await p.wait(`document.querySelector('.wr-title').textContent.includes('2화') && !document.querySelector(${J(BODY)})?.readOnly && document.querySelector(${J(BODY)}).value===''`);
  await hideList();
  const d2 = api.store.getWork(wid).docs[1].id;
  const paras = Array.from({ length: 40 }, (_, i) => `${i + 1}번째 문단. 당직실의 시계는 멈춰 있었고, 해원은 복도 끝의 불빛을 오래 바라보았다.${i === 6 ? ' 그 밤의 정전을 다시 떠올렸다.' : ''}`);
  let text = `2화 샘플(${width}).\n\n` + paras.join('\n\n');
  await p.input(BODY, text);
  const at = text.indexOf('25번째 문단.');
  await p.setCaret(at);
  const typeHere = async (sentence, pos) => { await p.type(sentence); text = text.slice(0, pos) + sentence + text.slice(pos); return pos + sentence.length; };
  let caret = await typeHere('쓰던 문장이다. ', at);
  await p.saved();
  const start = await bodyState();
  record(tag + '가상 2화를 긴 글 중간에서 쓰고 있다(커서·스크롤이 맨 위가 아니다)', start.value === text && start.caret === caret && start.scroll > 200 && api.store.getScene(wid, d2).text === text, { caret: start.caret, scroll: start.scroll });

  // 지도에 카드와 관계를 만든다(작가가 직접).
  await openMap(p);
  await addCard(p, '등장인물', '해원');
  await addCard(p, '등장인물', '도윤');
  await addCard(p, '주요 사건', '정전 사건', { note: '11월의 밤, 항구 전체가 꺼졌다' });
  await addCard(p, '조사 자료', '당직 일지', { source: '항만 관리사무소 보관 문서(가상) 3권 41쪽', note: '03:10 정전 직전 기록이 비어 있음' });
  await addCard(p, '조사 자료', '배전표', { source: '전력 담당자 메모(가상)', note: '03:25 복구로 적혀 있음' });
  await addCard(p, '주제', '책임');
  await link(p, '해원', '도윤', '남매');
  await link(p, '해원', '정전 사건', '목격했다');
  await link(p, '당직 일지', '정전 사건', '뒷받침한다');
  await link(p, '당직 일지', '배전표', '서로 어긋난다');
  await link(p, '정전 사건', '책임', '드러낸다');
  for (const [name, docs] of [['정전 사건', [d2, d1]], ['당직 일지', [d2]]]) {
    await selectCard(p, name);
    for (const d of docs) {
      await p.input(`${MAP} select[aria-label="이을 회차"]`, d);
      await p.click('회차 잇기', MAP);
      await p.wait(`document.querySelector('${MAP} [data-doc-row="${d}"]')`);
    }
  }
  await mapSaved(p);
  const made = api.store.getMap(wid);
  const idOf = (name) => made.cards.find((c) => c.title === name).id;
  const said = made.links.map((l) => `${made.cards.find((c) => c.id === l.from).title}-${l.label}-${made.cards.find((c) => c.id === l.to).title}`);
  record(tag + '다섯 관계를 직접 잇는다(인물끼리·자료끼리·인물→사건·자료→사건·사건→주제)', J(said) === J(['해원-남매-도윤', '해원-목격했다-정전 사건', '당직 일지-뒷받침한다-정전 사건', '당직 일지-서로 어긋난다-배전표', '정전 사건-드러낸다-책임']) && J(made.cards.find((c) => c.title === '정전 사건').docIds) === J([d2, d1]), { said });
  await p.click('쓰던 곳으로', MAP);
  await p.wait(`!document.querySelector('.wr-drawer') && document.activeElement===document.querySelector(${J(BODY)})`);

  // 마지막 문장을 치고, 저장이 끝나기 전에 자료를 연다. (저장 요청은 시험이 붙잡아 둔다.)
  chaos.holdDocs = true;
  const lastSentence = '자료를 보러 가기 직전에 쓴 마지막 문장. ';
  caret = await typeHere(lastSentence, caret);
  await p.wait(`document.querySelector('.wr-save').dataset.state==='saving'`);
  for (let i = 0; i < 60 && chaos.held.length === 0; i++) await sleep(50);
  const leaving = await bodyState();

  // 이 회차의 자료: 이어 둔 카드가 먼저
  await openRefs(p);
  await p.wait(`document.querySelector('${REFS} [data-ref-section="linked"] .wr-row.card')`);
  const first = {
    linked: await refRows(p, '[data-ref-section="linked"]'),
    rest: await refRows(p, '[data-ref-section="rest"]'),
    linkedFirst: await p.evaluate(`!!(document.querySelector('${REFS} [data-ref-section="linked"]').compareDocumentPosition(document.querySelector('${REFS} [data-ref-section="rest"]')) & Node.DOCUMENT_POSITION_FOLLOWING)`),
    heading: await p.evaluate(`document.querySelector('${REFS} h2').textContent`),
  };
  record(tag + '"자료"를 열면 이 회차(2화)에 이은 사건·자료가 먼저 보인다', J(first.linked) === J(['사건:정전 사건', '자료:당직 일지']) && J(first.rest) === J(['인물:해원', '인물:도윤', '자료:배전표', '주제:책임']) && first.linkedFirst && first.heading.includes('2화'), first);

  // 같은 자리에서 '정전' 찾기: 원고·사건·자료가 함께, 종류와 함께
  await p.input(`${REFS} input[type="search"]`, '정전');
  await p.wait(`document.querySelector('${REFS} [data-ref-results="정전"] .wr-h')`);
  const found = {
    rows: await refRows(p, '[data-ref-results]'),
    kinds: await p.evaluate(`[...document.querySelectorAll('${REFS} [data-ref-results] .wr-row.card')].map(e=>e.dataset.hitKind)`),
    twoRow: await p.evaluate(`document.querySelector('${REFS} [data-doc-id="${d2}"]').textContent`),
    oneRow: await p.evaluate(`document.querySelector('${REFS} [data-doc-id="${d1}"]').textContent`),
    sourceRow: await p.evaluate(`document.querySelector('${REFS} [data-ref-results] [data-card-id="${idOf('당직 일지')}"]').textContent`),
    marks: await p.evaluate(`[...document.querySelectorAll('${REFS} [data-ref-results] mark')].map(e=>e.textContent)`),
    head: await p.evaluate(`document.querySelector('${REFS} [data-ref-results] .wr-h').textContent`),
  };
  await p.screenshot(`12-refs-search-${width}.png`);
  record(tag + "'정전'을 찾으면 원고(1화·2화)·사건·자료가 함께 나오고 줄마다 종류가 적혀 있다",
    J(found.rows) === J(['회차:1화', '회차:2화', '사건:정전 사건', '자료:당직 일지']) && J(found.kinds) === J(['doc', 'doc', 'event', 'source']) && found.twoRow.includes('지금 쓰는 회차') && found.twoRow.includes('본문 1곳') && found.oneRow.includes('본문 1곳') && found.oneRow.includes('03시 10분') && found.sourceRow.includes('메모에서 찾음') && found.marks.length === 3 && found.marks.every((m) => m === '정전') && found.head.includes('회차 2') && found.head.includes('카드 2'),
    found);

  if (width === 580) {
    // 아직 저장되지 않은 글과, 본문 찾기가 안 될 때
    await p.input(`${REFS} input[type="search"]`, '마지막 문장');
    await p.wait(`document.querySelector('${REFS} [data-ref-results="마지막 문장"] .wr-h')`);
    const unsavedRows = await refRows(p, '[data-ref-results]');
    chaos.search = true;
    await p.input(`${REFS} input[type="search"]`, '정전');
    await p.wait(`document.querySelector('${REFS} [data-ref-results="정전"] .wr-h')`);
    const down = { rows: await refRows(p, '[data-ref-results]'), alert: await p.evaluate(`document.querySelector('${REFS} [data-ref-results] [role="alert"]')?.textContent ?? ''`) };
    chaos.search = false;
    record(tag + '찾기: 아직 저장되지 않은 지금 회차의 글도 찾고, 본문 찾기가 실패하면 그렇다고 알린다', api.store.getScene(wid, d2).text !== text && J(unsavedRows) === J(['회차:2화']) && J(down.rows) === J(['회차:2화', '사건:정전 사건', '자료:당직 일지']) && down.alert.includes('다른 회차의 본문에서는 찾지 못했습니다'), { unsavedRows, down });
  }

  // 일지를 고른다: 출처와 메모
  await p.evaluate(`document.querySelector('${REFS} [data-ref-results] [data-card-id="${idOf('당직 일지')}"]').click()`);
  await p.wait(`document.querySelector('${REFS} [data-ref-detail]')`);
  const detail = await p.evaluate(`(() => { const root=document.querySelector('${REFS}'); const m=root.getBoundingClientRect(); const t=document.querySelector(${J(BODY)}).getBoundingClientRect(); return {
    source: root.querySelector('[data-ref-source]').textContent, note: root.querySelector('[data-ref-note]').textContent,
    rels: [...root.querySelectorAll('[data-ref-rel]')].map(e=>e.textContent).sort(), docs: [...root.querySelectorAll('[data-ref-doc]')].map(e=>e.querySelector('span').textContent),
    panels: document.querySelectorAll('.wr-side,.wr-drawer').length, pageScroll: document.documentElement.scrollWidth, panelWidth: Math.round(m.width),
    bodyBeside: Math.round(Math.max(0, Math.min(t.right, m.left) - t.left)), closeButton: [...root.querySelectorAll('button')].some(b=>b.textContent.trim()==='닫기'),
    inside: [...root.querySelectorAll('[data-ref-detail] *')].every(e=>{const r=e.getBoundingClientRect(); return r.width===0 || (r.left>=m.left-1 && r.right<=m.right+1);}),
  }; })()`);
  await p.screenshot(`13-refs-source-${width}.png`);
  const placed = narrow ? detail.panels === 1 && detail.panelWidth >= width - 2 && detail.closeButton && detail.pageScroll <= width : detail.panels === 1 && detail.bodyBeside >= 400 && detail.panelWidth >= 300 && detail.pageScroll <= width;
  record(tag + (narrow ? '일지를 고르면 닫기 쉬운 한 장짜리 패널에 출처와 메모가 보인다' : '일지를 고르면 원고 옆에 출처와 메모가 보인다'),
    detail.source === '항만 관리사무소 보관 문서(가상) 3권 41쪽' && detail.note === '03:10 정전 직전 기록이 비어 있음' && sameSet(detail.rels, ['당직 일지 ─ 뒷받침한다 → 정전 사건', '당직 일지 ─ 서로 어긋난다 → 배전표']) && detail.docs.length === 1 && detail.docs[0].includes('지금 쓰는 회차') && placed && detail.inside,
    detail);

  // 지도에서 보기: 그 카드와 직접 이어진 것이 강조된다
  await p.click('지도에서 보기', REFS);
  await p.wait(`document.querySelector('${MAP}') && ${cardExpr('당직 일지')} && ${cardExpr('당직 일지')}.dataset.selected==='true' && document.querySelectorAll('${MAP} .wr-lines path[data-active="true"]').length===2`);
  const inMap = await highlight(p);
  const cardSeen = await p.evaluate(`(() => { const m=document.querySelector('${MAP}').getBoundingClientRect(); const r=${cardExpr('당직 일지')}.getBoundingClientRect(); return r.top>=m.top && r.bottom<=m.bottom && r.left>=m.left && r.right<=m.right; })()`);
  await p.screenshot(`14-map-from-refs-${width}.png`);
  record(tag + '"지도에서 보기": 일지가 골라진 채 열리고, 정전 사건(뒷받침한다)·배전표(서로 어긋난다)가 강조된다',
    J(inMap.selected) === J(['당직 일지']) && sameSet(inMap.neighbours, ['사건:정전 사건', '자료:배전표']) && sameSet(inMap.activeLines.map((l) => l.label), ['뒷받침한다', '서로 어긋난다']) && inMap.activeLines.every((l) => l.width >= 2 && l.bold && !l.labelOnCard && !l.labelCut) && sameSet(inMap.dimmed, ['도윤', '책임', '해원']) && cardSeen,
    { ...inMap, cardSeen });

  // 사건과 주제를 따라간다. 사건 쪽에서 보아도 누가 무엇을 했는지 문장으로 읽힌다.
  await follow(p, '정전 사건');
  const atEvent = { ...(await highlight(p)), rels: await rels(p) };
  await follow(p, '책임');
  const atTheme = { ...(await highlight(p)), rels: await rels(p) };
  await p.screenshot(`15-map-theme-${width}.png`);
  await follow(p, '정전 사건');
  record(tag + '지도에서 사건과 주제를 따라간다. 사건 쪽에서 보아도 "해원 ─ 목격했다 → 정전 사건"으로 읽힌다',
    sameSet(atEvent.neighbours, ['인물:해원', '자료:당직 일지', '주제:책임']) && sameSet(atEvent.rels, ['당직 일지 ─ 뒷받침한다 → 정전 사건', '정전 사건 ─ 드러낸다 → 책임', '해원 ─ 목격했다 → 정전 사건']) && sameSet(atEvent.activeLines.map((l) => l.label), ['드러낸다', '뒷받침한다', '목격했다']) && J(atTheme.selected) === J(['책임']) && J(atTheme.neighbours) === J(['사건:정전 사건']) && sameSet(atTheme.rels, ['정전 사건 ─ 드러낸다 → 책임']) && atEvent.docs.length === 2,
    { atEvent, atTheme });

  // 관련 1화를 연다. 2화의 저장은 아직 끝나지 않았다.
  const stateWhenLeaving = await p.state();
  await p.evaluate(`[...document.querySelector('${MAP} [data-doc-row="${d1}"]').querySelectorAll('button')].find(b=>b.textContent.trim()==='관련 회차 열기').click()`);
  await p.wait(`document.querySelector('.wr-title').textContent.includes('1화') && document.querySelector(${J(BODY)})?.value===${J(one)}`);
  const away = await p.evaluate(`({ note: [...document.querySelectorAll('.wr-main .wr-note')].map(e=>e.textContent).join(' | '), drawers: document.querySelectorAll('.wr-drawer').length })`);
  record(tag + '관련 1화를 열어 본다(돌아갈 길이 화면에 보인다)', stateWhenLeaving === 'saving' && api.store.getScene(wid, d2).text !== text && away.note.includes('쓰던 곳으로') && away.drawers === (narrow ? 0 : 1), { stateWhenLeaving, away });

  const early = width === 1280; // 저장이 끝나기 전에 돌아온다.
  if (!early) {
    releaseHeld();
    for (let i = 0; i < 80 && api.store.getScene(wid, d2).text !== text; i++) await sleep(50);
  }
  const serverBeforeReturn = api.store.getScene(wid, d2).text === text;
  await p.click('쓰던 곳으로', '.wr-main');
  await p.wait(`document.querySelector('.wr-title').textContent.includes('2화') && document.querySelector(${J(BODY)})?.value===${J(text)} && document.activeElement===document.querySelector(${J(BODY)})`);
  if (early) {
    await sleep(1500); // 돌아온 화면이 되살린 글을 다시 저장하려 할 때까지 둔다.
    releaseHeld();
  }
  for (let i = 0; i < 40 && Math.abs((await bodyState()).scroll - leaving.scroll) > 2; i++) await sleep(50);
  await p.saved().catch(() => undefined);
  await sleep(400);
  const returned = { ...(await bodyState()), state: await p.state(), conflict: await p.evaluate(`!!document.querySelector('.wr-conflict')`), drawers: await p.evaluate(`document.querySelectorAll('.wr-side,.wr-drawer').length`) };
  record(tag + (early ? '쓰던 곳으로(저장이 끝나기 전에 돌아옴): 2화·원래 커서·스크롤·마지막 문장이 그대로이고 충돌로 잘못 뜨지 않는다' : '쓰던 곳으로: 2화·원래 커서·스크롤·저장 중이던 마지막 문장이 그대로다'),
    serverBeforeReturn === !early && returned.value === text && returned.value.includes(lastSentence) && returned.caret === caret && returned.caret === leaving.caret && Math.abs(returned.scroll - leaving.scroll) <= 2 && returned.scroll > 200 && returned.focused && returned.drawers === 0 && !returned.conflict && returned.state === 'saved' && api.store.getScene(wid, d2).text === text,
    { ...returned, value: `${returned.value.length}자`, expectedCaret: caret, leavingScroll: leaving.scroll, serverBeforeReturn });
  await p.screenshot(`17-back-to-text-${width}.png`);
  if (returned.conflict) { await p.click('내 글로 저장'); await p.saved(); } // 다음 단계가 이어지게 한다(위 항목은 이미 실패로 적혔다).

  const more = '돌아와서 이어 쓴 한 문장. ';
  const tail = text.slice(caret);
  caret = await typeHere(more, caret);
  await p.saved();
  record(tag + '돌아온 자리에서 한 문장을 더 쓰고 저장된다', (await p.text()) === text && (await p.caret()) === caret && api.store.getScene(wid, d2).text === text && text.includes(lastSentence + more) && api.store.getScene(wid, d1).text === one);
  return { wid, d1, d2, text, caret, lastSentence: more, tail };
}

try {
  process.chdir(`${repo}/apps/control-room`);
  await startServers();
  const browserExe = process.env.WRITING_TEST_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  browser = spawn(browserExe, [
    '--headless=new', '--disable-gpu', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking', 'about:blank',
  ], { windowsHide: true, stdio: 'ignore' });
  const activePort = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !fs.existsSync(activePort); i++) await sleep(100);
  debugPort = Number(fs.readFileSync(activePort, 'utf8').split('\n')[0]);

  // ══ 1. 빈 저장소에서 가상 작품과 회차 2편 ═════════════════════════════════
  const p = await newPage();
  const BODY = p.BODY;
  record('빈 시험 저장소에서 시작', api.store.listWorks().length === 0);
  const one = '1화 샘플.\n\n항구의 불이 한꺼번에 꺼졌다. 해원은 창가에서 그 순간을 보았다.';
  await p.input(BODY, one);
  await p.saved();
  const wid = api.store.listWorks()[0].id;
  const d1 = api.store.getWork(wid).docs[0].id;
  await p.click('목록', '.wr-top');
  await p.click('+ 새 원고', '.wr-side');
  await p.wait(`document.querySelector('.wr-title').textContent.includes('2화') && !document.querySelector(${J(BODY)})?.readOnly`);
  const d2 = api.store.getWork(wid).docs[1].id;
  const headPart = '2화 샘플.\n\n당직실 문은 반쯤 열려 있었다.';
  const tailPart = '\n\n도윤은 일지를 덮었다.\n“누나, 이건 우리가 볼 게 아니야.”';
  await p.input(BODY, headPart + tailPart);
  // 2화 중간에 커서를 두고, 한글을 조합해 넣는다(조합 이벤트 흉내).
  await p.setCaret(headPart.length);
  await p.type('\n');
  for (const step of ['ㅎ', '하', '한']) await p.send('Input.imeSetComposition', { text: step, selectionStart: step.length, selectionEnd: step.length });
  await p.type('한');
  for (const step of ['ㄱ', '그', '글']) await p.send('Input.imeSetComposition', { text: step, selectionStart: step.length, selectionEnd: step.length });
  await p.type('글');
  await p.type(' 조합으로 넣은 문장.');
  const two = headPart + '\n한글 조합으로 넣은 문장.' + tailPart;
  await p.saved();
  record('회차 2편·문단·줄바꿈·한글 조합(흉내) 입력 저장', (await p.text()) === two && api.store.getScene(wid, d2).text === two && api.store.getScene(wid, d1).text === one, { caret: await p.caret(), expectedCaret: headPart.length + '\n한글 조합으로 넣은 문장.'.length });
  record('저장 상태와 현재 작품·회차가 위쪽에 보인다', (await p.title()).includes('2화') && (await p.state()) === 'saved', { title: await p.title() });
  await p.click('목록', '.wr-top');

  // ══ 2. 연결 지도 만들기 ═════════════════════════════════════════════════
  const caretBeforeMap = await p.caret();
  await openMap(p);
  await addCard(p, '등장인물', '해원');
  await addCard(p, '등장인물', '도윤');
  await addCard(p, '주요 사건', '정전 사건', { note: '11월의 밤, 항구 전체 정전' });
  await addCard(p, '조사 자료', '당직 일지', { source: '항만 관리사무소 보관 문서(가상)', note: '03:10 기록이 비어 있음' });
  await addCard(p, '조사 자료', '배전표 정정본', { source: '전력 담당자 메모(가상)' });
  await addCard(p, '주제', '책임');
  await link(p, '해원', '도윤', '남매');
  await link(p, '해원', '정전 사건', '목격했다');
  await link(p, '당직 일지', '배전표 정정본', '서로 어긋난다');
  await link(p, '당직 일지', '정전 사건', '근거');
  await link(p, '정전 사건', '책임', '드러낸다');
  await selectCard(p, '정전 사건');
  await p.input(`${MAP} select[aria-label="이을 회차"]`, d2);
  await p.click('회차 잇기', MAP);
  await p.wait(`document.querySelector('${MAP} [data-doc-row="${d2}"]')`);
  await mapSaved(p);
  const stored = api.store.getMap(wid);
  record('지도가 작품별 파일에 안정적인 ID로 저장된다', stored.cards.length === 6 && stored.links.length === 5 && stored.cards.find((c) => c.title === '정전 사건').docIds[0] === d2 && fs.existsSync(path.join(dataRoot, 'works', wid, 'map.json')), { cards: stored.cards.map((c) => `${c.kind}:${c.title}`), links: stored.links.map((l) => l.label) });
  const kinds = new Set(stored.links.map((l) => [stored.cards.find((c) => c.id === l.from).kind, stored.cards.find((c) => c.id === l.to).kind].sort().join('-')));
  record('인물↔인물, 자료↔자료, 서로 다른 종류의 연결을 모두 만든다', kinds.has('person-person') && kinds.has('source-source') && kinds.has('event-person') && kinds.has('event-source') && kinds.has('event-theme'), { kinds: [...kinds] });
  record('자료 카드에 출처와 짧은 메모가 남는다', stored.cards.find((c) => c.title === '당직 일지').source.includes('관리사무소') && stored.cards.find((c) => c.title === '당직 일지').note.includes('03:10'));

  await selectCard(p, '해원');
  const haewon = await highlight(p);
  record('해원을 누르면 도윤(남매)과 정전 사건(목격했다)이 강조되어 보인다',
    J(haewon.neighbours) === J(['사건:정전 사건', '인물:도윤']) && J(haewon.activeLines.map((l) => l.label)) === J(['남매', '목격했다']) && haewon.activeLines.every((l) => l.length > 20 && l.width >= 2 && l.bold && !l.labelOnCard && !l.labelCut) && haewon.faintLines === 3 && J(haewon.dimmed) === J(['당직 일지', '배전표 정정본', '책임']) && J(haewon.detailLinks) === J(['사건 정전 사건 = 목격했다', '인물 도윤 = 남매']),
    haewon);
  await p.screenshot('01-map-1280-haewon.png');
  await selectCard(p, '정전 사건');
  const event = await highlight(p);
  record('정전 사건에서 자료(근거)·주제(드러낸다)·2화를 찾을 수 있다',
    J(event.neighbours) === J(['인물:해원', '자료:당직 일지', '주제:책임']) && J(event.activeLines.map((l) => l.label)) === J(['근거', '드러낸다', '목격했다']) && event.docs.length === 1 && event.docs[0].includes('2화') && event.docs[0].includes('지금 쓰는 회차') && event.activeLines.every((l) => !l.labelOnCard && !l.labelCut),
    event);
  await selectCard(p, '당직 일지');
  const source = await highlight(p);
  record('자료 카드에서 다른 자료와의 연결(서로 어긋난다)이 보인다', J(source.neighbours) === J(['사건:정전 사건', '자료:배전표 정정본']) && source.activeLines.some((l) => l.label === '서로 어긋난다') && source.activeLines.every((l) => !l.labelOnCard && !l.labelCut), source);
  await p.screenshot('02-map-1280-source.png');

  // 연결 이름 고치기, 카드 이름 바꾸기 → 새로고침해도 선이 남는다.
  await selectCard(p, '해원');
  const siblingLink = stored.links.find((l) => l.label === '남매').id;
  await p.input(`${MAP} [data-link-row="${siblingLink}"] input`, '쌍둥이 남매');
  await p.input(`${MAP} input[aria-label="카드 이름"]`, '서해원');
  await p.wait(cardExpr('서해원'));
  await mapSaved(p);
  await p.reload();
  await openMap(p);
  await selectCard(p, '서해원');
  const renamed = await highlight(p);
  record('카드 이름·연결 이름을 고치고 새로고침해도 선이 끊기지 않는다', J(renamed.activeLines.map((l) => l.label)) === J(['목격했다', '쌍둥이 남매']) && J(renamed.neighbours) === J(['사건:정전 사건', '인물:도윤']) && api.store.getMap(wid).links.length === 5, renamed);
  await p.input(`${MAP} [data-link-row="${siblingLink}"] input`, '남매');
  await p.input(`${MAP} input[aria-label="카드 이름"]`, '해원');
  await p.wait(cardExpr('해원'));
  await mapSaved(p);

  // ══ 3. 지도 ↔ 원고 왕복 ═════════════════════════════════════════════════
  // (가) 같은 회차: 지도에서 2화를 열고 쓰던 자리로 돌아와 한 문장을 더 쓴다.
  record('지도를 여닫는 동안 본문 편집기가 그대로 살아 있다(글·커서 유지)', (await p.text()) === two && (await p.evaluate(`document.querySelector(${J(BODY)}).selectionStart`)) === caretBeforeMap, { caret: await p.caret(), caretBeforeMap });
  await selectCard(p, '정전 사건');
  await p.click('관련 회차 열기', MAP);
  await p.click('쓰던 곳으로', MAP);
  await p.wait(`!document.querySelector('${MAP}') && document.activeElement===document.querySelector(${J(BODY)})`);
  const caretBack = await p.caret();
  const more = ' 돌아와서 이어 쓴 한 문장.';
  await p.type(more);
  await p.saved();
  const twoMore = two.slice(0, caretBeforeMap) + more + two.slice(caretBeforeMap);
  record('지도에서 2화를 열고 쓰던 자리로 돌아와 한 문장을 더 쓴다', caretBack === caretBeforeMap && api.store.getScene(wid, d2).text === twoMore && (await p.title()).includes('2화'), { caretBack, caretBeforeMap });

  // (나) 다른 회차: 1화를 쓰다 저장이 끝나기 전에 지도를 열고, 지도에서 2화로 갔다가 1화의 쓰던 자리로 돌아온다.
  await p.click('목록', '.wr-top');
  await p.evaluate(`[...document.querySelectorAll('.wr-side .wr-row')].find(e=>e.textContent.trim()==='1화').click()`);
  await p.wait(`document.querySelector('.wr-title').textContent.includes('1화') && document.querySelector(${J(BODY)})?.value===${J(one)}`);
  await p.click('목록', '.wr-top');
  const mid = one.indexOf('해원은');
  await p.setCaret(mid);
  const unsaved = '【저장되기 전에 친 글】';
  await p.type(unsaved);
  const stateWhenLeaving = await p.state();
  await openMap(p);
  await selectCard(p, '정전 사건');
  await p.click('관련 회차 열기', MAP);
  await p.wait(`document.querySelector('.wr-title').textContent.includes('2화') && document.querySelector(${J(BODY)})?.value===${J(twoMore)}`);
  const oneMore = one.slice(0, mid) + unsaved + one.slice(mid);
  for (let i = 0; i < 60 && api.store.getScene(wid, d1).text !== oneMore; i++) await sleep(100);
  record('저장 중이던 글은 지도에서 다른 회차를 열어도 서버에 저장된다', stateWhenLeaving !== 'saved' && api.store.getScene(wid, d1).text === oneMore, { stateWhenLeaving });
  await p.click('쓰던 곳으로', MAP);
  await p.wait(`document.querySelector('.wr-title').textContent.includes('1화') && document.querySelector(${J(BODY)})?.value===${J(oneMore)} && document.activeElement===document.querySelector(${J(BODY)})`);
  record('쓰던 곳으로: 원래 회차와 커서 자리로 돌아온다', (await p.caret()) === mid + unsaved.length, { caret: await p.caret(), expected: mid + unsaved.length });

  // ══ 4. 화면 폭 390 · 580 · 1280 ═════════════════════════════════════════
  await p.click('목록', '.wr-top'); // 넓은 창에서 목록을 열어 둔 채로 줄인다.
  const layout = [];
  for (const width of [390, 580, 1280]) {
    await p.size(width, 800);
    await sleep(150);
    await p.setCaret(mid);
    const row = { width };
    row.plain = await p.evaluate(`({ body: Math.round(document.querySelector(${J(BODY)}).getBoundingClientRect().width), scroll: document.documentElement.scrollWidth, panels: document.querySelectorAll('.wr-side,.wr-drawer').length, title: document.querySelector('.wr-title').getBoundingClientRect().width>0 && document.querySelector('.wr-save').getBoundingClientRect().width>0 })`);
    if (width < 900) {
      await p.click('목록', '.wr-top');
      await p.wait(`document.querySelector('.wr-side')`);
      await p.click('메모', '.wr-top');
      await p.wait(`document.querySelector('.wr-drawer')`);
      row.onePanel = await p.evaluate(`document.querySelectorAll('.wr-side,.wr-drawer').length`);
      await p.click('닫기', '.wr-drawer');
    }
    await openMap(p);
    await selectCard(p, '해원');
    row.map = await p.evaluate(`(() => { const m=document.querySelector('${MAP}').getBoundingClientRect(); const cards=[...document.querySelectorAll('${MAP} .wr-card')].map(e=>e.getBoundingClientRect()); const t=document.querySelector(${J(BODY)}).getBoundingClientRect(); return { panels: document.querySelectorAll('.wr-side,.wr-drawer').length, scroll: document.documentElement.scrollWidth, mapWidth: Math.round(m.width), cardsInside: cards.every(r=>r.left>=m.left-1 && r.right<=m.right+1 && r.width>40), labelsCut: [...document.querySelectorAll('${MAP} .wr-labels text')].filter(t=>{const b=t.getBoundingClientRect(); return b.left<m.left||b.right>m.left+document.querySelector('${MAP}').clientWidth;}).length, lines: document.querySelectorAll('${MAP} .wr-lines path[data-active="true"]').length, labelsOnCards: [...document.querySelectorAll('${MAP} .wr-labels text[data-active="true"]')].filter(t=>{const tb=t.getBoundingClientRect(); return [...document.querySelectorAll('${MAP} .wr-card')].some(c=>{const r=c.getBoundingClientRect(); return tb.left<r.right-2&&tb.right>r.left+2&&tb.top<r.bottom-2&&tb.bottom>r.top+2;});}).length, bodyBeside: Math.round(Math.max(0, Math.min(t.right, m.left) - t.left)) }; })()`);
    await p.screenshot(`03-map-${width}.png`);
    await p.click('닫기', '.wr-drawer');
    await p.wait(`!document.querySelector('.wr-drawer') && document.activeElement===document.querySelector(${J(BODY)})`);
    row.closed = await p.evaluate(`({ body: Math.round(document.querySelector(${J(BODY)}).getBoundingClientRect().width), scroll: document.documentElement.scrollWidth, caret: document.querySelector(${J(BODY)}).selectionStart, focused: document.activeElement===document.querySelector(${J(BODY)}) })`);
    await p.screenshot(`04-editor-${width}.png`);
    layout.push(row);
  }
  const narrowOk = layout.filter((r) => r.width < 900).every((r) => r.plain.body >= r.width - 40 && r.plain.scroll <= r.width && r.plain.panels === 0 && r.plain.title && r.onePanel === 1 && r.map.panels === 1 && r.map.scroll <= r.width && r.map.cardsInside && r.map.lines === 2 && r.map.labelsOnCards === 0 && r.map.labelsCut === 0 && r.closed.body >= r.width - 40 && r.closed.scroll <= r.width && r.closed.caret === mid && r.closed.focused);
  record('좁은 창(390·580): 한 번에 한 패널, 닫으면 가로 스크롤 없이 본문과 커서가 돌아온다', narrowOk, { layout: layout.filter((r) => r.width < 900) });
  const wide = layout.find((r) => r.width === 1280);
  record('넓은 창(1280): 원고와 연결 지도를 나란히 본다', wide.map.bodyBeside >= 280 && wide.map.mapWidth >= 500 && wide.map.cardsInside && wide.map.labelsCut === 0 && wide.map.scroll <= 1280 && wide.closed.caret === mid, { wide });
  await p.click('목록', '.wr-top');

  // ══ 5. 뺀 회차 · 다른 작품 · 지도 저장 장애 ══════════════════════════════
  await p.click('목록', '.wr-top');
  await p.evaluate(`[...document.querySelectorAll('.wr-side .wr-row')].find(e=>e.textContent.trim()==='2화').click()`);
  await p.wait(`document.querySelector('.wr-title').textContent.includes('2화')`);
  await p.click('빼기', '.wr-side');
  await p.wait(`document.querySelector('.wr-side').textContent.includes('뺀 원고 1편') && document.querySelector('.wr-title').textContent.includes('1화')`);
  await openMap(p);
  await selectCard(p, '정전 사건');
  const removedRow = await p.evaluate(`(() => { const li=document.querySelector('${MAP} [data-doc-row="${d2}"]'); return { text: li.querySelector('span').textContent, openDisabled: [...li.querySelectorAll('button')].find(b=>b.textContent.trim()==='관련 회차 열기').disabled }; })()`);
  await p.click('되돌리기', '.wr-side');
  await p.wait(`!document.querySelector('${MAP} [data-doc-row="${d2}"] span').textContent.includes('뺀 회차')`);
  const backRow = await p.evaluate(`[...document.querySelector('${MAP} [data-doc-row="${d2}"]').querySelectorAll('button')].find(b=>b.textContent.trim()==='관련 회차 열기').disabled`);
  record('회차를 빼면 지도에 "뺀 회차"로 보이고, 되돌리면 다시 열 수 있다', removedRow.text.includes('뺀 회차') && removedRow.openDisabled && backRow === false && api.store.getMap(wid).cards.find((c) => c.title === '정전 사건').docIds[0] === d2, { removedRow });

  chaos.map = true;
  await selectCard(p, '책임');
  await p.input(`${MAP} textarea[aria-label="카드 메모"]`, '저장 장애 중에 적은 메모');
  await p.wait(`document.querySelector('${MAP} .wr-map-bar [role="status"]').textContent.includes('저장 실패')`);
  const failText = await p.evaluate(`document.querySelector('${MAP} .wr-map-bar').textContent`);
  await p.screenshot('05-map-save-failed.png');
  await p.reload();
  await openMap(p);
  await p.wait(`document.querySelector('${MAP} .wr-map-bar [role="status"]').textContent.includes('되살렸습니다') || document.querySelector('${MAP} .wr-map-bar [role="status"]').textContent.includes('저장 실패')`);
  chaos.map = false;
  for (let i = 0; i < 400 && api.store.getMap(wid).cards.find((c) => c.title === '책임').note !== '저장 장애 중에 적은 메모'; i++) {
    if (i % 20 === 0) await p.click('지금 다시 시도', MAP).catch(() => undefined);
    await sleep(100);
  }
  record('지도 저장 실패를 알리고, 새로고침 뒤 되살려 다시 저장한다', failText.includes('저장 실패') && failText.includes('지금 다시 시도') && api.store.getMap(wid).cards.find((c) => c.title === '책임').note === '저장 장애 중에 적은 메모', { failText });
  await p.click('닫기', '.wr-drawer');

  // 두 탭이 지도를 다르게 고치면 둘 다 남는다.
  const q = await newPage();
  await openMap(q);
  await openMap(p);
  await selectCard(p, '도윤');
  await p.input(`${MAP} textarea[aria-label="카드 메모"]`, '탭 A가 먼저 저장한 메모');
  await mapSaved(p);
  await selectCard(q, '도윤');
  await q.input(`${MAP} textarea[aria-label="카드 메모"]`, '탭 B가 늦게 쓴 메모');
  await q.wait(`document.querySelector('${MAP} .wr-conflict')`);
  await q.click('다른 곳의 지도 쓰기', MAP);
  await q.wait(`!document.querySelector('${MAP} .wr-conflict')`);
  record('지도 충돌: 고르지 않은 쪽도 서버에 남는다', api.store.getMap(wid).cards.find((c) => c.title === '도윤').note === '탭 A가 먼저 저장한 메모' && api.store.listMapRecovery(wid).some((r) => r.reason === 'stash' && r.cards.find((c) => c.title === '도윤').note === '탭 B가 늦게 쓴 메모'));
  await q.send('Page.close');
  await p.click('닫기', '.wr-drawer');

  await p.click('+ 새 작품', '.wr-side');
  await p.wait(`document.querySelector('.wr-title').textContent.includes('제목 없는 작품') && document.querySelector(${J(BODY)})?.value===''`);
  const wid2 = api.store.listWorks().find((w) => w.id !== wid).id;
  await openMap(p);
  await p.wait(`document.querySelector('${MAP}').textContent.includes('아직 카드가 없습니다')`);
  await addCard(p, '등장인물', '다른 작품의 인물');
  await mapSaved(p);
  record('다른 작품의 지도와 섞이지 않는다', api.store.getMap(wid2).cards.length === 1 && api.store.getMap(wid).cards.length === 6 && !api.store.getMap(wid).cards.some((c) => c.title === '다른 작품의 인물'));
  await p.click('닫기', '.wr-drawer');
  await p.evaluate(`[...document.querySelectorAll('.wr-side .wr-row')].find(e=>e.textContent.trim()==='제목 없는 작품' && e.getAttribute('aria-current')!=='true').click()`);
  await p.wait(`document.querySelector(${J(BODY)})?.value===${J(oneMore)}`);

  // ══ 6. 충돌 처리 중 본문 유실: 정상 · 지연 · 실패 ═══════════════════════
  const p2 = await newPage();
  const conflictOnce = async (serverText, mineText) => {
    await p.reload();
    await p2.reload();
    await p.input(BODY, serverText);
    await p.saved();
    await p2.input(BODY, mineText);
    await p2.wait(`document.querySelector('.wr-conflict')`);
  };
  const stashOf = (text) => api.store.listRecovery(wid, d1).some((x) => x.reason === 'stash' && api.store.getRecovery(wid, d1, x.key).text === text);
  const marker = ' 【충돌 처리 중에 친 글】';

  // 정상
  await conflictOnce('탭 A가 저장한 1화(정상).', '탭 B가 쓰던 1화(정상) — 고르지 않을 글.');
  await p2.click('다른 곳의 글 쓰기');
  await p2.wait(`!document.querySelector('.wr-conflict')`);
  record('충돌 정상: 다른 곳의 글을 쓰면 내 글이 정확히 복구본에 남는다', (await p2.text()) === '탭 A가 저장한 1화(정상).' && stashOf('탭 B가 쓰던 1화(정상) — 고르지 않을 글.') && (await p2.state()) === 'saved');
  // 화면에서 그 복구본으로 되돌릴 수 있다.
  await p2.click('판', '.wr-top');
  await p2.wait(`[...document.querySelectorAll('.wr-drawer .wr-row.card')].some(e=>e.textContent.includes('충돌 때 내 글'))`);
  await p2.evaluate(`[...document.querySelectorAll('.wr-drawer .wr-row.card')].find(e=>e.textContent.includes('충돌 때 내 글')).click()`);
  await p2.wait(`document.querySelector('.wr-drawer .wr-preview').textContent.includes('고르지 않을 글')`);
  await p2.click('이 내용으로 되돌리기', '.wr-drawer');
  await p2.wait(`document.querySelector(${J(BODY)})?.value==='탭 B가 쓰던 1화(정상) — 고르지 않을 글.'`);
  record('고르지 않았던 글을 화면의 "판 › 자동 복구"에서 되찾는다', api.store.getScene(wid, d1).text === '탭 B가 쓰던 1화(정상) — 고르지 않을 글.');
  await p2.click('닫기', '.wr-drawer');

  // 지연: 응답을 기다리는 동안 키 입력·다시 누르기·다른 결정
  await conflictOnce('탭 A가 저장한 1화(지연).', '탭 B가 쓰던 1화(지연).');
  chaos.stashDelay = 1500;
  const seenBefore = chaos.stashSeen;
  await p2.click('다른 곳의 글 쓰기');
  for (let i = 0; i < 60 && chaos.stashSeen === seenBefore; i++) await sleep(50);
  await p2.evaluate(`(() => {const el=document.querySelector(${J(BODY)}); el.focus(); el.setSelectionRange(el.value.length, el.value.length);})()`);
  await p2.type(marker);
  const during = await p2.evaluate(`({ value: document.querySelector(${J(BODY)})?.value, readOnly: document.querySelector(${J(BODY)})?.readOnly, buttonsDisabled: [...document.querySelectorAll('.wr-conflict button')].filter(b=>['내 글로 저장','다른 곳의 글 쓰기'].includes(b.textContent.trim())).every(b=>b.disabled), notice: document.querySelector('.wr-status').textContent })`);
  await p2.screenshot('06-conflict-locked.png');
  await p2.evaluate(`[...document.querySelectorAll('.wr-conflict button')].filter(b=>['내 글로 저장','다른 곳의 글 쓰기'].includes(b.textContent.trim())).forEach(b=>{b.click(); b.click();})`); // 잠긴 동안 마구 눌러 본다.
  await p2.wait(`!document.querySelector('.wr-conflict')`);
  chaos.stashDelay = 0;
  const after = { screen: await p2.text(), server: api.store.getScene(wid, d1).text, stashRequests: chaos.stashSeen - seenBefore, drafts: await p2.evaluate(`Object.entries(localStorage).filter(([k])=>k.startsWith('ons-write:draft:${wid}:${d1}')).map(([,v])=>JSON.parse(v).text)`) };
  record('충돌 지연: 기다리는 동안 입력을 받지 않아 "보였다가 사라지는 글"이 없다',
    during.readOnly && during.value === '탭 B가 쓰던 1화(지연).' && during.buttonsDisabled && during.notice.includes('입력 잠시 멈춤') && after.screen === '탭 A가 저장한 1화(지연).' && after.server === '탭 A가 저장한 1화(지연).' && stashOf('탭 B가 쓰던 1화(지연).') && after.stashRequests === 1 && !after.drafts.some((t) => t.includes('탭 B')),
    { during, after });
  await p2.type(' 잠금이 풀린 뒤 이어 쓴 글.');
  await p2.saved();
  record('충돌 지연 뒤: 다시 입력되고 저장된다', api.store.getScene(wid, d1).text === '탭 A가 저장한 1화(지연). 잠금이 풀린 뒤 이어 쓴 글.');

  // 실패: 보관 요청이 실패하면 아무것도 바꾸지 않는다.
  await conflictOnce('탭 A가 저장한 1화(실패).', '탭 B가 쓰던 1화(실패).');
  chaos.stashFail = true;
  await p2.click('다른 곳의 글 쓰기');
  await p2.wait(`document.querySelector('.wr-note') && document.querySelector('.wr-note').textContent.includes('보관하지 못해')`);
  await p2.type(' 실패 뒤에도 이어 쓴 글.');
  const mineAfterFail = '탭 B가 쓰던 1화(실패). 실패 뒤에도 이어 쓴 글.';
  const failed = { screen: await p2.text(), conflict: await p2.evaluate(`!!document.querySelector('.wr-conflict')`), readOnly: await p2.evaluate(`document.querySelector(${J(BODY)})?.readOnly`), server: api.store.getScene(wid, d1).text, drafts: await p2.evaluate(`Object.entries(localStorage).filter(([k])=>k.startsWith('ons-write:draft:${wid}:${d1}')).map(([,v])=>JSON.parse(v).text)`) };
  await p2.screenshot('07-conflict-stash-failed.png');
  record('충돌 실패: 내 글·브라우저 초안·충돌 선택이 그대로이고 다시 쓸 수 있다', failed.screen === mineAfterFail && failed.conflict && !failed.readOnly && failed.server === '탭 A가 저장한 1화(실패).' && failed.drafts.includes(mineAfterFail), failed);
  await p2.reload();
  record('충돌 실패 뒤 새로고침: 내 글과 충돌이 그대로다', (await p2.text()) === mineAfterFail && (await p2.evaluate(`!!document.querySelector('.wr-conflict')`)));
  chaos.stashFail = false;
  await p2.click('다른 곳의 글 쓰기');
  await p2.wait(`!document.querySelector('.wr-conflict')`);
  record('충돌 실패 뒤 다시 고르면 처리되고 내 글이 복구본에 남는다', (await p2.text()) === '탭 A가 저장한 1화(실패).' && stashOf(mineAfterFail));
  await p2.send('Page.close');
  await p.reload();
  await p.input(BODY, oneMore);
  await p.saved();

  // ══ 7. 목록 저장 실패: 유령 회차·중복 회차·거짓 성공 ══════════════════════
  if (!(await p.evaluate(`!!document.querySelector('.wr-side')`))) await p.click('목록', '.wr-top');
  await p.wait(`document.querySelector('.wr-side')`);
  await p.setCaret(mid);
  const docsBefore = api.store.getWork(wid).docs.map((d) => d.id);
  chaos.list = true;
  await p.click('+ 새 원고', '.wr-side');
  await p.wait(`document.body.textContent.includes('목록 저장 실패')`);
  const ghost = await p.evaluate(`({ title: document.querySelector('.wr-title').textContent, readOnly: document.querySelector(${J(BODY)})?.readOnly, value: document.querySelector(${J(BODY)})?.value, caret: document.querySelector(${J(BODY)}).selectionStart, rows: [...document.querySelectorAll('.wr-side .wr-row')].map(e=>e.textContent.trim()), retry: [...document.querySelectorAll('.wr-main button')].some(b=>b.textContent.trim()==='다시 시도') })`);
  await p.screenshot('08-list-save-failed.png');
  record('새 원고 저장 실패: 유령 회차 없이 쓰던 회차·본문·커서 유지, 다시 시도 제공', ghost.title.includes('1화') && !ghost.readOnly && ghost.value === oneMore && ghost.caret === mid && !ghost.rows.includes('3화') && ghost.retry && J(api.store.getWork(wid).docs.map((d) => d.id)) === J(docsBefore), ghost);
  await p.type('▶장애 중에도 쓴 글◀');
  await p.saved();
  const oneDuring = oneMore.slice(0, mid) + '▶장애 중에도 쓴 글◀' + oneMore.slice(mid);
  record('목록 장애 중에도 쓰던 회차는 계속 쓰고 저장된다', api.store.getScene(wid, d1).text === oneDuring);

  // 이름·순서·빼기 실패를 성공처럼 보이지 않는다.
  const rowsNow = () => p.evaluate(`[...document.querySelectorAll('.wr-side h2')].find(h=>h.textContent==='원고') && [...document.querySelectorAll('.wr-side .wr-row')].map(e=>e.textContent.trim())`);
  const rowsBefore = await rowsNow();
  await p.evaluate(`document.querySelector('.wr-side button[aria-label="아래로 옮기기"]').click()`);
  await p.wait(`document.querySelector('.wr-main [role="alert"]')`);
  const afterMove = await rowsNow();
  await p.click('이름', '.wr-side');
  await p.input('.wr-side input[aria-label="이름"]', '바뀌면 안 되는 이름');
  await p.evaluate(`document.querySelector('.wr-side input[aria-label="이름"]').blur()`);
  await sleep(400);
  const afterRename = await rowsNow();
  await p.click('빼기', '.wr-side');
  await sleep(400);
  const afterRemove = { rows: await rowsNow(), title: await p.title(), removedShown: await p.evaluate(`document.querySelector('.wr-side').textContent.includes('뺀 원고')`) };
  record('순서·이름·빼기 저장 실패: 화면의 목록이 바뀌지 않고 실패를 알린다', J(afterMove) === J(rowsBefore) && J(afterRename) === J(rowsBefore) && J(afterRemove.rows) === J(rowsBefore) && afterRemove.title.includes('1화') && !afterRemove.removedShown && (await p.evaluate(`document.querySelector('.wr-main [role="alert"]').textContent.includes('목록 저장 실패')`)) && J(api.store.getWork(wid).docs.map((d) => d.id)) === J(docsBefore), { rowsBefore, afterMove, afterRename, afterRemove });
  await p.click('그만두기', '.wr-main');

  // 다시 시도: 장애가 풀리면 서버가 확인한 뒤에 새 회차로 옮겨 간다.
  await p.click('+ 새 원고', '.wr-side');
  await p.wait(`document.body.textContent.includes('목록 저장 실패')`);
  chaos.list = false;
  await p.click('다시 시도', '.wr-main');
  await p.wait(`document.querySelector('.wr-title').textContent.includes('3화') && !document.querySelector(${J(BODY)})?.readOnly`);
  record('다시 시도: 서버가 추가를 확인한 뒤 새 회차로 이동한다', api.store.getWork(wid).docs.length === 3 && !(await p.evaluate(`!!document.querySelector('.wr-main [role="alert"]')`)));

  // 연달아 누르기: 한 편만 생긴다.
  await p.evaluate(`(() => { const b=[...document.querySelectorAll('.wr-side button')].find(e=>e.textContent.trim()==='+ 새 원고'); b.click(); b.click(); b.click(); })()`);
  await p.wait(`document.querySelector('.wr-title').textContent.includes('4화') && !document.querySelector(${J(BODY)})?.readOnly`);
  await sleep(500);
  record('연달아 눌러도 회차는 한 편만 생긴다', api.store.getWork(wid).docs.length === 4 && (await rowsNow()).filter((t) => /^\d+화$/.test(t)).length === 4, { docs: api.store.getWork(wid).docs.map((d) => d.title) });

  // 409: 다른 곳에서 목록이 먼저 바뀌었다. 유령·중복 없이 서버 목록을 따른다.
  const w409 = api.store.getWork(wid);
  api.store.putWork(wid, { baseRev: w409.rev, title: w409.title, docs: [...w409.docs, { id: 'd-elsewhere', title: '다른 곳에서 만든 회차' }], removed: w409.removed });
  await p.click('+ 새 원고', '.wr-side');
  await p.wait(`document.querySelector('.wr-main').textContent.includes('다른 곳에서 바뀌어')`);
  await sleep(300);
  const after409 = { rows: await rowsNow(), title: await p.title(), readOnly: await p.evaluate(`document.querySelector(${J(BODY)})?.readOnly`), server: api.store.getWork(wid).docs.map((d) => d.title) };
  record('목록 충돌(409): 유령·중복 회차 없이 서버 목록을 다시 보여 준다', after409.server.length === 5 && J(after409.rows.filter((t) => after409.server.includes(t))) === J(after409.server) && after409.title.includes('4화') && !after409.readOnly, after409);

  // ══ 8. TXT 내보내기와 작품 전체 백업 → 새 빈 폴더에 복원 ═════════════════
  await p.evaluate(`[...document.querySelectorAll('.wr-side .wr-row')].find(e=>e.textContent.trim()==='1화').click()`);
  await p.wait(`document.querySelector(${J(BODY)})?.value===${J(oneDuring)}`);
  await p.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads }); // 다른 탭을 닫으면 풀리므로 다시 건다.
  const waitFile = async (test) => { for (let i = 0; i < 80; i++) { const f = fs.readdirSync(downloads).find((n) => test(n) && !n.endsWith('.crdownload')); if (f) return f; await sleep(100); } return null; };
  const readTxt = (name) => fs.readFileSync(path.join(downloads, name));
  await p.click('내보내기', '.wr-top');
  await p.mouseClick('이 회차 TXT로 받기', '.wr-pop');
  const txt1 = await waitFile((n) => n.endsWith('.txt') && !n.includes('미저장'));
  const buf1 = txt1 ? readTxt(txt1) : Buffer.alloc(0);
  record('TXT 내보내기: 한글 UTF-8 파일로 받고 내용이 화면·서버와 같다', !!txt1 && buf1.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])) && buf1.subarray(3).toString('utf8') === oneDuring && txt1.includes('1화') && (await p.evaluate(`document.querySelector('.wr-main').textContent.includes('서버에 저장된 내용과 같습니다')`)), { file: txt1 });

  // 저장 실패 상태: 무엇이 담겼는지 속이지 않는다.
  chaos.docs = true;
  await p.setCaret(0);
  await p.type('〔저장 못 한 글〕');
  await p.wait(`document.querySelector('.wr-save').dataset.state==='failed'`);
  const unsavedText = '〔저장 못 한 글〕' + oneDuring;
  await p.mouseClick('화면의 글 TXT로 받기', '.wr-status');
  const txt2 = await waitFile((n) => n.endsWith('.txt') && n.includes('미저장포함'));
  const noticeTxt = await p.evaluate(`[...document.querySelectorAll('.wr-main .wr-note')].map(e=>e.textContent).join(' | ')`);
  record('저장 실패 중 TXT: 화면의 미저장 글을 그대로 담고, 미저장임을 밝힌다', !!txt2 && readTxt(txt2).subarray(3).toString('utf8') === unsavedText && noticeTxt.includes('아직 서버에 저장되지 않은 부분') && api.store.getScene(wid, d1).text === oneDuring, { file: txt2 });
  await p.click('내보내기', '.wr-top');
  await p.click('작품 전체 백업 만들기', '.wr-pop');
  await p.wait(`[...document.querySelectorAll('.wr-main .wr-note')].some(e=>e.textContent.includes('다 담기지 않았습니다'))`);
  const partialNote = await p.evaluate(`[...document.querySelectorAll('.wr-main .wr-note')].find(e=>e.textContent.includes('다 담기지 않았습니다')).textContent`);
  await p.screenshot('09-backup-while-unsaved.png');
  record('저장 실패 중 백업: 담기지 않은 것을 밝히고 TXT 구조 방법을 알려 준다', partialNote.includes('서버에 저장된 마지막 내용까지만') && partialNote.includes('TXT로 받기'), { partialNote });
  chaos.docs = false;
  await p.click('지금 다시 시도', '.wr-status');
  await p.saved();

  // 판·메모를 채운 뒤 온전한 백업.
  await p.click('판', '.wr-top');
  await p.input('.wr-drawer input[aria-label="판 이름"]', '백업 전 초고');
  await p.click('판 남기기', '.wr-drawer');
  await p.wait(`document.querySelector('.wr-drawer').textContent.includes('판으로 남겼습니다')`);
  await p.click('메모', '.wr-top');
  await p.wait(`document.querySelector('.wr-drawer textarea') && !document.querySelector('.wr-drawer textarea').readOnly`);
  const noteText = '해원: 야간 당직 3년 차. 도윤의 누나.';
  await p.input('.wr-drawer textarea', noteText);
  await p.wait(`document.querySelector('.wr-drawer [role="status"]').textContent.includes('저장됨')`);
  await p.click('닫기', '.wr-drawer');
  for (const n of fs.readdirSync(path.join(backupRoot, wid))) fs.renameSync(path.join(backupRoot, wid, n), path.join(backupRoot, wid, 'partial-' + n));
  await p.click('내보내기', '.wr-top');
  await p.click('작품 전체 백업 만들기', '.wr-pop');
  await p.wait(`[...document.querySelectorAll('.wr-main .wr-note')].some(e=>e.textContent.includes('작품 전체를 백업했습니다'))`);
  const backupNote = await p.evaluate(`[...document.querySelectorAll('.wr-main .wr-note')].find(e=>e.textContent.includes('작품 전체를 백업했습니다')).textContent`);
  const backupFile = path.join(backupRoot, wid, fs.readdirSync(path.join(backupRoot, wid)).find((n) => n.startsWith('backup-')));
  const bundle = checkBundle(JSON.parse(fs.readFileSync(backupFile, 'utf8')));
  const restoreRoot = path.join(out, 'restored-into-new-folder');
  fs.rmSync(restoreRoot, { recursive: true, force: true });
  restoreBackup(bundle, restoreRoot);
  const report = compareWork(dataRoot, restoreRoot, wid);
  const restored = createStore(restoreRoot);
  const original = api.store;
  const sameIdsOrder = J(restored.getWork(wid).docs) === J(original.getWork(wid).docs) && J(restored.getWork(wid).removed) === J(original.getWork(wid).removed);
  const sameBodies = [...original.getWork(wid).docs, ...original.getWork(wid).removed].every((d) => restored.getScene(wid, d.id).text === original.getScene(wid, d.id).text);
  record('작품 전체 백업: 원고 폴더 밖에 쓰고, 새 빈 폴더에 복원하면 ID·순서·내용이 원본과 같다',
    path.relative(dataRoot, backupFile).startsWith('..') && backupNote.includes(backupFile) && report.same && sameIdsOrder && sameBodies && J(restored.getMap(wid)) === J(original.getMap(wid)) && J(restored.getNotes(wid)) === J(original.getNotes(wid)) && J(restored.listVersions(wid, d1)) === J(original.listVersions(wid, d1)) && J(restored.listRecovery(wid, d1)) === J(original.listRecovery(wid, d1)) && bundle.counts.versions >= 1 && bundle.counts.recovery >= 3 && bundle.counts.cards === 6 && bundle.counts.links === 5 && bundle.counts.mapRecovery >= 1,
    { backupFile, restoreRoot, counts: bundle.counts, differences: report.differences });
  fs.writeFileSync(path.join(out, 'backup-restore-report.json'), J({ backupFile, restoreRoot, report }, null, 2));

  // ══ 8-2. 영상 제작 도구(대본·컷 보드)는 집필과 따로 ═══════════════════════
  const bridgeUp = await fetch('http://127.0.0.1:3002/').then(() => true, () => false);
  await p.evaluate(`location.hash='#cuts'`);
  await p.wait(`document.body.textContent.includes('집필로 돌아가기')`, 20000);
  const tool = await p.evaluate(`({ text: document.body.textContent.replace(/\s+/g,' ').slice(0, 220), back: !!document.querySelector('a[href="#write"]') })`);
  await p.screenshot('11-production-tool.png');
  await p.evaluate(`[...document.querySelectorAll('a[href="#write"]')].pop().click()`);
  await p.wait(`document.querySelector(${J(BODY)}) && !document.querySelector(${J(BODY)}).readOnly && document.querySelector('.wr-save').dataset.state==='saved'`);
  record('대본·컷 보드: 쓸 수 없으면 짧은 설명과 "집필로 돌아가기"를 보여 주고, 돌아오면 원고가 그대로다',
    tool.back && (bridgeUp ? tool.text.includes('연결되어 있지 않습니다') : tool.text.includes('지금은 쓸 수 없습니다')) && !(await fetch('http://127.0.0.1:3002/').then(() => !bridgeUp, () => false)) && (await p.text()).length > 0,
    { bridgeWasRunning: bridgeUp, tool });

  // ══ 9. 끄고 다시 열기 ═══════════════════════════════════════════════════
  await p.evaluate(`[...document.querySelectorAll('.wr-side .wr-row')].find(e=>e.textContent.trim()==='2화').click()`);
  await p.wait(`document.querySelector(${J(BODY)})?.value===${J(twoMore)}`);
  const lastCaret = twoMore.indexOf('도윤은');
  await p.setCaret(lastCaret);
  await p.type('(다시 열기 전 마지막 문장) ');
  await p.saved();
  const twoFinal = twoMore.slice(0, lastCaret) + '(다시 열기 전 마지막 문장) ' + twoMore.slice(lastCaret);
  await sleep(500);
  await p.send('Page.close');
  await stopServers();
  await sleep(300);
  await startServers();
  const r = await newPage();
  const reopened = { title: await r.title(), text: await r.text(), caret: await r.caret(), focused: await r.evaluate(`document.activeElement===document.querySelector(${J(BODY)})`) };
  await r.click('메모', '.wr-top');
  await r.wait(`document.querySelector('.wr-drawer textarea') && !document.querySelector('.wr-drawer textarea').readOnly`);
  reopened.note = await r.evaluate(`document.querySelector('.wr-drawer textarea').value`);
  await openMap(r);
  await selectCard(r, '해원');
  const again = await highlight(r);
  await r.screenshot('10-reopened-map.png');
  record('앱과 저장 서버를 끄고 다시 열면 마지막 작품·회차·글·커서·메모·관계가 그대로다',
    reopened.title.includes('2화') && reopened.text === twoFinal && reopened.caret === lastCaret + '(다시 열기 전 마지막 문장) '.length && reopened.focused && reopened.note === noteText && J(again.neighbours) === J(['사건:정전 사건', '인물:도윤']) && J(again.activeLines.map((l) => l.label)) === J(['남매', '목격했다']),
    { reopened: { ...reopened, text: `${reopened.text.length}자` }, again });

  // ══ 10. 작가가 할 일 그대로: 쓰던 회차에서 자료 찾기 → 지도 → 관련 회차 → 쓰던 곳으로 (390 · 580 · 1280) ══
  await r.click('닫기', '.wr-drawer');
  const flows = {};
  for (const width of [390, 580, 1280]) flows[width] = await authorFlow(r, width);

  // ══ 11. 시험 서버와 앱을 다시 열기: 마지막 문장이 남는다 ════════════════════
  const last = flows[1280];
  await sleep(600);
  await r.send('Page.close');
  await stopServers();
  await sleep(300);
  await startServers();
  const s = await newPage();
  const back = { title: await s.title(), text: await s.text(), caret: await s.caret(), state: await s.state() };
  await openRefs(s);
  await s.wait(`document.querySelector('${REFS} [data-ref-section="linked"] .wr-row.card')`);
  back.linked = await refRows(s, '[data-ref-section="linked"]');
  await s.input(`${REFS} input[type="search"]`, '정전');
  await s.wait(`document.querySelector('${REFS} [data-ref-results="정전"] .wr-h')`);
  back.found = await refRows(s, '[data-ref-results]');
  await s.click('닫기', '.wr-drawer');
  record('다시 열기: 마지막 작품·2화·마지막 문장·커서가 남고, 자료와 찾기도 그대로다',
    back.title.includes('2화') && back.text === last.text && back.text.endsWith(last.lastSentence + last.tail) && back.caret === last.caret && back.state === 'saved' && api.store.getScene(last.wid, last.d2).text === last.text && J(back.linked) === J(['사건:정전 사건', '자료:당직 일지']) && J(back.found) === J(['회차:1화', '회차:2화', '사건:정전 사건', '자료:당직 일지']),
    { ...back, text: `${back.text.length}자`, expectedCaret: last.caret });

  // ══ 12. 저장 실패 중에도 화면의 글을 UTF-8 TXT로 꺼낸다 ════════════════════
  chaos.docs = true;
  await s.setCaret(last.caret);
  await s.type('〔저장이 안 되는 동안 쓴 문장〕');
  await s.wait(`document.querySelector('.wr-save').dataset.state==='failed'`);
  const screenText = await s.text();
  await s.mouseClick('화면의 글 TXT로 받기', '.wr-status');
  let rescued = null;
  for (let i = 0; i < 80 && !rescued; i++) { rescued = fs.readdirSync(downloads).find((n) => n.includes('2화') && n.includes('미저장포함') && n.endsWith('.txt')) ?? null; if (!rescued) await sleep(100); }
  const rescuedBuf = rescued ? fs.readFileSync(path.join(downloads, rescued)) : Buffer.alloc(0);
  let rescuedText = '';
  try { rescuedText = new TextDecoder('utf-8', { fatal: true }).decode(rescuedBuf.subarray(3)); } catch { rescuedText = '(UTF-8이 아님)'; }
  const rescueNote = await s.evaluate(`[...document.querySelectorAll('.wr-main .wr-note')].map(e=>e.textContent).join(' | ')`);
  await s.screenshot('16-save-failed-txt.png');
  record('저장 실패 중: 화면의 글을 UTF-8 TXT로 꺼낸다(서버에는 아직 없음을 밝힌다)',
    !!rescued && rescuedBuf.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])) && rescuedText === screenText && screenText.includes('〔저장이 안 되는 동안 쓴 문장〕') && rescueNote.includes('아직 서버에 저장되지 않은 부분') && api.store.getScene(last.wid, last.d2).text === last.text,
    { file: rescued, chars: rescuedText.length });
  chaos.docs = false;
  await s.click('지금 다시 시도', '.wr-status');
  await s.saved();
  record('저장이 다시 되면 그 문장이 서버에 남는다', api.store.getScene(last.wid, last.d2).text === screenText);

  // ══ 13. 작품 백업 → 별도 빈 폴더에 복원 → 하나씩 견주기 ═══════════════════
  // 판 하나, 되돌리기(복구본), 메모, 뺀 회차를 만든 뒤 백업한다.
  await s.click('판', '.wr-top');
  await s.input('.wr-drawer input[aria-label="판 이름"]', '시연 초고');
  await s.click('판 남기기', '.wr-drawer');
  await s.wait(`document.querySelector('.wr-drawer').textContent.includes('판으로 남겼습니다')`);
  await s.click('닫기', '.wr-drawer');
  await s.setCaret(0);
  await s.type('〔판을 남긴 뒤 고친 글〕');
  await s.saved();
  await s.click('판', '.wr-top');
  await s.wait(`[...document.querySelectorAll('.wr-drawer .wr-row.card')].some(e=>e.textContent.includes('시연 초고'))`);
  await s.evaluate(`[...document.querySelectorAll('.wr-drawer .wr-row.card')].find(e=>e.textContent.includes('시연 초고')).click()`);
  await s.wait(`[...document.querySelectorAll('.wr-drawer button')].some(b=>b.textContent.trim()==='이 내용으로 되돌리기' && !b.disabled)`);
  await s.click('이 내용으로 되돌리기', '.wr-drawer');
  await s.wait(`document.querySelector(${J(BODY)})?.value===${J(screenText)} && !document.querySelector(${J(BODY)}).readOnly`);
  await s.click('메모', '.wr-top');
  await s.wait(`document.querySelector('.wr-drawer textarea') && !document.querySelector('.wr-drawer textarea').readOnly`);
  await s.input('.wr-drawer textarea', '해원: 야간 당직. 도윤의 누나.\n정전의 밤에 창가에 있었다.');
  await s.wait(`document.querySelector('.wr-drawer [role="status"]').textContent.includes('저장됨')`);
  await s.click('닫기', '.wr-drawer');
  await s.click('목록', '.wr-top');
  await s.wait(`document.querySelector('.wr-side')`);
  await s.click('+ 새 원고', '.wr-side');
  await s.wait(`document.querySelector('.wr-title').textContent.includes('3화') && !document.querySelector(${J(BODY)})?.readOnly`);
  await s.input(BODY, '3화 샘플. 목록에서 뺄 회차.');
  await s.saved();
  await s.click('빼기', '.wr-side');
  await s.wait(`document.querySelector('.wr-side').textContent.includes('뺀 원고 1편')`);
  await s.saved();
  await s.click('목록', '.wr-top');
  await s.click('내보내기', '.wr-top');
  await s.click('작품 전체 백업 만들기', '.wr-pop');
  await s.wait(`[...document.querySelectorAll('.wr-main .wr-note')].some(e=>e.textContent.includes('작품 전체를 백업했습니다'))`);
  const demoBackup = path.join(backupRoot, last.wid, fs.readdirSync(path.join(backupRoot, last.wid)).find((n) => n.startsWith('backup-')));
  const demoBundle = checkBundle(JSON.parse(fs.readFileSync(demoBackup, 'utf8')));
  const demoRestore = path.join(out, 'restored-demo-into-new-folder');
  fs.rmSync(demoRestore, { recursive: true, force: true });
  restoreBackup(demoBundle, demoRestore);
  const demoReport = compareWork(dataRoot, demoRestore, last.wid);
  const A = api.store;
  const B = createStore(demoRestore);
  const wA = A.getWork(last.wid);
  const wB = B.getWork(last.wid);
  const allDocs = [...wA.docs, ...wA.removed];
  const same = {
    order: J(wA.docs) === J(wB.docs) && wA.docs.length === 2,
    removed: J(wA.removed) === J(wB.removed) && wA.removed.length === 1,
    bodies: allDocs.every((d) => J(A.getScene(last.wid, d.id)) === J(B.getScene(last.wid, d.id))) && B.getScene(last.wid, last.d2).text === screenText && B.getScene(last.wid, wA.removed[0].id).text === '3화 샘플. 목록에서 뺄 회차.',
    notes: J(A.getNotes(last.wid)) === J(B.getNotes(last.wid)) && B.getNotes(last.wid).characters.includes('도윤의 누나'),
    versions: allDocs.every((d) => J(A.listVersions(last.wid, d.id)) === J(B.listVersions(last.wid, d.id)) && A.listVersions(last.wid, d.id).every((v) => A.getVersion(last.wid, d.id, v.n).text === B.getVersion(last.wid, d.id, v.n).text)) && B.listVersions(last.wid, last.d2).length === 1,
    recovery: allDocs.every((d) => J(A.listRecovery(last.wid, d.id)) === J(B.listRecovery(last.wid, d.id)) && A.listRecovery(last.wid, d.id).every((x) => A.getRecovery(last.wid, d.id, x.key).text === B.getRecovery(last.wid, d.id, x.key).text)) && B.listRecovery(last.wid, last.d2).some((x) => x.reason === 'restore' && B.getRecovery(last.wid, last.d2, x.key).text.startsWith('〔판을 남긴 뒤 고친 글〕')),
    cards: J(A.getMap(last.wid).cards) === J(B.getMap(last.wid).cards) && B.getMap(last.wid).cards.length === 6,
    links: J(A.getMap(last.wid).links) === J(B.getMap(last.wid).links) && sameSet(B.getMap(last.wid).links.map((l) => l.label), ['남매', '드러낸다', '뒷받침한다', '목격했다', '서로 어긋난다']),
  };
  record('백업을 별도 빈 폴더에 복원하면 회차 순서·본문·메모·판·복구본·뺀 회차·카드·관계가 원본과 같다',
    path.relative(dataRoot, demoBackup).startsWith('..') && demoReport.same && demoReport.differences.length === 0 && Object.values(same).every(Boolean),
    { backupFile: demoBackup, restoreRoot: demoRestore, same, counts: demoBundle.counts, differences: demoReport.differences });
  fs.writeFileSync(path.join(out, 'backup-restore-demo-report.json'), J({ backupFile: demoBackup, restoreRoot: demoRestore, same, report: demoReport }, null, 2));

  if (results.some((row) => !row.passed)) process.exitCode = 1;
} catch (error) {
  errors.push(error.stack ?? String(error));
  console.error(error.stack);
  process.exitCode = 1;
} finally {
  if (errors.length) process.exitCode = 1;
  fs.writeFileSync(path.join(out, 'ui-results.json'), J({ checkedAt: new Date().toISOString(), repo, dataRoot, backupRoot, imeNote: '한글 조합은 브라우저 조합 이벤트를 흉내 낸 것. 실제 OS 한글 입력기로 치지 않았다.', passed: results.filter((x) => x.passed).length, failed: results.filter((x) => !x.passed).length, results, errors }, null, 2));
  for (const connection of connections) connection.close();
  if (browser) browser.kill();
  await stopServers().catch(() => undefined);
  console.log(`통과 ${results.filter((x) => x.passed).length} · 실패 ${results.filter((x) => !x.passed).length} · 오류 ${errors.length}`);
  console.log('Review output:', out);
}
