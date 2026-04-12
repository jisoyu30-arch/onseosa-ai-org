export interface WritingPrompt {
  id: string;
  situationKo: string;
  hintEs?: string;
  level: 1 | 2 | 3;
}

export const writingPrompts: WritingPrompt[] = [
  // Level 1 — 기본 인사/수업
  { id: 'wp01', situationKo: '수업에서 선생님께 인사해보세요.', hintEs: 'Hola, ...', level: 1 },
  { id: 'wp02', situationKo: '"잘 지내?"라고 물어보세요.', hintEs: '¿Todo ...?', level: 1 },
  { id: 'wp03', situationKo: '파트너에게 "고마워요"라고 말하세요.', level: 1 },
  { id: 'wp04', situationKo: '"천천히 해주세요"라고 선생님께 부탁하세요.', hintEs: 'Más ...', level: 1 },
  { id: 'wp05', situationKo: '수업에서 "다시 한번 해볼까요?"라고 말해보세요.', level: 1 },
  { id: 'wp06', situationKo: '"어깨 힘 빼"라고 스페인어로 말해보세요.', hintEs: 'Relajá ...', level: 1 },
  { id: 'wp07', situationKo: '선생님께 "잘 모르겠어요"라고 말해보세요.', level: 1 },

  // Level 2 — 걷기/움직임
  { id: 'wp08', situationKo: '"한 걸음 앞으로"를 스페인어로 말해보세요.', hintEs: 'Un paso ...', level: 2 },
  { id: 'wp09', situationKo: '파트너에게 "잠깐 멈추자"고 말해보세요.', level: 2 },
  { id: 'wp10', situationKo: '"음악을 느껴봐"라고 말해보세요.', hintEs: 'Sentí ...', level: 2 },
  { id: 'wp11', situationKo: '"옆으로 걸어볼까?"라고 제안해보세요.', level: 2 },
  { id: 'wp12', situationKo: '선생님이 "살리다부터 시작하자"라고 할 때 대답해보세요.', level: 2 },
  { id: 'wp13', situationKo: '"리드가 아주 편해요"라고 칭찬해보세요.', level: 2 },

  // Level 3 — 회전/구조/밀롱가
  { id: 'wp14', situationKo: '"오초를 한번 해볼까요?"라고 말해보세요.', hintEs: '¿Hacemos ...?', level: 3 },
  { id: 'wp15', situationKo: '밀롱가에서 "한 탄다 함께 추실래요?"라고 신청해보세요.', level: 3 },
  { id: 'wp16', situationKo: '"오늘 음악이 너무 좋다"고 말해보세요.', level: 3 },
  { id: 'wp17', situationKo: '"정말 즐거웠어요, 고마워요"라고 인사해보세요.', level: 3 },
  { id: 'wp18', situationKo: '"히로를 연습하고 싶어요"라고 말해보세요.', level: 3 },
  { id: 'wp19', situationKo: '밀롱가에서 자연스럽게 거절하는 말을 해보세요.', level: 3 },
  { id: 'wp20', situationKo: '"다음에 또 만나요"라고 작별 인사를 해보세요.', hintEs: 'Nos vemos ...', level: 3 },
];
