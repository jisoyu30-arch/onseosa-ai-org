"use client";

import { Agent, TEAM_CONFIG, TeamId } from "@/data/agents";
import Link from "next/link";

const levelLabels: Record<string, string> = {
  ceo: "C-Level · CDO",
  lead: "팀장",
  senior: "시니어",
  junior: "주니어",
};

function getCardStyle(agent: Agent, teamColor: string) {
  switch (agent.level) {
    case "ceo":
      return {
        background: "var(--charcoal)",
        borderTop: `3px solid var(--dawn)`,
      };
    case "lead":
      return {
        background: "var(--ivory-warm)",
        borderTop: `3px solid ${teamColor}`,
      };
    case "senior":
      return {
        background: "var(--paper)",
        borderTop: `2px solid ${teamColor}`,
        borderLeft: "1px solid rgba(36,35,32,0.07)",
      };
    case "junior":
      return {
        background: "white",
        borderTop: `1px solid ${teamColor}`,
        borderLeft: "1px solid rgba(36,35,32,0.06)",
      };
  }
}

export default function AgentCard({ agent }: { agent: Agent }) {
  const teamColor =
    agent.team === "clevel"
      ? "#C8551F"
      : TEAM_CONFIG[agent.team as TeamId].color;

  const isCeo = agent.level === "ceo";
  const cardStyle = getCardStyle(agent, teamColor);

  return (
    <Link href={`/chat/${agent.id}`}>
      <div
        className="agent-card cursor-pointer relative"
        style={{
          ...cardStyle,
          padding: "1.4rem 1.2rem",
          minHeight: "140px",
        }}
      >
        {/* Level badge */}
        <span
          className={`badge-${agent.level}`}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.55rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "0.2rem 0.6rem",
            display: "inline-block",
            marginBottom: "0.5rem",
          }}
        >
          {levelLabels[agent.level]}
        </span>

        {/* Name */}
        <div
          style={{
            fontFamily: "'Noto Serif KR', serif",
            fontWeight: 500,
            fontSize: isCeo ? "1rem" : agent.level === "lead" ? "0.95rem" : agent.level === "senior" ? "0.88rem" : "0.85rem",
            color: isCeo ? "var(--ivory)" : "var(--charcoal)",
            marginBottom: "0.3rem",
            lineHeight: 1.4,
          }}
        >
          {agent.name}
        </div>

        {/* Role */}
        <div
          style={{
            fontSize: "0.75rem",
            color: isCeo ? "rgba(244,239,228,0.5)" : "var(--smoke)",
            lineHeight: 1.6,
          }}
        >
          {agent.role}
        </div>

        {/* Tool tag */}
        <div
          style={{
            marginTop: "0.6rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.62rem",
            color: "var(--dawn)",
          }}
        >
          {agent.tools}
        </div>
      </div>
    </Link>
  );
}
