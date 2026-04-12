import Anthropic from "@anthropic-ai/sdk";

import { NextRequest } from "next/server";

// SSE helper
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
  const { worldview, audioFileName } = await request.json();

  if (!worldview) {
    return Response.json({ error: "worldview text required" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const runwayKey = process.env.RUNWAY_API_KEY;

  if (!anthropicKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });

  const { stream, send, close } = createSSE();

  // Run pipeline asynchronously
  (async () => {
    const results: Record<string, string> = {};
    let hasError = false;

    // ── Step 1: Claude → Album Jacket Prompt ──
    send({ step: 1, status: "running", title: "앨범 자켓 프롬프트 생성", detail: "Claude API로 세계관 기반 이미지 프롬프트 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: `당신은 온서사 레코즈팀의 음악 프로듀서입니다.
세계관 설명을 받으면 앨범 자켓 이미지 프롬프트를 영문으로 생성하세요.
온서사 브랜드: 따뜻한 한국적 감성, 시적이되 흐리지 않은 비주얼.
형식: 순수한 영문 프롬프트만 출력. 설명 없이.`,
          messages: [{ role: "user", content: `세계관:\n${worldview}\n\n음원: ${audioFileName || "untitled"}\n\n위 세계관을 표현하는 앨범 자켓 이미지 프롬프트를 작성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.albumPrompt = text;
        send({ step: 1, status: "done", title: "앨범 자켓 프롬프트 생성", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "앨범 자켓 프롬프트 생성", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          hasError = true;
        } else {
          send({ step: 1, status: "retry", title: "앨범 자켓 프롬프트 생성", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    if (hasError) { close(); return; }

    // ── Step 2: Claude → Midjourney 앨범 자켓 프롬프트 생성 ──
    send({ step: 2, status: "running", title: "Midjourney 앨범 자켓 프롬프트 생성", detail: "Claude API로 Midjourney용 이미지 프롬프트 변환 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const mjRes = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: `당신은 Midjourney v6용 앨범 자켓 이미지 프롬프트를 작성하는 전문가입니다.
주어진 이미지 컨셉을 Midjourney v6에 바로 복붙할 수 있는 형태의 프롬프트로 변환하세요.
온서사 브랜드: 따뜻한 한국적 감성, 시적이되 흐리지 않은 비주얼.
형식: /imagine prompt: ... --ar 1:1 --v 6 --style raw
설명 없이 프롬프트만 출력하세요.`,
          messages: [{ role: "user", content: `다음 앨범 자켓 컨셉을 Midjourney v6 프롬프트로 변환하세요:\n\n${results.albumPrompt}` }],
        });

        const mjText = mjRes.content[0].type === "text" ? mjRes.content[0].text : "";
        results.midjourneyPrompt = mjText;
        send({ step: 2, status: "done", title: "Midjourney 앨범 자켓 프롬프트 생성", result: mjText, detail: "이 프롬프트를 Midjourney에 입력하세요." });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 2, status: "error", title: "Midjourney 앨범 자켓 프롬프트 생성", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          hasError = true;
        } else {
          send({ step: 2, status: "retry", title: "Midjourney 앨범 자켓 프롬프트 생성", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 3: Claude → MV Concept Prompt ──
    send({ step: 3, status: "running", title: "뮤비 컨셉 프롬프트 생성", detail: "Claude API로 Runway 뮤비 프롬프트 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: `당신은 온서사 오리지널팀의 뮤비 디렉터입니다.
세계관 설명을 받으면 Runway Gen-4용 뮤비 클립 프롬프트 5개를 영문으로 생성하세요.
각 클립은 4초 분량, 시퀀스가 이어지는 스토리.
한국적 미장센 + 현대적 감성.
형식:
[CLIP 1] 프롬프트
[CLIP 2] 프롬프트
...`,
          messages: [{ role: "user", content: `세계관:\n${worldview}\n\n앨범 자켓 비주얼:\n${results.albumPrompt || "(없음)"}\n\n위 세계관을 표현하는 뮤비 클립 프롬프트 5개를 작성하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.mvPrompts = text;
        send({ step: 3, status: "done", title: "뮤비 컨셉 프롬프트 생성", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: "뮤비 컨셉 프롬프트 생성", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          hasError = true;
        } else {
          send({ step: 3, status: "retry", title: "뮤비 컨셉 프롬프트 생성", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    if (hasError) { close(); return; }

    // ── Step 4: Runway → MV Clips ──
    send({ step: 4, status: "running", title: "뮤비 클립 생성", detail: "Runway API로 영상 클립 생성 중..." });

    if (runwayKey) {
      // Runway Gen-4 API integration
      // Note: Runway's API is in beta - using their REST endpoint
      const clipPrompts = (results.mvPrompts || "").split(/\[CLIP \d+\]/).filter(Boolean).map(s => s.trim());
      const clipUrls: string[] = [];

      for (let i = 0; i < Math.min(clipPrompts.length, 5); i++) {
        send({ step: 4, status: "running", title: "뮤비 클립 생성", detail: `클립 ${i + 1}/${clipPrompts.length} 생성 중...` });

        try {
          const runwayRes = await fetch("https://api.dev.runwayml.com/v1/image_to_video", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${runwayKey}`,
              "Content-Type": "application/json",
              "X-Runway-Version": "2024-11-06",
            },
            body: JSON.stringify({
              model: "gen4_turbo",
              promptText: clipPrompts[i],
              duration: 5,
              ratio: "16:9",
            }),
          });

          if (runwayRes.ok) {
            const data = await runwayRes.json();
            // Poll for completion
            const taskId = data.id;
            let videoUrl = "";

            for (let poll = 0; poll < 60; poll++) {
              await sleep(5000);
              const statusRes = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
                headers: { "Authorization": `Bearer ${runwayKey}`, "X-Runway-Version": "2024-11-06" },
              });
              const statusData = await statusRes.json();

              if (statusData.status === "SUCCEEDED") {
                videoUrl = statusData.output?.[0] || "";
                break;
              } else if (statusData.status === "FAILED") {
                throw new Error("Runway generation failed");
              }
              send({ step: 4, status: "running", title: "뮤비 클립 생성", detail: `클립 ${i + 1} 렌더링 중... (${poll * 5}초)` });
            }

            clipUrls.push(videoUrl);
          } else {
            const errText = await runwayRes.text();
            throw new Error(`Runway API ${runwayRes.status}: ${errText}`);
          }
        } catch (e) {
          send({ step: 4, status: "running", title: "뮤비 클립 생성", detail: `클립 ${i + 1} 오류: ${e instanceof Error ? e.message : "unknown"} — 계속 진행` });
        }
      }

      results.clipUrls = JSON.stringify(clipUrls);
      send({ step: 4, status: clipUrls.length > 0 ? "done" : "error", title: "뮤비 클립 생성", result: `${clipUrls.length}개 클립 생성 완료` });
    } else {
      send({ step: 4, status: "skipped", title: "뮤비 클립 생성", detail: "RUNWAY_API_KEY 미설정 — 건너뜀 (프롬프트만 생성됨)" });
    }

    // ── Step 5: ffmpeg → Audio + Clips → MV ──
    send({ step: 5, status: "running", title: "뮤비 합성 (ffmpeg)", detail: "음원 + 영상 클립 합성 중..." });

    if (runwayKey && results.clipUrls) {
      send({ step: 5, status: "skipped", title: "뮤비 합성 (ffmpeg)", detail: "서버 환경에서 ffmpeg 실행 — 로컬 실행 필요. ffmpeg 명령어 생성됨." });
    } else {
      const ffmpegCmd = `ffmpeg -i input_audio.mp3 -i clip1.mp4 -i clip2.mp4 -i clip3.mp4 -i clip4.mp4 -i clip5.mp4 -filter_complex "[1:v][2:v][3:v][4:v][5:v]concat=n=5:v=1:a=0[v]" -map "[v]" -map 0:a -c:v libx264 -c:a aac -shortest output_mv.mp4`;
      results.ffmpegMvCmd = ffmpegCmd;
      send({ step: 5, status: "done", title: "뮤비 합성 (ffmpeg)", result: ffmpegCmd, detail: "ffmpeg 명령어 생성 완료 (클립 생성 후 로컬 실행)" });
    }

    // ── Step 6: ffmpeg → Audio + Album Art → Playlist Video ──
    send({ step: 6, status: "running", title: "플레이리스트 영상 합성", detail: "음원 + 앨범자켓 → 정적 영상 생성 중..." });

    const ffmpegPlaylistCmd = `ffmpeg -loop 1 -i album_jacket.png -i input_audio.mp3 -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest playlist_video.mp4`;
    results.ffmpegPlaylistCmd = ffmpegPlaylistCmd;
    send({ step: 6, status: "done", title: "플레이리스트 영상 합성", result: ffmpegPlaylistCmd, detail: "ffmpeg 명령어 생성 완료" });

    // ── Step 7: YouTube Upload ──
    send({ step: 7, status: "running", title: "YouTube 업로드", detail: "YouTube Data API v3로 업로드 준비 중..." });

    // Generate YouTube metadata via Claude
    try {
      const ytRes = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `당신은 온서사 레코즈팀의 채널 매니저입니다.
유튜브 업로드용 메타데이터를 생성하세요.
형식:
[제목] ...
[설명] ...
[태그] 태그1, 태그2, ...
[플레이리스트] ...`,
        messages: [{ role: "user", content: `세계관: ${worldview}\n음원: ${audioFileName || "untitled"}\n\n유튜브 업로드용 메타데이터를 작성하세요. 뮤비와 플레이리스트 영상 각각.` }],
      });

      const ytText = ytRes.content[0].type === "text" ? ytRes.content[0].text : "";
      results.youtubeMetadata = ytText;
      send({ step: 7, status: "done", title: "YouTube 업로드", result: ytText, detail: "메타데이터 생성 완료 (OAuth 인증 후 업로드 가능)" });
    } catch (e) {
      send({ step: 7, status: "error", title: "YouTube 업로드", error: `메타데이터 생성 실패: ${e instanceof Error ? e.message : "unknown"}` });
    }

    // ── Final Report to CDO ──
    send({ step: 8, status: "running", title: "CDO 결과 보고", detail: "파이프라인 결과 취합 중..." });

    try {
      const reportRes = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `당신은 온서사 CDO입니다. 음악 콘텐츠 파이프라인 실행 결과를 간결하게 보고받고 요약하세요.
형식: 실행 결과 요약 → 성공/실패 항목 → 다음 액션 제안`,
        messages: [{ role: "user", content: `파이프라인 결과:\n${JSON.stringify(results, null, 2)}` }],
      });

      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 8, status: "done", title: "CDO 결과 보고", result: report });
    } catch {
      send({ step: 8, status: "done", title: "CDO 결과 보고", result: "파이프라인 완료. 결과를 확인하세요." });
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
