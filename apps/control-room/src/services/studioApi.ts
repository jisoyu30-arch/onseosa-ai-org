// 미디어 브리지(apps/higgsfield-bridge) 호출. 브리지가 PixVerse CLI와 컷 보드 파일을 다룬다.
const BRIDGE_URL = import.meta.env.VITE_BRIDGE_URL || 'http://127.0.0.1:3002';
const BRIDGE_SECRET = import.meta.env.VITE_BRIDGE_SECRET as string | undefined;

export type MediaKind = 'image' | 'video';

export interface BridgeStatus {
  account: { credits: number; plan?: string };
  config: {
    generationEnabled: boolean;
    maxCreditsPerJob: number;
    creditReserve: number;
    policy: {
      video: { model: string; durations: number[]; qualities: string[]; defaultQuality: string; note: string };
      image: { model: string; defaultAspectRatio: string; note: string };
    };
  };
}

export interface SubmitResult {
  kind: MediaKind;
  id: number;
  status: string;
  costCredits: number | null;
  overBudget: boolean;
  idempotencyKey: string;
  model: string;
}

export interface JobState {
  state: 'pending' | 'done' | 'failed';
  url?: string;
  raw: string;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BRIDGE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(BRIDGE_SECRET ? { 'x-secret': BRIDGE_SECRET } : {}) },
    });
  } catch {
    throw new Error(`미디어 브리지에 연결할 수 없습니다 (${BRIDGE_URL}). pnpm --filter higgsfield-bridge dev 로 켜 주세요.`);
  }
  const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || body.ok === false) throw new Error(body.error || `브리지 응답 ${res.status}`);
  return body as T;
}

export async function getBridgeStatus(): Promise<BridgeStatus> {
  return call<BridgeStatus>('/media/pixverse/status');
}

export async function submitGeneration(request: {
  kind: MediaKind;
  prompt: string;
  image?: string;
  aspectRatio?: string;
  attempt: number;
}): Promise<SubmitResult> {
  // approved: true 는 사용자가 화면의 "보내기"를 눌렀을 때만 붙는다.
  const body = await call<{ result: SubmitResult }>('/media/pixverse/generate', {
    method: 'POST',
    body: JSON.stringify({ ...request, approved: true }),
  });
  return body.result;
}

export async function getJob(kind: MediaKind, id: number): Promise<JobState> {
  const body = await call<{ result: Record<string, unknown> }>(`/media/pixverse/jobs/${kind}/${id}`);
  const r = body.result;
  const code = Number(r.status_code);
  const label = String(r.status ?? '');
  const url = (r.video_url || r.image_url || r.url) as string | undefined;
  if (code === 1 || label.toLowerCase() === 'completed') return { state: 'done', url, raw: label };
  if (code === 7 || code === 8) return { state: 'failed', raw: label };
  return { state: 'pending', raw: label };
}

export async function downloadAsset(kind: MediaKind, id: number): Promise<string> {
  const body = await call<{ result: { file: string } }>(`/media/pixverse/jobs/${kind}/${id}/download`, { method: 'POST' });
  return body.result.file;
}

export async function loadBoard<T>(id: string): Promise<T | null> {
  const body = await call<{ board: T | null }>(`/studio/cutboards/${id}`);
  return body.board;
}

export async function saveBoard(id: string, board: unknown): Promise<string> {
  const body = await call<{ savedAt: string }>(`/studio/cutboards/${id}`, { method: 'PUT', body: JSON.stringify(board) });
  return body.savedAt;
}
