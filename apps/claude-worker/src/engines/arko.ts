import OpenAI from 'openai';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { loadPrompt } from '../utils/prompt-loader';
import { searchPastWork } from '../utils/past-work';
import { readArkoMemory } from '../utils/memory';

export async function runArko(payload: WorkerPayload): Promise<EngineOutput> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const isClarify = payload.taskType === 'clarify';
  const isReview = payload.taskType === 'review';

  // clarify 모드: 대화형 의도 파악 (memory_read 포함)
  if (isClarify) {
    // 작업 시작 전 user_memory + project_memory + 최근 task_history 3개 로드
    const arkoMemory = await readArkoMemory(payload.projectName).catch(() => null);
    if (arkoMemory) {
      console.log(`[아르코] 장기 기억 로드 완료 — 최근 작업 ${arkoMemory.recentTasks.length}건`);
      // priorMemory에 주입해서 clarify 단계에서 활용
      payload = {
        ...payload,
        priorMemory: {
          user: arkoMemory.user,
          project: arkoMemory.project,
          recentTasks: arkoMemory.recentTasks.map(t => ({
            engine: t.engine_name,
            status: t.result_status,
            feedback: t.feedback,
            date: (t.created_at as string)?.slice(0, 10),
          })),
        },
      };
    }
    return runArkoClarify(openai, payload);
  }

  // orchestrate 모드: arko-clarify가 생성한 브리프가 있으면 LLM 재생성 없이 통과
  if (!isReview && payload.context?.executionBrief) {
    const brief = payload.context.executionBrief as Record<string, unknown>;
    const enginePlan = (brief.engine_plan as Array<{ engine: string }>) || [];
    console.log(`[arko] 실행 브리프 수신 — domain: ${brief.domain}, goal: ${brief.goal}`);
    return {
      engine: 'arko',
      status: 'pass',
      summary: `아르코 총괄: 브리프 확인 완료 — ${brief.goal || payload.instruction.slice(0, 40)}`,
      data: {
        project_type: brief.domain || payload.projectType,
        project_summary: String(brief.goal || payload.instruction.slice(0, 60)),
        engines_to_call: enginePlan.map(e => e.engine),
        priority: 'high',
        auto_detected: false,
        enriched_instruction: payload.instruction,
        execution_brief: brief,
        next_action: '실행 브리프 기반 파이프라인 시작',
        blocked: Boolean(brief.blocked),
        block_reason: String(brief.block_reason || ''),
      },
      nextHints: ['실행 브리프 기반 파이프라인 시작'],
    };
  }

  const systemPrompt = loadPrompt(isReview ? 'arko-review' : 'arko');

  const response = await openai.chat.completions.create({
    // 검수 모드는 context를 꼼꼼히 읽어야 하므로 gpt-4o 사용
    model: isReview ? 'gpt-4o' : 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: JSON.stringify({
          projectName: payload.projectName,
          projectType: payload.projectType,
          instruction: payload.instruction,
          // 검수 모드: 리아 결과물 명시적으로 상단에 배치 (도메인 공통 필드 + 전체 컨텍스트)
          ...(isReview && payload.context ? {
            ria_output: {
              // 표준 필드 (music/webnovel/shortform)
              title: payload.context.recommended_title,
              description: payload.context.description,
              first_sentence: payload.context.first_sentence,
              copy_variants: payload.context.copy_variants,
              tone_used: payload.context.tone_used,
              // broadcast 필드
              episode_title: payload.context.episode_title,
              opening_ment: payload.context.opening_ment,
              cue_sheet: payload.context.cue_sheet,
              key_ments: payload.context.key_ments,
              closing_ment: payload.context.closing_ment,
              // playlist 필드
              playlist_title: payload.context.playlist_title,
              track_list: payload.context.track_list,
              // book 필드
              book_title: payload.context.book_title,
              table_of_contents: payload.context.table_of_contents,
              preface: payload.context.preface,
              // raw fallback
              raw: payload.context.raw,
            },
          } : {}),
          context: payload.context,
          priorMemory: payload.priorMemory,
        }),
      },
    ],
    response_format: { type: 'json_object' },
    temperature: isReview ? 0.1 : 0.3,
    max_completion_tokens: isReview ? 1200 : 1000,
  });

  const content = response.choices[0]?.message?.content || '{}';
  const data = JSON.parse(content);

  if (isReview) {
    const score = data.score ?? 0;
    const retryCount = (payload.context?.retry_count as number) || 0;

    // 점수 기반 결정 (모델 status 무시 — 점수 임계값 강제 적용)
    // retryCount >= MAX_RETRY(2) 시 점수가 50 이상이면 'revise'로 반환해
    // pipeline에서 soft-pass(루카 저장)로 처리하도록 한다
    let decision: 'pass' | 'revise' | 'fail';
    if (score >= 75) {
      decision = 'pass';
    } else if (score >= 50) {
      decision = 'revise';
    } else {
      decision = 'fail';
    }

    // next_action에서 fix_instruction 추출 (새 스키마)
    const nextAction = (data.next_action as string) || '';
    const fixInstruction = nextAction.replace(/^리아 재작성:\s*/i, '').trim();
    const reasons = (data.reasons as string[]) || [];

    return {
      engine: 'arko',
      status: decision,
      summary: `아르코 검수: ${score}/100 — ${decision} (시도 ${retryCount + 1}/3)`,
      data: {
        ...data,
        score,
        decision,
        retry_count: retryCount,
        fix_instruction: decision === 'revise' ? fixInstruction : '',
        weak_point: reasons[1] || '',
      },
      score,
      nextHints: decision === 'revise' && fixInstruction ? [fixInstruction] : [],
    };
  }

  return {
    engine: 'arko',
    status: 'pass',
    summary: data.project_summary || '아르코 총괄 완료',
    data,
    nextHints: data.next_action ? [data.next_action] : [],
  };
}

// 대화형 의도 파악 모드
async function runArkoClarify(openai: OpenAI, payload: WorkerPayload): Promise<EngineOutput> {
  const systemPrompt = loadPrompt('arko-clarify');
  const conversationHistory = (payload.context?.conversationHistory as Array<{ role: string; content: string }>) || [];

  // 대화 히스토리를 GPT 메시지로 변환
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: payload.instruction },
  ];

  // 과거 작업 결과가 context에 있으면 포함
  if (payload.context?.pastWorkResults) {
    messages.push({
      role: 'system',
      content: `과거 작업 검색 결과:\n${JSON.stringify(payload.context.pastWorkResults, null, 2)}`,
    });
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_completion_tokens: 800,
  });

  const content = response.choices[0]?.message?.content || '{}';
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(content);
  } catch {
    data = { action: 'ask', message: '요청을 이해하지 못했어요. 다시 말씀해주시겠어요?' };
  }

  // action이 search인 경우: 과거 작업 검색 후 2차 호출
  if (data.action === 'search' && data.searchQuery) {
    console.log(`[아르코] 과거 작업 검색: "${data.searchQuery}"`);
    const pastWorkResults = await searchPastWork(data.searchQuery as string);

    // 검색 결과를 붙여서 2차 호출
    const followUpMessages: OpenAI.ChatCompletionMessageParam[] = [
      ...messages,
      { role: 'assistant', content: content },
      {
        role: 'system',
        content: `과거 작업 검색 결과:\n${JSON.stringify(pastWorkResults, null, 2)}\n\n이 결과를 참고하여 사용자에게 응답해주세요.`,
      },
    ];

    const followUp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: followUpMessages,
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_completion_tokens: 800,
    });

    const followUpContent = followUp.choices[0]?.message?.content || '{}';
    try {
      data = JSON.parse(followUpContent);
      data.pastWorkResults = pastWorkResults;
    } catch {
      data = { action: 'ask', message: '검색 결과를 처리하는 데 문제가 생겼어요.' };
    }
  }

  return {
    engine: 'arko',
    status: 'done',
    summary: (data.message as string) || '아르코 대화',
    data,
  };
}
