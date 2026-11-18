// 이 브라우저에만 두는 것들: 저장 전 임시 보관본, 장면별 커서 자리, 마지막으로 연 작품·장면.
// 서버 저장이 늦거나 실패해도 글이 남게 하는 두 번째 안전망이다.

interface DraftSource { storageKey?: string; raw?: string }
export interface Draft extends DraftSource { text: string; baseRev: number; at: string }
export interface NotesDraft extends DraftSource { characters: string; world: string; threads: string; baseRev: number; at: string }
export interface Pos { caret: number; scroll: number }

const key = (...parts: string[]) => ['ons-write', ...parts].join(':');

function read<T>(k: string): T | null {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// 저장 공간이 꽉 찼거나 막혀 있으면 false. 화면이 알려야 한다.
function write(k: string, value: unknown): boolean {
  try {
    localStorage.setItem(k, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function remove(k: string) {
  try {
    localStorage.removeItem(k);
  } catch {
    /* 무시 */
  }
}

// 페이지마다 별도 키에 쓴다. 복제한 탭도 서로의 초안을 덮거나 지우지 못한다.
// sessionStorage에는 직전 페이지의 소유자만 기억해 새로고침 때 내 초안을 먼저 찾는다.
const owner = crypto.randomUUID();
let previousOwner: string | null = null;
try {
  previousOwner = sessionStorage.getItem(key('draft-owner'));
  sessionStorage.setItem(key('draft-owner'), owner);
} catch { /* 세션 저장이 막혀도 영속 초안은 고유 키에 남긴다. */ }

function readSaved<T extends DraftSource & { at: string }>(prefix: string): T | null {
  try {
    const names = [prefix, ...Object.keys(localStorage).filter((k) => k.startsWith(prefix + ':'))];
    const candidates = names.flatMap((k) => {
      const raw = localStorage.getItem(k);
      if (!raw) return [];
      try { return [{ ...JSON.parse(raw), storageKey: k, raw } as T]; } catch { return []; }
    });
    const preferred = [prefix + ':' + owner, previousOwner && prefix + ':' + previousOwner, prefix];
    for (const k of preferred) {
      const mine = candidates.find((draft) => draft.storageKey === k);
      if (mine) return mine;
    }
    return candidates.sort((a, b) => b.at.localeCompare(a.at))[0] ?? null;
  } catch { return null; }
}

function clearSaved(prefix: string, matches: (value: Record<string, unknown>) => boolean, source?: DraftSource) {
  const mine = prefix + ':' + owner;
  const value = read<Record<string, unknown>>(mine);
  if (value && matches(value)) remove(mine);
  // 읽어 온 직전 페이지·구형 초안만 이전한다. 다른 탭이 새로 쓴 내용은 지우지 않는다.
  if (!source?.storageKey || !source.raw) return;
  const ours = source.storageKey === prefix || source.storageKey === prefix + ':' + previousOwner;
  try {
    if ((ours || matches(JSON.parse(source.raw))) && localStorage.getItem(source.storageKey) === source.raw) remove(source.storageKey);
  } catch { /* 읽지 못하는 보관본은 남긴다. */ }
}

export const readDraft = (wid: string, sid: string) => readSaved<Draft>(key('draft', wid, sid));
export const writeDraft = (wid: string, sid: string, draft: Draft) => write(key('draft', wid, sid, owner), draft);
export const clearDraft = (wid: string, sid: string, savedText: string, source?: Draft) =>
  clearSaved(key('draft', wid, sid), (draft) => draft.text === savedText, source);

export const readNotesDraft = (wid: string) => readSaved<NotesDraft>(key('notes-draft', wid));
export const writeNotesDraft = (wid: string, draft: NotesDraft) => write(key('notes-draft', wid, owner), draft);
export const clearNotesDraft = (wid: string, saved: { characters: string; world: string; threads: string }, source?: NotesDraft) =>
  clearSaved(key('notes-draft', wid), (draft) => draft.characters === saved.characters && draft.world === saved.world && draft.threads === saved.threads, source);

export const readPos = (wid: string, sid: string) => read<Pos>(key('pos', wid, sid));
export const writePos = (wid: string, sid: string, pos: Pos) => write(key('pos', wid, sid), pos);

export const readLastDoc = (wid: string) => read<string>(key('doc', wid));
export const writeLastDoc = (wid: string, did: string) => write(key('doc', wid), did);

export const readLastWork = () => read<string>(key('work'));
export const writeLastWork = (wid: string) => write(key('work'), wid);

export const readFlag = (name: string, fallback: boolean) => read<boolean>(key('ui', name)) ?? fallback;
export const writeFlag = (name: string, value: boolean) => write(key('ui', name), value);

// 보기 설정. 한 번 고르면 이 브라우저가 기억한다.
export interface ViewPrefs { theme: 'light' | 'dark'; font: 'gothic' | 'serif'; size: 's' | 'm' | 'l'; width: 's' | 'm' | 'l' }
export const DEFAULT_PREFS: ViewPrefs = { theme: 'light', font: 'gothic', size: 'm', width: 'm' };
export const readPrefs = (): ViewPrefs => ({ ...DEFAULT_PREFS, ...(read<Partial<ViewPrefs>>(key('prefs')) ?? {}) });
export const writePrefs = (prefs: ViewPrefs) => write(key('prefs'), prefs);

export interface MapDraft { cards: unknown[]; links: unknown[]; baseRev: number; at: string }
export const readMapDraft = (wid: string) => read<MapDraft>(key('map-draft', wid));
export const writeMapDraft = (wid: string, draft: MapDraft) => write(key('map-draft', wid), draft);
export const clearMapDraft = (wid: string) => remove(key('map-draft', wid));
