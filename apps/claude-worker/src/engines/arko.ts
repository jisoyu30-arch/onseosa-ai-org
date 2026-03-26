import OpenAI from 'openai';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { loadPrompt } from '../utils/prompt-loader';

export async function runArko(payload: WorkerPayload): Promise<EngineOutput> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const systemPrompt = loadPrompt('arko');

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
    temperature: 0.3,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content || '{}';
  const data = JSON.parse(content);

  return {
    engine: 'arko',
    status: 'pass',
    summary: data.project_summary || '총괄 분석 완료',
    data,
    nextHints: data.next_action ? [data.next_action] : [],
  };
}
