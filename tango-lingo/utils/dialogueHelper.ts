import { sentences } from '../data/sentences';
import type { DialogueExample } from '../data/dialogues-l1';
import type { Sentence } from '../types';

export interface EnrichedLine {
  speaker: string;
  spanish: string;
  korean: string;
  english?: string;
  chinese?: string;
  pronunciation?: string;
  pronunciationEn?: string;
  pronunciationZh?: string;
  sentenceId?: string;
  posTokensEs?: any;   // 향후 품사 태깅
  posTokensEn?: any;
  posTokensZh?: any;
}

/**
 * dialogue line의 spanish 텍스트로 sentences에서 매칭해서
 * 4국어 번역 + 발음을 보강한다.
 */
export function enrichDialogueLines(d: DialogueExample): EnrichedLine[] {
  const allSentences = Object.values(sentences) as Sentence[];

  return d.lines.map((line) => {
    // spanish 완전일치 검색
    const match = allSentences.find(
      (s) => normalize(s.spanish) === normalize(line.spanish)
    );
    if (match) {
      return {
        speaker: line.speaker,
        spanish: match.spanish,
        korean: match.korean,
        english: match.english,
        chinese: match.chinese,
        pronunciation: match.pronunciation,
        pronunciationEn: match.pronunciationEn,
        pronunciationZh: match.pronunciationZh,
        sentenceId: match.id,
      };
    }
    // 매칭 실패: 원본 그대로 (영어/중국어 없음)
    return {
      speaker: line.speaker,
      spanish: line.spanish,
      korean: line.korean,
    };
  });
}

const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
