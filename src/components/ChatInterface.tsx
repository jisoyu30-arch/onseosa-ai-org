"use client";

import { useState, useRef, useEffect } from "react";
import { Agent, TEAM_CONFIG, TeamId } from "@/data/agents";
import Link from "next/link";
import mammoth from "mammoth";
import { getAllRuns } from "@/lib/projectStore";

interface Attachment {
  id: string;
  name: string;
  type: "document" | "image" | "audio";
  content?: string;       // extracted text for documents
  dataUrl?: string;        // base64 for images
  audioUrl?: string;       // blob URL for audio
  size: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
}

export default function ChatInterface({ agent }: { agent: Agent }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const teamColor =
    agent.team === "clevel"
      ? "#C8551F"
      : TEAM_CONFIG[agent.team as TeamId].color;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── File handling ──
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const id = `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const ext = file.name.split(".").pop()?.toLowerCase() || "";

      // Document files
      if (["txt", "md", "text"].includes(ext)) {
        const text = await readTextFile(file);
        setAttachments((prev) => [...prev, { id, name: file.name, type: "document", content: text, size: file.size }]);
      } else if (ext === "docx") {
        const text = await readDocxFile(file);
        setAttachments((prev) => [...prev, { id, name: file.name, type: "document", content: text, size: file.size }]);
      }
      // Image files
      else if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
        const dataUrl = await readFileAsDataUrl(file);
        setAttachments((prev) => [...prev, { id, name: file.name, type: "image", dataUrl, size: file.size }]);
      }
      // Audio files
      else if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext)) {
        const audioUrl = URL.createObjectURL(file);
        setAttachments((prev) => [...prev, { id, name: file.name, type: "audio", audioUrl, size: file.size }]);
      }
      // Try as text
      else {
        try {
          const text = await readTextFile(file);
          setAttachments((prev) => [...prev, { id, name: file.name, type: "document", content: text, size: file.size }]);
        } catch {
          setAttachments((prev) => [...prev, { id, name: file.name, type: "document", content: `[파일 읽기 실패: ${file.name}]`, size: file.size }]);
        }
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file, "UTF-8");
    });
  };

  const readDocxFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const att = prev.find((a) => a.id === id);
      if (att?.audioUrl) URL.revokeObjectURL(att.audioUrl);
      return prev.filter((a) => a.id !== id);
    });
  };

  const toggleAudio = (id: string) => {
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (key !== id && audio) { audio.pause(); audio.currentTime = 0; }
    });
    const audio = audioRefs.current[id];
    if (!audio) return;
    if (playingAudio === id) { audio.pause(); setPlayingAudio(null); }
    else { audio.play(); setPlayingAudio(id); }
  };

  // ── Build message content with attachments ──
  const buildMessageContent = (): string => {
    let content = input.trim();

    if (attachments.length > 0) {
      const parts: string[] = [];

      for (const att of attachments) {
        if (att.type === "document" && att.content) {
          parts.push(`\n\n📄 [첨부파일: ${att.name}]\n${"─".repeat(40)}\n${att.content}\n${"─".repeat(40)}`);
        } else if (att.type === "image") {
          parts.push(`\n\n🖼️ [첨부 이미지: ${att.name}]`);
        } else if (att.type === "audio") {
          parts.push(`\n\n🎵 [첨부 음원: ${att.name}]`);
        }
      }

      content = content + parts.join("");
    }

    return content;
  };

  // ── Build project context from tracker data ──
  const buildProjectContext = (runs: ReturnType<typeof getAllRuns>) => {
    const grouped: Record<string, typeof runs> = {};
    for (const run of runs) {
      const key = run.projectName || "미분류";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(run);
    }

    const lines: string[] = [];
    const totalRuns = runs.length;
    const completed = runs.filter((r) => r.status === "completed").length;
    const running = runs.filter((r) => r.status === "running").length;
    const failed = runs.filter((r) => r.status === "failed").length;

    lines.push(`[프로젝트 현황] ${Object.keys(grouped).length}개 프로젝트, 총 ${totalRuns}회 실행 (완료 ${completed}, 진행 중 ${running}, 실패 ${failed})`);

    for (const [name, projectRuns] of Object.entries(grouped)) {
      const pCompleted = projectRuns.filter((r) => r.status === "completed").length;
      const latest = projectRuns[0];
      lines.push(`\n▸ ${name} — ${projectRuns.length}회 실행, ${pCompleted} 완료`);

      // Show latest 3 runs per project
      for (const run of projectRuns.slice(0, 3)) {
        const date = new Date(run.createdAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
        const doneSteps = run.steps.filter((s) => s.status === "done").length;
        const statusLabel = run.status === "completed" ? "완료" : run.status === "running" ? "진행 중" : run.status === "failed" ? "실패" : "부분완료";
        lines.push(`  - ${run.pipelineLabel} (${date}) [${statusLabel}] ${doneSteps}/${run.steps.length}단계`);

        // Include step results for completed runs (truncated)
        if (run.status === "completed") {
          for (const step of run.steps) {
            if (step.result) {
              lines.push(`    ${step.title}: ${step.result.slice(0, 200)}${step.result.length > 200 ? "..." : ""}`);
            }
          }
        }
      }
    }

    return lines.join("\n");
  };

  // ── Build API messages with image support ──
  const buildApiMessages = (allMessages: Message[]) => {
    return allMessages.map((m) => {
      // Check if message has image attachments
      const imageAtts = m.attachments?.filter((a) => a.type === "image" && a.dataUrl) || [];

      if (imageAtts.length > 0 && m.role === "user") {
        // Multi-content message with images
        const contentParts: Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> = [];

        // Add text
        contentParts.push({ type: "text", text: m.content });

        // Add images
        for (const img of imageAtts) {
          if (img.dataUrl) {
            const match = img.dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/);
            if (match) {
              contentParts.push({
                type: "image",
                source: {
                  type: "base64",
                  media_type: match[1],
                  data: match[2],
                },
              });
            }
          }
        }

        return { role: m.role, content: contentParts };
      }

      return { role: m.role, content: m.content };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isStreaming) return;

    const messageContent = buildMessageContent();
    const userMessage: Message = {
      role: "user",
      content: messageContent,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setAttachments([]);
    setIsStreaming(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      // Build project context from tracker
      const runs = getAllRuns();
      const projectSummary = runs.length > 0 ? buildProjectContext(runs) : null;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          messages: buildApiMessages(newMessages),
          projectContext: projectSummary,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: `오류: ${error.error || "알 수 없는 오류가 발생했습니다."}` };
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
                  updated[updated.length - 1] = { role: "assistant", content: updated[updated.length - 1].content + parsed.text };
                  return updated;
                });
              }
              if (parsed.error) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: `오류: ${parsed.error}` };
                  return updated;
                });
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "네트워크 오류가 발생했습니다. 다시 시도해주세요." };
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

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--paper)" }}>
      {/* Header */}
      <div style={{ background: "var(--charcoal)", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem", borderBottom: `3px solid ${teamColor}` }}>
        <Link href="/" style={{ color: "var(--smoke)", textDecoration: "none", fontSize: "1.2rem", padding: "0.2rem 0.5rem" }}>←</Link>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: teamColor, flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 500, color: "var(--ivory)", fontSize: "0.95rem" }}>{agent.name}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--smoke)", textTransform: "uppercase" }}>
            {agent.teamName} · {agent.nameEn}
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: "0.75rem", color: "rgba(244,239,228,0.4)", maxWidth: 300, textAlign: "right", lineHeight: 1.5 }}>{agent.role}</div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem", color: "var(--smoke)" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: teamColor, opacity: 0.15 }} />
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "1.1rem", fontWeight: 500, color: "var(--charcoal)" }}>{agent.name}</div>
            <div style={{ fontSize: "0.8rem", textAlign: "center", maxWidth: 400 }}>{agent.role}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--smoke-2)", marginTop: "0.5rem", textAlign: "center" }}>
              메시지를 입력하거나 파일을 첨부하면 대화가 시작됩니다
              <br />
              <span style={{ fontSize: "0.6rem" }}>📄 문서 · 🖼️ 이미지 · 🎵 음원 파일 첨부 가능</span>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="chat-message" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "70%", padding: "1rem 1.3rem",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user" ? "var(--charcoal)" : "var(--ivory-warm)",
              color: msg.role === "user" ? "var(--ivory)" : "var(--charcoal)",
              fontSize: "0.85rem", lineHeight: 1.8,
              borderLeft: msg.role === "assistant" ? `3px solid ${teamColor}` : "none",
              whiteSpace: "pre-wrap",
            }}>
              {msg.role === "assistant" && (
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: teamColor, marginBottom: "0.4rem" }}>
                  {agent.name}
                </div>
              )}

              {/* Render attachments in message */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.6rem" }}>
                  {msg.attachments.map((att) => (
                    <div key={att.id} style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.4rem 0.6rem", borderRadius: 8,
                      background: msg.role === "user" ? "rgba(255,255,255,0.08)" : "rgba(36,35,32,0.04)",
                      fontSize: "0.7rem",
                    }}>
                      <span>{att.type === "document" ? "📄" : att.type === "image" ? "🖼️" : "🎵"}</span>
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.name}</span>
                      <span style={{ fontSize: "0.6rem", opacity: 0.5 }}>{formatSize(att.size)}</span>
                    </div>
                  ))}
                  {/* Show inline image previews */}
                  {msg.attachments.filter((a) => a.type === "image" && a.dataUrl).map((att) => (
                    <img key={`img-${att.id}`} src={att.dataUrl} alt={att.name} style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, marginTop: "0.3rem" }} />
                  ))}
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

      {/* Attachment preview bar */}
      {attachments.length > 0 && (
        <div style={{
          padding: "0.5rem 2rem", borderTop: "1px solid rgba(36,35,32,0.06)",
          background: "rgba(36,35,32,0.02)",
          display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center",
        }}>
          {attachments.map((att) => (
            <div key={att.id} style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.3rem 0.6rem", borderRadius: 8,
              background: "white", border: "1px solid rgba(36,35,32,0.1)",
              fontSize: "0.68rem",
            }}>
              {att.type === "audio" && (
                <>
                  <audio
                    ref={(el) => { audioRefs.current[att.id] = el; }}
                    src={att.audioUrl}
                    onEnded={() => setPlayingAudio(null)}
                    preload="metadata"
                  />
                  <button
                    onClick={() => toggleAudio(att.id)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "0.8rem", padding: 0, color: playingAudio === att.id ? teamColor : "var(--smoke)",
                    }}
                  >
                    {playingAudio === att.id ? "❚❚" : "▶"}
                  </button>
                </>
              )}
              {att.type === "image" && att.dataUrl && (
                <img src={att.dataUrl} alt="" style={{ width: 20, height: 20, borderRadius: 3, objectFit: "cover" }} />
              )}
              <span>{att.type === "document" ? "📄" : att.type === "image" ? "" : "🎵"}</span>
              <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.name}</span>
              <span style={{ fontSize: "0.58rem", color: "var(--smoke)" }}>{formatSize(att.size)}</span>
              <button
                onClick={() => removeAttachment(att.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--smoke-2)", fontSize: "0.8rem", padding: "0 0.2rem" }}
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{ padding: "1rem 2rem 1.5rem", borderTop: "1px solid rgba(36,35,32,0.08)", background: "var(--ivory-warm)", display: "flex", gap: "0.5rem", alignItems: "flex-end" }}
      >
        {/* File upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming}
          title="파일 첨부 (문서, 이미지, 음원)"
          style={{
            background: "none", border: "1px solid rgba(36,35,32,0.15)", borderRadius: 10,
            padding: "0.7rem", cursor: isStreaming ? "default" : "pointer",
            color: "var(--smoke)", fontSize: "1rem", lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "border-color 0.2s",
            flexShrink: 0,
          }}
        >
          +
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.docx,.md,.png,.jpg,.jpeg,.gif,.webp,.mp3,.wav,.ogg,.m4a,.aac,.flac"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`${agent.name}에게 지시하세요... (파일 첨부: + 버튼)`}
          disabled={isStreaming}
          rows={1}
          style={{
            flex: 1, resize: "none", border: "1px solid rgba(36,35,32,0.12)", borderRadius: 12,
            padding: "0.8rem 1rem", fontFamily: "'Noto Sans KR', sans-serif", fontSize: "0.85rem",
            lineHeight: 1.6, background: "white", color: "var(--charcoal)", outline: "none", maxHeight: 120, overflow: "auto",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = Math.min(target.scrollHeight, 120) + "px";
          }}
        />
        <button
          type="submit"
          disabled={isStreaming || (!input.trim() && attachments.length === 0)}
          style={{
            background: isStreaming || (!input.trim() && attachments.length === 0) ? "var(--smoke-2)" : "var(--dawn)",
            color: "white", border: "none", borderRadius: 12, padding: "0.8rem 1.5rem",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 500,
            letterSpacing: "0.1em", cursor: isStreaming || (!input.trim() && attachments.length === 0) ? "default" : "pointer",
            transition: "background 0.2s", whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          {isStreaming ? "생성 중..." : "보내기"}
        </button>
      </form>
    </div>
  );
}
