export interface WritingPrompt {
  id: string;
  situationKo: string;
  hintEs?: string;
  level: 1 | 2 | 3 | 4 | 5;
  expectedKeywords?: string[];
}

export const writingPrompts: WritingPrompt[] = [
  // =====================================================
  // Level 1 — 기본 인사/수업 (22개)
  // =====================================================
  { id: 'wp01', situationKo: '수업에서 선생님께 인사해보세요.', hintEs: 'Hola, ...', level: 1, expectedKeywords: ['hola'] },
  { id: 'wp02', situationKo: '"잘 지내?"라고 물어보세요.', hintEs: '¿Todo ...?', level: 1, expectedKeywords: ['todo', 'bien'] },
  { id: 'wp03', situationKo: '파트너에게 "고마워요"라고 말하세요.', level: 1, expectedKeywords: ['gracias'] },
  { id: 'wp04', situationKo: '"천천히 해주세요"라고 선생님께 부탁하세요.', hintEs: 'Más ...', level: 1, expectedKeywords: ['más', 'despacio'] },
  { id: 'wp05', situationKo: '수업에서 "다시 한번 해볼까요?"라고 말해보세요.', level: 1, expectedKeywords: ['otra', 'vez'] },
  { id: 'wp06', situationKo: '"어깨 힘 빼"라고 스페인어로 말해보세요.', hintEs: 'Relajá ...', level: 1, expectedKeywords: ['relajá', 'hombros'] },
  { id: 'wp07', situationKo: '선생님께 "잘 모르겠어요"라고 말해보세요.', level: 1, expectedKeywords: ['no', 'entiendo'] },
  { id: 'wp08a', situationKo: '"네, 준비됐어요"라고 선생님께 대답하세요.', hintEs: 'Sí, ...', level: 1, expectedKeywords: ['sí', 'listo'] },
  { id: 'wp09a', situationKo: '"반갑습니다"라고 자기소개할 때 말해보세요.', hintEs: 'Mucho ...', level: 1, expectedKeywords: ['mucho', 'gusto'] },
  { id: 'wp10a', situationKo: '"이름이 뭐예요?"라고 파트너에게 물어보세요.', level: 1, expectedKeywords: ['cómo', 'llamás'] },
  { id: 'wp11a', situationKo: '"저는 초보예요"라고 말해보세요.', hintEs: 'Soy ...', level: 1, expectedKeywords: ['soy', 'principiante'] },
  { id: 'wp12a', situationKo: '"좋은 수업이었어요"라고 감사 표현을 해보세요.', level: 1, expectedKeywords: ['buena', 'clase'] },
  { id: 'wp13a', situationKo: '"실례합니다"라고 정중하게 말해보세요.', level: 1, expectedKeywords: ['perdón', 'disculpá'] },
  { id: 'wp14a', situationKo: '"한번 더 보여주세요"라고 선생님께 부탁하세요.', level: 1, expectedKeywords: ['mostrá', 'vez'] },
  { id: 'wp15a', situationKo: '"오늘이 첫 수업이에요"라고 말해보세요.', level: 1, expectedKeywords: ['primera', 'clase'] },
  { id: 'wp16a', situationKo: '"여기 서면 될까요?"라고 위치를 물어보세요.', level: 1, expectedKeywords: ['acá', 'puedo'] },
  { id: 'wp17a', situationKo: '"축 처진 어깨 안 돼요"라고 선생님이 말할 때 이해한다고 답하세요.', level: 1, expectedKeywords: ['sí', 'entiendo'] },
  { id: 'wp18a', situationKo: '"호흡을 깊게 해봐"라고 스페인어로 말해보세요.', hintEs: 'Respirá ...', level: 1, expectedKeywords: ['respirá', 'profundo'] },
  { id: 'wp19a', situationKo: '"수업이 몇 시에 시작해요?"라고 물어보세요.', level: 1, expectedKeywords: ['qué', 'hora', 'clase'] },
  { id: 'wp20a', situationKo: '"물 좀 마셔도 될까요?"라고 쉬는 시간에 말해보세요.', level: 1, expectedKeywords: ['puedo', 'agua'] },
  { id: 'wp21a', situationKo: '"잘했어요!"라고 파트너를 격려해보세요.', hintEs: '¡Muy ...!', level: 1, expectedKeywords: ['muy', 'bien'] },
  { id: 'wp22a', situationKo: '"안녕히 가세요, 다음 주에 봐요"라고 인사해보세요.', level: 1, expectedKeywords: ['chau', 'semana'] },

  // =====================================================
  // Level 2 — 걷기/리드 (21개)
  // =====================================================
  { id: 'wp08', situationKo: '"한 걸음 앞으로"를 스페인어로 말해보세요.', hintEs: 'Un paso ...', level: 2, expectedKeywords: ['paso', 'adelante'] },
  { id: 'wp09', situationKo: '파트너에게 "잠깐 멈추자"고 말해보세요.', level: 2, expectedKeywords: ['pará', 'momento'] },
  { id: 'wp10', situationKo: '"음악을 느껴봐"라고 말해보세요.', hintEs: 'Sentí ...', level: 2, expectedKeywords: ['sentí', 'música'] },
  { id: 'wp11', situationKo: '"옆으로 걸어볼까?"라고 제안해보세요.', level: 2, expectedKeywords: ['caminemos', 'costado'] },
  { id: 'wp12', situationKo: '선생님이 "살리다부터 시작하자"라고 할 때 대답해보세요.', level: 2, expectedKeywords: ['salida', 'sí'] },
  { id: 'wp13', situationKo: '"리드가 아주 편해요"라고 칭찬해보세요.', level: 2, expectedKeywords: ['marca', 'cómoda'] },
  { id: 'wp23', situationKo: '"뒤로 한 걸음"을 스페인어로 말해보세요.', hintEs: 'Un paso ...', level: 2, expectedKeywords: ['paso', 'atrás'] },
  { id: 'wp24', situationKo: '"무게 중심을 앞으로 옮겨봐"라고 말해보세요.', level: 2, expectedKeywords: ['peso', 'adelante'] },
  { id: 'wp25', situationKo: '"천천히 걸어볼까요?"라고 제안해보세요.', level: 2, expectedKeywords: ['caminemos', 'despacio'] },
  { id: 'wp26', situationKo: '"연결이 좋아요"라고 파트너에게 말해보세요.', hintEs: 'La conexión ...', level: 2, expectedKeywords: ['conexión', 'buena'] },
  { id: 'wp27', situationKo: '"발 위치를 바꿔볼까?"라고 물어보세요.', level: 2, expectedKeywords: ['cambiar', 'pies'] },
  { id: 'wp28', situationKo: '"비트에 맞춰 걸어볼까?"라고 제안해보세요.', level: 2, expectedKeywords: ['caminar', 'ritmo'] },
  { id: 'wp29', situationKo: '"축(eje)을 잘 유지해"라고 말해보세요.', level: 2, expectedKeywords: ['mantené', 'eje'] },
  { id: 'wp30', situationKo: '"가슴으로 리드해"라고 표현해보세요.', level: 2, expectedKeywords: ['pecho', 'marca'] },
  { id: 'wp31', situationKo: '"걸을 때 바닥을 밀어봐"라고 조언해보세요.', level: 2, expectedKeywords: ['empujá', 'piso'] },
  { id: 'wp32', situationKo: '"두 박자 쉬었다 가자"라고 말해보세요.', level: 2, expectedKeywords: ['dos', 'tiempos', 'pausa'] },
  { id: 'wp33', situationKo: '"방향을 바꿔볼까?"라고 제안해보세요.', level: 2, expectedKeywords: ['cambiar', 'dirección'] },
  { id: 'wp34', situationKo: '"여기서 멈추고 느껴봐"라고 말해보세요.', level: 2, expectedKeywords: ['pará', 'sentí'] },
  { id: 'wp35', situationKo: '"팔을 가볍게 올려봐"라고 지시해보세요.', level: 2, expectedKeywords: ['brazos', 'suave'] },
  { id: 'wp36', situationKo: '"같이 호흡 맞춰보자"라고 말해보세요.', level: 2, expectedKeywords: ['respiremos', 'juntos'] },
  { id: 'wp37', situationKo: '"보폭을 좀 더 크게 해볼까?"라고 제안해보세요.', level: 2, expectedKeywords: ['pasos', 'más', 'grandes'] },

  // =====================================================
  // Level 3 — 회전/구조 (22개)
  // =====================================================
  { id: 'wp14', situationKo: '"오초를 한번 해볼까요?"라고 말해보세요.', hintEs: '¿Hacemos ...?', level: 3, expectedKeywords: ['hacemos', 'ocho'] },
  { id: 'wp15', situationKo: '밀롱가에서 "한 탄다 함께 추실래요?"라고 신청해보세요.', level: 3, expectedKeywords: ['tanda', 'bailamos'] },
  { id: 'wp16', situationKo: '"오늘 음악이 너무 좋다"고 말해보세요.', level: 3, expectedKeywords: ['música', 'buena'] },
  { id: 'wp17', situationKo: '"정말 즐거웠어요, 고마워요"라고 인사해보세요.', level: 3, expectedKeywords: ['gracias', 'lindo'] },
  { id: 'wp18', situationKo: '"히로를 연습하고 싶어요"라고 말해보세요.', level: 3, expectedKeywords: ['practicar', 'giro'] },
  { id: 'wp19', situationKo: '밀롱가에서 자연스럽게 거절하는 말을 해보세요.', level: 3, expectedKeywords: ['gracias', 'ahora', 'no'] },
  { id: 'wp20', situationKo: '"다음에 또 만나요"라고 작별 인사를 해보세요.', hintEs: 'Nos vemos ...', level: 3, expectedKeywords: ['nos', 'vemos'] },
  { id: 'wp38', situationKo: '"크루세를 넣어볼까?"라고 말해보세요.', level: 3, expectedKeywords: ['cruce', 'hagamos'] },
  { id: 'wp39', situationKo: '"오초 코르타도 해볼까요?"라고 제안해보세요.', level: 3, expectedKeywords: ['ocho', 'cortado'] },
  { id: 'wp40', situationKo: '"볼레오를 연습하고 싶어요"라고 말해보세요.', level: 3, expectedKeywords: ['practicar', 'voleo'] },
  { id: 'wp41', situationKo: '"이 동작이 어려워요"라고 말해보세요.', level: 3, expectedKeywords: ['movimiento', 'difícil'] },
  { id: 'wp42', situationKo: '"히로 방향을 바꿔볼까요?"라고 제안해보세요.', level: 3, expectedKeywords: ['giro', 'dirección'] },
  { id: 'wp43', situationKo: '"사카다를 시도해볼까요?"라고 말해보세요.', level: 3, expectedKeywords: ['sacada', 'probemos'] },
  { id: 'wp44', situationKo: '"이 시퀀스를 처음부터 다시 해볼까요?"라고 말해보세요.', level: 3, expectedKeywords: ['secuencia', 'principio'] },
  { id: 'wp45', situationKo: '"엔로스케를 어떻게 해요?"라고 물어보세요.', level: 3, expectedKeywords: ['cómo', 'enrosque'] },
  { id: 'wp46', situationKo: '"간체를 넣어보고 싶어요"라고 말해보세요.', level: 3, expectedKeywords: ['gancho', 'quiero'] },
  { id: 'wp47', situationKo: '"발끝으로 피봇해봐"라고 지시해보세요.', level: 3, expectedKeywords: ['pivoteá', 'punta'] },
  { id: 'wp48', situationKo: '"모리네테를 연습합시다"라고 말해보세요.', level: 3, expectedKeywords: ['practiquemos', 'molinete'] },
  { id: 'wp49', situationKo: '"바리다를 해볼까요?"라고 물어보세요.', level: 3, expectedKeywords: ['barrida', 'hacemos'] },
  { id: 'wp50', situationKo: '"이 부분에서 파우사를 넣어봐"라고 말해보세요.', level: 3, expectedKeywords: ['pausa', 'acá'] },
  { id: 'wp51', situationKo: '"좌회전 히로를 연습하고 싶어요"라고 말해보세요.', level: 3, expectedKeywords: ['giro', 'izquierda'] },
  { id: 'wp52', situationKo: '"감기는 느낌으로 해봐"라고 조언해보세요.', level: 3, expectedKeywords: ['espiral', 'sentí'] },

  // =====================================================
  // Level 4 — 연습 피드백 (20개)
  // =====================================================
  { id: 'wp53', situationKo: '"연결이 끊긴 것 같아요"라고 피드백을 주세요.', level: 4, expectedKeywords: ['conexión', 'perdimos'] },
  { id: 'wp54', situationKo: '"타이밍이 조금 빨랐어"라고 말해보세요.', level: 4, expectedKeywords: ['timing', 'rápido'] },
  { id: 'wp55', situationKo: '"아브라소를 좀 더 편하게 해볼까?"라고 제안해보세요.', level: 4, expectedKeywords: ['abrazo', 'cómodo'] },
  { id: 'wp56', situationKo: '"이 부분을 느리게 해보자"라고 말해보세요.', level: 4, expectedKeywords: ['parte', 'lento'] },
  { id: 'wp57', situationKo: '"아주 좋아졌어!"라고 발전을 칭찬해보세요.', hintEs: '¡Mejoró ...!', level: 4, expectedKeywords: ['mejoró', 'mucho'] },
  { id: 'wp58', situationKo: '"음악 해석이 좋았어요"라고 칭찬해보세요.', level: 4, expectedKeywords: ['musicalidad', 'buena'] },
  { id: 'wp59', situationKo: '"다리가 꼬였어요, 다시 해볼까요?"라고 말해보세요.', level: 4, expectedKeywords: ['piernas', 'cruzaron', 'hacemos'] },
  { id: 'wp60', situationKo: '"힘을 덜 쓰면 더 좋을 것 같아"라고 조언해보세요.', level: 4, expectedKeywords: ['menos', 'fuerza'] },
  { id: 'wp61', situationKo: '"이 조합이 잘 됐어요!"라고 기뻐해보세요.', level: 4, expectedKeywords: ['combinación', 'salió', 'bien'] },
  { id: 'wp62', situationKo: '"너무 긴장하지 마"라고 파트너를 안심시켜보세요.', level: 4, expectedKeywords: ['no', 'tensión'] },
  { id: 'wp63', situationKo: '"여기서 더 기다려봐"라고 타이밍을 조언해보세요.', level: 4, expectedKeywords: ['esperá', 'más'] },
  { id: 'wp64', situationKo: '"오늘 뭘 연습할까?"라고 파트너에게 물어보세요.', level: 4, expectedKeywords: ['qué', 'practicamos', 'hoy'] },
  { id: 'wp65', situationKo: '"이 부분이 어색해요"라고 느낌을 표현해보세요.', level: 4, expectedKeywords: ['parte', 'raro'] },
  { id: 'wp66', situationKo: '"체중 이동이 안 됐어"라고 문제를 짚어보세요.', level: 4, expectedKeywords: ['peso', 'transferencia'] },
  { id: 'wp67', situationKo: '"한번 더 해보자, 거의 됐어!"라고 격려해보세요.', level: 4, expectedKeywords: ['vez', 'más', 'casi'] },
  { id: 'wp68', situationKo: '"여기서 가슴을 좀 더 열어봐"라고 조언해보세요.', level: 4, expectedKeywords: ['pecho', 'abrí'] },
  { id: 'wp69', situationKo: '"음악이 바뀌면 움직임도 바꿔보자"라고 말해보세요.', level: 4, expectedKeywords: ['música', 'cambia', 'movimiento'] },
  { id: 'wp70', situationKo: '"오늘 연습 너무 좋았어!"라고 끝인사를 해보세요.', level: 4, expectedKeywords: ['práctica', 'genial'] },
  { id: 'wp71', situationKo: '"발 닿는 느낌에 집중해봐"라고 말해보세요.', level: 4, expectedKeywords: ['pies', 'sentí', 'piso'] },
  { id: 'wp72', situationKo: '"내가 리드할게, 따라와봐"라고 말해보세요.', level: 4, expectedKeywords: ['marco', 'seguime'] },

  // =====================================================
  // Level 5 — 밀롱가 (25개)
  // =====================================================
  { id: 'wp73', situationKo: '카베세오로 눈이 마주쳤을 때 "춤추실래요?"라고 물어보세요.', level: 5, expectedKeywords: ['bailamos'] },
  { id: 'wp74', situationKo: '"이 오케스트라 좋아해요?"라고 음악 취향을 물어보세요.', level: 5, expectedKeywords: ['orquesta', 'gusta'] },
  { id: 'wp75', situationKo: '"디 사를리가 제일 좋아요"라고 대답해보세요.', level: 5, expectedKeywords: ['Di Sarli', 'favorita'] },
  { id: 'wp76', situationKo: '"이 곡은 뭐예요?"라고 DJ에게 물어보세요.', level: 5, expectedKeywords: ['tema', 'cuál'] },
  { id: 'wp77', situationKo: '"탄다가 끝났네요, 고마워요"라고 인사해보세요.', level: 5, expectedKeywords: ['tanda', 'terminó', 'gracias'] },
  { id: 'wp78', situationKo: '"여기 자주 오세요?"라고 가볍게 대화를 시작해보세요.', level: 5, expectedKeywords: ['venís', 'seguido'] },
  { id: 'wp79', situationKo: '"탱고를 시작한 지 얼마나 됐어요?"라고 물어보세요.', level: 5, expectedKeywords: ['cuánto', 'tiempo', 'bailás'] },
  { id: 'wp80', situationKo: '"이 밀롱가의 바닥이 좋네요"라고 코멘트해보세요.', level: 5, expectedKeywords: ['piso', 'milonga', 'bueno'] },
  { id: 'wp81', situationKo: '"정말 멋지게 추시네요"라고 칭찬해보세요.', level: 5, expectedKeywords: ['bailás', 'increíble'] },
  { id: 'wp82', situationKo: '"코르티나가 나와요, 자리로 갈까요?"라고 말해보세요.', level: 5, expectedKeywords: ['cortina', 'volvemos'] },
  { id: 'wp83', situationKo: '"물 한잔 하러 가도 될까요?"라고 양해를 구하세요.', level: 5, expectedKeywords: ['agua', 'permiso'] },
  { id: 'wp84', situationKo: '"오늘 밀롱가 분위기가 좋네요"라고 말해보세요.', level: 5, expectedKeywords: ['milonga', 'lindo', 'ambiente'] },
  { id: 'wp85', situationKo: '"발스 좋아해요?"라고 물어보세요.', level: 5, expectedKeywords: ['vals', 'gusta'] },
  { id: 'wp86', situationKo: '"밀롱가 음악이 나올 때 추실래요?"라고 제안해보세요.', level: 5, expectedKeywords: ['milonga', 'bailamos'] },
  { id: 'wp87', situationKo: '"푸글리에세 탄다 기다리고 있어요"라고 말해보세요.', level: 5, expectedKeywords: ['Pugliese', 'tanda', 'espero'] },
  { id: 'wp88', situationKo: '"지금은 좀 쉬고 있어요, 이따 추실래요?"라고 정중하게 거절해보세요.', level: 5, expectedKeywords: ['descanso', 'después'] },
  { id: 'wp89', situationKo: '"어디서 탱고를 배웠어요?"라고 물어보세요.', level: 5, expectedKeywords: ['dónde', 'aprendiste'] },
  { id: 'wp90', situationKo: '"이 탄다의 칸탄테가 누구예요?"라고 물어보세요.', level: 5, expectedKeywords: ['cantante', 'quién'] },
  { id: 'wp91', situationKo: '"정말 즐거운 밤이었어요"라고 작별 인사를 해보세요.', level: 5, expectedKeywords: ['noche', 'hermosa'] },
  { id: 'wp92', situationKo: '"다음 주에도 오실 거예요?"라고 물어보세요.', level: 5, expectedKeywords: ['venís', 'semana'] },
  { id: 'wp93', situationKo: '"연락처 교환해도 될까요?"라고 물어보세요.', level: 5, expectedKeywords: ['contacto', 'intercambiar'] },
  { id: 'wp94', situationKo: '"추천할 밀롱가 있어요?"라고 물어보세요.', level: 5, expectedKeywords: ['recomendás', 'milonga'] },
  { id: 'wp95', situationKo: '"좋은 탱고 신발 어디서 사요?"라고 물어보세요.', level: 5, expectedKeywords: ['zapatos', 'tango', 'dónde'] },
  { id: 'wp96', situationKo: '"이 근처에 좋은 밀롱가 있어요?"라고 물어보세요.', level: 5, expectedKeywords: ['milonga', 'cerca'] },
  { id: 'wp97', situationKo: '"탱고 시작하길 잘한 것 같아요"라고 감상을 말해보세요.', level: 5, expectedKeywords: ['tango', 'empezar', 'contento'] },
];
