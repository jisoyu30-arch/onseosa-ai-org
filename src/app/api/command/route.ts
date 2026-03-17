import Anthropic from "@anthropic-ai/sdk";
import { getAgentById } from "@/data/agents";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const { directive, agentIds } = await request.json();

  if (!directive || !agentIds || !Array.isArray(agentIds) || agentIds.length === 0) {
    return Response.json({ error: "directive and agentIds required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const agents = agentIds.map((id: string) => getAgentById(id)).filter(Boolean);
  if (agents.length === 0) {
    return Response.json({ error: "No valid agents found" }, { status: 404 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const tasks = agents.map(async (agent) => {
        if (!agent) return;
        send({ agentId: agent.id, type: "start", name: agent.name, teamName: agent.teamName });

        try {
          const response = await anthropic.messages.stream({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2048,
            system: `${agent.systemPrompt}\n\n[CDO 지시 모드] CDO가 전체 팀장에게 지시를 내렸습니다. 당신은 ${agent.teamName}의 ${agent.name}으로서, 해당 지시에 대해 팀 관점에서 구체적이고 실행 가능한 응답을 작성하세요. 응답은 간결하게(500자 이내) 핵심만 전달하세요.`,
            messages: [
              { role: "user", content: `[CDO 지시사항]\n${directive}` },
            ],
          });

          for await (const event of response) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              send({ agentId: agent.id, type: "text", text: event.delta.text });
            }
          }

          send({ agentId: agent.id, type: "done" });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          send({ agentId: agent.id, type: "error", error: message });
        }
      });

      await Promise.all(tasks);
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
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
