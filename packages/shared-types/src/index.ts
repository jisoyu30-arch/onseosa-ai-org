// 태스크 상태값
export type TaskStatus = 'todo' | 'doing' | 'review' | 'revise' | 'done' | 'blocked' | 'archived';

// 엔진 상태값
export type EngineStatus = 'idle' | 'working' | 'waiting' | 'needs_input' | 'reporting';

// 프로젝트 상태값
export type ProjectStatus = 'planning' | 'analyzing' | 'producing' | 'reviewing' | 'ready' | 'published' | 'paused';

// 프로젝트 타입
export type ProjectType = 'playlist' | 'webnovel' | 'marketing' | 'letterbrick';

// 태스크 타입
export type TaskType = 'analyze' | 'plan' | 'write' | 'review' | 'record' | 'orchestrate';

// 엔진 이름
export type EngineName = 'seo' | 'baek' | 'ahn' | 'han' | 'hong';

// 엔진 정보
export interface EngineProfile {
  id: string;
  engineName: EngineName;
  department: string;
  roleSummary: string;
  preferredModel: string;
  promptVersion: string;
  active: boolean;
}

// 프로젝트
export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  owner: string;
  priority: number;
  goal: string;
  createdAt: string;
  updatedAt: string;
}

// 태스크
export interface Task {
  id: string;
  projectId: string;
  assignedEngine: EngineName;
  status: TaskStatus;
  title: string;
  inputSummary: string;
  outputSummary: string;
  score?: number;
  createdAt: string;
  updatedAt: string;
}
