import { Quiz } from '../types';

export const quizzesL4Extra: Record<string, Quiz> = {
  // L4 확장 퀴즈 — 레슨당 4개 추가 (확장 문장 s4_XX_4~10에서 출제)

  // L4-01: 다시 해볼까요
  q4_01_5: { id: 'q4_01_5', type: 'multiple_choice', sentenceId: 's4_01_6', question: '"이거 연습하고 싶어"를 스페인어로?', options: ['Quiero practicar esto.', 'Quiero parar esto.', 'Quiero girar esto.', 'Quiero ver esto.'], correctAnswer: 'Quiero practicar esto.' },
  q4_01_6: { id: 'q4_01_6', type: 'fill_blank', sentenceId: 's4_01_5', question: 'Una _____.', questionKo: '한 번만 더.', correctAnswer: 'más', options: ['más', 'vez', 'cosa', 'pausa'] },
  q4_01_7: { id: 'q4_01_7', type: 'multiple_choice', sentenceId: 's4_01_10', question: '"Listo, vamos de nuevo"는?', options: ['준비 됐어, 다시 하자', '끝났어, 멈추자', '안 돼, 기다려', '빨리, 출발해'], correctAnswer: '준비 됐어, 다시 하자' },
  q4_01_8: { id: 'q4_01_8', type: 'word_order', sentenceId: 's4_01_7', question: '문장을 배열하세요.', questionKo: '다시, 근데 천천히.', words: ['Otra', 'vez,', 'pero', 'despacio.'], correctAnswer: 'Otra vez, pero despacio.' },

  // L4-02: 더 좋아요
  q4_02_5: { id: 'q4_02_5', type: 'multiple_choice', sentenceId: 's4_02_6', question: '"바로 그거!"를 스페인어로?', options: ['¡Eso!', '¡No!', '¡Más!', '¡Ya!'], correctAnswer: '¡Eso!' },
  q4_02_6: { id: 'q4_02_6', type: 'fill_blank', sentenceId: 's4_02_9', question: '_____ así.', questionKo: '계속 그렇게.', correctAnswer: 'Seguí', options: ['Seguí', 'Pará', 'Girá', 'Bajá'] },
  q4_02_7: { id: 'q4_02_7', type: 'multiple_choice', sentenceId: 's4_02_10', question: '"Qué lindo se siente"는?', options: ['느낌이 좋다', '느낌이 이상하다', '느낌이 없다', '느낌이 강하다'], correctAnswer: '느낌이 좋다' },
  q4_02_8: { id: 'q4_02_8', type: 'word_order', sentenceId: 's4_02_5', question: '문장을 배열하세요.', questionKo: '차이가 느껴져.', words: ['Se', 'nota', 'la', 'diferencia.'], correctAnswer: 'Se nota la diferencia.' },

  // L4-03: 아직 아니에요
  q4_03_5: { id: 'q4_03_5', type: 'multiple_choice', sentenceId: 's4_03_6', question: '"다른 방법으로 해봐"를 스페인어로?', options: ['Intentá de otra forma.', 'Pará de otra forma.', 'Girá de otra forma.', 'Caminá de otra forma.'], correctAnswer: 'Intentá de otra forma.' },
  q4_03_6: { id: 'q4_03_6', type: 'fill_blank', sentenceId: 's4_03_4', question: 'Casi, _____ no.', questionKo: '거의, 근데 아직.', correctAnswer: 'pero', options: ['pero', 'y', 'más', 'sin'] },
  q4_03_7: { id: 'q4_03_7', type: 'multiple_choice', sentenceId: 's4_03_10', question: '"Ahí va, estás cerca"는?', options: ['거의 다 왔어', '아직 멀었어', '다시 해야 해', '안 돼, 멈춰'], correctAnswer: '거의 다 왔어' },
  q4_03_8: { id: 'q4_03_8', type: 'word_order', sentenceId: 's4_03_9', question: '문장을 배열하세요.', questionKo: '이걸 해봐.', words: ['Probá', 'esto.'], correctAnswer: 'Probá esto.' },

  // L4-04: 천천히요
  q4_04_5: { id: 'q4_04_5', type: 'multiple_choice', sentenceId: 's4_04_6', question: '"한 걸음씩"을 스페인어로?', options: ['Paso a paso.', 'Rápido a rápido.', 'Fuerte a fuerte.', 'Largo a largo.'], correctAnswer: 'Paso a paso.' },
  q4_04_6: { id: 'q4_04_6', type: 'fill_blank', sentenceId: 's4_04_5', question: 'Hay _____.', questionKo: '시간은 있어.', correctAnswer: 'tiempo', options: ['tiempo', 'prisa', 'fuerza', 'miedo'] },
  q4_04_7: { id: 'q4_04_7', type: 'multiple_choice', sentenceId: 's4_04_8', question: '"No es una carrera"는?', options: ['경주가 아니야', '연습이 아니야', '수업이 아니야', '춤이 아니야'], correctAnswer: '경주가 아니야' },
  q4_04_8: { id: 'q4_04_8', type: 'word_order', sentenceId: 's4_04_7', question: '문장을 배열하세요.', questionKo: '과정을 즐겨.', words: ['Disfrutá', 'el', 'proceso.'], correctAnswer: 'Disfrutá el proceso.' },

  // L4-05: 느낌이 안 와요
  q4_05_5: { id: 'q4_05_5', type: 'multiple_choice', sentenceId: 's4_05_6', question: '"도움이 필요해"를 스페인어로?', options: ['Necesito ayuda.', 'Necesito tiempo.', 'Necesito práctica.', 'Necesito música.'], correctAnswer: 'Necesito ayuda.' },
  q4_05_6: { id: 'q4_05_6', type: 'fill_blank', sentenceId: 's4_05_9', question: 'Ya lo _____.', questionKo: '이제 됐어.', correctAnswer: 'tengo', options: ['tengo', 'siento', 'veo', 'hago'] },
  q4_05_7: { id: 'q4_05_7', type: 'multiple_choice', sentenceId: 's4_05_4', question: '"No me sale"는?', options: ['안 돼', '잘 돼', '됐어', '다 했어'], correctAnswer: '안 돼' },
  q4_05_8: { id: 'q4_05_8', type: 'word_order', sentenceId: 's4_05_7', question: '문장을 배열하세요.', questionKo: '먼저 해봐줘.', words: ['Hacelo', 'vos', 'primero.'], correctAnswer: 'Hacelo vos primero.' },

  // L4-06: 연결이 끊겼어요
  q4_06_5: { id: 'q4_06_5', type: 'multiple_choice', sentenceId: 's4_06_5', question: '"다시 연결하자"를 스페인어로?', options: ['Volvamos a conectar.', 'Volvamos a caminar.', 'Volvamos a girar.', 'Volvamos a parar.'], correctAnswer: 'Volvamos a conectar.' },
  q4_06_6: { id: 'q4_06_6', type: 'fill_blank', sentenceId: 's4_06_6', question: 'Sentí mi _____.', questionKo: '내 가슴을 느껴.', correctAnswer: 'pecho', options: ['pecho', 'brazo', 'pie', 'eje'] },
  q4_06_7: { id: 'q4_06_7', type: 'multiple_choice', sentenceId: 's4_06_9', question: '"Acá estoy"는?', options: ['여기 있어', '저기 있어', '가야 해', '기다려'], correctAnswer: '여기 있어' },
  q4_06_8: { id: 'q4_06_8', type: 'word_order', sentenceId: 's4_06_10', question: '문장을 배열하세요.', questionKo: '이제 느껴져.', words: ['Ahora', 'sí,', 'te', 'siento.'], correctAnswer: 'Ahora sí, te siento.' },

  // L4-07: 타이밍
  q4_07_5: { id: 'q4_07_5', type: 'multiple_choice', sentenceId: 's4_07_5', question: '"타이밍이 전부야"를 스페인어로?', options: ['El timing es todo.', 'El paso es todo.', 'El eje es todo.', 'El abrazo es todo.'], correctAnswer: 'El timing es todo.' },
  q4_07_6: { id: 'q4_07_6', type: 'fill_blank', sentenceId: 's4_07_7', question: 'Ni antes ni _____.', questionKo: '빨라도 안 되고 늦어도 안 돼.', correctAnswer: 'después', options: ['después', 'ahora', 'mucho', 'poco'] },
  q4_07_7: { id: 'q4_07_7', type: 'multiple_choice', sentenceId: 's4_07_9', question: '"Paciencia"는?', options: ['인내심', '속도', '연습', '힘'], correctAnswer: '인내심' },
  q4_07_8: { id: 'q4_07_8', type: 'word_order', sentenceId: 's4_07_10', question: '문장을 배열하세요.', questionKo: '딱 맞는 타이밍.', words: ['Justo', 'a', 'tiempo.'], correctAnswer: 'Justo a tiempo.' },

  // L4-08: 감정 표현
  q4_08_5: { id: 'q4_08_5', type: 'multiple_choice', sentenceId: 's4_08_6', question: '"너무 좋았어"를 스페인어로?', options: ['Me encantó.', 'Me asusté.', 'Me enojé.', 'Me cansé.'], correctAnswer: 'Me encantó.' },
  q4_08_6: { id: 'q4_08_6', type: 'fill_blank', sentenceId: 's4_08_4', question: 'Me da _____.', questionKo: '부끄러워.', correctAnswer: 'vergüenza', options: ['vergüenza', 'hambre', 'sueño', 'calor'] },
  q4_08_7: { id: 'q4_08_7', type: 'multiple_choice', sentenceId: 's4_08_10', question: '"Pero valió la pena"는?', options: ['근데 가치 있었어', '근데 힘들었어', '근데 안 됐어', '근데 끝났어'], correctAnswer: '근데 가치 있었어' },
  q4_08_8: { id: 'q4_08_8', type: 'word_order', sentenceId: 's4_08_8', question: '문장을 배열하세요.', questionKo: '오늘 좋은 날이었어.', words: ['Hoy', 'fue', 'un', 'buen', 'día.'], correctAnswer: 'Hoy fue un buen día.' },

  // L4-09: 서로 피드백
  q4_09_5: { id: 'q4_09_5', type: 'multiple_choice', sentenceId: 's4_09_6', question: '"아브라소가 나아졌어"를 스페인어로?', options: ['Tu abrazo mejoró.', 'Tu abrazo empeoró.', 'Tu abrazo cambió.', 'Tu abrazo paró.'], correctAnswer: 'Tu abrazo mejoró.' },
  q4_09_6: { id: 'q4_09_6', type: 'fill_blank', sentenceId: 's4_09_8', question: '¿Qué sentiste _____?', questionKo: '너는 뭘 느꼈어?', correctAnswer: 'vos', options: ['vos', 'yo', 'eso', 'hoy'] },
  q4_09_7: { id: 'q4_09_7', type: 'multiple_choice', sentenceId: 's4_09_10', question: '"Gracias por el feedback"는?', options: ['피드백 고마워', '피드백 필요해', '피드백 안 돼', '피드백 다시'], correctAnswer: '피드백 고마워' },
  q4_09_8: { id: 'q4_09_8', type: 'word_order', sentenceId: 's4_09_7', question: '문장을 배열하세요.', questionKo: '오늘 연결이 더 느껴졌어.', words: ['Sentí', 'más', 'conexión', 'hoy.'], correctAnswer: 'Sentí más conexión hoy.' },

  // L4-10: 진전 대화
  q4_10_5: { id: 'q4_10_5', type: 'multiple_choice', sentenceId: 's4_10_6', question: '"이건 이제 돼"를 스페인어로?', options: ['Esto ya me sale.', 'Esto ya no sale.', 'Esto ya se fue.', 'Esto ya pasó.'], correctAnswer: 'Esto ya me sale.' },
  q4_10_6: { id: 'q4_10_6', type: 'fill_blank', sentenceId: 's4_10_9', question: 'El tango es un camino _____.', questionKo: '탱고는 긴 여정이야.', correctAnswer: 'largo', options: ['largo', 'corto', 'rápido', 'fácil'] },
  q4_10_7: { id: 'q4_10_7', type: 'multiple_choice', sentenceId: 's4_10_8', question: '"Pero eso está bien"은?', options: ['근데 그래도 괜찮아', '근데 그래도 안 돼', '근데 그래도 멈춰', '근데 그래도 힘들어'], correctAnswer: '근데 그래도 괜찮아' },
  q4_10_8: { id: 'q4_10_8', type: 'word_order', sentenceId: 's4_10_5', question: '문장을 배열하세요.', questionKo: '우리 얼마나 발전했는지 봐.', words: ['Mirá', 'cuánto', 'avanzamos.'], correctAnswer: 'Mirá cuánto avanzamos.' },

  // L4-11: 파트너 교체 인사
  q4_11_5: { id: 'q4_11_5', type: 'multiple_choice', sentenceId: 's4_11_5', question: '"너 좋은 파트너야"를 스페인어로?', options: ['Sos muy buena pareja.', 'Sos muy mal pareja.', 'Sos muy rápida pareja.', 'Sos muy nueva pareja.'], correctAnswer: 'Sos muy buena pareja.' },
  q4_11_6: { id: 'q4_11_6', type: 'fill_blank', sentenceId: 's4_11_9', question: 'Hasta la _____.', questionKo: '다음에 봐요.', correctAnswer: 'próxima', options: ['próxima', 'final', 'primera', 'última'] },
  q4_11_7: { id: 'q4_11_7', type: 'multiple_choice', sentenceId: 's4_11_7', question: '"Fue muy lindo"는?', options: ['너무 좋았어', '너무 어려웠어', '너무 길었어', '너무 빨랐어'], correctAnswer: '너무 좋았어' },
  q4_11_8: { id: 'q4_11_8', type: 'word_order', sentenceId: 's4_11_4', question: '문장을 배열하세요.', questionKo: '고마워, 많이 배웠어.', words: ['Gracias,', 'aprendí', 'mucho.'], correctAnswer: 'Gracias, aprendí mucho.' },

  // L4-12: 연습 역할극
  q4_12_5: { id: 'q4_12_5', type: 'multiple_choice', sentenceId: 's4_12_4', question: '"어땠어?"를 스페인어로?', options: ['¿Cómo te sentiste?', '¿Cómo te llamás?', '¿Cómo te fue?', '¿Cómo te ves?'], correctAnswer: '¿Cómo te sentiste?' },
  q4_12_6: { id: 'q4_12_6', type: 'fill_blank', sentenceId: 's4_12_8', question: 'Mañana _____.', questionKo: '내일 계속하자.', correctAnswer: 'seguimos', options: ['seguimos', 'paramos', 'giramos', 'salimos'] },
  q4_12_7: { id: 'q4_12_7', type: 'multiple_choice', sentenceId: 's4_12_9', question: '"Sí, con ganas"는?', options: ['응, 기대돼', '응, 힘들어', '응, 싫어', '응, 끝났어'], correctAnswer: '응, 기대돼' },
  q4_12_8: { id: 'q4_12_8', type: 'word_order', sentenceId: 's4_12_7', question: '문장을 배열하세요.', questionKo: '연결이 제일 좋았어.', words: ['La', 'conexión', 'fue', 'lo', 'mejor.'], correctAnswer: 'La conexión fue lo mejor.' },
};
