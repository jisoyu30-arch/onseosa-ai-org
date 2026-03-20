import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    hasClaudeKey: !!process.env.CLAUDE_API_KEY,
    hasNotionKey: !!process.env.NOTION_API_KEY,
    hasWebhookUrl: !!process.env.N8N_WEBHOOK_URL,
    anthropicKeyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 10) || "없음",
    claudeKeyPrefix: process.env.CLAUDE_API_KEY?.substring(0, 10) || "없음",
  });
}
