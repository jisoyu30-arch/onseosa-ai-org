import { EngineInfo, STATUS_COLOR } from '../types';

interface TaskFlowProps {
  engines: EngineInfo[];
}

export function TaskFlow({ engines }: TaskFlowProps) {
  const flowOrder = ['noah', 'eden', 'ria', 'arko', 'luka'];
  const flowLabels: Record<string, string> = {
    noah: '노아(분석)', eden: '이든(기획)', ria: '리아(창작)', arko: '아르코(검수)', luka: '루카(기록)',
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <h2 className="text-lg font-bold text-white mb-4">파이프라인 진행 현황</h2>
      <div className="flex items-center gap-2 overflow-x-auto">
        {flowOrder.map((name, i) => {
          const engine = engines.find(e => e.name === name);
          const label = flowLabels[name] || name;
          const status = engine?.status || 'idle';
          const isWorking = status === 'working';
          return (
            <div key={name} className="flex items-center">
              <div className="flex flex-col items-center min-w-[80px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black ${STATUS_COLOR[status]} ${isWorking ? 'animate-pulse ring-2 ring-green-300' : ''}`}>
                  {label[0]}
                </div>
                <span className="text-xs text-slate-400 mt-1">{label}</span>
                {engine?.currentTask && isWorking && (
                  <span className="text-[10px] text-green-400 mt-0.5 truncate max-w-[80px]">{engine.currentTask}</span>
                )}
              </div>
              {i < flowOrder.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${isWorking ? 'bg-green-400' : 'bg-slate-600'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
