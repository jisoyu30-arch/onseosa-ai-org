import { useEffect, useRef, useState } from 'react';
import { DocHit, MapBody, MapCard, TextHit, Work, getMap, searchWork } from '../../services/writeApi';
import { readMapDraft } from './local';
import { KIND, cardName } from './MapView';

/*
 * 이 회차의 자료. 쓰던 회차를 떠나지 않고, 그 회차에 이어 둔 카드(등장인물·주제·주요 사건·조사 자료)를 먼저 본다.
 * 같은 자리에서 이 작품의 회차 제목·본문과 카드 이름·메모·출처를 찾는다.
 *
 * - 여기서는 읽기만 한다. 카드와 연결을 만들고 고치는 곳은 연결 지도다. 같은 지도를 두 군데서 고치지 않기 위해서다.
 * - 카드는 연결 지도의 카드 ID 그대로다. "지도에서 보기"는 그 카드를 고른 채로 지도를 연다.
 * - 본문 찾기는 저장 서버가 한다. 지금 쓰는 회차만은 화면의 글(아직 저장하지 않은 글 포함)에서 찾는다.
 *   저장 서버가 답하지 않아도 카드와 지금 쓰는 회차에서는 찾을 수 있다.
 */

// 저장 서버의 findInText 와 같은 모양.
function findInText(text: string, q: string, max = 3, pad = 28): TextHit {
  const hay = text.toLowerCase();
  const needle = q.toLowerCase();
  const snippets: TextHit['snippets'] = [];
  let count = 0;
  if (!needle || hay.length !== text.length) return { count, snippets };
  const flat = (s: string) => s.replace(/\s+/g, ' ');
  for (let at = hay.indexOf(needle); at !== -1; at = hay.indexOf(needle, at + needle.length)) {
    count += 1;
    if (snippets.length < max) snippets.push({ at, before: flat(text.slice(Math.max(0, at - pad), at)), match: text.slice(at, at + needle.length), after: flat(text.slice(at + needle.length, at + needle.length + pad)) });
  }
  return { count, snippets };
}

const FIELDS: { key: 'title' | 'note' | 'source'; label: string }[] = [
  { key: 'title', label: '이름' },
  { key: 'note', label: '메모' },
  { key: 'source', label: '출처' },
];

interface Props {
  wid: string;
  work: Work;
  /** 지금 집필 화면에 열려 있는 회차 */
  docId: string;
  /** 지금 화면의 글. 아직 불러오지 못했으면 null. */
  getText: () => string | null;
  onOpenDoc: (did: string) => void;
  onShowInMap: (cardId: string) => void;
  onBack: () => void;
}

export function RefsView({ wid, work, docId, getText, onOpenDoc, onShowInMap, onBack }: Props) {
  const [map, setMap] = useState<MapBody | null>(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [found, setFound] = useState<{ q: string; docs: DocHit[]; serverFailed: string } | null>(null);
  const [pick, setPick] = useState('');
  const seq = useRef(0);
  const getTextRef = useRef(getText);
  getTextRef.current = getText;
  const workRef = useRef(work);
  workRef.current = work;

  useEffect(() => {
    let cancelled = false;
    // 지도를 방금 고치고 넘어왔다면 저장이 아직 가는 중일 수 있다. 이 브라우저의 보관본이 있으면 그것이 가장 새것이다.
    const draft = readMapDraft(wid);
    setMap(null);
    setError('');
    getMap(wid)
      .then((server) => !cancelled && setMap(draft ? ({ cards: draft.cards, links: draft.links } as unknown as MapBody) : { cards: server.cards, links: server.links }))
      .catch((e: Error) => {
        if (cancelled) return;
        if (draft) setMap({ cards: draft.cards, links: draft.links } as unknown as MapBody);
        else setError('카드를 불러오지 못했습니다: ' + e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [wid]);

  // 찾기. 치는 동안 조금 기다렸다가 한 번만 묻는다.
  const term = q.trim();
  useEffect(() => {
    const mine = ++seq.current;
    if (!term) {
      setFound(null);
      return;
    }
    const timer = window.setTimeout(() => {
      const finish = (serverDocs: DocHit[], serverFailed: string) => {
        if (mine !== seq.current) return;
        const w = workRef.current;
        const live = getTextRef.current();
        const byId = new Map(serverDocs.map((d) => [d.id, d]));
        if (live !== null) {
          // 지금 쓰는 회차는 화면의 글에서 찾는다.
          const cur = w.docs.find((d) => d.id === docId);
          if (cur) {
            const hit = findInText(live, term);
            const titleHit = cur.title.toLowerCase().includes(term.toLowerCase());
            if (hit.count || titleHit) byId.set(cur.id, { id: cur.id, title: cur.title, titleHit, ...hit });
            else byId.delete(cur.id);
          }
        }
        setFound({ q: term, docs: w.docs.flatMap((d) => (byId.has(d.id) ? [byId.get(d.id)!] : [])), serverFailed });
      };
      searchWork(wid, term).then(
        (r) => finish(r.docs, ''),
        (e: Error) => finish([], e.message),
      );
    }, 250);
    return () => window.clearTimeout(timer);
  }, [wid, term, docId]);

  const cards = map?.cards ?? [];
  const links = map?.links ?? [];
  const byId = new Map(cards.map((card) => [card.id, card]));
  const linked = cards.filter((card) => card.docIds.includes(docId));
  const rest = cards.filter((card) => !card.docIds.includes(docId));
  const picked = byId.get(pick);
  const docName = (id: string) => {
    const live = work.docs.find((d) => d.id === id);
    if (live) return { title: live.title || '(제목 없음)', removed: false };
    return { title: (work.removed ?? []).find((d) => d.id === id)?.title || '(제목 없음)', removed: true };
  };

  // 카드에서 찾기: 이름·메모·출처. 이 회차에 이어 둔 카드를 먼저 보여 준다.
  const cardHits = term
    ? [...linked, ...rest].flatMap((card) => {
        const where = FIELDS.filter((f) => card[f.key].toLowerCase().includes(term.toLowerCase()));
        if (!where.length) return [];
        const from = where.find((f) => f.key !== 'title');
        return [{ card, where: where.map((f) => f.label), snippet: from ? findInText(card[from.key], term, 1).snippets[0] : undefined }];
      })
    : [];

  const cardRow = (card: MapCard, extra?: { where: string[]; snippet?: TextHit['snippets'][number] }) => (
    <button key={card.id} type="button" className="wr-row card" data-hit-kind={card.kind} data-card-id={card.id} onClick={() => setPick(card.id)}>
      <span className="wr-card-kind">{KIND[card.kind].mark}</span> <span className="wr-ref-name">{cardName(card)}</span>
      {card.docIds.includes(docId) && <span className="wr-chip">이 회차</span>}
      {extra ? (
        <>
          <small>{extra.where.join(' · ')}에서 찾음</small>
          {extra.snippet && <small>…{extra.snippet.before}<mark>{extra.snippet.match}</mark>{extra.snippet.after}…</small>}
        </>
      ) : (
        (card.source || card.note) && <small>{(card.source || card.note).slice(0, 60)}</small>
      )}
    </button>
  );

  return (
    <div className="wr-refs">
      <div className="wr-map-bar">
        <button type="button" onClick={onBack} className="wr-btn line">쓰던 곳으로</button>
      </div>

      {picked ? (
        <section className="wr-map-detail" aria-label="고른 자료" data-ref-detail={picked.id}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span><span className="wr-card-kind">{KIND[picked.kind].mark}</span> <strong style={{ color: 'var(--ink)' }}>{cardName(picked)}</strong></span>
            <button type="button" onClick={() => setPick('')} className="wr-btn line">목록으로</button>
          </div>
          {(picked.kind === 'source' || picked.source) && (
            <div className="wr-field">
              <span>출처</span>
              <div data-ref-source className="wr-ref-text">{picked.source || '(출처를 적지 않았습니다)'}</div>
            </div>
          )}
          <div className="wr-field">
            <span>메모</span>
            <div data-ref-note className="wr-ref-text">{picked.note || '(메모 없음)'}</div>
          </div>

          <h3 className="wr-h">직접 연결 {links.filter((l) => l.from === pick || l.to === pick).length}개</h3>
          <ul className="wr-links">
            {links.filter((l) => l.from === pick || l.to === pick).map((l) => {
              const other = byId.get(l.from === pick ? l.to : l.from);
              return (
                <li key={l.id}>
                  <button type="button" className="wr-btn line wr-rel" data-ref-rel onClick={() => other && setPick(other.id)} title="이 카드 보기">
                    {cardName(byId.get(l.from))} ─ {l.label || '(이름 없는 연결)'} → {cardName(byId.get(l.to))}
                  </button>
                </li>
              );
            })}
          </ul>

          <h3 className="wr-h">관련 회차 {picked.docIds.length}편</h3>
          <ul className="wr-links">
            {picked.docIds.map((id) => {
              const d = docName(id);
              return (
                <li key={id} data-ref-doc={id}>
                  <span style={{ flex: 1, minWidth: 0 }}>{d.title}{d.removed && <span className="wr-chip">뺀 회차</span>}{id === docId && <span className="wr-chip">지금 쓰는 회차</span>}</span>
                  {id !== docId && <button type="button" onClick={() => onOpenDoc(id)} disabled={d.removed} className="wr-btn line">열기</button>}
                </li>
              );
            })}
          </ul>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            <button type="button" onClick={() => onShowInMap(picked.id)} className="wr-btn solid">지도에서 보기</button>
            <button type="button" onClick={onBack} className="wr-btn line">쓰던 곳으로</button>
          </div>
        </section>
      ) : (
        <>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={100}
            aria-label="자료와 원고에서 찾기"
            placeholder="회차 제목·본문, 카드 이름·메모·출처에서 찾기"
            className="wr-input"
          />
          {error && <p className="wr-small" role="alert" style={{ color: 'var(--bad)' }}>{error}</p>}
          {!map && !error && <p className="wr-small">불러오는 중</p>}

          {term ? (
            <div data-ref-results={found?.q ?? ''}>
              {!found || found.q !== term ? (
                <p className="wr-small" style={{ padding: '8px 2px' }}>찾는 중</p>
              ) : (
                <>
                  <h3 className="wr-h">찾은 것 {found.docs.length + cardHits.length}건 — 회차 {found.docs.length} · 카드 {cardHits.length}</h3>
                  {found.serverFailed && <p className="wr-small" role="alert" style={{ color: 'var(--bad)' }}>다른 회차의 본문에서는 찾지 못했습니다 ({found.serverFailed}). 카드와 지금 쓰는 회차에서만 찾았습니다.</p>}
                  {found.docs.length + cardHits.length === 0 && <p className="wr-small">"{term}"이(가) 들어간 회차나 카드가 없습니다.</p>}
                  {found.docs.map((d) => (
                    <button key={d.id} type="button" className="wr-row card" data-hit-kind="doc" data-doc-id={d.id} onClick={() => onOpenDoc(d.id)} title={d.id === docId ? '본문으로 돌아가기' : '이 회차 열기'}>
                      <span className="wr-card-kind">회차</span> <span className="wr-ref-name">{d.title || '(제목 없음)'}</span>
                      {d.id === docId && <span className="wr-chip">지금 쓰는 회차</span>}
                      <small>{[d.titleHit ? '제목' : '', d.count ? `본문 ${d.count}곳` : ''].filter(Boolean).join(' · ')}</small>
                      {d.snippets.map((s) => <small key={s.at}>…{s.before}<mark>{s.match}</mark>{s.after}…</small>)}
                    </button>
                  ))}
                  {cardHits.map((h) => cardRow(h.card, h))}
                </>
              )}
            </div>
          ) : (
            map && (
              <>
                <h3 className="wr-h">이 회차에 이은 자료 {linked.length}</h3>
                <div data-ref-section="linked">
                  {linked.length === 0 && (
                    <p className="wr-small">
                      아직 이 회차에 이은 카드가 없습니다. 연결 지도에서 카드를 고르고 "회차 잇기"로 이 회차를 이으면 여기에 먼저 보입니다.
                    </p>
                  )}
                  {linked.map((card) => cardRow(card))}
                </div>
                {rest.length > 0 && (
                  <>
                    <h3 className="wr-h">이 작품의 다른 카드 {rest.length}</h3>
                    <div data-ref-section="rest">{rest.map((card) => cardRow(card))}</div>
                  </>
                )}
              </>
            )
          )}
        </>
      )}
    </div>
  );
}
