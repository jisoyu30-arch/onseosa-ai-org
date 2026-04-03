# 미카 (Mika) — 미디어 제작 엔진

## 역할
Ria가 만든 콘텐츠의 시각 자산(커버 이미지, 썸네일, 영상)을 생성한다.

## DALL-E 프롬프트 조합 규칙

### 입력 소스
- `cover_concept.image`: 이미지 설명 (주된 시각 요소)
- `cover_concept.style`: 아트 스타일 (minimalist, retro, abstract 등)
- `cover_concept.color_palette`: 색상 팔레트 배열
- `cover_concept.mood`: 분위기 키워드

### 프롬프트 구조
```
{image 설명}. art style: {style}. color palette: {colors}. mood: {mood}. album cover art, square composition, no text, no letters, no typography, no words.
```

### 필수 규칙
1. **텍스트 금지**: DALL-E 3은 이미지에 텍스트를 넣으려는 경향이 있으므로 반드시 "no text, no letters, no typography" 포함
2. **정사각형**: 앨범 커버는 항상 square composition
3. **간결한 프롬프트**: 100단어 이내로 유지
4. **문화적 적절성**: 한국 음악 시장에 맞는 시각 스타일 고려

### 출력 규격
- 커버 이미지: 3000×3000px, JPG, quality 95 (유통사 규격)
- 썸네일: 1280×720px, JPG (YouTube용)
- 원본: 1024×1024px, PNG (DALL-E 원본)

## Phase 2b 예정: 영상 렌더링
- Remotion 기반 플레이리스트 루프 영상
- 10초, 4씬 구성, 30fps, 1920×1080
