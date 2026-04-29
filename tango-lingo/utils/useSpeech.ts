import * as Speech from 'expo-speech';
import { useCallback } from 'react';
import type { LearningMode } from '../types';

const LANG_CODES: Record<LearningMode, string> = {
  es: 'es-ES',    // 또는 'es-AR' 아르헨
  en: 'en-US',
  zh: 'zh-CN',
};

export function useSpeech() {
  const speak = useCallback((text: string, mode: LearningMode) => {
    Speech.stop();
    Speech.speak(text, {
      language: LANG_CODES[mode],
      rate: 0.85,
      pitch: 1.0,
    });
  }, []);

  const stop = useCallback(() => {
    Speech.stop();
  }, []);

  return { speak, stop };
}
