import { useEffect, useRef, useState } from 'react';
import { OfficeScene } from '../office/OfficeScene';
import { MonitorBoard } from '../office/ui/MonitorBoard';
import { EventLog } from '../office/ui/EventLog';
import { AgentStatusBadges } from '../office/ui/AgentStatusBadge';
import { MeetingPanel } from '../office/ui/MeetingPanel';
import { handleOfficeSSE } from '../office/state/agentBehavior';
import { SCENE_WIDTH, SCENE_HEIGHT } from '../office/state/spatialConfig';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export function OfficePage() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: SCENE_WIDTH, height: SCENE_HEIGHT });

  // SSE 연결
  useEffect(() => {
    const es = new EventSource(`${API_BASE}/events`);

    const eventTypes = [
      'pipeline:start', 'engine:status', 'engine:done', 'engine:error',
      'pipeline:retry', 'pipeline:soft_pass', 'pipeline:done', 'pipeline:failed',
    ];

    for (const type of eventTypes) {
      es.addEventListener(type, (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          handleOfficeSSE({ type, ...data });
        } catch { /* ignore parse errors */ }
      });
    }

    es.onerror = () => {
      console.warn('[Office] SSE 연결 끊김, 3초 후 재연결...');
    };

    return () => es.close();
  }, []);

  // 캔버스 리사이즈 추적
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setCanvasSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    if (sceneRef.current) observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0a0f1a]">
      {/* 상단: 모니터링 보드 */}
      <MonitorBoard />

      {/* 중앙: PixiJS 씬 + React 오버레이 */}
      <div ref={sceneRef} className="flex-1 relative overflow-hidden">
        {/* Canvas Layer */}
        <OfficeScene />

        {/* UI Overlay Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <AgentStatusBadges
            canvasWidth={canvasSize.width}
            canvasHeight={canvasSize.height}
          />
          <MeetingPanel />
        </div>
      </div>

      {/* 하단: 이벤트 로그 */}
      <EventLog />
    </div>
  );
}
