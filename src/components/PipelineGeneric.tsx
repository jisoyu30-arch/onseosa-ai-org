"use client";

import { useState, useRef } from "react";

interface PipelineField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
}

interface StepResult {
  step: number;
  status: string;
  title: string;
  result?: string;
  detail?: string;
  error?: string;
}

export default function PipelineGeneric({
  endpoint,
  fields,
  color,
}: {
  endpoint: string;
  fields: PipelineField[];
  color: string;
}) {
  const [values, setValues] = useState<Record<string, string | number>>(() => {
    const init: Record<string, string | number> = {};
    fields.forEach((f) => { init[f.key] = f.defaultValue ?? ""; });
    return init;
  });
  const [steps, setSteps] = useState<StepResult[]>([]);
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const run = async () => {
    setRunning(true);
    setSteps([]);
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`/api/pipeline/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: abortRef.current.signal,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.step) {
                setSteps((prev) => {
                  const idx = prev.findIndex((s) => s.step === data.step);
                  if (idx >= 0) {
                    const updated = [...prev];
                    updated[idx] = data;
                    return updated;
                  }
                  return [...prev, data];
                });
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") {
        setSteps((prev) => [...prev, { step: 0, status: "error", title: "오류", error: e.message }]);
      }
    }
    setRunning(false);
  };

  return (
    <div>
      {/* Input fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.5rem" }}>
        {fields.map((f) => (
          <div key={f.key}>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--smoke)", marginBottom: "0.3rem", display: "block" }}>
              {f.label}
            </label>
            {f.type === "textarea" ? (
              <textarea
                value={values[f.key] as string}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                rows={4}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 8, fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.82rem", resize: "vertical", background: "white" }}
              />
            ) : f.type === "select" ? (
              <select
                value={values[f.key] as string}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 8, fontSize: "0.82rem", background: "white" }}
              >
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === "number" ? (
              <input
                type="number"
                value={values[f.key] as number}
                onChange={(e) => setValues({ ...values, [f.key]: parseInt(e.target.value) || 0 })}
                placeholder={f.placeholder}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 8, fontSize: "0.82rem", background: "white" }}
              />
            ) : (
              <input
                type="text"
                value={values[f.key] as string}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 8, fontSize: "0.82rem", background: "white" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Run button */}
      <button
        onClick={run}
        disabled={running}
        style={{
          width: "100%", padding: "0.9rem", background: running ? "var(--smoke)" : color,
          color: "white", border: "none", borderRadius: 8, cursor: running ? "default" : "pointer",
          fontFamily: "'Noto Serif KR', serif", fontSize: "0.9rem", fontWeight: 500, marginBottom: "1.5rem",
        }}
      >
        {running ? "실행 중..." : "파이프라인 실행"}
      </button>

      {/* Steps */}
      {steps.map((s) => (
        <div key={s.step} style={{ marginBottom: "0.8rem", padding: "1rem", background: "white", border: "1px solid rgba(36,35,32,0.08)", borderRadius: 8, borderLeft: `3px solid ${s.status === "done" ? "#2E6B4F" : s.status === "error" ? "#C8551F" : "var(--smoke)"}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem" }}>
              {s.status === "done" ? "\u2713" : s.status === "error" ? "\u2717" : s.status === "running" ? "\u25cb" : "\u25cb"}
            </span>
            <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "0.85rem", fontWeight: 500 }}>{s.title}</span>
          </div>
          {s.detail && <div style={{ fontSize: "0.72rem", color: "var(--smoke)", marginBottom: "0.3rem" }}>{s.detail}</div>}
          {s.error && <div style={{ fontSize: "0.72rem", color: "#C8551F" }}>{s.error}</div>}
          {s.result && (
            <pre style={{ fontSize: "0.7rem", lineHeight: 1.7, color: "var(--charcoal-3, #3A3835)", background: "rgba(36,35,32,0.04)", padding: "0.8rem", borderRadius: 6, whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 300, overflow: "auto", marginTop: "0.4rem" }}>
              {s.result}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
