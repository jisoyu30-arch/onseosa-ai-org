---
name: 유통사 발매 패키지 규격
description: 음원 유통사(TuneCore/DistroKid/CD Baby) 등록용 Release Package 7종 세트 및 기술 규격
type: reference
---

## 발매 패키지 7종 세트

1. **마스터 음원** — WAV 44.1kHz / 16-bit stereo, 파일명 통일 (01_TITLE_MASTER.wav)
2. **커버 이미지** — 3000×3000px, RGB, JPG/PNG, 25MB 이하
3. **메타데이터 시트** — 아티스트명, 트랙명, 작곡/작사/프로듀서, 장르, 가사 언어, 발매일, 레이블명, Explicit 여부, ISRC, UPC
4. **ISRC/UPC 코드** — ISRC: 트랙별 고유코드, UPC: 발매물 단위 코드. 싱글/앨범 양쪽에 같은 곡 넣을 때 ISRC 유지, UPC는 별개
5. **크레딧/권리 자료** — 작사/작곡/편곡/프로듀서, 피처링, 샘플/커버/AI 사용 여부. AI 곡은 권리 보유 필수, 타인 목소리 모방/스팸 업로드 금지
6. **발매 일정/플랫폼 설정** — 업로드: 발매일 3~4주 전, Spotify 피치: 최소 7일 전(2주 전 권장)
7. **가사/프로모션 부가자료** — 가사 txt, 한글/영문 표기 통일표, 숏폼 Hook 문장, 티저 15s/30s 구간

## 실무 폴더 구조

```
RELEASE_PACK/
├─ 01_AUDIO_MASTER/     ← WAV 마스터 파일
├─ 02_ARTWORK/          ← 커버 3000px + 소스
├─ 03_METADATA/         ← 메타데이터 시트, 크레딧
├─ 04_LYRICS/           ← 곡별 가사 txt
├─ 05_RIGHTS/           ← 권리 확인서, AI 사용 노트
└─ 06_PROMO/            ← 티저, 캡션
```

## 업로드 전 체크리스트
- 아티스트명 전 트랙 동일
- feat. 표기 일관성
- 트랙 제목 대소문자/괄호 통일
- 커버 이미지 오탈자 없음
- 파일명 = 트랙 순서
- ISRC/UPC 중복/오입력 없음
- Explicit/Clean 표시 정확
- 샘플/커버/AI 권리 문제 없음
- 발매일 2~4주 뒤
- Spotify 포커스트랙 선정

## 핵심 원칙
> "곡 파일"보다 "메타데이터 시트 + 권리 정리"가 먼저. AI 기반 프로젝트는 권리·크레딧·표기 통일이 특히 중요.

## 공식 출처
- DistroKid: audio formats, uploading, AI policy, cover songs, credits
- TuneCore: store delivery timeline, 101 guide, release planning
- CD Baby: artwork requirements, distribution checklist, cover songs
- Spotify: release guide, playlist pitching, release radar
