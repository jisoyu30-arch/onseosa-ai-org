import * as PIXI from 'pixi.js';
import type { DocumentEntity } from '../state/types';

const DOC_SPRITES = new Map<string, PIXI.Container>();

const DOC_COLORS: Record<string, number> = {
  brief: 0x06b6d4,
  analysis: 0xf59e0b,
  plan: 0x10b981,
  draft: 0xf43f5e,
  review_result: 0x06b6d4,
  media: 0x8b5cf6,
  record: 0x3b82f6,
};

export function createDocumentSprite(doc: DocumentEntity, container: PIXI.Container): PIXI.Container {
  const wrapper = new PIXI.Container();
  const color = DOC_COLORS[doc.type] || 0xffffff;

  // 문서 아이콘 (작은 직사각형)
  const icon = new PIXI.Graphics();
  icon.roundRect(-8, -10, 16, 20, 2);
  icon.fill({ color, alpha: 0.8 });
  icon.stroke({ width: 1, color: 0xffffff, alpha: 0.3 });
  icon.label = 'icon';
  wrapper.addChild(icon);

  // 접힌 모서리
  const fold = new PIXI.Graphics();
  fold.poly([
    { x: 4, y: -10 },
    { x: 8, y: -10 },
    { x: 8, y: -6 },
  ]);
  fold.fill({ color: 0xffffff, alpha: 0.2 });
  wrapper.addChild(fold);

  wrapper.x = doc.position.x;
  wrapper.y = doc.position.y - 30; // 에이전트 위에 표시
  wrapper.label = `doc_${doc.id}`;
  wrapper.scale.set(0.8);

  container.addChild(wrapper);
  DOC_SPRITES.set(doc.id, wrapper);

  return wrapper;
}

// 문서 위치 업데이트 + 이동 애니메이션
export function updateDocumentSprite(doc: DocumentEntity, targetPos: { x: number; y: number }, deltaTime: number) {
  const wrapper = DOC_SPRITES.get(doc.id);
  if (!wrapper) return;

  const targetX = targetPos.x;
  const targetY = targetPos.y - 30;

  if (doc.isMoving) {
    // 이동 중 — 빠르게 lerp + 위아래 펄스
    const speed = 0.08 * deltaTime;
    wrapper.x += (targetX - wrapper.x) * speed;
    wrapper.y += (targetY - wrapper.y) * speed + Math.sin(Date.now() / 200) * 0.5;
    wrapper.alpha = 0.7 + Math.sin(Date.now() / 300) * 0.3;
  } else {
    // 정지 — 에이전트 위에 살짝 떠있기
    wrapper.x = targetX;
    wrapper.y = targetY + Math.sin(Date.now() / 1000 + doc.id.charCodeAt(4)) * 2;
    wrapper.alpha = 1;
  }

  // 반려된 문서 — 빨간 테두리
  const icon = wrapper.getChildByLabel('icon') as PIXI.Graphics | null;
  if (icon && doc.status === 'rejected') {
    icon.tint = 0xff4444;
  } else if (icon && doc.reviewOutcome === 'soft_pass') {
    icon.tint = 0xffaa00;
  }
}

export function removeDocumentSprite(docId: string, container: PIXI.Container) {
  const wrapper = DOC_SPRITES.get(docId);
  if (wrapper) {
    container.removeChild(wrapper);
    DOC_SPRITES.delete(docId);
  }
}

export function removeAllDocuments() {
  DOC_SPRITES.clear();
}
