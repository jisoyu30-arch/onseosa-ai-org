import { Quiz } from '../types';

export const quizzesL1Extra: Record<string, Quiz> = {
  // L1 확장 퀴즈 — 레슨당 4개 추가 (확장 문장 s1_XX_4~10에서 출제)

  // L1-01: 첫 인사
  q1_01_5: { id: 'q1_01_5', type: 'multiple_choice', sentenceId: 's1_01_4', question: '"어떻게 지내?"를 스페인어로?', options: ['¿Cómo estás?', '¿Qué tal?', '¿Todo bien?', '¿Cómo te llamás?'], correctAnswer: '¿Cómo estás?' },
  q1_01_6: { id: 'q1_01_6', type: 'fill_blank', sentenceId: 's1_01_5', question: 'Bien, ¿y _____?', questionKo: '잘 지내, 너는?', correctAnswer: 'vos', options: ['vos', 'tú', 'usted', 'yo'] },
  q1_01_7: { id: 'q1_01_7', type: 'multiple_choice', sentenceId: 's1_01_9', question: '"¿Listos?"는?', options: ['준비됐어?', '끝났어?', '시작해?', '멈춰?'], correctAnswer: '준비됐어?' },
  q1_01_8: { id: 'q1_01_8', type: 'word_order', sentenceId: 's1_01_6', question: '문장을 배열하세요.', questionKo: '수업에 오신 걸 환영해요.', words: ['Bienvenidos', 'a', 'la', 'clase.'], correctAnswer: 'Bienvenidos a la clase.' },

  // L1-02: 얼굴과 시선
  q1_02_5: { id: 'q1_02_5', type: 'multiple_choice', sentenceId: 's1_02_5', question: '"파트너를 봐"를 스페인어로?', options: ['Mirá a tu pareja.', 'Mirá al piso.', 'Mirá al frente.', 'Mirá para arriba.'], correctAnswer: 'Mirá a tu pareja.' },
  q1_02_6: { id: 'q1_02_6', type: 'fill_blank', sentenceId: 's1_02_10', question: '_____ un poco.', questionKo: '살짝 미소 지어.', correctAnswer: 'Sonreí', options: ['Sonreí', 'Mirá', 'Relajá', 'Bajá'] },
  q1_02_7: { id: 'q1_02_7', type: 'multiple_choice', sentenceId: 's1_02_7', question: '"No cierres los ojos"는?', options: ['눈 감지 마', '눈을 떠', '눈을 봐', '눈을 내려'], correctAnswer: '눈 감지 마' },
  q1_02_8: { id: 'q1_02_8', type: 'word_order', sentenceId: 's1_02_5', question: '문장을 배열하세요.', questionKo: '파트너를 봐.', words: ['Mirá', 'a', 'tu', 'pareja.'], correctAnswer: 'Mirá a tu pareja.' },

  // L1-03: 어깨와 목
  q1_03_5: { id: 'q1_03_5', type: 'multiple_choice', sentenceId: 's1_03_4', question: '"어깨를 놓아"를 스페인어로?', options: ['Soltá los hombros.', 'Bajá los hombros.', 'Mové los hombros.', 'Relajá los hombros.'], correctAnswer: 'Soltá los hombros.' },
  q1_03_6: { id: 'q1_03_6', type: 'fill_blank', sentenceId: 's1_03_10', question: 'Espalda _____.', questionKo: '등은 곧게.', correctAnswer: 'recta', options: ['recta', 'suave', 'grande', 'libre'] },
  q1_03_7: { id: 'q1_03_7', type: 'multiple_choice', sentenceId: 's1_03_5', question: '"No levantes los hombros"는?', options: ['어깨 올리지 마', '어깨 내려', '어깨 돌려', '어깨 펴'], correctAnswer: '어깨 올리지 마' },
  q1_03_8: { id: 'q1_03_8', type: 'word_order', sentenceId: 's1_03_9', question: '문장을 배열하세요.', questionKo: '가슴 열어.', words: ['Abrí', 'el', 'pecho.'], correctAnswer: 'Abrí el pecho.' },

  // L1-04: 팔과 손
  q1_04_5: { id: 'q1_04_5', type: 'multiple_choice', sentenceId: 's1_04_4', question: '"팔 힘 풀어"를 스페인어로?', options: ['Aflojá los brazos.', 'Mové los brazos.', 'Bajá los brazos.', 'Sentí los brazos.'], correctAnswer: 'Aflojá los brazos.' },
  q1_04_6: { id: 'q1_04_6', type: 'fill_blank', sentenceId: 's1_04_8', question: 'Mantené el _____.', questionKo: '접촉을 유지해.', correctAnswer: 'contacto', options: ['contacto', 'abrazo', 'paso', 'eje'] },
  q1_04_7: { id: 'q1_04_7', type: 'multiple_choice', sentenceId: 's1_04_10', question: '"Livianito"는?', options: ['가볍게', '세게', '빠르게', '천천히'], correctAnswer: '가볍게' },
  q1_04_8: { id: 'q1_04_8', type: 'word_order', sentenceId: 's1_04_6', question: '문장을 배열하세요.', questionKo: '왼손은 여기.', words: ['La', 'mano', 'izquierda', 'acá.'], correctAnswer: 'La mano izquierda acá.' },

  // L1-05: 호흡
  q1_05_5: { id: 'q1_05_5', type: 'multiple_choice', sentenceId: 's1_05_6', question: '"들이쉬어"를 스페인어로?', options: ['Inhalá.', 'Exhalá.', 'Respirá.', 'Soltá.'], correctAnswer: 'Inhalá.' },
  q1_05_6: { id: 'q1_05_6', type: 'multiple_choice', sentenceId: 's1_05_10', question: '"Disfrutá"는?', options: ['즐겨', '멈춰', '걸어', '봐'], correctAnswer: '즐겨' },
  q1_05_7: { id: 'q1_05_7', type: 'fill_blank', sentenceId: 's1_05_5', question: 'Aflojá el _____.', questionKo: '몸 힘 풀어.', correctAnswer: 'cuerpo', options: ['cuerpo', 'brazo', 'pie', 'cuello'] },
  q1_05_8: { id: 'q1_05_8', type: 'word_order', sentenceId: 's1_05_9', question: '문장을 배열하세요.', questionKo: '다 괜찮아.', words: ['Está', 'todo', 'bien.'], correctAnswer: 'Está todo bien.' },

  // L1-06: 축
  q1_06_5: { id: 'q1_06_5', type: 'multiple_choice', sentenceId: 's1_06_6', question: '"위에 머물러"를 스페인어로?', options: ['Quedate arriba.', 'Bajá abajo.', 'Mové arriba.', 'Volvé arriba.'], correctAnswer: 'Quedate arriba.' },
  q1_06_6: { id: 'q1_06_6', type: 'fill_blank', sentenceId: 's1_06_8', question: 'Sentí el _____.', questionKo: '바닥을 느껴.', correctAnswer: 'piso', options: ['piso', 'aire', 'brazo', 'eje'] },
  q1_06_7: { id: 'q1_06_7', type: 'multiple_choice', sentenceId: 's1_06_5', question: '"No te caigas"는?', options: ['넘어지지 마', '올라가지 마', '걷지 마', '돌지 마'], correctAnswer: '넘어지지 마' },
  q1_06_8: { id: 'q1_06_8', type: 'word_order', sentenceId: 's1_06_9', question: '문장을 배열하세요.', questionKo: '발을 제대로 딛어.', words: ['Apoyá', 'bien', 'los', 'pies.'], correctAnswer: 'Apoyá bien los pies.' },

  // L1-07: 체중
  q1_07_5: { id: 'q1_07_5', type: 'multiple_choice', sentenceId: 's1_07_4', question: '"무게를 한쪽 다리로"를 스페인어로?', options: ['Todo el peso a una pierna.', 'Todo el peso al centro.', 'Todo el peso adelante.', 'Todo el peso atrás.'], correctAnswer: 'Todo el peso a una pierna.' },
  q1_07_6: { id: 'q1_07_6', type: 'fill_blank', sentenceId: 's1_07_6', question: 'No te quedes a _____.', questionKo: '중간에 걸치지 마.', correctAnswer: 'mitad', options: ['mitad', 'lado', 'centro', 'frente'] },
  q1_07_7: { id: 'q1_07_7', type: 'multiple_choice', sentenceId: 's1_07_10', question: '"Muy bien, así"는?', options: ['아주 좋아, 그렇게', '안 돼, 다시', '더 빨리', '멈춰'], correctAnswer: '아주 좋아, 그렇게' },
  q1_07_8: { id: 'q1_07_8', type: 'word_order', sentenceId: 's1_07_9', question: '문장을 배열하세요.', questionKo: '천천히, 서두르지 않고.', words: ['Despacio,', 'sin', 'apuro.'], correctAnswer: 'Despacio, sin apuro.' },

  // L1-08: 아브라소
  q1_08_5: { id: 'q1_08_5', type: 'multiple_choice', sentenceId: 's1_08_6', question: '"아브라소는 잡는 게 아니야"를 스페인어로?', options: ['El abrazo no es agarrar.', 'El abrazo es fuerte.', 'El abrazo es grande.', 'El abrazo es rápido.'], correctAnswer: 'El abrazo no es agarrar.' },
  q1_08_6: { id: 'q1_08_6', type: 'fill_blank', sentenceId: 's1_08_9', question: 'La mano en la _____.', questionKo: '손은 등에.', correctAnswer: 'espalda', options: ['espalda', 'cabeza', 'pierna', 'cara'] },
  q1_08_7: { id: 'q1_08_7', type: 'multiple_choice', sentenceId: 's1_08_10', question: '"¿Estás cómoda así?"는?', options: ['이렇게 하면 편해?', '이렇게 하면 아파?', '이렇게 하면 맞아?', '이렇게 하면 끝?'], correctAnswer: '이렇게 하면 편해?' },
  q1_08_8: { id: 'q1_08_8', type: 'word_order', sentenceId: 's1_08_4', question: '문장을 배열하세요.', questionKo: '가슴을 가까이.', words: ['Acercá', 'el', 'pecho.'], correctAnswer: 'Acercá el pecho.' },

  // L1-09: 연결
  q1_09_5: { id: 'q1_09_5', type: 'multiple_choice', sentenceId: 's1_09_5', question: '"생각하지 말고 느껴"를 스페인어로?', options: ['No pienses, sentí.', 'No mires, sentí.', 'No camines, sentí.', 'No hables, sentí.'], correctAnswer: 'No pienses, sentí.' },
  q1_09_6: { id: 'q1_09_6', type: 'fill_blank', sentenceId: 's1_09_6', question: 'Estamos _____.', questionKo: '우리 함께야.', correctAnswer: 'juntos', options: ['juntos', 'solos', 'lejos', 'cerca'] },
  q1_09_7: { id: 'q1_09_7', type: 'multiple_choice', sentenceId: 's1_09_10', question: '"Ahí está la conexión"은?', options: ['그게 연결이야', '그게 축이야', '그게 리드야', '그게 끝이야'], correctAnswer: '그게 연결이야' },
  q1_09_8: { id: 'q1_09_8', type: 'word_order', sentenceId: 's1_09_9', question: '문장을 배열하세요.', questionKo: '같이 숨 쉬자.', words: ['Respiremos', 'juntos.'], correctAnswer: 'Respiremos juntos.' },

  // L1-10: 역할극
  q1_10_5: { id: 'q1_10_5', type: 'multiple_choice', sentenceId: 's1_10_6', question: '"Perfecto"는?', options: ['완벽해', '다시 해', '안 돼', '멈춰'], correctAnswer: '완벽해' },
  q1_10_6: { id: 'q1_10_6', type: 'fill_blank', sentenceId: 's1_10_8', question: 'Vamos de _____.', questionKo: '다시 하자.', correctAnswer: 'nuevo', options: ['nuevo', 'vuelta', 'lejos', 'cerca'] },
  q1_10_7: { id: 'q1_10_7', type: 'multiple_choice', sentenceId: 's1_10_9', question: '"Lo estás haciendo bien"은?', options: ['잘 하고 있어', '못 하고 있어', '멈춰야 해', '다시 해야 해'], correctAnswer: '잘 하고 있어' },
  q1_10_8: { id: 'q1_10_8', type: 'word_order', sentenceId: 's1_10_10', question: '문장을 배열하세요.', questionKo: '다음 수업에 봐요.', words: ['Nos', 'vemos', 'la', 'próxima', 'clase.'], correctAnswer: 'Nos vemos la próxima clase.' },
};
