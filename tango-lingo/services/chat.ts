/**
 * AI Chat service — 탱고 문화 + 스페인어 질문 답변.
 *
 * 우선순위:
 * 1. Gemini Flash (무료) — EXPO_PUBLIC_GEMINI_API_KEY
 * 2. 로컬 FAQ 폴백 (API 키 없을 때)
 */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are a friendly tango teacher and Spanish language assistant for a Korean couple learning Argentine tango.

Your role:
- Answer questions about tango culture, milonga etiquette, tango vocabulary, and history
- Explain Spanish grammar, especially Argentine Spanish (voseo)
- Keep answers short (2-4 sentences max)
- Use Korean as the primary response language
- Include the Spanish term in parentheses when explaining tango vocabulary
- Be warm and encouraging, like a patient tango teacher

Examples of good answers:
- "아브라소(abrazo)는 탱고에서 두 사람이 춤추기 위한 연결 자세예요. 단순히 안는 게 아니라, 가슴과 등으로 의도를 전달하는 구조랍니다."
- "Vos는 아르헨티나에서 'tú' 대신 쓰는 2인칭이에요. 그래서 '걸어'가 'camina'가 아니라 'caminá'로 악센트가 바뀌어요."`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function getGeminiKey(): string | null {
  return process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? null;
}

// ===== 로컬 FAQ 폴백 =====

const FAQ: Record<string, string> = {
  'abrazo': '아브라소(abrazo)는 탱고에서 두 사람의 연결 자세예요. 힘이 아니라 의도로 만드는 포옹 구조입니다.',
  'mirada': '미라다(mirada)는 밀롱가에서 눈맞춤으로 춤을 신청하는 방법이에요. 카베세오의 첫 단계입니다.',
  'cabeceo': '카베세오(cabeceo)는 눈맞춤 + 고개 끄덕임으로 춤을 신청하는 밀롱가 전통이에요.',
  'tanda': '탄다(tanda)는 같은 오케스트라 곡 3~4곡의 세트예요. 한 파트너와 추는 단위입니다.',
  'cortina': '코르티나(cortina)는 탄다 사이에 흐르는 짧은 비탱고 음악이에요. 파트너를 바꾸라는 신호입니다.',
  'voseo': 'Voseo는 아르헨티나 스페인어에서 "tú" 대신 "vos"를 쓰는 거예요. "caminas" → "caminás"로 바뀝니다.',
  'milonga': '밀롱가(milonga)는 탱고를 추는 사교 댄스 장소/이벤트예요. 또한 탱고의 한 장르 이름이기도 합니다.',
  'eje': '에헤(eje)는 몸의 수직 중심선, 축이에요. 이게 무너지면 모든 동작이 불안정해집니다.',
  'ocho': '오초(ocho)는 바닥에 8자를 그리듯 피벗하며 교차하는 스텝이에요.',
  'giro': '히로(giro)는 파트너 주위를 원으로 도는 동작이에요. 앞-옆-뒤 3스텝으로 구성됩니다.',
  'ronda': '론다(ronda)는 밀롱가에서 반시계 방향으로 도는 플로어 흐름이에요.',
  'salida': '살리다(salida)는 탱고 시작 패턴이에요. "밖으로 나가는" 첫 스텝을 의미합니다.',
  'adorno': '아도르노(adorno)는 음악 틈에 넣는 자유로운 발 장식 동작이에요.',
  'parada': '파라다(parada)는 파트너의 발을 부드럽게 멈추는 동작이에요.',
  'boleo': '볼레오(boleo)는 에너지가 다리를 통해 자유롭게 빠지는 동작이에요. 억지로 크게 하면 위험합니다.',
};

function localFaqAnswer(question: string): string | null {
  const q = question.toLowerCase();
  for (const [key, answer] of Object.entries(FAQ)) {
    if (q.includes(key)) return answer;
  }
  return null;
}

// ===== Gemini API =====

async function askGemini(question: string, history: ChatMessage[]): Promise<string> {
  const apiKey = getGeminiKey();
  if (!apiKey) return '';

  // Gemini format: contents array
  const contents = [
    // 시스템 프롬프트를 첫 user 메시지로
    ...history.slice(-6).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ];

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      console.error('[chat] Gemini error:', res.status);
      return '';
    }

    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err) {
    console.error('[chat] Gemini fetch failed:', err);
    return '';
  }
}

// ===== Public API =====

export async function askTangoAI(
  question: string,
  history: ChatMessage[] = []
): Promise<string> {
  const faqAnswer = localFaqAnswer(question);

  // Gemini 시도
  const geminiAnswer = await askGemini(question, history);
  if (geminiAnswer) return geminiAnswer;

  // 폴백: FAQ
  if (faqAnswer) return faqAnswer;

  return '죄송해요, 지금은 답변을 드리기 어려워요. Gemini API 키를 설정하거나 나중에 다시 시도해주세요.';
}
