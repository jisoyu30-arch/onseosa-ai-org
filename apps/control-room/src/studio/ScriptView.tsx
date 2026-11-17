import { ScriptBlock, cutDiffs, cutLines, diffSignature, needsReview, newBlock, scriptDiffCount, snapshotScript } from './board';
import type { StudioProps } from './Studio';
import { Pill } from './ui';

/*
 * 대본 화면. 줄(씬 제목·지문·대사)을 쓰고 고치고, 줄마다 어느 컷에 속하는지 정한다.
 * 대본을 판으로 고정한 뒤에 줄을 고치면, 이미 그림이나 영상을 만든 컷에 재검토 표시가 붙는다.
 */

const TYPE_LABEL: Record<ScriptBlock['type'], string> = { heading: '씬 제목', action: '지문', dialogue: '대사' };

export function ScriptView({ board, setBoard, patchCut, setSelId, setNotice }: StudioProps) {
  const script = board.script!;
  const base = script.base;
  const blocks = script.blocks;
  const diffCount = scriptDiffCount(board);
  const reviewCuts = board.cuts.filter((c) => needsReview(board, c));

  const setBlocks = (next: ScriptBlock[]) => setBoard({ ...board, script: { ...script, blocks: next } });
  const patch = (id: string, change: Partial<ScriptBlock>) => setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...change } : b)));
  const move = (index: number, delta: number) => {
    const to = index + delta;
    if (to < 0 || to >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[to]] = [next[to], next[index]];
    setBlocks(next);
  };
  const insertAfter = (index: number) => {
    const prev = blocks[index];
    const fresh = newBlock(prev?.type === 'heading' ? 'action' : (prev?.type ?? 'action'), prev?.cutId);
    setBlocks([...blocks.slice(0, index + 1), fresh, ...blocks.slice(index + 1)]);
  };
  const remove = (index: number) => {
    const b = blocks[index];
    if (b.text.trim() && !window.confirm('이 줄을 지울까요?')) return;
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const pin = () => {
    const version = script.pinnedVersion + 1;
    setBoard({
      ...board,
      script: { ...script, pinnedVersion: version, base: snapshotScript(blocks), pinnedAt: new Date().toISOString() },
      cuts: board.cuts.map((c) => ({ ...c, reviewAck: undefined })),
    });
    setNotice(`대본을 v${version}로 고정했습니다.`);
  };

  const goCut = (cutId: string) => {
    setSelId(cutId);
    window.location.hash = '#cuts';
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-xl border border-slate-700 bg-slate-800 p-4 md:p-5 space-y-3 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-white">대본</h2>
          <span className="text-sm text-slate-400">{blocks.length}줄 · 쓰는 대로 저장됩니다</span>
        </div>

        <ol className="space-y-2">
          {blocks.map((b, i) => {
            const was = base?.[b.id];
            const added = !!base && !was;
            const changed = !!was && (was.text !== b.text || (was.who ?? '') !== (b.who ?? '') || was.cutId !== b.cutId);
            const cut = board.cuts.find((c) => c.id === b.cutId);
            return (
              <li
                key={b.id}
                className={`rounded-lg border p-3 space-y-2 ${added || changed ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-700 bg-slate-900/40'}`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <select value={b.type} onChange={(e) => patch(b.id, { type: e.target.value as ScriptBlock['type'] })} aria-label="줄 종류" className="rounded border border-slate-600 bg-slate-900 px-2 py-1">
                    {(Object.keys(TYPE_LABEL) as ScriptBlock['type'][]).map((t) => (
                      <option key={t} value={t}>{TYPE_LABEL[t]}</option>
                    ))}
                  </select>
                  {b.type !== 'heading' && (
                    <select value={b.cutId ?? ''} onChange={(e) => patch(b.id, { cutId: e.target.value || undefined })} aria-label="연결할 컷" className="rounded border border-slate-600 bg-slate-900 px-2 py-1">
                      <option value="">컷 없음</option>
                      {board.cuts.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  )}
                  {added && <Pill tone="warn">v{script.pinnedVersion} 이후 추가</Pill>}
                  {changed && <Pill tone="warn">v{script.pinnedVersion} 이후 수정</Pill>}
                  <span className="ml-auto flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="위로" className="rounded border border-slate-600 px-2 py-1 disabled:opacity-30">↑</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label="아래로" className="rounded border border-slate-600 px-2 py-1 disabled:opacity-30">↓</button>
                    <button type="button" onClick={() => insertAfter(i)} className="rounded border border-slate-600 px-2 py-1">아래에 줄 추가</button>
                    <button type="button" onClick={() => remove(i)} className="rounded border border-slate-600 px-2 py-1 text-rose-300">지우기</button>
                  </span>
                </div>
                <div className={b.type === 'dialogue' ? 'grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2' : ''}>
                  {b.type === 'dialogue' && (
                    <input value={b.who ?? ''} onChange={(e) => patch(b.id, { who: e.target.value })} placeholder="인물" aria-label="인물" className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-semibold" />
                  )}
                  <textarea
                    value={b.text}
                    onChange={(e) => patch(b.id, { text: e.target.value })}
                    rows={Math.max(1, Math.ceil(b.text.length / 34))}
                    placeholder={b.type === 'heading' ? 'S#. 장소 / 실내외 / 시간' : b.type === 'dialogue' ? '대사' : '지문'}
                    aria-label={TYPE_LABEL[b.type]}
                    className={`w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 ${b.type === 'heading' ? 'text-sm font-bold text-white' : 'text-[15px] leading-relaxed'}`}
                  />
                </div>
                {changed && was && was.text !== b.text && (
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="break-words">v{script.pinnedVersion} 문장: {was.text}</span>
                    <button type="button" onClick={() => patch(b.id, { text: was.text })} className="rounded border border-slate-600 px-2 py-0.5 text-slate-200">되돌리기</button>
                  </div>
                )}
                {cut && needsReview(board, cut) && (added || changed) && (
                  <p className="text-xs text-amber-300">이 줄 때문에 {cut.name}에 재검토 표시가 붙었습니다.</p>
                )}
              </li>
            );
          })}
        </ol>
        <button type="button" onClick={() => insertAfter(blocks.length - 1)} className="rounded-lg border border-dashed border-slate-600 px-4 py-2 text-sm text-slate-300">
          + 맨 아래에 줄 추가
        </button>
      </section>

      <aside className="space-y-4 min-w-0">
        <section className="rounded-xl border border-slate-700 bg-slate-800 p-4 md:p-5 space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-slate-400">판</h3>
          {script.pinnedVersion === 0 ? (
            <>
              <p className="text-sm text-slate-300">아직 초안입니다. 고정하면 그 뒤로 고친 줄을 추적해, 이미 만든 컷에 재검토를 알립니다.</p>
              <button type="button" onClick={pin} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900">v1로 고정</button>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-300">
                v{script.pinnedVersion} 고정{script.pinnedAt ? ` · ${new Date(script.pinnedAt).toLocaleString('ko-KR')}` : ''}.{' '}
                {diffCount ? `그 뒤로 달라진 줄이 ${diffCount}개 있습니다.` : '그 뒤로 달라진 줄이 없습니다.'}
              </p>
              <button
                type="button"
                onClick={pin}
                disabled={diffCount === 0 || reviewCuts.length > 0}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-40"
              >
                v{script.pinnedVersion + 1}로 다시 고정
              </button>
              {reviewCuts.length > 0 && (
                <p className="text-xs text-amber-300">재검토가 남은 컷({reviewCuts.map((c) => c.name).join(', ')})을 먼저 확인해야 다시 고정할 수 있습니다.</p>
              )}
            </>
          )}
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-800 p-4 md:p-5 space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-slate-400">컷별 상태</h3>
          <ul className="space-y-3">
            {board.cuts.map((c) => {
              const review = needsReview(board, c);
              const diffs = cutDiffs(board, c.id);
              return (
                <li key={c.id} className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-white">{c.name}</span>
                    <span className="flex flex-wrap gap-1.5">
                      <Pill tone="idle">{cutLines(board, c.id).length}줄</Pill>
                      {review ? <Pill tone="warn">재검토</Pill> : c.chosenVideo ? <Pill tone="ok">영상 채택</Pill> : c.videos.length ? <Pill tone="idle">영상 후보</Pill> : c.images.length ? <Pill tone="idle">그림 후보</Pill> : <Pill tone="idle">시작 전</Pill>}
                    </span>
                  </div>
                  {review && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => patchCut(c.id, (x) => ({ ...x, reviewAck: diffSignature(diffs) }))}
                        className="rounded border border-slate-600 px-2 py-0.5"
                      >
                        확인함 · 지금 결과 그대로 씀
                      </button>
                    </div>
                  )}
                  <button type="button" onClick={() => goCut(c.id)} className="text-xs text-emerald-300 underline">컷 보드에서 보기</button>
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-slate-500">아직 그림이나 영상을 만들지 않은 컷은 대본을 고쳐도 재검토가 붙지 않습니다.</p>
        </section>
      </aside>
    </div>
  );
}
