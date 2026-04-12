import Anthropic from "@anthropic-ai/sdk";
import { getAgentById } from "@/data/agents";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ANTI_HALLUCINATION_RULE = `

═══ 절대 규칙 ═══
- 실제 데이터가 없는 수치, 매출, 사용자 수, 예산, 날짜, 성과를 절대 지어내지 마라
- 모르는 것은 "해당 데이터가 없습니다" 또는 "확인이 필요합니다"라고 답하라
- 아래 [실제 프로젝트 데이터]에 있는 내용만 사실로 인용하라
- 데이터가 없으면 "아직 기록된 파이프라인 실행이 없습니다"라고 답하라
- 가상의 보고서, 가상의 진행 현황을 만들지 마라`;

export async function POST(request: NextRequest) {
  const { agentId, messages, projectContext } = await request.json();

  const agent = getAgentById(agentId);
  if (!agent) {
    return Response.json({ error: "Agent not found" }, { status: 404 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  // Build system prompt with real project data
  const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  let systemPrompt = agent.systemPrompt + `\n\n오늘 날짜: ${today}` + ANTI_HALLUCINATION_RULE;

  if (projectContext) {
    systemPrompt += `\n\n═══ 실제 프로젝트 데이터 (프로젝트 트래커 기준) ═══\n${projectContext}`;
  } else {
    systemPrompt += `\n\n═══ 실제 프로젝트 데이터 ═══\n현재 기록된 파이프라인 실행이 없습니다.`;
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Process messages - handle both string content and multi-part content (with images)
        const processedMessages = messages.map(
          (m: { role: string; content: string | Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })
        );

        const response = await anthropic.messages.stream({
          model: agent.model,
          max_tokens: 4096,
          system: systemPrompt,
          messages: processedMessages,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
