import Anthropic from "@anthropic-ai/sdk";
import { getAgentById } from "@/data/agents";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const { agentId, messages } = await request.json();

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
          system: agent.systemPrompt,
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
