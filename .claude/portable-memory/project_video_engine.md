---
name: 영상 엔진 Remotion 결정
description: Phase 2 영상 엔진을 Sora 2 대신 Remotion(React 기반 MP4 생성)으로 결정. skills.sh 스킬 설치 필요.
type: project
---

영상 엔진을 Sora 2에서 Remotion으로 변경.

**Why:** Sora 2는 외부 API 의존 + 비용 높음 + 결과물 제어 불가. Remotion은 React 코드로 영상 완전 제어 가능.

**How to apply:**
- Phase 2에서 apps/control-room/src/remotion/ 디렉토리 생성
- remotion, @remotion/player, @remotion/cli 패키지 추가
- 리아-영상 서브워크플로우(VideoProps JSON 생성) 추가
- 플레이리스트 루프 영상 = 10초(300프레임@30fps), 4씬 구성
- skills.sh 설치: npx skills install anthropics/skills/frontend-design
- Phase 1에서는 Remotion 렌더링 구현 금지
