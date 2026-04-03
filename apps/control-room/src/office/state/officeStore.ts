import { create } from 'zustand';
import type {
  AgentEntity, AgentStatus, AgentExpression,
  PipelineEntity, TaskEntity, DocumentEntity,
  MeetingEntity, OfficeEvent, ReviewOutcome,
} from './types';
import {
  AGENT_HOME, AGENT_COLORS, AGENT_NAMES, AGENT_ROLES,
  tileToScreen,
} from './spatialConfig';

// ── 초기 에이전트 생성 ──────────────────────────
function createInitialAgents(): AgentEntity[] {
  return ['arko', 'noah', 'eden', 'ria', 'mika', 'luka'].map(id => {
    const home = AGENT_HOME[id];
    return {
      id,
      name: AGENT_NAMES[id],
      role: AGENT_ROLES[id],
      color: AGENT_COLORS[id],
      position: tileToScreen(home.x, home.y),
      targetPosition: null,
      location: 'desk' as const,
      homePosition: tileToScreen(home.x, home.y),
      status: 'idle' as AgentStatus,
      currentTaskId: null,
      expression: 'idle' as AgentExpression,
      speechBubble: null,
    };
  });
}

// ── 상태 → 표정 매핑 ──────────────────────────
const STATUS_TO_EXPRESSION: Record<AgentStatus, AgentExpression> = {
  idle: 'idle',
  thinking: 'focused',
  writing: 'focused',
  reviewing: 'reviewing',
  waiting: 'idle',
  blocked: 'error',
  done: 'celebrating',
  in_meeting: 'focused',
};

// ── Store 타입 ──────────────────────────────────
interface OfficeState {
  agents: AgentEntity[];
  pipeline: PipelineEntity | null;
  tasks: TaskEntity[];
  documents: DocumentEntity[];
  meetings: MeetingEntity[];
  events: OfficeEvent[];
  paused: boolean;

  // 에이전트 조작
  setAgentStatus: (id: string, status: AgentStatus, task?: string) => void;
  setAgentSpeech: (id: string, text: string | null, duration?: number) => void;
  moveAgentTo: (id: string, target: { x: number; y: number }, location: AgentEntity['location']) => void;
  returnAgentHome: (id: string) => void;

  // 파이프라인 조작
  startPipeline: (pipeline: Omit<PipelineEntity, 'status' | 'completedStages' | 'retryCount' | 'bestScore' | 'startedAt' | 'eta' | 'error'>) => void;
  updatePipelineStage: (stage: string) => void;
  completePipelineStage: (stage: string) => void;
  setPipelineStatus: (status: PipelineEntity['status']) => void;
  setPipelineRetry: (retryCount: number, bestScore: number) => void;
  endPipeline: (status: 'done' | 'failed', error?: string) => void;
  togglePause: () => void;

  // 태스크 조작
  createTask: (task: Omit<TaskEntity, 'status' | 'progress' | 'startedAt' | 'completedAt' | 'durationMs' | 'blockReason'>) => void;
  updateTaskStatus: (taskId: string, status: TaskEntity['status'], extra?: Partial<TaskEntity>) => void;

  // 문서 조작 (소유권은 completeDocumentHandoff에서만 변경)
  createDocument: (doc: Pick<DocumentEntity, 'id' | 'pipelineId' | 'type' | 'label' | 'currentHolder'>) => void;
  startDocumentHandoff: (docId: string, toAgentId: string) => void;
  completeDocumentHandoff: (docId: string) => void;
  setDocumentReview: (docId: string, score: number, outcome: ReviewOutcome, feedback?: string) => void;
  rejectDocument: (docId: string, reason: string, feedback: string) => void;

  // 이벤트 로그
  addEvent: (event: Omit<OfficeEvent, 'id' | 'timestamp'>) => void;

  // 파생값
  getAgentDocuments: (agentId: string) => DocumentEntity[];

  // 리셋
  reset: () => void;
}

let eventCounter = 0;

export const useOfficeStore = create<OfficeState>((set, get) => ({
  agents: createInitialAgents(),
  pipeline: null,
  tasks: [],
  documents: [],
  meetings: [],
  events: [],
  paused: false,

  // ── 에이전트 ──────────────────────────────────
  setAgentStatus(id, status, task) {
    set(state => ({
      agents: state.agents.map(a =>
        a.id === id ? {
          ...a,
          status,
          expression: STATUS_TO_EXPRESSION[status],
          currentTaskId: task ? `task_${id}_${Date.now()}` : a.currentTaskId,
        } : a
      ),
    }));
  },

  setAgentSpeech(id, text, duration = 5000) {
    set(state => ({
      agents: state.agents.map(a =>
        a.id === id ? { ...a, speechBubble: text ? { text, duration } : null } : a
      ),
    }));
    if (text) {
      setTimeout(() => {
        set(state => ({
          agents: state.agents.map(a =>
            a.id === id && a.speechBubble?.text === text ? { ...a, speechBubble: null } : a
          ),
        }));
      }, duration);
    }
  },

  moveAgentTo(id, target, location) {
    set(state => ({
      agents: state.agents.map(a =>
        a.id === id ? { ...a, targetPosition: target, location } : a
      ),
    }));
  },

  returnAgentHome(id) {
    const agent = get().agents.find(a => a.id === id);
    if (agent) {
      set(state => ({
        agents: state.agents.map(a =>
          a.id === id ? { ...a, targetPosition: a.homePosition, location: 'desk' } : a
        ),
      }));
    }
  },

  // ── 파이프라인 ──────────────────────────────────
  startPipeline(p) {
    set({
      pipeline: {
        ...p,
        status: 'orchestrating',
        completedStages: [],
        retryCount: 0,
        bestScore: 0,
        startedAt: Date.now(),
        eta: null,
        error: null,
      },
      tasks: [],
      documents: [],
      meetings: [],
    });
  },

  updatePipelineStage(stage) {
    set(state => ({
      pipeline: state.pipeline ? { ...state.pipeline, currentStage: stage, status: 'running' } : null,
    }));
  },

  completePipelineStage(stage) {
    set(state => ({
      pipeline: state.pipeline ? {
        ...state.pipeline,
        completedStages: [...state.pipeline.completedStages, stage],
      } : null,
    }));
  },

  setPipelineStatus(status) {
    set(state => ({
      pipeline: state.pipeline ? { ...state.pipeline, status } : null,
    }));
  },

  setPipelineRetry(retryCount, bestScore) {
    set(state => ({
      pipeline: state.pipeline ? { ...state.pipeline, retryCount, bestScore, status: 'review' } : null,
    }));
  },

  endPipeline(status, error) {
    set(state => ({
      pipeline: state.pipeline ? { ...state.pipeline, status, error: error || null } : null,
    }));
  },

  togglePause() {
    set(state => ({
      paused: !state.paused,
      pipeline: state.pipeline ? {
        ...state.pipeline,
        status: state.paused ? 'running' : 'paused',
      } : null,
    }));
  },

  // ── 태스크 ──────────────────────────────────
  createTask(task) {
    set(state => ({
      tasks: [...state.tasks, {
        ...task,
        status: 'queued',
        progress: 0,
        startedAt: null,
        completedAt: null,
        durationMs: null,
        blockReason: null,
      }],
    }));
  },

  updateTaskStatus(taskId, status, extra) {
    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === taskId ? {
          ...t,
          status,
          ...(status === 'working' ? { startedAt: Date.now() } : {}),
          ...(status === 'done' ? { completedAt: Date.now(), progress: 100, durationMs: t.startedAt ? Date.now() - t.startedAt : null } : {}),
          ...extra,
        } : t
      ),
    }));
  },

  // ── 문서 ──────────────────────────────────
  createDocument(doc) {
    set(state => ({
      documents: [...state.documents, {
        ...doc,
        previousHolder: null,
        status: 'in_progress',
        reviewOutcome: null,
        version: 1,
        reviewScore: null,
        rejectReason: null,
        rejectFeedback: null,
        position: get().agents.find(a => a.id === doc.currentHolder)?.position || { x: 0, y: 0 },
        isMoving: false,
        moveTarget: null,
      }],
    }));
  },

  startDocumentHandoff(docId, toAgentId) {
    set(state => ({
      documents: state.documents.map(d =>
        d.id === docId ? { ...d, isMoving: true, moveTarget: toAgentId } : d
      ),
    }));
  },

  completeDocumentHandoff(docId) {
    set(state => ({
      documents: state.documents.map(d =>
        d.id === docId && d.moveTarget
          ? {
              ...d,
              previousHolder: d.currentHolder,
              currentHolder: d.moveTarget,
              isMoving: false,
              moveTarget: null,
              position: get().agents.find(a => a.id === d.moveTarget)?.position || d.position,
            }
          : d
      ),
    }));
  },

  setDocumentReview(docId, score, outcome, feedback) {
    set(state => ({
      documents: state.documents.map(d =>
        d.id === docId ? {
          ...d,
          reviewScore: score,
          reviewOutcome: outcome,
          status: outcome === 'reject' ? 'rejected' : 'approved',
          ...(feedback ? { rejectFeedback: feedback } : {}),
        } : d
      ),
    }));
  },

  rejectDocument(docId, reason, feedback) {
    set(state => ({
      documents: state.documents.map(d =>
        d.id === docId ? {
          ...d,
          status: 'rejected',
          reviewOutcome: 'reject',
          rejectReason: reason,
          rejectFeedback: feedback,
          version: d.version + 1,
        } : d
      ),
    }));
  },

  // ── 이벤트 로그 ──────────────────────────────
  addEvent(event) {
    set(state => ({
      events: [...state.events.slice(-99), {
        ...event,
        id: `evt_${++eventCounter}`,
        timestamp: Date.now(),
      }],
    }));
  },

  // ── 파생값 ──────────────────────────────────
  getAgentDocuments(agentId) {
    return get().documents.filter(d => d.currentHolder === agentId && !d.isMoving);
  },

  // ── 리셋 ──────────────────────────────────
  reset() {
    set({
      agents: createInitialAgents(),
      pipeline: null,
      tasks: [],
      documents: [],
      meetings: [],
      events: [],
      paused: false,
    });
  },
}));
