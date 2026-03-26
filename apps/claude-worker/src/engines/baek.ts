import { GoogleGenerativeAI } from '@google/generative-ai';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { loadPrompt } from '../utils/prompt-loader';

export async function runBaek(payload: WorkerPayload): Promise<EngineOutput> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { temperature: 0.2, maxOutputTokens: 2000 },
  });
  const systemPrompt = loadPrompt('baek');

  const prompt = `${systemPrompt}\n\n입력:\n${JSON.stringify({
    projectName: payload.projectName,
    projectType: payload.projectType,
    instruction: payload.instruction,
    context: payload.context,
  })}

반드시 JSON 형식으로 응답하세요: { "content_type": "", "tone": "", "patterns": [], "hook_points": [], "keywords": [], "insights": [], "warnings": [] }`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

  return {
    engine: 'baek',
    status: 'pass',
    summary: `백박사 분석 완료: ${data.content_type || '콘텐츠'} / 톤: ${data.tone || '미정'}`,
    data,
    nextHints: data.insights || [],
  };
}
