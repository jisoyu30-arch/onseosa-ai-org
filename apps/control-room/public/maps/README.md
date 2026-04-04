# ONS Studio — Tiled Map 작업 가이드

## 1. Tiled 설치

### Windows
```
winget install mapeditor.tiled
```
또는 https://www.mapeditor.org/ 에서 다운로드 (무료)

### Mac
```
brew install tiled
```

---

## 2. 새 맵 생성

1. Tiled 실행 → **File > New > New Map**
2. 설정:
   - **Orientation**: Isometric
   - **Tile layer format**: CSV
   - **Tile render order**: Right Down
   - **Map size**: 16 x 12 tiles
   - **Tile size**: 100 x 50 px
3. **OK**

---

## 3. 타일셋 등록

1. **Map > New Tileset...**
2. 설정:
   - **Name**: office-tileset
   - **Type**: Based on Tileset Image
   - **Source**: `office-tileset.png` (이 폴더에 있음)
   - **Tile width**: 100
   - **Tile height**: 50
3. **OK**

> 현재 타일셋은 임시 이미지입니다. 나중에 정식 타일 스프라이트시트로 교체.

---

## 4. 레이어 생성

아래 레이어를 순서대로 만들어주세요:

### Tile Layers (바닥)
| 레이어 이름 | 용도 |
|------------|------|
| `floor` | 바닥 타일 (workspace / lobby / meeting / review 구분) |

### Object Layers (오브젝트)
| 레이어 이름 | 용도 | 오브젝트 타입 |
|------------|------|-------------|
| `zones` | 영역 경계 | Rectangle → type: `zone`, properties: `label` (string) |
| `desks` | 에이전트 책상 | Point → type: `desk`, properties: `agentId` (string), `label` (string) |
| `furniture` | 회의 테이블, 검수대 등 | Point → type: `furniture`, properties: `shape` (string: ellipse/diamond), `rx`/`ry` (int), `width`/`height` (int) |
| `anchors` | handoff 경로 지점 | Point → type: `handoff_anchor`, properties: `from` (string), `to` (string) |

---

## 5. 오브젝트 배치 가이드

### zones 레이어
1. Rectangle 도구로 영역 그리기
2. Properties:
   - `type`: zone
   - `label`: "LOBBY" / "WORKSPACE" / "MEETING ROOM" / "REVIEW ZONE"

### desks 레이어 (6개)
각 에이전트 자리에 Point 찍기:

| name | agentId | label | 추천 위치 (타일) |
|------|---------|-------|---------------|
| desk_arko | arko | 총괄석 | (1, 1) |
| desk_noah | noah | 분석석 | (3, 1) |
| desk_eden | eden | 기획석 | (5, 1) |
| desk_ria | ria | 창작석 | (7, 1) |
| desk_mika | mika | 미디어석 | (4, 4) |
| desk_luka | luka | 기록석 | (6, 4) |

### furniture 레이어
| name | shape | 위치 | 추가 속성 |
|------|-------|------|----------|
| meeting_table | ellipse | (10.5, 2.5) | rx: 52, ry: 20 |
| review_desk | diamond | (5.5, 7.5) | width: 120, height: 28 |

### anchors 레이어
문서가 이동하는 경유 지점:

| name | from | to | 위치 |
|------|------|----|------|
| handoff_noah_eden | noah | eden | (4, 1) |
| handoff_eden_ria | eden | ria | (6, 1) |
| handoff_ria_review | ria | review | (4, 3) |
| review_entry | ria | review | (3, 7) |
| review_exit | review | mika | (7, 7) |

---

## 6. JSON 내보내기

1. **File > Export As...**
2. 파일 이름: `office.json`
3. 저장 위치: 이 폴더 (`apps/control-room/public/maps/`)
4. 포맷: JSON map files (*.json)

---

## 7. PixiJS 연결

`office.json`을 저장하면 OfficeScene이 자동으로 로드합니다.
코드: `apps/control-room/src/office/scene/mapLoader.ts`

mapLoader가 읽는 필드:
- `zones` 레이어의 Rectangle → 영역 라벨 표시
- `desks` 레이어의 Point → 에이전트 배치 위치 + 워크스테이션 렌더링
- `furniture` 레이어의 Point → 회의 테이블 / 검수대 렌더링
- `anchors` 레이어의 Point → 문서 handoff 경로

---

## 8. 커스텀 속성 요약

| 속성 이름 | 타입 | 사용처 |
|----------|------|--------|
| `label` | string | zone, desk |
| `agentId` | string | desk |
| `shape` | string | furniture (ellipse / diamond) |
| `rx`, `ry` | int | furniture (타원 반지름) |
| `width`, `height` | int | furniture (다이아몬드 크기) |
| `from`, `to` | string | handoff_anchor (에이전트 ID) |
