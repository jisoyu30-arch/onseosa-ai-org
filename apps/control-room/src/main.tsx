import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Studio } from './studio/Studio';
import { WriteRoom } from './studio/write/WriteRoom';
import './index.css';

// 주소 끝의 #write 는 집필, #script 는 대본, #cuts 는 컷 보드, 그 밖에는 기존 운영실. 운영실(App)은 건드리지 않는다.
// 대본과 컷 보드는 같은 Studio 안에서 바뀌므로, 오가도 같은 보드 상태를 본다.
function Root() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const view = hash === '#script' ? 'script' : hash === '#cuts' ? 'cuts' : null;
  const write = hash === '#write';
  const tab = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-semibold ${active ? 'bg-emerald-500 text-slate-900' : 'border border-slate-600 text-slate-300'}`;
  // 집필 화면에서는 위 탭을 숨긴다. 원고보다 눈에 띄지 않게, 집필 화면 안의 "작업실 메뉴"로 접어 둔다.
  if (write) return <WriteRoom />;
  return (
    <>
      <nav className="flex gap-2 bg-slate-900 px-4 pt-4 md:px-6" aria-label="화면 전환">
        <a href="#" className={tab(!view && !write)}>운영실</a>
        <a href="#write" className={tab(write)}>집필</a>
        <a href="#script" className={tab(view === 'script')}>대본</a>
        <a href="#cuts" className={tab(view === 'cuts')}>컷 보드</a>
      </nav>
      {view ? <Studio view={view} /> : <App />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
