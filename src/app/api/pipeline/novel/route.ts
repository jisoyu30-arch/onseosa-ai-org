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
  const { worldview, episode } = await request.json();

  if (!worldview) {
    return Response.json({ error: "worldview required" }, { status: 400 });
  }
  if (!episode) {
    return Response.json({ error: "episode number required" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const { stream, send, close } = createSSE();

  (async () => {
    const results: Record<string, string> = {};

    // ── Step 1: 회차 플롯 설계 (Sonnet) ──
    send({ step: 1, status: "running", title: "회차 플롯 설계", detail: `${episode}화 기승전결 및 클리프행어 설계 중...` });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: `당신은 온서사 IP팀의 웹소설 플롯 디자이너입니다.
세계관과 회차 번호를 받으면 해당 회차의 플롯을 설계하세요.

1. 기 — 도입부 (독자 몰입 후크)
2. 승 — 전개 (갈등 심화)
3. 전 — 클라이맥스 (반전 또는 결정적 장면)
4. 결 — 마무리 + 클리프행어 (다음 화 견인)

독자 이탈을 방지할 텐션 포인트를 최소 2개 명시하세요.
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `세계관:\n${worldview}\n\n${episode}화 플롯을 설계하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.plot = text;
        send({ step: 1, status: "done", title: "회차 플롯 설계", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "회차 플롯 설계", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 1, status: "retry", title: "회차 플롯 설계", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 2: 초고 집필 (Sonnet) ──
    send({ step: 2, status: "running", title: "초고 집필", detail: "3000자 내외 본문 집필 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8192,
          system: `당신은 온서사 IP팀의 웹소설 작가입니다.
플롯을 바탕으로 ${episode}화 본문을 집필하세요.

- 분량: 3000자 내외
- 문체: 웹소설 특유의 빠른 호흡, 짧은 문장, 감정선 강조
- 대화 비중: 40~50%
- 장면 전환은 '***'로 구분
- 마지막은 반드시 클리프행어로 마무리

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `세계관:\n${worldview}\n\n${episode}화 플롯:\n${results.plot}\n\n위 플롯을 바탕으로 본문을 집필하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.draft = text;
        send({ step: 2, status: "done", title: "초고 집필", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 2, status: "error", title: "초고 집필", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 2, status: "retry", title: "초고 집필", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 3: 편집 피드백 (Sonnet) ──
    send({ step: 3, status: "running", title: "편집 피드백", detail: "문체, 전개, 독자 이탈 포인트 분석 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: `당신은 온서사 IP팀의 편집장입니다.
웹소설 초고를 받으면 다음 관점에서 피드백하세요:

1. 문체 — 일관성, 리듬, 웹소설 적합도
2. 전개 — 플롯 이행 충실도, 페이싱
3. 독자 이탈 포인트 — 지루해질 수 있는 구간 지적
4. 클리프행어 효과 — 다음 화 클릭 유도 강도
5. 구체적 수정 제안 — 어떤 문장/단락을 어떻게 고치면 좋을지

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `${episode}화 초고:\n${results.draft}\n\n편집 피드백을 주세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.feedback = text;
        send({ step: 3, status: "done", title: "편집 피드백", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: "편집 피드백", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 3, status: "retry", title: "편집 피드백", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 4: 최종 교정 (Haiku) ──
    send({ step: 4, status: "running", title: "최종 교정", detail: "맞춤법, 문체 통일 교정 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 8192,
          system: `당신은 온서사 IP팀의 교정 교열 담당자입니다.
웹소설 초고와 편집 피드백을 반영하여 최종 교정본을 작성하세요.

- 맞춤법/띄어쓰기 교정
- 문체 통일 (경어/반말 혼용 수정)
- 불필요한 반복 표현 제거
- 편집 피드백 반영

최종본 전문을 출력하세요.`,
          messages: [{ role: "user", content: `${episode}화 초고:\n${results.draft}\n\n편집 피드백:\n${results.feedback}\n\n최종 교정본을 작성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.final = text;
        send({ step: 4, status: "done", title: "최종 교정", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 4, status: "error", title: "최종 교정", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 4, status: "retry", title: "최종 교정", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 5: CDO 보고 (Haiku) ──
    send({ step: 5, status: "running", title: "CDO 결과 보고", detail: "파이프라인 결과 취합 중..." });

    try {
      const reportRes = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: `당신은 온서사 CDO입니다. 웹소설 초안 파이프라인 실행 결과를 간결하게 보고받고 요약하세요.
형식: 실행 결과 요약 → 성공/실패 항목 → 다음 액션 제안`,
        messages: [{ role: "user", content: `파이프라인 결과:\n- 회차: ${episode}화\n- 플롯 설계: ${results.plot ? "완료" : "실패"}\n- 초고 집필: ${results.draft ? "완료" : "실패"}\n- 편집 피드백: ${results.feedback ? "완료" : "실패"}\n- 최종 교정: ${results.final ? "완료" : "실패"}` }],
      });

      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: report });
    } catch {
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: `웹소설 ${episode}화 파이프라인 완료. 결과를 확인하세요.` });
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
