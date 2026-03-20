// 품질 검토 상태
export type QualityStatus =
  | "승인"
  | "조건부승인"
  | "수정필요"
  | "보류"
  | "검토중"
  | "미검토";

// AI 직원 역할
export interface Role {
  id: string;
  name: string;
  headquartersId: string;
  description: string;
  icon: string;
}

// 본부
export interface Headquarters {
  id: string;
  name: string;
  icon: string;
  color: string;
  roles: Role[];
}

// 역할 체인 (작성→검토→승인→배포)
export interface RoleChain {
  creator: string;
  reviewer: string;
  approver: string;
  publisher: string;
}

// 파이프라인
export interface Pipeline {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  headquartersId: string;
  notionParentId: string;
  roleChain: RoleChain;
  legalReview: boolean;
}

// 채팅 메시지
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  pipelineId?: string;
  timestamp: number;
}

// 파이프라인 실행 기록
export interface PipelineExecution {
  id: string;
  pipelineId: string;
  status: "pending" | "running" | "completed" | "error";
  qualityStatus: QualityStatus;
  input: string;
  output?: string;
  error?: string;
  startedAt: number;
  completedAt?: number;
  reviewNotes?: string;
}
