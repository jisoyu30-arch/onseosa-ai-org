"use client";

import { useState } from "react";
import Link from "next/link";
import PipelineMusic from "@/components/PipelineMusic";
import PipelineApp from "@/components/PipelineApp";
import PipelineGeneric from "@/components/PipelineGeneric";

type Tab = "music" | "mv" | "playlist" | "worldview" | "novel" | "drama" | "shortform" | "ebook" | "instagram" | "app" | "grants";

const TABS: { id: Tab; label: string; labelEn: string; color: string; icon: string }[] = [
  { id: "music", label: "음원앨범", labelEn: "Music Album", color: "#C8551F", icon: "♪" },
  { id: "mv", label: "뮤직비디오", labelEn: "Music Video", color: "#1A6B8A", icon: "▶" },
  { id: "playlist", label: "플레이리스트", labelEn: "Playlist Video", color: "#C8551F", icon: "☰" },
  { id: "worldview", label: "세계관 설정", labelEn: "Worldbuilding", color: "#7B5EA7", icon: "◎" },
  { id: "novel", label: "웹소설 초안", labelEn: "Web Novel", color: "#7B5EA7", icon: "✎" },
  { id: "drama", label: "웹드라마 대본", labelEn: "Web Drama", color: "#1A6B8A", icon: "▣" },
  { id: "shortform", label: "AI 숏폼", labelEn: "Short-form", color: "#1A6B8A", icon: "⊡" },
  { id: "ebook", label: "전자책", labelEn: "E-book", color: "#2E6B4F", icon: "▤" },
  { id: "instagram", label: "인스타그램", labelEn: "Instagram", color: "#8A4A2E", icon: "◻" },
  { id: "app", label: "앱개발", labelEn: "App Dev", color: "#2E4B8A", icon: "⚡" },
  { id: "grants", label: "지원사업", labelEn: "Grants", color: "#7B5EA7", icon: "★" },
];

const PIPELINE_INFO: Record<Tab, { desc: string; owner: string; tools: string[]; automation: string }> = {
  music: {
    desc: "컨셉 정립 → 가사 핸드오프 → 작곡/프로듀싱 방향 → 트랙 메타데이터 → 커버 프롬프트 → 릴리즈 패키지",
    owner: "작곡프로듀서 → 음원앨범담당 → 품질관리매니저",
    tools: ["Claude API", "Suno AI", "Midjourney/GPT Image"],
    automation: "반자동",
  },
  mv: {
    desc: "컨셉 변환 → 씬 플랜 → 영상 프롬프트 구조 → 영상 패키지 → 썸네일/캡션 → 릴리즈 핸드오프",
    owner: "영상담당 → 제작실행실장 → 품질관리매니저",
    tools: ["Claude API", "Runway Gen-4", "Sora", "Veo"],
    automation: "반자동",
  },
  playlist: {
    desc: "플레이리스트 컨셉 → 트랙 그룹핑 → 비주얼/배경 패키지 → 메타데이터 → 퍼블리싱 패키지",
    owner: "음원앨범담당 → 배포운영담당 → 품질관리매니저",
    tools: ["Claude Haiku", "Midjourney/GPT Image"],
    automation: "완전 자동",
  },
  worldview: {
    desc: "컨셉 입력 → 세계 규칙 → 캐릭터 설계 → 갈등 구조 → 통합 설정집 출력",
    owner: "기획작가 → IP콘텐츠전략실장 → 품질관리매니저",
    tools: ["Claude Sonnet"],
    automation: "완전 자동",
  },
  novel: {
    desc: "컨셉 인테이크 → 세계관 참조 → 에피소드 구조 → 초고 생성 → 편집 리뷰 → 품질 검토",
    owner: "소설작가/웹소설작가 → IP콘텐츠전략실장 → 품질관리매니저",
    tools: ["Claude Sonnet", "Claude Haiku"],
    automation: "반자동",
  },
  drama: {
    desc: "스토리 인테이크 → 씬 구성 → 대본 초안 → 대사/씬 흐름 검토 → 품질 검토 → 리스크 검토",
    owner: "웹드라마작가 → IP콘텐츠전략실장 → 법무리스크매니저",
    tools: ["Claude Sonnet", "Claude Haiku"],
    automation: "반자동",
  },
  shortform: {
    desc: "주제 선정 → 훅 문장 → 숏폼 스크립트 → 자막/해시태그 패키지 → 썸네일 프롬프트 → 퍼블리싱 핸드오프",
    owner: "영상담당 → 배포운영담당 → 품질관리매니저",
    tools: ["Claude Haiku", "Midjourney/GPT Image"],
    automation: "완전 자동",
  },
  ebook: {
    desc: "제목 → 목차 구성 → 원고 패키지 → 표지 컨셉/프롬프트 → 상품 설명 → 판매 메타데이터",
    owner: "소설작가 → IP콘텐츠전략실장 → 품질관리매니저",
    tools: ["Claude Haiku", "Midjourney/GPT Image"],
    automation: "완전 자동",
  },
  instagram: {
    desc: "테마 → 카피 → 캡션 → 해시태그 패키지 → 이미지 프롬프트/소재 → 포스팅 핸드오프",
    owner: "배포운영담당 → 제작실행실장 → 품질관리매니저",
    tools: ["Claude Haiku", "Midjourney/GPT Image"],
    automation: "완전 자동",
  },
  app: {
    desc: "기능 브리프 → 구현 계획 → 테스트 체크리스트 → 릴리즈 노트 → 홈페이지 반영",
    owner: "앱개발담당 → AI시스템개발실장",
    tools: ["Claude Sonnet", "Next.js", "Supabase"],
    automation: "수동 폴백",
  },
  grants: {
    desc: "기회 발굴 → 적격성 심사 → 적합도 점수 → 필요 서류 체크리스트 → 마일스톤 일정 → 초안 작성 → 최종 제출 검토",
    owner: "지원사업매니저 → 전략성장실장 → 법무리스크매니저 → 품질관리매니저",
    tools: ["Claude Sonnet", "Claude Haiku"],
    automation: "반자동",
  },
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
              minWidth: 80, padding: "0.8rem 0.5rem", background: activeTab === tab.id ? "var(--paper)" : "white",
              border: "none", borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : "3px solid transparent",
              cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", flexShrink: 0,
            }}
          >
            <div style={{ fontSize: "1rem" }}>{tab.icon}</div>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "0.68rem", fontWeight: activeTab === tab.id ? 500 : 300, color: activeTab === tab.id ? tab.color : "var(--smoke)", whiteSpace: "nowrap" }}>
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, padding: "2rem", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        {/* Pipeline info */}
        <div style={{ marginBottom: "1.5rem", padding: "1rem 1.2rem", background: "white", border: "1px solid rgba(36,35,32,0.08)", borderRadius: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "0.85rem", fontWeight: 500 }}>
              {tabConfig.label} 파이프라인
            </div>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.55rem", padding: "0.15rem 0.6rem", borderRadius: 12,
              background: info.automation === "완전 자동" ? "rgba(46,107,79,0.1)" : info.automation === "반자동" ? "rgba(200,85,31,0.1)" : "rgba(154,148,144,0.15)",
              color: info.automation === "완전 자동" ? "#2E6B4F" : info.automation === "반자동" ? "#C8551F" : "var(--smoke)",
              letterSpacing: "0.05em",
            }}>
              {info.automation}
            </span>
          </div>
          <div style={{ fontSize: "0.72rem", lineHeight: 1.8, color: "var(--smoke)" }}>{info.desc}</div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.65rem", color: "var(--smoke)" }}>
            <strong style={{ color: "var(--charcoal)", fontWeight: 500 }}>담당:</strong> {info.owner}
          </div>
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
        {activeTab === "app" && (
          <PipelineGeneric endpoint="app" color="#2E4B8A" fields={[
            { key: "spec", label: "기능 명세서 / 기획 문서", type: "file-textarea", placeholder: "기능 명세서를 붙여넣거나 파일로 업로드하세요. 어떤 기능을 만들고 싶은지 설명..." },
            { key: "existingCode", label: "기존 코드 / 참고 자료 (선택)", type: "file-textarea", placeholder: "기존에 작성한 코드나 참고 자료가 있으면 붙여넣거나 파일로 업로드하세요." },
            { key: "priority", label: "우선순위", type: "select", options: [
              { value: "high", label: "긴급 (이번 주 배포)" },
              { value: "medium", label: "보통 (이번 달 내)" },
              { value: "low", label: "여유 (다음 스프린트)" },
            ], defaultValue: "medium" },
          ]} />
        )}
        {activeTab === "worldview" && (
          <PipelineGeneric endpoint="worldview" color="#7B5EA7" fields={[
            { key: "concept", label: "작품 콘셉트", type: "textarea", placeholder: "예: 조선시대 궁궐에서 벌어지는 타임슬립 로맨스. 현대의 웹소설 작가가 조선시대로 이동하여..." },
          ]} />
        )}
        {activeTab === "novel" && (
          <PipelineGeneric endpoint="novel" color="#7B5EA7" fields={[
            { key: "worldview", label: "세계관 설정 / 기획안", type: "file-textarea", placeholder: "세계관 설정집이나 기획안을 붙여넣거나 파일로 업로드하세요" },
            { key: "previousDraft", label: "기존 원고 (이전 회차)", type: "file-textarea", placeholder: "이전 회차까지 쓴 원고를 붙여넣거나 파일로 업로드하세요. 첫 회차면 비워두세요." },
            { key: "episode", label: "이어서 쓸 회차 번호", type: "number", defaultValue: 1 },
            { key: "direction", label: "이번 회차 방향 메모 (선택)", type: "textarea", placeholder: "이번 회차에서 다루고 싶은 전개, 반전, 감정 흐름 등..." },
          ]} />
        )}
        {activeTab === "drama" && (
          <PipelineGeneric endpoint="drama" color="#1A6B8A" fields={[
            { key: "plan", label: "기획안 (시리즈 개요/기획서)", type: "file-textarea", placeholder: "웹드라마 기획안을 붙여넣거나 파일로 업로드하세요. 시놉시스, 캐릭터 설정, 전체 에피소드 구성 등..." },
            { key: "previousScript", label: "기존 대본 (이전 회차)", type: "file-textarea", placeholder: "이전 회차까지 쓴 대본을 붙여넣거나 파일로 업로드하세요. 첫 회차면 비워두세요." },
            { key: "episodeNumber", label: "이어서 쓸 회차 번호", type: "number", defaultValue: 1 },
            { key: "direction", label: "이번 회차 방향 메모 (선택)", type: "textarea", placeholder: "이번 회차에서 다루고 싶은 내용, 반전 포인트, 감정 방향 등..." },
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
        {activeTab === "grants" && (
          <PipelineGeneric endpoint="grants" color="#7B5EA7" fields={[
            { key: "category", label: "지원사업 분야", type: "select", options: [
              { value: "content", label: "콘텐츠 창작 지원" },
              { value: "tech", label: "기술/AI 개발 지원" },
              { value: "startup", label: "창업/엑셀러레이팅" },
              { value: "culture", label: "문화예술 지원" },
              { value: "export", label: "해외 진출 지원" },
            ], defaultValue: "content" },
            { key: "description", label: "사업 개요", type: "textarea", placeholder: "지원하려는 사업 또는 프로젝트를 설명하세요" },
          ]} />
        )}
      </div>
    </div>
  );
}
