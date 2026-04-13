export interface MinimalPair {
  id: string;
  wordA: string;
  wordB: string;
  meaningA: string;
  meaningB: string;
  explanation: string; // 한국어로 차이점 설명
  difficulty: 1 | 2 | 3;
}

export const minimalPairs: MinimalPair[] = [
  // === r vs rr ===
  {
    id: 'mp_01',
    wordA: 'pero',
    wordB: 'perro',
    meaningA: '그러나',
    meaningB: '개',
    explanation: 'r은 혀끝을 한 번 가볍게 치는 탄설음, rr은 혀끝을 여러 번 떨리게 하는 전동음입니다. 한국어에는 rr에 해당하는 소리가 없어서 구분이 어렵습니다.',
    difficulty: 1,
  },
  {
    id: 'mp_02',
    wordA: 'caro',
    wordB: 'carro',
    meaningA: '비싼',
    meaningB: '차, 자동차',
    explanation: '모음 사이의 r(탄설음)과 rr(전동음)을 구분하는 연습입니다. caro는 혀를 한 번만, carro는 혀를 여러 번 떨어야 합니다.',
    difficulty: 1,
  },
  {
    id: 'mp_03',
    wordA: 'para',
    wordB: 'parra',
    meaningA: '~을 위해',
    meaningB: '포도 넝쿨',
    explanation: 'r과 rr의 구분 연습입니다. para의 r은 가볍고 짧게, parra의 rr은 길게 떨어주세요.',
    difficulty: 2,
  },
  {
    id: 'mp_04',
    wordA: 'coro',
    wordB: 'corro',
    meaningA: '합창단',
    meaningB: '나는 달린다',
    explanation: '다시 r vs rr 쌍입니다. 동사 correr(달리다)의 1인칭 현재형 corro와 coro(합창단)를 구분해 보세요.',
    difficulty: 2,
  },

  // === l vs ll ===
  {
    id: 'mp_05',
    wordA: 'polo',
    wordB: 'pollo',
    meaningA: '극, 폴로',
    meaningB: '닭',
    explanation: 'l은 한국어 ㄹ과 비슷한 설측음, ll은 지역에 따라 [ʝ] 또는 [ʃ] 소리로 발음됩니다. 아르헨티나에서는 "포쇼"에 가깝게 발음합니다.',
    difficulty: 1,
  },
  {
    id: 'mp_06',
    wordA: 'cale',
    wordB: 'calle',
    meaningA: '(callar의 접속법) 조용히 해라',
    meaningB: '거리, 길',
    explanation: 'l과 ll의 차이입니다. calle(거리)는 아르헨티나식으로 "카쉐" 또는 "카제"에 가깝게 발음됩니다.',
    difficulty: 2,
  },
  {
    id: 'mp_07',
    wordA: 'hala',
    wordB: 'halla',
    meaningA: '끌어당기다 (감탄사)',
    meaningB: '찾다, 발견하다',
    explanation: 'l(하나의 l)은 혀끝이 윗니 뒤에 닿고, ll은 "야" 또는 "샤"에 가까운 소리입니다.',
    difficulty: 2,
  },

  // === n vs ñ ===
  {
    id: 'mp_08',
    wordA: 'mono',
    wordB: 'moño',
    meaningA: '원숭이',
    meaningB: '머리 묶음, 상투',
    explanation: 'n은 한국어 ㄴ과 같은 치경비음, ñ은 혀 중간 부분이 입천장에 닿는 구개비음입니다. "뇨" 소리에 가깝습니다.',
    difficulty: 1,
  },
  {
    id: 'mp_09',
    wordA: 'mano',
    wordB: 'maño',
    meaningA: '손',
    meaningB: '아라곤 사람 (애칭)',
    explanation: 'n과 ñ의 차이입니다. ñ을 발음할 때는 혀 중간을 입천장에 대고 "냐, 녜, 뇨" 소리를 냅니다.',
    difficulty: 1,
  },
  {
    id: 'mp_10',
    wordA: 'una',
    wordB: 'uña',
    meaningA: '하나 (여성형)',
    meaningB: '손톱',
    explanation: 'n과 ñ 구분 연습입니다. uña의 ñ은 "우냐"처럼 발음합니다. 한국어의 "냐"와 비슷하지만 혀 위치가 약간 다릅니다.',
    difficulty: 1,
  },

  // === s vs z/th ===
  {
    id: 'mp_11',
    wordA: 'casa',
    wordB: 'caza',
    meaningA: '집',
    meaningB: '사냥',
    explanation: '스페인 본토에서는 z를 영어 th처럼 발음하지만, 중남미에서는 s와 z를 같게 발음합니다(seseo). 스페인어를 어디서 배우냐에 따라 다릅니다.',
    difficulty: 2,
  },
  {
    id: 'mp_12',
    wordA: 'coser',
    wordB: 'cocer',
    meaningA: '바느질하다',
    meaningB: '요리하다, 끓이다',
    explanation: 's와 c(e/i 앞)의 차이입니다. 스페인에서는 확실히 구분되지만 중남미에서는 같게 들릴 수 있습니다.',
    difficulty: 3,
  },

  // === v/b vs f ===
  {
    id: 'mp_13',
    wordA: 'vino',
    wordB: 'fino',
    meaningA: '포도주',
    meaningB: '가는, 섬세한',
    explanation: '스페인어에서 v와 b는 같은 소리([b] 또는 [β])입니다. f는 윗니와 아랫입술 사이로 공기를 내보내는 소리입니다. 한국어에는 f가 없어 구분이 어렵습니다.',
    difficulty: 2,
  },
  {
    id: 'mp_14',
    wordA: 'vaca',
    wordB: 'faca',
    meaningA: '소',
    meaningB: '큰 칼 (남미 방언)',
    explanation: 'v/b([b]/[β])와 f의 차이입니다. f를 발음할 때는 윗니를 아랫입술에 대고 공기를 내보내세요.',
    difficulty: 2,
  },

  // === p vs b ===
  {
    id: 'mp_15',
    wordA: 'peso',
    wordB: 'beso',
    meaningA: '무게, 페소(화폐)',
    meaningB: '키스',
    explanation: 'p는 입술을 터뜨리며 공기를 강하게 내보내는 무성음, b는 성대를 울리는 유성음입니다. 한국어 ㅂ/ㅃ/ㅍ 구분과 다른 체계라 헷갈릴 수 있습니다.',
    difficulty: 1,
  },
  {
    id: 'mp_16',
    wordA: 'pata',
    wordB: 'bata',
    meaningA: '발, 다리 (동물)',
    meaningB: '가운, 실내복',
    explanation: 'p와 b의 차이입니다. 스페인어의 p는 한국어의 ㅍ보다 약하고, b는 한국어의 ㅂ과 비슷하지만 모음 사이에서는 입술을 완전히 닫지 않습니다.',
    difficulty: 1,
  },

  // === d vs t ===
  {
    id: 'mp_17',
    wordA: 'dos',
    wordB: 'tos',
    meaningA: '2, 둘',
    meaningB: '기침',
    explanation: 'd는 유성 치경파열음으로 성대를 울리고, t는 무성 치경파열음으로 성대를 울리지 않습니다. 한국어의 ㄷ/ㅌ 구분과 비슷하지만 미세하게 다릅니다.',
    difficulty: 2,
  },

  // === g vs j ===
  {
    id: 'mp_18',
    wordA: 'gota',
    wordB: 'jota',
    meaningA: '물방울',
    meaningB: '호타 (춤/노래), 글자 j',
    explanation: 'g(a/o/u 앞)는 유성 연구개파열음[g], j는 무성 연구개마찰음[x]으로 "ㅎ"에 가깝습니다. gota는 "고타", jota는 "호타"에 가깝습니다.',
    difficulty: 2,
  },

  // === e vs i (모음) ===
  {
    id: 'mp_19',
    wordA: 'mesa',
    wordB: 'misa',
    meaningA: '테이블',
    meaningB: '미사 (종교)',
    explanation: 'e는 입을 중간 정도 벌리는 중모음, i는 입을 좁게 하는 고모음입니다. 한국어의 ㅔ와 ㅣ 구분과 비슷합니다.',
    difficulty: 1,
  },

  // === o vs u (모음) ===
  {
    id: 'mp_20',
    wordA: 'polo',
    wordB: 'pulo',
    meaningA: '극, 폴로',
    meaningB: '(pulir의 1인칭) 나는 닦는다',
    explanation: 'o는 입을 둥글게 중간 정도 벌리는 중모음, u는 입을 더 좁게 둥글리는 고모음입니다. 한국어의 ㅗ와 ㅜ 차이와 유사합니다.',
    difficulty: 2,
  },
];
