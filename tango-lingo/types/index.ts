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
  order: number;
}

// ===== 퀴즈 =====
export type QuizType = 'multiple_choice' | 'fill_blank' | 'word_order' | 'listening';

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

// ===== 레슨 진행 상태 =====
export type LessonPhase = 'sentences' | 'quiz' | 'complete';

export interface LessonState {
  lessonId: string | null;
  phase: LessonPhase;
  currentIndex: number; // 현재 카드/퀴즈 인덱스
  correctCount: number;
  wrongIds: string[];   // 이번 레슨에서 틀린 문장 id
  earnedXp: number;
}
