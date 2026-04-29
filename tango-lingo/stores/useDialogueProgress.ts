import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LearningMode } from '../types';

const STORAGE_KEY = '@tangolingo_dialogue_progress_v1';

interface LangProgress {
  completedIds: string[];      // 완료한 dialogue id 목록
  lastStudyDate: string;       // YYYY-MM-DD
  streak: number;              // 연속 학습일
  xp: number;                  // 언어별 XP
}

interface DialogueProgressState {
  langs: Record<LearningMode, LangProgress>;
  loaded: boolean;
  load: () => Promise<void>;
  completeDialogue: (mode: LearningMode, dialogueId: string, xpGain?: number) => void;
  isCompleted: (mode: LearningMode, dialogueId: string) => boolean;
  resetLang: (mode: LearningMode) => void;
  resetAll: () => void;
}

const todayStr = () => new Date().toISOString().split('T')[0];
const empty = (): LangProgress => ({ completedIds: [], lastStudyDate: '', streak: 0, xp: 0 });

export const useDialogueProgress = create<DialogueProgressState>((set, get) => ({
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

  completeDialogue: (mode, dialogueId, xpGain = 10) => {
    const state = get();
    const lang = { ...state.langs[mode] };
    if (lang.completedIds.includes(dialogueId)) return;   // 중복 방지

    lang.completedIds = [...lang.completedIds, dialogueId];
    lang.xp = lang.xp + xpGain;

    // 스트릭 갱신
    const today = todayStr();
    if (lang.lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const ystr = yesterday.toISOString().split('T')[0];
      if (lang.lastStudyDate === ystr) {
        lang.streak = lang.streak + 1;
      } else if (lang.lastStudyDate === '') {
        lang.streak = 1;
      } else {
        lang.streak = 1;
      }
      lang.lastStudyDate = today;
    }

    const nextLangs = { ...state.langs, [mode]: lang };
    set({ langs: nextLangs });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ langs: nextLangs })).catch(() => {});
  },

  isCompleted: (mode, dialogueId) => {
    return get().langs[mode]?.completedIds.includes(dialogueId) ?? false;
  },

  resetLang: (mode) => {
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
