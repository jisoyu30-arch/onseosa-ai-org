import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputArg = process.argv.find(x => x.startsWith('--output='));
const out = outputArg ? path.resolve(outputArg.slice('--output='.length)) : fs.mkdtempSync(path.join(os.tmpdir(), 'writing-safety-'));
fs.mkdirSync(out, { recursive: true });
const require = createRequire(`${repo}/apps/control-room/package.json`);
const { createServer, build } = await import(pathToFileURL(require.resolve('vite')));
const { createStudioServer } = await import(pathToFileURL(`${repo}/apps/studio-server/src/server.mjs`));
const dataRoot = fs.mkdtempSync(path.join(out, 'fixture-data-'));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'writing-audit-browser-'));
const results = [];
const errors = [];
const chaos = { docs: false, notes: false, restoreFail: false, restoreDelay: 0, restoreSeen: false, noteDelay: 0 };
let vite, api, browser;
const connections = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
function record(name, passed, details = {}) {
  const row = { name, passed, ...details };
  results.push(row);
  console.log(JSON.stringify(row));
}
async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let seq = 0;
  const pending = new Map();
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject, timer } = pending.get(message.id);
      pending.delete(message.id); clearTimeout(timer);
      message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
    } else if (message.method === 'Page.javascriptDialogOpening') {
      void send('Page.handleJavaScriptDialog', { accept: true });
    } else if (message.method === 'Runtime.exceptionThrown') {
      errors.push(message.params.exceptionDetails.text);
    }
  };
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++seq;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
      pending.set(id, { resolve, reject, timer });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function wait(expression, timeout = 12000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) { if (await evaluate(`Boolean(${expression})`)) return; await sleep(100); }
    throw new Error(`UI timeout: ${expression}`);
  }
  const page = {
    send, evaluate, wait,
    click: text => evaluate(`(() => { const el=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()===${JSON.stringify(text)}); if(!el)throw Error('Missing button '+${JSON.stringify(text)}); el.click(); })()`),
    input: (selector, text) => evaluate(`(() => {const el=document.querySelector(${JSON.stringify(selector)}); if(!el)throw Error('Missing input'); const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${JSON.stringify(text)}); el.dispatchEvent(new Event('input',{bubbles:true}));})()`),
    screenshot: async name => { const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); fs.writeFileSync(path.join(out, name), Buffer.from(data, 'base64')); },
    reload: async () => {
      await evaluate('window.__writingTestOldDocument = true');
      await send('Page.reload');
      await wait(`!window.__writingTestOldDocument && document.querySelector('textarea[aria-label="본문"]') && !document.querySelector('textarea[aria-label="본문"]').readOnly`);
    },
    close: () => ws.close(),
  };
  connections.push(page);
  await send('Page.enable'); await send('Runtime.enable');
  return page;
}

try {
  process.chdir(`${repo}/apps/control-room`);
  api = createStudioServer({ dataRoot, uiPorts: [5193], label: '검수 전용 샘플' });
  const apiPort = await api.listen(0);
  process.env.STUDIO_UI_PORT = '5193';
  process.env.STUDIO_PORT = String(apiPort);
  vite = await createServer({
    root: `${repo}/apps/control-room`,
    configFile: `${repo}/apps/control-room/vite.config.ts`,
    server: { host: '127.0.0.1', port: 5193, strictPort: true },
    plugins: [{ name: 'review-failure-injection', configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? '';
        if (chaos.restoreFail && req.method === 'POST' && /\/restore$/.test(url)) {
          res.statusCode = 503; res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: '검수용 복원 실패' })); return;
        }
        if (chaos.restoreDelay && req.method === 'POST' && /\/restore$/.test(url)) {
          chaos.restoreSeen = true;
          setTimeout(next, chaos.restoreDelay);
          return;
        }
        const blocked = req.method === 'PUT' && (
          (chaos.notes && /\/notes$/.test(url)) ||
          (chaos.docs && /\/docs\/[^/]+$/.test(url))
        );
        if (!blocked) {
          if (chaos.noteDelay && req.method === 'PUT' && /\/notes$/.test(url)) return setTimeout(next, chaos.noteDelay);
          return next();
        }
        res.statusCode = 503; res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: '검수용 저장 장애', code: 'audit_outage' }));
      });
    } }],
  });
  await vite.listen();
  const browserExe = process.env.WRITING_TEST_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  browser = spawn(browserExe, [
    '--headless=new', '--disable-gpu', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking', 'about:blank',
  ], { windowsHide: true, stdio: 'ignore' });
  const activePort = path.join(profile, 'DevToolsActivePort');
  for (let i=0; i<100 && !fs.existsSync(activePort); i++) await sleep(100);
  const debugPort = Number(fs.readFileSync(activePort, 'utf8').split('\n')[0]);
  async function newPage() {
    const target = await (await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' })).json();
    const page = await connect(target.webSocketDebuggerUrl);
    await page.send('Emulation.setDeviceMetricsOverride', { width: 1365, height: 900, deviceScaleFactor: 1, mobile: false });
    await page.send('Page.navigate', { url: 'http://127.0.0.1:5193/#write' });
    await page.wait(`document.querySelector('textarea[aria-label="본문"]') && !document.querySelector('textarea[aria-label="본문"]').readOnly`);
    return page;
  }
  const p = await newPage();
  const body = 'textarea[aria-label="본문"]';
  const baseline = '검수용 첫 문장입니다.\n한글 원고와 줄바꿈, 따옴표 “온서사”를 확인합니다. 🌙';
  await p.input(body, baseline);
  await p.wait(`document.querySelector('.wr-status').textContent.includes('저장됨')`);
  const wid = api.store.listWorks()[0].id;
  const did = api.store.getWork(wid).docs[0].id;
  record('첫 글 자동 생성·저장', api.store.getScene(wid, did).text === baseline);
  await p.reload();
  record('새로고침 후 본문 복원', await p.evaluate(`document.querySelector(${JSON.stringify(body)}).value===${JSON.stringify(baseline)}`));
  await p.screenshot('01-desktop.png');

  await p.click('판');
  await p.input('input[aria-label="판 이름"]', '검수 초고');
  await p.click('판 남기기');
  await p.wait(`document.querySelector('.wr-drawer').textContent.includes('1판으로 남겼습니다')`);
  await p.input(body, baseline + '\n두 번째 판의 문장.');
  await p.wait(`document.querySelector('.wr-status').textContent.includes('저장됨')`);
  await p.evaluate(`document.querySelector('.wr-row.card').click()`);
  await p.click('이 내용으로 되돌리기');
  await p.wait(`document.querySelector(${JSON.stringify(body)}).value===${JSON.stringify(baseline)}`);
  const recovery = api.store.listRecovery(wid, did);
  record('판 복원·복원 직전 글 보존', api.store.getScene(wid, did).text === baseline && recovery.some(x => x.reason === 'restore'));

  await p.input(body, baseline + '\n판 복원 전 현재 글.');
  await p.wait(`document.querySelector('.wr-status').textContent.includes('저장됨')`);
  await p.evaluate(`document.querySelector('.wr-row.card').click()`);
  chaos.restoreDelay = 1000;
  await p.click('이 내용으로 되돌리기');
  for (let i=0; i<50 && !chaos.restoreSeen; i++) await sleep(50);
  if (!chaos.restoreSeen) throw Error('Restore request did not arrive');
  const duringRestore = '이전 판 복원을 기다리는 동안 추가한 새 문장.';
  const restoreLocked = await p.evaluate(`document.querySelector(${JSON.stringify(body)}).readOnly`);
  const beforeAttempt = await p.evaluate(`document.querySelector(${JSON.stringify(body)}).value`);
  await p.evaluate(`document.querySelector(${JSON.stringify(body)}).focus()`);
  await p.send('Input.insertText', { text: duringRestore });
  const whileRestoring = await p.evaluate(`document.querySelector(${JSON.stringify(body)}).value`);
  await sleep(1500);
  chaos.restoreDelay = 0;
  const afterRestore = await p.evaluate(`document.querySelector(${JSON.stringify(body)}).value`);
  record('판 복원 대기 중 실제 키 입력 차단·복원 완료', restoreLocked && whileRestoring===beforeAttempt && afterRestore===baseline, { readonly:restoreLocked, before:beforeAttempt, attempted:duringRestore, during:whileRestoring, after:afterRestore });
  await p.screenshot('02-restore-locked.png');
  const afterRestoreTyping = baseline + '\n복원 뒤에는 정상 입력됩니다.';
  await p.input(body, afterRestoreTyping);
  await p.wait(`document.querySelector('.wr-status').textContent.includes('저장됨')`);
  record('판 복원 후 입력·자동 저장 재개', api.store.getScene(wid,did).text===afterRestoreTyping && await p.evaluate(`!document.querySelector(${JSON.stringify(body)}).readOnly`));

  await p.evaluate(`document.querySelector('.wr-row.card').click()`);
  chaos.restoreFail = true;
  await p.click('이 내용으로 되돌리기');
  await p.wait(`document.querySelector('.wr-drawer').textContent.includes('검수용 복원 실패')`);
  chaos.restoreFail = false;
  record('판 복원 실패 시 현재 원고·입력 상태 보존', await p.evaluate(`document.querySelector(${JSON.stringify(body)}).value===${JSON.stringify(afterRestoreTyping)} && !document.querySelector(${JSON.stringify(body)}).readOnly`) && api.store.getScene(wid,did).text===afterRestoreTyping);
  await p.click('닫기');

  chaos.docs = true;
  const offlineText = baseline + '\n서버가 꺼진 동안 쓴 원고.';
  await p.input(body, offlineText);
  await p.wait(`document.querySelector('.wr-status').textContent.includes('저장 실패')`);
  chaos.docs = false;
  await p.reload();
  await p.wait(`document.querySelector('.wr-status').textContent.includes('저장됨')`);
  record('본문 저장 실패 후 새로고침 복구', api.store.getScene(wid, did).text === offlineText);

  const p2 = await newPage();
  await p.input(body, '탭 A에서 저장한 원고.');
  await p.wait(`document.querySelector('.wr-status').textContent.includes('저장됨')`);
  await p2.input(body, '탭 B에서 보존할 원고.');
  await p2.wait(`document.querySelector('.wr-conflict')`);
  record('동시 편집 충돌 경고', api.store.getScene(wid, did).text === '탭 A에서 저장한 원고.');
  await p2.click('내 글로 저장');
  await p2.wait(`document.querySelector('.wr-status').textContent.includes('저장됨')`);
  record('충돌 선택 후 상대 원고 보존', api.store.listRecovery(wid,did).some(x => x.reason==='overwrite' && api.store.getRecovery(wid,did,x.key).text==='탭 A에서 저장한 원고.'));

  await p.reload();
  await p.evaluate(`(() => {const original=window.fetch; window.fetch=(input,init)=>{if(init?.method==='PUT' && /\\/docs\\/[^/]+$/.test(String(input)))return Promise.reject(new Error('검수용 탭 A 통신 실패')); return original(input,init);};})()`);
  const tabADraft = '탭 A의 저장되지 않은 중요한 초고.';
  await p.input(body, tabADraft);
  await p.wait(`document.querySelector('.wr-status').textContent.includes('저장 실패')`);
  const sharedKey = `ons-write:draft:${wid}:${did}`;
  const draftBeforeOtherSave = await p.evaluate(`Object.entries(localStorage).filter(([k])=>k.startsWith(${JSON.stringify(sharedKey)}))`);
  await p2.input(body, '탭 B의 정상 저장 내용.');
  await p2.wait(`document.querySelector('.wr-status').textContent.includes('저장됨')`);
  const draftAfterOtherSave = await p.evaluate(`Object.entries(localStorage).filter(([k])=>k.startsWith(${JSON.stringify(sharedKey)}))`);
  await p.reload();
  const afterTabReload = await p.evaluate(`document.querySelector(${JSON.stringify(body)}).value`);
  record('다른 탭 저장 후 실패 탭 임시 원고 보존', afterTabReload===tabADraft && draftAfterOtherSave.some(([,raw])=>JSON.parse(raw).text===tabADraft), { beforeDraft: draftBeforeOtherSave, afterDraft: draftAfterOtherSave, expected:tabADraft, actual:afterTabReload });
  record('복구된 임시 원고와 서버 원고 충돌 유지', await p.evaluate(`!!document.querySelector('.wr-conflict')`) && api.store.getScene(wid,did).text==='탭 B의 정상 저장 내용.');
  await p.screenshot('03-tab-draft-preserved.png');
  await p.reload();
  record('미해결 충돌을 새로고침해도 양쪽 유지', await p.evaluate(`document.querySelector(${JSON.stringify(body)}).value===${JSON.stringify(tabADraft)} && !!document.querySelector('.wr-conflict')`) && api.store.getScene(wid,did).text==='탭 B의 정상 저장 내용.');
  await p.click('내 글로 저장');
  await p.wait(`document.querySelector('.wr-status').textContent.includes('저장됨')`);
  record('복구 초안 선택 후 서버 저장', api.store.getScene(wid,did).text===tabADraft);
  await p2.send('Page.close');
  await p.reload();

  await p.click('목록');
  await p.click('+ 새 원고');
  await p.wait(`document.querySelector('.wr-title').textContent.includes('2화') && !document.querySelector(${JSON.stringify(body)}).readOnly`);
  await p.input(body, '둘째 원고 검수 내용.');
  await p.wait(`document.querySelector('.wr-status').textContent.includes('저장됨')`);
  const secondId = api.store.getWork(wid).docs[1].id;
  await p.click('빼기');
  await p.wait(`document.querySelector('.wr-side').textContent.includes('내용 보기')`);
  await p.click('되돌리기');
  await p.wait(`document.querySelectorAll('.wr-side .wr-row').length>=3`);
  record('목록에서 빼기·복원', api.store.getWork(wid).docs.some(d=>d.id===secondId) && api.store.getScene(wid,secondId).text==='둘째 원고 검수 내용.');

  await p.click('메모');
  await p.wait(`!document.querySelector('.wr-drawer textarea').readOnly`);
  chaos.notes = true;
  const note = '서버 중단 중 작성한 인물 설정 — 보존되어야 하는 메모.';
  const noteBody = { characters:note, world:'오프라인에서 작성한 세계관.', threads:'오프라인에서 작성한 복선.' };
  for (const [index,text] of Object.values(noteBody).entries()) await p.input(`.wr-drawer label:nth-of-type(${index+1}) textarea`, text);
  await p.wait(`document.querySelector('.wr-drawer [role="status"]').textContent.includes('저장 실패')`);
  await p.screenshot('04-note-save-failed.png');
  await p.click('닫기');
  await sleep(200);
  await p.click('메모');
  await p.wait(`!document.querySelector('.wr-drawer textarea').readOnly`);
  const readNoteValues = () => p.evaluate(`[...document.querySelectorAll('.wr-drawer textarea')].map(el=>el.value)`);
  const reloadedNote = await readNoteValues();
  record('서버 장애가 계속되어도 메모 닫기·재열기 보존', JSON.stringify(reloadedNote)===JSON.stringify(Object.values(noteBody)), {expected:noteBody,actual:reloadedNote});
  await p.reload();
  await p.click('메모');
  await p.wait(`!document.querySelector('.wr-drawer textarea').readOnly`);
  record('새로고침 뒤 인물·설정·복선 복구', JSON.stringify(await readNoteValues())===JSON.stringify(Object.values(noteBody)));
  chaos.notes = false;
  await p.wait(`document.querySelector('.wr-drawer [role="status"]').textContent.includes('저장됨')`);
  record('통신 복구 후 메모 자동 재저장', Object.entries(noteBody).every(([k,v])=>api.store.getNotes(wid)[k]===v));
  await p.screenshot('05-notes-recovered.png');

  chaos.noteDelay = 800;
  await p.input('.wr-drawer textarea', '첫 번째 수정');
  await p.wait(`document.querySelector('.wr-drawer [role="status"]').textContent==='저장 중'`);
  await p.input('.wr-drawer textarea', '저장 중 추가한 두 번째 수정');
  await p.wait(`document.querySelector('.wr-drawer [role="status"]').textContent.includes('저장됨')`);
  chaos.noteDelay = 0;
  record('메모 저장 도중 추가 입력까지 순서대로 저장', api.store.getNotes(wid).characters==='저장 중 추가한 두 번째 수정');

  // 기존 형식으로 남아 있는 초안도 새 키로 안전하게 가져온다.
  await p.click('닫기');
  const legacyText = '구형 브라우저 임시 초안도 지키는 회귀 시험.';
  const currentScene = api.store.getScene(wid,did);
  await p.evaluate(`localStorage.setItem(${JSON.stringify(sharedKey)}, JSON.stringify(${JSON.stringify({text:legacyText,baseRev:currentScene.rev,at:new Date().toISOString()})}))`);
  await p.reload();
  await p.wait(`document.querySelector('.wr-status').textContent.includes('저장됨')`);
  record('구형 단일 키 임시 원고 복구·재저장', api.store.getScene(wid,did).text===legacyText);

  // 두 탭의 메모도 독립적으로 남으며 재개할 때 서버 변경을 덮지 않는다.
  const p3 = await newPage();
  await p.click('메모');
  await p3.click('메모');
  await p.wait(`!document.querySelector('.wr-drawer textarea').readOnly`);
  await p3.wait(`!document.querySelector('.wr-drawer textarea').readOnly`);
  await p.evaluate(`(() => {const original=window.fetch; window.fetch=(input,init)=>{if(init?.method==='PUT' && /\\/notes$/.test(String(input)))return Promise.reject(new Error('검수용 메모 통신 실패')); return original(input,init);};})()`);
  const localNote = '탭 A에서 실패해도 남아야 할 메모';
  await p.input('.wr-drawer textarea', localNote);
  await p.wait(`document.querySelector('.wr-drawer [role="status"]').textContent.includes('저장 실패')`);
  await p3.input('.wr-drawer textarea', '탭 B에서 정상 저장한 메모');
  await p3.wait(`document.querySelector('.wr-drawer [role="status"]').textContent.includes('저장됨')`);
  await p.reload();
  await p.click('메모');
  await p.wait(`!document.querySelector('.wr-drawer textarea').readOnly`);
  record('두 탭의 메모 저장 실패·복구 충돌 보존', await p.evaluate(`document.querySelector('.wr-drawer textarea').value===${JSON.stringify(localNote)} && !!document.querySelector('.wr-drawer .wr-conflict')`) && api.store.getNotes(wid).characters==='탭 B에서 정상 저장한 메모');
  await p.reload();
  await p.click('메모');
  await p.wait(`!!document.querySelector('.wr-drawer .wr-conflict')`);
  record('메모 충돌을 새로고침해도 서버 내용 자동 덮어쓰기 방지', api.store.getNotes(wid).characters==='탭 B에서 정상 저장한 메모' && await p.evaluate(`document.querySelector('.wr-drawer textarea').value===${JSON.stringify(localNote)}`));
  await p.click('다른 곳의 메모 쓰기');
  await p.wait(`!document.querySelector('.wr-drawer .wr-conflict')`);
  record('메모 충돌에서 선택하지 않은 내 메모 서버 보관', api.store.listNotesRecovery(wid).some(n=>n.reason==='stash' && n.characters===localNote));
  await p3.send('Page.close');

  // 브라우저 저장이 막힌 경우 안전망이 없다는 사실을 숨기지 않는다.
  await p.evaluate(`window.__writingOriginalSetItem=Storage.prototype.setItem; Storage.prototype.setItem=function(){throw new DOMException('검수용 용량 초과','QuotaExceededError')}`);
  await p.input('.wr-drawer textarea', '임시 저장 공간 부족 시험');
  await p.wait(`document.querySelector('.wr-drawer [role="alert"]')`);
  record('메모 임시 저장 공간 부족 경고', await p.evaluate(`document.querySelector('.wr-drawer [role="alert"]').textContent.includes('임시 보관')`));
  await p.evaluate(`Storage.prototype.setItem=window.__writingOriginalSetItem`);
  await p.wait(`document.querySelector('.wr-drawer [role="status"]').textContent.includes('저장됨')`);
  await p.screenshot('06-notes-storage-warning.png');

  await build({ root: `${repo}/apps/control-room`, configFile: `${repo}/apps/control-room/vite.config.ts`, build: { outDir: path.join(out, 'build'), emptyOutDir: false }, logLevel: 'warn' });
  record('화면 번들 빌드', true);
  if (results.some(row=>!row.passed)) process.exitCode = 1;
} catch (error) {
  errors.push(error.stack ?? String(error));
  console.error(error.stack);
  process.exitCode = 1;
} finally {
  fs.writeFileSync(path.join(out, 'ui-results.json'), JSON.stringify({ checkedAt: new Date().toISOString(), repo, dataRoot, results, errors }, null, 2));
  for (const connection of connections) connection.close();
  if (browser) browser.kill();
  if (vite) await vite.close();
  if (api) await api.close();
  console.log('Review output:', out);
}
