// 자동 레벨 산정 — 학습량 + 테스트 결과 기반
// 사용자가 직접 선택하던 "현재 레벨"을 시스템이 측정

import type { CefrLevel } from '../stores/useGoalStore';

export interface LevelInputs {
  completedDialogues: number;     // 학습 완료한 대화 수
  testCorrect?: number;           // 레벨 테스트 정답 수
  testWrong?: number;             // 레벨 테스트 오답 수
  alphabetHeard?: number;         // 알파벳 발음 경험 수
}

export interface LevelEstimate {
  current: CefrLevel;
  score: number;              // 종합 점수
  nextThreshold: number;      // 다음 레벨까지 필요 점수
  pctToNext: number;          // 다음 레벨까지 진행률 (0~100)
  breakdown: {
    fromDialogues: number;
    fromTests: number;
    fromAlphabet: number;
  };
}

// 레벨 컷오프 (종합 점수)
const LEVEL_THRESHOLDS: { level: CefrLevel; min: number }[] = [
  { level: 'A1', min: 0 },
  { level: 'A2', min: 20 },
  { level: 'B1', min: 50 },
  { level: 'B2', min: 100 },
  { level: 'C1', min: 200 },
];

/**
 * 종합 점수 산정 공식:
 *   대화 학습 1개 = +1
 *   테스트 정답 1개 = +5
 *   테스트 오답 1개 = -2
 *   알파벳 발음 경험 1개 = +0.3
 */
export function estimateLevel(inputs: LevelInputs): LevelEstimate {
  const fromDialogues = inputs.completedDialogues;
  const fromTests = (inputs.testCorrect ?? 0) * 5 - (inputs.testWrong ?? 0) * 2;
  const fromAlphabet = (inputs.alphabetHeard ?? 0) * 0.3;
  const score = Math.max(0, fromDialogues + fromTests + fromAlphabet);

  // 현재 레벨 결정 (점수가 속한 가장 높은 임계값)
  let current: CefrLevel = 'A1';
  for (const t of LEVEL_THRESHOLDS) {
    if (score >= t.min) current = t.level;
  }

  // 다음 레벨 임계값
  const currIdx = LEVEL_THRESHOLDS.findIndex((t) => t.level === current);
  const nextThreshold = currIdx < LEVEL_THRESHOLDS.length - 1
    ? LEVEL_THRESHOLDS[currIdx + 1].min
    : score;
  const currMin = LEVEL_THRESHOLDS[currIdx].min;
  const pctToNext = nextThreshold > currMin
    ? Math.min(100, Math.round(((score - currMin) / (nextThreshold - currMin)) * 100))
    : 100;

  return {
    current,
    score: Math.round(score * 10) / 10,
    nextThreshold,
    pctToNext,
    breakdown: {
      fromDialogues: Math.round(fromDialogues * 10) / 10,
      fromTests: Math.round(fromTests * 10) / 10,
      fromAlphabet: Math.round(fromAlphabet * 10) / 10,
    },
  };
}

export const LEVEL_CRITERIA_KO: Record<CefrLevel, string> = {
  A1: '기초 인사·자기소개 가능',
  A2: '간단한 일상 대화 가능',
  B1: '자연스러운 회화·의견 표현',
  B2: '복잡한 주제·뉘앙스 표현',
  C1: '거의 원어민 수준',
};
