import Anthropic from "@anthropic-ai/sdk";

export interface LegalReviewResult {
  riskLevel: "안전" | "주의" | "위험" | "검토필요";
  issues: string[];
  recommendation: string;
}

export async function reviewLegalRisk(
  content: string,
  pipelineName: string
): Promise<LegalReviewResult> {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error("CLAUDE_API_KEY가 설정되지 않았습니다.");
      return {
        riskLevel: "검토필요",
        issues: ["CLAUDE_API_KEY가 설정되지 않아 법무 검토를 수행할 수 없습니다."],
        recommendation: "API 키 설정 후 다시 검토해주세요.",
      };
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `당신은 온서사 스튜디오의 법무리스크매니저입니다.
AI 직원들이 생성한 산출물의 법적 리스크를 사전 검토합니다.

중요: 이것은 내부 사전 스크리닝이며, 실제 법률 자문을 대체하지 않습니다.
심각한 리스크가 발견되면 반드시 전문 법률 자문을 권고해야 합니다.

[검토 항목]
1. 저작권 문제: 기존 저작물 무단 인용/복제, 표절 가능성
2. 상표권 문제: 타사 브랜드/상표 무단 사용
3. 개인정보/프라이버시: 개인정보 포함 여부, 초상권, 프라이버시 침해
4. 플랫폼 정책 위반: 유튜브/인스타그램/음원플랫폼 등의 정책 위반 가능성
5. 계약/협력 리스크: 라이선스 조건 위반, 제3자 권리 침해 가능성

[리스크 판정 기준]
- 안전: 법적 리스크 없음, 바로 사용 가능
- 주의: 경미한 리스크 있음, 수정 권고
- 위험: 심각한 법적 리스크 존재, 수정 필수
- 검토필요: 판단 불가, 전문가 검토 필요

[응답 형식]
반드시 아래 JSON 형식으로만 응답하세요:
{
  "riskLevel": "안전|주의|위험|검토필요",
  "issues": ["발견된 이슈 1", "발견된 이슈 2"],
  "recommendation": "종합 권고 사항 1-2문장"
}

issues가 없으면 빈 배열 []로 응답하세요.`,
      messages: [
        {
          role: "user",
          content: `파이프라인: ${pipelineName}
산출물 내용:
---
${content.slice(0, 3000)}
---

위 산출물의 법적 리스크를 검토해주세요.`,
        },
      ],
    });

    const reviewText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // JSON 파싱 시도
    try {
      const jsonMatch = reviewText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          riskLevel: parsed.riskLevel || "검토필요",
          issues: Array.isArray(parsed.issues) ? parsed.issues : [],
          recommendation: parsed.recommendation || "",
        };
      }
    } catch {
      // JSON 파싱 실패 시 텍스트 기반 파싱
    }

    // 텍스트 기반 폴백 파싱
    let riskLevel: LegalReviewResult["riskLevel"] = "검토필요";
    if (reviewText.includes("안전")) riskLevel = "안전";
    else if (reviewText.includes("위험")) riskLevel = "위험";
    else if (reviewText.includes("주의")) riskLevel = "주의";

    return {
      riskLevel,
      issues: [reviewText],
      recommendation: "응답 형식 파싱 실패 - 원문을 확인해주세요.",
    };
  } catch (error) {
    console.error("법무 리스크 검토 실패:", error);
    return {
      riskLevel: "검토필요",
      issues: ["법무 리스크 검토 중 오류가 발생했습니다."],
      recommendation: "수동으로 법적 리스크를 확인해주세요.",
    };
  }
}
