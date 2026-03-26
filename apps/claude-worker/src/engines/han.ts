import Anthropic from '@anthropic-ai/sdk';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { loadPrompt } from '../utils/prompt-loader';

export async function runHan(payload: WorkerPayload): Promise<EngineOutput> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const systemPrompt = loadPrompt('han');

  const context = payload.context || {};
  let userInstruction = JSON.stringify({
    projectName: payload.projectName,
    projectType: payload.projectType,
    instruction: payload.instruction,
    context: payload.context,
    priorMemory: payload.priorMemory,
  });

  if (context.weak_point || context.fix_instruction) {
    userInstruction += `\n\n[재작성 요청]\n이전 결과물의 문제: ${context.weak_point}\n수정 지시: ${context.fix_instruction}\n위 피드백을 반영해서 다시 작성해줘.`;
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userInstruction },
    ],
  });

  const text = response.content[0]?.type === 'text' ? response.content[0].text : '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: text };

  return {
    engine: 'han',
    status: 'pass',
    summary: data.title_options?.[0] || '한강작가 창작 완료',
    data,
    nextHints: data.tone_used ? [`톤: ${data.tone_used}`] : [],
  };
}
