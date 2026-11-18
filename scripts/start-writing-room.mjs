import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/*
 * 온서사 집필실 실행. scripts/start-writing-room.cmd(바탕화면 바로가기)가 부른다.
 *
 *   (인자 없음)  실제 원고   %USERPROFILE%\OnseosaData         저장 서버 3004 / 화면 5173
 *   test         시험 저장소 %USERPROFILE%\OnseosaData-test    저장 서버 3014 / 화면 5183
 *   review       검수 저장소 %USERPROFILE%\OnseosaData-review  저장 서버 3034 / 화면 5203
 *
 * 지키는 것
 * - 세 모드는 원고 폴더와 포트가 따로다. 이 스크립트가 원고 폴더를 직접 지정한다(기본값에 기대지 않는다).
 * - 저장 서버와 화면이 둘 다 응답하고, 그 저장 서버가 "이 모드의 원고 폴더"를 쓰고 있다고 답할 때만 브라우저를 연다.
 * - 포트를 다른 프로그램이 쓰고 있어도 끄지 않는다. 무엇이 문제인지와 다시 하는 방법을 알려 주고 멈춘다.
 * - 이미 제대로 켜져 있으면 브라우저만 연다.
 *
 * 환경 변수(검수용): STUDIO_NO_BROWSER=1 이면 브라우저를 열지 않는다. STUDIO_REVIEW_ROOT 로 검수 폴더를 바꾼다.
 */

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const home = os.homedir();
const API_VERSION = 3;
const WAIT_MS = 60000;

const MODES = {
  real: { name: '실제 원고', port: 3004, ui: 5173, root: path.join(home, 'OnseosaData'), label: '' },
  test: { name: '시험 저장소', port: 3014, ui: 5183, root: path.join(home, 'OnseosaData-test'), label: '시험 저장소' },
  review: { name: '검수 저장소', port: 3034, ui: 5203, root: process.env.STUDIO_REVIEW_ROOT || path.join(home, 'OnseosaData-review'), label: '검수 저장소' },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const samePath = (a, b) => path.resolve(String(a)).toLowerCase() === path.resolve(String(b)).toLowerCase();

class Stop extends Error {}

// 주소를 불러 본다. free: 아무도 듣지 않음 · ours: 기대한 저장 서버 · stale: 저장 서버지만 예전 것이거나 다른 폴더 · other: 다른 프로그램
async function probe(url, mode) {
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(2500) });
  } catch (e) {
    const code = e?.cause?.code ?? '';
    if (code === 'ECONNREFUSED' || code === 'ECONNRESET') return { state: 'free' };
    return { state: 'busy', detail: e?.cause?.message ?? e.message }; // 듣고는 있으나 답이 없다(막 켜지는 중일 수 있다)
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* JSON이 아니다 */
  }
  if (!res.ok || !data || data.ok !== true || typeof data.dataRoot !== 'string') return { state: 'other', detail: `HTTP ${res.status}` };
  if (!samePath(data.dataRoot, mode.root)) return { state: 'stale', detail: `다른 원고 폴더(${data.dataRoot})로 켜져 있습니다` };
  if ((data.apiVersion ?? 0) < API_VERSION) return { state: 'stale', detail: '예전 버전의 저장 서버입니다' };
  if ((data.label ?? '') !== mode.label) return { state: 'stale', detail: '다른 모드의 저장 서버입니다' };
  return { state: 'ours', data };
}

function startWindow(title, command, env) {
  const child = spawn('cmd.exe', ['/d', '/s', '/c', `start "${title}" /min cmd /c "${command}"`], {
    cwd: repo,
    env,
    detached: true,
    stdio: 'ignore',
    windowsVerbatimArguments: true,
  });
  child.unref();
}

async function main() {
  const arg = (process.argv[2] ?? '').toLowerCase();
  const key = arg === '' ? 'real' : arg;
  const mode = MODES[key];
  if (!mode) throw new Stop(`모르는 실행 방식입니다: "${process.argv[2]}". 쓸 수 있는 것: (없음) · test · review`);

  const api = `http://127.0.0.1:${mode.port}/api/studio/health`;
  const via = `http://localhost:${mode.ui}/api/studio/health`;
  const page = `http://localhost:${mode.ui}/#write`;
  const env = {
    ...process.env,
    STUDIO_PORT: String(mode.port),
    STUDIO_UI_PORT: String(mode.ui),
    STUDIO_UI_PORTS: String(mode.ui),
    STUDIO_DATA_ROOT: mode.root,
    STUDIO_BACKUP_ROOT: `${mode.root}-backups`,
    STUDIO_LABEL: mode.label,
    STUDIO_TEST: '',
  };

  console.log(`온서사 집필실 (${mode.name})`);
  console.log(`  원고 폴더: ${mode.root}`);
  console.log(`  백업 폴더: ${mode.root}-backups`);

  // 1. 저장 서버
  const server = await probe(api, mode);
  if (server.state === 'other' || server.state === 'stale') {
    throw new Stop(
      `${mode.port}번 포트를 이미 다른 것이 쓰고 있습니다 (${server.detail}).\n` +
        `  끄지 않고 그대로 두었습니다.\n` +
        `  다시 하는 방법: 작업 표시줄에서 "Onseosa manuscript server ${mode.port}" 창을 찾아 닫은 뒤, 바로가기를 다시 실행해 주세요.\n` +
        `  그런 창이 없다면 다른 프로그램이 ${mode.port}번을 쓰는 중입니다. 그 프로그램을 끄거나 PC를 다시 켠 뒤 실행해 주세요.`,
    );
  }
  if (server.state === 'free') {
    console.log('  저장 서버를 켭니다…');
    startWindow(`Onseosa manuscript server ${mode.port}`, 'pnpm --filter studio-server start', env);
  } else if (server.state === 'ours') console.log('  저장 서버는 이미 켜져 있습니다.');

  // 2. 화면
  let screen;
  try {
    const res = await fetch(`http://localhost:${mode.ui}/`, { signal: AbortSignal.timeout(2500) });
    screen = res.ok ? 'up' : 'other';
  } catch (e) {
    screen = ['ECONNREFUSED', 'ECONNRESET'].includes(e?.cause?.code ?? '') ? 'free' : 'busy';
  }
  if (screen === 'free') {
    console.log('  화면을 켭니다…');
    startWindow(`Onseosa writing screen ${mode.ui}`, 'pnpm --filter control-room dev', env);
  } else console.log('  화면 포트는 이미 쓰이고 있습니다. 집필실 화면인지 확인합니다…');

  // 3. 둘 다 "기대한 원고 폴더"로 답할 때까지 기다린다.
  const deadline = Date.now() + WAIT_MS;
  let direct = { state: 'free' };
  let proxied = { state: 'free' };
  while (Date.now() < deadline) {
    direct = await probe(api, mode);
    proxied = direct.state === 'ours' ? await probe(via, mode) : proxied;
    if (direct.state === 'ours' && proxied.state === 'ours') break;
    if (direct.state === 'stale' || direct.state === 'other') break;
    await sleep(1000);
  }
  if (direct.state !== 'ours') {
    throw new Stop(
      `원고 저장 서버가 응답하지 않습니다 (${direct.detail ?? direct.state}). 브라우저를 열지 않았습니다.\n` +
        `  다시 하는 방법: 최소화된 "Onseosa manuscript server ${mode.port}" 창이 있으면 닫고, 바로가기를 다시 실행해 주세요.\n` +
        `  그래도 안 되면 그 창에 적힌 오류를 알려 주세요.`,
    );
  }
  if (proxied.state !== 'ours') {
    throw new Stop(
      `${mode.ui}번 포트의 화면이 이 원고 저장 서버에 연결되어 있지 않습니다 (${proxied.detail ?? proxied.state}). 브라우저를 열지 않았습니다.\n` +
        `  끄지 않고 그대로 두었습니다.\n` +
        `  다시 하는 방법: "Onseosa writing screen ${mode.ui}" 창이 있으면 닫고 바로가기를 다시 실행해 주세요.\n` +
        `  그런 창이 없다면 다른 프로그램이 ${mode.ui}번을 쓰는 중입니다. 그 프로그램을 끈 뒤 다시 실행해 주세요.`,
    );
  }

  console.log(`  준비됐습니다: ${page}`);
  if (!process.env.STUDIO_NO_BROWSER) spawn('cmd.exe', ['/d', '/s', '/c', `start "" "${page}"`], { detached: true, stdio: 'ignore', windowsVerbatimArguments: true }).unref();
}

main().catch((e) => {
  console.error('');
  console.error(e instanceof Stop ? `집필실을 열지 못했습니다.\n  ${e.message}` : `집필실을 여는 중 오류가 났습니다: ${e.stack ?? e}`);
  process.exit(e instanceof Stop ? 2 : 1);
});
