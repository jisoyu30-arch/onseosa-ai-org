import { useEffect, useRef } from 'react';
import { useOfficeStore } from './state/officeStore';
import { SCENE_WIDTH, SCENE_HEIGHT, tileToScreen, AGENT_COLORS, AGENT_NAMES, TILE_WIDTH, TILE_HEIGHT } from './state/spatialConfig';

const HANDOFF_ANIM_MS = 800; // 문서 이동 애니메이션 시간

// 사무실 타일맵 (0=빈, 1=작업공간, 2=로비, 3=회의실, 4=검수존)
const OFFICE_MAP = [
  [2,2,1,1,1,1,1,1,0,0,3,3],
  [2,2,1,1,1,1,1,1,0,0,3,3],
  [0,0,1,1,1,1,1,1,0,0,3,3],
  [0,0,1,1,1,1,1,1,0,0,3,3],
  [0,0,1,1,1,1,1,1,0,0,0,0],
  [0,0,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,4,4,4,4,4,4,4,4,0,0],
  [0,0,4,4,4,4,4,4,4,4,0,0],
];

const ZONE_FILLS: Record<number, string> = {
  0: '#0a0f1a', 1: '#151c2c', 2: '#1a2235', 3: '#17202e', 4: '#1c1525',
};
const ZONE_STROKE: Record<number, string> = {
  0: '#1e2433', 1: '#2a3548', 2: '#2a3548', 3: '#2d3a50', 4: '#352a40',
};

function drawIsoDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
}

export function OfficeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = SCENE_WIDTH * dpr;
    canvas.height = SCENE_HEIGHT * dpr;
    canvas.style.width = SCENE_WIDTH + 'px';
    canvas.style.height = SCENE_HEIGHT + 'px';
    ctx.scale(dpr, dpr);

    function render() {
      if (!ctx) return;
      const state = useOfficeStore.getState();
      const t = Date.now() / 1000;

      // 클리어
      ctx.fillStyle = '#0a0f1a';
      ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);

      // ── 타일 그리기 ──
      for (let row = 0; row < OFFICE_MAP.length; row++) {
        for (let col = 0; col < OFFICE_MAP[row].length; col++) {
          const type = OFFICE_MAP[row][col];
          const { x, y } = tileToScreen(col, row);
          drawIsoDiamond(ctx, x, y, TILE_WIDTH, TILE_HEIGHT);
          ctx.fillStyle = ZONE_FILLS[type];
          ctx.fill();
          ctx.strokeStyle = ZONE_STROKE[type];
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = 0.4;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // ── 영역 라벨 ──
      ctx.font = '10px Malgun Gothic, sans-serif';
      ctx.textAlign = 'center';
      const labels = [
        { text: '로비', pos: tileToScreen(1, 0), color: '#4a5568' },
        { text: '작업 공간', pos: tileToScreen(5, 3), color: '#4a5568' },
        { text: '회의실', pos: tileToScreen(10.5, 2), color: '#4a5568' },
        { text: '검수/승인', pos: tileToScreen(5.5, 7.5), color: '#6b4a80' },
      ];
      for (const lbl of labels) {
        ctx.fillStyle = lbl.color;
        ctx.fillText(lbl.text, lbl.pos.x, lbl.pos.y - 5);
      }

      // ── 검수존 게이지 ──
      const reviewDoc = state.documents.find(d => d.type === 'draft' && d.reviewScore !== null);
      const reviewZone = tileToScreen(5.5, 7.5);
      if (reviewDoc && reviewDoc.reviewScore !== null) {
        const score = reviewDoc.reviewScore;
        const rzx = reviewZone.x, rzy = reviewZone.y + 15;

        // 게이지 배경
        ctx.fillStyle = '#1c152580';
        ctx.beginPath();
        ctx.rect(rzx - 50, rzy - 8, 100, 16);
        ctx.fill();

        // 게이지 바
        const barWidth = Math.min(score, 100);
        const barColor = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
        ctx.fillStyle = barColor;
        ctx.beginPath();
        ctx.rect(rzx - 50, rzy - 8, barWidth, 16);
        ctx.fill();

        // 점수 텍스트
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${score}점`, rzx, rzy);

        // 승인/반려 마크
        if (reviewDoc.reviewOutcome === 'pass') {
          ctx.font = 'bold 16px sans-serif';
          ctx.fillStyle = '#22c55e';
          ctx.fillText('✓ 승인', rzx, rzy - 22);
        } else if (reviewDoc.reviewOutcome === 'soft_pass') {
          ctx.font = 'bold 12px sans-serif';
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('⚠ 조건부 통과', rzx, rzy - 22);
        } else if (reviewDoc.reviewOutcome === 'reject') {
          ctx.font = 'bold 14px sans-serif';
          ctx.fillStyle = '#ef4444';
          ctx.fillText('✗ 반려', rzx, rzy - 22);
        }

        // 반려 사유
        if (reviewDoc.rejectFeedback) {
          ctx.font = '8px Malgun Gothic, sans-serif';
          ctx.fillStyle = '#ef4444aa';
          ctx.fillText(reviewDoc.rejectFeedback.slice(0, 25), rzx, rzy + 16);
        }
      }

      // ── 에이전트 ──
      for (const agent of state.agents) {
        const color = AGENT_COLORS[agent.id];
        const { x, y } = agent.position;

        // bob 애니메이션
        const bobOffset = agent.status === 'idle' || agent.status === 'waiting'
          ? Math.sin(t * 2 + agent.id.charCodeAt(0)) * 3
          : agent.status === 'writing' || agent.status === 'thinking'
            ? Math.sin(t * 5) * 2
            : 0;

        // 바닥 글로우
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(x, y + 20, 22, 8, 0, 0, Math.PI * 2);
        if (agent.status === 'writing' || agent.status === 'thinking') {
          ctx.fillStyle = color + '40';
        } else if (agent.status === 'blocked') {
          const blink = Math.sin(t * 6) > 0 ? '60' : '20';
          ctx.fillStyle = '#ef4444' + blink;
        } else if (agent.status === 'done') {
          ctx.fillStyle = '#22c55e40';
        } else {
          ctx.fillStyle = '#00000030';
        }
        ctx.fill();
        ctx.restore();

        // 에이전트 원형 아바타
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y + bobOffset, 18, 0, Math.PI * 2);
        ctx.fillStyle = color + '30';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = agent.status === 'idle' ? '#334155' : color;
        ctx.stroke();
        ctx.restore();

        // 이니셜
        ctx.font = 'bold 14px Malgun Gothic, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;
        ctx.fillText(AGENT_NAMES[agent.id].charAt(0), x, y + bobOffset);

        // 이름
        ctx.font = 'bold 9px Malgun Gothic, sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillStyle = agent.status === 'idle' ? '#64748b' : color;
        ctx.fillText(AGENT_NAMES[agent.id], x, y + 32);

        // 작업 카드 (active일 때만)
        const task = state.tasks.find(tk => tk.ownerAgentId === agent.id && tk.status === 'working');
        if (task && agent.status !== 'idle') {
          const statusLabels: Record<string, string> = {
            thinking: '분석 중', writing: '작업 중', reviewing: '검수 중',
            waiting: '대기 중', blocked: '막힘', done: '완료',
          };
          const statusLabel = statusLabels[agent.status] || agent.status;
          const cardText = statusLabel + ': ' + task.title.slice(0, 10);
          const cardWidth = cardText.length * 6 + 14; // 근사 너비

          ctx.save();
          ctx.font = 'bold 8px Malgun Gothic, sans-serif';
          // 카드 배경
          ctx.fillStyle = color + '20';
          ctx.strokeStyle = color + '40';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(x - cardWidth / 2, y + 42, cardWidth, 16);
          ctx.fill();
          ctx.stroke();
          // 카드 텍스트
          ctx.fillStyle = color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cardText, x, y + 50);
          ctx.restore();
        } else if (agent.status === 'idle') {
          ctx.font = '7px Malgun Gothic, sans-serif';
          ctx.fillStyle = '#475569';
          ctx.fillText('대기', x, y + 44);
        }

        // 말풍선
        if (agent.speechBubble) {
          const bx = x + 30, by = y - 20;
          const txt = agent.speechBubble.text.slice(0, 20);
          ctx.save();
          ctx.font = '9px Malgun Gothic, sans-serif';
          const tw = ctx.measureText(txt).width + 12;
          ctx.fillStyle = '#0d1117ee';
          ctx.strokeStyle = '#2d3548';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(bx - tw / 2, by - 10, tw, 20);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#cce4ff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(txt, bx, by);
          ctx.restore();
        }
      }

      // ── 문서 스프라이트 ──
      for (const doc of state.documents) {
        // 문서 위치 계산 — 이동 중이면 출발지→도착지 lerp
        let dx: number, dy: number;
        const fromAgent = state.agents.find(a => a.id === doc.currentHolder);
        const toAgent = doc.moveTarget ? state.agents.find(a => a.id === doc.moveTarget) : null;

        if (doc.isMoving && fromAgent && toAgent) {
          // 이동 중: 출발→도착 사이를 왔다갔다
          const elapsed = (Date.now() % (HANDOFF_ANIM_MS)) / HANDOFF_ANIM_MS; // 0~1
          const progress = Math.min(elapsed * 1.2, 1); // 살짝 빠르게
          const arcHeight = Math.sin(progress * Math.PI) * 25; // 포물선 아치
          dx = fromAgent.position.x + (toAgent.position.x - fromAgent.position.x) * progress;
          dy = (fromAgent.position.y - 30) + ((toAgent.position.y - 30) - (fromAgent.position.y - 30)) * progress - arcHeight;
        } else if (fromAgent) {
          dx = fromAgent.position.x;
          dy = fromAgent.position.y - 30;
        } else {
          continue;
        }

        const isRejected = doc.status === 'rejected';
        const isSoftPass = doc.reviewOutcome === 'soft_pass';
        const docColor = isRejected ? '#ef4444' : isSoftPass ? '#f59e0b' : '#06b6d4';
        const docAlpha = doc.isMoving ? 0.9 : 0.85;

        ctx.save();
        ctx.globalAlpha = docAlpha;

        // 이동 중 트레일 효과
        if (doc.isMoving) {
          ctx.beginPath();
          ctx.arc(dx, dy, 3, 0, Math.PI * 2);
          ctx.fillStyle = docColor + '40';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(dx - 4, dy + 2, 2, 0, Math.PI * 2);
          ctx.fillStyle = docColor + '20';
          ctx.fill();
        }

        // 문서 아이콘 (이동 중이면 더 크게)
        const size = doc.isMoving ? 1.3 : 1;
        ctx.save();
        ctx.translate(dx, dy);
        ctx.scale(size, size);
        // 문서 본체
        ctx.fillStyle = docColor;
        ctx.beginPath();
        ctx.rect(-7, -10, 14, 18);
        ctx.fill();
        // 접힌 모서리
        ctx.fillStyle = '#ffffff40';
        ctx.beginPath();
        ctx.moveTo(3, -10);
        ctx.lineTo(7, -10);
        ctx.lineTo(7, -6);
        ctx.closePath();
        ctx.fill();
        // 반려 X 마크
        if (isRejected) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-3, -4); ctx.lineTo(3, 4);
          ctx.moveTo(3, -4); ctx.lineTo(-3, 4);
          ctx.stroke();
        }
        // 승인 체크 마크
        if (doc.reviewOutcome === 'pass') {
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-3, 0); ctx.lineTo(-1, 3); ctx.lineTo(4, -3);
          ctx.stroke();
        }
        ctx.restore();

        // 문서 라벨 (타입 + 버전)
        ctx.font = 'bold 8px Malgun Gothic, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = docColor;
        const label = doc.label.slice(0, 6) + (doc.version > 1 ? ` v${doc.version}` : '');
        ctx.fillText(label, dx, dy + 12);

        // 이동 방향 화살표 + 대상
        if (doc.isMoving && doc.moveTarget) {
          ctx.font = '8px Malgun Gothic, sans-serif';
          ctx.fillStyle = '#cce4ff';
          ctx.fillText('→ ' + (AGENT_NAMES[doc.moveTarget] || ''), dx, dy + 22);
        }

        // 점수 표시
        if (doc.reviewScore !== null) {
          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = doc.reviewScore >= 75 ? '#22c55e' : doc.reviewScore >= 50 ? '#f59e0b' : '#ef4444';
          ctx.fillText(`${doc.reviewScore}점`, dx, dy - 16);
        }
        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(render);
    }

    frameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }}
    />
  );
}
