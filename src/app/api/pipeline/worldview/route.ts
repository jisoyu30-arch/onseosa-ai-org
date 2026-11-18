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
  const { concept } = await request.json();

  if (!concept) {
    return Response.json({ error: "concept required" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const { stream, send, close } = createSSE();

  (async () => {
    const results: Record<string, string> = {};

    // ── Step 1: 세계관 골격 설계 (Sonnet) ──
    send({ step: 1, status: "running", title: "세계관 골격 설계", detail: "시대배경, 공간, 규칙 체계를 설계하는 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: `당신은 온서사 IP팀의 세계관 설계자입니다.
작품 콘셉트를 받으면 다음을 설계하세요:

1. 시대 배경 — 구체적 시간대와 역사적/가상적 맥락
2. 공간 구조 — 주요 장소, 지리적 특성, 분위기
3. 규칙 체계 — 이 세계만의 물리/사회/초자연 법칙

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `작품 콘셉트:\n${concept}\n\n위 콘셉트를 바탕으로 세계관 골격을 설계하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.worldSkeleton = text;
        send({ step: 1, status: "done", title: "세계관 골격 설계", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "세계관 골격 설계", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 1, status: "retry", title: "세계관 골격 설계", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 2: 캐릭터 설계 (Sonnet) ──
    send({ step: 2, status: "running", title: "캐릭터 설계", detail: "주요 캐릭터 3~5명과 관계도를 설계하는 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: `당신은 온서사 IP팀의 캐릭터 디자이너입니다.
세계관 골격을 바탕으로 주요 캐릭터 3~5명을 설계하세요.

각 캐릭터:
- 이름, 나이, 외형 묘사
- 성격 키워드 3개
- 배경 스토리
- 핵심 동기와 약점

마지막에 캐릭터 간 관계도를 텍스트로 정리하세요.
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `콘셉트:\n${concept}\n\n세계관 골격:\n${results.worldSkeleton}\n\n캐릭터를 설계하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.characters = text;
        send({ step: 2, status: "done", title: "캐릭터 설계", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 2, status: "error", title: "캐릭터 설계", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 2, status: "retry", title: "캐릭터 설계", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 3: 갈등 구조 설계 (Sonnet) ──
    send({ step: 3, status: "running", title: "갈등 구조 설계", detail: "핵심 갈등과 서브 플롯을 설계하는 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: `당신은 온서사 IP팀의 스토리 아키텍트입니다.
세계관과 캐릭터를 바탕으로 갈등 구조를 설계하세요.

1. 핵심 갈등 — 중심 서사를 이끄는 메인 갈등
2. 서브 플롯 2~3개 — 캐릭터 간 또는 세계관 내부 갈등
3. 긴장 곡선 — 이야기의 텐션이 어떻게 변화하는지
4. 테마 메시지 — 이 이야기가 궁극적으로 전하는 것

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `콘셉트:\n${concept}\n\n세계관:\n${results.worldSkeleton}\n\n캐릭터:\n${results.characters}\n\n갈등 구조를 설계하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.conflict = text;
        send({ step: 3, status: "done", title: "갈등 구조 설계", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: "갈등 구조 설계", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 3, status: "retry", title: "갈등 구조 설계", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 4: 설정집 통합 (Haiku) ──
    send({ step: 4, status: "running", title: "설정집 통합", detail: "모든 설정을 하나의 문서로 정리하는 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 4096,
          system: `당신은 온서사 IP팀의 편집자입니다.
세계관 골격, 캐릭터, 갈등 구조를 하나의 통합 설정집으로 정리하세요.

형식:
# [작품명] 설정집

## 1. 세계관
## 2. 캐릭터 프로필
## 3. 관계도
## 4. 갈등 구조
## 5. 스토리 로드맵

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `콘셉트:\n${concept}\n\n세계관 골격:\n${results.worldSkeleton}\n\n캐릭터:\n${results.characters}\n\n갈등 구조:\n${results.conflict}\n\n통합 설정집으로 정리하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.settingDoc = text;
        send({ step: 4, status: "done", title: "설정집 통합", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 4, status: "error", title: "설정집 통합", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 4, status: "retry", title: "설정집 통합", detail: `재시도 ${attempt}/3...` });
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
        system: `당신은 온서사 CDO입니다. 세계관 설정 파이프라인 실행 결과를 간결하게 보고받고 요약하세요.
형식: 실행 결과 요약 → 성공/실패 항목 → 다음 액션 제안`,
        messages: [{ role: "user", content: `파이프라인 결과:\n${JSON.stringify(results, null, 2)}` }],
      });

      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: report });
    } catch {
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: "세계관 설정 파이프라인 완료. 결과를 확인하세요." });
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
