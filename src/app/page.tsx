"use client";

import { useState, useCallback } from "react";
import { PIPELINES } from "@/lib/pipelines";
import { ChatMessage, PipelineExecution, Pipeline, QualityStatus } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";
import ResultPanel from "@/components/ResultPanel";

export default function Home() {
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline>(PIPELINES[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [executions, setExecutions] = useState<PipelineExecution[]>([]);
  const [runningPipelines, setRunningPipelines] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [stageLabel, setStageLabel] = useState("");

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        pipelineId: selectedPipeline.id,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);

      const execution: PipelineExecution = {
        id: crypto.randomUUID(),
        pipelineId: selectedPipeline.id,
        status: "running",
        qualityStatus: "미검토",
        input: content,
        startedAt: Date.now(),
      };
      setExecutions((prev) => [...prev, execution]);
      setRunningPipelines((prev) => new Set(prev).add(selectedPipeline.id));
      setIsLoading(true);
      setStageLabel("");

      try {
        // SSE 스트림으로 요청
        const res = await fetch("/api/pipelines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pipelineId: selectedPipeline.id,
            message: content,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `요청 실패 (${res.status})`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("스트림을 읽을 수 없습니다.");

        const decoder = new TextDecoder();
        let buffer = "";
        let finalResult: Record<string, unknown> | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const event = JSON.parse(line.slice(6));

              switch (event.type) {
                case "stage":
                  setStageLabel(event.label || "");
                  break;
                case "routed":
                  // 라우팅 결과는 최종 출력에 포함됨
                  break;
                case "complete":
                  finalResult = event;
                  break;
                case "error":
                  throw new Error(event.message);
              }
            } catch (parseErr) {
              if (parseErr instanceof Error && parseErr.message.includes("파이프라인")) {
                throw parseErr;
              }
            }
          }
        }

        if (!finalResult) throw new Error("서버에서 결과를 받지 못했습니다.");

        let resultText = (finalResult.output as string) || "";
        const notionUrl = finalResult.notionUrl as string | undefined;
        const qualityStatus = (finalResult.qualityStatus as QualityStatus) || "미검토";
        const notionError = finalResult.notionError as string | undefined;

        if (notionUrl) {
          resultText += `\n\n📄 노션에 저장 완료`;
        } else if (notionError) {
          resultText += `\n\n⚠️ 노션 저장 실패`;
        }
        if (qualityStatus && qualityStatus !== "미검토") {
          resultText += `\n✅ 품질 판정: ${qualityStatus}`;
        }

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: resultText,
          pipelineId: selectedPipeline.id,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        setExecutions((prev) =>
          prev.map((e) =>
            e.id === execution.id
              ? {
                  ...e,
                  status: "completed" as const,
                  qualityStatus,
                  output: resultText,
                  completedAt: Date.now(),
                }
              : e
          )
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류";

        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "system",
          content: `오류: ${errorMessage}`,
          pipelineId: selectedPipeline.id,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);

        setExecutions((prev) =>
          prev.map((e) =>
            e.id === execution.id
              ? {
                  ...e,
                  status: "error" as const,
                  qualityStatus: "미검토" as const,
                  error: errorMessage,
                  completedAt: Date.now(),
                }
              : e
          )
        );
      } finally {
        setIsLoading(false);
        setStageLabel("");
        setRunningPipelines((prev) => {
          const next = new Set(prev);
          next.delete(selectedPipeline.id);
          return next;
        });
      }
    },
    [selectedPipeline]
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center gap-3 px-6 py-3 border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #6366F1, #EC4899)" }}
        >
          온
        </div>
        <div>
          <h1 className="font-bold text-white text-sm">온서사 AI 에이전트</h1>
          <p className="text-[10px] text-gray-500">
            4개 본부 · 22명 AI 직원 · 11개 파이프라인
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-gray-500">
            활성 파이프라인: {runningPipelines.size}
          </span>
          <span className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedPipeline={selectedPipeline}
          onSelectPipeline={setSelectedPipeline}
          runningPipelines={runningPipelines}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <ChatPanel
            pipeline={selectedPipeline}
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            stageLabel={stageLabel}
          />
        </main>

        <aside className="w-80 border-l border-white/10 flex-shrink-0 hidden lg:flex lg:flex-col">
          <ResultPanel executions={executions} />
        </aside>
      </div>
    </div>
  );
}
