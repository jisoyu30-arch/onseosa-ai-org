/**
 * Speech service — multi-language, Whisper API + mock fallback.
 *
 * Modes (EXPO_PUBLIC_SPEECH_MODE):
 *   "mock": simulated transcription, no network (default if no API key)
 *   "real": OpenAI Whisper API
 *
 * Env vars for real mode:
 *   EXPO_PUBLIC_SPEECH_MODE=real
 *   EXPO_PUBLIC_OPENAI_API_KEY=sk-...
 */

import type { SpeechTranscriptionResult, PracticeLanguage } from '../types';
import { STT_LOCALE } from '../utils/audio';
import { Platform } from 'react-native';

const WHISPER_URL = 'https://api.openai.com/v1/audio/transcriptions';

function getApiKey(): string | null {
  return process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? null;
}

function getMode(): 'mock' | 'real' {
  const mode = process.env.EXPO_PUBLIC_SPEECH_MODE;
  if (mode === 'real' && getApiKey()) return 'real';
  return 'mock';
}

// ===== Mock transcription =====

function mockTranscribe(expectedSentence: string, lang: PracticeLanguage): SpeechTranscriptionResult {
  const shouldDrop = Math.random() < 0.3;

  if (lang === 'zh') {
    const chars = [...expectedSentence];
    if (shouldDrop && chars.length > 2) {
      const dropIdx = Math.floor(Math.random() * chars.length);
      return { text: chars.filter((_, i) => i !== dropIdx).join(''), confidence: 0.7 };
    }
    return { text: expectedSentence, confidence: 0.95 };
  }

  const words = expectedSentence.split(' ');
  if (shouldDrop && words.length > 2) {
    const dropIdx = Math.floor(Math.random() * words.length);
    return { text: words.filter((_, i) => i !== dropIdx).join(' '), confidence: 0.7 };
  }

  return { text: expectedSentence, confidence: 0.95 };
}

// ===== Whisper API transcription =====

async function whisperTranscribe(
  audioUri: string,
  lang: PracticeLanguage
): Promise<SpeechTranscriptionResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[speech] No OPENAI_API_KEY, falling back to mock');
    return { text: '', confidence: 0 };
  }

  // Whisper language codes (ISO 639-1)
  const whisperLang: Record<PracticeLanguage, string> = {
    es: 'es',
    zh: 'zh',
    ko: 'ko',
  };

  const formData = new FormData();

  // React Native FormData에 파일 첨부
  const fileExtension = audioUri.split('.').pop() || 'm4a';
  const mimeType = fileExtension === 'webm' ? 'audio/webm'
    : fileExtension === 'wav' ? 'audio/wav'
    : 'audio/m4a';

  formData.append('file', {
    uri: audioUri,
    type: mimeType,
    name: `recording.${fileExtension}`,
  } as any);

  formData.append('model', 'whisper-1');
  formData.append('language', whisperLang[lang]);
  formData.append('response_format', 'json');

  try {
    const res = await fetch(WHISPER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        // Content-Type은 FormData가 자동 설정
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[speech] Whisper API error:', res.status, errorText);
      return { text: '', confidence: 0 };
    }

    const json = await res.json();
    return {
      text: json.text || '',
      confidence: json.text ? 0.9 : 0,
    };
  } catch (err) {
    console.error('[speech] Whisper fetch failed:', err);
    return { text: '', confidence: 0 };
  }
}

// ===== Public API =====

export async function transcribeAudio(
  audioUri: string,
  expectedSentence: string,
  lang: PracticeLanguage = 'es'
): Promise<SpeechTranscriptionResult> {
  const mode = getMode();

  if (mode === 'mock') {
    await new Promise((r) => setTimeout(r, 800));
    return mockTranscribe(expectedSentence, lang);
  }

  try {
    const result = await whisperTranscribe(audioUri, lang);
    // Whisper가 빈 결과를 반환하면 mock 폴백
    if (!result.text) {
      console.warn('[speech] Whisper returned empty, falling back to mock');
      return mockTranscribe(expectedSentence, lang);
    }
    return result;
  } catch (err) {
    console.error('[speech] transcription failed, falling back to mock:', err);
    return mockTranscribe(expectedSentence, lang);
  }
}
