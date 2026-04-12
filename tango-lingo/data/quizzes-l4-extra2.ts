import { Quiz } from '../types';

export const quizzesL4Extra2: Record<string, Quiz> = {
  // L4 확장2 퀴즈 — 레슨당 2개 (meaning_match + reverse_translate)

  // L4-01: 다시 해볼까요
  q4_01_9: { id: 'q4_01_9', type: 'meaning_match', sentenceId: 's4_01_12', question: 'El cuerpo ya sabe.', options: ['몸이 이미 알아', '몸이 아직 몰라', '몸이 피곤해', '몸이 멈춰'], correctAnswer: '몸이 이미 알아' },
  q4_01_10: { id: 'q4_01_10', type: 'reverse_translate', sentenceId: 's4_01_14', question: '좌절하지 마.', correctAnswer: 'No te frustres.' },

  // L4-02: 더 좋아요
  q4_02_9: { id: 'q4_02_9', type: 'meaning_match', sentenceId: 's4_02_11', question: 'Cada vez mejor.', options: ['갈수록 좋아지네', '갈수록 어려워', '갈수록 빨라져', '갈수록 멀어져'], correctAnswer: '갈수록 좋아지네' },
  q4_02_10: { id: 'q4_02_10', type: 'reverse_translate', sentenceId: 's4_02_13', question: '그렇게 하는 거야.', correctAnswer: 'Así se hace.' },

  // L4-03: 아직 아니에요
  q4_03_9: { id: 'q4_03_9', type: 'meaning_match', sentenceId: 's4_03_11', question: 'Todavía no, pero ya casi.', options: ['아직 아니야, 근데 거의 다 왔어', '아직이야, 시작도 안 했어', '이미 됐어, 완벽해', '안 돼, 그만해'], correctAnswer: '아직 아니야, 근데 거의 다 왔어' },
  q4_03_10: { id: 'q4_03_10', type: 'reverse_translate', sentenceId: 's4_03_15', question: '인내하면 돼.', correctAnswer: 'Con paciencia sale.' },

  // L4-04: 천천히요
  q4_04_9: { id: 'q4_04_9', type: 'meaning_match', sentenceId: 's4_04_11', question: 'No hay apuro.', options: ['서두를 필요 없어', '빨리 해야 해', '시간이 없어', '늦었어'], correctAnswer: '서두를 필요 없어' },
  q4_04_10: { id: 'q4_04_10', type: 'reverse_translate', sentenceId: 's4_04_12', question: '네 시간을 가져.', correctAnswer: 'Tomá tu tiempo.' },

  // L4-05: 느낌이 안 와요
  q4_05_9: { id: 'q4_05_9', type: 'meaning_match', sentenceId: 's4_05_15', question: 'El tango se siente, no se piensa.', options: ['탱고는 느끼는 거야, 생각하는 게 아니야', '탱고는 생각하는 거야', '탱고는 보는 거야', '탱고는 외우는 거야'], correctAnswer: '탱고는 느끼는 거야, 생각하는 게 아니야' },
  q4_05_10: { id: 'q4_05_10', type: 'reverse_translate', sentenceId: 's4_05_14', question: '생각을 멈춰.', correctAnswer: 'Dejá de pensar.' },

  // L4-06: 연결이 끊겼어요
  q4_06_9: { id: 'q4_06_9', type: 'meaning_match', sentenceId: 's4_06_14', question: 'Ahora sí, te siento.', options: ['이제 느껴져', '아직 안 느껴져', '잘 모르겠어', '멈춰야 해'], correctAnswer: '이제 느껴져' },
  q4_06_10: { id: 'q4_06_10', type: 'reverse_translate', sentenceId: 's4_06_13', question: '좀 더 가까이 와.', correctAnswer: 'Acercate un poco más.' },

  // L4-07: 타이밍
  q4_07_9: { id: 'q4_07_9', type: 'meaning_match', sentenceId: 's4_07_15', question: 'El timing es todo.', options: ['타이밍이 전부야', '속도가 전부야', '힘이 전부야', '기술이 전부야'], correctAnswer: '타이밍이 전부야' },
  q4_07_10: { id: 'q4_07_10', type: 'reverse_translate', sentenceId: 's4_07_14', question: '바로 거기, 완벽해.', correctAnswer: 'Justo ahí, perfecto.' },

  // L4-08: 감정 표현
  q4_08_9: { id: 'q4_08_9', type: 'meaning_match', sentenceId: 's4_08_14', question: 'El tango me relaja.', options: ['탱고가 날 편안하게 해', '탱고가 날 긴장시켜', '탱고가 날 피곤하게 해', '탱고가 날 슬프게 해'], correctAnswer: '탱고가 날 편안하게 해' },
  q4_08_10: { id: 'q4_08_10', type: 'reverse_translate', sentenceId: 's4_08_13', question: '오늘 기분 좋아.', correctAnswer: 'Hoy me siento bien.' },

  // L4-09: 서로 피드백
  q4_09_9: { id: 'q4_09_9', type: 'meaning_match', sentenceId: 's4_09_13', question: '¿Qué te pareció?', options: ['어떻게 느꼈어?', '뭘 했어?', '누구야?', '어디 갔어?'], correctAnswer: '어떻게 느꼈어?' },
  q4_09_10: { id: 'q4_09_10', type: 'reverse_translate', sentenceId: 's4_09_11', question: '연결이 좋았어.', correctAnswer: 'Me gustó la conexión.' },

  // L4-10: 진전 대화
  q4_10_9: { id: 'q4_10_9', type: 'meaning_match', sentenceId: 's4_10_14', question: 'El tango es un camino.', options: ['탱고는 길이야', '탱고는 목표야', '탱고는 경쟁이야', '탱고는 시험이야'], correctAnswer: '탱고는 길이야' },
  q4_10_10: { id: 'q4_10_10', type: 'reverse_translate', sentenceId: 's4_10_13', question: '우리 같이 성장하고 있어.', correctAnswer: 'Estamos creciendo juntos.' },

  // L4-11: 파트너 교체 인사
  q4_11_9: { id: 'q4_11_9', type: 'meaning_match', sentenceId: 's4_11_12', question: 'Fue un placer.', options: ['즐거웠어', '힘들었어', '아쉬웠어', '긴장했어'], correctAnswer: '즐거웠어' },
  q4_11_10: { id: 'q4_11_10', type: 'reverse_translate', sentenceId: 's4_11_11', question: '같이 춰줘서 고마워.', correctAnswer: 'Gracias por bailar conmigo.' },

  // L4-12: 연습 역할극
  q4_12_9: { id: 'q4_12_9', type: 'meaning_match', sentenceId: 's4_12_14', question: 'Hoy fue muy productivo.', options: ['오늘 정말 생산적이었어', '오늘 정말 피곤했어', '오늘 별로였어', '오늘 너무 짧았어'], correctAnswer: '오늘 정말 생산적이었어' },
  q4_12_10: { id: 'q4_12_10', type: 'reverse_translate', sentenceId: 's4_12_15', question: '다음에 보자.', correctAnswer: 'Nos vemos la próxima.' },
};
