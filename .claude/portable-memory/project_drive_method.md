---
name: Drive 연동 방식 변경
description: Google Drive 파일 업로드는 서비스 계정이 아닌 n8n Google Drive 노드(OAuth)로 처리. Phase 1.5에서 추가.
type: project
---

서비스 계정은 개인 Drive에 파일 업로드 불가 (storage quota 제한).

**Why:** Google 정책상 서비스 계정은 저장 용량이 없어서 파일 생성이 안 됨. 폴더 생성/조회만 가능.

**How to apply:** Claude Worker의 google-drive.ts 대신 n8n의 Google Drive 노드(OAuth 인증)를 사용해서 파일 업로드. Phase 1.5에서 SWF-루카-기록 워크플로우에 Google Drive 노드 추가.
