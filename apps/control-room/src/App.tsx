import { useState } from 'react';
import { AgentCard } from './components/AgentCard';
import { TaskFlow } from './components/TaskFlow';
import { ArkoInput } from './components/ArkoInput';
import { ENGINES, EngineInfo } from './types';

function App() {
  const [engines] = useState<EngineInfo[]>(ENGINES);
  const [result, setResult] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">ONS Studio 운영실</h1>
        <p className="text-slate-400 mt-1">AI 엔진 오케스트레이션 대시보드</p>
      </div>

      {/* 아르코 입력창 */}
      <ArkoInput
        onResult={(res) => setResult(JSON.stringify(res, null, 2))}
      />

      {/* 파이프라인 진행 현황 */}
      <div className="mb-6">
        <TaskFlow engines={engines} />
      </div>

      {/* 엔진 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {engines.map(engine => (
          <AgentCard key={engine.name} engine={engine} />
        ))}
      </div>

      {/* 실행 결과 */}
      {result && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-bold text-white mb-4">실행 결과</h2>
          <div className="bg-slate-900 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-green-400 whitespace-pre-wrap">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
