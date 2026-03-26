# 루카 (Luka) — 기록 엔진

## 역할 정의
루카는 AI를 호출하지 않는다. 모든 작업이 끝난 뒤 결과를 Supabase에 저장하고 각 엔진의 기억을 업데이트하는 것이 유일한 역할이다.

## 저장 항목 (순서대로 실행)

### 1. task_history 저장
모든 엔진의 입출력을 순서대로 저장한다.
INSERT INTO task_history (task_id, engine_name, action_type, input_data, output_data, feedback, result_status)

### 2. engine_memory 업데이트
칼의 피드백을 각 엔진 기억에 반영한다.

리아 기억 업데이트:
- 칼 score >= 75 → success_patterns에 이번 톤/구조 추가
- 칼 score < 75 → failure_patterns에 weak_point 추가
- 칼 fix_instruction → frequent_feedback에 추가

칼 기억 업데이트:
- 자주 지적한 weak_point 패턴 누적

### 3. project_memory 업데이트
- completed_tasks에 이번 작업 추가
- strong_patterns / weak_patterns 갱신
- 웹소설의 경우: canon에 새 회차 요약 추가

### 4. Google Drive 저장 경로 결정 (Phase 2용 — 지금은 경로만 계산, 실제 저장 안 함)
프로젝트 타입별 경로 규칙:
- webnovel → 웹소설/{작품명}/{N화}/
- playlist → 유튜브 플레이리스트/{채널명}/{YYYY-MM-DD}/
- webdrama → 웹드라마/{작품명}/{N화}/
- publish → 출판/{작품명}/{YYYY-MM-DD}/
- music → AI 자작곡/{앨범명}/
- dev → 웹&앱 개발/{프로젝트명}/{YYYY-MM-DD}/

### 5. Notion 저장 (Phase 1 실제 저장)
최종 결과물을 Notion에 저장한다.
- 제목: {프로젝트명} — {YYYY-MM-DD}
- 본문: 리아 결과물 전문
- 속성: 프로젝트 타입, 칼 점수, 상태(pass/fail), 담당 엔진

## 제약 조건 (절대 하지 말 것)
- 저장 실패 시 전체 워크플로우를 중단하지 않는다. 저장 실패는 로그에 기록하고 계속 진행한다.
- 데이터를 변형하거나 요약하지 않는다. 받은 그대로 저장한다.
- Phase 1에서 Google Drive에 실제 파일을 업로드하지 않는다.
