// 365일 커리큘럼 — B1 회화 도달 목표
// 264 dialogue를 365일에 분배 + 복습 day 101개

import { allDialogues } from './dialogues';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface DayPlan {
  day: number;             // 1~365
  level: CefrLevel;
  phase: 1 | 2 | 3 | 4;
  isReviewDay: boolean;    // 복습만 하는 날
  newDialogueIds: string[];   // 신규 (복습일이면 빈 배열)
  themeKo: string;
}

// =====================================================
// Phase 정의
// =====================================================
const PHASES = [
  { phase: 1, level: 'A1' as CefrLevel, days: 60, newCount: 54, themes: [
    '첫 인사', '얼굴과 시선', '어깨와 목', '팔과 손', '발의 위치', '체중 이동',
    '기본 박자', '카운트', '간단한 응답', '수업 마무리', '인사하기', '자기소개',
    '상태 묻기', '감사 표현', '간단한 사과', '도움 요청', '확인하기', '동의하기',
    '거절하기', '작별 인사', '날씨 얘기', '시간 묻기', '장소 묻기', '나이 묻기',
    '직업 묻기', '취미 묻기', '가족 얘기', '음식 좋아함', '음료 시키기', '계산하기',
    '교통 이용', '길 묻기', '쇼핑 사이즈', '호텔 체크인', '약속 만들기', '약속 변경',
    '약속 취소', '오랜만에 인사', '소개 받기', '건강 묻기', '의약품 묻기', '다친 데',
    '도움 요청', '전화번호', '이메일 묻기', '와이파이', '추천 묻기', '거절 정중',
    '확인 부탁', '천천히 부탁', '다시 말씀해주세요', '쓰기 부탁', '이해 못함',
    '발음 묻기', '의미 묻기', '예시 부탁', '연습 제안', '자기소개 깊이', '취미 깊이',
    '공통점',
  ]},
  { phase: 2, level: 'A2' as CefrLevel, days: 90, newCount: 76, themes: [
    '걷기 시작', '리드 따르기', '방향 전환', '멈춤과 시작', '음악 듣기', '리듬 맞추기',
    '파트너 연결', '공간 인식', '실수 인정', '재시도', '느낌 표현', '간단한 칭찬',
    '교정 받기', '질문하기', '확인 요청', '대안 제시', '의견 묻기', '시간 약속',
    '장소 약속', '도구 얘기', '신발 얘기', '음악 취향', '경험 공유', '계획 얘기',
    '여행 얘기', '음식 추천', '와인 추천', '레스토랑 추천', '날씨 더위', '날씨 비',
    '계절 좋아함', '직장 생활', '주말 계획', '휴일 계획', '가족 깊이', '자녀 얘기',
    '결혼 여부', '연애 얘기', '친구 소개', '동료 얘기', '취미 자세히', '독서 취향',
    '영화 추천', '드라마 얘기', '음악 추천', '음식 알레르기', '식습관', '채식 토론',
    '운동 얘기', '요가·필라', '여행지 추천', '도시 비교', '나라 비교', '문화 차이',
    '언어 학습', '시간 관리', '돈 얘기', '집 얘기', '이사 얘기', '동물 키우기',
    '강아지', '고양이', '환경 의식', '재활용', '커피 취향', '아침 루틴', '저녁 루틴',
    '잠 얘기', '꿈 얘기', '미래 계획', '과거 회상', '학교 시절', '대학 얘기', '직업 변화',
    '이직 얘기', '창업 꿈', '은퇴 후', '일·삶 균형', '스트레스', '명상', '취미 시작',
  ]},
  { phase: 3, level: 'B1' as CefrLevel, days: 120, newCount: 90, themes: [
    '오초 배우기', '히로 시도', '복잡한 회전', '기술 피드백', '교정 이해', '구체적 질문',
    '비교 표현', '예시 요청', '시범 부탁', '연습 다짐', '감정 미묘', '간접 표현',
    '제안 거절', '대안 협상', '상황 설명', '과거 회상', '미래 가정', '조건 표현',
    '비유 사용', '리듬 토론', '음악사 얘기', '오케스트라 비교', '바일레 평가',
    '스타일 토론', '학습 전략', '커뮤니티', '연습 피드백', '피드백 주기', '관계 매너',
    '문화 차이', '실수 후 회복', '감사 깊이', '미묘한 거절', '기분 공유', '컨디션 얘기',
    '음악 감상', '깊은 토론', '의견 차이', '존중 표현', '이야기 듣기', '경험 공유',
    '조언 구하기', '조언 주기', '격려', '소문 직접', '갈등 해소', '용서 받기',
    '실망 표현', '감동 표현', '걱정 나누기', '위로하기', '축하하기', '농담', '비꼼 해석',
    '아이러니', '문화 비교', '전통 토론', '현대화 토론', '세대 차이', '청춘 회상',
    '꿈 공유', '두려움', '사랑 얘기', '이별 얘기', '결혼 깊이', '육아 얘기', '학교 깊이',
    '진로 고민', '인생 전환점', '의미 찾기', '목적 얘기', '가치관', '신념', '종교 가벼움',
    '명상 깊이', '철학 가벼움', '책 추천 깊이', '영화 분석', '음악 분석', '예술 토론',
    '여행 깊이', '문화 충격', '언어 어려움', '발음 토론', '문법 어려움', '스페인어 매력',
    '아르헨 특수', '부에노스 추억', '먹거리 추억', '와인 깊이', '음식 문화',
  ]},
  { phase: 4, level: 'B1' as CefrLevel, days: 95, newCount: 44, themes: [
    '복잡한 부탁', '미묘한 거절', '농담 던지기', '풍자 이해', '뉘앙스 표현',
    '추상적 토론', '인생 철학', '관계 정의', '경계 설정', '진심 표현', '감사 깊이',
    '재회 약속', '여정 회상', '졸업 인사', '세대 잇기', '유머 즐기기', '풍부한 비유',
    '시적 표현', '감정 절제', '깊은 침묵', '자기 성찰', '타자 이해', '갈등 변환',
    '관계 회복', '용서 깊이', '사과 진정성', '한계 인정', '강점 공유', '약점 공유',
    '꿈 함께', '협업 제안', '신뢰 쌓기', '존중 표현', '진실 말하기', '비밀 지키기',
    '기다림 가르치기', '인내 표현', '감사 길이', '재의 약속', '함께 이야기',
    '추억 만들기', '기억 공유', '시간 의미', '여정의 의미',
  ]},
];

// =====================================================
// dialogue ID를 phase에 자동 매핑
// =====================================================
function classifyDialogueId(id: string): 1 | 2 | 3 | 4 {
  // d1_xx = L1 = phase 1
  // d2_xx = L2 = phase 2
  // d3_xx = L3 = phase 3
  // d4_xx, d5_xx = L4·L5 = phase 3~4
  // dai_*, daic_* = AI 생성, level 필드 따라
  if (/^d1_/.test(id)) return 1;
  if (/^d2_/.test(id)) return 2;
  if (/^d3_/.test(id)) return 3;
  if (/^d4_/.test(id)) return 3;
  if (/^d5_/.test(id)) return 4;
  // AI 생성: id 뒤 숫자에 따라 균등 배분 (배치별 레벨 추정)
  const m = id.match(/_(\d+)$/);
  if (!m) return 2;
  const n = parseInt(m[1], 10);
  // daic_001~030 (배치1): A1·A2·B1 균등 → phase 1·2·3
  // daic_031~060 (배치2): 더 깊은 카테고리 → phase 2·3
  // daic_061~090 (배치3): 일상 + B1 → phase 2·3
  // daic_091~120 (배치4): B1·B2 → phase 3·4
  if (n <= 30) return ((n - 1) % 3) + 1 as 1 | 2 | 3;
  if (n <= 60) return ((n - 1) % 2) + 2 as 2 | 3;
  if (n <= 90) return ((n - 1) % 2) + 2 as 2 | 3;
  return ((n - 1) % 2) + 3 as 3 | 4;
}

function buildCurriculum(): DayPlan[] {
  const allIds = Object.keys(allDialogues).sort();

  // phase별 dialogue 풀 (정렬 안정성을 위해 정렬)
  const pools: Record<1 | 2 | 3 | 4, string[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const id of allIds) {
    const ph = classifyDialogueId(id);
    pools[ph].push(id);
  }

  const plans: DayPlan[] = [];
  let dayCounter = 1;

  for (const phaseDef of PHASES) {
    const ph = phaseDef.phase as 1 | 2 | 3 | 4;
    const pool = pools[ph];
    const reviewDays = phaseDef.days - phaseDef.newCount;
    const newCount = Math.min(phaseDef.newCount, pool.length);

    // 신규 분배: pool에서 newCount개 사용
    const slice = pool.slice(0, newCount);

    // 신규일·복습일 인터리브 패턴
    // 신규일 = 신규 dialogue 1개, 복습일 = SRS 복습만
    const totalDays = phaseDef.days;
    const isReview = new Array(totalDays).fill(false);
    // 복습일 균등 분포: i * reviewDays / totalDays 패턴
    for (let i = 0; i < reviewDays; i++) {
      const pos = Math.floor((i + 1) * totalDays / (reviewDays + 1));
      isReview[Math.min(pos, totalDays - 1)] = true;
    }

    let newCursor = 0;
    for (let i = 0; i < totalDays; i++) {
      const themeIdx = i % phaseDef.themes.length;
      if (isReview[i] || newCursor >= slice.length) {
        plans.push({
          day: dayCounter++,
          level: phaseDef.level,
          phase: ph,
          isReviewDay: true,
          newDialogueIds: [],
          themeKo: phaseDef.themes[themeIdx] + ' (복습)',
        });
      } else {
        plans.push({
          day: dayCounter++,
          level: phaseDef.level,
          phase: ph,
          isReviewDay: false,
          newDialogueIds: [slice[newCursor++]],
          themeKo: phaseDef.themes[themeIdx],
        });
      }
    }
  }

  return plans;
}

export const curriculum365: DayPlan[] = buildCurriculum();

export const getDayPlan = (day: number): DayPlan | undefined =>
  curriculum365.find((p) => p.day === day);

/** 시작일 + 오늘 → Day 번호 (1~365) */
export function calcCurrentDay(startDate: string): number {
  const start = new Date(startDate).getTime();
  const today = new Date().getTime();
  const days = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(365, days));
}

/** Phase 정보 */
export const PHASE_INFO = {
  1: { label: 'Phase 1 — 기초 생존', range: '1~60일', goal: 'A1 완성' },
  2: { label: 'Phase 2 — 일상 회화', range: '61~150일', goal: 'A2 완성' },
  3: { label: 'Phase 3 — 자연 대화', range: '151~270일', goal: 'B1 진입' },
  4: { label: 'Phase 4 — 회화 마스터', range: '271~365일', goal: 'B1 회화 자유로움' },
} as const;
