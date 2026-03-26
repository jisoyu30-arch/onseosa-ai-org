const WORKER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export async function runPipeline(payload: {
  projectName: string;
  projectType: string;
  goal: string;
}) {
  const res = await fetch(`${WORKER_URL}/pipeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('파이프라인 실행 실패');
  return res.json();
}

export async function runSingleEngine(payload: {
  projectId: string;
  projectName: string;
  projectType: string;
  taskType: string;
  instruction: string;
  context?: Record<string, unknown>;
}) {
  const res = await fetch(`${WORKER_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('엔진 실행 실패');
  return res.json();
}

export type SSEEvent = {
  type: string;
  engine?: string;
  status?: string;
  task?: string;
  step?: string;
  result?: unknown;
  error?: string;
  projectId?: string;
  retryCount?: number;
  reason?: string;
  results?: Record<string, unknown>;
};

export function connectSSE(
  onEvent: (event: SSEEvent) => void,
  onError?: (err: Event) => void,
): EventSource {
  const es = new EventSource(`${WORKER_URL}/events`);

  es.onmessage = (e) => {
    try {
      onEvent({ type: 'message', ...JSON.parse(e.data) });
    } catch { /* ignore */ }
  };

  const eventTypes = ['engine:status', 'engine:done', 'engine:error', 'pipeline:start', 'pipeline:done', 'pipeline:retry'];
  for (const type of eventTypes) {
    es.addEventListener(type, (e: MessageEvent) => {
      try {
        onEvent({ type, ...JSON.parse(e.data) });
      } catch { /* ignore */ }
    });
  }

  es.onerror = (e) => onError?.(e);
  return es;
}
