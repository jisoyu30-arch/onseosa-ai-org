import { Users } from 'lucide-react';
import { useOfficeStore } from '../state/officeStore';
import { AGENT_NAMES, AGENT_COLORS } from '../state/spatialConfig';

export function MeetingPanel() {
  const meetings = useOfficeStore(s => s.meetings);
  const meeting = meetings.find(m => m.status !== 'concluded') || meetings[meetings.length - 1];

  if (!meeting) return null;
  const live = meeting.status !== 'concluded';

  return (
    <div className={`absolute right-3 top-12 w-52 rounded-lg border backdrop-blur-md transition-all ${
      live ? 'bg-[#0a0e18]/90 border-purple-500/15' : 'bg-[#080c14]/80 border-white/[0.04] opacity-50'
    }`}>
      {/* 헤더 */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/[0.04]">
        <Users size={10} className={live ? 'text-purple-400/60' : 'text-slate-600'} />
        <span className={`text-[9px] font-semibold tracking-wider ${live ? 'text-purple-300/70' : 'text-slate-500'}`}>
          {live ? 'MEETING' : 'LAST MEETING'}
        </span>
        {live && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-pulse" />}
      </div>

      <div className="px-3 py-2 space-y-2 text-[10px]">
        {/* 사유 */}
        <p className="text-slate-400 leading-relaxed">{meeting.triggerReason}</p>

        {/* 참석자 */}
        <div className="flex gap-1 flex-wrap">
          {meeting.attendees.map(id => (
            <span key={id} className="px-1.5 py-px rounded text-[8px] font-semibold"
              style={{ backgroundColor: AGENT_COLORS[id] + '10', color: AGENT_COLORS[id] + '90' }}>
              {AGENT_NAMES[id]}
            </span>
          ))}
        </div>

        {/* 결론 */}
        {meeting.conclusion && (
          <p className="text-emerald-400/60 leading-relaxed border-t border-white/[0.03] pt-1.5">
            {meeting.conclusion}
          </p>
        )}

        {/* 액션 */}
        {meeting.actionItems.length > 0 && (
          <div className="space-y-0.5">
            {meeting.actionItems.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-1 text-[9px]">
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: AGENT_COLORS[item.agentId] + '60' }} />
                <span className="text-slate-500">{AGENT_NAMES[item.agentId]}</span>
                <span className="text-slate-600">{item.action}</span>
              </div>
            ))}
            {meeting.actionItems.length > 3 && (
              <span className="text-[8px] text-slate-700">+{meeting.actionItems.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
