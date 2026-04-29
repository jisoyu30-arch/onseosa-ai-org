// 즉석 번역 + 영구 캐시
// dialogue/sentence가 매칭되지 않을 때 Gemini로 ES → EN/ZH 번역
// AsyncStorage에 캐시 (다음 사용 시 즉시 반환)

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LearningMode } from '../types';

const CACHE_KEY = '@tangolingo_translation_cache_v2';
const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// 메모리 캐시 (앱 세션 동안)
const memoryCache = new Map<string, { en: string; zh: string }>();
let diskLoaded = false;

async function loadDisk() {
  if (diskLoaded) return;
  diskLoaded = true;
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      Object.entries(obj).forEach(([k, v]) => memoryCache.set(k, v as any));
    }
  } catch {}
}

async function saveDisk() {
  try {
    const obj: Record<string, any> = {};
    memoryCache.forEach((v, k) => { obj[k] = v; });
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch {}
}

const norm = (s: string) => s.trim().replace(/\s+/g, ' ');

// 진행 중인 fetch 중복 방지
const inFlight = new Map<string, Promise<{ en: string; zh: string }>>();

async function fetchTranslation(spanish: string): Promise<{ en: string; zh: string }> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;
  if (!apiKey || apiKey === 'your_key_here') {
    return { en: spanish, zh: spanish };  // 키 없으면 ES 그대로
  }

  const prompt = `Translate this Spanish (Argentine tango) sentence into English and Chinese (Simplified). Return ONLY valid JSON like:
{"en": "English translation", "zh": "中文翻译"}

Spanish: ${spanish}`;

  try {
    const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('empty');
    const parsed = JSON.parse(text) as { en: string; zh: string };
    return { en: parsed.en ?? spanish, zh: parsed.zh ?? spanish };
  } catch {
    return { en: spanish, zh: spanish };
  }
}

/** 캐시 우선, 없으면 fetch + 저장 */
export async function getTranslation(spanish: string): Promise<{ en: string; zh: string }> {
  await loadDisk();
  const key = norm(spanish);
  const cached = memoryCache.get(key);
  if (cached) return cached;

  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = fetchTranslation(spanish).then((result) => {
    memoryCache.set(key, result);
    saveDisk();
    inFlight.delete(key);
    return result;
  });
  inFlight.set(key, promise);
  return promise;
}

/** 동기로 캐시만 조회 (빠른 렌더용) */
export function getCached(spanish: string): { en: string; zh: string } | null {
  return memoryCache.get(norm(spanish)) ?? null;
}

/** 모드별 텍스트 추출 (캐시 또는 fallback) */
export function pickTextFromCache(spanish: string, mode: LearningMode, fallbackEn?: string, fallbackZh?: string): string {
  if (mode === 'es') return spanish;
  const c = getCached(spanish);
  if (mode === 'en') return c?.en ?? fallbackEn ?? spanish;
  return c?.zh ?? fallbackZh ?? spanish;
}
