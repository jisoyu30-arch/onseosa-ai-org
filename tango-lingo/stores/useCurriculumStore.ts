import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calcCurrentDay, curriculum365 as curriculum100 } from '../data/curriculum-365';
import type { LearningMode } from '../types';

const STORAGE_KEY = '@tangolingo_curriculum_v1';

interface LangCurriculum {
  startDate: string;        // YYYY-MM-DD (학습 시작일)
}

interface CurriculumState {
  langs: Record<LearningMode, LangCurriculum>;
  loaded: boolean;
  load: () => Promise<void>;
  /** 시작일 리셋 */
  resetStart: (mode: LearningMode) => void;
  /** 오늘의 day 번호 (1~100) */
  getCurrentDay: (mode: LearningMode) => number;
  /** 시작일부터 오늘까지의 누적 day 목록 [1, 2, ..., today] */
  getActiveDays: (mode: LearningMode) => number[];
}

const todayStr = () => new Date().toISOString().split('T')[0];
const empty = (): LangCurriculum => ({ startDate: todayStr() });

export const useCurriculumStore = create<CurriculumState>((set, get) => ({
  langs: { es: empty(), en: empty(), zh: empty() },
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const merged = { ...get().langs };
        (['es', 'en', 'zh'] as LearningMode[]).forEach((m) => {
          merged[m] = { ...empty(), ...(data.langs?.[m] ?? {}) };
        });
        set({ langs: merged, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  resetStart: (mode) => {
    const next = { ...get().langs, [mode]: { startDate: todayStr() } };
    set({ langs: next });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ langs: next })).catch(() => {});
  },

  getCurrentDay: (mode) => {
    const lang = get().langs[mode];
    return calcCurrentDay(lang.startDate);
  },

  getActiveDays: (mode) => {
    const today = get().getCurrentDay(mode);
    return Array.from({ length: today }, (_, i) => i + 1);
  },
}));
