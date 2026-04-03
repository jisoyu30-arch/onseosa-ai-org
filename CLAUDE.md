# 온서사 (onseosa)

AI 엔진 오케스트레이션 플랫폼. 여러 AI 모델을 엔진(페르소나)으로 감싸서 프로젝트 단위 작업을 자동화한다.

## 모노레포 구조

```
apps/
  claude-worker/     # Express 백엔드 (포트 3001). 엔진 실행, 파이프라인, 음원 분석
  control-room/      # React + Vite 프론트엔드. 대시보드 UI
packages/
  engine-contracts/  # EngineInput, EngineOutput, WorkerPayload, WorkerResult 타입
  shared-types/      # TaskStatus, EngineName, Project, Task 등 공용 타입
automations/
  prompts/           # 엔진별 시스템 프롬프트 (.md 파일)
```

패키지 매니저: **pnpm** (workspace). Node >= 20.

## 개발 명령어

```bash
pnpm dev:worker      # claude-worker 개발 서버 (tsx watch)
pnpm dev:ui          # control-room 개발 서버 (vite)
pnpm build           # 전체 빌드
pnpm clean           # dist 삭제
```

## 엔진 시스템

### 2세대 핵심 엔진 (5개)

| 엔진 | 역할 | taskType | 모델 |
|------|------|----------|------|
| **arko** | 총괄/리뷰 | `orchestrate`, `review` | GPT-4o |
| **noah** | 분석 | `analyze` | Gemini 2.5 Flash |
| **eden** | 기획 | `plan` | Claude |
| **ria** | 집필 | `write` | Claude |
| **luka** | 기록 | `record` | Claude |

### 보조 엔진 (7개)
ahn, baek, han, hong, kal, seo — 1세대 또는 보조 역할.

### noah-audio (특수)
WAV 음원 파일을 Gemini에 보내서 악기/장르/BPM/무드를 분석하는 별도 모듈.
`/analyze-album` 라우트로 접근.

## 엔진 패턴

모든 엔진은 동일한 시그니처를 따른다:

```ts
async function runEngine(payload: WorkerPayload): Promise<EngineOutput>
```

- 시스템 프롬프트는 `automations/prompts/{engineName}.md`에서 로드 (`loadPrompt`)
- JSON 응답을 파싱하여 `EngineOutput` 형태로 반환
- `EngineOutput.status`는 `'pass' | 'revise' | 'fail' | 'done'`

## API 라우트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/execute` | 단일 엔진 실행 (x-secret 인증) |
| POST | `/pipeline` | 파이프라인 순차 실행 (noah → eden → ria → arko-review → luka) |
| GET | `/events` | 파이프라인 SSE 스트림 |
| POST | `/analyze-album` | 앨범 음원 분석 |
| GET | `/analyze-album/events` | 음원 분석 SSE 스트림 |
| GET | `/analyze-album/preview` | WAV 파일 목록 미리보기 |
| GET | `/health` | 헬스 체크 |

## 유틸리티

- `prompt-loader.ts` — `automations/prompts/`에서 .md 프롬프트 로드
- `supabase.ts` — Supabase 클라이언트
- `notion.ts` — Notion API 연동
- `google-drive.ts` — Google Drive 파일 관리
- `memory.ts` — 프로젝트/엔진 메모리 관리

## 환경 변수

`.env.example` 참고. 주요 키:
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` — AI API
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` — DB
- `NOTION_API_KEY` — Notion 연동
- `CLAUDE_WORKER_SECRET` — `/execute` 인증
- `VITE_API_BASE_URL` — 프론트엔드에서 백엔드 접근

## 컨벤션

- 엔진 프롬프트 수정은 `automations/prompts/` 안의 .md 파일에서만
- 엔진 함수명: `run{EngineName}` (예: `runArko`, `runNoah`)
- JSON 파싱: Gemini는 `responseMimeType: 'application/json'` + `systemInstruction` 사용
- 실패해도 빈 결과를 넣어서 파이프라인이 중단되지 않게 한다
- 한국어 코멘트/로그, 영문 코드

## 배포

Docker Compose로 worker + control-room + Supabase 배포.
- `Dockerfile.worker`, `Dockerfile.control-room`
- `docker-compose.yml`
