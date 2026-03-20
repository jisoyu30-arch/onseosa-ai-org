import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/image-gen";
import { PIPELINES } from "@/lib/pipelines";

export async function POST(request: NextRequest) {
  try {
    const { prompt, pipelineId, size } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "프롬프트가 필요합니다." },
        { status: 400 }
      );
    }

    if (prompt.length < 10) {
      return NextResponse.json(
        { error: "프롬프트가 너무 짧습니다. (최소 10자)" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // 파이프라인 정보 (선택적)
    const pipeline = pipelineId
      ? PIPELINES.find((p) => p.id === pipelineId)
      : null;

    console.log(
      `[generate-image] 요청: pipeline=${pipeline?.name || "없음"}, prompt="${prompt.slice(0, 60)}..."`
    );

    const result = await generateImage(prompt, size);

    if (!result) {
      return NextResponse.json(
        { error: "이미지 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: {
        url: result.url,
        revisedPrompt: result.revisedPrompt,
        originalUrl: result.originalUrl,
        pipelineId: pipelineId || null,
        pipelineName: pipeline?.name || null,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[generate-image] API 오류:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `이미지 생성 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}
