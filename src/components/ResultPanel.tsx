"use client";

import { PipelineExecution, QualityStatus } from "@/lib/types";
import { PIPELINES } from "@/lib/pipelines";

interface ResultPanelProps {
  executions: PipelineExecution[];
}

const QUALITY_BADGE: Record<QualityStatus, { bg: string; text: string; label: string }> = {
  "승인": { bg: "bg-green-500/20", text: "text-green-400", label: "승인" },
  "조건부승인": { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "조건부승인" },
  "수정필요": { bg: "bg-orange-500/20", text: "text-orange-400", label: "수정필요" },
  "보류": { bg: "bg-gray-500/20", text: "text-gray-400", label: "보류" },
  "검토중": { bg: "bg-blue-500/20", text: "text-blue-400", label: "검토중" },
  "미검토": { bg: "bg-gray-800/50", text: "text-gray-500", label: "미검토" },
};

export default function ResultPanel({ executions }: ResultPanelProps) {
  const sortedExecutions = [...executions].sort(
    (a, b) => b.startedAt - a.startedAt
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-bold text-white text-sm">실행 결과</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {executions.length}개 실행
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedExecutions.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>아직 실행 결과가 없습니다.</p>
            <p className="text-xs mt-1">파이프라인에 지시를 내려보세요.</p>
          </div>
        )}
        {sortedExecutions.map((exec) => {
          const pipeline = PIPELINES.find((p) => p.id === exec.pipelineId);
          if (!pipeline) return null;

          const qualityBadge = QUALITY_BADGE[exec.qualityStatus || "미검토"];

          return (
            <div
              key={exec.id}
              className="bg-white/5 rounded-xl p-4 border border-white/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{pipeline.icon}</span>
                <span className="font-medium text-white text-sm">
                  {pipeline.name}
                </span>
                <span
                  className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    exec.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : exec.status === "running"
                        ? "bg-blue-500/20 text-blue-400"
                        : exec.status === "error"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {exec.status === "completed"
                    ? "완료"
                    : exec.status === "running"
                      ? "실행 중"
                      : exec.status === "error"
                        ? "오류"
                        : "대기"}
                </span>
              </div>

              {/* 품질 상태 뱃지 */}
              {exec.status === "completed" && (
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${qualityBadge.bg} ${qualityBadge.text}`}
                  >
                    품질: {qualityBadge.label}
                  </span>
                  {pipeline.legalReview && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500">
                      ⚖️ 법무검토 대상
                    </span>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-400 mb-2 truncate">
                지시: {exec.input}
              </p>

              {exec.output && (
                <div className="bg-black/30 rounded-lg p-3 text-xs text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {exec.output}
                </div>
              )}

              {exec.error && (
                <div className="bg-red-500/10 rounded-lg p-3 text-xs text-red-400">
                  {exec.error}
                </div>
              )}

              <div className="text-[10px] text-gray-600 mt-2">
                {new Date(exec.startedAt).toLocaleString("ko-KR")}
                {exec.completedAt && (
                  <span>
                    {" "}
                    · {((exec.completedAt - exec.startedAt) / 1000).toFixed(1)}초
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
