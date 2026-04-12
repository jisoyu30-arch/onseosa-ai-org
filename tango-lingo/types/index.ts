// ===== 문장 =====
export interface Sentence {
  id: string;
  spanish: string;
  korean: string;
  english: string;
  chinese: string;
  pronunciation?: string;
  audioKey?: string;
  tags: string[];
  difficulty: 1 | 2 | 3;
  role?: 'A' | 'B' | 'none';
}

// ===== 레슨 구조 =====
export interface Level {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  unitIds: string[];
  order: number;
}

export interface Unit {
  id: string;
  levelId: string;
  title: string;
  titleKo: string;
  lessonIds: string[];
  order: number;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  titleKo: string;
  situation: string;
  sentenceIds: string[];
  quizIds: string[];
  roleplayId?: string;
  termIds?: string[];       // 이 레슨에서 소개할 탱고 용어
  bonusId?: string;         // 레슨 완료 후 해금되는 보너스
  missionId?: string;       // 레슨 완료 후 커플 미션
  homeworkIds?: string[];   // 숙제
  grammarId?: string;       // 문법 미니 레슨
  order: number;
}

// ===== 퀴즈 =====
export type QuizType = 'multiple_choice' | 'fill_blank' | 'word_order' | 'listening' | 'meaning_match' | 'reverse_translate';

export interface Quiz {
  id: string;
  type: QuizType;
  sentenceId: string;
  question: string;
  questionKo?: string;
  options?: string[];
  correctAnswer: string;
  words?: string[]; // word_order용
}

// ===== 역할극 =====
export interface RoleplayLine {
  role: 'A' | 'B';
  roleLabel: string; // "Profesor", "Alumno"
  spanish: string;
  korean: string;
  english: string;
  chinese: string;
}

export interface RoleplayDialog {
  id: string;
  title: string;
  titleKo: string;
  situation: string;
  lines: RoleplayLine[];
}

// ===== 오늘의 한 문장 =====
export interface DailyQuote {
  id: string;
  spanish: string;
  korean: string;
  english: string;
  source?: string;
}

// ===== 사용자 진행 =====
export interface ReviewState {
  nextReview: string; // ISO date
  interval: number;   // days
  wrongCount: number;
}

export interface UserProgress {
  completedLessons: string[];
  xp: number;
  streak: number;
  lastStudyDate: string; // ISO date
  wrongSentences: string[]; // 틀린 문장 id 목록
  sentenceReviews: Record<string, ReviewState>;
}

// ===== 설정 =====
export interface Settings {
  notificationEnabled: boolean;
  notificationHour: number;
  notificationMinute: number;
  showEnglish: boolean;
  showChinese: boolean;
}

// ===== 발음 연습 언어 =====
export type PracticeLanguage = 'es' | 'zh' | 'ko';

// ===== 발음 연습 =====
export interface PronunciationAttempt {
  sentenceId: string;
  transcript: string;
  feedbackLabel: string;
  attemptedAt: string; // ISO date
}

export interface PronunciationFeedback {
  label: 'perfect' | 'great' | 'close' | 'missing_word' | 'try_again';
  message: string;
  missingWords?: string[];
  similarity: number; // 0~1
}

export interface SpeechTranscriptionResult {
  text: string;
  confidence: number; // 0~1
}

export type RecordingState = 'idle' | 'recording' | 'recorded' | 'playing';

// ===== 탱고 용어 노트 =====
export interface TangoTerm {
  id: string;
  term: string;
  literalMeaning: string;     // 사전적 스페인어 뜻
  tangoMeaning: string;       // 탱고에서의 의미
  bodyInterpretation: string; // 몸으로 느끼는 해석
  example: string;            // 짧은 실전 예시
  relatedLessonIds?: string[];
}

// ===== 보너스 지식 캡슐 =====
// ===== 숙제 =====
export type HomeworkType = 'speaking' | 'couple' | 'real_world' | 'reflection' | 'recording';

export interface Homework {
  id: string;
  type: HomeworkType;
  instruction: string;
  targetSentences?: string[];
  xpReward: number;
  lessonGroup: string; // 어느 레슨 묶음에 속하는지 (예: 'les1_01~03')
}

export type BonusCategory = 'history' | 'etiquette' | 'music' | 'culture' | 'word_origin';

export interface BonusCard {
  id: string;
  category: BonusCategory;
  title: string;
  titleKo: string;
  content: string;            // 짧고 따뜻한 탱고 선생님 톤
  emoji: string;
  unlockAfterLesson: string;  // 이 레슨 완료 후 해금
  relatedTermIds?: string[];
}

// ===== 커플 미션 =====
export interface CoupleMission {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'conversation' | 'observation' | 'challenge';
  unlockAfterLesson: string;
  xpReward: number;
}

// ===== 레슨 진행 상태 =====
export type LessonPhase = 'sentences' | 'quiz' | 'grammar' | 'dialogue' | 'term' | 'bonus' | 'mission' | 'homework' | 'complete';

export interface LessonState {
  lessonId: string | null;
  phase: LessonPhase;
  currentIndex: number; // 현재 카드/퀴즈 인덱스
  correctCount: number;
  wrongIds: string[];   // 이번 레슨에서 틀린 문장 id
  earnedXp: number;
}
