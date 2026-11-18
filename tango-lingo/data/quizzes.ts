import { Quiz } from '../types';

export const quizzes: Record<string, Quiz> = {
  // ===== Lesson 1 퀴즈: 얼굴과 시선 =====
  q1: {
    id: 'q1',
    type: 'multiple_choice',
    sentenceId: 's1',
    question: '"얼굴 힘 빼"를 스페인어로?',
    options: ['Relajá la cara.', 'Bajá la cara.', 'Mové la cara.', 'Sentí la cara.'],
    correctAnswer: 'Relajá la cara.',
  },
  q2: {
    id: 'q2',
    type: 'fill_blank',
    sentenceId: 's2',
    question: '_____ a los ojos.',
    questionKo: '눈을 봐.',
    correctAnswer: 'Mírame',
    options: ['Mírame', 'Mové', 'Relajá', 'Bajá'],
  },
  q3: {
    id: 'q3',
    type: 'word_order',
    sentenceId: 's3',
    question: '문장을 올바른 순서로 배열하세요.',
    questionKo: '탱고에서 시선은 중요하다.',
    words: ['La', 'mirada', 'es', 'importante', 'en', 'el', 'tango.'],
    correctAnswer: 'La mirada es importante en el tango.',
  },
  q4: {
    id: 'q4',
    type: 'multiple_choice',
    sentenceId: 's3',
    question: '"La mirada"는 무슨 뜻인가요?',
    options: ['시선', '손', '발', '어깨'],
    correctAnswer: '시선',
  },

  // ===== Lesson 2 퀴즈: 상체와 자세 =====
  q5: {
    id: 'q5',
    type: 'multiple_choice',
    sentenceId: 's4',
    question: '"어깨 내려"를 스페인어로?',
    options: ['Bajá los hombros.', 'Relajá los hombros.', 'Abrí los hombros.', 'Mové los hombros.'],
    correctAnswer: 'Bajá los hombros.',
  },
  q6: {
    id: 'q6',
    type: 'fill_blank',
    sentenceId: 's5',
    question: 'Relajá el _____.',
    questionKo: '목 힘 빼.',
    correctAnswer: 'cuello',
    options: ['cuello', 'pecho', 'hombro', 'brazo'],
  },
  q7: {
    id: 'q7',
    type: 'word_order',
    sentenceId: 's6',
    question: '문장을 올바른 순서로 배열하세요.',
    questionKo: '가슴 열어.',
    words: ['Abrí', 'el', 'pecho.'],
    correctAnswer: 'Abrí el pecho.',
  },
  q8: {
    id: 'q8',
    type: 'multiple_choice',
    sentenceId: 's6',
    question: '"pecho"는 무슨 뜻인가요?',
    options: ['가슴', '팔', '다리', '머리'],
    correctAnswer: '가슴',
  },
};
