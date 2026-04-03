import * as PIXI from 'pixi.js';
import type { AgentEntity } from '../state/types';
import { AGENT_COLORS } from '../state/spatialConfig';

const AGENT_SPRITES = new Map<string, PIXI.Container>();
const AGENT_IMAGES = new Map<string, PIXI.Sprite>();

// 에이전트 표정 → 이미지 파일 서픽스
function getImageSuffix(expression: AgentEntity['expression']): string {
  switch (expression) {
    case 'focused':
    case 'stressed':
    case 'reviewing':
      return '-working';
    case 'celebrating':
      return '-done';
    default:
      return '';
  }
}

export function createAgentSprite(agent: AgentEntity, container: PIXI.Container): PIXI.Container {
  const wrapper = new PIXI.Container();

  // 바닥 글로우 (상태별 변경)
  const glow = new PIXI.Graphics();
  glow.label = 'glow';
  glow.ellipse(0, 20, 24, 8);
  glow.fill({ color: 0x000000, alpha: 0.3 });
  wrapper.addChild(glow);

  // 캐릭터 이미지
  const sprite = PIXI.Sprite.from(`/assets/chars/${agent.id}.png`);
  sprite.anchor.set(0.5, 0.8);
  sprite.width = 60;
  sprite.height = 60;
  sprite.label = 'avatar';
  wrapper.addChild(sprite);

  AGENT_IMAGES.set(agent.id, sprite);

  wrapper.x = agent.position.x;
  wrapper.y = agent.position.y;
  wrapper.label = `agent_${agent.id}`;

  container.addChild(wrapper);
  AGENT_SPRITES.set(agent.id, wrapper);

  return wrapper;
}

// 에이전트 상태 업데이트 (매 프레임 호출)
export function updateAgentSprite(agent: AgentEntity, deltaTime: number) {
  const wrapper = AGENT_SPRITES.get(agent.id);
  if (!wrapper) return;

  const sprite = AGENT_IMAGES.get(agent.id);
  const glow = wrapper.getChildByLabel('glow') as PIXI.Graphics | null;
  const color = parseInt(AGENT_COLORS[agent.id].replace('#', ''), 16);

  // 위치 이동 (lerp)
  const targetX = agent.targetPosition?.x ?? agent.position.x;
  const targetY = agent.targetPosition?.y ?? agent.position.y;
  const speed = 0.05 * deltaTime;
  wrapper.x += (targetX - wrapper.x) * speed;
  wrapper.y += (targetY - wrapper.y) * speed;

  // 표정별 이미지 교체
  if (sprite) {
    const suffix = getImageSuffix(agent.expression);
    const expectedSrc = `/assets/chars/${agent.id}${suffix}.png`;
    if (!sprite.texture.label?.includes(agent.id + suffix)) {
      sprite.texture = PIXI.Texture.from(expectedSrc);
    }
  }

  // 상태별 글로우 효과
  if (glow) {
    glow.clear();
    glow.ellipse(0, 20, 24, 8);

    switch (agent.status) {
      case 'writing':
      case 'thinking':
        glow.fill({ color, alpha: 0.3 + Math.sin(Date.now() / 500) * 0.15 });
        break;
      case 'reviewing':
        glow.fill({ color: 0x06b6d4, alpha: 0.3 + Math.sin(Date.now() / 400) * 0.1 });
        break;
      case 'blocked':
        glow.fill({ color: 0xef4444, alpha: 0.4 + Math.sin(Date.now() / 300) * 0.2 });
        break;
      case 'done':
        glow.fill({ color: 0x22c55e, alpha: 0.4 });
        break;
      case 'waiting':
        glow.fill({ color: 0xf59e0b, alpha: 0.15 });
        break;
      default:
        glow.fill({ color: 0x000000, alpha: 0.2 });
    }
  }

  // idle bobbing 애니메이션
  if (sprite && (agent.status === 'idle' || agent.status === 'waiting')) {
    sprite.y = Math.sin(Date.now() / 800 + agent.id.charCodeAt(0)) * 3;
  } else if (sprite && (agent.status === 'writing' || agent.status === 'thinking')) {
    sprite.y = Math.sin(Date.now() / 300) * 2;
  } else if (sprite) {
    sprite.y = 0;
  }
}

export function removeAllAgents() {
  AGENT_SPRITES.clear();
  AGENT_IMAGES.clear();
}
