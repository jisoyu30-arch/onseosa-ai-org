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
  const { topic, platform } = await request.json();

  if (!topic) {
    return Response.json({ error: "topic required" }, { status: 400 });
  }
  if (!platform || !["youtube", "instagram", "tiktok"].includes(platform)) {
    return Response.json({ error: "platform must be youtube, instagram, or tiktok" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const { stream, send, close } = createSSE();

  const platformLabels: Record<string, string> = {
    youtube: "YouTube Shorts",
    instagram: "Instagram Reels",
    tiktok: "TikTok",
  };
  const platformLabel = platformLabels[platform];

  (async () => {
    const results: Record<string, string> = {};

    // ── Step 1: 후크 문장 생성 (Haiku) ──
    send({ step: 1, status: "running", title: "후크 문장 생성", detail: `${platformLabel}용 첫 3초 스크립트 생성 중...` });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: `당신은 온서사 콘텐츠팀의 숏폼 크리에이터입니다.
${platformLabel}에 최적화된 후크 문장(첫 3초 스크립트)을 3개 버전으로 생성하세요.

후크 유형:
- 질문형: "혹시 ~해본 적 있나요?"
- 충격형: "이거 모르면 진짜 손해예요"
- 공감형: "다들 이런 경험 있잖아요"

각 후크에 화면 지시(자막 위치, 효과음)도 포함하세요.
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `주제: ${topic}\n플랫폼: ${platformLabel}\n\n후크 문장 3개를 생성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.hook = text;
        send({ step: 1, status: "done", title: "후크 문장 생성", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "후크 문장 생성", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 1, status: "retry", title: "후크 문장 생성", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 2: 본문 스크립트 (Haiku) ──
    send({ step: 2, status: "running", title: "본문 스크립트", detail: "60초 대본 작성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: `당신은 온서사 콘텐츠팀의 숏폼 작가입니다.
${platformLabel}용 60초 분량 스크립트를 작성하세요.

형식:
[00:00~00:03] 후크 — (자막/나레이션)
[00:03~00:15] 도입 — ...
[00:15~00:40] 본론 — ...
[00:40~00:55] 마무리 — ...
[00:55~01:00] CTA — ...

타임코드별로 나레이션, 화면 지시, 자막을 명시하세요.
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `주제: ${topic}\n플랫폼: ${platformLabel}\n선택된 후크:\n${results.hook}\n\n60초 본문 스크립트를 작성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.script = text;
        send({ step: 2, status: "done", title: "본문 스크립트", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 2, status: "error", title: "본문 스크립트", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 2, status: "retry", title: "본문 스크립트", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 3: 자막 + 해시태그 (Haiku) ──
    send({ step: 3, status: "running", title: "자막 + 해시태그", detail: "자막 텍스트와 해시태그 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: `당신은 온서사 콘텐츠팀의 SNS 매니저입니다.
숏폼 스크립트를 받으면 다음을 생성하세요:

1. 자막 텍스트 — 타임코드별 화면에 표시될 자막 (강조 단어 **볼드** 처리)
2. 게시글 본문 — ${platformLabel} 게시 시 사용할 설명문
3. 해시태그 — 15~20개, 도달률 높은 것 우선

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `주제: ${topic}\n스크립트:\n${results.script}\n\n자막과 해시태그를 생성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.captionsAndTags = text;
        send({ step: 3, status: "done", title: "자막 + 해시태그", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: "자막 + 해시태그", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 3, status: "retry", title: "자막 + 해시태그", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 4: Midjourney 썸네일 프롬프트 (Haiku) ──
    send({ step: 4, status: "running", title: "썸네일 프롬프트", detail: "Midjourney용 썸네일 이미지 프롬프트 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: `당신은 온서사 콘텐츠팀의 비주얼 디자이너입니다.
숏폼 콘텐츠의 썸네일 이미지를 위한 Midjourney 프롬프트를 생성하세요.

요구사항:
- 영문 프롬프트
- ${platformLabel} 썸네일 최적 비율
- 눈에 띄는 색감, 인물/오브제 중심
- 텍스트 오버레이 공간 확보
- Midjourney v6 파라미터 포함 (--ar, --style 등)

프롬프트 2개 버전을 생성하세요.`,
          messages: [{ role: "user", content: `주제: ${topic}\n스크립트 요약:\n${results.script?.slice(0, 500)}\n\n썸네일 이미지 프롬프트를 생성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.thumbnailPrompt = text;
        send({ step: 4, status: "done", title: "썸네일 프롬프트", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 4, status: "error", title: "썸네일 프롬프트", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 4, status: "retry", title: "썸네일 프롬프트", detail: `재시도 ${attempt}/3...` });
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
        system: `당신은 온서사 CDO입니다. 숏폼 콘텐츠 파이프라인 실행 결과를 간결하게 보고받고 요약하세요.
형식: 실행 결과 요약 → 성공/실패 항목 → 다음 액션 제안`,
        messages: [{ role: "user", content: `파이프라인 결과:\n- 주제: ${topic}\n- 플랫폼: ${platformLabel}\n- 후크 문장: ${results.hook ? "완료" : "실패"}\n- 본문 스크립트: ${results.script ? "완료" : "실패"}\n- 자막+해시태그: ${results.captionsAndTags ? "완료" : "실패"}\n- 썸네일 프롬프트: ${results.thumbnailPrompt ? "완료" : "실패"}` }],
      });

      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: report });
    } catch {
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: "숏폼 콘텐츠 파이프라인 완료. 결과를 확인하세요." });
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
