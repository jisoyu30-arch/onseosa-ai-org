// Groq API로 vocab 보강 (무료 분당 30회 / 일 14400)
// 사용: node scripts/enrich-vocab-groq.mjs [lang] [batchSize]
//   먼저 .env에 GROQ_API_KEY=gsk_... 추가
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function loadEnv(p) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p,'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}
loadEnv(join(ROOT, '.env'));
loadEnv('C:\\Users\\njell\\onseosa-agent\\.env');

const KEY = process.env.GROQ_API_KEY;
if (!KEY) { console.error('❌ GROQ_API_KEY 없음. .env에 GROQ_API_KEY=gsk_... 추가'); process.exit(1); }

const MODEL = 'llama-3.3-70b-versatile';   // Groq 최강 무료 모델
const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

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

const PROMPT = (lang, words) => `For each word below, return JSON object with fields:
- ko: Korean meaning (concise, 1-3 words)
- ipa: simplified pronunciation (e.g. "bai-LAR" Spanish, "/bæk/" English, "nǐ hǎo" Chinese pinyin)
- pron_ko: Korean phonetic (e.g. "바일라르", "백", "니 하오")
- category: ONE of [${CATEGORIES.join(', ')}]
- example: A SHORT ${LANG_NAMES[lang]} sentence (max 7 words)
- example_ko: Korean translation

Return ONLY a JSON array (no markdown, no explanation):
[{"word":"...","ko":"...","ipa":"...","pron_ko":"...","category":"...","example":"...","example_ko":"..."}]

Words: ${JSON.stringify(words)}`;

async function enrichBatch(lang, words) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: PROMPT(lang, words) }],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0,200)}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? '';
  const parsed = JSON.parse(text);
  // response_format json_object는 wrapped된 형태일 수도 → 배열 찾기
  if (Array.isArray(parsed)) return parsed;
  const arrKey = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
  return arrKey ? parsed[arrKey] : [];
}

async function main() {
  const lang = process.argv[2] || 'es';
  const batchSize = parseInt(process.argv[3] ?? '30', 10);
  const sleepMs = parseInt(process.env.SLEEP_MS ?? '2500', 10);  // 분당 30 안전

  const raw = JSON.parse(readFileSync(join(ROOT, 'data/vocab/vocab-raw.json'), 'utf8'))[lang];
  const outPath = join(ROOT, `data/vocab/vocab-${lang}-enriched.json`);
  let enriched = existsSync(outPath) ? JSON.parse(readFileSync(outPath,'utf8')) : [];
  const doneWords = new Set(enriched.map(e => e.word));
  console.log(`📚 [${lang}] ${raw.length} total · ${enriched.length} done · ${raw.length - doneWords.size} remaining`);

  let totalDone = enriched.length;
  for (let i = 0; i < raw.length; i += batchSize) {
    const batch = raw.slice(i, i + batchSize).filter(w => !doneWords.has(w.word));
    if (batch.length === 0) continue;
    const words = batch.map(w => w.word);
    process.stdout.write(`  [${totalDone+1}~${totalDone+batch.length}/${raw.length}] `);
    try {
      const result = await enrichBatch(lang, words);
      for (const r of result) {
        const orig = batch.find(b => b.word === r.word);
        if (orig) enriched.push({ ...orig, ...r });
      }
      totalDone = enriched.length;
      writeFileSync(outPath, JSON.stringify(enriched, null, 2));
      console.log(`✅ +${result.length} = ${totalDone}`);
    } catch (e) {
      console.log(`❌ ${e.message.slice(0,80)}`);
    }
    await new Promise(r => setTimeout(r, sleepMs));
  }
  console.log(`\n📦 ${enriched.length}/${raw.length} enriched`);
}

main().catch(e => { console.error('💥', e); process.exit(1); });
