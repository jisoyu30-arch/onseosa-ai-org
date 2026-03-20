import { NextRequest } from "next/server";
import { PIPELINES, getHeadquartersForPipeline } from "@/lib/pipelines";
import { reviewQuality } from "@/lib/quality-review";
import { getPipelineMemory } from "@/lib/notion-memory";
import { saveToNotion } from "@/lib/notion-save";
import { routeMessage } from "@/lib/router";
import { reviewLegalRisk, LegalReviewResult } from "@/lib/legal-review";
import { extractContentText } from "@/lib/extract-content";
import {
  generateImage,
  extractImagePrompts,
  isImagePipeline,
  GeneratedImage,
} from "@/lib/image-gen";

// SSE 이벤트 전송 헬퍼
function sseEvent(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  type: string,
  data: unknown
) {
  controller.enqueue(
    encoder.encode(`data: ${JSON.stringify({ type, ...( typeof data === "object" && data !== null ? data : { value: data }) })}\n\n`)
  );
}

// n8n 웹훅 호출
async function callN8n(
  webhookUrl: string,
  payload: Record<string, unknown>
): Promise<string> {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`n8n 응답 오류: ${response.status}`);
  return extractContentText(await response.json());
}

// n8n 페이로드 생성
function buildN8nPayload(
  pipelineId: string,
  pipeline: (typeof PIPELINES)[number],
  hqName: string,
  chatInput: string,
  message: string,
  hasMemory: boolean,
  extra: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    pipeline: pipelineId,
    pipelineName: pipeline.name,
    headquartersId: pipeline.headquartersId,
    headquartersName: hqName,
    message,
    chatInput,
    sessionId: pipelineId,
    notionParentId: pipeline.notionParentId,
    roleChain: pipeline.roleChain,
    legalReview: pipeline.legalReview,
    hasMemory,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

export async function POST(request: NextRequest) {
  let { pipelineId, message } = await request.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, data: unknown) =>
        sseEvent(controller, encoder, type, data);

      try {
        // ── 라우팅 ──
        let routeInfo: { pipelineName?: string; reasoning?: string } = {};
        if (pipelineId === "commander") {
          send("stage", { stage: "routing", label: "총괄운영실장 라우팅 중..." });
          const route = await routeMessage(message);
          pipelineId = route.pipelineId;
          routeInfo = { pipelineName: route.pipelineName, reasoning: route.reasoning };
          send("routed", routeInfo);
        }

        const pipeline = PIPELINES.find((p) => p.id === pipelineId);
        if (!pipeline) {
          send("error", { message: "파이프라인을 찾을 수 없습니다." });
          controller.close();
          return;
        }

        const hq = getHeadquartersForPipeline(pipelineId);
        const webhookUrl = process.env.N8N_WEBHOOK_URL;

        if (!webhookUrl) {
          send("complete", {
            output: `[데모 모드] "${pipeline.name}" 파이프라인이 실행되었습니다.\n\n입력: ${message}\n\n⚠️ N8N_WEBHOOK_URL이 설정되지 않았습니다.`,
            qualityStatus: "미검토",
          });
          controller.close();
          return;
        }

        // ── 0단계: Notion 메모리 조회 ──
        send("stage", { stage: "memory", label: "이전 작업 기록 조회 중..." });
        const memory = await getPipelineMemory(pipeline.notionParentId, 3);
        const chatInputWithMemory = memory ? `${message}\n\n${memory}` : message;

        // ── 1단계: n8n AI Agent 콘텐츠 생성 ──
        send("stage", { stage: "generate", label: `${pipeline.roleChain.creator} 작업 중...` });
        let contentText = await callN8n(
          webhookUrl,
          buildN8nPayload(pipelineId, pipeline, hq?.name || "", chatInputWithMemory, message, memory.length > 0)
        );

        // ── 1-1단계: 이미지 생성 (해당 시) ──
        let generatedImages: GeneratedImage[] = [];
        const shouldGenerateImages =
          isImagePipeline(pipelineId) || extractImagePrompts(contentText).length > 0;

        if (shouldGenerateImages && process.env.OPENAI_API_KEY) {
          send("stage", { stage: "image", label: "이미지 생성 중..." });
          const imagePrompts = extractImagePrompts(contentText).slice(0, 3);
          const imageResults = await Promise.allSettled(
            imagePrompts.map((prompt) => generateImage(prompt))
          );
          for (const result of imageResults) {
            if (result.status === "fulfilled" && result.value) {
              generatedImages.push(result.value);
            }
          }
          if (generatedImages.length > 0) {
            contentText += "\n\n──────────────\n🎨 생성된 이미지\n";
            generatedImages.forEach((img, i) => {
              contentText += `\n[이미지 ${i + 1}] ${img.url}`;
              contentText += `\n  프롬프트: ${img.revisedPrompt.slice(0, 100)}...`;
            });
          }
        }

        // ── 2단계: 품질검토 ──
        send("stage", { stage: "quality", label: "품질관리매니저 검토 중..." });
        let qualityReview = await reviewQuality(pipeline, contentText);

        // ── 2-1단계: 품질 자동 재시도 (최대 2회) ──
        const MAX_RETRIES = 2;
        let retryCount = 0;

        while (qualityReview.qualityStatus === "수정필요" && retryCount < MAX_RETRIES) {
          retryCount++;
          send("stage", { stage: "retry", label: `품질 재시도 ${retryCount}/${MAX_RETRIES}...`, retryCount });

          const retryMessage = `[품질 검토 피드백 기반 수정 요청 - ${retryCount}차 재시도]\n\n원래 요청: ${message}\n\n이전 산출물:\n---\n${contentText}\n---\n\n품질관리매니저 피드백:\n${qualityReview.reviewNotes}\n\n위 피드백을 반영하여 산출물을 수정해주세요.`;
          const retryChatInput = memory ? `${retryMessage}\n\n${memory}` : retryMessage;

          try {
            contentText = await callN8n(
              webhookUrl,
              buildN8nPayload(pipelineId, pipeline, hq?.name || "", retryChatInput, retryMessage, memory.length > 0, {
                isRetry: true,
                retryCount,
              })
            );
            qualityReview = await reviewQuality(pipeline, contentText);

            if (qualityReview.qualityStatus === "승인" || qualityReview.qualityStatus === "조건부승인") {
              break;
            }
          } catch {
            break;
          }
        }

        if (retryCount > 0) {
          qualityReview.reviewNotes += `\n\n(자동 품질 재시도 ${retryCount}회 수행됨)`;
        }

        // ── 2-2단계: 법무검토 + 노션 저장을 병렬 실행 ──
        send("stage", { stage: "finalize", label: "법무검토 + 노션 저장 중..." });

        const now = new Date();
        const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
        const title = `[${pipeline.name}] ${message.slice(0, 40)}${message.length > 40 ? "..." : ""} [${dateStr}]`;

        // 법무검토와 노션 저장을 동시에 실행
        const [legalResult, notionResult] = await Promise.all([
          pipeline.legalReview
            ? reviewLegalRisk(contentText, pipeline.name)
            : Promise.resolve(undefined as LegalReviewResult | undefined),
          saveToNotion(pipeline.notionParentId, title, contentText, pipeline.name),
        ]);

        // ── 결과 조합 ──
        let outputText = "";
        if (routeInfo.pipelineName) {
          outputText += `🎯 총괄운영실장 → ${routeInfo.pipelineName} 파이프라인으로 배분\n💡 ${routeInfo.reasoning}\n\n──────────────\n\n`;
        }
        outputText += contentText;

        // ── 최종 결과 전송 ──
        send("complete", {
          output: outputText,
          qualityStatus: qualityReview.qualityStatus,
          reviewNotes: qualityReview.reviewNotes,
          reviewerName: qualityReview.reviewerName,
          notionUrl: notionResult?.url,
          notionName: notionResult?.title,
          notionId: notionResult?.id,
          notionError: notionResult === null ? "Notion 저장 실패" : undefined,
          ...(legalResult && {
            legalReview: {
              riskLevel: legalResult.riskLevel,
              issues: legalResult.issues,
              recommendation: legalResult.recommendation,
            },
          }),
          ...(generatedImages.length > 0 && {
            generatedImages: generatedImages.map((img) => ({
              url: img.url,
              revisedPrompt: img.revisedPrompt,
            })),
          }),
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
        send("error", { message: `파이프라인 실행 실패: ${errorMessage}` });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
