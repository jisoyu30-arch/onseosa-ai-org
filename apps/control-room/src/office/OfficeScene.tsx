import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { useOfficeStore } from './state/officeStore';
import { loadOfficeMap } from './scene/mapLoader';
import { AGENT_COLORS, AGENT_NAMES } from './state/spatialConfig';
import { setAnchors, getWaypoints } from './state/anchorRegistry';

// Singleton — React strict mode에서 2번 실행 방지
let pixiApp: PIXI.Application | null = null;
let pixiInitialized = false;

export function OfficeScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('loading...');

  useEffect(() => {
    if (!ref.current || pixiInitialized) return;
    pixiInitialized = true;

    (async () => {
      try {
        const app = new PIXI.Application();
        await (app as any).init({ width: 1600, height: 900, backgroundColor: 0x040608 });
        pixiApp = app;

        const canvas = (app as any).canvas as HTMLCanvasElement;
        if (!canvas) { setStatus('ERROR: no canvas'); return; }
        ref.current?.appendChild(canvas);
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.objectFit = 'contain';

        // Tiled JSON 로드
        const map = await loadOfficeMap('/maps/office.json');

        // anchor 등록 (handoff waypoint용)
        setAnchors(map.anchors.map(a => ({ from: a.from, to: a.to, pos: a.screenPos })));

        // desk 좌표로 에이전트 위치 업데이트
        const store = useOfficeStore.getState();
        const updatedAgents = store.agents.map(a => {
          const desk = map.desks.find(d => d.agentId === a.id);
          if (desk) {
            return { ...a, position: { ...desk.screenPos }, homePosition: { ...desk.screenPos } };
          }
          return a;
        });
        useOfficeStore.setState({ agents: updatedAgents });

        // 존 라벨
        for (const zone of map.zones) {
          const text = new PIXI.Text({ text: zone.label, style: { fontFamily: 'system-ui', fontSize: 11, fontWeight: '600', fill: 0x334155 } });
          text.anchor.set(0.5);
          text.x = zone.screenCenter.x;
          text.y = zone.screenCenter.y - 20;
          text.alpha = 0.5;
          app.stage.addChild(text);
        }

        // Handoff anchor 마커
        for (const anchor of map.anchors) {
          const g = new PIXI.Graphics();
          g.circle(anchor.screenPos.x, anchor.screenPos.y, 5);
          g.fill({ color: 0x06b6d4, alpha: 0.12 });
          app.stage.addChild(g);

          const label = new PIXI.Text({ text: `${anchor.from}→${anchor.to}`, style: { fontFamily: 'system-ui', fontSize: 7, fill: 0x06b6d4 } });
          label.anchor.set(0.5);
          label.x = anchor.screenPos.x;
          label.y = anchor.screenPos.y + 10;
          label.alpha = 0.25;
          app.stage.addChild(label);
        }

        // Desk 마커
        for (const desk of map.desks) {
          const color = parseInt((AGENT_COLORS[desk.agentId] || '#ffffff').replace('#', ''), 16);
          const g = new PIXI.Graphics();
          g.circle(desk.screenPos.x, desk.screenPos.y, 28);
          g.fill({ color, alpha: 0.06 });
          g.circle(desk.screenPos.x, desk.screenPos.y, 28);
          g.stroke({ color, alpha: 0.15, width: 0.5 });
          app.stage.addChild(g);

          const label = new PIXI.Text({ text: desk.label, style: { fontFamily: 'system-ui', fontSize: 8, fontWeight: '500', fill: color } });
          label.anchor.set(0.5);
          label.x = desk.screenPos.x;
          label.y = desk.screenPos.y + 34;
          label.alpha = 0.4;
          app.stage.addChild(label);
        }

        // 에이전트 스프라이트
        const agentMap = new Map<string, { c: PIXI.Container; sprite: PIXI.Sprite | null; nameText: PIXI.Text; statusText: PIXI.Text }>();

        for (const agent of useOfficeStore.getState().agents) {
          const c = new PIXI.Container();
          c.x = agent.position.x;
          c.y = agent.position.y;

          let sprite: PIXI.Sprite | null = null;
          try {
            const tex = PIXI.Texture.from(`/assets/chars/${agent.id}.png`);
            sprite = new PIXI.Sprite(tex);
            sprite.anchor.set(0.5);
            sprite.width = 50; sprite.height = 50;

            const mask = new PIXI.Graphics();
            mask.circle(0, 0, 25);
            mask.fill(0xffffff);
            c.addChild(mask);
            sprite.mask = mask;
            c.addChild(sprite);
          } catch { /* */ }

          const border = new PIXI.Graphics();
          border.circle(0, 0, 26);
          border.stroke({ color: 0x1e293b, alpha: 0.4, width: 1 });
          c.addChild(border);

          const nameText = new PIXI.Text({ text: AGENT_NAMES[agent.id], style: { fontFamily: 'system-ui', fontSize: 9, fontWeight: '500', fill: 0x64748b } });
          nameText.anchor.set(0.5, 0);
          nameText.y = 30;
          c.addChild(nameText);

          const statusText = new PIXI.Text({ text: '', style: { fontFamily: 'system-ui', fontSize: 8, fontWeight: '600', fill: parseInt((AGENT_COLORS[agent.id] || '#06b6d4').replace('#',''),16) } });
          statusText.anchor.set(0.5, 0);
          statusText.y = 42;
          statusText.visible = false;
          c.addChild(statusText);

          app.stage.addChild(c);
          agentMap.set(agent.id, { c, sprite, nameText, statusText });
        }

        // 문서 레이어
        const docSprites = new Map<string, PIXI.Container>();
        const docLayer = new PIXI.Container();
        app.stage.addChild(docLayer);

        // 틱 루프
        app.ticker.add(() => {
          const state = useOfficeStore.getState();
          const t = Date.now() / 1000;
          const activeId = state.agents.find(a => a.status === 'writing' || a.status === 'thinking' || a.status === 'reviewing')?.id || null;

          for (const agent of state.agents) {
            const ac = agentMap.get(agent.id);
            if (!ac) continue;
            ac.c.alpha = agent.id === activeId ? 1 : agent.status === 'blocked' ? 0.75 : 0.5;
            ac.c.x = agent.position.x;
            ac.c.y = agent.position.y;
            if (ac.sprite) ac.sprite.y = agent.id === activeId ? Math.sin(t * 3) * 2.5 : Math.sin(t * 1.3 + agent.id.charCodeAt(0) * 0.6) * 1;
            ac.nameText.style.fill = agent.id === activeId ? 0xcbd5e1 : 0x64748b;

            const task = state.tasks.find(tk => tk.ownerAgentId === agent.id && tk.status === 'working');
            if (agent.id === activeId && task) {
              const labels: Record<string,string> = { thinking:'분석 중', writing:'작업 중', reviewing:'검수 중' };
              ac.statusText.text = labels[agent.status] || '';
              ac.statusText.visible = true;
            } else if (agent.status === 'blocked') {
              ac.statusText.text = 'BLOCKED';
              ac.statusText.style.fill = 0xef4444;
              ac.statusText.visible = true;
            } else {
              ac.statusText.visible = false;
            }
          }

          // 문서
          for (const doc of state.documents) {
            let sprite = docSprites.get(doc.id);
            if (!sprite) {
              sprite = new PIXI.Container();
              const icon = new PIXI.Graphics();
              icon.rect(-6, -8, 12, 16);
              icon.fill({ color: 0x06b6d4, alpha: 0.8 });
              sprite.addChild(icon);
              docLayer.addChild(sprite);
              docSprites.set(doc.id, sprite);
            }
            const from = state.agents.find(a => a.id === doc.currentHolder);
            const to = doc.moveTarget ? state.agents.find(a => a.id === doc.moveTarget) : null;
            if (doc.isMoving && from && to) {
              // waypoint 경유 이동: from → [anchors] → to
              const waypoints = getWaypoints(from.id, to.id);
              const path = [from.position, ...waypoints, to.position];
              const totalSegments = path.length - 1;
              const totalTime = 800 * Math.max(totalSegments, 1);
              const elapsed = Date.now() % totalTime;
              const globalP = Math.min(elapsed / totalTime * 1.2, 1);

              // 현재 세그먼트 계산
              const segFloat = globalP * totalSegments;
              const segIdx = Math.min(Math.floor(segFloat), totalSegments - 1);
              const segP = segFloat - segIdx;
              const segFrom = path[segIdx];
              const segTo = path[segIdx + 1];

              const arc = Math.sin(segP * Math.PI) * 20;
              sprite.x = segFrom.x + (segTo.x - segFrom.x) * segP;
              sprite.y = segFrom.y + (segTo.y - segFrom.y) * segP - arc;
              sprite.scale.set(1.5); sprite.alpha = 0.95;
            } else if (from) {
              sprite.x = from.position.x + 30;
              sprite.y = from.position.y - 10 + Math.sin(t) * 1.5;
              sprite.scale.set(1); sprite.alpha = 0.6;
            }
          }
        });

        setStatus(`map: ${map.desks.length} desks, ${map.zones.length} zones, ${map.anchors.length} anchors`);
      } catch (err: any) {
        setStatus(`ERROR: ${err.message}`);
        console.error('[OfficeScene]', err);
      }
    })();

    return () => {
      if (pixiApp) { pixiApp.destroy(true); pixiApp = null; pixiInitialized = false; }
    };
  }, []);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {status && <div style={{ position:'absolute', bottom:8, left:8, color:'#475569', fontSize:10, fontFamily:'system-ui', zIndex:10 }}>{status}</div>}
    </div>
  );
}
