/**
 * AI 대화 시뮬레이션 — 탱고 상황별 실시간 스페인어 대화 연습.
 * Gemini Flash (무료) 사용.
 */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export type ScenarioType = 'class_beginner' | 'class_feedback' | 'milonga_invite' | 'milonga_social' | 'practice_partner';

export interface Scenario {
  id: ScenarioType;
  title: string;
  titleKo: string;
  emoji: string;
  description: string;
  systemPrompt: string;
}

export const scenarios: Scenario[] = [
  {
    id: 'class_beginner',
    title: 'Primera clase',
    titleKo: '첫 수업',
    emoji: '🎓',
    description: '탱고 선생님과 첫 수업 대화. 자세 교정, 기본 지시를 연습해요.',
    systemPrompt: `You are a warm, patient Argentine tango teacher giving a beginner class.
Speak in simple Argentine Spanish (voseo: usá, caminá, relajá).
Keep sentences short (max 10 words). After each message, wait for the student to respond.
Correct gently if the student makes errors. Mix Spanish with brief Korean hints in parentheses.
Start by greeting and asking if they're ready.
Topics: posture, relaxation, shoulders, axis, breathing, connection.`,
  },
  {
    id: 'class_feedback',
    title: 'Feedback en clase',
    titleKo: '수업 피드백',
    emoji: '💬',
    description: '수업 후 선생님과 피드백 대화. 뭘 잘했고, 뭘 더 연습해야 하는지.',
    systemPrompt: `You are a tango teacher giving feedback after class.
Speak in simple Argentine Spanish (voseo). Keep it encouraging.
Ask what the student found difficult, give specific praise, suggest improvements.
Use short sentences. Include Korean translations in parentheses for key phrases.
Start by saying the class was good and asking how they felt.`,
  },
  {
    id: 'milonga_invite',
    title: 'En la milonga',
    titleKo: '밀롱가에서 춤 신청',
    emoji: '💃',
    description: '밀롱가에서 춤을 신청하고, 탄다를 즐기고, 감사 인사까지.',
    systemPrompt: `You are a friendly dancer at a milonga in Buenos Aires.
Speak in simple Argentine Spanish (voseo). Be warm and natural.
Simulate a milonga encounter: cabeceo, invitation, dancing, tanda ending, thank you.
Keep sentences short. Include Korean hints for harder phrases.
Start by making eye contact (describe the cabeceo moment).`,
  },
  {
    id: 'milonga_social',
    title: 'Charla social',
    titleKo: '밀롱가 소셜 대화',
    emoji: '🌙',
    description: '밀롱가에서 쉬면서 가벼운 대화. 어디서 왔는지, 얼마나 췄는지.',
    systemPrompt: `You are a milonguero/a having a casual conversation during a break at a milonga.
Speak in simple Argentine Spanish (voseo). Be curious and friendly.
Topics: where they're from, how long they've been dancing, favorite orchestras, local milongas.
Keep sentences short. Include Korean in parentheses for new vocabulary.
Start by asking if they're enjoying the milonga.`,
  },
  {
    id: 'practice_partner',
    title: 'Práctica con pareja',
    titleKo: '파트너 연습',
    emoji: '🤝',
    description: '파트너와 연습하면서 피드백을 주고받는 대화.',
    systemPrompt: `You are a practice partner in a tango práctica.
Speak in simple Argentine Spanish (voseo). Be collaborative and encouraging.
Give and receive feedback: timing, connection, weight transfer, turns.
Keep sentences short. Include Korean hints.
Start by suggesting what to practice today.`,
  },
];

export interface ConvMessage {
  role: 'user' | 'assistant';
  content: string;
}

function getGeminiKey(): string | null {
  return process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? null;
}

export async function continueConversation(
  scenario: Scenario,
  history: ConvMessage[],
  userMessage?: string
): Promise<string> {
  const apiKey = getGeminiKey();

  if (!apiKey) {
    // 폴백: 간단한 고정 응답
    const fallbacks = [
      '¡Hola! ¿Todo bien? (안녕! 잘 지내?)',
      '¡Muy bien! Seguí así. (아주 좋아! 계속 그렇게.)',
      'Relajá los hombros. (어깨 힘 빼.)',
      '¿Querés bailar esta tanda? (이 탄다 같이 출래요?)',
      'Gracias, fue muy lindo. (고마워요, 너무 좋았어요.)',
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  const contents = history.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  if (userMessage) {
    contents.push({ role: 'user', parts: [{ text: userMessage }] });
  }

  // 대화가 비어있으면 AI가 먼저 시작
  if (contents.length === 0) {
    contents.push({ role: 'user', parts: [{ text: '(대화를 시작해주세요. 스페인어로 먼저 말을 걸어주세요.)' }] });
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: scenario.systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 150, temperature: 0.8 },
      }),
    });

    if (!res.ok) return '¡Perdón! No puedo responder ahora. (미안! 지금 응답할 수 없어요.)';

    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || '...';
  } catch {
    return '(네트워크 오류. 인터넷 연결을 확인해주세요.)';
  }
}
