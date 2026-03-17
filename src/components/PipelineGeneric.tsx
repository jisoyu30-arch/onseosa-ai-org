"use client";

import { useState, useRef } from "react";
import mammoth from "mammoth";

interface PipelineField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "file-textarea";
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
  fileAccept?: string;
  fileLabel?: string;
}

interface StepResult {
  step: number;
  status: string;
  title: string;
  result?: string;
  detail?: string;
  error?: string;
  agent?: string;
  content?: string;
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
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [fileLoading, setFileLoading] = useState<Record<string, boolean>>({});
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ── File reading ──
  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file, "UTF-8");
    });
  };

  const readDocxFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileUpload = async (fieldKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileLoading((prev) => ({ ...prev, [fieldKey]: true }));
    setFileNames((prev) => ({ ...prev, [fieldKey]: file.name }));

    try {
      let text = "";
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext === "docx") {
        text = await readDocxFile(file);
      } else if (ext === "txt" || ext === "md") {
        text = await readTextFile(file);
      } else if (ext === "hwp" || ext === "hwpx") {
        text = `[한글 파일은 텍스트 추출이 제한됩니다. .docx 또는 .txt로 변환 후 업로드해주세요]\n\n파일명: ${file.name}`;
      } else {
        // Try as text
        text = await readTextFile(file);
      }

      setValues((prev) => ({ ...prev, [fieldKey]: text }));
    } catch (err) {
      setValues((prev) => ({
        ...prev,
        [fieldKey]: `[파일 읽기 실패: ${err instanceof Error ? err.message : "알 수 없는 오류"}]\n\n파일명: ${file.name}`,
      }));
    }

    setFileLoading((prev) => ({ ...prev, [fieldKey]: false }));
    if (fileInputRefs.current[fieldKey]) fileInputRefs.current[fieldKey]!.value = "";
  };

  // ── Pipeline execution ──
  const run = async () => {
    setRunning(true);
    setSteps([]);
    setExpandedStep(null);
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
                if (data.status === "done" || data.status === "error") {
                  setExpandedStep(data.step);
                }
              }
            } catch { /* skip */ }
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

  const abort = () => {
    abortRef.current?.abort();
    setRunning(false);
  };

  const STATUS_COLOR: Record<string, string> = {
    idle: "var(--smoke-2)", running: "var(--dawn)", done: "#2E6B4F",
    error: "#C81E1E", skipped: "var(--smoke)", retry: "#C8551F",
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

            {f.type === "file-textarea" ? (
              <div>
                {/* File upload bar */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  marginBottom: "0.4rem", padding: "0.4rem 0.6rem",
                  background: "rgba(36,35,32,0.03)", borderRadius: "8px 8px 0 0",
                  border: "1px solid rgba(36,35,32,0.12)", borderBottom: "none",
                }}>
                  <button
                    onClick={() => fileInputRefs.current[f.key]?.click()}
                    disabled={running || fileLoading[f.key]}
                    style={{
                      background: color, color: "white", border: "none", borderRadius: 6,
                      padding: "0.35rem 0.7rem", fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.65rem", fontWeight: 500, cursor: running ? "default" : "pointer",
                      letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.3rem",
                    }}
                  >
                    {fileLoading[f.key] ? "읽는 중..." : "📄 파일 업로드"}
                  </button>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", color: "var(--smoke)", letterSpacing: "0.05em" }}>
                    .txt .docx 지원
                  </span>
                  {fileNames[f.key] && (
                    <span style={{
                      marginLeft: "auto", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                      color: "#2E6B4F", background: "rgba(46,107,79,0.08)",
                      padding: "0.15rem 0.5rem", borderRadius: 4,
                      maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      ✓ {fileNames[f.key]}
                    </span>
                  )}
                  <input
                    ref={(el) => { fileInputRefs.current[f.key] = el; }}
                    type="file"
                    accept=".txt,.docx,.md,.text"
                    onChange={(e) => handleFileUpload(f.key, e)}
                    style={{ display: "none" }}
                  />
                </div>

                {/* Textarea (shows file content or manual input) */}
                <textarea
                  value={values[f.key] as string}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  disabled={running}
                  rows={8}
                  style={{
                    width: "100%", padding: "0.8rem",
                    border: "1px solid rgba(36,35,32,0.12)",
                    borderRadius: "0 0 8px 8px",
                    fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.78rem",
                    lineHeight: 1.8, resize: "vertical", background: "white",
                    color: "var(--charcoal)", outline: "none",
                  }}
                />
                {(values[f.key] as string)?.length > 0 && (
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginTop: "0.3rem", padding: "0 0.2rem",
                  }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "var(--smoke)" }}>
                      {(values[f.key] as string).length.toLocaleString()}자
                    </span>
                    <button
                      onClick={() => {
                        setValues({ ...values, [f.key]: "" });
                        setFileNames((prev) => { const n = { ...prev }; delete n[f.key]; return n; });
                      }}
                      disabled={running}
                      style={{
                        background: "none", border: "none", fontSize: "0.6rem",
                        color: "var(--smoke)", cursor: running ? "default" : "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      비우기
                    </button>
                  </div>
                )}
              </div>
            ) : f.type === "textarea" ? (
              <textarea
                value={values[f.key] as string}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                disabled={running}
                rows={4}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 8, fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.82rem", lineHeight: 1.8, resize: "vertical", background: "white", outline: "none" }}
              />
            ) : f.type === "select" ? (
              <select
                value={values[f.key] as string}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                disabled={running}
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
                disabled={running}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 8, fontSize: "0.82rem", background: "white" }}
              />
            ) : (
              <input
                type="text"
                value={values[f.key] as string}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                disabled={running}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 8, fontSize: "0.82rem", background: "white" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Run / Abort button */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          onClick={running ? abort : run}
          style={{
            flex: 1, padding: "0.9rem",
            background: running ? "#C81E1E" : color,
            color: "white", border: "none", borderRadius: 8,
            cursor: "pointer",
            fontFamily: "'Noto Serif KR', serif", fontSize: "0.9rem", fontWeight: 500,
          }}
        >
          {running ? "중단" : "파이프라인 실행"}
        </button>
      </div>

      {/* Steps */}
      {steps.map((s) => (
        <div
          key={s.step}
          style={{
            marginBottom: "2px", background: "white",
            border: "1px solid rgba(36,35,32,0.08)", borderRadius: 8,
            borderLeft: `3px solid ${STATUS_COLOR[s.status] || "var(--smoke)"}`,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setExpandedStep(expandedStep === s.step ? null : s.step)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.7rem 1rem", background: "none", border: "none",
              cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "var(--smoke)", width: 18 }}>
              {String(s.step).padStart(2, "0")}
            </span>
            <span style={{ fontSize: "0.85rem", color: STATUS_COLOR[s.status] || "var(--smoke)", width: 16, textAlign: "center" }}>
              {s.status === "done" ? "✓" : s.status === "error" ? "✗" : s.status === "running" ? "◉" : s.status === "retry" ? "↻" : "○"}
            </span>
            <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.8rem", flex: 1, color: s.status === "idle" ? "var(--smoke)" : "var(--charcoal)" }}>
              {s.title}
            </span>
            {s.agent && (
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.55rem", color: "var(--smoke)", letterSpacing: "0.05em" }}>
                {s.agent}
              </span>
            )}
            <span style={{
              fontSize: "0.55rem", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em",
              padding: "0.15rem 0.4rem", borderRadius: 12,
              background: `${STATUS_COLOR[s.status] || "var(--smoke)"}15`,
              color: STATUS_COLOR[s.status] || "var(--smoke)",
            }}>
              {s.status === "done" ? "완료" : s.status === "error" ? "오류" : s.status === "running" ? "실행 중" : s.status === "retry" ? "재시도" : "대기"}
            </span>
          </button>

          {expandedStep === s.step && (s.result || s.content || s.error) && (
            <div style={{
              padding: "0 1rem 1rem 3rem", fontSize: "0.73rem", lineHeight: 1.8,
              whiteSpace: "pre-wrap", wordBreak: "break-word",
              color: s.error ? "#C81E1E" : "var(--charcoal)",
              maxHeight: 400, overflowY: "auto",
              borderTop: "1px solid rgba(36,35,32,0.06)", paddingTop: "0.8rem",
            }}>
              {s.error || s.result || s.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
