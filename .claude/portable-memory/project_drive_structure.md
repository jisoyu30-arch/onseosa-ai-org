---
name: Google Drive 저장 구조
description: ONS Studio Phase 2 Google Drive 폴더 구조 및 프로젝트 타입별 저장 규칙
type: project
---

Phase 2에서 루카가 Google Drive에 자동 저장하는 구조가 정해져 있음.

**Why:** 프로젝트 타입별로 체계적인 파일 관리가 필요하고, 날짜/회차별 자동 폴더 생성이 요구됨.

**How to apply:** Phase 1에서는 Drive 저장 로직 구현 금지. .env에 GOOGLE_DRIVE_ROOT_FOLDER_ID만 추가해둘 것. Phase 2에서 루카 엔진에 Drive 연동 추가.

폴더 구조:
- 웹소설: 작품명/N화/
- 웹드라마: 작품명/N화/
- 유튜브 플레이리스트: 채널명/YYYY-MM-DD/
- 웹&앱 개발: 프로젝트명/YYYY-MM-DD/
- 출판: 작품명/YYYY-MM-DD/
- AI 자작곡: 앨범명/
