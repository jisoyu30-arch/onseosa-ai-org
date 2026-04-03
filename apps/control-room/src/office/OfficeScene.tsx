import { useEffect, useRef } from 'react';
import { useOfficeStore } from './state/officeStore';
import { SCENE_WIDTH, SCENE_HEIGHT, tileToScreen, AGENT_COLORS, AGENT_NAMES, TILE_WIDTH, TILE_HEIGHT, ZONES } from './state/spatialConfig';

const HANDOFF_ANIM_MS = 800;

// 타일맵
const MAP = [
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
const FILLS: Record<number, string> = { 0:'#060910', 1:'#0c1018', 2:'#0a0e16', 3:'#0a0d18', 4:'#0e0a14' };
const STROKES: Record<number, string> = { 0:'#0e1220', 1:'#151e30', 2:'#151e30', 3:'#152035', 4:'#1e1530' };

function diamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h/2); ctx.lineTo(cx + w/2, cy);
  ctx.lineTo(cx, cy + h/2); ctx.lineTo(cx - w/2, cy); ctx.closePath();
}

// 이미지 캐시
const imgs = new Map<string, HTMLImageElement>();
function loadImg(key: string): HTMLImageElement | null {
  if (imgs.has(key)) { const i = imgs.get(key)!; return i.complete && i.naturalWidth > 0 ? i : null; }
  const i = new Image(); i.src = `/assets/chars/${key}.png`; imgs.set(key, i); return null;
}
function agentImg(id: string, expr: string) {
  const s = (expr==='focused'||expr==='stressed'||expr==='reviewing') ? '-working' : expr==='celebrating' ? '-done' : '';
  return loadImg(`${id}${s}`);
}

// 아이소메트릭 책상 (프리미엄)
function drawDesk(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, isActive: boolean) {
  const alpha = isActive ? 1 : 0.35;
  ctx.save(); ctx.globalAlpha = alpha;

  // 책상 상판
  diamond(ctx, x, y + 36, 68, 28);
  ctx.fillStyle = '#141c28';
  ctx.fill();
  ctx.strokeStyle = isActive ? color + '40' : '#1a2438';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // 모니터 스탠드
  ctx.fillStyle = '#0c1018';
  ctx.fillRect(x - 2, y + 18, 4, 16);

  // 모니터
  ctx.fillStyle = '#080c14';
  ctx.fillRect(x - 15, y + 2, 30, 18);
  ctx.strokeStyle = isActive ? color + '50' : '#1a2438';
  ctx.lineWidth = 0.6;
  ctx.strokeRect(x - 15, y + 2, 30, 18);

  // 모니터 스크린 빛
  if (isActive) {
    ctx.fillStyle = color + '12';
    ctx.fillRect(x - 13, y + 4, 26, 14);
    ctx.beginPath(); ctx.ellipse(x, y + 12, 20, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = color + '06'; ctx.fill();
  }

  ctx.restore();
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

    // 프리로드
    ['arko','noah','eden','ria','mika','luka'].forEach(id =>
      ['','-working','-done'].forEach(s => loadImg(`${id}${s}`))
    );

    function render() {
      if (!ctx) return;
      const state = useOfficeStore.getState();
      const t = Date.now() / 1000;

      // 현재 active 에이전트 (시선 중심)
      const activeAgent = state.agents.find(a =>
        a.status === 'writing' || a.status === 'thinking' || a.status === 'reviewing'
      );
      const activeId = activeAgent?.id || null;

      // === 배경 ===
      ctx.fillStyle = '#040608';
      ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);

      // 미세 그리드 (거의 안 보이게)
      ctx.strokeStyle = '#ffffff02';
      ctx.lineWidth = 0.3;
      for (let gx = 0; gx < SCENE_WIDTH; gx += 48) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, SCENE_HEIGHT); ctx.stroke();
      }
      for (let gy = 0; gy < SCENE_HEIGHT; gy += 48) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(SCENE_WIDTH, gy); ctx.stroke();
      }

      // === 타일 ===
      for (let r = 0; r < MAP.length; r++) {
        for (let c = 0; c < MAP[r].length; c++) {
          const ty = MAP[r][c];
          if (ty === 0) continue;
          const { x, y } = tileToScreen(c, r);
          diamond(ctx, x, y, TILE_WIDTH, TILE_HEIGHT);
          ctx.fillStyle = FILLS[ty]; ctx.fill();
          ctx.strokeStyle = STROKES[ty]; ctx.lineWidth = 0.4; ctx.globalAlpha = 0.35;
          ctx.stroke(); ctx.globalAlpha = 1;
        }
      }

      // === 영역 라벨 (극도로 절제) ===
      ctx.font = '600 7px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '2px';
      const zones = [
        { t: 'LOBBY', p: tileToScreen(1, 0.3) },
        { t: 'WORKSPACE', p: tileToScreen(5, 0.3) },
        { t: 'MEETING', p: tileToScreen(10.5, 0.8) },
        { t: 'REVIEW', p: tileToScreen(5.5, 6.8) },
      ];
      for (const z of zones) {
        ctx.fillStyle = '#1e293b'; ctx.globalAlpha = 0.4;
        ctx.fillText(z.t, z.p.x, z.p.y); ctx.globalAlpha = 1;
      }

      // === 가구 ===
      for (const agent of state.agents) {
        const isActive = agent.id === activeId;
        drawDesk(ctx, agent.position.x, agent.position.y, AGENT_COLORS[agent.id], isActive);
      }

      // 회의 테이블
      const mt = tileToScreen(ZONES.meeting.x, ZONES.meeting.y);
      ctx.save(); ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.ellipse(mt.x, mt.y + 14, 56, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0c1220'; ctx.fill();
      ctx.strokeStyle = '#1a2438'; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();

      // === 검수존 ===
      const reviewDoc = state.documents.find(d => d.type === 'draft' && d.reviewScore !== null);
      const rz = tileToScreen(5.5, 7.5);
      if (reviewDoc && reviewDoc.reviewScore !== null) {
        const score = reviewDoc.reviewScore;
        const rzy = rz.y + 18;
        const barColor = score >= 75 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';

        // 게이지 트랙
        ctx.fillStyle = '#0a0814';
        ctx.fillRect(rz.x - 40, rzy - 4, 80, 8);
        // 게이지 바
        ctx.fillStyle = barColor + '90';
        ctx.fillRect(rz.x - 40, rzy - 4, Math.min(score, 100) * 0.8, 8);
        // 점수
        ctx.font = 'bold 9px Inter, system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = '#e2e8f0'; ctx.fillText(`${score}`, rz.x, rzy);
        // 마크
        ctx.font = '600 10px Inter, system-ui';
        if (reviewDoc.reviewOutcome === 'pass') {
          ctx.fillStyle = '#22c55e80'; ctx.fillText('PASS', rz.x, rzy - 14);
        } else if (reviewDoc.reviewOutcome === 'soft_pass') {
          ctx.fillStyle = '#eab30880'; ctx.fillText('CONDITIONAL', rz.x, rzy - 14);
        } else if (reviewDoc.reviewOutcome === 'reject') {
          ctx.fillStyle = '#ef444480'; ctx.fillText('REJECT', rz.x, rzy - 14);
        }
        if (reviewDoc.rejectFeedback) {
          ctx.font = '7px system-ui'; ctx.fillStyle = '#ef444440';
          ctx.fillText(reviewDoc.rejectFeedback.slice(0, 28), rz.x, rzy + 12);
        }
      }

      // === 에이전트 (핵심: active 1명 강조, 나머지 dim) ===
      for (const agent of state.agents) {
        const color = AGENT_COLORS[agent.id];
        const { x, y } = agent.position;
        const isActive = agent.id === activeId;
        const isBlocked = agent.status === 'blocked';
        const isDone = agent.status === 'done';
        const dimAlpha = isActive ? 1 : isBlocked ? 0.7 : isDone ? 0.6 : 0.3;

        const bobY = isActive
          ? Math.sin(t * 3) * 2.5
          : Math.sin(t * 1.2 + agent.id.charCodeAt(0) * 0.7) * 1.5;

        ctx.save();
        ctx.globalAlpha = dimAlpha;

        // 바닥 글로우 (active만 확실히)
        if (isActive) {
          ctx.beginPath(); ctx.ellipse(x, y + 26, 28, 10, 0, 0, Math.PI * 2);
          ctx.fillStyle = color + '18'; ctx.fill();
        } else if (isBlocked) {
          ctx.beginPath(); ctx.ellipse(x, y + 26, 22, 7, 0, 0, Math.PI * 2);
          const blink = Math.sin(t * 5) > 0;
          ctx.fillStyle = blink ? '#ef444420' : '#ef444408'; ctx.fill();
        }

        // 캐릭터
        const img = agentImg(agent.id, agent.expression);
        const sz = isActive ? 64 : 52;
        if (img) {
          ctx.save();
          ctx.beginPath(); ctx.arc(x, y - 2 + bobY, sz / 2, 0, Math.PI * 2); ctx.clip();
          ctx.drawImage(img, x - sz / 2, y - sz / 2 - 2 + bobY, sz, sz);
          ctx.restore();
          // 테두리
          ctx.beginPath(); ctx.arc(x, y - 2 + bobY, sz / 2, 0, Math.PI * 2);
          ctx.strokeStyle = isActive ? color + '80' : isBlocked ? '#ef444460' : '#1e293b40';
          ctx.lineWidth = isActive ? 2 : 1;
          ctx.stroke();
        } else {
          // 폴백
          ctx.beginPath(); ctx.arc(x, y + bobY, sz / 2 - 4, 0, Math.PI * 2);
          ctx.fillStyle = color + '15'; ctx.fill();
          ctx.strokeStyle = isActive ? color : '#1e293b';
          ctx.lineWidth = 1; ctx.stroke();
          ctx.font = `bold ${isActive ? 14 : 11}px system-ui`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillStyle = color; ctx.fillText(AGENT_NAMES[agent.id][0], x, y + bobY);
        }

        // 이름 (작게, 절제)
        ctx.font = `${isActive ? '600 9px' : '400 8px'} system-ui`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillStyle = isActive ? '#e2e8f0' : '#475569';
        ctx.fillText(AGENT_NAMES[agent.id], x, y + sz / 2 + 4);

        // 작업 카드 (active만 크게, 나머지는 한 줄)
        const task = state.tasks.find(tk => tk.ownerAgentId === agent.id && tk.status === 'working');
        if (isActive && task) {
          const labels: Record<string, string> = {
            thinking:'분석 중', writing:'작업 중', reviewing:'검수 중',
          };
          const label = labels[agent.status] || '처리 중';
          ctx.font = '600 9px system-ui';
          const cardW = label.length * 9 + 16;
          // glass card
          ctx.fillStyle = color + '12';
          ctx.fillRect(x - cardW / 2, y + sz / 2 + 16, cardW, 18);
          ctx.strokeStyle = color + '25';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x - cardW / 2, y + sz / 2 + 16, cardW, 18);
          ctx.fillStyle = color;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(label, x, y + sz / 2 + 25);
        } else if (isBlocked) {
          ctx.font = '600 8px system-ui';
          ctx.fillStyle = '#ef4444';
          ctx.fillText('BLOCKED', x, y + sz / 2 + 18);
        } else if (isDone && !isActive) {
          ctx.font = '400 7px system-ui';
          ctx.fillStyle = '#22c55e60';
          ctx.fillText('완료', x, y + sz / 2 + 16);
        }

        // 말풍선 (active만)
        if (agent.speechBubble && (isActive || isBlocked)) {
          const txt = agent.speechBubble.text.slice(0, 20);
          const bx = x + (isActive ? 40 : 30), by = y - 15;
          ctx.save();
          ctx.font = '8px system-ui';
          const tw = txt.length * 6 + 14;
          ctx.fillStyle = '#0a0e16e0';
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 0.5;
          ctx.fillRect(bx - tw / 2, by - 9, tw, 18);
          ctx.strokeRect(bx - tw / 2, by - 9, tw, 18);
          ctx.fillStyle = '#94a3b8';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(txt, bx, by);
          ctx.restore();
        }

        ctx.restore();
      }

      // === 문서 (절제된 표현) ===
      for (const doc of state.documents) {
        let dx: number, dy: number;
        const from = state.agents.find(a => a.id === doc.currentHolder);
        const to = doc.moveTarget ? state.agents.find(a => a.id === doc.moveTarget) : null;

        if (doc.isMoving && from && to) {
          const p = Math.min((Date.now() % HANDOFF_ANIM_MS) / HANDOFF_ANIM_MS * 1.3, 1);
          const arc = Math.sin(p * Math.PI) * 25;
          dx = from.position.x + (to.position.x - from.position.x) * p;
          dy = (from.position.y - 32) + ((to.position.y - 32) - (from.position.y - 32)) * p - arc;
        } else if (from) {
          dx = from.position.x + 22;
          dy = from.position.y - 18 + Math.sin(t * 1.2 + doc.id.charCodeAt(4)) * 1.5;
        } else continue;

        const isRejected = doc.status === 'rejected';
        const docColor = isRejected ? '#ef4444' : doc.reviewOutcome === 'soft_pass' ? '#eab308' : '#06b6d4';
        const isMoving = doc.isMoving;

        ctx.save();
        ctx.globalAlpha = isMoving ? 0.9 : 0.5;

        // 트레일
        if (isMoving) {
          for (let i = 1; i <= 2; i++) {
            ctx.beginPath(); ctx.arc(dx - i * 3, dy + i, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = docColor + '15'; ctx.fill();
          }
        }

        // 문서 아이콘 (미니멀)
        const s = isMoving ? 1.2 : 0.9;
        ctx.save(); ctx.translate(dx, dy); ctx.scale(s, s);
        ctx.fillStyle = docColor + (isMoving ? 'cc' : '60');
        ctx.fillRect(-5, -7, 10, 14);
        // 접힌 모서리
        ctx.fillStyle = '#ffffff20';
        ctx.beginPath(); ctx.moveTo(2, -7); ctx.lineTo(5, -7); ctx.lineTo(5, -4); ctx.closePath(); ctx.fill();
        // 반려 X
        if (isRejected) {
          ctx.strokeStyle = '#fff8'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(-2, -2); ctx.lineTo(2, 4); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(2, -2); ctx.lineTo(-2, 4); ctx.stroke();
        }
        // 승인 체크
        if (doc.reviewOutcome === 'pass') {
          ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(-2, 1); ctx.lineTo(0, 3); ctx.lineTo(3, -1); ctx.stroke();
        }
        ctx.restore();

        // 이동 라벨
        if (isMoving && doc.moveTarget) {
          ctx.font = '600 7px system-ui';
          ctx.fillStyle = '#94a3b8';
          ctx.textAlign = 'center';
          ctx.fillText('→ ' + AGENT_NAMES[doc.moveTarget], dx, dy + 12);
        }

        ctx.restore();
      }

      frameRef.current = window.setTimeout(render, 33) as unknown as number; // ~30fps, 프리뷰 도구 호환
    }

    frameRef.current = window.setTimeout(render, 33) as unknown as number;
    return () => clearTimeout(frameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }}
    />
  );
}
