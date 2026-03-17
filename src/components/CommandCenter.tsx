"use client";

import { useState, useRef, useEffect } from "react";
import { agents, TEAM_CONFIG, TeamId } from "@/data/agents";
import Link from "next/link";

const teamLeads = agents.filter((a) => a.level === "lead");

interface AgentResponse {
  agentId: string;
  name: string;
  teamName: string;
  content: string;
  status: "waiting" | "streaming" | "done" | "error";
}

export default function CommandCenter() {
  const [directive, setDirective] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>(
    teamLeads.map((a) => a.id)
  );
  const [responses, setResponses] = useState<Record<string, AgentResponse>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<
    { directive: string; responses: Record<string, AgentResponse>; timestamp: string }[]
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responsesRef = useRef<HTMLDivElement>(null);

  const toggleLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedLeads.length === teamLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(teamLeads.map((a) => a.id));
    }
  };

  const getTeamColor = (agent: (typeof teamLeads)[0]) =>
    TEAM_CONFIG[agent.team as TeamId]?.color ?? "#C8551F";

  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      responsesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);

  const handleSubmit = async () => {
    if (!directive.trim() || isRunning || selectedLeads.length === 0) return;

    setIsRunning(true);

    const initial: Record<string, AgentResponse> = {};
    selectedLeads.forEach((id) => {
      const agent = teamLeads.find((a) => a.id === id)!;
      initial[id] = {
        agentId: id,
        name: agent.name,
        teamName: agent.teamName,
        content: "",
        status: "waiting",
      };
    });
    setResponses(initial);

    try {
      const res = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directive: directive.trim(), agentIds: selectedLeads }),
      });

      if (!res.ok) {
        const error = await res.json();
        setResponses((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((id) => {
            updated[id] = { ...updated[id], status: "error", content: error.error || "오류 발생" };
          });
          return updated;
        });
        setIsRunning(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const { agentId, type } = parsed;

              if (type === "start") {
                setResponses((prev) => ({
                  ...prev,
                  [agentId]: { ...prev[agentId], status: "streaming" },
                }));
              } else if (type === "text") {
                setResponses((prev) => ({
                  ...prev,
                  [agentId]: {
                    ...prev[agentId],
                    content: prev[agentId].content + parsed.text,
                    status: "streaming",
                  },
                }));
              } else if (type === "done") {
                setResponses((prev) => ({
                  ...prev,
                  [agentId]: { ...prev[agentId], status: "done" },
                }));
              } else if (type === "error") {
                setResponses((prev) => ({
                  ...prev,
                  [agentId]: { ...prev[agentId], status: "error", content: parsed.error },
                }));
              }
            } catch {
              // skip
            }
          }
        }
      }
    } catch {
      setResponses((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (updated[id].status !== "done") {
            updated[id] = { ...updated[id], status: "error", content: "네트워크 오류" };
          }
        });
        return updated;
      });
    }

    setIsRunning(false);
    setResponses((prev) => {
      setHistory((h) => [
        {
          directive: directive.trim(),
          responses: prev,
          timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        },
        ...h,
      ]);
      return prev;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const doneCount = Object.values(responses).filter((r) => r.status === "done").length;
  const totalCount = Object.keys(responses).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--paper)" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--charcoal)",
          padding: "1.2rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          borderBottom: "3px solid var(--dawn)",
        }}
      >
        <Link href="/" style={{ color: "var(--smoke)", textDecoration: "none", fontSize: "1.2rem", padding: "0.2rem 0.5rem" }}>
          ←
        </Link>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--dawn)", flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 500, color: "var(--ivory)", fontSize: "0.95rem" }}>
            CDO 멀티 에이전트 지시
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "var(--smoke)",
              textTransform: "uppercase",
            }}
          >
            Multi-Agent Command Center
          </div>
        </div>
        {isRunning && totalCount > 0 && (
          <div
            style={{
              marginLeft: "auto",
              fontSize: "0.7rem",
              color: "var(--dawn-2)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            {doneCount}/{totalCount} 응답 완료
          </div>
        )}
      </div>

      <div style={{ flex: 1, padding: "2rem", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {/* Directive input */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--smoke)",
              marginBottom: "0.6rem",
            }}
          >
            CDO 지시사항
          </div>
          <textarea
            ref={textareaRef}
            value={directive}
            onChange={(e) => setDirective(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="팀장들에게 전달할 지시사항을 입력하세요..."
            disabled={isRunning}
            rows={3}
            style={{
              width: "100%",
              resize: "vertical",
              border: "1px solid rgba(36,35,32,0.12)",
              borderRadius: 12,
              padding: "1rem 1.2rem",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: "0.85rem",
              lineHeight: 1.8,
              background: "white",
              color: "var(--charcoal)",
              outline: "none",
              minHeight: 80,
            }}
          />
        </div>

        {/* Team lead checkboxes */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.8rem",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--smoke)",
              }}
            >
              대상 팀장 선택
            </div>
            <button
              onClick={toggleAll}
              disabled={isRunning}
              style={{
                background: "none",
                border: "1px solid rgba(36,35,32,0.15)",
                borderRadius: 6,
                padding: "0.2rem 0.6rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.6rem",
                color: "var(--smoke)",
                cursor: isRunning ? "default" : "pointer",
                letterSpacing: "0.08em",
              }}
            >
              {selectedLeads.length === teamLeads.length ? "전체 해제" : "전체 선택"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
            {teamLeads.map((lead) => {
              const color = getTeamColor(lead);
              const selected = selectedLeads.includes(lead.id);
              return (
                <button
                  key={lead.id}
                  onClick={() => toggleLead(lead.id)}
                  disabled={isRunning}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.6rem 0.8rem",
                    background: selected ? `${color}10` : "white",
                    border: `1.5px solid ${selected ? color : "rgba(36,35,32,0.1)"}`,
                    borderRadius: 10,
                    cursor: isRunning ? "default" : "pointer",
                    transition: "all 0.15s",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      border: `2px solid ${selected ? color : "var(--smoke-2)"}`,
                      background: selected ? color : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "0.6rem",
                      color: "white",
                    }}
                  >
                    {selected && "✓"}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "0.8rem", fontWeight: 500, color: "var(--charcoal)" }}>
                      {lead.name}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.55rem", letterSpacing: "0.1em", color: "var(--smoke)" }}>
                      {lead.teamName}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isRunning || !directive.trim() || selectedLeads.length === 0}
          style={{
            width: "100%",
            background:
              isRunning || !directive.trim() || selectedLeads.length === 0
                ? "var(--smoke-2)"
                : "var(--dawn)",
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: "0.9rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            cursor: isRunning || !directive.trim() || selectedLeads.length === 0 ? "default" : "pointer",
            transition: "background 0.2s",
            marginBottom: "2rem",
          }}
        >
          {isRunning
            ? `응답 수신 중... (${doneCount}/${totalCount})`
            : `${selectedLeads.length}명의 팀장에게 지시 전달`}
        </button>

        {/* Responses */}
        {Object.keys(responses).length > 0 && (
          <div ref={responsesRef}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--smoke)",
                marginBottom: "1rem",
              }}
            >
              팀별 응답
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              {Object.values(responses).map((resp) => {
                const lead = teamLeads.find((a) => a.id === resp.agentId);
                const color = lead ? getTeamColor(lead) : "var(--smoke)";

                return (
                  <div
                    key={resp.agentId}
                    style={{
                      background: "white",
                      borderRadius: 12,
                      border: "1px solid rgba(36,35,32,0.08)",
                      borderLeft: `3px solid ${color}`,
                      overflow: "hidden",
                    }}
                  >
                    {/* Response header */}
                    <div
                      style={{
                        padding: "0.7rem 1rem",
                        borderBottom: "1px solid rgba(36,35,32,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                        <span
                          style={{
                            fontFamily: "'Noto Serif KR', serif",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          {resp.name}
                        </span>
                        <span
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.55rem",
                            letterSpacing: "0.1em",
                            color: "var(--smoke)",
                          }}
                        >
                          {resp.teamName}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.55rem",
                          fontFamily: "'DM Sans', sans-serif",
                          letterSpacing: "0.05em",
                          padding: "0.15rem 0.5rem",
                          borderRadius: 20,
                          background:
                            resp.status === "done"
                              ? "rgba(46,107,79,0.1)"
                              : resp.status === "streaming"
                              ? "rgba(200,85,31,0.1)"
                              : resp.status === "error"
                              ? "rgba(200,30,30,0.1)"
                              : "rgba(154,148,144,0.1)",
                          color:
                            resp.status === "done"
                              ? "#2E6B4F"
                              : resp.status === "streaming"
                              ? "var(--dawn)"
                              : resp.status === "error"
                              ? "#C81E1E"
                              : "var(--smoke)",
                        }}
                      >
                        {resp.status === "done"
                          ? "완료"
                          : resp.status === "streaming"
                          ? "응답 중..."
                          : resp.status === "error"
                          ? "오류"
                          : "대기"}
                      </div>
                    </div>

                    {/* Response body */}
                    <div
                      style={{
                        padding: "1rem",
                        fontSize: "0.8rem",
                        lineHeight: 1.9,
                        color: "var(--charcoal)",
                        whiteSpace: "pre-wrap",
                        minHeight: 80,
                      }}
                    >
                      {resp.content ? (
                        <span className={resp.status === "streaming" ? "streaming-cursor" : ""}>
                          {resp.content}
                        </span>
                      ) : resp.status === "waiting" ? (
                        <span style={{ color: "var(--smoke-2)", fontSize: "0.75rem" }}>
                          응답 대기 중...
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div style={{ marginTop: "3rem" }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--smoke)",
                marginBottom: "1rem",
              }}
            >
              이전 지시 기록
            </div>
            {history.slice(1).map((entry, i) => (
              <details
                key={i}
                style={{
                  marginBottom: "0.5rem",
                  border: "1px solid rgba(36,35,32,0.08)",
                  borderRadius: 8,
                  background: "white",
                }}
              >
                <summary
                  style={{
                    padding: "0.7rem 1rem",
                    cursor: "pointer",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: "0.8rem",
                    color: "var(--charcoal)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                  }}
                >
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "var(--smoke)" }}>
                    {entry.timestamp}
                  </span>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.directive}
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", color: "var(--smoke)", flexShrink: 0 }}>
                    {Object.keys(entry.responses).length}개 팀
                  </span>
                </summary>
                <div style={{ padding: "0 1rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {Object.values(entry.responses).map((resp) => (
                    <div
                      key={resp.agentId}
                      style={{
                        padding: "0.6rem 0.8rem",
                        borderLeft: `2px solid ${getTeamColor(teamLeads.find((a) => a.id === resp.agentId)!)}`,
                        fontSize: "0.75rem",
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <div style={{ fontWeight: 500, marginBottom: "0.3rem", fontSize: "0.7rem" }}>
                        {resp.name} · {resp.teamName}
                      </div>
                      {resp.content}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
