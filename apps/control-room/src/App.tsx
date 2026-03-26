import { useState, useEffect, useCallback } from 'react';
import { AgentCard } from './components/AgentCard';
import { TaskFlow } from './components/TaskFlow';
import { ArkoInput } from './components/ArkoInput';
import { ENGINES, EngineInfo, EngineStatus } from './types';
import { connectSSE, SSEEvent } from './services/api';

function App() {
  const [engines, setEngines] = useState<EngineInfo[]>(ENGINES);
  const [result, setResult] = useState<string | null>(null);
  const [pipelineActive, setPipelineActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

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
        addLog(`파이프라인 시작: ${event.projectId}`);
        break;
      case 'pipeline:done':
        setPipelineActive(false);
        setResult(JSON.stringify(event.results, null, 2));
        addLog('파이프라인 완료');
        // 모든 엔진 idle로 초기화
        setEngines(prev => prev.map(e => ({ ...e, status: 'idle' as EngineStatus, currentTask: undefined })));
        break;
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

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">ONS Studio 운영실</h1>
          <p className="text-slate-400 mt-1">AI 엔진 오케스트레이션 대시보드</p>
        </div>
        {pipelineActive && (
          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm animate-pulse">
            파이프라인 실행 중
          </span>
        )}
      </div>

      {/* 서 본부장 입력창 */}
      <ArkoInput
        onResult={(res) => setResult(JSON.stringify(res, null, 2))}
      />

      {/* 파이프라인 진행 현황 */}
      <div className="mb-6">
        <TaskFlow engines={engines} />
      </div>

      {/* 엔진 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {engines.map(engine => (
          <AgentCard key={engine.name} engine={engine} />
        ))}
      </div>

      {/* 실행 로그 + 결과 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 실시간 로그 */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-bold text-white mb-4">실시간 로그</h2>
          <div className="bg-slate-900 rounded-lg p-4 h-72 overflow-y-auto font-mono">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-sm">대기 중...</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className="text-xs text-slate-400 mb-1">{log}</p>
              ))
            )}
          </div>
        </div>

        {/* 실행 결과 */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-bold text-white mb-4">실행 결과</h2>
          <div className="bg-slate-900 rounded-lg p-4 h-72 overflow-y-auto">
            {result ? (
              <pre className="text-sm text-green-400 whitespace-pre-wrap">{result}</pre>
            ) : (
              <p className="text-slate-500 text-sm">아직 결과가 없습니다</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
