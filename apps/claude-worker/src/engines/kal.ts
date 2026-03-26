import OpenAI from 'openai';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { loadPrompt } from '../utils/prompt-loader';

export async function runKal(payload: WorkerPayload): Promise<EngineOutput> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const systemPrompt = loadPrompt('kal');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: JSON.stringify({
          projectName: payload.projectName,
          projectType: payload.projectType,
          instruction: payload.instruction,
          context: payload.context,
        }),
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
    max_tokens: 800,
  });

  const content = response.choices[0]?.message?.content || '{}';
  const data = JSON.parse(content);

  const score = data.score ?? 0;
  const retryCount = (payload.context?.retry_count as number) || 0;
  const decision = score >= 75 ? 'pass' : (retryCount >= 2 ? 'fail' : 'revise');

  return {
    engine: 'kal',
    status: decision,
    summary: `검수 점수: ${score}/100 — ${decision} (시도 ${retryCount + 1}/3)`,
    data: {
      ...data,
      score,
      decision,
      retry_count: retryCount,
      weak_point: data.weak_point || '',
      fix_instruction: data.fix_instruction || '',
    },
    score,
    nextHints: data.fix_instruction ? [data.fix_instruction] : [],
  };
}
