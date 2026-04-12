import type { PronunciationFeedback, PracticeLanguage } from '../types';

// ===== Normalization (language-aware) =====

// Argentine Spanish: ¿/¡ 제거, 악센트 유지
function normalizeEs(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,;:!?¿¡"""''()\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Chinese: 공백/구두점 제거 (character-level 비교)
function normalizeZh(text: string): string {
  return text
    .replace(/[\s.,;:!?"""''()、。，！？；：（）\-]/g, '')
    .trim();
}

// Korean: 공백 정리, 구두점 제거
function normalizeKo(text: string): string {
  return text
    .replace(/[.,;:!?"""''()\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(text: string, lang: PracticeLanguage): string {
  switch (lang) {
    case 'es': return normalizeEs(text);
    case 'zh': return normalizeZh(text);
    case 'ko': return normalizeKo(text);
  }
}

// ===== Similarity =====

function wordSimilarity(expected: string, actual: string, lang: PracticeLanguage): number {
  const expNorm = normalize(expected, lang);
  const actNorm = normalize(actual, lang);

  if (lang === 'zh') {
    // Character-level comparison for Chinese
    if (expNorm.length === 0) return 0;
    let matched = 0;
    for (const ch of expNorm) {
      if (actNorm.includes(ch)) matched++;
    }
    return matched / expNorm.length;
  }

  // Word-level for Spanish / Korean
  const expWords = expNorm.split(' ');
  const actWords = actNorm.split(' ');
  if (expWords.length === 0) return 0;

  let matched = 0;
  for (const w of expWords) {
    if (actWords.includes(w)) matched++;
  }
  return matched / expWords.length;
}

function findMissingWords(expected: string, actual: string, lang: PracticeLanguage): string[] {
  const expNorm = normalize(expected, lang);
  const actNorm = normalize(actual, lang);

  if (lang === 'zh') {
    // For Chinese, return missing characters (only important ones, length > 0)
    const missing: string[] = [];
    for (const ch of expNorm) {
      if (!actNorm.includes(ch) && !missing.includes(ch)) missing.push(ch);
    }
    return missing.slice(0, 3); // 최대 3개만
  }

  const expWords = expNorm.split(' ');
  const actWords = actNorm.split(' ');
  const important = expWords.filter((w) => w.length > (lang === 'ko' ? 1 : 2));
  return important.filter((w) => !actWords.includes(w));
}

// ===== Language-aware feedback messages =====

interface FeedbackMessages {
  perfect: string;
  great: string;
  close: string;
  missingTemplate: (words: string) => string;
  tryAgain: string;
  noInput: string;
}

const MESSAGES: Record<PracticeLanguage, FeedbackMessages> = {
  es: {
    perfect: '¡Perfecto! 완벽해요!',
    great: '¡Muy bien! 아주 좋아요!',
    close: '비슷해요! 한 번 더 해볼까요?',
    missingTemplate: (w) => `거의 다 왔어요! 빠진 단어: ${w}`,
    tryAgain: '천천히 다시 말해보세요.',
    noInput: '음성이 인식되지 않았어요. 다시 시도해보세요.',
  },
  zh: {
    perfect: '太棒了！완벽해요!',
    great: '很好！아주 좋아요!',
    close: '差不多！거의요! 한 번 더?',
    missingTemplate: (w) => `빠진 글자: ${w}`,
    tryAgain: '慢慢再说一次。천천히 다시 말해보세요.',
    noInput: '음성이 인식되지 않았어요. 다시 시도해보세요.',
  },
  ko: {
    perfect: '완벽해요!',
    great: '아주 잘했어요!',
    close: '거의요! 한 번 더 해볼까요?',
    missingTemplate: (w) => `빠진 단어: ${w}`,
    tryAgain: '천천히 다시 말해보세요.',
    noInput: '음성이 인식되지 않았어요. 다시 시도해보세요.',
  },
};

// ===== Main feedback generator =====

export function generateFeedback(
  expected: string,
  transcript: string,
  lang: PracticeLanguage = 'es'
): PronunciationFeedback {
  const msgs = MESSAGES[lang];

  if (!transcript || transcript.trim() === '') {
    return { label: 'try_again', message: msgs.noInput, similarity: 0 };
  }

  const similarity = wordSimilarity(expected, transcript, lang);
  const missing = findMissingWords(expected, transcript, lang);

  if (similarity >= 0.9) {
    return { label: 'perfect', message: msgs.perfect, similarity };
  }

  if (similarity >= 0.7) {
    return {
      label: 'great',
      message: msgs.great,
      similarity,
      missingWords: missing.length > 0 ? missing : undefined,
    };
  }

  if (similarity >= 0.5) {
    if (missing.length > 0) {
      return {
        label: 'missing_word',
        message: msgs.missingTemplate(missing.join(', ')),
        missingWords: missing,
        similarity,
      };
    }
    return { label: 'close', message: msgs.close, similarity };
  }

  return {
    label: 'try_again',
    message: msgs.tryAgain,
    similarity,
    missingWords: missing.length > 0 ? missing : undefined,
  };
}
