// 단어 학습 진도 store — 안다/모른다 분류 + SRS
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LearningMode } from '../types';

const STORAGE_KEY = '@tangolingo_vocab_v1';

export type WordStatus = 'unseen' | 'known' | 'learning';

interface LangVocab {
  // word → status
  status: Record<string, WordStatus>;
  // word → wrongCount (틀린 횟수)
  wrong: Record<string, number>;
  // word → lastReview (ISO date)
  lastReview: Record<string, string>;
  // 누적 학습 단어 수
  totalKnown: number;
  totalLearning: number;
}

interface VocabState {
  langs: Record<LearningMode, LangVocab>;
  loaded: boolean;
  load: () => Promise<void>;
  markKnown: (mode: LearningMode, word: string) => void;
  markLearning: (mode: LearningMode, word: string) => void;
  markUnseen: (mode: LearningMode, word: string) => void;
  getStatus: (mode: LearningMode, word: string) => WordStatus;
  resetLang: (mode: LearningMode) => void;
}

const empty = (): LangVocab => ({
  status: {}, wrong: {}, lastReview: {},
  totalKnown: 0, totalLearning: 0,
});

const today = () => new Date().toISOString().split('T')[0];

export const useVocabStore = create<VocabState>((set, get) => ({
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

  markKnown: (mode, word) => {
    const state = get();
    const lang = { ...state.langs[mode] };
    const prevStatus = lang.status[word];
    lang.status = { ...lang.status, [word]: 'known' };
    lang.lastReview = { ...lang.lastReview, [word]: today() };
    if (prevStatus !== 'known') lang.totalKnown += 1;
    if (prevStatus === 'learning') lang.totalLearning -= 1;
    set({ langs: { ...state.langs, [mode]: lang } });
    persist(get().langs);
  },

  markLearning: (mode, word) => {
    const state = get();
    const lang = { ...state.langs[mode] };
    const prevStatus = lang.status[word];
    lang.status = { ...lang.status, [word]: 'learning' };
    lang.wrong = { ...lang.wrong, [word]: (lang.wrong[word] ?? 0) + 1 };
    lang.lastReview = { ...lang.lastReview, [word]: today() };
    if (prevStatus !== 'learning') lang.totalLearning += 1;
    if (prevStatus === 'known') lang.totalKnown -= 1;
    set({ langs: { ...state.langs, [mode]: lang } });
    persist(get().langs);
  },

  markUnseen: (mode, word) => {
    const state = get();
    const lang = { ...state.langs[mode] };
    delete lang.status[word];
    set({ langs: { ...state.langs, [mode]: lang } });
    persist(get().langs);
  },

  getStatus: (mode, word) => get().langs[mode].status[word] ?? 'unseen',

  resetLang: (mode) => {
    const next = { ...get().langs, [mode]: empty() };
    set({ langs: next });
    persist(next);
  },
}));

async function persist(langs: Record<LearningMode, LangVocab>) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ langs }));
  } catch {}
}
