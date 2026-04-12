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
  const { albumTitle, worldview, trackSummary, trackCount } = await request.json();
  const { stream, send, close } = createSSE();

  const anthropic = new Anthropic();

  (async () => {
    try {
      // Step 1: 트랙 분석 & 앨범 컨셉 설계 (작곡프로듀서 + IP콘텐츠전략실장)
      send({ step: 1, title: "트랙 분석 & 앨범 컨셉 설계", status: "running", agent: "작곡프로듀서" });
      let step1 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 3500,
            messages: [{ role: "user", content: `당신은 온서사의 작곡프로듀서이자 Suno AI 전문 프롬프트 엔지니어입니다.

앨범 제목: ${albumTitle}
세계관/배경: ${worldview || "미지정"}
등록된 트랙 (${trackCount}곡):
${trackSummary}

다음을 작성하세요:

## 1. 앨범 컨셉
1. 앨범 전체 콘셉트 (3-4문장)
2. 앨범이 전달하는 핵심 감정/메시지
3. 타깃 리스너 (어떤 상황에서 듣는 음악인지)
4. 앨범 키워드 5개

## 2. 트랙 순서 & 역할
- 앨범 전체 흐름을 고려한 최적 트랙 순서
- 각 트랙이 앨범 안에서 맡는 역할 (인트로, 타이틀곡, 전환곡, 아웃트로 등)
- 트랙 간 감정 흐름도 (기승전결)

## 3. 트랙별 Suno AI 프로덕션 노트
각 트랙에 대해 다음을 작성:
- **Suno Style of Music 프롬프트** (바로 복사해서 Suno에 붙여넣을 수 있는 태그 조합)
  예: "Korean Ballad, emotional, piano, strings, female vocals, heartfelt, slow tempo"
- **추천 곡 구조** (가사에 넣을 섹션 태그)
  예: [Intro] → [Verse 1] → [Pre-Chorus] → [Chorus] → [Verse 2] → [Bridge] → [Chorus] → [Outro]
- **Instrumental 여부**: 보컬 트랙 / 인스트루멘탈
- **보컬 스타일**: male/female, 창법 (breathy, belting, falsetto 등)
- **핵심 악기**: 메인 악기 2-3개
- **분위기 키워드**: mood 태그 3-4개
- **BPM 느낌**: slow/mid/uptempo/fast
- **참고 레퍼런스**: 비슷한 느낌의 실제 곡 1-2개 (있다면)
- **Suno 생성 팁**: 이 곡을 Suno에서 잘 뽑기 위한 구체적 조언

## 4. 리마스터/확장 전략
- Extend 기능 활용 제안 (4분 이상 곡이 필요한 트랙)
- Remaster 필요 여부 판단
- 같은 곡 다중 시드 생성 추천 트랙

## 5. 브랜드 연결
- 온서사 브랜드("꺼지지 않는 온기의 서사")와의 연결점

중요: Style of Music 프롬프트는 영어 태그 쉼표 구분으로 작성하되, 한국적 요소(gugak, gayageum 등)는 적극 활용할 것.
온서사 톤: 따뜻하되 구조적, 감성적이되 구체적.` }],
          });
          step1 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 1, title: "트랙 분석 & 앨범 컨셉 설계", status: "done", result: step1 });

      // Step 2: 곡별 설명 & 스토리 (작사가)
      send({ step: 2, title: "곡별 설명 & 스토리 작성", status: "running", agent: "작사가" });
      let step2 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 3000,
            messages: [{ role: "user", content: `당신은 온서사의 작사가입니다.

앨범 컨셉:
${step1}

트랙 정보:
${trackSummary}

각 곡에 대해 다음을 작성하세요:

### [곡 제목]
1. **한 줄 소개** (유튜브/스트리밍 설명용, 30자 이내)
2. **곡 설명** (3-4문장, 이 곡이 어떤 이야기를 담고 있는지)
3. **감상 포인트** (리스너가 주목할 부분)
4. **연결 이야기** (세계관/앨범 컨셉과의 연결)
5. **태그라인** (SNS 공유용 한 문장)

온서사 문체: 따뜻하되 약하지 않다 / 시적이되 흐리지 않다` }],
          });
          step2 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 2, title: "곡별 설명 & 스토리 작성", status: "done", result: step2 });

      // Step 3: 앨범 커버 이미지 프롬프트 (음원앨범담당)
      send({ step: 3, title: "앨범 커버 이미지 프롬프트", status: "running", agent: "음원앨범담당" });
      let step3 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 2000,
            messages: [{ role: "user", content: `당신은 온서사의 음원앨범담당입니다.

앨범 제목: ${albumTitle}
앨범 컨셉: ${step1.slice(0, 800)}
트랙 정보: ${trackSummary}

다음 이미지 생성 프롬프트를 작성하세요:

## 1. 앨범 커버 (정사각형 1:1)
- Midjourney 프롬프트 (영문)
- GPT Image 프롬프트 (영문)
- 색감/분위기 키워드
- 피해야 할 요소

## 2. 곡별 싱글 커버 (각 곡에 대해)
- 각 곡의 분위기에 맞는 Midjourney 프롬프트 (영문)

## 3. 유튜브 썸네일 (16:9)
- 메인 썸네일 프롬프트
- 텍스트 오버레이 문구 제안

온서사 비주얼 톤: 한국 전통미 + 현대적 감성, 따뜻한 톤, 과하지 않은 우아함` }],
          });
          step3 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 3, title: "앨범 커버 이미지 프롬프트", status: "done", result: step3 });

      // Step 4: 유튜브 메타데이터 패키지 (배포운영담당)
      send({ step: 4, title: "유튜브 메타데이터 패키지", status: "running", agent: "배포운영담당" });
      let step4 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 2500,
            messages: [{ role: "user", content: `당신은 온서사의 배포운영담당입니다.

앨범 제목: ${albumTitle}
앨범 컨셉: ${step1.slice(0, 500)}
곡 설명: ${step2.slice(0, 800)}

유튜브 업로드용 메타데이터 패키지를 작성하세요:

## 각 곡별:
1. **유튜브 제목** (클릭률 최적화, 50자 이내)
2. **영상 설명** (SEO 최적화, 가사 포함 자리, 링크 자리)
3. **태그** (15-20개)
4. **해시태그** (5-7개)
5. **카테고리** (Music / Entertainment)
6. **공개 시간 추천** (요일, 시간대)

## 앨범 전체:
1. **플레이리스트 이름** 제안 3개
2. **채널 설명 업데이트 문구**
3. **커뮤니티 탭 공지 초안**

온서사 유튜브 채널 톤에 맞게 작성하세요.` }],
          });
          step4 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 4, title: "유튜브 메타데이터 패키지", status: "done", result: step4 });

      // Step 5: 플레이리스트 구성 제안 (음원앨범담당)
      send({ step: 5, title: "플레이리스트 구성 제안", status: "running", agent: "음원앨범담당" });
      let step5 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1500,
            messages: [{ role: "user", content: `당신은 온서사의 음원앨범담당입니다.

앨범: ${albumTitle}
트랙 정보: ${trackSummary}
앨범 컨셉: ${step1.slice(0, 400)}

이 앨범의 곡들을 활용한 플레이리스트 구성을 제안하세요:

## 플레이리스트 3종 제안
각각:
1. 플레이리스트 제목
2. 컨셉 (어떤 상황에서 듣는 플레이리스트인지)
3. 포함 트랙 순서
4. 배경 이미지 컨셉
5. 총 재생시간 예상

## 크로스 프로모션
- 기존 온서사 콘텐츠와 연계 가능한 플레이리스트 아이디어` }],
          });
          step5 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 5, title: "플레이리스트 구성 제안", status: "done", result: step5 });

      // Step 6: 품질 검토 & 총괄 보고 (품질관리매니저 → 총괄운영실장)
      send({ step: 6, title: "품질 검토 & 총괄 보고", status: "running", agent: "품질관리매니저 → 총괄운영실장" });
      let step6 = "";
      for (let retry = 0; retry < 3; retry++) {
        try {
          const res = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            messages: [{ role: "user", content: `당신은 온서사의 품질관리매니저 겸 총괄운영실장입니다.

음원앨범 파이프라인이 완료되었습니다.
앨범: ${albumTitle} (${trackCount}곡)

[앨범 컨셉] ${step1.slice(0, 300)}
[곡 설명] ${step2.slice(0, 300)}
[커버 프롬프트] ${step3.slice(0, 200)}
[메타데이터] ${step4.slice(0, 200)}
[플레이리스트] ${step5.slice(0, 200)}

## 품질 검토
각 단계 산출물에 대해: ✅ 승인 | ⚠️ 조건부 승인 | 🔧 수정 필요 | ⏸️ 보류

## 총괄 보고
1. 핵심 요약 (3줄)
2. 릴리즈 준비도 (%)
3. 다음 단계 체크리스트
4. 대표 결정 필요 사항` }],
          });
          step6 = (res.content[0] as { text: string }).text;
          break;
        } catch { await sleep(2000); }
      }
      send({ step: 6, title: "품질 검토 & 총괄 보고", status: "done", result: step6 });

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
