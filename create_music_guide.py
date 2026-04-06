import urllib.request, json

token = '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'
parent_id = 'dfaf2e99-bb39-8212-a12c-81534b840984'

children = [
    {"object":"block","type":"callout","callout":{"rich_text":[{"type":"text","text":{"content":"음악(music) 도메인 작업 시 반드시 참조. 앨범/싱글/EP 기획, 음원 패키지 제작, 유통 등록에 적용."}}],"icon":{"type":"emoji","emoji":"🎵"}}},

    {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"type":"text","text":{"content":"1. 적용 범위"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"앨범 / 싱글 / EP 기획 및 패키지 제작"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"음원 분석 (장르 / BPM / 무드 / 악기)"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"앨범 소개문 / 트랙 소개 / 메타데이터 시트 작성"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"뮤직비디오 / 아트트랙 비주얼 브리프 작성"}}]}},

    {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"type":"text","text":{"content":"2. 작업 전 필수 확인"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"WAV 음원 파일 또는 트랙 목록이 있는가"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"아티스트명 표기가 확정됐는가 (유통사 표기와 동일)"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"발매 유형 확정: 싱글 / EP / 정규앨범"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"AI 사용 여부 및 권리 보유 상태 확인됐는가"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"샘플 / 커버곡 여부 확인됐는가"}}]}},

    {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"type":"text","text":{"content":"3. 엔진 역할 분담"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"노아: WAV 분석 → 장르/BPM/무드/악기 추출"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"이든: 앨범 컨셉 기획 → 앨범명 후보 2~3개, 트랙 순서안, 비주얼 방향"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"리아: 텍스트 작성 → 앨범 소개문, 트랙 소개, 숏폼 훅, 메타데이터 시트"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"아르코 검수: 패키지 7종 누락 여부, 메타데이터 일관성, 텍스트 품질"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"루카: 노션 파이프라인 결과 DB + Supabase task_history 저장"}}]}},

    {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"type":"text","text":{"content":"4. 결과물 필수 항목 (7종 패키지)"}}]}},
    {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"type":"text","text":{"content":"앨범명 확정안 (추천 1개 + 후보 2개)"}}]}},
    {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"type":"text","text":{"content":"트랙 순서 및 제목 목록"}}]}},
    {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"type":"text","text":{"content":"앨범 소개문 (3~5줄, 무드 + 정체성 + 핵심 메시지)"}}]}},
    {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"type":"text","text":{"content":"메타데이터 시트 (아티스트명/장르/작곡작사/ISRC/UPC/발매일/Explicit)"}}]}},
    {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"type":"text","text":{"content":"크레딧 / 권리 확인 자료"}}]}},
    {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"type":"text","text":{"content":"숏폼용 훅 문장 (15초/30초 구간 포함)"}}]}},
    {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"type":"text","text":{"content":"비주얼 브리프 (커버아트 방향, 뮤직비디오 컨셉 키워드)"}}]}},

    {"object":"block","type":"callout","callout":{"rich_text":[{"type":"text","text":{"content":"유통 기술 규격 상세: 오디오 포맷, 커버아트 사이즈, 발매 일정, 체크리스트는 아래 참조 문서 확인"}}],"icon":{"type":"emoji","emoji":"📋"}}},
    {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"type":"text","text":{"content":"참조: 유통사용 앨범 패키지 사양 (같은 폴더 내 페이지)"}}]}},

    {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"type":"text","text":{"content":"5. 검수 포인트"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"아티스트명이 전 트랙에서 완전히 동일한가"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"메타데이터 시트 필수 항목 누락 없는가"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"앨범 소개문이 음악 무드와 실제로 일치하는가"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"훅 문장이 첫 3초 안에 시청자를 멈추게 하는가"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"AI/샘플/커버곡 권리 상태가 명시됐는가"}}]}},

    {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"type":"text","text":{"content":"6. 금지 규칙"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"WAV 분석 없이 장르/BPM 임의 추측 금지"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"메타데이터 시트 없이 유통 패키지 완료 처리 금지"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"아티스트명 표기 임의 변형 금지"}}]}},
    {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"샘플/커버/AI 권리 미확인 상태로 pass 처리 금지"}}]}},
]

data = json.dumps({
    "parent": {"page_id": parent_id},
    "properties": {"title": [{"type":"text","text":{"content":"2-4. 음악 도메인 작업 가이드"}}]},
    "icon": {"type":"emoji","emoji":"🎵"},
    "children": children
}).encode("utf-8")

req = urllib.request.Request(
    "https://api.notion.com/v1/pages",
    data=data,
    headers={
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }
)
try:
    res = urllib.request.urlopen(req)
    result = json.loads(res.read())
    print("생성됨! URL:", result.get("url"))
except Exception as e:
    body = e.read().decode() if hasattr(e, "read") else str(e)
    print("실패:", body[:400])
