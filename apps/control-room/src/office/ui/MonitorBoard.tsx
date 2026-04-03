import { Activity, Clock, AlertTriangle, Pause, Play } from 'lucide-react';
import { useOfficeStore } from '../state/officeStore';
import { AGENT_NAMES, DEFAULT_STEP_DURATION_MS, TOTAL_PIPELINE_MS } from '../state/spatialConfig';

function formatETA(eta: number | null): string {
  if (!eta) return '--';
  const remaining = Math.max(0, eta - Date.now());
  const sec = Math.round(remaining / 1000);
  if (sec < 60) return `${sec}초`;
  return `${Math.floor(sec / 60)}분 ${sec % 60}초`;
}

function calculateProgress(pipeline: ReturnType<typeof useOfficeStore.getState>['pipeline']): number {
  if (!pipeline) return 0;
  const completedMs = pipeline.completedStages
    .reduce((sum, stage) => sum + (DEFAULT_STEP_DURATION_MS[stage] || 10_000), 0);
  return Math.min(Math.round((completedMs / TOTAL_PIPELINE_MS) * 100), 100);
}

export function MonitorBoard() {
  const pipeline = useOfficeStore(s => s.pipeline);
  const agents = useOfficeStore(s => s.agents);
  const paused = useOfficeStore(s => s.paused);
  const togglePause = useOfficeStore(s => s.togglePause);

  const activeAgents = agents.filter(a => a.status !== 'idle' && a.status !== 'waiting');
  const blockedAgents = agents.filter(a => a.status === 'blocked');
  const progress = calculateProgress(pipeline);

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-slate-900/90 border-b border-slate-700/50 backdrop-blur-sm text-xs">
      {/* 파이프라인 상태 */}
      <div className="flex items-center gap-2">
        <Activity size={14} className={pipeline?.status === 'running' ? 'text-emerald-400' : 'text-slate-500'} />
        <span className="text-slate-400 font-medium">
          {pipeline ? pipeline.projectName : '대기 중'}
        </span>
        {pipeline && (
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            pipeline.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' :
            pipeline.status === 'done' ? 'bg-green-500/20 text-green-400' :
            pipeline.status === 'failed' ? 'bg-red-500/20 text-red-400' :
            pipeline.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-slate-700 text-slate-400'
          }`}>
            {pipeline.status.toUpperCase()}
          </span>
        )}
      </div>

      {/* 진행률 바 */}
      {pipeline && pipeline.status !== 'done' && pipeline.status !== 'failed' && (
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-slate-500 font-mono w-8 text-right">{progress}%</span>
        </div>
      )}

      {/* 현재 스테이지 */}
      {pipeline?.currentStage && (
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">현재:</span>
          <span className="text-cyan-400 font-medium">
            {AGENT_NAMES[pipeline.currentStage] || pipeline.currentStage}
          </span>
        </div>
      )}

      {/* ETA */}
      {pipeline?.eta && (
        <div className="flex items-center gap-1">
          <Clock size={12} className="text-slate-500" />
          <span className="text-slate-400 font-mono">{formatETA(pipeline.eta)}</span>
        </div>
      )}

      {/* 에러/병목 */}
      {blockedAgents.length > 0 && (
        <div className="flex items-center gap-1 text-red-400">
          <AlertTriangle size={12} />
          <span>{blockedAgents.map(a => a.name).join(', ')} blocked</span>
        </div>
      )}

      {/* retry */}
      {pipeline && pipeline.retryCount > 0 && (
        <span className="text-amber-400">재시도 #{pipeline.retryCount}</span>
      )}

      {/* 활성 에이전트 수 */}
      <div className="flex items-center gap-1 ml-auto">
        <span className="text-slate-500">{activeAgents.length}/{agents.length} 가동</span>
      </div>

      {/* 일시정지/재개 */}
      {pipeline && pipeline.status !== 'done' && pipeline.status !== 'failed' && (
        <button
          onClick={togglePause}
          className="p-1 rounded hover:bg-slate-700 transition-colors"
          title={paused ? '재개' : '일시정지'}
        >
          {paused
            ? <Play size={14} className="text-emerald-400" />
            : <Pause size={14} className="text-slate-400" />
          }
        </button>
      )}
    </div>
  );
}
