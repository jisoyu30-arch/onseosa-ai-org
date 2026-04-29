// AI dialogue 배치 생성기
// 사용: node scripts/gen-dialogues.mjs [count]
// 결과: data/dialogues-ai-batchN.ts 로 저장
//
// 환경: .env 의 EXPO_PUBLIC_GEMINI_KEY 사용

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// .env 로드
function loadEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
if (!API_KEY) {
  console.error('❌ EXPO_PUBLIC_GEMINI_KEY 가 .env에 없음');
  process.exit(1);
}

const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// =====================================================
// 시드: 상황 × 레벨 조합 (B1 회화 위해 다양화)
// =====================================================
const SITUATIONS = [
  { key: 'cabeceo', ko: '카베세오·눈맞춤 초대', topics: ['멀리서 시선 교환', '거절의 미묘함', '확인 신호', '다른 사람과 헷갈림'] },
  { key: 'tanda_invite', ko: '탄다 초대·수락·거절', topics: ['정중한 초대', '직접 거절', '나중에 거절', '특정 곡 요청', '연속 탄다 사양'] },
  { key: 'cortina', ko: '코르티나 잡담', topics: ['취미 얘기', '여행 얘기', '직업 묻기', '음악 취향', '다음 일정'] },
  { key: 'abrazo', ko: '아브라소·자세 피드백', topics: ['편안하다 칭찬', '너무 힘들다 표현', '간격 조정', '어깨 긴장 풀기', '연결 깊이'] },
  { key: 'compliment', ko: '서로 칭찬', topics: ['걸음 칭찬', '리드 칭찬', '음악성 칭찬', '드레스/신발', '에너지'] },
  { key: 'apology', ko: '사과·실수 회복', topics: ['발 밟기', '리듬 놓침', '충돌', '신호 못 읽음', '늦게 도착'] },
  { key: 'thanks', ko: '탄다 후 감사', topics: ['특별한 탄다', '배움 감사', '재회 약속', '명함 교환', '울컥'] },
  { key: 'dj_request', ko: 'DJ 음악 요청', topics: ['특정 오케스트라', '시기 요청', '발스/밀롱가', '나라 요청', '클래식 요청'] },
  { key: 'shoes', ko: '신발·복장 얘기', topics: ['신상 자랑', '브랜드 추천', '굽 높이', '편안함', '수리'] },
  { key: 'milonga_chat', ko: '밀롱가 잡담', topics: ['이 도시 추천 밀롱가', '오케스트라 토론', '교사 추천', '여행 얘기', '가족·일'] },
  { key: 'practice', ko: '프락티카 대화', topics: ['오늘 뭐 연습?', '함께 연습 제안', '같이 영상 보기', '교사 후기', '다음 워크샵'] },
  { key: 'feedback', ko: '연습 후 피드백', topics: ['장점 짚기', '개선점 부드럽게', '또 만나자', '구체적 동작', '음악 해석'] },
];

const LEVELS = ['A1', 'A2', 'B1'];

const PROMPT = (sit, topic, level) => `Generate a SHORT, REALISTIC tango milonga dialogue in **Argentine Spanish** (voseo, Buenos Aires style).

**Situation:** ${sit.ko}
**Topic:** ${topic}
**Level:** ${level} (keep vocabulary at this level)
**Length:** 2-3 lines (real conversation, not lecture)

For each line, provide:
- speaker name (A or B, or 선생님/학생/Tanguero/Tanguera/Amigo etc — natural label)
- spanish (Argentine voseo, natural)
- korean (natural Korean translation)
- english (natural English translation)
- chinese (Simplified Chinese translation)

Return ONLY valid JSON in this exact shape:

{
  "situation": "${sit.ko} — ${topic}",
  "lines": [
    { "speaker": "...", "spanish": "...", "korean": "...", "english": "...", "chinese": "..." },
    { "speaker": "...", "spanish": "...", "korean": "...", "english": "...", "chinese": "..." }
  ]
}`;

async function genOne(sit, topic, level) {
  const prompt = PROMPT(sit, topic, level);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9, responseMimeType: 'application/json' },
    }),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + (await res.text()).slice(0, 200));
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}

function makeId(idx) {
  return `dai_${String(idx).padStart(4, '0')}`;
}

async function main() {
  const targetCount = parseInt(process.argv[2] ?? '30', 10);
  console.log(`🎭 AI dialogue 배치 생성 시작 — ${targetCount}개`);

  const dialogues = {};
  let idx = 0;
  let success = 0;
  let failed = 0;

  // 상황·토픽·레벨 매트릭스 셔플
  const tasks = [];
  for (const sit of SITUATIONS) {
    for (const topic of sit.topics) {
      for (const level of LEVELS) {
        tasks.push({ sit, topic, level });
      }
    }
  }
  // 랜덤 셔플
  tasks.sort(() => Math.random() - 0.5);
  const taskBatch = tasks.slice(0, targetCount);

  for (const t of taskBatch) {
    idx++;
    process.stdout.write(`  [${idx}/${targetCount}] ${t.sit.ko} - ${t.topic} (${t.level}) ... `);
    try {
      const d = await genOne(t.sit, t.topic, t.level);
      const id = makeId(idx);
      dialogues[id] = {
        id,
        lessonId: 'ai',
        situation: d.situation || `${t.sit.ko} — ${t.topic}`,
        level: t.level,
        lines: d.lines,
      };
      success++;
      console.log('✅');
    } catch (e) {
      failed++;
      console.log('❌', e.message);
    }
    // Gemini 무료 티어 = 분당 15req. 4.5초 간격으로 안전하게.
    // 유료 키 쓰는 경우 SLEEP_MS=600 으로 환경변수 오버라이드.
    const sleepMs = parseInt(process.env.SLEEP_MS ?? '4500', 10);
    await new Promise((r) => setTimeout(r, sleepMs));
  }

  // 결과 저장
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outPath = join(ROOT, 'data', `dialogues-ai-${ts}.ts`);
  const content = `// AI 생성 dialogue — ${ts}
// 총 ${success}개 (실패 ${failed}개)
import type { DialogueExample } from './dialogues-l1';

export const dialoguesAI: Record<string, DialogueExample> = ${JSON.stringify(dialogues, null, 2)};
`;
  writeFileSync(outPath, content, 'utf8');
  console.log(`\n📦 저장: ${outPath}`);
  console.log(`✅ 성공 ${success} / 실패 ${failed} / 총 ${idx}`);
}

main().catch((e) => { console.error('💥', e); process.exit(1); });
