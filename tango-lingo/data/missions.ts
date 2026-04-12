import type { CoupleMission } from '../types';

export const coupleMissions: Record<string, CoupleMission> = {
  // =====================================================
  // LEVEL 1 — 3 missions
  // =====================================================

  m01: {
    id: 'm01',
    title: '서로 눈 맞추기 10초',
    description:
      '파트너와 마주 앉아서 10초간 눈을 맞춰보세요.\n\n' +
      '탱고의 미라다처럼, 말 없이 눈으로 연결해보는 거예요.\n' +
      '웃어도 괜찮아요 — 그게 자연스러운 거니까!',
    type: 'practice',
    unlockAfterLesson: 'les1_03',
    xpReward: 15,
  },
  m02: {
    id: 'm02',
    title: '파트너에게 "Relajá" 말하기',
    description:
      '파트너의 어깨를 가볍게 터치하면서\n' +
      '"Relajá los hombros"라고 말해보세요.\n\n' +
      '역할을 바꿔서 한 번씩!\n' +
      '스페인어로 말하면 왠지 선생님 같은 느낌이 들 거예요.',
    type: 'practice',
    unlockAfterLesson: 'les1_06',
    xpReward: 15,
  },
  m03: {
    id: 'm03',
    title: '아브라소 잡고 "Sentí la conexión"',
    description:
      '파트너와 오픈 아브라소를 잡고 5초 유지하세요.\n' +
      '그 다음 클로즈 아브라소로 바꿔보세요.\n\n' +
      '바꾸는 순간, "Sentí la conexión"이라고 말해보세요.\n' +
      '연결이 달라지는 걸 느낄 수 있을 거예요.',
    type: 'practice',
    unlockAfterLesson: 'les1_09',
    xpReward: 20,
  },

  // =====================================================
  // LEVEL 2 — 3 missions
  // =====================================================

  m04: {
    id: 'm04',
    title: '멈춤 연습 — 같이 멈추기',
    description:
      '음악을 틀고 파트너와 같이 걸어보세요.\n' +
      '한 사람이 "Pará"라고 하면 둘 다 멈추기.\n\n' +
      '3번 번갈아 해보세요.\n' +
      '멈추는 순간에도 연결이 유지되나요?',
    type: 'practice',
    unlockAfterLesson: 'les2_04',
    xpReward: 20,
  },
  m05: {
    id: 'm05',
    title: '"Más despacio" / "Un poco más rápido"',
    description:
      '파트너와 걸으면서 속도를 바꿔보세요.\n\n' +
      '"Más despacio" → 느리게\n' +
      '"Un poco más rápido" → 빠르게\n\n' +
      '번갈아 지시하면서 3번씩!',
    type: 'practice',
    unlockAfterLesson: 'les2_08',
    xpReward: 15,
  },
  m06: {
    id: 'm06',
    title: '"Caminemos juntos" 30초 걷기',
    description:
      '음악을 틀고 "Caminemos juntos"라고 말한 뒤\n' +
      '30초간 같은 리듬으로 걸어보세요.\n\n' +
      '말 없이, 몸으로만 리듬을 맞춰보는 거예요.\n' +
      '30초가 생각보다 길 거예요!',
    type: 'practice',
    unlockAfterLesson: 'les2_11',
    xpReward: 20,
  },

  // =====================================================
  // LEVEL 3 — 3 missions
  // =====================================================

  m07: { id: 'm07', title: '"Más suave / Menos fuerza" 팔 힘 조절', description: '파트너에게 "Más suave" / "Menos fuerza" 말하면서\n서로의 팔 힘을 조절해보세요.\n\n한 사람씩 번갈아 피드백!', type: 'practice', unlockAfterLesson: 'les3_03', xpReward: 20 },
  m08: { id: 'm08', title: '"¿Así está bien?" 대화 3번', description: '"¿Así está bien?" — "Sí, perfecto"\n이 대화를 3번 반복해보세요.\n\n역할을 바꿔서도 해보세요.', type: 'conversation', unlockAfterLesson: 'les3_07', xpReward: 15 },
  m09: { id: 'm09', title: '오초 하면서 "Pivotá" 말하기', description: '오초를 하면서 "Pivotá" / "Girá la cadera" 말해보기.\n\n말하면서 하면 더 어렵지만,\n스페인어가 몸에 붙기 시작해요!', type: 'challenge', unlockAfterLesson: 'les3_10', xpReward: 25 },

  // =====================================================
  // LEVEL 4 — 3 missions
  // =====================================================

  m10: { id: 'm10', title: '"Otra vez / Más despacio / Así está mejor?"로만 대화 3회', description: '이 3문장만 써서 파트너와 미니 대화를 해보세요.\n\nA: "Otra vez, por favor."\nB: "¿Así está mejor?"\nA: "Más despacio..."\nB: "¿Ahora sí?"\n\n3번 반복!', type: 'conversation', unlockAfterLesson: 'les4_04', xpReward: 20 },
  m11: { id: 'm11', title: '연습 후 진짜 피드백 교환', description: '연습이 끝난 후 파트너에게\n\n"Estuvo muy bien" 또는\n"Sentí algo raro"\n\n진짜 느낀 대로 스페인어로 한마디씩 교환해보세요.\n솔직하되 따뜻하게!', type: 'conversation', unlockAfterLesson: 'les4_08', xpReward: 25 },
  m12: { id: 'm12', title: '2분간 스페인어 Only 피드백', description: '파트너와 2분간 스페인어로만 연습 피드백 대화.\n\n쓸 수 있는 표현:\nOtra vez / Más despacio / Ahora está mejor /\nNo lo siento bien / Probemos de nuevo /\nFue un placer\n\n2분이 생각보다 길 거예요!', type: 'challenge', unlockAfterLesson: 'les4_11', xpReward: 30 },

  // =====================================================
  // LEVEL 5 — 4 missions
  // =====================================================

  m13: { id: 'm13', title: '카베세오 연습 — 3미터 거리', description: '파트너와 3미터 거리에서 카베세오 연습.\n\n눈맞춤만으로 신청+수락.\n말 없이 눈으로만!\n\n성공하면 가까이 가서 "¿Bailamos?"', type: 'practice', unlockAfterLesson: 'les5_03', xpReward: 25 },
  m14: { id: 'm14', title: '파트너에게 스페인어 칭찬 1개', description: '파트너에게 진심으로 스페인어 칭찬 1개.\n\n"Tu abrazo es muy cómodo"\n"Me gusta cómo caminás"\n"Bailás con mucho sentimiento"\n\n진심을 담아서!', type: 'conversation', unlockAfterLesson: 'les5_07', xpReward: 30 },
  m15: { id: 'm15', title: '코르티나 후 인사 연습', description: '"Gracias por la tanda" +\n"Fue muy lindo"\n\n코르티나가 나왔다고 상상하고\n인사를 연습해보세요.', type: 'practice', unlockAfterLesson: 'les5_09', xpReward: 20 },
  m16: { id: 'm16', title: '밀롱가 실전 카베세오 (최종 도전!)', description: '실제 밀롱가에서 카베세오로 춤을 신청해보세요.\n\n긴장되겠지만, 눈이 마주치는 순간\n"탱고는 시선에서 시작된다"를 느낄 거예요.\n\n성공하든 안 하든, 시도 자체가 50 XP!', type: 'challenge', unlockAfterLesson: 'les5_15', xpReward: 50 },
};

export function getMissionById(id: string): CoupleMission | undefined {
  return coupleMissions[id];
}

export function getMissionsForLesson(lessonId: string): CoupleMission[] {
  return Object.values(coupleMissions).filter((m) => m.unlockAfterLesson === lessonId);
}
