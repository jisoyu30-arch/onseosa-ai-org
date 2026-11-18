import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

function createSSE() {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController | null = null;
  const stream = new ReadableStream({ start(c) { controller = c; } });
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
  const { worldview, previousDraft, episode, direction } = await request.json();

  if (!worldview) {
    return Response.json({ error: "세계관/기획안을 입력해주세요" }, { status: 400 });
  }

  const anthropic = new Anthropic();
  const { stream, send, close } = createSSE();

  const hasPrevious = previousDraft && previousDraft.trim().length > 0;
  const hasDirection = direction && direction.trim().length > 0;

  (async () => {
    const results: Record<string, string> = {};

    // ── Step 1: 기존 원고 분석 (기획작가) ──
    send({ step: 1, status: "running", title: "세계관 & 기존 원고 분석", agent: "기획작가", detail: "캐릭터, 복선, 스토리 진행도 분석 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          system: `당신은 온서사 콘텐츠창작본부의 기획작가입니다.
세계관/기획안과 기존 원고를 분석하여 다음 회차를 쓰기 위한 컨텍스트를 정리하세요.

분석 항목:
1. 세계관 핵심 규칙 요약
2. ${hasPrevious ? "기존 원고까지의 스토리 진행 상황" : "첫 회차를 위한 세계관 기반 분석"}
3. 활성 복선 목록 (아직 회수되지 않은 것들)
4. 캐릭터별 현재 상태 (감정, 관계, 위치)
5. 다음 회차 핵심 플롯 포인트 제안
6. 문체 특징 분석 (기존 원고의 톤, 대화 비율, 문장 길이)

온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `[세계관/기획안]
${worldview}

${hasPrevious ? `[기존 원고 (이전 회차까지)]
${previousDraft}` : "[첫 회차 집필]"}

${hasDirection ? `[이번 회차 방향 메모]
${direction}` : ""}

${episode}화를 쓰기 위한 분석을 해주세요.` }],
        });
        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.analysis = text;
        send({ step: 1, status: "done", title: "세계관 & 기존 원고 분석", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "세계관 & 기존 원고 분석", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close(); return;
        }
        send({ step: 1, status: "retry", title: "세계관 & 기존 원고 분석", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 2: 회차 플롯 설계 (웹소설작가) ──
    send({ step: 2, status: "running", title: `${episode}화 플롯 설계`, agent: "웹소설작가", detail: "이전 흐름 이어가는 구성 설계 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          system: `당신은 온서사 콘텐츠창작본부의 웹소설작가입니다.
기획작가의 분석 결과를 바탕으로 ${episode}화 플롯을 설계하세요.

${hasPrevious ? "이전 원고의 마지막 장면에서 자연스럽게 이어지는 전개여야 합니다." : "첫 회차이므로 독자를 확실히 사로잡는 오프닝이 필요합니다."}

플롯 구조:
1. 기 — 도입부 (독자 몰입 후크${hasPrevious ? ", 이전 화 연결" : ""})
2. 승 — 전개 (갈등 심화, 복선 설치)
3. 전 — 클라이맥스 (반전 또는 결정적 장면)
4. 결 — 마무리 + 클리프행어 (다음 화 견인)

독자 이탈 방지 텐션 포인트를 최소 2개 명시하세요.
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.`,
          messages: [{ role: "user", content: `[분석 결과]
${results.analysis}

${hasDirection ? `[방향 메모]
${direction}` : ""}

${episode}화 플롯을 설계하세요.` }],
        });
        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.plot = text;
        send({ step: 2, status: "done", title: `${episode}화 플롯 설계`, result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 2, status: "error", title: `${episode}화 플롯 설계`, error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close(); return;
        }
        send({ step: 2, status: "retry", title: `${episode}화 플롯 설계`, detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 3: 초고 집필 (소설작가) ──
    send({ step: 3, status: "running", title: `${episode}화 초고 집필`, agent: "소설작가", detail: "문체 유지하며 본문 집필 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8192,
          system: `당신은 온서사 콘텐츠창작본부의 소설작가입니다.
플롯을 바탕으로 ${episode}화 본문을 집필하세요.

${hasPrevious ? `핵심 원칙:
- 기존 원고의 문체, 톤, 대화 스타일을 정확히 이어가세요
- 캐릭터 말투가 이전과 달라지면 안 됩니다
- 이전 회차 마지막 장면과 자연스럽게 연결되어야 합니다` : `핵심 원칙:
- 세계관의 분위기를 충실히 반영하세요
- 캐릭터 특성이 첫 회차에서 명확히 드러나야 합니다`}

- 분량: 3000~5000자
- 문체: 웹소설 특유의 빠른 호흡, 짧은 문장, 감정선 강조
- 대화 비중: 40~50%
- 장면 전환은 '***'로 구분
- 마지막은 반드시 클리프행어로 마무리

온서사 문체: 따뜻하되 약하지 않다 / 시적이되 흐리지 않다.`,
          messages: [{ role: "user", content: `[세계관]
${worldview.slice(0, 2000)}

${hasPrevious ? `[기존 원고 마지막 부분]
${previousDraft.slice(-3000)}` : ""}

[${episode}화 플롯]
${results.plot}

${episode}화 본문을 집필하세요.` }],
        });
        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.draft = text;
        send({ step: 3, status: "done", title: `${episode}화 초고 집필`, result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: `${episode}화 초고 집필`, error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close(); return;
        }
        send({ step: 3, status: "retry", title: `${episode}화 초고 집필`, detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 4: 편집 피드백 (IP콘텐츠전략실장) ──
    send({ step: 4, status: "running", title: "편집 피드백", agent: "IP콘텐츠전략실장", detail: "문체, 전개, 일관성 분석 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2000,
          system: `당신은 온서사 콘텐츠창작본부의 IP콘텐츠전략실장입니다.
웹소설 초고를 검토하세요.

검토 항목:
1. 문체 일관성 — ${hasPrevious ? "기존 원고와 톤/스타일이 일치하는가" : "세계관에 맞는 톤인가"}
2. 전개 — 플롯 이행 충실도, 페이싱
3. 캐릭터 — 말투, 성격 일관성
4. 독자 이탈 포인트 — 지루해질 수 있는 구간
5. 클리프행어 효과 — 다음 화 클릭 유도 강도
6. 구체적 수정 제안 — 어떤 문장/단락을 어떻게 고치면 좋을지`,
          messages: [{ role: "user", content: `[${episode}화 초고]
${results.draft}

편집 피드백을 주세요.` }],
        });
        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.feedback = text;
        send({ step: 4, status: "done", title: "편집 피드백", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 4, status: "error", title: "편집 피드백", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 4, status: "retry", title: "편집 피드백", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 5: 품질 검토 & 총괄 보고 ──
    send({ step: 5, status: "running", title: "품질 검토 & 총괄 보고", agent: "품질관리매니저 → 총괄운영실장" });

    try {
      const reportRes = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: `당신은 온서사의 품질관리매니저 겸 총괄운영실장입니다.

웹소설 파이프라인 결과를 검토하고 보고하세요.

## 품질 검토
각 단계: ✅ 승인 | ⚠️ 조건부 승인 | 🔧 수정 필요 | ⏸️ 보류

## 총괄 보고
1. 핵심 요약
2. 원고 완성도 평가
3. 수정 필요 사항
4. 다음 단계 (플랫폼 연재, 추가 교정 등)
5. 대표 확인 필요 사항`,
        messages: [{ role: "user", content: `[${episode}화 파이프라인 결과]
- 원고 분석: ${results.analysis ? "완료" : "실패"}
- 플롯 설계: ${results.plot ? "완료" : "실패"}
- 초고 집필: ${results.draft ? "완료" : "실패"}
- 편집 피드백: ${results.feedback ? "완료" : "실패"}

[피드백 요약]
${results.feedback?.slice(0, 500) || "없음"}

품질 검토와 총괄 보고를 작성하세요.` }],
      });
      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 5, status: "done", title: "품질 검토 & 총괄 보고", result: report });
    } catch {
      send({ step: 5, status: "done", title: "품질 검토 & 총괄 보고", result: `웹소설 ${episode}화 파이프라인 완료.` });
    }

    close();
  })();

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
