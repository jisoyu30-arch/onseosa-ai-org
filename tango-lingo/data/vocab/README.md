# 단어 데이터 준비 가이드

## 목표
5,000개 단어 × 카드 학습 (26초 앱 스타일)
- 🇪🇸 ES: 2,500 (B1 → B2)
- 🇬🇧 EN: 2,000 (OPIc IM 완전)
- 🇨🇳 ZH: 500 (HSK 3급)

## 파일 위치
```
data/vocab/
├── TEMPLATE.csv     ← 빈 템플릿 (참고용)
├── es-001.csv       ← 스페인어 1000개 (사용자 작성)
├── es-002.csv       ← 스페인어 다음 1000개
├── en-001.csv       ← 영어 OPIc 1000개
├── en-002.csv       ← 영어 OPIc 다음
└── zh-001.csv       ← 중국어 HSK 500개
```

## CSV 형식

```csv
word,ko,category,ipa,pron_ko,example,example_ko,notes
```

### 필수 컬럼
- **word**: 단어 (예: `bailar`, `dance`, `跳`)
- **ko**: 한국어 뜻 (예: `춤추다`)
- **category**: 카테고리 코드 (아래 목록)

### 선택 컬럼 (비워두면 자동 생성)
- **ipa**: 발음 기호 (Gemini 자동 가능)
- **pron_ko**: 한글 발음 (Gemini 자동 가능)
- **example**: 대표 예문 (dialogue에서 자동 매칭 가능)
- **example_ko**: 예문 한국어
- **notes**: 메모 (학습용)

## 카테고리 코드 (50개)

### 🏠 일상 (15)
`self_intro` `family` `friend` `home` `routine`
`food` `restaurant` `cafe` `shopping` `clothing`
`transport` `weather` `morning` `evening` `weekend`

### 💼 활동·관심사 (15)
`work` `study` `internet` `social_media` `news`
`movie` `music` `book` `sport` `exercise`
`travel` `vacation` `photography` `cooking` `gaming`

### 💃 탱고 (10)
`tango_step` `tango_term` `milonga` `embrace` `partner`
`orchestra` `shoes` `lesson` `practice` `festival`

### 💗 감정·상태 (10)
`happy` `sad` `angry` `calm` `surprised`
`tired` `nervous` `proud` `love` `curious`

### 🧠 추상 (10) - OPIc IH/AL 필수
`opinion` `reason` `comparison` `agreement` `problem`
`solution` `plan` `future` `memory` `time`

## 추천 작업 순서

1. Google Sheets / Excel 열기
2. 위 형식대로 1000개 작성
3. CSV로 export → `data/vocab/es-001.csv` 위치에 저장
4. 알려주시면 자동 검증 + IPA·발음 보강

## OPIc 영어 추천 분배 (1000개당)

- 자기소개·가족·집·일상 (250)
- 취미·여행·영화·음악 (250)
- 직장·공부·인터넷 (200)
- 감정·의견 표현 (200)
- 추상·연결어 (100)

## 자동 보강 가능

CSV에 word + ko + category만 있으면:
- IPA 자동 (Gemini)
- 한글 발음 자동
- 예문 자동 (dialogue 풀에서 매칭, 없으면 Gemini 생성)
- 이모지·색상 자동 (카테고리 기반)
