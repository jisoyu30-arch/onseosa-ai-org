// Vocab 데이터 통합 진입점
import vocabEs from './vocab-es-final.json';
import vocabEn from './vocab-en-final.json';
import vocabZh from './vocab-zh-final.json';
import type { LearningMode } from '../../types';
import type { VocabCategory } from './categories';

export interface VocabWord {
  id: string;
  word: string;
  pos: string | null;
  level: string | null;
  rank: number | null;
  ko: string | null;
  ipa: string | null;
  pron_ko: string | null;
  category: VocabCategory;
  example: string | null;
  example_ko: string | null;
  enriched: boolean;
}

const ALL: Record<LearningMode, VocabWord[]> = {
  es: vocabEs as VocabWord[],
  en: vocabEn as VocabWord[],
  zh: vocabZh as VocabWord[],
};

export function getVocab(mode: LearningMode): VocabWord[] {
  return ALL[mode] ?? [];
}

/** 한국어 뜻 있는 단어만 (학습 가능) */
export function getStudyableVocab(mode: LearningMode): VocabWord[] {
  return ALL[mode].filter((v) => v.ko !== null);
}

/** 카테고리별 필터 */
export function getVocabByCategory(mode: LearningMode, cat: VocabCategory): VocabWord[] {
  return ALL[mode].filter((v) => v.category === cat && v.ko !== null);
}

/** Level별 (A1, A2, B1, B2, C1) */
export function getVocabByLevel(mode: LearningMode, level: string): VocabWord[] {
  return ALL[mode].filter(
    (v) => (v.level === level || v.level?.startsWith(level)) && v.ko !== null,
  );
}

/** rank 정렬 (자주 쓰는 단어 우선) */
export function getVocabByFrequency(mode: LearningMode, limit?: number): VocabWord[] {
  const sorted = [...ALL[mode]]
    .filter((v) => v.ko !== null)
    .sort((a, b) => (a.rank ?? 999999) - (b.rank ?? 999999));
  return limit ? sorted.slice(0, limit) : sorted;
}
