"use client";

import { useState, useRef } from "react";
import { generateRunId, saveRun, updateRunSteps, PipelineRun, PipelineStepRecord } from "@/lib/projectStore";

interface TrackInfo {
  id: string;
  file: File;
  url: string;
  title: string;
  genre: string;
  mood: string;
  memo: string;
}

interface StepState {
  step: number;
  status: "idle" | "running" | "done" | "error" | "skipped" | "retry";
  title: string;
  detail?: string;
  result?: string;
  error?: string;
}

const GENRES = ["전통", "재즈", "발라드", "힙합", "팝", "록", "앰비언스", "기타"];
const MOODS = ["따뜻한", "몽환적", "비장한", "서정적", "에너지틱", "잔잔한", "어두운", "희망적", "그리운", "신비로운"];

const INITIAL_STEPS: StepState[] = [
  { step: 1, status: "idle", title: "트랙 분석 & 앨범 컨셉 설계" },
  { step: 2, status: "idle", title: "곡별 설명 & 스토리 작성" },
  { step: 3, status: "idle", title: "앨범 커버 이미지 프롬프트" },
  { step: 4, status: "idle", title: "유튜브 메타데이터 패키지" },
  { step: 5, status: "idle", title: "플레이리스트 구성 제안" },
  { step: 6, status: "idle", title: "품질 검토 & 총괄 보고" },
];

const STATUS_EMOJI: Record<string, string> = {
  idle: "○", running: "◉", done: "✓", error: "✗", skipped: "—", retry: "↻",
};
const STATUS_COLOR: Record<string, string> = {
  idle: "var(--smoke-2)", running: "var(--dawn)", done: "#2E6B4F", error: "#C81E1E", skipped: "var(--smoke)", retry: "#C8551F",
};

export default function PipelineMusic() {
  const [tracks, setTracks] = useState<TrackInfo[]>([]);
  const [projectName, setProjectName] = useState("");
  const [albumTitle, setAlbumTitle] = useState("");
  const [worldview, setWorldview] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [steps, setSteps] = useState<StepState[]>(INITIAL_STEPS);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const resultRef = useRef<HTMLDivElement>(null);
  const runIdRef = useRef<string>("");

  // --- Audio file handling ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newTracks: TrackInfo[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("audio/")) return;
      const id = `track-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      newTracks.push({
        id,
        file,
        url: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        genre: "",
        mood: "",
        memo: "",
      });
    });
    setTracks((prev) => [...prev, ...newTracks]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeTrack = (id: string) => {
    setTracks((prev) => {
      const track = prev.find((t) => t.id === id);
      if (track) URL.revokeObjectURL(track.url);
      return prev.filter((t) => t.id !== id);
    });
    if (playingId === id) setPlayingId(null);
  };

  const updateTrack = (id: string, field: keyof TrackInfo, value: string) => {
    setTracks((prev) => prev.map((t) => t.id === id ? { ...t, [field]: value } : t));
  };

  const togglePlay = (id: string) => {
    // Pause all other tracks
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (key !== id && audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const audio = audioRefs.current[id];
    if (!audio) return;

    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
    } else {
      audio.play();
      setPlayingId(id);
    }
  };

  const handleAudioEnded = (id: string) => {
    if (playingId === id) setPlayingId(null);
  };

  // --- Pipeline execution ---
  const handleRun = async () => {
    if (tracks.length === 0 || isRunning) return;

    setIsRunning(true);
    setSteps(INITIAL_STEPS);
    setExpandedStep(null);

    // Save to project store
    const runId = generateRunId();
    runIdRef.current = runId;
    const initialStepRecords: PipelineStepRecord[] = INITIAL_STEPS.map((s) => ({
      step: s.step, title: s.title, status: "idle",
    }));
    const run: PipelineRun = {
      id: runId,
      pipelineType: "music-album",
      pipelineLabel: "음원앨범 패키지",
      projectName: projectName.trim() || albumTitle.trim() || "미분류",
      inputs: { albumTitle: albumTitle.trim() || "미정", trackCount: tracks.length },
      steps: initialStepRecords,
      status: "running",
      createdAt: new Date().toISOString(),
      color: "#C8551F",
      icon: "♪",
    };
    saveRun(run);

    const trackSummary = tracks.map((t, i) =>
      `${i + 1}. "${t.title}" — 장르: ${t.genre || "미지정"}, 분위기: ${t.mood || "미지정"}${t.memo ? `, 메모: ${t.memo}` : ""}`
    ).join("\n");

    try {
      const res = await fetch("/api/pipeline/music-album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          albumTitle: albumTitle.trim() || "미정",
          worldview: worldview.trim(),
          trackSummary,
          trackCount: tracks.length,
        }),
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
              const { step, status, title, detail, result, error: errMsg, agent } = parsed;
              setSteps((prev) => {
                const updated = prev.map((s) =>
                  s.step === step
                    ? { ...s, status, title: title || s.title, detail, result: result || s.result, error: errMsg || s.error }
                    : s
                );
                // Sync to project store
                const stepRecords: PipelineStepRecord[] = updated.map((s) => ({
                  step: s.step, title: s.title, status: s.status,
                  result: s.result, error: s.error, agent: agent,
                }));
                const allDone = updated.every((s) => s.status === "done" || s.status === "skipped");
                const anyError = updated.some((s) => s.status === "error");
                const finalStatus = allDone ? "completed" : anyError ? "partial" : undefined;
                updateRunSteps(runIdRef.current, stepRecords, finalStatus);
                return updated;
              });
              if (status === "done" || status === "error") setExpandedStep(step);
            } catch { /* skip */ }
          }
        }
      }
    } catch {
      setSteps((prev) => {
        const updated = prev.map((s) => s.status === "running" ? { ...s, status: "error" as const, error: "네트워크 오류" } : s);
        const stepRecords: PipelineStepRecord[] = updated.map((s) => ({
          step: s.step, title: s.title, status: s.status, result: s.result, error: s.error,
        }));
        updateRunSteps(runIdRef.current, stepRecords, "failed");
        return updated;
      });
    }

    // Final status update
    setSteps((prev) => {
      const allDone = prev.every((s) => s.status === "done" || s.status === "skipped");
      const anyError = prev.some((s) => s.status === "error");
      const stepRecords: PipelineStepRecord[] = prev.map((s) => ({
        step: s.step, title: s.title, status: s.status, result: s.result, error: s.error,
      }));
      if (allDone) updateRunSteps(runIdRef.current, stepRecords, "completed");
      else if (anyError) updateRunSteps(runIdRef.current, stepRecords, "failed");
      else updateRunSteps(runIdRef.current, stepRecords, "partial");
      return prev;
    });

    setIsRunning(false);
  };

  const doneCount = steps.filter((s) => s.status === "done" || s.status === "skipped").length;

  return (
    <div>
      {/* ━━━ Track Upload Section ━━━ */}
      <div style={{
        marginBottom: "1.5rem", padding: "1.2rem", background: "white",
        border: "1px solid rgba(36,35,32,0.08)", borderRadius: 12,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "0.9rem", fontWeight: 500 }}>
              음원 트랙 관리
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.55rem", letterSpacing: "0.12em", color: "var(--smoke)", marginTop: "0.2rem" }}>
              TRACK MANAGER — {tracks.length}곡 등록됨
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isRunning}
            style={{
              background: "#C8551F", color: "white", border: "none", borderRadius: 8,
              padding: "0.5rem 1rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
              fontWeight: 500, cursor: isRunning ? "default" : "pointer", letterSpacing: "0.05em",
            }}
          >
            + 음원 추가
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>

        {/* Empty state */}
        {tracks.length === 0 && (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed rgba(36,35,32,0.12)", borderRadius: 10,
              padding: "2rem", textAlign: "center", cursor: "pointer",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C8551F")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(36,35,32,0.12)")}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem", opacity: 0.3 }}>♪</div>
            <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.82rem", color: "var(--smoke)" }}>
              음원 파일을 드래그하거나 클릭해서 추가하세요
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", color: "var(--smoke-2)", marginTop: "0.3rem" }}>
              MP3, WAV, OGG, M4A 지원
            </div>
          </div>
        )}

        {/* Track list */}
        {tracks.map((track, idx) => (
          <div
            key={track.id}
            style={{
              padding: "0.8rem",
              borderBottom: idx < tracks.length - 1 ? "1px solid rgba(36,35,32,0.06)" : "none",
              background: playingId === track.id ? "rgba(200,85,31,0.04)" : "transparent",
              borderRadius: 8,
              transition: "background 0.2s",
            }}
          >
            {/* Track header: play button + title + remove */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <button
                onClick={() => togglePlay(track.id)}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  border: `2px solid ${playingId === track.id ? "#C8551F" : "var(--smoke-2)"}`,
                  background: playingId === track.id ? "#C8551F" : "transparent",
                  color: playingId === track.id ? "white" : "var(--smoke)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.8rem", transition: "all 0.2s", flexShrink: 0,
                }}
              >
                {playingId === track.id ? "❚❚" : "▶"}
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "var(--smoke)", marginBottom: "0.15rem" }}>
                  TRACK {String(idx + 1).padStart(2, "0")} · {(track.file.size / (1024 * 1024)).toFixed(1)}MB
                </div>
                <input
                  value={track.title}
                  onChange={(e) => updateTrack(track.id, "title", e.target.value)}
                  disabled={isRunning}
                  placeholder="곡 제목"
                  style={{
                    width: "100%", border: "none", borderBottom: "1px solid rgba(36,35,32,0.1)",
                    fontFamily: "'Noto Serif KR', serif", fontSize: "0.85rem", fontWeight: 500,
                    background: "transparent", color: "var(--charcoal)", outline: "none",
                    padding: "0.2rem 0",
                  }}
                />
              </div>

              <button
                onClick={() => removeTrack(track.id)}
                disabled={isRunning}
                style={{
                  background: "none", border: "none", color: "var(--smoke-2)",
                  cursor: isRunning ? "default" : "pointer", fontSize: "1rem",
                  padding: "0.2rem 0.4rem", flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Hidden audio element */}
            <audio
              ref={(el) => { audioRefs.current[track.id] = el; }}
              src={track.url}
              onEnded={() => handleAudioEnded(track.id)}
              preload="metadata"
            />

            {/* Track metadata inputs */}
            <div style={{ display: "flex", gap: "0.5rem", marginLeft: "2.6rem", flexWrap: "wrap" }}>
              <select
                value={track.genre}
                onChange={(e) => updateTrack(track.id, "genre", e.target.value)}
                disabled={isRunning}
                style={{
                  border: "1px solid rgba(36,35,32,0.1)", borderRadius: 6,
                  padding: "0.3rem 0.5rem", fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: "0.7rem", background: "white", color: track.genre ? "var(--charcoal)" : "var(--smoke)",
                  outline: "none", minWidth: 90,
                }}
              >
                <option value="">장르 선택</option>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>

              <select
                value={track.mood}
                onChange={(e) => updateTrack(track.id, "mood", e.target.value)}
                disabled={isRunning}
                style={{
                  border: "1px solid rgba(36,35,32,0.1)", borderRadius: 6,
                  padding: "0.3rem 0.5rem", fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: "0.7rem", background: "white", color: track.mood ? "var(--charcoal)" : "var(--smoke)",
                  outline: "none", minWidth: 90,
                }}
              >
                <option value="">분위기 선택</option>
                {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>

              <input
                value={track.memo}
                onChange={(e) => updateTrack(track.id, "memo", e.target.value)}
                disabled={isRunning}
                placeholder="메모 (선택)"
                style={{
                  flex: 1, border: "1px solid rgba(36,35,32,0.1)", borderRadius: 6,
                  padding: "0.3rem 0.5rem", fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: "0.7rem", background: "white", color: "var(--charcoal)",
                  outline: "none", minWidth: 120,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ━━━ Project Name ━━━ */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--smoke)", marginBottom: "0.4rem" }}>
          프로젝트명 (트래커에 표시)
        </label>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={isRunning}
          placeholder="예: 미야옹 시즌1, 온서사 OST 프로젝트"
          style={{
            width: "100%", border: "1px solid rgba(123,94,167,0.3)", borderRadius: 10,
            padding: "0.6rem 1rem", fontFamily: "'Noto Serif KR', serif", fontSize: "0.82rem",
            background: "rgba(123,94,167,0.03)", color: "var(--charcoal)", outline: "none",
          }}
        />
      </div>

      {/* ━━━ Album Info ━━━ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--smoke)", marginBottom: "0.4rem" }}>
            앨범 제목 (선택)
          </label>
          <input
            value={albumTitle}
            onChange={(e) => setAlbumTitle(e.target.value)}
            disabled={isRunning}
            placeholder="예: 온서사 시즌 1"
            style={{
              width: "100%", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 10,
              padding: "0.6rem 1rem", fontFamily: "'Noto Serif KR', serif", fontSize: "0.82rem",
              background: "white", color: "var(--charcoal)", outline: "none",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--smoke)", marginBottom: "0.4rem" }}>
            세계관 / 배경 설명 (선택)
          </label>
          <input
            value={worldview}
            onChange={(e) => setWorldview(e.target.value)}
            disabled={isRunning}
            placeholder="예: 미야옹 세계관 OST"
            style={{
              width: "100%", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 10,
              padding: "0.6rem 1rem", fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.82rem",
              background: "white", color: "var(--charcoal)", outline: "none",
            }}
          />
        </div>
      </div>

      {/* ━━━ Run Button ━━━ */}
      <button
        onClick={handleRun}
        disabled={isRunning || tracks.length === 0}
        style={{
          width: "100%", background: isRunning || tracks.length === 0 ? "var(--smoke-2)" : "#C8551F",
          color: "white", border: "none", borderRadius: 10, padding: "0.8rem",
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500,
          letterSpacing: "0.08em", cursor: isRunning || tracks.length === 0 ? "default" : "pointer",
          marginBottom: "2rem",
        }}
      >
        {isRunning
          ? `AI 분석 중... (${doneCount}/${steps.length})`
          : tracks.length === 0
          ? "음원을 추가하세요"
          : `${tracks.length}곡 분석 → 앨범 패키지 생성`}
      </button>

      {/* ━━━ Pipeline Steps ━━━ */}
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

            {expandedStep === s.step && (s.result || s.error) && (
              <div style={{
                padding: "0 1rem 1rem 3.5rem", fontSize: "0.75rem", lineHeight: 1.8,
                whiteSpace: "pre-wrap", wordBreak: "break-word",
                color: s.error ? "#C81E1E" : "var(--charcoal)",
                maxHeight: 400, overflowY: "auto",
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
