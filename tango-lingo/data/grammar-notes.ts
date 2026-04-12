export interface GrammarNote {
  id: string;
  lessonId: string;  // which lesson this appears after
  title: string;
  titleKo: string;
  content: string;   // Korean explanation with Spanish examples
  examples: { spanish: string; korean: string; }[];
}

export const grammarNotes: GrammarNote[] = [
  {
    id: 'gn1_01',
    lessonId: 'les1_01',
    title: 'Basic greetings structure',
    titleKo: '기본 인사 구조',
    content: '아르헨티나 스페인어에서 인사는 "Hola" + 질문 형태가 기본입니다.\n"Hola, todo bien?" (안녕, 잘 지내?)처럼 가볍게 묻고,\n대답도 "Sí, todo bien" (응, 잘 지내)처럼 짧게 합니다.\n격식 없는 대화에서는 "vos"를 사용해요.',
    examples: [
      { spanish: 'Hola, ¿todo bien?', korean: '안녕, 잘 지내?' },
      { spanish: 'Sí, todo bien.', korean: '응, 잘 지내.' },
      { spanish: 'Buenas noches.', korean: '좋은 밤이에요.' },
      { spanish: '¿Cómo estás?', korean: '어떻게 지내?' },
    ],
  },
  {
    id: 'gn1_02',
    lessonId: 'les1_02',
    title: 'Voseo imperatives',
    titleKo: '보세오 명령형 (Relajá, Mirá, Bajá)',
    content: '아르헨티나에서는 "tú" 대신 "vos"를 씁니다.\n명령형도 다릅니다: 동사 원형에서 -r을 빼고 마지막 모음에 악센트를 붙여요.\n\n규칙: -ar → -á / -er → -é / -ir → -í\n\nrelaj-ar → relajá (힘 빼)\nmir-ar → mirá (봐)\nbaj-ar → bajá (내려)',
    examples: [
      { spanish: 'Relajá la cara.', korean: '얼굴 힘 빼.' },
      { spanish: 'Mirá para abajo.', korean: '아래를 봐.' },
      { spanish: 'Bajá los hombros.', korean: '어깨 내려.' },
      { spanish: 'Caminá despacio.', korean: '천천히 걸어.' },
    ],
  },
  {
    id: 'gn1_03',
    lessonId: 'les1_03',
    title: 'Body vocabulary (el/la articles)',
    titleKo: '몸 어휘와 관사 (el/la)',
    content: '스페인어 명사는 남성(el) 또는 여성(la)입니다.\n몸 부위도 성별이 있어요:\n\n남성: el hombro(어깨), el brazo(팔), el cuello(목), el pecho(가슴)\n여성: la mano(손), la cara(얼굴), la espalda(등), la cabeza(머리)\n\n복수형은 los/las를 씁니다.',
    examples: [
      { spanish: 'Bajá los hombros.', korean: '어깨를 내려.' },
      { spanish: 'Relajá la cara.', korean: '얼굴 힘 빼.' },
      { spanish: 'Sentí la mano.', korean: '손을 느껴봐.' },
      { spanish: 'Abrí el pecho.', korean: '가슴을 열어.' },
    ],
  },
  {
    id: 'gn1_04',
    lessonId: 'les1_04',
    title: '"No + verb" negative commands',
    titleKo: '"No + 동사" 부정 명령',
    content: '부정 명령은 "No" + 접속법 형태를 씁니다.\n하지만 탱고 수업에서는 간단한 패턴으로 자주 나와요:\n\nNo + 동사 → "~하지 마"\n\n보세오 명령형 앞에 No를 붙이면 부정 명령이 됩니다.\n(정식 문법과 약간 다르지만 구어에서 통용)',
    examples: [
      { spanish: 'No aprietes.', korean: '꽉 쥐지 마.' },
      { spanish: 'No mires abajo.', korean: '아래 보지 마.' },
      { spanish: 'No te pongas nervioso.', korean: '긴장하지 마.' },
      { spanish: 'No levantes los hombros.', korean: '어깨 올리지 마.' },
    ],
  },
  {
    id: 'gn1_05',
    lessonId: 'les1_05',
    title: 'Reflexive verbs (apurarse, relajarse)',
    titleKo: '재귀동사 (apurarse, relajarse)',
    content: '재귀동사는 동작이 자기 자신에게 돌아오는 동사입니다.\n원형: -se로 끝남 (relajarse = 자신을 이완시키다)\n\nvos 활용: relajarse → relajate / apurarse → apurate\n\n탱고에서 자주 쓰이는 재귀동사:\nrelajarse (힘 빼다), apurarse (서두르다), concentrarse (집중하다)',
    examples: [
      { spanish: 'No te apures.', korean: '서두르지 마.' },
      { spanish: 'Relajate.', korean: '힘 빼.' },
      { spanish: 'Concentrate en la música.', korean: '음악에 집중해.' },
      { spanish: 'No te pongas tenso.', korean: '긴장하지 마.' },
    ],
  },
  {
    id: 'gn1_06',
    lessonId: 'les1_06',
    title: '"Tu/tu" possessives',
    titleKo: '소유격 "tu" (너의)',
    content: '"tu"는 "너의"라는 뜻의 소유격입니다.\n(악센트 없음: tu = 너의 / 악센트 있음: tú = 너)\n\n아르헨티나에서는 "vos"를 쓰지만 소유격은 그대로 "tu"를 씁니다.\n\ntu + 명사: tu eje (너의 축), tu peso (너의 무게)',
    examples: [
      { spanish: 'Encontrá tu eje.', korean: '네 축을 찾아.' },
      { spanish: 'Sentí tu peso.', korean: '네 무게를 느껴.' },
      { spanish: 'Es tu turno.', korean: '네 차례야.' },
      { spanish: 'Controlá tu brazo.', korean: '네 팔을 컨트롤해.' },
    ],
  },
  {
    id: 'gn1_07',
    lessonId: 'les1_07',
    title: 'Weight/body vocabulary',
    titleKo: '체중/몸 어휘',
    content: '탱고에서는 체중과 몸의 위치를 자주 이야기합니다.\n\nel peso = 무게/체중\nel eje = 축/중심\nel piso = 바닥\nel equilibrio = 균형\n\n"cambiar el peso" = 체중을 옮기다 (탱고의 기본 동작)',
    examples: [
      { spanish: 'Cambiá el peso.', korean: '체중 옮겨.' },
      { spanish: 'Sentí el piso.', korean: '바닥을 느껴.' },
      { spanish: 'Buscá el equilibrio.', korean: '균형을 찾아.' },
      { spanish: 'No pierdas el eje.', korean: '축을 잃지 마.' },
    ],
  },
  {
    id: 'gn1_08',
    lessonId: 'les1_08',
    title: 'El abrazo - noun vs verb form',
    titleKo: 'El abrazo - 명사 vs 동사',
    content: '"abrazo"는 명사이자 동사 형태에서 파생됩니다.\n\nel abrazo (명사) = 포옹, 탱고에서의 홀드\nabrazar (동사) = 포옹하다\nabrazá (보세오 명령형) = 안아, 감싸\n\n탱고에서 "abrazo"는 단순한 포옹이 아니라 파트너와의 연결 자체를 뜻합니다.',
    examples: [
      { spanish: 'Cerrá el abrazo.', korean: '아브라소를 닫아.' },
      { spanish: 'Abrí el abrazo.', korean: '아브라소를 열어.' },
      { spanish: 'Abrazá suave.', korean: '부드럽게 안아.' },
      { spanish: 'El abrazo es la conexión.', korean: '아브라소가 연결이야.' },
    ],
  },
  {
    id: 'gn1_09',
    lessonId: 'les1_09',
    title: '"Sentí" vs "Sentís" - imperative vs present',
    titleKo: '"Sentí" vs "Sentís" - 명령형 vs 현재형',
    content: '보세오에서 같은 동사가 두 형태로 나옵니다:\n\nSentí (명령형) = 느껴봐! (지시)\nSentís (현재형) = 너는 느끼고 있어 (설명)\n\n이 차이는 모든 -ir 동사에 적용:\nSentí la conexión. (연결을 느껴봐) → 명령\n¿Sentís la conexión? (연결 느껴져?) → 질문',
    examples: [
      { spanish: 'Sentí la conexión.', korean: '연결을 느껴봐.' },
      { spanish: '¿Sentís la conexión?', korean: '연결 느껴져?' },
      { spanish: 'Seguí el ritmo.', korean: '리듬을 따라가.' },
      { spanish: '¿Seguís el ritmo?', korean: '리듬 따라가고 있어?' },
    ],
  },
  {
    id: 'gn1_10',
    lessonId: 'les1_10',
    title: 'Short feedback phrases pattern',
    titleKo: '짧은 피드백 패턴',
    content: '탱고 수업에서 선생님이 자주 쓰는 짧은 피드백 패턴:\n\nMuy bien = 아주 좋아\nAsí = 그렇게\nEso = 그거야\nDale = 계속 / 해봐\nOtra vez = 한 번 더\n\n이 단어들은 문법적으로 문장이 아니지만 탱고 수업에서 가장 많이 듣는 표현입니다.',
    examples: [
      { spanish: 'Muy bien, así.', korean: '아주 좋아, 그렇게.' },
      { spanish: 'Eso, dale.', korean: '그거야, 계속해.' },
      { spanish: 'Otra vez.', korean: '한 번 더.' },
      { spanish: 'Bien, muy bien.', korean: '좋아, 아주 좋아.' },
    ],
  },
];

export function getGrammarNoteForLesson(lessonId: string): GrammarNote | undefined {
  return grammarNotes.find((gn) => gn.lessonId === lessonId);
}

export function getGrammarNoteById(id: string): GrammarNote | undefined {
  return grammarNotes.find((gn) => gn.id === id);
}
