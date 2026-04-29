import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LearningMode } from '../types';

const STORAGE_KEY = '@tangolingo_goals_v1';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

// 레벨별 필요 "학습 세션" 수 (대화 세트 또는 레슨 기준)
export const LEVEL_TARGETS: Record<CefrLevel, number> = {
  A1: 40,
  A2: 100,
  B1: 200,
  B2: 400,
  C1: 800,
};

export const LEVEL_LABELS: Record<CefrLevel, string> = {
  A1: '기초 생존',
  A2: '일상 대화',
  B1: '자연스러운 대화',
  B2: '자유로운 대화',
  C1: '전문 토론',
};

export interface LangGoal {
  targetLevel: CefrLevel;
  targetDate: string;
  startDate: string;
  weekdaysOnly: boolean;   // 주 5일 모드
}

interface GoalState {
  goals: Record<LearningMode, LangGoal>;
  loaded: boolean;
  load: () => Promise<void>;
  setGoal: (mode: LearningMode, goal: Partial<LangGoal>) => void;
  computePace: (mode: LearningMode, completedSessions: number) => {
    daysLeft: number;
    sessionsLeft: number;
    dailyPace: number;
    progressPct: number;
    onTrack: boolean;
  };
}

const todayStr = () => new Date().toISOString().split('T')[0];
const addMonths = (n: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d.toISOString().split('T')[0];
};

const defaultGoals: Record<LearningMode, LangGoal> = {
  es: { targetLevel: 'B2', targetDate: addMonths(18), startDate: todayStr(), weekdaysOnly: true },
  en: { targetLevel: 'B2', targetDate: addMonths(18), startDate: todayStr(), weekdaysOnly: true },
  zh: { targetLevel: 'B1', targetDate: addMonths(18), startDate: todayStr(), weekdaysOnly: true },
};

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: defaultGoals,
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const merged = { ...defaultGoals };
        (['es', 'en', 'zh'] as LearningMode[]).forEach((m) => {
          merged[m] = { ...defaultGoals[m], ...(data.goals?.[m] ?? {}) };
        });
        set({ goals: merged, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  setGoal: (mode, partial) => {
    const next = { ...get().goals, [mode]: { ...get().goals[mode], ...partial } };
    set({ goals: next });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ goals: next })).catch(() => {});
  },

  computePace: (mode, completedSessions) => {
    const goal = get().goals[mode];
    const target = LEVEL_TARGETS[goal.targetLevel];
    const sessionsLeft = Math.max(0, target - completedSessions);
    const progressPct = Math.min(100, Math.round((completedSessions / target) * 100));

    const msLeft = new Date(goal.targetDate).getTime() - Date.now();
    const calendarDays = Math.max(1, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
    const daysLeft = goal.weekdaysOnly ? Math.max(1, Math.round(calendarDays * 5 / 7)) : calendarDays;
    const dailyPace = Math.ceil(sessionsLeft / daysLeft);

    // 페이스 체크
    const totalCalDays = Math.max(
      1,
      Math.ceil((new Date(goal.targetDate).getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24)),
    );
    const totalDays = goal.weekdaysOnly ? Math.round(totalCalDays * 5 / 7) : totalCalDays;
    const elapsed = totalDays - daysLeft;
    const expected = Math.round((elapsed / totalDays) * target);
    const onTrack = completedSessions >= expected * 0.9;

    return { daysLeft, sessionsLeft, dailyPace, progressPct, onTrack };
  },
}));
