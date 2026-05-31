// vocab-raw + enriched + 기존 사전 통합 → 최종 vocab-{lang}-final.json
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 카테고리 자동 추정 (CEFR + 빈도 + 단어 패턴)
function guessCategory(word, lang, pos, level) {
  const w = word.toLowerCase();
  // 탱고 용어
  if (/tang|bail|mil|abraz|cabec|orquest|pugli|d'?arien/.test(w)) return 'tango_term';
  // 가족
  if (['madre','padre','hermano','hermana','hijo','hija','mom','dad','brother','sister','father','mother','妈','爸','哥','姐','弟','妹'].some(k => w.includes(k))) return 'family';
  // 음식
  if (['comer','beber','food','eat','drink','agua','水','吃','喝'].some(k => w.includes(k))) return 'food';
  // 일
  if (['trabaj','work','job','工作'].some(k => w.includes(k))) return 'work';
  // 감정
  if (['feliz','triste','happy','sad','love','开心','伤心'].some(k => w.includes(k))) return 'happy';
  // 시간
  if (['hoy','ayer','mañana','today','yesterday','tomorrow','今天','明天','昨天','time'].some(k => w.includes(k))) return 'time';
  // 추상
  if (['pensar','think','想','idea'].some(k => w.includes(k))) return 'opinion';
  // pos 기반 fallback
  if (pos === 'VB' || pos === 'verb' || /ar$|er$|ir$/.test(w)) return 'routine';
  // CEFR level 기반
  if (level === 'A1' || level === 'A1_est') return 'self_intro';
  return 'self_intro';   // 기본값
}

// 기존 pos-tagger 사전에서 한국어 뜻 추출 (ES/EN + ZH 모두)
function loadPosDict() {
  const result = {};
  for (const file of ['utils/pos-tagger.ts', 'utils/pos-dict-extra.ts']) {
    const path = join(ROOT, file);
    if (!existsSync(path)) continue;
    const txt = readFileSync(path, 'utf8');
    // ES/EN 형태: 'word': { pos: '...', ko: '...' }
    let re = /'([^']+)'\s*:\s*\{[^}]*?ko:\s*'([^']+)'/g;
    let m;
    while ((m = re.exec(txt))) {
      result[m[1].toLowerCase()] = m[2];
    }
    // ZH 형태: { w: '我', pos: 'subject', ko: '나' }
    re = /\{\s*w:\s*'([^']+)'[^}]*?ko:\s*'([^']+)'/g;
    while ((m = re.exec(txt))) {
      result[m[1].toLowerCase()] = m[2];
      result[m[1]] = m[2]; // 한자는 lowercase 의미 없음
    }
  }
  return result;
}

function main() {
  const lang = process.argv[2] || 'es';
  const raw = JSON.parse(readFileSync(join(ROOT, 'data/vocab/vocab-raw.json'), 'utf8'))[lang];
  const enrichedPath = join(ROOT, `data/vocab/vocab-${lang}-enriched.json`);
  const enriched = existsSync(enrichedPath) ? JSON.parse(readFileSync(enrichedPath,'utf8')) : [];
  const enrichedMap = new Map(enriched.map(e => [e.word, e]));
  const posDict = loadPosDict();

  console.log(`[${lang}] raw: ${raw.length}, enriched: ${enriched.length}, pos-dict: ${Object.keys(posDict).length}`);

  const merged = raw.map((r, idx) => {
    const e = enrichedMap.get(r.word);
    const ko = e?.ko || posDict[r.word.toLowerCase()] || null;
    return {
      id: r.id,
      word: r.word,
      pos: r.pos,
      level: r.level,
      rank: r.rank,
      ko,
      ipa: e?.ipa ?? r.pron_raw ?? null,
      pron_ko: e?.pron_ko ?? null,
      category: e?.category ?? guessCategory(r.word, lang, r.pos, r.level),
      example: e?.example ?? null,
      example_ko: e?.example_ko ?? null,
      enriched: !!e,
    };
  });

  const stats = {
    total: merged.length,
    withKo: merged.filter(m => m.ko).length,
    withExample: merged.filter(m => m.example).length,
    enriched: merged.filter(m => m.enriched).length,
  };
  console.log(`  ko: ${stats.withKo}/${stats.total} (${Math.round(stats.withKo/stats.total*100)}%)`);
  console.log(`  example: ${stats.withExample}/${stats.total}`);
  console.log(`  enriched: ${stats.enriched}/${stats.total}`);

  writeFileSync(join(ROOT, `data/vocab/vocab-${lang}-final.json`), JSON.stringify(merged, null, 2));
  console.log(`  → vocab-${lang}-final.json saved`);
}

main();
