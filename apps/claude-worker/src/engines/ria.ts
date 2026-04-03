import Anthropic from '@anthropic-ai/sdk';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { loadPrompt } from '../utils/prompt-loader';

export async function runRia(payload: WorkerPayload): Promise<EngineOutput> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const systemPrompt = loadPrompt('ria');

  // 칼 피드백이 있으면 재작성 지시 추가
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
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userInstruction },
    ],
  });

  const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
  console.log(`[ria] 응답 토큰: ${response.usage?.output_tokens ?? '?'}, 텍스트 길이: ${text.length}, domain: ${(payload.context?.domain ?? payload.projectType) || '?'}`);

  // JSON 추출
  let data: Record<string, unknown>;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      data = JSON.parse(jsonMatch[0]);
    } catch (e) {
      // JSON 파싱 실패 시 텍스트 그대로 저장 (응답 잘림 가능성)
      console.error('[ria] JSON 파싱 실패 — 응답이 잘렸을 수 있음:', (e as Error).message);
      console.error('[ria] 텍스트 끝부분:', text.slice(-200));
      data = { raw: text, description: text };
    }
  } else {
    console.error('[ria] JSON 블록 없음 — raw 저장');
    data = { raw: text, description: text };
  }

  return {
    engine: 'ria',
    status: 'pass',
    summary: (data.title_options as string[])?.[0] || '창작 완료',
    data,
    nextHints: data.tone_used ? [`톤: ${data.tone_used}`] : [],
  };
}
