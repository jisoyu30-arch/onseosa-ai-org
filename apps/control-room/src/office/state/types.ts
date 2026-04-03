// ── 에이전트 ──────────────────────────────────────

export type AgentStatus = 'idle' | 'thinking' | 'writing' | 'reviewing'
                        | 'waiting' | 'blocked' | 'done' | 'in_meeting';

export type AgentExpression = 'idle' | 'focused' | 'stressed' | 'reviewing'
                            | 'celebrating' | 'error';

export interface Position { x: number; y: number }

export interface AgentEntity {
  id: string;
  name: string;
  role: string;
  color: string;

  position: Position;
  targetPosition: Position | null;
  location: 'desk' | 'lobby' | 'meeting' | 'review' | 'walking';
  homePosition: Position;

  status: AgentStatus;
  currentTaskId: string | null;
  // heldDocumentIds는 저장하지 않음 — getAgentDocuments()로 파생 조회

  expression: AgentExpression;
  speechBubble: { text: string; duration: number } | null;
}

// ── 파이프라인 ──────────────────────────────────────

export type PipelineStatus = 'queued' | 'orchestrating' | 'running' | 'review'
                           | 'blocked' | 'done' | 'failed' | 'paused';

export interface PipelineEntity {
  id: string;
  projectName: string;
  projectType: string;
  goal: string;
  status: PipelineStatus;
  priority: 'normal' | 'high' | 'urgent';
  currentStage: string;
  stages: string[];
  completedStages: string[];
  retryCount: number;
  bestScore: number;
  startedAt: number;
  eta: number | null; // MVP: 기본 예상 시간 기반, 향후 실제 실행 데이터로 보정
  error: string | null;
}

// ── 태스크 ──────────────────────────────────────

export type TaskStatus = 'queued' | 'working' | 'waiting' | 'reviewing'
                       | 'blocked' | 'done' | 'failed';

export interface TaskEntity {
  id: string;
  pipelineId: string;
  title: string;
  ownerAgentId: string;
  status: TaskStatus;
  progress: number;
  inputSummary: string | null;
  outputSummary: string | null;
  dependsOn: string[];
  blockReason: string | null;
  startedAt: number | null;
  completedAt: number | null;
  durationMs: number | null;
}

// ── 문서 (UI의 주인공) ──────────────────────────────

export type DocumentType = 'brief' | 'analysis' | 'plan' | 'draft'
                         | 'review_result' | 'media' | 'record';

export type ReviewOutcome = 'pass' | 'soft_pass' | 'reject' | null;

export interface DocumentEntity {
  id: string;
  pipelineId: string;
  type: DocumentType;
  label: string;
  currentHolder: string;
  previousHolder: string | null;
  status: 'in_progress' | 'completed' | 'rejected' | 'approved';
  reviewOutcome: ReviewOutcome;
  version: number;
  reviewScore: number | null;
  rejectReason: string | null;
  rejectFeedback: string | null;
  position: Position;
  isMoving: boolean;
  moveTarget: string | null;
}

// ── 회의 ──────────────────────────────────────

export type MeetingTrigger = 'orchestrate' | 'blocked_timeout' | 'review_reject' | 'manual';

export interface MeetingEntity {
  id: string;
  pipelineId: string;
  trigger: MeetingTrigger;
  triggerReason: string;
  calledBy: string;
  attendees: string[];
  agenda: string;
  status: 'calling' | 'in_progress' | 'concluded';
  conclusion: string | null;
  actionItems: Array<{
    agentId: string;
    action: string;
    newStatus: string;
  }>;
  startedAt: number;
  endedAt: number | null;
}

// ── 이벤트 로그 ──────────────────────────────────

export interface OfficeEvent {
  id: string;
  timestamp: number;
  type: string;
  agentId: string | null;
  documentId: string | null;
  message: string;
  data: Record<string, unknown>;
}
