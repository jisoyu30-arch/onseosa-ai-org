// 학습한 dialogue 풀에서 시험 문제 자동 생성
import { allDialogues } from '../data/dialogues';
import { sentences } from '../data/sentences';
import type { LearningMode } from '../types';

export type QuestionType = 'translate' | 'listen' | 'fillBlank';

export interface Question {
  type: QuestionType;
  prompt: string;          // 문제 (한국어 또는 정답 언어 일부)
  promptKo?: string;       // 한국어 보조
  audioText?: string;      // listen 유형 — TTS 재생 텍스트
  options: string[];       // 4개 선택지
  correctIndex: number;    // 0~3
  hint?: string;
}

const norm = (s: string) => s.replace(/[¿?¡!.,;:""'']/g, '').trim();

function pickN<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length && out.length < n) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function getTextFor(line: any, mode: LearningMode): string {
  if (mode === 'es') return line.spanish || '';
  if (mode === 'en') return line.english || line.spanish || '';
  return line.chinese || line.spanish || '';
}

/**
 * 학습한 dialogue ID 목록에서 시험 5문제 생성.
 * 다양성: translate × 2, fillBlank × 2, listen × 1
 */
export function generateTest(
  completedDialogueIds: string[],
  mode: LearningMode,
  count: number = 5,
): Question[] {
  // 후보 라인 수집 (각 dialogue에서 2-3 라인)
  const allLines: { korean: string; target: string }[] = [];
  for (const id of completedDialogueIds) {
    const d = allDialogues[id];
    if (!d) continue;
    for (const line of d.lines) {
      const target = getTextFor(line, mode);
      if (line.korean && target && target.length >= 4) {
        allLines.push({ korean: line.korean, target });
      }
    }
  }

  // sentences에서 fallback 추가
  if (allLines.length < 20) {
    const sList = Object.values(sentences) as any[];
    for (const s of sList.slice(0, 50)) {
      const target = mode === 'es' ? s.spanish : mode === 'en' ? s.english : s.chinese;
      if (s.korean && target) allLines.push({ korean: s.korean, target });
    }
  }

  if (allLines.length < 4) {
    return [];   // 시험 만들기 부족
  }

  // 5문제 분배
  const types: QuestionType[] = ['translate', 'translate', 'fillBlank', 'fillBlank', 'listen'];
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const picked = pickN(allLines, 4);   // 정답 1 + 오답 후보 3
    if (picked.length < 4) break;
    const correct = picked[0];
    const wrongs = picked.slice(1);

    if (type === 'translate') {
      // 한국어 → 타겟 언어 4지선다
      const opts = [correct.target, ...wrongs.map((w) => w.target)];
      const order = pickN([0, 1, 2, 3], 4);
      const shuffled = order.map((idx) => opts[idx]);
      const correctIndex = order.indexOf(0);
      questions.push({
        type,
        prompt: correct.korean,
        promptKo: '한국어 → 타겟 언어',
        options: shuffled,
        correctIndex,
        hint: '뜻이 같은 표현 고르기',
      });
    } else if (type === 'fillBlank') {
      // 타겟 텍스트의 가장 긴 단어를 빈칸으로
      const words = correct.target.split(/\s+/);
      let longest = '';
      let longestIdx = 0;
      words.forEach((w, idx) => {
        const c = norm(w);
        if (c.length > longest.length) { longest = c; longestIdx = idx; }
      });
      if (longest.length < 2) {
        i--;   // 재시도
        continue;
      }
      const display = words.map((w, idx) => idx === longestIdx ? '____' : w).join(' ');
      // 오답 후보: 같은 사이즈 단어들
      const otherWords = wrongs.flatMap((w) => w.target.split(/\s+/).map(norm)).filter((w) => w.length >= 2 && w !== longest);
      const wrongOpts = pickN(otherWords, 3);
      while (wrongOpts.length < 3) wrongOpts.push('---');
      const opts = [longest, ...wrongOpts];
      const order = pickN([0, 1, 2, 3], 4);
      const shuffled = order.map((idx) => opts[idx]);
      const correctIndex = order.indexOf(0);
      questions.push({
        type,
        prompt: display,
        promptKo: correct.korean,
        options: shuffled,
        correctIndex,
        hint: '빈칸에 들어갈 단어',
      });
    } else if (type === 'listen') {
      // 타겟 언어 TTS → 4개 한국어 중 정답
      const opts = [correct.korean, ...wrongs.map((w) => w.korean)];
      const order = pickN([0, 1, 2, 3], 4);
      const shuffled = order.map((idx) => opts[idx]);
      const correctIndex = order.indexOf(0);
      questions.push({
        type,
        prompt: '🔊 듣고 의미 고르기',
        audioText: correct.target,
        options: shuffled,
        correctIndex,
        hint: '소리 듣고 한국어 의미',
      });
    }
  }

  return questions;
}
