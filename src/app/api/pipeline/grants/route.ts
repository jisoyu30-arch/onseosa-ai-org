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
  const { category, description } = await request.json();
  const { stream, send, close } = createSSE();

  const anthropic = new Anthropic();

  const categoryLabels: Record<string, string> = {
    content: "콘텐츠 창작 지원",
    tech: "기술/AI 개발 지원",
    startup: "창업/엑셀러레이팅",
    culture: "문화예술 지원",
    export: "해외 진출 지원",
  };

  (async () => {
    try {
      // Step 1: 기회 발굴 및 적격성 심사 (지원사업매니저)
      send({ step: 1, title: "기회 발굴 및 적격성 심사", status: "running", agent: "지원사업매니저" });
      let step1 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 2000,
            messages: [{ role: "user", content: `당신은 온서사의 지원사업매니저입니다.
분야: ${categoryLabels[category] || category}
사업 개요: ${description}

다음을 작성하세요:
1. 이 분야에서 온서사가 지원 가능한 사업/공모전 5개 이상 제안
2. 각 기회의 적격성 평가 (적합/부적합/확인필요)
3. 적합도 점수 (1-10)
4. 추천 우선순위 TOP 3` }],
          });
          step1 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 1, title: "기회 발굴 및 적격성 심사", status: "done", content: step1 });

      // Step 2: 필요 서류 체크리스트 (지원사업매니저)
      send({ step: 2, title: "필요 서류 체크리스트", status: "running", agent: "지원사업매니저" });
      let step2 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 2000,
            messages: [{ role: "user", content: `당신은 온서사의 지원사업매니저입니다.
지원사업 분석 결과:
${step1}

사업 개요: ${description}

TOP 3 추천 기회에 대해 각각:
1. 필요 서류 체크리스트 (사업계획서, 재무제표, 포트폴리오 등)
2. 마일스톤 일정 (준비 → 작성 → 검토 → 제출)
3. 온서사 내부 준비 사항
4. 주의사항` }],
          });
          step2 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 2, title: "필요 서류 체크리스트", status: "done", content: step2 });

      // Step 3: 사업계획서 초안 (전략성장실장)
      send({ step: 3, title: "사업계획서 초안", status: "running", agent: "전략성장실장" });
      let step3 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 3000,
            messages: [{ role: "user", content: `당신은 온서사의 전략성장실장입니다.
사업 개요: ${description}
분야: ${categoryLabels[category] || category}

기회 분석: ${step1}
서류 체크리스트: ${step2}

TOP 1 추천 기회에 대한 사업계획서 초안을 작성하세요:
1. 사업 개요 및 목적
2. 온서사 소개 및 역량
3. 사업 수행 계획 (단계별)
4. 기대 효과 및 성과 지표
5. 예산 계획 (개략)
6. 차별화 포인트

온서사 브랜드: "꺼지지 않는 온기의 서사" / "문장에서 세계관까지"` }],
          });
          step3 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 3, title: "사업계획서 초안", status: "done", content: step3 });

      // Step 4: 법무리스크 검토 (법무리스크매니저)
      send({ step: 4, title: "법무/리스크 검토", status: "running", agent: "법무리스크매니저" });
      let step4 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            messages: [{ role: "user", content: `당신은 온서사의 법무리스크매니저입니다. (참고: 법률 전문가가 아닌 내부 리스크 사전 검토 역할)

사업계획서 초안: ${step3}

다음 관점에서 리스크를 검토하세요:
1. 저작권 이슈 (AI 생성물 관련)
2. 개인정보 이슈
3. 계약/협력 리스크
4. 허위/과장 표현 여부
5. 외부 법률 자문 필요 사항

각 항목에 대해: ✅ 승인 | ⚠️ 조건부 승인 | 🔧 수정 필요 | 🚨 외부 자문 필요` }],
          });
          step4 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 4, title: "법무/리스크 검토", status: "done", content: step4 });

      // Step 5: 품질 검토 및 최종 제출 준비 (품질관리매니저)
      send({ step: 5, title: "품질 검토 및 최종 준비", status: "running", agent: "품질관리매니저" });
      let step5 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            messages: [{ role: "user", content: `당신은 온서사의 품질관리매니저입니다.

사업계획서 초안: ${step3}
법무리스크 검토: ${step4}

최종 품질 검토를 수행하세요:
1. 브랜드 일관성 (온서사 톤 준수 여부)
2. 내용 완성도 (논리적 구조, 구체성)
3. 법무 리뷰 반영 여부
4. 제출 요건 충족도
5. 최종 판정: ✅ 승인 | ⚠️ 조건부 승인 | 🔧 수정 필요 | ⏸️ 보류

마지막으로 '대표 확인 필요 사항' 목록을 작성하세요.` }],
          });
          step5 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 5, title: "품질 검토 및 최종 준비", status: "done", content: step5 });

      // Step 6: 총괄 보고 (총괄운영실장)
      send({ step: 6, title: "총괄 보고", status: "running", agent: "총괄운영실장" });
      let step6 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: `당신은 온서사의 총괄운영실장입니다.
지원사업 파이프라인이 완료되었습니다.

[기회 발굴] ${step1.slice(0, 300)}...
[서류 준비] ${step2.slice(0, 300)}...
[사업계획서] ${step3.slice(0, 300)}...
[법무 검토] ${step4.slice(0, 300)}...
[품질 검토] ${step5.slice(0, 300)}...

대표에게 보고할 요약을 작성하세요:
1. 핵심 요약 (3줄)
2. 추천 지원 기회
3. 다음 단계
4. 대표가 결정할 사항` }],
          });
          step6 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 6, title: "총괄 보고", status: "done", content: step6 });

    } catch (err) {
      send({ step: 0, title: "오류", status: "error", content: String(err) });
    } finally {
      close();
    }
  })();

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
