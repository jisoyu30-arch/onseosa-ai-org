"use client";

import { useState } from "react";
import { HEADQUARTERS, getPipelinesByHeadquarters } from "@/lib/pipelines";
import { Pipeline } from "@/lib/types";

interface SidebarProps {
  selectedPipeline: Pipeline;
  onSelectPipeline: (pipeline: Pipeline) => void;
  runningPipelines: Set<string>;
}

export default function Sidebar({ selectedPipeline, onSelectPipeline, runningPipelines }: SidebarProps) {
  const [expandedHQs, setExpandedHQs] = useState<Set<string>>(
    new Set(HEADQUARTERS.map((hq) => hq.id))
  );

  const toggleHQ = (hqId: string) => {
    setExpandedHQs((prev) => {
      const next = new Set(prev);
      if (next.has(hqId)) {
        next.delete(hqId);
      } else {
        next.add(hqId);
      }
      return next;
    });
  };

  // 총괄운영실장 가상 파이프라인
  const commanderPipeline: Pipeline = {
    id: "commander",
    name: "총괄운영실장",
    description: "지시를 분석하여 적합한 파이프라인에 자동 배분합니다.",
    icon: "👔",
    color: "#6366F1",
    headquartersId: "operations",
    notionParentId: "",
    roleChain: { creator: "총괄운영실장", reviewer: "총괄운영실장", approver: "품질관리매니저", publisher: "총괄운영실장" },
    legalReview: false,
  };

  const isCommanderSelected = selectedPipeline.id === "commander";

  return (
    <aside className="w-72 border-r border-white/10 overflow-y-auto flex-shrink-0 bg-black/20">
      <div className="p-3">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium px-2 mb-3">
          4본부 · 22명 AI 직원
        </p>

        {/* 총괄운영실장 - 항상 최상단 */}
        <button
          onClick={() => onSelectPipeline(commanderPipeline)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-3 transition-all ${
            isCommanderSelected
              ? "bg-indigo-600/20 border border-indigo-500/40 text-white"
              : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
          }`}
        >
          <span className="text-xl">👔</span>
          <div className="text-left flex-1">
            <span className="text-sm font-semibold block">총괄운영실장</span>
            <span className="text-[10px] text-gray-500">지시하면 알아서 배분합니다</span>
          </div>
          {runningPipelines.has("commander") && (
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </button>

        <div className="border-t border-white/5 mb-3" />

        {HEADQUARTERS.map((hq) => {
          const pipelines = getPipelinesByHeadquarters(hq.id);
          const isExpanded = expandedHQs.has(hq.id);
          const hasRunning = pipelines.some((p) => runningPipelines.has(p.id));

          return (
            <div key={hq.id} className="mb-1">
              {/* 본부 헤더 */}
              <button
                onClick={() => toggleHQ(hq.id)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span
                  className="w-1 h-6 rounded-full flex-shrink-0"
                  style={{ backgroundColor: hq.color }}
                />
                <span className="text-sm">{hq.icon}</span>
                <span className="text-xs font-semibold text-gray-300 flex-1 text-left truncate">
                  {hq.name}
                </span>
                <span className="text-[10px] text-gray-600">{pipelines.length}</span>
                {hasRunning && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                )}
                <svg
                  className={`w-3 h-3 text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* 파이프라인 목록 */}
              {isExpanded && (
                <div className="ml-3 pl-3 border-l border-white/5 space-y-0.5 mt-0.5 mb-2">
                  {pipelines.map((pipeline) => {
                    const isSelected = selectedPipeline.id === pipeline.id;
                    const isRunning = runningPipelines.has(pipeline.id);

                    return (
                      <button
                        key={pipeline.id}
                        onClick={() => onSelectPipeline(pipeline)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all text-xs ${
                          isSelected
                            ? "bg-white/10 border border-white/20 text-white"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <span className="text-sm flex-shrink-0">{pipeline.icon}</span>
                        <span className="truncate flex-1">{pipeline.name}</span>
                        {isRunning && (
                          <span className="relative flex h-2 w-2 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                          </span>
                        )}
                        {pipeline.legalReview && (
                          <span className="text-[8px] text-yellow-600" title="법무검토 필요">⚖️</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
