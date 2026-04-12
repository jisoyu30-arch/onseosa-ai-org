import { Quiz } from '../types';

export const quizzesL2Extra: Record<string, Quiz> = {
  // L2 확장 퀴즈 — 레슨당 4개 추가 (확장 문장 s2_XX_4~10에서 출제)

  // L2-01: 앞으로 걷기
  q2_01_5: { id: 'q2_01_5', type: 'multiple_choice', sentenceId: 's2_01_5', question: '"몸을 먼저 가져가"를 스페인어로?', options: ['Llevá el cuerpo primero.', 'Mové el cuerpo primero.', 'Bajá el cuerpo primero.', 'Sentí el cuerpo primero.'], correctAnswer: 'Llevá el cuerpo primero.' },
  q2_01_6: { id: 'q2_01_6', type: 'fill_blank', sentenceId: 's2_01_7', question: 'Caminá con _____.', questionKo: '의도를 가지고 걸어.', correctAnswer: 'intención', options: ['intención', 'fuerza', 'prisa', 'miedo'] },
  q2_01_7: { id: 'q2_01_7', type: 'multiple_choice', sentenceId: 's2_01_6', question: '"No arrastres los pies"는?', options: ['발을 질질 끌지 마', '발을 올려', '발을 내려', '발을 돌려'], correctAnswer: '발을 질질 끌지 마' },
  q2_01_8: { id: 'q2_01_8', type: 'word_order', sentenceId: 's2_01_8', question: '문장을 배열하세요.', questionKo: '모든 걸음이 중요해.', words: ['Cada', 'paso', 'es', 'importante.'], correctAnswer: 'Cada paso es importante.' },

  // L2-02: 옆으로 이동
  q2_02_5: { id: 'q2_02_5', type: 'multiple_choice', sentenceId: 's2_02_4', question: '"공간을 만들어"를 스페인어로?', options: ['Hacé espacio.', 'Mové espacio.', 'Sentí espacio.', 'Buscá espacio.'], correctAnswer: 'Hacé espacio.' },
  q2_02_6: { id: 'q2_02_6', type: 'fill_blank', sentenceId: 's2_02_8', question: '_____ los pies.', questionKo: '발을 모아.', correctAnswer: 'Juntá', options: ['Juntá', 'Abrí', 'Mové', 'Bajá'] },
  q2_02_7: { id: 'q2_02_7', type: 'multiple_choice', sentenceId: 's2_02_9', question: '"El paso lateral es corto"는?', options: ['옆걸음은 짧게', '옆걸음은 길게', '옆걸음은 빠르게', '옆걸음은 느리게'], correctAnswer: '옆걸음은 짧게' },
  q2_02_8: { id: 'q2_02_8', type: 'word_order', sentenceId: 's2_02_5', question: '문장을 배열하세요.', questionKo: '옆으로 잘 벌려.', words: ['Abrí', 'bien', 'al', 'costado.'], correctAnswer: 'Abrí bien al costado.' },

  // L2-03: 뒤로 이동
  q2_03_5: { id: 'q2_03_5', type: 'multiple_choice', sentenceId: 's2_03_4', question: '"뒤로 걸어"를 스페인어로?', options: ['Caminá para atrás.', 'Caminá para adelante.', 'Caminá al costado.', 'Caminá despacio.'], correctAnswer: 'Caminá para atrás.' },
  q2_03_6: { id: 'q2_03_6', type: 'fill_blank', sentenceId: 's2_03_7', question: 'Paso _____.', questionKo: '작은 걸음.', correctAnswer: 'chiquito', options: ['chiquito', 'grande', 'rápido', 'largo'] },
  q2_03_7: { id: 'q2_03_7', type: 'multiple_choice', sentenceId: 's2_03_10', question: '"Bien, otra vez"는?', options: ['좋아, 한 번 더', '안 돼, 멈춰', '빨리, 다시', '아직, 기다려'], correctAnswer: '좋아, 한 번 더' },
  q2_03_8: { id: 'q2_03_8', type: 'word_order', sentenceId: 's2_03_9', question: '문장을 배열하세요.', questionKo: '발로 바닥을 느껴.', words: ['Sentí', 'el', 'piso', 'con', 'el', 'pie.'], correctAnswer: 'Sentí el piso con el pie.' },

  // L2-04: 멈추기
  q2_04_5: { id: 'q2_04_5', type: 'multiple_choice', sentenceId: 's2_04_5', question: '"움직이지 마"를 스페인어로?', options: ['No te muevas.', 'No camines.', 'No pares.', 'No corras.'], correctAnswer: 'No te muevas.' },
  q2_04_6: { id: 'q2_04_6', type: 'fill_blank', sentenceId: 's2_04_6', question: 'Esperá la _____.', questionKo: '음악을 기다려.', correctAnswer: 'música', options: ['música', 'pausa', 'señal', 'marca'] },
  q2_04_7: { id: 'q2_04_7', type: 'multiple_choice', sentenceId: 's2_04_7', question: '"La pausa es parte del baile"는?', options: ['멈춤도 춤의 일부야', '멈춤은 쉬는 거야', '멈춤은 끝이야', '멈춤은 실수야'], correctAnswer: '멈춤도 춤의 일부야' },
  q2_04_8: { id: 'q2_04_8', type: 'word_order', sentenceId: 's2_04_10', question: '문장을 배열하세요.', questionKo: '이제 돼, 출발해.', words: ['Ahora', 'sí,', 'salí.'], correctAnswer: 'Ahora sí, salí.' },

  // L2-05: 리드와 팔로우
  q2_05_5: { id: 'q2_05_5', type: 'multiple_choice', sentenceId: 's2_05_7', question: '"초대야"를 스페인어로?', options: ['Es una invitación.', 'Es una orden.', 'Es una pregunta.', 'Es una marca.'], correctAnswer: 'Es una invitación.' },
  q2_05_6: { id: 'q2_05_6', type: 'fill_blank', sentenceId: 's2_05_8', question: 'Escuchá con el _____.', questionKo: '몸으로 들어.', correctAnswer: 'cuerpo', options: ['cuerpo', 'oído', 'brazo', 'pie'] },
  q2_05_7: { id: 'q2_05_7', type: 'multiple_choice', sentenceId: 's2_05_9', question: '"No adivines"는?', options: ['추측하지 마', '걷지 마', '멈추지 마', '돌지 마'], correctAnswer: '추측하지 마' },
  q2_05_8: { id: 'q2_05_8', type: 'word_order', sentenceId: 's2_05_10', question: '문장을 배열하세요.', questionKo: '의도를 느껴.', words: ['Sentí', 'la', 'intención.'], correctAnswer: 'Sentí la intención.' },

  // L2-06: 마르카
  q2_06_5: { id: 'q2_06_5', type: 'multiple_choice', sentenceId: 's2_06_5', question: '"손으로 리드하지 마"를 스페인어로?', options: ['No uses las manos para marcar.', 'Usá las manos para marcar.', 'Mové las manos para marcar.', 'Sentí las manos para marcar.'], correctAnswer: 'No uses las manos para marcar.' },
  q2_06_6: { id: 'q2_06_6', type: 'fill_blank', sentenceId: 's2_06_8', question: 'Claridad, no _____.', questionKo: '명확함이지, 힘이 아니야.', correctAnswer: 'fuerza', options: ['fuerza', 'marca', 'pausa', 'música'] },
  q2_06_7: { id: 'q2_06_7', type: 'multiple_choice', sentenceId: 's2_06_10', question: '"Así, perfecto"는?', options: ['그렇게, 완벽해', '아직, 더 해', '아니, 다시', '멈춰, 기다려'], correctAnswer: '그렇게, 완벽해' },
  q2_06_8: { id: 'q2_06_8', type: 'word_order', sentenceId: 's2_06_4', question: '문장을 배열하세요.', questionKo: '마르카는 몸통에서 나와.', words: ['La', 'marca', 'sale', 'del', 'torso.'], correctAnswer: 'La marca sale del torso.' },

  // L2-07: 살리다 기초
  q2_07_5: { id: 'q2_07_5', type: 'multiple_choice', sentenceId: 's2_07_4', question: '"출발 전에 연결해"를 스페인어로?', options: ['Antes de salir, conectá.', 'Antes de salir, caminá.', 'Antes de salir, pará.', 'Antes de salir, marcá.'], correctAnswer: 'Antes de salir, conectá.' },
  q2_07_6: { id: 'q2_07_6', type: 'fill_blank', sentenceId: 's2_07_7', question: 'La salida es _____.', questionKo: '살리다는 차분하게.', correctAnswer: 'tranquila', options: ['tranquila', 'rápida', 'fuerte', 'grande'] },
  q2_07_7: { id: 'q2_07_7', type: 'multiple_choice', sentenceId: 's2_07_9', question: '"El primer paso marca todo"는?', options: ['첫걸음이 모든 걸 결정해', '첫걸음은 쉬워', '첫걸음은 빨라', '첫걸음은 작아'], correctAnswer: '첫걸음이 모든 걸 결정해' },
  q2_07_8: { id: 'q2_07_8', type: 'word_order', sentenceId: 's2_07_10', question: '문장을 배열하세요.', questionKo: '이제 출발하자.', words: ['Ahora', 'sí,', 'salimos.'], correctAnswer: 'Ahora sí, salimos.' },

  // L2-08: 속도 조절
  q2_08_5: { id: 'q2_08_5', type: 'multiple_choice', sentenceId: 's2_08_5', question: '"네 속도를 찾아"를 스페인어로?', options: ['Encontrá tu velocidad.', 'Buscá tu velocidad.', 'Sentí tu velocidad.', 'Cambiá tu velocidad.'], correctAnswer: 'Encontrá tu velocidad.' },
  q2_08_6: { id: 'q2_08_6', type: 'fill_blank', sentenceId: 's2_08_7', question: 'Escuchá el _____.', questionKo: '박자를 들어.', correctAnswer: 'tiempo', options: ['tiempo', 'paso', 'cuerpo', 'abrazo'] },
  q2_08_7: { id: 'q2_08_7', type: 'multiple_choice', sentenceId: 's2_08_10', question: '"Eso, así está bien"은?', options: ['그래, 그게 맞아', '아니, 다시 해', '더 빨리', '멈춰'], correctAnswer: '그래, 그게 맞아' },
  q2_08_8: { id: 'q2_08_8', type: 'word_order', sentenceId: 's2_08_8', question: '문장을 배열하세요.', questionKo: '음악과 함께 걸어.', words: ['Caminá', 'con', 'la', 'música.'], correctAnswer: 'Caminá con la música.' },

  // L2-09: 리듬과 걷기
  q2_09_5: { id: 'q2_09_5', type: 'multiple_choice', sentenceId: 's2_09_4', question: '"맥박을 느껴"를 스페인어로?', options: ['Sentí el pulso.', 'Escuchá el pulso.', 'Mirá el pulso.', 'Buscá el pulso.'], correctAnswer: 'Sentí el pulso.' },
  q2_09_6: { id: 'q2_09_6', type: 'fill_blank', sentenceId: 's2_09_7', question: 'La música te _____.', questionKo: '음악이 너를 안내해.', correctAnswer: 'guía', options: ['guía', 'para', 'mueve', 'lleva'] },
  q2_09_7: { id: 'q2_09_7', type: 'multiple_choice', sentenceId: 's2_09_9', question: '"¿Sentís el compás?"는?', options: ['박자 느껴져?', '음악 들려?', '걸음 맞아?', '리드 느껴져?'], correctAnswer: '박자 느껴져?' },
  q2_09_8: { id: 'q2_09_8', type: 'word_order', sentenceId: 's2_09_8', question: '문장을 배열하세요.', questionKo: '눈 감고 들어봐.', words: ['Cerrá', 'los', 'ojos', 'y', 'escuchá.'], correctAnswer: 'Cerrá los ojos y escuchá.' },

  // L2-10: 보폭 맞추기
  q2_10_5: { id: 'q2_10_5', type: 'multiple_choice', sentenceId: 's2_10_5', question: '"크게 걷지 마"를 스페인어로?', options: ['No camines largo.', 'No camines corto.', 'No camines rápido.', 'No camines solo.'], correctAnswer: 'No camines largo.' },
  q2_10_6: { id: 'q2_10_6', type: 'fill_blank', sentenceId: 's2_10_7', question: 'Paso _____.', questionKo: '편한 걸음.', correctAnswer: 'cómodo', options: ['cómodo', 'largo', 'rápido', 'fuerte'] },
  q2_10_7: { id: 'q2_10_7', type: 'multiple_choice', sentenceId: 's2_10_10', question: '"Mejor chiquito que grande"는?', options: ['크게보다 작게가 나아', '작게보다 크게가 나아', '빠르게가 나아', '느리게가 나아'], correctAnswer: '크게보다 작게가 나아' },
  q2_10_8: { id: 'q2_10_8', type: 'word_order', sentenceId: 's2_10_9', question: '문장을 배열하세요.', questionKo: '편안함을 찾아.', words: ['Buscá', 'la', 'comodidad.'], correctAnswer: 'Buscá la comodidad.' },

  // L2-11: 함께 걷기
  q2_11_5: { id: 'q2_11_5', type: 'multiple_choice', sentenceId: 's2_11_4', question: '"혼자 걷지 마"를 스페인어로?', options: ['No camines solo.', 'No camines rápido.', 'No camines atrás.', 'No camines largo.'], correctAnswer: 'No camines solo.' },
  q2_11_6: { id: 'q2_11_6', type: 'fill_blank', sentenceId: 's2_11_8', question: 'Sentí que somos _____.', questionKo: '우리가 하나라고 느껴.', correctAnswer: 'uno', options: ['uno', 'dos', 'juntos', 'cerca'] },
  q2_11_7: { id: 'q2_11_7', type: 'multiple_choice', sentenceId: 's2_11_10', question: '"Así se camina en el tango"는?', options: ['이게 탱고에서 걷는 거야', '이게 탱고의 끝이야', '이게 탱고의 시작이야', '이게 탱고에서 도는 거야'], correctAnswer: '이게 탱고에서 걷는 거야' },
  q2_11_8: { id: 'q2_11_8', type: 'word_order', sentenceId: 's2_11_7', question: '문장을 배열하세요.', questionKo: '호흡으로 연결해.', words: ['Conectá', 'con', 'la', 'respiración.'], correctAnswer: 'Conectá con la respiración.' },

  // L2-12: 걷기 역할극
  q2_12_5: { id: 'q2_12_5', type: 'multiple_choice', sentenceId: 's2_12_6', question: '"걸을 준비 됐어?"를 스페인어로?', options: ['¿Listo para caminar?', '¿Listo para bailar?', '¿Listo para parar?', '¿Listo para girar?'], correctAnswer: '¿Listo para caminar?' },
  q2_12_6: { id: 'q2_12_6', type: 'fill_blank', sentenceId: 's2_12_7', question: 'Dale, _____.', questionKo: '좋아, 시작하자.', correctAnswer: 'empecemos', options: ['empecemos', 'paremos', 'giremos', 'salgamos'] },
  q2_12_7: { id: 'q2_12_7', type: 'multiple_choice', sentenceId: 's2_12_8', question: '"¿Te gustó?"는?', options: ['좋았어?', '끝났어?', '됐어?', '힘들어?'], correctAnswer: '좋았어?' },
  q2_12_8: { id: 'q2_12_8', type: 'word_order', sentenceId: 's2_12_10', question: '문장을 배열하세요.', questionKo: '계속 연습하자.', words: ['Vamos', 'a', 'seguir', 'practicando.'], correctAnswer: 'Vamos a seguir practicando.' },
};
