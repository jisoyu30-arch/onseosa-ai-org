"use client";

import { useState } from "react";
import Link from "next/link";
import PipelineMusic from "@/components/PipelineMusic";
import PipelineApp from "@/components/PipelineApp";
import PipelineGeneric from "@/components/PipelineGeneric";

type Tab = "music" | "app" | "worldview" | "novel" | "drama" | "mv" | "playlist" | "shortform" | "ebook" | "instagram";

const TABS: { id: Tab; label: string; labelEn: string; color: string; icon: string }[] = [
  { id: "music", label: "음원 앨범", labelEn: "Music Album", color: "#C8551F", icon: "♪" },
  { id: "mv", label: "뮤직비디오", labelEn: "Music Video", color: "#1A6B8A", icon: "▶" },
  { id: "playlist", label: "플레이리스트", labelEn: "Playlist Video", color: "#C8551F", icon: "☰" },
  { id: "worldview", label: "세계관 설정", labelEn: "Worldbuilding", color: "#7B5EA7", icon: "◎" },
  { id: "novel", label: "웹소설 초안", labelEn: "Web Novel", color: "#7B5EA7", icon: "✎" },
  { id: "drama", label: "웹드라마 대본", labelEn: "Web Drama", color: "#1A6B8A", icon: "▣" },
  { id: "shortform", label: "AI 숏폼", labelEn: "Short-form", color: "#1A6B8A", icon: "⊡" },
  { id: "ebook", label: "전자책", labelEn: "E-book Design", color: "#2E6B4F", icon: "▤" },
  { id: "instagram", label: "인스타그램", labelEn: "Instagram Post", color: "#8A4A2E", icon: "◻" },
  { id: "app", label: "앱개발", labelEn: "App Dev", color: "#2E4B8A", icon: "⚡" },
];

const PIPELINE_INFO: Record<Tab, { desc: string; tools: string[] }> = {
  music:     { desc: "세계관 입력 → 앨범 프롬프트(Claude) → Midjourney 이미지 프롬프트 → 뮤비 프롬프트 → Runway 클립 → YouTube 메타데이터", tools: ["Claude API", "Midjourney", "Runway", "ffmpeg"] },
  mv:        { desc: "세계관 + 곡 제목 → 뮤비 콘셉트 설계 → Runway 프롬프트 5클립 → 편집 가이드", tools: ["Claude Sonnet", "Runway Gen-4"] },
  playlist:  { desc: "세계관 + 트랙리스트 → 플레이리스트 콘셉트 → 배경 이미지 프롬프트 → YouTube 메타데이터 → ffmpeg 명령어", tools: ["Claude Haiku", "Midjourney", "ffmpeg"] },
  worldview: { desc: "작품 콘셉트 → 세계관 골격 → 캐릭터 설계 → 갈등 구조 → 통합 설정집", tools: ["Claude Sonnet", "IP팀"] },
  novel:     { desc: "세계관 + 회차 → 플롯 설계 → 초고 집필 → 편집 피드백 → 최종 교정", tools: ["Claude Sonnet", "IP팀", "출판팀"] },
  drama:     { desc: "세계관 + 회차 → 씬 구성 → 대본 집필 → 연출 노트", tools: ["Claude Sonnet", "오리지널팀"] },
  shortform: { desc: "주제 + 플랫폼 → 후크 문장 → 본문 스크립트 → 자막/해시태그 → 썸네일 프롬프트", tools: ["Claude Haiku", "Midjourney"] },
  ebook:     { desc: "제목 + 콘텐츠 → 목차 구성 → 표지 프롬프트 → 내지 레이아웃 → 판매 메타데이터", tools: ["Claude Haiku", "Midjourney"] },
  instagram: { desc: "테마 + 개수 → 콘텐츠 기획 → 카피 작성 → 해시태그 → 이미지 프롬프트", tools: ["Claude Haiku", "Midjourney"] },
  app:       { desc: "기능 명세 → 컴포넌트 구조 설계 → 코드 자동 생성 → 테스트 케이스 → 실행 안내", tools: ["Claude Sonnet", "Next.js", "Supabase"] },
};

export default function PipelinePage() {
  const [activeTab, setActiveTab] = useState<Tab>("music");
  const info = PIPELINE_INFO[activeTab];
  const tabConfig = TABS.find((t) => t.id === activeTab)!;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--paper)" }}>
      {/* Header */}
      <div style={{ background: "var(--charcoal)", padding: "1.2rem 2rem", display: "flex", alignItems: "center", gap: "1rem", borderBottom: `3px solid ${tabConfig.color}`, transition: "border-color 0.3s" }}>
        <Link href="/" style={{ color: "var(--smoke)", textDecoration: "none", fontSize: "1.2rem", padding: "0.2rem 0.5rem" }}>
          ←
        </Link>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: tabConfig.color, flexShrink: 0, transition: "background 0.3s" }} />
        <div>
          <div style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 500, color: "var(--ivory)", fontSize: "0.95rem" }}>
            자동화 파이프라인
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--smoke)", textTransform: "uppercase" }}>
            Automation Pipeline — {TABS.length} Types
          </div>
        </div>
      </div>

      {/* Tab bar - scrollable */}
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid rgba(36,35,32,0.1)", background: "white", scrollbarWidth: "none" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              minWidth: 90, padding: "0.8rem 0.6rem", background: activeTab === tab.id ? "var(--paper)" : "white",
              border: "none", borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : "3px solid transparent",
              cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", flexShrink: 0,
            }}
          >
            <div style={{ fontSize: "1rem" }}>{tab.icon}</div>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "0.72rem", fontWeight: activeTab === tab.id ? 500 : 300, color: activeTab === tab.id ? tab.color : "var(--smoke)", whiteSpace: "nowrap" }}>
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, padding: "2rem", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        {/* Pipeline info */}
        <div style={{ marginBottom: "1.5rem", padding: "1rem 1.2rem", background: "white", border: "1px solid rgba(36,35,32,0.08)", borderRadius: 10 }}>
          <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.5rem" }}>
            {tabConfig.label} 파이프라인
          </div>
          <div style={{ fontSize: "0.72rem", lineHeight: 1.8, color: "var(--smoke)" }}>{info.desc}</div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {info.tools.map((t) => (
              <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", padding: "0.15rem 0.5rem", background: `${tabConfig.color}12`, color: tabConfig.color, borderRadius: 6 }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Pipeline components */}
        {activeTab === "music" && <PipelineMusic />}
        {activeTab === "app" && <PipelineApp />}
        {activeTab === "worldview" && (
          <PipelineGeneric endpoint="worldview" color="#7B5EA7" fields={[
            { key: "concept", label: "작품 콘셉트", type: "textarea", placeholder: "예: 조선시대 궁궐에서 벌어지는 타임슬립 로맨스. 현대의 웹소설 작가가 조선시대로 이동하여..." },
          ]} />
        )}
        {activeTab === "novel" && (
          <PipelineGeneric endpoint="novel" color="#7B5EA7" fields={[
            { key: "worldview", label: "세계관 설정", type: "textarea", placeholder: "세계관 파이프라인에서 생성된 설정집을 붙여넣으세요" },
            { key: "episode", label: "회차 번호", type: "number", defaultValue: 1 },
          ]} />
        )}
        {activeTab === "drama" && (
          <PipelineGeneric endpoint="drama" color="#1A6B8A" fields={[
            { key: "worldview", label: "세계관 설정", type: "textarea", placeholder: "세계관 설정을 입력하세요" },
            { key: "episodeNumber", label: "회차 번호", type: "number", defaultValue: 1 },
          ]} />
        )}
        {activeTab === "mv" && (
          <PipelineGeneric endpoint="mv" color="#1A6B8A" fields={[
            { key: "worldview", label: "세계관 / 곡 분위기", type: "textarea", placeholder: "곡의 세계관과 분위기를 설명하세요" },
            { key: "songTitle", label: "곡 제목", type: "text", placeholder: "예: 봄날의 소환" },
          ]} />
        )}
        {activeTab === "playlist" && (
          <PipelineGeneric endpoint="playlist" color="#C8551F" fields={[
            { key: "worldview", label: "세계관 / 테마", type: "textarea", placeholder: "플레이리스트의 테마를 설명하세요" },
            { key: "trackList", label: "트랙 리스트", type: "textarea", placeholder: "1. 곡명 - 장르\n2. 곡명 - 장르\n..." },
          ]} />
        )}
        {activeTab === "shortform" && (
          <PipelineGeneric endpoint="shortform" color="#1A6B8A" fields={[
            { key: "topic", label: "주제", type: "textarea", placeholder: "숏폼 콘텐츠 주제를 입력하세요" },
            { key: "platform", label: "플랫폼", type: "select", options: [
              { value: "youtube", label: "YouTube Shorts" },
              { value: "instagram", label: "Instagram Reels" },
              { value: "tiktok", label: "TikTok" },
            ], defaultValue: "youtube" },
          ]} />
        )}
        {activeTab === "ebook" && (
          <PipelineGeneric endpoint="ebook" color="#2E6B4F" fields={[
            { key: "title", label: "전자책 제목", type: "text", placeholder: "예: 미야옹 세계관 설정집" },
            { key: "content", label: "콘텐츠 요약", type: "textarea", placeholder: "전자책에 담을 내용을 설명하세요" },
          ]} />
        )}
        {activeTab === "instagram" && (
          <PipelineGeneric endpoint="instagram" color="#8A4A2E" fields={[
            { key: "theme", label: "테마", type: "textarea", placeholder: "이번 주 인스타그램 콘텐츠 테마를 입력하세요" },
            { key: "count", label: "포스트 개수", type: "number", defaultValue: 5 },
          ]} />
        )}
      </div>
    </div>
  );
}
