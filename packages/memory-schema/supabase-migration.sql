-- ONS Studio Memory Schema
-- Supabase에서 SQL Editor로 실행

-- 1. 태스크 히스토리 (이미 있을 수 있음)
CREATE TABLE IF NOT EXISTS task_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id TEXT NOT NULL,
  engine_name TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('create', 'revise', 'review', 'save')),
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  feedback TEXT DEFAULT '',
  result_status TEXT NOT NULL CHECK (result_status IN ('pass', 'revise', 'fail', 'done')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_history_engine ON task_history(engine_name);
CREATE INDEX IF NOT EXISTS idx_task_history_task ON task_history(task_id);

-- 2. 프로젝트 기억
CREATE TABLE IF NOT EXISTS project_memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT UNIQUE NOT NULL,
  canon JSONB DEFAULT '{}',
  tone_rules TEXT[] DEFAULT '{}',
  banned_elements TEXT[] DEFAULT '{}',
  completed_tasks TEXT[] DEFAULT '{}',
  pending_tasks TEXT[] DEFAULT '{}',
  strong_patterns TEXT[] DEFAULT '{}',
  weak_patterns TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_memory_pid ON project_memory(project_id);

-- 3. 엔진 기억
CREATE TABLE IF NOT EXISTS engine_memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  engine_name TEXT UNIQUE NOT NULL,
  strong_points TEXT[] DEFAULT '{}',
  weak_points TEXT[] DEFAULT '{}',
  preferred_style TEXT DEFAULT '',
  frequent_feedback TEXT[] DEFAULT '{}',
  success_patterns TEXT[] DEFAULT '{}',
  failure_patterns TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_engine_memory_name ON engine_memory(engine_name);

-- 4. RLS 정책 (service_role 키 사용 시 자동 우회됨)
ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE engine_memory ENABLE ROW LEVEL SECURITY;

-- service_role은 RLS 우회하므로 별도 정책 불필요
