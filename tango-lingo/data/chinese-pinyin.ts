// 중국어 한어병음 — 성모 + 단운모 + 성조 핵심
import type { PronunciationVariant, AlphabetEntry } from './alphabet';

function makeVariants(zh: string): PronunciationVariant[] {
  return [
    { locale: 'zh-CN', label: '중국 표준', flag: '🇨🇳', text: zh },
  ];
}

// 성모 (Initials) 23개 — 자음 역할
const initials: AlphabetEntry[] = [
  { letter: 'b', name: 'b(o)', nameKo: '뽀', sound: '한국어 ㅂ과 비슷, 무기음', example: '爸爸 (bàba)', exampleKo: '아빠',
    variants: makeVariants('波') },
  { letter: 'p', name: 'p(o)', nameKo: '포', sound: '한국어 ㅍ, 강한 기식음', example: '怕 (pà)', exampleKo: '두려워하다',
    variants: makeVariants('坡') },
  { letter: 'm', name: 'm(o)', nameKo: '모', sound: '한국어 ㅁ', example: '妈妈 (māma)', exampleKo: '엄마',
    variants: makeVariants('摸') },
  { letter: 'f', name: 'f(o)', nameKo: '포(f)', sound: '윗니 아랫입술 (영어 f)', example: '飞 (fēi)', exampleKo: '날다',
    variants: makeVariants('佛') },
  { letter: 'd', name: 'd(e)', nameKo: '뜨', sound: '한국어 ㄷ과 비슷, 무기음', example: '大 (dà)', exampleKo: '크다',
    variants: makeVariants('得') },
  { letter: 't', name: 't(e)', nameKo: '트', sound: '한국어 ㅌ, 강한 기식음', example: '探戈 (tàngē)', exampleKo: '탱고',
    variants: makeVariants('特') },
  { letter: 'n', name: 'n(e)', nameKo: '느', sound: '한국어 ㄴ', example: '你 (nǐ)', exampleKo: '너',
    variants: makeVariants('呢') },
  { letter: 'l', name: 'l(e)', nameKo: '르', sound: '영어 L', example: '来 (lái)', exampleKo: '오다',
    variants: makeVariants('了') },
  { letter: 'g', name: 'g(e)', nameKo: '끄', sound: '한국어 ㄱ과 비슷, 무기음', example: '高 (gāo)', exampleKo: '높다',
    variants: makeVariants('哥') },
  { letter: 'k', name: 'k(e)', nameKo: '크', sound: '한국어 ㅋ, 강한 기식음', example: '看 (kàn)', exampleKo: '보다',
    variants: makeVariants('科') },
  { letter: 'h', name: 'h(e)', nameKo: '흐', sound: '목구멍 깊이서 ㅎ', example: '好 (hǎo)', exampleKo: '좋다',
    variants: makeVariants('喝') },
  { letter: 'j', name: 'j(i)', nameKo: '지', sound: '한국어 ㅈ과 비슷', example: '叫 (jiào)', exampleKo: '부르다',
    variants: makeVariants('机') },
  { letter: 'q', name: 'q(i)', nameKo: '치', sound: 'ㅈ에 강한 기식', example: '请 (qǐng)', exampleKo: '청하다',
    variants: makeVariants('七') },
  { letter: 'x', name: 'x(i)', nameKo: '시', sound: '한국어 ㅅ과 비슷, 살짝 부드럽게', example: '谢谢 (xièxie)', exampleKo: '고맙다',
    variants: makeVariants('西') },
  { letter: 'zh', name: 'zh(i)', nameKo: '쯔', sound: '혀 말아서 ㅈ (권설음)', example: '中国 (zhōngguó)', exampleKo: '중국',
    variants: makeVariants('知') },
  { letter: 'ch', name: 'ch(i)', nameKo: '츠', sound: '권설 ㅊ (강한 기식)', example: '吃 (chī)', exampleKo: '먹다',
    variants: makeVariants('吃') },
  { letter: 'sh', name: 'sh(i)', nameKo: '스', sound: '권설 ㅅ', example: '是 (shì)', exampleKo: '~이다',
    variants: makeVariants('师') },
  { letter: 'r', name: 'r(i)', nameKo: '르', sound: '권설 r (영어 r과 다름)', example: '人 (rén)', exampleKo: '사람',
    variants: makeVariants('日') },
  { letter: 'z', name: 'z(i)', nameKo: '쯔', sound: '평설 ㅈ (혀 말지 않음)', example: '走 (zǒu)', exampleKo: '걷다',
    variants: makeVariants('字') },
  { letter: 'c', name: 'c(i)', nameKo: '츠', sound: '평설 ㅊ (강한 기식)', example: '次 (cì)', exampleKo: '번',
    variants: makeVariants('次') },
  { letter: 's', name: 's(i)', nameKo: '쓰', sound: '평설 ㅅ', example: '四 (sì)', exampleKo: '4',
    variants: makeVariants('思') },
  { letter: 'y', name: 'y(i)', nameKo: '이', sound: '한국어 ㅇ+모음', example: '一 (yī)', exampleKo: '1',
    variants: makeVariants('衣') },
  { letter: 'w', name: 'w(u)', nameKo: '우', sound: '한국어 우+모음', example: '我 (wǒ)', exampleKo: '나',
    variants: makeVariants('屋') },
];

// 단운모 (Simple Finals) 6개 — 모음 역할
const simpleFinals: AlphabetEntry[] = [
  { letter: 'a', name: 'a', nameKo: '아', sound: '한국어 "아"', example: '啊 (ā)', exampleKo: '아!',
    variants: makeVariants('阿') },
  { letter: 'o', name: 'o', nameKo: '오어', sound: '"오"와 "어"의 중간', example: '我 (wǒ)', exampleKo: '나',
    variants: makeVariants('哦') },
  { letter: 'e', name: 'e', nameKo: '으어', sound: '"으"+"어" (한국에 없는 음)', example: '饿 (è)', exampleKo: '배고프다',
    variants: makeVariants('鹅') },
  { letter: 'i', name: 'i', nameKo: '이', sound: '한국어 "이". zh/ch/sh/z/c/s 뒤엔 "으"', example: '一 (yī)', exampleKo: '1',
    variants: makeVariants('衣') },
  { letter: 'u', name: 'u', nameKo: '우', sound: '한국어 "우"', example: '不 (bù)', exampleKo: '아니',
    variants: makeVariants('乌') },
  { letter: 'ü', name: 'ü', nameKo: '위(입술 둥글게)', sound: '"이"입+"우"발음 (한국에 없음)', example: '女 (nǚ)', exampleKo: '여자',
    variants: makeVariants('鱼') },
];

// 성조 4개 + 경성
const tones: AlphabetEntry[] = [
  { letter: '¯', name: '1성', nameKo: '평탄성 (높고 길게)', sound: 'mā 妈 — 솔(높음) 유지', example: '妈 (mā)', exampleKo: '엄마',
    variants: makeVariants('一声 妈') },
  { letter: '´', name: '2성', nameKo: '상승성 (올림)', sound: 'má 麻 — 미→솔 올림 (의문 톤)', example: '麻 (má)', exampleKo: '마',
    variants: makeVariants('二声 麻') },
  { letter: 'ˇ', name: '3성', nameKo: '굴곡성 (내렸다 올림)', sound: 'mǎ 马 — 도→낮음→솔', example: '马 (mǎ)', exampleKo: '말',
    variants: makeVariants('三声 马') },
  { letter: '`', name: '4성', nameKo: '하강성 (강하게 떨어뜨림)', sound: 'mà 骂 — 솔→도 (단호)', example: '骂 (mà)', exampleKo: '꾸짖다',
    variants: makeVariants('四声 骂') },
  { letter: '·', name: '경성', nameKo: '가볍게 (짧고 약하게)', sound: '음의 길이·강세 약함', example: '妈妈 (māma)', exampleKo: '엄마(둘째 글자)',
    variants: makeVariants('轻声 吗') },
];

export const chinesePinyin: AlphabetEntry[] = [...initials, ...simpleFinals, ...tones];

export const chineseNotes = [
  { rule: '성조가 의미를 결정', description: '같은 음 mā/má/mǎ/mà는 4가지 다른 한자', example: '妈(엄마) 麻(마) 马(말) 骂(꾸짖다)' },
  { rule: '권설음 vs 평설음', description: 'zh/ch/sh/r은 혀 말기 / z/c/s는 평평하게', example: 'zhī (知, 알다) vs zī (字, 글자)' },
  { rule: '한국에 없는 ü', description: '"이"입 모양으로 "우" 소리 — 입술 동그랗게', example: '女 nǚ, 绿 lǜ' },
  { rule: '의문은 吗', description: '평서문 끝에 "吗(ma)" 붙이면 예/아니오 질문', example: '你好 → 你好吗?' },
];
