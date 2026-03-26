import OpenAI from 'openai';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { loadPrompt } from '../utils/prompt-loader';

export async function runSeo(payload: WorkerPayload): Promise<EngineOutput> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const isReview = payload.taskType === 'review';
  const systemPrompt = loadPrompt(isReview ? 'seo-review' : 'seo');

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
    temperature: isReview ? 0.1 : 0.3,
    max_tokens: isReview ? 800 : 1000,
  });

  const content = response.choices[0]?.message?.content || '{}';
  const data = JSON.parse(content);

  if (isReview) {
    const score = data.score ?? 0;
    const retryCount = (payload.context?.retry_count as number) || 0;
    const decision = score >= 75 ? 'pass' : (retryCount >= 2 ? 'fail' : 'revise');

    return {
      engine: 'seo',
      status: decision,
      summary: `서 본부장 검수: ${score}/100 — ${decision} (시도 ${retryCount + 1}/3)`,
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

  return {
    engine: 'seo',
    status: 'pass',
    summary: data.project_summary || '서 본부장 총괄 완료',
    data,
    nextHints: data.next_action ? [data.next_action] : [],
  };
}
