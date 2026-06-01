// 기능어/품사 기반 카테고리 재할당 + CMU ARPAbet → 간단 IPA
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// POS 코드 기반 카테고리
const POS_CATEGORY = {
  DT: 'time',        // determiner (the, a)
  IN: 'time',        // preposition (of, to, in)
  CC: 'time',        // conjunction (and, or)
  TO: 'time',        // 'to'
  WDT: 'opinion',    // wh-determiner
  PRP: 'self_intro', // personal pronoun (I, you)
  art: 'time',       // article (Spanish)
  prep: 'time',      // preposition (Spanish)
  pron: 'self_intro',// pronoun (Spanish)
  conj: 'time',      // conjunction
};

// 자주 쓰는 기능어 직접 매핑
const FUNCTION_WORDS = {
  // 영어 관사·전치사
  'the':'time','a':'time','an':'time','of':'time','to':'time','in':'time','on':'time','at':'time',
  'and':'time','or':'time','but':'time','for':'time','with':'time','by':'time',
  'i':'self_intro','you':'self_intro','he':'self_intro','she':'self_intro','it':'self_intro',
  'we':'self_intro','they':'self_intro','me':'self_intro','my':'self_intro','your':'self_intro',
  'is':'time','am':'time','are':'time','was':'time','were':'time','be':'time','been':'time',
  // 스페인어
  'de':'time','la':'time','el':'time','los':'time','las':'time','un':'time','una':'time',
  'y':'time','o':'time','que':'time','si':'time','no':'time','en':'time','a':'time',
  'yo':'self_intro','tú':'self_intro','vos':'self_intro','él':'self_intro','ella':'self_intro',
  'es':'time','son':'time','soy':'time','eres':'time','está':'time',
  // 중국어 기능어
  '的':'time','了':'time','是':'time','在':'time','和':'time','与':'time',
  '我':'self_intro','你':'self_intro','他':'self_intro','她':'self_intro','它':'self_intro',
};

// CMU ARPAbet → IPA 간단 변환
const ARPA_TO_IPA = {
  'AA':'ɑ','AE':'æ','AH':'ʌ','AO':'ɔ','AW':'aʊ','AY':'aɪ','EH':'ɛ','ER':'ɜr',
  'EY':'eɪ','IH':'ɪ','IY':'iː','OW':'oʊ','OY':'ɔɪ','UH':'ʊ','UW':'uː',
  'B':'b','CH':'tʃ','D':'d','DH':'ð','F':'f','G':'g','HH':'h','JH':'dʒ',
  'K':'k','L':'l','M':'m','N':'n','NG':'ŋ','P':'p','R':'r','S':'s','SH':'ʃ',
  'T':'t','TH':'θ','V':'v','W':'w','Y':'j','Z':'z','ZH':'ʒ',
};

// CMU ARPAbet → 한글 발음
const ARPA_TO_HANGUL = {
  'AA':'아','AE':'애','AH':'어','AO':'오','AW':'아우','AY':'아이','EH':'에','ER':'어ㄹ',
  'EY':'에이','IH':'이','IY':'이','OW':'오','OY':'오이','UH':'우','UW':'우',
  'B':'ㅂ','CH':'ㅊ','D':'ㄷ','DH':'ㄷ(혀)','F':'ㅍ(f)','G':'ㄱ','HH':'ㅎ','JH':'ㅈ',
  'K':'ㅋ','L':'ㄹ','M':'ㅁ','N':'ㄴ','NG':'ㅇ','P':'ㅍ','R':'ㄹ','S':'ㅅ','SH':'ㅅ(쉬)',
  'T':'ㅌ','TH':'ㅆ(혀)','V':'ㅂ(v)','W':'우','Y':'이','Z':'ㅈ','ZH':'쥐',
};

function convertCmu(cmu) {
  if (!cmu) return { ipa: null, hangul: null };
  const phones = cmu.replace(/\d/g, '').split(/\s+/).filter(Boolean);
  const ipa = phones.map((p) => ARPA_TO_IPA[p] || p).join('');
  const hangul = phones.map((p) => ARPA_TO_HANGUL[p] || '').join('');
  return { ipa: `/${ipa}/`, hangul };
}

function processLang(lang) {
  const path = join(ROOT, `data/vocab/vocab-${lang}-final.json`);
  const data = JSON.parse(readFileSync(path, 'utf8'));
  let categoryFixed = 0;
  let pronFixed = 0;

  for (const item of data) {
    const w = item.word.toLowerCase();

    // 1. 기능어/POS 기반 카테고리 재할당 (enriched 안 된 경우만)
    if (!item.enriched) {
      if (FUNCTION_WORDS[w]) {
        item.category = FUNCTION_WORDS[w];
        categoryFixed++;
      } else if (item.pos && POS_CATEGORY[item.pos]) {
        item.category = POS_CATEGORY[item.pos];
        categoryFixed++;
      }
    }

    // 2. CMU ARPAbet 변환 (영어, ipa가 ARPA 형식인 경우)
    if (lang === 'en' && item.ipa && /^[A-Z]+\s/.test(item.ipa)) {
      const { ipa, hangul } = convertCmu(item.ipa);
      if (ipa) item.ipa = ipa;
      if (hangul && !item.pron_ko) item.pron_ko = hangul;
      pronFixed++;
    }
  }

  writeFileSync(path, JSON.stringify(data, null, 2));
  console.log(`[${lang}] category 보정: ${categoryFixed}, 발음 변환: ${pronFixed}`);
}

['es', 'en', 'zh'].forEach(processLang);
