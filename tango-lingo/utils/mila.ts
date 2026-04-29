// AI 롤플레이 엔진 "Mila" — 부에노스아이레스 밀롱가 베테랑 페르소나
// Gemini 2.5 Flash 호출 (가벼움·빠름·저렴)

import type { LearningMode } from '../types';

const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export interface MilaContext {
  mode: LearningMode;
  situation: string;        // "cabeceo", "tanda_invite" 등
  userLevel: 'A1' | 'A2' | 'B1' | 'B2';  // 사용자 수준
}

export interface MilaCorrection {
  wrong: string;        // 사용자가 쓴 잘못된 표현
  right: string;        // 바른 표현
  why: string;          // 한국어 설명
}

export interface MilaResponse {
  reply: string;              // 타겟 언어로 된 응답
  ko: string;                 // 한국어 번역
  correction?: MilaCorrection;  // 사용자 실수 교정 (있을 때)
  better?: MilaCorrection;      // 더 자연스러운 표현 추천 (실수 아니어도)
}

const SITUATION_LABELS: Record<string, string> = {
  cabeceo: '카베세오 (눈맞춤 초대)',
  tanda_invite: '탄다 초대/수락/거절',
  cortina: '코르티나 (쉬는 시간 대화)',
  abrazo: '아브라소 (포옹/자세 피드백)',
  compliment: '서로 칭찬',
  apology: '실수 사과',
  thanks: '탄다 후 감사',
  dj_request: 'DJ 신청곡',
  shoes: '신발·의상 얘기',
  milonga_chat: '밀롱가 잡담',
};

const LANG_NAMES: Record<LearningMode, string> = {
  es: 'Spanish (아르헨티나 부에노스아이레스 탱고 방언, voseo 사용)',
  en: 'English',
  zh: 'Chinese (간체)',
};

function buildSystemPrompt(ctx: MilaContext): string {
  const langName = LANG_NAMES[ctx.mode];
  const situation = SITUATION_LABELS[ctx.situation] ?? ctx.situation;

  return `You are **Mila**, a veteran milonguera from Buenos Aires (30 years dancing tango). You help Korean learners practice ${langName} in real milonga situations.

**Personality:** Warm, patient, encouraging. Uses tango vocabulary naturally.
**Situation:** ${situation}
**User level:** ${ctx.userLevel} (keep your language at this level)
**Reply length:** SHORT (1-3 sentences, real conversation, not lectures)

═══════════════════════════════════════════════════
**CRITICAL — How to handle the user's input:**

**Case A — User wrote in ${langName}:**
- Respond naturally in ${langName} (the "reply" field)
- If they made a grammar/vocabulary MISTAKE → fill "correction"
- If their sentence is correct but UNNATURAL → fill "better" with a more native phrasing
- Both "correction" and "better" use the same {wrong, right, why} structure

**Case B — User wrote in Korean (한국어로 도움 요청):**
- They want to know HOW to say something in ${langName}
- Put the ${langName} expression as your "reply"
- Put Korean explanation as "ko"
- DO NOT roleplay as Mila this turn — act as a tutor

**Case C — User wrote in mixed/other language:**
- Politely ask in Korean (in "reply") to use ${langName} or Korean

═══════════════════════════════════════════════════
**ALWAYS return ONLY valid JSON in this exact shape:**

{
  "reply": "your response in ${langName}",
  "ko": "한국어 번역 또는 설명",
  "correction": { "wrong": "사용자가 쓴 표현", "right": "바른 표현", "why": "왜 틀렸는지 한국어 설명" },
  "better": { "wrong": "사용자 표현", "right": "더 자연스러운 표현", "why": "왜 더 좋은지 한국어 설명" }
}

Omit "correction" or "better" fields if not needed. Always include "reply" and "ko".`;
}

export async function chatWithMila(
  history: ChatMessage[],
  ctx: MilaContext,
): Promise<MilaResponse> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;
  if (!apiKey || apiKey === 'your_key_here') {
    throw new Error('Gemini API 키가 설정되지 않았습니다. .env 파일에 EXPO_PUBLIC_GEMINI_KEY를 설정하세요.');
  }

  const systemPrompt = buildSystemPrompt(ctx);
  const contents = history.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        temperature: 0.9,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API 오류 (${res.status}): ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('빈 응답을 받았습니다.');
  }

  try {
    const parsed = JSON.parse(text) as MilaResponse;
    return parsed;
  } catch {
    // JSON 파싱 실패 시 원문을 reply로
    return { reply: text, ko: '(번역 실패)' };
  }
}
