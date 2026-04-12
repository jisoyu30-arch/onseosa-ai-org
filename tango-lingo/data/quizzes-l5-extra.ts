import { Quiz } from '../types';

export const quizzesL5Extra: Record<string, Quiz> = {
  // L5 확장 퀴즈 — 레슨당 4개 추가 (확장 문장 s5_XX_4~10에서 출제)

  // L5-01: 밀롱가 도착
  q5_01_5: { id: 'q5_01_5', type: 'multiple_choice', sentenceId: 's5_01_5', question: '"좋은 밤이네"를 스페인어로?', options: ['Qué linda noche.', 'Qué lindo día.', 'Qué linda clase.', 'Qué linda música.'], correctAnswer: 'Qué linda noche.' },
  q5_01_6: { id: 'q5_01_6', type: 'fill_blank', sentenceId: 's5_01_8', question: 'Me encanta esta _____.', questionKo: '이 밀롱가 정말 좋아요.', correctAnswer: 'milonga', options: ['milonga', 'clase', 'música', 'noche'] },
  q5_01_7: { id: 'q5_01_7', type: 'multiple_choice', sentenceId: 's5_01_7', question: '"¿Está lleno hoy?"는?', options: ['오늘 사람 많아요?', '오늘 늦었어요?', '오늘 좋아요?', '오늘 끝났어요?'], correctAnswer: '오늘 사람 많아요?' },
  q5_01_8: { id: 'q5_01_8', type: 'word_order', sentenceId: 's5_01_9', question: '문장을 배열하세요.', questionKo: '음악이 좋네요.', words: ['La', 'música', 'está', 'muy', 'buena.'], correctAnswer: 'La música está muy buena.' },

  // L5-02: 처음 만남
  q5_02_5: { id: 'q5_02_5', type: 'multiple_choice', sentenceId: 's5_02_4', question: '"이름이 뭐예요?"를 스페인어로?', options: ['¿Cómo te llamás?', '¿Cómo estás?', '¿Cómo te sentís?', '¿Cómo bailás?'], correctAnswer: '¿Cómo te llamás?' },
  q5_02_6: { id: 'q5_02_6', type: 'fill_blank', sentenceId: 's5_02_6', question: 'Estoy _____ tango.', questionKo: '탱고 배우고 있어요.', correctAnswer: 'aprendiendo', options: ['aprendiendo', 'bailando', 'mirando', 'escuchando'] },
  q5_02_7: { id: 'q5_02_7', type: 'multiple_choice', sentenceId: 's5_02_10', question: '"Qué bueno conocerte"는?', options: ['만나서 반가워요', '다시 봐요', '안녕하세요', '감사해요'], correctAnswer: '만나서 반가워요' },
  q5_02_8: { id: 'q5_02_8', type: 'word_order', sentenceId: 's5_02_9', question: '문장을 배열하세요.', questionKo: '우리 한국에서 왔어요.', words: ['Somos', 'de', 'Corea.'], correctAnswer: 'Somos de Corea.' },

  // L5-03: 카베세오
  q5_03_5: { id: 'q5_03_5', type: 'multiple_choice', sentenceId: 's5_03_4', question: '"시선을 찾아"를 스페인어로?', options: ['Buscá la mirada.', 'Bajá la mirada.', 'Cerrá la mirada.', 'Mové la mirada.'], correctAnswer: 'Buscá la mirada.' },
  q5_03_6: { id: 'q5_03_6', type: 'fill_blank', sentenceId: 's5_03_8', question: 'Sin _____.', questionKo: '말 없이.', correctAnswer: 'palabras', options: ['palabras', 'música', 'pausa', 'mirada'] },
  q5_03_7: { id: 'q5_03_7', type: 'multiple_choice', sentenceId: 's5_03_9', question: '"Es la tradición"은?', options: ['이게 전통이야', '이게 현대야', '이게 새로운 거야', '이게 다른 거야'], correctAnswer: '이게 전통이야' },
  q5_03_8: { id: 'q5_03_8', type: 'word_order', sentenceId: 's5_03_7', question: '문장을 배열하세요.', questionKo: '고개로 신호를 보내.', words: ['Hacé', 'un', 'gesto', 'con', 'la', 'cabeza.'], correctAnswer: 'Hacé un gesto con la cabeza.' },

  // L5-04: 춤 신청
  q5_04_5: { id: 'q5_04_5', type: 'multiple_choice', sentenceId: 's5_04_4', question: '"추고 싶으세요?"를 스페인어로?', options: ['¿Te gustaría bailar?', '¿Te gustaría caminar?', '¿Te gustaría parar?', '¿Te gustaría girar?'], correctAnswer: '¿Te gustaría bailar?' },
  q5_04_6: { id: 'q5_04_6', type: 'fill_blank', sentenceId: 's5_04_6', question: 'Sí, vamos a la _____.', questionKo: '네, 바닥으로 가요.', correctAnswer: 'pista', options: ['pista', 'mesa', 'clase', 'puerta'] },
  q5_04_7: { id: 'q5_04_7', type: 'multiple_choice', sentenceId: 's5_04_9', question: '"Es Di Sarli, ¿no?"는?', options: ['디 사를리 아니에요?', '디 사를리 좋아요?', '디 사를리 들려요?', '디 사를리 봐요?'], correctAnswer: '디 사를리 아니에요?' },
  q5_04_8: { id: 'q5_04_8', type: 'word_order', sentenceId: 's5_04_7', question: '문장을 배열하세요.', questionKo: '이 곡을 기다리자.', words: ['Esperemos', 'esta', 'canción.'], correctAnswer: 'Esperemos esta canción.' },

  // L5-05: 춤 도중
  q5_05_5: { id: 'q5_05_5', type: 'multiple_choice', sentenceId: 's5_05_6', question: '"미안, 일부러 그런 게 아니야"를 스페인어로?', options: ['Perdón, fue sin querer.', 'Perdón, fue a propósito.', 'Perdón, fue muy fuerte.', 'Perdón, fue muy rápido.'], correctAnswer: 'Perdón, fue sin querer.' },
  q5_05_6: { id: 'q5_05_6', type: 'fill_blank', sentenceId: 's5_05_7', question: 'No te _____.', questionKo: '걱정 마요.', correctAnswer: 'preocupes', options: ['preocupes', 'muevas', 'apures', 'caigas'] },
  q5_05_7: { id: 'q5_05_7', type: 'multiple_choice', sentenceId: 's5_05_10', question: '"Bailás muy rico"는?', options: ['춤 정말 좋아요', '춤 정말 빨라요', '춤 정말 어려워요', '춤 정말 힘들어요'], correctAnswer: '춤 정말 좋아요' },
  q5_05_8: { id: 'q5_05_8', type: 'word_order', sentenceId: 's5_05_5', question: '문장을 배열하세요.', questionKo: '아브라소 편해요.', words: ['Muy', 'cómodo', 'tu', 'abrazo.'], correctAnswer: 'Muy cómodo tu abrazo.' },

  // L5-06: 음악 대화
  q5_06_5: { id: 'q5_06_5', type: 'multiple_choice', sentenceId: 's5_06_9', question: '"밀롱가 리듬이 더 좋아요"를 스페인어로?', options: ['Prefiero bailar milonga.', 'Prefiero bailar vals.', 'Prefiero bailar tango.', 'Prefiero escuchar milonga.'], correctAnswer: 'Prefiero bailar milonga.' },
  q5_06_6: { id: 'q5_06_6', type: 'fill_blank', sentenceId: 's5_06_7', question: 'Esta milonga tiene buen _____.', questionKo: '이 밀롱가 DJ 좋네요.', correctAnswer: 'DJ', options: ['DJ', 'piso', 'abrazo', 'giro'] },
  q5_06_7: { id: 'q5_06_7', type: 'multiple_choice', sentenceId: 's5_06_4', question: '"Es Troilo"는?', options: ['트로일로예요', '트로일로 아니에요', '트로일로 좋아요', '트로일로 들려요'], correctAnswer: '트로일로예요' },
  q5_06_8: { id: 'q5_06_8', type: 'word_order', sentenceId: 's5_06_10', question: '문장을 배열하세요.', questionKo: '어떤 탱고 스타일 좋아해요?', words: ['¿Qué', 'tipo', 'de', 'tango', 'te', 'gusta?'], correctAnswer: '¿Qué tipo de tango te gusta?' },

  // L5-07: 칭찬
  q5_07_5: { id: 'q5_07_5', type: 'multiple_choice', sentenceId: 's5_07_5', question: '"정말 즐거웠어요"를 스페인어로?', options: ['Disfruté mucho.', 'Bailé mucho.', 'Caminé mucho.', 'Descansé mucho.'], correctAnswer: 'Disfruté mucho.' },
  q5_07_6: { id: 'q5_07_6', type: 'fill_blank', sentenceId: 's5_07_6', question: 'Qué buena _____.', questionKo: '연결이 좋았어요.', correctAnswer: 'conexión', options: ['conexión', 'música', 'noche', 'tanda'] },
  q5_07_7: { id: 'q5_07_7', type: 'multiple_choice', sentenceId: 's5_07_9', question: '"Fue una tanda especial"은?', options: ['특별한 탄다였어요', '긴 탄다였어요', '짧은 탄다였어요', '어려운 탄다였어요'], correctAnswer: '특별한 탄다였어요' },
  q5_07_8: { id: 'q5_07_8', type: 'word_order', sentenceId: 's5_07_8', question: '문장을 배열하세요.', questionKo: '걷기가 아름다워요.', words: ['Tu', 'caminata', 'es', 'preciosa.'], correctAnswer: 'Tu caminata es preciosa.' },

  // L5-08: 바닥 문제
  q5_08_5: { id: 'q5_08_5', type: 'multiple_choice', sentenceId: 's5_08_5', question: '"더 작게 추자"를 스페인어로?', options: ['Bailemos más chiquito.', 'Bailemos más grande.', 'Bailemos más rápido.', 'Bailemos más fuerte.'], correctAnswer: 'Bailemos más chiquito.' },
  q5_08_6: { id: 'q5_08_6', type: 'fill_blank', sentenceId: 's5_08_8', question: 'Perdón por el _____.', questionKo: '부딪혀서 미안해요.', correctAnswer: 'choque', options: ['choque', 'paso', 'giro', 'boleo'] },
  q5_08_7: { id: 'q5_08_7', type: 'multiple_choice', sentenceId: 's5_08_10', question: '"Sigamos la ronda"는?', options: ['론다를 따르자', '론다를 멈추자', '론다를 바꾸자', '론다를 끝내자'], correctAnswer: '론다를 따르자' },
  q5_08_8: { id: 'q5_08_8', type: 'word_order', sentenceId: 's5_08_4', question: '문장을 배열하세요.', questionKo: '사람이 많아.', words: ['Hay', 'mucha', 'gente.'], correctAnswer: 'Hay mucha gente.' },

  // L5-09: 탄다 마무리
  q5_09_5: { id: 'q5_09_5', type: 'multiple_choice', sentenceId: 's5_09_5', question: '"아름다웠어요"를 스페인어로?', options: ['Estuvo hermoso.', 'Estuvo difícil.', 'Estuvo largo.', 'Estuvo rápido.'], correctAnswer: 'Estuvo hermoso.' },
  q5_09_6: { id: 'q5_09_6', type: 'fill_blank', sentenceId: 's5_09_8', question: 'Fue un _____ bailar con vos.', questionKo: '같이 춰서 즐거웠어요.', correctAnswer: 'placer', options: ['placer', 'gusto', 'día', 'paso'] },
  q5_09_7: { id: 'q5_09_7', type: 'multiple_choice', sentenceId: 's5_09_9', question: '"Te llevo a tu mesa"는?', options: ['자리까지 데려다줄게요', '자리에서 기다릴게요', '자리를 바꿀게요', '자리에서 쉴게요'], correctAnswer: '자리까지 데려다줄게요' },
  q5_09_8: { id: 'q5_09_8', type: 'word_order', sentenceId: 's5_09_7', question: '문장을 배열하세요.', questionKo: '또 추면 좋겠어요.', words: ['Ojalá', 'bailemos', 'otra', 'vez.'], correctAnswer: 'Ojalá bailemos otra vez.' },

  // L5-10: 거절
  q5_10_5: { id: 'q5_10_5', type: 'multiple_choice', sentenceId: 's5_10_5', question: '"오늘 컨디션이 안 좋아요"를 스페인어로?', options: ['Hoy no me siento bien.', 'Hoy me siento bien.', 'Hoy quiero bailar.', 'Hoy estoy lista.'], correctAnswer: 'Hoy no me siento bien.' },
  q5_10_6: { id: 'q5_10_6', type: 'fill_blank', sentenceId: 's5_10_8', question: 'Necesito _____ un poco.', questionKo: '좀 쉬어야 해요.', correctAnswer: 'descansar', options: ['descansar', 'bailar', 'caminar', 'girar'] },
  q5_10_7: { id: 'q5_10_7', type: 'multiple_choice', sentenceId: 's5_10_7', question: '"No es por vos"는?', options: ['당신 때문이 아니에요', '당신 때문이에요', '당신이 좋아요', '당신을 기다려요'], correctAnswer: '당신 때문이 아니에요' },
  q5_10_8: { id: 'q5_10_8', type: 'word_order', sentenceId: 's5_10_9', question: '문장을 배열하세요.', questionKo: '물어봐줘서 고마워요.', words: ['Gracias', 'por', 'preguntar.'], correctAnswer: 'Gracias por preguntar.' },

  // L5-11: 휴식
  q5_11_5: { id: 'q5_11_5', type: 'multiple_choice', sentenceId: 's5_11_6', question: '"뭐 마실까요?"를 스페인어로?', options: ['¿Tomamos algo?', '¿Bailamos algo?', '¿Miramos algo?', '¿Escuchamos algo?'], correctAnswer: '¿Tomamos algo?' },
  q5_11_6: { id: 'q5_11_6', type: 'fill_blank', sentenceId: 's5_11_7', question: 'Un _____, por favor.', questionKo: '물 하나요.', correctAnswer: 'agua', options: ['agua', 'paso', 'baile', 'giro'] },
  q5_11_7: { id: 'q5_11_7', type: 'multiple_choice', sentenceId: 's5_11_9', question: '"Ya me recuperé"는?', options: ['회복했어요', '피곤해요', '아파요', '기다려요'], correctAnswer: '회복했어요' },
  q5_11_8: { id: 'q5_11_8', type: 'word_order', sentenceId: 's5_11_10', question: '문장을 배열하세요.', questionKo: '다시 바닥으로.', words: ['Volvemos', 'a', 'la', 'pista.'], correctAnswer: 'Volvemos a la pista.' },

  // L5-12: 한 탄다 더
  q5_12_5: { id: 'q5_12_5', type: 'multiple_choice', sentenceId: 's5_12_5', question: '"이것도 계속 출래요?"를 스페인어로?', options: ['¿Seguimos con esta?', '¿Paramos con esta?', '¿Cambiamos esta?', '¿Miramos esta?'], correctAnswer: '¿Seguimos con esta?' },
  q5_12_6: { id: 'q5_12_6', type: 'fill_blank', sentenceId: 's5_12_7', question: 'No quiero _____.', questionKo: '멈추고 싶지 않아.', correctAnswer: 'parar', options: ['parar', 'bailar', 'seguir', 'girar'] },
  q5_12_7: { id: 'q5_12_7', type: 'multiple_choice', sentenceId: 's5_12_8', question: '"Esta noche es especial"은?', options: ['오늘 밤은 특별해', '오늘 밤은 길어', '오늘 밤은 힘들어', '오늘 밤은 끝났어'], correctAnswer: '오늘 밤은 특별해' },
  q5_12_8: { id: 'q5_12_8', type: 'word_order', sentenceId: 's5_12_9', question: '문장을 배열하세요.', questionKo: '당신과 추는 건 즐거움이에요.', words: ['Bailar', 'con', 'vos', 'es', 'un', 'placer.'], correctAnswer: 'Bailar con vos es un placer.' },

  // L5-13: 소셜 대화
  q5_13_5: { id: 'q5_13_5', type: 'multiple_choice', sentenceId: 's5_13_6', question: '"자주 오세요?"를 스페인어로?', options: ['¿Venís seguido?', '¿Bailás seguido?', '¿Caminás seguido?', '¿Mirás seguido?'], correctAnswer: '¿Venís seguido?' },
  q5_13_6: { id: 'q5_13_6', type: 'fill_blank', sentenceId: 's5_13_5', question: 'Llevo dos _____ bailando.', questionKo: '2년째 추고 있어요.', correctAnswer: 'años', options: ['años', 'meses', 'días', 'horas'] },
  q5_13_7: { id: 'q5_13_7', type: 'multiple_choice', sentenceId: 's5_13_10', question: '"Algún día quiero ir"는?', options: ['언젠가 가고 싶어요', '오늘 가고 싶어요', '안 가고 싶어요', '바로 가고 싶어요'], correctAnswer: '언젠가 가고 싶어요' },
  q5_13_8: { id: 'q5_13_8', type: 'word_order', sentenceId: 's5_13_8', question: '문장을 배열하세요.', questionKo: '이제 더 편해졌어요.', words: ['Ahora', 'me', 'siento', 'más', 'cómodo.'], correctAnswer: 'Ahora me siento más cómodo.' },

  // L5-14: 플로어 예절
  q5_14_5: { id: 'q5_14_5', type: 'multiple_choice', sentenceId: 's5_14_7', question: '"흐름과 함께 움직여"를 스페인어로?', options: ['Avanzá con el flujo.', 'Pará con el flujo.', 'Girá con el flujo.', 'Bajá con el flujo.'], correctAnswer: 'Avanzá con el flujo.' },
  q5_14_6: { id: 'q5_14_6', type: 'fill_blank', sentenceId: 's5_14_8', question: 'Respetá el _____.', questionKo: '공간을 존중해.', correctAnswer: 'espacio', options: ['espacio', 'tiempo', 'abrazo', 'paso'] },
  q5_14_7: { id: 'q5_14_7', type: 'multiple_choice', sentenceId: 's5_14_10', question: '"La ronda es de todos"는?', options: ['론다는 모두의 것', '론다는 나의 것', '론다는 빠른 것', '론다는 어려운 것'], correctAnswer: '론다는 모두의 것' },
  q5_14_8: { id: 'q5_14_8', type: 'word_order', sentenceId: 's5_14_4', question: '문장을 배열하세요.', questionKo: '모두 같은 방향으로.', words: ['Todos', 'van', 'en', 'la', 'misma', 'dirección.'], correctAnswer: 'Todos van en la misma dirección.' },

  // L5-15: 작별
  q5_15_5: { id: 'q5_15_5', type: 'multiple_choice', sentenceId: 's5_15_5', question: '"가야 해요"를 스페인어로?', options: ['Tengo que irme.', 'Quiero quedarme.', 'Quiero bailar.', 'Voy a volver.'], correctAnswer: 'Tengo que irme.' },
  q5_15_6: { id: 'q5_15_6', type: 'fill_blank', sentenceId: 's5_15_7', question: 'Espero _____ pronto.', questionKo: '곧 다시 보길 바래요.', correctAnswer: 'verte', options: ['verte', 'bailar', 'irme', 'volver'] },
  q5_15_7: { id: 'q5_15_7', type: 'multiple_choice', sentenceId: 's5_15_8', question: '"Cuidate"는?', options: ['잘 가요', '잘 춰요', '잘 들어요', '잘 봐요'], correctAnswer: '잘 가요' },
  q5_15_8: { id: 'q5_15_8', type: 'word_order', sentenceId: 's5_15_10', question: '문장을 배열하세요.', questionKo: '다음 밀롱가에서 봐요.', words: ['Hasta', 'la', 'próxima', 'milonga.'], correctAnswer: 'Hasta la próxima milonga.' },

  // L5-16: 밀롱가 역할극
  q5_16_5: { id: 'q5_16_5', type: 'multiple_choice', sentenceId: 's5_16_4', question: '"이 탄다 같이 출래요?"를 스페인어로?', options: ['¿Querés bailar esta tanda?', '¿Querés parar esta tanda?', '¿Querés mirar esta tanda?', '¿Querés escuchar esta tanda?'], correctAnswer: '¿Querés bailar esta tanda?' },
  q5_16_6: { id: 'q5_16_6', type: 'fill_blank', sentenceId: 's5_16_5', question: 'Con mucho _____.', questionKo: '기꺼이요.', correctAnswer: 'gusto', options: ['gusto', 'placer', 'tiempo', 'paso'] },
  q5_16_7: { id: 'q5_16_7', type: 'multiple_choice', sentenceId: 's5_16_8', question: '"Fue una noche hermosa"는?', options: ['아름다운 밤이었어요', '긴 밤이었어요', '어려운 밤이었어요', '피곤한 밤이었어요'], correctAnswer: '아름다운 밤이었어요' },
  q5_16_8: { id: 'q5_16_8', type: 'word_order', sentenceId: 's5_16_7', question: '문장을 배열하세요.', questionKo: '탄다 고마워요.', words: ['Gracias', 'por', 'la', 'tanda.'], correctAnswer: 'Gracias por la tanda.' },
};
