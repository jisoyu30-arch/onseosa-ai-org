"use client";

import { useState, useRef, useEffect } from "react";
import { Pipeline, ChatMessage } from "@/lib/types";
import { getHeadquartersForPipeline } from "@/lib/pipelines";
import RoleChainBadge from "./RoleChainBadge";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface ChatPanelProps {
  pipeline: Pipeline;
  messages: ChatMessage[];
  onSendMessage: (message: string, files?: UploadedFile[]) => void;
  isLoading: boolean;
  stageLabel?: string;
}

export default function ChatPanel({
  pipeline,
  messages,
  onSendMessage,
  isLoading,
  stageLabel,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hq = getHeadquartersForPipeline(pipeline.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("pipelineId", pipeline.id);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setAttachedFiles((prev) => [...prev, data.file]);
        }
      } catch (err) {
        console.error("업로드 실패:", err);
      }
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + "B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + "KB";
    return (bytes / (1024 * 1024)).toFixed(1) + "MB";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("audio/")) return "🎵";
    if (type.startsWith("video/")) return "🎬";
    if (type.startsWith("image/")) return "🖼️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("sheet") || type.includes("excel")) return "📊";
    return "📎";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim(), attachedFiles.length > 0 ? attachedFiles : undefined);
    setInput("");
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const pipelineMessages = messages.filter(
    (m) => m.pipelineId === pipeline.id
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="p-4 border-b border-white/10"
        style={{ backgroundColor: pipeline.color + "10" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{pipeline.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white">{pipeline.name}</h2>
              {hq && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: hq.color + "20", color: hq.color }}
                >
                  {hq.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{pipeline.description}</p>
          </div>
        </div>
        {/* 역할 체인 */}
        <RoleChainBadge
          roleChain={pipeline.roleChain}
          legalReview={pipeline.legalReview}
          color={hq?.color || pipeline.color}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {pipelineMessages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <div className="text-center">
              <span className="text-4xl block mb-3">{pipeline.icon}</span>
              <p>{pipeline.name} 파이프라인에 지시해주세요.</p>
              <p className="text-xs mt-1 text-gray-600">
                {pipeline.description}
              </p>
            </div>
          </div>
        )}
        {pipelineMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : msg.role === "system"
                    ? "bg-yellow-600/20 text-yellow-200 border border-yellow-600/30"
                    : "bg-white/10 text-gray-200"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="text-[10px] opacity-50 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString("ko-KR")}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                {stageLabel && (
                  <span className="text-xs text-gray-400 animate-pulse">{stageLabel}</span>
                )}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        {/* 첨부 파일 목록 */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-300"
              >
                <span>{getFileIcon(file.type)}</span>
                <span className="max-w-[120px] truncate">{file.name}</span>
                <span className="text-gray-500">({formatFileSize(file.size)})</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-gray-500 hover:text-red-400 ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-end">
          {/* 파일 첨부 버튼 */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*,video/*,image/*,.pdf,.doc,.docx,.txt,.xlsx,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
            title="파일 첨부"
          >
            {isUploading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span>📎</span>
            )}
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${pipeline.name} 파이프라인에 지시하기...`}
            rows={1}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-white/30 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: pipeline.color,
              color: "white",
            }}
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
}
