import type { TangoTerm } from '../types';

export const tangoTerms: Record<string, TangoTerm> = {
  // =====================================================
  // LEVEL 1 — 6 terms
  // =====================================================

  t_mirada: {
    id: 't_mirada',
    term: 'Mirada',
    literalMeaning: '시선, 바라봄',
    tangoMeaning: '밀롱가에서 파트너에게 춤을 신청하는 눈맞춤. 카베세오의 첫 단계.',
    bodyInterpretation: '말 없이 눈으로 "같이 출래요?"를 전하는 순간. 거절도 시선으로 — 눈을 피하면 "오늘은 아니에요".',
    example: 'La mirada es el primer paso. — 시선이 첫 번째 스텝이다.',
    relatedLessonIds: ['les1_02'],
  },
  t_postura: {
    id: 't_postura',
    term: 'Postura',
    literalMeaning: '자세',
    tangoMeaning: '탱고의 첫인상. 몸의 정렬과 이완이 만드는 전체적인 형태.',
    bodyInterpretation: '좋은 자세는 모양이 아니라 이완에서 시작된다. 어깨 내리고, 목 풀고, 가슴 열고 — 그러면 자세는 저절로.',
    example: 'Mantené una buena postura. — 좋은 자세를 유지해.',
    relatedLessonIds: ['les1_03'],
  },
  t_tension: {
    id: 't_tension',
    term: 'Tensión',
    literalMeaning: '긴장, 팽팽함',
    tangoMeaning: '불필요한 힘. 초보가 가장 먼저 버려야 할 것.',
    bodyInterpretation: '긴장하면 리드도 팔로우도 막힌다. 몸이 딱딱하면 연결이 끊어진다. 탱고에서 좋은 긴장은 "의도"이고, 나쁜 긴장은 "힘".',
    example: 'Soltá la tensión. — 긴장 풀어.',
    relatedLessonIds: ['les1_04', 'les1_05'],
  },
  t_eje: {
    id: 't_eje',
    term: 'Eje',
    literalMeaning: '축',
    tangoMeaning: '몸의 수직 중심선. 머리꼭대기부터 발바닥까지 관통하는 보이지 않는 기둥.',
    bodyInterpretation: '축이 무너지면 모든 동작이 불안정해진다. 파트너에게 기대지 않고 내 안에 서 있는 감각.',
    example: 'Encontrá tu eje. — 네 축을 찾아.',
    relatedLessonIds: ['les1_06'],
  },
  t_abrazo: {
    id: 't_abrazo',
    term: 'Abrazo',
    literalMeaning: '포옹, 껴안기',
    tangoMeaning: '탱고에서 두 사람이 함께 춤추기 위해 만드는 연결 구조. 탱고의 시작이자 핵심.',
    bodyInterpretation: '팔이 아니라 가슴과 등으로 느끼는 공간. 힘이 아니라 의도가 전달되는 구조. 오픈(편하게) → 클로즈(더 가까이).',
    example: 'Cerrá el abrazo. — 아브라소를 닫아.',
    relatedLessonIds: ['les1_08'],
  },
  t_conexion: {
    id: 't_conexion',
    term: 'Conexión',
    literalMeaning: '연결',
    tangoMeaning: '두 사람이 하나의 의도로 움직이는 것. 탱고에서 가장 중요한 개념.',
    bodyInterpretation: '붙잡는 게 아니라 함께 느끼는 것. 힘으로 만드는 게 아니라 주의(attention)로 만드는 것.',
    example: 'Sentí la conexión. — 연결을 느껴.',
    relatedLessonIds: ['les1_09'],
  },

  // =====================================================
  // LEVEL 2 — 7 terms
  // =====================================================

  t_caminata: {
    id: 't_caminata', term: 'Caminata', literalMeaning: '걷기',
    tangoMeaning: '탱고의 가장 기본이자 가장 어려운 동작. 모든 기술의 토대.',
    bodyInterpretation: '발을 옮기는 게 아니라 몸 전체가 이동하는 것. 좋은 걷기 하나가 100개 기술보다 낫다.',
    example: 'La caminata es lo más importante. — 걷기가 가장 중요해.',
    relatedLessonIds: ['les2_01', 'les2_11'],
  },
  t_pausa: {
    id: 't_pausa', term: 'Pausa', literalMeaning: '멈춤',
    tangoMeaning: '음악 안에서 움직이지 않는 것도 춤. 멈춤은 비어있는 게 아니라 가득 차 있는 순간.',
    bodyInterpretation: '멈출 때도 에너지는 유지된다. 두 사람의 긴장감이 살아있는 정지.',
    example: 'Hacé una pausa acá. — 여기서 멈춰.',
    relatedLessonIds: ['les2_04'],
  },
  t_lider: {
    id: 't_lider', term: 'Líder', literalMeaning: '리더',
    tangoMeaning: '방향을 제안하는 사람. 명령이 아닌 초대.',
    bodyInterpretation: '"이쪽으로 가볼까?"를 가슴으로 전하는 사람. 파트너의 반응을 듣는 사람.',
    example: 'El líder propone, no ordena. — 리더는 제안하지, 명령하지 않아.',
    relatedLessonIds: ['les2_05'],
  },
  t_seguidor: {
    id: 't_seguidor', term: 'Seguidor/a', literalMeaning: '팔로워',
    tangoMeaning: '리드를 듣고 해석하는 사람. 수동이 아닌 능동.',
    bodyInterpretation: '리드를 "읽는" 사람. 따라가는 게 아니라 대화에 응답하는 것.',
    example: 'El seguidor escucha con el cuerpo. — 팔로워는 몸으로 듣는다.',
    relatedLessonIds: ['les2_05'],
  },
  t_marca: {
    id: 't_marca', term: 'Marca', literalMeaning: '표시/신호',
    tangoMeaning: '리더가 가슴으로 전달하는 의도. 팔로 밀지 않고 몸의 방향으로 제안.',
    bodyInterpretation: '가슴이 먼저 방향을 바꾸면, 팔로워가 그 의도를 읽는다. 보이지 않는 대화.',
    example: 'La marca sale del pecho. — 마르카는 가슴에서 나온다.',
    relatedLessonIds: ['les2_06'],
  },
  t_salida: {
    id: 't_salida', term: 'Salida', literalMeaning: '출구/출발',
    tangoMeaning: '탱고 시작 패턴. 포즈에서 "밖으로 나가는" 첫 스텝.',
    bodyInterpretation: '음악과 처음 만나는 순간. 의도가 담긴 첫걸음의 방향.',
    example: 'Empezamos con la salida. — 살리다로 시작하자.',
    relatedLessonIds: ['les2_07'],
  },
  t_compas: {
    id: 't_compas', term: 'Compás', literalMeaning: '박자',
    tangoMeaning: '탱고 음악의 리듬 단위. 발이 바닥을 만나는 타이밍.',
    bodyInterpretation: '음악을 발바닥으로 느끼는 것. 강박에 걷고, 약박에 장식을 넣고.',
    example: 'Caminá con el compás. — 박자에 맞춰 걸어.',
    relatedLessonIds: ['les2_09'],
  },

  // =====================================================
  // LEVEL 3 — 8 terms
  // =====================================================

  t_ocho: { id: 't_ocho', term: 'Ocho', literalMeaning: '숫자 8', tangoMeaning: '바닥에 8자를 그리듯 피벗하며 교차하는 스텝. 팔로워의 대표적 표현.', bodyInterpretation: '발 모양이 아니라 골반 회전의 결과. 축이 세워져야 궤적이 나온다.', example: 'Hacé un ocho para adelante. — 앞으로 오초 해.', relatedLessonIds: ['les3_01', 'les3_02'] },
  t_pivote: { id: 't_pivote', term: 'Pivote', literalMeaning: '피벗/축 회전', tangoMeaning: '한 발의 볼을 축으로 몸을 회전시키는 기술.', bodyInterpretation: '발바닥 한 점에 모든 무게를 모으는 감각. 피벗이 좋으면 오초가 예뻐진다.', example: 'Prepará el pivote. — 피벗 준비해.', relatedLessonIds: ['les3_01'] },
  t_cruce: { id: 't_cruce', term: 'Cruce', literalMeaning: '교차', tangoMeaning: '다리를 모아 교차하는 클래식한 순간. 살리다의 마무리에 자주 나온다.', bodyInterpretation: '무게가 완전히 옮겨간 뒤의 조용한 마무리. 서두르지 않는 것이 핵심.', example: 'Esperá el cruce. — 교차 타이밍을 기다려.', relatedLessonIds: ['les3_03'] },
  t_giro: { id: 't_giro', term: 'Giro', literalMeaning: '회전', tangoMeaning: '파트너 주위를 원으로 도는 동작. 앞-옆-뒤 3스텝으로 구성.', bodyInterpretation: '축을 세우고, 몸 전체가 하나로 도는 감각. 서두르면 무너진다.', example: 'Empezá el giro. — 회전 시작해.', relatedLessonIds: ['les3_04', 'les3_05'] },
  t_adorno: { id: 't_adorno', term: 'Adorno', literalMeaning: '장식', tangoMeaning: '음악 틈에 넣는 자유로운 발 표현. 기본 위에 얹는 내 개성.', bodyInterpretation: '없어도 춤은 성립한다. 있으면 춤에 나만의 색이 생긴다. 음악이 허락하는 순간에만.', example: 'Es tu momento para el adorno. — 아도르노를 넣을 네 순간이야.', relatedLessonIds: ['les3_07'] },
  t_sacada: { id: 't_sacada', term: 'Sacada', literalMeaning: '빼앗기', tangoMeaning: '파트너 자리에 들어가는 동작. 침입이 아니라 초대.', bodyInterpretation: '공간을 받아서 들어가는 것. 밀지 않고, 파트너가 떠난 자리로 자연스럽게.', example: 'Entrá con claridad. — 명확하게 들어가.', relatedLessonIds: ['les3_08'] },
  t_parada: { id: 't_parada', term: 'Parada', literalMeaning: '정지', tangoMeaning: '파트너의 발을 부드럽게 멈추는 동작. 멈춤 안에서 장식이 시작된다.', bodyInterpretation: '브레이크가 아니라 초대. "여기서 잠깐, 뭔가 해볼래?"', example: 'Hacé una parada. — 파라다를 해.', relatedLessonIds: ['les3_09'] },
  t_boleo: { id: 't_boleo', term: 'Boleo', literalMeaning: '던지기', tangoMeaning: '에너지가 다리를 통해 자유롭게 빠지는 동작.', bodyInterpretation: '의도적으로 "하는" 게 아니라 "나오게 하는" 것. 억지로 크게 하면 위험.', example: 'Dejá que salga natural. — 자연스럽게 나오게 해.', relatedLessonIds: ['les3_10'] },

  // =====================================================
  // LEVEL 4 — 5 terms
  // =====================================================

  t_sensacion: { id: 't_sensacion', term: 'Sensación', literalMeaning: '감각/느낌', tangoMeaning: '탱고에서 가장 중요한 정보 채널. 눈이 아니라 몸으로 듣는 것.', bodyInterpretation: '리드가 맞는지, 연결이 살아있는지를 판단하는 건 시각이 아니라 촉각.', example: 'No lo siento bien. — 느낌이 안 와.', relatedLessonIds: ['les4_05'] },
  t_tiempo: { id: 't_tiempo', term: 'Tiempo', literalMeaning: '시간/타이밍', tangoMeaning: '동작의 정확한 진입 시점. 음악과 파트너 사이에서 "지금!"을 느끼는 것.', bodyInterpretation: '빠른 것도 아니고 느린 것도 아닌, 딱 맞는 순간. 성급함이 가장 큰 적.', example: 'Entraste antes. — 너무 일찍 들어왔어.', relatedLessonIds: ['les4_07'] },
  t_practica: { id: 't_practica', term: 'Práctica', literalMeaning: '연습', tangoMeaning: '수업이 아닌, 자유롭게 연습하는 시간/장소. 실수해도 되는 안전한 공간.', bodyInterpretation: '프랙티카에서는 멈추고, 다시 하고, 질문해도 괜찮다. 밀롱가와 다른 공간.', example: '¿Vamos a la práctica? — 프랙티카 갈까?', relatedLessonIds: ['les4_10'] },
  t_rotacion: { id: 't_rotacion', term: 'Rotación', literalMeaning: '회전/로테이션', tangoMeaning: '수업에서 파트너를 바꿔가며 연습하는 것.', bodyInterpretation: '다른 몸을 느끼며 적응력을 키우는 시간. 불편할 수 있지만 성장의 핵심.', example: '¿Cambiamos? — 바꿀까요?', relatedLessonIds: ['les4_11'] },
  t_correccion: { id: 't_correccion', term: 'Corrección', literalMeaning: '교정', tangoMeaning: '선생님이나 파트너의 피드백. 틀렸다는 비난이 아니라 더 나아지는 방향.', bodyInterpretation: '"이건 안 돼"가 아니라 "이쪽으로 해볼까?"가 좋은 교정.', example: 'Ahora está mejor. — 이제 더 나아.', relatedLessonIds: ['les4_02', 'les4_03'] },

  // =====================================================
  // LEVEL 5 — 9 terms
  // =====================================================

  t_milonga: { id: 't_milonga', term: 'Milonga', literalMeaning: '밀롱가', tangoMeaning: '탱고 사교 댄스 장소/이벤트. 또한 탱고 장르 이름이기도.', bodyInterpretation: '수업이 아닌 진짜 춤을 추는 곳. 긴장되지만 설레는 공간.', example: 'Me gusta esta milonga. — 이 밀롱가 좋아요.', relatedLessonIds: ['les5_01'] },
  t_cabeceo: { id: 't_cabeceo', term: 'Cabeceo', literalMeaning: '고갯짓', tangoMeaning: '눈맞춤+고개 끄덕임으로 춤을 신청하는 전통 방식.', bodyInterpretation: '말 없이 시선만으로 "같이 출래요?"를 묻고 답하는 것. 거절도 눈으로.', example: 'Te hice un cabeceo. — 카베세오 했어요.', relatedLessonIds: ['les5_03'] },
  t_tanda: { id: 't_tanda', term: 'Tanda', literalMeaning: '한 세트', tangoMeaning: '같은 오케스트라의 곡 3~4곡. 한 파트너와 추는 단위.', bodyInterpretation: '하나의 대화. 곡마다 깊어지는 연결의 시간. 중간에 빠지면 실례.', example: '¿Querés bailar esta tanda? — 이 탄다 같이 출래요?', relatedLessonIds: ['les5_04', 'les5_09', 'les5_12'] },
  t_cortina: { id: 't_cortina', term: 'Cortina', literalMeaning: '커튼', tangoMeaning: '탄다 사이 짧은 비탱고 음악. 파트너 교체 신호.', bodyInterpretation: '커튼이 내려오듯 지금의 연결을 부드럽게 마무리하는 순간.', example: 'Ya es la cortina. — 코르티나야.', relatedLessonIds: ['les5_09'] },
  t_vals: { id: 't_vals', term: 'Vals', literalMeaning: '왈츠', tangoMeaning: '탱고 왈츠. 3/4박의 부드러운 리듬.', bodyInterpretation: '부드럽고 흐르는 느낌. 회전과 잘 어울리는 가벼운 춤.', example: 'Me gusta bailar vals. — 왈츠 추는 게 좋아요.', relatedLessonIds: ['les5_06'] },
  t_orquesta: { id: 't_orquesta', term: 'Orquesta', literalMeaning: '오케스트라', tangoMeaning: '탱고 연주 악단. 각 오케스트라마다 춤의 느낌이 달라진다.', bodyInterpretation: '디 사를리=단정, 다리엔소=리듬, 트로일로=서정, 푸글리에세=극적.', example: '¿De qué orquesta es? — 어느 오케스트라예요?', relatedLessonIds: ['les5_06'] },
  t_pista: { id: 't_pista', term: 'Pista', literalMeaning: '바닥/트랙', tangoMeaning: '춤을 추는 공간. 나만의 공간이 아니라 모두가 공유하는 곳.', bodyInterpretation: '좁은 바닥에서 큰 동작은 위험. 공간을 나누는 것도 실력.', example: 'La pista está llena. — 바닥이 꽉 찼어.', relatedLessonIds: ['les5_08'] },
  t_ronda: { id: 't_ronda', term: 'Ronda', literalMeaning: '원/순환', tangoMeaning: '반시계 방향으로 도는 플로어 흐름.', bodyInterpretation: '모두가 같은 방향으로 흐르는 것이 예의이자 안전.', example: 'Cuidemos la ronda. — 론다를 지키자.', relatedLessonIds: ['les5_14'] },
  t_milonguero: { id: 't_milonguero', term: 'Milonguero/a', literalMeaning: '밀롱게로', tangoMeaning: '밀롱가의 단골. 탱고를 생활로 즐기는 사람.', bodyInterpretation: '기술보다 음악과 연결을 아는 사람. 문화를 체득한 사람.', example: 'Es un milonguero de verdad. — 진짜 밀롱게로야.', relatedLessonIds: ['les5_13'] },
};

export function getTermById(id: string): TangoTerm | undefined {
  return tangoTerms[id];
}

export function getTermsForLesson(termIds: string[]): TangoTerm[] {
  return termIds.map((id) => tangoTerms[id]).filter(Boolean);
}
