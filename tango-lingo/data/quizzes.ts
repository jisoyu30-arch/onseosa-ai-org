import { Quiz } from '../types';
import { quizzesL1Extra } from './quizzes-l1-extra';
import { quizzesL2Extra } from './quizzes-l2-extra';
import { quizzesL3Extra } from './quizzes-l3-extra';
import { quizzesL4Extra } from './quizzes-l4-extra';
import { quizzesL5Extra } from './quizzes-l5-extra';

const baseQuizzes: Record<string, Quiz> = {
  // =====================================================
  // LEVEL 1 — 10 lessons × 4 quizzes = 40 quizzes
  // =====================================================

  // ----- Lesson 1: 첫 인사 -----
  q1_01_1: {
    id: 'q1_01_1', type: 'multiple_choice', sentenceId: 's1_01_1',
    question: '"안녕, 잘 지내?"를 스페인어로?',
    options: ['Hola, ¿todo bien?', 'Hola, ¿cómo estás?', 'Buenos días.', 'Hasta luego.'],
    correctAnswer: 'Hola, ¿todo bien?',
  },
  q1_01_2: {
    id: 'q1_01_2', type: 'fill_blank', sentenceId: 's1_01_2',
    question: 'Sí, _____ bien.',
    questionKo: '응, 잘 지내.',
    correctAnswer: 'todo',
    options: ['todo', 'mucho', 'más', 'muy'],
  },
  q1_01_3: {
    id: 'q1_01_3', type: 'multiple_choice', sentenceId: 's1_01_3',
    question: '"Gracias"는 무슨 뜻?',
    options: ['고마워요', '안녕하세요', '미안해요', '좋아요'],
    correctAnswer: '고마워요',
  },
  q1_01_4: {
    id: 'q1_01_4', type: 'word_order', sentenceId: 's1_01_1',
    question: '문장을 올바른 순서로 배열하세요.',
    questionKo: '안녕, 잘 지내?',
    words: ['Hola,', '¿todo', 'bien?'],
    correctAnswer: 'Hola, ¿todo bien?',
  },

  // ----- Lesson 2: 얼굴과 시선 -----
  q1_02_1: {
    id: 'q1_02_1', type: 'multiple_choice', sentenceId: 's1_02_1',
    question: '"얼굴 힘 빼"를 스페인어로?',
    options: ['Relajá la cara.', 'Bajá la cara.', 'Mové la cara.', 'Sentí la cara.'],
    correctAnswer: 'Relajá la cara.',
  },
  q1_02_2: {
    id: 'q1_02_2', type: 'fill_blank', sentenceId: 's1_02_2',
    question: '_____ a los ojos.',
    questionKo: '눈을 봐.',
    correctAnswer: 'Mírame',
    options: ['Mírame', 'Mové', 'Relajá', 'Bajá'],
  },
  q1_02_3: {
    id: 'q1_02_3', type: 'multiple_choice', sentenceId: 's1_02_3',
    question: '"Mirá al frente"는 무슨 뜻?',
    options: ['앞을 봐', '눈을 감아', '뒤를 봐', '옆을 봐'],
    correctAnswer: '앞을 봐',
  },
  q1_02_4: {
    id: 'q1_02_4', type: 'word_order', sentenceId: 's1_02_2',
    question: '문장을 올바른 순서로 배열하세요.',
    questionKo: '눈을 봐.',
    words: ['Mírame', 'a', 'los', 'ojos.'],
    correctAnswer: 'Mírame a los ojos.',
  },

  // ----- Lesson 3: 어깨와 목 -----
  q1_03_1: {
    id: 'q1_03_1', type: 'multiple_choice', sentenceId: 's1_03_1',
    question: '"어깨 내려"를 스페인어로?',
    options: ['Bajá los hombros.', 'Relajá los hombros.', 'Abrí los hombros.', 'Mové los hombros.'],
    correctAnswer: 'Bajá los hombros.',
  },
  q1_03_2: {
    id: 'q1_03_2', type: 'fill_blank', sentenceId: 's1_03_2',
    question: 'Relajá el _____.',
    questionKo: '목 힘 빼.',
    correctAnswer: 'cuello',
    options: ['cuello', 'pecho', 'hombro', 'brazo'],
  },
  q1_03_3: {
    id: 'q1_03_3', type: 'multiple_choice', sentenceId: 's1_03_3',
    question: '"rígida"는 무슨 뜻?',
    options: ['딱딱한', '부드러운', '빠른', '느린'],
    correctAnswer: '딱딱한',
  },
  q1_03_4: {
    id: 'q1_03_4', type: 'word_order', sentenceId: 's1_03_1',
    question: '문장을 올바른 순서로 배열하세요.',
    questionKo: '어깨 내려.',
    words: ['Bajá', 'los', 'hombros.'],
    correctAnswer: 'Bajá los hombros.',
  },

  // ----- Lesson 4: 팔과 손의 연결 -----
  q1_04_1: {
    id: 'q1_04_1', type: 'multiple_choice', sentenceId: 's1_04_1',
    question: '"팔에 힘 쓰지 마"를 스페인어로?',
    options: ['No uses fuerza en los brazos.', 'Mové los brazos.', 'Relajá los brazos.', 'Sentí los brazos.'],
    correctAnswer: 'No uses fuerza en los brazos.',
  },
  q1_04_2: {
    id: 'q1_04_2', type: 'fill_blank', sentenceId: 's1_04_2',
    question: 'Sentí la _____ de tu pareja.',
    questionKo: '파트너 손을 느껴.',
    correctAnswer: 'mano',
    options: ['mano', 'cara', 'pierna', 'cabeza'],
  },
  q1_04_3: {
    id: 'q1_04_3', type: 'multiple_choice', sentenceId: 's1_04_3',
    question: '"Más suave"는 무슨 뜻?',
    options: ['더 부드럽게', '더 세게', '더 빨리', '더 느리게'],
    correctAnswer: '더 부드럽게',
  },
  q1_04_4: {
    id: 'q1_04_4', type: 'word_order', sentenceId: 's1_04_2',
    question: '문장을 올바른 순서로 배열하세요.',
    questionKo: '파트너 손을 느껴.',
    words: ['Sentí', 'la', 'mano', 'de', 'tu', 'pareja.'],
    correctAnswer: 'Sentí la mano de tu pareja.',
  },

  // ----- Lesson 5: 힘 빼기와 호흡 -----
  q1_05_1: {
    id: 'q1_05_1', type: 'multiple_choice', sentenceId: 's1_05_1',
    question: '"깊게 숨 쉬어"를 스페인어로?',
    options: ['Respirá profundo.', 'Caminá despacio.', 'Mirá al frente.', 'Bajá los hombros.'],
    correctAnswer: 'Respirá profundo.',
  },
  q1_05_2: {
    id: 'q1_05_2', type: 'fill_blank', sentenceId: 's1_05_2',
    question: 'No te _____.',
    questionKo: '서두르지 마.',
    correctAnswer: 'apures',
    options: ['apures', 'vayas', 'pongas', 'caigas'],
  },
  q1_05_3: {
    id: 'q1_05_3', type: 'multiple_choice', sentenceId: 's1_05_3',
    question: '"Tranquila, despacio"는 무슨 뜻?',
    options: ['침착하게, 천천히', '빨리, 세게', '다시, 한 번 더', '좋아, 됐어'],
    correctAnswer: '침착하게, 천천히',
  },
  q1_05_4: {
    id: 'q1_05_4', type: 'word_order', sentenceId: 's1_05_1',
    question: '문장을 올바른 순서로 배열하세요.',
    questionKo: '깊게 숨 쉬어.',
    words: ['Respirá', 'profundo.'],
    correctAnswer: 'Respirá profundo.',
  },

  // ----- Lesson 6: 중심과 축 -----
  q1_06_1: {
    id: 'q1_06_1', type: 'multiple_choice', sentenceId: 's1_06_1',
    question: '"네 축을 찾아"를 스페인어로?',
    options: ['Encontrá tu eje.', 'Bajá tu eje.', 'Mové tu eje.', 'Sentí tu eje.'],
    correctAnswer: 'Encontrá tu eje.',
  },
  q1_06_2: {
    id: 'q1_06_2', type: 'fill_blank', sentenceId: 's1_06_2',
    question: 'Volvé al _____.',
    questionKo: '중심으로 돌아와.',
    correctAnswer: 'centro',
    options: ['centro', 'frente', 'costado', 'piso'],
  },
  q1_06_3: {
    id: 'q1_06_3', type: 'multiple_choice', sentenceId: 's1_06_1',
    question: '"eje"는 무슨 뜻?',
    options: ['축', '팔', '발', '어깨'],
    correctAnswer: '축',
  },
  q1_06_4: {
    id: 'q1_06_4', type: 'word_order', sentenceId: 's1_06_3',
    question: '문장을 올바른 순서로 배열하세요.',
    questionKo: '뒤로 빠지지 마.',
    words: ['No', 'te', 'vayas', 'para', 'atrás.'],
    correctAnswer: 'No te vayas para atrás.',
  },

  // ----- Lesson 7: 체중 이동 -----
  q1_07_1: {
    id: 'q1_07_1', type: 'multiple_choice', sentenceId: 's1_07_1',
    question: '"체중을 옮겨"를 스페인어로?',
    options: ['Cambiá el peso.', 'Sentí el peso.', 'Bajá el peso.', 'Mové el peso.'],
    correctAnswer: 'Cambiá el peso.',
  },
  q1_07_2: {
    id: 'q1_07_2', type: 'fill_blank', sentenceId: 's1_07_2',
    question: 'Pasá el peso _____.',
    questionKo: '무게를 완전히 넘겨.',
    correctAnswer: 'completo',
    options: ['completo', 'suave', 'rápido', 'despacio'],
  },
  q1_07_3: {
    id: 'q1_07_3', type: 'multiple_choice', sentenceId: 's1_07_3',
    question: '"Esperá"는 무슨 뜻?',
    options: ['기다려', '걸어', '돌아', '내려'],
    correctAnswer: '기다려',
  },
  q1_07_4: {
    id: 'q1_07_4', type: 'word_order', sentenceId: 's1_07_2',
    question: '문장을 올바른 순서로 배열하세요.',
    questionKo: '무게를 완전히 넘겨.',
    words: ['Pasá', 'el', 'peso', 'completo.'],
    correctAnswer: 'Pasá el peso completo.',
  },

  // ----- Lesson 8: 아브라소 -----
  q1_08_1: {
    id: 'q1_08_1', type: 'multiple_choice', sentenceId: 's1_08_2',
    question: '"아브라소를 닫아"를 스페인어로?',
    options: ['Cerrá el abrazo.', 'Abrí el abrazo.', 'Mové el abrazo.', 'Sentí el abrazo.'],
    correctAnswer: 'Cerrá el abrazo.',
  },
  q1_08_2: {
    id: 'q1_08_2', type: 'fill_blank', sentenceId: 's1_08_1',
    question: '_____ los brazos.',
    questionKo: '팔을 벌려.',
    correctAnswer: 'Abrí',
    options: ['Abrí', 'Cerrá', 'Bajá', 'Mové'],
  },
  q1_08_3: {
    id: 'q1_08_3', type: 'multiple_choice', sentenceId: 's1_08_3',
    question: '"No empujes"는 무슨 뜻?',
    options: ['밀지 마', '당기지 마', '걷지 마', '서두르지 마'],
    correctAnswer: '밀지 마',
  },
  q1_08_4: {
    id: 'q1_08_4', type: 'word_order', sentenceId: 's1_08_2',
    question: '문장을 올바른 순서로 배열하세요.',
    questionKo: '아브라소를 닫아.',
    words: ['Cerrá', 'el', 'abrazo.'],
    correctAnswer: 'Cerrá el abrazo.',
  },

  // ----- Lesson 9: 연결 느끼기 -----
  q1_09_1: {
    id: 'q1_09_1', type: 'multiple_choice', sentenceId: 's1_09_1',
    question: '"연결을 느껴"를 스페인어로?',
    options: ['Sentí la conexión.', 'Mové la conexión.', 'Bajá la conexión.', 'Abrí la conexión.'],
    correctAnswer: 'Sentí la conexión.',
  },
  q1_09_2: {
    id: 'q1_09_2', type: 'fill_blank', sentenceId: 's1_09_2',
    question: 'Quedate _____.',
    questionKo: '나한테 머물러.',
    correctAnswer: 'conmigo',
    options: ['conmigo', 'adelante', 'atrás', 'solo'],
  },
  q1_09_3: {
    id: 'q1_09_3', type: 'multiple_choice', sentenceId: 's1_09_1',
    question: '"conexión"은 무슨 뜻?',
    options: ['연결', '호흡', '축', '자세'],
    correctAnswer: '연결',
  },
  q1_09_4: {
    id: 'q1_09_4', type: 'word_order', sentenceId: 's1_09_3',
    question: '문장을 올바른 순서로 배열하세요.',
    questionKo: '혼자 가지 마.',
    words: ['No', 'te', 'vayas', 'sola.'],
    correctAnswer: 'No te vayas sola.',
  },

  // ----- Lesson 10: 첫 수업 역할극 -----
  q1_10_1: {
    id: 'q1_10_1', type: 'multiple_choice', sentenceId: 's1_10_1',
    question: '"다시"를 스페인어로?',
    options: ['Otra vez.', 'Más suave.', 'Ahora sí.', 'Mejor así.'],
    correctAnswer: 'Otra vez.',
  },
  q1_10_2: {
    id: 'q1_10_2', type: 'multiple_choice', sentenceId: 's1_10_2',
    question: '"Ahora sí"는 무슨 뜻?',
    options: ['이제 맞아', '아직 아니야', '다시 해봐', '기다려'],
    correctAnswer: '이제 맞아',
  },
  q1_10_3: {
    id: 'q1_10_3', type: 'fill_blank', sentenceId: 's1_10_3',
    question: '_____ así.',
    questionKo: '이렇게 하는 게 더 나아.',
    correctAnswer: 'Mejor',
    options: ['Mejor', 'Otra', 'Más', 'No'],
  },
  q1_10_4: {
    id: 'q1_10_4', type: 'multiple_choice', sentenceId: 's1_10_1',
    question: '선생님이 "Otra vez"라고 하면?',
    options: ['한 번 더 해보라는 뜻', '멈추라는 뜻', '잘했다는 뜻', '끝이라는 뜻'],
    correctAnswer: '한 번 더 해보라는 뜻',
  },

  // =====================================================
  // LEVEL 2: Caminar juntos — 12 lessons × 4 = 48 quizzes
  // =====================================================

  // ----- L2-01: 앞으로 걷기 -----
  q2_01_1: { id: 'q2_01_1', type: 'multiple_choice', sentenceId: 's2_01_1', question: '"앞으로 똑바로 걸어"를 스페인어로?', options: ['Caminá derecho.', 'Caminá despacio.', 'Mové derecho.', 'Bajá derecho.'], correctAnswer: 'Caminá derecho.' },
  q2_01_2: { id: 'q2_01_2', type: 'fill_blank', sentenceId: 's2_01_2', question: 'Un paso a la _____.', questionKo: '한 걸음씩.', correctAnswer: 'vez', options: ['vez', 'par', 'mano', 'hora'] },
  q2_01_3: { id: 'q2_01_3', type: 'multiple_choice', sentenceId: 's2_01_3', question: '"No mires el piso"는?', options: ['바닥 보지 마', '발 올려', '빨리 걸어', '앞을 봐'], correctAnswer: '바닥 보지 마' },
  q2_01_4: { id: 'q2_01_4', type: 'word_order', sentenceId: 's2_01_1', question: '문장을 배열하세요.', questionKo: '앞으로 똑바로 걸어.', words: ['Caminá', 'derecho.'], correctAnswer: 'Caminá derecho.' },

  // ----- L2-02: 옆으로 이동 -----
  q2_02_1: { id: 'q2_02_1', type: 'multiple_choice', sentenceId: 's2_02_1', question: '"옆으로 한 걸음"을 스페인어로?', options: ['Un paso al costado.', 'Un paso adelante.', 'Un paso atrás.', 'Un paso al centro.'], correctAnswer: 'Un paso al costado.' },
  q2_02_2: { id: 'q2_02_2', type: 'fill_blank', sentenceId: 's2_02_2', question: 'Abrí hacia el _____.', questionKo: '옆으로 벌려.', correctAnswer: 'costado', options: ['costado', 'centro', 'frente', 'piso'] },
  q2_02_3: { id: 'q2_02_3', type: 'multiple_choice', sentenceId: 's2_02_1', question: '"costado"는?', options: ['옆', '앞', '뒤', '위'], correctAnswer: '옆' },
  q2_02_4: { id: 'q2_02_4', type: 'word_order', sentenceId: 's2_02_1', question: '문장을 배열하세요.', questionKo: '옆으로 한 걸음.', words: ['Un', 'paso', 'al', 'costado.'], correctAnswer: 'Un paso al costado.' },

  // ----- L2-03: 뒤로 이동 -----
  q2_03_1: { id: 'q2_03_1', type: 'multiple_choice', sentenceId: 's2_03_1', question: '"뒤로 한 걸음"을 스페인어로?', options: ['Un paso atrás.', 'Un paso adelante.', 'Un paso al costado.', 'Un paso arriba.'], correctAnswer: 'Un paso atrás.' },
  q2_03_2: { id: 'q2_03_2', type: 'fill_blank', sentenceId: 's2_03_2', question: 'No te vayas muy _____.', questionKo: '너무 멀리 가지 마.', correctAnswer: 'lejos', options: ['lejos', 'cerca', 'rápido', 'suave'] },
  q2_03_3: { id: 'q2_03_3', type: 'multiple_choice', sentenceId: 's2_03_3', question: '"Volvé"는?', options: ['돌아와', '걸어', '멈춰', '봐'], correctAnswer: '돌아와' },
  q2_03_4: { id: 'q2_03_4', type: 'word_order', sentenceId: 's2_03_1', question: '문장을 배열하세요.', questionKo: '뒤로 한 걸음.', words: ['Un', 'paso', 'atrás.'], correctAnswer: 'Un paso atrás.' },

  // ----- L2-04: 멈추기 -----
  q2_04_1: { id: 'q2_04_1', type: 'multiple_choice', sentenceId: 's2_04_1', question: '"멈춰"를 스페인어로?', options: ['Pará.', 'Mové.', 'Caminá.', 'Salí.'], correctAnswer: 'Pará.' },
  q2_04_2: { id: 'q2_04_2', type: 'fill_blank', sentenceId: 's2_04_2', question: 'Esperá un _____.', questionKo: '잠깐 기다려.', correctAnswer: 'momento', options: ['momento', 'paso', 'poco', 'rato'] },
  q2_04_3: { id: 'q2_04_3', type: 'multiple_choice', sentenceId: 's2_04_3', question: '"No salgas rápido"는?', options: ['빨리 출발하지 마', '천천히 걸어', '멈춰', '돌아와'], correctAnswer: '빨리 출발하지 마' },
  q2_04_4: { id: 'q2_04_4', type: 'word_order', sentenceId: 's2_04_2', question: '문장을 배열하세요.', questionKo: '잠깐 기다려.', words: ['Esperá', 'un', 'momento.'], correctAnswer: 'Esperá un momento.' },

  // ----- L2-05: 리드와 팔로우 -----
  q2_05_1: { id: 'q2_05_1', type: 'multiple_choice', sentenceId: 's2_05_1', question: '"내가 리드하고 네가 따라와"를 스페인어로?', options: ['Yo lidero, vos seguís.', 'Vos liderás, yo sigo.', 'Caminá conmigo.', 'Esperá la marca.'], correctAnswer: 'Yo lidero, vos seguís.' },
  q2_05_2: { id: 'q2_05_2', type: 'fill_blank', sentenceId: 's2_05_2', question: 'Esperá la _____.', questionKo: '리드 신호를 기다려.', correctAnswer: 'marca', options: ['marca', 'música', 'mano', 'pausa'] },
  q2_05_3: { id: 'q2_05_3', type: 'multiple_choice', sentenceId: 's2_05_3', question: '"No te adelantes"는?', options: ['앞서가지 마', '뒤로 가지 마', '빨리 가지 마', '멈추지 마'], correctAnswer: '앞서가지 마' },
  q2_05_4: { id: 'q2_05_4', type: 'word_order', sentenceId: 's2_05_1', question: '문장을 배열하세요.', questionKo: '내가 리드하고, 네가 따라와.', words: ['Yo', 'lidero,', 'vos', 'seguís.'], correctAnswer: 'Yo lidero, vos seguís.' },

  // ----- L2-06: 마르카 -----
  q2_06_1: { id: 'q2_06_1', type: 'multiple_choice', sentenceId: 's2_06_1', question: '"가슴으로 리드해"를 스페인어로?', options: ['Marcá con el pecho.', 'Mové con el pecho.', 'Sentí con el pecho.', 'Empujá con el pecho.'], correctAnswer: 'Marcá con el pecho.' },
  q2_06_2: { id: 'q2_06_2', type: 'fill_blank', sentenceId: 's2_06_2', question: 'La marca es _____.', questionKo: '리드는 부드럽게.', correctAnswer: 'suave', options: ['suave', 'fuerte', 'rápida', 'grande'] },
  q2_06_3: { id: 'q2_06_3', type: 'multiple_choice', sentenceId: 's2_06_1', question: '"marca"는 탱고에서 무슨 뜻?', options: ['리드 신호', '발자국', '음악', '자세'], correctAnswer: '리드 신호' },
  q2_06_4: { id: 'q2_06_4', type: 'word_order', sentenceId: 's2_06_1', question: '문장을 배열하세요.', questionKo: '가슴으로 리드해.', words: ['Marcá', 'con', 'el', 'pecho.'], correctAnswer: 'Marcá con el pecho.' },

  // ----- L2-07: 살리다 기초 -----
  q2_07_1: { id: 'q2_07_1', type: 'multiple_choice', sentenceId: 's2_07_1', question: '"이게 살리다야"를 스페인어로?', options: ['Esta es la salida.', 'Este es el paso.', 'Esta es la marca.', 'Este es el giro.'], correctAnswer: 'Esta es la salida.' },
  q2_07_2: { id: 'q2_07_2', type: 'fill_blank', sentenceId: 's2_07_2', question: 'Prepará el _____ paso.', questionKo: '첫 걸음을 준비해.', correctAnswer: 'primer', options: ['primer', 'último', 'mejor', 'otro'] },
  q2_07_3: { id: 'q2_07_3', type: 'multiple_choice', sentenceId: 's2_07_1', question: '"salida"의 원래 뜻은?', options: ['출구/출발', '걷기', '회전', '포옹'], correctAnswer: '출구/출발' },
  q2_07_4: { id: 'q2_07_4', type: 'word_order', sentenceId: 's2_07_3', question: '문장을 배열하세요.', questionKo: '시작을 느껴.', words: ['Sentí', 'el', 'inicio.'], correctAnswer: 'Sentí el inicio.' },

  // ----- L2-08: 속도 조절 -----
  q2_08_1: { id: 'q2_08_1', type: 'multiple_choice', sentenceId: 's2_08_1', question: '"더 천천히"를 스페인어로?', options: ['Más despacio.', 'Más rápido.', 'Más suave.', 'Más fuerte.'], correctAnswer: 'Más despacio.' },
  q2_08_2: { id: 'q2_08_2', type: 'fill_blank', sentenceId: 's2_08_2', question: 'Un poco más _____.', questionKo: '조금 더 빠르게.', correctAnswer: 'rápido', options: ['rápido', 'despacio', 'suave', 'corto'] },
  q2_08_3: { id: 'q2_08_3', type: 'multiple_choice', sentenceId: 's2_08_3', question: '"Al tiempo de la música"는?', options: ['음악 박자에 맞춰', '음악을 들어', '음악을 멈춰', '음악이 빨라'], correctAnswer: '음악 박자에 맞춰' },
  q2_08_4: { id: 'q2_08_4', type: 'word_order', sentenceId: 's2_08_1', question: '문장을 배열하세요.', questionKo: '더 천천히.', words: ['Más', 'despacio.'], correctAnswer: 'Más despacio.' },

  // ----- L2-09: 리듬과 걷기 -----
  q2_09_1: { id: 'q2_09_1', type: 'multiple_choice', sentenceId: 's2_09_1', question: '"음악을 들어"를 스페인어로?', options: ['Escuchá la música.', 'Mirá la música.', 'Sentí la música.', 'Marcá la música.'], correctAnswer: 'Escuchá la música.' },
  q2_09_2: { id: 'q2_09_2', type: 'fill_blank', sentenceId: 's2_09_2', question: 'Caminá con el _____.', questionKo: '박자에 맞춰 걸어.', correctAnswer: 'compás', options: ['compás', 'paso', 'ritmo', 'tiempo'] },
  q2_09_3: { id: 'q2_09_3', type: 'multiple_choice', sentenceId: 's2_09_2', question: '"compás"는?', options: ['박자', '걸음', '속도', '방향'], correctAnswer: '박자' },
  q2_09_4: { id: 'q2_09_4', type: 'word_order', sentenceId: 's2_09_1', question: '문장을 배열하세요.', questionKo: '음악을 들어.', words: ['Escuchá', 'la', 'música.'], correctAnswer: 'Escuchá la música.' },

  // ----- L2-10: 보폭 맞추기 -----
  q2_10_1: { id: 'q2_10_1', type: 'multiple_choice', sentenceId: 's2_10_1', question: '"보폭 더 짧게"를 스페인어로?', options: ['Paso más corto.', 'Paso más largo.', 'Paso más rápido.', 'Paso más suave.'], correctAnswer: 'Paso más corto.' },
  q2_10_2: { id: 'q2_10_2', type: 'fill_blank', sentenceId: 's2_10_2', question: 'No abras _____.', questionKo: '너무 크게 벌리지 마.', correctAnswer: 'tanto', options: ['tanto', 'mucho', 'poco', 'más'] },
  q2_10_3: { id: 'q2_10_3', type: 'multiple_choice', sentenceId: 's2_10_3', question: '"Más pequeño"는?', options: ['더 작게', '더 크게', '더 빠르게', '더 느리게'], correctAnswer: '더 작게' },
  q2_10_4: { id: 'q2_10_4', type: 'word_order', sentenceId: 's2_10_1', question: '문장을 배열하세요.', questionKo: '보폭 더 짧게.', words: ['Paso', 'más', 'corto.'], correctAnswer: 'Paso más corto.' },

  // ----- L2-11: 함께 걷기 -----
  q2_11_1: { id: 'q2_11_1', type: 'multiple_choice', sentenceId: 's2_11_1', question: '"같이 걷자"를 스페인어로?', options: ['Caminemos juntos.', 'Caminá solo.', 'Esperá acá.', 'Volvé conmigo.'], correctAnswer: 'Caminemos juntos.' },
  q2_11_2: { id: 'q2_11_2', type: 'fill_blank', sentenceId: 's2_11_3', question: 'Vamos al mismo _____.', questionKo: '같은 리듬으로 가자.', correctAnswer: 'ritmo', options: ['ritmo', 'paso', 'lugar', 'lado'] },
  q2_11_3: { id: 'q2_11_3', type: 'multiple_choice', sentenceId: 's2_11_2', question: '"Sentí mi cuerpo"는?', options: ['내 몸을 느껴', '내 손을 느껴', '내 발을 느껴', '내 마음을 느껴'], correctAnswer: '내 몸을 느껴' },
  q2_11_4: { id: 'q2_11_4', type: 'word_order', sentenceId: 's2_11_1', question: '문장을 배열하세요.', questionKo: '같이 걷자.', words: ['Caminemos', 'juntos.'], correctAnswer: 'Caminemos juntos.' },

  // ----- L2-12: 걷기 역할극 -----
  q2_12_1: { id: 'q2_12_1', type: 'multiple_choice', sentenceId: 's2_12_2', question: '"처음부터 다시 해"를 스페인어로?', options: ['Empezá de nuevo.', 'Otra vez más.', 'Pará de nuevo.', 'Volvé al paso.'], correctAnswer: 'Empezá de nuevo.' },
  q2_12_2: { id: 'q2_12_2', type: 'multiple_choice', sentenceId: 's2_12_3', question: '"Con calma"는?', options: ['차분하게', '빨리', '세게', '다시'], correctAnswer: '차분하게' },
  q2_12_3: { id: 'q2_12_3', type: 'fill_blank', sentenceId: 's2_12_2', question: 'Empezá de _____.', questionKo: '처음부터 다시 해.', correctAnswer: 'nuevo', options: ['nuevo', 'vuelta', 'paso', 'lejos'] },
  q2_12_4: { id: 'q2_12_4', type: 'multiple_choice', sentenceId: 's2_12_1', question: '수업 중 "¿Así?"라고 하면?', options: ['이렇게 하면 맞아요?', '그만할까요?', '다시요?', '좋아요'], correctAnswer: '이렇게 하면 맞아요?' },

  // =====================================================
  // LEVEL 3: Girar y construir — 14 lessons × 4 = 56 quizzes
  // =====================================================

  // ----- L3-01: 앞오초 -----
  q3_01_1: { id: 'q3_01_1', type: 'multiple_choice', sentenceId: 's3_01_1', question: '"앞으로 오초 해"를 스페인어로?', options: ['Hacé un ocho para adelante.', 'Hacé un giro para adelante.', 'Caminá para adelante.', 'Pivotá para adelante.'], correctAnswer: 'Hacé un ocho para adelante.' },
  q3_01_2: { id: 'q3_01_2', type: 'multiple_choice', sentenceId: 's3_01_2', question: '"Pivotá"는?', options: ['피벗해', '걸어', '돌아', '멈춰'], correctAnswer: '피벗해' },
  q3_01_3: { id: 'q3_01_3', type: 'fill_blank', sentenceId: 's3_01_3', question: 'Cruzá la _____.', questionKo: '다리를 교차해.', correctAnswer: 'pierna', options: ['pierna', 'mano', 'cara', 'cadera'] },
  q3_01_4: { id: 'q3_01_4', type: 'word_order', sentenceId: 's3_01_1', question: '문장을 배열하세요.', questionKo: '앞으로 오초 해.', words: ['Hacé', 'un', 'ocho', 'para', 'adelante.'], correctAnswer: 'Hacé un ocho para adelante.' },

  // ----- L3-02: 뒤오초 -----
  q3_02_1: { id: 'q3_02_1', type: 'multiple_choice', sentenceId: 's3_02_2', question: '"골반을 돌려"를 스페인어로?', options: ['Girá la cadera.', 'Mové la cadera.', 'Bajá la cadera.', 'Sentí la cadera.'], correctAnswer: 'Girá la cadera.' },
  q3_02_2: { id: 'q3_02_2', type: 'fill_blank', sentenceId: 's3_02_3', question: 'Mantené el _____.', questionKo: '축을 유지해.', correctAnswer: 'eje', options: ['eje', 'peso', 'paso', 'centro'] },
  q3_02_3: { id: 'q3_02_3', type: 'multiple_choice', sentenceId: 's3_02_1', question: '"Ahora para atrás"는?', options: ['이번엔 뒤로', '이번엔 앞으로', '다시 해', '멈춰'], correctAnswer: '이번엔 뒤로' },
  q3_02_4: { id: 'q3_02_4', type: 'word_order', sentenceId: 's3_02_2', question: '문장을 배열하세요.', questionKo: '골반을 돌려.', words: ['Girá', 'la', 'cadera.'], correctAnswer: 'Girá la cadera.' },

  // ----- L3-03: 크루세 -----
  q3_03_1: { id: 'q3_03_1', type: 'multiple_choice', sentenceId: 's3_03_1', question: '"교차해"를 스페인어로?', options: ['Cruzá.', 'Girá.', 'Pivotá.', 'Caminá.'], correctAnswer: 'Cruzá.' },
  q3_03_2: { id: 'q3_03_2', type: 'fill_blank', sentenceId: 's3_03_3', question: 'Juntá las _____.', questionKo: '다리를 모아.', correctAnswer: 'piernas', options: ['piernas', 'manos', 'brazos', 'pies'] },
  q3_03_3: { id: 'q3_03_3', type: 'multiple_choice', sentenceId: 's3_03_2', question: '"Esperá el cruce"는?', options: ['교차 타이밍을 기다려', '교차를 해', '교차를 멈춰', '교차를 돌려'], correctAnswer: '교차 타이밍을 기다려' },
  q3_03_4: { id: 'q3_03_4', type: 'word_order', sentenceId: 's3_03_3', question: '문장을 배열하세요.', questionKo: '다리를 모아.', words: ['Juntá', 'las', 'piernas.'], correctAnswer: 'Juntá las piernas.' },

  // ----- L3-04: 회전 시작 -----
  q3_04_1: { id: 'q3_04_1', type: 'multiple_choice', sentenceId: 's3_04_1', question: '"회전 시작해"를 스페인어로?', options: ['Empezá el giro.', 'Hacé el giro.', 'Sentí el giro.', 'Pará el giro.'], correctAnswer: 'Empezá el giro.' },
  q3_04_2: { id: 'q3_04_2', type: 'multiple_choice', sentenceId: 's3_04_1', question: '"giro"는?', options: ['회전', '걷기', '교차', '멈춤'], correctAnswer: '회전' },
  q3_04_3: { id: 'q3_04_3', type: 'fill_blank', sentenceId: 's3_04_2', question: 'No corras la _____.', questionKo: '회전을 서두르지 마.', correctAnswer: 'vuelta', options: ['vuelta', 'pierna', 'mano', 'marca'] },
  q3_04_4: { id: 'q3_04_4', type: 'word_order', sentenceId: 's3_04_1', question: '문장을 배열하세요.', questionKo: '회전 시작해.', words: ['Empezá', 'el', 'giro.'], correctAnswer: 'Empezá el giro.' },

  // ----- L3-05: 회전 안에서 -----
  q3_05_1: { id: 'q3_05_1', type: 'multiple_choice', sentenceId: 's3_05_1', question: '히로의 3스텝 순서는?', options: ['앞, 옆, 뒤', '옆, 앞, 뒤', '뒤, 옆, 앞', '앞, 뒤, 옆'], correctAnswer: '앞, 옆, 뒤' },
  q3_05_2: { id: 'q3_05_2', type: 'fill_blank', sentenceId: 's3_05_2', question: 'Cada paso tiene su _____.', questionKo: '각 스텝에는 자리가 있어.', correctAnswer: 'lugar', options: ['lugar', 'tiempo', 'peso', 'ritmo'] },
  q3_05_3: { id: 'q3_05_3', type: 'multiple_choice', sentenceId: 's3_05_3', question: '"Volvé al centro"는?', options: ['중심으로 돌아와', '앞으로 걸어', '뒤로 물러나', '옆으로 벌려'], correctAnswer: '중심으로 돌아와' },
  q3_05_4: { id: 'q3_05_4', type: 'word_order', sentenceId: 's3_05_1', question: '문장을 배열하세요.', questionKo: '앞, 옆, 뒤.', words: ['Adelante,', 'costado,', 'atrás.'], correctAnswer: 'Adelante, costado, atrás.' },

  // ----- L3-06: 기본이 먼저 -----
  q3_06_1: { id: 'q3_06_1', type: 'multiple_choice', sentenceId: 's3_06_1', question: '"먼저 잘 걸어"를 스페인어로?', options: ['Primero caminá bien.', 'Primero girá bien.', 'Primero pivotá.', 'Primero cruzá.'], correctAnswer: 'Primero caminá bien.' },
  q3_06_2: { id: 'q3_06_2', type: 'multiple_choice', sentenceId: 's3_06_3', question: '"Sin base, no funciona"는?', options: ['기본 없이는 안 돼', '기본이 쉬워', '기본을 버려', '기본보다 기술'], correctAnswer: '기본 없이는 안 돼' },
  q3_06_3: { id: 'q3_06_3', type: 'fill_blank', sentenceId: 's3_06_2', question: '_____ girá.', questionKo: '그 다음에 돌아.', correctAnswer: 'Después', options: ['Después', 'Primero', 'Ahora', 'No'] },
  q3_06_4: { id: 'q3_06_4', type: 'word_order', sentenceId: 's3_06_3', question: '문장을 배열하세요.', questionKo: '기본 없이는 안 돼.', words: ['Sin', 'base,', 'no', 'funciona.'], correctAnswer: 'Sin base, no funciona.' },

  // ----- L3-07: 아도르노 -----
  q3_07_1: { id: 'q3_07_1', type: 'multiple_choice', sentenceId: 's3_07_1', question: '"adorno"는?', options: ['장식', '기본', '회전', '걷기'], correctAnswer: '장식' },
  q3_07_2: { id: 'q3_07_2', type: 'fill_blank', sentenceId: 's3_07_2', question: 'Usá el pie _____.', questionKo: '프리 레그를 써.', correctAnswer: 'libre', options: ['libre', 'derecho', 'izquierdo', 'grande'] },
  q3_07_3: { id: 'q3_07_3', type: 'multiple_choice', sentenceId: 's3_07_3', question: '"Es tu momento"는?', options: ['이건 네 순간이야', '이건 끝이야', '이건 어려워', '이건 시작이야'], correctAnswer: '이건 네 순간이야' },
  q3_07_4: { id: 'q3_07_4', type: 'word_order', sentenceId: 's3_07_1', question: '문장을 배열하세요.', questionKo: '먼저 기본, 그 다음 장식.', words: ['Primero', 'la', 'base,', 'después', 'el', 'adorno.'], correctAnswer: 'Primero la base, después el adorno.' },

  // ----- L3-08: 사카다 -----
  q3_08_1: { id: 'q3_08_1', type: 'multiple_choice', sentenceId: 's3_08_1', question: '"다리로 들어가"를 스페인어로?', options: ['Entrá con la pierna.', 'Salí con la pierna.', 'Girá con la pierna.', 'Mové con la pierna.'], correctAnswer: 'Entrá con la pierna.' },
  q3_08_2: { id: 'q3_08_2', type: 'multiple_choice', sentenceId: 's3_08_2', question: '"Es una invitación"은?', options: ['이건 초대야', '이건 명령이야', '이건 실수야', '이건 기본이야'], correctAnswer: '이건 초대야' },
  q3_08_3: { id: 'q3_08_3', type: 'fill_blank', sentenceId: 's3_08_1', question: 'Entrá con la _____.', questionKo: '다리로 들어가.', correctAnswer: 'pierna', options: ['pierna', 'mano', 'cadera', 'cabeza'] },
  q3_08_4: { id: 'q3_08_4', type: 'word_order', sentenceId: 's3_08_2', question: '문장을 배열하세요.', questionKo: '이건 초대야.', words: ['Es', 'una', 'invitación.'], correctAnswer: 'Es una invitación.' },

  // ----- L3-09: 파라다 -----
  q3_09_1: { id: 'q3_09_1', type: 'multiple_choice', sentenceId: 's3_09_1', question: '"파라다를 해"를 스페인어로?', options: ['Hacé una parada.', 'Hacé un giro.', 'Hacé un ocho.', 'Hacé una sacada.'], correctAnswer: 'Hacé una parada.' },
  q3_09_2: { id: 'q3_09_2', type: 'fill_blank', sentenceId: 's3_09_2', question: 'Marcá el _____.', questionKo: '브레이크를 걸어.', correctAnswer: 'freno', options: ['freno', 'paso', 'giro', 'ocho'] },
  q3_09_3: { id: 'q3_09_3', type: 'multiple_choice', sentenceId: 's3_09_3', question: '"No pierdas la conexión"은?', options: ['연결을 잃지 마', '연결을 만들어', '연결을 끊어', '연결을 느껴'], correctAnswer: '연결을 잃지 마' },
  q3_09_4: { id: 'q3_09_4', type: 'word_order', sentenceId: 's3_09_1', question: '문장을 배열하세요.', questionKo: '파라다를 해.', words: ['Hacé', 'una', 'parada.'], correctAnswer: 'Hacé una parada.' },

  // ----- L3-10: 볼레오 -----
  q3_10_1: { id: 'q3_10_1', type: 'multiple_choice', sentenceId: 's3_10_2', question: '"자연스럽게 나오게 해"를 스페인어로?', options: ['Dejá que salga natural.', 'Hacé que salga rápido.', 'Mové que salga fuerte.', 'Sentí que salga solo.'], correctAnswer: 'Dejá que salga natural.' },
  q3_10_2: { id: 'q3_10_2', type: 'multiple_choice', sentenceId: 's3_10_3', question: '"No fuerces el boleo"는?', options: ['볼레오를 억지로 하지 마', '볼레오를 크게 해', '볼레오를 빨리 해', '볼레오를 멈춰'], correctAnswer: '볼레오를 억지로 하지 마' },
  q3_10_3: { id: 'q3_10_3', type: 'fill_blank', sentenceId: 's3_10_1', question: 'No lo hagas _____.', questionKo: '크게 하지 마.', correctAnswer: 'grande', options: ['grande', 'pequeño', 'rápido', 'suave'] },
  q3_10_4: { id: 'q3_10_4', type: 'word_order', sentenceId: 's3_10_2', question: '문장을 배열하세요.', questionKo: '자연스럽게 나오게 해.', words: ['Dejá', 'que', 'salga', 'natural.'], correctAnswer: 'Dejá que salga natural.' },

  // ----- L3-11: 강도 조절 -----
  q3_11_1: { id: 'q3_11_1', type: 'multiple_choice', sentenceId: 's3_11_2', question: '"힘 좀 줄여"를 스페인어로?', options: ['Menos fuerza.', 'Más fuerza.', 'Menos suave.', 'Más rápido.'], correctAnswer: 'Menos fuerza.' },
  q3_11_2: { id: 'q3_11_2', type: 'multiple_choice', sentenceId: 's3_11_1', question: '"Más suave"와 반대 뜻은?', options: ['Más fuerte', 'Más despacio', 'Más pequeño', 'Más lejos'], correctAnswer: 'Más fuerte' },
  q3_11_3: { id: 'q3_11_3', type: 'fill_blank', sentenceId: 's3_11_2', question: '_____ fuerza.', questionKo: '힘 좀 줄여.', correctAnswer: 'Menos', options: ['Menos', 'Más', 'Sin', 'Con'] },
  q3_11_4: { id: 'q3_11_4', type: 'multiple_choice', sentenceId: 's3_11_3', question: '"Mejor así"는?', options: ['이게 더 나아', '이건 안 돼', '다시 해', '더 세게'], correctAnswer: '이게 더 나아' },

  // ----- L3-12: 실수 후 복구 -----
  q3_12_1: { id: 'q3_12_1', type: 'multiple_choice', sentenceId: 's3_12_1', question: '"괜찮아, 아무 일도 아니야"를 스페인어로?', options: ['No pasa nada.', 'Pará todo.', 'No está bien.', 'Otra vez.'], correctAnswer: 'No pasa nada.' },
  q3_12_2: { id: 'q3_12_2', type: 'fill_blank', sentenceId: 's3_12_2', question: 'Volvamos _____ acá.', questionKo: '여기서부터 다시 하자.', correctAnswer: 'desde', options: ['desde', 'hasta', 'para', 'con'] },
  q3_12_3: { id: 'q3_12_3', type: 'multiple_choice', sentenceId: 's3_12_3', question: '"Otra vez, con calma"는?', options: ['다시, 차분하게', '다시, 빨리', '멈춰, 조용히', '좋아, 가자'], correctAnswer: '다시, 차분하게' },
  q3_12_4: { id: 'q3_12_4', type: 'word_order', sentenceId: 's3_12_1', question: '문장을 배열하세요.', questionKo: '괜찮아, 아무 일도 아니야.', words: ['No', 'pasa', 'nada.'], correctAnswer: 'No pasa nada.' },

  // ----- L3-13: 수업 중 질문 -----
  q3_13_1: { id: 'q3_13_1', type: 'multiple_choice', sentenceId: 's3_13_1', question: '"다시 해봐도 될까요?"를 스페인어로?', options: ['¿Puedo intentar de nuevo?', '¿Puedo salir de nuevo?', '¿Puedo caminar de nuevo?', '¿Puedo parar de nuevo?'], correctAnswer: '¿Puedo intentar de nuevo?' },
  q3_13_2: { id: 'q3_13_2', type: 'multiple_choice', sentenceId: 's3_13_3', question: '"No entendí"는?', options: ['이해 못 했어요', '잘했어요', '다시 해요', '괜찮아요'], correctAnswer: '이해 못 했어요' },
  q3_13_3: { id: 'q3_13_3', type: 'fill_blank', sentenceId: 's3_13_2', question: '¿Así está _____?', questionKo: '이렇게 하면 맞아요?', correctAnswer: 'bien', options: ['bien', 'mal', 'mucho', 'poco'] },
  q3_13_4: { id: 'q3_13_4', type: 'word_order', sentenceId: 's3_13_1', question: '문장을 배열하세요.', questionKo: '다시 해봐도 될까요?', words: ['¿Puedo', 'intentar', 'de', 'nuevo?'], correctAnswer: '¿Puedo intentar de nuevo?' },

  // ----- L3-14: 회전 역할극 -----
  q3_14_1: { id: 'q3_14_1', type: 'multiple_choice', sentenceId: 's3_14_1', question: '"피벗 준비해"를 스페인어로?', options: ['Prepará el pivote.', 'Hacé el pivote.', 'Sentí el pivote.', 'Girá el pivote.'], correctAnswer: 'Prepará el pivote.' },
  q3_14_2: { id: 'q3_14_2', type: 'multiple_choice', sentenceId: 's3_14_3', question: '"Primero la base"는?', options: ['먼저 기본', '먼저 장식', '먼저 회전', '먼저 걷기'], correctAnswer: '먼저 기본' },
  q3_14_3: { id: 'q3_14_3', type: 'fill_blank', sentenceId: 's3_14_2', question: 'Más desde el _____.', questionKo: '중심에서 더.', correctAnswer: 'centro', options: ['centro', 'piso', 'costado', 'frente'] },
  q3_14_4: { id: 'q3_14_4', type: 'word_order', sentenceId: 's3_14_3', question: '문장을 배열하세요.', questionKo: '먼저 기본.', words: ['Primero', 'la', 'base.'], correctAnswer: 'Primero la base.' },

  // =====================================================
  // LEVEL 4: Hablar en la práctica — 12 × 4 = 48 quizzes
  // =====================================================

  // ----- L4-01: 다시 해볼까요 -----
  q4_01_1: { id: 'q4_01_1', type: 'multiple_choice', sentenceId: 's4_01_1', question: '"다시요, 제발"을 스페인어로?', options: ['Otra vez, por favor.', 'Otra vez, gracias.', 'De nuevo, adiós.', 'Más, por favor.'], correctAnswer: 'Otra vez, por favor.' },
  q4_01_2: { id: 'q4_01_2', type: 'fill_blank', sentenceId: 's4_01_3', question: 'Desde el _____.', questionKo: '처음부터.', correctAnswer: 'principio', options: ['principio', 'final', 'centro', 'medio'] },
  q4_01_3: { id: 'q4_01_3', type: 'multiple_choice', sentenceId: 's4_01_2', question: '"Hagámoslo de nuevo"는?', options: ['다시 해보자', '멈추자', '바꾸자', '끝내자'], correctAnswer: '다시 해보자' },
  q4_01_4: { id: 'q4_01_4', type: 'word_order', sentenceId: 's4_01_1', question: '문장을 배열하세요.', questionKo: '다시요, 제발.', words: ['Otra', 'vez,', 'por', 'favor.'], correctAnswer: 'Otra vez, por favor.' },

  // ----- L4-02: 더 좋아요 -----
  q4_02_1: { id: 'q4_02_1', type: 'multiple_choice', sentenceId: 's4_02_1', question: '"이제 더 나아"를 스페인어로?', options: ['Ahora está mejor.', 'Ahora está mal.', 'Todavía no.', 'Otra vez.'], correctAnswer: 'Ahora está mejor.' },
  q4_02_2: { id: 'q4_02_2', type: 'fill_blank', sentenceId: 's4_02_3', question: '_____ mejor.', questionKo: '훨씬 나아.', correctAnswer: 'Mucho', options: ['Mucho', 'Más', 'Poco', 'Muy'] },
  q4_02_3: { id: 'q4_02_3', type: 'multiple_choice', sentenceId: 's4_02_2', question: '"Sí, así está bien"은?', options: ['응, 이렇게 하면 맞아', '아니, 안 돼', '다시 해봐', '모르겠어'], correctAnswer: '응, 이렇게 하면 맞아' },
  q4_02_4: { id: 'q4_02_4', type: 'word_order', sentenceId: 's4_02_1', question: '문장을 배열하세요.', questionKo: '이제 더 나아.', words: ['Ahora', 'está', 'mejor.'], correctAnswer: 'Ahora está mejor.' },

  // ----- L4-03: 아직 아니에요 -----
  q4_03_1: { id: 'q4_03_1', type: 'multiple_choice', sentenceId: 's4_03_1', question: '"아직 아니야"를 스페인어로?', options: ['Todavía no.', 'Ahora sí.', 'Ya está.', 'Mejor así.'], correctAnswer: 'Todavía no.' },
  q4_03_2: { id: 'q4_03_2', type: 'multiple_choice', sentenceId: 's4_03_3', question: '"Probemos diferente"는?', options: ['다르게 해보자', '같이 해보자', '멈추자', '돌아가자'], correctAnswer: '다르게 해보자' },
  q4_03_3: { id: 'q4_03_3', type: 'fill_blank', sentenceId: 's4_03_2', question: 'No _____.', questionKo: '그렇게는 아니야.', correctAnswer: 'así', options: ['así', 'bien', 'más', 'mucho'] },
  q4_03_4: { id: 'q4_03_4', type: 'word_order', sentenceId: 's4_03_3', question: '문장을 배열하세요.', questionKo: '다르게 해보자.', words: ['Probemos', 'diferente.'], correctAnswer: 'Probemos diferente.' },

  // ----- L4-04: 천천히요 -----
  q4_04_1: { id: 'q4_04_1', type: 'multiple_choice', sentenceId: 's4_04_3', question: '"시간 갖고 해"를 스페인어로?', options: ['Tomate tu tiempo.', 'Más despacio.', 'No te apures.', 'Con calma.'], correctAnswer: 'Tomate tu tiempo.' },
  q4_04_2: { id: 'q4_04_2', type: 'fill_blank', sentenceId: 's4_04_2', question: 'No tan _____.', questionKo: '그렇게 빠르지 않게.', correctAnswer: 'rápido', options: ['rápido', 'despacio', 'suave', 'fuerte'] },
  q4_04_3: { id: 'q4_04_3', type: 'multiple_choice', sentenceId: 's4_04_1', question: '"Más despacio"와 비슷한 표현은?', options: ['No tan rápido', 'Más rápido', 'Más fuerte', 'Otra vez'], correctAnswer: 'No tan rápido' },
  q4_04_4: { id: 'q4_04_4', type: 'word_order', sentenceId: 's4_04_3', question: '문장을 배열하세요.', questionKo: '시간 갖고 해.', words: ['Tomate', 'tu', 'tiempo.'], correctAnswer: 'Tomate tu tiempo.' },

  // ----- L4-05: 느낌이 안 와요 -----
  q4_05_1: { id: 'q4_05_1', type: 'multiple_choice', sentenceId: 's4_05_1', question: '"느낌이 안 와"를 스페인어로?', options: ['No lo siento bien.', 'Lo siento mucho.', 'No entiendo.', 'No me gusta.'], correctAnswer: 'No lo siento bien.' },
  q4_05_2: { id: 'q4_05_2', type: 'fill_blank', sentenceId: 's4_05_3', question: '_____ otra vez.', questionKo: '다시 보여줘.', correctAnswer: 'Mostrame', options: ['Mostrame', 'Decime', 'Haceme', 'Dame'] },
  q4_05_3: { id: 'q4_05_3', type: 'multiple_choice', sentenceId: 's4_05_2', question: '"No entiendo esta parte"는?', options: ['이 부분을 모르겠어', '이 부분이 좋아', '이 부분을 건너뛰자', '이 부분은 끝'], correctAnswer: '이 부분을 모르겠어' },
  q4_05_4: { id: 'q4_05_4', type: 'word_order', sentenceId: 's4_05_3', question: '문장을 배열하세요.', questionKo: '다시 보여줘.', words: ['Mostrame', 'otra', 'vez.'], correctAnswer: 'Mostrame otra vez.' },

  // ----- L4-06: 연결이 끊겼어요 -----
  q4_06_1: { id: 'q4_06_1', type: 'multiple_choice', sentenceId: 's4_06_1', question: '"연결이 끊겼어"를 스페인어로?', options: ['Perdimos la conexión.', 'Sentí la conexión.', 'Rompimos la conexión.', 'Busquemos la conexión.'], correctAnswer: 'Perdimos la conexión.' },
  q4_06_2: { id: 'q4_06_2', type: 'fill_blank', sentenceId: 's4_06_2', question: 'Quedate _____.', questionKo: '나한테 머물러.', correctAnswer: 'conmigo', options: ['conmigo', 'solo', 'adelante', 'atrás'] },
  q4_06_3: { id: 'q4_06_3', type: 'multiple_choice', sentenceId: 's4_06_3', question: '"No te vayas sola"는?', options: ['혼자 가지 마', '혼자 연습해', '빨리 가', '천천히 와'], correctAnswer: '혼자 가지 마' },
  q4_06_4: { id: 'q4_06_4', type: 'word_order', sentenceId: 's4_06_1', question: '문장을 배열하세요.', questionKo: '연결이 끊겼어.', words: ['Perdimos', 'la', 'conexión.'], correctAnswer: 'Perdimos la conexión.' },

  // ----- L4-07: 타이밍 -----
  q4_07_1: { id: 'q4_07_1', type: 'multiple_choice', sentenceId: 's4_07_1', question: '"너무 일찍 들어왔어"를 스페인어로?', options: ['Entraste antes.', 'Entraste después.', 'Entraste bien.', 'Saliste antes.'], correctAnswer: 'Entraste antes.' },
  q4_07_2: { id: 'q4_07_2', type: 'fill_blank', sentenceId: 's4_07_2', question: 'Esperá un poco _____.', questionKo: '조금만 더 기다려.', correctAnswer: 'más', options: ['más', 'menos', 'mejor', 'bien'] },
  q4_07_3: { id: 'q4_07_3', type: 'multiple_choice', sentenceId: 's4_07_3', question: '"Ahora sí, justo ahí"는?', options: ['이제 맞아, 딱 거기', '아직 아니야', '다시 해', '더 빨리'], correctAnswer: '이제 맞아, 딱 거기' },
  q4_07_4: { id: 'q4_07_4', type: 'word_order', sentenceId: 's4_07_1', question: '문장을 배열하세요.', questionKo: '너무 일찍 들어왔어.', words: ['Entraste', 'antes.'], correctAnswer: 'Entraste antes.' },

  // ----- L4-08: 감정 표현 -----
  q4_08_1: { id: 'q4_08_1', type: 'multiple_choice', sentenceId: 's4_08_1', question: '"나 긴장돼"를 스페인어로?', options: ['Estoy nervioso.', 'Estoy cómodo.', 'Estoy cansado.', 'Estoy bien.'], correctAnswer: 'Estoy nervioso.' },
  q4_08_2: { id: 'q4_08_2', type: 'fill_blank', sentenceId: 's4_08_2', question: 'Me siento más _____.', questionKo: '더 편해졌어.', correctAnswer: 'cómodo', options: ['cómodo', 'nervioso', 'rápido', 'lejos'] },
  q4_08_3: { id: 'q4_08_3', type: 'multiple_choice', sentenceId: 's4_08_3', question: '"Fue divertido"는?', options: ['재밌었어', '어려웠어', '무서웠어', '지루했어'], correctAnswer: '재밌었어' },
  q4_08_4: { id: 'q4_08_4', type: 'word_order', sentenceId: 's4_08_1', question: '문장을 배열하세요.', questionKo: '나 긴장돼.', words: ['Estoy', 'nervioso.'], correctAnswer: 'Estoy nervioso.' },

  // ----- L4-09: 서로 피드백 -----
  q4_09_1: { id: 'q4_09_1', type: 'multiple_choice', sentenceId: 's4_09_1', question: '"아주 좋았어"를 스페인어로?', options: ['Estuvo muy bien.', 'Estuvo muy mal.', 'Fue muy rápido.', 'No estuvo bien.'], correctAnswer: 'Estuvo muy bien.' },
  q4_09_2: { id: 'q4_09_2', type: 'fill_blank', sentenceId: 's4_09_2', question: 'Sentí algo _____.', questionKo: '뭔가 이상하게 느껴졌어.', correctAnswer: 'raro', options: ['raro', 'bien', 'lindo', 'suave'] },
  q4_09_3: { id: 'q4_09_3', type: 'multiple_choice', sentenceId: 's4_09_3', question: '"¿Probamos de nuevo?"는?', options: ['다시 해볼까?', '그만할까?', '바꿀까?', '쉴까?'], correctAnswer: '다시 해볼까?' },
  q4_09_4: { id: 'q4_09_4', type: 'word_order', sentenceId: 's4_09_1', question: '문장을 배열하세요.', questionKo: '아주 좋았어.', words: ['Estuvo', 'muy', 'bien.'], correctAnswer: 'Estuvo muy bien.' },

  // ----- L4-10: 진전 대화 -----
  q4_10_1: { id: 'q4_10_1', type: 'multiple_choice', sentenceId: 's4_10_1', question: '"나 나아지고 있어"를 스페인어로?', options: ['Estoy mejorando.', 'Estoy empeorando.', 'Estoy cansado.', 'Estoy nervioso.'], correctAnswer: 'Estoy mejorando.' },
  q4_10_2: { id: 'q4_10_2', type: 'fill_blank', sentenceId: 's4_10_2', question: 'Antes no _____.', questionKo: '전에는 못 했어.', correctAnswer: 'podía', options: ['podía', 'quería', 'sabía', 'tenía'] },
  q4_10_3: { id: 'q4_10_3', type: 'multiple_choice', sentenceId: 's4_10_3', question: '"Cada vez mejor"는?', options: ['갈수록 좋아져', '갈수록 어려워', '항상 같아', '가끔 좋아'], correctAnswer: '갈수록 좋아져' },
  q4_10_4: { id: 'q4_10_4', type: 'word_order', sentenceId: 's4_10_3', question: '문장을 배열하세요.', questionKo: '갈수록 좋아져.', words: ['Cada', 'vez', 'mejor.'], correctAnswer: 'Cada vez mejor.' },

  // ----- L4-11: 파트너 교체 인사 -----
  q4_11_1: { id: 'q4_11_1', type: 'multiple_choice', sentenceId: 's4_11_1', question: '"바꿀까요?"를 스페인어로?', options: ['¿Cambiamos?', '¿Bailamos?', '¿Paramos?', '¿Seguimos?'], correctAnswer: '¿Cambiamos?' },
  q4_11_2: { id: 'q4_11_2', type: 'multiple_choice', sentenceId: 's4_11_2', question: '"Fue un placer"는?', options: ['즐거웠어요', '힘들었어요', '이상했어요', '쉬웠어요'], correctAnswer: '즐거웠어요' },
  q4_11_3: { id: 'q4_11_3', type: 'fill_blank', sentenceId: 's4_11_3', question: 'Gracias por _____ conmigo.', questionKo: '같이 춰줘서 고마워요.', correctAnswer: 'bailar', options: ['bailar', 'caminar', 'hablar', 'estar'] },
  q4_11_4: { id: 'q4_11_4', type: 'word_order', sentenceId: 's4_11_2', question: '문장을 배열하세요.', questionKo: '즐거웠어요.', words: ['Fue', 'un', 'placer.'], correctAnswer: 'Fue un placer.' },

  // ----- L4-12: 연습 역할극 -----
  q4_12_1: { id: 'q4_12_1', type: 'multiple_choice', sentenceId: 's4_12_1', question: '"이게 더 나아요?"를 스페인어로?', options: ['¿Así está mejor?', '¿Así está mal?', '¿Así está bien?', '¿Así está lindo?'], correctAnswer: '¿Así está mejor?' },
  q4_12_2: { id: 'q4_12_2', type: 'multiple_choice', sentenceId: 's4_12_2', question: '"Sí, se siente mejor"는?', options: ['응, 느낌이 더 좋아', '아니, 느낌이 안 좋아', '모르겠어', '다시 해봐'], correctAnswer: '응, 느낌이 더 좋아' },
  q4_12_3: { id: 'q4_12_3', type: 'fill_blank', sentenceId: 's4_12_3', question: 'Probemos _____ vez.', questionKo: '한 번 더 해보자.', correctAnswer: 'otra', options: ['otra', 'una', 'más', 'esta'] },
  q4_12_4: { id: 'q4_12_4', type: 'word_order', sentenceId: 's4_12_3', question: '문장을 배열하세요.', questionKo: '한 번 더 해보자.', words: ['Probemos', 'otra', 'vez.'], correctAnswer: 'Probemos otra vez.' },

  // =====================================================
  // LEVEL 5: Sobrevivir en la milonga — 16 × 4 = 64 quizzes
  // =====================================================

  // L5-01: 밀롱가 도착
  q5_01_1: { id: 'q5_01_1', type: 'multiple_choice', sentenceId: 's5_01_1', question: '저녁 인사를 스페인어로?', options: ['Buenas noches.', 'Buenos días.', 'Buenas tardes.', 'Hola, ¿qué tal?'], correctAnswer: 'Buenas noches.' },
  q5_01_2: { id: 'q5_01_2', type: 'fill_blank', sentenceId: 's5_01_2', question: '¿Hay _____?', questionKo: '자리 있어요?', correctAnswer: 'lugar', options: ['lugar', 'mesa', 'silla', 'espacio'] },
  q5_01_3: { id: 'q5_01_3', type: 'multiple_choice', sentenceId: 's5_01_3', question: '"¿Dónde me puedo sentar?"는?', options: ['어디 앉을 수 있어요?', '어디로 가나요?', '어디가 바닥이에요?', '어디서 춤춰요?'], correctAnswer: '어디 앉을 수 있어요?' },
  q5_01_4: { id: 'q5_01_4', type: 'word_order', sentenceId: 's5_01_1', question: '문장을 배열하세요.', questionKo: '안녕하세요 (저녁).', words: ['Buenas', 'noches.'], correctAnswer: 'Buenas noches.' },

  // L5-02: 처음 만남
  q5_02_1: { id: 'q5_02_1', type: 'multiple_choice', sentenceId: 's5_02_1', question: '"반갑습니다"를 스페인어로?', options: ['Es un placer.', 'Es un honor.', 'Gracias.', 'Hola.'], correctAnswer: 'Es un placer.' },
  q5_02_2: { id: 'q5_02_2', type: 'fill_blank', sentenceId: 's5_02_2', question: 'Soy de _____.', questionKo: '한국에서 왔어요.', correctAnswer: 'Corea', options: ['Corea', 'China', 'Japón', 'Francia'] },
  q5_02_3: { id: 'q5_02_3', type: 'multiple_choice', sentenceId: 's5_02_3', question: '"Es mi primera vez acá"는?', options: ['여기 처음이에요', '여기 자주 와요', '여기 마지막이에요', '여기 집이에요'], correctAnswer: '여기 처음이에요' },
  q5_02_4: { id: 'q5_02_4', type: 'word_order', sentenceId: 's5_02_1', question: '문장을 배열하세요.', questionKo: '반갑습니다.', words: ['Es', 'un', 'placer.'], correctAnswer: 'Es un placer.' },

  // L5-03: 카베세오
  q5_03_1: { id: 'q5_03_1', type: 'multiple_choice', sentenceId: 's5_03_2', question: '"우리 눈이 마주쳤어요"를 스페인어로?', options: ['Nos cruzamos la mirada.', 'Nos vimos los ojos.', 'Te miré fijo.', 'Me miraste.'], correctAnswer: 'Nos cruzamos la mirada.' },
  q5_03_2: { id: 'q5_03_2', type: 'multiple_choice', sentenceId: 's5_03_1', question: '"Te vi desde allá"는?', options: ['저쪽에서 봤어요', '여기서 봤어요', '못 봤어요', '잘 봤어요'], correctAnswer: '저쪽에서 봤어요' },
  q5_03_3: { id: 'q5_03_3', type: 'fill_blank', sentenceId: 's5_03_3', question: 'Sí, te _____.', questionKo: '네, 알겠어요.', correctAnswer: 'entendí', options: ['entendí', 'vi', 'escuché', 'sentí'] },
  q5_03_4: { id: 'q5_03_4', type: 'word_order', sentenceId: 's5_03_2', question: '문장을 배열하세요.', questionKo: '눈이 마주쳤어요.', words: ['Nos', 'cruzamos', 'la', 'mirada.'], correctAnswer: 'Nos cruzamos la mirada.' },

  // L5-04: 춤 신청
  q5_04_1: { id: 'q5_04_1', type: 'multiple_choice', sentenceId: 's5_04_1', question: '"이 탄다 같이 출래요?"를 스페인어로?', options: ['¿Querés bailar esta tanda?', '¿Querés caminar conmigo?', '¿Querés practicar?', '¿Querés descansar?'], correctAnswer: '¿Querés bailar esta tanda?' },
  q5_04_2: { id: 'q5_04_2', type: 'multiple_choice', sentenceId: 's5_04_3', question: '"Con mucho gusto"는?', options: ['기꺼이요', '미안해요', '다음에요', '모르겠어요'], correctAnswer: '기꺼이요' },
  q5_04_3: { id: 'q5_04_3', type: 'fill_blank', sentenceId: 's5_04_1', question: '¿Querés bailar esta _____?', questionKo: '이 탄다 같이 출래요?', correctAnswer: 'tanda', options: ['tanda', 'noche', 'música', 'vez'] },
  q5_04_4: { id: 'q5_04_4', type: 'word_order', sentenceId: 's5_04_2', question: '문장을 배열하세요.', questionKo: '좋아요, 가요.', words: ['Dale,', 'vamos.'], correctAnswer: 'Dale, vamos.' },

  // L5-05: 춤 도중
  q5_05_1: { id: 'q5_05_1', type: 'multiple_choice', sentenceId: 's5_05_1', question: '"편해요?"를 스페인어로?', options: ['¿Estás cómoda?', '¿Estás lista?', '¿Estás nerviosa?', '¿Estás cansada?'], correctAnswer: '¿Estás cómoda?' },
  q5_05_2: { id: 'q5_05_2', type: 'fill_blank', sentenceId: 's5_05_2', question: 'Perdón, fue mi _____.', questionKo: '미안, 내 잘못이야.', correctAnswer: 'culpa', options: ['culpa', 'turno', 'paso', 'error'] },
  q5_05_3: { id: 'q5_05_3', type: 'multiple_choice', sentenceId: 's5_05_3', question: '"Tranquilo, no pasa nada"는?', options: ['괜찮아, 아무 일도 아니야', '미안해, 내 잘못이야', '조심해', '다시 해'], correctAnswer: '괜찮아, 아무 일도 아니야' },
  q5_05_4: { id: 'q5_05_4', type: 'word_order', sentenceId: 's5_05_2', question: '문장을 배열하세요.', questionKo: '미안, 내 잘못이야.', words: ['Perdón,', 'fue', 'mi', 'culpa.'], correctAnswer: 'Perdón, fue mi culpa.' },

  // L5-06: 음악 대화
  q5_06_1: { id: 'q5_06_1', type: 'multiple_choice', sentenceId: 's5_06_2', question: '"이 노래 너무 좋아요"를 스페인어로?', options: ['Me encanta esta canción.', 'Me gusta este tango.', 'No conozco esta canción.', 'Esta canción es vieja.'], correctAnswer: 'Me encanta esta canción.' },
  q5_06_2: { id: 'q5_06_2', type: 'fill_blank', sentenceId: 's5_06_1', question: '¿De qué _____ es?', questionKo: '어느 오케스트라예요?', correctAnswer: 'orquesta', options: ['orquesta', 'canción', 'tanda', 'música'] },
  q5_06_3: { id: 'q5_06_3', type: 'multiple_choice', sentenceId: 's5_06_3', question: '"vals"는?', options: ['왈츠', '탱고', '밀롱가', '폭스트롯'], correctAnswer: '왈츠' },
  q5_06_4: { id: 'q5_06_4', type: 'word_order', sentenceId: 's5_06_2', question: '문장을 배열하세요.', questionKo: '이 노래 너무 좋아요.', words: ['Me', 'encanta', 'esta', 'canción.'], correctAnswer: 'Me encanta esta canción.' },

  // L5-07: 칭찬
  q5_07_1: { id: 'q5_07_1', type: 'multiple_choice', sentenceId: 's5_07_1', question: '"당신 아브라소 너무 편해요"를 스페인어로?', options: ['Tu abrazo es muy cómodo.', 'Tu abrazo es muy fuerte.', 'Tu abrazo es muy grande.', 'Tu abrazo es muy raro.'], correctAnswer: 'Tu abrazo es muy cómodo.' },
  q5_07_2: { id: 'q5_07_2', type: 'fill_blank', sentenceId: 's5_07_2', question: 'Bailás con mucho _____.', questionKo: '감정을 담아서 추시네요.', correctAnswer: 'sentimiento', options: ['sentimiento', 'fuerza', 'ritmo', 'estilo'] },
  q5_07_3: { id: 'q5_07_3', type: 'multiple_choice', sentenceId: 's5_07_3', question: '"Me gusta cómo caminás"는?', options: ['걷는 게 좋아요', '빨리 걸어요', '걷지 마세요', '같이 걸어요'], correctAnswer: '걷는 게 좋아요' },
  q5_07_4: { id: 'q5_07_4', type: 'word_order', sentenceId: 's5_07_1', question: '문장을 배열하세요.', questionKo: '아브라소 너무 편해요.', words: ['Tu', 'abrazo', 'es', 'muy', 'cómodo.'], correctAnswer: 'Tu abrazo es muy cómodo.' },

  // L5-08: 바닥 문제
  q5_08_1: { id: 'q5_08_1', type: 'multiple_choice', sentenceId: 's5_08_1', question: '"조심"을 스페인어로?', options: ['Cuidado.', 'Perdón.', 'Despacio.', 'Pará.'], correctAnswer: 'Cuidado.' },
  q5_08_2: { id: 'q5_08_2', type: 'fill_blank', sentenceId: 's5_08_2', question: 'Perdón, ¿te _____?', questionKo: '미안, 밟았어요?', correctAnswer: 'pisé', options: ['pisé', 'pegué', 'empujé', 'toqué'] },
  q5_08_3: { id: 'q5_08_3', type: 'multiple_choice', sentenceId: 's5_08_3', question: '"pista"는?', options: ['바닥/플로어', '음악', '탄다', '의자'], correctAnswer: '바닥/플로어' },
  q5_08_4: { id: 'q5_08_4', type: 'word_order', sentenceId: 's5_08_3', question: '문장을 배열하세요.', questionKo: '바닥이 꽉 찼네요.', words: ['La', 'pista', 'está', 'muy', 'llena.'], correctAnswer: 'La pista está muy llena.' },

  // L5-09: 탄다 마무리
  q5_09_1: { id: 'q5_09_1', type: 'multiple_choice', sentenceId: 's5_09_1', question: '"탄다 고마워요"를 스페인어로?', options: ['Gracias por la tanda.', 'Gracias por la noche.', 'Gracias por bailar.', 'Gracias por venir.'], correctAnswer: 'Gracias por la tanda.' },
  q5_09_2: { id: 'q5_09_2', type: 'multiple_choice', sentenceId: 's5_09_2', question: '"Fue muy lindo"는?', options: ['너무 좋았어요', '너무 힘들었어요', '너무 빨랐어요', '너무 길었어요'], correctAnswer: '너무 좋았어요' },
  q5_09_3: { id: 'q5_09_3', type: 'fill_blank', sentenceId: 's5_09_1', question: 'Gracias por la _____.', questionKo: '탄다 고마워요.', correctAnswer: 'tanda', options: ['tanda', 'noche', 'canción', 'milonga'] },
  q5_09_4: { id: 'q5_09_4', type: 'word_order', sentenceId: 's5_09_1', question: '문장을 배열하세요.', questionKo: '탄다 고마워요.', words: ['Gracias', 'por', 'la', 'tanda.'], correctAnswer: 'Gracias por la tanda.' },

  // L5-10: 정중한 거절
  q5_10_1: { id: 'q5_10_1', type: 'multiple_choice', sentenceId: 's5_10_1', question: '"지금 쉬고 있어요"를 스페인어로?', options: ['Ahora estoy descansando.', 'Ahora estoy bailando.', 'Ahora estoy caminando.', 'Ahora estoy comiendo.'], correctAnswer: 'Ahora estoy descansando.' },
  q5_10_2: { id: 'q5_10_2', type: 'multiple_choice', sentenceId: 's5_10_2', question: '"Quizás más tarde"는?', options: ['나중에요', '지금이요', '절대 안 돼요', '모르겠어요'], correctAnswer: '나중에요' },
  q5_10_3: { id: 'q5_10_3', type: 'fill_blank', sentenceId: 's5_10_3', question: 'Gracias _____.', questionKo: '그래도 고마워요.', correctAnswer: 'igual', options: ['igual', 'mucho', 'siempre', 'también'] },
  q5_10_4: { id: 'q5_10_4', type: 'word_order', sentenceId: 's5_10_2', question: '문장을 배열하세요.', questionKo: '나중에요.', words: ['Quizás', 'más', 'tarde.'], correctAnswer: 'Quizás más tarde.' },

  // L5-11: 휴식
  q5_11_1: { id: 'q5_11_1', type: 'multiple_choice', sentenceId: 's5_11_1', question: '"쉴까요?"를 스페인어로?', options: ['¿Descansamos?', '¿Bailamos?', '¿Caminamos?', '¿Seguimos?'], correctAnswer: '¿Descansamos?' },
  q5_11_2: { id: 'q5_11_2', type: 'fill_blank', sentenceId: 's5_11_2', question: 'Voy a _____ algo.', questionKo: '뭐 마시러 갈게요.', correctAnswer: 'tomar', options: ['tomar', 'hacer', 'buscar', 'ver'] },
  q5_11_3: { id: 'q5_11_3', type: 'multiple_choice', sentenceId: 's5_11_3', question: '"¿Querés agua?"는?', options: ['물 줄까요?', '춤 출래요?', '쉴래요?', '갈래요?'], correctAnswer: '물 줄까요?' },
  q5_11_4: { id: 'q5_11_4', type: 'word_order', sentenceId: 's5_11_2', question: '문장을 배열하세요.', questionKo: '뭐 마시러 갈게요.', words: ['Voy', 'a', 'tomar', 'algo.'], correctAnswer: 'Voy a tomar algo.' },

  // L5-12: 한 탄다 더
  q5_12_1: { id: 'q5_12_1', type: 'multiple_choice', sentenceId: 's5_12_1', question: '"한 탄다 더?"를 스페인어로?', options: ['¿Otra tanda?', '¿Otra vez?', '¿Otra canción?', '¿Otra noche?'], correctAnswer: '¿Otra tanda?' },
  q5_12_2: { id: 'q5_12_2', type: 'multiple_choice', sentenceId: 's5_12_3', question: '"Con vos siempre"는?', options: ['당신이라면 언제든지', '당신과 마지막', '당신은 별로', '당신과 처음'], correctAnswer: '당신이라면 언제든지' },
  q5_12_3: { id: 'q5_12_3', type: 'fill_blank', sentenceId: 's5_12_2', question: 'Si querés, _____.', questionKo: '원하면 계속해요.', correctAnswer: 'seguimos', options: ['seguimos', 'paramos', 'descansamos', 'cambiamos'] },
  q5_12_4: { id: 'q5_12_4', type: 'word_order', sentenceId: 's5_12_1', question: '문장을 배열하세요.', questionKo: '한 탄다 더?', words: ['¿Otra', 'tanda?'], correctAnswer: '¿Otra tanda?' },

  // L5-13: 소셜 대화
  q5_13_1: { id: 'q5_13_1', type: 'multiple_choice', sentenceId: 's5_13_1', question: '"춤 춘 지 오래됐어요?"를 스페인어로?', options: ['¿Hace mucho que bailás?', '¿Te gusta bailar?', '¿Sabés bailar?', '¿Querés bailar?'], correctAnswer: '¿Hace mucho que bailás?' },
  q5_13_2: { id: 'q5_13_2', type: 'fill_blank', sentenceId: 's5_13_2', question: '¿De dónde _____?', questionKo: '어디서 오셨어요?', correctAnswer: 'sos', options: ['sos', 'estás', 'venís', 'vivís'] },
  q5_13_3: { id: 'q5_13_3', type: 'multiple_choice', sentenceId: 's5_13_3', question: '"Me gusta esta milonga"는?', options: ['이 밀롱가 좋아요', '이 밀롱가 싫어요', '이 밀롱가 커요', '이 밀롱가 끝났어요'], correctAnswer: '이 밀롱가 좋아요' },
  q5_13_4: { id: 'q5_13_4', type: 'word_order', sentenceId: 's5_13_2', question: '문장을 배열하세요.', questionKo: '어디서 오셨어요?', words: ['¿De', 'dónde', 'sos?'], correctAnswer: '¿De dónde sos?' },

  // L5-14: 플로어 예절
  q5_14_1: { id: 'q5_14_1', type: 'multiple_choice', sentenceId: 's5_14_1', question: '"론다를 지키자"를 스페인어로?', options: ['Cuidemos la ronda.', 'Rompamos la ronda.', 'Ignoremos la ronda.', 'Busquemos la ronda.'], correctAnswer: 'Cuidemos la ronda.' },
  q5_14_2: { id: 'q5_14_2', type: 'multiple_choice', sentenceId: 's5_14_1', question: '"ronda"는?', options: ['반시계 방향 흐름', '음악 세트', '춤 신청', '휴식 시간'], correctAnswer: '반시계 방향 흐름' },
  q5_14_3: { id: 'q5_14_3', type: 'fill_blank', sentenceId: 's5_14_2', question: 'Hay poco _____.', questionKo: '공간이 좁아요.', correctAnswer: 'espacio', options: ['espacio', 'tiempo', 'lugar', 'ritmo'] },
  q5_14_4: { id: 'q5_14_4', type: 'word_order', sentenceId: 's5_14_1', question: '문장을 배열하세요.', questionKo: '론다를 지키자.', words: ['Cuidemos', 'la', 'ronda.'], correctAnswer: 'Cuidemos la ronda.' },

  // L5-15: 작별
  q5_15_1: { id: 'q5_15_1', type: 'multiple_choice', sentenceId: 's5_15_2', question: '"아름다운 밤이었어요"를 스페인어로?', options: ['Fue una noche hermosa.', 'Fue una noche larga.', 'Fue una noche difícil.', 'Fue una noche aburrida.'], correctAnswer: 'Fue una noche hermosa.' },
  q5_15_2: { id: 'q5_15_2', type: 'fill_blank', sentenceId: 's5_15_3', question: 'Nos vemos la _____.', questionKo: '다음에 봐요.', correctAnswer: 'próxima', options: ['próxima', 'última', 'primera', 'misma'] },
  q5_15_3: { id: 'q5_15_3', type: 'multiple_choice', sentenceId: 's5_15_1', question: '"Me voy yendo"는?', options: ['저 이제 갈게요', '저 이제 올게요', '저 이제 출래요', '저 이제 쉴게요'], correctAnswer: '저 이제 갈게요' },
  q5_15_4: { id: 'q5_15_4', type: 'word_order', sentenceId: 's5_15_2', question: '문장을 배열하세요.', questionKo: '아름다운 밤이었어요.', words: ['Fue', 'una', 'noche', 'hermosa.'], correctAnswer: 'Fue una noche hermosa.' },

  // L5-16: 밀롱가 역할극
  q5_16_1: { id: 'q5_16_1', type: 'multiple_choice', sentenceId: 's5_16_1', question: '"출래요?"를 스페인어로?', options: ['¿Bailamos?', '¿Caminamos?', '¿Descansamos?', '¿Seguimos?'], correctAnswer: '¿Bailamos?' },
  q5_16_2: { id: 'q5_16_2', type: 'fill_blank', sentenceId: 's5_16_2', question: 'Gracias, _____ mucho.', questionKo: '고마워요, 정말 즐거웠어요.', correctAnswer: 'disfruté', options: ['disfruté', 'bailé', 'caminé', 'descansé'] },
  q5_16_3: { id: 'q5_16_3', type: 'multiple_choice', sentenceId: 's5_16_3', question: '"Nos vemos luego"는?', options: ['나중에 봐요', '지금 봐요', '안 봐요', '또 봐요'], correctAnswer: '나중에 봐요' },
  q5_16_4: { id: 'q5_16_4', type: 'word_order', sentenceId: 's5_16_3', question: '문장을 배열하세요.', questionKo: '나중에 봐요.', words: ['Nos', 'vemos', 'luego.'], correctAnswer: 'Nos vemos luego.' },
};

// 기본 퀴즈 + 확장 퀴즈 병합
export const quizzes: Record<string, Quiz> = {
  ...baseQuizzes,
  ...quizzesL1Extra,
  ...quizzesL2Extra,
  ...quizzesL3Extra,
  ...quizzesL4Extra,
  ...quizzesL5Extra,
};
