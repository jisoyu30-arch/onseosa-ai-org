// Claude 직접 작성 dialogue — 배치 006
// 30개 (첨단기술·환경의식·정치미묘·젠더·정신건강·만남·토론·추억·미래·작별)
import type { DialogueExample } from './dialogues-l1';

export const dialoguesClaude006: Record<string, DialogueExample> = {
  // ============ 첨단기술 (3) ============
  daic_151: {
    id: 'daic_151', lessonId: 'ai', situation: '기술 — 앱 추천',
    lines: [
      { speaker: 'Amigo', spanish: '¿Usás alguna app para aprender tango?', korean: '탱고 배우는 앱 써?', english: 'Do you use any app to learn tango?', chinese: '你用什么应用学探戈？' },
      { speaker: 'Yo', spanish: 'Sí, una coreana muy buena.', korean: '응, 한국 거 진짜 좋은 거.', english: 'Yes, a Korean one that\'s really good.', chinese: '用，一个韩国的很好用。' },
    ],
  },
  daic_152: {
    id: 'daic_152', lessonId: 'ai', situation: '기술 — AI 토론',
    lines: [
      { speaker: 'Amiga', spanish: '¿Probaste hablar con ChatGPT?', korean: 'ChatGPT랑 얘기해봤어?', english: 'Have you tried talking to ChatGPT?', chinese: '你用过ChatGPT聊天吗？' },
      { speaker: 'Yo', spanish: 'Todos los días, me ayuda con español.', korean: '매일, 스페인어 배우는 데 도움 돼.', english: 'Every day, it helps me with Spanish.', chinese: '每天用，帮我学西班牙语。' },
    ],
  },
  daic_153: {
    id: 'daic_153', lessonId: 'ai', situation: '기술 — 영상 통화 깊이 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Tengo clases de tango por Zoom con un profe en Buenos Aires.', korean: '부에노스 선생님이랑 줌으로 탱고 수업 받아.', english: 'I have tango classes via Zoom with a teacher in Buenos Aires.', chinese: '我和布宜诺斯艾利斯的老师上Zoom探戈课。' },
      { speaker: 'Amiga', spanish: '¿Se puede aprender así, sin tocar?', korean: '안 만지고 그렇게 배워질까?', english: 'Can you learn like that, without touching?', chinese: '不接触能学得会吗？' },
      { speaker: 'Yo', spanish: 'La técnica individual sí, el abrazo no.', korean: '개인 테크닉은 되지만 아브라소는 안 돼.', english: 'Individual technique yes, the embrace no.', chinese: '个人技术可以，但拥抱不行。' },
    ],
  },

  // ============ 환경 의식 깊이 (3) ============
  daic_154: {
    id: 'daic_154', lessonId: 'ai', situation: '환경 — 비행 죄책감',
    lines: [
      { speaker: 'Yo', spanish: 'Me da culpa volar tanto a festivales.', korean: '페스티벌 비행기 자주 타는 거 죄책감 들어.', english: 'I feel guilty flying so much to festivals.', chinese: '我对经常飞去节日感到内疚。' },
      { speaker: 'Amigo', spanish: 'Compensá con menos vuelos cortos en casa.', korean: '집에서 단거리 비행 줄여서 보상해.', english: 'Compensate with fewer short flights at home.', chinese: '在家减少短途飞行来弥补。' },
    ],
  },
  daic_155: {
    id: 'daic_155', lessonId: 'ai', situation: '환경 — 미니멀',
    lines: [
      { speaker: 'Amiga', spanish: 'Estoy regalando ropa que no uso.', korean: '안 입는 옷 나눠주고 있어.', english: "I'm giving away clothes I don't use.", chinese: '我在送掉不穿的衣服。' },
      { speaker: 'Yo', spanish: 'Buena, yo tengo demasiados zapatos de tango.', korean: '좋은 생각, 나는 탱고 신발이 너무 많아.', english: 'Good, I have too many tango shoes.', chinese: '不错，我探戈鞋太多了。' },
    ],
  },
  daic_156: {
    id: 'daic_156', lessonId: 'ai', situation: '환경 — 기후 위기 토론 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'A veces siento que los esfuerzos individuales no alcanzan.', korean: '가끔 개인 노력으론 부족하단 느낌이야.', english: 'Sometimes I feel individual efforts aren\'t enough.', chinese: '有时觉得个人努力不够。' },
      { speaker: 'Yo', spanish: 'Sin presión política nada cambia, eso es cierto.', korean: '정치적 압박 없인 변화 없어, 그건 사실.', english: 'Without political pressure nothing changes, that\'s true.', chinese: '没有政治压力什么都不会变，这是真的。' },
      { speaker: 'Amigo', spanish: 'Igual hay que hacer la parte que nos toca.', korean: '그래도 우리 몫은 해야 해.', english: 'Still we have to do our part.', chinese: '但还是要做自己那部分。' },
    ],
  },

  // ============ 정치 의견 미묘 (3) ============
  daic_157: {
    id: 'daic_157', lessonId: 'ai', situation: '정치 — 신중한 의견',
    lines: [
      { speaker: 'Conocido', spanish: '¿Vos qué pensás de la situación?', korean: '너는 이 상황 어떻게 생각해?', english: 'What do you think of the situation?', chinese: '你觉得现在情况怎么样？' },
      { speaker: 'Yo', spanish: 'Es complicado, hay puntos válidos en todos lados.', korean: '복잡해, 모든 쪽에 유효한 포인트 있어.', english: 'It\'s complicated, there are valid points on all sides.', chinese: '很复杂，各方都有合理之处。' },
    ],
  },
  daic_158: {
    id: 'daic_158', lessonId: 'ai', situation: '정치 — 관심 없음 표명',
    lines: [
      { speaker: 'Amigo', spanish: '¿Vas a la marcha?', korean: '시위 갈 거야?', english: 'Are you going to the march?', chinese: '你去游行吗？' },
      { speaker: 'Yo', spanish: 'Esta vez no, prefiero mantenerme al margen.', korean: '이번엔 안 가, 거리 두고 싶어.', english: "Not this time, I prefer to stay on the sidelines.", chinese: '这次不去，我想保持距离。' },
    ],
  },
  daic_159: {
    id: 'daic_159', lessonId: 'ai', situation: '정치 — 다른 의견 존중 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'No coincidimos políticamente pero te respeto mucho.', korean: '정치적으론 안 맞지만 널 정말 존중해.', english: "We don't agree politically but I respect you a lot.", chinese: '我们政治观点不同，但我很尊重你。' },
      { speaker: 'Yo', spanish: 'Igual, eso es lo lindo de la amistad.', korean: '나도, 그게 우정의 아름다움이지.', english: 'Same, that\'s the beauty of friendship.', chinese: '我也是，这就是友谊的美。' },
      { speaker: 'Amigo', spanish: 'En la pista somos compañeros y punto.', korean: '댄스플로어에선 그냥 동료, 그뿐이야.', english: 'On the floor we\'re partners, period.', chinese: '在舞池上我们是搭档，仅此而已。' },
    ],
  },

  // ============ 페미니즘·젠더 (3) ============
  daic_160: {
    id: 'daic_160', lessonId: 'ai', situation: '젠더 — 역할 바꾸기',
    lines: [
      { speaker: 'Amiga', spanish: 'Aprendí a llevar también, me cambió la cabeza.', korean: '리드도 배웠어, 사고방식이 바뀌었어.', english: 'I learned to lead too, it changed my mind.', chinese: '我也学了引导，改变了我的思维。' },
      { speaker: 'Yo', spanish: 'Yo quiero probar, dicen que ayuda a entender al follower.', korean: '나도 해보고 싶어, 팔로워 이해에 도움 된대.', english: 'I want to try, they say it helps understand the follower.', chinese: '我也想试试，听说有助于理解跟舞者。' },
    ],
  },
  daic_161: {
    id: 'daic_161', lessonId: 'ai', situation: '젠더 — 동성 커플',
    lines: [
      { speaker: 'Amigo', spanish: 'En la pista somos dos hombres bailando, ¿hay problema?', korean: '댄스플로어에 남자 둘이 추는데 문제 있어?', english: 'On the floor we\'re two men dancing, is there a problem?', chinese: '我们两个男的在舞池跳，有问题吗？' },
      { speaker: 'Veterano', spanish: 'Para nada, el tango es para todos.', korean: '전혀, 탱고는 모두를 위한 거야.', english: 'Not at all, tango is for everyone.', chinese: '完全没问题，探戈是属于所有人的。' },
    ],
  },
  daic_162: {
    id: 'daic_162', lessonId: 'ai', situation: '젠더 — 평등 토론 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: 'El tango tradicional es muy patriarcal, ¿no creés?', korean: '전통 탱고는 가부장적이지, 안 그래?', english: 'Traditional tango is very patriarchal, don\'t you think?', chinese: '传统探戈很父权，对吗？' },
      { speaker: 'Yo', spanish: 'Sí, pero la nueva generación lo está reformulando.', korean: '맞아, 근데 새 세대가 다시 만들고 있어.', english: 'Yes, but the new generation is reformulating it.', chinese: '是的，但新一代正在重新定义。' },
      { speaker: 'Amiga', spanish: 'Ojalá sea un cambio profundo y no solo de fachada.', korean: '겉만이 아니라 깊은 변화이길 바라.', english: 'Hopefully a deep change, not just facade.', chinese: '希望是深层的改变，不只是表面。' },
    ],
  },

  // ============ 정신건강 (3) ============
  daic_163: {
    id: 'daic_163', lessonId: 'ai', situation: '정신건강 — 우울 가벼움',
    lines: [
      { speaker: 'Amiga', spanish: 'Hace semanas que no tengo ganas de nada.', korean: '몇 주째 아무것도 하기 싫어.', english: "For weeks I haven't felt like doing anything.", chinese: '我几周以来什么都不想做。' },
      { speaker: 'Yo', spanish: 'Vení a la milonga conmigo, aunque sea a tomar algo.', korean: '같이 밀롱가 가자, 그냥 한 잔이라도.', english: 'Come to milonga with me, even just for a drink.', chinese: '跟我去米隆加吧，哪怕只喝一杯。' },
    ],
  },
  daic_164: {
    id: 'daic_164', lessonId: 'ai', situation: '정신건강 — 치료 추천',
    lines: [
      { speaker: 'Amigo', spanish: 'Empecé terapia, lo necesitaba hace tiempo.', korean: '심리치료 시작했어, 진작 필요했어.', english: 'I started therapy, I needed it for a long time.', chinese: '我开始做心理治疗了，早就需要了。' },
      { speaker: 'Yo', spanish: 'Me alegra mucho, pedir ayuda es valiente.', korean: '진짜 다행이야, 도움 청하는 건 용기야.', english: "I'm so glad, asking for help is brave.", chinese: '真高兴，求助需要勇气。' },
    ],
  },
  daic_165: {
    id: 'daic_165', lessonId: 'ai', situation: '정신건강 — 자기 돌봄 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Aprendí que descansar también es productivo.', korean: '쉬는 것도 생산적인 거란 걸 배웠어.', english: 'I learned that resting is also productive.', chinese: '我学会了休息也是一种产出。' },
      { speaker: 'Amiga', spanish: 'Cuesta tanto darle permiso al cuerpo de parar.', korean: '몸한테 멈출 허락 주는 거 정말 어려워.', english: "It's so hard to give the body permission to stop.", chinese: '让身体停下来真难。' },
      { speaker: 'Yo', spanish: 'Pero sin pausa no hay creación.', korean: '근데 멈춤 없인 창조 없어.', english: 'But without pause there\'s no creation.', chinese: '但没有停顿就没有创造。' },
    ],
  },

  // ============ 만남 매너 (3) ============
  daic_166: {
    id: 'daic_166', lessonId: 'ai', situation: '만남 — 첫 인상',
    lines: [
      { speaker: 'Amiga', spanish: 'Me hablaron muy bien de vos.', korean: '너에 대해 좋게 들었어.', english: 'They spoke very well of you.', chinese: '我听说了你很多好话。' },
      { speaker: 'Yo', spanish: '¡Qué presión! Espero estar a la altura.', korean: '부담된다! 기대에 부응했으면 좋겠어.', english: 'What pressure! I hope to live up to it.', chinese: '压力大！希望我能不负所望。' },
    ],
  },
  daic_167: {
    id: 'daic_167', lessonId: 'ai', situation: '만남 — 소개해주기',
    lines: [
      { speaker: 'Yo', spanish: 'Te presento a Carla, mi amiga.', korean: '내 친구 카를라 소개할게.', english: 'I introduce you to Carla, my friend.', chinese: '介绍我朋友卡拉给你。' },
      { speaker: 'Conocido', spanish: 'Mucho gusto, Carla. Cualquier amiga de Min es bienvenida.', korean: '반가워요, 카를라. 민의 친구는 다 환영이에요.', english: 'Pleased, Carla. Any friend of Min is welcome.', chinese: '很高兴见到你，卡拉。Min的朋友都欢迎。' },
    ],
  },
  daic_168: {
    id: 'daic_168', lessonId: 'ai', situation: '만남 — 깊은 첫 만남 (B1)',
    lines: [
      { speaker: 'Conocido', spanish: 'Sentí algo especial en esta tanda, no sé cómo explicarlo.', korean: '이 탄다에서 뭔가 특별한 걸 느꼈어, 어떻게 설명할지 모르겠어.', english: "I felt something special in this tanda, I don't know how to explain it.", chinese: '这首组曲我感到特别的东西，不知怎么解释。' },
      { speaker: 'Yo', spanish: 'Cuando hay química se siente, no hace falta explicar.', korean: '케미가 있으면 느껴져, 설명 필요 없어.', english: "When there's chemistry you feel it, no need to explain.", chinese: '有化学反应时能感觉到，不需要解释。' },
    ],
  },

  // ============ 토론 매너 (3) ============
  daic_169: {
    id: 'daic_169', lessonId: 'ai', situation: '토론 — 동의하지 않음 정중',
    lines: [
      { speaker: 'Amigo', spanish: 'Para mí Pugliese es el más grande.', korean: '난 푸글리에세가 최고.', english: 'For me Pugliese is the greatest.', chinese: '我觉得普利亚最伟大。' },
      { speaker: 'Yo', spanish: 'Respeto tu opinión, yo prefiero Di Sarli.', korean: '네 의견 존중해, 난 디 사를리 좋아해.', english: 'I respect your opinion, I prefer Di Sarli.', chinese: '我尊重你的看法，我更喜欢迪萨利。' },
    ],
  },
  daic_170: {
    id: 'daic_170', lessonId: 'ai', situation: '토론 — 마음 바꾸기',
    lines: [
      { speaker: 'Yo', spanish: 'Siempre pensé que el tango nuevo era inferior, pero me equivoqué.', korean: '늘 새 탱고가 떨어진다 생각했는데 내가 틀렸어.', english: 'I always thought new tango was inferior, but I was wrong.', chinese: '我一直觉得新探戈比较差，但我错了。' },
      { speaker: 'Amigo', spanish: 'Es valiente reconocerlo.', korean: '인정하는 거 용기야.', english: "It's brave to admit it.", chinese: '能承认是种勇气。' },
    ],
  },
  daic_171: {
    id: 'daic_171', lessonId: 'ai', situation: '토론 — 깊은 차이 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: 'Pensamos muy distinto sobre la tradición.', korean: '전통에 대해 우리 생각 정말 달라.', english: 'We think very differently about tradition.', chinese: '我们对传统的看法很不同。' },
      { speaker: 'Yo', spanish: 'Pero esa diferencia hace la conversación interesante.', korean: '근데 그 차이가 대화를 흥미롭게 해.', english: 'But that difference makes the conversation interesting.', chinese: '但这种差异让对话有趣。' },
      { speaker: 'Amiga', spanish: 'Por eso podemos ser amigas sin estar de acuerdo.', korean: '그래서 동의 안 하고도 친구일 수 있는 거지.', english: "That's why we can be friends without agreeing.", chinese: '所以即使意见不同也能做朋友。' },
    ],
  },

  // ============ 추억 회상 깊이 (3) ============
  daic_172: {
    id: 'daic_172', lessonId: 'ai', situation: '추억 — 첫 밀롱가',
    lines: [
      { speaker: 'Yo', spanish: 'Me acuerdo de mi primera milonga, estaba paralizada.', korean: '첫 밀롱가 기억 나, 얼어붙었었어.', english: 'I remember my first milonga, I was paralyzed.', chinese: '我记得第一次去米隆加，僵住了。' },
      { speaker: 'Amiga', spanish: 'Todos pasamos por eso, ¡y mirate ahora!', korean: '다 그래봤어, 근데 지금 봐!', english: 'We all went through that, and look at you now!', chinese: '我们都经历过，看看你现在！' },
    ],
  },
  daic_173: {
    id: 'daic_173', lessonId: 'ai', situation: '추억 — 좋아한 선생',
    lines: [
      { speaker: 'Veterano', spanish: 'Te acordás de Carlitos? Murió el año pasado.', korean: '카를리토스 기억해? 작년에 돌아가셨어.', english: 'Remember Carlitos? He died last year.', chinese: '记得卡尔利托斯吗？去年走了。' },
      { speaker: 'Yo', spanish: 'No sabía. Me enseñó tanto sin saberlo él mismo.', korean: '몰랐어. 정작 본인도 모른 채로 나한테 많이 가르쳤어.', english: "I didn't know. He taught me so much without knowing it himself.", chinese: '我不知道。他不知不觉教了我很多。' },
    ],
  },
  daic_174: {
    id: 'daic_174', lessonId: 'ai', situation: '추억 — 십 년 회고 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'No puedo creer que ya hace diez años bailo.', korean: '벌써 10년째 춘다는 게 안 믿겨.', english: "I can't believe I've been dancing for ten years already.", chinese: '不敢相信我已经跳了十年。' },
      { speaker: 'Veterana', spanish: 'Diez años es cuando empezás a entender de verdad.', korean: '10년이면 정말로 이해하기 시작하는 시점이야.', english: "Ten years is when you really start to understand.", chinese: '十年是你真正开始理解的时候。' },
      { speaker: 'Yo', spanish: 'Recién ahora siento que estoy aprendiendo.', korean: '이제야 배우고 있단 느낌 들어.', english: "Only now I feel I'm learning.", chinese: '直到现在我才感觉在学习。' },
    ],
  },

  // ============ 미래 계획 깊이 (3) ============
  daic_175: {
    id: 'daic_175', lessonId: 'ai', situation: '미래 — 은퇴 후 계획',
    lines: [
      { speaker: 'Veterano', spanish: 'Cuando me jubile pienso vivir en Buenos Aires unos meses por año.', korean: '은퇴하면 매년 몇 달 부에노스에서 살 생각이야.', english: 'When I retire I plan to live in Buenos Aires a few months a year.', chinese: '退休后我打算每年在布宜诺斯艾利斯住几个月。' },
      { speaker: 'Yo', spanish: 'Es mi sueño también.', korean: '내 꿈이기도 해.', english: "It's my dream too.", chinese: '也是我的梦想。' },
    ],
  },
  daic_176: {
    id: 'daic_176', lessonId: 'ai', situation: '미래 — 1년 목표',
    lines: [
      { speaker: 'Amiga', spanish: '¿Cuál es tu meta tanguera para este año?', korean: '올해 탱고 목표가 뭐야?', english: 'What\'s your tango goal for this year?', chinese: '你今年的探戈目标是什么？' },
      { speaker: 'Yo', spanish: 'Bailar en Salón Canning sin pedir disculpas todo el tiempo.', korean: '살론 캐닝에서 매번 사과하지 않고 추기.', english: "Dancing at Salón Canning without apologizing all the time.", chinese: '在Salón Canning跳舞不用一直道歉。' },
    ],
  },
  daic_177: {
    id: 'daic_177', lessonId: 'ai', situation: '미래 — 5년 비전 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: '¿Dónde te ves en cinco años con el tango?', korean: '5년 뒤 탱고에서 어디 있을 것 같아?', english: 'Where do you see yourself in five years with tango?', chinese: '五年后你的探戈在哪里？' },
      { speaker: 'Yo', spanish: 'Quizás dando clases a principiantes, devolviéndole al tango lo que me dio.', korean: '아마 초보자 가르치며, 탱고가 준 걸 돌려주고 있을 거야.', english: 'Maybe teaching beginners, giving back to tango what it gave me.', chinese: '也许在教初学者，回报探戈给我的。' },
      { speaker: 'Amigo', spanish: 'Hermosa visión, te va a quedar bien.', korean: '아름다운 비전이야, 너한테 잘 어울려.', english: 'Beautiful vision, it will suit you.', chinese: '美好的愿景，很适合你。' },
    ],
  },

  // ============ 작별 깊이 (3) ============
  daic_178: {
    id: 'daic_178', lessonId: 'ai', situation: '작별 — 멀리 떠남',
    lines: [
      { speaker: 'Amiga', spanish: 'Me mudo a Madrid el mes que viene.', korean: '다음 달 마드리드로 이사 가.', english: "I'm moving to Madrid next month.", chinese: '我下个月搬去马德里。' },
      { speaker: 'Yo', spanish: 'Te voy a extrañar tanto en la pista.', korean: '댄스플로어에서 정말 보고 싶을 거야.', english: "I'll miss you so much on the floor.", chinese: '舞池上我会很想你。' },
    ],
  },
  daic_179: {
    id: 'daic_179', lessonId: 'ai', situation: '작별 — 마지막 탄다',
    lines: [
      { speaker: 'Amigo', spanish: 'Esta es la última tanda antes de que te vayas.', korean: '네 떠나기 전 마지막 탄다네.', english: "This is the last tanda before you leave.", chinese: '这是你走之前最后一支组曲了。' },
      { speaker: 'Yo', spanish: 'La voy a recordar siempre.', korean: '평생 기억할게.', english: "I'll remember it always.", chinese: '我会永远记得。' },
    ],
  },
  daic_180: {
    id: 'daic_180', lessonId: 'ai', situation: '작별 — 365일 끝내기 (B1)',
    lines: [
      { speaker: 'Mila', spanish: 'Mirá hasta dónde llegaste en un año.', korean: '1년 만에 어디까지 왔는지 봐.', english: 'Look how far you\'ve come in a year.', chinese: '看你一年来走了多远。' },
      { speaker: 'Yo', spanish: 'Empecé sin poder decir hola en español.', korean: '스페인어로 인사도 못 하고 시작했지.', english: "I started without being able to say hello in Spanish.", chinese: '一开始连用西班牙语打招呼都不会。' },
      { speaker: 'Mila', spanish: 'Y ahora tenés conversaciones de verdad. Bienvenida al tango eterno.', korean: '이제 진짜 대화해. 영원한 탱고에 오신 걸 환영해요.', english: 'And now you have real conversations. Welcome to eternal tango.', chinese: '现在你能进行真正的对话。欢迎来到永恒的探戈。' },
    ],
  },
};
