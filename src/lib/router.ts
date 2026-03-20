import Anthropic from "@anthropic-ai/sdk";
import { PIPELINES, HEADQUARTERS } from "./pipelines";

interface RouteResult {
  pipelineId: string;
  pipelineName: string;
  reasoning: string;
}

export async function routeMessage(message: string): Promise<RouteResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    // API 키 없으면 기본 라우팅
    return {
      pipelineId: PIPELINES[0].id,
      pipelineName: PIPELINES[0].name,
      reasoning: "API 키 없음 - 기본 파이프라인으로 라우팅",
    };
  }

  const client = new Anthropic({ apiKey });

  const pipelineList = PIPELINES.map(
    (p) => `- ${p.id}: ${p.name} (${p.description})`
  ).join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 256,
    system: `당신은 온서사 스튜디오의 총괄운영실장입니다.
대표의 지시를 분석해서 가장 적합한 파이프라인 하나에 배분합니다.

[사용 가능한 파이프라인]
${pipelineList}

[라우팅 핵심 규칙]
- 소설/웹소설/연재물 관련 → web-novel-draft
- 드라마/대본/시나리오/숏폼드라마 → web-drama-draft
- 숏폼/릴스/쇼츠/틱톡/SNS영상 → short-form
- 음원/곡/작곡/앨범/노래 → music-album
- 뮤직비디오/MV/영상제작 → music-video
- 플레이리스트/유튜브 → playlist
- 세계관/캐릭터/설정 → worldbuilding
- 전자책/에세이/출판 → ebook
- 인스타/게시글/카피/문구 → instagram-post
- 앱/개발/기능/코딩 → app-dev
- 지원사업/공모/보조금/사업계획 → gov-support

[응답 형식]
반드시 아래 형식으로만 응답하세요. 다른 말 하지 마세요:
파이프라인: [파이프라인 id]
사유: [1문장]`,
    messages: [
      {
        role: "user",
        content: `대표 지시: "${message}"\n\n어떤 파이프라인에 배분할까요?`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // 파이프라인 ID 파싱
  const idMatch = text.match(/파이프라인:\s*(\S+)/);
  const reasonMatch = text.match(/사유:\s*(.+)/);

  if (idMatch) {
    const matchedId = idMatch[1];
    const pipeline = PIPELINES.find((p) => p.id === matchedId);
    if (pipeline) {
      return {
        pipelineId: pipeline.id,
        pipelineName: pipeline.name,
        reasoning: reasonMatch?.[1] || "",
      };
    }
  }

  // 텍스트에서 파이프라인 이름 매칭 시도
  for (const p of PIPELINES) {
    if (text.includes(p.id) || text.includes(p.name)) {
      return {
        pipelineId: p.id,
        pipelineName: p.name,
        reasoning: reasonMatch?.[1] || text.slice(0, 100),
      };
    }
  }

  // 기본값
  return {
    pipelineId: PIPELINES[0].id,
    pipelineName: PIPELINES[0].name,
    reasoning: "적합한 파이프라인을 찾지 못해 기본값으로 라우팅",
  };
}
