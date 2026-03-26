import { EngineInfo, STATUS_COLOR } from '../types';

interface TaskFlowProps {
  engines: EngineInfo[];
}

export function TaskFlow({ engines }: TaskFlowProps) {
  const flowOrder = ['noah', 'eden', 'ria', 'kal', 'luka'];
  const flowEngines = flowOrder.map(name => engines.find(e => e.name === name)!);

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <h2 className="text-lg font-bold text-white mb-4">파이프라인 진행 현황</h2>
      <div className="flex items-center gap-2 overflow-x-auto">
        {flowEngines.map((engine, i) => (
          <div key={engine.name} className="flex items-center">
            <div className="flex flex-col items-center min-w-[80px]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black ${STATUS_COLOR[engine.status]}`}>
                {engine.label[0]}
              </div>
              <span className="text-xs text-slate-400 mt-1">{engine.label}</span>
            </div>
            {i < flowEngines.length - 1 && (
              <div className="w-8 h-0.5 bg-slate-600 mx-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
