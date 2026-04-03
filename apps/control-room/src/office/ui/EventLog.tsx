import { Terminal, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useOfficeStore } from '../state/officeStore';
import { AGENT_NAMES } from '../state/spatialConfig';

const COLORS: Record<string, string> = {
  'pipeline:start': 'text-cyan-500/60',
  'engine:working': 'text-emerald-500/50',
  'engine:done': 'text-emerald-500/40',
  'engine:error': 'text-red-400/60',
  'pipeline:retry': 'text-amber-400/60',
  'pipeline:soft_pass': 'text-amber-400/50',
  'pipeline:done': 'text-emerald-400/50',
  'pipeline:failed': 'text-red-400/50',
  'review:score': 'text-cyan-400/50',
};

export function EventLog() {
  const events = useOfficeStore(s => s.events);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [events.length]);

  const visible = expanded ? events : events.slice(-4);

  return (
    <div className={`border-t border-white/[0.03] bg-[#060910]/90 backdrop-blur-md transition-all ${expanded ? 'h-40' : 'h-[88px]'}`}>
      <div
        className="flex items-center gap-2 px-4 py-1.5 cursor-pointer hover:bg-white/[0.02]"
        onClick={() => setExpanded(!expanded)}
      >
        <Terminal size={10} className="text-slate-600" />
        <span className="text-[9px] font-semibold text-slate-600 tracking-widest uppercase">Log</span>
        <span className="text-[9px] text-slate-700 ml-0.5">{events.length}</span>
        <div className="ml-auto">
          <ChevronUp size={10} className={`text-slate-700 transition-transform ${expanded ? '' : 'rotate-180'}`} />
        </div>
      </div>

      <div ref={ref} className="overflow-y-auto h-[calc(100%-26px)] px-4 pb-1.5">
        {visible.length === 0 ? (
          <p className="text-[10px] text-slate-700 py-1">대기 중...</p>
        ) : (
          visible.map(e => (
            <div key={e.id} className="flex gap-2 text-[10px] leading-[18px]">
              <span className="text-slate-700 flex-shrink-0 font-mono tabular-nums">
                {new Date(e.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              {e.agentId && (
                <span className="text-slate-600 flex-shrink-0 w-10 truncate font-medium">
                  {AGENT_NAMES[e.agentId]}
                </span>
              )}
              <span className={COLORS[e.type] || 'text-slate-500'}>{e.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
