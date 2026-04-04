import type { Position } from './types';

// Tiled anchors를 전역으로 저장 — handoff waypoint로 사용
interface Anchor {
  from: string;
  to: string;
  pos: Position;
}

let anchors: Anchor[] = [];

export function setAnchors(a: Anchor[]) { anchors = a; }
export function getAnchors() { return anchors; }

/**
 * from→to 경로에 해당하는 anchor waypoint를 찾아 반환.
 * 없으면 빈 배열 (직선 이동).
 */
export function getWaypoints(from: string, to: string): Position[] {
  return anchors
    .filter(a => a.from === from && a.to === to)
    .map(a => a.pos);
}
