import { Quiz } from '../types';

/**
 * Level 1 확장 퀴즈 2차 — 레슨당 2개 추가 (q1_XX_9 ~ q1_XX_10)
 * 새 퀴즈 타입: meaning_match, reverse_translate
 * 확장 문장 s1_XX_11~15에서 출제
 */
export const quizzesL1Extra2: Record<string, Quiz> = {

  // L1-01: 첫 인사
  q1_01_9: { id: 'q1_01_9', type: 'meaning_match', sentenceId: 's1_01_13', question: 'No te preocupes, acá todos empezamos igual.', options: ['걱정 마, 여기 다 똑같이 시작했어.', '여기서 시작하자.', '우리 모두 달라.', '다 끝났어.'], correctAnswer: '걱정 마, 여기 다 똑같이 시작했어.' },
  q1_01_10: { id: 'q1_01_10', type: 'reverse_translate', sentenceId: 's1_01_14', question: '편하게 해.', correctAnswer: 'Ponete cómodo.' },

  // L1-02: 얼굴과 시선
  q1_02_9: { id: 'q1_02_9', type: 'meaning_match', sentenceId: 's1_02_12', question: 'No mires al piso.', options: ['바닥 보지 마.', '바닥을 느껴.', '바닥에 앉아.', '바닥을 밀어.'], correctAnswer: '바닥 보지 마.' },
  q1_02_10: { id: 'q1_02_10', type: 'reverse_translate', sentenceId: 's1_02_15', question: '눈으로 연결해.', correctAnswer: 'Conectá con los ojos.' },

  // L1-03: 어깨와 목
  q1_03_9: { id: 'q1_03_9', type: 'meaning_match', sentenceId: 's1_03_13', question: 'Llevá los hombros para atrás.', options: ['어깨를 뒤로 보내.', '어깨를 올려.', '어깨를 털어.', '어깨를 돌려.'], correctAnswer: '어깨를 뒤로 보내.' },
  q1_03_10: { id: 'q1_03_10', type: 'reverse_translate', sentenceId: 's1_03_11', question: '어깨를 털어.', correctAnswer: 'Sacudí los hombros.' },

  // L1-04: 팔과 손
  q1_04_9: { id: 'q1_04_9', type: 'meaning_match', sentenceId: 's1_04_13', question: 'No empujes con la mano.', options: ['손으로 밀지 마.', '손을 잡아.', '손을 놓아.', '손으로 당겨.'], correctAnswer: '손으로 밀지 마.' },
  q1_04_10: { id: 'q1_04_10', type: 'reverse_translate', sentenceId: 's1_04_15', question: '연결은 여기서 시작해.', correctAnswer: 'La conexión empieza acá.' },

  // L1-05: 호흡
  q1_05_9: { id: 'q1_05_9', type: 'meaning_match', sentenceId: 's1_05_12', question: 'Sacá el aire por la boca.', options: ['입으로 내쉬어.', '코로 숨 쉬어.', '입 벌려.', '숨 참아.'], correctAnswer: '입으로 내쉬어.' },
  q1_05_10: { id: 'q1_05_10', type: 'reverse_translate', sentenceId: 's1_05_11', question: '코로 숨 쉬어.', correctAnswer: 'Respirá por la nariz.' },

  // L1-06: 축
  q1_06_9: { id: 'q1_06_9', type: 'meaning_match', sentenceId: 's1_06_14', question: 'No te vayas para adelante.', options: ['앞으로 쏠리지 마.', '앞으로 걸어.', '뒤로 물러나.', '옆으로 가.'], correctAnswer: '앞으로 쏠리지 마.' },
  q1_06_10: { id: 'q1_06_10', type: 'reverse_translate', sentenceId: 's1_06_12', question: '위로 자라.', correctAnswer: 'Crecé para arriba.' },

  // L1-07: 체중 이동
  q1_07_9: { id: 'q1_07_9', type: 'meaning_match', sentenceId: 's1_07_14', question: 'No arrastres el pie.', options: ['발 끌지 마.', '발 올려.', '발 모아.', '발 벌려.'], correctAnswer: '발 끌지 마.' },
  q1_07_10: { id: 'q1_07_10', type: 'reverse_translate', sentenceId: 's1_07_15', question: '마지막에 발 모아.', correctAnswer: 'Cerrá los pies al final.' },

  // L1-08: 아브라소
  q1_08_9: { id: 'q1_08_9', type: 'meaning_match', sentenceId: 's1_08_13', question: '¿Te molesta si me acerco más?', options: ['더 가까이 가도 괜찮아?', '더 멀리 가도 돼?', '손잡아도 돼?', '멈춰도 돼?'], correctAnswer: '더 가까이 가도 괜찮아?' },
  q1_08_10: { id: 'q1_08_10', type: 'reverse_translate', sentenceId: 's1_08_15', question: '아브라소는 천천히 만들어 가는 거야.', correctAnswer: 'El abrazo se arma de a poco.' },

  // L1-09: 연결 느끼기
  q1_09_9: { id: 'q1_09_9', type: 'meaning_match', sentenceId: 's1_09_13', question: 'Esperá la intención.', options: ['의도를 기다려.', '빨리 움직여.', '음악을 느껴.', '멈춰.'], correctAnswer: '의도를 기다려.' },
  q1_09_10: { id: 'q1_09_10', type: 'reverse_translate', sentenceId: 's1_09_15', question: '그게 춤추는 거야.', correctAnswer: 'Eso es bailar.' },

  // L1-10: 첫 수업 역할극
  q1_10_9: { id: 'q1_10_9', type: 'meaning_match', sentenceId: 's1_10_12', question: '¿Qué fue lo más difícil?', options: ['가장 어려웠던 게 뭐야?', '가장 쉬운 게 뭐야?', '무엇이 재미있었어?', '뭘 배웠어?'], correctAnswer: '가장 어려웠던 게 뭐야?' },
  q1_10_10: { id: 'q1_10_10', type: 'reverse_translate', sentenceId: 's1_10_13', question: '집에서 연습해.', correctAnswer: 'Practicá en casa.' },
};
