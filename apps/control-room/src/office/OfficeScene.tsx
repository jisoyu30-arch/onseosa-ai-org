import { useEffect, useRef } from 'react';
import { useOfficeStore } from './state/officeStore';
import { SCENE_WIDTH, SCENE_HEIGHT, tileToScreen, AGENT_COLORS, AGENT_NAMES, TILE_WIDTH, TILE_HEIGHT, ZONES } from './state/spatialConfig';

const HANDOFF_ANIM_MS = 800;

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
const FILLS: Record<number, string> = { 0:'#060910', 1:'#0e1520', 2:'#0c1220', 3:'#0c1025', 4:'#120c1c' };
const STROKES: Record<number, string> = { 0:'#101828', 1:'#1a2840', 2:'#1a2840', 3:'#1a2848', 4:'#251a38' };

function diamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h/2); ctx.lineTo(cx + w/2, cy);
  ctx.lineTo(cx, cy + h/2); ctx.lineTo(cx - w/2, cy); ctx.closePath();
}

const imgs = new Map<string, HTMLImageElement>();
function loadImg(key: string): HTMLImageElement | null {
  if (imgs.has(key)) { const i = imgs.get(key)!; return i.complete && i.naturalWidth > 0 ? i : null; }
  const i = new Image(); i.src = `/assets/chars/${key}.png`; imgs.set(key, i); return null;
}
function agentImg(id: string, expr: string) {
  const s = (expr==='focused'||expr==='stressed'||expr==='reviewing') ? '-working' : expr==='celebrating' ? '-done' : '';
  return loadImg(`${id}${s}`);
}

// 워크스테이션: 넓은 책상 + 듀얼 모니터 + 사이드 패널
function drawWorkstation(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, isActive: boolean) {
  ctx.save();
  ctx.globalAlpha = isActive ? 1 : 0.45;

  // 책상 상판 (넓게)
  diamond(ctx, x, y + 40, 90, 38);
  ctx.fillStyle = isActive ? '#182030' : '#101820';
  ctx.fill();
  ctx.strokeStyle = isActive ? color + '35' : '#1a2438';
  ctx.lineWidth = isActive ? 1 : 0.5;
  ctx.stroke();

  // 책상 앞면 (입체감)
  ctx.beginPath();
  ctx.moveTo(x - 45, y + 40); ctx.lineTo(x, y + 59); ctx.lineTo(x + 45, y + 40); ctx.lineTo(x, y + 52);
  ctx.closePath();
  ctx.fillStyle = '#0c1018';
  ctx.fill();

  // 듀얼 모니터
  for (const ox of [-12, 12]) {
    ctx.fillStyle = '#060a10';
    ctx.fillRect(x + ox - 9, y + 4, 18, 14);
    ctx.strokeStyle = isActive ? color + '40' : '#1a2438';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x + ox - 9, y + 4, 18, 14);
    if (isActive) {
      ctx.fillStyle = color + '12';
      ctx.fillRect(x + ox - 7, y + 6, 14, 10);
      // 코드 라인
      ctx.fillStyle = color + '20';
      for (let i = 0; i < 3; i++) ctx.fillRect(x + ox - 5, y + 8 + i * 3, 8 + (i%2)*3, 1);
    }
  }
  // 모니터 받침대
  ctx.fillStyle = '#0c1018';
  ctx.fillRect(x - 2, y + 18, 4, 6);

  // 키보드 (작은 직사각형)
  ctx.fillStyle = isActive ? '#1a2438' : '#0e1520';
  ctx.fillRect(x - 8, y + 28, 16, 6);

  // active 상태 LED
  if (isActive) {
    ctx.beginPath(); ctx.arc(x + 38, y + 36, 2, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
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

    ['arko','noah','eden','ria','mika','luka'].forEach(id =>
      ['','-working','-done'].forEach(s => loadImg(`${id}${s}`))
    );

    function render() {
      if (!ctx) return;
      const state = useOfficeStore.getState();
      const t = Date.now() / 1000;
      const activeId = state.agents.find(a => a.status === 'writing' || a.status === 'thinking' || a.status === 'reviewing')?.id || null;

      ctx.fillStyle = '#040608';
      ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);

      // 그리드
      ctx.strokeStyle = '#ffffff02'; ctx.lineWidth = 0.3;
      for (let g = 0; g < SCENE_WIDTH; g += 48) { ctx.beginPath(); ctx.moveTo(g, 0); ctx.lineTo(g, SCENE_HEIGHT); ctx.stroke(); }
      for (let g = 0; g < SCENE_HEIGHT; g += 48) { ctx.beginPath(); ctx.moveTo(0, g); ctx.lineTo(SCENE_WIDTH, g); ctx.stroke(); }

      // === 타일 ===
      for (let r = 0; r < MAP.length; r++) {
        for (let c = 0; c < MAP[r].length; c++) {
          const ty = MAP[r][c];
          const { x, y } = tileToScreen(c, r);
          diamond(ctx, x, y, TILE_WIDTH, TILE_HEIGHT);
          ctx.fillStyle = FILLS[ty] || FILLS[0]; ctx.globalAlpha = ty === 0 ? 0.2 : 1; ctx.fill();
          ctx.strokeStyle = STROKES[ty] || STROKES[0]; ctx.lineWidth = ty === 0 ? 0.3 : 0.6; ctx.globalAlpha = ty === 0 ? 0.12 : 0.5; ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // === 영역 라벨 ===
      ctx.font = '600 9px system-ui'; ctx.textAlign = 'center';
      [{ t:'LOBBY', p:tileToScreen(1,0.3) }, { t:'WORKSPACE', p:tileToScreen(5,0.3) },
       { t:'MEETING', p:tileToScreen(10.5,0.8) }, { t:'REVIEW', p:tileToScreen(5.5,6.8) }]
      .forEach(z => { ctx.fillStyle = '#334155'; ctx.globalAlpha = 0.5; ctx.fillText(z.t, z.p.x, z.p.y); ctx.globalAlpha = 1; });

      // === 가구 (에이전트 뒤에 그려서 에이전트가 앞에 보이게) ===
      for (const agent of state.agents) {
        drawWorkstation(ctx, agent.position.x, agent.position.y, AGENT_COLORS[agent.id], agent.id === activeId);
      }

      // 회의 테이블
      const mt = tileToScreen(ZONES.meeting.x, ZONES.meeting.y);
      ctx.save(); ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.ellipse(mt.x, mt.y + 10, 52, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0c1025'; ctx.fill(); ctx.strokeStyle = '#1a2848'; ctx.lineWidth = 1; ctx.stroke();
      for (let i = 0; i < 6; i++) { const a = (i/6)*Math.PI*2-Math.PI/2; ctx.beginPath(); ctx.arc(mt.x+Math.cos(a)*42, mt.y+10+Math.sin(a)*16, 4, 0, Math.PI*2); ctx.fillStyle='#0e1520'; ctx.fill(); }
      ctx.font = '600 7px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#1e3045'; ctx.fillText('MEETING ROOM', mt.x, mt.y + 36);
      ctx.restore();

      // 검수대
      const rz = tileToScreen(5.5, 7.5);
      ctx.save(); ctx.globalAlpha = 0.5;
      diamond(ctx, rz.x, rz.y + 10, 120, 28);
      ctx.fillStyle = '#120c1c'; ctx.fill(); ctx.strokeStyle = '#251a38'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.fillStyle = '#06b6d418';
      for (let i = -2; i <= 2; i++) { const ax = rz.x + i * 22; ctx.beginPath(); ctx.moveTo(ax-4,rz.y+10); ctx.lineTo(ax+4,rz.y+7); ctx.lineTo(ax+4,rz.y+13); ctx.closePath(); ctx.fill(); }
      ctx.restore();

      // === 검수존 게이지 ===
      const reviewDoc = state.documents.find(d => d.type === 'draft' && d.reviewScore !== null);
      if (reviewDoc?.reviewScore !== null && reviewDoc) {
        const score = reviewDoc.reviewScore!;
        const rzy = rz.y + 34;
        const bc = score >= 75 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';
        ctx.fillStyle = '#0a081480'; ctx.fillRect(rz.x-40, rzy-4, 80, 8);
        ctx.fillStyle = bc+'90'; ctx.fillRect(rz.x-40, rzy-4, Math.min(score,100)*0.8, 8);
        ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = '#e2e8f0'; ctx.fillText(`${score}`, rz.x, rzy);
        ctx.font = '600 9px system-ui';
        if (reviewDoc.reviewOutcome === 'pass') { ctx.fillStyle = '#22c55e80'; ctx.fillText('PASS', rz.x, rzy-14); }
        else if (reviewDoc.reviewOutcome === 'soft_pass') { ctx.fillStyle = '#eab30880'; ctx.fillText('CONDITIONAL', rz.x, rzy-14); }
        else if (reviewDoc.reviewOutcome === 'reject') { ctx.fillStyle = '#ef444480'; ctx.fillText('REJECT', rz.x, rzy-14); }
        if (reviewDoc.rejectFeedback) { ctx.font='7px system-ui'; ctx.fillStyle='#ef444440'; ctx.fillText(reviewDoc.rejectFeedback.slice(0,28), rz.x, rzy+12); }
      }

      // === 에이전트 (3D 캐릭터, 책상 안에 앉아있는 느낌) ===
      for (const agent of state.agents) {
        const color = AGENT_COLORS[agent.id];
        const { x, y } = agent.position;
        const isActive = agent.id === activeId;
        const isBlocked = agent.status === 'blocked';
        const isDone = agent.status === 'done';

        // 캐릭터 위치: 모니터 바로 앞 (의자에 앉은 느낌)
        const cy = y + 26;
        const bob = isActive ? Math.sin(t * 3) * 2 : Math.sin(t * 1.3 + agent.id.charCodeAt(0) * 0.6) * 1;

        ctx.save();
        ctx.globalAlpha = isActive ? 1 : isBlocked ? 0.75 : isDone ? 0.7 : 0.5;

        // 3D 캐릭터 이미지
        const img = agentImg(agent.id, agent.expression);
        const sz = 54;
        if (img) {
          ctx.save();
          ctx.beginPath(); ctx.arc(x, cy - 6 + bob, sz/2, 0, Math.PI*2); ctx.clip();
          ctx.drawImage(img, x - sz/2, cy - sz/2 - 6 + bob, sz, sz);
          ctx.restore();
          ctx.beginPath(); ctx.arc(x, cy - 6 + bob, sz/2, 0, Math.PI*2);
          ctx.strokeStyle = isActive ? color + '70' : isBlocked ? '#ef444450' : '#1e293b';
          ctx.lineWidth = isActive ? 1.5 : 0.8;
          ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(x, cy + bob, 16, 0, Math.PI*2);
          ctx.fillStyle = color + '20'; ctx.fill();
          ctx.strokeStyle = color + '40'; ctx.lineWidth = 1; ctx.stroke();
          ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillStyle = color; ctx.fillText(AGENT_NAMES[agent.id][0], x, cy + bob);
        }

        // 이름 (책상 네임플레이트 느낌)
        ctx.font = `${isActive ? '600 8px' : '400 7px'} system-ui`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillStyle = isActive ? '#cbd5e1' : '#475569';
        ctx.fillText(AGENT_NAMES[agent.id], x, cy + sz/2);

        // active 작업 라벨
        if (isActive) {
          const task = state.tasks.find(tk => tk.ownerAgentId === agent.id && tk.status === 'working');
          if (task) {
            const labels: Record<string,string> = { thinking:'분석 중', writing:'작업 중', reviewing:'검수 중' };
            const label = labels[agent.status] || '';
            if (label) {
              ctx.font = '600 8px system-ui';
              const w = label.length * 8 + 12;
              ctx.fillStyle = color + '15';
              ctx.fillRect(x - w/2, cy + sz/2 + 12, w, 16);
              ctx.strokeStyle = color + '30'; ctx.lineWidth = 0.5;
              ctx.strokeRect(x - w/2, cy + sz/2 + 12, w, 16);
              ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillText(label, x, cy + sz/2 + 20);
            }
          }
        }

        // 말풍선
        if (agent.speechBubble && (isActive || isBlocked)) {
          const txt = agent.speechBubble.text.slice(0, 18);
          const bx = x + 36, by = cy - 20;
          ctx.save(); ctx.font = '8px system-ui';
          const tw = txt.length * 6 + 12;
          ctx.fillStyle = '#0a0e16e8'; ctx.fillRect(bx - tw/2, by - 9, tw, 18);
          ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 0.5; ctx.strokeRect(bx - tw/2, by - 9, tw, 18);
          ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(txt, bx, by);
          ctx.restore();
        }

        ctx.restore();
      }

      // === 문서 (큰 아이콘, 이동이 메인 액션) ===
      for (const doc of state.documents) {
        let dx: number, dy: number;
        const from = state.agents.find(a => a.id === doc.currentHolder);
        const to = doc.moveTarget ? state.agents.find(a => a.id === doc.moveTarget) : null;

        if (doc.isMoving && from && to) {
          const p = Math.min((Date.now() % HANDOFF_ANIM_MS) / HANDOFF_ANIM_MS * 1.3, 1);
          const arc = Math.sin(p * Math.PI) * 28;
          dx = from.position.x + (to.position.x - from.position.x) * p;
          dy = (from.position.y + 16) + ((to.position.y + 16) - (from.position.y + 16)) * p - arc;
        } else if (from) {
          dx = from.position.x + 32;
          dy = from.position.y + 14 + Math.sin(t + doc.id.charCodeAt(4)) * 1.5;
        } else continue;

        const isRejected = doc.status === 'rejected';
        const docColor = isRejected ? '#ef4444' : doc.reviewOutcome === 'soft_pass' ? '#eab308' : '#06b6d4';
        const isMoving = doc.isMoving;

        ctx.save();
        ctx.globalAlpha = isMoving ? 0.95 : 0.7;

        if (isMoving) { for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(dx-i*5, dy+i*2, 2.5-i*0.5, 0, Math.PI*2); ctx.fillStyle=docColor+'18'; ctx.fill(); } }

        const s = isMoving ? 1.8 : 1.1;
        ctx.save(); ctx.translate(dx, dy); ctx.scale(s, s);
        ctx.fillStyle = docColor + (isMoving ? 'dd' : '90');
        ctx.fillRect(-6, -8, 12, 16);
        ctx.fillStyle = '#ffffff25'; ctx.beginPath(); ctx.moveTo(2,-8); ctx.lineTo(6,-8); ctx.lineTo(6,-4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffffff10'; ctx.fillRect(-4,-3,8,1); ctx.fillRect(-4,0,6,1); ctx.fillRect(-4,3,7,1);
        if (isRejected) { ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(-3,-2); ctx.lineTo(3,5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(3,-2); ctx.lineTo(-3,5); ctx.stroke(); }
        if (doc.reviewOutcome === 'pass') { ctx.strokeStyle='#22c55e'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-3,1); ctx.lineTo(0,4); ctx.lineTo(4,-2); ctx.stroke(); }
        ctx.restore();

        ctx.font = isMoving ? 'bold 9px system-ui' : '7px system-ui';
        ctx.textAlign = 'center'; ctx.fillStyle = docColor;
        ctx.fillText(doc.label.slice(0,8) + (doc.version > 1 ? ` v${doc.version}` : ''), dx, dy + s*12);
        if (isMoving && doc.moveTarget) { ctx.font='bold 10px system-ui'; ctx.fillStyle='#e2e8f0'; ctx.fillText('→ '+AGENT_NAMES[doc.moveTarget], dx, dy+s*12+14); }
        if (doc.reviewScore !== null && !isMoving) { ctx.font='bold 8px system-ui'; ctx.fillStyle=docColor; ctx.fillText(`${doc.reviewScore}점`, dx, dy-s*10); }

        ctx.restore();
      }

      frameRef.current = window.setTimeout(render, 33) as unknown as number;
    }

    frameRef.current = window.setTimeout(render, 33) as unknown as number;
    return () => clearTimeout(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'100%', objectFit:'contain' }} />;
}
