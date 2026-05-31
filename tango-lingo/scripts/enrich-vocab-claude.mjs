// Claude Haiku로 vocab 보강 — Gemini quota 소진 시 fallback
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}
loadEnv(join(ROOT, '.env'));
loadEnv('C:\\Users\\njell\\onseosa-agent\\.env');  // 메인 .env (절대 경로)

const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) { console.error('❌ ANTHROPIC_API_KEY 없음'); process.exit(1); }

const MODEL = 'claude-haiku-4-5';  // 가장 저렴·빠름
const ENDPOINT = 'https://api.anthropic.com/v1/messages';

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
- ipa: simplified pronunciation (syllable-by-syllable for ${LANG_NAMES[lang]})
- pron_ko: Korean phonetic transcription
- category: ONE of [${CATEGORIES.join(', ')}]
- example: A short natural ${LANG_NAMES[lang]} example sentence (max 7 words)
- example_ko: Korean translation of example

Return ONLY a JSON array (no markdown, no explanation), same order:
[{"word":"...","ko":"...","ipa":"...","pron_ko":"...","category":"...","example":"...","example_ko":"..."}]

Words: ${JSON.stringify(words)}`;

async function enrichBatch(lang, words) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: PROMPT(lang, words) }],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0,200)}`);
  const data = await res.json();
  const text = data?.content?.[0]?.text ?? '';
  // 마크다운 코드블록 제거
  const cleaned = text.replace(/^```json\s*|\s*```$/g, '').trim();
  return JSON.parse(cleaned);
}

async function main() {
  const lang = process.argv[2] || 'es';
  const batchSize = parseInt(process.argv[3] ?? '30', 10);
  const sleepMs = parseInt(process.env.SLEEP_MS ?? '300', 10);  // Claude는 분당 제한 더 관대

  const raw = JSON.parse(readFileSync(join(ROOT, 'data/vocab/vocab-raw.json'), 'utf8'));
  const list = raw[lang];
  if (!list) { console.error(`No data for ${lang}`); process.exit(1); }

  const outPath = join(ROOT, `data/vocab/vocab-${lang}-enriched.json`);
  let enriched = existsSync(outPath) ? JSON.parse(readFileSync(outPath,'utf8')) : [];
  const doneWords = new Set(enriched.map(e => e.word));
  console.log(`📚 ${lang.toUpperCase()}: ${list.length} total · ${enriched.length} done · ${list.length - doneWords.size} remaining`);

  let totalDone = enriched.length;
  for (let i = 0; i < list.length; i += batchSize) {
    const batch = list.slice(i, i + batchSize).filter(w => !doneWords.has(w.word));
    if (batch.length === 0) continue;

    const words = batch.map(w => w.word);
    process.stdout.write(`  [${totalDone+1}~${totalDone+batch.length}/${list.length}] `);
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
  console.log(`\n📦 ${enriched.length}/${list.length} enriched`);
}

main().catch(e => { console.error('💥', e); process.exit(1); });
