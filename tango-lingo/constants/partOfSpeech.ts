// 품사별 색 코딩 시스템 — 3국어 공통
// 색약 친화 팔레트 (WCAG AA 대비비 기준)

export type PartOfSpeech =
  | 'subject'       // 주어 / 대명사 주격
  | 'verb'          // 동사
  | 'object'        // 목적어
  | 'adjective'     // 형용사
  | 'adverb'        // 부사
  | 'preposition'   // 전치사 / 조사
  | 'article'       // 관사 / 조동사
  | 'conjunction'   // 접속사
  | 'interjection'  // 감탄사 / 인사
  | 'particle'      // 어기조사 (中) / 기타
  | 'none';         // 색 없음

export interface PosColor {
  bg: string;      // 배경
  fg: string;      // 글자색
  label: string;   // 한국어 라벨
}

export const POS_COLORS: Record<PartOfSpeech, PosColor> = {
  subject:      { bg: '#DBEAFE', fg: '#1E40AF', label: '주어' },
  verb:         { bg: '#FEE2E2', fg: '#991B1B', label: '동사' },
  object:       { bg: '#D1FAE5', fg: '#065F46', label: '목적어' },
  adjective:    { bg: '#EDE9FE', fg: '#5B21B6', label: '형용사' },
  adverb:       { bg: '#FFEDD5', fg: '#9A3412', label: '부사' },
  preposition:  { bg: '#F3F4F6', fg: '#374151', label: '전치사/조사' },
  article:      { bg: '#FEF3C7', fg: '#92400E', label: '관사/조동사' },
  conjunction:  { bg: '#FCE7F3', fg: '#9D174D', label: '접속사' },
  interjection: { bg: '#E0F2FE', fg: '#075985', label: '인사/감탄' },
  particle:     { bg: '#ECFCCB', fg: '#3F6212', label: '어기조사' },
  none:         { bg: 'transparent', fg: '#2B2D42', label: '' },
};

export const POS_ORDER: PartOfSpeech[] = [
  'subject', 'verb', 'object', 'adjective', 'adverb',
  'preposition', 'article', 'conjunction', 'interjection', 'particle',
];

// 품사 태깅된 토큰
export interface PosToken {
  text: string;   // 원어 표기
  pos: PartOfSpeech;
  ko?: string;    // 한국어 뜻 (탭시 표시)
}
