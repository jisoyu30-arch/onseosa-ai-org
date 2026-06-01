// 단어별 AI 이미지 URL — Pollinations.ai (완전 무료, 무제한)
// 26초 앱(Skimmify) 스타일: 미니멀 워터컬러 일러스트

import type { LearningMode } from '../types';

const POLLINATIONS = 'https://image.pollinations.ai/prompt';

const LANG_HINT = {
  en: 'English word',
  es: 'Spanish word (concept)',
  zh: 'Chinese hanzi (meaning)',
} as const;

/**
 * 단어 의미에 맞는 일러스트 URL 생성.
 * - 영어/스페인어/중국어 단어 + 한국어 뜻 → AI에게 의미 명확히 전달
 * - 26초 앱 스타일: minimalist watercolor, flat design, single subject
 */
export function getWordImageUrl(word: string, mode: LearningMode, ko?: string | null, width = 400): string {
  // 의미를 가장 잘 전달하는 영어 키워드 우선 사용
  // 영어가 아니면 한국어 뜻을 영어 화자가 해석할 수 있도록 + 원어 함께
  let conceptHint: string;
  if (mode === 'en') {
    conceptHint = word;
  } else if (ko) {
    conceptHint = `concept of ${ko} (${word})`;
  } else {
    conceptHint = `${LANG_HINT[mode]} ${word}`;
  }

  // 26초 앱 벤치마킹: minimalist watercolor, single subject, soft colors, no text
  const prompt = [
    `${conceptHint}`,
    'minimalist watercolor illustration',
    'single centered subject',
    'soft pastel colors',
    'cream off-white background',
    'flat design',
    'cute friendly',
    'vocabulary flashcard style',
    'NO text NO letters NO words',
    'square composition',
  ].join(', ');

  const encoded = encodeURIComponent(prompt);
  // seed = word 해시 → 같은 단어는 항상 같은 이미지
  const seed = simpleHash(word);
  return `${POLLINATIONS}/${encoded}?width=${width}&height=${width}&nologo=true&seed=${seed}&model=flux`;
}

function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return h;
}
