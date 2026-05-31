// Vocab 보강 스크립트 — Gemini로 한국어 뜻 + IPA + 한글 발음 + 카테고리 + 예문 자동 생성
// 사용: node scripts/enrich-vocab.mjs [lang] [batchSize]
//   예: node scripts/enrich-vocab.mjs es 25
import { readFileSync, writeFileSync, existsSync } from 'fs';
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

const CATEGORIES = [
  'self_intro','family','friend','home','routine','food','restaurant','cafe',
  'shopping','clothing','transport','weather','morning','evening','weekend',
  'work','study','internet','social_media','news','movie','music','book',
  'sport','exercise','travel','vacation','photography','cooking','gaming',
  'tango_step','tango_term','milonga','embrace','partner','orchestra','shoes',
  'lesson','practice','festival','happy','sad','angry','calm','surprised',
  'tired','nervous','proud','love','curious','opinion','reason','comparison',
  'agreement','problem','solution','plan','future','memory','time',
];

const LANG_NAMES = { en: 'English', es: 'Spanish', zh: 'Chinese (Simplified)' };

const PROMPT = (lang, words) => `For each word below, return JSON with these fields:
- ko: Korean meaning (concise, 1-3 words)
- ipa: simplified pronunciation guide (syllable-by-syllable for ${LANG_NAMES[lang]}, e.g. "bai-LAR" for Spanish, "/bæk/" for English, "nǐ hǎo" pinyin for Chinese)
- pron_ko: Korean phonetic transcription (e.g. "바일라르", "백", "니 하오")
- category: ONE of [${CATEGORIES.join(', ')}]
- example: A short natural ${LANG_NAMES[lang]} example sentence using this word (max 7 words)
- example_ko: Korean translation of example

Return ONLY valid JSON array, same order as input:
[{"word": "...", "ko": "...", "ipa": "...", "pron_ko": "...", "category": "...", "example": "...", "example_ko": "..."}]

Words: ${JSON.stringify(words)}`;

async function enrichBatch(lang, words) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: PROMPT(lang, words) }] }],
      generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0,200)}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}

async function main() {
  const lang = process.argv[2] || 'es';
  const batchSize = parseInt(process.argv[3] ?? '25', 10);
  const sleepMs = parseInt(process.env.SLEEP_MS ?? '4500', 10);

  const raw = JSON.parse(readFileSync(join(ROOT, 'data/vocab/vocab-raw.json'), 'utf8'));
  const list = raw[lang];
  if (!list) { console.error(`No data for ${lang}`); process.exit(1); }

  console.log(`📚 ${lang.toUpperCase()}: ${list.length} words → ${Math.ceil(list.length/batchSize)} batches (${batchSize}/batch, ${sleepMs}ms간격)`);

  // 기존 진행 상황 로드
  const outPath = join(ROOT, `data/vocab/vocab-${lang}-enriched.json`);
  let enriched = existsSync(outPath) ? JSON.parse(readFileSync(outPath,'utf8')) : [];
  const doneWords = new Set(enriched.map(e => e.word));
  console.log(`  Already done: ${enriched.length}`);

  for (let i = 0; i < list.length; i += batchSize) {
    const batch = list.slice(i, i + batchSize).filter(w => !doneWords.has(w.word));
    if (batch.length === 0) continue;

    const words = batch.map(w => w.word);
    process.stdout.write(`  [${i+1}~${i+batch.length}] `);
    try {
      const result = await enrichBatch(lang, words);
      // 원본 메타 (level, rank) 보존하면서 병합
      for (const r of result) {
        const orig = batch.find(b => b.word === r.word);
        if (orig) enriched.push({ ...orig, ...r });
      }
      writeFileSync(outPath, JSON.stringify(enriched, null, 2));
      console.log(`✅ ${result.length}`);
    } catch (e) {
      console.log(`❌ ${e.message.slice(0,100)}`);
    }
    await new Promise(r => setTimeout(r, sleepMs));
  }
  console.log(`\n📦 ${enriched.length} enriched → ${outPath}`);
}

main().catch(e => { console.error('💥', e); process.exit(1); });
