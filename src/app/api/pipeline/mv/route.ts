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
  const { worldview, songTitle } = await request.json();

  if (!worldview) {
    return Response.json({ error: "worldview required" }, { status: 400 });
  }
  if (!songTitle) {
    return Response.json({ error: "songTitle required" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const { stream, send, close } = createSSE();

  (async () => {
    const results: Record<string, string> = {};

    // ── Step 1: 뮤비 콘셉트 설계 (Sonnet) ──
    send({ step: 1, status: "running", title: "뮤비 콘셉트 설계", detail: "시각적 방향과 스토리라인 설계 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: `당신은 온서사 오리지널팀의 뮤직비디오 감독입니다.
세계관과 곡 제목을 바탕으로 뮤직비디오 콘셉트를 설계하세요.

포함 항목:
1. 비주얼 콘셉트 — 색감, 톤, 미장센 방향
2. 스토리라인 — 서사 구조 (기승전결)
3. 핵심 장면 5개 — 각 장면의 비주얼 키워드
4. 의상/소품 방향 — 캐릭터별 스타일링
5. 레퍼런스 — 참고할 만한 뮤비/영화 3개

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.
한국적 미장센 + 현대적 감성을 추구합니다.`,
          messages: [{ role: "user", content: `세계관:\n${worldview}\n\n곡 제목: ${songTitle}\n\n뮤직비디오 콘셉트를 설계하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.concept = text;
        send({ step: 1, status: "done", title: "뮤비 콘셉트 설계", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "뮤비 콘셉트 설계", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 1, status: "retry", title: "뮤비 콘셉트 설계", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 2: Runway 프롬프트 5클립 (Sonnet) ──
    send({ step: 2, status: "running", title: "Runway 프롬프트 생성", detail: "영문 프롬프트 5클립 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: `당신은 온서사 오리지널팀의 AI 영상 프로듀서입니다.
뮤비 콘셉트를 바탕으로 Runway Gen-4용 영상 클립 프롬프트 5개를 영문으로 생성하세요.

각 클립:
- [CLIP 1] ~ [CLIP 5] 형식
- 4~5초 분량 묘사
- 카메라 무빙 지시 (pan, zoom, dolly, static 등)
- 조명/색감 지시
- 시퀀스가 하나의 스토리로 이어지도록

한국적 미장센 + 현대적 감성.
순수한 영문 프롬프트만 출력. 한국어 설명 없이.`,
          messages: [{ role: "user", content: `세계관:\n${worldview}\n\n곡 제목: ${songTitle}\n\n뮤비 콘셉트:\n${results.concept}\n\nRunway 클립 프롬프트 5개를 작성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.runwayPrompts = text;
        send({ step: 2, status: "done", title: "Runway 프롬프트 생성", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 2, status: "error", title: "Runway 프롬프트 생성", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 2, status: "retry", title: "Runway 프롬프트 생성", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 3: 편집 가이드 (Haiku) ──
    send({ step: 3, status: "running", title: "편집 가이드", detail: "전환 효과, 타이밍 편집 가이드 작성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: `당신은 온서사 오리지널팀의 영상 편집 감독입니다.
뮤비 클립 프롬프트를 바탕으로 편집 가이드를 작성하세요.

포함 항목:
1. 클립 간 전환 효과 (디졸브, 컷, 와이프 등)
2. 각 클립 타이밍 (곡의 어느 부분에 배치할지)
3. 속도 조절 (슬로모션, 타임랩스 구간)
4. 색보정 방향 (LUT 스타일)
5. 자막/타이틀 배치 타이밍
6. ffmpeg 또는 DaVinci Resolve 기준 편집 순서

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `곡 제목: ${songTitle}\n\n뮤비 콘셉트:\n${results.concept}\n\nRunway 클립:\n${results.runwayPrompts}\n\n편집 가이드를 작성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.editGuide = text;
        send({ step: 3, status: "done", title: "편집 가이드", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: "편집 가이드", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 3, status: "retry", title: "편집 가이드", detail: `재시도 ${attempt}/3...` });
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
        system: `당신은 온서사 CDO입니다. 뮤직비디오 파이프라인 실행 결과를 간결하게 보고받고 요약하세요.
형식: 실행 결과 요약 → 성공/실패 항목 → 다음 액션 제안`,
        messages: [{ role: "user", content: `파이프라인 결과:\n- 곡 제목: ${songTitle}\n- 뮤비 콘셉트: ${results.concept ? "완료" : "실패"}\n- Runway 프롬프트: ${results.runwayPrompts ? "완료" : "실패"}\n- 편집 가이드: ${results.editGuide ? "완료" : "실패"}` }],
      });

      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 4, status: "done", title: "CDO 결과 보고", result: report });
    } catch {
      send({ step: 4, status: "done", title: "CDO 결과 보고", result: `뮤직비디오 파이프라인 완료 (${songTitle}). 결과를 확인하세요.` });
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
