import { tileToScreen } from '../state/spatialConfig';
import type { Position } from '../state/types';

// Tiled JSON 타입
interface TiledObject {
  id: number;
  name: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  properties?: Array<{ name: string; type: string; value: string | number }>;
}

interface TiledLayer {
  name: string;
  type: string;
  objects?: TiledObject[];
}

interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
}

// 파싱된 오피스 맵 데이터
export interface OfficeZone {
  name: string;
  label: string;
  tileX: number;
  tileY: number;
  width: number;
  height: number;
  screenCenter: Position;
}

export interface OfficeDesk {
  name: string;
  agentId: string;
  label: string;
  tilePos: Position;
  screenPos: Position;
}

export interface OfficeFurniture {
  name: string;
  shape: string;
  tilePos: Position;
  screenPos: Position;
  rx?: number;
  ry?: number;
  width?: number;
  height?: number;
}

export interface HandoffAnchor {
  name: string;
  from: string;
  to: string;
  screenPos: Position;
}

export interface OfficeMapData {
  zones: OfficeZone[];
  desks: OfficeDesk[];
  furniture: OfficeFurniture[];
  anchors: HandoffAnchor[];
}

function getProp(obj: TiledObject, name: string): string | number | undefined {
  return obj.properties?.find(p => p.name === name)?.value;
}

export async function loadOfficeMap(url: string): Promise<OfficeMapData> {
  const res = await fetch(url);
  const map: TiledMap = await res.json();

  const zones: OfficeZone[] = [];
  const desks: OfficeDesk[] = [];
  const furniture: OfficeFurniture[] = [];
  const anchors: HandoffAnchor[] = [];

  for (const layer of map.layers) {
    if (layer.type !== 'objectgroup' || !layer.objects) continue;

    for (const obj of layer.objects) {
      if (obj.type === 'zone') {
        const cx = obj.x + (obj.width || 0) / 2;
        const cy = obj.y + (obj.height || 0) / 2;
        zones.push({
          name: obj.name,
          label: String(getProp(obj, 'label') || obj.name),
          tileX: obj.x,
          tileY: obj.y,
          width: obj.width || 0,
          height: obj.height || 0,
          screenCenter: tileToScreen(cx, cy),
        });
      }

      if (obj.type === 'desk') {
        desks.push({
          name: obj.name,
          agentId: String(getProp(obj, 'agentId') || ''),
          label: String(getProp(obj, 'label') || ''),
          tilePos: { x: obj.x, y: obj.y },
          screenPos: tileToScreen(obj.x, obj.y),
        });
      }

      if (obj.type === 'furniture') {
        furniture.push({
          name: obj.name,
          shape: String(getProp(obj, 'shape') || 'rect'),
          tilePos: { x: obj.x, y: obj.y },
          screenPos: tileToScreen(obj.x, obj.y),
          rx: Number(getProp(obj, 'rx') || 0),
          ry: Number(getProp(obj, 'ry') || 0),
          width: Number(getProp(obj, 'width') || 0),
          height: Number(getProp(obj, 'height') || 0),
        });
      }

      if (obj.type === 'handoff_anchor') {
        anchors.push({
          name: obj.name,
          from: String(getProp(obj, 'from') || ''),
          to: String(getProp(obj, 'to') || ''),
          screenPos: tileToScreen(obj.x, obj.y),
        });
      }
    }
  }

  return { zones, desks, furniture, anchors };
}
