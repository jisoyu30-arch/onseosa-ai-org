import { useOfficeStore } from './officeStore';
import {
  STEP_TO_DOC_TYPE, PIPELINE_STEPS,
  getNextAgent,
} from './spatialConfig';
import type { SSEEvent } from '../../services/api';

const HANDOFF_DELAY_MS = 800; // 문서 이동 애니메이션 시간

/**
 * SSE 이벤트를 받아서 officeStore 상태를 업데이트하는 규칙 엔진.
 * 모든 상태 변환은 이 함수를 통해서만 일어남.
 */
export function handleOfficeSSE(event: SSEEvent) {
  switch (event.type) {
    case 'pipeline:start':
      onPipelineStart(event);
      break;
    case 'engine:status':
      if (event.status === 'working') onEngineWorking(event);
      else if (event.status === 'idle') onEngineIdle(event);
      break;
    case 'engine:done':
      onEngineDone(event);
      break;
    case 'engine:error':
      onEngineError(event);
      break;
    case 'pipeline:retry':
      onPipelineRetry(event);
      break;
    case 'pipeline:soft_pass':
      onPipelineSoftPass(event);
      break;
    case 'pipeline:done':
      onPipelineDone(event);
      break;
    case 'pipeline:failed':
      onPipelineFailed(event);
      break;
  }
}

// ── pipeline:start ──────────────────────────────
function onPipelineStart(event: SSEEvent) {
  const store = useOfficeStore.getState();

  store.startPipeline({
    id: event.projectId || `proj_${Date.now()}`,
    projectName: (event as Record<string, unknown>).projectName as string || '프로젝트',
    projectType: (event as Record<string, unknown>).projectType as string || 'playlist',
    goal: (event as Record<string, unknown>).goal as string || '',
    priority: 'normal',
    currentStage: 'orchestrate',
    stages: ['orchestrate', ...PIPELINE_STEPS],
  });

  // 브리프 문서 생성
  store.createDocument({
    id: `doc_brief_${Date.now()}`,
    pipelineId: store.pipeline?.id || '',
    type: 'brief',
    label: '프로젝트 브리프',
    currentHolder: 'arko',
  });

  store.setAgentStatus('arko', 'thinking', '프로젝트 분석');
  store.addEvent({
    type: 'pipeline:start',
    agentId: 'arko',
    documentId: null,
    message: `파이프라인 시작: ${(event as Record<string, unknown>).projectName || ''}`,
    data: event as Record<string, unknown>,
  });
}

// ── engine:status(working) ──────────────────────
function onEngineWorking(event: SSEEvent) {
  const store = useOfficeStore.getState();
  const agentId = event.engine!;
  const step = (event as Record<string, unknown>).step as string || agentId;
  const task = event.task || '작업 중';

  store.setAgentStatus(agentId, 'writing', task);
  store.updatePipelineStage(step === 'arko' ? 'arko-review' : step);

  // 설계서 6.2: engine:status(working) 시 이전 문서를 이 에이전트에게 handoff
  const docs = store.documents.filter(d => !d.isMoving && d.currentHolder !== agentId && d.status === 'in_progress');
  if (docs.length > 0) {
    const latestDoc = docs[docs.length - 1];
    store.startDocumentHandoff(latestDoc.id, agentId);
    setTimeout(() => {
      useOfficeStore.getState().completeDocumentHandoff(latestDoc.id);
    }, HANDOFF_DELAY_MS);
  }

  // 태스크 생성
  const taskId = `task_${agentId}_${Date.now()}`;
  store.createTask({
    id: taskId,
    pipelineId: store.pipeline?.id || '',
    title: task,
    ownerAgentId: agentId,
    inputSummary: null,
    outputSummary: null,
    dependsOn: [],
  });
  store.updateTaskStatus(taskId, 'working');

  store.addEvent({
    type: 'engine:working',
    agentId,
    documentId: null,
    message: `${agentId} 작업 시작: ${task}`,
    data: { step, task },
  });
}

// ── engine:status(idle) ──────────────────────────
function onEngineIdle(event: SSEEvent) {
  const store = useOfficeStore.getState();
  const agentId = event.engine!;
  // idle로 전환은 done 핸들러에서 처리하므로 여기서는 최소 처리
  store.setAgentStatus(agentId, 'idle');
}

// ── engine:done ──────────────────────────────────
function onEngineDone(event: SSEEvent) {
  const store = useOfficeStore.getState();
  const agentId = event.engine!;
  const step = (event as Record<string, unknown>).step as string || agentId;
  const result = event.result as Record<string, unknown> | undefined;

  // 에이전트 → done (축하 표정)
  store.setAgentStatus(agentId, 'done');

  // 태스크 완료
  const task = store.tasks.find(t => t.ownerAgentId === agentId && t.status === 'working');
  if (task) {
    store.updateTaskStatus(task.id, 'done', {
      outputSummary: (result as Record<string, unknown>)?.summary as string || null,
    });
  }

  // 파이프라인 스테이지 완료
  const pipelineStep = step === 'arko' ? (store.pipeline?.currentStage === 'orchestrate' ? 'orchestrate' : 'arko-review') : step;
  store.completePipelineStage(pipelineStep);

  // arko-review 완료 시: 검수 점수를 draft 문서에 기록
  if (pipelineStep === 'arko-review' && result) {
    const score = (result as Record<string, unknown>).score as number ?? 0;
    const status = (result as Record<string, unknown>).status as string;
    const draftDoc = store.documents.find(d => d.type === 'draft' && d.status !== 'rejected');
    if (draftDoc) {
      if (score >= 75) {
        store.setDocumentReview(draftDoc.id, score, 'pass');
        store.setAgentSpeech('arko', `통과! ${score}점`, 3000);
      } else if (score >= 50) {
        // soft-pass는 pipeline:soft_pass 이벤트에서 처리
        store.setDocumentReview(draftDoc.id, score, 'soft_pass');
      } else {
        // reject는 pipeline:retry 이벤트에서 처리
        store.setDocumentReview(draftDoc.id, score, null); // 일단 점수만 기록
      }
    }

    store.addEvent({
      type: 'review:score',
      agentId: 'arko',
      documentId: draftDoc?.id || null,
      message: `검수 점수: ${score}점 (${status})`,
      data: { score, status },
    });
  }

  // 문서 생성 + handoff (검수 분기 제외 — retry/soft_pass에서 처리)
  if (step !== 'arko-review' && step !== 'orchestrate') {
    const docType = STEP_TO_DOC_TYPE[step] || 'draft';
    const docId = `doc_${docType}_${Date.now()}`;
    store.createDocument({
      id: docId,
      pipelineId: store.pipeline?.id || '',
      type: docType as DocumentEntity['type'],
      label: `${store.agents.find(a => a.id === agentId)?.name || agentId} 결과물`,
      currentHolder: agentId,
    });

    // 다음 에이전트로 handoff
    const nextAgent = getNextAgent(step);
    if (nextAgent) {
      store.startDocumentHandoff(docId, nextAgent);
      setTimeout(() => {
        store.completeDocumentHandoff(docId);
      }, HANDOFF_DELAY_MS);
    }
  }

  // 1.5초 후 idle로 복귀
  setTimeout(() => {
    const current = useOfficeStore.getState().agents.find(a => a.id === agentId);
    if (current?.status === 'done') {
      store.setAgentStatus(agentId, 'idle');
    }
  }, 1500);

  store.addEvent({
    type: 'engine:done',
    agentId,
    documentId: null,
    message: `${agentId} 완료: ${(result as Record<string, unknown>)?.summary || ''}`,
    data: { step, result: result || {} },
  });
}

// ── engine:error ──────────────────────────────────
function onEngineError(event: SSEEvent) {
  const store = useOfficeStore.getState();
  const agentId = event.engine!;

  store.setAgentStatus(agentId, 'blocked');
  store.setAgentSpeech(agentId, event.error || '오류 발생', 8000);

  store.addEvent({
    type: 'engine:error',
    agentId,
    documentId: null,
    message: `${agentId} 오류: ${event.error || ''}`,
    data: { error: event.error },
  });
}

// ── pipeline:retry (검수 반려) ────────────────────
function onPipelineRetry(event: SSEEvent) {
  const store = useOfficeStore.getState();
  const retryCount = event.retryCount as number || 1;
  const reason = event.reason as string || '';

  store.setPipelineRetry(retryCount, store.pipeline?.bestScore || 0);

  // draft 문서 반려 + 리아에게 반환
  const draftDoc = store.documents.find(d => d.type === 'draft' && d.status !== 'rejected');
  if (draftDoc) {
    store.rejectDocument(draftDoc.id, reason, reason);
    store.startDocumentHandoff(draftDoc.id, 'ria');
    setTimeout(() => {
      store.completeDocumentHandoff(draftDoc.id);
    }, HANDOFF_DELAY_MS);
  }

  // 아르코 검수존에서 빨간 마크
  store.setAgentSpeech('arko', `반려: ${reason}`, 5000);

  store.addEvent({
    type: 'pipeline:retry',
    agentId: 'arko',
    documentId: draftDoc?.id || null,
    message: `검수 반려 (${retryCount}회차): ${reason}`,
    data: { retryCount, reason },
  });
}

// ── pipeline:soft_pass ────────────────────────────
function onPipelineSoftPass(event: SSEEvent) {
  const store = useOfficeStore.getState();
  const score = (event as Record<string, unknown>).score as number || 0;
  const message = (event as Record<string, unknown>).message as string || '';

  // draft 문서 조건부 통과
  const draftDoc = store.documents.find(d => d.type === 'draft' && d.status === 'in_progress');
  if (draftDoc) {
    store.setDocumentReview(draftDoc.id, score, 'soft_pass');
  }

  store.setAgentSpeech('arko', `조건부 통과 (${score}점)`, 5000);

  store.addEvent({
    type: 'pipeline:soft_pass',
    agentId: 'arko',
    documentId: draftDoc?.id || null,
    message,
    data: { score, retryCount: (event as Record<string, unknown>).retryCount },
  });
}

// ── pipeline:done ──────────────────────────────────
function onPipelineDone(event: SSEEvent) {
  const store = useOfficeStore.getState();

  store.endPipeline('done');

  // 전체 에이전트 축하
  ['arko', 'noah', 'eden', 'ria', 'mika', 'luka'].forEach(id => {
    store.setAgentStatus(id, 'done');
  });

  // 3초 후 idle 복귀
  setTimeout(() => {
    ['arko', 'noah', 'eden', 'ria', 'mika', 'luka'].forEach(id => {
      store.setAgentStatus(id, 'idle');
    });
  }, 3000);

  store.addEvent({
    type: 'pipeline:done',
    agentId: null,
    documentId: null,
    message: '파이프라인 완료',
    data: event as Record<string, unknown>,
  });
}

// ── pipeline:failed ────────────────────────────────
function onPipelineFailed(event: SSEEvent) {
  const store = useOfficeStore.getState();
  const reason = event.reason as string || '알 수 없는 오류';

  store.endPipeline('failed', reason);

  // 전체 에이전트 blocked
  ['arko', 'noah', 'eden', 'ria', 'mika', 'luka'].forEach(id => {
    store.setAgentStatus(id, 'blocked');
  });

  store.addEvent({
    type: 'pipeline:failed',
    agentId: null,
    documentId: null,
    message: `파이프라인 실패: ${reason}`,
    data: event as Record<string, unknown>,
  });
}

// DocumentEntity import for type (사용되지 않지만 타입 참조용)
import type { DocumentEntity } from './types';
