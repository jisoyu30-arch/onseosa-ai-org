import * as PIXI from 'pixi.js';
import { tileToScreen, AGENT_HOME, ZONES } from '../state/spatialConfig';

// 심플한 아이소메트릭 책상 (직사각형 + 그림자)
function createDesk(x: number, y: number, accentColor: number): PIXI.Container {
  const desk = new PIXI.Container();

  // 그림자
  const shadow = new PIXI.Graphics();
  shadow.ellipse(0, 4, 28, 10);
  shadow.fill({ color: 0x000000, alpha: 0.3 });
  desk.addChild(shadow);

  // 책상 상판 (아이소메트릭)
  const top = new PIXI.Graphics();
  top.poly([
    { x: 0, y: -8 },
    { x: 24, y: 0 },
    { x: 0, y: 8 },
    { x: -24, y: 0 },
  ]);
  top.fill(0x2d3548);
  top.stroke({ width: 1, color: 0x3d4558, alpha: 0.6 });
  desk.addChild(top);

  // 모니터 (작은 직사각형)
  const monitor = new PIXI.Graphics();
  monitor.rect(-8, -18, 16, 10);
  monitor.fill(0x0d1117);
  monitor.stroke({ width: 1, color: accentColor, alpha: 0.4 });
  desk.addChild(monitor);

  // 모니터 스크린 글로우
  const glow = new PIXI.Graphics();
  glow.rect(-6, -16, 12, 6);
  glow.fill({ color: accentColor, alpha: 0.15 });
  desk.addChild(glow);

  desk.x = x;
  desk.y = y;
  return desk;
}

// 회의 테이블 (타원)
function createMeetingTable(x: number, y: number): PIXI.Container {
  const table = new PIXI.Container();

  const shadow = new PIXI.Graphics();
  shadow.ellipse(0, 4, 50, 20);
  shadow.fill({ color: 0x000000, alpha: 0.25 });
  table.addChild(shadow);

  const surface = new PIXI.Graphics();
  surface.ellipse(0, 0, 48, 18);
  surface.fill(0x252d3d);
  surface.stroke({ width: 1.5, color: 0x2d3548 });
  table.addChild(surface);

  table.x = x;
  table.y = y;
  return table;
}

// 검수대 (직사각형 컨베이어 벨트 느낌)
function createReviewDesk(x: number, y: number): PIXI.Container {
  const review = new PIXI.Container();

  // 베이스
  const base = new PIXI.Graphics();
  base.poly([
    { x: -60, y: -6 },
    { x: 60, y: -6 },
    { x: 60, y: 6 },
    { x: -60, y: 6 },
  ]);
  base.fill(0x1c1525);
  base.stroke({ width: 1, color: 0x352a40, alpha: 0.6 });
  review.addChild(base);

  // 진행 화살표 3개
  for (let i = -1; i <= 1; i++) {
    const arrow = new PIXI.Graphics();
    arrow.poly([
      { x: i * 35 - 5, y: 0 },
      { x: i * 35 + 5, y: -3 },
      { x: i * 35 + 5, y: 3 },
    ]);
    arrow.fill({ color: 0x06b6d4, alpha: 0.3 });
    review.addChild(arrow);
  }

  review.x = x;
  review.y = y;
  return review;
}

const AGENT_DESK_COLORS: Record<string, number> = {
  arko: 0x06b6d4,
  noah: 0xf59e0b,
  eden: 0x10b981,
  ria:  0xf43f5e,
  mika: 0x8b5cf6,
  luka: 0x3b82f6,
};

export function createFurniture(container: PIXI.Container) {
  // 에이전트 책상
  for (const [agentId, home] of Object.entries(AGENT_HOME)) {
    const { x, y } = tileToScreen(home.x, home.y);
    const color = AGENT_DESK_COLORS[agentId] || 0x3b82f6;
    container.addChild(createDesk(x, y + 20, color));
  }

  // 회의 테이블
  const meetingPos = tileToScreen(ZONES.meeting.x, ZONES.meeting.y);
  container.addChild(createMeetingTable(meetingPos.x, meetingPos.y + 10));

  // 검수대
  const reviewPos = tileToScreen(ZONES.review.x, ZONES.review.y);
  container.addChild(createReviewDesk(reviewPos.x, reviewPos.y + 10));
}
