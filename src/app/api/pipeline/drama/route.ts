import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

function createSSE() {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController | null = null;

  const stream = new ReadableStream({
    start(c) {
      controller = c;
    },
  });

  const send = (data: Record<string, unknown>) => {
    controller?.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  const close = () => {
    controller?.enqueue(encoder.encode("data: [DONE]\n\n"));
    controller?.close();
  };

  return { stream, send, close };
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(request: NextRequest) {
  const { plan, previousScript, episodeNumber, direction } = await request.json();

  if (!plan) {
    return Response.json({ error: "기획안을 입력해주세요" }, { status: 400 });
  }

  const anthropic = new Anthropic();
  const { stream, send, close } = createSSE();

  const hasPreviousScript = previousScript && previousScript.trim().length > 0;
  const hasDirection = direction && direction.trim().length > 0;

  (async () => {
    const results: Record<string, string> = {};

    // ── Step 1: 기획안 & 기존 대본 분석 (Sonnet — 기획작가) ──
    send({ step: 1, status: "running", title: "기획안 & 기존 대본 분석", detail: "스토리 흐름, 캐릭터 아크, 복선 파악 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          system: `당신은 온서사 콘텐츠창작본부의 기획작가입니다.
웹드라마 기획안과 기존 대본을 분석하여, 다음 회차를 쓰기 위한 컨텍스트를 정리하세요.

분석 항목:
1. 전체 시리즈 구조 파악 (기획안 기반)
2. 기존 대본까지의 스토리 진행 상황 요약
3. 살아있는 복선 목록 (아직 회수되지 않은 것들)
4. 캐릭터별 현재 감정 상태/관계 변화
5. 다음 회차에서 다뤄야 할 핵심 플롯 포인트
6. 톤/분위기 일관성 체크 (기존 대본의 문체 특징)

${hasPreviousScript ? "" : "기존 대본이 없으므로 첫 회차를 위한 준비 분석을 하세요."}
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `[기획안]
${plan}

${hasPreviousScript ? `[기존 대본 (이전 회차까지)]
${previousScript}` : "[첫 회차 집필]"}

${hasDirection ? `[이번 회차 방향 메모]
${direction}` : ""}

${episodeNumber}화를 쓰기 위한 분석을 해주세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.analysis = text;
        send({ step: 1, status: "done", title: "기획안 & 기존 대본 분석", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "기획안 & 기존 대본 분석", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 1, status: "retry", title: "기획안 & 기존 대본 분석", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 2: 씬 구성 설계 (Sonnet — 웹드라마작가) ──
    send({ step: 2, status: "running", title: `${episodeNumber}화 씬 구성 설계`, detail: "이전 흐름에 이어지는 씬 리스트 작성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          system: `당신은 온서사 콘텐츠창작본부의 웹드라마작가입니다.
기획작가의 분석 결과를 바탕으로 ${episodeNumber}화의 씬 구성을 설계하세요.

${hasPreviousScript ? "이전 대본의 마지막 씬에서 자연스럽게 이어지는 구성이어야 합니다." : "첫 회차이므로 시청자를 확실히 사로잡는 오프닝이 필요합니다."}

각 씬에 대해:
- S#번호. 장소 (INT/EXT) / 시간대
- 등장인물
- 씬 목적 (정보 전달/감정 고조/관계 변화/복선 설치/복선 회수)
- 핵심 대사 방향 (1-2줄 요약)
- 예상 러닝타임 (1-2분)
- 이전 회차와의 연결점

웹드라마 특성: 10~15분 분량, 빠른 전개, 엔딩은 다음 회차 궁금증 유발.
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `[분석 결과]
${results.analysis}

${hasDirection ? `[이번 회차 방향 메모]
${direction}` : ""}

${episodeNumber}화 씬 구성을 설계하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.sceneList = text;
        send({ step: 2, status: "done", title: `${episodeNumber}화 씬 구성 설계`, result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 2, status: "error", title: `${episodeNumber}화 씬 구성 설계`, error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 2, status: "retry", title: `${episodeNumber}화 씬 구성 설계`, detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 3: 대본 집필 (Sonnet — 웹드라마작가) ──
    send({ step: 3, status: "running", title: `${episodeNumber}화 대본 집필`, detail: "대사 + 지문 집필 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8192,
          system: `당신은 온서사 콘텐츠창작본부의 웹드라마작가입니다.
씬 구성을 바탕으로 ${episodeNumber}화 대본을 집필하세요.

핵심 원칙:
${hasPreviousScript ? `- 기존 대본의 문체, 캐릭터 말투, 분위기를 정확히 이어가세요
- 이전 회차 마지막 장면과 자연스럽게 연결되어야 합니다
- 캐릭터 말투가 이전과 달라지면 안 됩니다` : "- 첫 회차이므로 캐릭터 특성이 명확히 드러나도록 하세요"}

대본 형식:
S#1. 장소 / 시간대
  (지문: 공간 묘사, 인물 동작)
  캐릭터명: 대사
  (지문: 감정, 액션)

- 대사는 자연스러운 구어체
- 지문은 촬영/AI영상 제작 가능한 수준으로 구체적
- 각 씬의 감정 온도를 명시
- 마지막 씬은 다음 회차 기대감을 남기는 엔딩

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `[기획안 요약]
${plan.slice(0, 2000)}

${hasPreviousScript ? `[기존 대본 (이전 회차)]
${previousScript.slice(-4000)}` : ""}

[${episodeNumber}화 씬 구성]
${results.sceneList}

${episodeNumber}화 대본을 집필하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.script = text;
        send({ step: 3, status: "done", title: `${episodeNumber}화 대본 집필`, result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: `${episodeNumber}화 대본 집필`, error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 3, status: "retry", title: `${episodeNumber}화 대본 집필`, detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 4: 대사/씬 흐름 검토 (Haiku — IP콘텐츠전략실장) ──
    send({ step: 4, status: "running", title: "대사/씬 흐름 검토", detail: "캐릭터 일관성, 대사 자연스러움, 씬 전환 검토 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2000,
          system: `당신은 온서사 콘텐츠창작본부의 IP콘텐츠전략실장입니다.
웹드라마 대본의 품질을 검토하세요.

검토 항목:
1. 캐릭터 일관성 — 말투, 성격이 기획안/이전 대본과 일치하는가
2. 대사 자연스러움 — 구어체로 자연스러운가, 어색한 대사는 없는가
3. 씬 전환 — 씬 간 연결이 매끄러운가
4. 감정선 — 감정의 고저가 적절한가
5. 복선 처리 — 복선이 자연스럽게 설치/회수되는가
6. 엔딩 — 다음 회차 기대감을 충분히 만드는가

문제가 있으면 구체적인 수정 제안과 함께 표시하세요.`,
          messages: [{ role: "user", content: `[${episodeNumber}화 대본]
${results.script}

[기획안 요약]
${plan.slice(0, 1000)}

검토 결과를 작성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.review = text;
        send({ step: 4, status: "done", title: "대사/씬 흐름 검토", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 4, status: "error", title: "대사/씬 흐름 검토", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 4, status: "retry", title: "대사/씬 흐름 검토", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 5: 품질 검토 & 총괄 보고 (품질관리매니저 → 총괄운영실장) ──
    send({ step: 5, status: "running", title: "품질 검토 & 총괄 보고", detail: "최종 검수 및 보고서 작성 중..." });

    try {
      const reportRes = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: `당신은 온서사의 품질관리매니저 겸 총괄운영실장입니다.

웹드라마 대본 파이프라인 결과를 검토하고 보고하세요.

## 품질 검토
각 단계에 대해: ✅ 승인 | ⚠️ 조건부 승인 | 🔧 수정 필요 | ⏸️ 보류

## 총괄 보고
1. 핵심 요약 (3줄)
2. 대본 완성도 평가 (A/B/C/D)
3. 수정 필요 사항 (있으면)
4. 다음 단계 (영상 제작 연계 가능 여부)
5. 대표 확인 필요 사항`,
        messages: [{ role: "user", content: `[${episodeNumber}화 파이프라인 결과]
- 기존 대본 분석: ${results.analysis ? "완료" : "실패"}
- 씬 구성: ${results.sceneList ? "완료" : "실패"}
- 대본 집필: ${results.script ? "완료" : "실패"}
- 대사/씬 검토: ${results.review ? "완료" : "실패"}

[검토 결과 요약]
${results.review?.slice(0, 500) || "없음"}

품질 검토와 총괄 보고를 작성하세요.` }],
      });

      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 5, status: "done", title: "품질 검토 & 총괄 보고", result: report });
    } catch {
      send({ step: 5, status: "done", title: "품질 검토 & 총괄 보고", result: `웹드라마 ${episodeNumber}화 대본 파이프라인 완료. 결과를 확인하세요.` });
    }

    close();
  })();

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
