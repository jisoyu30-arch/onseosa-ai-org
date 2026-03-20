import { Headquarters, Pipeline, Role } from "./types";

// ============================================================
// 4본부 22명 AI 직원 조직 구조
// ============================================================

export const HEADQUARTERS: Headquarters[] = [
  {
    id: "operations",
    name: "운영기획본부",
    icon: "🏛️",
    color: "#6366F1",
    roles: [
      { id: "총괄운영실장", name: "총괄운영실장", headquartersId: "operations", description: "전체 운영 총괄, 모닝리포트 생성, 의사결정 지원", icon: "👔" },
      { id: "전략성장실장", name: "전략성장실장", headquartersId: "operations", description: "성장 전략, 지원사업 감독, 신규 사업 기회 분석", icon: "📈" },
      { id: "지원사업매니저", name: "지원사업매니저", headquartersId: "operations", description: "공모전/지원사업 발굴, 신청서 작성, 일정 관리", icon: "📋" },
      { id: "재무관리매니저", name: "재무관리매니저", headquartersId: "operations", description: "매출/비용 관리, 예산 추적, 재무 보고", icon: "💰" },
      { id: "법무리스크매니저", name: "법무리스크매니저", headquartersId: "operations", description: "저작권/계약/플랫폼 리스크 검토, 법적 플래그", icon: "⚖️" },
      { id: "품질관리매니저", name: "품질관리매니저", headquartersId: "operations", description: "모든 산출물 최종 QA 게이트, 승인/반려 결정", icon: "✅" },
    ],
  },
  {
    id: "content",
    name: "콘텐츠창작본부",
    icon: "✍️",
    color: "#EC4899",
    roles: [
      { id: "IP콘텐츠전략실장", name: "IP콘텐츠전략실장", headquartersId: "content", description: "IP 전략, 창작 방향 총괄, 세계관 관리", icon: "🎯" },
      { id: "기획작가", name: "기획작가", headquartersId: "content", description: "콘텐츠 기획, 숏폼 대본, SNS 카피, 인스타그램", icon: "📝" },
      { id: "소설작가", name: "소설작가", headquartersId: "content", description: "단편소설, 전자책 집필, 문학 편집", icon: "🖊️" },
      { id: "웹소설작가", name: "웹소설작가", headquartersId: "content", description: "웹소설 연재 집필, 에피소드 구조 설계", icon: "📖" },
      { id: "웹드라마작가", name: "웹드라마작가", headquartersId: "content", description: "숏폼 드라마 시나리오, 중국 시장 최적화", icon: "🎬" },
      { id: "작사가", name: "작사가", headquartersId: "content", description: "작사, 가사 방향, 세계관 연동 가사", icon: "🎤" },
      { id: "작곡프로듀서", name: "작곡프로듀서", headquartersId: "content", description: "AI 음원 제작, Suno 프롬프트, 장르 기획", icon: "🎹" },
    ],
  },
  {
    id: "production",
    name: "제작배포본부",
    icon: "🚀",
    color: "#F59E0B",
    roles: [
      { id: "제작실행실장", name: "제작실행실장", headquartersId: "production", description: "제작 총괄, 일정 관리, 품질 1차 검토", icon: "🎛️" },
      { id: "음원앨범담당", name: "음원앨범담당", headquartersId: "production", description: "음원 패키징, 메타데이터, 앨범 구성", icon: "💿" },
      { id: "영상담당", name: "영상담당", headquartersId: "production", description: "뮤비/영상 제작, Runway 프롬프트, 편집", icon: "🎥" },
      { id: "배포운영담당", name: "배포운영담당", headquartersId: "production", description: "유통, 업로드, SNS 배포, 메타데이터 관리", icon: "📤" },
    ],
  },
  {
    id: "platform",
    name: "AI시스템플랫폼본부",
    icon: "⚙️",
    color: "#10B981",
    roles: [
      { id: "AI시스템개발실장", name: "AI시스템개발실장", headquartersId: "platform", description: "AI 시스템 총괄, 기술 아키텍처 결정", icon: "🧠" },
      { id: "앱개발담당", name: "앱개발담당", headquartersId: "platform", description: "레터브릭 앱 개발, 기능 구현, 테스트", icon: "📱" },
      { id: "홈페이지운영담당", name: "홈페이지운영담당", headquartersId: "platform", description: "웹사이트/랜딩 관리, 포트폴리오, 캠페인 페이지", icon: "🌐" },
      { id: "자동화운영담당", name: "자동화운영담당", headquartersId: "platform", description: "n8n 워크플로우 자동화, 리포팅 자동화", icon: "🤖" },
    ],
  },
];

// ============================================================
// 11개 자동화 파이프라인
// ============================================================

export const PIPELINES: Pipeline[] = [
  // 제작배포본부 파이프라인
  {
    id: "music-album",
    name: "음원앨범",
    description: "AI 음원 제작부터 앨범 패키징, 메타데이터, 커버 프롬프트까지 전체 음원 릴리즈 패키지",
    icon: "🎵",
    color: "#F59E0B",
    headquartersId: "production",
    notionParentId: "32845e3548dd8142a4f8e16b12c33d4b",
    roleChain: { creator: "작곡프로듀서", reviewer: "음원앨범담당", approver: "품질관리매니저", publisher: "배포운영담당" },
    legalReview: false,
  },
  {
    id: "music-video",
    name: "뮤직비디오",
    description: "컨셉 기획, 비주얼 씬 플래닝, 영상 프롬프트, 썸네일/캡션 패키지",
    icon: "🎬",
    color: "#F59E0B",
    headquartersId: "production",
    notionParentId: "32845e3548dd8111901cd27ceb8a4b52",
    roleChain: { creator: "영상담당", reviewer: "제작실행실장", approver: "품질관리매니저", publisher: "배포운영담당" },
    legalReview: false,
  },
  {
    id: "playlist",
    name: "플레이리스트",
    description: "플레이리스트 컨셉, 트랙 그룹핑, 비주얼 패키지, 메타데이터, 퍼블리싱",
    icon: "▶️",
    color: "#F59E0B",
    headquartersId: "production",
    notionParentId: "32845e3548dd81a391fcc34651b3759c",
    roleChain: { creator: "배포운영담당", reviewer: "제작실행실장", approver: "품질관리매니저", publisher: "배포운영담당" },
    legalReview: false,
  },

  // 콘텐츠창작본부 파이프라인
  {
    id: "worldbuilding",
    name: "세계관 설정",
    description: "작품 세계관 구축, 규칙 설정, 캐릭터 설정, 갈등 구조, 설정집 산출",
    icon: "🌍",
    color: "#EC4899",
    headquartersId: "content",
    notionParentId: "32845e3548dd81e89143c82f0f256847",
    roleChain: { creator: "IP콘텐츠전략실장", reviewer: "기획작가", approver: "품질관리매니저", publisher: "IP콘텐츠전략실장" },
    legalReview: false,
  },
  {
    id: "web-novel-draft",
    name: "웹소설 초안",
    description: "컨셉 기획, 세계관 참조, 에피소드 구조, 초안 생성, 편집 검토",
    icon: "📖",
    color: "#EC4899",
    headquartersId: "content",
    notionParentId: "32845e3548dd81ff978cea15472a6f6f",
    roleChain: { creator: "웹소설작가", reviewer: "기획작가", approver: "품질관리매니저", publisher: "IP콘텐츠전략실장" },
    legalReview: false,
  },
  {
    id: "web-drama-draft",
    name: "웹드라마 대본 초안",
    description: "스토리 기획, 씬 구조, 대본 초안, 대사/씬 흐름 검토",
    icon: "🎭",
    color: "#EC4899",
    headquartersId: "content",
    notionParentId: "32845e3548dd8160b9a3c489f48a6fdd",
    roleChain: { creator: "웹드라마작가", reviewer: "기획작가", approver: "품질관리매니저", publisher: "IP콘텐츠전략실장" },
    legalReview: true,
  },
  {
    id: "short-form",
    name: "AI 숏폼 콘텐츠",
    description: "주제 선정, 훅, 숏폼 대본, 자막/해시태그, 썸네일 문구, 퍼블리싱",
    icon: "📱",
    color: "#EC4899",
    headquartersId: "content",
    notionParentId: "32845e3548dd810bb666f11d39137a18",
    roleChain: { creator: "기획작가", reviewer: "IP콘텐츠전략실장", approver: "품질관리매니저", publisher: "배포운영담당" },
    legalReview: false,
  },
  {
    id: "ebook",
    name: "전자책",
    description: "제목, 목차, 원고 패키지, 커버 컨셉, 상품 설명, 판매 메타데이터",
    icon: "📚",
    color: "#EC4899",
    headquartersId: "content",
    notionParentId: "32845e3548dd81ce9ee1fdb4cd06f13e",
    roleChain: { creator: "소설작가", reviewer: "기획작가", approver: "품질관리매니저", publisher: "배포운영담당" },
    legalReview: true,
  },
  {
    id: "instagram-post",
    name: "인스타그램 게시글",
    description: "테마, 카피, 캡션, 해시태그, 이미지 프롬프트, 포스팅 핸드오프",
    icon: "📸",
    color: "#EC4899",
    headquartersId: "content",
    notionParentId: "32845e3548dd8112944ece079b2e39f0",
    roleChain: { creator: "기획작가", reviewer: "IP콘텐츠전략실장", approver: "품질관리매니저", publisher: "배포운영담당" },
    legalReview: false,
  },

  // AI시스템플랫폼본부 파이프라인
  {
    id: "app-dev",
    name: "앱개발",
    description: "기능 기획, 구현 계획, 테스트 체크리스트, 릴리즈 노트",
    icon: "📱",
    color: "#10B981",
    headquartersId: "platform",
    notionParentId: "32845e3548dd81d09c4bef7278d501aa",
    roleChain: { creator: "앱개발담당", reviewer: "AI시스템개발실장", approver: "품질관리매니저", publisher: "자동화운영담당" },
    legalReview: true,
  },

  // 운영기획본부 파이프라인
  {
    id: "gov-support",
    name: "지원사업 준비",
    description: "지원사업 발굴, 적격성 심사, 필요서류 체크, 일정표, 초안 작성",
    icon: "📄",
    color: "#6366F1",
    headquartersId: "operations",
    notionParentId: "32845e3548dd81c9b34bed954dcb638b",
    roleChain: { creator: "지원사업매니저", reviewer: "전략성장실장", approver: "품질관리매니저", publisher: "총괄운영실장" },
    legalReview: true,
  },
];

// ============================================================
// 헬퍼 함수
// ============================================================

export function getPipelinesByHeadquarters(hqId: string): Pipeline[] {
  return PIPELINES.filter((p) => p.headquartersId === hqId);
}

export function getRoleById(roleId: string): Role | undefined {
  return HEADQUARTERS.flatMap((hq) => hq.roles).find((r) => r.id === roleId);
}

export function getHeadquartersForPipeline(pipelineId: string): Headquarters | undefined {
  const pipeline = PIPELINES.find((p) => p.id === pipelineId);
  return HEADQUARTERS.find((hq) => hq.id === pipeline?.headquartersId);
}

export function getHeadquartersById(hqId: string): Headquarters | undefined {
  return HEADQUARTERS.find((hq) => hq.id === hqId);
}
