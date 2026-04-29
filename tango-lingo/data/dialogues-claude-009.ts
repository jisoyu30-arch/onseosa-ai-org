// Claude 직접 작성 dialogue — 배치 009
// 30개 (요일·명절·결혼식·육아·농담·데이트·오해·고백·후회·기념일)
import type { DialogueExample } from './dialogues-l1';

export const dialoguesClaude009: Record<string, DialogueExample> = {
  // ============ 일주일·요일 (3) ============
  daic_241: {
    id: 'daic_241', lessonId: 'ai', situation: '요일 — 월요병',
    lines: [
      { speaker: 'Yo', spanish: 'Odio los lunes, ¿por qué no son fin de semana?', korean: '월요일 싫어, 왜 주말 아닐까?', english: 'I hate Mondays, why aren\'t they weekends?', chinese: '我讨厌星期一，为什么不是周末？' },
      { speaker: 'Amigo', spanish: 'Por suerte hay milonga los lunes en Cachirulo.', korean: '다행히 월요일 카치룰로 밀롱가 있잖아.', english: 'Luckily there\'s milonga Mondays at Cachirulo.', chinese: '好在周一Cachirulo有米隆加。' },
    ],
  },
  daic_242: {
    id: 'daic_242', lessonId: 'ai', situation: '요일 — 일주일 계획',
    lines: [
      { speaker: 'Amiga', spanish: '¿Qué milongas vas esta semana?', korean: '이번 주 어떤 밀롱가 가?', english: 'Which milongas are you going to this week?', chinese: '你这周去哪些米隆加？' },
      { speaker: 'Yo', spanish: 'Martes en Lo de Celia, jueves en Sunderland, sábado en Salón Canning.', korean: '화요일 로 데 셀리아, 목요일 선덜랜드, 토요일 살론 캐닝.', english: 'Tuesday Lo de Celia, Thursday Sunderland, Saturday Salón Canning.', chinese: '周二Lo de Celia，周四Sunderland，周六Salón Canning。' },
    ],
  },
  daic_243: {
    id: 'daic_243', lessonId: 'ai', situation: '요일 — 일주일 회고 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Esta semana fue larguísima, no veía la hora del finde.', korean: '이번 주 진짜 길었어, 주말 진짜 기다렸어.', english: "This week was so long, I couldn't wait for the weekend.", chinese: '这周特别长，我盼着周末。' },
      { speaker: 'Amigo', spanish: 'Te mereces dos tandas extra esta noche.', korean: '오늘 밤 보너스 탄다 두 개 자격 있다.', english: 'You deserve two extra tandas tonight.', chinese: '你今晚值得多跳两组探戈。' },
      { speaker: 'Yo', spanish: 'Acepto la propuesta encantada.', korean: '기꺼이 받아들임.', english: 'I gladly accept.', chinese: '我欣然接受。' },
    ],
  },

  // ============ 명절·전통 (3) ============
  daic_244: {
    id: 'daic_244', lessonId: 'ai', situation: '명절 — 설날 소개',
    lines: [
      { speaker: 'Amiga', spanish: '¿Cómo es el año nuevo en Corea?', korean: '한국 설날은 어때?', english: "How is New Year's in Korea?", chinese: '韩国春节是怎样的？' },
      { speaker: 'Yo', spanish: 'Vestimos hanbok, comemos tteokguk y visitamos a los abuelos.', korean: '한복 입고 떡국 먹고 조부모님 댁 가.', english: 'We wear hanbok, eat tteokguk and visit grandparents.', chinese: '穿韩服，吃年糕汤，去看爷爷奶奶。' },
    ],
  },
  daic_245: {
    id: 'daic_245', lessonId: 'ai', situation: '명절 — 추석',
    lines: [
      { speaker: 'Yo', spanish: 'En septiembre tenemos Chuseok, como un día de gracias.', korean: '9월에 추석 있어, 추수감사절 같은.', english: 'In September we have Chuseok, like a thanksgiving day.', chinese: '九月有中秋节，像感恩节一样。' },
      { speaker: 'Amiga', spanish: '¿Bailan algo tradicional?', korean: '전통 춤 추기도 해?', english: 'Do you dance something traditional?', chinese: '会跳传统舞蹈吗？' },
      { speaker: 'Yo', spanish: 'Ganggangsullae, mujeres tomadas de la mano bajo la luna.', korean: '강강술래, 달 아래 여자들 손잡고.', english: 'Ganggangsullae, women holding hands under the moon.', chinese: '羌羌水来，女人在月下手拉手。' },
    ],
  },
  daic_246: {
    id: 'daic_246', lessonId: 'ai', situation: '명절 — 크리스마스 토론 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: 'En Argentina la Navidad es en pleno verano.', korean: '아르헨에선 크리스마스가 한여름이야.', english: 'In Argentina Christmas is in midsummer.', chinese: '在阿根廷圣诞节是盛夏。' },
      { speaker: 'Yo', spanish: 'Eso me parte la cabeza, en Corea es helado.', korean: '머리 깨질 일이야, 한국은 추워.', english: "That's mind-blowing, in Korea it's freezing.", chinese: '这让我难以接受，韩国是冰冷的。' },
      { speaker: 'Amiga', spanish: 'Acá comemos asado a las tres de la mañana del 25.', korean: '여기선 25일 새벽 3시에 아사도 먹어.', english: 'Here we eat asado at three in the morning on the 25th.', chinese: '这里二十五号凌晨三点吃烤肉。' },
    ],
  },

  // ============ 결혼식 참석 (3) ============
  daic_247: {
    id: 'daic_247', lessonId: 'ai', situation: '결혼식 — 참석 결정',
    lines: [
      { speaker: 'Amigo', spanish: 'Me invitaron al casamiento de Lucía, ¿vas?', korean: '루시아 결혼식 초대받았어, 갈 거야?', english: "I was invited to Lucía's wedding, are you going?", chinese: '露西亚的婚礼请我了，你去吗？' },
      { speaker: 'Yo', spanish: 'Sí, ¿compartimos taxi?', korean: '응, 택시 같이 탈래?', english: 'Yes, share a taxi?', chinese: '去，一起打车？' },
    ],
  },
  daic_248: {
    id: 'daic_248', lessonId: 'ai', situation: '결혼식 — 신부 칭찬',
    lines: [
      { speaker: 'Yo', spanish: '¡Qué hermosa estás, Lucía!', korean: '루시아 너무 예쁘다!', english: 'You look gorgeous, Lucía!', chinese: '露西亚你真美！' },
      { speaker: 'Lucía', spanish: '¡Gracias, gracias por venir!', korean: '고마워, 와줘서 정말 고마워!', english: 'Thanks, thanks for coming!', chinese: '谢谢，谢谢你来！' },
    ],
  },
  daic_249: {
    id: 'daic_249', lessonId: 'ai', situation: '결혼식 — 축사 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Por el amor que se baila como tango: con respeto, escucha y entrega.', korean: '탱고처럼 춰지는 사랑을 위해, 존중·경청·바침으로.', english: 'To love that\'s danced like tango: with respect, listening and surrender.', chinese: '为像探戈一样的爱：尊重、聆听、奉献。' },
      { speaker: 'Yo', spanish: '¡Qué brindis hermoso!', korean: '정말 아름다운 건배사다!', english: 'What a beautiful toast!', chinese: '多美的祝酒词！' },
    ],
  },

  // ============ 출산·육아 (3) ============
  daic_250: {
    id: 'daic_250', lessonId: 'ai', situation: '육아 — 임신 알림',
    lines: [
      { speaker: 'Amiga', spanish: 'Tengo una novedad: estoy embarazada.', korean: '소식 있어, 임신했어.', english: "I have news: I'm pregnant.", chinese: '我有消息：我怀孕了。' },
      { speaker: 'Yo', spanish: '¡Felicitaciones! Qué emocionante.', korean: '축하해! 너무 설렌다.', english: 'Congratulations! How exciting.', chinese: '恭喜！多激动啊。' },
    ],
  },
  daic_251: {
    id: 'daic_251', lessonId: 'ai', situation: '육아 — 잠 부족',
    lines: [
      { speaker: 'Amigo', spanish: 'Estoy muerto, mi bebé no duerme.', korean: '죽겠어, 우리 애기 안 자.', english: "I'm dead, my baby doesn't sleep.", chinese: '我累死了，宝宝不睡觉。' },
      { speaker: 'Yo', spanish: 'Coraje, esa fase pasa.', korean: '힘내, 그 시기 지나가.', english: 'Courage, that phase passes.', chinese: '加油，这个阶段会过去的。' },
    ],
  },
  daic_252: {
    id: 'daic_252', lessonId: 'ai', situation: '육아 — 양육 철학 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: 'Quiero que mi hija aprenda tango cuando crezca.', korean: '딸이 크면 탱고 배웠으면 해.', english: 'I want my daughter to learn tango when she grows up.', chinese: '我希望女儿长大学探戈。' },
      { speaker: 'Yo', spanish: 'El tango le enseñará a escuchar al cuerpo del otro.', korean: '탱고는 상대 몸 듣는 법 가르칠 거야.', english: "Tango will teach her to listen to the other's body.", chinese: '探戈会教她聆听他人的身体。' },
      { speaker: 'Amiga', spanish: 'Eso es lo que más quiero que sepa.', korean: '그게 가장 알았으면 하는 거야.', english: "That's what I most want her to know.", chinese: '这正是我最希望她明白的。' },
    ],
  },

  // ============ 친한 사이 농담·장난 (3) ============
  daic_253: {
    id: 'daic_253', lessonId: 'ai', situation: '농담 — 친구 놀리기',
    lines: [
      { speaker: 'Amigo', spanish: '¿Otra vez con esos zapatos? ¡Tu armario está congelado en 2015!', korean: '또 그 신발이야? 옷장이 2015년에 멈춰 있네!', english: 'Those shoes again? Your closet is frozen in 2015!', chinese: '又穿那双鞋？你衣柜停在2015年了！' },
      { speaker: 'Yo', spanish: '¡Ja! Clásicos nunca pasan de moda.', korean: '하! 클래식은 유행 안 타.', english: 'Ha! Classics never go out of style.', chinese: '哈！经典永不过时。' },
    ],
  },
  daic_254: {
    id: 'daic_254', lessonId: 'ai', situation: '농담 — 자기 비하 농담',
    lines: [
      { speaker: 'Yo', spanish: 'Bailo como elefante en porcelana hoy.', korean: '오늘 도자기 가게 코끼리처럼 춰.', english: "I dance like an elephant in china today.", chinese: '我今天跳得像瓷器店里的大象。' },
      { speaker: 'Amigo', spanish: '¡Pero qué elefante elegante!', korean: '근데 우아한 코끼리네!', english: 'But what an elegant elephant!', chinese: '但多优雅的大象！' },
    ],
  },
  daic_255: {
    id: 'daic_255', lessonId: 'ai', situation: '농담 — 비꼼 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: '¿Y ahora te hacés el técnico avanzado?', korean: '이제 자기가 상급자라도 된 척이야?', english: 'And now you\'re acting like an advanced technical dancer?', chinese: '现在你装高级技术派了？' },
      { speaker: 'Yo', spanish: 'Hace falta confianza para improvisar.', korean: '즉흥 하려면 자신감 필요해.', english: 'You need confidence to improvise.', chinese: '即兴需要自信。' },
      { speaker: 'Amigo', spanish: 'O exceso de confianza, jeje.', korean: '아니면 과한 자신감, 흐흐.', english: 'Or overconfidence, hehe.', chinese: '或者过度自信，嘿嘿。' },
    ],
  },

  // ============ 첫 데이트 매너 (3) ============
  daic_256: {
    id: 'daic_256', lessonId: 'ai', situation: '데이트 — 카페 첫 만남',
    lines: [
      { speaker: 'Conocido', spanish: 'Llegué un poquito antes, esperaba con nervios.', korean: '조금 일찍 도착해서 떨면서 기다렸어.', english: 'I arrived a bit early, waiting nervous.', chinese: '我早到一点，紧张地等。' },
      { speaker: 'Yo', spanish: 'Yo también, ¡qué sincero!', korean: '나도, 솔직하다!', english: 'Me too, how honest!', chinese: '我也是，真坦诚！' },
    ],
  },
  daic_257: {
    id: 'daic_257', lessonId: 'ai', situation: '데이트 — 다음 만남 제안',
    lines: [
      { speaker: 'Conocido', spanish: 'Disfruté mucho. ¿Repetimos la semana que viene?', korean: '너무 즐거웠어. 다음 주 또 볼까?', english: 'I really enjoyed. Repeat next week?', chinese: '很开心。下周再见？' },
      { speaker: 'Yo', spanish: 'Me encantaría.', korean: '좋아.', english: "I'd love to.", chinese: '我很乐意。' },
    ],
  },
  daic_258: {
    id: 'daic_258', lessonId: 'ai', situation: '데이트 — 정중한 거절 (B1)',
    lines: [
      { speaker: 'Conocido', spanish: 'Quiero ser claro: me gustás como amiga.', korean: '분명히 할게, 친구로 좋아해.', english: 'I want to be clear: I like you as a friend.', chinese: '我要说清楚：我把你当朋友。' },
      { speaker: 'Yo', spanish: 'Te agradezco la sinceridad, pensaba lo mismo.', korean: '솔직함 고마워, 나도 그랬어.', english: 'Thanks for the sincerity, I felt the same.', chinese: '谢谢你的坦诚，我也这么想。' },
      { speaker: 'Conocido', spanish: 'Entonces seguimos bailando como siempre.', korean: '그럼 평소처럼 계속 춰.', english: 'Then we keep dancing as always.', chinese: '那我们继续像往常一样跳舞。' },
    ],
  },

  // ============ 오해·해명 (3) ============
  daic_259: {
    id: 'daic_259', lessonId: 'ai', situation: '오해 — 무시당했다 오해',
    lines: [
      { speaker: 'Yo', spanish: 'Pensé que me ignoraste anoche.', korean: '어젯밤 날 무시한 줄 알았어.', english: 'I thought you ignored me last night.', chinese: '我以为你昨晚故意忽视我。' },
      { speaker: 'Amigo', spanish: '¡Para nada! No te vi entre la multitud.', korean: '전혀! 사람 많아서 못 봤어.', english: 'Not at all! I didn\'t see you in the crowd.', chinese: '完全不是！人多没看到你。' },
    ],
  },
  daic_260: {
    id: 'daic_260', lessonId: 'ai', situation: '오해 — 메시지 오해',
    lines: [
      { speaker: 'Amiga', spanish: 'Tu mensaje sonó cortante, ¿pasó algo?', korean: '네 메시지 차갑게 들렸어, 무슨 일?', english: 'Your message sounded curt, did something happen?', chinese: '你的消息听起来冷淡，怎么了？' },
      { speaker: 'Yo', spanish: 'Estaba apurada, perdón si pareció seco.', korean: '바빴어, 차가워 보였으면 미안.', english: 'I was rushed, sorry if it seemed dry.', chinese: '我赶时间，抱歉听起来冷漠。' },
    ],
  },
  daic_261: {
    id: 'daic_261', lessonId: 'ai', situation: '오해 — 깊은 해명 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Sentí que me cancelaste por otra persona.', korean: '다른 사람 때문에 날 취소한 거 같았어.', english: 'I felt you canceled me for someone else.', chinese: '我觉得你为别人取消了我。' },
      { speaker: 'Yo', spanish: 'Para nada, mi mamá se enfermó. No fue por nadie.', korean: '전혀 아니야, 엄마가 아프셨어. 누구 때문도 아냐.', english: 'Not at all, my mom got sick. It wasn\'t about anyone.', chinese: '完全不是，我妈病了。跟任何人无关。' },
      { speaker: 'Amigo', spanish: 'Perdón por asumir, debí preguntar primero.', korean: '미안, 단정해서. 먼저 물어봤어야 했어.', english: 'Sorry for assuming, I should have asked first.', chinese: '抱歉我臆断了，应该先问的。' },
    ],
  },

  // ============ 진심 고백 (3) ============
  daic_262: {
    id: 'daic_262', lessonId: 'ai', situation: '고백 — 친구에게 진심',
    lines: [
      { speaker: 'Yo', spanish: 'Quería decirte que sos importante para mí.', korean: '너 나한테 중요한 사람이라고 말하고 싶었어.', english: "I wanted to tell you that you're important to me.", chinese: '我想告诉你，你对我很重要。' },
      { speaker: 'Amigo', spanish: 'Vos también para mí. Gracias por decirlo.', korean: '너도 마찬가지야. 말해줘서 고마워.', english: 'You too for me. Thanks for saying it.', chinese: '你对我也是。谢谢你说出来。' },
    ],
  },
  daic_263: {
    id: 'daic_263', lessonId: 'ai', situation: '고백 — 사랑 고백',
    lines: [
      { speaker: 'Conocido', spanish: 'Hace tiempo que quiero decirte que me enamoré.', korean: '오래전부터 사랑한다고 말하고 싶었어.', english: "I've wanted to tell you for a while that I fell in love.", chinese: '我早就想告诉你我爱上你了。' },
      { speaker: 'Yo', spanish: 'No me lo esperaba. Necesito procesarlo.', korean: '예상 못 했어. 시간 좀 필요해.', english: "I didn't expect it. I need to process.", chinese: '我没想到。我需要时间消化。' },
    ],
  },
  daic_264: {
    id: 'daic_264', lessonId: 'ai', situation: '고백 — 깊은 진심 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Cuando bailo con vos siento que el mundo se detiene.', korean: '너랑 추면 세상이 멈추는 것 같아.', english: 'When I dance with you I feel the world stops.', chinese: '和你跳舞时，我感觉世界静止了。' },
      { speaker: 'Conocido', spanish: 'A mí me pasa lo mismo desde hace meses.', korean: '나도 몇 달째 그래.', english: "It's been the same for me for months.", chinese: '我几个月以来也是这样。' },
      { speaker: 'Yo', spanish: 'Entonces no son solo tandas, son algo más.', korean: '그럼 그냥 탄다 아니야, 뭔가 더야.', english: "Then they're not just tandas, they're something more.", chinese: '那它们不只是组曲，是更多的东西。' },
    ],
  },

  // ============ 후회 표현 (3) ============
  daic_265: {
    id: 'daic_265', lessonId: 'ai', situation: '후회 — 가벼운 후회',
    lines: [
      { speaker: 'Yo', spanish: 'Me arrepiento de no haber bailado más anoche.', korean: '어젯밤 더 안 춘 거 후회돼.', english: 'I regret not dancing more last night.', chinese: '我后悔昨晚没多跳。' },
      { speaker: 'Amiga', spanish: 'Hay otra noche mañana.', korean: '내일 또 있어.', english: "There's another night tomorrow.", chinese: '明天还有一晚。' },
    ],
  },
  daic_266: {
    id: 'daic_266', lessonId: 'ai', situation: '후회 — 인생 후회',
    lines: [
      { speaker: 'Veterano', spanish: 'Me arrepiento de haber empezado a bailar tan tarde.', korean: '너무 늦게 추기 시작한 게 후회돼.', english: 'I regret starting to dance so late.', chinese: '我后悔开始跳得太晚。' },
      { speaker: 'Yo', spanish: 'Mejor tarde que nunca, nos enseña la frase.', korean: '늦더라도 안 한 것보단 낫지, 그 말이.', english: 'Better late than never, the saying teaches us.', chinese: '晚总比从不好，俗话说的。' },
    ],
  },
  daic_267: {
    id: 'daic_267', lessonId: 'ai', situation: '후회 — 깊은 자기 성찰 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'A veces me pregunto qué hubiera sido si no hubiera dejado a mi pareja anterior.', korean: '가끔 전 파트너 떠나지 않았으면 어떻게 됐을까 물어.', english: "Sometimes I wonder what would have been if I hadn't left my previous partner.", chinese: '有时我想如果没离开前任会怎样。' },
      { speaker: 'Veterana', spanish: 'Esos "qué hubiera sido" no llevan a ningún lado.', korean: '"뭐가 됐을까"는 어디로도 안 데려가.', english: 'Those "what ifs" don\'t lead anywhere.', chinese: '这些"如果"什么都到不了。' },
      { speaker: 'Yo', spanish: 'Tenés razón, mejor honro lo que es.', korean: '맞아, 차라리 지금 있는 걸 존중하지.', english: "You're right, better honor what is.", chinese: '你说得对，不如珍惜现在。' },
    ],
  },

  // ============ 기념일 축하 (3) ============
  daic_268: {
    id: 'daic_268', lessonId: 'ai', situation: '기념일 — 결혼기념일',
    lines: [
      { speaker: 'Amigo', spanish: 'Hoy cumplimos diez años de casados.', korean: '오늘 결혼 10주년이야.', english: 'Today we celebrate ten years of marriage.', chinese: '今天我们结婚十周年。' },
      { speaker: 'Yo', spanish: '¡Felicitaciones! Brindemos.', korean: '축하해! 건배하자.', english: "Congratulations! Let's toast.", chinese: '恭喜！干一杯。' },
    ],
  },
  daic_269: {
    id: 'daic_269', lessonId: 'ai', situation: '기념일 — 탱고 1주년',
    lines: [
      { speaker: 'Yo', spanish: 'Hoy se cumple un año desde mi primera clase de tango.', korean: '오늘 첫 탱고 수업으로부터 1년이야.', english: 'Today marks one year since my first tango class.', chinese: '今天是我第一节探戈课一周年。' },
      { speaker: 'Amiga', spanish: '¡Qué bueno! Mirá cuánto avanzaste.', korean: '대단해! 얼마나 발전했는지 봐.', english: 'How nice! Look how far you\'ve come.', chinese: '太棒了！看你进步多少。' },
    ],
  },
  daic_270: {
    id: 'daic_270', lessonId: 'ai', situation: '기념일 — 의미 깊은 축하 (B1)',
    lines: [
      { speaker: 'Veterana', spanish: 'Cumplo cuarenta años bailando, aún siento mariposas en cada tanda.', korean: '40년째 추는데 매 탄다마다 떨림 느껴.', english: '40 years dancing, I still feel butterflies in every tanda.', chinese: '我跳了四十年，每首组曲还是心跳加速。' },
      { speaker: 'Yo', spanish: 'Eso es estar vivo de verdad.', korean: '그게 진짜 살아 있는 거지.', english: "That's being truly alive.", chinese: '这才是真正活着。' },
      { speaker: 'Veterana', spanish: 'Por eso sigo: mientras sienta, sigo.', korean: '그래서 계속해, 느끼는 한 계속.', english: "That's why I continue: while I feel, I continue.", chinese: '所以我继续：只要还有感觉就继续。' },
    ],
  },
};
