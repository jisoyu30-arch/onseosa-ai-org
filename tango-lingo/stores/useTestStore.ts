// 챕터 시험 결과 저장 — 자동 레벨 산정에 반영
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LearningMode } from '../types';

const STORAGE_KEY = '@tangolingo_test_v1';

interface LangTest {
  totalCorrect: number;
  totalWrong: number;
  attempts: number;
  bestScore: number;       // 0~100
  lastDate: string;
}

interface TestState {
  langs: Record<LearningMode, LangTest>;
  loaded: boolean;
  load: () => Promise<void>;
  recordResult: (mode: LearningMode, correct: number, wrong: number) => void;
  reset: (mode: LearningMode) => void;
  resetAll: () => void;
}

const empty = (): LangTest => ({
  totalCorrect: 0, totalWrong: 0, attempts: 0, bestScore: 0, lastDate: '',
});

export const useTestStore = create<TestState>((set, get) => ({
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

  recordResult: (mode, correct, wrong) => {
    const state = get();
    const lang = { ...state.langs[mode] };
    lang.totalCorrect += correct;
    lang.totalWrong += wrong;
    lang.attempts += 1;
    const score = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    lang.bestScore = Math.max(lang.bestScore, score);
    lang.lastDate = new Date().toISOString().split('T')[0];
    const next = { ...state.langs, [mode]: lang };
    set({ langs: next });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ langs: next })).catch(() => {});
  },

  reset: (mode) => {
    const next = { ...get().langs, [mode]: empty() };
    set({ langs: next });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ langs: next })).catch(() => {});
  },

  resetAll: () => {
    const next = { es: empty(), en: empty(), zh: empty() };
    set({ langs: next });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ langs: next })).catch(() => {});
  },
}));
