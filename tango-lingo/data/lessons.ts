import { Level, Unit, Lesson } from '../types';

// =====================================================
// LEVELS
// =====================================================

export const levels: Level[] = [
  {
    id: 'lv1',
    title: 'El primer abrazo',
    titleKo: '첫 아브라소',
    description: '탱고 수업에서 가장 자주 듣는 기본 지시를 알아듣고, 몸의 긴장을 풀고, 파트너와 처음 연결하는 감각을 만든다.',
    unitIds: ['u1_1', 'u1_2', 'u1_3'],
    order: 1,
  },
  {
    id: 'lv2',
    title: 'Caminar juntos',
    titleKo: '함께 걷기',
    description: '탱고의 핵심인 걷기를 익힌다. 전진/후진/옆 이동, 멈춤, 리드/팔로우, 살리다, 음악 연결까지.',
    unitIds: ['u2_1', 'u2_2', 'u2_3'],
    order: 2,
  },
  {
    id: 'lv3',
    title: 'Girar y construir',
    titleKo: '회전과 구조',
    description: '오초, 히로, 크루세 등 구조적 동작을 배우고, 수업에서 기술 피드백을 이해하고, 질문할 수 있게 된다.',
    unitIds: ['u3_1', 'u3_2', 'u3_3', 'u3_4'],
    order: 3,
  },
  {
    id: 'lv4',
    title: 'Hablar en la práctica',
    titleKo: '연습에서 말하기',
    description: '파트너와 짧은 피드백을 주고받고, 느낌을 표현하고, 실수 후 자연스럽게 이어간다.',
    unitIds: ['u4_1', 'u4_2', 'u4_3'],
    order: 4,
  },
  {
    id: 'lv5',
    title: 'Sobrevivir en la milonga',
    titleKo: '밀롱가 서바이벌',
    description: '밀롱가에서 입장부터 작별까지. 카베세오, 탄다, 칭찬, 거절, 소셜 대화를 실전으로 할 수 있다.',
    unitIds: ['u5_1', 'u5_2', 'u5_3', 'u5_4'],
    order: 5,
  },
];

// =====================================================
// UNITS — Level 1을 3개 유닛(블록)으로 구분
// =====================================================

export const units: Unit[] = [
  {
    id: 'u1_1',
    levelId: 'lv1',
    title: 'Primeros pasos en clase',
    titleKo: '수업 첫걸음',
    lessonIds: ['les1_01', 'les1_02', 'les1_03'],
    order: 1,
  },
  {
    id: 'u1_2',
    levelId: 'lv1',
    title: 'Cuerpo y respiración',
    titleKo: '몸과 호흡',
    lessonIds: ['les1_04', 'les1_05', 'les1_06'],
    order: 2,
  },
  {
    id: 'u1_3',
    levelId: 'lv1',
    title: 'Conexión',
    titleKo: '연결',
    lessonIds: ['les1_07', 'les1_08', 'les1_09', 'les1_10'],
    order: 3,
  },
  // --- Level 2 units ---
  {
    id: 'u2_1',
    levelId: 'lv2',
    title: 'Primeros pasos',
    titleKo: '첫 걸음',
    lessonIds: ['les2_01', 'les2_02', 'les2_03', 'les2_04'],
    order: 1,
  },
  {
    id: 'u2_2',
    levelId: 'lv2',
    title: 'Liderar y seguir',
    titleKo: '리드와 팔로우',
    lessonIds: ['les2_05', 'les2_06', 'les2_07', 'les2_08'],
    order: 2,
  },
  {
    id: 'u2_3',
    levelId: 'lv2',
    title: 'Caminar con la música',
    titleKo: '음악과 함께 걷기',
    lessonIds: ['les2_09', 'les2_10', 'les2_11', 'les2_12'],
    order: 3,
  },
  // --- Level 3 units ---
  { id: 'u3_1', levelId: 'lv3', title: 'Ocho y cruce', titleKo: '오초와 크루세', lessonIds: ['les3_01', 'les3_02', 'les3_03'], order: 1 },
  { id: 'u3_2', levelId: 'lv3', title: 'El giro', titleKo: '히로', lessonIds: ['les3_04', 'les3_05', 'les3_06', 'les3_07'], order: 2 },
  { id: 'u3_3', levelId: 'lv3', title: 'Figuras', titleKo: '피겨', lessonIds: ['les3_08', 'les3_09', 'les3_10'], order: 3 },
  { id: 'u3_4', levelId: 'lv3', title: 'Feedback y práctica', titleKo: '피드백과 연습', lessonIds: ['les3_11', 'les3_12', 'les3_13', 'les3_14'], order: 4 },
  // --- Level 4 units ---
  { id: 'u4_1', levelId: 'lv4', title: 'Repetir y mejorar', titleKo: '반복과 개선', lessonIds: ['les4_01', 'les4_02', 'les4_03', 'les4_04'], order: 1 },
  { id: 'u4_2', levelId: 'lv4', title: 'Sentir y expresar', titleKo: '느끼기와 표현', lessonIds: ['les4_05', 'les4_06', 'les4_07', 'les4_08'], order: 2 },
  { id: 'u4_3', levelId: 'lv4', title: 'Conversar en la práctica', titleKo: '연습 대화', lessonIds: ['les4_09', 'les4_10', 'les4_11', 'les4_12'], order: 3 },
  // --- Level 5 units ---
  { id: 'u5_1', levelId: 'lv5', title: 'Llegar y conocer', titleKo: '도착과 만남', lessonIds: ['les5_01', 'les5_02', 'les5_03', 'les5_04'], order: 1 },
  { id: 'u5_2', levelId: 'lv5', title: 'Dentro de la tanda', titleKo: '탄다 안에서', lessonIds: ['les5_05', 'les5_06', 'les5_07', 'les5_08'], order: 2 },
  { id: 'u5_3', levelId: 'lv5', title: 'Entre tandas', titleKo: '탄다 사이', lessonIds: ['les5_09', 'les5_10', 'les5_11', 'les5_12'], order: 3 },
  { id: 'u5_4', levelId: 'lv5', title: 'Social y despedida', titleKo: '소셜과 작별', lessonIds: ['les5_13', 'les5_14', 'les5_15', 'les5_16'], order: 4 },
];

// =====================================================
// LESSONS — Level 1: 10 lessons
// =====================================================

export const lessons: Lesson[] = [
  // ----- Unit 1: 수업 첫걸음 -----
  {
    id: 'les1_01',
    unitId: 'u1_1',
    title: 'Hola, ¿todo bien?',
    titleKo: '첫 인사',
    situation: '수업장에 도착해서 인사할 때',
    sentenceIds: ['s1_01_1', 's1_01_2', 's1_01_3', 's1_01_4', 's1_01_5', 's1_01_6', 's1_01_7', 's1_01_8', 's1_01_9', 's1_01_10'],
    quizIds: ['q1_01_1', 'q1_01_2', 'q1_01_3', 'q1_01_4'],
    homeworkIds: ['hw1_a1'],
    order: 1,
  },
  {
    id: 'les1_02',
    unitId: 'u1_1',
    title: 'Relajá la cara',
    titleKo: '얼굴과 시선',
    situation: '수업 시작 — 선생님이 자세를 잡아줄 때',
    sentenceIds: ['s1_02_1', 's1_02_2', 's1_02_3', 's1_02_4', 's1_02_5', 's1_02_6', 's1_02_7', 's1_02_8', 's1_02_9', 's1_02_10'],
    quizIds: ['q1_02_1', 'q1_02_2', 'q1_02_3', 'q1_02_4'],
    termIds: ['t_mirada'],
    bonusId: 'b01',
    order: 2,
  },
  {
    id: 'les1_03',
    unitId: 'u1_1',
    title: 'Bajá los hombros',
    titleKo: '어깨와 목',
    situation: '상체 교정 — 초보가 가장 많이 듣는 말',
    sentenceIds: ['s1_03_1', 's1_03_2', 's1_03_3', 's1_03_4', 's1_03_5', 's1_03_6', 's1_03_7', 's1_03_8', 's1_03_9', 's1_03_10'],
    quizIds: ['q1_03_1', 'q1_03_2', 'q1_03_3', 'q1_03_4'],
    termIds: ['t_postura'],
    missionId: 'm01',
    homeworkIds: ['hw1_a1', 'hw1_a2'],
    order: 3,
  },

  // ----- Unit 2: 몸과 호흡 -----
  {
    id: 'les1_04',
    unitId: 'u1_2',
    title: 'Sentí la mano',
    titleKo: '팔과 손의 연결',
    situation: '팔 힘 교정 — 붙잡는 게 아니라 느끼는 것',
    sentenceIds: ['s1_04_1', 's1_04_2', 's1_04_3', 's1_04_4', 's1_04_5', 's1_04_6', 's1_04_7', 's1_04_8', 's1_04_9', 's1_04_10'],
    quizIds: ['q1_04_1', 'q1_04_2', 'q1_04_3', 'q1_04_4'],
    termIds: ['t_tension'],
    order: 4,
  },
  {
    id: 'les1_05',
    unitId: 'u1_2',
    title: 'Respirá',
    titleKo: '힘 빼기와 호흡',
    situation: '전신 이완 — 불안을 낮춰주는 순간',
    sentenceIds: ['s1_05_1', 's1_05_2', 's1_05_3', 's1_05_4', 's1_05_5', 's1_05_6', 's1_05_7', 's1_05_8', 's1_05_9', 's1_05_10'],
    quizIds: ['q1_05_1', 'q1_05_2', 'q1_05_3', 'q1_05_4'],
    bonusId: 'b02',
    homeworkIds: ['hw1_b1'],
    order: 5,
  },
  {
    id: 'les1_06',
    unitId: 'u1_2',
    title: 'Encontrá tu eje',
    titleKo: '중심과 축',
    situation: '축 잡기 연습 — 탱고의 기둥 세우기',
    sentenceIds: ['s1_06_1', 's1_06_2', 's1_06_3', 's1_06_4', 's1_06_5', 's1_06_6', 's1_06_7', 's1_06_8', 's1_06_9', 's1_06_10'],
    quizIds: ['q1_06_1', 'q1_06_2', 'q1_06_3', 'q1_06_4'],
    termIds: ['t_eje'],
    missionId: 'm02',
    homeworkIds: ['hw1_b1', 'hw1_b2'],
    order: 6,
  },

  // ----- Unit 3: 연결 -----
  {
    id: 'les1_07',
    unitId: 'u1_3',
    title: 'Cambiá el peso',
    titleKo: '체중 이동',
    situation: '무게 이동 기초 — 걷기 전 필수 준비',
    sentenceIds: ['s1_07_1', 's1_07_2', 's1_07_3', 's1_07_4', 's1_07_5', 's1_07_6', 's1_07_7', 's1_07_8', 's1_07_9', 's1_07_10'],
    quizIds: ['q1_07_1', 'q1_07_2', 'q1_07_3', 'q1_07_4'],
    order: 7,
  },
  {
    id: 'les1_08',
    unitId: 'u1_3',
    title: 'El abrazo',
    titleKo: '아브라소',
    situation: '첫 포즈 잡기 — 탱고의 시작',
    sentenceIds: ['s1_08_1', 's1_08_2', 's1_08_3', 's1_08_4', 's1_08_5', 's1_08_6', 's1_08_7', 's1_08_8', 's1_08_9', 's1_08_10'],
    quizIds: ['q1_08_1', 'q1_08_2', 'q1_08_3', 'q1_08_4'],
    termIds: ['t_abrazo'],
    bonusId: 'b03',
    order: 8,
  },
  {
    id: 'les1_09',
    unitId: 'u1_3',
    title: 'Sentí la conexión',
    titleKo: '연결 느끼기',
    situation: '파트너와 처음으로 연결을 느끼는 순간',
    sentenceIds: ['s1_09_1', 's1_09_2', 's1_09_3', 's1_09_4', 's1_09_5', 's1_09_6', 's1_09_7', 's1_09_8', 's1_09_9', 's1_09_10'],
    quizIds: ['q1_09_1', 'q1_09_2', 'q1_09_3', 'q1_09_4'],
    termIds: ['t_conexion'],
    missionId: 'm03',
    homeworkIds: ['hw1_c1', 'hw1_c2'],
    order: 9,
  },
  {
    id: 'les1_10',
    unitId: 'u1_3',
    title: 'Mi primera clase',
    titleKo: '첫 수업 역할극',
    situation: '레슨 1~9 종합 — 수업 시뮬레이션',
    sentenceIds: ['s1_10_1', 's1_10_2', 's1_10_3', 's1_10_4', 's1_10_5', 's1_10_6', 's1_10_7', 's1_10_8', 's1_10_9', 's1_10_10'],
    quizIds: ['q1_10_1', 'q1_10_2', 'q1_10_3', 'q1_10_4'],
    roleplayId: 'rp1_10',
    bonusId: 'b04',
    order: 10,
  },

  // =====================================================
  // LEVEL 2: Caminar juntos — 12 lessons
  // =====================================================

  // --- Unit 2-1: 첫 걸음 ---
  {
    id: 'les2_01', unitId: 'u2_1', title: 'Caminá derecho', titleKo: '앞으로 걷기',
    situation: '첫 걸음 — 탱고의 기본은 화려한 기술이 아니라 걷기',
    sentenceIds: ['s2_01_1', 's2_01_2', 's2_01_3', 's2_01_4', 's2_01_5', 's2_01_6', 's2_01_7', 's2_01_8', 's2_01_9', 's2_01_10'],
    quizIds: ['q2_01_1', 'q2_01_2', 'q2_01_3', 'q2_01_4'],
    termIds: ['t_caminata'],
    homeworkIds: ['hw2_a1'],
    order: 1,
  },
  {
    id: 'les2_02', unitId: 'u2_1', title: 'Al costado', titleKo: '옆으로 이동',
    situation: '공간 만들기 — 옆으로 벌려서 자리를 만드는 감각',
    sentenceIds: ['s2_02_1', 's2_02_2', 's2_02_3', 's2_02_4', 's2_02_5', 's2_02_6', 's2_02_7', 's2_02_8', 's2_02_9', 's2_02_10'],
    quizIds: ['q2_02_1', 'q2_02_2', 'q2_02_3', 'q2_02_4'],
    order: 2,
  },
  {
    id: 'les2_03', unitId: 'u2_1', title: 'Para atrás', titleKo: '뒤로 이동',
    situation: '후진 기초 — 짧고 안정적으로',
    sentenceIds: ['s2_03_1', 's2_03_2', 's2_03_3', 's2_03_4', 's2_03_5', 's2_03_6', 's2_03_7', 's2_03_8', 's2_03_9', 's2_03_10'],
    quizIds: ['q2_03_1', 'q2_03_2', 'q2_03_3', 'q2_03_4'],
    bonusId: 'b05',
    order: 3,
  },
  {
    id: 'les2_04', unitId: 'u2_1', title: 'Pará', titleKo: '멈추기',
    situation: '멈춤의 감각 — 흐름의 일부',
    sentenceIds: ['s2_04_1', 's2_04_2', 's2_04_3', 's2_04_4', 's2_04_5', 's2_04_6', 's2_04_7', 's2_04_8', 's2_04_9', 's2_04_10'],
    quizIds: ['q2_04_1', 'q2_04_2', 'q2_04_3', 'q2_04_4'],
    termIds: ['t_pausa'],
    missionId: 'm04',
    homeworkIds: ['hw2_a1', 'hw2_a2'],
    order: 4,
  },

  // --- Unit 2-2: 리드와 팔로우 ---
  {
    id: 'les2_05', unitId: 'u2_2', title: 'Yo lidero, vos seguís', titleKo: '리드와 팔로우',
    situation: '역할 이해 — 리더와 팔로워의 관계',
    sentenceIds: ['s2_05_1', 's2_05_2', 's2_05_3', 's2_05_4', 's2_05_5', 's2_05_6', 's2_05_7', 's2_05_8', 's2_05_9', 's2_05_10'],
    quizIds: ['q2_05_1', 'q2_05_2', 'q2_05_3', 'q2_05_4'],
    termIds: ['t_lider', 't_seguidor'],
    order: 5,
  },
  {
    id: 'les2_06', unitId: 'u2_2', title: 'Marcá con el pecho', titleKo: '마르카',
    situation: '리드 신호 — 팔이 아니라 가슴으로',
    sentenceIds: ['s2_06_1', 's2_06_2', 's2_06_3', 's2_06_4', 's2_06_5', 's2_06_6', 's2_06_7', 's2_06_8', 's2_06_9', 's2_06_10'],
    quizIds: ['q2_06_1', 'q2_06_2', 'q2_06_3', 'q2_06_4'],
    termIds: ['t_marca'],
    bonusId: 'b06',
    homeworkIds: ['hw2_b1'],
    order: 6,
  },
  {
    id: 'les2_07', unitId: 'u2_2', title: 'La salida', titleKo: '살리다 기초',
    situation: '출발 패턴 — 의도가 담긴 첫걸음',
    sentenceIds: ['s2_07_1', 's2_07_2', 's2_07_3', 's2_07_4', 's2_07_5', 's2_07_6', 's2_07_7', 's2_07_8', 's2_07_9', 's2_07_10'],
    quizIds: ['q2_07_1', 'q2_07_2', 'q2_07_3', 'q2_07_4'],
    termIds: ['t_salida'],
    bonusId: 'b07',
    order: 7,
  },
  {
    id: 'les2_08', unitId: 'u2_2', title: 'Más despacio', titleKo: '속도 조절',
    situation: '빠르기 조절 — 서두르지 않기',
    sentenceIds: ['s2_08_1', 's2_08_2', 's2_08_3', 's2_08_4', 's2_08_5', 's2_08_6', 's2_08_7', 's2_08_8', 's2_08_9', 's2_08_10'],
    quizIds: ['q2_08_1', 'q2_08_2', 'q2_08_3', 'q2_08_4'],
    missionId: 'm05',
    homeworkIds: ['hw2_b1', 'hw2_b2'],
    order: 8,
  },

  // --- Unit 2-3: 음악과 함께 걷기 ---
  {
    id: 'les2_09', unitId: 'u2_3', title: 'Escuchá la música', titleKo: '리듬과 걷기',
    situation: '음악 연결 — 걷기와 박자를 잇는 순간',
    sentenceIds: ['s2_09_1', 's2_09_2', 's2_09_3', 's2_09_4', 's2_09_5', 's2_09_6', 's2_09_7', 's2_09_8', 's2_09_9', 's2_09_10'],
    quizIds: ['q2_09_1', 'q2_09_2', 'q2_09_3', 'q2_09_4'],
    termIds: ['t_compas'],
    bonusId: 'b08',
    order: 9,
  },
  {
    id: 'les2_10', unitId: 'u2_3', title: 'Paso más corto', titleKo: '보폭 맞추기',
    situation: '보폭 조율 — 함께 걷는 춤의 핵심',
    sentenceIds: ['s2_10_1', 's2_10_2', 's2_10_3', 's2_10_4', 's2_10_5', 's2_10_6', 's2_10_7', 's2_10_8', 's2_10_9', 's2_10_10'],
    quizIds: ['q2_10_1', 'q2_10_2', 'q2_10_3', 'q2_10_4'],
    order: 10,
  },
  {
    id: 'les2_11', unitId: 'u2_3', title: 'Caminemos juntos', titleKo: '함께 걷기',
    situation: '파트너 동조 — 걷기는 개인 동작이 아니라 관계의 동작',
    sentenceIds: ['s2_11_1', 's2_11_2', 's2_11_3', 's2_11_4', 's2_11_5', 's2_11_6', 's2_11_7', 's2_11_8', 's2_11_9', 's2_11_10'],
    quizIds: ['q2_11_1', 'q2_11_2', 'q2_11_3', 'q2_11_4'],
    missionId: 'm06',
    homeworkIds: ['hw2_c1', 'hw2_c2'],
    order: 11,
  },
  {
    id: 'les2_12', unitId: 'u2_3', title: 'Caminata completa', titleKo: '걷기 역할극',
    situation: '종합 — 전진→멈춤→재출발→속도조절→마무리',
    sentenceIds: ['s2_12_1', 's2_12_2', 's2_12_3', 's2_12_4', 's2_12_5', 's2_12_6', 's2_12_7', 's2_12_8', 's2_12_9', 's2_12_10'],
    quizIds: ['q2_12_1', 'q2_12_2', 'q2_12_3', 'q2_12_4'],
    roleplayId: 'rp2_12',
    order: 12,
  },

  // =====================================================
  // LEVEL 3: Girar y construir — 14 lessons
  // =====================================================

  // --- Unit 3-1: 오초와 크루세 ---
  { id: 'les3_01', unitId: 'u3_1', title: 'El ocho adelante', titleKo: '앞오초', situation: '오초 기초 — 피벗과 교차의 시작', sentenceIds: ['s3_01_1', 's3_01_2', 's3_01_3', 's3_01_4', 's3_01_5', 's3_01_6', 's3_01_7', 's3_01_8', 's3_01_9', 's3_01_10'], quizIds: ['q3_01_1', 'q3_01_2', 'q3_01_3', 'q3_01_4'], termIds: ['t_ocho', 't_pivote'], homeworkIds: ['hw3_a1'], order: 1 },
  { id: 'les3_02', unitId: 'u3_1', title: 'El ocho atrás', titleKo: '뒤오초', situation: '뒤로 오초 — 골반 회전과 축 유지', sentenceIds: ['s3_02_1', 's3_02_2', 's3_02_3', 's3_02_4', 's3_02_5', 's3_02_6', 's3_02_7', 's3_02_8', 's3_02_9', 's3_02_10'], quizIds: ['q3_02_1', 'q3_02_2', 'q3_02_3', 'q3_02_4'], bonusId: 'b09', order: 2 },
  { id: 'les3_03', unitId: 'u3_1', title: 'El cruce', titleKo: '크루세', situation: '다리 교차 — 클래식한 순간', sentenceIds: ['s3_03_1', 's3_03_2', 's3_03_3', 's3_03_4', 's3_03_5', 's3_03_6', 's3_03_7', 's3_03_8', 's3_03_9', 's3_03_10'], quizIds: ['q3_03_1', 'q3_03_2', 'q3_03_3', 'q3_03_4'], termIds: ['t_cruce'], missionId: 'm07', homeworkIds: ['hw3_a1', 'hw3_a2'], order: 3 },

  // --- Unit 3-2: 히로 ---
  { id: 'les3_04', unitId: 'u3_2', title: 'Empezá el giro', titleKo: '회전 시작', situation: '히로 진입 — 서두르지 않기', sentenceIds: ['s3_04_1', 's3_04_2', 's3_04_3', 's3_04_4', 's3_04_5', 's3_04_6', 's3_04_7', 's3_04_8', 's3_04_9', 's3_04_10'], quizIds: ['q3_04_1', 'q3_04_2', 'q3_04_3', 'q3_04_4'], termIds: ['t_giro'], order: 4 },
  { id: 'les3_05', unitId: 'u3_2', title: 'Dentro del giro', titleKo: '회전 안에서', situation: '히로 스텝 분해 — 앞, 옆, 뒤', sentenceIds: ['s3_05_1', 's3_05_2', 's3_05_3', 's3_05_4', 's3_05_5', 's3_05_6', 's3_05_7', 's3_05_8', 's3_05_9', 's3_05_10'], quizIds: ['q3_05_1', 'q3_05_2', 'q3_05_3', 'q3_05_4'], bonusId: 'b10', order: 5 },
  { id: 'les3_06', unitId: 'u3_2', title: 'Primero la base', titleKo: '기본이 먼저', situation: '마인드셋 — 기본 없이 기술 없다', sentenceIds: ['s3_06_1', 's3_06_2', 's3_06_3', 's3_06_4', 's3_06_5', 's3_06_6', 's3_06_7', 's3_06_8', 's3_06_9', 's3_06_10'], quizIds: ['q3_06_1', 'q3_06_2', 'q3_06_3', 'q3_06_4'], homeworkIds: ['hw3_b1'], order: 6 },
  { id: 'les3_07', unitId: 'u3_2', title: 'El adorno', titleKo: '아도르노', situation: '장식의 기초 — 기본 위에 나를 얹기', sentenceIds: ['s3_07_1', 's3_07_2', 's3_07_3', 's3_07_4', 's3_07_5', 's3_07_6', 's3_07_7', 's3_07_8', 's3_07_9', 's3_07_10'], quizIds: ['q3_07_1', 'q3_07_2', 'q3_07_3', 'q3_07_4'], termIds: ['t_adorno'], bonusId: 'b11', missionId: 'm08', homeworkIds: ['hw3_b1', 'hw3_b2'], order: 7 },

  // --- Unit 3-3: 피겨 ---
  { id: 'les3_08', unitId: 'u3_3', title: 'La sacada', titleKo: '사카다', situation: '공간 진입 — 침입이 아니라 초대', sentenceIds: ['s3_08_1', 's3_08_2', 's3_08_3', 's3_08_4', 's3_08_5', 's3_08_6', 's3_08_7', 's3_08_8', 's3_08_9', 's3_08_10'], quizIds: ['q3_08_1', 'q3_08_2', 'q3_08_3', 'q3_08_4'], termIds: ['t_sacada'], order: 8 },
  { id: 'les3_09', unitId: 'u3_3', title: 'La parada', titleKo: '파라다', situation: '멈춤과 장식 — 멈춘 곳에서 표현하기', sentenceIds: ['s3_09_1', 's3_09_2', 's3_09_3', 's3_09_4', 's3_09_5', 's3_09_6', 's3_09_7', 's3_09_8', 's3_09_9', 's3_09_10'], quizIds: ['q3_09_1', 'q3_09_2', 'q3_09_3', 'q3_09_4'], termIds: ['t_parada'], bonusId: 'b13', order: 9 },
  { id: 'les3_10', unitId: 'u3_3', title: 'El boleo', titleKo: '볼레오', situation: '자연스러운 동작 — 하는 게 아니라 나오게 하는 것', sentenceIds: ['s3_10_1', 's3_10_2', 's3_10_3', 's3_10_4', 's3_10_5', 's3_10_6', 's3_10_7', 's3_10_8', 's3_10_9', 's3_10_10'], quizIds: ['q3_10_1', 'q3_10_2', 'q3_10_3', 'q3_10_4'], termIds: ['t_boleo'], missionId: 'm09', homeworkIds: ['hw3_c1'], order: 10 },

  // --- Unit 3-4: 피드백과 연습 ---
  { id: 'les3_11', unitId: 'u3_4', title: 'Más suave, menos fuerza', titleKo: '강도 조절', situation: '수업 교정 — 부드럽게, 힘 줄여', sentenceIds: ['s3_11_1', 's3_11_2', 's3_11_3', 's3_11_4', 's3_11_5', 's3_11_6', 's3_11_7', 's3_11_8', 's3_11_9', 's3_11_10'], quizIds: ['q3_11_1', 'q3_11_2', 'q3_11_3', 'q3_11_4'], order: 11 },
  { id: 'les3_12', unitId: 'u3_4', title: 'No pasa nada', titleKo: '실수 후 복구', situation: '분위기 유지 — 괜찮아, 다시 하자', sentenceIds: ['s3_12_1', 's3_12_2', 's3_12_3', 's3_12_4', 's3_12_5', 's3_12_6', 's3_12_7', 's3_12_8', 's3_12_9', 's3_12_10'], quizIds: ['q3_12_1', 'q3_12_2', 'q3_12_3', 'q3_12_4'], bonusId: 'b12', order: 12 },
  { id: 'les3_13', unitId: 'u3_4', title: '¿Puedo intentar de nuevo?', titleKo: '수업 중 질문', situation: '질문하기 — Level 4로 가는 브릿지', sentenceIds: ['s3_13_1', 's3_13_2', 's3_13_3', 's3_13_4', 's3_13_5', 's3_13_6', 's3_13_7', 's3_13_8', 's3_13_9', 's3_13_10'], quizIds: ['q3_13_1', 'q3_13_2', 'q3_13_3', 'q3_13_4'], homeworkIds: ['hw3_c1', 'hw3_c2'], order: 13 },
  { id: 'les3_14', unitId: 'u3_4', title: 'Giro completo', titleKo: '회전 역할극', situation: '종합 — 오초→히로→교정→질문→재시도', sentenceIds: ['s3_14_1', 's3_14_2', 's3_14_3', 's3_14_4', 's3_14_5', 's3_14_6', 's3_14_7', 's3_14_8', 's3_14_9', 's3_14_10'], quizIds: ['q3_14_1', 'q3_14_2', 'q3_14_3', 'q3_14_4'], roleplayId: 'rp3_14', order: 14 },

  // =====================================================
  // LEVEL 4: Hablar en la práctica — 12 lessons
  // =====================================================

  // --- Unit 4-1: 반복과 개선 ---
  { id: 'les4_01', unitId: 'u4_1', title: 'Otra vez, por favor', titleKo: '다시 해볼까요', situation: '재시도 요청 — 자연스럽게 "한 번 더"', sentenceIds: ['s4_01_1', 's4_01_2', 's4_01_3', 's4_01_4', 's4_01_5', 's4_01_6', 's4_01_7', 's4_01_8', 's4_01_9', 's4_01_10'], quizIds: ['q4_01_1', 'q4_01_2', 'q4_01_3', 'q4_01_4'], homeworkIds: ['hw4_a1'], order: 1 },
  { id: 'les4_02', unitId: 'u4_1', title: 'Ahora está mejor', titleKo: '더 좋아요', situation: '긍정 피드백 — 인정하고 격려하기', sentenceIds: ['s4_02_1', 's4_02_2', 's4_02_3', 's4_02_4', 's4_02_5', 's4_02_6', 's4_02_7', 's4_02_8', 's4_02_9', 's4_02_10'], quizIds: ['q4_02_1', 'q4_02_2', 'q4_02_3', 'q4_02_4'], order: 2 },
  { id: 'les4_03', unitId: 'u4_1', title: 'Todavía no', titleKo: '아직 아니에요', situation: '부정 피드백 — 부드럽게 교정하기', sentenceIds: ['s4_03_1', 's4_03_2', 's4_03_3', 's4_03_4', 's4_03_5', 's4_03_6', 's4_03_7', 's4_03_8', 's4_03_9', 's4_03_10'], quizIds: ['q4_03_1', 'q4_03_2', 'q4_03_3', 'q4_03_4'], bonusId: 'b14', order: 3 },
  { id: 'les4_04', unitId: 'u4_1', title: 'Más despacio, por favor', titleKo: '천천히요', situation: '속도 피드백 — 서두르지 않기', sentenceIds: ['s4_04_1', 's4_04_2', 's4_04_3', 's4_04_4', 's4_04_5', 's4_04_6', 's4_04_7', 's4_04_8', 's4_04_9', 's4_04_10'], quizIds: ['q4_04_1', 'q4_04_2', 'q4_04_3', 'q4_04_4'], missionId: 'm10', homeworkIds: ['hw4_a1', 'hw4_a2'], order: 4 },

  // --- Unit 4-2: 느끼기와 표현 ---
  { id: 'les4_05', unitId: 'u4_2', title: 'No lo siento bien', titleKo: '느낌이 안 와요', situation: '감각 표현 — 모르겠을 때 말하기', sentenceIds: ['s4_05_1', 's4_05_2', 's4_05_3', 's4_05_4', 's4_05_5', 's4_05_6', 's4_05_7', 's4_05_8', 's4_05_9', 's4_05_10'], quizIds: ['q4_05_1', 'q4_05_2', 'q4_05_3', 'q4_05_4'], termIds: ['t_sensacion'], order: 5 },
  { id: 'les4_06', unitId: 'u4_2', title: 'Perdimos la conexión', titleKo: '연결이 끊겼어요', situation: '연결 피드백 — 다시 잡기', sentenceIds: ['s4_06_1', 's4_06_2', 's4_06_3', 's4_06_4', 's4_06_5', 's4_06_6', 's4_06_7', 's4_06_8', 's4_06_9', 's4_06_10'], quizIds: ['q4_06_1', 'q4_06_2', 'q4_06_3', 'q4_06_4'], order: 6 },
  { id: 'les4_07', unitId: 'u4_2', title: 'Entraste antes', titleKo: '타이밍', situation: '시간차 피드백 — 너무 빨리/늦게', sentenceIds: ['s4_07_1', 's4_07_2', 's4_07_3', 's4_07_4', 's4_07_5', 's4_07_6', 's4_07_7', 's4_07_8', 's4_07_9', 's4_07_10'], quizIds: ['q4_07_1', 'q4_07_2', 'q4_07_3', 'q4_07_4'], termIds: ['t_tiempo'], bonusId: 'b15', homeworkIds: ['hw4_b1'], order: 7 },
  { id: 'les4_08', unitId: 'u4_2', title: 'Estoy nervioso', titleKo: '감정 표현', situation: '수업 감정 — 긴장, 편안함, 즐거움', sentenceIds: ['s4_08_1', 's4_08_2', 's4_08_3', 's4_08_4', 's4_08_5', 's4_08_6', 's4_08_7', 's4_08_8', 's4_08_9', 's4_08_10'], quizIds: ['q4_08_1', 'q4_08_2', 'q4_08_3', 'q4_08_4'], missionId: 'm11', homeworkIds: ['hw4_b1', 'hw4_b2'], order: 8 },

  // --- Unit 4-3: 연습 대화 ---
  { id: 'les4_09', unitId: 'u4_3', title: 'Estuvo muy bien', titleKo: '서로 피드백', situation: '커플 피드백 — 좋았던 점, 이상했던 점', sentenceIds: ['s4_09_1', 's4_09_2', 's4_09_3', 's4_09_4', 's4_09_5', 's4_09_6', 's4_09_7', 's4_09_8', 's4_09_9', 's4_09_10'], quizIds: ['q4_09_1', 'q4_09_2', 'q4_09_3', 'q4_09_4'], order: 9 },
  { id: 'les4_10', unitId: 'u4_3', title: 'Estoy mejorando', titleKo: '진전 대화', situation: '동기부여 — 나아지고 있다는 실감', sentenceIds: ['s4_10_1', 's4_10_2', 's4_10_3', 's4_10_4', 's4_10_5', 's4_10_6', 's4_10_7', 's4_10_8', 's4_10_9', 's4_10_10'], quizIds: ['q4_10_1', 'q4_10_2', 'q4_10_3', 'q4_10_4'], termIds: ['t_practica'], order: 10 },
  { id: 'les4_11', unitId: 'u4_3', title: 'Fue un placer', titleKo: '파트너 교체 인사', situation: '교체 상황 — 예의 있는 마무리', sentenceIds: ['s4_11_1', 's4_11_2', 's4_11_3', 's4_11_4', 's4_11_5', 's4_11_6', 's4_11_7', 's4_11_8', 's4_11_9', 's4_11_10'], quizIds: ['q4_11_1', 'q4_11_2', 'q4_11_3', 'q4_11_4'], termIds: ['t_rotacion'], bonusId: 'b16', missionId: 'm12', homeworkIds: ['hw4_c1', 'hw4_c2'], order: 11 },
  { id: 'les4_12', unitId: 'u4_3', title: 'En la práctica', titleKo: '연습 역할극', situation: '종합 — 시작→피드백→교정→감정→마무리', sentenceIds: ['s4_12_1', 's4_12_2', 's4_12_3', 's4_12_4', 's4_12_5', 's4_12_6', 's4_12_7', 's4_12_8', 's4_12_9', 's4_12_10'], quizIds: ['q4_12_1', 'q4_12_2', 'q4_12_3', 'q4_12_4'], roleplayId: 'rp4_12', bonusId: 'b17', order: 12 },

  // =====================================================
  // LEVEL 5: Sobrevivir en la milonga — 16 lessons
  // =====================================================

  // --- Unit 5-1: 도착과 만남 ---
  { id: 'les5_01', unitId: 'u5_1', title: 'Buenas noches', titleKo: '밀롱가 도착', situation: '입장 인사 — 밀롱가에 들어서는 순간', sentenceIds: ['s5_01_1', 's5_01_2', 's5_01_3', 's5_01_4', 's5_01_5', 's5_01_6', 's5_01_7', 's5_01_8', 's5_01_9', 's5_01_10'], quizIds: ['q5_01_1', 'q5_01_2', 'q5_01_3', 'q5_01_4'], termIds: ['t_milonga'], bonusId: 'b18', homeworkIds: ['hw5_a1'], order: 1 },
  { id: 'les5_02', unitId: 'u5_1', title: 'Es un placer', titleKo: '처음 만남', situation: '자기소개 — 밀롱가에서 처음 만나는 사람', sentenceIds: ['s5_02_1', 's5_02_2', 's5_02_3', 's5_02_4', 's5_02_5', 's5_02_6', 's5_02_7', 's5_02_8', 's5_02_9', 's5_02_10'], quizIds: ['q5_02_1', 'q5_02_2', 'q5_02_3', 'q5_02_4'], order: 2 },
  { id: 'les5_03', unitId: 'u5_1', title: 'El cabeceo', titleKo: '카베세오', situation: '눈으로 신청 — 탱고 전통', sentenceIds: ['s5_03_1', 's5_03_2', 's5_03_3', 's5_03_4', 's5_03_5', 's5_03_6', 's5_03_7', 's5_03_8', 's5_03_9', 's5_03_10'], quizIds: ['q5_03_1', 'q5_03_2', 'q5_03_3', 'q5_03_4'], termIds: ['t_cabeceo'], bonusId: 'b19', missionId: 'm13', order: 3 },
  { id: 'les5_04', unitId: 'u5_1', title: '¿Bailamos?', titleKo: '춤 신청', situation: '말로 신청 — "이 탄다 같이 출래요?"', sentenceIds: ['s5_04_1', 's5_04_2', 's5_04_3', 's5_04_4', 's5_04_5', 's5_04_6', 's5_04_7', 's5_04_8', 's5_04_9', 's5_04_10'], quizIds: ['q5_04_1', 'q5_04_2', 'q5_04_3', 'q5_04_4'], termIds: ['t_tanda'], homeworkIds: ['hw5_a1', 'hw5_a2'], order: 4 },

  // --- Unit 5-2: 탄다 안에서 ---
  { id: 'les5_05', unitId: 'u5_2', title: '¿Estás cómoda?', titleKo: '춤 도중 배려', situation: '춤 중 대화 — 배려와 사과', sentenceIds: ['s5_05_1', 's5_05_2', 's5_05_3', 's5_05_4', 's5_05_5', 's5_05_6', 's5_05_7', 's5_05_8', 's5_05_9', 's5_05_10'], quizIds: ['q5_05_1', 'q5_05_2', 'q5_05_3', 'q5_05_4'], order: 5 },
  { id: 'les5_06', unitId: 'u5_2', title: 'Me encanta esta canción', titleKo: '음악 대화', situation: '음악 반응 — 오케스트라/왈츠', sentenceIds: ['s5_06_1', 's5_06_2', 's5_06_3', 's5_06_4', 's5_06_5', 's5_06_6', 's5_06_7', 's5_06_8', 's5_06_9', 's5_06_10'], quizIds: ['q5_06_1', 'q5_06_2', 'q5_06_3', 'q5_06_4'], termIds: ['t_vals', 't_orquesta'], bonusId: 'b20', homeworkIds: ['hw5_b1'], order: 6 },
  { id: 'les5_07', unitId: 'u5_2', title: 'Tu abrazo es muy cómodo', titleKo: '칭찬', situation: '진심 칭찬 — 춤 파트너에게', sentenceIds: ['s5_07_1', 's5_07_2', 's5_07_3', 's5_07_4', 's5_07_5', 's5_07_6', 's5_07_7', 's5_07_8', 's5_07_9', 's5_07_10'], quizIds: ['q5_07_1', 'q5_07_2', 'q5_07_3', 'q5_07_4'], missionId: 'm14', order: 7 },
  { id: 'les5_08', unitId: 'u5_2', title: 'Cuidado', titleKo: '바닥 문제', situation: '충돌/밀림 — 좁은 바닥에서', sentenceIds: ['s5_08_1', 's5_08_2', 's5_08_3', 's5_08_4', 's5_08_5', 's5_08_6', 's5_08_7', 's5_08_8', 's5_08_9', 's5_08_10'], quizIds: ['q5_08_1', 'q5_08_2', 'q5_08_3', 'q5_08_4'], termIds: ['t_pista'], homeworkIds: ['hw5_b1', 'hw5_b2'], order: 8 },

  // --- Unit 5-3: 탄다 사이 ---
  { id: 'les5_09', unitId: 'u5_3', title: 'Gracias por la tanda', titleKo: '탄다 마무리', situation: '감사 인사 — 탄다가 끝나고', sentenceIds: ['s5_09_1', 's5_09_2', 's5_09_3', 's5_09_4', 's5_09_5', 's5_09_6', 's5_09_7', 's5_09_8', 's5_09_9', 's5_09_10'], quizIds: ['q5_09_1', 'q5_09_2', 'q5_09_3', 'q5_09_4'], termIds: ['t_cortina'], bonusId: 'b21', missionId: 'm15', order: 9 },
  { id: 'les5_10', unitId: 'u5_3', title: 'Ahora no, gracias', titleKo: '정중한 거절', situation: '거절 표현 — 우아하게 거절하기', sentenceIds: ['s5_10_1', 's5_10_2', 's5_10_3', 's5_10_4', 's5_10_5', 's5_10_6', 's5_10_7', 's5_10_8', 's5_10_9', 's5_10_10'], quizIds: ['q5_10_1', 'q5_10_2', 'q5_10_3', 'q5_10_4'], bonusId: 'b22', order: 10 },
  { id: 'les5_11', unitId: 'u5_3', title: '¿Descansamos?', titleKo: '휴식', situation: '쉬기 — 물 마시기, 대기', sentenceIds: ['s5_11_1', 's5_11_2', 's5_11_3', 's5_11_4', 's5_11_5', 's5_11_6', 's5_11_7', 's5_11_8', 's5_11_9', 's5_11_10'], quizIds: ['q5_11_1', 'q5_11_2', 'q5_11_3', 'q5_11_4'], order: 11 },
  { id: 'les5_12', unitId: 'u5_3', title: '¿Otra tanda?', titleKo: '한 탄다 더', situation: '재신청 — 계속 추고 싶을 때', sentenceIds: ['s5_12_1', 's5_12_2', 's5_12_3', 's5_12_4', 's5_12_5', 's5_12_6', 's5_12_7', 's5_12_8', 's5_12_9', 's5_12_10'], quizIds: ['q5_12_1', 'q5_12_2', 'q5_12_3', 'q5_12_4'], homeworkIds: ['hw5_c1', 'hw5_c2'], order: 12 },

  // --- Unit 5-4: 소셜과 작별 ---
  { id: 'les5_13', unitId: 'u5_4', title: '¿Hace mucho que bailás?', titleKo: '소셜 대화', situation: '가벼운 수다 — 밀롱가 분위기', sentenceIds: ['s5_13_1', 's5_13_2', 's5_13_3', 's5_13_4', 's5_13_5', 's5_13_6', 's5_13_7', 's5_13_8', 's5_13_9', 's5_13_10'], quizIds: ['q5_13_1', 'q5_13_2', 'q5_13_3', 'q5_13_4'], termIds: ['t_milonguero'], order: 13 },
  { id: 'les5_14', unitId: 'u5_4', title: 'Cuidemos la ronda', titleKo: '플로어 예절', situation: '론다 — 반시계 방향 흐름', sentenceIds: ['s5_14_1', 's5_14_2', 's5_14_3', 's5_14_4', 's5_14_5', 's5_14_6', 's5_14_7', 's5_14_8', 's5_14_9', 's5_14_10'], quizIds: ['q5_14_1', 'q5_14_2', 'q5_14_3', 'q5_14_4'], termIds: ['t_ronda'], bonusId: 'b23', order: 14 },
  { id: 'les5_15', unitId: 'u5_4', title: 'Fue una noche hermosa', titleKo: '작별', situation: '귀가 인사 — 밀롱가를 떠나며', sentenceIds: ['s5_15_1', 's5_15_2', 's5_15_3', 's5_15_4', 's5_15_5', 's5_15_6', 's5_15_7', 's5_15_8', 's5_15_9', 's5_15_10'], quizIds: ['q5_15_1', 'q5_15_2', 'q5_15_3', 'q5_15_4'], missionId: 'm16', order: 15 },
  { id: 'les5_16', unitId: 'u5_4', title: 'Una noche en la milonga', titleKo: '밀롱가 풀 역할극', situation: '종합 — 도착→카베세오→탄다→감사→작별', sentenceIds: ['s5_16_1', 's5_16_2', 's5_16_3', 's5_16_4', 's5_16_5', 's5_16_6', 's5_16_7', 's5_16_8', 's5_16_9', 's5_16_10'], quizIds: ['q5_16_1', 'q5_16_2', 'q5_16_3', 'q5_16_4'], roleplayId: 'rp5_16', homeworkIds: ['hw5_c1', 'hw5_c2'], order: 16 },
];

// =====================================================
// HELPERS
// =====================================================

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getUnitById(id: string): Unit | undefined {
  return units.find((u) => u.id === id);
}

export function getLevelById(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}

export function getLessonsForUnit(unitId: string): Lesson[] {
  return lessons.filter((l) => l.unitId === unitId);
}
