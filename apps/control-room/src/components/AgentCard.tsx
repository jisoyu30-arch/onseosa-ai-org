import { EngineInfo, STATUS_COLOR, STATUS_LABEL } from '../types';

interface AgentCardProps {
  engine: EngineInfo;
  onClick?: () => void;
}

export function AgentCard({ engine, onClick }: AgentCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800 rounded-xl p-5 cursor-pointer hover:bg-slate-700 transition-colors border border-slate-700"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">{engine.label}</h3>
        <span className={`w-3 h-3 rounded-full ${STATUS_COLOR[engine.status]}`} />
      </div>
      <p className="text-sm text-slate-400 mb-1">{engine.department}</p>
      <p className="text-xs text-slate-500 mb-3">{engine.model}</p>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLOR[engine.status]} text-black font-medium`}>
          {STATUS_LABEL[engine.status]}
        </span>
        {engine.currentTask && (
          <span className="text-xs text-slate-400 truncate">{engine.currentTask}</span>
        )}
      </div>
    </div>
  );
}
