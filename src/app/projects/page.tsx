"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllRuns, deleteRun, PipelineRun } from "@/lib/projectStore";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: "완료", color: "#2E6B4F", bg: "rgba(46,107,79,0.1)" },
  running:   { label: "진행 중", color: "#C8551F", bg: "rgba(200,85,31,0.1)" },
  failed:    { label: "실패", color: "#C81E1E", bg: "rgba(200,30,30,0.1)" },
  partial:   { label: "부분 완료", color: "#8A6B2E", bg: "rgba(138,107,46,0.1)" },
};

export default function ProjectsPage() {
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setRuns(getAllRuns());
  }, []);

  const handleDelete = (id: string) => {
    deleteRun(id);
    setRuns(getAllRuns());
  };

  // Group by project
  const grouped: Record<string, PipelineRun[]> = {};
  for (const run of runs) {
    const key = run.projectName || "미분류";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(run);
  }

  // Sort projects by most recent activity
  const projectNames = Object.keys(grouped).sort((a, b) => {
    const aTime = new Date(grouped[a][0]?.createdAt || 0).getTime();
    const bTime = new Date(grouped[b][0]?.createdAt || 0).getTime();
    return bTime - aTime;
  });

  // Filter
  const filteredProjects = projectNames.filter((name) => {
    if (filter === "all") return true;
    return grouped[name].some((r) => r.status === filter);
  });

  const totalRuns = runs.length;
  const completedRuns = runs.filter((r) => r.status === "completed").length;
  const failedRuns = runs.filter((r) => r.status === "failed").length;
  const runningRuns = runs.filter((r) => r.status === "running").length;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" }) + " " +
           d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--paper)" }}>
      {/* Header */}
      <div style={{ background: "var(--charcoal)", padding: "1.2rem 2rem", display: "flex", alignItems: "center", gap: "1rem", borderBottom: "3px solid #7B5EA7" }}>
        <Link href="/" style={{ color: "var(--smoke)", textDecoration: "none", fontSize: "1.2rem", padding: "0.2rem 0.5rem" }}>←</Link>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7B5EA7", flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 500, color: "var(--ivory)", fontSize: "0.95rem" }}>프로젝트 트래커</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--smoke)", textTransform: "uppercase" }}>
            Project Tracker — Pipeline History
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "2rem", maxWidth: 1000, margin: "0 auto", width: "100%" }}>
        {/* Stats row */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { label: "프로젝트", val: `${projectNames.length}개`, color: "var(--charcoal)" },
            { label: "총 실행", val: `${totalRuns}회`, color: "var(--charcoal)" },
            { label: "완료", val: `${completedRuns}`, color: "#2E6B4F" },
            { label: "진행 중", val: `${runningRuns}`, color: "#C8551F" },
            { label: "실패", val: `${failedRuns}`, color: "#C81E1E" },
          ].map((s) => (
            <div key={s.label} style={{ padding: "0.6rem 1rem", background: "white", border: "1px solid rgba(36,35,32,0.08)", borderRadius: 8, minWidth: 80 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.55rem", letterSpacing: "0.12em", color: "var(--smoke)", textTransform: "uppercase" }}>{s.label}</div>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "1rem", fontWeight: 500, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem" }}>
          {[
            { key: "all", label: "전체" },
            { key: "completed", label: "완료" },
            { key: "running", label: "진행 중" },
            { key: "failed", label: "실패" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "0.35rem 0.8rem", borderRadius: 20, fontSize: "0.7rem",
                fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", cursor: "pointer",
                border: filter === f.key ? "1.5px solid #7B5EA7" : "1px solid rgba(36,35,32,0.12)",
                background: filter === f.key ? "rgba(123,94,167,0.08)" : "white",
                color: filter === f.key ? "#7B5EA7" : "var(--smoke)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--smoke)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.3 }}>📋</div>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
              {runs.length === 0 ? "아직 실행된 파이프라인이 없습니다" : "해당 조건의 프로젝트가 없습니다"}
            </div>
            <Link href="/pipeline" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#7B5EA7" }}>
              파이프라인으로 이동 →
            </Link>
          </div>
        )}

        {/* Project list */}
        {filteredProjects.map((projectName) => {
          const projectRuns = grouped[projectName];
          const isExpanded = expandedProject === projectName;
          const latestRun = projectRuns[0];
          const completedCount = projectRuns.filter((r) => r.status === "completed").length;

          return (
            <div key={projectName} style={{ marginBottom: "0.5rem", background: "white", border: "1px solid rgba(36,35,32,0.08)", borderRadius: 10, overflow: "hidden" }}>
              {/* Project header */}
              <button
                onClick={() => setExpandedProject(isExpanded ? null : projectName)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "0.8rem",
                  padding: "0.9rem 1.2rem", background: "none", border: "none",
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: isExpanded ? "#7B5EA7" : "var(--smoke)", transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "none" }}>▶</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "0.9rem", fontWeight: 500, color: "var(--charcoal)" }}>{projectName}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", color: "var(--smoke)", marginTop: "0.1rem" }}>
                    {projectRuns.length}회 실행 · {completedCount} 완료 · 최근 {formatDate(latestRun.createdAt)}
                  </div>
                </div>
                {/* Pipeline type badges */}
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  {[...new Set(projectRuns.map((r) => r.pipelineLabel))].map((label) => (
                    <span key={label} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.55rem", padding: "0.12rem 0.4rem", borderRadius: 10, background: "rgba(36,35,32,0.04)", color: "var(--smoke)" }}>
                      {label}
                    </span>
                  ))}
                </div>
              </button>

              {/* Expanded: run list */}
              {isExpanded && (
                <div style={{ borderTop: "1px solid rgba(36,35,32,0.06)" }}>
                  {projectRuns.map((run) => {
                    const sc = STATUS_CONFIG[run.status] || STATUS_CONFIG.partial;
                    const doneSteps = run.steps.filter((s) => s.status === "done").length;
                    const totalSteps = run.steps.length;
                    const isRunExpanded = expandedRun === run.id;

                    return (
                      <div key={run.id} style={{ borderBottom: "1px solid rgba(36,35,32,0.04)" }}>
                        <button
                          onClick={() => setExpandedRun(isRunExpanded ? null : run.id)}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: "0.6rem",
                            padding: "0.7rem 1.2rem 0.7rem 2.5rem", background: isRunExpanded ? "rgba(36,35,32,0.02)" : "none",
                            border: "none", cursor: "pointer", textAlign: "left",
                          }}
                        >
                          <span style={{ fontSize: "0.8rem" }}>{run.icon}</span>
                          <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.78rem", flex: 1, color: "var(--charcoal)" }}>
                            {run.pipelineLabel}
                          </span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--smoke)" }}>{formatDate(run.createdAt)}</span>

                          {/* Progress bar */}
                          {totalSteps > 0 && (
                            <div style={{ width: 60, height: 4, background: "rgba(36,35,32,0.08)", borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ width: `${(doneSteps / totalSteps) * 100}%`, height: "100%", background: sc.color, borderRadius: 2, transition: "width 0.3s" }} />
                            </div>
                          )}
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.55rem", color: "var(--smoke)" }}>{doneSteps}/{totalSteps}</span>

                          <span style={{ fontSize: "0.55rem", padding: "0.12rem 0.4rem", borderRadius: 10, background: sc.bg, color: sc.color, fontFamily: "'DM Sans', sans-serif" }}>
                            {sc.label}
                          </span>

                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(run.id); }}
                            title="삭제"
                            style={{ background: "none", border: "none", color: "var(--smoke-2)", cursor: "pointer", fontSize: "0.7rem", padding: "0.2rem" }}
                          >×</button>
                        </button>

                        {/* Expanded run: step details */}
                        {isRunExpanded && (
                          <div style={{ padding: "0 1.2rem 1rem 3rem" }}>
                            {run.steps.map((step) => {
                              const stepColor = step.status === "done" ? "#2E6B4F" : step.status === "error" ? "#C81E1E" : "var(--smoke)";
                              return (
                                <details key={step.step} style={{ marginBottom: "2px" }}>
                                  <summary style={{
                                    display: "flex", alignItems: "center", gap: "0.5rem",
                                    padding: "0.4rem 0.6rem", cursor: "pointer", fontSize: "0.72rem",
                                    borderLeft: `2px solid ${stepColor}`, borderRadius: "0 4px 4px 0",
                                    background: "rgba(36,35,32,0.02)", listStyle: "none",
                                  }}>
                                    <span style={{ color: stepColor, fontSize: "0.7rem" }}>{step.status === "done" ? "✓" : step.status === "error" ? "✗" : "○"}</span>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--smoke)", width: 16 }}>{String(step.step).padStart(2, "0")}</span>
                                    <span style={{ flex: 1, color: "var(--charcoal)" }}>{step.title}</span>
                                    {step.agent && <span style={{ fontSize: "0.58rem", color: "var(--smoke)" }}>{step.agent}</span>}
                                  </summary>
                                  {(step.result || step.content || step.error) && (
                                    <pre style={{
                                      margin: "0.3rem 0 0.3rem 1.5rem", padding: "0.6rem", fontSize: "0.65rem",
                                      lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word",
                                      background: "rgba(36,35,32,0.03)", borderRadius: 6,
                                      maxHeight: 250, overflow: "auto",
                                      color: step.error ? "#C81E1E" : "var(--charcoal)",
                                    }}>
                                      {step.error || step.result || step.content}
                                    </pre>
                                  )}
                                </details>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
