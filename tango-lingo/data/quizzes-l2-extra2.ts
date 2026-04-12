import { Quiz } from '../types';

export const quizzesL2Extra2: Record<string, Quiz> = {
  // L2 확장2 퀴즈 — 레슨당 2개 (meaning_match + reverse_translate)

  // L2-01: 앞으로 걷기
  q2_01_9: { id: 'q2_01_9', type: 'meaning_match', sentenceId: 's2_01_11', question: 'El talón llega primero.', options: ['발뒤꿈치가 먼저 닿아', '발끝이 먼저 닿아', '무릎이 먼저 닿아', '발 전체로 밟아'], correctAnswer: '발뒤꿈치가 먼저 닿아' },
  q2_01_10: { id: 'q2_01_10', type: 'reverse_translate', sentenceId: 's2_01_14', question: '바닥을 밀어.', correctAnswer: 'Empujá el piso.' },

  // L2-02: 옆으로 이동
  q2_02_9: { id: 'q2_02_9', type: 'meaning_match', sentenceId: 's2_02_14', question: 'Controlá la apertura.', options: ['벌리는 폭을 조절해', '공간을 만들어', '옆으로 벌려', '발을 모아'], correctAnswer: '벌리는 폭을 조절해' },
  q2_02_10: { id: 'q2_02_10', type: 'reverse_translate', sentenceId: 's2_02_12', question: '걸음은 부드럽게.', correctAnswer: 'El paso es suave.' },

  // L2-03: 뒤로 이동
  q2_03_9: { id: 'q2_03_9', type: 'meaning_match', sentenceId: 's2_03_14', question: 'Despacio y seguro.', options: ['천천히, 그리고 안정적으로', '빠르게, 그리고 강하게', '조용히, 그리고 부드럽게', '천천히, 하지만 불안하게'], correctAnswer: '천천히, 그리고 안정적으로' },
  q2_03_10: { id: 'q2_03_10', type: 'reverse_translate', sentenceId: 's2_03_11', question: '무게를 뒤로 보내.', correctAnswer: 'Llevá el peso atrás.' },

  // L2-04: 멈추기
  q2_04_9: { id: 'q2_04_9', type: 'meaning_match', sentenceId: 's2_04_15', question: 'Disfrutá el silencio.', options: ['침묵을 즐겨', '음악을 기다려', '멈춤을 참아', '소리를 들어'], correctAnswer: '침묵을 즐겨' },
  q2_04_10: { id: 'q2_04_10', type: 'reverse_translate', sentenceId: 's2_04_12', question: '자세를 잃지 마.', correctAnswer: 'No pierdas la postura.' },

  // L2-05: 리드와 팔로우
  q2_05_9: { id: 'q2_05_9', type: 'meaning_match', sentenceId: 's2_05_12', question: 'Es un diálogo.', options: ['대화야', '명령이야', '초대야', '신호야'], correctAnswer: '대화야' },
  q2_05_10: { id: 'q2_05_10', type: 'reverse_translate', sentenceId: 's2_05_13', question: '제안해, 밀지 마.', correctAnswer: 'Proponé, no empujes.' },

  // L2-06: 마르카
  q2_06_9: { id: 'q2_06_9', type: 'meaning_match', sentenceId: 's2_06_12', question: 'Menos manos, más torso.', options: ['손은 줄이고, 몸통을 써', '손을 더 써, 몸통은 줄여', '팔을 올려, 몸통을 내려', '손은 놓고, 팔을 써'], correctAnswer: '손은 줄이고, 몸통을 써' },
  q2_06_10: { id: 'q2_06_10', type: 'reverse_translate', sentenceId: 's2_06_14', question: '마르카는 명확해.', correctAnswer: 'La marca es clara.' },

  // L2-07: 살리다 기초
  q2_07_9: { id: 'q2_07_9', type: 'meaning_match', sentenceId: 's2_07_11', question: 'La salida es un acuerdo.', options: ['살리다는 합의야', '살리다는 명령이야', '살리다는 빠르게', '살리다는 혼자야'], correctAnswer: '살리다는 합의야' },
  q2_07_10: { id: 'q2_07_10', type: 'reverse_translate', sentenceId: 's2_07_14', question: '숨 쉬고 출발해.', correctAnswer: 'Respirá y salí.' },

  // L2-08: 속도 조절
  q2_08_9: { id: 'q2_08_9', type: 'meaning_match', sentenceId: 's2_08_11', question: 'Jugá con la velocidad.', options: ['속도를 가지고 놀아', '속도를 줄여', '빠르게 걸어', '천천히만 해'], correctAnswer: '속도를 가지고 놀아' },
  q2_08_10: { id: 'q2_08_10', type: 'reverse_translate', sentenceId: 's2_08_14', question: '리듬을 바꿔.', correctAnswer: 'Variá el ritmo.' },

  // L2-09: 리듬과 걷기
  q2_09_9: { id: 'q2_09_9', type: 'meaning_match', sentenceId: 's2_09_12', question: 'Contá los tiempos.', options: ['박자를 세어', '음악을 느껴', '걸음을 세어', '리듬을 바꿔'], correctAnswer: '박자를 세어' },
  q2_09_10: { id: 'q2_09_10', type: 'reverse_translate', sentenceId: 's2_09_14', question: '강박에 걸어.', correctAnswer: 'Caminá en el tiempo fuerte.' },

  // L2-10: 보폭 맞추기
  q2_10_9: { id: 'q2_10_9', type: 'meaning_match', sentenceId: 's2_10_13', question: 'Sin esfuerzo.', options: ['힘들이지 않고', '힘을 주고', '빠르게', '천천히'], correctAnswer: '힘들이지 않고' },
  q2_10_10: { id: 'q2_10_10', type: 'reverse_translate', sentenceId: 's2_10_11', question: '자연스러운 걸음.', correctAnswer: 'Paso natural.' },

  // L2-11: 함께 걷기
  q2_11_9: { id: 'q2_11_9', type: 'meaning_match', sentenceId: 's2_11_11', question: 'Respiremos juntos.', options: ['같이 숨 쉬자', '같이 걷자', '같이 멈추자', '같이 돌자'], correctAnswer: '같이 숨 쉬자' },
  q2_11_10: { id: 'q2_11_10', type: 'reverse_translate', sentenceId: 's2_11_14', question: '같이가 더 좋아.', correctAnswer: 'Juntos es mejor.' },

  // L2-12: 걷기 역할극
  q2_12_9: { id: 'q2_12_9', type: 'meaning_match', sentenceId: 's2_12_12', question: 'Me divertí mucho.', options: ['정말 재미있었어', '정말 힘들었어', '정말 긴장했어', '정말 짧았어'], correctAnswer: '정말 재미있었어' },
  q2_12_10: { id: 'q2_12_10', type: 'reverse_translate', sentenceId: 's2_12_15', question: '같이 연습해줘서 고마워.', correctAnswer: 'Gracias por practicar conmigo.' },
};
