import { getSupabase } from './supabase';
import type { ProjectMemory, EngineMemory } from '@ons/memory-schema';
import { TABLES } from '@ons/memory-schema';

// ── 프로젝트 기억 ──

export async function getProjectMemory(projectId: string): Promise<ProjectMemory | null> {
  const { data } = await getSupabase()
    .from(TABLES.projectMemory)
    .select('*')
    .eq('project_id', projectId)
    .single();
  return data ? mapProjectMemory(data) : null;
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
    updated_at: new Date().toISOString(),
  };

  const { error } = await getSupabase()
    .from(TABLES.projectMemory)
    .upsert(row, { onConflict: 'project_id' });

  if (error) console.warn('[Memory] Project upsert failed:', error.message);
}

// ── 엔진 기억 ──

export async function getEngineMemory(engineName: string): Promise<EngineMemory | null> {
  const { data } = await getSupabase()
    .from(TABLES.engineMemory)
    .select('*')
    .eq('engine_name', engineName)
    .single();
  return data ? mapEngineMemory(data) : null;
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

// ── 태스크 히스토리에서 학습 ──

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

// ── DB 행 → 인터페이스 변환 ──

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
