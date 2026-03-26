// 프로젝트 기억
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
  updatedAt: string;
}

// 엔진 기억
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

// 태스크 히스토리
export interface TaskHistory {
  id: string;
  taskId: string;
  engineName: string;
  actionType: 'create' | 'revise' | 'review' | 'save';
  inputData: Record<string, unknown>;
  outputData: Record<string, unknown>;
  feedback: string;
  resultStatus: 'pass' | 'revise' | 'fail' | 'done';
  createdAt: string;
}
