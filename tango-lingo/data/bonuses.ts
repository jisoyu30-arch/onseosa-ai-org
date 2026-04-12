import type { BonusCard } from '../types';

export const bonusCards: Record<string, BonusCard> = {
  // =====================================================
  // LEVEL 1 — 4 bonuses
  // =====================================================

  b01: {
    id: 'b01',
    category: 'word_origin',
    title: 'La Mirada y el Cabeceo',
    titleKo: '미라다 — 눈으로 하는 초대',
    emoji: '👀',
    content:
      '밀롱가에서 춤을 신청할 때, "같이 출래요?"라고 말하지 않아요.\n\n' +
      '눈을 맞추고(mirada), 고개를 살짝 끄덕이면(cabeceo) — 그게 신청이에요.\n\n' +
      '상대가 눈을 피하면 "오늘은 아니에요"라는 뜻.\n' +
      '아무도 민망하지 않죠.\n\n' +
      '💡 탱고의 예의는 말이 아니라 몸에서 시작돼요.',
    unlockAfterLesson: 'les1_02',
    relatedTermIds: ['t_mirada'],
  },
  b02: {
    id: 'b02',
    category: 'history',
    title: 'El nacimiento del tango',
    titleKo: '탱고는 어디서 시작됐을까?',
    emoji: '🌊',
    content:
      '1880년대, 부에노스아이레스 항구.\n' +
      '이탈리아, 스페인, 아프리카에서 온 이민자들이 만나는 곳이었어요.\n\n' +
      '말이 잘 통하지 않는 사람들이\n' +
      '몸으로 대화하기 시작한 것 — 그게 탱고의 시작.\n\n' +
      '💡 탱고는 처음부터 "말보다 몸"의 춤이었어요.',
    unlockAfterLesson: 'les1_05',
  },
  b03: {
    id: 'b03',
    category: 'culture',
    title: 'Abierto y cerrado',
    titleKo: '오픈 vs 클로즈 아브라소',
    emoji: '🤗',
    content:
      '아브라소에는 두 가지가 있어요.\n\n' +
      '오픈 아브라소: 가슴 사이에 공간이 있어요.\n' +
      '→ 처음 만난 사이, 편하게.\n\n' +
      '클로즈 아브라소: 가슴이 가까이 닿아요.\n' +
      '→ 더 깊은 연결, 더 섬세한 리드.\n\n' +
      '💡 좋은 아브라소는 힘이 아니라 의도로 만들어져요.\n' +
      '파트너가 편안한지 항상 느껴보세요.',
    unlockAfterLesson: 'les1_08',
    relatedTermIds: ['t_abrazo'],
  },
  b04: {
    id: 'b04',
    category: 'culture',
    title: 'Las palabras cortas del profe',
    titleKo: '수업에서 듣는 짧은 말의 진짜 의미',
    emoji: '🗣️',
    content:
      '탱고 수업에서 선생님은 길게 설명하지 않아요.\n' +
      '짧고 강하게 — 몸으로 보여주고, 한마디로 정리하죠.\n\n' +
      '"Otra vez" → 혼내는 게 아니라 "한 번 더"\n' +
      '"Ahora sí" → 이제 맞아, 잘하고 있어\n' +
      '"Mejor así" → 이게 더 나아\n\n' +
      '💡 짧은 말 몇 개만 알아도 수업이 훨씬 편해져요.',
    unlockAfterLesson: 'les1_10',
  },

  // =====================================================
  // LEVEL 2 — 4 bonuses
  // =====================================================

  b05: {
    id: 'b05', category: 'culture',
    title: 'El tango es caminar', titleKo: '탱고는 걷기의 춤이다',
    emoji: '🚶',
    content:
      '탱고를 처음 배울 때 많은 사람이 실망해요.\n' +
      '"언제 멋진 동작을 배우나요?"\n\n' +
      '하지만 아르헨티나의 밀롱게로들은 말해요:\n' +
      '"100개 기술보다 좋은 걷기 하나가 낫다."\n\n' +
      '좋은 걷기 = 좋은 연결 = 좋은 춤.\n\n' +
      '💡 걷기가 지루하게 느껴진다면, 아직 걷기의 깊이를 모르는 거예요.',
    unlockAfterLesson: 'les2_03',
  },
  b06: {
    id: 'b06', category: 'culture',
    title: 'El líder no manda', titleKo: '리드는 명령이 아니다',
    emoji: '🤝',
    content:
      '리더는 보스가 아니에요.\n' +
      '팔로워는 부하가 아니고요.\n\n' +
      '탱고의 리드/팔로우는 대화에 가까워요:\n' +
      '한 사람이 제안하고, 한 사람이 해석한다.\n\n' +
      '좋은 리더는 "듣는 사람"이고,\n' +
      '좋은 팔로워는 "응답하는 사람"이에요.\n\n' +
      '💡 역할이 다를 뿐, 둘 다 능동적이에요.',
    unlockAfterLesson: 'les2_06',
    relatedTermIds: ['t_lider', 't_seguidor'],
  },
  b07: {
    id: 'b07', category: 'word_origin',
    title: '¿Por qué se llama salida?', titleKo: 'Salida는 왜 "출구"인가?',
    emoji: '🚪',
    content:
      'Salida는 "출구" 또는 "나감"이라는 뜻이에요.\n\n' +
      '탱고에서는 아브라소(포즈) 안에서\n' +
      '"밖으로 나가는" 첫 스텝을 말해요.\n\n' +
      '정지 상태에서 움직임이 시작되는 순간 —\n' +
      '그게 살리다.\n\n' +
      '💡 모든 여정에는 출발이 있다. 탱고도 마찬가지.',
    unlockAfterLesson: 'les2_07',
    relatedTermIds: ['t_salida'],
  },
  b08: {
    id: 'b08', category: 'music',
    title: 'Carlos Di Sarli', titleKo: '디 사를리 — 걷기의 오케스트라',
    emoji: '🎹',
    content:
      '카를로스 디 사를리(1903~1960)\n' +
      '가장 단정하고 명확한 박자를 가진 오케스트라.\n\n' +
      '초보에게 가장 좋은 음악이에요.\n' +
      '왜? 박자가 분명해서 걷기가 편하거든요.\n\n' +
      '디 사를리의 곡에 맞춰 걸으면\n' +
      '자연스럽게 "compás"가 뭔지 느껴져요.\n\n' +
      '💡 추천곡: "A la gran muñeca", "Bahía Blanca"',
    unlockAfterLesson: 'les2_09',
    relatedTermIds: ['t_compas'],
  },

  // =====================================================
  // LEVEL 3 — 5 bonuses
  // =====================================================

  b09: { id: 'b09', category: 'word_origin', title: '¿Por qué se llama ocho?', titleKo: '오초는 왜 8인가?', emoji: '8️⃣',
    content: '오초를 추면 바닥에 궤적이 남아요.\n그 궤적이 숫자 8을 닮았거든요.\n\n발이 그리는 게 아니라\n골반의 회전이 만들어내는 곡선이에요.\n\n💡 좋은 오초는 발끝이 아니라 몸통에서 시작돼요.',
    unlockAfterLesson: 'les3_02', relatedTermIds: ['t_ocho'] },
  b10: { id: 'b10', category: 'culture', title: '¿Por qué "primero la base"?', titleKo: '왜 선생님은 "기본 먼저"를 반복할까', emoji: '🏗️',
    content: '탱고 선생님들이 가장 많이 하는 말:\n"기본 먼저. 그 다음에 기술."\n\n화려한 히로보다\n안정적인 걷기가 파트너에게 더 좋은 춤이에요.\n\n💡 기본이 탄탄하면 기술은 저절로 따라와요.',
    unlockAfterLesson: 'les3_05' },
  b11: { id: 'b11', category: 'history', title: 'El adorno — historia', titleKo: '아도르노의 역사', emoji: '✨',
    content: '예전에 아도르노는 남자들의 표현이었어요.\n항구의 남자들이 서로 실력을 뽐내던 시절.\n\n지금은 리더도 팔로워도 아도르노를 넣어요.\n음악이 허락하는 순간, 나만의 표현을 더하는 것.\n\n💡 아도르노는 실력이 아니라 음악성이에요.',
    unlockAfterLesson: 'les3_07', relatedTermIds: ['t_adorno'] },
  b12: { id: 'b12', category: 'etiquette', title: '밀롱가에서 큰 동작은 위험', titleKo: '밀롱가에서 히로를 크게 하면 안 되는 이유', emoji: '⚠️',
    content: '밀롱가 바닥은 좁아요.\n큰 히로, 큰 볼레오는 옆 커플을 위험하게 해요.\n\n좋은 밀롱게로는 작은 공간에서도\n풍부한 표현을 만들어내요.\n\n💡 기술의 크기가 아니라 연결의 깊이가 중요해요.',
    unlockAfterLesson: 'les3_14' },
  b13: { id: 'b13', category: 'music', title: 'Juan D\'Arienzo', titleKo: '다리엔소 — 리듬의 왕', emoji: '🥁',
    content: '후안 다리엔소(1900~1976)\n짧고 강한 박자, 분명한 리듬.\n\n파라다와 파우사에 딱 맞는 음악이에요.\n멈추는 순간이 정확하게 느껴지거든요.\n\n💡 추천곡: "La cumparsita", "El flete"',
    unlockAfterLesson: 'les3_09', relatedTermIds: ['t_parada'] },

  // =====================================================
  // LEVEL 4 — 4 bonuses
  // =====================================================

  b14: { id: 'b14', category: 'culture', title: 'Buen feedback vs mal feedback', titleKo: '좋은 피드백과 나쁜 피드백의 차이', emoji: '💬',
    content: '나쁜 피드백: "그렇게 하지 마."\n좋은 피드백: "이쪽으로 해볼까?"\n\n탱고 연습에서 피드백은\n비난이 아니라 제안이에요.\n\n"No así" 대신 "Probemos diferente"가\n분위기를 완전히 바꿔요.\n\n💡 말 한 마디가 연습의 질을 바꿉니다.',
    unlockAfterLesson: 'les4_03' },
  b15: { id: 'b15', category: 'culture', title: 'La espera es técnica', titleKo: '기다림이 실력인 이유', emoji: '⏳',
    content: '초보는 빨리 움직이고 싶어해요.\n하지만 경험 많은 밀롱게로는 기다려요.\n\n기다림은 연결을 만드는 시간이에요.\n성급함은 연결을 끊는 적.\n\n"Esperá un poco más" —\n이 말이 가장 좋은 탱고 레슨일 수 있어요.\n\n💡 멈출 줄 아는 사람이 잘 추는 사람.',
    unlockAfterLesson: 'les4_07' },
  b16: { id: 'b16', category: 'etiquette', title: 'Cambiar de pareja', titleKo: '파트너 교체할 때 하면 안 되는 것', emoji: '🔄',
    content: '수업에서 로테이션할 때:\n\n❌ 표정으로 파트너를 평가하기\n❌ 한숨 쉬거나 실망한 티 내기\n❌ 인사 없이 바로 돌아서기\n\n✅ "Fue un placer" 한마디면 충분\n✅ 미소와 눈 맞춤\n✅ 감사 인사\n\n💡 탱고의 예의는 춤 밖에서도 중요해요.',
    unlockAfterLesson: 'les4_11' },
  b17: { id: 'b17', category: 'music', title: 'Aníbal Troilo', titleKo: '트로일로 — 서정의 거장', emoji: '🎵',
    content: '아니발 트로일로(1914~1975)\n"피추코"라는 별명의 반도네온 거장.\n\n감정이 풍부하고 서정적인 음악.\n느리고 깊은 연결에 어울려요.\n\n긴장이 풀리고 감정이 올라올 때\n트로일로의 곡이 딱이에요.\n\n💡 추천곡: "Sur", "Che bandoneón"',
    unlockAfterLesson: 'les4_12' },

  // =====================================================
  // LEVEL 5 — 6 bonuses
  // =====================================================

  b18: { id: 'b18', category: 'culture', title: 'La milonga — más que un lugar', titleKo: '밀롱가 — 장소 이상의 것', emoji: '🌃',
    content: '밀롱가는 단순히 "탱고 추는 곳"이 아니에요.\n\n조명, 음악, 분위기, 사람들의 에너지...\n하나의 작은 세계예요.\n\n처음 가면 긴장되지만,\n"Buenas noches" 한마디면 그 세계의 일부가 돼요.\n\n💡 들어서는 순간부터 탱고가 시작됩니다.',
    unlockAfterLesson: 'les5_01' },
  b19: { id: 'b19', category: 'etiquette', title: 'El cabeceo — la invitación silenciosa', titleKo: '카베세오 — 말보다 강한 눈의 초대', emoji: '👁️',
    content: '밀롱가에서 "같이 출래요?"라고 크게 말하지 않아요.\n\n시선을 맞추고(mirada),\n고개를 살짝 끄덕이면(cabeceo) — 그게 신청.\n\n눈을 피하면 "오늘은 아니에요".\n아무도 민망하지 않죠.\n\n💡 가장 우아한 신청법은 소리가 없어요.',
    unlockAfterLesson: 'les5_03', relatedTermIds: ['t_cabeceo'] },
  b20: { id: 'b20', category: 'music', title: 'Las cuatro grandes', titleKo: '4대 오케스트라 한 줄 소개', emoji: '🎻',
    content: '디 사를리 = 단정하고 명확한 박자\n다리엔소 = 짧고 강한 리듬\n트로일로 = 서정적이고 깊은 감정\n푸글리에세 = 극적이고 드라마틱\n\n각 오케스트라마다 춤의 느낌이 완전히 달라요.\n같은 스텝도 음악에 따라 다른 춤이 돼요.\n\n💡 음악을 알면 춤이 달라집니다.',
    unlockAfterLesson: 'les5_06', relatedTermIds: ['t_orquesta'] },
  b21: { id: 'b21', category: 'etiquette', title: 'No cortar la tanda', titleKo: '탄다 중간에 그만두면 안 되는 이유', emoji: '🚫',
    content: '탄다는 3~4곡의 약속이에요.\n\n중간에 "그만할게요"라고 하면\n상대에게 모욕으로 느껴질 수 있어요.\n\n정말 불편하면 곡이 끝난 후\n부드럽게 "Gracias"로 마무리.\n\n💡 탄다를 끝까지 추는 것이 밀롱가의 예의.',
    unlockAfterLesson: 'les5_09', relatedTermIds: ['t_tanda', 't_cortina'] },
  b22: { id: 'b22', category: 'etiquette', title: 'Decir que no con gracia', titleKo: '밀롱가의 NO — 거절은 나쁜 게 아니다', emoji: '🙏',
    content: '밀롱가에서 거절은 모욕이 아니에요.\n\n"Ahora estoy descansando"\n"Quizás más tarde"\n\n이 정도면 충분히 정중해요.\n\n중요한 건 표정과 톤.\n미소와 함께 말하면 상대도 이해해요.\n\n💡 거절할 줄 아는 것도 밀롱가 실력이에요.',
    unlockAfterLesson: 'les5_10' },
  b23: { id: 'b23', category: 'etiquette', title: 'La ronda — por qué en sentido contrario', titleKo: '론다 — 왜 반시계로 도는가', emoji: '🔄',
    content: '밀롱가 바닥에서 모든 커플은\n반시계 방향(ronda)으로 움직여요.\n\n왜? 모두가 같은 흐름으로 가야 안전하거든요.\n\n론다를 무시하고 역방향으로 가거나\n한 자리에서 안 움직이면 다른 커플에게 방해.\n\n💡 흐름을 지키는 것이 실력의 증거.',
    unlockAfterLesson: 'les5_14', relatedTermIds: ['t_ronda'] },
};

export function getBonusById(id: string): BonusCard | undefined {
  return bonusCards[id];
}

export function getBonusesForLesson(lessonId: string): BonusCard[] {
  return Object.values(bonusCards).filter((b) => b.unlockAfterLesson === lessonId);
}
