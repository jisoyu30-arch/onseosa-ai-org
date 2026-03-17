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
  const { spec, existingCode, priority } = await request.json();
  const featureSpec = spec;

  if (!featureSpec) {
    return Response.json({ error: "기능 명세서를 입력해주세요" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const { stream, send, close } = createSSE();

  (async () => {
    const results: Record<string, string> = {};

    // ── Step 1: Claude → Component Structure Design ──
    send({ step: 1, status: "running", title: "컴포넌트 구조 설계", detail: "Claude API로 기능 명세 분석 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: `당신은 온서사 플랫폼팀의 시니어 풀스택 개발자입니다.
스택: Next.js 14 (App Router) + Supabase + Tailwind CSS
기능 명세를 받으면 다음을 설계하세요:

1. 페이지 구조 (라우트 목록)
2. 컴포넌트 트리 (파일명 + props)
3. Supabase 테이블 스키마 (SQL)
4. API 라우트 목록
5. 상태 관리 전략

형식: 마크다운, 코드 블록 포함`,
          messages: [{ role: "user", content: `기능 명세:\n${featureSpec}\n\n${existingCode ? `기존 코드/참고자료:\n${existingCode.slice(0, 3000)}` : ""}\n\n우선순위: ${priority || "medium"}\n\nNext.js + Supabase 스택으로 컴포넌트 구조를 설계하세요.` }],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.architecture = text;
        send({ step: 1, status: "done", title: "컴포넌트 구조 설계", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 1, status: "error", title: "컴포넌트 구조 설계", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
          close();
          return;
        }
        send({ step: 1, status: "retry", title: "컴포넌트 구조 설계", detail: `재시도 ${attempt}/3...` });
        await sleep(2000);
      }
    }

    // ── Step 2: Claude → Code Generation ──
    send({ step: 2, status: "running", title: "코드 자동 생성", detail: "Claude Code로 Next.js + Supabase 코드 생성 중..." });

    // Generate multiple files in sequence
    const fileTypes = [
      { name: "Supabase 스키마 + 설정", prompt: "Supabase 테이블 스키마 SQL과 supabase client 설정 파일을 작성하세요." },
      { name: "메인 페이지 + 레이아웃", prompt: "app/layout.tsx, app/page.tsx, 글로벌 CSS를 작성하세요. Tailwind 사용." },
      { name: "핵심 컴포넌트", prompt: "가장 중요한 핵심 컴포넌트 3~5개의 전체 코드를 작성하세요." },
      { name: "API 라우트", prompt: "필요한 API 라우트(CRUD)의 전체 코드를 작성하세요. Supabase 연동." },
      { name: "유틸 + 타입 정의", prompt: "TypeScript 타입 정의와 유틸리티 함수를 작성하세요." },
    ];

    const generatedFiles: { name: string; code: string }[] = [];

    for (let i = 0; i < fileTypes.length; i++) {
      const ft = fileTypes[i];
      send({ step: 2, status: "running", title: "코드 자동 생성", detail: `${ft.name} 생성 중... (${i + 1}/${fileTypes.length})` });

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            system: `당신은 온서사 플랫폼팀의 풀스택 개발자입니다.
스택: Next.js 14 App Router + Supabase + Tailwind CSS
이전에 설계한 아키텍처를 기반으로 실제 코드를 작성하세요.
모든 코드는 TypeScript로 작성.
파일 경로를 명시하고 전체 코드를 작성하세요.
형식:
--- 파일: src/파일경로.tsx ---
\`\`\`tsx
코드
\`\`\``,
            messages: [
              { role: "user", content: `기능 명세:\n${featureSpec}\n\n아키텍처:\n${results.architecture}\n\n${ft.prompt}` },
            ],
          });

          const text = res.content[0].type === "text" ? res.content[0].text : "";
          generatedFiles.push({ name: ft.name, code: text });
          break;
        } catch (e) {
          if (attempt === 3) {
            generatedFiles.push({ name: ft.name, code: `// 생성 실패: ${e instanceof Error ? e.message : "unknown"}` });
          } else {
            await sleep(2000);
          }
        }
      }
    }

    results.generatedCode = generatedFiles.map((f) => `=== ${f.name} ===\n${f.code}`).join("\n\n");
    send({ step: 2, status: "done", title: "코드 자동 생성", result: `${generatedFiles.length}개 파일 그룹 생성 완료`, files: generatedFiles.map(f => f.name) });

    // ── Step 3: Claude → Test Cases ──
    send({ step: 3, status: "running", title: "테스트 케이스 작성", detail: "자동 테스트 코드 생성 중..." });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: `당신은 온서사 플랫폼팀의 QA 테스터입니다.
생성된 코드를 기반으로 테스트 케이스를 작성하세요.
도구: Jest + React Testing Library
형식:
1. 단위 테스트 (컴포넌트별)
2. API 라우트 테스트
3. E2E 시나리오 (사용자 플로우)

각 테스트의 전체 코드를 작성하세요.`,
          messages: [
            { role: "user", content: `기능 명세:\n${featureSpec}\n\n아키텍처:\n${results.architecture}\n\n생성된 코드 요약:\n${generatedFiles.map(f => f.name).join(", ")}\n\n테스트 케이스를 작성하세요.` },
          ],
        });

        const text = res.content[0].type === "text" ? res.content[0].text : "";
        results.testCases = text;
        send({ step: 3, status: "done", title: "테스트 케이스 작성", result: text });
        break;
      } catch (e) {
        if (attempt === 3) {
          send({ step: 3, status: "error", title: "테스트 케이스 작성", error: `실패: ${e instanceof Error ? e.message : "unknown"}` });
        } else {
          send({ step: 3, status: "retry", title: "테스트 케이스 작성", detail: `재시도 ${attempt}/3...` });
          await sleep(2000);
        }
      }
    }

    // ── Step 4: Server Preview Info ──
    send({ step: 4, status: "running", title: "로컬 서버 실행 안내", detail: "실행 명령어 생성 중..." });

    const setupScript = `# 1. 프로젝트 생성
npx create-next-app@latest exercise-app --typescript --tailwind --app --src-dir

# 2. Supabase 설치
cd exercise-app
npm install @supabase/supabase-js @supabase/ssr

# 3. 환경변수 설정 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 4. 위에서 생성된 코드를 각 파일 경로에 배치

# 5. 개발 서버 실행
npm run dev`;

    results.setupScript = setupScript;
    send({ step: 4, status: "done", title: "로컬 서버 실행 안내", result: setupScript });

    // ── Step 5: CDO Report ──
    send({ step: 5, status: "running", title: "CDO 결과 보고", detail: "파이프라인 결과 취합 중..." });

    try {
      const reportRes = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `당신은 온서사 CDO입니다. 운동앱 자동 개발 파이프라인 결과를 간결하게 요약하세요.
형식: 실행 결과 요약 → 생성된 파일 목록 → 다음 단계 제안`,
        messages: [{ role: "user", content: `파이프라인 결과:\n- 아키텍처 설계 완료\n- 생성 파일: ${generatedFiles.map(f => f.name).join(", ")}\n- 테스트 케이스 작성 완료\n- 기능 명세: ${featureSpec.slice(0, 200)}` }],
      });

      const report = reportRes.content[0].type === "text" ? reportRes.content[0].text : "";
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: report });
    } catch {
      send({ step: 5, status: "done", title: "CDO 결과 보고", result: "파이프라인 완료. 생성된 코드를 확인하세요." });
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
