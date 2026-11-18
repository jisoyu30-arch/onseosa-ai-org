import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ConflictError,
  Notes,
  RecoveryInfo,
  VersionInfo,
  createVersion,
  getNotes,
  getRecoveryText,
  getVersionText,
  listRecovery,
  listVersions,
  putNotes,
  stashNotes,
} from '../../services/writeApi';
import type { DocEditorHandle } from './DocEditor';
import { NotesDraft, clearNotesDraft, readNotesDraft, writeNotesDraft } from './local';

/* 오른쪽 서랍 두 개: 판(작가가 남긴 판과 자동 복구본), 메모(인물·설정·복선). 펼칠 때만 보인다. */

const when = (iso: string) => new Date(iso).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const REASON: Record<RecoveryInfo['reason'], string> = {
  auto: '자동',
  overwrite: '충돌 때 밀려난 글',
  restore: '되돌리기 직전',
  stash: '충돌 때 내 글',
};

type Pick = { kind: 'version'; n: number; name: string } | { kind: 'recovery'; key: string; name: string };

interface VersionsProps {
  wid: string;
  sid: string;
  editor: React.RefObject<DocEditorHandle>;
  onRestored: () => void;
}

export function VersionsDrawer({ wid, sid, editor, onRestored }: VersionsProps) {
  const [versions, setVersions] = useState<VersionInfo[]>([]);
  const [recovery, setRecovery] = useState<RecoveryInfo[]>([]);
  const [label, setLabel] = useState('');
  const [pick, setPick] = useState<Pick | null>(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const refresh = useCallback(() => {
    Promise.all([listVersions(wid, sid), listRecovery(wid, sid)])
      .then(([v, r]) => {
        setVersions(v);
        setRecovery(r);
      })
      .catch((e: Error) => setMessage(e.message));
  }, [wid, sid]);

  useEffect(() => {
    setPick(null);
    setPreview('');
    setMessage('');
    refresh();
  }, [refresh]);

  const keep = async () => {
    const ed = editor.current;
    if (!ed) return;
    setBusy(true);
    try {
      if (!(await ed.flush())) throw new Error('저장이 끝나지 않아 판을 남기지 못했습니다. 저장 상태를 먼저 확인해 주세요.');
      const v = await createVersion(wid, sid, ed.rev(), label.trim());
      setMessage(v.unchanged ? `바뀐 내용이 없어 새 판을 만들지 않았습니다. 지금 내용은 ${v.n}판과 같습니다.` : `${v.n}판으로 남겼습니다.`);
      setLabel('');
      refresh();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const open = async (next: Pick) => {
    setPick(next);
    setPreview('');
    try {
      setPreview(next.kind === 'version' ? await getVersionText(wid, sid, next.n) : await getRecoveryText(wid, sid, next.key));
    } catch (e) {
      setMessage((e as Error).message);
    }
  };

  const restore = async () => {
    const ed = editor.current;
    if (!ed || !pick) return;
    if (!window.confirm(`${pick.name}(으)로 되돌릴까요?\n지금 내용은 "자동 복구"에 남으니 다시 되찾을 수 있습니다.`)) return;
    setBusy(true);
    try {
      await ed.restore(pick.kind === 'version' ? { kind: 'version', n: pick.n } : { kind: 'recovery', key: pick.key });
      onRestored();
      setMessage(`${pick.name}(으)로 되돌렸습니다. 되돌리기 직전 내용은 "자동 복구"에 있습니다.`);
      setPick(null);
      refresh();
    } catch (e) {
      setMessage(e instanceof ConflictError ? '이 원고가 다른 곳에서 고쳐져 되돌리지 못했습니다.' : (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h3 className="wr-h">지금 내용을 판으로 남기기</h3>
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="이름 (선택) — 예: 초고" maxLength={80} aria-label="판 이름" className="wr-input" />
        <button type="button" onClick={keep} disabled={busy} className="wr-btn solid">판 남기기</button>
      </div>
      <p className="wr-small" style={{ marginTop: 6 }}>남긴 판은 고쳐지거나 지워지지 않습니다.</p>
      {message && <div className="wr-note"><span>{message}</span></div>}

      <h3 className="wr-h">남긴 판 {versions.length}개</h3>
      {versions.length === 0 && <p className="wr-small">아직 남긴 판이 없습니다.</p>}
      {versions.map((v) => (
        <button key={v.n} type="button" onClick={() => open({ kind: 'version', n: v.n, name: `${v.n}판` })} aria-current={pick?.kind === 'version' && pick.n === v.n ? 'true' : undefined} className="wr-row card">
          {v.n}판{v.label ? ` · ${v.label}` : ''}
          <small>{when(v.createdAt)} · {v.chars.toLocaleString()}자</small>
        </button>
      ))}

      <h3 className="wr-h">자동 복구 {recovery.length}개</h3>
      <p className="wr-small" style={{ marginBottom: 6 }}>쓰는 동안 일정 간격으로, 그리고 되돌리기 직전에 자동으로 남습니다. 오래된 자동분은 정리됩니다.</p>
      {recovery.map((r) => (
        <button key={r.key} type="button" onClick={() => open({ kind: 'recovery', key: r.key, name: `${when(r.at)} 복구본` })} aria-current={pick?.kind === 'recovery' && pick.key === r.key ? 'true' : undefined} className="wr-row card">
          {when(r.at)} · {REASON[r.reason]}
          <small>{r.chars.toLocaleString()}자</small>
        </button>
      ))}

      {pick && (
        <section>
          <h3 className="wr-h">{pick.name} 내용</h3>
          <pre className="wr-preview" style={{ maxHeight: 280 }}>{preview || '…'}</pre>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={restore} disabled={busy} className="wr-btn line">이 내용으로 되돌리기</button>
            <button type="button" onClick={() => setPick(null)} className="wr-btn">닫기</button>
          </div>
        </section>
      )}
    </div>
  );
}

type NoteKey = 'characters' | 'world' | 'threads';
const NOTE_FIELDS: { key: NoteKey; label: string; hint: string }[] = [
  { key: 'characters', label: '인물', hint: '이름, 나이, 말투, 관계…' },
  { key: 'world', label: '설정', hint: '장소, 시간, 규칙…' },
  { key: 'threads', label: '복선', hint: '깔아 둔 것, 거둘 곳…' },
];

export function NotesDrawer({ wid }: { wid: string }) {
  const refs = { characters: useRef<HTMLTextAreaElement>(null), world: useRef<HTMLTextAreaElement>(null), threads: useRef<HTMLTextAreaElement>(null) };
  const c = useRef({ rev: 0, saved: '', cur: { characters: '', world: '', threads: '' }, ready: false, blocked: false, resolving: false, keepPrevious: false, inflight: null as Promise<void> | null, again: false, timer: 0, alive: false });
  const [status, setStatus] = useState('불러오는 중');
  const [conflict, setConflict] = useState<Notes | null>(null);
  const [ready, setReady] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [draftBroken, setDraftBroken] = useState(false);
  const sourceDraft = useRef<NotesDraft | undefined>();

  const keepDraft = useCallback(() => {
    const x = c.current;
    const ok = writeNotesDraft(wid, { ...x.cur, baseRev: x.rev, at: new Date().toISOString() });
    if (x.alive) setDraftBroken(!ok);
  }, [wid]);

  const fill = useCallback((n: { characters: string; world: string; threads: string }) => {
    for (const f of NOTE_FIELDS) {
      const el = refs[f.key].current;
      if (el) el.value = n[f.key];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const body = { ...x.cur };
      const sig = JSON.stringify(body);
      if (sig === x.saved) {
        clearNotesDraft(wid, body, sourceDraft.current);
        sourceDraft.current = undefined;
        return Promise.resolve();
      }
      if (x.alive) setStatus('저장 중');
      x.inflight = putNotes(wid, { baseRev: x.rev, ...body, keepPrevious: x.keepPrevious }, keepalive && sig.length * 3 < 60000)
        .then((r) => {
          x.keepPrevious = false;
          x.rev = r.rev;
          x.saved = sig;
          if (JSON.stringify(x.cur) === sig) {
            clearNotesDraft(wid, body, sourceDraft.current);
            sourceDraft.current = undefined;
            if (x.alive) setStatus(`저장됨 ${new Date(r.updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`);
          } else {
            keepDraft();
            x.again = true;
            if (x.alive) setStatus('고친 내용 있음');
          }
        })
        .catch((e: unknown) => {
          if (e instanceof ConflictError) {
            x.blocked = true;
            if (x.alive) {
              setConflict(e.current as Notes);
              setStatus('다른 곳에서 고쳐짐');
            }
            return;
          }
          if (x.alive) {
            setStatus('저장 실패 · 다시 시도합니다');
            x.timer = window.setTimeout(() => void save(), 5000);
          }
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
    [wid, keepDraft],
  );

  useEffect(() => {
    const x = c.current;
    let cancelled = false;
    Object.assign(x, { ready: false, blocked: false, alive: true });
    setReady(false);
    getNotes(wid)
      .then((n) => {
        if (cancelled) return;
        x.rev = n.rev;
        x.cur = { characters: n.characters, world: n.world, threads: n.threads };
        x.saved = JSON.stringify(x.cur);
        const draft = readNotesDraft(wid);
        sourceDraft.current = draft ?? undefined;
        let recovered = false;
        if (draft) {
          const body = { characters: draft.characters, world: draft.world, threads: draft.threads };
          if (JSON.stringify(body) === x.saved) {
            clearNotesDraft(wid, body, draft);
            sourceDraft.current = undefined;
          } else {
            x.cur = body;
            recovered = true;
            if (draft.baseRev !== n.rev) {
              x.rev = draft.baseRev;
              x.blocked = true;
              setConflict(n);
            }
            keepDraft();
          }
        }
        x.ready = true;
        setReady(true);
        fill(x.cur);
        if (x.blocked) setStatus('임시 메모 복구 · 다른 곳에서 고쳐짐');
        else if (recovered) {
          setStatus('저장되지 않았던 메모를 되살렸습니다');
          x.timer = window.setTimeout(() => void save(), 1000);
        } else setStatus(n.updatedAt ? '저장됨' : '비어 있음');
      })
      .catch((e: Error) => !cancelled && setStatus(e.message));
    const leave = () => void save(true);
    const onVisibility = () => { if (document.visibilityState === 'hidden') leave(); };
    window.addEventListener('pagehide', leave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      window.removeEventListener('pagehide', leave);
      document.removeEventListener('visibilitychange', onVisibility);
      void save(true);
      x.alive = false;
    };
  }, [wid, save, fill, keepDraft]);

  const onInput = (key: NoteKey) => (e: React.FormEvent<HTMLTextAreaElement>) => {
    const x = c.current;
    if (x.resolving) { e.currentTarget.value = x.cur[key]; return; }
    if (!x.ready) return;
    x.cur = { ...x.cur, [key]: e.currentTarget.value };
    keepDraft();
    if (x.blocked) return;
    setStatus('고친 내용 있음');
    window.clearTimeout(x.timer);
    x.timer = window.setTimeout(() => void save(), 1000);
  };

  // 어느 쪽을 골라도 고르지 않은 메모는 서버의 notes-recovery 폴더에 남긴다.
  const resolve = async (mine: boolean) => {
    const x = c.current;
    if (!conflict || x.resolving) return;
    x.resolving = true;
    setResolving(true);
    for (const field of NOTE_FIELDS) if (refs[field.key].current) refs[field.key].current!.readOnly = true;
    try {
      if (mine) {
        x.rev = conflict.rev;
        x.blocked = false;
        x.keepPrevious = true;
        setConflict(null);
        keepDraft();
        await save();
      } else {
        await stashNotes(wid, x.cur);
        const fresh = await getNotes(wid);
        clearNotesDraft(wid, x.cur, sourceDraft.current);
        sourceDraft.current = undefined;
        x.cur = { characters: fresh.characters, world: fresh.world, threads: fresh.threads };
        x.rev = fresh.rev;
        x.saved = JSON.stringify(x.cur);
        x.blocked = false;
        fill(x.cur);
        setConflict(null);
        setStatus('저장됨');
      }
    } catch (e) {
      setStatus('메모를 보관하지 못해 바꾸지 않았습니다: ' + (e as Error).message);
    } finally {
      x.resolving = false;
      if (x.alive) setResolving(false);
      for (const field of NOTE_FIELDS) if (refs[field.key].current) refs[field.key].current!.readOnly = !x.ready;
    }
  };

  return (
    <div>
      <p className="wr-small" role="status">{status}</p>
      {draftBroken && <p className="wr-small" role="alert">브라우저 임시 보관이 꺼져 있습니다. 저장 실패 시 창을 닫지 말고 메모를 별도로 복사해 주세요.</p>}
      {conflict && (
        <div className="wr-conflict">
          메모가 다른 곳에서 고쳐졌습니다. 저장을 멈췄습니다. 내 메모는 아래 칸에 그대로 있습니다.
          <div className="wr-small" style={{ marginTop: 8 }}>다른 곳에서 저장된 메모</div>
          <pre>{NOTE_FIELDS.map((f) => `[${f.label}] ${conflict[f.key] || '(비어 있음)'}`).join('\n')}</pre>
          <div className="wr-small">고르지 않은 메모는 원고 폴더의 notes-recovery에 남습니다. 화면에서 꺼내 보는 기능은 아직 없습니다.</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            <button type="button" onClick={() => void resolve(true)} disabled={resolving} className="wr-btn solid">내 메모로 저장</button>
            <button type="button" onClick={() => void resolve(false)} disabled={resolving} className="wr-btn line">다른 곳의 메모 쓰기</button>
          </div>
        </div>
      )}
      {NOTE_FIELDS.map((f) => (
        <label key={f.key} style={{ display: 'block' }}>
          <span className="wr-h" style={{ display: 'block' }}>{f.label}</span>
          <textarea ref={refs[f.key]} readOnly={!ready || resolving} onInput={onInput(f.key)} rows={8} placeholder={f.hint} spellCheck={false} className="wr-input" />
        </label>
      ))}
    </div>
  );
}
