import { Quiz } from '../types';

export const quizzesL5Extra2: Record<string, Quiz> = {
  // L5 확장2 퀴즈 — 레슨당 2개 (meaning_match + reverse_translate)

  // L5-01: 밀롱가 도착
  q5_01_9: { id: 'q5_01_9', type: 'meaning_match', sentenceId: 's5_01_14', question: 'Es mi primera vez acá.', options: ['여기 처음이에요', '자주 와요', '오랜만이에요', '마지막이에요'], correctAnswer: '여기 처음이에요' },
  q5_01_10: { id: 'q5_01_10', type: 'reverse_translate', sentenceId: 's5_01_11', question: '앉을 자리 있어요?', correctAnswer: '¿Hay lugar para sentarse?' },

  // L5-02: 처음 만남
  q5_02_9: { id: 'q5_02_9', type: 'meaning_match', sentenceId: 's5_02_12', question: 'Hace poco, unos meses.', options: ['얼마 안 됐어요, 몇 달요', '오래됐어요, 몇 년이요', '아직 안 배웠어요', '어제 시작했어요'], correctAnswer: '얼마 안 됐어요, 몇 달요' },
  q5_02_10: { id: 'q5_02_10', type: 'reverse_translate', sentenceId: 's5_02_15', question: '다시 만나길 바라요.', correctAnswer: 'Espero verte de nuevo.' },

  // L5-03: 카베세오
  q5_03_9: { id: 'q5_03_9', type: 'meaning_match', sentenceId: 's5_03_14', question: 'El cabeceo es discreto.', options: ['카베세오는 눈에 안 띄게', '카베세오는 크게', '카베세오는 말로', '카베세오는 빠르게'], correctAnswer: '카베세오는 눈에 안 띄게' },
  q5_03_10: { id: 'q5_03_10', type: 'reverse_translate', sentenceId: 's5_03_12', question: '시선으로 응답해.', correctAnswer: 'Respondé con la mirada.' },

  // L5-04: 춤 신청
  q5_04_9: { id: 'q5_04_9', type: 'meaning_match', sentenceId: 's5_04_12', question: 'Sí, con mucho gusto.', options: ['네, 기꺼이요', '아니요, 됐어요', '잠깐만요', '모르겠어요'], correctAnswer: '네, 기꺼이요' },
  q5_04_10: { id: 'q5_04_10', type: 'reverse_translate', sentenceId: 's5_04_11', question: '이 탄다 같이 출래요?', correctAnswer: '¿Te gustaría bailar esta tanda?' },

  // L5-05: 춤 도중 배려
  q5_05_9: { id: 'q5_05_9', type: 'meaning_match', sentenceId: 's5_05_13', question: 'Disculpá, fue sin querer.', options: ['미안해요, 일부러 그런 게 아니에요', '잘했어요', '다시 해요', '괜찮아요'], correctAnswer: '미안해요, 일부러 그런 게 아니에요' },
  q5_05_10: { id: 'q5_05_10', type: 'reverse_translate', sentenceId: 's5_05_11', question: '아프게 했어요?', correctAnswer: '¿Te lastimé?' },

  // L5-06: 음악 대화
  q5_06_9: { id: 'q5_06_9', type: 'meaning_match', sentenceId: 's5_06_15', question: 'Esta canción es hermosa.', options: ['이 노래 정말 아름다워요', '이 노래 모르겠어요', '이 노래 별로예요', '이 노래 빨라요'], correctAnswer: '이 노래 정말 아름다워요' },
  q5_06_10: { id: 'q5_06_10', type: 'reverse_translate', sentenceId: 's5_06_11', question: '이 오케스트라 알아요?', correctAnswer: '¿Conocés esta orquesta?' },

  // L5-07: 칭찬
  q5_07_9: { id: 'q5_07_9', type: 'meaning_match', sentenceId: 's5_07_12', question: 'Bailás muy rico.', options: ['춤이 정말 맛있어요', '춤이 어려워요', '춤이 빨라요', '춤이 이상해요'], correctAnswer: '춤이 정말 맛있어요' },
  q5_07_10: { id: 'q5_07_10', type: 'reverse_translate', sentenceId: 's5_07_13', question: '당신의 연결은 특별해요.', correctAnswer: 'Tu conexión es especial.' },

  // L5-08: 바닥 문제
  q5_08_9: { id: 'q5_08_9', type: 'meaning_match', sentenceId: 's5_08_14', question: 'Perdón, nos chocamos.', options: ['미안해요, 부딪혔어요', '미안해요, 늦었어요', '괜찮아요, 가요', '좋아요, 다시'], correctAnswer: '미안해요, 부딪혔어요' },
  q5_08_10: { id: 'q5_08_10', type: 'reverse_translate', sentenceId: 's5_08_15', question: '론다를 지키자.', correctAnswer: 'Cuidemos la ronda.' },

  // L5-09: 탄다 마무리
  q5_09_9: { id: 'q5_09_9', type: 'meaning_match', sentenceId: 's5_09_11', question: 'Fue una tanda hermosa.', options: ['아름다운 탄다였어요', '어려운 탄다였어요', '짧은 탄다였어요', '빠른 탄다였어요'], correctAnswer: '아름다운 탄다였어요' },
  q5_09_10: { id: 'q5_09_10', type: 'reverse_translate', sentenceId: 's5_09_15', question: '또 같이 추면 좋겠어요.', correctAnswer: 'Ojalá bailemos otra vez.' },

  // L5-10: 정중한 거절
  q5_10_9: { id: 'q5_10_9', type: 'meaning_match', sentenceId: 's5_10_12', question: 'Quizás más tarde.', options: ['아마 나중에요', '지금 바로요', '안 돼요', '좋아요'], correctAnswer: '아마 나중에요' },
  q5_10_10: { id: 'q5_10_10', type: 'reverse_translate', sentenceId: 's5_10_14', question: '초대 감사해요.', correctAnswer: 'Gracias por la invitación.' },

  // L5-11: 휴식
  q5_11_9: { id: 'q5_11_9', type: 'meaning_match', sentenceId: 's5_11_13', question: 'Mis pies necesitan descanso.', options: ['발이 쉬어야 해요', '발이 아파요', '발이 커요', '발이 빨라요'], correctAnswer: '발이 쉬어야 해요' },
  q5_11_10: { id: 'q5_11_10', type: 'reverse_translate', sentenceId: 's5_11_11', question: '물 필요해요.', correctAnswer: 'Necesito agua.' },

  // L5-12: 한 탄다 더
  q5_12_9: { id: 'q5_12_9', type: 'meaning_match', sentenceId: 's5_12_15', question: 'Cada tanda con vos es especial.', options: ['당신과의 모든 탄다가 특별해요', '이 탄다는 별로예요', '마지막 탄다예요', '첫 탄다예요'], correctAnswer: '당신과의 모든 탄다가 특별해요' },
  q5_12_10: { id: 'q5_12_10', type: 'reverse_translate', sentenceId: 's5_12_11', question: '한 탄다 더요?', correctAnswer: '¿Una tanda más?' },

  // L5-13: 소셜 대화
  q5_13_9: { id: 'q5_13_9', type: 'meaning_match', sentenceId: 's5_13_13', question: '¿Qué milongas me recomendás?', options: ['어떤 밀롱가를 추천해요?', '어떤 음악을 좋아해요?', '어떤 선생님이에요?', '어떤 탱고를 춰요?'], correctAnswer: '어떤 밀롱가를 추천해요?' },
  q5_13_10: { id: 'q5_13_10', type: 'reverse_translate', sentenceId: 's5_13_11', question: '여기 자주 오세요?', correctAnswer: '¿Venís seguido acá?' },

  // L5-14: 플로어 예절
  q5_14_9: { id: 'q5_14_9', type: 'meaning_match', sentenceId: 's5_14_15', question: 'El respeto es la base.', options: ['존중이 기본이야', '기술이 기본이야', '속도가 기본이야', '힘이 기본이야'], correctAnswer: '존중이 기본이야' },
  q5_14_10: { id: 'q5_14_10', type: 'reverse_translate', sentenceId: 's5_14_11', question: '댄스라인을 지켜.', correctAnswer: 'Respetá la línea de baile.' },

  // L5-15: 작별
  q5_15_9: { id: 'q5_15_9', type: 'meaning_match', sentenceId: 's5_15_12', question: 'Fue una noche increíble.', options: ['놀라운 밤이었어요', '지루한 밤이었어요', '짧은 밤이었어요', '조용한 밤이었어요'], correctAnswer: '놀라운 밤이었어요' },
  q5_15_10: { id: 'q5_15_10', type: 'reverse_translate', sentenceId: 's5_15_14', question: '잘 지내요.', correctAnswer: 'Cuidate mucho.' },

  // L5-16: 밀롱가 풀 역할극
  q5_16_9: { id: 'q5_16_9', type: 'meaning_match', sentenceId: 's5_16_14', question: 'Fue la mejor noche.', options: ['최고의 밤이었어', '첫 번째 밤이었어', '마지막 밤이었어', '보통 밤이었어'], correctAnswer: '최고의 밤이었어' },
  q5_16_10: { id: 'q5_16_10', type: 'reverse_translate', sentenceId: 's5_16_15', question: '다음 주에 또 오자.', correctAnswer: 'Volvemos la semana que viene.' },
};
