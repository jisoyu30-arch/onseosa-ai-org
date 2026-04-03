const fs = require('fs');
const path = require('path');

// 모노레포 구조: SDK는 apps/claude-worker/node_modules에 설치됨
const workerModules = path.resolve(__dirname, '../apps/claude-worker/node_modules');
const OpenAI = require(path.join(workerModules, 'openai'));
const Anthropic = require(path.join(workerModules, '@anthropic-ai/sdk'));
require(path.join(workerModules, 'dotenv')).config({ path: path.resolve(__dirname, '../.env'), override: true });

const analysis = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/album-analysis.json'), 'utf-8'));

const openai = new OpenAI.default({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });

// ──── STEP 1: eden (기획) - GPT-4o ────
async function runEden() {
  console.log('[eden] 기획 시작...');
  const trackList = analysis.tracks.map(t => {
    return '#' + t.trackNumber + ' ' + t.title + ' | 악기:' + (t.instruments || []).join(',') + ' | BPM:' + (t.bpm || '?') + ' | 무드:' + (Array.isArray(t.mood) ? t.mood.join(',') : '');
  }).join('\n');

  const systemMsg = '너는 온:서사의 기획 엔진 이든이다. 레퍼런스 분석과 음원 분석 데이터를 기반으로 앨범 발매 기획안을 JSON으로 작성한다.';

  const userMsg = `## 앨범 음원 분석 결과
총 ${analysis.overview.total_tracks}곡 | 평균 BPM ${analysis.overview.average_bpm}
악기: ${analysis.overview.all_instruments.join(', ')}
무드: ${analysis.overview.all_moods.join(', ')}

### 트랙별 분석
${trackList}

## 레퍼런스 앨범 핵심 요약
- Einaudi Underwater: 시적 소개, 미니멀 커버, 자연/빛/색채 트랙명
- Chad Lawson Re:Piano: 문학적 트랙명, 어스톤 커버, 스트리밍 최적화
- Harbors When We Are Free: 기능성 명시, 웰니스 포지셔닝, 활용장면 나열

## 요청
다음 항목을 기획해서 JSON으로 응답해줘:
{
  "album_title_main": "영문 은유적 앨범명",
  "album_title_sub": "한글 서브타이틀",
  "album_concept": "앨범 전체 컨셉 3-5문장",
  "target_audience": "타겟 청취자",
  "positioning": "시장 포지셔닝",
  "cover_concept": {
    "image": "이미지 방향",
    "color_palette": "색감",
    "typography": "서체 방향",
    "style": "전체 스타일"
  },
  "track_grouping": "트랙 흐름/그룹핑 제안",
  "promo_hooks": ["숏폼 홍보 문구 3개"],
  "use_cases": ["활용 장면 5개"],
  "metadata": {
    "genre": "장르 태그",
    "mood_tags": ["무드 태그 5개"],
    "artist_name": "아티스트명 제안"
  }
}`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.3,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemMsg },
      { role: 'user', content: userMsg },
    ],
  });

  const edenData = JSON.parse(res.choices[0].message.content);
  console.log('[eden] 기획 완료:', edenData.album_title_main);
  return edenData;
}

// ──── STEP 2: ria (작가) - Claude Sonnet ────
async function runRia(edenPlan) {
  console.log('[ria] 카피 작성 시작...');
  const trackInfo = analysis.tracks.map(t => {
    const inst = (t.instruments || []).join(', ');
    const mood = Array.isArray(t.mood) ? t.mood.join(', ') : '';
    const desc = t.description_hints || '';
    return '#' + t.trackNumber + ' ' + t.title + ' | ' + inst + ' | ' + mood + ' | ' + desc;
  }).join('\n');

  const systemMsg = '너는 온:서사의 작가 엔진 리아다. 기획안과 음원 분석을 기반으로 앨범 소개 문구와 곡별 설명을 작성한다. 시적이면서도 독자가 음악을 듣고 싶어지는 문장을 쓴다. 반드시 JSON으로만 응답.';

  const userMsg = `## 기획안
앨범명: ${edenPlan.album_title_main} — ${edenPlan.album_title_sub}
컨셉: ${edenPlan.album_concept}
타겟: ${edenPlan.target_audience}
커버 컨셉: ${JSON.stringify(edenPlan.cover_concept)}
활용 장면: ${edenPlan.use_cases.join(', ')}

## 트랙별 음원 분석
${trackInfo}

## 레퍼런스 소개 문구 스타일
- Einaudi: 시적+철학적 도입 -> 탄생 배경 -> 은유
- Lawson: 각 트랙을 시적 이미지로 소개
- Harbors: 활용 장면 직접 나열 + 기능적 소개

## 요청
JSON으로 응답:
{
  "album_intro": "앨범 소개 문구 (3단 구성: 시적 도입 -> 기능적 중간 -> 감각적 마무리, 한국어, 200자 내외)",
  "album_intro_en": "영문 앨범 소개 (유통사용, 150단어 내외)",
  "track_descriptions": [
    {"trackNumber": 1, "title": "곡제목", "copy_ko": "한국어 곡 설명 1-2문장", "copy_en": "영문 곡 설명 1문장"}
  ],
  "credit_note": "크레딧 노트 (AI 음원 제작 관련 권리 안내문)"
}

중요: track_descriptions는 반드시 23곡 전부 포함해야 한다.`;

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: systemMsg,
    messages: [{ role: 'user', content: userMsg }],
  });

  const riaText = res.content[0].text;
  const clean = riaText.replace(/```json?/g, '').replace(/```/g, '').trim();
  let riaData;
  try {
    riaData = JSON.parse(clean);
  } catch {
    const m = clean.match(/\{[\s\S]*\}/);
    riaData = m ? JSON.parse(m[0]) : { error: 'parse failed', raw: clean.slice(0, 500) };
  }
  console.log('[ria] 카피 완료, 트랙 설명:', (riaData.track_descriptions || []).length + '곡');
  return riaData;
}

// ──── STEP 3: arko (검수) - GPT-4o ────
async function runArko(edenPlan, riaOutput) {
  console.log('[arko] 검수 시작...');

  const systemMsg = '너는 온:서사의 총괄 디렉터 아르코다. 기획과 카피 결과물을 검수한다. 5개 항목 각 20점, 총 100점으로 평가. 75점 이상이면 pass. 시장성과 분석적 근거를 반드시 포함해 컨펌 이유를 설명한다.';

  const userMsg = `## 기획안 (eden)
${JSON.stringify(edenPlan, null, 2)}

## 카피 (ria)
앨범 소개 (한국어): ${riaOutput.album_intro}
앨범 소개 (영문): ${riaOutput.album_intro_en}
트랙 설명 수: ${(riaOutput.track_descriptions || []).length}곡
샘플 트랙 설명 (처음 5곡):
${JSON.stringify((riaOutput.track_descriptions || []).slice(0, 5), null, 2)}

## 검수 기준
1. 방향 일치도 (20점): 기획 컨셉과 카피가 일관되는가
2. 시장성 (20점): 타겟 청취자에게 어필할 수 있는가, 스트리밍 최적화되었는가
3. 감정 전달 (20점): 카피가 음악을 듣고 싶게 만드는가
4. 명확성 (20점): 메타데이터, 활용 장면 등이 명확한가
5. 완성도 (20점): 발매 패키지로서 빠진 것이 없는가

## 요청
JSON으로 응답:
{
  "score": 총점숫자,
  "breakdown": { "방향일치": 숫자, "시장성": 숫자, "감정전달": 숫자, "명확성": 숫자, "완성도": 숫자 },
  "decision": "pass 또는 revise",
  "market_analysis": "시장성 분석 근거 (경쟁 앨범 대비, 타겟 청취자, 스트리밍 트렌드 등 3-5문장)",
  "strong_points": ["강점 3개"],
  "weak_points": ["약점 또는 개선 제안"],
  "confirm_reason": "최종 컨펌/리젝 이유 (분석적 근거 포함, 5문장 이상)"
}`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.1,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemMsg },
      { role: 'user', content: userMsg },
    ],
  });

  const arkoData = JSON.parse(res.choices[0].message.content);
  console.log('[arko] 검수 완료:', arkoData.score + '/100 (' + arkoData.decision + ')');
  return arkoData;
}

// ──── MAIN ────
(async () => {
  const startAll = Date.now();

  const edenPlan = await runEden();
  const riaOutput = await runRia(edenPlan);
  const arkoReview = await runArko(edenPlan, riaOutput);

  const elapsed = ((Date.now() - startAll) / 1000).toFixed(1);

  const finalOutput = {
    album: analysis.album,
    pipeline_date: new Date().toISOString(),
    pipeline_elapsed: elapsed + 's',
    eden: edenPlan,
    ria: riaOutput,
    arko: arkoReview,
    analysis_overview: analysis.overview,
  };

  const outPath = path.resolve(__dirname, '../data/album-pipeline-result.json');
  fs.writeFileSync(outPath, JSON.stringify(finalOutput, null, 2), 'utf-8');

  console.log('\n=== 파이프라인 완료 ===');
  console.log('소요시간:', elapsed + 's');
  console.log('앨범명:', edenPlan.album_title_main, '—', edenPlan.album_title_sub);
  console.log('컨셉:', edenPlan.album_concept);
  console.log('검수:', arkoReview.score + '/100 (' + arkoReview.decision + ')');
  console.log('\n앨범 소개:\n' + riaOutput.album_intro);
  console.log('\n검수 이유:\n' + arkoReview.confirm_reason);
  console.log('\n시장성 분석:\n' + arkoReview.market_analysis);
  console.log('\n저장:', outPath);
})();
