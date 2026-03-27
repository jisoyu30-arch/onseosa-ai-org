# 노트북 세팅 가이드

## 1. 필수 설치

```bash
# Node.js 20+ (winget 또는 nvm)
winget install OpenJS.NodeJS.LTS

# pnpm
npm install -g pnpm

# Claude Code
npm install -g @anthropic-ai/claude-code
```

## 2. 프로젝트 클론

```bash
cd C:\dev
git clone <repo-url> onseosa-agent
cd onseosa-agent
pnpm install
```

## 3. 환경 변수

`.env` 파일을 프로젝트 루트에 복사 (데스크탑에서 가져오기).

필요한 키:
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`
- `SUPABASE_URL` / `SUPABASE_ANON_KEY`
- `NOTION_API_KEY`
- `CLAUDE_WORKER_SECRET`

## 4. Claude Code 메모리 동기화

```bash
# Git에서 가져온 메모리를 로컬 Claude Code에 적용
bash scripts/claude-sync.sh import
```

이후 `claude` 실행하면 이전 대화 맥락(별명, 프로젝트 결정사항 등)이 유지됨.

## 5. MCP 서버 연결 (선택)

Claude Code 안에서 필요한 MCP 서버들을 연결:
- **Notion** — Notion 페이지/DB 관리
- **Google Calendar** — 일정 관리
- **Canva** — 디자인 생성
- **Figma** — 디자인 조회

각 MCP는 Claude Code 내에서 `/connect` 또는 설정에서 추가.

## 6. 실행

```bash
pnpm dev:worker    # 백엔드
pnpm dev:ui        # 프론트엔드
claude             # Claude Code
```

## 메모리 동기화 루틴

작업 끝날 때마다:
```bash
# 이 PC에서 메모리 내보내기
bash scripts/claude-sync.sh export
git add .claude/portable-memory/
git commit -m "sync: claude memory"
git push

# 다른 PC에서 메모리 가져오기
git pull
bash scripts/claude-sync.sh import
```
