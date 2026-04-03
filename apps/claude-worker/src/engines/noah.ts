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
      // thinking 토큰을 0으로 설정해 JSON 앞에 thinking 블록이 붙지 않게 함
    } as Record<string, unknown>,
    // @ts-expect-error thinkingConfig는 일부 SDK 버전에 타입 미포함
    thinkingConfig: { thinkingBudget: 0 },
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
  console.log(`[noah] Raw response length: ${text.length}, preview: ${text.slice(0, 80)}`);

  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text);
  } catch {
    // thinking 모드: 첫 번째 { ... } 블록 추출
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        data = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('[noah] JSON parse failed:', (e as Error).message);
        console.error('[noah] Raw text:', text.slice(0, 500));
        // 마지막 수단: 핵심 필드만 추출
        data = {
          analysis_blocked: true,
          warnings: ['Gemini 응답 파싱 실패 — 부분 진행'],
        };
      }
    } else {
      console.error('[noah] No JSON found in response. Full text:', text);
      data = {
        analysis_blocked: true,
        warnings: ['Gemini 응답에 JSON 없음 — 부분 진행'],
      };
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
