import { useCallback, useEffect, useRef, useState } from 'react';
import { ConflictError, LastPos, Work, WorkSummary, createBackup, createWork, getHealth, getScene, getWork, listWorks, putWork } from '../../services/writeApi';
import { DocEditor, DocEditorHandle, DocIds, SaveState } from './DocEditor';
import { NotesDrawer, VersionsDrawer } from './Drawers';
import { MapView } from './MapView';
import { RefsView } from './RefsView';
import { ViewPrefs, readFlag, readLastDoc, readLastWork, readPrefs, writeFlag, writeLastDoc, writeLastWork, writePrefs } from './local';
import './write.css';

/*
 * 집필 화면. 열면 마지막에 쓰던 원고가 뜨고 커서가 쓰던 자리에 놓인다.
 * 작품이 하나도 없으면 아무것도 묻지 않고 빈 원고로 시작한다.
 * 화면에는 원고만 두고, 목록(왼쪽)과 판·메모·연결 지도(오른쪽)는 펼칠 때만 보인다.
 * 좁은 창에서는 한 번에 한 패널만 원고 위에 덮어 열고, 닫으면 쓰던 자리로 돌아온다.
 * 본문 편집기는 패널을 여닫는 동안 그대로 살아 있다. 그래서 치던 글과 커서가 사라지지 않는다.
 */

const freshId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const hasDoc = (work: Work, did: string) => work.docs.some((d) => d.id === did);
const NARROW = '(max-width: 899px)';

type Drawer = 'versions' | 'notes' | 'refs' | 'map' | null;
type Pop = 'menu' | 'view' | 'out' | null;

const SEGMENTS: { key: keyof ViewPrefs; label: string; options: [string, string][] }[] = [
  { key: 'theme', label: '바탕', options: [['light', '밝게'], ['dark', '어둡게']] },
  { key: 'font', label: '글꼴', options: [['gothic', '고딕'], ['serif', '명조']] },
  { key: 'size', label: '글자', options: [['s', '작게'], ['m', '보통'], ['l', '크게']] },
  { key: 'width', label: '폭', options: [['s', '좁게'], ['m', '보통'], ['l', '넓게']] },
];

const SAVE_LABEL: Record<SaveState, string> = {
  loading: '불러오는 중',
  saved: '저장됨',
  dirty: '고친 내용 있음',
  saving: '저장 중',
  failed: '저장 실패',
  conflict: '충돌 · 저장 멈춤',
  unavailable: '불러오지 못함',
};
const DRAWER_LABEL = { versions: '판', notes: '메모', refs: '이 회차의 자료', map: '연결 지도' } as const;

const fileSafe = (name: string) => name.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').trim().slice(0, 60) || '제목없음';
const stampNow = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
};

// 한글 UTF-8 TXT. 맨 앞의 BOM은 오래된 메모장도 한글을 바로 읽게 하려는 표시다.
function downloadText(name: string, text: string) {
  const url = URL.createObjectURL(new Blob(['﻿', text], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function WriteRoom() {
  const [works, setWorks] = useState<WorkSummary[] | null>(null);
  const [wid, setWid] = useState('');
  const [work, setWork] = useState<Work | null>(null);
  const [serverLast, setServerLast] = useState<LastPos | null>(null);
  const [did, setDid] = useState('');
  // 편집기를 새로 만들 때만 바꾼다(원고를 바꾸거나 되돌렸을 때). 첫 저장으로 작품이 생길 때는 그대로 둔다.
  const [editorKey, setEditorKey] = useState(0);
  const [listOpen, setListOpen] = useState(() => readFlag('list', false));
  const [narrow, setNarrow] = useState(() => window.matchMedia(NARROW).matches);
  const [narrowList, setNarrowList] = useState(false); // 좁은 창에서는 목록을 기억해 두지 않는다. 열면 원고가 먼저 보인다.
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [pop, setPop] = useState<Pop>(null);
  const [prefs, setPrefs] = useState<ViewPrefs>(readPrefs);
  const [renaming, setRenaming] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [label, setLabel] = useState(''); // 시험 저장소일 때 서버가 알려 주는 이름
  const [removedOpen, setRemovedOpen] = useState(false);
  const [peek, setPeek] = useState<{ id: string; text: string } | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('loading');
  // 목록(목차) 변경이 서버에 저장되지 못했을 때. 화면의 목록은 서버가 확인한 것만 보여 준다.
  const [listFail, setListFail] = useState<{ message: string; retry: () => void } | null>(null);
  const [listBusy, setListBusy] = useState(false);
  const [backupBusy, setBackupBusy] = useState(false);
  // 자료나 지도를 열 때 쓰고 있던 회차. "쓰던 곳으로"가 여기로 돌아온다.
  const [origin, setOrigin] = useState('');
  // "지도에서 보기"로 넘어갈 때 지도가 골라 둘 카드.
  const [mapFocus, setMapFocus] = useState('');
  const editor = useRef<DocEditorHandle>(null);
  const workRef = useRef<Work | null>(null);
  const didRef = useRef('');
  didRef.current = did;
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const adding = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const adopt = useCallback((w: Work) => {
    workRef.current = w;
    setWork(w);
  }, []);

  const pickDoc = useCallback((w: Work, id: string) => {
    editor.current?.remember(); // 떠나는 회차의 커서 자리를 지금 기억한다.
    setDid(id);
    setEditorKey((k) => k + 1);
    if (id) writeLastDoc(w.id, id);
  }, []);

  const openWork = useCallback(
    (id: string) => {
      setWid(id);
      setWork(null);
      workRef.current = null;
      setDid('');
      setOrigin('');
      setListFail(null);
      writeLastWork(id);
      getWork(id)
        .then(({ work: w, last }) => {
          adopt(w);
          setServerLast(last);
          const local = readLastDoc(id);
          pickDoc(w, local && hasDoc(w, local) ? local : last && hasDoc(w, last.docId) ? last.docId : (w.docs[0]?.id ?? ''));
        })
        .catch((e: Error) => setError(e.message));
    },
    [adopt, pickDoc],
  );

  useEffect(() => {
    getHealth().then((h) => setLabel(h.label ?? '')).catch(() => undefined);
    listWorks()
      .then((list) => {
        setWorks(list);
        const last = readLastWork();
        const target = list.find((w) => w.id === last) ?? list[0];
        if (target) openWork(target.id);
      })
      .catch((e: Error) => setError(e.message));
  }, [openWork]);

  // 작품이 없을 때 편집기가 첫 저장 직전에 부른다. 편집기는 그대로 두고 주변 상태만 채운다.
  const createFirst = useCallback(async (): Promise<DocIds> => {
    const w = await createWork();
    adopt(w);
    setWorks([{ id: w.id, title: w.title, updatedAt: w.updatedAt, docCount: 1 }]);
    setWid(w.id);
    setDid(w.docs[0].id);
    writeLastWork(w.id);
    writeLastDoc(w.id, w.docs[0].id);
    return { wid: w.id, did: w.docs[0].id };
  }, [adopt]);

  /*
   * 목록 변경(새 원고·이름·순서·빼기·되돌리기). 서버가 저장을 확인한 뒤에만 화면에 반영한다.
   * 실패하면 화면의 목록·열려 있는 원고·커서를 그대로 두고, 다시 시도할 수 있게 알린다.
   * 돌려주는 값: 저장된 목록, 또는 반영되지 않았으면 null.
   */
  const mutate = useCallback(
    (fn: (w: Work) => Work, retry: () => void): Promise<Work | null> => {
      const run = async (): Promise<Work | null> => {
        const base = workRef.current;
        if (!base) return null;
        const next = fn(base);
        if (next === base) return base;
        setListBusy(true);
        try {
          const saved = await putWork({ ...next, rev: base.rev });
          adopt(saved);
          setListFail(null);
          setWorks((list) => (list ?? []).map((x) => (x.id === saved.id ? { ...x, title: saved.title, docCount: saved.docs.length } : x)));
          return saved;
        } catch (e) {
          if (e instanceof ConflictError) {
            const server = e.current as Work;
            adopt(server);
            setListFail(null);
            if (didRef.current && !hasDoc(server, didRef.current)) pickDoc(server, server.docs[0]?.id ?? '');
            setNotice('목록이 다른 곳에서 바뀌어 다시 불러왔습니다. 방금 한 목록 변경은 반영되지 않았을 수 있으니 목록을 확인해 주세요.');
          } else {
            setListFail({ message: `목록 저장 실패: ${(e as Error).message} 방금 한 목록 변경은 반영되지 않았습니다. 쓰던 원고는 그대로입니다.`, retry });
          }
          return null;
        } finally {
          setListBusy(false);
        }
      };
      const p = queue.current.then(run, run);
      queue.current = p.catch(() => undefined);
      return p;
    },
    [adopt, pickDoc],
  );

  // 새 원고. 서버가 목록에 넣은 것을 확인한 뒤에 그 원고로 옮겨 간다.
  const addDoc = () => {
    if (adding.current) return; // 연달아 눌러도 한 편만 만든다.
    adding.current = true;
    const id = freshId('d');
    const attempt = async () => {
      adding.current = true;
      try {
        await mutate((w) => (hasDoc(w, id) ? w : { ...w, docs: [...w.docs, { id, title: `${w.docs.length + 1}화` }] }), () => void attempt());
        // 응답을 못 받았어도 서버에 이미 들어가 있었다면(다시 읽은 목록에 있다면) 연다. 없으면 쓰던 원고에 머문다.
        const w = workRef.current;
        if (w && hasDoc(w, id) && didRef.current !== id) {
          pickDoc(w, id);
          setOrigin('');
        }
      } finally {
        adding.current = false;
      }
    };
    void attempt();
  };

  const addWork = async () => {
    try {
      const w = await createWork();
      setWorks((list) => [{ id: w.id, title: w.title, updatedAt: w.updatedAt, docCount: 1 }, ...(list ?? [])]);
      openWork(w.id);
    } catch (e) {
      setError('새 작품을 만들지 못했습니다: ' + (e as Error).message);
    }
  };

  const rename = (id: string, title: string) => {
    setRenaming('');
    const t = title.trim();
    if (!t) return;
    const fn = (w: Work): Work =>
      id === 'work'
        ? w.title === t ? w : { ...w, title: t }
        : w.docs.some((d) => d.id === id && d.title !== t) ? { ...w, docs: w.docs.map((d) => (d.id === id ? { ...d, title: t } : d)) } : w;
    const attempt = () => void mutate(fn, attempt);
    attempt();
  };

  const moveDoc = (id: string, delta: -1 | 1) => {
    const fn = (w: Work): Work => {
      const i = w.docs.findIndex((d) => d.id === id);
      const to = i + delta;
      if (i < 0 || to < 0 || to >= w.docs.length) return w;
      const docs = [...w.docs];
      [docs[i], docs[to]] = [docs[to], docs[i]];
      return { ...w, docs };
    };
    const attempt = () => void mutate(fn, attempt);
    attempt();
  };

  const removeDoc = (id: string) => {
    const w = workRef.current;
    const doc = w?.docs.find((d) => d.id === id);
    if (!w || !doc || w.docs.length < 2) return;
    if (!window.confirm(`"${doc.title}"을(를) 목록에서 뺄까요?\n지워지지 않습니다. 목록 아래 "뺀 원고"에서 언제든 되돌릴 수 있습니다.`)) return;
    const attempt = async () => {
      const before = workRef.current;
      const i = before ? before.docs.findIndex((d) => d.id === id) : -1;
      const saved = await mutate(
        (x) => (x.docs.some((d) => d.id === id) && x.docs.length > 1 ? { ...x, docs: x.docs.filter((d) => d.id !== id), removed: [...(x.removed ?? []), { id: doc.id, title: doc.title }] } : x),
        () => void attempt(),
      );
      if (!saved || hasDoc(saved, id)) return; // 빼지 못했다. 열려 있는 원고를 바꾸지 않는다.
      if (didRef.current === id) pickDoc(saved, (saved.docs[Math.min(Math.max(i, 0), saved.docs.length - 1)] ?? saved.docs[0]).id);
      setRemovedOpen(true);
    };
    void attempt();
  };

  // 뺀 원고를 목록 맨 아래로 되돌린다. 본문·판·복구본은 그대로다.
  const bringBack = (id: string) => {
    setPeek(null);
    const fn = (x: Work): Work => {
      const doc = (x.removed ?? []).find((d) => d.id === id);
      if (!doc) return x;
      return { ...x, docs: [...x.docs, { id: doc.id, title: doc.title }], removed: (x.removed ?? []).filter((d) => d.id !== id) };
    };
    const attempt = () => void mutate(fn, attempt);
    attempt();
  };

  const peekRemoved = (id: string) => {
    if (peek?.id === id) return setPeek(null);
    getScene(wid, id)
      .then((sc) => setPeek({ id, text: sc.text }))
      .catch((e: Error) => setError(e.message));
  };

  const setPref = (key: keyof ViewPrefs, value: string) => {
    setPrefs((cur) => {
      const next = { ...cur, [key]: value } as ViewPrefs;
      writePrefs(next);
      return next;
    });
  };

  const backToText = () => window.setTimeout(() => editor.current?.focus(), 0);

  const toggleList = () => {
    if (narrow) {
      if (!narrowList) setDrawer(null); // 좁은 창에서는 한 번에 한 패널만.
      else backToText();
      setNarrowList(!narrowList);
      return;
    }
    writeFlag('list', !listOpen);
    setListOpen(!listOpen);
  };

  const toggleDrawer = (next: Exclude<Drawer, null>) => {
    if (drawer === next) return closeDrawer();
    if (narrow) setNarrowList(false);
    const w = workRef.current;
    const isAway = !!origin && origin !== didRef.current && !!w && hasDoc(w, origin);
    if ((next === 'map' || next === 'refs') && !isAway) setOrigin(didRef.current);
    if (next === 'map') setMapFocus('');
    setDrawer(next);
  };

  // 자료에서 읽던 카드를 지도에서 본다. 지도는 그 카드를 고른 채로 열린다.
  const showInMap = (cardId: string) => {
    if (!origin) setOrigin(didRef.current);
    setMapFocus(cardId);
    setDrawer('map');
  };

  const closeDrawer = () => {
    setDrawer(null);
    backToText();
  };

  // 자료나 지도에서 회차를 연다. 떠나는 회차는 저장을 마저 보내고 커서 자리를 기억해 둔다.
  const openFromMap = (id: string) => {
    const w = workRef.current;
    if (!w || !hasDoc(w, id)) return;
    if (id !== didRef.current) pickDoc(w, id);
    if (narrow) setDrawer(null);
    backToText();
  };

  // 자료나 지도를 열기 전에 쓰던 회차·쓰던 자리로 돌아간다.
  const backToOrigin = () => {
    const w = workRef.current;
    if (w && origin && origin !== didRef.current && hasDoc(w, origin)) pickDoc(w, origin);
    setOrigin('');
    setDrawer(null);
    backToText();
  };

  // 지금 화면의 글을 TXT로 받는다. 서버에 저장되지 않은 글도 화면에 있는 그대로 담는다.
  const exportTxt = () => {
    setPop(null);
    const ed = editor.current;
    const w = workRef.current;
    if (!ed) return;
    const snap = ed.snapshot();
    if (snap.state === 'loading' || snap.state === 'unavailable') {
      setError('원고를 불러오지 못한 상태라 TXT로 받을 글이 없습니다. 저장 서버가 켜져 있는지 확인해 주세요.');
      return;
    }
    const docName = w?.docs.find((d) => d.id === didRef.current)?.title ?? '1화';
    const name = `${fileSafe(w?.title ?? '제목 없는 작품')}-${fileSafe(docName)}-${stampNow()}${snap.clean ? '' : '-미저장포함'}.txt`;
    downloadText(name, snap.text);
    setNotice(
      snap.clean
        ? `"${name}" 을(를) 받았습니다 (${snap.text.length.toLocaleString()}자). 브라우저의 다운로드 폴더에 있습니다. 서버에 저장된 내용과 같습니다.`
        : `"${name}" 을(를) 받았습니다 (${snap.text.length.toLocaleString()}자). 화면에 있는 글 그대로이며, 아직 서버에 저장되지 않은 부분이 들어 있습니다(지금 상태: ${SAVE_LABEL[snap.state]}).`,
    );
  };

  // 작품 한 벌을 원고 폴더 밖의 백업 폴더에 쓴다. 서버에 저장된 내용이 담긴다.
  const backupWork = async () => {
    setPop(null);
    const ed = editor.current;
    if (!wid || !ed || backupBusy) return;
    setBackupBusy(true);
    try {
      const clean = await ed.flush();
      const info = await createBackup(wid);
      const what = `회차 ${info.counts.docs}편 · 뺀 원고 ${info.counts.removed}편 · 판 ${info.counts.versions}개 · 복구본 ${info.counts.recovery}개 · 지도 카드 ${info.counts.cards}장 · 연결 ${info.counts.links}개`;
      setNotice(
        clean
          ? `작품 전체를 백업했습니다: ${info.file} (${what}). 메모와 연결 지도는 "저장됨"이 뜬 내용까지 담깁니다.`
          : `백업 파일은 만들었지만 지금 화면의 글은 다 담기지 않았습니다: ${info.file} (${what}). 이 회차는 "${SAVE_LABEL[ed.snapshot().state]}" 상태라 서버에 저장된 마지막 내용까지만 들어갔습니다. "내보내기 › 이 회차 TXT로 받기"로 화면의 글을 따로 받아 두세요.`,
      );
    } catch (e) {
      setError(`백업을 만들지 못했습니다: ${(e as Error).message} 지금 글은 "내보내기 › 이 회차 TXT로 받기"로 따로 받아 둘 수 있습니다.`);
    } finally {
      setBackupBusy(false);
    }
  };

  // 컴포넌트가 아니라 함수로 둔다. 컴포넌트로 두면 화면이 다시 그려질 때마다 입력칸이 새로 만들어져 치던 글이 끊긴다.
  const nameInput = (id: string, value: string, width?: number) => (
    <input
      autoFocus
      defaultValue={value}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={(e) => rename(id, e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === 'Enter') e.currentTarget.blur();
        if (e.key === 'Escape') setRenaming('');
      }}
      maxLength={200}
      aria-label="이름"
      className="wr-input"
      style={width ? { width, maxWidth: '60vw', display: 'inline-block' } : undefined}
    />
  );

  const shell = (children: React.ReactNode) => (
    <div className="wr" data-theme={prefs.theme} data-font={prefs.font} data-size={prefs.size} data-width={prefs.width}>
      {children}
    </div>
  );

  if (works === null) {
    return shell(
      <div style={{ padding: 32, color: 'var(--soft)' }}>
        {error ? (
          <>
            <p style={{ color: 'var(--bad)' }}>{error}</p>
            <p className="wr-small" style={{ marginTop: 8 }}>원고 저장 서버가 꺼져 있습니다. 바탕화면의 "온서사 집필실" 바로가기로 다시 열어 주세요.</p>
            <p style={{ marginTop: 12 }}><a href="#" style={{ color: 'var(--muted)' }}>운영실로</a></p>
          </>
        ) : (
          <p className="wr-small">여는 중…</p>
        )}
      </div>,
    );
  }

  const first = works.length === 0; // 작품이 아직 없다. 빈 원고로 바로 시작한다.
  const doc = work?.docs.find((d) => d.id === did);
  const ready = first || (work !== null && did !== '');
  const target: DocIds | null = wid && did ? { wid, did } : null;
  const workTitle = work?.title ?? '제목 없는 작품';
  const docTitle = doc?.title ?? '1화';
  const showList = !!work && (narrow ? narrowList : listOpen);
  const away = !!origin && origin !== did && !!work && hasDoc(work, origin); // 지도에서 다른 회차를 열어 둔 상태
  const saveTone = saveState === 'failed' || saveState === 'unavailable' ? 'bad' : saveState === 'conflict' ? 'warn' : '';

  return shell(
    <>
      <header className="wr-top">
        <button type="button" onClick={toggleList} aria-pressed={showList} disabled={!work} className="wr-btn">목록</button>
        {label && <span className="wr-tag" title="실제 원고 폴더가 아닙니다">{label}</span>}
        <div className="wr-title">
          {renaming === 'work' && work ? nameInput('work', work.title, 220) : (
            <button type="button" className="wr-btn" disabled={!work} onClick={() => setRenaming('work')} title="눌러서 작품 제목 고치기">{workTitle}</button>
          )}
          <span aria-hidden="true">·</span>
          {renaming === did && doc ? nameInput(did, doc.title, 160) : (
            <button type="button" className="wr-btn" disabled={!doc} onClick={() => setRenaming(did)} title="눌러서 원고 제목 고치기">{docTitle}</button>
          )}
          <span className={`wr-save ${saveTone}`} data-state={saveState} title="이 회차의 저장 상태">{SAVE_LABEL[saveState]}</span>
        </div>
        <button type="button" onClick={() => toggleDrawer('versions')} aria-pressed={drawer === 'versions'} disabled={!doc} className="wr-btn">판</button>
        <button type="button" onClick={() => toggleDrawer('notes')} aria-pressed={drawer === 'notes'} disabled={!work} className="wr-btn">메모</button>
        <button type="button" onClick={() => toggleDrawer('refs')} aria-pressed={drawer === 'refs'} disabled={!doc} title="이 회차의 자료 보기 · 작품 안에서 찾기" className="wr-btn">자료</button>
        <button type="button" onClick={() => toggleDrawer('map')} aria-pressed={drawer === 'map'} disabled={!work} className="wr-btn">연결 지도</button>
        <button type="button" onClick={() => setPop(pop === 'out' ? null : 'out')} aria-expanded={pop === 'out'} className="wr-btn">내보내기</button>
        <button type="button" onClick={() => setPop(pop === 'view' ? null : 'view')} aria-expanded={pop === 'view'} className="wr-btn">보기</button>
        <button type="button" onClick={() => setPop(pop === 'menu' ? null : 'menu')} aria-expanded={pop === 'menu'} className="wr-btn">작업실 메뉴</button>
        {pop === 'view' && (
          <div className="wr-pop">
            {SEGMENTS.map((seg) => (
              <div key={seg.key} className="wr-seg-row">
                <span>{seg.label}</span>
                <span className="wr-seg">
                  {seg.options.map(([value, text]) => (
                    <button key={value} type="button" onClick={() => setPref(seg.key, value)} aria-pressed={prefs[seg.key] === value} className="wr-btn">{text}</button>
                  ))}
                </span>
              </div>
            ))}
          </div>
        )}
        {pop === 'out' && (
          <div className="wr-pop" style={{ maxWidth: 320 }}>
            <button type="button" onClick={exportTxt} disabled={!ready} className="wr-row">이 회차 TXT로 받기</button>
            <p className="wr-small" style={{ padding: '0 10px 8px' }}>지금 화면의 글을 한글 텍스트 파일로 받습니다. 저장되지 않은 글도 화면에 있는 그대로 담깁니다.</p>
            <button type="button" onClick={() => void backupWork()} disabled={!work || backupBusy} className="wr-row">{backupBusy ? '백업 만드는 중…' : '작품 전체 백업 만들기'}</button>
            <p className="wr-small" style={{ padding: '0 10px 4px' }}>회차 순서·본문·뺀 원고·메모·판·복구본·연결 지도를 원고 폴더 밖의 백업 폴더에 파일 하나로 남깁니다.</p>
          </div>
        )}
        {pop === 'menu' && (
          <nav className="wr-pop" aria-label="작업실 메뉴">
            <a href="#">운영실</a>
            <p className="wr-small" style={{ padding: '8px 10px 2px' }}>영상 제작 도구 (집필과 따로 돕니다)</p>
            <a href="#script">대본</a>
            <a href="#cuts">컷 보드</a>
          </nav>
        )}
      </header>

      <div className="wr-body" onClick={() => pop && setPop(null)}>
        {showList && work && (
          <nav aria-label="목록" className="wr-side">
            {narrow && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--ink)' }}>목록</strong>
                <button type="button" onClick={toggleList} className="wr-btn">닫기</button>
              </div>
            )}
            <h2 className="wr-h">작품</h2>
            {works.map((w) => (
              <button key={w.id} type="button" onClick={() => w.id !== wid && openWork(w.id)} aria-current={w.id === wid ? 'true' : undefined} className="wr-row">
                {w.id === wid ? work.title : w.title}
              </button>
            ))}
            <button type="button" onClick={addWork} className="wr-btn">+ 새 작품</button>

            <h2 className="wr-h">원고</h2>
            {work.docs.map((d, i) => (
              <div key={d.id}>
                {renaming === `list:${d.id}` ? nameInput(d.id, d.title) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (d.id !== did) pickDoc(work, d.id);
                      setOrigin('');
                      if (narrow) toggleList();
                    }}
                    aria-current={d.id === did ? 'true' : undefined}
                    className="wr-row"
                  >
                    {d.title || '(제목 없음)'}
                  </button>
                )}
                {d.id === did && renaming !== `list:${d.id}` && (
                  <div style={{ display: 'flex', gap: 2, padding: '2px 4px 6px' }}>
                    <button type="button" onClick={() => moveDoc(d.id, -1)} disabled={i === 0 || listBusy} aria-label="위로 옮기기" className="wr-btn">↑</button>
                    <button type="button" onClick={() => moveDoc(d.id, 1)} disabled={i === work.docs.length - 1 || listBusy} aria-label="아래로 옮기기" className="wr-btn">↓</button>
                    <button type="button" onClick={() => setRenaming(`list:${d.id}`)} className="wr-btn">이름</button>
                    <button type="button" onClick={() => removeDoc(d.id)} disabled={work.docs.length < 2 || listBusy} className="wr-btn danger">빼기</button>
                  </div>
                )}
              </div>
            ))}
            <button type="button" onClick={addDoc} disabled={listBusy} className="wr-btn">+ 새 원고</button>

            {(work.removed?.length ?? 0) > 0 && (
              <>
                <button type="button" onClick={() => setRemovedOpen(!removedOpen)} aria-expanded={removedOpen} className="wr-btn" style={{ display: 'block', marginTop: 14 }}>
                  뺀 원고 {work.removed!.length}편 {removedOpen ? '▾' : '▸'}
                </button>
                {removedOpen && work.removed!.map((d) => (
                  <div key={d.id} style={{ padding: '4px 10px 8px' }}>
                    <div style={{ color: 'var(--soft)' }}>{d.title || '(제목 없음)'}</div>
                    {d.removedAt && <div className="wr-small">{new Date(d.removedAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}에 뺌</div>}
                    <div style={{ display: 'flex', gap: 2, marginLeft: -9 }}>
                      <button type="button" onClick={() => peekRemoved(d.id)} aria-expanded={peek?.id === d.id} className="wr-btn">내용 보기</button>
                      <button type="button" onClick={() => bringBack(d.id)} disabled={listBusy} className="wr-btn">되돌리기</button>
                    </div>
                    {peek?.id === d.id && <pre className="wr-preview">{peek.text ? `${peek.text.slice(0, 600)}${peek.text.length > 600 ? '…' : ''} (${peek.text.length.toLocaleString()}자)` : '(빈 원고)'}</pre>}
                  </div>
                ))}
              </>
            )}
          </nav>
        )}

        <main className="wr-main">
          {(error || notice || listFail || away) && (
            <div className="wr-column" style={{ flex: 'none' }}>
              {listFail && (
                <div className="wr-note" role="alert" style={{ color: 'var(--bad)' }}>
                  <span>{listFail.message}</span>
                  <span style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button type="button" className="wr-btn line" style={{ padding: '1px 8px' }} disabled={listBusy} onClick={() => listFail.retry()}>다시 시도</button>
                    <button type="button" className="wr-btn" style={{ padding: 0 }} onClick={() => setListFail(null)}>그만두기</button>
                  </span>
                </div>
              )}
              {error && <div className="wr-note" style={{ color: 'var(--bad)' }}><span>{error}</span><button type="button" className="wr-btn" style={{ padding: 0 }} onClick={() => setError('')}>닫기</button></div>}
              {notice && <div className="wr-note"><span>{notice}</span><button type="button" className="wr-btn" style={{ padding: 0 }} onClick={() => setNotice('')}>닫기</button></div>}
              {away && (
                <div className="wr-note">
                  <span>자료·지도에서 연 회차입니다.</span>
                  <span style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button type="button" className="wr-btn line" style={{ padding: '1px 8px' }} onClick={backToOrigin}>쓰던 곳으로</button>
                    {drawer !== 'refs' && <button type="button" className="wr-btn" style={{ padding: 0 }} onClick={() => toggleDrawer('refs')}>자료 다시 열기</button>}
                    {drawer !== 'map' && <button type="button" className="wr-btn" style={{ padding: 0 }} onClick={() => toggleDrawer('map')}>지도 다시 열기</button>}
                  </span>
                </div>
              )}
            </div>
          )}
          {ready ? (
            <DocEditor key={editorKey} ref={editor} target={target} create={createFirst} serverLast={serverLast} onState={setSaveState} onRescue={exportTxt} />
          ) : (
            <p className="wr-small" style={{ paddingTop: 28 }}>여는 중…</p>
          )}
        </main>

        {drawer && work && (
          <aside aria-label={DRAWER_LABEL[drawer]} className={`wr-drawer${drawer === 'map' ? ' map' : drawer === 'refs' ? ' refs' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontWeight: 700, color: 'var(--ink)' }}>{drawer === 'versions' ? `판 · ${doc?.title ?? ''}` : drawer === 'map' ? `연결 지도 · ${work.title}` : drawer === 'refs' ? `이 회차의 자료 · ${doc?.title ?? ''}` : '메모'}</h2>
              <button type="button" onClick={closeDrawer} className="wr-btn">닫기</button>
            </div>
            {drawer === 'versions' && doc && <VersionsDrawer key={did} wid={wid} sid={did} editor={editor} onRestored={() => setEditorKey((k) => k + 1)} />}
            {drawer === 'notes' && <NotesDrawer key={wid} wid={wid} />}
            {drawer === 'refs' && (
              <RefsView
                key={wid}
                wid={wid}
                work={work}
                docId={did}
                getText={() => {
                  const snap = editor.current?.snapshot();
                  return !snap || snap.state === 'loading' || snap.state === 'unavailable' ? null : snap.text;
                }}
                onOpenDoc={openFromMap}
                onShowInMap={showInMap}
                onBack={backToOrigin}
              />
            )}
            {drawer === 'map' && <MapView key={wid} wid={wid} work={work} currentDocId={did} onOpenDoc={openFromMap} onBack={backToOrigin} focusCardId={mapFocus} />}
          </aside>
        )}
      </div>
    </>,
  );
}
