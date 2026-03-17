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
  const { worldview, episodeNumber } = await request.json();

  if (!worldview) {
    return Response.json({ error: "worldview required" }, { status: 400 });
  }
  if (!episodeNumber) {
    return Response.json({ error: "episodeNumber required" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const { stream, send, close } = createSSE();

  (async () => {
    const results: Record<string, string> = {};

    // ── Step 1: 씬 구성 (Sonnet) ──
    send({ step: 1, status: "running", title: "씬 구성", detail: `${episodeNumber}화 씬 리스트, 장소, 등장인물 설계 중...` });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: `당신은 온서사 오리지널팀의 웹드라마 구성작가입니다.
세계관과 회차 번호를 받으면 해당 회차의 씬 구성을 설계하세요.

각 씬에 대해:
- 씬 번호 + 장소 (INT/EXT, 시간대)
- 등장인물 목록
- 씬 목적 (정보 전달/감정 고조/관계 변화 등)
- 예상 러닝타임

웹드라마 특성: 10~15분 분량, 빠른 전개, 씬당 1~2분.
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `세계관:\n${worldview}\n\n${episodeNumber}화 씬 구성을 설계하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.sceneList = text;
        send({ step: 1, status: "done", title: "씬 구성", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "씬 구성", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 1, status: "retry", title: "씬 구성", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 2: 대본 집필 (Sonnet) ──
    send({ step: 2, status: "running", title: "대본 집필", detail: "대사 + 지문 집필 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8192,
          system: `당신은 온서사 오리지널팀의 웹드라마 작가입니다.
씬 구성을 바탕으로 대본을 집필하세요.

대본 형식:
S#1. 장소 / 시간대
  (지문: 공간 묘사, 인물 동작)
  캐릭터명: 대사
  (지문: 감정, 액션)

- 대사는 자연스러운 구어체
- 지문은 촬영 가능한 수준으로 구체적
- 각 씬의 감정 온도를 명시

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `세계관:\n${worldview}\n\n씬 구성:\n${results.sceneList}\n\n${episodeNumber}화 대본을 집필하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.script = text;
        send({ step: 2, status: "done", title: "대본 집필", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 2, status: "error", title: "대본 집필", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 2, status: "retry", title: "대본 집필", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 3: 연출 노트 (Haiku) ──
    send({ step: 3, status: "running", title: "연출 노트", detail: "카메라 앵글, 감정선 연출 노트 작성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 4096,
          system: `당신은 온서사 오리지널팀의 웹드라마 연출감독입니다.
대본을 받으면 각 씬에 대한 연출 노트를 작성하세요.

각 씬별:
- 카메라 앵글 (와이드, 클로즈업, 오버숄더 등)
- 조명 톤 (따뜻한 / 차가운 / 자연광)
- 감정선 그래프 (1~10 스케일)
- BGM 방향 (장르, 분위기)
- 특수 연출 (슬로모션, 몽타주, 컷어웨이 등)

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `대본:\n${results.script}\n\n연출 노트를 작성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.directionNotes = text;
        send({ step: 3, status: "done", title: "연출 노트", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: "연출 노트", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 3, status: "retry", title: "연출 노트", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 4: CDO 보고 (Haiku) ──
    send({ step: 4, status: "running", title: "CDO 결과 보고", detail: "파이프라인 결과 취합 중..." });

    try {
      const reportRes = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: `당신은 온서사 CDO입니다. 웹드라마 대본 파이프라인 실행 결과를 간결하게 보고받고 요약하세요.
형식: 실행 결과 요약 → 성공/실패 항목 → 다음 액션 제안`,
        messages: [{ role: "user", content: `파이프라인 결과:\n- 회차: ${episodeNumber}화\n- 씬 구성: ${results.sceneList ? "완료" : "실패"}\n- 대본 집필: ${results.script ? "완료" : "실패"}\n- 연출 노트: ${results.directionNotes ? "완료" : "실패"}` }],
      });

      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 4, status: "done", title: "CDO 결과 보고", result: report });
    } catch {
      send({ step: 4, status: "done", title: "CDO 결과 보고", result: `웹드라마 ${episodeNumber}화 대본 파이프라인 완료. 결과를 확인하세요.` });
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
