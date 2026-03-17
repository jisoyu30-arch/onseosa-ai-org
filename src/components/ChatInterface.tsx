"use client";

import { useState, useRef, useEffect } from "react";
import { Agent, TEAM_CONFIG, TeamId } from "@/data/agents";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface({ agent }: { agent: Agent }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const teamColor =
    agent.team === "clevel"
      ? "#C8551F"
      : TEAM_CONFIG[agent.team as TeamId].color;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    // Add empty assistant message for streaming
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          messages: newMessages,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: `오류: ${error.error || "알 수 없는 오류가 발생했습니다."}`,
          };
          return updated;
        });
        setIsStreaming(false);
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
              if (parsed.text) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: updated[updated.length - 1].content + parsed.text,
                  };
                  return updated;
                });
              }
              if (parsed.error) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: `오류: ${parsed.error}`,
                  };
                  return updated;
                });
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
        };
        return updated;
      });
    }

    setIsStreaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--paper)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--charcoal)",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          borderBottom: `3px solid ${teamColor}`,
        }}
      >
        <Link
          href="/"
          style={{
            color: "var(--smoke)",
            textDecoration: "none",
            fontSize: "1.2rem",
            padding: "0.2rem 0.5rem",
          }}
        >
          ←
        </Link>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: teamColor,
            flexShrink: 0,
          }}
        />
        <div>
          <div
            style={{
              fontFamily: "'Noto Serif KR', serif",
              fontWeight: 500,
              color: "var(--ivory)",
              fontSize: "0.95rem",
            }}
          >
            {agent.name}
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
            {agent.teamName} · {agent.nameEn}
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontSize: "0.75rem",
            color: "rgba(244,239,228,0.4)",
            maxWidth: 300,
            textAlign: "right",
            lineHeight: 1.5,
          }}
        >
          {agent.role}
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "1rem",
              color: "var(--smoke)",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: teamColor,
                opacity: 0.15,
              }}
            />
            <div
              style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: "1.1rem",
                fontWeight: 500,
                color: "var(--charcoal)",
              }}
            >
              {agent.name}
            </div>
            <div style={{ fontSize: "0.8rem", textAlign: "center", maxWidth: 400 }}>
              {agent.role}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--smoke-2)",
                marginTop: "0.5rem",
              }}
            >
              메시지를 입력하면 대화가 시작됩니다
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className="chat-message"
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "1rem 1.3rem",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background:
                  msg.role === "user" ? "var(--charcoal)" : "var(--ivory-warm)",
                color:
                  msg.role === "user" ? "var(--ivory)" : "var(--charcoal)",
                fontSize: "0.85rem",
                lineHeight: 1.8,
                borderLeft:
                  msg.role === "assistant"
                    ? `3px solid ${teamColor}`
                    : "none",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.role === "assistant" && (
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.58rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: teamColor,
                    marginBottom: "0.4rem",
                  }}
                >
                  {agent.name}
                </div>
              )}
              <span className={isStreaming && i === messages.length - 1 && msg.role === "assistant" ? "streaming-cursor" : ""}>
                {msg.content}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "1rem 2rem 1.5rem",
          borderTop: "1px solid rgba(36,35,32,0.08)",
          background: "var(--ivory-warm)",
          display: "flex",
          gap: "0.8rem",
          alignItems: "flex-end",
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`${agent.name}에게 질문하세요...`}
          disabled={isStreaming}
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            border: "1px solid rgba(36,35,32,0.12)",
            borderRadius: 12,
            padding: "0.8rem 1rem",
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "0.85rem",
            lineHeight: 1.6,
            background: "white",
            color: "var(--charcoal)",
            outline: "none",
            maxHeight: 120,
            overflow: "auto",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = Math.min(target.scrollHeight, 120) + "px";
          }}
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          style={{
            background: isStreaming || !input.trim() ? "var(--smoke-2)" : "var(--dawn)",
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: "0.8rem 1.5rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            cursor: isStreaming || !input.trim() ? "default" : "pointer",
            transition: "background 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {isStreaming ? "생성 중..." : "보내기"}
        </button>
      </form>
    </div>
  );
}
