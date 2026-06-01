// 매주 복습 — 7일간 학습한 단어/대화 자동 수집
import { useVocabStore } from './useVocabStore';
import { useDialogueProgress } from './useDialogueProgress';
import { getVocab } from '../data/vocab';
import type { LearningMode } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

/** 이번 주 (오늘 기준 7일) 학습한 단어 ID 목록 */
export function getWeekVocab(mode: LearningMode): { word: string; status: 'known' | 'learning'; date: string }[] {
  const lang = useVocabStore.getState().langs[mode];
  if (!lang) return [];

  const now = Date.now();
  const result: { word: string; status: 'known' | 'learning'; date: string }[] = [];

  for (const [word, status] of Object.entries(lang.status)) {
    const last = lang.lastReview[word];
    if (!last) continue;
    const lastTime = new Date(last).getTime();
    if (now - lastTime <= 7 * DAY_MS) {
      result.push({ word, status: status as 'known' | 'learning', date: last });
    }
  }
  return result.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** 복습할 단어 추출 — 이번 주 "learning" + 오래된 "known" 일부 */
export function getReviewWords(mode: LearningMode, limit = 20) {
  const weekVocab = getWeekVocab(mode);
  const vocabPool = getVocab(mode);

  // 이번 주 "learning"이 우선
  const learning = weekVocab.filter((w) => w.status === 'learning').map((w) => w.word);

  // 부족하면 1주일 이전 학습한 known 중 오래된 것
  const lang = useVocabStore.getState().langs[mode];
  const old = Object.entries(lang.lastReview)
    .filter(([, d]) => Date.now() - new Date(d).getTime() > 7 * DAY_MS)
    .filter(([w]) => lang.status[w] === 'known')
    .sort(([, a], [, b]) => (a < b ? -1 : 1))   // 오래된 순
    .slice(0, limit - learning.length)
    .map(([w]) => w);

  const ids = [...learning, ...old].slice(0, limit);
  return vocabPool.filter((v) => ids.includes(v.word) && v.ko);
}

/** 이번 주 학습한 dialogue 수 */
export function getWeekDialogueCount(mode: LearningMode): number {
  const lang = useDialogueProgress.getState().langs[mode];
  if (!lang) return 0;
  // dialogue progress엔 timestamp 없으니 일단 누적 totalCompleted 기준
  return lang.completedIds.length;
}

/** 주간 요약 */
export interface WeeklySummary {
  vocabKnown: number;
  vocabLearning: number;
  vocabTotal: number;
  dialogueDone: number;
  daysActive: number;   // 한 주에 활동한 날 수
}

export function getWeeklySummary(mode: LearningMode): WeeklySummary {
  const week = getWeekVocab(mode);
  const days = new Set(week.map((w) => w.date.split('T')[0]));
  return {
    vocabKnown: week.filter((w) => w.status === 'known').length,
    vocabLearning: week.filter((w) => w.status === 'learning').length,
    vocabTotal: week.length,
    dialogueDone: useDialogueProgress.getState().langs[mode]?.completedIds.length ?? 0,
    daysActive: days.size,
  };
}
