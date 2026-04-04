import type { Position } from './types';

// ── 씬 크기 ──────────────────────────────────────
export const SCENE_WIDTH = 1920;
export const SCENE_HEIGHT = 1080;

// ── 아이소메트릭 타일 ──────────────────────────────
export const TILE_WIDTH = 128;
export const TILE_HEIGHT = 64;

// 타일 좌표 → 화면 좌표 (중앙 정렬, 수직으로 더 내림)
export function tileToScreen(tx: number, ty: number): Position {
  return {
    x: (tx - ty) * (TILE_WIDTH / 2) + SCENE_WIDTH / 2,
    y: (tx + ty) * (TILE_HEIGHT / 2) + 140,
  };
}

// 화면 좌표 → 타일 좌표
export function screenToTile(sx: number, sy: number): Position {
  const cx = sx - SCENE_WIDTH / 2;
  const cy = sy - 80;
  return {
    x: Math.round((cx / (TILE_WIDTH / 2) + cy / (TILE_HEIGHT / 2)) / 2),
    y: Math.round((cy / (TILE_HEIGHT / 2) - cx / (TILE_WIDTH / 2)) / 2),
  };
}

// ── 에이전트 홈 좌표 (타일 기준) ──────────────────
export const AGENT_HOME: Record<string, Position> = {
  arko: { x: 1, y: 1 },   // 로비 (총괄)
  noah: { x: 3, y: 1 },   // 작업 공간 상단 좌
  eden: { x: 5, y: 1 },   // 작업 공간 상단 중
  ria:  { x: 7, y: 1 },   // 작업 공간 상단 우
  mika: { x: 4, y: 4 },   // 작업 공간 하단 좌
  luka: { x: 6, y: 4 },   // 작업 공간 하단 우
};

// ── 영역 좌표 ──────────────────────────────────
export const ZONES = {
  lobby: { x: 0, y: 0 },
  meeting: { x: 10, y: 3 },
  review: { x: 6, y: 8 },
};

// ── 스텝별 기본 예상 시간 (ms) ──────────────────
export const DEFAULT_STEP_DURATION_MS: Record<string, number> = {
  orchestrate:  8_000,
  noah:        12_000,
  eden:        10_000,
  ria:         15_000,
  'arko-review': 8_000,
  mika:        30_000,
  luka:         5_000,
};

export const TOTAL_PIPELINE_MS = Object.values(DEFAULT_STEP_DURATION_MS)
  .reduce((a, b) => a + b, 0);

// ── 파이프라인 스텝 → 에이전트 매핑 ──────────────
export const STEP_TO_AGENT: Record<string, string> = {
  orchestrate:  'arko',
  noah:         'noah',
  eden:         'eden',
  ria:          'ria',
  'arko-review': 'arko',
  mika:         'mika',
  luka:         'luka',
};

// ── 스텝 → 문서 타입 매핑 ──────────────────────
export const STEP_TO_DOC_TYPE: Record<string, string> = {
  orchestrate: 'brief',
  noah:        'analysis',
  eden:        'plan',
  ria:         'draft',
  'arko-review': 'review_result',
  mika:        'media',
  luka:        'record',
};

// ── 파이프라인 스텝 순서 ──────────────────────────
export const PIPELINE_STEPS = ['noah', 'eden', 'ria', 'arko-review', 'mika', 'luka'];

// ── 다음 스텝 에이전트 ──────────────────────────
export function getNextAgent(currentStep: string): string | null {
  const idx = PIPELINE_STEPS.indexOf(currentStep);
  if (idx < 0 || idx >= PIPELINE_STEPS.length - 1) return null;
  return STEP_TO_AGENT[PIPELINE_STEPS[idx + 1]];
}

// ── 에이전트 컬러 매핑 ──────────────────────────
export const AGENT_COLORS: Record<string, string> = {
  arko: '#06b6d4',
  noah: '#f59e0b',
  eden: '#10b981',
  ria:  '#f43f5e',
  mika: '#8b5cf6',
  luka: '#3b82f6',
};

export const AGENT_NAMES: Record<string, string> = {
  arko: '아르코', noah: '노아', eden: '이든',
  ria: '리아', mika: '미카', luka: '루카',
};

export const AGENT_ROLES: Record<string, string> = {
  arko: '총괄', noah: '분석', eden: '기획',
  ria: '집필', mika: '미디어', luka: '기록',
};
