-- 온서사 장기 기억 스키마 v1
-- 실행: Supabase SQL 에디터에서 이 파일 전체 실행

-- ── 1. user_memory ─────────────────────────────────────────────
-- 사용자 고정 선호, 자주 쓰는 형식/톤, 반복 제약 조건
CREATE TABLE IF NOT EXISTS user_memory (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  preferred_domains      text[]   NOT NULL DEFAULT '{}',
  preferred_tone         text     NOT NULL DEFAULT '',
  preferred_format       text     NOT NULL DEFAULT '',
  recurring_constraints  text[]   NOT NULL DEFAULT '{}',
  style_notes            text     NOT NULL DEFAULT '',
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- ── 2. secretary_memory ───────────────────────────────────────
-- 마감/일정/follow-up 있는 작업만 기록
-- due_date 또는 next_check_date 없는 항목은 저장 불필요
CREATE TABLE IF NOT EXISTS secretary_memory (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project           text,                        -- 관련 프로젝트 (없으면 전역)
  task_summary      text     NOT NULL,
  status            text     NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'in_progress', 'completed', 'on_hold')),
  due_date          date,
  next_check_date   date,
  related_paths     jsonb    NOT NULL DEFAULT '{}',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_secretary_status ON secretary_memory(status);
CREATE INDEX IF NOT EXISTS idx_secretary_due    ON secretary_memory(due_date);

-- ── 3. project_memory 컬럼 추가 (기존 테이블 확장) ───────────
ALTER TABLE project_memory
  ADD COLUMN IF NOT EXISTS latest_status  text    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS next_action    text    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS saved_paths    jsonb   NOT NULL DEFAULT '{}';

-- ── 4. task_history 컬럼 추가 (기존 테이블 확장) ─────────────
ALTER TABLE task_history
  ADD COLUMN IF NOT EXISTS score        integer,
  ADD COLUMN IF NOT EXISTS saved_paths  jsonb NOT NULL DEFAULT '{}';

-- ── 인덱스 ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_task_history_created ON task_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_memory_updated ON project_memory(updated_at DESC);
