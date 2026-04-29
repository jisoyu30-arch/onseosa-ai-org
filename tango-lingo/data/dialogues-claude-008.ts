// Claude 직접 작성 dialogue — 배치 008
// 30개 (운명·영성·교육·교통·결혼·부모자녀·형제·친구·글로벌·삶의 끝)
import type { DialogueExample } from './dialogues-l1';

export const dialoguesClaude008: Record<string, DialogueExample> = {
  // ============ 운명·우연 (3) ============
  daic_211: {
    id: 'daic_211', lessonId: 'ai', situation: '운명 — 우연한 만남',
    lines: [
      { speaker: 'Yo', spanish: 'Te encontré justo cuando lo necesitaba.', korean: '딱 필요할 때 널 만났어.', english: 'I found you just when I needed it.', chinese: '我正好在需要时遇见你。' },
      { speaker: 'Amiga', spanish: 'Las cosas pasan por algo, ¿no?', korean: '일은 다 이유가 있는 거지, 그치?', english: 'Things happen for a reason, right?', chinese: '事情发生都有原因，对吧？' },
    ],
  },
  daic_212: {
    id: 'daic_212', lessonId: 'ai', situation: '운명 — 첫 인상 회상',
    lines: [
      { speaker: 'Amigo', spanish: '¿Te acordás cuando me viste por primera vez?', korean: '나 처음 봤을 때 기억해?', english: 'Remember when you saw me first time?', chinese: '记得你第一次见我吗？' },
      { speaker: 'Yo', spanish: 'Pensé que eras tímido, qué equivocada estaba.', korean: '소심하다 생각했어, 정말 잘못 알았지.', english: "I thought you were shy, how wrong I was.", chinese: '我以为你很害羞，太想错了。' },
    ],
  },
  daic_213: {
    id: 'daic_213', lessonId: 'ai', situation: '운명 — 인연 깊이 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'A veces creo que en otra vida fuimos amigos.', korean: '가끔 전생에 친구였던 것 같아.', english: 'Sometimes I think we were friends in another life.', chinese: '有时觉得我们前世就是朋友。' },
      { speaker: 'Amiga', spanish: 'Yo también lo siento, hay almas que se reconocen.', korean: '나도 그래, 알아보는 영혼들이 있어.', english: 'I feel it too, there are souls that recognize each other.', chinese: '我也感觉到，有些灵魂彼此认得。' },
      { speaker: 'Yo', spanish: 'El tango es donde se reconocen.', korean: '탱고가 그 알아봄의 장소지.', english: 'Tango is where they recognize each other.', chinese: '探戈就是它们相认的地方。' },
    ],
  },

  // ============ 영성·감각 (3) ============
  daic_214: {
    id: 'daic_214', lessonId: 'ai', situation: '영성 — 직감',
    lines: [
      { speaker: 'Yo', spanish: 'Tuve una corazonada y vine a esta milonga.', korean: '직감이 들어서 이 밀롱가 왔어.', english: 'I had a hunch and came to this milonga.', chinese: '我有种直觉就来这个米隆加了。' },
      { speaker: 'Amiga', spanish: 'Esas corazonadas no fallan.', korean: '그런 직감 안 틀려.', english: "Those hunches don't fail.", chinese: '这种直觉不会错。' },
    ],
  },
  daic_215: {
    id: 'daic_215', lessonId: 'ai', situation: '영성 — 분위기 읽기',
    lines: [
      { speaker: 'Amigo', spanish: 'Hoy la pista tiene una energía especial.', korean: '오늘 댄스플로어 에너지 특별해.', english: 'The floor has a special energy today.', chinese: '今天舞池能量特别。' },
      { speaker: 'Yo', spanish: 'Sí, todos están en el mismo respiro.', korean: '맞아, 다 같은 호흡으로.', english: 'Yes, everyone\'s in the same breath.', chinese: '是的，大家在同一呼吸里。' },
    ],
  },
  daic_216: {
    id: 'daic_216', lessonId: 'ai', situation: '영성 — 깊은 연결 (B1)',
    lines: [
      { speaker: 'Tanguero', spanish: 'En esa tanda sentí que no estábamos solos en la pista.', korean: '그 탄다에서 우리만 댄스플로어에 있는 게 아니란 느낌이었어.', english: "In that tanda I felt we weren't alone on the floor.", chinese: '那支组曲里我感觉我们不止在舞池上。' },
      { speaker: 'Tanguera', spanish: 'A mí también me pasó, como si bailaran con nosotros.', korean: '나도 그랬어, 누군가 같이 추는 것 같았어.', english: "It happened to me too, as if they danced with us.", chinese: '我也是，好像有人和我们一起跳。' },
      { speaker: 'Tanguero', spanish: 'Algunos lo llaman magia, yo lo llamo tango.', korean: '누군 그걸 마법이라 부르고, 난 탱고라고 불러.', english: 'Some call it magic, I call it tango.', chinese: '有人叫它魔法，我叫它探戈。' },
    ],
  },

  // ============ 학교·교육 (3) ============
  daic_217: {
    id: 'daic_217', lessonId: 'ai', situation: '학창 — 좋아한 과목',
    lines: [
      { speaker: 'Amiga', spanish: '¿Qué materia te gustaba en la escuela?', korean: '학교에서 무슨 과목 좋아했어?', english: 'What subject did you like in school?', chinese: '上学时你喜欢什么科目？' },
      { speaker: 'Yo', spanish: 'Literatura, siempre la literatura.', korean: '문학, 늘 문학이었지.', english: 'Literature, always literature.', chinese: '文学，一直是文学。' },
    ],
  },
  daic_218: {
    id: 'daic_218', lessonId: 'ai', situation: '학창 — 좋은 선생님',
    lines: [
      { speaker: 'Amigo', spanish: 'Tuve un profe que cambió mi vida.', korean: '내 인생 바꾼 선생님 한 분 있었어.', english: 'I had a teacher who changed my life.', chinese: '我有一位老师改变了我的人生。' },
      { speaker: 'Yo', spanish: 'Esos maestros son raros y valiosos.', korean: '그런 스승들 드물고 귀해.', english: 'Those teachers are rare and precious.', chinese: '这种老师罕见又珍贵。' },
    ],
  },
  daic_219: {
    id: 'daic_219', lessonId: 'ai', situation: '학창 — 시험 트라우마 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Todavía sueño con exámenes que no estudié.', korean: '아직도 공부 안 한 시험 꿈 꿔.', english: "I still dream about exams I didn't study for.", chinese: '我还梦见没复习的考试。' },
      { speaker: 'Amiga', spanish: 'Ese sueño es universal, todos lo tienen.', korean: '그 꿈은 보편적이야, 다 꿔.', english: "That dream is universal, everyone has it.", chinese: '这个梦很普遍，大家都做。' },
      { speaker: 'Yo', spanish: 'Por suerte ahora solo tengo exámenes de tango.', korean: '다행히 이제 탱고 시험만 봐.', english: "Luckily now I only have tango exams.", chinese: '好在现在只有探戈考试了。' },
    ],
  },

  // ============ 교통 깊이 (3) ============
  daic_220: {
    id: 'daic_220', lessonId: 'ai', situation: '교통 — 운전 안 함',
    lines: [
      { speaker: 'Amigo', spanish: '¿Tenés auto?', korean: '차 있어?', english: 'Do you have a car?', chinese: '你有车吗？' },
      { speaker: 'Yo', spanish: 'No, prefiero el transporte público.', korean: '없어, 대중교통 더 좋아해.', english: 'No, I prefer public transport.', chinese: '没有，我喜欢公共交通。' },
    ],
  },
  daic_221: {
    id: 'daic_221', lessonId: 'ai', situation: '교통 — 자전거 좋아함',
    lines: [
      { speaker: 'Amiga', spanish: '¿Cómo venís a la milonga?', korean: '밀롱가 어떻게 와?', english: 'How do you come to milonga?', chinese: '你怎么来米隆加？' },
      { speaker: 'Yo', spanish: 'En bici, dejo los zapatos en una mochila.', korean: '자전거로, 신발은 가방에 넣고.', english: 'By bike, I keep my shoes in a backpack.', chinese: '骑车来，鞋放包里。' },
    ],
  },
  daic_222: {
    id: 'daic_222', lessonId: 'ai', situation: '교통 — 도시 비교 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'En Seúl el subte es ultra moderno, en Buenos Aires es vintage.', korean: '서울 지하철은 최신, 부에노스는 빈티지.', english: 'In Seoul the subway is ultra-modern, in Buenos Aires it\'s vintage.', chinese: '首尔地铁超现代，布宜诺斯艾利斯很复古。' },
      { speaker: 'Amigo', spanish: 'Tienen su encanto los vagones viejos.', korean: '오래된 차량도 매력 있어.', english: 'The old cars have their charm.', chinese: '老车厢有它的魅力。' },
      { speaker: 'Yo', spanish: 'Sobre todo cuando tocan música porteña adentro.', korean: '특히 안에서 포르테뇨 음악 나올 때.', english: "Especially when porteño music plays inside.", chinese: '尤其车厢里放波尔泰尼奥音乐时。' },
    ],
  },

  // ============ 결혼·이혼 (3) ============
  daic_223: {
    id: 'daic_223', lessonId: 'ai', situation: '결혼 — 결혼 토론',
    lines: [
      { speaker: 'Amiga', spanish: '¿Pensás en casarte algún día?', korean: '언젠가 결혼 생각해?', english: 'Do you think about getting married someday?', chinese: '你想过有天结婚吗？' },
      { speaker: 'Yo', spanish: 'Si encuentro a la persona correcta, sí.', korean: '맞는 사람 만나면 응.', english: 'If I find the right person, yes.', chinese: '遇到对的人，会的。' },
    ],
  },
  daic_224: {
    id: 'daic_224', lessonId: 'ai', situation: '이혼 — 가벼운 언급',
    lines: [
      { speaker: 'Amigo', spanish: 'Estoy divorciado hace dos años.', korean: '이혼한 지 2년 됐어.', english: "I've been divorced for two years.", chinese: '我离婚两年了。' },
      { speaker: 'Yo', spanish: '¿Y cómo lo llevás?', korean: '어떻게 지내?', english: 'And how are you handling it?', chinese: '你过得怎么样？' },
      { speaker: 'Amigo', spanish: 'Mejor de lo que pensaba, el tango ayudó mucho.', korean: '생각보단 괜찮아, 탱고가 많이 도와줬어.', english: 'Better than I thought, tango helped a lot.', chinese: '比想的好，探戈帮了大忙。' },
    ],
  },
  daic_225: {
    id: 'daic_225', lessonId: 'ai', situation: '결혼 — 깊은 대화 (B1)',
    lines: [
      { speaker: 'Veterana', spanish: 'Después de 30 años casada aprendí que el amor es una decisión diaria.', korean: '30년 결혼생활 후 배웠어, 사랑은 매일 하는 결정이야.', english: "After 30 years married I learned love is a daily decision.", chinese: '结婚三十年后我懂了，爱是每天的选择。' },
      { speaker: 'Yo', spanish: 'Como bailar bien, no es talento, es práctica.', korean: '잘 추는 것처럼, 재능 아니고 연습.', english: 'Like dancing well, not talent, practice.', chinese: '就像跳舞好，不是天赋，是练习。' },
      { speaker: 'Veterana', spanish: 'Exacto, todo lo bueno requiere atención constante.', korean: '맞아, 좋은 건 다 끊임없는 주의 필요해.', english: 'Exactly, all good things require constant attention.', chinese: '没错，所有美好都需要持续关注。' },
    ],
  },

  // ============ 부모-자녀 관계 (3) ============
  daic_226: {
    id: 'daic_226', lessonId: 'ai', situation: '부모 — 어머니 자랑',
    lines: [
      { speaker: 'Yo', spanish: 'Mi mamá tiene 75 años y todavía es la persona más fuerte que conozco.', korean: '엄마 75세인데 아직도 내가 아는 가장 강한 사람이야.', english: 'My mom is 75 and still the strongest person I know.', chinese: '我妈75岁，依然是我认识最坚强的人。' },
      { speaker: 'Amiga', spanish: 'Las madres son nuestra primera maestra.', korean: '엄마는 우리 첫 스승이지.', english: 'Mothers are our first teacher.', chinese: '母亲是我们第一位老师。' },
    ],
  },
  daic_227: {
    id: 'daic_227', lessonId: 'ai', situation: '자녀 — 십대 자녀',
    lines: [
      { speaker: 'Amigo', spanish: 'Mi hijo adolescente apenas me habla.', korean: '십대 아들이 거의 말 안 해.', english: 'My teenage son barely talks to me.', chinese: '我十几岁的儿子几乎不和我说话。' },
      { speaker: 'Yo', spanish: 'Es la fase, después vuelven.', korean: '그 시기야, 나중에 돌아와.', english: "It's the phase, they come back later.", chinese: '阶段性的，以后会回来。' },
    ],
  },
  daic_228: {
    id: 'daic_228', lessonId: 'ai', situation: '부모 — 아버지 그리움 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Mi papá murió cuando yo era chica, pero lo siento conmigo cuando bailo.', korean: '아빠는 내가 어렸을 때 돌아가셨는데, 출 땐 같이 있는 것 같아.', english: 'My dad died when I was little, but I feel him with me when I dance.', chinese: '我爸在我小时候去世了，但跳舞时我感觉他在身边。' },
      { speaker: 'Amiga', spanish: 'Hay vínculos que la muerte no rompe.', korean: '죽음으로도 끊기지 않는 연결이 있어.', english: "There are bonds death doesn't break.", chinese: '有些联系死亡也无法切断。' },
      { speaker: 'Yo', spanish: 'En cada abrazo lo siento un poquito.', korean: '매 아브라소에 조금씩 느껴.', english: 'In every embrace I feel him a bit.', chinese: '每次拥抱我都能感觉到他。' },
    ],
  },

  // ============ 형제·자매 (3) ============
  daic_229: {
    id: 'daic_229', lessonId: 'ai', situation: '형제 — 사이 좋음',
    lines: [
      { speaker: 'Amigo', spanish: '¿Tenés hermanos?', korean: '형제 있어?', english: 'Do you have siblings?', chinese: '你有兄弟姐妹吗？' },
      { speaker: 'Yo', spanish: 'Una hermana mayor, somos muy unidas.', korean: '언니 한 명, 정말 친해.', english: 'An older sister, we\'re very close.', chinese: '一个姐姐，我们很亲近。' },
    ],
  },
  daic_230: {
    id: 'daic_230', lessonId: 'ai', situation: '형제 — 외동',
    lines: [
      { speaker: 'Amiga', spanish: 'Soy hija única, a veces extraño tener hermanos.', korean: '외동인데, 가끔 형제 있었으면 해.', english: "I'm an only child, sometimes I miss having siblings.", chinese: '我是独生女，有时希望有兄弟姐妹。' },
      { speaker: 'Yo', spanish: 'Por eso los amigos del tango son como familia.', korean: '그래서 탱고 친구들이 가족 같지.', english: "That's why tango friends are like family.", chinese: '所以探戈朋友就像家人。' },
    ],
  },
  daic_231: {
    id: 'daic_231', lessonId: 'ai', situation: '형제 — 거리감 회복 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Hace años que no me hablo bien con mi hermano, pero quiero arreglarlo.', korean: '오빠랑 몇 년째 잘 안 지내, 풀고 싶어.', english: "I haven't been on good terms with my brother for years, but I want to fix it.", chinese: '我和哥哥多年关系不好，但我想修复。' },
      { speaker: 'Amiga', spanish: 'El primer paso es siempre el más difícil.', korean: '첫 발걸음이 늘 제일 어려워.', english: "The first step is always the hardest.", chinese: '第一步总是最难。' },
      { speaker: 'Yo', spanish: 'Voy a llamarlo este finde.', korean: '이번 주말 전화할게.', english: "I'll call him this weekend.", chinese: '我这周末打电话给他。' },
    ],
  },

  // ============ 친구 깊이 (3) ============
  daic_232: {
    id: 'daic_232', lessonId: 'ai', situation: '친구 — 절친 자랑',
    lines: [
      { speaker: 'Amiga', spanish: 'Mi mejor amiga vive en Tokio, nos llamamos cada semana.', korean: '절친이 도쿄 사는데 매주 통화해.', english: 'My best friend lives in Tokyo, we call every week.', chinese: '我闺蜜住东京，我们每周通话。' },
      { speaker: 'Yo', spanish: 'La distancia no importa cuando hay confianza.', korean: '신뢰 있으면 거리는 문제 안 돼.', english: "Distance doesn't matter when there's trust.", chinese: '有信任时距离不重要。' },
    ],
  },
  daic_233: {
    id: 'daic_233', lessonId: 'ai', situation: '친구 — 절교 후',
    lines: [
      { speaker: 'Amigo', spanish: 'Perdí una amistad importante el año pasado.', korean: '작년에 중요한 우정 잃었어.', english: 'I lost an important friendship last year.', chinese: '去年我失去了一份重要友谊。' },
      { speaker: 'Yo', spanish: 'Lo siento, los duelos de amistad son los más callados.', korean: '안타깝다, 우정의 상실은 가장 조용해.', english: "I'm sorry, friendship grief is the quietest.", chinese: '很遗憾，友谊的失去最为静默。' },
    ],
  },
  daic_234: {
    id: 'daic_234', lessonId: 'ai', situation: '친구 — 평생 친구 (B1)',
    lines: [
      { speaker: 'Veterana', spanish: 'Bailo con la misma compañera desde hace 20 años.', korean: '20년째 같은 파트너랑 춰.', english: "I've been dancing with the same partner for 20 years.", chinese: '我和同一位舞伴跳了二十年。' },
      { speaker: 'Yo', spanish: '¡Eso es increíble! ¿Cuál es el secreto?', korean: '대단해! 비결이 뭐야?', english: "That's amazing! What's the secret?", chinese: '太了不起了！秘诀是什么？' },
      { speaker: 'Veterana', spanish: 'Crecer juntas sin pretender que el otro no cambie.', korean: '상대가 안 변한 척 안 하고 같이 성장하기.', english: 'Growing together without pretending the other doesn\'t change.', chinese: '一起成长，不假装对方不会变。' },
    ],
  },

  // ============ 글로벌 친구 (3) ============
  daic_235: {
    id: 'daic_235', lessonId: 'ai', situation: '글로벌 — 외국 친구 자랑',
    lines: [
      { speaker: 'Yo', spanish: 'Tengo amigos tangueros en doce países.', korean: '12개국에 탱고 친구 있어.', english: 'I have tango friends in twelve countries.', chinese: '我在十二个国家有探戈朋友。' },
      { speaker: 'Amigo', spanish: 'Esa es la verdadera ciudadanía mundial.', korean: '그게 진짜 세계시민이지.', english: "That's true world citizenship.", chinese: '这才是真正的世界公民。' },
    ],
  },
  daic_236: {
    id: 'daic_236', lessonId: 'ai', situation: '글로벌 — 언어 차이 극복',
    lines: [
      { speaker: 'Amiga', spanish: 'Bailé con un japonés que no hablaba español.', korean: '스페인어 못 하는 일본인이랑 췄어.', english: "I danced with a Japanese guy who didn't speak Spanish.", chinese: '我和一个不会西班牙语的日本人跳了。' },
      { speaker: 'Yo', spanish: 'El tango habla por sí mismo.', korean: '탱고는 스스로 말하지.', english: 'Tango speaks for itself.', chinese: '探戈自己会说话。' },
    ],
  },
  daic_237: {
    id: 'daic_237', lessonId: 'ai', situation: '글로벌 — 문화 충격 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'En Japón los códigos son tan estrictos que daba miedo.', korean: '일본은 규칙이 너무 엄격해서 무서웠어.', english: "In Japan the codes were so strict it was scary.", chinese: '在日本规矩严到让人害怕。' },
      { speaker: 'Yo', spanish: 'Cada cultura adapta el tango a su forma de ser.', korean: '각 문화가 자기 방식대로 탱고 적응시켜.', english: 'Each culture adapts tango to its way of being.', chinese: '每种文化都用自己的方式改造探戈。' },
      { speaker: 'Amigo', spanish: 'Eso es lo lindo, mil colores del mismo abrazo.', korean: '그게 아름다워, 같은 아브라소의 천 가지 색.', english: "That's the beauty, a thousand colors of the same embrace.", chinese: '这就是美，同一拥抱的千种色彩。' },
    ],
  },

  // ============ 삶·죽음 토론 (3) ============
  daic_238: {
    id: 'daic_238', lessonId: 'ai', situation: '삶 — 의미 묻기',
    lines: [
      { speaker: 'Amigo', spanish: '¿Qué le da sentido a tu vida?', korean: '네 인생에 의미 주는 게 뭐야?', english: 'What gives your life meaning?', chinese: '什么给你的生活意义？' },
      { speaker: 'Yo', spanish: 'Las conexiones humanas, sobre todo en la pista.', korean: '인간 관계, 특히 댄스플로어에서.', english: 'Human connections, especially on the floor.', chinese: '人与人的连接，尤其在舞池上。' },
    ],
  },
  daic_239: {
    id: 'daic_239', lessonId: 'ai', situation: '삶 — 후회 없이',
    lines: [
      { speaker: 'Veterano', spanish: 'A los 70 años aprendí a no posponer nada.', korean: '70살에 미루지 않는 법 배웠어.', english: "At 70 I learned not to postpone anything.", chinese: '七十岁时我学会不再拖延。' },
      { speaker: 'Yo', spanish: 'Es un consejo precioso, gracias.', korean: '귀한 조언이야, 고마워.', english: "That's precious advice, thank you.", chinese: '宝贵的建议，谢谢。' },
    ],
  },
  daic_240: {
    id: 'daic_240', lessonId: 'ai', situation: '삶 — 죽음 가벼운 토론 (B1)',
    lines: [
      { speaker: 'Veterana', spanish: 'Cuando muera, quiero que pongan tango en mi velorio.', korean: '나 죽으면 장례식에 탱고 틀어줬으면 해.', english: 'When I die, I want them to play tango at my wake.', chinese: '我死后希望守灵时放探戈。' },
      { speaker: 'Yo', spanish: '¿Cuál tema?', korean: '어떤 곡?', english: 'Which song?', chinese: '哪一首？' },
      { speaker: 'Veterana', spanish: '"Adiós Nonino", que la gente baile y celebre que viví.', korean: '"아디오스 노니노", 사람들 춤추고 내가 살았음을 축하하길.', english: '"Adiós Nonino", let people dance and celebrate that I lived.', chinese: '《永别了，奶奶》，让人跳舞庆祝我曾活过。' },
    ],
  },
};
