import { useOfficeStore } from '../state/officeStore';
import { AGENT_COLORS, AGENT_NAMES, SCENE_WIDTH, SCENE_HEIGHT } from '../state/spatialConfig';

const STATUS_BG: Record<string, string> = {
  idle: 'bg-slate-700/60',
  thinking: 'bg-amber-500/20 border-amber-500/30',
  writing: 'bg-emerald-500/20 border-emerald-500/30',
  reviewing: 'bg-cyan-500/20 border-cyan-500/30',
  waiting: 'bg-orange-500/15 border-orange-500/20',
  blocked: 'bg-red-500/25 border-red-500/40',
  done: 'bg-green-500/20 border-green-500/30',
  in_meeting: 'bg-purple-500/20 border-purple-500/30',
};

interface Props {
  canvasWidth: number;
  canvasHeight: number;
}

export function AgentStatusBadges({ canvasWidth, canvasHeight }: Props) {
  const agents = useOfficeStore(s => s.agents);
  const tasks = useOfficeStore(s => s.tasks);

  const scaleX = canvasWidth / SCENE_WIDTH;
  const scaleY = canvasHeight / SCENE_HEIGHT;

  return (
    <>
      {agents.map(agent => {
        const left = agent.position.x * scaleX;
        const top = agent.position.y * scaleY - 50;
        const color = AGENT_COLORS[agent.id];
        const activeTask = tasks.find(t => t.ownerAgentId === agent.id && t.status === 'working');

        return (
          <div
            key={agent.id}
            className="absolute pointer-events-none transition-all duration-300"
            style={{ left, top, transform: 'translateX(-50%)' }}
          >
            {/* 이름 + 상태 */}
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${STATUS_BG[agent.status] || STATUS_BG.idle}`}>
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: agent.status === 'idle' ? '#475569' : color }}
              />
              <span style={{ color: agent.status === 'idle' ? '#64748b' : color }}>
                {AGENT_NAMES[agent.id]}
              </span>
            </div>

            {/* 현재 작업 */}
            {activeTask && (
              <div className="text-[8px] text-slate-400 text-center mt-0.5 max-w-[80px] truncate">
                {activeTask.title}
              </div>
            )}

            {/* 말풍선 */}
            {agent.speechBubble && (
              <div className="mt-1 px-2 py-1 bg-slate-800/95 border border-slate-600/50 rounded-lg text-[9px] text-slate-300 max-w-[120px] text-center">
                {agent.speechBubble.text}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
