import { useState, useEffect, useCallback } from 'react';
import { Activity, Radio, Terminal, FileJson, Building2, LayoutDashboard } from 'lucide-react';
import { AgentCard } from './components/AgentCard';
import { TaskFlow } from './components/TaskFlow';
import { ArkoChat } from './components/ArkoChat';
import { MediaPreview } from './components/MediaPreview';
import { PaperClipWidget } from './components/PaperClipWidget';
import { OfficePage } from './pages/Office';
import { ENGINES, EngineInfo, EngineStatus } from './types';
import { connectSSE, SSEEvent } from './services/api';

// 로그 레벨 색상
function logColor(msg: string): string {
  if (msg.includes('오류') || msg.includes('실패') || msg.includes('error')) return 'text-red-400';
  if (msg.includes('완료') || msg.includes('done')) return 'text-emerald-400';
  if (msg.includes('재시도') || msg.includes('retry')) return 'text-amber-400';
  if (msg.includes('시작')) return 'text-cyan-400';
  return 'text-slate-400';
}

function App() {
  const [view, setView] = useState<'dashboard' | 'office'>('dashboard');
  const [engines, setEngines] = useState<EngineInfo[]>(ENGINES);
  const [result, setResult] = useState<string | null>(null);
  const [pipelineActive, setPipelineActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [mediaPreview, setMediaPreview] = useState<{ cover: string | null; video: string | null }>({ cover: null, video: null });
  const [clock, setClock] = useState(new Date().toLocaleTimeString('ko-KR'));

  // 실시간 시계
  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString('ko-KR')), 1000);
    return () => clearInterval(t);
  }, []);

  const updateEngineStatus = useCallback((name: string, status: EngineStatus, task?: string) => {
    setEngines(prev => prev.map(e =>
      e.name === name ? { ...e, status, currentTask: task || e.currentTask } : e
    ));
  }, []);

  const addLog = useCallback((msg: string) => {
    const ts = new Date().toLocaleTimeString('ko-KR');
    setLogs(prev => [...prev.slice(-49), `[${ts}] ${msg}`]);
  }, []);

  const handleSSEEvent = useCallback((event: SSEEvent) => {
    switch (event.type) {
      case 'engine:status':
        updateEngineStatus(event.engine!, event.status as EngineStatus, event.task);
        if (event.status === 'working') addLog(`${event.engine} 작업 시작: ${event.task}`);
        break;
      case 'engine:done':
        addLog(`${event.engine} 완료: ${(event.result as { summary?: string })?.summary || ''}`);
        break;
      case 'engine:error':
        addLog(`${event.engine} 오류: ${event.error}`);
        break;
      case 'pipeline:start':
        setPipelineActive(true);
        setMediaPreview({ cover: null, video: null });
        addLog(`파이프라인 시작: ${event.projectId}`);
        break;
      case 'pipeline:done': {
        setPipelineActive(false);
        setResult(JSON.stringify(event.results, null, 2));
        addLog('파이프라인 완료');
        setEngines(prev => prev.map(e => ({ ...e, status: 'idle' as EngineStatus, currentTask: undefined })));
        const mikaResult = (event.results as Record<string, { data?: Record<string, unknown> }>)?.mika;
        if (mikaResult?.data) {
          setMediaPreview({
            cover: (mikaResult.data.coverOriginalPath as string) || null,
            video: (mikaResult.data.videoFilePath as string) || null,
          });
        }
        break;
      }
      case 'pipeline:retry':
        addLog(`재시도 #${event.retryCount}: ${event.reason}`);
        break;
    }
  }, [updateEngineStatus, addLog]);

  useEffect(() => {
    const es = connectSSE(handleSSEEvent, () => {
      addLog('SSE 연결 끊김, 3초 후 재연결...');
    });
    return () => es.close();
  }, [handleSSEEvent, addLog]);

  const activeCount = engines.filter(e => e.status === 'working').length;

  // 오피스 뷰
  if (view === 'office') {
    return (
      <div className="relative h-screen">
        <OfficePage />
        <button
          onClick={() => setView('dashboard')}
          className="absolute top-2 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 border border-slate-700/50 rounded-lg text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-all backdrop-blur-sm"
        >
          <LayoutDashboard size={12} />
          대시보드
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-grid" style={{ backgroundColor: '#0a0f1a' }}>

      {/* 메인 영역 */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                ONS Studio
                <span className="text-slate-500 font-normal ml-2 text-sm">운영실</span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-slate-500 font-mono">{clock}</span>
                <span className="text-[11px] text-slate-600">|</span>
                <span className="text-[11px] text-slate-500">
                  엔진 {engines.length}기
                  {activeCount > 0 && <span className="text-emerald-400 ml-1">({activeCount} 가동)</span>}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('office')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
            >
              <Building2 size={12} />
              운영실
            </button>
            {pipelineActive && (
              <span className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-500/20">
                <Radio size={12} className="animate-pulse" />
                파이프라인 실행 중
              </span>
            )}
            <div className="flex items-center gap-1.5 text-slate-500">
              <Activity size={14} />
              <span className="text-[11px] font-mono">LIVE</span>
            </div>
          </div>
        </div>

        {/* 아르코 대화 */}
        <ArkoChat
          onPipelineStart={() => setPipelineActive(true)}
          onResult={(res) => setResult(JSON.stringify(res, null, 2))}
        />

        {/* 파이프라인 진행 현황 */}
        <div className="mb-6">
          <TaskFlow engines={engines} />
        </div>

        {/* 엔진 카드 그리드 — 7열 (secretary 포함) */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {engines.map(engine => (
            <AgentCard key={engine.name} engine={engine} />
          ))}
        </div>

        {/* Paper Clip 위젯 */}
        <div className="mb-6">
          <PaperClipWidget />
        </div>

        {/* 미디어 프리뷰 */}
        <MediaPreview coverImageUrl={mediaPreview.cover} videoUrl={mediaPreview.video} />

        {/* 실행 로그 + 결과 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 로그 패널 */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Terminal size={14} className="text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-300 tracking-wide uppercase">Log</h2>
              <span className="text-[10px] text-slate-600 ml-auto font-mono">{logs.length} lines</span>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3 h-52 overflow-y-auto font-mono">
              {logs.length === 0 ? (
                <p className="text-slate-600 text-xs">대기 중...</p>
              ) : (
                logs.map((log, i) => (
                  <p key={i} className={`text-[11px] mb-0.5 leading-relaxed ${logColor(log)}`}>{log}</p>
                ))
              )}
            </div>
          </div>

          {/* 결과 패널 */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <FileJson size={14} className="text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-300 tracking-wide uppercase">Result</h2>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3 h-52 overflow-y-auto">
              {result ? (
                <pre className="text-[11px] text-emerald-400/80 whitespace-pre-wrap font-mono leading-relaxed">{result}</pre>
              ) : (
                <p className="text-slate-600 text-xs">아직 결과가 없습니다</p>
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default App;
