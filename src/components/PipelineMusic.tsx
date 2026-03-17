"use client";

import { useState, useRef } from "react";

interface StepState {
  step: number;
  status: "idle" | "running" | "done" | "error" | "skipped" | "retry";
  title: string;
  detail?: string;
  result?: string;
  error?: string;
}

const INITIAL_STEPS: StepState[] = [
  { step: 1, status: "idle", title: "앨범 자켓 프롬프트 생성" },
  { step: 2, status: "idle", title: "앨범 자켓 이미지 생성" },
  { step: 3, status: "idle", title: "뮤비 컨셉 프롬프트 생성" },
  { step: 4, status: "idle", title: "뮤비 클립 생성" },
  { step: 5, status: "idle", title: "뮤비 합성 (ffmpeg)" },
  { step: 6, status: "idle", title: "플레이리스트 영상 합성" },
  { step: 7, status: "idle", title: "YouTube 업로드" },
  { step: 8, status: "idle", title: "CDO 결과 보고" },
];

const STATUS_EMOJI: Record<string, string> = {
  idle: "○",
  running: "◉",
  done: "✓",
  error: "✗",
  skipped: "—",
  retry: "↻",
};

const STATUS_COLOR: Record<string, string> = {
  idle: "var(--smoke-2)",
  running: "var(--dawn)",
  done: "#2E6B4F",
  error: "#C81E1E",
  skipped: "var(--smoke)",
  retry: "#C8551F",
};

export default function PipelineMusic() {
  const [worldview, setWorldview] = useState("");
  const [audioFileName, setAudioFileName] = useState("");
  const [steps, setSteps] = useState<StepState[]>(INITIAL_STEPS);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleRun = async () => {
    if (!worldview.trim() || isRunning) return;

    setIsRunning(true);
    setSteps(INITIAL_STEPS);
    setExpandedStep(null);

    try {
      const res = await fetch("/api/pipeline/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worldview: worldview.trim(), audioFileName: audioFileName.trim() || "untitled" }),
      });

      if (!res.ok) {
        const err = await res.json();
        setSteps((prev) => prev.map((s, i) => i === 0 ? { ...s, status: "error", error: err.error } : s));
        setIsRunning(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const { step, status, title, detail, result, error: errMsg } = parsed;

              setSteps((prev) =>
                prev.map((s) =>
                  s.step === step
                    ? { ...s, status, title: title || s.title, detail, result: result || s.result, error: errMsg || s.error }
                    : s
                )
              );

              if (status === "done" || status === "error") {
                setExpandedStep(step);
              }
            } catch {
              // skip
            }
          }
        }
      }
    } catch {
      setSteps((prev) => prev.map((s) => s.status === "running" ? { ...s, status: "error", error: "네트워크 오류" } : s));
    }

    setIsRunning(false);
  };

  const doneCount = steps.filter((s) => s.status === "done" || s.status === "skipped").length;

  return (
    <div>
      {/* Input form */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--smoke)", marginBottom: "0.4rem" }}>
          세계관 설명 텍스트 *
        </label>
        <textarea
          value={worldview}
          onChange={(e) => setWorldview(e.target.value)}
          disabled={isRunning}
          placeholder="음원의 세계관, 분위기, 이야기를 설명하세요..."
          rows={4}
          style={{
            width: "100%", resize: "vertical", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 10,
            padding: "0.8rem 1rem", fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.82rem",
            lineHeight: 1.8, background: "white", color: "var(--charcoal)", outline: "none",
          }}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--smoke)", marginBottom: "0.4rem" }}>
          음원 파일명 (선택)
        </label>
        <input
          value={audioFileName}
          onChange={(e) => setAudioFileName(e.target.value)}
          disabled={isRunning}
          placeholder="예: miyaong_ost_01.mp3"
          style={{
            width: "100%", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 10,
            padding: "0.6rem 1rem", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem",
            background: "white", color: "var(--charcoal)", outline: "none",
          }}
        />
      </div>

      <button
        onClick={handleRun}
        disabled={isRunning || !worldview.trim()}
        style={{
          width: "100%", background: isRunning || !worldview.trim() ? "var(--smoke-2)" : "var(--music, #C8551F)",
          color: "white", border: "none", borderRadius: 10, padding: "0.8rem",
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500,
          letterSpacing: "0.08em", cursor: isRunning || !worldview.trim() ? "default" : "pointer",
          marginBottom: "2rem",
        }}
      >
        {isRunning ? `파이프라인 실행 중... (${doneCount}/${steps.length})` : "음악 → 콘텐츠 파이프라인 실행"}
      </button>

      {/* Pipeline steps */}
      <div ref={resultRef} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {steps.map((s) => (
          <div
            key={s.step}
            style={{
              background: "white",
              border: "1px solid rgba(36,35,32,0.08)",
              borderLeft: `3px solid ${STATUS_COLOR[s.status]}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {/* Step header */}
            <button
              onClick={() => setExpandedStep(expandedStep === s.step ? null : s.step)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "0.7rem",
                padding: "0.7rem 1rem", background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}
            >
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "var(--smoke)", width: 18 }}>
                {String(s.step).padStart(2, "0")}
              </span>
              <span style={{ fontSize: "0.9rem", color: STATUS_COLOR[s.status], width: 18, textAlign: "center" }}>
                {s.status === "running" ? (
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>{STATUS_EMOJI[s.status]}</span>
                ) : STATUS_EMOJI[s.status]}
              </span>
              <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.8rem", flex: 1, color: s.status === "idle" ? "var(--smoke)" : "var(--charcoal)" }}>
                {s.title}
              </span>
              {s.detail && s.status === "running" && (
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", color: "var(--dawn)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.detail}
                </span>
              )}
              <span style={{
                fontSize: "0.55rem", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em",
                padding: "0.15rem 0.4rem", borderRadius: 12,
                background: `${STATUS_COLOR[s.status]}15`, color: STATUS_COLOR[s.status],
              }}>
                {s.status === "idle" ? "대기" : s.status === "running" ? "실행 중" : s.status === "done" ? "완료" : s.status === "error" ? "오류" : s.status === "skipped" ? "건너뜀" : "재시도"}
              </span>
            </button>

            {/* Step result (expanded) */}
            {expandedStep === s.step && (s.result || s.error) && (
              <div style={{
                padding: "0 1rem 1rem 3.5rem",
                fontSize: "0.75rem", lineHeight: 1.8,
                whiteSpace: "pre-wrap", wordBreak: "break-word",
                color: s.error ? "#C81E1E" : "var(--charcoal)",
                maxHeight: 400, overflowY: "auto",
                borderTop: "1px solid rgba(36,35,32,0.06)",
                paddingTop: "0.8rem",
              }}>
                {s.error || s.result}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
