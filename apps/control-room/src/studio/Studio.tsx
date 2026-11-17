import { useCallback, useEffect, useRef, useState } from 'react';
import { Board, Cut, Take, ensureScript, needsReview, scriptDiffCount, seedBoard } from './board';
import { BridgeStatus, MediaKind, downloadAsset, getBridgeStatus, getJob, loadBoard, saveBoard } from '../services/studioApi';
import { CutBoard } from './CutBoard';
import { ScriptView } from './ScriptView';
import { Pill } from './ui';

/*
 * 대본 화면과 컷 보드가 함께 쓰는 틀. 보드 하나(대본 + 컷)를 읽고, 바뀌면 저장하고,
 * 진행 중인 생성 작업을 주기적으로 확인한다. 화면을 오가도 같은 상태를 본다.
 */

const BOARD_ID = 'last-ferry-s3';
const POLL_MS = 6000;

export interface StudioProps {
  board: Board;
  setBoard: (b: Board) => void;
  patchCut: (cutId: string, fn: (c: Cut) => Cut) => void;
  status: BridgeStatus | null;
  locked: boolean;
  selId: string;
  setSelId: (id: string) => void;
  setError: (msg: string) => void;
  setNotice: (msg: string) => void;
}

export function Studio({ view }: { view: 'script' | 'cuts' }) {
  const [board, setBoardState] = useState<Board | null>(null);
  const [selId, setSelId] = useState('');
  const [status, setStatus] = useState<BridgeStatus | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [savedAt, setSavedAt] = useState('');
  const boardRef = useRef<Board | null>(null);
  const loaded = useRef(false);
  boardRef.current = board;
  const hasBoard = board !== null;

  const refreshStatus = useCallback(() => {
    getBridgeStatus().then(setStatus).catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    refreshStatus();
    loadBoard<Board>(BOARD_ID)
      .then((saved) => {
        const b = ensureScript(saved && Array.isArray(saved.cuts) ? saved : seedBoard());
        setBoardState(b);
        setSelId(b.cuts[0]?.id ?? '');
        setSavedAt(saved?.savedAt ?? '');
        loaded.current = true;
      })
      .catch((e: Error) => setError(e.message));
  }, [refreshStatus]);

  useEffect(() => {
    if (!board || !loaded.current) return;
    const t = setTimeout(() => {
      saveBoard(BOARD_ID, board).then(setSavedAt).catch((e: Error) => setError('저장 실패: ' + e.message));
    }, 700);
    return () => clearTimeout(t);
  }, [board]);

  const setBoard = useCallback((b: Board) => setBoardState(b), []);

  const patchCut = useCallback((cutId: string, fn: (c: Cut) => Cut) => {
    setBoardState((b) => (b ? { ...b, cuts: b.cuts.map((c) => (c.id === cutId ? fn(c) : c)) } : b));
  }, []);

  const patchTake = useCallback(
    (cutId: string, kind: MediaKind, takeId: number, patch: Partial<Take>) => {
      patchCut(cutId, (c) => {
        const key = kind === 'image' ? 'images' : 'videos';
        return { ...c, [key]: c[key].map((t) => (t.id === takeId ? { ...t, ...patch } : t)) };
      });
    },
    [patchCut],
  );

  // 진행 중인 작업 확인. 끝나면 주소를 받아 두고 파일로도 내려받는다.
  useEffect(() => {
    const tick = async () => {
      const b = boardRef.current;
      if (!b) return;
      for (const cut of b.cuts) {
        for (const kind of ['image', 'video'] as MediaKind[]) {
          const list = kind === 'image' ? cut.images : cut.videos;
          for (const take of list.filter((t) => t.status === 'pending')) {
            try {
              const job = await getJob(kind, take.id);
              if (job.state === 'done') {
                patchTake(cut.id, kind, take.id, { status: 'done', url: job.url });
                downloadAsset(kind, take.id)
                  .then((file) => patchTake(cut.id, kind, take.id, { file }))
                  .catch(() => patchTake(cut.id, kind, take.id, { note: '파일 내려받기 실패. 주소로만 볼 수 있습니다.' }));
                refreshStatus();
              } else if (job.state === 'failed') {
                patchTake(cut.id, kind, take.id, { status: 'failed', note: job.raw });
              }
            } catch (e) {
              setError((e as Error).message);
            }
          }
        }
      }
    };
    tick();
    const timer = setInterval(tick, POLL_MS);
    return () => clearInterval(timer);
    // hasBoard: 보드를 다 읽은 직후에 한 번 바로 확인하기 위해 넣는다.
  }, [patchTake, refreshStatus, hasBoard]);

  // 영상 제작 도구는 집필과 따로 돈다. 별도 서비스(미디어 브리지)가 꺼져 있으면 여기서 멈추고 집필로 돌려보낸다.
  // 이 화면이 브리지나 외부 생성 도구를 대신 켜지는 않는다.
  if (!board) {
    return (
      <div className="p-6 text-slate-300 space-y-3">
        {error ? (
          <>
            <p className="text-lg font-semibold text-white">영상 제작 도구를 지금은 쓸 수 없습니다.</p>
            <p>대본·컷 보드는 집필실과 따로 도는 영상 제작용 서비스에 연결됩니다. 그 서비스가 꺼져 있습니다. 집필실의 원고 저장과는 관계가 없습니다.</p>
            <p className="text-sm text-slate-500">상태: {error}</p>
          </>
        ) : (
          <p>영상 제작 도구를 불러오는 중…</p>
        )}
        <p><a href="#write" className="inline-block rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-slate-900">집필로 돌아가기</a></p>
      </div>
    );
  }

  const locked = status ? !status.config.generationEnabled : false;
  const policy = status?.config.policy;
  const script = board.script!;
  const diffCount = scriptDiffCount(board);
  const adopted = board.cuts.filter((c) => c.chosenVideo).length;
  const reviews = board.cuts.filter((c) => needsReview(board, c)).length;
  const shared: StudioProps = { board, setBoard, patchCut, status, locked, selId, setSelId, setError, setNotice };

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6 text-slate-200">
      <div className="mx-auto max-w-[1280px] space-y-4">
        <section className="rounded-xl border border-slate-700 bg-slate-800 p-4 md:p-5 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white">{board.title}</h1>
              <p className="text-sm text-slate-400 mt-1">{board.scene}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Pill tone={script.pinnedVersion ? 'ok' : 'idle'}>{script.pinnedVersion ? `대본 v${script.pinnedVersion} 고정` : '대본 초안'}</Pill>
                {diffCount > 0 && <Pill tone="warn">고정 이후 수정 {diffCount}줄</Pill>}
                <Pill tone={adopted === board.cuts.length && board.cuts.length > 0 ? 'ok' : 'idle'}>영상 채택 {adopted}/{board.cuts.length}</Pill>
                {reviews > 0 && <Pill tone="warn">재검토 {reviews}컷</Pill>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {status ? (
                <>
                  <Pill tone="idle">PixVerse {status.account.plan ?? ''} · 잔액 {status.account.credits.toLocaleString()}</Pill>
                  <Pill tone={locked ? 'warn' : 'ok'}>{locked ? '생성 잠금' : '생성 가능'}</Pill>
                </>
              ) : (
                <Pill tone="bad">브리지 연결 안 됨</Pill>
              )}
              <span className="text-slate-500">{savedAt ? `저장됨 ${new Date(savedAt).toLocaleTimeString('ko-KR')}` : '아직 저장 전'}</span>
            </div>
          </div>
          {view === 'cuts' && policy && (
            <p className="text-xs text-slate-400">
              무료 정책 · 영상: {policy.video.model}, 비수기 모드, {policy.video.durations.join('·')}초, {policy.video.defaultQuality} · 그림: {policy.image.model} ·
              이 조합 밖의 요청은 브리지가 보내기 전에 거절합니다.
            </p>
          )}
          {view === 'cuts' && locked && (
            <p className="text-sm text-amber-300">
              생성이 잠겨 있습니다. 프로젝트 루트 .env에 PIXVERSE_ALLOW_GENERATION=true 를 넣고 브리지를 다시 켜면 풀립니다. 잠긴 동안에도 보드 편집과 기존 결과 보기는 됩니다.
            </p>
          )}
          <p className="text-xs text-slate-400">
            영상 제작용 샘플 보드입니다. 집필실에서 쓰는 작품·회차와 연결되어 있지 않습니다. <a href="#write" className="underline text-slate-300">집필로 돌아가기</a>
          </p>
          {error && (
            <div className="flex items-start justify-between gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">
              <span>{error}</span>
              <button type="button" className="text-rose-300 underline" onClick={() => setError('')}>닫기</button>
            </div>
          )}
          {notice && (
            <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-600 bg-slate-900/60 p-3 text-sm">
              <span>{notice}</span>
              <button type="button" className="text-slate-400 underline" onClick={() => setNotice('')}>닫기</button>
            </div>
          )}
        </section>
        {view === 'script' ? <ScriptView {...shared} /> : <CutBoard {...shared} />}
      </div>
    </div>
  );
}
