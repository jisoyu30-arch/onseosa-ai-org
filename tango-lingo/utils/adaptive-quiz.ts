import type { Quiz, QuizType } from '../types';

// 퀴즈 난이도 순위 (낮을수록 쉬움)
const DIFFICULTY_RANK: Record<QuizType, number> = {
  multiple_choice: 1,    // 가장 쉬움
  meaning_match: 2,
  fill_blank: 3,
  word_order: 4,
  reverse_translate: 5,  // 가장 어려움
  listening: 5,          // 가장 어려움 (동급)
};

/**
 * 적응형 퀴즈 순서를 반환한다.
 * - correctStreak >= 3: 어려운 유형부터 (reverse_translate, word_order...)
 * - wrongStreak >= 2: 쉬운 유형부터 (multiple_choice, meaning_match...)
 * - 그 외: 원래 순서 유지
 */
export function getAdaptiveQuizOrder(
  quizzes: Quiz[],
  correctStreak: number,
  wrongStreak: number,
): Quiz[] {
  // 스트릭 기준 미달이면 원래 순서
  if (correctStreak < 3 && wrongStreak < 2) {
    return quizzes;
  }

  const sorted = [...quizzes];

  if (correctStreak >= 3) {
    // 잘하는 중 → 어려운 것부터
    sorted.sort((a, b) => DIFFICULTY_RANK[b.type] - DIFFICULTY_RANK[a.type]);
  } else if (wrongStreak >= 2) {
    // 힘들어하는 중 → 쉬운 것부터
    sorted.sort((a, b) => DIFFICULTY_RANK[a.type] - DIFFICULTY_RANK[b.type]);
  }

  return sorted;
}
