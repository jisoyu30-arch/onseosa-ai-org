import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CardKind, ConflictError, MapBody, MapCard, MapLink, Work, WorkMap, getMap, putMap, stashMap } from '../../services/writeApi';
import { clearMapDraft, readMapDraft, writeMapDraft } from './local';

/*
 * 작품 연결 지도. 작가가 직접 만든 카드(등장인물·주제·주요 사건·조사 자료)와,
 * 두 카드 사이에 이름을 붙인 연결을 한 화면에서 본다.
 *
 * - 본문이나 자유 메모를 읽어 자동으로 만들지 않는다. 적은 것만 있다.
 * - 카드와 연결은 ID로 이어진다. 이름을 고쳐도 선이 끊기지 않는다.
 * - 회차는 기존 원고 ID로 가리킨다. 목록에서 뺀 회차는 "뺀 회차"로 보이고, 되돌리면 다시 열 수 있다.
 * - 저장 규칙은 원고와 같다: rev 비교, 실패하면 알리고 다시 시도, 충돌이면 둘 다 남긴다.
 * - 카드는 종류별 칸에 놓는다(넓으면 인물 | 사건 | 주제·자료, 좁으면 두 칸). 선은 카드의 실제 자리를 재서
 *   카드 뒤로 그리고, 이름표는 다른 카드를 가리지 않는 자리로 옮겨 카드 위에 적는다. 자동 배치는 여기까지만 한다.
 */

const KINDS: { key: CardKind; label: string; mark: string }[] = [
  { key: 'person', label: '등장인물', mark: '인물' },
  { key: 'theme', label: '주제', mark: '주제' },
  { key: 'event', label: '주요 사건', mark: '사건' },
  { key: 'source', label: '조사 자료', mark: '자료' },
];
export const KIND = Object.fromEntries(KINDS.map((k) => [k.key, k])) as Record<CardKind, (typeof KINDS)[number]>;

const freshId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const sig = (m: MapBody) => JSON.stringify({ cards: m.cards, links: m.links });
export const cardName = (card?: MapCard) => (card ? card.title.trim() || '(이름 없음)' : '(없는 카드)');

interface Geo { w: number; h: number; lines: { id: string; d: string; lx: number; ly: number; anchor: 'middle' | 'start' | 'end' }[] }

// 카드 가운데에서 상대 카드 쪽으로 나가다 카드 테두리와 만나는 점.
function edgePoint(r: DOMRect, tx: number, ty: number, ox: number, oy: number) {
  const cx = r.left + r.width / 2 - ox;
  const cy = r.top + r.height / 2 - oy;
  const dx = tx - cx;
  const dy = ty - cy;
  if (!dx && !dy) return { x: cx, y: cy };
  const k = Math.min(dx ? r.width / 2 / Math.abs(dx) : Infinity, dy ? r.height / 2 / Math.abs(dy) : Infinity, 1);
  return { x: cx + dx * k, y: cy + dy * k };
}

interface Props {
  wid: string;
  work: Work;
  /** 지금 집필 화면에 열려 있는 회차 */
  currentDocId: string;
  onOpenDoc: (did: string) => void;
  onBack: () => void;
  /** 처음 열 때 골라 둘 카드. "이 회차의 자료"의 "지도에서 보기"가 넘긴다. */
  focusCardId?: string;
}

export function MapView({ wid, work, currentDocId, onOpenDoc, onBack, focusCardId = '' }: Props) {
  const c = useRef({ rev: 0, saved: sig({ cards: [], links: [] }), cur: { cards: [], links: [] } as MapBody, ready: false, blocked: false, resolving: false, keepPrevious: false, inflight: null as Promise<void> | null, again: false, timer: 0, alive: false, fails: 0 });
  const [map, setMap] = useState<MapBody>({ cards: [], links: [] });
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('불러오는 중');
  const [failed, setFailed] = useState(false);
  const [conflict, setConflict] = useState<WorkMap | null>(null);
  const [resolving, setResolving] = useState(false);
  const [draftBroken, setDraftBroken] = useState(false);
  const [sel, setSel] = useState(focusCardId);
  const [linkTo, setLinkTo] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [docPick, setDocPick] = useState('');
  const [geo, setGeo] = useState<Geo>({ w: 0, h: 0, lines: [] });
  const [tick, setTick] = useState(0);
  const board = useRef<HTMLDivElement>(null);

  const keepDraft = useCallback(() => {
    const x = c.current;
    const ok = writeMapDraft(wid, { ...x.cur, baseRev: x.rev, at: new Date().toISOString() });
    if (x.alive) setDraftBroken(!ok);
  }, [wid]);

  const save = useCallback(
    (keepalive = false): Promise<void> => {
      const x = c.current;
      window.clearTimeout(x.timer);
      if (!x.ready || x.blocked) return Promise.resolve();
      if (x.inflight) {
        x.again = true;
        return x.inflight;
      }
      const body = x.cur;
      const mark = sig(body);
      if (mark === x.saved) {
        clearMapDraft(wid);
        return Promise.resolve();
      }
      if (x.alive) setStatus('저장 중');
      x.inflight = putMap(wid, { baseRev: x.rev, cards: body.cards, links: body.links, keepPrevious: x.keepPrevious }, keepalive && mark.length * 3 < 60000)
        .then((r) => {
          x.keepPrevious = false;
          x.rev = r.rev;
          x.saved = mark;
          x.fails = 0;
          if (x.alive) setFailed(false);
          if (sig(x.cur) === mark) {
            clearMapDraft(wid);
            if (x.alive) setStatus(`저장됨 ${new Date(r.updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`);
          } else {
            keepDraft(); // 그사이 더 고쳤다. 임시 보관본의 기준 rev를 맞춘다.
            x.again = true;
            if (x.alive) setStatus('고친 내용 있음');
          }
        })
        .catch((e: unknown) => {
          if (e instanceof ConflictError) {
            x.blocked = true;
            if (x.alive) {
              setConflict(e.current as WorkMap);
              setStatus('다른 곳에서 고쳐짐 · 저장 멈춤');
            }
            return;
          }
          x.fails += 1;
          if (x.alive) {
            setFailed(true);
            setStatus(`저장 실패 — 고친 내용은 이 브라우저에 보관 중이고, 자동으로 다시 시도합니다 (${(e as Error).message})`);
            x.timer = window.setTimeout(() => void save(), Math.min(30000, 3000 * x.fails));
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
    getMap(wid)
      .then((server) => {
        if (cancelled) return;
        x.rev = server.rev;
        x.cur = { cards: server.cards, links: server.links };
        x.saved = sig(x.cur);
        const draft = readMapDraft(wid);
        let recovered = false;
        if (draft) {
          const body = { cards: draft.cards, links: draft.links } as unknown as MapBody;
          if (sig(body) === x.saved) clearMapDraft(wid);
          else {
            x.cur = body;
            recovered = true;
            if (draft.baseRev !== server.rev) {
              x.rev = draft.baseRev;
              x.blocked = true;
              setConflict(server);
            }
          }
        }
        x.ready = true;
        setReady(true);
        setMap(x.cur);
        if (x.blocked) setStatus('저장하지 못했던 지도를 되살렸습니다 · 다른 곳에서도 고쳐짐');
        else if (recovered) {
          setStatus('저장하지 못했던 지도를 되살렸습니다');
          x.timer = window.setTimeout(() => void save(), 600);
        } else setStatus(server.updatedAt ? '저장됨' : '');
      })
      .catch((e: Error) => !cancelled && setStatus('지도를 불러오지 못했습니다: ' + e.message));
    const leave = () => void save(true);
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') leave();
    };
    window.addEventListener('pagehide', leave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      window.removeEventListener('pagehide', leave);
      document.removeEventListener('visibilitychange', onVisibility);
      void save(true);
      x.alive = false;
    };
  }, [wid, save]);

  // 지도를 고친다. 화면에 바로 반영하고, 이 브라우저에 보관한 뒤, 잠깐 뒤에 서버에 저장한다.
  const change = useCallback(
    (fn: (m: MapBody) => MapBody) => {
      const x = c.current;
      if (!x.ready || x.resolving) return;
      const next = fn(x.cur);
      if (next === x.cur) return;
      x.cur = next;
      setMap(next);
      keepDraft();
      if (x.blocked) return;
      setStatus('고친 내용 있음');
      window.clearTimeout(x.timer);
      x.timer = window.setTimeout(() => void save(), 600);
    },
    [keepDraft, save],
  );

  // 충돌: 어느 쪽을 골라도 고르지 않은 지도는 서버의 map-recovery 폴더에 남긴다.
  const resolve = async (mine: boolean) => {
    const x = c.current;
    if (!conflict || x.resolving) return;
    x.resolving = true;
    setResolving(true);
    try {
      if (mine) {
        x.rev = conflict.rev;
        x.blocked = false;
        x.keepPrevious = true;
        setConflict(null);
        keepDraft();
        await save();
      } else {
        await stashMap(wid, x.cur);
        const fresh = await getMap(wid);
        clearMapDraft(wid);
        x.cur = { cards: fresh.cards, links: fresh.links };
        x.rev = fresh.rev;
        x.saved = sig(x.cur);
        x.blocked = false;
        setMap(x.cur);
        setConflict(null);
        setStatus('저장됨');
      }
    } catch (e) {
      setStatus('내 지도를 보관하지 못해 바꾸지 않았습니다: ' + (e as Error).message);
    } finally {
      x.resolving = false;
      if (x.alive) setResolving(false);
    }
  };

  const byId = new Map(map.cards.map((card) => [card.id, card]));
  const selected = byId.get(sel);
  const myLinks = selected ? map.links.filter((l) => l.from === sel || l.to === sel) : [];
  const neighbours = new Set(myLinks.map((l) => (l.from === sel ? l.to : l.from)));
  const docTitle = (id: string) => {
    const live = work.docs.find((d) => d.id === id);
    if (live) return { title: live.title || '(제목 없음)', removed: false };
    const gone = (work.removed ?? []).find((d) => d.id === id);
    return { title: gone?.title || '(제목 없음)', removed: true };
  };

  const addCard = (kind: CardKind) => {
    const id = freshId('c');
    change((m) => ({ ...m, cards: [...m.cards, { id, kind, title: '', note: '', source: '', docIds: [] }] }));
    setSel(id);
  };
  const patchCard = (id: string, patch: Partial<MapCard>) => change((m) => ({ ...m, cards: m.cards.map((card) => (card.id === id ? { ...card, ...patch } : card)) }));
  const removeCard = (id: string) => {
    const card = byId.get(id);
    if (!card) return;
    const count = map.links.filter((l) => l.from === id || l.to === id).length;
    if (!window.confirm(`"${cardName(card)}" 카드를 지울까요?${count ? `\n이 카드에 이어진 연결 ${count}개도 함께 지워집니다.` : ''}`)) return;
    change((m) => ({ cards: m.cards.filter((x) => x.id !== id), links: m.links.filter((l) => l.from !== id && l.to !== id) }));
    setSel('');
  };
  const addLink = () => {
    if (!selected || !linkTo || linkTo === sel || !byId.has(linkTo)) return;
    const link: MapLink = { id: freshId('l'), from: sel, to: linkTo, label: linkLabel.trim() };
    change((m) => ({ ...m, links: [...m.links, link] }));
    setLinkTo('');
    setLinkLabel('');
  };
  const patchLink = (id: string, label: string) => change((m) => ({ ...m, links: m.links.map((l) => (l.id === id ? { ...l, label } : l)) }));
  const removeLink = (id: string) => change((m) => ({ ...m, links: m.links.filter((l) => l.id !== id) }));

  // 선 자리 재기. 카드가 실제로 놓인 자리를 읽어 선과 이름표 자리를 정한다.
  useLayoutEffect(() => {
    const el = board.current;
    if (!el) return;
    const base = el.getBoundingClientRect();
    const ox = base.left - el.scrollLeft;
    const oy = base.top - el.scrollTop;
    const rects = new Map<string, DOMRect>();
    el.querySelectorAll<HTMLElement>('[data-card-id]').forEach((node) => rects.set(node.dataset.cardId!, node.getBoundingClientRect()));
    const kindOf = new Map(map.cards.map((card) => [card.id, card.kind]));
    // 이름표 상자가 (양 끝 카드가 아닌) 다른 카드나 이미 놓은 이름표와 겹치는지
    const placed: { l: number; t: number; r: number; b: number }[] = [];
    const box = (x: number, y: number, chars: number, anchor: string) => {
      const w = Math.max(2, chars) * 12.5 + 8;
      const l = anchor === 'start' ? x - 2 : anchor === 'end' ? x - w + 2 : x - w / 2;
      return { l, t: y - 10, r: l + w, b: y + 10 };
    };
    const hits = (q: { l: number; t: number; r: number; b: number }, skip: string[]) => {
      for (const [id, r] of rects) {
        if (skip.includes(id)) continue;
        if (q.l < r.right - ox && q.r > r.left - ox && q.t < r.bottom - oy && q.b > r.top - oy) return true;
      }
      return placed.some((o) => q.l < o.r && q.r > o.l && q.t < o.b && q.b > o.t);
    };
    const lines: Geo['lines'] = [];
    for (const l of map.links) {
      const a = rects.get(l.from);
      const b = rects.get(l.to);
      if (!a || !b) continue;
      const chars = (l.label || '(이름 없는 연결)').length;
      let d: string;
      let lx: number;
      let ly: number;
      let anchor: 'middle' | 'start' | 'end' = 'middle';
      if (kindOf.get(l.from) === kindOf.get(l.to)) {
        // 같은 칸의 카드끼리는 오른쪽으로 휘어 나가는 선으로 잇는다. 사이에 낀 카드를 가로지르지 않는다.
        // 오른쪽에 이름표 자리가 모자라면(맨 오른쪽 칸) 왼쪽으로 휜다.
        const right = Math.max(a.right, b.right) - ox;
        const toLeft = right + 30 + chars * 12.5 + 8 > el.clientWidth;
        const x1 = (toLeft ? a.left : a.right) - ox;
        const y1 = a.top + a.height / 2 - oy;
        const x2 = (toLeft ? b.left : b.right) - ox;
        const y2 = b.top + b.height / 2 - oy;
        const edge = toLeft ? Math.min(x1, x2) : Math.max(x1, x2);
        const bulge = edge + (toLeft ? -30 : 30);
        d = `M${Math.round(x1)},${Math.round(y1)} C${Math.round(bulge)},${Math.round(y1)} ${Math.round(bulge)},${Math.round(y2)} ${Math.round(x2)},${Math.round(y2)}`;
        lx = Math.round(edge + (toLeft ? -26 : 26));
        ly = Math.round((y1 + y2) / 2);
        anchor = toLeft ? 'end' : 'start';
        for (let step = 0; step < 6 && hits(box(lx, ly, chars, anchor), []); step++) ly += 18;
      } else {
        const ac = { x: a.left + a.width / 2 - ox, y: a.top + a.height / 2 - oy };
        const bc = { x: b.left + b.width / 2 - ox, y: b.top + b.height / 2 - oy };
        const p1 = edgePoint(a, bc.x, bc.y, ox, oy);
        const p2 = edgePoint(b, ac.x, ac.y, ox, oy);
        d = `M${Math.round(p1.x)},${Math.round(p1.y)} L${Math.round(p2.x)},${Math.round(p2.y)}`;
        // 가운데부터 시작해 다른 카드·이름표를 가리지 않는 자리를 찾는다.
        let t = 0.5;
        for (const tryT of [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8]) {
          if (!hits(box(p1.x + (p2.x - p1.x) * tryT, p1.y + (p2.y - p1.y) * tryT, chars, 'middle'), [])) {
            t = tryT;
            break;
          }
        }
        lx = Math.round(p1.x + (p2.x - p1.x) * t);
        ly = Math.round(p1.y + (p2.y - p1.y) * t);
      }
      placed.push(box(lx, ly, chars, anchor));
      lines.push({ id: l.id, d, lx, ly, anchor });
    }
    const next = { w: el.scrollWidth, h: el.scrollHeight, lines };
    setGeo((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [map, sel, tick, ready]);

  useEffect(() => {
    const el = board.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setTick((t) => t + 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ready]);

  // 고른 채로 열렸으면 그 카드가 보이는 자리로 옮긴다.
  useEffect(() => {
    if (!ready || !focusCardId) return;
    board.current?.querySelector(`[data-card-id="${focusCardId}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [ready, focusCardId]);

  const linkById = new Map(map.links.map((l) => [l.id, l]));
  const others = map.cards.filter((card) => card.id !== sel);
  const freeDocs = selected ? [...work.docs, ...(work.removed ?? [])].filter((d) => !selected.docIds.includes(d.id)) : [];

  return (
    <div className="wr-map">
      <div className="wr-map-bar">
        <button type="button" onClick={onBack} className="wr-btn line">쓰던 곳으로</button>
        <span className="wr-small" role="status" style={failed ? { color: 'var(--bad)' } : undefined}>{status}</span>
        {failed && <button type="button" onClick={() => void save()} className="wr-btn line" style={{ padding: '1px 8px' }}>지금 다시 시도</button>}
      </div>
      {draftBroken && <p className="wr-small" role="alert">브라우저 임시 보관이 꺼져 있습니다. 저장 실패가 보이면 창을 닫지 말아 주세요.</p>}
      {conflict && (
        <div className="wr-conflict">
          연결 지도가 다른 곳에서 고쳐졌습니다. 저장을 멈췄습니다. 내 지도는 아래에 그대로 있습니다.
          <div className="wr-small" style={{ marginTop: 6 }}>다른 곳에서 저장된 지도: 카드 {conflict.cards.length}장 · 연결 {conflict.links.length}개</div>
          <div className="wr-small">고르지 않은 지도는 원고 폴더의 map-recovery에 남습니다.</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            <button type="button" onClick={() => void resolve(true)} disabled={resolving} className="wr-btn solid">내 지도로 저장</button>
            <button type="button" onClick={() => void resolve(false)} disabled={resolving} className="wr-btn line">다른 곳의 지도 쓰기</button>
          </div>
        </div>
      )}

      <div className="wr-map-add">
        <span className="wr-small">카드 만들기</span>
        {KINDS.map((k) => (
          <button key={k.key} type="button" onClick={() => addCard(k.key)} disabled={!ready || resolving} className="wr-btn line">+ {k.label}</button>
        ))}
      </div>

      {ready && map.cards.length === 0 && (
        <p className="wr-small" style={{ padding: '10px 2px' }}>
          아직 카드가 없습니다. 위에서 카드를 만들고, 카드를 눌러 다른 카드와 이으면 선과 이름이 여기에 보입니다. 비워 둬도 집필에는 아무 영향이 없습니다.
        </p>
      )}

      <div className="wr-board" ref={board} data-has-selection={selected ? 'true' : undefined}>
        {KINDS.map((k) => {
          const cards = map.cards.filter((card) => card.kind === k.key);
          if (cards.length === 0) return null;
          return (
            <section key={k.key} className="wr-lane" data-lane={k.key} aria-label={k.label}>
              <h3 className="wr-h">{k.label} {cards.length}</h3>
              <div className="wr-lane-cards">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className="wr-card"
                    data-card-id={card.id}
                    data-kind={card.kind}
                    data-selected={card.id === sel ? 'true' : undefined}
                    data-linked={neighbours.has(card.id) ? 'true' : undefined}
                    aria-pressed={card.id === sel}
                    onClick={() => setSel(card.id === sel ? '' : card.id)}
                  >
                    <span className="wr-card-kind">{k.mark}</span>
                    <span className="wr-card-title">{cardName(card)}</span>
                    {card.docIds.length > 0 && <span className="wr-card-docs">회차 {card.docIds.length}</span>}
                  </button>
                ))}
              </div>
            </section>
          );
        })}
        <svg className="wr-lines" width={geo.w} height={geo.h} aria-hidden="true">
          {geo.lines.map((line) => {
            const link = linkById.get(line.id);
            if (!link) return null;
            const active = !!selected && (link.from === sel || link.to === sel);
            return <path key={line.id} d={line.d} data-link-id={line.id} data-active={active ? 'true' : undefined} />;
          })}
        </svg>
        <svg className="wr-labels" width={geo.w} height={geo.h} aria-hidden="true">
          {geo.lines.map((line) => {
            const link = linkById.get(line.id);
            if (!link) return null;
            const active = !!selected && (link.from === sel || link.to === sel);
            return (
              <text key={line.id} x={line.lx} y={line.ly} textAnchor={line.anchor} dominantBaseline="middle" data-link-id={line.id} data-active={active ? 'true' : undefined}>
                {link.label || '(이름 없는 연결)'}
              </text>
            );
          })}
        </svg>
      </div>

      {selected && (
        <section className="wr-map-detail" aria-label="선택한 카드">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <strong style={{ color: 'var(--ink)' }}>{KIND[selected.kind].label} 카드</strong>
            <button type="button" onClick={() => setSel('')} className="wr-btn">선택 풀기</button>
          </div>
          <label className="wr-field">
            <span>이름</span>
            <input value={selected.title} onChange={(e) => patchCard(sel, { title: e.target.value })} maxLength={200} aria-label="카드 이름" className="wr-input" autoFocus={!selected.title} />
          </label>
          {selected.kind === 'source' && (
            <label className="wr-field">
              <span>출처</span>
              <input value={selected.source} onChange={(e) => patchCard(sel, { source: e.target.value })} maxLength={1000} aria-label="출처" placeholder="책·기사·면담·주소…" className="wr-input" />
            </label>
          )}
          <label className="wr-field">
            <span>짧은 메모</span>
            <textarea value={selected.note} onChange={(e) => patchCard(sel, { note: e.target.value })} maxLength={5000} rows={2} aria-label="카드 메모" className="wr-input" />
          </label>

          <h3 className="wr-h">직접 연결 {myLinks.length}개</h3>
          {myLinks.length === 0 && <p className="wr-small">아직 이어진 카드가 없습니다.</p>}
          <ul className="wr-links">
            {myLinks.map((l) => {
              const other = byId.get(l.from === sel ? l.to : l.from);
              return (
                <li key={l.id} data-link-row={l.id}>
                  {/* 어느 쪽 카드에서 보아도 같은 문장으로 읽힌다: 잇기 시작한 카드 ─ 이름 → 이은 카드 */}
                  <span className="wr-rel" data-rel>{cardName(byId.get(l.from))} ─ {l.label || '(이름 없는 연결)'} → {cardName(byId.get(l.to))}</span>
                  <button type="button" className="wr-btn line" onClick={() => other && setSel(other.id)} title="이 카드 보기">
                    <span className="wr-card-kind">{other ? KIND[other.kind].mark : '?'}</span> {cardName(other)}
                  </button>
                  <input value={l.label} onChange={(e) => patchLink(l.id, e.target.value)} maxLength={80} aria-label={`${cardName(other)}와의 연결 이름`} placeholder="연결 이름" className="wr-input" />
                  <button type="button" onClick={() => removeLink(l.id)} className="wr-btn danger">끊기</button>
                </li>
              );
            })}
          </ul>
          <div className="wr-link-new">
            <select value={linkTo} onChange={(e) => setLinkTo(e.target.value)} aria-label="이을 카드" className="wr-input" disabled={others.length === 0}>
              <option value="">{others.length ? '이을 카드 고르기' : '다른 카드를 먼저 만드세요'}</option>
              {KINDS.map((k) => {
                const list = others.filter((card) => card.kind === k.key);
                return list.length ? (
                  <optgroup key={k.key} label={k.label}>
                    {list.map((card) => <option key={card.id} value={card.id}>{cardName(card)}</option>)}
                  </optgroup>
                ) : null;
              })}
            </select>
            <input
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) addLink();
              }}
              maxLength={80}
              aria-label="새 연결 이름"
              placeholder="연결 이름 — 예: 남매, 목격했다, 뒷받침한다"
              className="wr-input"
            />
            <button type="button" onClick={addLink} disabled={!linkTo} className="wr-btn solid">잇기</button>
          </div>

          <h3 className="wr-h">관련 회차 {selected.docIds.length}편</h3>
          <ul className="wr-links">
            {selected.docIds.map((id) => {
              const d = docTitle(id);
              return (
                <li key={id} data-doc-row={id}>
                  <span style={{ flex: 1, minWidth: 0 }}>{d.title}{d.removed && <span className="wr-chip">뺀 회차</span>}{id === currentDocId && <span className="wr-chip">지금 쓰는 회차</span>}</span>
                  <button type="button" onClick={() => onOpenDoc(id)} disabled={d.removed} title={d.removed ? '목록의 "뺀 원고"에서 되돌리면 다시 열 수 있습니다' : undefined} className="wr-btn line">관련 회차 열기</button>
                  <button type="button" onClick={() => patchCard(sel, { docIds: selected.docIds.filter((x) => x !== id) })} className="wr-btn danger">끊기</button>
                </li>
              );
            })}
          </ul>
          <div className="wr-link-new">
            <select value={docPick} onChange={(e) => setDocPick(e.target.value)} aria-label="이을 회차" className="wr-input" disabled={freeDocs.length === 0}>
              <option value="">{freeDocs.length ? '이을 회차 고르기' : '이을 회차가 더 없습니다'}</option>
              {freeDocs.map((d) => <option key={d.id} value={d.id}>{d.title || '(제목 없음)'}{work.docs.some((x) => x.id === d.id) ? '' : ' (뺀 회차)'}</option>)}
            </select>
            <button
              type="button"
              disabled={!docPick}
              onClick={() => {
                patchCard(sel, { docIds: [...selected.docIds, docPick] });
                setDocPick('');
              }}
              className="wr-btn solid"
            >
              회차 잇기
            </button>
          </div>

          <div style={{ marginTop: 14 }}>
            <button type="button" onClick={() => removeCard(sel)} className="wr-btn danger">이 카드 지우기</button>
          </div>
        </section>
      )}
    </div>
  );
}
