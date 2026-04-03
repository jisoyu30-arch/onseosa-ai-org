// ── 공통 메모리 레코드 스키마 ──────────────────────────────────
// 원문 대화 전체 저장 금지 / 요약 구조화 메모리만 저장

export interface MemoryRecord {
  id?: string;
  type: 'user' | 'project' | 'task' | 'secretary';
  project?: string;                   // 관련 프로젝트명 (없으면 전역)
  status: 'active' | 'completed' | 'pending' | 'archived';
  confirmed_facts: string[];          // 결정된 사실만 (미정 아이디어 금지)
  next_action: string;                // 다음에 할 일 한 줄
  due_date?: string;                  // YYYY-MM-DD (일정 있을 때만)
  related_paths: {
    drive?: string;
    notion?: string;
  };
  importance: number;                 // 1-5 (5=최우선)
  updated_at: string;
}

// ── 사용자 기억 (user_memory) ─────────────────────────────────
// 사용자 고정 선호, 자주 쓰는 형식/톤, 반복 제약 조건
export interface UserMemory {
  id?: string;
  preferred_domains: string[];
  preferred_tone: string;
  preferred_format: string;
  recurring_constraints: string[];    // 항상 지켜야 하는 규칙
  style_notes: string;
  updated_at: string;
}

// ── 프로젝트 기억 (project_memory) ────────────────────────────
export interface ProjectMemory {
  id: string;
  projectId: string;
  canon: Record<string, unknown>;
  toneRules: string[];
  bannedElements: string[];
  completedTasks: string[];
  pendingTasks: string[];
  strongPatterns: string[];
  weakPatterns: string[];
  latestStatus: string;              // 현재 상태 한 줄
  nextAction: string;                // 다음 액션
  savedPaths: {
    drive?: string;
    notion?: string;
  };
  updatedAt: string;
}

// ── 엔진 기억 (engine_memory) ─────────────────────────────────
export interface EngineMemory {
  id: string;
  engineName: string;
  strongPoints: string[];
  weakPoints: string[];
  preferredStyle: string;
  frequentFeedback: string[];
  successPatterns: string[];
  failurePatterns: string[];
  updatedAt: string;
}

// ── 태스크 히스토리 (task_history) ────────────────────────────
export interface TaskHistory {
  id: string;
  taskId: string;
  engineName: string;
  actionType: 'create' | 'revise' | 'review' | 'save';
  inputData: Record<string, unknown>;
  outputData: Record<string, unknown>;
  feedback: string;
  resultStatus: 'pass' | 'revise' | 'fail' | 'done';
  score?: number;
  savedPaths?: { drive?: string; notion?: string };
  createdAt: string;
}

// ── 김비서 기억 (secretary_memory) ────────────────────────────
// 마감, 일정, follow-up 있는 작업만 별도 기록
// 다음 확인 날짜가 있는 항목만 장기 기억에 남김
export interface SecretaryMemory {
  id?: string;
  project?: string;
  task_summary: string;             // 무엇을 해야 하는지 한 줄
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  due_date?: string;                // YYYY-MM-DD
  next_check_date?: string;         // 다음 리마인드 날짜
  related_paths: {
    drive?: string;
    notion?: string;
  };
  created_at: string;
  updated_at: string;
}

// ── 워킹 메모리 (세션 내 임시, DB 저장 안 함) ─────────────────
export interface WorkingMemory {
  sessionId: string;
  currentProject?: string;
  currentDomain?: string;
  recentContext: string[];           // 최근 3개 교환 요약
  activeExecutionBrief?: Record<string, unknown>;
  startedAt: string;
}

// ── Supabase 테이블 이름 ───────────────────────────────────────
export const TABLES = {
  projectMemory: 'project_memory',
  engineMemory: 'engine_memory',
  taskHistory: 'task_history',
  userMemory: 'user_memory',
  secretaryMemory: 'secretary_memory',
} as const;
