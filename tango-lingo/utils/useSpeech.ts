// 다중 음성 TTS — 남/여, 미국/영국, 스페인/아르헨 등
import * as Speech from 'expo-speech';
import { useCallback, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import type { LearningMode } from '../types';

export type VoiceGender = 'male' | 'female';
export type VoiceRegion = 'us' | 'gb' | 'es-es' | 'es-ar' | 'zh-cn';

export interface VoicePreset {
  id: string;
  label: string;
  flag: string;
  gender: VoiceGender;
  lang: string;       // BCP-47
  voiceName?: string; // OS·브라우저별 voice 이름 (있으면 우선)
}

export const VOICE_PRESETS: Record<LearningMode, VoicePreset[]> = {
  en: [
    { id: 'en-us-female', label: '미국 여자', flag: '🇺🇸', gender: 'female', lang: 'en-US', voiceName: 'Samantha,Google US English,Microsoft Zira' },
    { id: 'en-us-male',   label: '미국 남자', flag: '🇺🇸', gender: 'male',   lang: 'en-US', voiceName: 'Alex,Google US English Male,Microsoft David' },
    { id: 'en-gb-female', label: '영국 여자', flag: '🇬🇧', gender: 'female', lang: 'en-GB', voiceName: 'Karen,Daniel,Google UK English Female,Microsoft Hazel' },
    { id: 'en-gb-male',   label: '영국 남자', flag: '🇬🇧', gender: 'male',   lang: 'en-GB', voiceName: 'Daniel,Google UK English Male,Microsoft George' },
  ],
  es: [
    { id: 'es-es-female', label: '스페인 여자', flag: '🇪🇸', gender: 'female', lang: 'es-ES', voiceName: 'Monica,Google español,Microsoft Helena' },
    { id: 'es-es-male',   label: '스페인 남자', flag: '🇪🇸', gender: 'male',   lang: 'es-ES', voiceName: 'Jorge,Google español Male,Microsoft Pablo' },
    { id: 'es-ar-female', label: '아르헨 여자', flag: '🇦🇷', gender: 'female', lang: 'es-AR', voiceName: 'Microsoft Elena,Diego' },
    { id: 'es-ar-male',   label: '아르헨 남자', flag: '🇦🇷', gender: 'male',   lang: 'es-AR', voiceName: 'Diego,Microsoft Tomas' },
  ],
  zh: [
    { id: 'zh-cn-female', label: '중국 여자', flag: '🇨🇳', gender: 'female', lang: 'zh-CN', voiceName: 'Ting-Ting,Google 普通话(中国大陆),Microsoft Huihui,Microsoft Xiaoxiao' },
    { id: 'zh-cn-male',   label: '중국 남자', flag: '🇨🇳', gender: 'male',   lang: 'zh-CN', voiceName: 'Google 普通话 Male,Microsoft Kangkang,Microsoft Yunyang' },
    { id: 'zh-tw-female', label: '대만 여자', flag: '🇹🇼', gender: 'female', lang: 'zh-TW', voiceName: 'Mei-Jia,Microsoft Hanhan' },
  ],
};

/** 웹 환경에서 사용 가능한 voice 캐시 */
let webVoicesCache: SpeechSynthesisVoice[] | null = null;
function loadWebVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }
    const synth = window.speechSynthesis;
    const got = synth.getVoices();
    if (got.length > 0) { webVoicesCache = got; resolve(got); return; }
    // voiceschanged 이벤트 대기
    synth.addEventListener('voiceschanged', () => {
      webVoicesCache = synth.getVoices();
      resolve(webVoicesCache);
    }, { once: true });
    setTimeout(() => resolve(synth.getVoices()), 1000);
  });
}

function pickWebVoice(preset: VoicePreset): SpeechSynthesisVoice | null {
  if (!webVoicesCache || webVoicesCache.length === 0) return null;
  // 1) voiceName 매칭 (콤마로 여러 후보)
  if (preset.voiceName) {
    for (const name of preset.voiceName.split(',').map((s) => s.trim())) {
      const v = webVoicesCache.find((vv) => vv.name.toLowerCase().includes(name.toLowerCase()));
      if (v) return v;
    }
  }
  // 2) lang 매칭 + gender 추정
  const byLang = webVoicesCache.filter((v) => v.lang.toLowerCase().startsWith(preset.lang.toLowerCase().substring(0, 2)));
  if (byLang.length === 0) return null;
  // gender 추정: 이름에 male/female 키워드
  const female = byLang.find((v) => /female|woman|girl|she/i.test(v.name));
  const male = byLang.find((v) => /male|man|boy|he/i.test(v.name));
  if (preset.gender === 'female' && female) return female;
  if (preset.gender === 'male' && male) return male;
  return byLang[0];
}

export function useSpeech() {
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && !webVoicesCache) {
      loadWebVoices().then(() => setVoicesLoaded(true));
    } else {
      setVoicesLoaded(true);
    }
  }, []);

  /** 기본 음성 (첫 번째 preset) */
  const speak = useCallback((text: string, mode: LearningMode) => {
    const preset = VOICE_PRESETS[mode]?.[0];
    if (!preset) return;
    speakWith(text, preset);
  }, []);

  /** 특정 voice 지정 */
  const speakWith = useCallback((text: string, preset: VoicePreset) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = preset.lang;
      const voice = pickWebVoice(preset);
      if (voice) utter.voice = voice;
      utter.rate = 0.9;
      utter.pitch = preset.gender === 'female' ? 1.05 : 0.95;
      synth.speak(utter);
    } else {
      // 네이티브 (expo-speech)
      Speech.stop();
      Speech.speak(text, {
        language: preset.lang,
        rate: 0.85,
        pitch: preset.gender === 'female' ? 1.1 : 0.9,
      });
    }
  }, []);

  const stop = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    } else {
      Speech.stop();
    }
  }, []);

  return { speak, speakWith, stop, voicesLoaded };
}
