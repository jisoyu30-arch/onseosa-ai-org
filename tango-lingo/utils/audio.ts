import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import type { PracticeLanguage } from '../types';

// ===== Locale mapping =====
// Provider-agnostic: maps our language codes to TTS/STT locale strings.
// Swap these when changing TTS provider.

const TTS_LOCALE: Record<PracticeLanguage, string> = {
  es: 'es-AR',  // Argentine Spanish — vos form, porteño intonation
  zh: 'zh-CN',  // Mandarin Chinese
  ko: 'ko-KR',  // Korean
};

// STT locale hints (used by real STT providers)
export const STT_LOCALE: Record<PracticeLanguage, string> = {
  es: 'es-AR',
  zh: 'zh-CN',
  ko: 'ko-KR',
};

// Default speaking rates per language (normal / slow)
const RATE: Record<PracticeLanguage, { normal: number; slow: number }> = {
  es: { normal: 0.85, slow: 0.5 },  // Spanish needs slightly slower default
  zh: { normal: 0.9,  slow: 0.55 }, // Chinese tones need clarity
  ko: { normal: 0.95, slow: 0.6 },
};

// ===== TTS =====

export async function speak(text: string, lang: PracticeLanguage, slow = false) {
  const locale = TTS_LOCALE[lang];
  const rate = slow ? RATE[lang].slow : RATE[lang].normal;

  return new Promise<void>((resolve, reject) => {
    Speech.speak(text, {
      language: locale,
      rate,
      onDone: resolve,
      onError: (err) => reject(err),
    });
  });
}

export function stopSpeaking() {
  Speech.stop();
}

// ===== Recording =====

let currentRecording: Audio.Recording | null = null;

export async function requestMicPermission(): Promise<boolean> {
  const { granted } = await Audio.requestPermissionsAsync();
  return granted;
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
  await currentRecording.stopAndUnloadAsync();
  await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
  const uri = currentRecording.getURI();
  currentRecording = null;
  return uri;
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
