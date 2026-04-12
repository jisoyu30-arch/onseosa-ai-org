import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Platform, Alert } from 'react-native';
import type { PracticeLanguage } from '../types';

// ===== Locale mapping =====

// Primary + fallback locales per language
const TTS_LOCALE: Record<PracticeLanguage, string[]> = {
  es: ['es-AR', 'es-419', 'es-MX', 'es'],  // Argentine → Latin America → Mexico → generic
  zh: ['zh-CN', 'zh-Hans', 'zh'],
  ko: ['ko-KR', 'ko'],
};

export const STT_LOCALE: Record<PracticeLanguage, string> = {
  es: 'es-AR',
  zh: 'zh-CN',
  ko: 'ko-KR',
};

const RATE: Record<PracticeLanguage, { normal: number; slow: number }> = {
  es: { normal: 0.85, slow: 0.5 },
  zh: { normal: 0.9,  slow: 0.55 },
  ko: { normal: 0.95, slow: 0.6 },
};

// ===== TTS =====

/**
 * 사용 가능한 locale을 찾아서 TTS 실행.
 * es-AR 없으면 es-419 → es-MX → es 순서로 폴백.
 */
export async function speak(text: string, lang: PracticeLanguage, slow = false) {
  const locales = TTS_LOCALE[lang];
  const rate = slow ? RATE[lang].slow : RATE[lang].normal;

  // 사용 가능한 voice 확인
  let selectedLocale = locales[locales.length - 1]; // default fallback
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    if (voices && voices.length > 0) {
      for (const preferred of locales) {
        const match = voices.find((v) =>
          v.language.toLowerCase().startsWith(preferred.toLowerCase())
        );
        if (match) {
          selectedLocale = match.language;
          break;
        }
      }
    }
  } catch {
    // voice list 못 가져오면 첫 번째 locale 사용
    selectedLocale = locales[0];
  }

  return new Promise<void>((resolve) => {
    try {
      Speech.speak(text, {
        language: selectedLocale,
        rate,
        onDone: resolve,
        onError: () => {
          // 에러 나면 generic locale로 재시도
          try {
            Speech.speak(text, {
              language: locales[locales.length - 1],
              rate,
              onDone: resolve,
              onError: () => resolve(), // 두 번째도 실패하면 조용히 넘김
            });
          } catch {
            resolve();
          }
        },
      });
    } catch {
      resolve(); // 완전 실패 시 조용히 넘김
    }
  });
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch {}
}

// ===== Recording =====

let currentRecording: Audio.Recording | null = null;

export async function requestMicPermission(): Promise<boolean> {
  try {
    const { granted } = await Audio.requestPermissionsAsync();
    return granted;
  } catch {
    return false;
  }
}

export async function startRecording(): Promise<Audio.Recording> {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  currentRecording = recording;
  return recording;
}

export async function stopRecording(): Promise<string | null> {
  if (!currentRecording) return null;
  try {
    await currentRecording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    const uri = currentRecording.getURI();
    currentRecording = null;
    return uri;
  } catch {
    currentRecording = null;
    return null;
  }
}

// ===== Playback =====

let currentSound: Audio.Sound | null = null;

export async function playRecordedAudio(uri: string): Promise<void> {
  await stopPlayback();
  const { sound } = await Audio.Sound.createAsync({ uri });
  currentSound = sound;
  await sound.playAsync();

  return new Promise<void>((resolve) => {
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        resolve();
      }
    });
  });
}

export async function stopPlayback() {
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch {}
    currentSound = null;
  }
}
