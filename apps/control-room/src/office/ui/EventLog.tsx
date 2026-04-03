import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useOfficeStore } from '../state/officeStore';
import { AGENT_NAMES } from '../state/spatialConfig';

const EVENT_COLORS: Record<string, string> = {
  'pipeline:start': 'text-cyan-400',
  'engine:working': 'text-emerald-400',
  'engine:done': 'text-green-400',
  'engine:error': 'text-red-400',
  'pipeline:retry': 'text-amber-400',
  'pipeline:soft_pass': 'text-yellow-400',
  'pipeline:done': 'text-green-300',
  'pipeline:failed': 'text-red-300',
};

export function EventLog() {
  const events = useOfficeStore(s => s.events);
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current && !collapsed) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length, collapsed]);

  return (
    <div className={`border-t border-slate-700/50 bg-slate-900/90 backdrop-blur-sm transition-all ${
      collapsed ? 'h-8' : 'h-36'
    }`}>
      {/* 헤더 */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-slate-800/50"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Terminal size={12} className="text-cyan-400" />
        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Event Log</span>
        <span className="text-[10px] text-slate-600 ml-1">{events.length}</span>
        <div className="ml-auto">
          {collapsed
            ? <ChevronUp size={12} className="text-slate-500" />
            : <ChevronDown size={12} className="text-slate-500" />
          }
        </div>
      </div>

      {/* 로그 내용 */}
      {!collapsed && (
        <div ref={scrollRef} className="overflow-y-auto h-[calc(100%-28px)] px-3 pb-2 font-mono">
          {events.length === 0 ? (
            <p className="text-slate-600 text-[10px] py-2">이벤트 대기 중...</p>
          ) : (
            events.map(evt => {
              const time = new Date(evt.timestamp).toLocaleTimeString('ko-KR');
              const colorClass = EVENT_COLORS[evt.type] || 'text-slate-400';
              const agentName = evt.agentId ? AGENT_NAMES[evt.agentId] || evt.agentId : '';

              return (
                <div key={evt.id} className="flex gap-2 text-[10px] leading-relaxed mb-0.5">
                  <span className="text-slate-600 flex-shrink-0">{time}</span>
                  {agentName && (
                    <span className="text-slate-500 flex-shrink-0 w-12 truncate">{agentName}</span>
                  )}
                  <span className={colorClass}>{evt.message}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
