import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '../types';

const STORAGE_KEY = '@tangolingo_settings';

interface SettingsStore extends Settings {
  loaded: boolean;
  load: () => Promise<void>;
  update: (partial: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  notificationEnabled: true,
  notificationHour: 20,
  notificationMinute: 0,
  showEnglish: false,
  showChinese: false,
  learningMode: 'es',
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ ...JSON.parse(raw), loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  update: (partial) => {
    set(partial);
    const { loaded, load, update, ...data } = get();
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  },
}));
