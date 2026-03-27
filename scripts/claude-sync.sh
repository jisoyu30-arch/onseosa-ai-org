#!/bin/bash
# claude-sync.sh — Claude Code 메모리 동기화 스크립트
# 사용법:
#   ./scripts/claude-sync.sh import   # Git에서 가져온 메모리를 로컬 Claude Code에 적용
#   ./scripts/claude-sync.sh export   # 로컬 Claude Code 메모리를 Git용 폴더로 내보내기

set -e

# 프로젝트 루트 찾기
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PORTABLE_DIR="$PROJECT_DIR/.claude/portable-memory"

# Claude Code 메모리 경로 계산 (경로의 / : \ 를 - 로 변환)
PROJECT_PATH="$(cd "$PROJECT_DIR" && pwd -W 2>/dev/null || pwd)"
ENCODED_PATH=$(echo "$PROJECT_PATH" | sed 's|[/:\\]|-|g' | sed 's|^-||')
CLAUDE_MEMORY_DIR="$HOME/.claude/projects/$ENCODED_PATH/memory"

case "${1:-}" in
  import)
    echo "=== 메모리 가져오기 (Git → Claude Code) ==="
    echo "소스: $PORTABLE_DIR"
    echo "대상: $CLAUDE_MEMORY_DIR"

    if [ ! -d "$PORTABLE_DIR" ]; then
      echo "오류: portable-memory 폴더가 없습니다. git pull 먼저 실행하세요."
      exit 1
    fi

    mkdir -p "$CLAUDE_MEMORY_DIR"
    cp -v "$PORTABLE_DIR"/*.md "$CLAUDE_MEMORY_DIR/"
    echo ""
    echo "완료! Claude Code를 실행하면 메모리가 적용됩니다."
    ;;

  export)
    echo "=== 메모리 내보내기 (Claude Code → Git) ==="
    echo "소스: $CLAUDE_MEMORY_DIR"
    echo "대상: $PORTABLE_DIR"

    if [ ! -d "$CLAUDE_MEMORY_DIR" ]; then
      echo "오류: Claude Code 메모리 폴더가 없습니다."
      echo "경로: $CLAUDE_MEMORY_DIR"
      exit 1
    fi

    mkdir -p "$PORTABLE_DIR"
    cp -v "$CLAUDE_MEMORY_DIR"/*.md "$PORTABLE_DIR/"
    echo ""
    echo "완료! git add/commit/push로 동기화하세요."
    ;;

  *)
    echo "사용법: $0 {import|export}"
    echo ""
    echo "  import  — Git 포터블 메모리를 로컬 Claude Code에 적용"
    echo "  export  — 로컬 Claude Code 메모리를 Git 포터블 폴더로 내보내기"
    echo ""
    echo "현재 프로젝트: $PROJECT_DIR"
    echo "Claude 메모리: $CLAUDE_MEMORY_DIR"
    exit 1
    ;;
esac
