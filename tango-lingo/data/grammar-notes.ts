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

  // =====================================================
  // LEVEL 2: Caminar juntos — 12 grammar notes
  // =====================================================

  {
    id: 'gn2_01',
    lessonId: 'les2_01',
    title: 'Walking verbs (caminar, avanzar, retroceder)',
    titleKo: '걷기 동사 (caminar, avanzar, retroceder)',
    content: '탱고에서 가장 기본적인 동작은 걷기입니다.\n주요 동사 3개를 익혀두세요:\n\ncaminar = 걷다 (일반적 걷기)\navanzar = 전진하다 (앞으로 나아가기)\nretroceder = 후진하다 (뒤로 물러나기)\n\n보세오 명령형: caminá, avanzá, retrocedé.',
    examples: [
      { spanish: 'Caminá derecho.', korean: '똑바로 걸어.' },
      { spanish: 'Avanzá un paso.', korean: '한 발 전진해.' },
      { spanish: 'Retrocedé despacio.', korean: '천천히 후진해.' },
    ],
  },
  {
    id: 'gn2_02',
    lessonId: 'les2_02',
    title: 'Direction words (adelante, atrás, al costado)',
    titleKo: '방향 어휘 (adelante, atrás, al costado)',
    content: '탱고에서 방향은 3가지가 기본입니다:\n\nadelante = 앞으로\natrás = 뒤로\nal costado = 옆으로\n\n이 단어들은 동사 없이 단독으로도 쓰입니다.\n선생님이 "¡Adelante!" 하면 "앞으로!"라는 뜻이에요.',
    examples: [
      { spanish: 'Un paso al costado.', korean: '한 발 옆으로.' },
      { spanish: 'Adelante, despacio.', korean: '앞으로, 천천히.' },
      { spanish: 'Volvé atrás.', korean: '뒤로 돌아와.' },
    ],
  },
  {
    id: 'gn2_03',
    lessonId: 'les2_03',
    title: 'Para + direction (para adelante, para atrás)',
    titleKo: '"Para + 방향" 패턴',
    content: '"Para"는 "~쪽으로"라는 전치사입니다.\n방향 단어와 결합하면 이동 방향을 나타냅니다:\n\npara adelante = 앞쪽으로\npara atrás = 뒤쪽으로\npara el costado = 옆쪽으로\n\n"Caminá para atrás" = 뒤쪽으로 걸어.',
    examples: [
      { spanish: 'Caminá para atrás.', korean: '뒤로 걸어.' },
      { spanish: 'Un paso para adelante.', korean: '한 발 앞으로.' },
      { spanish: 'Movete para el costado.', korean: '옆으로 움직여.' },
    ],
  },
  {
    id: 'gn2_04',
    lessonId: 'les2_04',
    title: 'Parar (to stop) — imperative forms',
    titleKo: '멈추기 동사 parar 명령형',
    content: '"Parar"는 "멈추다"라는 동사입니다.\n탱고에서 멈춤은 기술이 아니라 음악의 일부입니다.\n\n보세오 명령형: Pará (멈춰)\n부정: No pares (멈추지 마)\n\n관련 명사: la pausa (멈춤), la parada (멈춘 상태)',
    examples: [
      { spanish: 'Pará acá.', korean: '여기서 멈춰.' },
      { spanish: 'No pares de caminar.', korean: '걷기를 멈추지 마.' },
      { spanish: 'Hacé una pausa.', korean: '멈춤을 만들어.' },
    ],
  },
  {
    id: 'gn2_05',
    lessonId: 'les2_05',
    title: 'Liderar / seguir (to lead / to follow)',
    titleKo: '리드/팔로우 동사 (liderar / seguir)',
    content: '탱고에서 가장 중요한 역할 동사 2개:\n\nliderar = 리드하다 (방향을 제안하다)\nseguir = 따라가다 (리드를 받아들이다)\n\n보세오 현재형: Yo lidero, vos seguís.\n명사: el líder (리더), el/la seguidor/a (팔로워)',
    examples: [
      { spanish: 'Yo lidero, vos seguís.', korean: '내가 리드하고, 넌 따라와.' },
      { spanish: 'Seguí mi intención.', korean: '내 의도를 따라와.' },
      { spanish: 'No liderés con los brazos.', korean: '팔로 리드하지 마.' },
    ],
  },
  {
    id: 'gn2_06',
    lessonId: 'les2_06',
    title: 'La marca — vocabulary and usage',
    titleKo: '마르카 어휘와 사용법',
    content: '"La marca"는 탱고에서 리드 신호를 뜻합니다.\n동사 "marcar"는 "신호를 보내다, 표시하다"입니다.\n\n보세오 명령형: Marcá (신호 보내)\n\n마르카는 가슴(pecho)으로 보내는 것이 원칙입니다.\n팔이 아니라 몸의 의도로 전달합니다.',
    examples: [
      { spanish: 'Marcá con el pecho.', korean: '가슴으로 마르카해.' },
      { spanish: 'La marca tiene que ser clara.', korean: '마르카는 확실해야 해.' },
      { spanish: 'No marqués con los brazos.', korean: '팔로 마르카하지 마.' },
    ],
  },
  {
    id: 'gn2_07',
    lessonId: 'les2_07',
    title: 'La salida — starting structure',
    titleKo: '살리다 구조',
    content: '"La salida"는 탱고의 출발 패턴을 뜻합니다.\n동사 "salir"에서 온 명사입니다 (나가다 → 출발).\n\n기본 살리다는 보통 8스텝으로 구성됩니다.\n"Empezamos con la salida" = 살리다부터 시작하자.\n\n보세오 명령형: Salí (나가/출발해)',
    examples: [
      { spanish: 'Empezamos con la salida.', korean: '살리다부터 시작하자.' },
      { spanish: 'Repetí la salida.', korean: '살리다 반복해.' },
      { spanish: 'La salida es la base de todo.', korean: '살리다가 모든 것의 기본이야.' },
    ],
  },
  {
    id: 'gn2_08',
    lessonId: 'les2_08',
    title: 'Más / menos + adjective (speed expressions)',
    titleKo: '"Más/menos + 형용사" 속도 표현',
    content: '"Más"는 "더", "menos"는 "덜"이라는 비교 부사입니다.\n형용사 앞에 붙여서 정도를 조절합니다:\n\nmás despacio = 더 천천히\nmenos rápido = 덜 빠르게\nmás suave = 더 부드럽게\n\n탱고 수업에서 속도 조절 지시로 매우 자주 쓰입니다.',
    examples: [
      { spanish: 'Más despacio.', korean: '더 천천히.' },
      { spanish: 'Menos fuerza.', korean: '힘 줄여.' },
      { spanish: 'Un poco más rápido.', korean: '조금 더 빠르게.' },
    ],
  },
  {
    id: 'gn2_09',
    lessonId: 'les2_09',
    title: 'Music vocabulary (compás, ritmo, tiempo)',
    titleKo: '음악 어휘 (compás, ritmo, tiempo)',
    content: '탱고에서 음악은 춤의 파트너입니다.\n핵심 음악 어휘:\n\nel compás = 박자 (2/4 또는 4/8)\nel ritmo = 리듬 (패턴)\nel tiempo = 타이밍/박\n\n"Caminá en el compás" = 박자에 맞춰 걸어.\n음악을 듣는 것이 춤의 첫 단계입니다.',
    examples: [
      { spanish: 'Escuchá el compás.', korean: '박자를 들어.' },
      { spanish: 'Seguí el ritmo.', korean: '리듬을 따라가.' },
      { spanish: 'Caminá en el tiempo.', korean: '타이밍에 맞춰 걸어.' },
    ],
  },
  {
    id: 'gn2_10',
    lessonId: 'les2_10',
    title: 'Step size (corto, largo, chico, grande)',
    titleKo: '보폭 어휘 (corto, largo, chico, grande)',
    content: '탱고에서 보폭은 중요한 조절 요소입니다:\n\ncorto = 짧은 (paso corto = 짧은 걸음)\nlargo = 긴 (paso largo = 긴 걸음)\nchico = 작은\ngrande = 큰\n\n"Paso más corto" = 걸음을 더 짧게.\n보폭이 파트너와 맞지 않으면 연결이 끊어집니다.',
    examples: [
      { spanish: 'Paso más corto.', korean: '걸음 더 짧게.' },
      { spanish: 'No tan largo.', korean: '그렇게 길지 않게.' },
      { spanish: 'Pasos chiquitos.', korean: '작은 걸음들로.' },
    ],
  },
  {
    id: 'gn2_11',
    lessonId: 'les2_11',
    title: 'Together expressions (juntos, los dos, al mismo tiempo)',
    titleKo: '함께 표현 (juntos, los dos, al mismo tiempo)',
    content: '탱고는 혼자가 아니라 둘이 하는 춤입니다:\n\njuntos/juntas = 함께 (남/여)\nlos dos = 둘 다\nal mismo tiempo = 동시에\n\n"Caminemos juntos" = 함께 걷자.\n성별에 따라 juntos(남 포함) / juntas(여끼리)를 씁니다.',
    examples: [
      { spanish: 'Caminemos juntos.', korean: '함께 걷자.' },
      { spanish: 'Los dos al mismo tiempo.', korean: '둘 다 동시에.' },
      { spanish: 'Hacelo juntos conmigo.', korean: '나랑 함께 해봐.' },
    ],
  },
  {
    id: 'gn2_12',
    lessonId: 'les2_12',
    title: 'Review: combining walk commands',
    titleKo: '복습: 걷기 명령 조합',
    content: '레벨 2에서 배운 걷기 관련 표현을 조합해봅니다:\n\n동사 + 방향 + 속도: Caminá para adelante, despacio.\n동사 + 보폭: Hacé pasos más cortos.\n동사 + 함께: Caminemos juntos en el compás.\n\n이 패턴들을 자유롭게 조합하면 수업에서 대부분의 지시를 이해할 수 있습니다.',
    examples: [
      { spanish: 'Caminá para adelante, más despacio.', korean: '앞으로 더 천천히 걸어.' },
      { spanish: 'Hacé pasos cortos juntos.', korean: '함께 짧은 걸음으로 해.' },
      { spanish: 'Seguí el ritmo y avanzá.', korean: '리듬 따라가면서 전진해.' },
    ],
  },

  // =====================================================
  // LEVEL 3: Girar y construir — 14 grammar notes
  // =====================================================

  {
    id: 'gn3_01',
    lessonId: 'les3_01',
    title: 'Ocho/pivote vocabulary',
    titleKo: '오초/피벗 어휘',
    content: '"El ocho"는 8자 모양의 탱고 기본 동작입니다.\n"El pivote"는 한 발로 회전하는 동작입니다.\n\nocho adelante = 앞오초 (전진 방향)\nocho atrás = 뒤오초 (후진 방향)\npivotar = 피벗하다 (회전하다)\n\n오초는 걷기 다음으로 중요한 기본 동작입니다.',
    examples: [
      { spanish: 'Hacé un ocho adelante.', korean: '앞오초 해봐.' },
      { spanish: 'Pivotá sobre la izquierda.', korean: '왼발로 피벗해.' },
      { spanish: 'El ocho atrás es más difícil.', korean: '뒤오초가 더 어려워.' },
    ],
  },
  {
    id: 'gn3_02',
    lessonId: 'les3_02',
    title: 'Body parts: cadera, pierna, rodilla',
    titleKo: '몸 부위: cadera, pierna, rodilla',
    content: '레벨 3에서는 하체 어휘가 중요해집니다:\n\nla cadera = 골반/엉덩이\nla pierna = 다리\nla rodilla = 무릎\nel tobillo = 발목\nel pie = 발\n\n오초와 히로에서 골반 회전(rotación de cadera)이 핵심입니다.',
    examples: [
      { spanish: 'Rotá la cadera.', korean: '골반을 돌려.' },
      { spanish: 'No bloqueés la rodilla.', korean: '무릎을 잠그지 마.' },
      { spanish: 'Usá la pierna libre.', korean: '자유로운 다리를 써.' },
    ],
  },
  {
    id: 'gn3_03',
    lessonId: 'les3_03',
    title: 'El cruce — timing word "cuando"',
    titleKo: '크루세와 타이밍 "cuando"',
    content: '"El cruce"는 다리를 교차하는 동작입니다.\n동사: cruzar = 교차하다.\n\n타이밍을 설명할 때 "cuando" (= ~할 때)를 씁니다:\n"Cruzá cuando sentís la marca." = 마르카를 느끼면 교차해.\n\n크루세는 5번째 스텝에서 나오는 클래식한 순간입니다.',
    examples: [
      { spanish: 'Cruzá cuando yo te marco.', korean: '내가 마르카하면 교차해.' },
      { spanish: 'No cruces antes de tiempo.', korean: '타이밍 전에 교차하지 마.' },
      { spanish: 'El cruce es en el cinco.', korean: '크루세는 5번에서야.' },
    ],
  },
  {
    id: 'gn3_04',
    lessonId: 'les3_04',
    title: 'El giro structure (adelante, costado, atrás)',
    titleKo: '히로 구조 (앞, 옆, 뒤)',
    content: '"El giro"는 회전 패턴입니다.\n기본 히로는 3스텝으로 구성됩니다:\n\n1. adelante (전진 스텝)\n2. al costado (옆 스텝)\n3. atrás (후진 스텝)\n\n이 순서를 반복하면서 파트너 주위를 회전합니다.\n"Empezá el giro por adelante." = 앞 스텝으로 히로 시작해.',
    examples: [
      { spanish: 'Empezá el giro por adelante.', korean: '앞 스텝으로 히로 시작해.' },
      { spanish: 'Después del costado, va atrás.', korean: '옆 스텝 다음에 뒤로 가.' },
      { spanish: 'Completá el giro.', korean: '히로를 완성해.' },
    ],
  },
  {
    id: 'gn3_05',
    lessonId: 'les3_05',
    title: 'Inside the giro — ordinal words (primero, después, último)',
    titleKo: '히로 안에서 — 순서 어휘',
    content: '히로 스텝 순서를 설명할 때 쓰는 순서 어휘:\n\nprimero = 먼저\ndespués = 다음에\npor último = 마지막으로\nluego = 그 다음에\n\n"Primero adelante, después costado, por último atrás."\n= 먼저 앞, 다음에 옆, 마지막으로 뒤.',
    examples: [
      { spanish: 'Primero adelante.', korean: '먼저 앞으로.' },
      { spanish: 'Después al costado.', korean: '다음에 옆으로.' },
      { spanish: 'Por último, atrás.', korean: '마지막으로 뒤로.' },
    ],
  },
  {
    id: 'gn3_06',
    lessonId: 'les3_06',
    title: 'Base vs adorno philosophy',
    titleKo: '기본(base) vs 장식(adorno) 철학',
    content: '탱고에서 "la base"는 기본 동작, "el adorno"는 장식입니다.\n\nPrimero la base, después el adorno.\n= 먼저 기본, 그 다음 장식.\n\n이것은 탱고의 핵심 철학입니다.\nsin = ~없이: "Sin base no hay adorno." = 기본 없이 장식은 없다.',
    examples: [
      { spanish: 'Primero la base.', korean: '먼저 기본.' },
      { spanish: 'Sin base no hay adorno.', korean: '기본 없이 장식은 없어.' },
      { spanish: 'La base es lo más importante.', korean: '기본이 가장 중요해.' },
    ],
  },
  {
    id: 'gn3_07',
    lessonId: 'les3_07',
    title: 'Adorno vocabulary (lustre, golpecito, enrosque)',
    titleKo: '아도르노 어휘 (lustre, golpecito, enrosque)',
    content: '탱고 장식(adorno)의 주요 종류:\n\nel lustre = 바닥 쓸기 (발로 바닥을 훑는 장식)\nel golpecito = 가벼운 탭 (발로 바닥을 가볍게 치기)\nel enrosque = 꼬기 (다리를 꼬는 장식)\n\n장식은 기본 동작 사이에 넣는 개인 표현입니다.',
    examples: [
      { spanish: 'Hacé un lustre.', korean: '루스트레 해봐.' },
      { spanish: 'Agregá un golpecito.', korean: '골페시토 넣어봐.' },
      { spanish: 'El adorno sale solo.', korean: '장식은 자연스럽게 나와.' },
    ],
  },
  {
    id: 'gn3_08',
    lessonId: 'les3_08',
    title: 'La sacada — invitar vs empujar',
    titleKo: '사카다 — 초대(invitar) vs 밀기(empujar)',
    content: '"La sacada"는 파트너의 공간에 발을 넣는 동작입니다.\n\nsacar = 꺼내다, 빼다\ninvitar = 초대하다\nempujar = 밀다\n\n사카다는 밀기(empujar)가 아니라 초대(invitar)입니다.\n"Es una invitación, no un empujón."\n= 초대야, 밀치기가 아니라.',
    examples: [
      { spanish: 'La sacada es una invitación.', korean: '사카다는 초대야.' },
      { spanish: 'No empujés.', korean: '밀지 마.' },
      { spanish: 'Entrá al espacio con suavidad.', korean: '부드럽게 공간에 들어가.' },
    ],
  },
  {
    id: 'gn3_09',
    lessonId: 'les3_09',
    title: 'La parada — mechanics vocabulary',
    titleKo: '파라다 역학 어휘',
    content: '"La parada"는 파트너의 발을 멈추게 하는 동작입니다.\n\nparar = 멈추다\nfrenar = 브레이크 걸다\nsandwich = 샌드위치 (양 발 사이에 끼우기)\n\n파라다 후에 장식(adorno)을 넣을 수 있는 공간이 생깁니다.\n파라다는 멈춤이 아니라 소통의 순간입니다.',
    examples: [
      { spanish: 'Hacé la parada suave.', korean: '부드럽게 파라다해.' },
      { spanish: 'Después de la parada, un adorno.', korean: '파라다 후에 장식.' },
      { spanish: 'No frenes fuerte.', korean: '세게 멈추지 마.' },
    ],
  },
  {
    id: 'gn3_10',
    lessonId: 'les3_10',
    title: 'El boleo — control vocabulary (soltar, controlar)',
    titleKo: '볼레오 — 제어 어휘 (soltar, controlar)',
    content: '"El boleo"는 에너지로 다리가 자연스럽게 나가는 동작입니다.\n\nsoltar = 놓다, 풀다\ncontrolar = 조절하다\ndejar = 내버려두다\n\n볼레오는 "하는" 것이 아니라 "나오게 하는" 것입니다.\n"No lo fuerces, dejá que salga." = 억지로 하지 마, 나오게 둬.',
    examples: [
      { spanish: 'Dejá que salga el boleo.', korean: '볼레오가 나오게 둬.' },
      { spanish: 'Controlá la pierna libre.', korean: '자유로운 다리를 조절해.' },
      { spanish: 'No lo fuerces.', korean: '억지로 하지 마.' },
    ],
  },
  {
    id: 'gn3_11',
    lessonId: 'les3_11',
    title: 'Más/menos comparatives for technique',
    titleKo: '기술 교정용 비교 표현 (más/menos)',
    content: '수업에서 기술을 교정할 때 más/menos를 자주 씁니다:\n\nmás suave = 더 부드럽게\nmenos fuerza = 힘 줄여\nmás arriba = 더 위로\nmenos tensión = 긴장 줄여\n\n"Más X, menos Y" 패턴으로 동시에 두 가지를 교정할 수 있습니다.',
    examples: [
      { spanish: 'Más suave, menos fuerza.', korean: '더 부드럽게, 힘 줄여.' },
      { spanish: 'Más arriba el brazo.', korean: '팔을 더 위로.' },
      { spanish: 'Menos tensión en la mano.', korean: '손에 긴장 줄여.' },
    ],
  },
  {
    id: 'gn3_12',
    lessonId: 'les3_12',
    title: 'Error recovery phrases (no pasa nada, de nuevo)',
    titleKo: '실수 복구 표현 (no pasa nada, de nuevo)',
    content: '실수 후 자연스럽게 이어가는 표현들:\n\nNo pasa nada. = 괜찮아, 별일 아니야.\nDe nuevo. = 다시.\nEmpecemos de nuevo. = 처음부터 다시 하자.\nPerdón. = 미안.\n\n탱고에서 실수는 당연한 것이고, 복구하는 것이 더 중요합니다.',
    examples: [
      { spanish: 'No pasa nada, seguí.', korean: '괜찮아, 계속해.' },
      { spanish: 'Empecemos de nuevo.', korean: '처음부터 다시 하자.' },
      { spanish: 'Perdón, fue mi culpa.', korean: '미안, 내 잘못이야.' },
    ],
  },
  {
    id: 'gn3_13',
    lessonId: 'les3_13',
    title: 'Question formations (¿Puedo...? ¿Cómo...?)',
    titleKo: '질문 패턴 (¿Puedo...? ¿Cómo...?)',
    content: '수업에서 질문하는 패턴 2가지:\n\n1. ¿Puedo + 동사원형? = ~해도 될까요?\n   ¿Puedo intentar de nuevo? = 다시 시도해도 될까요?\n\n2. ¿Cómo + 동사? = 어떻게 ~해요?\n   ¿Cómo hago el giro? = 히로를 어떻게 해요?\n\n수업에서 질문은 배움의 핵심입니다.',
    examples: [
      { spanish: '¿Puedo intentar de nuevo?', korean: '다시 시도해도 될까요?' },
      { spanish: '¿Cómo hago el cruce?', korean: '크루세를 어떻게 해요?' },
      { spanish: '¿Puedo ver otra vez?', korean: '한 번 더 볼 수 있을까요?' },
    ],
  },
  {
    id: 'gn3_14',
    lessonId: 'les3_14',
    title: 'Review: combining technique and questions',
    titleKo: '복습: 기술과 질문 조합',
    content: '레벨 3에서 배운 기술 어휘와 질문 패턴을 조합합니다:\n\n질문 + 기술: ¿Cómo hago el ocho más suave?\n실수 + 복구: Perdón, ¿empezamos de nuevo?\n피드백 + 비교: Más despacio en el giro.\n\n이 조합이 자연스러워지면 수업에서 능동적으로 참여할 수 있습니다.',
    examples: [
      { spanish: '¿Cómo hago el ocho más suave?', korean: '오초를 어떻게 더 부드럽게 해요?' },
      { spanish: 'Perdón, ¿empezamos de nuevo?', korean: '미안해요, 다시 시작할까요?' },
      { spanish: 'Más despacio en el giro, por favor.', korean: '히로에서 더 천천히 해주세요.' },
    ],
  },

  // =====================================================
  // LEVEL 4: Hablar en la práctica — 12 grammar notes
  // =====================================================

  {
    id: 'gn4_01',
    lessonId: 'les4_01',
    title: 'Repetition requests (otra vez, de nuevo)',
    titleKo: '반복 요청 (otra vez, de nuevo)',
    content: '연습에서 반복을 요청하는 표현:\n\notra vez = 한 번 더\nde nuevo = 다시\nuna vez más = 한 번 더 (격식)\nrepetir = 반복하다\n\n"Otra vez, por favor." = 한 번 더 해주세요.\n"¿Lo hacemos de nuevo?" = 다시 해볼까?',
    examples: [
      { spanish: 'Otra vez, por favor.', korean: '한 번 더 해주세요.' },
      { spanish: '¿Lo hacemos de nuevo?', korean: '다시 해볼까?' },
      { spanish: 'Una vez más, despacio.', korean: '한 번 더, 천천히.' },
    ],
  },
  {
    id: 'gn4_02',
    lessonId: 'les4_02',
    title: 'Positive feedback patterns (mejor, muy bien)',
    titleKo: '긍정 피드백 패턴 (mejor, muy bien)',
    content: '파트너에게 긍정적인 피드백을 줄 때:\n\nmejor = 더 나아졌어\nmuy bien = 아주 좋아\nahora sí = 이제 됐어\nestá mejor = 나아졌어\n\n"Ahora está mejor" = 지금은 더 나아요.\n칭찬은 연습의 에너지를 높입니다.',
    examples: [
      { spanish: 'Ahora está mejor.', korean: '이제 더 나아요.' },
      { spanish: 'Muy bien, así.', korean: '아주 좋아, 그렇게.' },
      { spanish: 'Ahora sí, eso.', korean: '이제 됐어, 그거야.' },
    ],
  },
  {
    id: 'gn4_03',
    lessonId: 'les4_03',
    title: 'Negative feedback (todavía no, falta)',
    titleKo: '부정 피드백 (todavía no, falta)',
    content: '부드러운 부정 피드백 표현:\n\ntodavía no = 아직 아니야\nfalta = 부족해, 모자라\ncasi = 거의\nno del todo = 완전히는 아니야\n\n"Todavía no, pero casi." = 아직은 아니지만 거의 됐어.\n부정 피드백도 부드럽게 할 수 있습니다.',
    examples: [
      { spanish: 'Todavía no, pero casi.', korean: '아직은 아니지만 거의 됐어.' },
      { spanish: 'Falta un poco más.', korean: '조금 더 필요해.' },
      { spanish: 'No del todo, repetí.', korean: '완전히는 아니야, 반복해.' },
    ],
  },
  {
    id: 'gn4_04',
    lessonId: 'les4_04',
    title: 'Speed modifiers (despacio, rápido, lento)',
    titleKo: '속도 수식어 (despacio, rápido, lento)',
    content: '속도를 조절하는 표현들:\n\ndespacio = 천천히\nrápido = 빨리\nlento = 느리게\napurado = 급하게\n\n"Más despacio, por favor." = 좀 더 천천히 해주세요.\n"No tan rápido." = 그렇게 빠르지 않게.\n\n속도 피드백은 연습에서 가장 자주 나오는 교정입니다.',
    examples: [
      { spanish: 'Más despacio, por favor.', korean: '좀 더 천천히 해주세요.' },
      { spanish: 'No tan rápido.', korean: '그렇게 빠르지 않게.' },
      { spanish: 'Hacelo más lento.', korean: '더 느리게 해봐.' },
    ],
  },
  {
    id: 'gn4_05',
    lessonId: 'les4_05',
    title: 'Sensation vocabulary (sentir, siento, se siente)',
    titleKo: '감각 어휘 (sentir, siento, se siente)',
    content: '"Sentir"는 "느끼다"라는 동사입니다.\n탱고에서 감각 표현은 매우 중요합니다:\n\nyo siento = 나는 느낀다\nvos sentís = 너는 느낀다\nse siente = ~하게 느껴진다\n\n"No lo siento bien." = 잘 느껴지지 않아요.\n"¿Sentís la marca?" = 마르카 느껴져?',
    examples: [
      { spanish: 'No lo siento bien.', korean: '잘 느껴지지 않아요.' },
      { spanish: '¿Sentís la marca?', korean: '마르카 느껴져?' },
      { spanish: 'Se siente raro.', korean: '이상하게 느껴져.' },
    ],
  },
  {
    id: 'gn4_06',
    lessonId: 'les4_06',
    title: 'Connection vocabulary (conexión, conectar, perder)',
    titleKo: '연결 어휘 (conexión, conectar, perder)',
    content: '파트너 연결에 관한 핵심 어휘:\n\nla conexión = 연결\nconectar = 연결하다\nperder = 잃다\nrecuperar = 되찾다\n\n"Perdimos la conexión." = 연결이 끊겼어.\n"Volvamos a conectar." = 다시 연결하자.\n\n연결은 물리적(아브라소)이자 음악적(리듬)입니다.',
    examples: [
      { spanish: 'Perdimos la conexión.', korean: '연결이 끊겼어.' },
      { spanish: 'Volvamos a conectar.', korean: '다시 연결하자.' },
      { spanish: 'La conexión está buena.', korean: '연결이 좋아.' },
    ],
  },
  {
    id: 'gn4_07',
    lessonId: 'les4_07',
    title: 'Timing words (antes, después, al mismo tiempo)',
    titleKo: '타이밍 어휘 (antes, después, al mismo tiempo)',
    content: '탱고에서 타이밍은 핵심입니다:\n\nantes = ~전에 (antes de tiempo = 너무 일찍)\ndespués = ~후에 (después del paso = 걸음 후에)\nal mismo tiempo = 동시에\ntarde = 늦게\n\n"Entraste antes." = 너 너무 빨리 들어왔어.\n"Esperá, después entrás." = 기다려, 그 다음에 들어가.',
    examples: [
      { spanish: 'Entraste antes.', korean: '너무 빨리 들어왔어.' },
      { spanish: 'Después del paso, cruzá.', korean: '걸음 후에 교차해.' },
      { spanish: 'Tenemos que estar al mismo tiempo.', korean: '동시에 맞춰야 해.' },
    ],
  },
  {
    id: 'gn4_08',
    lessonId: 'les4_08',
    title: 'Emotion expressions (estoy nervioso, tranquilo)',
    titleKo: '감정 표현 (estoy nervioso, tranquilo)',
    content: '수업에서 감정을 표현하는 패턴:\n\nEstoy + 형용사:\nEstoy nervioso/a = 긴장돼\nEstoy tranquilo/a = 편안해\nEstoy contento/a = 기뻐\nEstoy cansado/a = 피곤해\n\n남성은 -o, 여성은 -a로 끝납니다.\n감정 표현은 파트너와의 소통에서 중요합니다.',
    examples: [
      { spanish: 'Estoy un poco nervioso.', korean: '좀 긴장돼.' },
      { spanish: 'Tranquilo, no pasa nada.', korean: '편하게, 괜찮아.' },
      { spanish: 'Estoy contenta con el progreso.', korean: '진전이 기뻐요.' },
    ],
  },
  {
    id: 'gn4_09',
    lessonId: 'les4_09',
    title: 'Partner feedback patterns (estuvo bien/mal)',
    titleKo: '파트너 피드백 패턴 (estuvo bien/mal)',
    content: '파트너에게 피드백을 줄 때:\n\nEstuvo bien. = 좋았어.\nEstuvo muy bien. = 아주 좋았어.\nEstuvo raro. = 이상했어.\nMe gustó. = 마음에 들었어.\n\n"Estuvo"는 "estar"의 과거형으로 방금 끝난 동작에 씁니다.\n"Estuvo bien el giro." = 히로가 좋았어.',
    examples: [
      { spanish: 'Estuvo muy bien.', korean: '아주 좋았어.' },
      { spanish: 'Estuvo un poco raro.', korean: '좀 이상했어.' },
      { spanish: 'Me gustó cómo lo hiciste.', korean: '네가 한 방식이 마음에 들었어.' },
    ],
  },
  {
    id: 'gn4_10',
    lessonId: 'les4_10',
    title: 'Progress vocabulary (mejorar, mejor, progreso)',
    titleKo: '진전 어휘 (mejorar, mejor, progreso)',
    content: '진전과 동기부여 표현:\n\nmejorar = 나아지다\nmejor = 더 나은\nel progreso = 진전\navanzar = 전진하다\n\n"Estoy mejorando." = 나아지고 있어.\n"Cada vez mejor." = 점점 더 좋아지고 있어.\n\n자기 성장을 인식하는 것이 탱고 여정의 핵심입니다.',
    examples: [
      { spanish: 'Estoy mejorando.', korean: '나아지고 있어.' },
      { spanish: 'Cada vez mejor.', korean: '점점 더 좋아지고 있어.' },
      { spanish: 'Se nota el progreso.', korean: '진전이 보여.' },
    ],
  },
  {
    id: 'gn4_11',
    lessonId: 'les4_11',
    title: 'Partner rotation etiquette (fue un placer, gracias)',
    titleKo: '파트너 교체 예절 (fue un placer, gracias)',
    content: '파트너를 바꿀 때 쓰는 예의 표현:\n\nFue un placer. = 즐거웠어요.\nGracias por bailar. = 춤 춰줘서 고마워요.\nBailás muy bien. = 춤 잘 추시네요.\n\n탱고에서 파트너 교체(rotación)는 자연스러운 것입니다.\n항상 감사와 존중으로 마무리합니다.',
    examples: [
      { spanish: 'Fue un placer.', korean: '즐거웠어요.' },
      { spanish: 'Gracias por la práctica.', korean: '연습 고마워요.' },
      { spanish: 'Bailás muy bien.', korean: '춤 잘 추시네요.' },
    ],
  },
  {
    id: 'gn4_12',
    lessonId: 'les4_12',
    title: 'Review: practice conversation flow',
    titleKo: '복습: 연습 대화 흐름',
    content: '레벨 4에서 배운 표현들을 대화 흐름으로 조합합니다:\n\n시작: "¿Lo hacemos de nuevo?"\n피드백: "Estuvo bien, pero más despacio."\n감정: "Estoy un poco nervioso."\n격려: "Tranquilo, vas mejorando."\n마무리: "Fue un placer, gracias."\n\n이 흐름이 자연스러워지면 연습 파트너와 소통할 수 있습니다.',
    examples: [
      { spanish: '¿Lo hacemos de nuevo?', korean: '다시 해볼까?' },
      { spanish: 'Estuvo bien, pero más despacio.', korean: '좋았는데, 좀 더 천천히.' },
      { spanish: 'Fue un placer, gracias.', korean: '즐거웠어요, 고마워요.' },
    ],
  },

  // =====================================================
  // LEVEL 5: Sobrevivir en la milonga — 16 grammar notes
  // =====================================================

  {
    id: 'gn5_01',
    lessonId: 'les5_01',
    title: 'Greeting registers (formal/informal)',
    titleKo: '인사 격식 (formal/informal)',
    content: '밀롱가에서는 상황에 따라 격식을 조절합니다:\n\nInformal: Hola, ¿todo bien? (안녕, 잘 지내?)\nFormal: Buenas noches, ¿cómo está? (좋은 밤이에요, 어떠세요?)\n\n처음 만나는 사람에게는 "usted"(격식), 친해지면 "vos"(비격식).\n밀롱가 입장 시에는 보통 "Buenas noches"로 시작합니다.',
    examples: [
      { spanish: 'Buenas noches.', korean: '좋은 밤이에요.' },
      { spanish: 'Hola, ¿todo bien?', korean: '안녕, 잘 지내?' },
      { spanish: '¿Cómo está usted?', korean: '어떻게 지내세요? (격식)' },
    ],
  },
  {
    id: 'gn5_02',
    lessonId: 'les5_02',
    title: 'Self-introduction (Me llamo..., Soy de...)',
    titleKo: '자기소개 (Me llamo..., Soy de...)',
    content: '밀롱가에서 자기소개하는 기본 패턴:\n\nMe llamo [이름]. = 제 이름은 [이름]이에요.\nSoy de [나라/도시]. = [나라/도시]에서 왔어요.\nEs un placer. = 만나서 반가워요.\n\n아르헨티나에서는 볼 뽀뽀(beso)로 인사하는 것이 일반적입니다.',
    examples: [
      { spanish: 'Me llamo María, ¿y vos?', korean: '저는 마리아예요, 당신은?' },
      { spanish: 'Soy de Corea.', korean: '한국에서 왔어요.' },
      { spanish: 'Es un placer conocerte.', korean: '만나서 반가워요.' },
    ],
  },
  {
    id: 'gn5_03',
    lessonId: 'les5_03',
    title: 'Cabeceo vocabulary (mirar, asentir, señalar)',
    titleKo: '카베세오 어휘 (mirar, asentir, señalar)',
    content: '카베세오는 눈으로 춤을 신청하는 탱고 전통입니다:\n\nel cabeceo = 눈짓 신청\nmirar = 바라보다\nasentir = 고개 끄덕이다\nla mirada = 시선\n\n"Con el cabeceo, mirás y esperás." = 카베세오에서는 보고 기다려.\n눈이 마주치고 고개를 끄덕이면 수락입니다.',
    examples: [
      { spanish: 'Usá el cabeceo.', korean: '카베세오를 써.' },
      { spanish: 'Mirá y esperá.', korean: '보고 기다려.' },
      { spanish: 'Si asiente, acercate.', korean: '고개 끄덕이면 다가가.' },
    ],
  },
  {
    id: 'gn5_04',
    lessonId: 'les5_04',
    title: 'Tanda invitation (¿Bailamos esta tanda?)',
    titleKo: '탄다 신청 (¿Bailamos esta tanda?)',
    content: '"La tanda"는 같은 오케스트라/스타일의 3~4곡 세트입니다.\n\n¿Bailamos? = 춤출래요?\n¿Bailamos esta tanda? = 이 탄다 같이 출래요?\n¿Te gustaría bailar? = 춤추고 싶으세요?\n\n탄다는 밀롱가의 기본 단위입니다.\n한 탄다 동안 같은 파트너와 춤을 춥니다.',
    examples: [
      { spanish: '¿Bailamos esta tanda?', korean: '이 탄다 같이 출래요?' },
      { spanish: '¿Te gustaría bailar?', korean: '춤추고 싶으세요?' },
      { spanish: 'Dale, bailemos.', korean: '좋아, 추자.' },
    ],
  },
  {
    id: 'gn5_05',
    lessonId: 'les5_05',
    title: 'Comfort checking (¿Estás cómodo/a?)',
    titleKo: '편안함 확인 (¿Estás cómodo/a?)',
    content: '춤 도중 파트너를 배려하는 표현:\n\n¿Estás cómodo/a? = 편해요?\n¿Está bien así? = 이렇게 괜찮아요?\n¿Te molesta? = 불편해요?\nPerdón. = 미안해요.\n\n남성에게: ¿Estás cómodo?\n여성에게: ¿Estás cómoda?\n\n배려는 좋은 탱게로/탱게라의 첫 번째 조건입니다.',
    examples: [
      { spanish: '¿Estás cómoda?', korean: '편해요?' },
      { spanish: '¿Está bien así el abrazo?', korean: '이렇게 아브라소 괜찮아요?' },
      { spanish: 'Perdón, ¿te pisé?', korean: '미안, 밟았어?' },
    ],
  },
  {
    id: 'gn5_06',
    lessonId: 'les5_06',
    title: 'Orchestra vocabulary (orquesta, vals, milonga)',
    titleKo: '오케스트라 어휘 (orquesta, vals, milonga)',
    content: '밀롱가에서 음악을 이야기할 때:\n\nla orquesta = 오케스트라 (Di Sarli, D\'Arienzo 등)\nel vals = 왈츠\nla milonga = 밀롱가 (빠른 리듬의 곡)\nel tango = 탱고\n\n"¿De qué orquesta es?" = 어느 오케스트라야?\n음악을 아는 것은 밀롱가 생활의 핵심입니다.',
    examples: [
      { spanish: 'Me encanta esta orquesta.', korean: '이 오케스트라 너무 좋아.' },
      { spanish: '¿Bailamos el vals?', korean: '왈츠 출래요?' },
      { spanish: 'Es un tango de Di Sarli.', korean: '디 사를리 탱고야.' },
    ],
  },
  {
    id: 'gn5_07',
    lessonId: 'les5_07',
    title: 'Compliment structures (tu abrazo es..., bailás muy...)',
    titleKo: '칭찬 구조 (tu abrazo es..., bailás muy...)',
    content: '파트너를 칭찬하는 자연스러운 패턴:\n\nTu + 명사 + es + 형용사:\nTu abrazo es muy cómodo. = 네 아브라소 아주 편해.\n\n동사 + muy + 부사:\nBailás muy bien. = 춤 아주 잘 춰.\n\nMe gusta + 명사:\nMe gusta tu energía. = 네 에너지가 좋아.',
    examples: [
      { spanish: 'Tu abrazo es muy cómodo.', korean: '네 아브라소 아주 편해.' },
      { spanish: 'Bailás muy bien.', korean: '춤 아주 잘 춰.' },
      { spanish: 'Me gusta tu energía.', korean: '네 에너지가 좋아.' },
    ],
  },
  {
    id: 'gn5_08',
    lessonId: 'les5_08',
    title: 'Floor vocabulary (pista, ronda, línea de baile)',
    titleKo: '플로어 어휘 (pista, ronda, línea de baile)',
    content: '밀롱가 바닥(플로어) 관련 어휘:\n\nla pista = 댄스 플로어\nla ronda = 반시계 방향 흐름\nla línea de baile = 춤의 라인\nel espacio = 공간\n\n"Cuidado con la ronda." = 론다 주의해.\n론다를 지키는 것이 밀롱가 예절의 기본입니다.',
    examples: [
      { spanish: 'Cuidado, la pista está llena.', korean: '조심, 플로어가 꽉 찼어.' },
      { spanish: 'Seguí la ronda.', korean: '론다를 따라가.' },
      { spanish: 'No salgas de la línea de baile.', korean: '춤 라인에서 벗어나지 마.' },
    ],
  },
  {
    id: 'gn5_09',
    lessonId: 'les5_09',
    title: 'Tanda closure (gracias por la tanda)',
    titleKo: '탄다 마무리 (gracias por la tanda)',
    content: '탄다가 끝나고 인사하는 표현:\n\nGracias por la tanda. = 탄다 고마워요.\nLa pasé muy bien. = 아주 좋았어요.\nFue hermoso. = 아름다웠어요.\n\n탄다 사이에 나오는 음악을 "la cortina" (커튼)이라고 합니다.\n코르티나가 나오면 파트너를 바꿀 수 있습니다.',
    examples: [
      { spanish: 'Gracias por la tanda.', korean: '탄다 고마워요.' },
      { spanish: 'La pasé muy bien.', korean: '아주 좋았어요.' },
      { spanish: 'Fue hermoso bailar con vos.', korean: '당신과 추는 게 아름다웠어요.' },
    ],
  },
  {
    id: 'gn5_10',
    lessonId: 'les5_10',
    title: 'Polite refusal (ahora no, estoy descansando)',
    titleKo: '정중한 거절 (ahora no, estoy descansando)',
    content: '밀롱가에서 정중하게 거절하는 표현:\n\nAhora no, gracias. = 지금은 아니에요, 고마워요.\nEstoy descansando. = 쉬고 있어요.\nQuizás más tarde. = 아마 나중에요.\n\n카베세오로 신청받았을 때는 시선을 피하면 거절입니다.\n말로 거절할 때는 항상 "gracias"를 붙입니다.',
    examples: [
      { spanish: 'Ahora no, gracias.', korean: '지금은 아니에요, 고마워요.' },
      { spanish: 'Estoy descansando un poco.', korean: '좀 쉬고 있어요.' },
      { spanish: 'Quizás más tarde.', korean: '아마 나중에요.' },
    ],
  },
  {
    id: 'gn5_11',
    lessonId: 'les5_11',
    title: 'Rest vocabulary (descansar, agua, sentarse)',
    titleKo: '휴식 어휘 (descansar, agua, sentarse)',
    content: '밀롱가에서 쉬는 것도 중요합니다:\n\ndescansar = 쉬다\nel agua = 물\nsentarse = 앉다\ntomar algo = 뭔가 마시다\n\n"¿Descansamos?" = 쉴까?\n"Voy a tomar agua." = 물 마시러 갈게.\n\n쉬면서 음악을 듣는 것도 밀롱가의 즐거움입니다.',
    examples: [
      { spanish: '¿Descansamos?', korean: '쉴까?' },
      { spanish: 'Voy a tomar agua.', korean: '물 마시러 갈게.' },
      { spanish: 'Me siento un rato.', korean: '잠깐 앉을게.' },
    ],
  },
  {
    id: 'gn5_12',
    lessonId: 'les5_12',
    title: 'Continuation requests (¿otra tanda?, ¿seguimos?)',
    titleKo: '계속 요청 (¿otra tanda?, ¿seguimos?)',
    content: '한 탄다 더 추고 싶을 때:\n\n¿Otra tanda? = 한 탄다 더?\n¿Seguimos? = 계속할까?\n¿Una más? = 하나 더?\n\n주의: 같은 파트너와 2탄다 이상 연속으로 추는 것은\n밀롱가에서 특별한 의미가 있을 수 있습니다.\n상대방에게 부담을 주지 않도록 주의하세요.',
    examples: [
      { spanish: '¿Otra tanda?', korean: '한 탄다 더?' },
      { spanish: '¿Seguimos con la próxima?', korean: '다음 것도 계속할까?' },
      { spanish: 'Me encantaría otra tanda.', korean: '한 탄다 더 추고 싶어요.' },
    ],
  },
  {
    id: 'gn5_13',
    lessonId: 'les5_13',
    title: 'Social question patterns (¿Hace mucho que...?)',
    titleKo: '소셜 질문 패턴 (¿Hace mucho que...?)',
    content: '밀롱가에서 가벼운 대화를 시작하는 질문:\n\n¿Hace mucho que bailás? = 탱고 한 지 오래됐어?\n¿De dónde sos? = 어디서 왔어?\n¿Venís siempre acá? = 여기 항상 와?\n\n"Hace + 시간 + que + 동사" 패턴은\n"~한 지 얼마나 됐어?"를 묻는 구조입니다.',
    examples: [
      { spanish: '¿Hace mucho que bailás?', korean: '탱고 한 지 오래됐어?' },
      { spanish: '¿De dónde sos?', korean: '어디서 왔어?' },
      { spanish: '¿Venís siempre a esta milonga?', korean: '이 밀롱가에 항상 와?' },
    ],
  },
  {
    id: 'gn5_14',
    lessonId: 'les5_14',
    title: 'Ronda etiquette (cuidar, respetar, no pasar)',
    titleKo: '론다 예절 (cuidar, respetar, no pasar)',
    content: '밀롱가에서 론다(흐름) 예절:\n\ncuidar = 지키다, 돌보다\nrespetar = 존중하다\nno pasar = 추월하지 않다\nmantener la distancia = 거리 유지하다\n\n"Cuidemos la ronda." = 론다를 지키자.\n론다를 존중하는 것은 다른 커플에 대한 예의입니다.',
    examples: [
      { spanish: 'Cuidemos la ronda.', korean: '론다를 지키자.' },
      { spanish: 'No pases a la pareja de adelante.', korean: '앞 커플을 추월하지 마.' },
      { spanish: 'Mantené la distancia.', korean: '거리를 유지해.' },
    ],
  },
  {
    id: 'gn5_15',
    lessonId: 'les5_15',
    title: 'Farewell expressions (fue una noche hermosa)',
    titleKo: '작별 표현 (fue una noche hermosa)',
    content: '밀롱가를 떠날 때 인사:\n\nFue una noche hermosa. = 아름다운 밤이었어요.\nNos vemos la próxima. = 다음에 봐요.\nGracias por la noche. = 오늘 밤 고마워요.\nChau. = 잘 가.\n\n"Fue"는 "ser"의 과거형으로 밤 전체를 평가합니다.\n따뜻한 작별은 다음 만남의 시작입니다.',
    examples: [
      { spanish: 'Fue una noche hermosa.', korean: '아름다운 밤이었어요.' },
      { spanish: 'Nos vemos la próxima.', korean: '다음에 봐요.' },
      { spanish: 'Chau, que descanses.', korean: '잘 가, 푹 쉬어.' },
    ],
  },
  {
    id: 'gn5_16',
    lessonId: 'les5_16',
    title: 'Review: milonga survival phrases',
    titleKo: '복습: 밀롱가 서바이벌 표현',
    content: '레벨 5 전체를 복습합니다. 밀롱가 한 밤의 흐름:\n\n도착: "Buenas noches."\n신청: "¿Bailamos esta tanda?"\n춤 중: "Tu abrazo es muy cómodo."\n마무리: "Gracias por la tanda."\n작별: "Fue una noche hermosa."\n\n이 5단계가 자연스러워지면 밀롱가에서 살아남을 수 있습니다.',
    examples: [
      { spanish: '¿Bailamos esta tanda?', korean: '이 탄다 같이 출래요?' },
      { spanish: 'Gracias por la tanda, fue hermoso.', korean: '탄다 고마워요, 아름다웠어요.' },
      { spanish: 'Nos vemos la próxima, chau.', korean: '다음에 봐요, 잘 가.' },
    ],
  },
];

export function getGrammarNoteForLesson(lessonId: string): GrammarNote | undefined {
  return grammarNotes.find((gn) => gn.lessonId === lessonId);
}

export function getGrammarNoteById(id: string): GrammarNote | undefined {
  return grammarNotes.find((gn) => gn.id === id);
}
