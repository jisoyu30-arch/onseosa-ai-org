import type { ProjectType } from '@ons/shared-types';

// 모든 엔진의 표준 입력 형식
export interface EngineInput {
  projectId: string;
  projectName: string;
  projectType: ProjectType;
  goal: string;
  assets?: string[];
  priorMemory?: {
    projectMemory?: Record<string, unknown>;
    engineMemory?: Record<string, unknown>;
  };
  upstream?: Record<string, unknown>;
}

// 모든 엔진의 표준 출력 형식
export interface EngineOutput {
  engine: string;
  status: 'pass' | 'revise' | 'fail' | 'done';
  summary: string;
  data: Record<string, unknown>;
  nextHints?: string[];
  score?: number;
}

// Claude Worker 요청
export interface WorkerPayload {
  projectId: string;
  projectName: string;
  projectType: string;
  taskType: 'analyze' | 'plan' | 'write' | 'review' | 'record' | 'orchestrate';
  instruction: string;
  context?: Record<string, unknown>;
  priorMemory?: Record<string, unknown>;
}

// Claude Worker 응답
export interface WorkerResult {
  ok: boolean;
  engine: string;
  output: EngineOutput;
  logFile?: string;
  error?: string;
}
