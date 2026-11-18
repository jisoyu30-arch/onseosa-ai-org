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
  const { theme, count } = await request.json();

  if (!theme) {
    return Response.json({ error: "theme required" }, { status: 400 });
  }
  if (!count || count < 1) {
    return Response.json({ error: "count must be a positive number" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const { stream, send, close } = createSSE();

  (async () => {
    const results: Record<string, string> = {};

    // ── Step 1: 콘텐츠 기획 (Haiku) ──
    send({ step: 1, status: "running", title: "콘텐츠 기획", detail: `${count}개 포스트 주제 기획 중...` });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: `당신은 온서사 콘텐츠팀의 인스타그램 기획자입니다.
테마를 받으면 ${count}개의 인스타그램 포스트 주제를 기획하세요.

각 포스트:
- 번호
- 주제 제목
- 콘텐츠 유형 (카드뉴스/사진+캡션/캐러셀/릴스)
- 핵심 메시지
- 게시 타이밍 제안

전체 시리즈의 일관성과 스토리 흐름을 고려하세요.
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `테마: ${theme}\n포스트 수: ${count}개\n\n콘텐츠를 기획하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.plan = text;
        send({ step: 1, status: "done", title: "콘텐츠 기획", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "콘텐츠 기획", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 1, status: "retry", title: "콘텐츠 기획", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 2: 카피 작성 (Haiku) ──
    send({ step: 2, status: "running", title: "카피 작성", detail: "각 포스트 본문 카피 작성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 4096,
          system: `당신은 온서사 콘텐츠팀의 카피라이터입니다.
기획된 포스트별로 인스타그램 본문 카피를 작성하세요.

각 포스트:
- 첫 줄: 후크 문장 (피드에서 "더 보기" 클릭 유도)
- 본문: 3~5줄, 공감+정보 균형
- 마지막 줄: CTA (댓글/저장/공유 유도)
- 이모지 적절히 활용

인스타그램 알고리즘에 유리한 구조 (저장 유도 > 좋아요).
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `테마: ${theme}\n콘텐츠 기획:\n${results.plan}\n\n각 포스트의 본문 카피를 작성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.copy = text;
        send({ step: 2, status: "done", title: "카피 작성", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 2, status: "error", title: "카피 작성", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 2, status: "retry", title: "카피 작성", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 3: 해시태그 생성 (Haiku) ──
    send({ step: 3, status: "running", title: "해시태그 생성", detail: "포스트별 해시태그 세트 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: `당신은 온서사 콘텐츠팀의 SNS 성장 전략가입니다.
각 포스트별로 최적화된 해시태그 세트를 생성하세요.

각 포스트:
- 대형 태그 (100만+ 게시물) 5개
- 중형 태그 (10만~100만) 5개
- 소형/니치 태그 (1만~10만) 5개
- 브랜드 태그 3개

총 18~20개, 최대 30개 이내.
한국어/영어 혼합 가능.`,
          messages: [{ role: "user", content: `테마: ${theme}\n콘텐츠 기획:\n${results.plan}\n\n각 포스트별 해시태그를 생성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.hashtags = text;
        send({ step: 3, status: "done", title: "해시태그 생성", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: "해시태그 생성", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 3, status: "retry", title: "해시태그 생성", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 4: Midjourney 이미지 프롬프트 (Haiku) ──
    send({ step: 4, status: "running", title: "이미지 프롬프트", detail: "각 포스트별 Midjourney 프롬프트 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 4096,
          system: `당신은 온서사 콘텐츠팀의 비주얼 디렉터입니다.
각 인스타그램 포스트에 사용할 Midjourney 이미지 프롬프트를 생성하세요.

각 포스트별:
- 영문 프롬프트
- 인스타그램 정사각형 비율 (--ar 1:1)
- 한국적 감성 + 트렌디한 비주얼
- 텍스트 오버레이가 필요한 경우 공간 확보
- Midjourney v6 파라미터 포함

온서사 브랜드: 따뜻한 한국적 감성, 시적이되 흐리지 않은 비주얼.`,
          messages: [{ role: "user", content: `테마: ${theme}\n콘텐츠 기획:\n${results.plan}\n\n각 포스트별 이미지 프롬프트를 생성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.imagePrompts = text;
        send({ step: 4, status: "done", title: "이미지 프롬프트", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 4, status: "error", title: "이미지 프롬프트", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 4, status: "retry", title: "이미지 프롬프트", detail: `재시도 ${attempt}/3...` });
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
        system: `당신은 온서사 CDO입니다. 인스타그램 포스팅 파이프라인 실행 결과를 간결하게 보고받고 요약하세요.
형식: 실행 결과 요약 → 성공/실패 항목 → 다음 액션 제안`,
        messages: [{ role: "user", content: `파이프라인 결과:\n- 테마: ${theme}\n- 포스트 수: ${count}개\n- 콘텐츠 기획: ${results.plan ? "완료" : "실패"}\n- 카피 작성: ${results.copy ? "완료" : "실패"}\n- 해시태그: ${results.hashtags ? "완료" : "실패"}\n- 이미지 프롬프트: ${results.imagePrompts ? "완료" : "실패"}` }],
      });

      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: report });
    } catch {
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: "인스타그램 포스팅 파이프라인 완료. 결과를 확인하세요." });
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
