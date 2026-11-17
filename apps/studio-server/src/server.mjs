import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore, StoreError } from './store.mjs';
import { defaultBackupRoot, writeBackup } from './backup.mjs';

/*
 * 온서사 집필실 원고 저장 서버.
 *
 * - 이 PC(127.0.0.1)에만 열린다. 다른 사이트가 부를 수 있게 하는 CORS 응답은 내지 않는다.
 * - 화면(컨트롤룸)은 개발 서버의 프록시를 거쳐 같은 주소로 부른다. 브라우저에 비밀 값을 넣지 않는다.
 * - 원고 폴더: --data-root=경로 > STUDIO_DATA_ROOT > 사용자 폴더의 OnseosaData
 * - STUDIO_LABEL 을 주면 화면에 그 이름이 표시된다. 시험 저장소를 실제 원고와 헷갈리지 않게 하는 용도다.
 *   시험할 때는 --data-root 로 임시 폴더를 준다. 실제 원고 폴더를 건드리지 않기 위해서다.
 * - 백업 폴더: --backup-root=경로 > STUDIO_BACKUP_ROOT > 원고 폴더 옆의 "<원고 폴더 이름>-backups".
 *   반드시 원고 폴더 밖이어야 한다. 안쪽이면 서버를 켜지 않는다.
 */

const MAX_BODY = 6 * 1024 * 1024;
const PREFIX = '/api/studio';

function argValue(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

export function resolveDataRoot() {
  return path.resolve(argValue('data-root') || process.env.STUDIO_DATA_ROOT || path.join(os.homedir(), 'OnseosaData'));
}

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(json),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(json);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new StoreError(413, 'too_large', '보낸 내용이 너무 큽니다.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch {
        reject(new StoreError(400, 'invalid', 'JSON 형식이 아닙니다.'));
      }
    });
    req.on('error', reject);
  });
}

// 실행 스크립트가 "내가 기대한 저장 서버가 맞는지" 확인할 때 본다. 주소 구성이 바뀌면 올린다.
export const API_VERSION = 3;

export function createStudioServer({ dataRoot, uiPorts = [5173], label = '', backupRoot = defaultBackupRoot(dataRoot) }) {
  dataRoot = path.resolve(dataRoot);
  backupRoot = path.resolve(backupRoot);
  const rel = path.relative(dataRoot, backupRoot);
  if (!rel || (!rel.startsWith('..') && !path.isAbsolute(rel))) throw new Error('백업 폴더는 원고 폴더 밖에 있어야 합니다.');
  const store = createStore(dataRoot);
  let ownPort = 0;

  // 다른 사이트에서 온 요청을 걸러낸다.
  function guard(req) {
    const ports = [ownPort, ...uiPorts];
    const hosts = new Set(ports.flatMap((p) => [`127.0.0.1:${p}`, `localhost:${p}`]));
    const origins = new Set(ports.flatMap((p) => [`http://127.0.0.1:${p}`, `http://localhost:${p}`]));
    if (!hosts.has(String(req.headers.host))) throw new StoreError(403, 'forbidden', '허용되지 않은 주소입니다.');
    const origin = req.headers.origin;
    if (origin && !origins.has(origin)) throw new StoreError(403, 'forbidden', '허용되지 않은 출처입니다.');
    const site = req.headers['sec-fetch-site'];
    if (site && site !== 'same-origin' && site !== 'none') throw new StoreError(403, 'forbidden', '다른 사이트에서 온 요청입니다.');
    if (req.method === 'OPTIONS') throw new StoreError(403, 'forbidden', '허용되지 않은 요청입니다.');
    if (req.method !== 'GET' && !String(req.headers['content-type'] ?? '').startsWith('application/json')) {
      throw new StoreError(415, 'invalid', 'JSON으로 보내야 합니다.');
    }
  }

  const routes = [
    ['GET', /^\/health$/, () => ({ ok: true, app: 'onseosa-studio-server', apiVersion: API_VERSION, dataRoot, backupRoot, label })],
    ['GET', /^\/works$/, () => ({ works: store.listWorks() })],
    ['POST', /^\/works$/, (m, body) => ({ work: store.createWork(body) })],
    ['GET', /^\/works\/([^/]+)$/, (m) => ({ work: store.getWork(m[1]), last: store.getLast(m[1]) })],
    ['PUT', /^\/works\/([^/]+)$/, (m, body) => ({ work: store.putWork(m[1], body) })],
    ['PUT', /^\/works\/([^/]+)\/last$/, (m, body) => ({ last: store.putLast(m[1], body) })],
    ['GET', /^\/works\/([^/]+)\/notes$/, (m) => ({ notes: store.getNotes(m[1]) })],
    ['PUT', /^\/works\/([^/]+)\/notes$/, (m, body) => store.putNotes(m[1], body)],
    ['GET', /^\/works\/([^/]+)\/notes\/recovery$/, (m) => ({ recovery: store.listNotesRecovery(m[1]) })],
    ['POST', /^\/works\/([^/]+)\/notes\/recovery$/, (m, body) => store.stashNotes(m[1], body)],
    ['POST', /^\/works\/([^/]+)\/search$/, (m, body) => store.searchWork(m[1], body)],
    ['GET', /^\/works\/([^/]+)\/map$/, (m) => ({ map: store.getMap(m[1]) })],
    ['PUT', /^\/works\/([^/]+)\/map$/, (m, body) => store.putMap(m[1], body)],
    ['GET', /^\/works\/([^/]+)\/map\/recovery$/, (m) => ({ recovery: store.listMapRecovery(m[1]) })],
    ['POST', /^\/works\/([^/]+)\/map\/recovery$/, (m, body) => store.stashMap(m[1], body)],
    // 작품 한 벌을 원고 폴더 밖의 백업 폴더에 파일 하나로 쓴다.
    ['POST', /^\/works\/([^/]+)\/backup$/, (m) => ({ backup: writeBackup(dataRoot, backupRoot, store.getWork(m[1]).id) })],
    ['GET', /^\/works\/([^/]+)\/docs\/([^/]+)$/, (m) => ({ scene: store.getScene(m[1], m[2]) })],
    ['PUT', /^\/works\/([^/]+)\/docs\/([^/]+)$/, (m, body) => store.putScene(m[1], m[2], body)],
    ['POST', /^\/works\/([^/]+)\/docs\/([^/]+)\/restore$/, (m, body) => ({ scene: store.restoreScene(m[1], m[2], body) })],
    ['GET', /^\/works\/([^/]+)\/docs\/([^/]+)\/versions$/, (m) => ({ versions: store.listVersions(m[1], m[2]) })],
    ['POST', /^\/works\/([^/]+)\/docs\/([^/]+)\/versions$/, (m, body) => ({ version: store.createVersion(m[1], m[2], body) })],
    ['GET', /^\/works\/([^/]+)\/docs\/([^/]+)\/versions\/(\d+)$/, (m) => ({ version: store.getVersion(m[1], m[2], Number(m[3])) })],
    ['GET', /^\/works\/([^/]+)\/docs\/([^/]+)\/recovery$/, (m) => ({ recovery: store.listRecovery(m[1], m[2]) })],
    ['POST', /^\/works\/([^/]+)\/docs\/([^/]+)\/recovery$/, (m, body) => store.stashRecovery(m[1], m[2], body)],
    ['GET', /^\/works\/([^/]+)\/docs\/([^/]+)\/recovery\/([^/]+)$/, (m) => ({ item: store.getRecovery(m[1], m[2], m[3]) })],
  ];

  const server = http.createServer(async (req, res) => {
    try {
      guard(req);
      const url = new URL(req.url ?? '/', 'http://local');
      if (!url.pathname.startsWith(PREFIX)) throw new StoreError(404, 'not_found', '없는 주소입니다.');
      const rest = url.pathname.slice(PREFIX.length) || '/';
      for (const [method, pattern, handler] of routes) {
        const m = pattern.exec(rest);
        if (!m || method !== req.method) continue;
        const body = method === 'GET' ? undefined : await readBody(req);
        return send(res, 200, handler(m, body));
      }
      throw new StoreError(404, 'not_found', '없는 주소입니다.');
    } catch (e) {
      if (e instanceof StoreError) return send(res, e.status, { error: e.message, code: e.code, ...(e.extra ?? {}) });
      console.error('[studio-server] 처리 실패:', e?.message);
      return send(res, 500, { error: '서버에서 처리하지 못했습니다.', code: 'internal' });
    }
  });

  return {
    store,
    listen(port) {
      return new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, '127.0.0.1', () => {
          ownPort = server.address().port;
          resolve(ownPort);
        });
      });
    },
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dataRoot = resolveDataRoot();
  const port = Number(argValue('port') || process.env.STUDIO_PORT || 3004);
  const uiPorts = String(process.env.STUDIO_UI_PORTS || '5173').split(',').map((p) => Number(p.trim())).filter(Boolean);
  const backupRoot = path.resolve(argValue('backup-root') || process.env.STUDIO_BACKUP_ROOT || defaultBackupRoot(dataRoot));
  const app = createStudioServer({ dataRoot, uiPorts, backupRoot, label: process.env.STUDIO_LABEL || (process.env.STUDIO_TEST ? '시험 저장소' : '') });
  app.listen(port).then(
    (p) => console.log(`[studio-server] http://127.0.0.1:${p} · 원고 폴더: ${dataRoot} · 백업 폴더: ${backupRoot}`),
    (e) => {
      console.error('[studio-server] 시작 실패:', e.message);
      process.exit(1);
    },
  );
}
