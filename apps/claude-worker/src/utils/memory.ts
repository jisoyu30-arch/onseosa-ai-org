import { getSupabase } from './supabase';
import type {
  ProjectMemory, EngineMemory, UserMemory, SecretaryMemory, WorkingMemory
} from '@ons/memory-schema';
import { TABLES } from '@ons/memory-schema';

// ── 세션 내 워킹 메모리 (DB 미저장) ──────────────────────────
const _working: Map<string, WorkingMemory> = new Map();

export function getWorkingMemory(sessionId: string): WorkingMemory | null {
  return _working.get(sessionId) || null;
}

export function setWorkingMemory(sessionId: string, mem: Partial<WorkingMemory>) {
  const existing = _working.get(sessionId) || {
    sessionId,
    recentContext: [],
    startedAt: new Date().toISOString(),
  };
  _working.set(sessionId, { ...existing, ...mem });
}

// ── 사용자 기억 ───────────────────────────────────────────────

export async function getUserMemory(): Promise<UserMemory | null> {
  try {
    const { data } = await getSupabase()
      .from(TABLES.userMemory)
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    if (!data) return null;
    return {
      id: data.id,
      preferred_domains: data.preferred_domains || [],
      preferred_tone: data.preferred_tone || '',
      preferred_format: data.preferred_format || '',
      recurring_constraints: data.recurring_constraints || [],
      style_notes: data.style_notes || '',
      updated_at: data.updated_at,
    };
  } catch { return null; }
}

export async function upsertUserMemory(mem: Partial<UserMemory>) {
  const row = {
    preferred_domains: mem.preferred_domains || [],
    preferred_tone: mem.preferred_tone || '',
    preferred_format: mem.preferred_format || '',
    recurring_constraints: mem.recurring_constraints || [],
    style_notes: mem.style_notes || '',
    updated_at: new Date().toISOString(),
  };
  const { error } = await getSupabase()
    .from(TABLES.userMemory)
    .upsert(row);
  if (error) console.warn('[Memory] User upsert failed:', error.message);
}

// ── 아르코 메모리 읽기 ────────────────────────────────────────
// 작업 시작 전 user_memory + project_memory + 최근 task_history 3개 로드

export async function readArkoMemory(projectName?: string): Promise<{
  user: UserMemory | null;
  project: ProjectMemory | null;
  recentTasks: Array<Record<string, unknown>>;
}> {
  const [user, project, tasks] = await Promise.all([
    getUserMemory(),
    projectName ? getProjectMemory(projectName) : Promise.resolve(null),
    getRecentTaskHistory(3),
  ]);
  return { user, project, recentTasks: tasks };
}

// ── 아르코 메모리 쓰기 ────────────────────────────────────────
// 작업 종료 후 task_history + project_memory 업데이트

export async function writeArkoMemory(params: {
  projectName: string;
  taskSummary: string;
  domain: string;
  status: 'pass' | 'revise' | 'fail' | 'done';
  score?: number;
  savedPaths?: { drive?: string; notion?: string };
  nextAction?: string;
  confirmedFacts?: string[];
}) {
  const now = new Date().toISOString();

  // project_memory 업데이트
  const existing = await getProjectMemory(params.projectName);
  const completed = existing?.completedTasks || [];
  const pending = existing?.pendingTasks || [];

  await upsertProjectMemory({
    projectId: params.projectName,
    completedTasks: [...completed, `[${now.slice(0,10)}] ${params.taskSummary}`].slice(-20),
    pendingTasks: pending.filter(t => !t.includes(params.taskSummary)),
    latestStatus: `${params.status} (${params.score ?? '-'}점) — ${now.slice(0,10)}`,
    nextAction: params.nextAction || '',
    savedPaths: params.savedPaths || {},
    ...(existing ? {
      canon: existing.canon,
      toneRules: existing.toneRules,
      bannedElements: existing.bannedElements,
      strongPatterns: existing.strongPatterns,
      weakPatterns: existing.weakPatterns,
    } : {}),
  });
}

// ── 최근 task_history ─────────────────────────────────────────

export async function getRecentTaskHistory(limit = 3): Promise<Array<Record<string, unknown>>> {
  try {
    const { data } = await getSupabase()
      .from(TABLES.taskHistory)
      .select('task_id, engine_name, result_status, feedback, output_data, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data || []) as Array<Record<string, unknown>>;
  } catch { return []; }
}

// ── 프로젝트 기억 ─────────────────────────────────────────────

export async function getProjectMemory(projectId: string): Promise<ProjectMemory | null> {
  try {
    const { data } = await getSupabase()
      .from(TABLES.projectMemory)
      .select('*')
      .eq('project_id', projectId)
      .single();
    return data ? mapProjectMemory(data) : null;
  } catch { return null; }
}

export async function upsertProjectMemory(memory: Partial<ProjectMemory> & { projectId: string }) {
  const row = {
    project_id: memory.projectId,
    canon: memory.canon || {},
    tone_rules: memory.toneRules || [],
    banned_elements: memory.bannedElements || [],
    completed_tasks: memory.completedTasks || [],
    pending_tasks: memory.pendingTasks || [],
    strong_patterns: memory.strongPatterns || [],
    weak_patterns: memory.weakPatterns || [],
    latest_status: (memory as Record<string, unknown>).latestStatus || '',
    next_action: (memory as Record<string, unknown>).nextAction || '',
    saved_paths: (memory as Record<string, unknown>).savedPaths || {},
    updated_at: new Date().toISOString(),
  };
  const { error } = await getSupabase()
    .from(TABLES.projectMemory)
    .upsert(row, { onConflict: 'project_id' });
  if (error) console.warn('[Memory] Project upsert failed:', error.message);
}

// ── 엔진 기억 ─────────────────────────────────────────────────

export async function getEngineMemory(engineName: string): Promise<EngineMemory | null> {
  try {
    const { data } = await getSupabase()
      .from(TABLES.engineMemory)
      .select('*')
      .eq('engine_name', engineName)
      .single();
    return data ? mapEngineMemory(data) : null;
  } catch { return null; }
}

export async function upsertEngineMemory(memory: Partial<EngineMemory> & { engineName: string }) {
  const row = {
    engine_name: memory.engineName,
    strong_points: memory.strongPoints || [],
    weak_points: memory.weakPoints || [],
    preferred_style: memory.preferredStyle || '',
    frequent_feedback: memory.frequentFeedback || [],
    success_patterns: memory.successPatterns || [],
    failure_patterns: memory.failurePatterns || [],
    updated_at: new Date().toISOString(),
  };
  const { error } = await getSupabase()
    .from(TABLES.engineMemory)
    .upsert(row, { onConflict: 'engine_name' });
  if (error) console.warn('[Memory] Engine upsert failed:', error.message);
}

// ── 김비서 메모리 ─────────────────────────────────────────────
// 마감/일정/follow-up 있는 작업만 저장. 다음 확인 날짜 있는 것만 유지.

export async function getSecretaryMemory(
  status?: SecretaryMemory['status']
): Promise<SecretaryMemory[]> {
  try {
    let query = getSupabase()
      .from(TABLES.secretaryMemory)
      .select('*')
      .neq('status', 'completed')        // 완료 항목 제외
      .order('due_date', { ascending: true, nullsFirst: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data } = await query.limit(20);
    return (data || []).map(mapSecretaryMemory);
  } catch { return []; }
}

export async function upsertSecretaryMemory(mem: Omit<SecretaryMemory, 'created_at' | 'updated_at'> & { id?: string }) {
  // due_date도 next_check_date도 없으면 저장 의미 없음 → 건너뜀
  if (!mem.due_date && !mem.next_check_date) {
    console.log('[Secretary] 일정 없는 항목 — 장기 기억 저장 건너뜀');
    return;
  }
  const now = new Date().toISOString();
  const row = {
    ...(mem.id ? { id: mem.id } : {}),
    project: mem.project || null,
    task_summary: mem.task_summary,
    status: mem.status,
    due_date: mem.due_date || null,
    next_check_date: mem.next_check_date || null,
    related_paths: mem.related_paths || {},
    created_at: now,
    updated_at: now,
  };
  const { error } = await getSupabase()
    .from(TABLES.secretaryMemory)
    .upsert(row);
  if (error) console.warn('[Secretary] Memory upsert failed:', error.message);
}

export async function completeSecretaryTask(id: string) {
  const { error } = await getSupabase()
    .from(TABLES.secretaryMemory)
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) console.warn('[Secretary] Status update failed:', error.message);
}

// ── 태스크 히스토리에서 학습 ──────────────────────────────────

export async function learnFromHistory(engineName: string, limit = 20) {
  const { data: rows } = await getSupabase()
    .from(TABLES.taskHistory)
    .select('*')
    .eq('engine_name', engineName)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!rows?.length) return null;

  const passes = rows.filter((r: Record<string, unknown>) => r.result_status === 'pass' || r.result_status === 'done');
  const fails = rows.filter((r: Record<string, unknown>) => r.result_status === 'fail' || r.result_status === 'revise');
  const feedbacks = rows
    .map((r: Record<string, unknown>) => r.feedback as string)
    .filter(Boolean);

  return {
    totalTasks: rows.length,
    passRate: passes.length / rows.length,
    recentFeedback: feedbacks.slice(0, 5),
    failCount: fails.length,
  };
}

// ── DB 행 → 인터페이스 변환 ───────────────────────────────────

function mapProjectMemory(row: Record<string, unknown>): ProjectMemory {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    canon: (row.canon as Record<string, unknown>) || {},
    toneRules: (row.tone_rules as string[]) || [],
    bannedElements: (row.banned_elements as string[]) || [],
    completedTasks: (row.completed_tasks as string[]) || [],
    pendingTasks: (row.pending_tasks as string[]) || [],
    strongPatterns: (row.strong_patterns as string[]) || [],
    weakPatterns: (row.weak_patterns as string[]) || [],
    latestStatus: (row.latest_status as string) || '',
    nextAction: (row.next_action as string) || '',
    savedPaths: (row.saved_paths as { drive?: string; notion?: string }) || {},
    updatedAt: row.updated_at as string,
  };
}

function mapEngineMemory(row: Record<string, unknown>): EngineMemory {
  return {
    id: row.id as string,
    engineName: row.engine_name as string,
    strongPoints: (row.strong_points as string[]) || [],
    weakPoints: (row.weak_points as string[]) || [],
    preferredStyle: (row.preferred_style as string) || '',
    frequentFeedback: (row.frequent_feedback as string[]) || [],
    successPatterns: (row.success_patterns as string[]) || [],
    failurePatterns: (row.failure_patterns as string[]) || [],
    updatedAt: row.updated_at as string,
  };
}

function mapSecretaryMemory(row: Record<string, unknown>): SecretaryMemory {
  return {
    id: row.id as string,
    project: (row.project as string) || undefined,
    task_summary: row.task_summary as string,
    status: row.status as SecretaryMemory['status'],
    due_date: (row.due_date as string) || undefined,
    next_check_date: (row.next_check_date as string) || undefined,
    related_paths: (row.related_paths as { drive?: string; notion?: string }) || {},
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}
