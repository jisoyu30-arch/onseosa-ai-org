// 음성 매칭 유틸 — 정답 문자열 vs 사용자 발화 비교
// 편집 거리(Levenshtein) + 단어 단위 매칭

const norm = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // 악센트 제거 (스페인어)
    .replace(/[¿?¡!.,;:""'']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Levenshtein 편집 거리 */
function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = new Array(n + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1]
        ? prev
        : Math.min(prev, dp[j], dp[j - 1]) + 1;
      prev = tmp;
    }
  }
  return dp[n];
}

export interface MatchResult {
  score: number;           // 0~100
  expected: string;        // 정답
  heard: string;           // 들은 것
  expectedWords: string[];
  heardWords: string[];
  wordMatches: boolean[];  // 각 expected 단어가 들은 것에 포함됐는지
  feedback: string;        // 한국어 피드백
}

/**
 * 정답과 사용자 발화 비교.
 * 1) 전체 편집 거리 → 점수
 * 2) 단어 단위 매칭 → 어느 부분이 틀렸는지
 */
export function matchPhrase(expected: string, heard: string): MatchResult {
  const e = norm(expected);
  const h = norm(heard);

  // 전체 점수 (편집 거리 기반)
  const dist = editDistance(e, h);
  const maxLen = Math.max(e.length, 1);
  const score = Math.max(0, Math.round((1 - dist / maxLen) * 100));

  // 단어 매칭
  const expectedWords = expected.split(/\s+/);
  const heardWords = heard.split(/\s+/);
  const heardSet = new Set(heardWords.map(norm));
  const wordMatches = expectedWords.map((w) => heardSet.has(norm(w)));

  // 한국어 피드백
  let feedback = '';
  if (score >= 90) feedback = '🎉 거의 완벽!';
  else if (score >= 75) feedback = '👍 잘 했어요!';
  else if (score >= 50) feedback = '🔄 조금 더 연습';
  else if (score >= 25) feedback = '💪 다시 시도';
  else feedback = '🎤 다시 한 번';

  return {
    score,
    expected,
    heard,
    expectedWords,
    heardWords,
    wordMatches,
    feedback,
  };
}
