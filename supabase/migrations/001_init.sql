-- 1. 프로젝트
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('playlist','webnovel','marketing','letterbrick')),
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning','analyzing','producing','reviewing','ready','published','paused')),
  owner TEXT NOT NULL DEFAULT '소유 작가님',
  priority INTEGER DEFAULT 2,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 프로젝트 기억
CREATE TABLE project_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  canon JSONB DEFAULT '{}',
  tone_rules TEXT[],
  banned_elements TEXT[],
  completed_tasks TEXT[],
  pending_tasks TEXT[],
  strong_patterns TEXT[],
  weak_patterns TEXT[],
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 엔진 프로필
CREATE TABLE engine_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engine_name TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  role_summary TEXT,
  preferred_model TEXT,
  prompt_version TEXT DEFAULT '1.0',
  active BOOLEAN DEFAULT true
);

-- 4. 엔진 기억
CREATE TABLE engine_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engine_name TEXT UNIQUE NOT NULL REFERENCES engine_profiles(engine_name),
  strong_points TEXT[],
  weak_points TEXT[],
  preferred_style TEXT,
  frequent_feedback TEXT[],
  success_patterns TEXT[],
  failure_patterns TEXT[],
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 태스크
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  assigned_engine TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','doing','review','revise','done','blocked','archived')),
  title TEXT NOT NULL,
  input_summary TEXT,
  output_summary TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 태스크 히스토리
CREATE TABLE task_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  engine_name TEXT,
  action_type TEXT CHECK (action_type IN ('create','revise','review','save')),
  input_data JSONB,
  output_data JSONB,
  feedback TEXT,
  result_status TEXT CHECK (result_status IN ('pass','revise','fail','done')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. 자료 허브
CREATE TABLE research_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  source_type TEXT CHECK (source_type IN ('link','image','pdf','memo')),
  title TEXT,
  summary TEXT,
  tags TEXT[],
  analyzed_by TEXT,
  reusable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. 엔진 아이디어
CREATE TABLE engine_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES research_assets(id) ON DELETE CASCADE,
  engine_name TEXT,
  idea_text TEXT NOT NULL,
  applicable_project TEXT,
  priority INTEGER DEFAULT 2,
  adopted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_project_memory_updated BEFORE UPDATE ON project_memory FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_engine_memory_updated BEFORE UPDATE ON engine_memory FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
