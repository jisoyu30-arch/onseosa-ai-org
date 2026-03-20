import Anthropic from "@anthropic-ai/sdk";
import { QualityStatus, Pipeline } from "./types";
import { getRoleById } from "./pipelines";

interface QualityReviewResult {
  qualityStatus: QualityStatus;
  reviewNotes: string;
  reviewerName: string;
}

export async function reviewQuality(
  pipeline: Pipeline,
  content: string
): Promise<QualityReviewResult> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY가 설정되지 않았습니다.");
      return {
        qualityStatus: "미검토",
        reviewNotes: "ANTHROPIC_API_KEY가 설정되지 않아 품질 검토를 건너뛰었습니다.",
        reviewerName: "품질관리매니저",
      };
    }

    const client = new Anthropic({ apiKey });
    const creator = getRoleById(pipeline.roleChain.creator);
    const reviewer = getRoleById(pipeline.roleChain.approver);

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `당신은 온서사 스튜디오의 품질관리매니저입니다.
모든 AI 직원이 생성한 산출물을 검토하고 품질을 판정합니다.

[품질 판정 기준]
- 승인: 완성도 높음, 바로 사용/배포 가능
- 조건부승인: 대체로 괜찮으나 소소한 수정 필요
- 수정필요: 구조적 문제 또는 품질 미달, 재작업 필요
- 보류: 방향성 재검토 필요, 추가 논의 필요

[검토 항목]
1. 완성도: 요청한 내용이 충분히 다뤄졌는가
2. 일관성: 온서사 브랜드 톤앤매너에 부합하는가
3. 실행가능성: 실제 사용/배포할 수 있는 수준인가
4. 오류: 사실 관계 오류, 논리적 모순이 없는가

[응답 형식]
반드시 아래 형식으로만 응답하세요:
판정: [승인/조건부승인/수정필요/보류]
사유: [1-2문장으로 간결하게]`,
      messages: [
        {
          role: "user",
          content: `파이프라인: ${pipeline.name}
작성자: ${creator?.name || pipeline.roleChain.creator}
산출물 내용:
---
${content.slice(0, 3000)}
---

위 산출물의 품질을 검토해주세요.`,
        },
      ],
    });

    const reviewText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // 판정 결과 파싱 — "판정:" 라인에서 정확히 추출
    let qualityStatus: QualityStatus = "미검토";
    const verdictMatch = reviewText.match(/판정:\s*(\S+)/);
    const verdict = verdictMatch?.[1] || reviewText;

    if (/조건부\s?승인/.test(verdict)) {
      qualityStatus = "조건부승인";
    } else if (/수정\s?필요/.test(verdict)) {
      qualityStatus = "수정필요";
    } else if (verdict.includes("보류")) {
      qualityStatus = "보류";
    } else if (verdict.includes("승인")) {
      qualityStatus = "승인";
    }

    return {
      qualityStatus,
      reviewNotes: reviewText,
      reviewerName: reviewer?.name || "품질관리매니저",
    };
  } catch (error) {
    console.error("품질 검토 실패:", error);
    return {
      qualityStatus: "미검토",
      reviewNotes: "품질 검토 중 오류가 발생했습니다.",
      reviewerName: "품질관리매니저",
    };
  }
}
