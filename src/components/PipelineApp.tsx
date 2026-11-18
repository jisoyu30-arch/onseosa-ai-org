"use client";

import { useState, useRef } from "react";

interface StepState {
  step: number;
  status: "idle" | "running" | "done" | "error" | "skipped" | "retry";
  title: string;
  detail?: string;
  result?: string;
  error?: string;
  files?: string[];
}

const INITIAL_STEPS: StepState[] = [
  { step: 1, status: "idle", title: "컴포넌트 구조 설계" },
  { step: 2, status: "idle", title: "코드 자동 생성" },
  { step: 3, status: "idle", title: "테스트 케이스 작성" },
  { step: 4, status: "idle", title: "로컬 서버 실행 안내" },
  { step: 5, status: "idle", title: "CDO 결과 보고" },
];

const STATUS_EMOJI: Record<string, string> = {
  idle: "○", running: "◉", done: "✓", error: "✗", skipped: "—", retry: "↻",
};

const STATUS_COLOR: Record<string, string> = {
  idle: "var(--smoke-2)", running: "var(--dawn)", done: "#2E6B4F",
  error: "#C81E1E", skipped: "var(--smoke)", retry: "#C8551F",
};

const SAMPLE_SPEC = `운동앱 "핏브릭" 기능 명세:

1. 사용자 인증: 이메일 회원가입/로그인 (Supabase Auth)
2. 운동 기록: 날짜별 운동 종류, 세트, 무게, 횟수 입력
3. 운동 루틴: 요일별 루틴 설정, 루틴 템플릿 저장/불러오기
4. 대시보드: 주간/월간 운동 통계, 차트 (볼륨, 빈도)
5. 타이머: 세트 간 휴식 타이머, 운동 시간 측정
6. 캘린더: 운동한 날 표시, 스트릭(연속 운동일) 카운터
7. 프로필: 체중/체지방 기록, 신체 변화 그래프`;

export default function PipelineApp() {
  const [featureSpec, setFeatureSpec] = useState("");
  const [steps, setSteps] = useState<StepState[]>(INITIAL_STEPS);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleRun = async () => {
    if (!featureSpec.trim() || isRunning) return;

    setIsRunning(true);
    setSteps(INITIAL_STEPS);
    setExpandedStep(null);

    try {
      const res = await fetch("/api/pipeline/app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureSpec: featureSpec.trim() }),
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
              const { step, status, title, detail, result, error: errMsg, files } = parsed;

              setSteps((prev) =>
                prev.map((s) =>
                  s.step === step
                    ? { ...s, status, title: title || s.title, detail, result: result || s.result, error: errMsg || s.error, files: files || s.files }
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
      <div style={{ marginBottom: "0.8rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
          <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--smoke)" }}>
            앱 기능 명세 *
          </label>
          <button
            onClick={() => setFeatureSpec(SAMPLE_SPEC)}
            disabled={isRunning}
            style={{
              background: "none", border: "1px solid rgba(36,35,32,0.15)", borderRadius: 6,
              padding: "0.15rem 0.5rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem",
              color: "var(--smoke)", cursor: isRunning ? "default" : "pointer", letterSpacing: "0.05em",
            }}
          >
            샘플 명세 불러오기
          </button>
        </div>
        <textarea
          value={featureSpec}
          onChange={(e) => setFeatureSpec(e.target.value)}
          disabled={isRunning}
          placeholder="운동앱에 필요한 기능을 상세히 기술하세요..."
          rows={8}
          style={{
            width: "100%", resize: "vertical", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 10,
            padding: "0.8rem 1rem", fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.82rem",
            lineHeight: 1.8, background: "white", color: "var(--charcoal)", outline: "none",
          }}
        />
      </div>

      <button
        onClick={handleRun}
        disabled={isRunning || !featureSpec.trim()}
        style={{
          width: "100%", background: isRunning || !featureSpec.trim() ? "var(--smoke-2)" : "var(--platform, #2E4B8A)",
          color: "white", border: "none", borderRadius: 10, padding: "0.8rem",
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500,
          letterSpacing: "0.08em", cursor: isRunning || !featureSpec.trim() ? "default" : "pointer",
          marginBottom: "2rem",
        }}
      >
        {isRunning ? `파이프라인 실행 중... (${doneCount}/${steps.length})` : "운동앱 자동 개발 파이프라인 실행"}
      </button>

      {/* Pipeline steps */}
      <div ref={resultRef} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {steps.map((s) => (
          <div
            key={s.step}
            style={{
              background: "white", border: "1px solid rgba(36,35,32,0.08)",
              borderLeft: `3px solid ${STATUS_COLOR[s.status]}`, borderRadius: 8, overflow: "hidden",
            }}
          >
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
                {STATUS_EMOJI[s.status]}
              </span>
              <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.8rem", flex: 1, color: s.status === "idle" ? "var(--smoke)" : "var(--charcoal)" }}>
                {s.title}
              </span>
              {s.files && s.files.length > 0 && (
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "var(--olive)", background: "rgba(107,112,85,0.1)", padding: "0.1rem 0.4rem", borderRadius: 8 }}>
                  {s.files.length} files
                </span>
              )}
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

            {expandedStep === s.step && (s.result || s.error) && (
              <div style={{
                padding: "0 1rem 1rem 3.5rem", fontSize: "0.75rem", lineHeight: 1.8,
                whiteSpace: "pre-wrap", wordBreak: "break-word",
                color: s.error ? "#C81E1E" : "var(--charcoal)",
                maxHeight: 500, overflowY: "auto",
                borderTop: "1px solid rgba(36,35,32,0.06)", paddingTop: "0.8rem",
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
