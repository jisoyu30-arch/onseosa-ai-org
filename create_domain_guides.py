import urllib.request, json, time

token = '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'
parent_id = 'dfaf2e99-bb39-8212-a12c-81534b840984'

def create_page(title, icon, children):
    data = json.dumps({
        "parent": {"page_id": parent_id},
        "properties": {"title": [{"type": "text", "text": {"content": title}}]},
        "icon": {"type": "emoji", "emoji": icon},
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
        print(f"✅ 생성됨: {title}\n   URL: {result.get('url')}\n")
    except Exception as e:
        body = e.read().decode() if hasattr(e, "read") else str(e)
        print(f"❌ 실패 ({title}): {body[:300]}\n")

def b(type_, **kwargs):
    return {"object": "block", "type": type_, type_: kwargs}

def text(content):
    return [{"type": "text", "text": {"content": content}}]

def h2(content):
    return b("heading_2", rich_text=text(content))

def bullet(content):
    return b("bulleted_list_item", rich_text=text(content))

def numbered(content):
    return b("numbered_list_item", rich_text=text(content))

def callout(content, emoji):
    return b("callout", rich_text=text(content), icon={"type": "emoji", "emoji": emoji})

def para(content):
    return b("paragraph", rich_text=text(content))

# ─────────────────────────────────────────
# 1. 플레이리스트 도메인 가이드
# ─────────────────────────────────────────
playlist_children = [
    callout("playlist 도메인 작업 시 반드시 참조. 음악 큐레이션, 감상 플레이리스트 기획·제작에 적용.", "🎧"),

    h2("1. 적용 범위"),
    bullet("무드/테마별 플레이리스트 기획 (공부, 드라이브, 새벽 감성 등)"),
    bullet("아티스트/장르 큐레이션 플레이리스트"),
    bullet("유튜브/스포티파이/멜론 배포용 선곡 리스트"),
    bullet("이벤트·시즌용 플레이리스트 (크리스마스, 여름 등)"),

    h2("2. 작업 전 필수 확인"),
    bullet("플레이리스트 무드/테마가 확정됐는가"),
    bullet("배포 플랫폼 확정 (유튜브/스포티파이/멜론/애플뮤직)"),
    bullet("수록 예정 곡 목록이 있는가 (없으면 자유 선곡)"),
    bullet("곡 수 목표: 최소 5곡, 권장 10~20곡"),

    h2("3. 엔진 역할 분담"),
    bullet("노아: 수록 곡 분석 → 무드/BPM 분포, 흐름 단절 구간 파악"),
    bullet("이든: 플레이리스트 컨셉 기획 → 제목 후보, 선곡 순서안, 무드 흐름"),
    bullet("리아: 텍스트 작성 → 플리 제목, 소개문, 곡별 선곡 이유"),
    bullet("아르코 검수: 무드 일관성, 흐름 자연스러움, 텍스트 품질"),
    bullet("루카: 노션 DB + Supabase 저장"),

    h2("4. 결과물 필수 항목"),
    numbered("플레이리스트 제목 (확정안 1개 + 후보 2개)"),
    numbered("선곡 리스트 (아티스트 - 곡명 순서 포함)"),
    numbered("플레이리스트 소개문 (2~3줄, 무드 + 타겟 상황)"),
    numbered("곡별 선곡 이유 (1줄씩)"),
    numbered("커버 이미지 방향 (키워드 3개)"),

    h2("5. 검수 포인트"),
    bullet("첫 곡과 마지막 곡이 플리 무드를 대표하는가"),
    bullet("곡 간 BPM/톤 전환이 자연스러운가"),
    bullet("소개문이 실제 선곡과 일치하는가"),
    bullet("플랫폼별 저작권 이슈 없는 곡인가"),

    h2("6. 금지 규칙"),
    bullet("무드 일관성 없는 선곡 혼재 금지"),
    bullet("소개문과 실제 선곡 무드 불일치 금지"),
    bullet("저작권 미확인 곡 포함 금지"),
]

# ─────────────────────────────────────────
# 2. 방송 도메인 가이드
# ─────────────────────────────────────────
broadcast_children = [
    callout("broadcast 도메인 작업 시 반드시 참조. 유튜브/팟캐스트/라디오 방송 기획·대본에 적용.", "📻"),

    h2("1. 적용 범위"),
    bullet("유튜브 채널 에피소드 기획 및 대본"),
    bullet("팟캐스트 에피소드 구성 및 큐시트"),
    bullet("라디오 방송 기획 및 진행 대본"),
    bullet("인터뷰/토크/다큐 포맷 방송"),

    h2("2. 작업 전 필수 확인"),
    bullet("방송 플랫폼 확정 (유튜브/팟캐스트/라디오)"),
    bullet("에피소드 주제 또는 게스트 확정됐는가"),
    bullet("방송 길이: 숏(10분 이하) / 미들(30분) / 롱(60분 이상)"),
    bullet("포맷 확정: 토크/인터뷰/다큐/정보형"),
    bullet("단독 에피소드인가, 시리즈 중 몇 화인가"),

    h2("3. 엔진 역할 분담"),
    bullet("노아: 주제 분석 → 트렌드 연관성, 타겟 청취자 특성, 유사 방송 패턴"),
    bullet("이든: 에피소드 기획 → 세그먼트 구성, 시간 배분, 포맷 안 2~3개"),
    bullet("리아: 텍스트 작성 → 에피소드 제목, 오프닝 멘트, 큐시트, 핵심 멘트"),
    bullet("아르코 검수: 포맷 일관성, 시간 배분, 청취자 후킹 강도"),
    bullet("루카: 노션 DB + Supabase 저장"),

    h2("4. 결과물 필수 항목"),
    numbered("에피소드 제목 (확정안 1개 + 후보 2개)"),
    numbered("방송 기획 개요 (포맷/주제/타겟/길이)"),
    numbered("큐시트 (세그먼트별 시간/내용/진행 포인트)"),
    numbered("오프닝 멘트 (30초 이내, 청취자 훅 포함)"),
    numbered("핵심 멘트 3개 이상"),
    numbered("클로징 멘트 + 다음 에피소드 예고"),

    h2("5. 검수 포인트"),
    bullet("오프닝 30초 안에 청취자를 잡는가"),
    bullet("큐시트 시간 배분이 현실적인가"),
    bullet("핵심 메시지가 명확하게 전달되는가"),
    bullet("클로징에 다음 에피소드 연결이 있는가"),

    h2("6. 금지 규칙"),
    bullet("오프닝 없이 본방 바로 시작 금지"),
    bullet("큐시트 없는 방송 대본 완료 처리 금지"),
    bullet("에피소드 제목 없이 패키지 완료 금지"),
]

# ─────────────────────────────────────────
# 3. 도서 도메인 가이드
# ─────────────────────────────────────────
book_children = [
    callout("book 도메인 작업 시 반드시 참조. 단행본/에세이/자기계발서/소설 등 출판 도서 기획·집필에 적용.", "📚"),

    h2("1. 적용 범위"),
    bullet("단행본 기획 및 목차 설계"),
    bullet("에세이/자기계발서/비즈니스서 집필"),
    bullet("소설/논픽션 장편 기획"),
    bullet("전자책(e-book) 포함"),

    h2("2. 작업 전 필수 확인"),
    bullet("도서 장르 확정: 에세이/자기계발/소설/실용서/비즈니스"),
    bullet("독자 타겟 확정: 전문가/일반인/청소년/직장인 등"),
    bullet("핵심 메시지 1줄로 정리됐는가"),
    bullet("원고 목표 분량: 단편(3만자 이하) / 중편(3~10만자) / 장편(10만자 이상)"),
    bullet("출판사 투고 목적인가, 자체 출판인가"),

    h2("3. 엔진 역할 분담"),
    bullet("노아: 주제 분석 → 유사 도서 구조, 독자층 관심사, 차별화 포인트"),
    bullet("이든: 도서 기획 → 전체 목차 안 2~3개, 챕터별 핵심 메시지, 서술 방향"),
    bullet("리아: 텍스트 작성 → 서문, 목차, 챕터 도입부, 에필로그 방향"),
    bullet("아르코 검수: 논리 흐름 일관성, 독자 타겟 적합성, 텍스트 품질"),
    bullet("루카: 노션 DB + Supabase 저장"),

    h2("4. 결과물 필수 항목"),
    numbered("도서 제목 (확정안 1개 + 후보 2개)"),
    numbered("기획 개요 (장르/주제/독자/핵심 메시지/차별화 포인트)"),
    numbered("전체 목차 (챕터 번호 + 제목 + 핵심 한 줄)"),
    numbered("서문 (독자가 끝까지 읽어야 할 이유, 2~3단락)"),
    numbered("챕터 도입부 샘플 1개 이상"),
    numbered("출판사 투고용 시놉시스 (500자 이내)"),

    h2("5. 검수 포인트"),
    bullet("서문 첫 단락이 독자를 잡는가"),
    bullet("목차 흐름이 논리적으로 이어지는가"),
    bullet("챕터별 분량 배분이 균형 잡혀 있는가"),
    bullet("핵심 메시지가 목차 전체에 일관되게 관통하는가"),
    bullet("독자 타겟에 맞는 문체와 수준인가"),

    h2("6. 금지 규칙"),
    bullet("목차 없이 원고 집필 시작 금지"),
    bullet("핵심 메시지 미확정 상태로 서문 완료 처리 금지"),
    bullet("독자 타겟 미확정 상태로 문체 결정 금지"),
]

# 순서대로 생성 (API rate limit 방지)
create_page("2-5. 플레이리스트 도메인 작업 가이드", "🎧", playlist_children)
time.sleep(1)
create_page("2-6. 방송 도메인 작업 가이드", "📻", broadcast_children)
time.sleep(1)
create_page("2-7. 도서 도메인 작업 가이드", "📚", book_children)
