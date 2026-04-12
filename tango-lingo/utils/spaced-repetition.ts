import type { ReviewState } from '../types';

/**
 * Simple spaced repetition (SM-2 variant).
 *
 * 간격: 1일 → 3일 → 7일 → 14일 → 30일
 * 맞추면 다음 간격으로, 틀리면 1일로 리셋.
 */

const INTERVALS = [1, 3, 7, 14, 30];

const today = () => new Date().toISOString().split('T')[0];

export function createReviewState(): ReviewState {
  return {
    nextReview: today(),
    interval: 0,
    wrongCount: 0,
  };
}

/**
 * 정답 시: 다음 간격으로 이동
 */
export function markCorrect(state: ReviewState): ReviewState {
  const nextIndex = Math.min(
    INTERVALS.indexOf(state.interval) + 1,
    INTERVALS.length - 1
  );
  const nextInterval = INTERVALS[nextIndex >= 0 ? nextIndex : 0];

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + nextInterval);

  return {
    nextReview: nextDate.toISOString().split('T')[0],
    interval: nextInterval,
    wrongCount: state.wrongCount,
  };
}

/**
 * 오답 시: 1일로 리셋
 */
export function markWrong(state: ReviewState): ReviewState {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    nextReview: tomorrow.toISOString().split('T')[0],
    interval: 1,
    wrongCount: state.wrongCount + 1,
  };
}

/**
 * 오늘 복습해야 할 문장 ID 목록 반환
 */
export function getDueReviews(reviews: Record<string, ReviewState>): string[] {
  const todayStr = today();
  return Object.entries(reviews)
    .filter(([_, state]) => state.nextReview <= todayStr)
    .map(([id]) => id);
}

/**
 * 내일 복습 예정 문장 수
 */
export function getTomorrowCount(reviews: Record<string, ReviewState>): number {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return Object.values(reviews).filter(
    (state) => state.nextReview === tomorrowStr
  ).length;
}
