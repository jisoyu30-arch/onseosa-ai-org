"use client";

import { Pipeline } from "@/lib/types";

interface PipelineCardProps {
  pipeline: Pipeline;
  isSelected: boolean;
  isRunning: boolean;
  onClick: () => void;
}

export default function PipelineCard({
  pipeline,
  isSelected,
  isRunning,
  onClick,
}: PipelineCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left rounded-xl p-4 transition-all duration-200 border-2 ${
        isSelected
          ? "border-white/30 bg-white/10 shadow-lg scale-[1.02]"
          : "border-white/5 bg-white/5 hover:bg-white/8 hover:border-white/15"
      }`}
    >
      {isRunning && (
        <span className="absolute top-3 right-3 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
      )}
      <div className="flex items-start gap-3">
        <span
          className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
          style={{ backgroundColor: pipeline.color + "20" }}
        >
          {pipeline.icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-white text-sm leading-tight">
            {pipeline.name}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {pipeline.description}
          </p>
        </div>
      </div>
    </button>
  );
}
