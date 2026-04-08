import { agents, getAgentById } from "@/data/agents";
import ChatInterface from "@/components/ChatInterface";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return agents.map((agent) => ({ agentId: agent.id }));
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  const agent = getAgentById(agentId);

  if (!agent) {
    notFound();
  }

  return <ChatInterface agent={agent} />;
}
