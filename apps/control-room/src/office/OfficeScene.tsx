import { useEffect, useRef } from 'react';
import { useOfficeStore } from './state/officeStore';
import { SCENE_WIDTH, SCENE_HEIGHT, tileToScreen, AGENT_COLORS, AGENT_NAMES, TILE_WIDTH, TILE_HEIGHT, ZONES } from './state/spatialConfig';

const HANDOFF_ANIM_MS = 800;

// 사무실 타일맵 (0=빈, 1=작업공간, 2=로비, 3=회의실, 4=검수존)
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

const ZONE_FILLS: Record<number, string> = {
  0: '#080c16', 1: '#111827', 2: '#0f172a', 3: '#0c1220', 4: '#150f20',
};
const ZONE_BORDERS: Record<number, string> = {
  0: '#1a2030', 1: '#1e293b', 2: '#1e293b', 3: '#1e3045', 4: '#2a1f38',
};

function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
}

// 에이전트 이미지 캐시
const agentImages = new Map<string, HTMLImageElement>();
function getAgentImage(id: string, expression: string): HTMLImageElement | null {
  const suffix = (expression === 'focused' || expression === 'stressed' || expression === 'reviewing')
    ? '-working' : expression === 'celebrating' ? '-done' : '';
  const key = `${id}${suffix}`;
  if (agentImages.has(key)) return agentImages.get(key)!;

  const img = new Image();
  img.src = `/assets/chars/${key}.png`;
  img.onload = () => agentImages.set(key, img);
  agentImages.set(key, img); // placeholder until loaded
  return img.complete ? img : null;
}

// 책상 그리기
function drawDesk(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  // 책상 상판 (아이소메트릭)
  ctx.save();
  drawDiamond(ctx, x, y + 28, 52, 22);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // 모니터
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - 10, y + 8, 20, 14);
  ctx.strokeStyle = color + '60';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 10, y + 8, 20, 14);

  // 모니터 스크린 빛
  ctx.fillStyle = color + '20';
  ctx.fillRect(x - 8, y + 10, 16, 10);

  // 모니터 받침대
  ctx.fillStyle = '#334155';
  ctx.fillRect(x - 2, y + 22, 4, 6);
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

    // 에이전트 이미지 프리로드
    ['arko','noah','eden','ria','mika','luka'].forEach(id => {
      ['', '-working', '-done'].forEach(s => {
        const img = new Image();
        img.src = `/assets/chars/${id}${s}.png`;
        img.onload = () => agentImages.set(`${id}${s}`, img);
      });
    });

    function render() {
      if (!ctx) return;
      const state = useOfficeStore.getState();
      const t = Date.now() / 1000;

      // 배경
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);

      // 미세한 그리드 패턴
      ctx.strokeStyle = '#ffffff03';
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < SCENE_WIDTH; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, SCENE_HEIGHT); ctx.stroke();
      }
      for (let gy = 0; gy < SCENE_HEIGHT; gy += 40) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(SCENE_WIDTH, gy); ctx.stroke();
      }

      // ── 타일 ──
      for (let row = 0; row < MAP.length; row++) {
        for (let col = 0; col < MAP[row].length; col++) {
          const type = MAP[row][col];
          if (type === 0) continue; // 빈 타일 스킵
          const { x, y } = tileToScreen(col, row);
          drawDiamond(ctx, x, y, TILE_WIDTH, TILE_HEIGHT);
          ctx.fillStyle = ZONE_FILLS[type];
          ctx.fill();
          ctx.strokeStyle = ZONE_BORDERS[type];
          ctx.lineWidth = 0.6;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // ── 영역 라벨 ──
      ctx.textAlign = 'center';
      const zones = [
        { text: 'LOBBY', pos: tileToScreen(1, 0.5), color: '#334155' },
        { text: 'WORKSPACE', pos: tileToScreen(5, 0.5), color: '#334155' },
        { text: 'MEETING ROOM', pos: tileToScreen(10.5, 1), color: '#1e3045' },
        { text: 'REVIEW ZONE', pos: tileToScreen(5.5, 7), color: '#2a1f38' },
      ];
      ctx.font = '700 8px Inter, sans-serif';
      for (const z of zones) {
        ctx.fillStyle = z.color;
        ctx.globalAlpha = 0.6;
        ctx.fillText(z.text, z.pos.x, z.pos.y - 2);
        ctx.globalAlpha = 1;
      }

      // ── 가구 (책상) ──
      for (const agent of state.agents) {
        const color = AGENT_COLORS[agent.id];
        drawDesk(ctx, agent.position.x, agent.position.y, color);
      }

      // ── 회의 테이블 ──
      const mt = tileToScreen(ZONES.meeting.x, ZONES.meeting.y);
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(mt.x, mt.y + 12, 44, 16, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1a2235';
      ctx.fill();
      ctx.strokeStyle = '#2d3a50';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // ── 검수존 게이지 ──
      const reviewDoc = state.documents.find(d => d.type === 'draft' && d.reviewScore !== null);
      const rz = tileToScreen(5.5, 7.5);
      if (reviewDoc && reviewDoc.reviewScore !== null) {
        const score = reviewDoc.reviewScore;
        const rzy = rz.y + 18;
        const barColor = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

        // 게이지 배경
        ctx.fillStyle = '#0f0a1880';
        ctx.fillRect(rz.x - 45, rzy - 6, 90, 12);
        ctx.strokeStyle = barColor + '40';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(rz.x - 45, rzy - 6, 90, 12);

        // 게이지 바
        ctx.fillStyle = barColor;
        ctx.fillRect(rz.x - 45, rzy - 6, Math.min(score, 100) * 0.9, 12);

        // 점수
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${score}`, rz.x, rzy);

        // 결과 마크
        ctx.font = 'bold 13px Inter, sans-serif';
        if (reviewDoc.reviewOutcome === 'pass') {
          ctx.fillStyle = '#22c55e';
          ctx.fillText('✓ PASS', rz.x, rzy - 18);
        } else if (reviewDoc.reviewOutcome === 'soft_pass') {
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('⚠ CONDITIONAL', rz.x, rzy - 18);
        } else if (reviewDoc.reviewOutcome === 'reject') {
          ctx.fillStyle = '#ef4444';
          ctx.fillText('✗ REJECT', rz.x, rzy - 18);
        }

        if (reviewDoc.rejectFeedback) {
          ctx.font = '8px Malgun Gothic, sans-serif';
          ctx.fillStyle = '#ef444480';
          ctx.fillText(reviewDoc.rejectFeedback.slice(0, 30), rz.x, rzy + 14);
        }
      }

      // ── 에이전트 ──
      for (const agent of state.agents) {
        const color = AGENT_COLORS[agent.id];
        const { x, y } = agent.position;
        const bobY = (agent.status === 'idle' || agent.status === 'waiting')
          ? Math.sin(t * 1.8 + agent.id.charCodeAt(0) * 0.5) * 3
          : (agent.status === 'writing' || agent.status === 'thinking')
            ? Math.sin(t * 4) * 2
            : 0;

        // 바닥 글로우
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(x, y + 24, 24, 8, 0, 0, Math.PI * 2);
        if (agent.status === 'writing' || agent.status === 'thinking') {
          ctx.fillStyle = color + (Math.sin(t * 3) > 0 ? '35' : '20');
        } else if (agent.status === 'blocked') {
          ctx.fillStyle = '#ef4444' + (Math.sin(t * 6) > 0 ? '50' : '15');
        } else if (agent.status === 'done') {
          ctx.fillStyle = '#22c55e35';
        } else {
          ctx.fillStyle = '#00000020';
        }
        ctx.fill();
        ctx.restore();

        // 3D 캐릭터 이미지
        const img = getAgentImage(agent.id, agent.expression);
        if (img && img.complete && img.naturalWidth > 0) {
          const imgSize = 52;
          ctx.save();
          // 원형 클리핑
          ctx.beginPath();
          ctx.arc(x, y - 4 + bobY, imgSize / 2 + 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, x - imgSize / 2, y - imgSize / 2 - 4 + bobY, imgSize, imgSize);
          ctx.restore();

          // 원형 테두리
          ctx.beginPath();
          ctx.arc(x, y - 4 + bobY, imgSize / 2 + 2, 0, Math.PI * 2);
          ctx.strokeStyle = agent.status === 'idle' ? '#1e293b' : color;
          ctx.lineWidth = agent.status === 'idle' ? 1 : 2;
          ctx.stroke();
        } else {
          // 폴백: 원 + 이니셜
          ctx.beginPath();
          ctx.arc(x, y + bobY, 18, 0, Math.PI * 2);
          ctx.fillStyle = color + '25';
          ctx.fill();
          ctx.strokeStyle = agent.status === 'idle' ? '#334155' : color;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.font = 'bold 14px Malgun Gothic, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = color;
          ctx.fillText(AGENT_NAMES[agent.id].charAt(0), x, y + bobY);
        }

        // 이름
        ctx.font = 'bold 9px Malgun Gothic, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = agent.status === 'idle' ? '#475569' : color;
        ctx.fillText(AGENT_NAMES[agent.id], x, y + 34);

        // 작업 카드
        const task = state.tasks.find(tk => tk.ownerAgentId === agent.id && tk.status === 'working');
        if (task && agent.status !== 'idle') {
          const labels: Record<string, string> = {
            thinking: '분석 중', writing: '작업 중', reviewing: '검수 중',
            waiting: '대기 중', blocked: '오류', done: '완료',
          };
          const label = labels[agent.status] || '';
          const cardText = label ? `${label}` : task.title.slice(0, 8);

          ctx.save();
          ctx.font = 'bold 8px Malgun Gothic, sans-serif';
          const cw = cardText.length * 7 + 12;
          ctx.fillStyle = color + '18';
          ctx.fillRect(x - cw / 2, y + 44, cw, 14);
          ctx.strokeStyle = color + '30';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x - cw / 2, y + 44, cw, 14);
          ctx.fillStyle = color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cardText, x, y + 51);
          ctx.restore();
        } else if (agent.status === 'idle') {
          ctx.font = '7px Malgun Gothic, sans-serif';
          ctx.fillStyle = '#334155';
          ctx.textAlign = 'center';
          ctx.fillText('대기', x, y + 46);
        }

        // 말풍선
        if (agent.speechBubble) {
          const txt = agent.speechBubble.text.slice(0, 22);
          const bx = x + 35, by = y - 20;
          ctx.save();
          ctx.font = '9px Malgun Gothic, sans-serif';
          const tw = txt.length * 7 + 16;
          ctx.fillStyle = '#0d1117ee';
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          ctx.fillRect(bx - tw / 2, by - 10, tw, 20);
          ctx.strokeRect(bx - tw / 2, by - 10, tw, 20);
          ctx.fillStyle = '#e2e8f0';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(txt, bx, by);
          ctx.restore();
        }
      }

      // ── 문서 ──
      for (const doc of state.documents) {
        let dx: number, dy: number;
        const from = state.agents.find(a => a.id === doc.currentHolder);
        const to = doc.moveTarget ? state.agents.find(a => a.id === doc.moveTarget) : null;

        if (doc.isMoving && from && to) {
          const progress = Math.min((Date.now() % HANDOFF_ANIM_MS) / HANDOFF_ANIM_MS * 1.2, 1);
          const arc = Math.sin(progress * Math.PI) * 30;
          dx = from.position.x + (to.position.x - from.position.x) * progress;
          dy = (from.position.y - 35) + ((to.position.y - 35) - (from.position.y - 35)) * progress - arc;
        } else if (from) {
          dx = from.position.x + 25;
          dy = from.position.y - 20 + Math.sin(t * 1.5 + doc.id.charCodeAt(4)) * 2;
        } else continue;

        const isRejected = doc.status === 'rejected';
        const isSoftPass = doc.reviewOutcome === 'soft_pass';
        const docColor = isRejected ? '#ef4444' : isSoftPass ? '#f59e0b' : '#06b6d4';

        ctx.save();
        ctx.globalAlpha = doc.isMoving ? 0.95 : 0.8;

        // 이동 트레일
        if (doc.isMoving) {
          for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(dx - i * 4, dy + i * 2, 2.5 - i * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = docColor + (20 - i * 5).toString(16).padStart(2, '0');
            ctx.fill();
          }
        }

        // 문서 본체
        const s = doc.isMoving ? 1.4 : 1;
        ctx.save();
        ctx.translate(dx, dy);
        ctx.scale(s, s);
        ctx.fillStyle = docColor;
        ctx.fillRect(-7, -9, 14, 18);
        ctx.fillStyle = '#ffffff30';
        ctx.beginPath();
        ctx.moveTo(3, -9); ctx.lineTo(7, -9); ctx.lineTo(7, -5); ctx.closePath();
        ctx.fill();
        if (isRejected) {
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(-3, -3); ctx.lineTo(3, 5); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(3, -3); ctx.lineTo(-3, 5); ctx.stroke();
        }
        if (doc.reviewOutcome === 'pass') {
          ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(-3, 1); ctx.lineTo(-1, 4); ctx.lineTo(4, -2); ctx.stroke();
        }
        ctx.restore();

        // 라벨
        ctx.font = '7px Malgun Gothic, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = docColor;
        ctx.fillText(doc.label.slice(0, 8) + (doc.version > 1 ? ` v${doc.version}` : ''), dx, dy + 14);

        if (doc.isMoving && doc.moveTarget) {
          ctx.font = 'bold 8px Malgun Gothic, sans-serif';
          ctx.fillStyle = '#cce4ff';
          ctx.fillText('→ ' + (AGENT_NAMES[doc.moveTarget] || ''), dx, dy + 23);
        }

        if (doc.reviewScore !== null && !doc.isMoving) {
          ctx.font = 'bold 8px sans-serif';
          ctx.fillStyle = docColor;
          ctx.fillText(`${doc.reviewScore}점`, dx, dy - 14);
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
