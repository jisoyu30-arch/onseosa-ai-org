// ===== 청크 학습 데이터 =====
// 표현 덩어리(chunk) 단위로 자주 쓰는 탱고 수업 표현을 익힌다.

export interface Chunk {
  id: string;
  lessonId: string;
  spanish: string;      // 표현 덩어리
  korean: string;
  english: string;
  chinese: string;
  literal: string;      // 직역 (단어별 의미)
  usage: string;        // 어디서 쓰는지
}

export const chunks: Record<string, Chunk> = {
  // ===== Lesson 1: 첫 인사 =====
  'ch1_01_1': {
    id: 'ch1_01_1',
    lessonId: 'les1_01',
    spanish: '¿Todo bien?',
    korean: '다 괜찮아?',
    english: 'All good?',
    chinese: '都还好吗？',
    literal: 'todo(모든) + bien(좋은) → 모든 게 좋아?',
    usage: '수업장 도착 후 가볍게 안부 물을 때',
  },
  'ch1_01_2': {
    id: 'ch1_01_2',
    lessonId: 'les1_01',
    spanish: 'Mucho gusto',
    korean: '반가워요',
    english: 'Nice to meet you',
    chinese: '很高兴认识你',
    literal: 'mucho(많은) + gusto(기쁨) → 큰 기쁨',
    usage: '처음 만난 사람에게 인사할 때',
  },
  'ch1_01_3': {
    id: 'ch1_01_3',
    lessonId: 'les1_01',
    spanish: 'Bienvenidos a la clase',
    korean: '수업에 오신 걸 환영해요',
    english: 'Welcome to the class',
    chinese: '欢迎来上课',
    literal: 'bienvenidos(환영) + a(~에) + la clase(수업) → 수업에 환영',
    usage: '선생님이 수업 시작할 때 하는 말',
  },

  // ===== Lesson 2: 얼굴과 시선 =====
  'ch1_02_1': {
    id: 'ch1_02_1',
    lessonId: 'les1_02',
    spanish: 'Relajá la cara',
    korean: '얼굴 힘 빼',
    english: 'Relax your face',
    chinese: '放松脸部',
    literal: 'relajá(풀어) + la cara(얼굴) → 얼굴을 풀어',
    usage: '선생님이 긴장한 학생에게 자세 교정할 때',
  },
  'ch1_02_2': {
    id: 'ch1_02_2',
    lessonId: 'les1_02',
    spanish: 'Mírame a los ojos',
    korean: '내 눈을 봐',
    english: 'Look into my eyes',
    chinese: '看着我的眼睛',
    literal: 'mírame(나를 봐) + a los ojos(눈을) → 눈을 봐',
    usage: '시선 연결이 필요할 때 선생님이 하는 말',
  },
  'ch1_02_3': {
    id: 'ch1_02_3',
    lessonId: 'les1_02',
    spanish: 'No mires al piso',
    korean: '바닥 보지 마',
    english: "Don't look at the floor",
    chinese: '别看地板',
    literal: 'no mires(보지 마) + al piso(바닥을) → 바닥을 보지 마',
    usage: '초보가 발을 내려다볼 때 선생님의 교정',
  },

  // ===== Lesson 3: 어깨와 목 =====
  'ch1_03_1': {
    id: 'ch1_03_1',
    lessonId: 'les1_03',
    spanish: 'Bajá los hombros',
    korean: '어깨 내려',
    english: 'Lower your shoulders',
    chinese: '放下肩膀',
    literal: 'bajá(내려) + los hombros(어깨들) → 어깨를 내려',
    usage: '긴장으로 어깨가 올라갔을 때',
  },
  'ch1_03_2': {
    id: 'ch1_03_2',
    lessonId: 'les1_03',
    spanish: 'Estirá el cuello',
    korean: '목을 펴',
    english: 'Stretch your neck',
    chinese: '伸展脖子',
    literal: 'estirá(펴) + el cuello(목) → 목을 펴',
    usage: '목이 움츠러들었을 때 자세 교정',
  },
  'ch1_03_3': {
    id: 'ch1_03_3',
    lessonId: 'les1_03',
    spanish: 'Así, muy bien',
    korean: '그렇지, 잘했어',
    english: "That's it, very good",
    chinese: '就是这样，很好',
    literal: 'así(그렇게) + muy bien(아주 좋아) → 그렇게, 아주 좋아',
    usage: '학생이 올바른 자세를 잡았을 때 격려',
  },

  // ===== Lesson 4: 팔과 손의 연결 =====
  'ch1_04_1': {
    id: 'ch1_04_1',
    lessonId: 'les1_04',
    spanish: 'Sentí la mano',
    korean: '손을 느껴봐',
    english: 'Feel the hand',
    chinese: '感受手',
    literal: 'sentí(느껴봐) + la mano(손) → 손을 느껴봐',
    usage: '파트너의 손을 통해 리드를 느끼는 연습',
  },
  'ch1_04_2': {
    id: 'ch1_04_2',
    lessonId: 'les1_04',
    spanish: 'No aprietes',
    korean: '꽉 쥐지 마',
    english: "Don't squeeze",
    chinese: '别握太紧',
    literal: 'no aprietes(꽉 쥐지 마) → 쥐지 마',
    usage: '파트너 손을 너무 꽉 잡았을 때',
  },
  'ch1_04_3': {
    id: 'ch1_04_3',
    lessonId: 'les1_04',
    spanish: 'Suave, suave',
    korean: '부드럽게, 부드럽게',
    english: 'Gently, gently',
    chinese: '轻轻地，轻轻地',
    literal: 'suave(부드러운) × 2 → 부드럽게',
    usage: '힘을 너무 줬을 때 선생님이 진정시킬 때',
  },

  // ===== Lesson 5: 힘 빼기와 호흡 =====
  'ch1_05_1': {
    id: 'ch1_05_1',
    lessonId: 'les1_05',
    spanish: 'Respirá profundo',
    korean: '깊게 숨 쉬어',
    english: 'Breathe deeply',
    chinese: '深呼吸',
    literal: 'respirá(숨 쉬어) + profundo(깊게) → 깊게 숨 쉬어',
    usage: '긴장한 학생에게 호흡으로 진정시킬 때',
  },
  'ch1_05_2': {
    id: 'ch1_05_2',
    lessonId: 'les1_05',
    spanish: 'Soltá todo',
    korean: '다 놓아',
    english: 'Let go of everything',
    chinese: '全部放开',
    literal: 'soltá(놓아) + todo(전부) → 전부 놓아',
    usage: '몸의 긴장을 완전히 푸는 순간',
  },
  'ch1_05_3': {
    id: 'ch1_05_3',
    lessonId: 'les1_05',
    spanish: 'Otra vez, tranquilo',
    korean: '한 번 더, 천천히',
    english: 'Once more, calmly',
    chinese: '再来一次，慢慢来',
    literal: 'otra vez(한 번 더) + tranquilo(차분히) → 한 번 더, 차분히',
    usage: '다시 해보라고 부드럽게 지시할 때',
  },

  // ===== Lesson 6: 중심과 축 =====
  'ch1_06_1': {
    id: 'ch1_06_1',
    lessonId: 'les1_06',
    spanish: 'Encontrá tu eje',
    korean: '네 축을 찾아',
    english: 'Find your axis',
    chinese: '找到你的轴心',
    literal: 'encontrá(찾아) + tu eje(네 축) → 네 축을 찾아',
    usage: '균형 잡기 연습, 축을 세우는 기본 자세',
  },
  'ch1_06_2': {
    id: 'ch1_06_2',
    lessonId: 'les1_06',
    spanish: 'No te inclines',
    korean: '기울어지지 마',
    english: "Don't lean",
    chinese: '别倾斜',
    literal: 'no te inclines(기울어지지 마) → 기울지 마',
    usage: '파트너에게 기대거나 축이 무너졌을 때',
  },
  'ch1_06_3': {
    id: 'ch1_06_3',
    lessonId: 'les1_06',
    spanish: 'Peso en una pierna',
    korean: '한 다리에 체중',
    english: 'Weight on one leg',
    chinese: '重心在一条腿上',
    literal: 'peso(무게) + en una pierna(한 다리에) → 한 다리에 무게',
    usage: '체중 이동 연습의 기본 지시',
  },

  // ===== Lesson 7: 체중 이동 =====
  'ch1_07_1': {
    id: 'ch1_07_1',
    lessonId: 'les1_07',
    spanish: 'Cambiá el peso',
    korean: '체중을 옮겨',
    english: 'Shift your weight',
    chinese: '换重心',
    literal: 'cambiá(바꿔) + el peso(무게) → 무게를 바꿔',
    usage: '한 발에서 다른 발로 무게 옮기기',
  },
  'ch1_07_2': {
    id: 'ch1_07_2',
    lessonId: 'les1_07',
    spanish: 'De un pie al otro',
    korean: '이 발에서 저 발로',
    english: 'From one foot to the other',
    chinese: '从一只脚到另一只',
    literal: 'de un pie(한 발에서) + al otro(다른 쪽으로) → 한 발에서 다른 발로',
    usage: '체중 이동 방향을 구체적으로 지시할 때',
  },
  'ch1_07_3': {
    id: 'ch1_07_3',
    lessonId: 'les1_07',
    spanish: 'Quedáte ahí',
    korean: '거기서 멈춰',
    english: 'Stay right there',
    chinese: '待在那里',
    literal: 'quedáte(머물러) + ahí(거기) → 거기서 머물러',
    usage: '올바른 위치에서 잠시 멈추라는 지시',
  },

  // ===== Lesson 8: 아브라소 =====
  'ch1_08_1': {
    id: 'ch1_08_1',
    lessonId: 'les1_08',
    spanish: 'Abrázame así',
    korean: '이렇게 안아봐',
    english: 'Embrace me like this',
    chinese: '像这样拥抱我',
    literal: 'abrázame(나를 안아) + así(이렇게) → 이렇게 나를 안아',
    usage: '아브라소(포옹) 자세를 잡을 때',
  },
  'ch1_08_2': {
    id: 'ch1_08_2',
    lessonId: 'les1_08',
    spanish: 'Más cerca',
    korean: '더 가까이',
    english: 'Closer',
    chinese: '再靠近一点',
    literal: 'más(더) + cerca(가까이) → 더 가까이',
    usage: '아브라소에서 거리가 너무 멀 때',
  },
  'ch1_08_3': {
    id: 'ch1_08_3',
    lessonId: 'les1_08',
    spanish: 'Pecho con pecho',
    korean: '가슴과 가슴',
    english: 'Chest to chest',
    chinese: '胸贴胸',
    literal: 'pecho(가슴) + con(~과) + pecho(가슴) → 가슴과 가슴',
    usage: '클로즈 아브라소의 핵심 연결 지점',
  },

  // ===== Lesson 9: 연결 느끼기 =====
  'ch1_09_1': {
    id: 'ch1_09_1',
    lessonId: 'les1_09',
    spanish: 'Sentí la conexión',
    korean: '연결을 느껴봐',
    english: 'Feel the connection',
    chinese: '感受连接',
    literal: 'sentí(느껴봐) + la conexión(연결) → 연결을 느껴봐',
    usage: '파트너와의 연결 감각을 만들 때',
  },
  'ch1_09_2': {
    id: 'ch1_09_2',
    lessonId: 'les1_09',
    spanish: 'Escuchá su cuerpo',
    korean: '상대 몸을 들어봐',
    english: "Listen to their body",
    chinese: '倾听对方的身体',
    literal: 'escuchá(들어봐) + su cuerpo(그의 몸) → 그의 몸을 들어봐',
    usage: '리드/팔로우에서 상대의 신호를 감지하는 연습',
  },
  'ch1_09_3': {
    id: 'ch1_09_3',
    lessonId: 'les1_09',
    spanish: 'Sin palabras',
    korean: '말 없이',
    english: 'Without words',
    chinese: '不用说话',
    literal: 'sin(~없이) + palabras(말들) → 말 없이',
    usage: '탱고가 몸의 대화임을 알려줄 때',
  },

  // ===== Lesson 10: 첫 수업 역할극 =====
  'ch1_10_1': {
    id: 'ch1_10_1',
    lessonId: 'les1_10',
    spanish: 'Vamos a practicar',
    korean: '연습하자',
    english: "Let's practice",
    chinese: '我们来练习吧',
    literal: 'vamos(가자) + a practicar(연습하러) → 연습하러 가자',
    usage: '수업에서 연습 시간이 시작될 때',
  },
  'ch1_10_2': {
    id: 'ch1_10_2',
    lessonId: 'les1_10',
    spanish: '¿Practicamos juntos?',
    korean: '같이 연습할래?',
    english: 'Shall we practice together?',
    chinese: '一起练习吗？',
    literal: 'practicamos(연습할까) + juntos(함께) → 함께 연습할까?',
    usage: '다른 학생에게 파트너 연습을 제안할 때',
  },
  'ch1_10_3': {
    id: 'ch1_10_3',
    lessonId: 'les1_10',
    spanish: 'Estuvo muy bien',
    korean: '아주 잘했어',
    english: 'That was very good',
    chinese: '做得很好',
    literal: 'estuvo(~였어) + muy bien(아주 좋은) → 아주 좋았어',
    usage: '수업 마무리에서 선생님이 칭찬할 때',
  },
};

// 레슨별 청크 목록 가져오기
export function getChunksForLesson(chunkIds: string[]): Chunk[] {
  return chunkIds.map((id) => chunks[id]).filter(Boolean);
}
