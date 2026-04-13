import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@tangolingo_theme';

type ThemeMode = 'light' | 'dark';

interface ThemeStore {
  mode: ThemeMode;
  loaded: boolean;
  load: () => Promise<void>;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'light',
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ mode: raw as ThemeMode, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  toggle: () => {
    const next = get().mode === 'light' ? 'dark' : 'light';
    set({ mode: next });
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  },

  setMode: (mode) => {
    set({ mode });
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
  },
}));
