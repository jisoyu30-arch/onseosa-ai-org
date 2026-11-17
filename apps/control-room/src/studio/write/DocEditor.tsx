import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ConflictError, LastPos, Scene, getScene, putLast, putScene, restoreScene, stashText } from '../../services/writeApi';
import { Draft, clearDraft, readDraft, readPos, writeDraft, writePos } from './local';

/*
 * 원고 한 편의 본문 편집기.
 *
 * - 본문은 글상자 하나이고, React가 값을 쥐지 않는다(비제어). 치는 동안 글상자를 다시 그리거나
 *   값을 바꿔 넣지 않으므로 한글 조합과 커서가 흔들리지 않는다.
 * - 치는 즉시 이 브라우저에 임시 보관하고, 잠깐 멈추면 서버에 저장한다.
 * - 원고를 바꾸거나, 다른 화면으로 가거나, 탭을 숨기거나 닫을 때는 대기 중인 저장을 취소하지 않고 바로 보낸다.
 * - 서버는 "내가 본 rev"와 다르면 거절한다. 그때는 내 글을 버리지 않고 둘을 함께 보여 준다.
 * - 아직 작품이 없을 때(target 없음)는 빈 원고로 시작하고, 첫 글자를 저장할 때 작품을 만든다.
 *   쓰기 전에 아무것도 묻지 않기 위해서다. 그때도 글상자는 그대로 둔다.
 *
 * 원고마다 새로 만들어진다(부모가 key로 구분). target 은 처음 값만 쓴다.
 */

export type SaveState = 'loading' | 'saved' | 'dirty' | 'saving' | 'failed' | 'conflict' | 'unavailable';
export interface DocIds { wid: string; did: string }

interface Ctx {
  ids: DocIds | null;
  baseRev: number;
  savedText: string;
  text: string;
  ready: boolean;
  blocked: boolean;
  keepPrevious: boolean;
  inflight: Promise<void> | null;
  again: boolean;
  fails: number;
  timer: number;
  alive: boolean;
  restoring: boolean;
  /** 충돌에서 "다른 곳의 글 쓰기"를 처리하는 중. 끝날 때까지 입력과 다른 결정을 받지 않는다. */
  resolving: boolean;
}

interface Conflict { theirs: string; rev: number; at: string | null }

export interface DocEditorHandle {
  /** 대기 중인 저장을 끝낸다. 서버와 같아졌으면 true. */
  flush: () => Promise<boolean>;
  rev: () => number;
  restore: (from: { kind: 'version'; n: number } | { kind: 'recovery'; key: string }) => Promise<void>;
  /** 지금 화면의 글 그대로. clean 이면 서버에 저장된 내용과 같다. */
  snapshot: () => { text: string; clean: boolean; state: SaveState };
  /** 커서·스크롤 자리를 지금 바로 기억한다. 원고를 바꾸기 직전에 부른다. */
  remember: () => void;
  /** 본문으로 돌아간다. 커서는 쓰던 자리에 그대로 있다. */
  focus: () => void;
}

interface Props {
  target: DocIds | null;
  /** 작품이 없을 때 첫 저장 직전에 부른다. 작품과 첫 원고를 만들어 돌려준다. */
  create: () => Promise<DocIds>;
  serverLast: LastPos | null;
  /** 저장 상태가 바뀔 때 알린다. 위쪽 표시줄이 쓴다. */
  onState?: (state: SaveState) => void;
  /** 저장하지 못한 글을 TXT로 받는다. 저장 실패·충돌 때 버튼으로 보인다. */
  onRescue?: () => void;
}

const SAVE_DELAY = 1000;
const PRESENCE_BEAT = 3000;
const PRESENCE_TIMEOUT = 8000;
const TAB_ID = Math.random().toString(36).slice(2);
const PENDING: DocIds = { wid: 'pending', did: 'pending' };

const timeLabel = (iso: string | null) => (iso ? new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '');

export const DocEditor = forwardRef<DocEditorHandle, Props>(function DocEditor({ target, create, serverLast, onState, onRescue }, ref) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const c = useRef<Ctx>({ ids: target, baseRev: 0, savedText: '', text: '', ready: false, blocked: false, keepPrevious: false, inflight: null, again: false, fails: 0, timer: 0, alive: false, restoring: false, resolving: false });
  const sourceDraft = useRef<Draft | undefined>();
  const createRef = useRef(create);
  createRef.current = create;
  const [state, setState] = useState<SaveState>('loading');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [counts, setCounts] = useState({ all: 0, solid: 0 });
  const [conflict, setConflict] = useState<Conflict | null>(null);
  const [message, setMessage] = useState('');
  const [draftBroken, setDraftBroken] = useState(false);
  const [otherTabs, setOtherTabs] = useState(0);
  const [bound, setBound] = useState<DocIds | null>(target);
  const [restoring, setRestoring] = useState(false);
  const [resolving, setResolving] = useState(false);
  const stateRef = useRef<SaveState>('loading');
  stateRef.current = state;
  const onStateRef = useRef(onState);
  onStateRef.current = onState;
  useEffect(() => {
    onStateRef.current?.(state);
  }, [state]);
  const countTimer = useRef(0);
  const posTimer = useRef(0);
  const lastTimer = useRef(0);

  const show = useCallback((next: SaveState) => {
    if (c.current.alive) setState(next);
  }, []);

  const count = useCallback((text: string) => {
    setCounts({ all: text.length, solid: text.replace(/\s/g, '').length });
  }, []);

  const rememberPos = useCallback((toServer: boolean) => {
    const el = ta.current;
    const ids = c.current.ids;
    if (!el || !ids || !c.current.ready) return;
    const pos = { caret: el.selectionStart ?? 0, scroll: Math.round(el.scrollTop) };
    writePos(ids.wid, ids.did, pos);
    if (toServer) putLast(ids.wid, { docId: ids.did, ...pos }, true).catch(() => undefined);
  }, []);

  const keepDraft = useCallback(() => {
    const x = c.current;
    const k = x.ids ?? PENDING;
    const ok = writeDraft(k.wid, k.did, { text: x.text, baseRev: x.baseRev, at: new Date().toISOString() });
    if (x.alive) setDraftBroken(!ok);
  }, []);

  const dropDraft = useCallback(() => {
    const k = c.current.ids ?? PENDING;
    clearDraft(k.wid, k.did, c.current.savedText, sourceDraft.current);
    sourceDraft.current = undefined;
  }, []);

  const save = useCallback(
    (keepalive = false): Promise<void> => {
      const x = c.current;
      window.clearTimeout(x.timer);
      if (!x.ready || x.blocked) return Promise.resolve();
      if (x.inflight) {
        x.again = true;
        return x.inflight;
      }
      const text = x.text;
      if (text === x.savedText) {
        dropDraft();
        show('saved');
        return Promise.resolve();
      }
      show('saving');
      const keepPrevious = x.keepPrevious;
      // keepalive 요청은 브라우저가 약 64KB까지만 받는다. 넘으면 보통 요청으로 보내고, 임시 보관본이 뒤를 받친다.
      const useKeepalive = keepalive && text.length * 3 < 60000;
      // 아직 작품이 없으면 지금 만든다.
      const idsReady = x.ids
        ? Promise.resolve(x.ids)
        : createRef.current().then((ids) => {
            clearDraft(PENDING.wid, PENDING.did, x.text, sourceDraft.current);
            sourceDraft.current = undefined;
            x.ids = ids;
            keepDraft();
            if (x.alive) setBound(ids);
            return ids;
          });
      x.inflight = idsReady
        .then((ids) => putScene(ids.wid, ids.did, { baseRev: x.baseRev, text, keepPrevious }, useKeepalive))
        .then((r) => {
          x.baseRev = r.rev;
          x.savedText = text;
          x.keepPrevious = false;
          if (x.fails > 0 && x.alive) setMessage(''); // 실패 안내를 걷는다.
          x.fails = 0;
          if (x.alive) setSavedAt(r.updatedAt);
          if (x.text === text) {
            dropDraft();
            show('saved');
          } else {
            keepDraft(); // 그사이 더 쳤다. 임시 보관본의 기준 rev를 새 rev로 맞춘다.
            x.again = true;
            show('dirty');
          }
        })
        .catch((e: unknown) => {
          if (e instanceof ConflictError) {
            const cur = e.current as Scene;
            if (cur.text === text) {
              // 서버에 이미 같은 글이 있다. 다른 회차에 다녀오는 사이, 떠나기 전에 보낸 저장이 뒤늦게 닿은 경우다.
              // 잃을 글이 없으므로 충돌로 세우지 않고 서버의 rev만 따라간다.
              x.baseRev = cur.rev;
              x.savedText = text;
              x.keepPrevious = false;
              x.fails = 0;
              if (x.alive) setSavedAt(cur.updatedAt);
              if (x.text === text) {
                dropDraft();
                show('saved');
              } else {
                keepDraft();
                x.again = true;
                show('dirty');
              }
              return;
            }
            x.blocked = true;
            if (x.alive) setConflict({ theirs: cur.text, rev: cur.rev, at: cur.updatedAt });
            show('conflict');
            return;
          }
          x.fails += 1;
          if (x.alive) setMessage((e as Error).message);
          show('failed');
          // 화면을 떠난 뒤에는 다시 시도하지 않는다. 글은 임시 보관본에 있고, 다음에 열 때 되살린다.
          if (x.alive) x.timer = window.setTimeout(() => void save(), Math.min(30000, 3000 * x.fails));
        })
        .finally(() => {
          x.inflight = null;
          if (x.again) {
            x.again = false;
            return save();
          }
        });
      return x.inflight;
    },
    [show, keepDraft, dropDraft],
  );

  useImperativeHandle(
    ref,
    () => ({
      flush: async () => {
        await save();
        const x = c.current;
        return x.ready && !x.blocked && x.ids !== null && x.text === x.savedText;
      },
      rev: () => c.current.baseRev,
      restore: async (from) => {
        const x = c.current;
        if (x.restoring || x.resolving || !x.ready || !x.ids) throw new Error('원고를 불러온 뒤 다시 시도해 주세요.');
        // flush 전에 잠근다. 복원 요청 중 입력·자동 저장이 끼어들 수 없다.
        x.restoring = true;
        setRestoring(true);
        if (ta.current) ta.current.readOnly = true;
        try {
          await save();
          if (x.blocked || x.text !== x.savedText) throw new Error('저장이 끝나지 않아 되돌리지 못했습니다. 저장 상태를 먼저 확인해 주세요.');
          const scene = await restoreScene(x.ids.wid, x.ids.did, x.baseRev, from);
          // 편집기를 다시 만들기 전에 마지막 저장 기준도 복원 결과로 맞춘다.
          x.baseRev = scene.rev;
          x.text = x.savedText = scene.text;
          if (ta.current) ta.current.value = scene.text;
          dropDraft();
          if (x.alive) {
            count(scene.text);
            setSavedAt(scene.updatedAt);
            setState('saved');
          }
        } finally {
          x.restoring = false;
          if (x.alive) setRestoring(false);
          if (ta.current) ta.current.readOnly = !x.ready;
        }
      },
      snapshot: () => {
        const x = c.current;
        return { text: x.text, clean: x.ready && !x.blocked && x.text === x.savedText, state: stateRef.current };
      },
      remember: () => rememberPos(true),
      focus: () => ta.current?.focus({ preventScroll: true }),
    }),
    [save, dropDraft, count, rememberPos],
  );

  // 원고 읽기. 임시 보관본이 서버보다 새것이면 되살리고, 서버도 따로 바뀌었으면 충돌로 보여 준다.
  useEffect(() => {
    const x = c.current;
    let cancelled = false;
    Object.assign(x, { ids: x.ids ?? target, baseRev: 0, savedText: '', text: '', ready: false, blocked: false, keepPrevious: false, again: false, fails: 0, alive: true });

    const place = (text: string, pos: { caret: number; scroll: number } | null) => {
      const el = ta.current;
      if (!el) return;
      x.text = text;
      el.value = text;
      x.ready = true;
      count(text);
      const caret = pos ? Math.min(pos.caret, text.length) : text.length;
      el.focus({ preventScroll: true });
      el.setSelectionRange(caret, caret);
      requestAnimationFrame(() => {
        el.scrollTop = pos ? pos.scroll : el.scrollHeight;
      });
    };

    const ids = x.ids;
    if (!ids) {
      // 작품이 아직 없다. 빈 원고로 시작한다. 지난번에 저장하지 못한 첫 글이 있으면 되살린다.
      const draft = readDraft(PENDING.wid, PENDING.did);
      sourceDraft.current = draft ?? undefined;
      place(draft?.text ?? '', null);
      if (draft?.text) {
        setState('dirty');
        x.timer = window.setTimeout(() => void save(), SAVE_DELAY);
      } else setState('saved');
    } else {
      getScene(ids.wid, ids.did)
        .then((scene) => {
          if (cancelled) return;
          x.baseRev = scene.rev;
          x.savedText = scene.text;
          let text = scene.text;
          const draft = readDraft(ids.wid, ids.did);
          sourceDraft.current = draft ?? undefined;
          if (draft && draft.text !== scene.text) {
            text = draft.text;
            if (draft.baseRev === scene.rev) {
              if (scene.rev > 0) setMessage(`저장되지 않았던 글을 되살렸습니다 (${timeLabel(draft.at)}에 쓰던 내용).`);
            } else {
              x.blocked = true;
              x.baseRev = draft.baseRev; // 다시 열어도 충돌 초안을 최신 서버 기준으로 오인하지 않는다.
              setConflict({ theirs: scene.text, rev: scene.rev, at: scene.updatedAt });
            }
          } else if (draft) {
            clearDraft(ids.wid, ids.did, scene.text, draft);
            sourceDraft.current = undefined;
          }
          setSavedAt(scene.updatedAt);
          place(text, readPos(ids.wid, ids.did) ?? (serverLast?.docId === ids.did ? serverLast : null));
          if (x.blocked) setState('conflict');
          else if (text !== x.savedText) {
            setState('dirty');
            x.timer = window.setTimeout(() => void save(), SAVE_DELAY);
          } else setState('saved');
        })
        .catch((e: Error) => {
          if (cancelled) return;
          setMessage(e.message);
          setState('unavailable');
        });
    }

    // 탭을 숨기거나 닫을 때: 대기 중인 저장을 바로 보낸다.
    const leave = () => {
      rememberPos(true);
      void save(true);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') leave();
    };
    window.addEventListener('pagehide', leave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      window.removeEventListener('pagehide', leave);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearTimeout(countTimer.current);
      window.clearTimeout(posTimer.current);
      window.clearTimeout(lastTimer.current);
      // 원고를 바꾸거나 다른 화면으로 갈 때: 저장을 취소하지 않고 보낸다.
      void save(true);
      x.alive = false;
    };
    // target·serverLast 는 처음 자리를 잡을 때만 쓴다. 바뀌어도 다시 읽지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save, count, rememberPos]);

  // 같은 원고가 다른 탭에도 열려 있는지 알린다. 실제 방어는 서버의 rev 검사가 한다.
  useEffect(() => {
    if (!bound || typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('ons-write');
    const doc = `${bound.wid}/${bound.did}`;
    // 탭이 닫힐 때의 인사(bye)는 오지 않을 수 있다. 그래서 주기적으로 살아 있음을 알리고, 한동안 소식 없는 탭은 뺀다.
    const others = new Map<string, number>();
    channel.onmessage = (ev: MessageEvent<{ t: string; doc: string; tab: string }>) => {
      const m = ev.data;
      if (!m || m.doc !== doc || m.tab === TAB_ID) return;
      if (m.t === 'bye') others.delete(m.tab);
      else {
        others.set(m.tab, Date.now());
        if (m.t === 'hello') channel.postMessage({ t: 'here', doc, tab: TAB_ID });
      }
      setOtherTabs(others.size);
    };
    channel.postMessage({ t: 'hello', doc, tab: TAB_ID });
    const beat = window.setInterval(() => {
      channel.postMessage({ t: 'here', doc, tab: TAB_ID });
      for (const [tab, seen] of others) if (Date.now() - seen > PRESENCE_TIMEOUT) others.delete(tab);
      setOtherTabs(others.size);
    }, PRESENCE_BEAT);
    const bye = () => channel.postMessage({ t: 'bye', doc, tab: TAB_ID });
    window.addEventListener('pagehide', bye);
    return () => {
      window.clearInterval(beat);
      window.removeEventListener('pagehide', bye);
      bye();
      channel.close();
    };
  }, [bound]);

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const x = c.current;
    if (x.restoring || x.resolving) {
      // 복원·충돌 처리가 끝날 때까지는 입력을 받지 않는다. 받은 척하고 나중에 지우는 일이 없게 한다.
      e.currentTarget.value = x.text;
      return;
    }
    if (!x.ready) return;
    x.text = e.currentTarget.value;
    keepDraft();
    window.clearTimeout(countTimer.current);
    countTimer.current = window.setTimeout(() => count(x.text), 250);
    if (x.blocked) return;
    if (!x.inflight) setState('dirty');
    window.clearTimeout(x.timer);
    x.timer = window.setTimeout(() => void save(), SAVE_DELAY);
  };

  const onMove = () => {
    window.clearTimeout(posTimer.current);
    posTimer.current = window.setTimeout(() => rememberPos(false), 300);
    window.clearTimeout(lastTimer.current);
    lastTimer.current = window.setTimeout(() => rememberPos(true), 4000);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      void save();
    }
  };

  // 충돌: 내 글로 저장한다. 밀려나는 서버 쪽 글은 서버가 복구본으로 남긴다.
  const keepMine = () => {
    const x = c.current;
    if (!conflict || x.resolving) return;
    x.baseRev = conflict.rev;
    x.keepPrevious = true;
    x.blocked = false;
    setConflict(null);
    keepDraft();
    void save();
  };

  // 충돌: 서버 글을 쓴다. 내 글은 먼저 복구본에 맡긴다.
  // 누른 순간의 글을 고정하고, 결과가 올 때까지 본문을 잠근다. 그사이에 친 글이 화면에만 보였다가
  // 사라지는 일이 없게 하기 위해서다. 실패하면 아무것도 바꾸지 않고 다시 고를 수 있게 둔다.
  const takeTheirs = async () => {
    const x = c.current;
    const el = ta.current;
    const ids = x.ids;
    if (!el || !ids || !conflict || x.resolving || x.restoring) return;
    x.resolving = true;
    setResolving(true);
    el.readOnly = true;
    const mine = x.text; // 맡길 글. 이 뒤로는 입력을 받지 않으므로 화면의 글과 같다.
    try {
      await stashText(ids.wid, ids.did, mine);
      const fresh = await getScene(ids.wid, ids.did);
      if (!x.alive) return; // 그사이 다른 원고로 갔다. 내 글은 복구본과 임시 보관본에 그대로 있다.
      clearDraft(ids.wid, ids.did, mine, sourceDraft.current);
      sourceDraft.current = undefined;
      x.text = fresh.text;
      x.savedText = fresh.text;
      x.baseRev = fresh.rev;
      x.blocked = false;
      el.value = fresh.text;
      count(fresh.text);
      setSavedAt(fresh.updatedAt);
      setConflict(null);
      setState('saved');
      setMessage('다른 곳의 글을 불러왔습니다. 내가 쓰던 글은 "판 › 자동 복구"의 "충돌 때 내 글"에 그대로 남아 있습니다.');
    } catch (e) {
      // 맡기지 못했다. 내 글·임시 보관본·충돌 선택은 그대로다.
      if (x.alive) setMessage(`내 글을 보관하지 못해 아무것도 바꾸지 않았습니다 (${(e as Error).message}). 내 글은 아래에 그대로 있습니다. 다시 골라 주세요.`);
    } finally {
      x.resolving = false;
      if (x.alive) setResolving(false);
      if (ta.current) ta.current.readOnly = !x.ready || x.restoring;
    }
  };

  const label =
    state === 'loading' ? '불러오는 중'
    : state === 'saved' ? (savedAt ? `저장됨 ${timeLabel(savedAt)}` : '')
    : state === 'dirty' ? '고친 내용 있음'
    : state === 'saving' ? '저장 중'
    : state === 'failed' ? '저장 실패 — 쓴 글은 이 브라우저에 보관 중이고, 자동으로 다시 시도합니다'
    : state === 'conflict' ? '다른 곳에서 고쳐짐 — 저장 멈춤'
    : '불러오지 못함';
  const tone = state === 'failed' || state === 'unavailable' ? 'bad' : state === 'conflict' ? 'warn' : '';

  return (
    <div className="wr-column">
      {conflict && (
        <div className="wr-conflict">
          <strong>이 원고가 다른 곳에서 고쳐졌습니다{conflict.at ? ` (${timeLabel(conflict.at)})` : ''}.</strong> 내 글은 아래에 그대로 있고, 저장은 멈춰 있습니다.
          <div className="wr-small" style={{ marginTop: 8 }}>다른 곳에서 저장된 글 · {conflict.theirs.length.toLocaleString()}자</div>
          <pre>{conflict.theirs || '(빈 글)'}</pre>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <button type="button" onClick={keepMine} disabled={resolving} className="wr-btn solid">내 글로 저장</button>
            <button type="button" onClick={() => void takeTheirs()} disabled={resolving} className="wr-btn line">다른 곳의 글 쓰기</button>
            {onRescue && <button type="button" onClick={onRescue} className="wr-btn line">내 글 TXT로 받기</button>}
            <span className="wr-small">{resolving ? '내 글을 보관하는 중 · 입력 잠시 멈춤' : '고르지 않은 글은 "판 › 자동 복구"에 남습니다.'}</span>
          </div>
        </div>
      )}
      {message && (
        <div className="wr-note">
          <span>{message}</span>
          <button type="button" className="wr-btn" style={{ padding: 0 }} onClick={() => setMessage('')}>닫기</button>
        </div>
      )}
      <textarea
        ref={ta}
        readOnly={restoring || resolving || state === 'loading' || state === 'unavailable'}
        aria-busy={restoring || resolving}
        onInput={onInput}
        onSelect={onMove}
        onScroll={onMove}
        onKeyDown={onKeyDown}
        spellCheck={false}
        aria-label="본문"
        placeholder={state === 'loading' ? '' : '여기서부터 쓰면 됩니다.'}
        className="wr-text"
      />
      <div className="wr-status" role="status">
        {restoring && <span>이전 판으로 되돌리는 중 · 입력 잠시 멈춤</span>}
        {resolving && <span>내 글을 보관하는 중 · 입력 잠시 멈춤</span>}
        {otherTabs > 0 && <span className="warn">다른 탭에서도 열려 있음</span>}
        {draftBroken && <span className="warn">브라우저 임시 보관 꺼짐</span>}
        {label && <span className={tone}>{label}</span>}
        {state === 'failed' && <button type="button" onClick={() => void save()} className="wr-btn line" style={{ padding: '1px 8px' }}>지금 다시 시도</button>}
        {state === 'failed' && onRescue && <button type="button" onClick={onRescue} className="wr-btn line" style={{ padding: '1px 8px' }}>화면의 글 TXT로 받기</button>}
        <span title={`공백 제외 ${counts.solid.toLocaleString()}자`}>{counts.all.toLocaleString()}자</span>
      </div>
    </div>
  );
});
