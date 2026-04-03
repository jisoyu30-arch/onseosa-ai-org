import * as PIXI from 'pixi.js';
import { TILE_WIDTH, TILE_HEIGHT, tileToScreen } from '../state/spatialConfig';

// 사무실 타일맵 (0=빈, 1=작업공간, 2=로비, 3=회의실, 4=검수존)
const OFFICE_MAP = [
  [2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3],
  [2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0],
  [0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0],
];

const ZONE_COLORS: Record<number, number> = {
  0: 0x0a0f1a,  // 빈 공간 (어두운 배경)
  1: 0x151c2c,  // 작업 공간 (약간 밝은 네이비)
  2: 0x1a2235,  // 로비 (살짝 다른 톤)
  3: 0x17202e,  // 회의실
  4: 0x1c1525,  // 검수존 (보라 틴트)
};

const ZONE_BORDER: Record<number, number> = {
  0: 0x1e2433,
  1: 0x2a3548,
  2: 0x2a3548,
  3: 0x2d3a50,
  4: 0x352a40,
};

export function createTilemap(container: PIXI.Container) {
  for (let row = 0; row < OFFICE_MAP.length; row++) {
    for (let col = 0; col < OFFICE_MAP[row].length; col++) {
      const tileType = OFFICE_MAP[row][col];
      const { x, y } = tileToScreen(col, row);

      // 아이소메트릭 다이아몬드 타일
      const tile = new PIXI.Graphics();
      tile.poly([
        { x: 0, y: -TILE_HEIGHT / 2 },
        { x: TILE_WIDTH / 2, y: 0 },
        { x: 0, y: TILE_HEIGHT / 2 },
        { x: -TILE_WIDTH / 2, y: 0 },
      ]);
      tile.fill(ZONE_COLORS[tileType]);
      tile.stroke({ width: 0.5, color: ZONE_BORDER[tileType], alpha: 0.4 });

      tile.x = x;
      tile.y = y;
      container.addChild(tile);
    }
  }
}

// 영역 라벨 텍스트
export function createZoneLabels(container: PIXI.Container) {
  const labels = [
    { text: '로비', pos: tileToScreen(1, 0), color: 0x4a5568 },
    { text: '작업 공간', pos: tileToScreen(5, 3), color: 0x4a5568 },
    { text: '회의실', pos: tileToScreen(10.5, 2), color: 0x4a5568 },
    { text: '검수/승인', pos: tileToScreen(5.5, 7.5), color: 0x6b4a80 },
  ];

  for (const label of labels) {
    const text = new PIXI.Text({
      text: label.text,
      style: {
        fontFamily: 'Malgun Gothic, sans-serif',
        fontSize: 10,
        fill: label.color,
        fontWeight: '600',
        letterSpacing: 2,
      },
    });
    text.anchor.set(0.5);
    text.x = label.pos.x;
    text.y = label.pos.y - 5;
    container.addChild(text);
  }
}
