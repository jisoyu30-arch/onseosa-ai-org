import { useState } from 'react';
import {
  Board,
  Cut,
  Shooting,
  SHOOTING_OPTIONS,
  Take,
  buildImagePrompt,
  buildVideoPrompt,
  cutDiffs,
  cutLines,
  diffSignature,
  needsReview,
  newCut,
} from './board';
import { MediaKind, submitGeneration } from '../services/studioApi';
import type { StudioProps } from './Studio';
import { Field, Pill, Tone } from './ui';

/*
 * 컷 보드. 위에 컷 띠, 아래 왼쪽에 고른 컷의 큰 미리보기와 후보, 오른쪽에 대본 줄과 설계, 촬영 설정.
 * 그림과 영상은 미디어 브리지를 거쳐 PixVerse 무료 조합으로만 만든다.
 */

type Pending = { kind: MediaKind; cutId: string } | null;
type View = { kind: MediaKind; id: number } | null;

function cutState(board: Board, cut: Cut): { tone: Tone; label: string } {
  const busy = [...cut.images, ...cut.videos].some((t) => t.status === 'pending');
  if (busy) return { tone: 'warn', label: '생성 중' };
  if (needsReview(board, cut)) return { tone: 'warn', label: '재검토' };
  if (cut.chosenVideo) return { tone: 'ok', label: '영상 채택' };
  if (cut.videos.some((t) => t.status === 'done')) return { tone: 'idle', label: '영상 후보 있음' };
  if (cut.chosenImage) return { tone: 'idle', label: '그림 채택' };
  if (cut.images.some((t) => t.status === 'done')) return { tone: 'idle', label: '그림 후보 있음' };
  return { tone: 'idle', label: '시작 전' };
}

export function CutBoard({ board, setBoard, patchCut, status, locked, selId, setSelId, setError, setNotice }: StudioProps) {
  const [confirm, setConfirm] = useState<Pending>(null);
  const [sending, setSending] = useState(false);
  const [view, setView] = useState<View>(null);

  const cut = board.cuts.find((c) => c.id === selId) ?? board.cuts[0] ?? null;
  const policy = status?.config.policy;
  const version = board.script?.pinnedVersion ?? 0;

  const send = async () => {
    if (!confirm) return;
    const target = board.cuts.find((c) => c.id === confirm.cutId);
    if (!target) return;
    setSending(true);
    setError('');
    try {
      const isImage = confirm.kind === 'image';
      const prompt = isImage ? buildImagePrompt(target) : buildVideoPrompt(target);
      const attempt = (isImage ? target.images.length : target.videos.length) + 1;
      const result = await submitGeneration({
        kind: confirm.kind,
        prompt,
        attempt,
        ...(isImage ? { aspectRatio: '16:9' } : { image: String(target.chosenImage) }),
      });
      const take: Take = {
        id: result.id,
        status: 'pending',
        attempt,
        cost: result.costCredits,
        prompt,
        createdAt: new Date().toISOString(),
        ...(isImage ? {} : { fromImage: target.chosenImage }),
      };
      patchCut(target.id, (c) => (isImage ? { ...c, images: [...c.images, take] } : { ...c, videos: [...c.videos, take] }));
      setNotice(
        result.overBudget
          ? `주의: 이 요청에 ${result.costCredits} 크레딧이 차감됐습니다. 무료 조건이 바뀌었을 수 있습니다.`
          : `${target.name} ${isImage ? '그림' : '영상'} 요청을 보냈습니다 (작업 ${result.id}).`,
      );
      setConfirm(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  const done = (list: Take[]) => list.find((t) => t.status === 'done');
  const shownView: View =
    cut && view && (view.kind === 'image' ? cut.images : cut.videos).some((t) => t.id === view.id)
      ? view
      : cut?.chosenVideo
        ? { kind: 'video', id: cut.chosenVideo }
        : cut && done(cut.videos)
          ? { kind: 'video', id: done(cut.videos)!.id }
          : cut?.chosenImage
            ? { kind: 'image', id: cut.chosenImage }
            : cut && done(cut.images)
              ? { kind: 'image', id: done(cut.images)!.id }
              : null;
  const shownTake = cut && shownView ? (shownView.kind === 'image' ? cut.images : cut.videos).find((t) => t.id === shownView.id) : undefined;
  const lines = cut ? cutLines(board, cut.id) : [];
  const diffs = cut ? cutDiffs(board, cut.id) : [];
  const review = cut ? needsReview(board, cut) : false;

  return (
    <>
      {/* 컷 띠 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {board.cuts.map((c) => {
          const st = cutState(board, c);
          const thumb = c.images.find((t) => t.id === c.chosenImage) ?? done(c.images);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => { setSelId(c.id); setView(null); setConfirm(null); }}
              aria-pressed={c.id === cut?.id}
              className={`flex flex-col gap-2 rounded-xl border p-2 text-left transition ${c.id === cut?.id ? 'border-emerald-400 ring-1 ring-emerald-400 bg-slate-800' : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'}`}
            >
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-900 grid place-items-center text-xs text-slate-500">
                {thumb?.url ? <img src={thumb.url} alt={`${c.name} 시작 그림`} className="h-full w-full object-cover" /> : '그림 없음'}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white">{c.name}</span>
                <Pill tone={st.tone}>{st.label}</Pill>
              </div>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            const c = newCut(board.cuts.length + 1);
            setBoard({ ...board, cuts: [...board.cuts, c] });
            setSelId(c.id);
            setView(null);
          }}
          className="grid min-h-[120px] place-items-center rounded-xl border border-dashed border-slate-600 text-slate-400 hover:border-slate-400"
        >
          + 컷 추가
        </button>
      </div>

      {cut && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* 왼쪽: 큰 미리보기와 후보 */}
          <section className="rounded-xl border border-slate-700 bg-slate-800 p-4 md:p-5 space-y-4 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-white">{cut.name}</h2>
              <Pill tone={cutState(board, cut).tone}>{cutState(board, cut).label}</Pill>
            </div>

            {review && (
              <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 space-y-2">
                <p className="text-sm font-semibold text-amber-200">대본 v{version} 이후 이 컷의 줄이 바뀌었습니다. 지금 그림과 영상이 여전히 맞는지 확인하세요.</p>
                <ul className="space-y-1 text-sm">
                  {diffs.map((d) => (
                    <li key={d.id + d.kind} className="break-words">
                      {d.who ? `${d.who}: ` : ''}
                      {d.kind === 'added' && <><span className="text-emerald-300">새 줄</span> {d.to}</>}
                      {d.kind === 'removed' && <><span className="text-rose-300">빠진 줄</span> <span className="text-slate-400">{d.from}</span></>}
                      {d.kind === 'changed' && <><span className="text-slate-400">{d.from}</span> → {d.to}</>}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => patchCut(cut.id, (c) => ({ ...c, reviewAck: diffSignature(diffs) }))} className="rounded-lg border border-amber-400/60 px-3 py-1.5 text-sm font-semibold">
                    확인함 · 지금 결과 그대로 씀
                  </button>
                  <a href="#script" className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm">대본 열기</a>
                </div>
                <p className="text-xs text-slate-400">결과를 바꿔야 하면 아래에서 그림이나 영상을 다시 받은 뒤 확인을 누르세요.</p>
              </div>
            )}

            <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-700 bg-black grid place-items-center text-slate-500">
              {shownTake?.url ? (
                shownView!.kind === 'video' ? (
                  <video key={shownTake.id} src={shownTake.url} controls loop playsInline className="h-full w-full" />
                ) : (
                  <img src={shownTake.url} alt="고른 후보" className="h-full w-full object-contain" />
                )
              ) : (
                <span>아직 볼 결과가 없습니다</span>
              )}
            </div>
            {shownTake && (
              <p className="text-xs text-slate-400 break-all">
                {shownView!.kind === 'video' ? '영상' : '그림'} 작업 {shownTake.id} · {shownTake.attempt}번째 시도 · 차감 {shownTake.cost ?? '기록 없음(비수기는 0으로 확인)'}
                {shownTake.file ? ` · 파일 ${shownTake.file}` : ''}
                {shownTake.note ? ` · ${shownTake.note}` : ''}
              </p>
            )}

            {confirm && confirm.cutId === cut.id && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 space-y-3">
                <h3 className="text-sm font-bold text-white">보내기 전 확인 · {confirm.kind === 'image' ? '시작 그림' : '영상'}</h3>
                <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm">
                  <dt className="text-slate-400">모델</dt>
                  <dd>{confirm.kind === 'image' ? `${policy?.image.model ?? 'seedream-4.5'} · 16:9` : `${policy?.video.model ?? 'v6'} · 비수기 · 5초 · ${policy?.video.defaultQuality ?? '1080p'} · 무음`}</dd>
                  <dt className="text-slate-400">예상 차감</dt>
                  <dd>0 크레딧 (확인된 무료 조합). 다르게 차감되면 바로 알립니다.</dd>
                  <dt className="text-slate-400">보내는 것</dt>
                  <dd>아래 문장{confirm.kind === 'video' ? `과 채택한 시작 그림(${cut.chosenImage})` : ''}. 대본이나 원고는 보내지 않습니다.</dd>
                </dl>
                <p className="rounded bg-slate-900 p-3 text-xs text-slate-300 break-words">{confirm.kind === 'image' ? buildImagePrompt(cut) : buildVideoPrompt(cut)}</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={sending} onClick={send} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50">
                    {sending ? '보내는 중…' : '보내기'}
                  </button>
                  <button type="button" disabled={sending} onClick={() => setConfirm(null)} className="rounded-lg border border-slate-600 px-4 py-2 text-sm">취소</button>
                </div>
              </div>
            )}

            <TakeList
              title="시작 그림 후보"
              kind="image"
              takes={cut.images}
              chosen={cut.chosenImage}
              viewing={shownView?.kind === 'image' ? shownView.id : undefined}
              onView={(id) => setView({ kind: 'image', id })}
              onChoose={(id) => patchCut(cut.id, (c) => ({ ...c, chosenImage: id }))}
              action={
                <button
                  type="button"
                  disabled={locked || !cut.imagePrompt.trim()}
                  onClick={() => setConfirm({ kind: 'image', cutId: cut.id })}
                  className="rounded-lg border border-slate-500 px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
                >
                  {cut.images.length ? '그림 다시 받기' : '시작 그림 생성'}
                </button>
              }
            />
            <TakeList
              title="영상 후보"
              kind="video"
              takes={cut.videos}
              chosen={cut.chosenVideo}
              viewing={shownView?.kind === 'video' ? shownView.id : undefined}
              onView={(id) => setView({ kind: 'video', id })}
              onChoose={(id) => patchCut(cut.id, (c) => ({ ...c, chosenVideo: id }))}
              action={
                <button
                  type="button"
                  disabled={locked || !cut.chosenImage || !cut.motionPrompt.trim()}
                  onClick={() => setConfirm({ kind: 'video', cutId: cut.id })}
                  className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-slate-900 disabled:opacity-40"
                >
                  {cut.videos.length ? '영상 다시 받기' : '영상 생성 (5초 · 무료)'}
                </button>
              }
              hint={!cut.chosenImage ? '시작 그림을 먼저 채택해야 영상을 만들 수 있습니다.' : undefined}
            />
          </section>

          {/* 오른쪽: 대본 줄, 설계, 촬영 설정 */}
          <aside className="rounded-xl border border-slate-700 bg-slate-800 p-4 md:p-5 space-y-4 min-w-0">
            <Field label="컷 이름">
              <input value={cut.name} onChange={(e) => patchCut(cut.id, (c) => ({ ...c, name: e.target.value }))} className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm" />
            </Field>

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold tracking-wider text-slate-400">대본의 이 컷 · {version ? `v${version} 고정` : '초안'}</h3>
              {lines.length ? (
                <ul className="space-y-1 rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-sm leading-relaxed">
                  {lines.map((b) => (
                    <li key={b.id} className="break-words">
                      {b.type === 'dialogue' ? <><span className="font-semibold text-white">{b.who}</span> {b.text}</> : <span className="text-slate-300">{b.text}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">대본에서 이 컷에 연결한 줄이 없습니다.</p>
              )}
              <a href="#script" className="text-xs text-emerald-300 underline">대본에서 고치기</a>
              <p className="text-xs text-slate-500">대본 줄은 생성에 보내지 않습니다. 아래 설명만 보냅니다.</p>
            </div>

            <Field label="그림 설명 (무엇이 보이는가)">
              <textarea value={cut.imagePrompt} rows={5} onChange={(e) => patchCut(cut.id, (c) => ({ ...c, imagePrompt: e.target.value }))} className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm" />
            </Field>
            <Field label="연기·움직임 (5초 동안 무슨 일이 일어나는가)">
              <textarea value={cut.motionPrompt} rows={4} onChange={(e) => patchCut(cut.id, (c) => ({ ...c, motionPrompt: e.target.value }))} className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm" />
            </Field>

            <div>
              <h3 className="mb-2 text-xs font-bold tracking-wider text-slate-400">촬영 설정</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {(Object.keys(SHOOTING_OPTIONS) as (keyof Shooting)[]).map((key) => (
                  <label key={key} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-300">
                      {SHOOTING_OPTIONS[key].title}
                      <span className="ml-1 text-xs text-slate-500">{SHOOTING_OPTIONS[key].target === 'video' ? '영상' : '그림'}</span>
                    </span>
                    <select
                      value={cut.shooting[key]}
                      onChange={(e) => patchCut(cut.id, (c) => ({ ...c, shooting: { ...c.shooting, [key]: e.target.value } }))}
                      className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm"
                    >
                      {Object.entries(SHOOTING_OPTIONS[key].options).map(([value, opt]) => (
                        <option key={value} value={value}>{opt.label}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">고른 값은 문장으로 바뀌어 프롬프트에 붙습니다. 그림 설정을 바꾸면 그림부터 다시 받아야 반영됩니다.</p>
            </div>

            <details className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-xs text-slate-300">
              <summary className="cursor-pointer font-semibold text-slate-200">실제로 보낼 문장 보기</summary>
              <p className="mt-2 font-semibold text-slate-400">그림</p>
              <p className="break-words">{buildImagePrompt(cut)}</p>
              <p className="mt-2 font-semibold text-slate-400">영상</p>
              <p className="break-words">{buildVideoPrompt(cut)}</p>
            </details>

            <button
              type="button"
              onClick={() => {
                const linked = lines.length ? ` 대본의 ${lines.length}줄은 남지만 연결이 끊깁니다.` : '';
                if (!window.confirm(`${cut.name}을(를) 보드에서 지울까요?${linked} 이미 만든 그림과 영상 파일은 지워지지 않습니다.`)) return;
                const rest = board.cuts.filter((c) => c.id !== cut.id);
                const script = board.script && {
                  ...board.script,
                  blocks: board.script.blocks.map((b) => (b.cutId === cut.id ? { ...b, cutId: undefined } : b)),
                };
                setBoard({ ...board, cuts: rest, ...(script ? { script } : {}) });
                setSelId(rest[0]?.id ?? '');
              }}
              className="text-sm text-rose-300 underline"
            >
              이 컷 지우기
            </button>
          </aside>
        </div>
      )}
    </>
  );
}

function TakeList(props: {
  title: string;
  kind: MediaKind;
  takes: Take[];
  chosen?: number;
  viewing?: number;
  onView: (id: number) => void;
  onChoose: (id: number) => void;
  action: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-white">
          {props.title} <span className="font-normal text-slate-400">{props.takes.length}개</span>
        </h3>
        {props.action}
      </div>
      {props.hint && <p className="text-xs text-slate-400">{props.hint}</p>}
      {props.takes.length === 0 ? (
        <p className="text-sm text-slate-500">아직 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {props.takes.map((t) => (
            <li key={t.id} className={`rounded-lg border p-2 space-y-2 ${props.viewing === t.id ? 'border-emerald-400' : 'border-slate-700'}`}>
              <button type="button" onClick={() => props.onView(t.id)} disabled={t.status !== 'done'} className="block w-full">
                <div className="aspect-video w-full overflow-hidden rounded bg-slate-900 grid place-items-center text-xs text-slate-400">
                  {t.status === 'pending' && <span className="animate-pulse">생성 중…</span>}
                  {t.status === 'failed' && <span className="text-rose-300">실패</span>}
                  {t.status === 'done' && t.url && (props.kind === 'image' ? <img src={t.url} alt={`후보 ${t.attempt}`} className="h-full w-full object-cover" /> : <video src={t.url} muted preload="metadata" className="h-full w-full object-cover" />)}
                </div>
              </button>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-400">{t.attempt}번째</span>
                {props.chosen === t.id ? (
                  <Pill tone="ok">채택</Pill>
                ) : (
                  <button type="button" disabled={t.status !== 'done'} onClick={() => props.onChoose(t.id)} className="rounded border border-slate-500 px-2 py-0.5 font-semibold disabled:opacity-40">
                    채택
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
