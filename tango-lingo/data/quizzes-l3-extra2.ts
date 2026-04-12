import { Quiz } from '../types';

export const quizzesL3Extra2: Record<string, Quiz> = {
  // L3 확장2 퀴즈 — 레슨당 2개 (meaning_match + reverse_translate)

  // L3-01: 앞오초
  q3_01_9: { id: 'q3_01_9', type: 'meaning_match', sentenceId: 's3_01_12', question: 'El pivote es suave.', options: ['피벗은 부드럽게', '피벗은 빠르게', '피벗은 강하게', '피벗은 크게'], correctAnswer: '피벗은 부드럽게' },
  q3_01_10: { id: 'q3_01_10', type: 'reverse_translate', sentenceId: 's3_01_14', question: '발바닥을 써.', correctAnswer: 'Usá la planta del pie.' },

  // L3-02: 뒤오초
  q3_02_9: { id: 'q3_02_9', type: 'meaning_match', sentenceId: 's3_02_13', question: 'El torso se queda.', options: ['몸통은 그 자리에', '몸통이 먼저 가', '몸통을 돌려', '몸통을 숙여'], correctAnswer: '몸통은 그 자리에' },
  q3_02_10: { id: 'q3_02_10', type: 'reverse_translate', sentenceId: 's3_02_11', question: '골반을 컨트롤해.', correctAnswer: 'Controlá la cadera.' },

  // L3-03: 크루세
  q3_03_9: { id: 'q3_03_9', type: 'meaning_match', sentenceId: 's3_03_14', question: 'El cruce llega, no se busca.', options: ['크루세는 오는 거야, 찾는 게 아니야', '크루세는 빠르게 찾아', '크루세는 힘으로 만들어', '크루세는 서둘러야 해'], correctAnswer: '크루세는 오는 거야, 찾는 게 아니야' },
  q3_03_10: { id: 'q3_03_10', type: 'reverse_translate', sentenceId: 's3_03_11', question: '크루세에 차분하게 도착해.', correctAnswer: 'Llegá al cruce con calma.' },

  // L3-04: 회전 시작
  q3_04_9: { id: 'q3_04_9', type: 'meaning_match', sentenceId: 's3_04_13', question: 'Girá desde el centro.', options: ['중심에서 돌려', '어깨에서 돌려', '팔로 돌려', '발로 돌려'], correctAnswer: '중심에서 돌려' },
  q3_04_10: { id: 'q3_04_10', type: 'reverse_translate', sentenceId: 's3_04_11', question: '히로는 천천히 시작해.', correctAnswer: 'El giro empieza despacio.' },

  // L3-05: 회전 안에서
  q3_05_9: { id: 'q3_05_9', type: 'meaning_match', sentenceId: 's3_05_14', question: 'Completá cada paso.', options: ['각 스텝을 완성해', '각 스텝을 건너뛰어', '각 스텝을 빠르게', '각 스텝을 멈춰'], correctAnswer: '각 스텝을 완성해' },
  q3_05_10: { id: 'q3_05_10', type: 'reverse_translate', sentenceId: 's3_05_11', question: '앞, 옆, 뒤.', correctAnswer: 'Adelante, costado, atrás.' },

  // L3-06: 기본이 먼저
  q3_06_9: { id: 'q3_06_9', type: 'meaning_match', sentenceId: 's3_06_11', question: 'Sin base, no hay técnica.', options: ['기본 없이 기술 없다', '기본은 쉽다', '기술이 더 중요하다', '기본만 하면 된다'], correctAnswer: '기본 없이 기술 없다' },
  q3_06_10: { id: 'q3_06_10', type: 'reverse_translate', sentenceId: 's3_06_12', question: '단순한 걸 반복해.', correctAnswer: 'Repetí lo simple.' },

  // L3-07: 아도르노
  q3_07_9: { id: 'q3_07_9', type: 'meaning_match', sentenceId: 's3_07_15', question: 'El adorno no interrumpe.', options: ['아도르노는 방해하지 않아', '아도르노는 항상 필요해', '아도르노는 크게', '아도르노는 빠르게'], correctAnswer: '아도르노는 방해하지 않아' },
  q3_07_10: { id: 'q3_07_10', type: 'reverse_translate', sentenceId: 's3_07_13', question: '자연스럽게 나오게 해.', correctAnswer: 'Que salga natural.' },

  // L3-08: 사카다
  q3_08_9: { id: 'q3_08_9', type: 'meaning_match', sentenceId: 's3_08_13', question: 'La sacada es una invitación.', options: ['사카다는 초대야', '사카다는 공격이야', '사카다는 멈춤이야', '사카다는 회전이야'], correctAnswer: '사카다는 초대야' },
  q3_08_10: { id: 'q3_08_10', type: 'reverse_translate', sentenceId: 's3_08_11', question: '빈 공간에 들어가.', correctAnswer: 'Entrá al espacio vacío.' },

  // L3-09: 파라다
  q3_09_9: { id: 'q3_09_9', type: 'meaning_match', sentenceId: 's3_09_12', question: 'La parada es un momento.', options: ['파라다는 하나의 순간이야', '파라다는 긴 시간이야', '파라다는 빠른 동작이야', '파라다는 회전이야'], correctAnswer: '파라다는 하나의 순간이야' },
  q3_09_10: { id: 'q3_09_10', type: 'reverse_translate', sentenceId: 's3_09_15', question: '파라다를 즐겨.', correctAnswer: 'Disfrutá la parada.' },

  // L3-10: 볼레오
  q3_10_9: { id: 'q3_10_9', type: 'meaning_match', sentenceId: 's3_10_11', question: 'El boleo sale solo.', options: ['볼레오는 저절로 나와', '볼레오는 힘으로 해', '볼레오는 다리를 올려', '볼레오는 빠르게 해'], correctAnswer: '볼레오는 저절로 나와' },
  q3_10_10: { id: 'q3_10_10', type: 'reverse_translate', sentenceId: 's3_10_14', question: '돌아오는 걸 컨트롤해.', correctAnswer: 'Controlá la vuelta.' },

  // L3-11: 강도 조절
  q3_11_9: { id: 'q3_11_9', type: 'meaning_match', sentenceId: 's3_11_14', question: 'La suavidad es poder.', options: ['부드러움이 힘이야', '힘이 전부야', '부드러움은 약해', '강함이 필요해'], correctAnswer: '부드러움이 힘이야' },
  q3_11_10: { id: 'q3_11_10', type: 'reverse_translate', sentenceId: 's3_11_13', question: '팔을 풀어.', correctAnswer: 'Aflojá los brazos.' },

  // L3-12: 실수 후 복구
  q3_12_9: { id: 'q3_12_9', type: 'meaning_match', sentenceId: 's3_12_12', question: 'El error es parte del proceso.', options: ['실수도 과정의 일부야', '실수는 끝이야', '실수는 안 돼', '실수하면 멈춰'], correctAnswer: '실수도 과정의 일부야' },
  q3_12_10: { id: 'q3_12_10', type: 'reverse_translate', sentenceId: 's3_12_11', question: '괜찮아, 계속하자.', correctAnswer: 'No pasa nada, seguimos.' },

  // L3-13: 수업 중 질문
  q3_13_9: { id: 'q3_13_9', type: 'meaning_match', sentenceId: 's3_13_11', question: '¿Me mostrás otra vez?', options: ['한 번 더 보여줄래요?', '이제 그만할래요?', '다음에 할래요?', '혼자 해볼래요?'], correctAnswer: '한 번 더 보여줄래요?' },
  q3_13_10: { id: 'q3_13_10', type: 'reverse_translate', sentenceId: 's3_13_15', question: '더 천천히 할 수 있어요?', correctAnswer: '¿Podemos ir más despacio?' },

  // L3-14: 회전 역할극
  q3_14_9: { id: 'q3_14_9', type: 'meaning_match', sentenceId: 's3_14_13', question: 'Estuvo mucho mejor.', options: ['훨씬 나았어', '아직 멀었어', '처음과 같아', '더 나빠졌어'], correctAnswer: '훨씬 나았어' },
  q3_14_10: { id: 'q3_14_10', type: 'reverse_translate', sentenceId: 's3_14_15', question: '오늘 많이 배웠어.', correctAnswer: 'Hoy aprendimos mucho.' },
};
