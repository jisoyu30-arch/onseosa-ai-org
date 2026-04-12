// Pipeline run persistence layer (localStorage)

export interface PipelineStepRecord {
  step: number;
  title: string;
  status: string;
  result?: string;
  error?: string;
  agent?: string;
  content?: string;
}

export interface PipelineRun {
  id: string;
  pipelineType: string;
  pipelineLabel: string;
  projectName: string;
  inputs: Record<string, string | number>;
  steps: PipelineStepRecord[];
  status: "running" | "completed" | "failed" | "partial";
  createdAt: string;
  completedAt?: string;
  color: string;
  icon: string;
}

const STORAGE_KEY = "onseosa-pipeline-runs";

export function generateRunId(): string {
  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getAllRuns(): PipelineRun[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRun(run: PipelineRun): void {
  if (typeof window === "undefined") return;
  const runs = getAllRuns();
  const idx = runs.findIndex((r) => r.id === run.id);
  if (idx >= 0) {
    runs[idx] = run;
  } else {
    runs.unshift(run); // newest first
  }
  // Keep max 100 runs to avoid localStorage overflow
  const trimmed = runs.slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function getRun(id: string): PipelineRun | null {
  return getAllRuns().find((r) => r.id === id) || null;
}

export function updateRunSteps(id: string, steps: PipelineStepRecord[], status?: PipelineRun["status"]): void {
  const runs = getAllRuns();
  const idx = runs.findIndex((r) => r.id === id);
  if (idx >= 0) {
    runs[idx].steps = steps;
    if (status) {
      runs[idx].status = status;
      if (status === "completed" || status === "failed") {
        runs[idx].completedAt = new Date().toISOString();
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
  }
}

export function deleteRun(id: string): void {
  const runs = getAllRuns().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
}

export function getRunsByProject(): Record<string, PipelineRun[]> {
  const runs = getAllRuns();
  const grouped: Record<string, PipelineRun[]> = {};
  for (const run of runs) {
    const key = run.projectName || "미분류";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(run);
  }
  return grouped;
}
