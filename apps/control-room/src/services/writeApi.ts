// 집필실 원고 저장 서버 호출. 개발 서버의 프록시(/api/studio)를 거쳐 같은 주소로 부른다.
// 브라우저에 비밀 값을 두지 않는다. 서버가 이 PC 안에서만 열리고 출처를 검사한다.

const BASE = '/api/studio';

// 원고 = 회차나 장 한 편. 한 편을 끝까지 이어 쓴다.
export interface DocRef { id: string; title: string }
export interface RemovedDoc extends DocRef { removedAt?: string }
// removed: 목록에서 뺀 원고. 파일은 그대로 있고, 여기서 다시 꺼낼 수 있다.
export interface Work { id: string; rev: number; title: string; docs: DocRef[]; removed?: RemovedDoc[]; updatedAt: string }
export interface WorkSummary { id: string; title: string; updatedAt: string; docCount: number }
export interface LastPos { docId: string; caret: number; scroll: number }
export interface Scene { id: string; rev: number; text: string; updatedAt: string | null }
export interface VersionInfo { n: number; label: string; createdAt: string; chars: number; unchanged?: boolean }
export interface RecoveryInfo { key: string; at: string; reason: 'auto' | 'overwrite' | 'restore' | 'stash'; chars: number }
export interface Notes { rev: number; characters: string; world: string; threads: string; updatedAt: string | null }

// 서버의 내용이 내가 본 것과 다를 때. current 에 서버 쪽 지금 내용이 실린다.
export class ConflictError<T = unknown> extends Error {
  constructor(message: string, public current: T) {
    super(message);
  }
}

async function call<T>(method: string, path: string, body?: unknown, keepalive = false): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      keepalive,
    });
  } catch {
    throw new Error('원고 저장 서버에 연결하지 못했습니다.');
  }
  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    if (res.ok) throw new Error('서버 응답을 읽지 못했습니다.');
  }
  if (res.status === 409 && data.code === 'conflict') throw new ConflictError(String(data.error), data.current);
  if (!res.ok) {
    if (typeof data.error === 'string') throw new Error(data.error);
    // 저장 서버가 꺼져 있으면 개발 서버의 프록시가 내용 없는 5xx를 돌려준다.
    throw new Error(res.status >= 500 ? '원고 저장 서버에 연결하지 못했습니다.' : `원고 저장 서버 오류 (${res.status})`);
  }
  return data as T;
}

const scenePath = (wid: string, sid: string) => `/works/${wid}/docs/${sid}`;

export const getHealth = () => call<{ ok: boolean; dataRoot: string; label?: string }>('GET', '/health');
export const listWorks = () => call<{ works: WorkSummary[] }>('GET', '/works').then((r) => r.works);
export const createWork = (title = '') => call<{ work: Work }>('POST', '/works', { title }).then((r) => r.work);
export const getWork = (wid: string) => call<{ work: Work; last: LastPos | null }>('GET', `/works/${wid}`);
export const putWork = (work: Work) =>
  call<{ work: Work }>('PUT', `/works/${work.id}`, { baseRev: work.rev, title: work.title, docs: work.docs, removed: work.removed ?? [] }).then((r) => r.work);
export const putLast = (wid: string, last: LastPos, keepalive = false) => call<unknown>('PUT', `/works/${wid}/last`, last, keepalive);

export const getScene = (wid: string, sid: string) => call<{ scene: Scene }>('GET', scenePath(wid, sid)).then((r) => r.scene);
export const putScene = (wid: string, sid: string, body: { baseRev: number; text: string; keepPrevious?: boolean }, keepalive = false) =>
  call<{ rev: number; updatedAt: string }>('PUT', scenePath(wid, sid), body, keepalive);
export const stashText = (wid: string, sid: string, text: string) => call<unknown>('POST', `${scenePath(wid, sid)}/recovery`, { text });

export const listVersions = (wid: string, sid: string) => call<{ versions: VersionInfo[] }>('GET', `${scenePath(wid, sid)}/versions`).then((r) => r.versions);
export const createVersion = (wid: string, sid: string, baseRev: number, label: string) =>
  call<{ version: VersionInfo }>('POST', `${scenePath(wid, sid)}/versions`, { baseRev, label }).then((r) => r.version);
export const getVersionText = (wid: string, sid: string, n: number) =>
  call<{ version: { text: string } }>('GET', `${scenePath(wid, sid)}/versions/${n}`).then((r) => r.version.text);
export const listRecovery = (wid: string, sid: string) => call<{ recovery: RecoveryInfo[] }>('GET', `${scenePath(wid, sid)}/recovery`).then((r) => r.recovery);
export const getRecoveryText = (wid: string, sid: string, key: string) =>
  call<{ item: { text: string } }>('GET', `${scenePath(wid, sid)}/recovery/${key}`).then((r) => r.item.text);
export const restoreScene = (wid: string, sid: string, baseRev: number, from: { kind: 'version'; n: number } | { kind: 'recovery'; key: string }) =>
  call<{ scene: Scene }>('POST', `${scenePath(wid, sid)}/restore`, { baseRev, from }).then((r) => r.scene);

export const getNotes = (wid: string) => call<{ notes: Notes }>('GET', `/works/${wid}/notes`).then((r) => r.notes);
export const stashNotes = (wid: string, body: { characters: string; world: string; threads: string }) => call<unknown>('POST', `/works/${wid}/notes/recovery`, body);
export const putNotes = (wid: string, body: { baseRev: number; characters: string; world: string; threads: string; keepPrevious?: boolean }, keepalive = false) =>
  call<{ rev: number; updatedAt: string }>('PUT', `/works/${wid}/notes`, body, keepalive);

// 작품 연결 지도. 작가가 직접 만든 카드와, 두 카드 사이의 이름 붙은 연결.
export type CardKind = 'person' | 'theme' | 'event' | 'source';
export interface MapCard { id: string; kind: CardKind; title: string; note: string; source: string; docIds: string[] }
export interface MapLink { id: string; from: string; to: string; label: string }
export interface MapBody { cards: MapCard[]; links: MapLink[] }
export interface WorkMap extends MapBody { rev: number; updatedAt: string | null }
export const getMap = (wid: string) => call<{ map: WorkMap }>('GET', `/works/${wid}/map`).then((r) => r.map);
export const putMap = (wid: string, body: MapBody & { baseRev: number; keepPrevious?: boolean }, keepalive = false) =>
  call<{ rev: number; updatedAt: string }>('PUT', `/works/${wid}/map`, body, keepalive);
export const stashMap = (wid: string, body: MapBody) => call<unknown>('POST', `/works/${wid}/map/recovery`, body);

// 작품 안에서 찾기. 회차 제목·본문에서 찾은 곳을 회차 순서대로 돌려준다.
export interface TextHit { count: number; snippets: { at: number; before: string; match: string; after: string }[] }
export interface DocHit extends TextHit { id: string; title: string; titleHit: boolean }
export const searchWork = (wid: string, q: string) => call<{ q: string; docs: DocHit[] }>('POST', `/works/${wid}/search`, { q });

export interface BackupInfo {
  file: string;
  bytes: number;
  exportedAt: string;
  counts: { docs: number; removed: number; versions: number; recovery: number; cards: number; links: number; files: number };
  skipped: string[];
}
export const createBackup = (wid: string) => call<{ backup: BackupInfo }>('POST', `/works/${wid}/backup`, {}).then((r) => r.backup);
