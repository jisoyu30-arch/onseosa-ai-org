export interface LangGrammar {
  rule: string;
  usage: string;     // 어법 (실전 사용법)
  example: string;
}

export interface GrammarComparison {
  id: string;
  topic: string;
  topicKo: string;
  tip: string;       // 💡 한 줄 핵심 정리
  languages: {
    ko: LangGrammar;
    es: LangGrammar;
    en: LangGrammar;
    zh: LangGrammar;
  };
}

export const grammarComparisons: GrammarComparison[] = [
  {
    id: 'gc_01', topic: 'Word Order', topicKo: '어순',
    tip: '한국어만 동사가 맨 뒤! 나머지 3개는 동사가 먼저.',
    languages: {
      ko: { rule: 'SOV: 주어+목적어+동사', usage: '주어는 자주 생략. "나 밥 먹어" → "밥 먹어"', example: '(나는) 어깨를 내려' },
      es: { rule: 'SVO: 주어+동사+목적어', usage: '주어 자주 생략. 동사 어미로 누군지 앎', example: '(Yo) bajo los hombros' },
      en: { rule: 'SVO: 주어+동사+목적어', usage: '주어 절대 생략 불가!', example: 'I lower my shoulders' },
      zh: { rule: 'SVO: 주어+동사+목적어', usage: '주어 자주 생략. 맥락으로 판단', example: '(我)放下肩膀' },
    },
  },
  {
    id: 'gc_02', topic: 'Subject Omission', topicKo: '주어 생략',
    tip: '영어만 주어를 반드시 써야 해! 나머지 3개는 다 생략 OK.',
    languages: {
      ko: { rule: '주어 자주 생략', usage: '친한 사이에선 거의 항상 생략', example: '"배고파" (나는 생략)' },
      es: { rule: '주어 자주 생략', usage: '동사 어미가 주어 역할. Yo/Tú 안 써도 됨', example: '"Tengo hambre" (Yo 생략)' },
      en: { rule: '주어 필수!', usage: 'I, You, He 빼면 문법 오류', example: '"I am hungry" (I 필수)' },
      zh: { rule: '주어 자주 생략', usage: '맥락이 명확하면 생략', example: '"饿了" (我 생략)' },
    },
  },
  {
    id: 'gc_03', topic: 'Articles', topicKo: '관사 (the, a)',
    tip: '한국어와 중국어는 관사가 없어! 스페인어는 성별까지 구분.',
    languages: {
      ko: { rule: '관사 없음', usage: '은/는/이/가는 관사가 아니라 조사', example: '어깨를 내려 (관사 없음)' },
      es: { rule: 'el/la (남/여) + un/una', usage: '명사마다 성별이 있어서 외워야 함', example: 'El hombro, La mano' },
      en: { rule: 'the + a/an', usage: '성별 구분 없음. 셀 수 있냐만 중요', example: 'The shoulder, A hand' },
      zh: { rule: '관사 없음', usage: '"这/那"(이/저)로 특정할 때만 사용', example: '肩膀 (관사 없음)' },
    },
  },
  {
    id: 'gc_04', topic: 'Gender', topicKo: '명사 성별',
    tip: '스페인어만 모든 명사에 성별이 있어! 나머지는 없음.',
    languages: {
      ko: { rule: '성별 구분 없음', usage: '그/그녀 정도만 구분', example: '손 (성별 없음)' },
      es: { rule: '모든 명사에 남성/여성', usage: '-o는 보통 남성, -a는 여성. 예외 많음!', example: 'el brazo (남), la mano (여!)' },
      en: { rule: '성별 구분 없음', usage: 'he/she/it 대명사만 구분', example: 'hand (성별 없음)' },
      zh: { rule: '성별 구분 없음', usage: '他/她 글자로만 구분, 발음은 같음(tā)', example: '手 (성별 없음)' },
    },
  },
  {
    id: 'gc_05', topic: 'Negation', topicKo: '부정문',
    tip: '스페인어가 제일 간단! No 하나면 끝.',
    languages: {
      ko: { rule: '안/못 + 동사, 또는 동사 + 지 않다', usage: '"안 해" (의지) vs "못 해" (능력)', example: '밀지 마 → 밀지 않아' },
      es: { rule: 'No + 동사', usage: 'No 하나만 동사 앞에 붙이면 끝!', example: 'No empujes (밀지 마)' },
      en: { rule: "don't/doesn't + 동사원형", usage: '시제에 따라 do/does/did 바뀜', example: "Don't push" },
      zh: { rule: '不/别/没 + 동사', usage: '不=안, 别=하지마, 没=안했음', example: '别推 (밀지 마)' },
    },
  },
  {
    id: 'gc_06', topic: 'Commands', topicKo: '명령형',
    tip: '아르헨티나는 악센트가 뒤로! Camina → Caminá',
    languages: {
      ko: { rule: '동사 + 어/아', usage: '"-세요"를 붙이면 존댓말 명령', example: '걸어 / 걸으세요' },
      es: { rule: '동사 변형 (voseo: 끝에 악센트)', usage: '아르헨티나: caminá, relajá, mirá', example: 'Bajá los hombros (어깨 내려)' },
      en: { rule: '동사 원형 그대로', usage: 'please 붙이면 공손, 안 붙이면 직접적', example: 'Lower your shoulders' },
      zh: { rule: '동사 그대로 (请 붙이면 공손)', usage: '请=please. 친한 사이엔 생략', example: '放下肩膀 / 请放下肩膀' },
    },
  },
  {
    id: 'gc_07', topic: 'Questions', topicKo: '의문문',
    tip: '한국어는 끝에 "?" 느낌, 영어는 어순이 바뀌어!',
    languages: {
      ko: { rule: '동사 + -나요?/-ㅂ니까?', usage: '어순 안 바뀜. 끝만 바꿈', example: '괜찮아? / 괜찮으세요?' },
      es: { rule: '¿...? + 어순 변화 또는 억양만', usage: '¿ 거꾸로 물음표로 시작!', example: '¿Estás cómoda? (편해?)' },
      en: { rule: 'Do/Does/Is + 주어 + 동사', usage: '어순이 뒤집힘!', example: 'Are you comfortable?' },
      zh: { rule: '문장 끝에 吗(ma) 추가', usage: '어순 안 바뀜. 吗만 붙이면 의문문', example: '你舒服吗？(편해?)' },
    },
  },
  {
    id: 'gc_08', topic: 'Possessives', topicKo: '소유격 (내/네)',
    tip: '한국어는 "의"를 붙이고, 스페인어는 성별 맞춰야 해!',
    languages: {
      ko: { rule: '명사 + 의', usage: '"나의" → "내", "너의" → "네" 축약', example: '네 어깨 / 내 손' },
      es: { rule: 'mi/tu/su (성별 일치)', usage: 'mi는 변하지 않지만 nuestro/a는 바뀜', example: 'Tu hombro / Tu mano' },
      en: { rule: 'my/your/his/her', usage: '성별 따라 his/her만 바뀜', example: 'Your shoulder / My hand' },
      zh: { rule: '명사 + 的(de)', usage: '"我的" → "我" 축약 가능', example: '你的肩膀 / 我的手' },
    },
  },
  {
    id: 'gc_09', topic: 'Adjective Position', topicKo: '형용사 위치',
    tip: '스페인어만 형용사가 뒤에! 한국어/영어/중국어는 앞에.',
    languages: {
      ko: { rule: '형용사 + 명사 (앞에)', usage: '"좋은 자세", "편한 포옹"', example: '좋은 아브라소' },
      es: { rule: '명사 + 형용사 (뒤에!)', usage: '일부 형용사는 앞에 올 수도 (buena)', example: 'Un abrazo cómodo (편한 포옹)' },
      en: { rule: '형용사 + 명사 (앞에)', usage: '항상 앞. 예외 없음', example: 'A comfortable embrace' },
      zh: { rule: '형용사 + 的 + 명사 (앞에)', usage: '"的"는 생략 가능할 때도 있음', example: '舒服的拥抱 (편한 포옹)' },
    },
  },
  {
    id: 'gc_10', topic: 'Formality', topicKo: '존댓말',
    tip: '한국어가 가장 복잡! 영어는 존댓말 문법이 아예 없어.',
    languages: {
      ko: { rule: '-요/-ㅂ니다 (6단계 높임법)', usage: '처음 만나면 무조건 존댓말', example: '앉으세요 / 앉아' },
      es: { rule: 'usted(존대) vs vos/tú(반말)', usage: '탱고 수업에서는 보통 vos (반말)!', example: 'Sentate (vos) / Siéntese (usted)' },
      en: { rule: '존댓말 문법 없음!', usage: 'please/could/would로 공손함 표현', example: 'Sit down / Please sit down' },
      zh: { rule: '您(nín) = 존댓말 you', usage: '어른에게만. 젊은 사이에선 你(nǐ)', example: '您请坐 / 你坐' },
    },
  },
  {
    id: 'gc_11', topic: 'Verb Conjugation', topicKo: '동사 변형',
    tip: '스페인어 동사 변형이 가장 복잡! 영어는 3인칭만, 중국어는 변형 없음.',
    languages: {
      ko: { rule: '어간 + 어미 변형', usage: '가다→가/갔다/갈/가는/가면...', example: '걷다 → 걸어, 걸었다' },
      es: { rule: '인칭별 6개 변형!', usage: 'yo/vos/él/nosotros/ustedes 다 다름', example: 'caminar → camino/caminás/camina' },
      en: { rule: '3인칭만 -s 추가', usage: 'I walk / He walks. 나머지 같음', example: 'walk → walks (3인칭만)' },
      zh: { rule: '동사 변형 없음!', usage: '시제는 了/过/要 등으로 표현', example: '走 = walk/walks/walked 다 同' },
    },
  },
  {
    id: 'gc_12', topic: 'Past Tense', topicKo: '과거형',
    tip: '중국어가 제일 쉬워! 了만 붙이면 끝. 스페인어는 2종류.',
    languages: {
      ko: { rule: '-았/었다', usage: '"했다" vs "하고 있었다" 구분', example: '걸었다 / 춤췄다' },
      es: { rule: '점과거 + 불완료과거 (2종류!)', usage: '완료된 행동 vs 진행 중이던 행동', example: 'Bailé (완료) / Bailaba (진행)' },
      en: { rule: '동사 + -ed (불규칙 많음)', usage: 'walked, danced, went (불규칙)', example: 'I danced last night' },
      zh: { rule: '동사 + 了(le)', usage: '了 하나로 과거 표현!', example: '我跳了舞 (춤췄다)' },
    },
  },
  {
    id: 'gc_13', topic: 'Reflexive Verbs', topicKo: '재귀동사 (스스로에게)',
    tip: '스페인어에서 가장 많이 쓰이는 특수 동사 형태!',
    languages: {
      ko: { rule: '스스로/자기 + 동사', usage: '별도 문법 형태 없음', example: '긴장을 풀다 / 서두르다' },
      es: { rule: 'se/me/te + 동사', usage: 'relajarse, apurarse — 매우 자주 사용!', example: 'Relajate (너 자신을 풀어)' },
      en: { rule: '동사 + myself/yourself', usage: '덜 자주 사용', example: 'Relax yourself' },
      zh: { rule: '自己 + 동사', usage: '별도 문법 없음', example: '放松自己 (자신을 풀어)' },
    },
  },
  {
    id: 'gc_14', topic: 'Prepositions vs Postpositions', topicKo: '전치사 vs 후치사(조사)',
    tip: '한국어만 조사가 뒤에! 나머지는 전치사가 앞에.',
    languages: {
      ko: { rule: '명사 + 조사 (뒤에)', usage: '에, 에서, 로, 와, 의...', example: '밀롱가에서, 파트너와' },
      es: { rule: '전치사 + 명사 (앞에)', usage: 'en, con, de, a, por...', example: 'En la milonga, Con mi pareja' },
      en: { rule: '전치사 + 명사 (앞에)', usage: 'in, with, of, to, for...', example: 'In the milonga, With my partner' },
      zh: { rule: '전치사 + 명사 (앞에)', usage: '在, 和, 的, 给...', example: '在milonga, 和搭档' },
    },
  },
  {
    id: 'gc_15', topic: 'Counting / Measure Words', topicKo: '수량 표현',
    tip: '중국어만 양사(量词)가 필요! 한국어도 비슷하게 단위가 있지만.',
    languages: {
      ko: { rule: '숫자 + 단위 (개, 명, 번)', usage: '"세 번", "한 곡", "두 사람"', example: '세 곡을 추다' },
      es: { rule: '숫자 + 명사 (단위 불필요)', usage: '숫자만 붙이면 됨', example: 'Tres tangos (3곡의 탱고)' },
      en: { rule: '숫자 + 명사 (단위 불필요)', usage: '숫자만 붙이면 됨', example: 'Three tangos' },
      zh: { rule: '숫자 + 양사 + 명사', usage: '个/首/位 등 양사 필수!', example: '三首探戈 (3곡의 탱고)' },
    },
  },
];
