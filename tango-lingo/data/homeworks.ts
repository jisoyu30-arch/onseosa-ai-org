import type { Homework } from '../types';

export const homeworks: Record<string, Homework> = {
  // =====================================================
  // LEVEL 1 — 3개 묶음 (유닛당 1세트)
  // =====================================================

  // ----- Unit 1 (les1_01~03): 수업 첫걸음 -----
  hw1_a1: {
    id: 'hw1_a1',
    type: 'speaking',
    instruction: '"Relajá la cara / Bajá los hombros / Mírame a los ojos" 각각 5번 소리 내어 말하기.',
    targetSentences: ['s1_02_1', 's1_03_1', 's1_02_2'],
    xpReward: 10,
    lessonGroup: 'les1_01~03',
  },
  hw1_a2: {
    id: 'hw1_a2',
    type: 'reflection',
    instruction: '"Mirada"를 파트너에게 한국어로 30초 설명해보세요. 사전적 뜻, 탱고에서의 뜻, 왜 중요한지를 포함하면 완벽!',
    xpReward: 10,
    lessonGroup: 'les1_01~03',
  },

  // ----- Unit 2 (les1_04~06): 몸과 호흡 -----
  hw1_b1: {
    id: 'hw1_b1',
    type: 'couple',
    instruction: '파트너에게 "Más suave" 말하면서 서로의 팔 힘을 조절해보세요. 한 사람씩 번갈아 피드백을 줘보세요.',
    xpReward: 15,
    lessonGroup: 'les1_04~06',
  },
  hw1_b2: {
    id: 'hw1_b2',
    type: 'recording',
    instruction: '"Encontrá tu eje" 발음을 녹음해보세요. 들어보고 만족스러우면 다음으로!',
    targetSentences: ['s1_06_1'],
    xpReward: 10,
    lessonGroup: 'les1_04~06',
  },

  // ----- Unit 3 (les1_07~10): 연결 -----
  hw1_c1: {
    id: 'hw1_c1',
    type: 'real_world',
    instruction: '다음 수업에서 선생님이 "eje", "abrazo", 또는 "conexión"이라고 말하는 순간을 캐치해보세요. 하나라도 알아들으면 성공!',
    xpReward: 20,
    lessonGroup: 'les1_07~10',
  },
  hw1_c2: {
    id: 'hw1_c2',
    type: 'couple',
    instruction: '오픈 아브라소 → 클로즈 아브라소로 바꿔보면서 "Sentí la conexión"이라고 말해보세요. 느낌이 어떻게 달라지나요?',
    xpReward: 15,
    lessonGroup: 'les1_07~10',
  },

  // =====================================================
  // LEVEL 2 — 6 homeworks (3 units × 2)
  // =====================================================

  hw2_a1: {
    id: 'hw2_a1', type: 'speaking',
    instruction: '"Caminá derecho / Pará / Un paso al costado" 각각 5번 소리 내어 말하기.',
    targetSentences: ['s2_01_1', 's2_04_1', 's2_02_1'],
    xpReward: 10, lessonGroup: 'les2_01~04',
  },
  hw2_a2: {
    id: 'hw2_a2', type: 'couple',
    instruction: '파트너와 3걸음 전진 → "Pará" → 3걸음 후진. 지시는 스페인어로!',
    xpReward: 15, lessonGroup: 'les2_01~04',
  },
  hw2_b1: {
    id: 'hw2_b1', type: 'reflection',
    instruction: '"리드는 명령이 아니라 초대"를 파트너에게 한국어로 설명해보세요. 왜 탱고에서 그런지도 포함.',
    xpReward: 10, lessonGroup: 'les2_05~08',
  },
  hw2_b2: {
    id: 'hw2_b2', type: 'recording',
    instruction: '"Marcá con el pecho, no empujes con los brazos" 발음 녹음. 한 번에 안 되면 나눠서!',
    targetSentences: ['s2_06_1', 's2_06_3'],
    xpReward: 10, lessonGroup: 'les2_05~08',
  },
  hw2_c1: {
    id: 'hw2_c1', type: 'real_world',
    instruction: '수업에서 "marca", "salida", 또는 "compás"가 들리면 알아듣기. 하나만 캐치해도 성공!',
    xpReward: 20, lessonGroup: 'les2_09~12',
  },
  hw2_c2: {
    id: 'hw2_c2', type: 'couple',
    instruction: '음악 틀고 함께 걷기 1분. "Más despacio" / "Escuchá la música" 사용해보기.',
    xpReward: 15, lessonGroup: 'les2_09~12',
  },

  // =====================================================
  // LEVEL 3 — 6 homeworks
  // =====================================================

  hw3_a1: { id: 'hw3_a1', type: 'speaking', instruction: '"Hacé un ocho / Cruzá / Pivotá" 각 5번 소리 내어 말하기.', targetSentences: ['s3_01_1', 's3_03_1', 's3_01_2'], xpReward: 10, lessonGroup: 'les3_01~03' },
  hw3_a2: { id: 'hw3_a2', type: 'reflection', instruction: '"Ocho"가 왜 8이라고 불리는지 파트너에게 설명해보세요. 발이 아니라 뭐가 8을 만드는지도!', xpReward: 10, lessonGroup: 'les3_01~03' },
  hw3_b1: { id: 'hw3_b1', type: 'couple', instruction: '파트너에게 "Primero la base, después el adorno" 말하면서 기본 걷기 → 아도르노 순서 연습.', xpReward: 15, lessonGroup: 'les3_04~07' },
  hw3_b2: { id: 'hw3_b2', type: 'recording', instruction: '"¿Puedo intentar de nuevo?" 발음 녹음. 자연스럽게 들릴 때까지!', targetSentences: ['s3_13_1'], xpReward: 10, lessonGroup: 'les3_04~07' },
  hw3_c1: { id: 'hw3_c1', type: 'real_world', instruction: '수업에서 "giro", "ocho", "sacada" 중 하나를 선생님이 말할 때 알아듣기.', xpReward: 20, lessonGroup: 'les3_08~14' },
  hw3_c2: { id: 'hw3_c2', type: 'couple', instruction: '실수 후 "No pasa nada, volvamos desde acá" 말해보기. 분위기가 달라지는지 느껴보세요.', xpReward: 15, lessonGroup: 'les3_08~14' },

  // =====================================================
  // LEVEL 4 — 6 homeworks
  // =====================================================

  hw4_a1: { id: 'hw4_a1', type: 'speaking', instruction: '"Otra vez / Ahora está mejor / Más despacio" 각 5번 소리 내어 말하기.', targetSentences: ['s4_01_1', 's4_02_1', 's4_04_1'], xpReward: 10, lessonGroup: 'les4_01~04' },
  hw4_a2: { id: 'hw4_a2', type: 'couple', instruction: '파트너에게 스페인어 피드백 3문장 주기. 하나는 긍정, 하나는 교정, 하나는 격려.', xpReward: 15, lessonGroup: 'les4_01~04' },
  hw4_b1: { id: 'hw4_b1', type: 'reflection', instruction: '"연습에서 느낀 점"을 스페인어 한 문장 + 한국어 한 문장으로 적어보세요.', xpReward: 10, lessonGroup: 'les4_05~08' },
  hw4_b2: { id: 'hw4_b2', type: 'recording', instruction: '"Perdimos la conexión, quedate conmigo" 발음 녹음. 감정을 담아서!', targetSentences: ['s4_06_1', 's4_06_2'], xpReward: 10, lessonGroup: 'les4_05~08' },
  hw4_c1: { id: 'hw4_c1', type: 'real_world', instruction: '다음 수업 후 파트너에게 "Estuvo muy bien" 또는 "Cada vez mejor" 실제로 말하기.', xpReward: 20, lessonGroup: 'les4_09~12' },
  hw4_c2: { id: 'hw4_c2', type: 'couple', instruction: '2분간 스페인어로만 수업 피드백 대화 해보기. 막히면 한국어 써도 OK, 다시 스페인어로!', xpReward: 15, lessonGroup: 'les4_09~12' },

  // =====================================================
  // LEVEL 5 — 6 homeworks
  // =====================================================

  hw5_a1: { id: 'hw5_a1', type: 'speaking', instruction: '"¿Querés bailar esta tanda?" / "Gracias por la tanda" / "Buenas noches" 각 10번 말하기.', targetSentences: ['s5_04_1', 's5_09_1', 's5_01_1'], xpReward: 10, lessonGroup: 'les5_01~04' },
  hw5_a2: { id: 'hw5_a2', type: 'couple', instruction: '파트너와 카베세오 연습: 3미터 떨어져서 눈맞춤 → 고개 끄덕임 → "¿Bailamos?"', xpReward: 15, lessonGroup: 'les5_01~04' },
  hw5_b1: { id: 'hw5_b1', type: 'reflection', instruction: '"탄다"와 "코르티나"의 차이를 파트너에게 한국어로 설명해보세요. 왜 중요한지도!', xpReward: 10, lessonGroup: 'les5_05~08' },
  hw5_b2: { id: 'hw5_b2', type: 'recording', instruction: '"Tu abrazo es muy cómodo" 발음 녹음. 진심이 느껴지게!', targetSentences: ['s5_07_1'], xpReward: 10, lessonGroup: 'les5_05~08' },
  hw5_c1: { id: 'hw5_c1', type: 'real_world', instruction: '밀롱가에서 "Buenas noches"와 "Gracias por la tanda" 실제로 사용하기. 하나만 성공해도 OK!', xpReward: 20, lessonGroup: 'les5_09~16' },
  hw5_c2: { id: 'hw5_c2', type: 'couple', instruction: '밀롱가 풀 시뮬레이션 5분: 도착→카베세오→탄다→코르티나→칭찬→작별 역할극.', xpReward: 15, lessonGroup: 'les5_09~16' },
};

export function getHomeworkById(id: string): Homework | undefined {
  return homeworks[id];
}

export function getHomeworksForGroup(group: string): Homework[] {
  return Object.values(homeworks).filter((hw) => hw.lessonGroup === group);
}
