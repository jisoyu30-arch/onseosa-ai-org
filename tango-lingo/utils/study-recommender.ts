import type { ReviewState } from '../types';

export interface StudyRecommendation {
  urgentCount: number;      // 오늘 안 하면 잊어버릴 문장
  optimalTime: string;      // "지금이 최적!" or "오후 8시에 복습하면 좋아요"
  estimatedMinutes: number; // 예상 소요 시간
  message: string;          // 한국어 추천 메시지
}

/**
 * 간격 반복 데이터를 바탕으로 학습 추천을 계산한다.
 * urgent = nextReview가 오늘 이전(1일 이상 지연)인 문장
 */
export function getStudyRecommendation(
  sentenceReviews: Record<string, ReviewState>,
): StudyRecommendation {
  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentHour = now.getHours();

  // 오늘 이전이 복습 기한인 문장 = urgent (이미 잊혀지기 시작)
  let urgentCount = 0;
  for (const state of Object.values(sentenceReviews)) {
    if (state.nextReview < todayStr) {
      urgentCount++;
    }
  }

  // 오늘이 복습일인 문장도 포함 (due today)
  let dueTodayCount = 0;
  for (const state of Object.values(sentenceReviews)) {
    if (state.nextReview === todayStr) {
      dueTodayCount++;
    }
  }

  const totalDue = urgentCount + dueTodayCount;

  // 문장 1개당 약 40초 예상
  const estimatedMinutes = Math.max(1, Math.ceil(totalDue * 0.67));

  // 최적 시간 추천
  let optimalTime: string;
  if (totalDue === 0) {
    optimalTime = '오늘은 복습할 문장이 없어요';
  } else if (currentHour < 10) {
    optimalTime = '지금이 최적!';
  } else if (currentHour < 14) {
    optimalTime = '지금이 최적!';
  } else if (currentHour < 18) {
    optimalTime = '지금 복습하면 좋아요';
  } else if (currentHour < 21) {
    optimalTime = '자기 전 복습이 기억에 좋아요';
  } else {
    optimalTime = '내일 아침에 복습하면 좋아요';
  }

  // 메시지 생성
  let message: string;
  if (totalDue === 0) {
    message = '복습 완료! 오늘은 푹 쉬세요.';
  } else if (urgentCount > 0) {
    message = `${urgentCount}개 문장이 잊혀지기 전에 복습하세요! (약 ${estimatedMinutes}분)`;
  } else {
    message = `오늘 복습할 문장 ${dueTodayCount}개 (약 ${estimatedMinutes}분)`;
  }

  return {
    urgentCount,
    optimalTime,
    estimatedMinutes,
    message,
  };
}
