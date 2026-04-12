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
  const { worldview, trackList } = await request.json();

  if (!worldview) {
    return Response.json({ error: "worldview required" }, { status: 400 });
  }
  if (!trackList) {
    return Response.json({ error: "trackList required" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const { stream, send, close } = createSSE();

  (async () => {
    const results: Record<string, string> = {};

    // ── Step 1: 플레이리스트 콘셉트 (Haiku) ──
    send({ step: 1, status: "running", title: "플레이리스트 콘셉트", detail: "테마와 분위기 설계 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: `당신은 온서사 레코즈팀의 플레이리스트 큐레이터입니다.
세계관과 트랙리스트를 바탕으로 플레이리스트 콘셉트를 설계하세요.

포함 항목:
1. 플레이리스트 테마 — 한 문장 콘셉트
2. 분위기 키워드 — 5~7개
3. 청취 시나리오 — 어떤 상황에서 들을 플레이리스트인지
4. 트랙 순서 의도 — 감정 흐름 설계
5. 타겟 리스너 — 페르소나

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `세계관:\n${worldview}\n\n트랙리스트:\n${trackList}\n\n플레이리스트 콘셉트를 설계하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.concept = text;
        send({ step: 1, status: "done", title: "플레이리스트 콘셉트", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "플레이리스트 콘셉트", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 1, status: "retry", title: "플레이리스트 콘셉트", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 2: 배경 이미지 프롬프트 (Haiku) ──
    send({ step: 2, status: "running", title: "배경 이미지 프롬프트", detail: "Midjourney용 배경 이미지 프롬프트 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: `당신은 온서사 레코즈팀의 비주얼 디자이너입니다.
플레이리스트 영상의 배경 이미지를 위한 Midjourney 프롬프트를 생성하세요.

요구사항:
- 영문 프롬프트 2개 버전
- YouTube 영상 비율 (--ar 16:9)
- 정적 배경으로 적합한 이미지 (텍스트 오버레이 공간 확보)
- 음악 감상에 집중할 수 있는 차분한 비주얼
- 한국적 감성 + 현대적 미니멀
- Midjourney v6 파라미터 포함

온서사 브랜드: 따뜻한 한국적 감성, 시적이되 흐리지 않은 비주얼.`,
          messages: [{ role: "user", content: `세계관:\n${worldview}\n\n플레이리스트 콘셉트:\n${results.concept}\n\n배경 이미지 프롬프트를 생성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.bgPrompt = text;
        send({ step: 2, status: "done", title: "배경 이미지 프롬프트", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 2, status: "error", title: "배경 이미지 프롬프트", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 2, status: "retry", title: "배경 이미지 프롬프트", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 3: YouTube 메타데이터 (Haiku) ──
    send({ step: 3, status: "running", title: "YouTube 메타데이터", detail: "제목, 설명, 태그 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: `당신은 온서사 레코즈팀의 YouTube 채널 매니저입니다.
플레이리스트 영상 업로드를 위한 메타데이터를 생성하세요.

형식:
[제목] YouTube 검색 최적화 제목 (2~3개 버전)
[설명] 영상 설명문 (트랙리스트 + 타임스탬프 포함)
[태그] 검색 태그 20~30개
[카테고리] YouTube 카테고리
[썸네일 텍스트] 썸네일에 들어갈 텍스트 제안

SEO를 고려하여 한국어/영어 키워드를 혼합하세요.`,
          messages: [{ role: "user", content: `세계관:\n${worldview}\n\n트랙리스트:\n${trackList}\n\n콘셉트:\n${results.concept}\n\nYouTube 메타데이터를 생성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.ytMetadata = text;
        send({ step: 3, status: "done", title: "YouTube 메타데이터", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: "YouTube 메타데이터", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 3, status: "retry", title: "YouTube 메타데이터", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 4: ffmpeg 명령어 생성 (Haiku) ──
    send({ step: 4, status: "running", title: "ffmpeg 명령어 생성", detail: "정적 이미지 + 오디오 합성 명령어 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: `당신은 온서사 레코즈팀의 영상 엔지니어입니다.
플레이리스트 영상 제작을 위한 ffmpeg 명령어를 생성하세요.

시나리오:
- 배경 이미지(PNG/JPG) + 오디오 파일(MP3/WAV) → MP4 영상
- 정적 이미지가 오디오 길이만큼 반복
- YouTube 업로드 최적 설정

생성할 명령어:
1. 단일 트랙 영상 합성
2. 여러 트랙 연결 (concat)
3. 페이드인/아웃 효과 추가 버전
4. 자막(트랙 정보) 오버레이 버전

각 명령어에 주석으로 설명을 추가하세요.`,
          messages: [{ role: "user", content: `트랙리스트:\n${trackList}\n\nffmpeg 명령어를 생성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.ffmpegCmds = text;
        send({ step: 4, status: "done", title: "ffmpeg 명령어 생성", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 4, status: "error", title: "ffmpeg 명령어 생성", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 4, status: "retry", title: "ffmpeg 명령어 생성", detail: `재시도 ${attempt}/3...` });
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
        system: `당신은 온서사 CDO입니다. 플레이리스트 영상 파이프라인 실행 결과를 간결하게 보고받고 요약하세요.
형식: 실행 결과 요약 → 성공/실패 항목 → 다음 액션 제안`,
        messages: [{ role: "user", content: `파이프라인 결과:\n- 플레이리스트 콘셉트: ${results.concept ? "완료" : "실패"}\n- 배경 이미지 프롬프트: ${results.bgPrompt ? "완료" : "실패"}\n- YouTube 메타데이터: ${results.ytMetadata ? "완료" : "실패"}\n- ffmpeg 명령어: ${results.ffmpegCmds ? "완료" : "실패"}` }],
      });

      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: report });
    } catch {
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: "플레이리스트 영상 파이프라인 완료. 결과를 확인하세요." });
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
