import { agents, TEAM_CONFIG, TeamId, getAgentsByTeam } from "@/data/agents";
import AgentCard from "@/components/AgentCard";
import Link from "next/link";

const teamOrder: (TeamId | "clevel")[] = [
  "ops", "creative", "production", "aiplatform",
];

export default function HomePage() {
  const cdo = agents.find((a) => a.level === "ceo")!;

  return (
    <div>
      {/* Cover */}
      <div
        style={{
          background: "var(--charcoal)",
          padding: "4rem 4rem 3.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-0.05em",
            bottom: "-0.15em",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "22vw",
            fontWeight: 600,
            color: "rgba(255,255,255,0.03)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          ORG
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--dawn)",
            marginBottom: "1.5rem",
          }}
        >
          Studio Onseosa — AI Organization System
        </div>
        <h1
          style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: "2.5rem",
            fontWeight: 300,
            lineHeight: 1.3,
            color: "var(--ivory)",
          }}
        >
          온서사{" "}
          <span style={{ color: "var(--dawn-2)" }}>AI 직원</span>
          <br />
          자동화 시스템
        </h1>
        <p
          style={{
            marginTop: "1.2rem",
            fontFamily: "'Noto Serif KR', serif",
            fontSize: "0.9rem",
            lineHeight: 2,
            color: "rgba(244,239,228,0.5)",
            maxWidth: 500,
          }}
        >
          직원 카드를 선택하면 해당 AI 직원과 대화를 시작합니다.
          <br />
          각 직원은 고유한 역할과 시스템 프롬프트로 작동합니다.
        </p>
        <div
          style={{
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            gap: "3rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "총괄", val: "1명" },
            { label: "실장", val: "4명" },
            { label: "매니저", val: "10명" },
            { label: "담당", val: "6명" },
            { label: "총 AI 직원", val: "21명" },
          ].map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--smoke)",
                  marginBottom: "0.3rem",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontSize: "0.9rem",
                  color: "var(--ivory)",
                }}
              >
                {s.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: "3rem 4rem", maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "1rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid rgba(36,35,32,0.1)",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1.6rem",
              color: "var(--smoke-2)",
            }}
          >
            01
          </span>
          <span
            style={{
              fontFamily: "'Noto Serif KR', serif",
              fontSize: "1.3rem",
              fontWeight: 500,
            }}
          >
            AI 직원 선택
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--smoke)",
              marginLeft: "auto",
            }}
          >
            Select an Agent
          </span>
        </div>

        {/* CDO */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            gap: "2px",
            marginBottom: "2px",
          }}
        >
          <div style={{ width: 380 }}>
            <AgentCard agent={cdo} />
          </div>
          <Link href="/command" style={{ textDecoration: "none" }}>
            <div
              className="agent-card"
              style={{
                background: "var(--charcoal-2)",
                borderTop: "3px solid var(--dawn-2)",
                padding: "1.4rem 1.2rem",
                minHeight: "140px",
                width: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.6rem",
                cursor: "pointer",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "2px solid var(--dawn-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  color: "var(--dawn-2)",
                }}
              >
                ⇉
              </div>
              <div
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--ivory)",
                  textAlign: "center",
                }}
              >
                멀티 에이전트 지시
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.5rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--smoke)",
                  textAlign: "center",
                }}
              >
                Command Center
              </div>
            </div>
          </Link>
          <Link href="/pipeline" style={{ textDecoration: "none" }}>
            <div
              className="agent-card"
              style={{
                background: "var(--charcoal-2)",
                borderTop: "3px solid var(--olive)",
                padding: "1.4rem 1.2rem",
                minHeight: "140px",
                width: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.6rem",
                cursor: "pointer",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "2px solid var(--olive)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  color: "var(--olive)",
                }}
              >
                ⚙
              </div>
              <div
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--ivory)",
                  textAlign: "center",
                }}
              >
                자동화 파이프라인
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.5rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--smoke)",
                  textAlign: "center",
                }}
              >
                Automation Pipeline
              </div>
            </div>
          </Link>
          <Link href="/projects" style={{ textDecoration: "none" }}>
            <div
              className="agent-card"
              style={{
                background: "var(--charcoal-2)",
                borderTop: "3px solid #7B5EA7",
                padding: "1.4rem 1.2rem",
                minHeight: "140px",
                width: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.6rem",
                cursor: "pointer",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "2px solid #7B5EA7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  color: "#7B5EA7",
                }}
              >
                📋
              </div>
              <div
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--ivory)",
                  textAlign: "center",
                }}
              >
                프로젝트 트래커
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.5rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--smoke)",
                  textAlign: "center",
                }}
              >
                Project Tracker
              </div>
            </div>
          </Link>
        </div>

        {/* Connector */}
        <div
          style={{
            width: 1,
            height: "2rem",
            background: "rgba(200,85,31,0.3)",
            margin: "0 auto",
          }}
        />
        <div
          style={{
            height: 1,
            background: "rgba(200,85,31,0.15)",
            margin: "0 8%",
          }}
        />

        {/* Teams grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2px",
            marginTop: 0,
          }}
        >
          {teamOrder.map((teamId) => {
            const config = TEAM_CONFIG[teamId as TeamId];
            const teamAgents = getAgentsByTeam(teamId);

            return (
              <div
                key={teamId}
                style={{
                  border: "1px solid rgba(36,35,32,0.07)",
                  borderTop: "none",
                }}
              >
                {/* Team header */}
                <div
                  style={{
                    padding: "0.7rem 1rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(36,35,32,0.07)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: config.color,
                    }}
                  />
                  <span style={{ color: config.color }}>{config.name}</span>
                </div>

                {/* Agent cards */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  {teamAgents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "var(--charcoal)",
          padding: "1.5rem 4rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "4rem",
        }}
      >
        <div
          style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: "0.85rem",
            color: "rgba(244,239,228,0.45)",
          }}
        >
          <span style={{ color: "var(--dawn)" }}>온:서사</span> AI Organization
          System
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "rgba(244,239,228,0.2)",
          }}
        >
          꺼지지 않는 온기의 서사 — 문장에서 세계관까지
        </div>
      </footer>
    </div>
  );
}
