import { Users, CheckCircle } from 'lucide-react';
import { useOfficeStore } from '../state/officeStore';
import { AGENT_NAMES, AGENT_COLORS } from '../state/spatialConfig';

export function MeetingPanel() {
  const meetings = useOfficeStore(s => s.meetings);
  const activeMeeting = meetings.find(m => m.status !== 'concluded');
  const lastMeeting = meetings[meetings.length - 1];
  const meeting = activeMeeting || lastMeeting;

  if (!meeting) return null;

  const isActive = meeting.status !== 'concluded';

  return (
    <div className={`absolute right-4 top-12 w-56 rounded-lg border backdrop-blur-sm text-xs transition-all ${
      isActive
        ? 'bg-purple-950/90 border-purple-500/30'
        : 'bg-slate-900/80 border-slate-700/30 opacity-60'
    }`}>
      {/* 헤더 */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-purple-500/20">
        <Users size={12} className={isActive ? 'text-purple-400' : 'text-slate-500'} />
        <span className={`font-bold ${isActive ? 'text-purple-300' : 'text-slate-400'}`}>
          {isActive ? '회의 중' : '최근 회의'}
        </span>
        {isActive && <span className="ml-auto text-[10px] text-purple-400 animate-pulse">LIVE</span>}
      </div>

      {/* 내용 */}
      <div className="px-3 py-2 space-y-1.5">
        {/* 소집 사유 */}
        <div>
          <span className="text-slate-500 text-[10px]">사유</span>
          <p className="text-slate-300">{meeting.triggerReason}</p>
        </div>

        {/* 참석자 */}
        <div>
          <span className="text-slate-500 text-[10px]">참석자</span>
          <div className="flex gap-1 mt-0.5">
            {meeting.attendees.map(id => (
              <span
                key={id}
                className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                style={{ backgroundColor: AGENT_COLORS[id] + '20', color: AGENT_COLORS[id] }}
              >
                {AGENT_NAMES[id]}
              </span>
            ))}
          </div>
        </div>

        {/* 안건 */}
        <div>
          <span className="text-slate-500 text-[10px]">안건</span>
          <p className="text-slate-300">{meeting.agenda}</p>
        </div>

        {/* 결론 */}
        {meeting.conclusion && (
          <div>
            <span className="text-slate-500 text-[10px]">결론</span>
            <p className="text-emerald-400">{meeting.conclusion}</p>
          </div>
        )}

        {/* 액션아이템 */}
        {meeting.actionItems.length > 0 && (
          <div>
            <span className="text-slate-500 text-[10px]">액션</span>
            {meeting.actionItems.map((item, i) => (
              <div key={i} className="flex items-center gap-1 text-[10px] mt-0.5">
                <CheckCircle size={10} className="text-emerald-400" />
                <span style={{ color: AGENT_COLORS[item.agentId] }}>{AGENT_NAMES[item.agentId]}</span>
                <span className="text-slate-400">{item.action}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
