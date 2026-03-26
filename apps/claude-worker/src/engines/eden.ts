import OpenAI from 'openai';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { loadPrompt } from '../utils/prompt-loader';

export async function runEden(payload: WorkerPayload): Promise<EngineOutput> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const systemPrompt = loadPrompt('eden');

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
          priorMemory: payload.priorMemory,
        }),
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || '{}';
  const data = JSON.parse(content);

  return {
    engine: 'eden',
    status: 'pass',
    summary: data.recommended || '기획안 작성 완료',
    data,
    nextHints: data.rationale ? [data.rationale] : [],
  };
}
