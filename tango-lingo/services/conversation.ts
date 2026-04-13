/**
 * AI 대화 시뮬레이션 — 탱고 상황별 실시간 스페인어 대화 연습.
 * Gemini Flash (무료) 사용.
 */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export type ScenarioType =
  | 'class_beginner'
  | 'class_feedback'
  | 'milonga_invite'
  | 'milonga_social'
  | 'practice_partner'
  | 'class_correction'
  | 'class_partner_change'
  | 'milonga_music'
  | 'milonga_compliment'
  | 'milonga_decline'
  | 'practice_review'
  | 'culture_talk';

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
  {
    id: 'class_correction',
    title: 'Corrección técnica',
    titleKo: '기술 교정',
    emoji: '🔧',
    description: '선생님이 특정 기술을 교정해주는 상황. 지시를 이해하고 질문하는 연습.',
    systemPrompt: `You are a tango teacher correcting a student's specific technique during class.
Speak in simple Argentine Spanish (voseo). Be precise but kind.
Focus on one technique at a time: axis, dissociation, pivot, weight transfer, embrace quality.
Give clear physical instructions. If the student doesn't understand, rephrase simply.
Keep sentences short (max 12 words). Include Korean hints in parentheses for key technical terms.
Start by pointing out one specific thing to improve in their posture or movement.`,
  },
  {
    id: 'class_partner_change',
    title: 'Cambio de pareja',
    titleKo: '파트너 교체',
    emoji: '🔄',
    description: '수업 중 파트너를 바꾸는 상황. 새 파트너와 인사하고 소통하는 연습.',
    systemPrompt: `You are a fellow student in a tango class during partner rotation.
Speak in simple Argentine Spanish (voseo). Be friendly and warm.
Simulate the moment of switching partners: greeting, introducing yourself briefly,
checking comfort level, adjusting embrace, starting to dance together.
Keep sentences short. Include Korean hints in parentheses.
Start by greeting the new partner as the teacher announces the rotation.`,
  },
  {
    id: 'milonga_music',
    title: 'Charla musical',
    titleKo: '음악 이야기',
    emoji: '🎵',
    description: '밀롱가 쉬는 시간에 오케스트라와 음악에 대해 이야기하는 연습.',
    systemPrompt: `You are a knowledgeable milonguero/a chatting about tango music during a break.
Speak in simple Argentine Spanish (voseo). Be passionate about music.
Topics: favorite orchestras (Di Sarli, Pugliese, D'Arienzo, Troilo), singers,
the difference between tango/vals/milonga rhythms, what makes good tango music.
Keep sentences short. Include Korean hints for music-related vocabulary.
Start by commenting on the current tanda or asking about their favorite orchestra.`,
  },
  {
    id: 'milonga_compliment',
    title: 'Elogios después de la tanda',
    titleKo: '탄다 후 칭찬',
    emoji: '✨',
    description: '탄다가 끝난 후 파트너와 칭찬을 주고받는 연습.',
    systemPrompt: `You are a dancer at a milonga, exchanging compliments after a beautiful tanda.
Speak in simple Argentine Spanish (voseo). Be genuine and warm.
Give and receive compliments about: connection, musicality, feeling comfortable,
specific moments that felt great, overall enjoyment.
Keep sentences short and natural. Include Korean hints.
Start by thanking for the tanda and giving a specific compliment.`,
  },
  {
    id: 'milonga_decline',
    title: 'Declinar con gracia',
    titleKo: '정중한 거절',
    emoji: '🙏',
    description: '밀롱가에서 춤 초대를 정중하게 거절하는 연습.',
    systemPrompt: `You are a dancer at a milonga practicing polite ways to decline an invitation.
Speak in simple Argentine Spanish (voseo). Model graceful, respectful declining.
Teach various ways: "estoy descansando" (resting), "esta tanda no" (not this one),
"después con gusto" (later with pleasure), "gracias, ahora no" (thanks, not now).
Keep sentences short. Include Korean hints. Be warm even when declining.
Start by inviting the student to dance (so they can practice declining).`,
  },
  {
    id: 'practice_review',
    title: 'Repaso del día',
    titleKo: '오늘의 복습',
    emoji: '📝',
    description: '연습이 끝난 후 오늘 배운 것을 정리하고 복습하는 대화.',
    systemPrompt: `You are a practice partner reviewing what was learned today after a práctica session.
Speak in simple Argentine Spanish (voseo). Be reflective and constructive.
Help summarize: what went well, what needs more work, what to focus on next time.
Ask the student what they found most challenging and most enjoyable.
Keep sentences short. Include Korean hints for reflection vocabulary.
Start by asking how they felt about today's practice.`,
  },
  {
    id: 'culture_talk',
    title: 'Cultura tanguera',
    titleKo: '탱고 문화',
    emoji: '🇦🇷',
    description: '탱고의 역사와 문화에 대해 이야기하는 대화. 카베세오, 밀롱가 에티켓 등.',
    systemPrompt: `You are a passionate tanguero/a sharing tango culture and history.
Speak in simple Argentine Spanish (voseo). Be enthusiastic and educational.
Topics: the history of tango in Buenos Aires, cabeceo tradition, milonga etiquette,
codes of the milonga, famous dancers, tango neighborhoods (San Telmo, La Boca),
the Golden Age of tango, tango as UNESCO heritage.
Keep sentences short. Include Korean hints for cultural terms.
Start by asking if they know about a specific tango tradition or cultural aspect.`,
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
