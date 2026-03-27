import { GoogleGenerativeAI } from '@google/generative-ai';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { loadPrompt } from '../utils/prompt-loader';

export async function runNoah(payload: WorkerPayload): Promise<EngineOutput> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const systemPrompt = loadPrompt('noah');

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2000,
      responseMimeType: 'application/json',
    },
  });

  const userMessage = JSON.stringify({
    projectName: payload.projectName,
    projectType: payload.projectType,
    instruction: payload.instruction,
    context: payload.context,
  });

  const result = await model.generateContent(
    `${userMessage}\n\nJSON 형식으로 응답: { "content_type": "", "tone": "", "patterns": [], "hook_points": [], "keywords": [], "insights": [], "warnings": [] }`
  );

  const text = result.response.text();
  console.log(`[noah] Raw response length: ${text.length}`);

  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text);
  } catch {
    // responseMimeType이 실패할 경우 fallback
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        data = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('[noah] JSON parse failed:', (e as Error).message);
        console.error('[noah] Raw text:', text.slice(0, 500));
      }
    } else {
      console.error('[noah] No JSON found in response:', text.slice(0, 500));
    }
  }

  const hasData = Object.keys(data).length > 0;

  return {
    engine: 'noah',
    status: hasData ? 'pass' : 'fail',
    summary: hasData
      ? `분석 완료: ${data.content_type || '콘텐츠'} / 톤: ${data.tone || '미정'}`
      : '분석 실패: Gemini 응답 파싱 불가',
    data,
    nextHints: (data.insights as string[]) || [],
  };
}
