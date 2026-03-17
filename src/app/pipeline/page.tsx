"use client";

import { useState } from "react";
import Link from "next/link";
import PipelineMusic from "@/components/PipelineMusic";
import PipelineApp from "@/components/PipelineApp";

type Tab = "music" | "app";

const TABS: { id: Tab; label: string; labelEn: string; color: string; icon: string }[] = [
  { id: "music", label: "음악 → 콘텐츠 자동화", labelEn: "Music Content Pipeline", color: "#C8551F", icon: "♪" },
  { id: "app", label: "운동앱 자동 개발", labelEn: "Exercise App Pipeline", color: "#2E4B8A", icon: "⚡" },
];

export default function PipelinePage() {
  const [activeTab, setActiveTab] = useState<Tab>("music");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--paper)" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--charcoal)",
          padding: "1.2rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          borderBottom: `3px solid ${TABS.find((t) => t.id === activeTab)!.color}`,
          transition: "border-color 0.3s",
        }}
      >
        <Link
          href="/"
          style={{ color: "var(--smoke)", textDecoration: "none", fontSize: "1.2rem", padding: "0.2rem 0.5rem" }}
        >
          ←
        </Link>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: TABS.find((t) => t.id === activeTab)!.color,
            flexShrink: 0,
            transition: "background 0.3s",
          }}
        />
        <div>
          <div
            style={{
              fontFamily: "'Noto Serif KR', serif",
              fontWeight: 500,
              color: "var(--ivory)",
              fontSize: "0.95rem",
            }}
          >
            자동화 파이프라인
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "var(--smoke)",
              textTransform: "uppercase",
            }}
          >
            Automation Pipeline
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(36,35,32,0.1)",
          background: "white",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "1rem",
              background: activeTab === tab.id ? "var(--paper)" : "white",
              border: "none",
              borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : "3px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <div style={{ fontSize: "1.2rem" }}>{tab.icon}</div>
            <div
              style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: "0.85rem",
                fontWeight: activeTab === tab.id ? 500 : 300,
                color: activeTab === tab.id ? tab.color : "var(--smoke)",
              }}
            >
              {tab.label}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.5rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--smoke)",
              }}
            >
              {tab.labelEn}
            </div>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, padding: "2rem", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        {/* Pipeline info */}
        <div
          style={{
            marginBottom: "1.5rem",
            padding: "1rem 1.2rem",
            background: "white",
            border: "1px solid rgba(36,35,32,0.08)",
            borderRadius: 10,
          }}
        >
          {activeTab === "music" ? (
            <>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                음악 → 콘텐츠 자동화 파이프라인
              </div>
              <div style={{ fontSize: "0.72rem", lineHeight: 1.8, color: "var(--smoke)" }}>
                세계관 텍스트 입력 → 앨범 자켓 프롬프트(Claude) → 이미지 생성(DALL-E 3) → 뮤비 프롬프트(Claude) → 영상 클립(Runway) → ffmpeg 합성 → YouTube 업로드
              </div>
              <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {["Claude API", "DALL-E 3", "Runway Gen-4", "ffmpeg", "YouTube API"].map((t) => (
                  <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", padding: "0.15rem 0.5rem", background: "rgba(200,85,31,0.08)", color: "var(--dawn)", borderRadius: 6 }}>
                    {t}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                운동앱 자동 개발 파이프라인
              </div>
              <div style={{ fontSize: "0.72rem", lineHeight: 1.8, color: "var(--smoke)" }}>
                기능 명세 입력 → 컴포넌트 구조 설계(Claude) → 코드 자동 생성(Claude Code) → 테스트 케이스 작성 → 로컬 서버 실행
              </div>
              <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {["Claude API", "Next.js", "Supabase", "Jest", "Tailwind CSS"].map((t) => (
                  <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", padding: "0.15rem 0.5rem", background: "rgba(46,75,138,0.08)", color: "var(--platform, #2E4B8A)", borderRadius: 6 }}>
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {activeTab === "music" ? <PipelineMusic /> : <PipelineApp />}
      </div>
    </div>
  );
}
