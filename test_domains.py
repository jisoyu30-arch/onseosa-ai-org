import urllib.request, json, sys

BASE = 'http://localhost:3001'
SECRET = 'onseosa-dev-secret'

def pipeline(name, ptype, goal, brief):
    data = json.dumps({
        'projectName': name,
        'projectType': ptype,
        'goal': goal,
        'enrichedContext': {'executionBrief': brief}
    }, ensure_ascii=False).encode('utf-8')

    req = urllib.request.Request(
        f'{BASE}/pipeline',
        data=data,
        headers={
            'Content-Type': 'application/json; charset=utf-8',
            'x-secret': SECRET
        }
    )
    try:
        res = urllib.request.urlopen(req, timeout=180)
        result = json.loads(res.read().decode('utf-8'))
        return result
    except Exception as e:
        body = e.read().decode('utf-8') if hasattr(e, 'read') else str(e)
        return {'ok': False, 'error': body[:200]}

def print_result(label, result):
    ok = result.get('ok', False)
    results = result.get('results', {})
    ria = results.get('ria', {})
    review = results.get('arko-review', {})
    luka = results.get('luka', {})
    score = review.get('score', 0)
    notion = luka.get('data', {}).get('saved_paths', {}).get('notion') if luka else None

    print(f'\n{"="*50}')
    print(f'[{label}] {"✅ OK" if ok else "❌ FAIL"}')
    print(f'  리아: {ria.get("summary", "없음")}')
    print(f'  검수: {score}점 / {review.get("status", "없음")}')
    if notion:
        print(f'  노션: {notion}')
    elif not ok:
        print(f'  에러: {result.get("error", "")}')
        # ria 데이터 일부 출력
        if ria:
            data = ria.get('data', {})
            print(f'  ria.data keys: {list(data.keys())}')

# ── 1. 플레이리스트 ──────────────────────────
playlist_brief = {
    'domain': 'playlist',
    'goal': '새벽 작업용 감성 플레이리스트 기획',
    'target_output': '플레이리스트 제목 + 10곡 선곡 리스트 + 소개문 + 곡별 선곡 이유',
    'required_inputs': [],
    'applied_rules': [
        '새벽 2시 혼자 작업하는 무드',
        'lo-fi / 재즈 / 어쿠스틱 믹스',
        '10곡 구성',
        '무드 흐름: 조용한 시작 → 집중 → 여운'
    ],
    'template_to_use': 'playlist',
    'quality_checkpoints': [
        '첫 곡과 마지막 곡이 플리 무드를 대표하는가',
        '곡 간 BPM 흐름이 자연스러운가',
        '소개문이 실제 선곡 무드와 일치하는가'
    ],
    'engine_plan': [
        {'engine': '노아', 'purpose': '무드 분석'},
        {'engine': '이든', 'purpose': '플리 컨셉 기획'},
        {'engine': '리아', 'purpose': '제목, 소개문, 선곡 이유 작성'},
        {'engine': '아르코(검수)', 'purpose': '품질 검수'},
        {'engine': '루카', 'purpose': '노션 저장'}
    ],
    'blocked': False,
    'block_reason': ''
}

print('플레이리스트 테스트 시작...')
r1 = pipeline(
    '새벽 감성 플레이리스트',
    'playlist',
    '새벽 2시에 혼자 작업할 때 틀어두기 좋은 플레이리스트. 장르는 lo-fi, 재즈, 어쿠스틱 믹스. 10곡 구성. 제목과 소개문, 각 곡 선곡 이유 포함.',
    playlist_brief
)
print_result('플레이리스트', r1)

# ── 2. 도서 ──────────────────────────────────
book_brief = {
    'domain': 'book',
    'goal': 'AI 활용 창작자 실용서 기획 및 서문 작성',
    'target_output': '도서 제목 + 전체 목차 + 서문 + 챕터1 도입부',
    'required_inputs': [],
    'applied_rules': [
        '20-30대 프리랜서 창작자 타겟',
        '실용적이고 직접적인 문체',
        'AI를 위협이 아닌 무기로 포지셔닝',
        '각 챕터에 실제 활용 사례 포함'
    ],
    'template_to_use': 'book',
    'quality_checkpoints': [
        '서문 첫 단락이 독자를 잡는가',
        '목차 흐름이 논리적으로 이어지는가',
        '핵심 메시지가 전체에 일관되게 관통하는가'
    ],
    'engine_plan': [
        {'engine': '노아', 'purpose': '유사 도서 구조 분석'},
        {'engine': '이든', 'purpose': '목차 기획안 도출'},
        {'engine': '리아', 'purpose': '도서 제목, 목차, 서문, 챕터 도입부 작성'},
        {'engine': '아르코(검수)', 'purpose': '품질 검수'},
        {'engine': '루카', 'purpose': '노션 저장'}
    ],
    'blocked': False,
    'block_reason': ''
}

print('\n도서 테스트 시작...')
r2 = pipeline(
    'AI 시대 창작자 생존법',
    'book',
    'AI 도구를 활용해서 콘텐츠를 만드는 창작자를 위한 실용서. 독자: 20-30대 프리랜서 창작자. 핵심 메시지: AI는 대체가 아니라 무기다. 목차 설계 + 서문 + 챕터 도입부 샘플.',
    book_brief
)
print_result('도서', r2)
