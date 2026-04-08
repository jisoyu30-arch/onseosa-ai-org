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
  const { title, content } = await request.json();

  if (!title) {
    return Response.json({ error: "title required" }, { status: 400 });
  }
  if (!content) {
    return Response.json({ error: "content required" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const { stream, send, close } = createSSE();

  (async () => {
    const results: Record<string, string> = {};

    // ── Step 1: 목차 구성 (Haiku) ──
    send({ step: 1, status: "running", title: "목차 구성", detail: "챕터 구조 설계 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: `당신은 온서사 퍼블리싱팀의 전자책 편집자입니다.
원고 내용을 분석하여 전자책 목차를 구성하세요.

형식:
- 프롤로그 (선택)
- 파트 / 챕터 구조
- 각 챕터 제목 + 한 줄 요약
- 에필로그 (선택)
- 부록 (선택)

독자 경험을 고려한 챕터 분량 배분도 제안하세요.
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `책 제목: ${title}\n\n원고 내용:\n${content.slice(0, 3000)}\n\n목차를 구성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.toc = text;
        send({ step: 1, status: "done", title: "목차 구성", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "목차 구성", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 1, status: "retry", title: "목차 구성", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 2: 표지 프롬프트 (Haiku) ──
    send({ step: 2, status: "running", title: "표지 프롬프트", detail: "Midjourney용 표지 이미지 프롬프트 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: `당신은 온서사 퍼블리싱팀의 북 디자이너입니다.
책 제목과 내용을 바탕으로 Midjourney용 표지 이미지 프롬프트를 생성하세요.

요구사항:
- 영문 프롬프트 2개 버전 (A안/B안)
- 전자책 표지 비율 (2:3)
- 제목 텍스트 배치 공간 확보
- 한국적 감성 + 현대적 디자인
- Midjourney v6 파라미터 포함 (--ar 2:3 필수)

온서사 브랜드: 따뜻한 한국적 감성, 시적이되 흐리지 않은 비주얼.`,
          messages: [{ role: "user", content: `책 제목: ${title}\n내용 요약:\n${content.slice(0, 1000)}\n\n표지 이미지 프롬프트를 생성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.coverPrompt = text;
        send({ step: 2, status: "done", title: "표지 프롬프트", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 2, status: "error", title: "표지 프롬프트", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 2, status: "retry", title: "표지 프롬프트", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 3: 내지 레이아웃 가이드 (Haiku) ──
    send({ step: 3, status: "running", title: "내지 레이아웃 가이드", detail: "서체, 여백, 스타일 가이드 작성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: `당신은 온서사 퍼블리싱팀의 타이포그래피 디자이너입니다.
전자책 내지 레이아웃 가이드를 작성하세요.

포함 항목:
1. 서체 추천 — 본문, 제목, 캡션별 (한글/영문)
2. 여백 설정 — 상하좌우, 행간, 자간
3. 챕터 타이틀 페이지 스타일
4. 인용구/강조 박스 디자인
5. 각주/미주 스타일
6. 페이지 번호 위치
7. ePub/PDF 각각의 최적 설정

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `책 제목: ${title}\n목차:\n${results.toc}\n\n내지 레이아웃 가이드를 작성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.layoutGuide = text;
        send({ step: 3, status: "done", title: "내지 레이아웃 가이드", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: "내지 레이아웃 가이드", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 3, status: "retry", title: "내지 레이아웃 가이드", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 4: 판매 메타데이터 (Haiku) ──
    send({ step: 4, status: "running", title: "판매 메타데이터", detail: "소개문, 태그, 카테고리 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: `당신은 온서사 퍼블리싱팀의 마케팅 매니저입니다.
전자책 판매를 위한 메타데이터를 생성하세요.

포함 항목:
1. 책 소개문 (100자 / 300자 / 500자 버전)
2. 키워드 태그 10~15개
3. 카테고리 분류 (대/중/소)
4. 타겟 독자 페르소나
5. 유사 도서 3권 (벤치마크)
6. 가격 제안 (전자책/종이책)
7. 출간 시기 제안

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `책 제목: ${title}\n목차:\n${results.toc}\n내용 요약:\n${content.slice(0, 1000)}\n\n판매 메타데이터를 생성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.salesMetadata = text;
        send({ step: 4, status: "done", title: "판매 메타데이터", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 4, status: "error", title: "판매 메타데이터", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 4, status: "retry", title: "판매 메타데이터", detail: `재시도 ${attempt}/3...` });
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
        system: `당신은 온서사 CDO입니다. 전자책 디자인 파이프라인 실행 결과를 간결하게 보고받고 요약하세요.
형식: 실행 결과 요약 → 성공/실패 항목 → 다음 액션 제안`,
        messages: [{ role: "user", content: `파이프라인 결과:\n- 책 제목: ${title}\n- 목차 구성: ${results.toc ? "완료" : "실패"}\n- 표지 프롬프트: ${results.coverPrompt ? "완료" : "실패"}\n- 레이아웃 가이드: ${results.layoutGuide ? "완료" : "실패"}\n- 판매 메타데이터: ${results.salesMetadata ? "완료" : "실패"}` }],
      });

      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: report });
    } catch {
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: "전자책 디자인 파이프라인 완료. 결과를 확인하세요." });
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
