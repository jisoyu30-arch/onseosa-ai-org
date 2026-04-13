export interface PronunciationVariant {
  locale: string;     // TTS locale code
  label: string;      // 표시 이름
  flag: string;       // 국기 이모지
  text: string;       // TTS로 읽을 텍스트 (해당 언어의 알파벳 이름)
}

export interface AlphabetEntry {
  letter: string;
  name: string;
  nameKo: string;
  sound: string;
  argentinaNote?: string;
  example: string;
  exampleKo: string;
  variants: PronunciationVariant[];
}

// 6개 발음 변형 생성 헬퍼
function makeVariants(letter: string, esStd?: string, esAr?: string, enUS?: string, enGB?: string, zhCN?: string, zhHK?: string): PronunciationVariant[] {
  const l = letter.toLowerCase();
  return [
    { locale: 'es-ES', label: '스페인 표준', flag: '🇪🇸', text: esStd || l },
    { locale: 'es-AR', label: '아르헨티나', flag: '🇦🇷', text: esAr || esStd || l },
    { locale: 'en-US', label: '미국 영어', flag: '🇺🇸', text: enUS || l },
    { locale: 'en-GB', label: '영국 영어', flag: '🇬🇧', text: enGB || enUS || l },
    { locale: 'zh-CN', label: '중국어 표준', flag: '🇨🇳', text: zhCN || l },
    { locale: 'yue-HK', label: '광동어', flag: '🇭🇰', text: zhHK || zhCN || l },
  ];
}

export const spanishAlphabet: AlphabetEntry[] = [
  { letter: 'A', name: 'a', nameKo: '아', sound: '한국어 "아"와 같음', example: 'abrazo', exampleKo: '포옹/아브라소',
    variants: makeVariants('A', 'a', 'a', 'ay', 'ay', '啊', '啊') },
  { letter: 'B', name: 'be', nameKo: '베', sound: '한국어 "ㅂ"과 같음', example: 'bailar', exampleKo: '춤추다',
    variants: makeVariants('B', 'be', 'be', 'bee', 'bee', '比', '比') },
  { letter: 'C', name: 'ce', nameKo: '세', sound: 'a/o/u 앞: "ㅋ", e/i 앞: "ㅅ"', example: 'caminar', exampleKo: '걷다',
    variants: makeVariants('C', 'ce', 'ce', 'see', 'see', '西', '西') },
  { letter: 'D', name: 'de', nameKo: '데', sound: '한국어 "ㄷ"과 비슷', example: 'derecho', exampleKo: '똑바로',
    variants: makeVariants('D', 'de', 'de', 'dee', 'dee', '迪', '迪') },
  { letter: 'E', name: 'e', nameKo: '에', sound: '한국어 "에"와 같음', example: 'eje', exampleKo: '축',
    variants: makeVariants('E', 'e', 'e', 'ee', 'ee', '额', '额') },
  { letter: 'F', name: 'efe', nameKo: '에페', sound: '한국어 "ㅍ"과 비슷', example: 'fuerza', exampleKo: '힘',
    variants: makeVariants('F', 'efe', 'efe', 'ef', 'ef', '弗', '弗') },
  { letter: 'G', name: 'ge', nameKo: '헤', sound: 'a/o/u 앞: "ㄱ", e/i 앞: "ㅎ"', example: 'giro', exampleKo: '회전',
    variants: makeVariants('G', 'ge', 'ge', 'jee', 'jee', '吉', '吉') },
  { letter: 'H', name: 'hache', nameKo: '아체', sound: '묵음! 발음하지 않음', example: 'hombro', exampleKo: '어깨',
    variants: makeVariants('H', 'hache', 'hache', 'aitch', 'haitch', '哈', '哈') },
  { letter: 'I', name: 'i', nameKo: '이', sound: '한국어 "이"와 같음', example: 'izquierda', exampleKo: '왼쪽',
    variants: makeVariants('I', 'i', 'i', 'eye', 'eye', '伊', '伊') },
  { letter: 'J', name: 'jota', nameKo: '호타', sound: '한국어 "ㅎ"과 비슷 (목구멍에서)', example: 'juntos', exampleKo: '함께',
    variants: makeVariants('J', 'jota', 'jota', 'jay', 'jay', '杰', '杰') },
  { letter: 'K', name: 'ka', nameKo: '카', sound: '한국어 "ㅋ"과 같음 (외래어에만 사용)', example: 'kilo', exampleKo: '킬로',
    variants: makeVariants('K', 'ka', 'ka', 'kay', 'kay', '卡', '卡') },
  { letter: 'L', name: 'ele', nameKo: '엘레', sound: '한국어 "ㄹ"과 비슷', example: 'líder', exampleKo: '리더',
    variants: makeVariants('L', 'ele', 'ele', 'el', 'el', '了', '了') },
  { letter: 'LL', name: 'elle', nameKo: '에예', sound: '"ㅈ" 또는 "ㅅ" 소리', argentinaNote: '아르헨티나: "sh(쉬)" 소리! calle → "카셰"', example: 'calle', exampleKo: '거리',
    variants: [
      { locale: 'es-ES', label: '스페인 표준', flag: '🇪🇸', text: 'calle' },
      { locale: 'es-AR', label: '아르헨티나', flag: '🇦🇷', text: 'calle' },
      { locale: 'en-US', label: '미국 영어', flag: '🇺🇸', text: 'street' },
      { locale: 'en-GB', label: '영국 영어', flag: '🇬🇧', text: 'street' },
      { locale: 'zh-CN', label: '중국어 표준', flag: '🇨🇳', text: '街道' },
      { locale: 'yue-HK', label: '광동어', flag: '🇭🇰', text: '街' },
    ] },
  { letter: 'M', name: 'eme', nameKo: '에메', sound: '한국어 "ㅁ"과 같음', example: 'mirada', exampleKo: '시선',
    variants: makeVariants('M', 'eme', 'eme', 'em', 'em', '慕', '慕') },
  { letter: 'N', name: 'ene', nameKo: '에네', sound: '한국어 "ㄴ"과 같음', example: 'noche', exampleKo: '밤',
    variants: makeVariants('N', 'ene', 'ene', 'en', 'en', '恩', '恩') },
  { letter: 'Ñ', name: 'eñe', nameKo: '에녜', sound: '"ㄴ+ㅣ" = "니" 느낌', example: 'año', exampleKo: '해/년',
    variants: [
      { locale: 'es-ES', label: '스페인 표준', flag: '🇪🇸', text: 'eñe' },
      { locale: 'es-AR', label: '아르헨티나', flag: '🇦🇷', text: 'eñe' },
      { locale: 'en-US', label: '미국 영어', flag: '🇺🇸', text: 'enye' },
      { locale: 'en-GB', label: '영국 영어', flag: '🇬🇧', text: 'enye' },
      { locale: 'zh-CN', label: '중국어 표준', flag: '🇨🇳', text: '年' },
      { locale: 'yue-HK', label: '광동어', flag: '🇭🇰', text: '年' },
    ] },
  { letter: 'O', name: 'o', nameKo: '오', sound: '한국어 "오"와 같음', example: 'ocho', exampleKo: '8/오초',
    variants: makeVariants('O', 'o', 'o', 'oh', 'oh', '哦', '哦') },
  { letter: 'P', name: 'pe', nameKo: '페', sound: '한국어 "ㅂ"과 비슷 (약한 ㅍ)', example: 'paso', exampleKo: '걸음',
    variants: makeVariants('P', 'pe', 'pe', 'pee', 'pee', '劈', '劈') },
  { letter: 'Q', name: 'cu', nameKo: '쿠', sound: '"ㅋ" 소리. que → "께"', example: 'quedate', exampleKo: '머물러',
    variants: makeVariants('Q', 'cu', 'cu', 'cue', 'cue', '酷', '酷') },
  { letter: 'R', name: 'erre', nameKo: '에레', sound: '혀를 떨어서 "르르"', example: 'relajá', exampleKo: '긴장 풀어',
    variants: makeVariants('R', 'erre', 'erre', 'ar', 'ar', '日', '日') },
  { letter: 'RR', name: 'doble erre', nameKo: '도블레 에레', sound: '혀를 길게 떨어서 "르르르"', example: 'correr', exampleKo: '뛰다',
    variants: [
      { locale: 'es-ES', label: '스페인 표준', flag: '🇪🇸', text: 'correr' },
      { locale: 'es-AR', label: '아르헨티나', flag: '🇦🇷', text: 'correr' },
      { locale: 'en-US', label: '미국 영어', flag: '🇺🇸', text: 'to run' },
      { locale: 'en-GB', label: '영국 영어', flag: '🇬🇧', text: 'to run' },
      { locale: 'zh-CN', label: '중국어 표준', flag: '🇨🇳', text: '跑' },
      { locale: 'yue-HK', label: '광동어', flag: '🇭🇰', text: '跑' },
    ] },
  { letter: 'S', name: 'ese', nameKo: '에세', sound: '한국어 "ㅅ"과 같음', example: 'salida', exampleKo: '출발/살리다',
    variants: makeVariants('S', 'ese', 'ese', 'es', 'es', '斯', '斯') },
  { letter: 'T', name: 'te', nameKo: '테', sound: '한국어 "ㄷ"과 비슷 (약한 ㅌ)', example: 'tango', exampleKo: '탱고',
    variants: makeVariants('T', 'te', 'te', 'tee', 'tee', '特', '特') },
  { letter: 'U', name: 'u', nameKo: '우', sound: '한국어 "우"와 같음', example: 'uno', exampleKo: '하나',
    variants: makeVariants('U', 'u', 'u', 'you', 'you', '乌', '乌') },
  { letter: 'V', name: 've', nameKo: '베', sound: 'B와 거의 같은 소리!', argentinaNote: 'B와 V는 거의 구분 없음', example: 'vals', exampleKo: '왈츠',
    variants: makeVariants('V', 've', 've', 'vee', 'vee', '维', '维') },
  { letter: 'W', name: 'doble ve', nameKo: '도블레 베', sound: '"ㅂ" 또는 "우" (외래어)', example: 'wifi', exampleKo: '와이파이',
    variants: makeVariants('W', 'doble ve', 'doble ve', 'double you', 'double you', '达不溜', '达不溜') },
  { letter: 'X', name: 'equis', nameKo: '에키스', sound: '"ㄱㅅ" 소리', example: 'explicar', exampleKo: '설명하다',
    variants: makeVariants('X', 'equis', 'equis', 'ex', 'ex', '艾克斯', '艾克斯') },
  { letter: 'Y', name: 'ye', nameKo: '예', sound: '"ㅈ" 또는 "ㅅ" 소리', argentinaNote: '아르헨티나: "sh(쉬)" 소리! yo → "쇼"', example: 'yo', exampleKo: '나',
    variants: [
      { locale: 'es-ES', label: '스페인 표준', flag: '🇪🇸', text: 'yo' },
      { locale: 'es-AR', label: '아르헨티나', flag: '🇦🇷', text: 'yo' },
      { locale: 'en-US', label: '미국 영어', flag: '🇺🇸', text: 'why' },
      { locale: 'en-GB', label: '영국 영어', flag: '🇬🇧', text: 'why' },
      { locale: 'zh-CN', label: '중국어 표준', flag: '🇨🇳', text: '我' },
      { locale: 'yue-HK', label: '광동어', flag: '🇭🇰', text: '我' },
    ] },
  { letter: 'Z', name: 'zeta', nameKo: '세타', sound: '"ㅅ" 소리 (중남미)', argentinaNote: '스페인: "th" 소리, 아르헨티나: "ㅅ"', example: 'zapato', exampleKo: '신발',
    variants: makeVariants('Z', 'zeta', 'zeta', 'zee', 'zed', '则', '则') },
];

export const argentinaRules = [
  { rule: 'Voseo', description: 'tú 대신 vos를 씀. 동사 변형도 달라짐.', example: 'Tú caminas → Vos caminás' },
  { rule: 'LL/Y = "sh"', description: 'LL과 Y를 "쉬" 소리로 발음 (yeísmo rehilado)', example: 'calle → "카셰", yo → "쇼"' },
  { rule: 'S 약화', description: '단어 끝이나 음절 끝의 S를 약하게 발음하거나 생략', example: 'vamos → "바모(h)"' },
  { rule: '명령형 악센트', description: 'vos 명령형은 마지막 음절에 악센트', example: 'camina → caminá, mira → mirá' },
];
