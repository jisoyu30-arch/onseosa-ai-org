import { Activity, AlertTriangle, Pause, Play } from 'lucide-react';
import { useOfficeStore } from '../state/officeStore';
import { AGENT_NAMES, DEFAULT_STEP_DURATION_MS, TOTAL_PIPELINE_MS } from '../state/spatialConfig';

function calcProgress(p: ReturnType<typeof useOfficeStore.getState>['pipeline']): number {
  if (!p) return 0;
  const done = p.completedStages.reduce((s, st) => s + (DEFAULT_STEP_DURATION_MS[st] || 10000), 0);
  return Math.min(Math.round((done / TOTAL_PIPELINE_MS) * 100), 100);
}

export function MonitorBoard() {
  const pipeline = useOfficeStore(s => s.pipeline);
  const agents = useOfficeStore(s => s.agents);
  const paused = useOfficeStore(s => s.paused);
  const togglePause = useOfficeStore(s => s.togglePause);

  const blocked = agents.filter(a => a.status === 'blocked');
  const progress = calcProgress(pipeline);

  if (!pipeline) {
    return (
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-white/[0.04] bg-[#060910]/90">
        <Activity size={13} className="text-slate-600" />
        <span className="text-[11px] text-slate-500 tracking-wide">대기 중</span>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    running: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    done: 'bg-green-500/15 text-green-400 border-green-500/20',
    failed: 'bg-red-500/15 text-red-400 border-red-500/20',
    paused: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    orchestrating: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    review: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    blocked: 'bg-red-500/15 text-red-400 border-red-500/20',
  };

  return (
    <div className="flex items-center gap-4 px-5 py-2.5 border-b border-white/[0.04] bg-[#060910]/90 backdrop-blur-md">
      {/* 프로젝트명 */}
      <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">
        {pipeline.projectName}
      </span>

      {/* 상태 뱃지 */}
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider border ${statusColors[pipeline.status] || 'bg-slate-800 text-slate-500'}`}>
        {pipeline.status.toUpperCase()}
      </span>

      {/* 진행률 */}
      {pipeline.status !== 'done' && pipeline.status !== 'failed' && (
        <div className="flex items-center gap-2 flex-1 max-w-[140px]">
          <div className="flex-1 h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500/60 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono w-7 text-right">{progress}%</span>
        </div>
      )}

      {/* 현재 단계 */}
      {pipeline.currentStage && pipeline.status === 'running' && (
        <span className="text-[10px] text-slate-500">
          <span className="text-slate-600">현재 </span>
          <span className="text-slate-300 font-medium">{AGENT_NAMES[pipeline.currentStage] || pipeline.currentStage}</span>
        </span>
      )}

      {/* blocked 경고 */}
      {blocked.length > 0 && (
        <div className="flex items-center gap-1 text-[10px] text-red-400/70">
          <AlertTriangle size={10} />
          <span>{blocked.length} blocked</span>
        </div>
      )}

      {/* retry */}
      {pipeline.retryCount > 0 && (
        <span className="text-[10px] text-amber-400/60">retry #{pipeline.retryCount}</span>
      )}

      {/* 스페이서 */}
      <div className="flex-1" />

      {/* 일시정지 */}
      {pipeline.status !== 'done' && pipeline.status !== 'failed' && (
        <button onClick={togglePause} className="p-1 rounded hover:bg-white/[0.04] transition-colors">
          {paused ? <Play size={12} className="text-emerald-400/60" /> : <Pause size={12} className="text-slate-600" />}
        </button>
      )}
    </div>
  );
}
