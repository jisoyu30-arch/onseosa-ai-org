import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, ReviewState } from '../types';

const STORAGE_KEY = '@tangolingo_progress';

interface ProgressStore extends UserProgress {
  loaded: boolean;
  load: () => Promise<void>;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  addWrongSentence: (sentenceId: string) => void;
  removeWrongSentence: (sentenceId: string) => void;
  updateStreak: () => void;
  _persist: () => Promise<void>;
}

const today = () => new Date().toISOString().split('T')[0];

export const useProgressStore = create<ProgressStore>((set, get) => ({
  completedLessons: [],
  xp: 0,
  streak: 0,
  lastStudyDate: '',
  wrongSentences: [],
  sentenceReviews: {},
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data: UserProgress = JSON.parse(raw);
        set({ ...data, loaded: true });
        // 스트릭 체크
        get().updateStreak();
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  completeLesson: (lessonId, xpEarned) => {
    const state = get();
    if (state.completedLessons.includes(lessonId)) {
      // 이미 완료한 레슨 — XP만 추가
      set({ xp: state.xp + Math.floor(xpEarned / 2) });
    } else {
      set({
        completedLessons: [...state.completedLessons, lessonId],
        xp: state.xp + xpEarned,
      });
    }
    // 스트릭 업데이트
    const todayStr = today();
    const lastDate = state.lastStudyDate;
    if (lastDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const newStreak = lastDate === yesterdayStr ? state.streak + 1 : 1;
      set({ streak: newStreak, lastStudyDate: todayStr });
    }
    get()._persist();
  },

  addWrongSentence: (sentenceId) => {
    const state = get();
    if (!state.wrongSentences.includes(sentenceId)) {
      set({ wrongSentences: [...state.wrongSentences, sentenceId] });
      get()._persist();
    }
  },

  removeWrongSentence: (sentenceId) => {
    set((s) => ({
      wrongSentences: s.wrongSentences.filter((id) => id !== sentenceId),
    }));
    get()._persist();
  },

  updateStreak: () => {
    const state = get();
    const todayStr = today();
    const lastDate = state.lastStudyDate;
    if (!lastDate) return;
    if (lastDate === todayStr) return; // 오늘 이미 학습

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate !== yesterdayStr && lastDate !== todayStr) {
      // 스트릭 깨짐
      set({ streak: 0 });
      get()._persist();
    }
  },

  _persist: async () => {
    const { loaded, load, completeLesson, addWrongSentence, removeWrongSentence, updateStreak, _persist, ...data } = get();
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // silent fail
    }
  },
}));
