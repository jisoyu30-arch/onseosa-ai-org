export interface Badge {
  id: string;
  title: string;
  titleKo: string;
  emoji: string;
  description: string;
  condition: {
    type: 'lessons_completed' | 'streak' | 'xp' | 'level_complete';
    value: number;
    levelId?: string;
  };
}

export const badges: Badge[] = [
  // 레슨 관련
  {
    id: 'b_first_lesson',
    title: 'Primer Paso',
    titleKo: '첫 걸음',
    emoji: '👣',
    description: '첫 레슨을 완료했어요!',
    condition: { type: 'lessons_completed', value: 1 },
  },
  {
    id: 'b_5_lessons',
    title: 'Estudiante',
    titleKo: '학생',
    emoji: '📖',
    description: '레슨 5개 완료',
    condition: { type: 'lessons_completed', value: 5 },
  },
  {
    id: 'b_10_lessons',
    title: 'Practicante',
    titleKo: '수련생',
    emoji: '🎓',
    description: '레슨 10개 완료',
    condition: { type: 'lessons_completed', value: 10 },
  },
  {
    id: 'b_20_lessons',
    title: 'Bailarín',
    titleKo: '댄서',
    emoji: '💃',
    description: '레슨 20개 완료',
    condition: { type: 'lessons_completed', value: 20 },
  },

  // 레벨 완료
  {
    id: 'b_lv1_complete',
    title: 'Abrazo Completo',
    titleKo: '아브라소 마스터',
    emoji: '🤗',
    description: 'Level 1 전체 완료!',
    condition: { type: 'level_complete', value: 1, levelId: 'lv1' },
  },
  {
    id: 'b_lv2_complete',
    title: 'Caminante',
    titleKo: '걷기 마스터',
    emoji: '🚶',
    description: 'Level 2 전체 완료!',
    condition: { type: 'level_complete', value: 1, levelId: 'lv2' },
  },
  {
    id: 'b_lv3_complete',
    title: 'Giro Maestro',
    titleKo: '히로 마스터',
    emoji: '🌀',
    description: 'Level 3 전체 완료!',
    condition: { type: 'level_complete', value: 1, levelId: 'lv3' },
  },

  // 연속 학습
  {
    id: 'b_streak_3',
    title: 'Constante',
    titleKo: '3일 연속',
    emoji: '🔥',
    description: '3일 연속 학습',
    condition: { type: 'streak', value: 3 },
  },
  {
    id: 'b_streak_7',
    title: 'Semana Completa',
    titleKo: '7일 연속',
    emoji: '⚡',
    description: '7일 연속 학습',
    condition: { type: 'streak', value: 7 },
  },
  {
    id: 'b_streak_14',
    title: 'Dedicado',
    titleKo: '2주 연속',
    emoji: '🌟',
    description: '14일 연속 학습',
    condition: { type: 'streak', value: 14 },
  },
  {
    id: 'b_streak_30',
    title: 'Imparable',
    titleKo: '한 달 연속',
    emoji: '👑',
    description: '30일 연속 학습!',
    condition: { type: 'streak', value: 30 },
  },

  // XP
  {
    id: 'b_xp_100',
    title: 'Cien Puntos',
    titleKo: 'XP 100 달성',
    emoji: '⭐',
    description: 'XP 100 달성',
    condition: { type: 'xp', value: 100 },
  },
  {
    id: 'b_xp_500',
    title: 'Medio Millar',
    titleKo: 'XP 500 달성',
    emoji: '🏅',
    description: 'XP 500 달성',
    condition: { type: 'xp', value: 500 },
  },
  {
    id: 'b_xp_1000',
    title: 'Milonguero',
    titleKo: 'XP 1000 달성',
    emoji: '🏆',
    description: 'XP 1000 달성!',
    condition: { type: 'xp', value: 1000 },
  },
];
