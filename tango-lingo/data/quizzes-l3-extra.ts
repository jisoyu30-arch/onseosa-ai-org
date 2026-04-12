import { Quiz } from '../types';

export const quizzesL3Extra: Record<string, Quiz> = {
  // L3 확장 퀴즈 — 레슨당 4개 추가 (확장 문장 s3_XX_4~10에서 출제)

  // L3-01: 앞오초
  q3_01_5: { id: 'q3_01_5', type: 'multiple_choice', sentenceId: 's3_01_6', question: '"골반에서 돌려"를 스페인어로?', options: ['Girá desde la cadera.', 'Girá desde el pie.', 'Girá desde el brazo.', 'Girá desde el pecho.'], correctAnswer: 'Girá desde la cadera.' },
  q3_01_6: { id: 'q3_01_6', type: 'fill_blank', sentenceId: 's3_01_4', question: 'El ocho sale del _____.', questionKo: '오초는 중심에서 나와.', correctAnswer: 'centro', options: ['centro', 'pie', 'brazo', 'piso'] },
  q3_01_7: { id: 'q3_01_7', type: 'multiple_choice', sentenceId: 's3_01_10', question: '"Muy bien el ocho"는?', options: ['오초 아주 잘했어', '오초 다시 해', '오초 멈춰', '오초 더 빨리'], correctAnswer: '오초 아주 잘했어' },
  q3_01_8: { id: 'q3_01_8', type: 'word_order', sentenceId: 's3_01_7', question: '문장을 배열하세요.', questionKo: '발이 8자를 그려.', words: ['El', 'pie', 'dibuja', 'un', 'ocho.'], correctAnswer: 'El pie dibuja un ocho.' },

  // L3-02: 뒤오초
  q3_02_5: { id: 'q3_02_5', type: 'multiple_choice', sentenceId: 's3_02_4', question: '"뒤로는 더 어려워"를 스페인어로?', options: ['Atrás es más difícil.', 'Atrás es más fácil.', 'Atrás es más rápido.', 'Atrás es más largo.'], correctAnswer: 'Atrás es más difícil.' },
  q3_02_6: { id: 'q3_02_6', type: 'fill_blank', sentenceId: 's3_02_5', question: 'No pierdas el _____.', questionKo: '축을 잃지 마.', correctAnswer: 'eje', options: ['eje', 'pie', 'paso', 'brazo'] },
  q3_02_7: { id: 'q3_02_7', type: 'multiple_choice', sentenceId: 's3_02_9', question: '"Disociación"은?', options: ['분리 운동', '회전 운동', '걷기 운동', '호흡 운동'], correctAnswer: '분리 운동' },
  q3_02_8: { id: 'q3_02_8', type: 'word_order', sentenceId: 's3_02_8', question: '문장을 배열하세요.', questionKo: '골반만 돌아.', words: ['Solo', 'gira', 'la', 'cadera.'], correctAnswer: 'Solo gira la cadera.' },

  // L3-03: 크루세
  q3_03_5: { id: 'q3_03_5', type: 'multiple_choice', sentenceId: 's3_03_4', question: '"크루세는 자연스러운 거야"를 스페인어로?', options: ['El cruce es natural.', 'El cruce es difícil.', 'El cruce es rápido.', 'El cruce es fuerte.'], correctAnswer: 'El cruce es natural.' },
  q3_03_6: { id: 'q3_03_6', type: 'fill_blank', sentenceId: 's3_03_6', question: 'Llegá y _____.', questionKo: '도착하고 교차해.', correctAnswer: 'cruzá', options: ['cruzá', 'girá', 'pará', 'caminá'] },
  q3_03_7: { id: 'q3_03_7', type: 'multiple_choice', sentenceId: 's3_03_10', question: '"No te apures en cruzar"는?', options: ['교차를 서두르지 마', '교차를 멈춰', '교차를 해', '교차를 반복해'], correctAnswer: '교차를 서두르지 마' },
  q3_03_8: { id: 'q3_03_8', type: 'word_order', sentenceId: 's3_03_8', question: '문장을 배열하세요.', questionKo: '다리를 붙여.', words: ['Apretá', 'las', 'piernas.'], correctAnswer: 'Apretá las piernas.' },

  // L3-04: 회전 시작
  q3_04_5: { id: 'q3_04_5', type: 'multiple_choice', sentenceId: 's3_04_5', question: '"먼저 준비해"를 스페인어로?', options: ['Primero prepará.', 'Primero girá.', 'Primero caminá.', 'Primero pará.'], correctAnswer: 'Primero prepará.' },
  q3_04_6: { id: 'q3_04_6', type: 'fill_blank', sentenceId: 's3_04_8', question: 'Mirá un punto _____.', questionKo: '한 점을 봐.', correctAnswer: 'fijo', options: ['fijo', 'libre', 'alto', 'lejos'] },
  q3_04_7: { id: 'q3_04_7', type: 'multiple_choice', sentenceId: 's3_04_7', question: '"No te marees"는?', options: ['어지러워하지 마', '멈추지 마', '돌지 마', '걷지 마'], correctAnswer: '어지러워하지 마' },
  q3_04_8: { id: 'q3_04_8', type: 'word_order', sentenceId: 's3_04_10', question: '문장을 배열하세요.', questionKo: '내 주위를 돌아.', words: ['Girá', 'alrededor', 'mío.'], correctAnswer: 'Girá alrededor mío.' },

  // L3-05: 회전 안에서
  q3_05_5: { id: 'q3_05_5', type: 'multiple_choice', sentenceId: 's3_05_5', question: '"아무 스텝도 빼먹지 마"를 스페인어로?', options: ['No te saltees ningún paso.', 'No camines ningún paso.', 'No pares ningún paso.', 'No gires ningún paso.'], correctAnswer: 'No te saltees ningún paso.' },
  q3_05_6: { id: 'q3_05_6', type: 'fill_blank', sentenceId: 's3_05_7', question: 'Volvé siempre al _____.', questionKo: '항상 중심으로 돌아와.', correctAnswer: 'centro', options: ['centro', 'lado', 'piso', 'frente'] },
  q3_05_7: { id: 'q3_05_7', type: 'multiple_choice', sentenceId: 's3_05_8', question: '"El giro no es correr"는?', options: ['히로는 뛰는 게 아니야', '히로는 걷는 거야', '히로는 멈추는 거야', '히로는 빠른 거야'], correctAnswer: '히로는 뛰는 게 아니야' },
  q3_05_8: { id: 'q3_05_8', type: 'word_order', sentenceId: 's3_05_10', question: '문장을 배열하세요.', questionKo: '각 스텝을 확실히 마무리해.', words: ['Terminá', 'bien', 'cada', 'paso.'], correctAnswer: 'Terminá bien cada paso.' },

  // L3-06: 기본이 먼저
  q3_06_5: { id: 'q3_06_5', type: 'multiple_choice', sentenceId: 's3_06_5', question: '"기본이 전부야"를 스페인어로?', options: ['La base es todo.', 'La base es poco.', 'La base es difícil.', 'La base es rápida.'], correctAnswer: 'La base es todo.' },
  q3_06_6: { id: 'q3_06_6', type: 'fill_blank', sentenceId: 's3_06_9', question: '_____ es más.', questionKo: '적은 게 더 많은 거야.', correctAnswer: 'Menos', options: ['Menos', 'Más', 'Todo', 'Nada'] },
  q3_06_7: { id: 'q3_06_7', type: 'multiple_choice', sentenceId: 's3_06_10', question: '"Confiá en lo simple"은?', options: ['단순함을 믿어', '복잡함을 믿어', '힘을 믿어', '속도를 믿어'], correctAnswer: '단순함을 믿어' },
  q3_06_8: { id: 'q3_06_8', type: 'word_order', sentenceId: 's3_06_8', question: '문장을 배열하세요.', questionKo: '그런데 아름답게 춰.', words: ['Y', 'bailan', 'hermoso.'], correctAnswer: 'Y bailan hermoso.' },

  // L3-07: 아도르노
  q3_07_5: { id: 'q3_07_5', type: 'multiple_choice', sentenceId: 's3_07_4', question: '"아도르노는 선택이야"를 스페인어로?', options: ['El adorno es opcional.', 'El adorno es necesario.', 'El adorno es difícil.', 'El adorno es largo.'], correctAnswer: 'El adorno es opcional.' },
  q3_07_6: { id: 'q3_07_6', type: 'fill_blank', sentenceId: 's3_07_6', question: 'Elegí el momento _____.', questionKo: '딱 맞는 순간을 골라.', correctAnswer: 'justo', options: ['justo', 'largo', 'rápido', 'grande'] },
  q3_07_7: { id: 'q3_07_7', type: 'multiple_choice', sentenceId: 's3_07_10', question: '"Lindo adorno"는?', options: ['예쁜 장식', '큰 장식', '빠른 장식', '강한 장식'], correctAnswer: '예쁜 장식' },
  q3_07_8: { id: 'q3_07_8', type: 'word_order', sentenceId: 's3_07_8', question: '문장을 배열하세요.', questionKo: '발로 살짝.', words: ['Un', 'toquecito', 'con', 'el', 'pie.'], correctAnswer: 'Un toquecito con el pie.' },

  // L3-08: 사카다
  q3_08_5: { id: 'q3_08_5', type: 'multiple_choice', sentenceId: 's3_08_4', question: '"사카다는 초대야"를 스페인어로?', options: ['La sacada es una invitación.', 'La sacada es una orden.', 'La sacada es un paso.', 'La sacada es un giro.'], correctAnswer: 'La sacada es una invitación.' },
  q3_08_6: { id: 'q3_08_6', type: 'fill_blank', sentenceId: 's3_08_8', question: 'Entrá con _____.', questionKo: '명확하게 들어가.', correctAnswer: 'claridad', options: ['claridad', 'fuerza', 'prisa', 'miedo'] },
  q3_08_7: { id: 'q3_08_7', type: 'multiple_choice', sentenceId: 's3_08_6', question: '"No invadas"는?', options: ['침입하지 마', '들어가', '나가', '멈춰'], correctAnswer: '침입하지 마' },
  q3_08_8: { id: 'q3_08_8', type: 'word_order', sentenceId: 's3_08_10', question: '문장을 배열하세요.', questionKo: '사카다 잘했어.', words: ['Bien', 'la', 'sacada.'], correctAnswer: 'Bien la sacada.' },

  // L3-09: 파라다
  q3_09_5: { id: 'q3_09_5', type: 'multiple_choice', sentenceId: 's3_09_5', question: '"부드러운 브레이크야"를 스페인어로?', options: ['Es un freno suave.', 'Es un freno fuerte.', 'Es un freno rápido.', 'Es un freno largo.'], correctAnswer: 'Es un freno suave.' },
  q3_09_6: { id: 'q3_09_6', type: 'fill_blank', sentenceId: 's3_09_7', question: 'No pierdas el _____.', questionKo: '접촉을 잃지 마.', correctAnswer: 'contacto', options: ['contacto', 'paso', 'eje', 'ritmo'] },
  q3_09_7: { id: 'q3_09_7', type: 'multiple_choice', sentenceId: 's3_09_10', question: '"Linda parada"는?', options: ['예쁜 파라다', '긴 파라다', '강한 파라다', '빠른 파라다'], correctAnswer: '예쁜 파라다' },
  q3_09_8: { id: 'q3_09_8', type: 'word_order', sentenceId: 's3_09_6', question: '문장을 배열하세요.', questionKo: '브레이크 후에 장식.', words: ['Después', 'del', 'freno,', 'adorno.'], correctAnswer: 'Después del freno, adorno.' },

  // L3-10: 볼레오
  q3_10_5: { id: 'q3_10_5', type: 'multiple_choice', sentenceId: 's3_10_4', question: '"볼레오는 저절로 나와"를 스페인어로?', options: ['El boleo sale solo.', 'El boleo es fuerte.', 'El boleo es grande.', 'El boleo es difícil.'], correctAnswer: 'El boleo sale solo.' },
  q3_10_6: { id: 'q3_10_6', type: 'fill_blank', sentenceId: 's3_10_10', question: 'Control, no _____.', questionKo: '컨트롤이지, 힘이 아니야.', correctAnswer: 'fuerza', options: ['fuerza', 'marca', 'ritmo', 'paso'] },
  q3_10_7: { id: 'q3_10_7', type: 'multiple_choice', sentenceId: 's3_10_5', question: '"No patees"는?', options: ['차지 마', '걷지 마', '돌지 마', '멈추지 마'], correctAnswer: '차지 마' },
  q3_10_8: { id: 'q3_10_8', type: 'word_order', sentenceId: 's3_10_7', question: '문장을 배열하세요.', questionKo: '밀롱가에서는 작게.', words: ['En', 'la', 'milonga,', 'chiquito.'], correctAnswer: 'En la milonga, chiquito.' },

  // L3-11: 강도 조절
  q3_11_5: { id: 'q3_11_5', type: 'multiple_choice', sentenceId: 's3_11_5', question: '"힘 조절 완벽해"를 스페인어로?', options: ['Perfecto el nivel de fuerza.', 'Mucho el nivel de fuerza.', 'Poco el nivel de fuerza.', 'Mal el nivel de fuerza.'], correctAnswer: 'Perfecto el nivel de fuerza.' },
  q3_11_6: { id: 'q3_11_6', type: 'fill_blank', sentenceId: 's3_11_7', question: '_____ así.', questionKo: '딱 그렇게.', correctAnswer: 'Justo', options: ['Justo', 'Mucho', 'Poco', 'Más'] },
  q3_11_7: { id: 'q3_11_7', type: 'multiple_choice', sentenceId: 's3_11_10', question: '"Excelente"는?', options: ['훌륭해', '다시 해', '안 돼', '기다려'], correctAnswer: '훌륭해' },
  q3_11_8: { id: 'q3_11_8', type: 'word_order', sentenceId: 's3_11_9', question: '문장을 배열하세요.', questionKo: '많지도 적지도 않게.', words: ['Ni', 'mucho', 'ni', 'poco.'], correctAnswer: 'Ni mucho ni poco.' },

  // L3-12: 실수 후 복구
  q3_12_5: { id: 'q3_12_5', type: 'multiple_choice', sentenceId: 's3_12_6', question: '"웃고 계속해"를 스페인어로?', options: ['Sonreí y seguí.', 'Pará y seguí.', 'Girá y seguí.', 'Mirá y seguí.'], correctAnswer: 'Sonreí y seguí.' },
  q3_12_6: { id: 'q3_12_6', type: 'fill_blank', sentenceId: 's3_12_9', question: 'Perdón, me _____.', questionKo: '미안, 헷갈렸어.', correctAnswer: 'confundí', options: ['confundí', 'caí', 'perdí', 'paré'] },
  q3_12_7: { id: 'q3_12_7', type: 'multiple_choice', sentenceId: 's3_12_10', question: '"No te preocupes"는?', options: ['걱정하지 마', '멈추지 마', '돌지 마', '걷지 마'], correctAnswer: '걱정하지 마' },
  q3_12_8: { id: 'q3_12_8', type: 'word_order', sentenceId: 's3_12_5', question: '문장을 배열하세요.', questionKo: '중요한 건 계속하는 거야.', words: ['Lo', 'importante', 'es', 'seguir.'], correctAnswer: 'Lo importante es seguir.' },

  // L3-13: 수업 중 질문
  q3_13_5: { id: 'q3_13_5', type: 'multiple_choice', sentenceId: 's3_13_4', question: '"다시 보여줄 수 있어요?"를 스페인어로?', options: ['¿Podés mostrar otra vez?', '¿Podés parar otra vez?', '¿Podés girar otra vez?', '¿Podés caminar otra vez?'], correctAnswer: '¿Podés mostrar otra vez?' },
  q3_13_6: { id: 'q3_13_6', type: 'fill_blank', sentenceId: 's3_13_6', question: 'No me queda _____.', questionKo: '잘 이해가 안 돼요.', correctAnswer: 'claro', options: ['claro', 'bien', 'mucho', 'poco'] },
  q3_13_7: { id: 'q3_13_7', type: 'multiple_choice', sentenceId: 's3_13_9', question: '"Ya entendí, gracias"는?', options: ['이제 알겠어요, 감사합니다', '아직 모르겠어요', '다시 해주세요', '멈춰주세요'], correctAnswer: '이제 알겠어요, 감사합니다' },
  q3_13_8: { id: 'q3_13_8', type: 'word_order', sentenceId: 's3_13_10', question: '문장을 배열하세요.', questionKo: '질문 하나만 더.', words: ['Una', 'pregunta', 'más.'], correctAnswer: 'Una pregunta más.' },

  // L3-14: 회전 역할극
  q3_14_5: { id: 'q3_14_5', type: 'multiple_choice', sentenceId: 's3_14_6', question: '"이제 맞아, 훨씬 나아"를 스페인어로?', options: ['Ahora sí, mucho mejor.', 'Ahora no, mucho peor.', 'Ahora sí, mucho más.', 'Ahora no, otra vez.'], correctAnswer: 'Ahora sí, mucho mejor.' },
  q3_14_6: { id: 'q3_14_6', type: 'fill_blank', sentenceId: 's3_14_9', question: 'Cada vez _____.', questionKo: '갈수록 좋아져.', correctAnswer: 'mejor', options: ['mejor', 'peor', 'más', 'menos'] },
  q3_14_7: { id: 'q3_14_7', type: 'multiple_choice', sentenceId: 's3_14_10', question: '"Buen trabajo hoy"는?', options: ['오늘 잘했어', '오늘 안 돼', '오늘 다시', '오늘 멈춰'], correctAnswer: '오늘 잘했어' },
  q3_14_8: { id: 'q3_14_8', type: 'word_order', sentenceId: 's3_14_8', question: '문장을 배열하세요.', questionKo: '좋아, 마지막 한 번.', words: ['Dale,', 'última', 'vez.'], correctAnswer: 'Dale, última vez.' },
};
