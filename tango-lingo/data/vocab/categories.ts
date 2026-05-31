// 어휘 카테고리 50개 — 이모지/일러스트 매핑용
// OPIc 빈출 + 탱고 + 일상 통합

export type VocabCategory =
  // 🏠 일상 (15)
  | 'self_intro' | 'family' | 'friend' | 'home' | 'routine'
  | 'food' | 'restaurant' | 'cafe' | 'shopping' | 'clothing'
  | 'transport' | 'weather' | 'morning' | 'evening' | 'weekend'
  // 💼 활동·관심사 (15)
  | 'work' | 'study' | 'internet' | 'social_media' | 'news'
  | 'movie' | 'music' | 'book' | 'sport' | 'exercise'
  | 'travel' | 'vacation' | 'photography' | 'cooking' | 'gaming'
  // 💃 탱고 (10)
  | 'tango_step' | 'tango_term' | 'milonga' | 'embrace' | 'partner'
  | 'orchestra' | 'shoes' | 'lesson' | 'practice' | 'festival'
  // 💗 감정·상태 (10)
  | 'happy' | 'sad' | 'angry' | 'calm' | 'surprised'
  | 'tired' | 'nervous' | 'proud' | 'love' | 'curious'
  // 🧠 추상 (10) — OPIc IH/AL 필수
  | 'opinion' | 'reason' | 'comparison' | 'agreement' | 'problem'
  | 'solution' | 'plan' | 'future' | 'memory' | 'time';

interface CategoryInfo {
  ko: string;
  emoji: string;
  bg: string;        // 카드 배경 그라데이션 (시작)
  bgEnd: string;     // 그라데이션 끝
}

export const CATEGORY_INFO: Record<VocabCategory, CategoryInfo> = {
  // 일상 — 따뜻한 톤
  self_intro:  { ko: '자기소개', emoji: '👋', bg: '#FEF3C7', bgEnd: '#FDE68A' },
  family:      { ko: '가족', emoji: '👨‍👩‍👧', bg: '#FCE7F3', bgEnd: '#FBCFE8' },
  friend:      { ko: '친구', emoji: '🤝', bg: '#DBEAFE', bgEnd: '#BFDBFE' },
  home:        { ko: '집', emoji: '🏠', bg: '#FED7AA', bgEnd: '#FDBA74' },
  routine:     { ko: '일과', emoji: '🌅', bg: '#FFEDD5', bgEnd: '#FED7AA' },
  food:        { ko: '음식', emoji: '🍽️', bg: '#FEE2E2', bgEnd: '#FECACA' },
  restaurant:  { ko: '식당', emoji: '🍴', bg: '#FCD34D33', bgEnd: '#FBBF2433' },
  cafe:        { ko: '카페', emoji: '☕', bg: '#FEF3C7', bgEnd: '#FDE68A' },
  shopping:    { ko: '쇼핑', emoji: '🛍️', bg: '#FBCFE8', bgEnd: '#F9A8D4' },
  clothing:    { ko: '옷', emoji: '👕', bg: '#E0E7FF', bgEnd: '#C7D2FE' },
  transport:   { ko: '교통', emoji: '🚇', bg: '#DBEAFE', bgEnd: '#BFDBFE' },
  weather:     { ko: '날씨', emoji: '☀️', bg: '#FEF9C3', bgEnd: '#FEF08A' },
  morning:     { ko: '아침', emoji: '🌄', bg: '#FFEDD5', bgEnd: '#FED7AA' },
  evening:     { ko: '저녁', emoji: '🌙', bg: '#DDD6FE', bgEnd: '#C4B5FD' },
  weekend:     { ko: '주말', emoji: '🎉', bg: '#FBCFE8', bgEnd: '#F9A8D4' },

  // 활동·관심사 — 활기찬 톤
  work:         { ko: '일', emoji: '💼', bg: '#E5E7EB', bgEnd: '#D1D5DB' },
  study:        { ko: '공부', emoji: '📚', bg: '#DBEAFE', bgEnd: '#BFDBFE' },
  internet:     { ko: '인터넷', emoji: '🌐', bg: '#DDD6FE', bgEnd: '#C4B5FD' },
  social_media: { ko: 'SNS', emoji: '📱', bg: '#FCE7F3', bgEnd: '#FBCFE8' },
  news:         { ko: '뉴스', emoji: '📰', bg: '#F3F4F6', bgEnd: '#E5E7EB' },
  movie:        { ko: '영화', emoji: '🎬', bg: '#1E293B22', bgEnd: '#33415522' },
  music:        { ko: '음악', emoji: '🎵', bg: '#EDE9FE', bgEnd: '#DDD6FE' },
  book:         { ko: '책', emoji: '📖', bg: '#F5F5F4', bgEnd: '#E7E5E4' },
  sport:        { ko: '스포츠', emoji: '⚽', bg: '#D1FAE5', bgEnd: '#A7F3D0' },
  exercise:     { ko: '운동', emoji: '💪', bg: '#FECACA', bgEnd: '#FCA5A5' },
  travel:       { ko: '여행', emoji: '✈️', bg: '#BAE6FD', bgEnd: '#7DD3FC' },
  vacation:     { ko: '휴가', emoji: '🏖️', bg: '#FEF9C3', bgEnd: '#FEF08A' },
  photography:  { ko: '사진', emoji: '📷', bg: '#E5E7EB', bgEnd: '#D1D5DB' },
  cooking:      { ko: '요리', emoji: '🍳', bg: '#FED7AA', bgEnd: '#FDBA74' },
  gaming:       { ko: '게임', emoji: '🎮', bg: '#A78BFA33', bgEnd: '#8B5CF633' },

  // 탱고 — 빨강·검정 톤
  tango_step:  { ko: '탱고 동작', emoji: '💃', bg: '#FEE2E2', bgEnd: '#FECACA' },
  tango_term:  { ko: '탱고 용어', emoji: '🌹', bg: '#FCA5A5', bgEnd: '#F87171' },
  milonga:     { ko: '밀롱가', emoji: '🪩', bg: '#FED7AA', bgEnd: '#FDBA74' },
  embrace:     { ko: '아브라소', emoji: '🤗', bg: '#FBCFE8', bgEnd: '#F9A8D4' },
  partner:     { ko: '파트너', emoji: '🤝', bg: '#FECACA', bgEnd: '#FCA5A5' },
  orchestra:   { ko: '오케스트라', emoji: '🎻', bg: '#EDE9FE', bgEnd: '#DDD6FE' },
  shoes:       { ko: '신발', emoji: '👠', bg: '#1E293B22', bgEnd: '#33415522' },
  lesson:      { ko: '레슨', emoji: '🎓', bg: '#DBEAFE', bgEnd: '#BFDBFE' },
  practice:    { ko: '연습', emoji: '🔁', bg: '#D1FAE5', bgEnd: '#A7F3D0' },
  festival:    { ko: '페스티벌', emoji: '🎪', bg: '#FBCFE8', bgEnd: '#F9A8D4' },

  // 감정 — 표정 톤
  happy:       { ko: '행복', emoji: '😊', bg: '#FEF9C3', bgEnd: '#FEF08A' },
  sad:         { ko: '슬픔', emoji: '😢', bg: '#DBEAFE', bgEnd: '#BFDBFE' },
  angry:       { ko: '화남', emoji: '😠', bg: '#FECACA', bgEnd: '#FCA5A5' },
  calm:        { ko: '평온', emoji: '😌', bg: '#D1FAE5', bgEnd: '#A7F3D0' },
  surprised:   { ko: '놀람', emoji: '😲', bg: '#FED7AA', bgEnd: '#FDBA74' },
  tired:       { ko: '피곤', emoji: '😪', bg: '#E5E7EB', bgEnd: '#D1D5DB' },
  nervous:     { ko: '긴장', emoji: '😬', bg: '#FEF3C7', bgEnd: '#FDE68A' },
  proud:       { ko: '자랑', emoji: '🥲', bg: '#FCE7F3', bgEnd: '#FBCFE8' },
  love:        { ko: '사랑', emoji: '❤️', bg: '#FECACA', bgEnd: '#FCA5A5' },
  curious:     { ko: '호기심', emoji: '🤔', bg: '#EDE9FE', bgEnd: '#DDD6FE' },

  // 추상 — 차분한 톤
  opinion:     { ko: '의견', emoji: '💭', bg: '#F3F4F6', bgEnd: '#E5E7EB' },
  reason:      { ko: '이유', emoji: '🎯', bg: '#FEE2E2', bgEnd: '#FECACA' },
  comparison:  { ko: '비교', emoji: '⚖️', bg: '#DBEAFE', bgEnd: '#BFDBFE' },
  agreement:   { ko: '동의', emoji: '👍', bg: '#D1FAE5', bgEnd: '#A7F3D0' },
  problem:     { ko: '문제', emoji: '⚠️', bg: '#FED7AA', bgEnd: '#FDBA74' },
  solution:    { ko: '해결', emoji: '💡', bg: '#FEF3C7', bgEnd: '#FDE68A' },
  plan:        { ko: '계획', emoji: '📋', bg: '#E0E7FF', bgEnd: '#C7D2FE' },
  future:      { ko: '미래', emoji: '🔮', bg: '#EDE9FE', bgEnd: '#DDD6FE' },
  memory:      { ko: '추억', emoji: '📷', bg: '#F5F5F4', bgEnd: '#E7E5E4' },
  time:        { ko: '시간', emoji: '⏰', bg: '#FEF9C3', bgEnd: '#FEF08A' },
};

export const CATEGORY_LIST: VocabCategory[] = Object.keys(CATEGORY_INFO) as VocabCategory[];
