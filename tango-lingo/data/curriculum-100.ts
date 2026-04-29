// 100일 커리큘럼 — 130개 dialogue를 100일에 분배
// 학습 곡선: 초반은 천천히 (1/day), 후반은 빠르게 (2/day)
// 레벨 진행: A1 → A2 → B1 → B2

import { allDialogues } from './dialogues';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface DayPlan {
  day: number;             // 1~100
  level: CefrLevel;
  newDialogueIds: string[];   // 그 날의 신규 학습 (1~2개)
  themeKo: string;
}

const LEVEL_THEMES: { range: [number, number]; level: CefrLevel; themes: string[] }[] = [
  {
    range: [1, 20], level: 'A1',
    themes: [
      '첫 인사', '얼굴과 시선', '어깨와 목', '팔과 손', '발의 위치',
      '체중 이동', '기본 박자', '카운트', '간단한 응답', '수업 마무리',
      '인사하기', '자기소개', '상태 묻기', '감사 표현', '간단한 사과',
      '도움 요청', '확인하기', '동의하기', '거절하기', '작별 인사',
    ],
  },
  {
    range: [21, 44], level: 'A2',
    themes: [
      '걷기 시작', '리드 따르기', '방향 전환', '멈춤과 시작', '음악 듣기',
      '리듬 맞추기', '파트너 연결', '공간 인식', '실수 인정',
      '재시도', '느낌 표현', '간단한 칭찬', '교정 받기', '질문하기',
      '확인 요청', '대안 제시', '의견 묻기', '시간 약속',
      '장소 약속', '도구 얘기', '신발 얘기', '음악 취향', '경험 공유', '계획 얘기',
    ],
  },
  {
    range: [45, 70], level: 'B1',
    themes: [
      '오초 배우기', '히로 시도', '복잡한 회전', '기술 피드백', '교정 이해',
      '구체적 질문', '비교 표현', '예시 요청', '시범 부탁', '연습 다짐',
      '감정 미묘', '간접 표현', '제안 거절', '대안 협상', '상황 설명',
      '과거 회상', '미래 가정', '조건 표현', '비유 사용', '리듬 토론',
      '음악사 얘기', '오케스트라 비교', '바일레 평가', '스타일 토론',
      '학습 전략', '커뮤니티',
    ],
  },
  {
    range: [71, 88], level: 'B1',
    themes: [
      '연습 피드백', '피드백 주기', '관계 매너', '문화 차이', '실수 후 회복',
      '감사 깊이', '미묘한 거절', '기분 공유', '컨디션 얘기',
      '음악 감상', '깊은 토론', '의견 차이', '존중 표현',
      '이야기 듣기', '경험 공유', '조언 구하기', '조언 주기', '격려',
    ],
  },
  {
    range: [89, 100], level: 'B2',
    themes: [
      '밀롱가 입장', '카베세오 마스터', '탄다 초대 정중',
      '탄다 후 감사', '코르티나 대화', '신규 친구', 'DJ 칭찬',
      '음악 신청', '복잡한 사회 상황', '갈등 해소', '깊은 우정', '졸업',
    ],
  },
];

/** 자동 생성: 130개 dialogue를 100일에 분배 */
function buildCurriculum(): DayPlan[] {
  const allIds = Object.keys(allDialogues).sort();   // d1_01_1 → d5_16_2 순서
  const totalDialogues = allIds.length;
  const days = 100;

  const plans: DayPlan[] = [];
  let cursor = 0;

  // 날짜별 신규 개수: 1~70일은 1개, 71~100일은 2개 (학습 곡선)
  for (let day = 1; day <= days; day++) {
    const newCount = day <= 70 ? 1 : 2;
    const ids: string[] = [];
    for (let i = 0; i < newCount && cursor < totalDialogues; i++) {
      ids.push(allIds[cursor++]);
    }
    // 부족하면 빈 배열 (마지막에 다 소진된 경우 — 거의 발생 안 함)

    // 레벨 + 테마 매핑
    const themeBlock = LEVEL_THEMES.find((t) => day >= t.range[0] && day <= t.range[1])!;
    const themeIdx = day - themeBlock.range[0];
    const themeKo = themeBlock.themes[themeIdx % themeBlock.themes.length];

    plans.push({
      day,
      level: themeBlock.level,
      newDialogueIds: ids,
      themeKo,
    });
  }
  return plans;
}

export const curriculum100: DayPlan[] = buildCurriculum();

export const getDayPlan = (day: number): DayPlan | undefined =>
  curriculum100.find((p) => p.day === day);

/** 시작일 + 오늘 → Day 번호 (1~100) */
export function calcCurrentDay(startDate: string): number {
  const start = new Date(startDate).getTime();
  const today = new Date().getTime();
  const days = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(100, days));
}
