import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { useOfficeStore } from './state/officeStore';
import { loadOfficeMap, OfficeMapData } from './scene/mapLoader';
import { SCENE_WIDTH, SCENE_HEIGHT, tileToScreen, AGENT_COLORS, AGENT_NAMES, TILE_WIDTH, TILE_HEIGHT } from './state/spatialConfig';

const ZONE_COLORS: Record<string, number> = {
  lobby: 0x0c1220, workspace: 0x0e1520, meeting: 0x0c1025, review: 0x120c1c,
};
const ZONE_STROKES: Record<string, number> = {
  lobby: 0x1a2840, workspace: 0x1a2840, meeting: 0x1a2848, review: 0x251a38,
};

function diamond(g: PIXI.Graphics, cx: number, cy: number, w: number, h: number) {
  g.moveTo(cx, cy - h/2); g.lineTo(cx + w/2, cy);
  g.lineTo(cx, cy + h/2); g.lineTo(cx - w/2, cy); g.closePath();
}

export function OfficeScene() {
  const ref = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!ref.current || appRef.current) return;

    const app = new PIXI.Application({
      width: SCENE_WIDTH, height: SCENE_HEIGHT,
      backgroundColor: 0x040608, antialias: true,
      resolution: window.devicePixelRatio || 1, autoDensity: true,
    });
    appRef.current = app;
    ref.current.appendChild(app.view as HTMLCanvasElement);

    // 맵 로드 → 렌더링
    loadOfficeMap('/maps/office.json').then(mapData => {
      buildScene(app, mapData);
    });

    return () => { app.destroy(true); appRef.current = null; };
  }, []);

  return (
    <div ref={ref} style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }} />
  );
}

function buildScene(app: PIXI.Application, map: OfficeMapData) {
  // === 바닥 타일 (정적) ===
  const floor = new PIXI.Graphics();
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
  const tileColors = [0x060910, 0x0e1520, 0x0c1220, 0x0c1025, 0x120c1c];
  const tileBorders = [0x101828, 0x1a2840, 0x1a2840, 0x1a2848, 0x251a38];

  for (let r = 0; r < MAP.length; r++) {
    for (let c = 0; c < MAP[r].length; c++) {
      const ty = MAP[r][c];
      const { x, y } = tileToScreen(c, r);
      floor.beginFill(tileColors[ty], ty === 0 ? 0.15 : 1);
      floor.lineStyle(ty === 0 ? 0.3 : 0.6, tileBorders[ty], ty === 0 ? 0.1 : 0.5);
      diamond(floor, x, y, TILE_WIDTH, TILE_HEIGHT);
      floor.endFill();
    }
  }
  app.stage.addChild(floor);

  // === 존 라벨 (Tiled JSON에서 읽기) ===
  const labelStyle = new PIXI.TextStyle({ fontFamily:'system-ui', fontSize:9, fontWeight:'600', fill:0x334155 });
  for (const zone of map.zones) {
    const txt = new PIXI.Text(zone.label, labelStyle);
    txt.anchor.set(0.5); txt.x = zone.screenCenter.x; txt.y = zone.screenCenter.y - 30;
    txt.alpha = 0.5;
    app.stage.addChild(txt);
  }

  // === 가구 — 책상 (Tiled JSON 기반) ===
  for (const desk of map.desks) {
    const { x, y } = desk.screenPos;
    const g = new PIXI.Graphics();

    // 책상 상판
    g.beginFill(0x101820);
    g.lineStyle(0.5, 0x1a2438, 0.4);
    diamond(g, x, y + 40, 88, 36);
    g.endFill();

    // 입체 앞면
    g.beginFill(0x0c1018);
    g.lineStyle(0);
    g.moveTo(x - 44, y + 40); g.lineTo(x, y + 58);
    g.lineTo(x + 44, y + 40); g.lineTo(x, y + 51);
    g.closePath(); g.endFill();

    // 듀얼 모니터
    for (const ox of [-12, 12]) {
      g.beginFill(0x060a10);
      g.drawRect(x + ox - 10, y + 4, 20, 16);
      g.endFill();
      g.lineStyle(0.5, 0x1a2438, 0.3);
      g.drawRect(x + ox - 10, y + 4, 20, 16);
      g.lineStyle(0);
    }
    // 받침대
    g.beginFill(0x0c1018);
    g.drawRect(x - 2, y + 20, 4, 6);
    g.endFill();
    // 키보드
    g.beginFill(0x0e1520);
    g.drawRect(x - 8, y + 30, 16, 5);
    g.endFill();

    // 네임플레이트
    const nameTag = new PIXI.Text(desk.label, new PIXI.TextStyle({ fontFamily:'system-ui', fontSize:7, fontWeight:'500', fill:0x334155 }));
    nameTag.anchor.set(0.5, 0); nameTag.x = x; nameTag.y = y + 62;
    g.addChild(nameTag);

    app.stage.addChild(g);
  }

  // === 가구 — 회의 테이블/검수대 (Tiled JSON 기반) ===
  for (const furn of map.furniture) {
    const { x, y } = furn.screenPos;
    const g = new PIXI.Graphics();

    if (furn.shape === 'ellipse' && furn.rx && furn.ry) {
      g.beginFill(0x0c1025, 0.5);
      g.lineStyle(1, 0x1a2848, 0.5);
      g.drawEllipse(x, y + 10, furn.rx, furn.ry);
      g.endFill();
      // 의자
      for (let i = 0; i < 6; i++) {
        const a = (i/6)*Math.PI*2 - Math.PI/2;
        g.lineStyle(0);
        g.beginFill(0x0e1520, 0.4);
        g.drawCircle(x + Math.cos(a)*42, y + 10 + Math.sin(a)*16, 4);
        g.endFill();
      }
      const label = new PIXI.Text('MEETING ROOM', new PIXI.TextStyle({ fontFamily:'system-ui', fontSize:7, fontWeight:'600', fill:0x1e3045 }));
      label.anchor.set(0.5); label.x = x; label.y = y + 36;
      g.addChild(label);
    }

    if (furn.shape === 'diamond' && furn.width && furn.height) {
      g.beginFill(0x120c1c, 0.6);
      g.lineStyle(0.8, 0x251a38, 0.5);
      diamond(g, x, y + 10, furn.width, furn.height);
      g.endFill();
      // 흐름 화살표
      g.beginFill(0x06b6d4, 0.1);
      for (let i = -2; i <= 2; i++) {
        const ax = x + i * 22;
        g.moveTo(ax - 4, y + 10); g.lineTo(ax + 4, y + 7); g.lineTo(ax + 4, y + 13);
        g.closePath();
      }
      g.endFill();
    }

    app.stage.addChild(g);
  }

  // === 에이전트 (노아 1명 우선, 나머지도 배치) ===
  const agents = useOfficeStore.getState().agents;
  const agentContainers = new Map<string, { c: PIXI.Container; avatar: PIXI.Sprite | null; name: PIXI.Text; status: PIXI.Text; glow: PIXI.Graphics; border: PIXI.Graphics }>();

  for (const agent of agents) {
    const { x, y } = agent.position;
    const color = parseInt(AGENT_COLORS[agent.id].replace('#',''), 16);

    const c = new PIXI.Container();
    c.x = x; c.y = y + 26;

    // 글로우
    const glow = new PIXI.Graphics();
    glow.beginFill(0x000000, 0.1);
    glow.drawEllipse(0, 4, 20, 7);
    glow.endFill();
    c.addChild(glow);

    // 캐릭터 이미지
    let avatar: PIXI.Sprite | null = null;
    try {
      const tex = PIXI.Texture.from(`/assets/chars/${agent.id}.png`);
      avatar = new PIXI.Sprite(tex);
      avatar.anchor.set(0.5); avatar.width = 54; avatar.height = 54; avatar.y = -6;
      const mask = new PIXI.Graphics();
      mask.beginFill(0xffffff); mask.drawCircle(0, -6, 27); mask.endFill();
      c.addChild(mask);
      avatar.mask = mask;
      c.addChild(avatar);
    } catch { /* 폴백 생략 */ }

    // 테두리
    const border = new PIXI.Graphics();
    border.lineStyle(1, 0x1e293b, 0.4);
    border.drawCircle(0, -6, 28);
    c.addChild(border);

    // 이름
    const nameText = new PIXI.Text(AGENT_NAMES[agent.id], new PIXI.TextStyle({ fontFamily:'system-ui', fontSize:8, fontWeight:'500', fill:0x475569 }));
    nameText.anchor.set(0.5, 0); nameText.y = 24;
    c.addChild(nameText);

    // 상태
    const statusText = new PIXI.Text('', new PIXI.TextStyle({ fontFamily:'system-ui', fontSize:8, fontWeight:'600', fill:color }));
    statusText.anchor.set(0.5, 0); statusText.y = 34; statusText.visible = false;
    c.addChild(statusText);

    app.stage.addChild(c);
    agentContainers.set(agent.id, { c, avatar, name: nameText, status: statusText, glow, border });
  }

  // === 문서 컨테이너 ===
  const docSprites = new Map<string, PIXI.Container>();
  const docLayer = new PIXI.Container();
  app.stage.addChild(docLayer);

  // === 애니메이션 루프 ===
  app.ticker.add(() => {
    const state = useOfficeStore.getState();
    const t = Date.now() / 1000;
    const activeId = state.agents.find(a => a.status === 'writing' || a.status === 'thinking' || a.status === 'reviewing')?.id || null;

    for (const agent of state.agents) {
      const s = agentContainers.get(agent.id);
      if (!s) continue;
      const isActive = agent.id === activeId;
      const isBlocked = agent.status === 'blocked';
      const color = parseInt(AGENT_COLORS[agent.id].replace('#',''), 16);

      s.c.alpha = isActive ? 1 : isBlocked ? 0.75 : 0.5;
      const bob = isActive ? Math.sin(t * 3) * 2.5 : Math.sin(t * 1.3 + agent.id.charCodeAt(0) * 0.6) * 1;
      if (s.avatar) s.avatar.y = -6 + bob;

      s.border.clear();
      s.border.lineStyle(isActive ? 2 : 1, isActive ? color : isBlocked ? 0xef4444 : 0x1e293b, isActive ? 0.7 : 0.4);
      s.border.drawCircle(0, -6 + bob, 28);

      s.glow.clear();
      if (isActive) { s.glow.beginFill(color, 0.12 + Math.sin(t*3)*0.05); s.glow.drawEllipse(0, 4, 28, 10); s.glow.endFill(); }
      else if (isBlocked) { s.glow.beginFill(0xef4444, Math.sin(t*5)>0?0.15:0.05); s.glow.drawEllipse(0, 4, 22, 8); s.glow.endFill(); }
      else { s.glow.beginFill(0x000000, 0.1); s.glow.drawEllipse(0, 4, 20, 7); s.glow.endFill(); }

      s.name.style.fill = isActive ? 0xcbd5e1 : 0x475569;
      const task = state.tasks.find(tk => tk.ownerAgentId === agent.id && tk.status === 'working');
      if (isActive && task) {
        const labels: Record<string,string> = { thinking:'분석 중', writing:'작업 중', reviewing:'검수 중' };
        s.status.text = labels[agent.status] || '';
        s.status.visible = true;
      } else if (isBlocked) {
        s.status.text = 'BLOCKED'; s.status.style.fill = 0xef4444; s.status.visible = true;
      } else {
        s.status.visible = false;
      }
    }

    // 문서
    for (const doc of state.documents) {
      let sprite = docSprites.get(doc.id);
      if (!sprite) {
        sprite = new PIXI.Container();
        const icon = new PIXI.Graphics();
        icon.beginFill(0x06b6d4, 0.8);
        icon.drawRect(-6, -8, 12, 16);
        icon.endFill();
        icon.beginFill(0xffffff, 0.2);
        icon.moveTo(2, -8); icon.lineTo(6, -8); icon.lineTo(6, -4); icon.closePath();
        icon.endFill();
        sprite.addChild(icon);

        const label = new PIXI.Text(doc.label.slice(0, 8), new PIXI.TextStyle({ fontFamily:'system-ui', fontSize:7, fill:0x06b6d4 }));
        label.anchor.set(0.5, 0); label.y = 12;
        sprite.addChild(label);

        docLayer.addChild(sprite);
        docSprites.set(doc.id, sprite);
      }

      const from = state.agents.find(a => a.id === doc.currentHolder);
      const to = doc.moveTarget ? state.agents.find(a => a.id === doc.moveTarget) : null;

      if (doc.isMoving && from && to) {
        const p = Math.min(((Date.now() % 800) / 800) * 1.3, 1);
        const arc = Math.sin(p * Math.PI) * 28;
        sprite.x = from.position.x + (to.position.x - from.position.x) * p;
        sprite.y = (from.position.y + 16) + ((to.position.y + 16) - (from.position.y + 16)) * p - arc;
        sprite.scale.set(1.5);
        sprite.alpha = 0.95;
      } else if (from) {
        sprite.x = from.position.x + 30;
        sprite.y = from.position.y + 14 + Math.sin(t + doc.id.charCodeAt(4)) * 1.5;
        sprite.scale.set(1);
        sprite.alpha = 0.65;
      }
    }
  });
}
