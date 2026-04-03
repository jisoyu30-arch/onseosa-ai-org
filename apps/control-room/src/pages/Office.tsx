import { useEffect } from 'react';
import { OfficeScene } from '../office/OfficeScene';
import { MonitorBoard } from '../office/ui/MonitorBoard';
import { EventLog } from '../office/ui/EventLog';
import { MeetingPanel } from '../office/ui/MeetingPanel';
import { handleOfficeSSE } from '../office/state/agentBehavior';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export function OfficePage() {
  useEffect(() => {
    const es = new EventSource(`${API_BASE}/events`);
    const types = [
      'pipeline:start', 'engine:status', 'engine:done', 'engine:error',
      'pipeline:retry', 'pipeline:soft_pass', 'pipeline:done', 'pipeline:failed',
    ];
    for (const type of types) {
      es.addEventListener(type, (e: MessageEvent) => {
        try { handleOfficeSSE({ type, ...JSON.parse(e.data) }); } catch {}
      });
    }
    return () => es.close();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#040608]">
      <MonitorBoard />
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <OfficeScene />
        <div className="absolute inset-0 pointer-events-none">
          <MeetingPanel />
        </div>
      </div>
      <EventLog />
    </div>
  );
}
