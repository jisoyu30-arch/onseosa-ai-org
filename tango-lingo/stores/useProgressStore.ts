import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, ReviewState } from '../types';
import { createReviewState, markCorrect, markWrong, getDueReviews } from '../utils/spaced-repetition';

const STORAGE_KEY = '@tangolingo_progress';

interface ProgressStore extends UserProgress {
  loaded: boolean;
  load: () => Promise<void>;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  addWrongSentence: (sentenceId: string) => void;
  removeWrongSentence: (sentenceId: string) => void;
  reviewCorrect: (sentenceId: string) => void;
  reviewWrong: (sentenceId: string) => void;
  getDueReviewIds: () => string[];
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
      set({ xp: state.xp + Math.floor(xpEarned / 2) });
    } else {
      set({
        completedLessons: [...state.completedLessons, lessonId],
        xp: state.xp + xpEarned,
      });
    }
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
    }
    // 간격 반복에 등록 (이미 있으면 오답 처리)
    const reviews = { ...state.sentenceReviews };
    if (reviews[sentenceId]) {
      reviews[sentenceId] = markWrong(reviews[sentenceId]);
    } else {
      reviews[sentenceId] = createReviewState();
    }
    set({ sentenceReviews: reviews });
    get()._persist();
  },

  removeWrongSentence: (sentenceId) => {
    set((s) => ({
      wrongSentences: s.wrongSentences.filter((id) => id !== sentenceId),
    }));
    get()._persist();
  },

  reviewCorrect: (sentenceId) => {
    const state = get();
    const reviews = { ...state.sentenceReviews };
    if (reviews[sentenceId]) {
      reviews[sentenceId] = markCorrect(reviews[sentenceId]);
    }
    // 틀린 문장 목록에서 제거
    const wrongSentences = state.wrongSentences.filter((id) => id !== sentenceId);
    set({ sentenceReviews: reviews, wrongSentences, xp: state.xp + 5 });
    get()._persist();
  },

  reviewWrong: (sentenceId) => {
    const state = get();
    const reviews = { ...state.sentenceReviews };
    if (reviews[sentenceId]) {
      reviews[sentenceId] = markWrong(reviews[sentenceId]);
    } else {
      reviews[sentenceId] = createReviewState();
    }
    set({ sentenceReviews: reviews });
    get()._persist();
  },

  getDueReviewIds: () => {
    return getDueReviews(get().sentenceReviews);
  },

  updateStreak: () => {
    const state = get();
    const todayStr = today();
    const lastDate = state.lastStudyDate;
    if (!lastDate) return;
    if (lastDate === todayStr) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (lastDate !== yesterdayStr && lastDate !== todayStr) {
      set({ streak: 0 });
      get()._persist();
    }
  },

  _persist: async () => {
    const { loaded, load, completeLesson, addWrongSentence, removeWrongSentence, reviewCorrect, reviewWrong, getDueReviewIds, updateStreak, _persist, ...data } = get();
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  },
}));
