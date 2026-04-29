// Claude 직접 작성 dialogue — 배치 003
// 30개 (가족·건강·식당·날씨·친밀감·학습동기·인격칭찬·갈등해소·약속)
import type { DialogueExample } from './dialogues-l1';

export const dialoguesClaude003: Record<string, DialogueExample> = {
  // ============ 가족·일상 (3) ============
  daic_061: {
    id: 'daic_061', lessonId: 'ai', situation: '가족 — 자녀 얘기',
    lines: [
      { speaker: 'Amiga', spanish: '¿Tenés hijos?', korean: '자녀 있어?', english: 'Do you have kids?', chinese: '你有孩子吗？' },
      { speaker: 'Yo', spanish: 'Sí, dos. Una nena de ocho y un nene de cinco.', korean: '응, 둘. 8살 딸, 5살 아들.', english: 'Yes, two. An eight-year-old girl and a five-year-old boy.', chinese: '有，两个。八岁的女儿和五岁的儿子。' },
    ],
  },
  daic_062: {
    id: 'daic_062', lessonId: 'ai', situation: '일상 — 주말 계획',
    lines: [
      { speaker: 'Amigo', spanish: '¿Qué planes tenés para el finde?', korean: '주말에 뭐 할 거야?', english: 'Any plans for the weekend?', chinese: '周末你有什么计划？' },
      { speaker: 'Yo', spanish: 'Sábado milonga, domingo descanso.', korean: '토요일 밀롱가, 일요일 쉬어.', english: 'Milonga Saturday, rest Sunday.', chinese: '周六米隆加，周日休息。' },
    ],
  },
  daic_063: {
    id: 'daic_063', lessonId: 'ai', situation: '가족 — 일·삶 균형 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: '¿Cómo hacés para venir a milonga con dos chicos en casa?', korean: '집에 애 둘 있는데 어떻게 밀롱가 와?', english: 'How do you manage to come to milonga with two kids at home?', chinese: '你家里两个孩子怎么还能来米隆加？' },
      { speaker: 'Yo', spanish: 'Mi pareja entiende que esto es mi terapia, nos turnamos.', korean: '남편이 이게 내 치료라는 걸 이해해줘, 번갈아 봐.', english: "My partner understands this is my therapy, we take turns.", chinese: '我的另一半理解这是我的疗愈，我们轮流照顾。' },
      { speaker: 'Amiga', spanish: 'Qué suerte tenés con ese apoyo.', korean: '그런 지지가 있다니 복 받았네.', english: "How lucky to have that support.", chinese: '你有这样的支持真幸运。' },
    ],
  },

  // ============ 건강·부상 (3) ============
  daic_064: {
    id: 'daic_064', lessonId: 'ai', situation: '건강 — 무릎 통증',
    lines: [
      { speaker: 'Yo', spanish: 'Me duele la rodilla, no sé si puedo bailar mucho.', korean: '무릎 아파, 많이 못 출 것 같아.', english: "My knee hurts, I don't know if I can dance much.", chinese: '我膝盖疼，不知道能不能跳很多。' },
      { speaker: 'Amiga', spanish: 'Andá despacio, mejor pocas tandas que lastimarte.', korean: '천천히 해, 다치는 것보다 조금 추는 게 나아.', english: 'Take it slow, better few tandas than hurting yourself.', chinese: '慢慢来，少跳几首总比受伤好。' },
    ],
  },
  daic_065: {
    id: 'daic_065', lessonId: 'ai', situation: '건강 — 피로함 표현',
    lines: [
      { speaker: 'Tanguero', spanish: 'Estás cansada, ¿querés que paremos?', korean: '피곤해 보여, 멈출까?', english: "You look tired, want us to stop?", chinese: '你累了，要不要停下来？' },
      { speaker: 'Tanguera', spanish: 'Solo una más y descanso, gracias por preguntar.', korean: '한 곡만 더 하고 쉴게, 물어봐줘서 고마워.', english: 'Just one more and I rest, thanks for asking.', chinese: '再跳一首就休息，谢谢你问。' },
    ],
  },
  daic_066: {
    id: 'daic_066', lessonId: 'ai', situation: '건강 — 부상 회복 후 복귀 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: '¡Qué bueno verte de nuevo! ¿Cómo está la espalda?', korean: '다시 봐서 정말 좋다! 허리는 어때?', english: 'So good to see you again! How\'s your back?', chinese: '又见到你真好！背怎么样了？' },
      { speaker: 'Yo', spanish: 'Mejor, pero todavía no puedo hacer ganchos profundos.', korean: '나아졌어, 근데 아직 깊은 간초는 못 해.', english: 'Better, but I still can\'t do deep ganchos.', chinese: '好些了，但还不能做深的勾步。' },
      { speaker: 'Amiga', spanish: 'Lo importante es que volviste, andá con paciencia.', korean: '돌아온 게 중요하지, 인내심 갖고 해.', english: 'The important thing is you\'re back, go with patience.', chinese: '重要的是你回来了，慢慢来。' },
    ],
  },

  // ============ 음식·식당 (3) ============
  daic_067: {
    id: 'daic_067', lessonId: 'ai', situation: '식당 — 추천 묻기',
    lines: [
      { speaker: 'Yo', spanish: '¿Qué pedís de comer en este lugar?', korean: '여기서 뭐 시켜?', english: 'What do you order to eat here?', chinese: '你在这里点什么吃？' },
      { speaker: 'Amigo', spanish: 'Las empanadas son las mejores de la zona.', korean: '엠파나다가 동네 최고야.', english: 'The empanadas are the best in the area.', chinese: '这里的肉饺是这一带最好的。' },
    ],
  },
  daic_068: {
    id: 'daic_068', lessonId: 'ai', situation: '식당 — 알레르기',
    lines: [
      { speaker: 'Yo', spanish: 'Soy alérgica a los frutos secos, ¿esto tiene?', korean: '견과류 알레르기 있어, 이거에 들어 있어?', english: "I'm allergic to nuts, does this have any?", chinese: '我对坚果过敏，这个有吗？' },
      { speaker: 'Mozo', spanish: 'Voy a preguntar al chef, mejor asegurarse.', korean: '셰프한테 물어볼게요, 확실히 하는 게 좋죠.', english: "I'll ask the chef, better to make sure.", chinese: '我去问厨师，确认一下比较好。' },
    ],
  },
  daic_069: {
    id: 'daic_069', lessonId: 'ai', situation: '식당 — 와인 추천 (B1)',
    lines: [
      { speaker: 'Yo', spanish: '¿Me recomendás un vino tinto que no sea muy pesado?', korean: '너무 묵직하지 않은 레드 와인 추천 해줄래?', english: 'Could you recommend a red wine that\'s not too heavy?', chinese: '你能推荐一款不那么浓烈的红酒吗？' },
      { speaker: 'Sommelier', spanish: 'El Malbec de Mendoza joven, frutado y suave.', korean: '멘도사 영 말벡, 과일향 나고 부드러워요.', english: 'The young Mendoza Malbec, fruity and soft.', chinese: '门多萨的年轻马尔贝克，果香柔和。' },
      { speaker: 'Yo', spanish: 'Perfecto, lo probamos.', korean: '좋아요, 해볼게요.', english: 'Perfect, let\'s try it.', chinese: '好，我们试试。' },
    ],
  },

  // ============ 날씨·계절 (3) ============
  daic_070: {
    id: 'daic_070', lessonId: 'ai', situation: '날씨 — 비 와서 늦음',
    lines: [
      { speaker: 'Yo', spanish: 'Llegué tarde por la lluvia, perdón.', korean: '비 때문에 늦었어, 미안.', english: 'I arrived late because of the rain, sorry.', chinese: '因为下雨我迟到了，抱歉。' },
      { speaker: 'Amiga', spanish: 'No te hagas problema, todavía hay buena música.', korean: '신경 쓰지 마, 아직 좋은 음악 많아.', english: "Don't worry, there's still good music.", chinese: '别在意，还有很多好音乐。' },
    ],
  },
  daic_071: {
    id: 'daic_071', lessonId: 'ai', situation: '날씨 — 더워서 자주 쉬어야',
    lines: [
      { speaker: 'Tanguera', spanish: '¡Qué calor hace! Necesito agua.', korean: '진짜 덥다! 물 좀 마셔야겠어.', english: "It's so hot! I need water.", chinese: '好热！我得喝水。' },
      { speaker: 'Tanguero', spanish: 'Vamos al bar, te invito una.', korean: '바로 가자, 한 잔 살게.', english: "Let's go to the bar, my treat.", chinese: '去吧台吧，我请你。' },
    ],
  },
  daic_072: {
    id: 'daic_072', lessonId: 'ai', situation: '날씨 — 계절 변화 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Con este otoño la gente sale más, las milongas están a tope.', korean: '이번 가을엔 사람들 더 나와, 밀롱가 만석이야.', english: 'With this autumn people go out more, milongas are packed.', chinese: '今年秋天大家更愿意出门，米隆加都满了。' },
      { speaker: 'Yo', spanish: 'Es la temperatura ideal para bailar, ni frío ni calor.', korean: '춤 추기 딱 좋은 온도야, 안 춥고 안 더워.', english: 'It\'s the ideal temperature to dance, neither cold nor hot.', chinese: '是跳舞的理想温度，不冷不热。' },
    ],
  },

  // ============ 친밀감·관계 (3) ============
  daic_073: {
    id: 'daic_073', lessonId: 'ai', situation: '친밀감 — 다음에 만나자',
    lines: [
      { speaker: 'Tanguero', spanish: '¿Te puedo agregar a Whatsapp?', korean: '왓츠앱 추가해도 돼요?', english: 'Can I add you on Whatsapp?', chinese: '我可以加你的WhatsApp吗？' },
      { speaker: 'Tanguera', spanish: 'Sí, claro. Avisame cuando vengas a esta milonga.', korean: '응, 물론. 이 밀롱가 올 때 알려줘요.', english: 'Yes, sure. Let me know when you come to this milonga.', chinese: '当然可以。你来这个米隆加时告诉我。' },
    ],
  },
  daic_074: {
    id: 'daic_074', lessonId: 'ai', situation: '친밀감 — 데이트 제안',
    lines: [
      { speaker: 'Tanguero', spanish: '¿Te gustaría tomar un café algún día, fuera de la milonga?', korean: '언제 밀롱가 밖에서 커피 한 잔 어때요?', english: 'Would you like to grab a coffee sometime, outside the milonga?', chinese: '什么时候米隆加外面喝杯咖啡怎么样？' },
      { speaker: 'Tanguera', spanish: 'Me encantaría, mandame un mensaje.', korean: '좋아요, 메시지 보내줘요.', english: "I'd love to, send me a message.", chinese: '好啊，给我发信息吧。' },
    ],
  },
  daic_075: {
    id: 'daic_075', lessonId: 'ai', situation: '친밀감 — 거리 두기 정중히 (B1)',
    lines: [
      { speaker: 'Tanguero', spanish: 'Te invito a salir, ¿qué decís?', korean: '데이트 신청할게, 어때?', english: 'I\'m asking you out, what do you say?', chinese: '我邀请你出去，怎么样？' },
      { speaker: 'Tanguera', spanish: 'Te aprecio mucho como compañero de baile, prefiero mantenerlo así.', korean: '댄스 파트너로 정말 좋아하는데 그렇게 유지하고 싶어요.', english: "I really value you as a dance partner, I prefer to keep it that way.", chinese: '作为舞伴我很欣赏你，我希望保持这样。' },
      { speaker: 'Tanguero', spanish: 'Entiendo perfectamente, gracias por la honestidad.', korean: '완전히 이해해요, 솔직함 고마워요.', english: 'I understand perfectly, thanks for the honesty.', chinese: '完全理解，谢谢你的坦诚。' },
    ],
  },

  // ============ 학습 동기 (3) ============
  daic_076: {
    id: 'daic_076', lessonId: 'ai', situation: '동기 — 시작 계기',
    lines: [
      { speaker: 'Amigo', spanish: '¿Por qué empezaste tango?', korean: '왜 탱고 시작했어?', english: 'Why did you start tango?', chinese: '你为什么开始跳探戈？' },
      { speaker: 'Yo', spanish: 'Vi una pareja en la calle y me enamoré al instante.', korean: '길에서 한 쌍 보고 바로 반했어.', english: 'I saw a couple on the street and fell in love instantly.', chinese: '我在街上看到一对舞者，一下子就爱上了。' },
    ],
  },
  daic_077: {
    id: 'daic_077', lessonId: 'ai', situation: '동기 — 목표 공유',
    lines: [
      { speaker: 'Amiga', spanish: '¿Cuál es tu meta con el tango?', korean: '탱고로 이루고 싶은 게 뭐야?', english: "What's your goal with tango?", chinese: '你跳探戈的目标是什么？' },
      { speaker: 'Yo', spanish: 'Bailar en el Salón Canning con confianza.', korean: '살론 캐닝에서 자신 있게 추는 거.', english: 'To dance at Salón Canning with confidence.', chinese: '在Salón Canning自信地跳舞。' },
    ],
  },
  daic_078: {
    id: 'daic_078', lessonId: 'ai', situation: '동기 — 포기 위기 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'A veces pienso en dejarlo, no avanzo.', korean: '가끔 그만둘까 생각해, 진전이 없어서.', english: "Sometimes I think of quitting, I'm not progressing.", chinese: '有时想放弃，没有进步。' },
      { speaker: 'Veterano', spanish: 'Todos pasamos por ahí. El tango te enseña a perseverar más allá del baile.', korean: '다 그래봤어. 탱고는 춤 너머의 인내를 가르쳐.', english: "We all go through that. Tango teaches you perseverance beyond dance.", chinese: '我们都经历过。探戈教你超越舞蹈的坚持。' },
      { speaker: 'Yo', spanish: 'Gracias, lo necesitaba escuchar.', korean: '고마워, 듣고 싶었던 말이었어.', english: 'Thanks, I needed to hear that.', chinese: '谢谢，我需要听到这个。' },
    ],
  },

  // ============ 깊은 칭찬 (3) ============
  daic_079: {
    id: 'daic_079', lessonId: 'ai', situation: '칭찬 — 인격 칭찬',
    lines: [
      { speaker: 'Amigo', spanish: 'Sos una persona muy generosa en la pista.', korean: '댄스플로어에서 정말 너그러운 사람이야.', english: "You're a very generous person on the floor.", chinese: '你在舞池上是个很慷慨的人。' },
      { speaker: 'Yo', spanish: 'Para mí el tango es compartir, no competir.', korean: '나한테 탱고는 나눔이지 경쟁 아니야.', english: 'For me tango is sharing, not competing.', chinese: '对我来说探戈是分享，不是竞争。' },
    ],
  },
  daic_080: {
    id: 'daic_080', lessonId: 'ai', situation: '칭찬 — 스타일',
    lines: [
      { speaker: 'Amiga', spanish: 'Me encanta tu estilo, sos muy elegante.', korean: '네 스타일 너무 좋아, 정말 우아해.', english: 'I love your style, you\'re so elegant.', chinese: '我喜欢你的风格，你很优雅。' },
      { speaker: 'Yo', spanish: 'Vos también, tenés mucha personalidad bailando.', korean: '너도, 출 때 캐릭터가 살아 있어.', english: 'You too, you have a lot of personality when dancing.', chinese: '你也是，跳舞时很有个性。' },
    ],
  },
  daic_081: {
    id: 'daic_081', lessonId: 'ai', situation: '칭찬 — 감각·해석 (B1)',
    lines: [
      { speaker: 'Maestro', spanish: 'Lo que más valoro de tu baile es cómo interpretás el silencio en la música.', korean: '네 춤에서 가장 가치 있게 보는 건 음악의 침묵을 어떻게 해석하는가야.', english: 'What I value most in your dance is how you interpret silence in music.', chinese: '我最欣赏你舞蹈的是你如何诠释音乐中的静默。' },
      { speaker: 'Yo', spanish: 'Para mí los silencios dicen más que las notas.', korean: '나한테 침묵은 음표보다 많은 걸 말해.', english: 'For me silences say more than notes.', chinese: '对我来说静默比音符说得更多。' },
    ],
  },

  // ============ 갈등 해소 (3) ============
  daic_082: {
    id: 'daic_082', lessonId: 'ai', situation: '갈등 — 사과 받기',
    lines: [
      { speaker: 'Amiga', spanish: 'Perdón por lo de la semana pasada, fui muy seca.', korean: '지난주 일 미안해, 너무 차가웠어.', english: 'Sorry about last week, I was very curt.', chinese: '上周的事抱歉，我太冷淡了。' },
      { speaker: 'Yo', spanish: 'Ya está, todos tenemos días así.', korean: '괜찮아, 다 그런 날 있지.', english: "It's fine, we all have days like that.", chinese: '没事，大家都有这样的日子。' },
    ],
  },
  daic_083: {
    id: 'daic_083', lessonId: 'ai', situation: '갈등 — 소문 직접 묻기',
    lines: [
      { speaker: 'Yo', spanish: 'Me dijeron que andás hablando mal de mí, ¿es verdad?', korean: '내 욕하고 다닌다 들었는데 사실이야?', english: 'I was told you\'re speaking ill of me, is it true?', chinese: '有人告诉我你在背后说我坏话，是真的吗？' },
      { speaker: 'Amigo', spanish: 'Para nada, alguien deformó algo que dije. Hablemos.', korean: '전혀, 누가 내 말을 왜곡한 거야. 얘기하자.', english: "Not at all, someone twisted something I said. Let's talk.", chinese: '完全没有，有人扭曲了我说的话。我们谈谈。' },
    ],
  },
  daic_084: {
    id: 'daic_084', lessonId: 'ai', situation: '갈등 — 화해 후 복귀 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: 'Hace meses que no te veo en milonga, ¿qué pasó?', korean: '몇 달째 밀롱가에서 안 보여, 무슨 일이야?', english: "Haven't seen you in milonga for months, what happened?", chinese: '好几个月没在米隆加见到你，发生什么事了？' },
      { speaker: 'Yo', spanish: 'Tuve un conflicto y necesité distancia, pero ya estoy mejor.', korean: '갈등이 있어서 거리가 필요했어, 이젠 나아졌어.', english: 'I had a conflict and needed distance, but I\'m better now.', chinese: '我有过冲突需要距离，但现在好了。' },
      { speaker: 'Amiga', spanish: 'Qué bueno que volviste, te extrañábamos.', korean: '돌아와서 다행이야, 보고 싶었어.', english: "Glad you're back, we missed you.", chinese: '你回来真好，我们想你了。' },
    ],
  },

  // ============ 시간·약속 (3) ============
  daic_085: {
    id: 'daic_085', lessonId: 'ai', situation: '약속 — 만남 정하기',
    lines: [
      { speaker: 'Amiga', spanish: '¿Nos vemos en La Catedral mañana?', korean: '내일 라 카테드랄에서 봐?', english: 'See you at La Catedral tomorrow?', chinese: '明天在La Catedral见？' },
      { speaker: 'Yo', spanish: 'Sí, ¿a qué hora?', korean: '응, 몇 시에?', english: 'Yes, what time?', chinese: '好，几点？' },
      { speaker: 'Amiga', spanish: 'Llego como a las once.', korean: '11시쯤 도착해.', english: 'I get there around eleven.', chinese: '我十一点左右到。' },
    ],
  },
  daic_086: {
    id: 'daic_086', lessonId: 'ai', situation: '약속 — 변경 부탁',
    lines: [
      { speaker: 'Yo', spanish: '¿Podemos cambiar el horario? Me surgió algo.', korean: '시간 바꿀 수 있어? 일이 생겨서.', english: 'Can we change the time? Something came up.', chinese: '我们可以改时间吗？我有事。' },
      { speaker: 'Amigo', spanish: 'Sin problema, ¿qué hora te queda mejor?', korean: '문제 없어, 몇 시가 좋아?', english: 'No problem, what time works better for you?', chinese: '没问题，你几点合适？' },
    ],
  },
  daic_087: {
    id: 'daic_087', lessonId: 'ai', situation: '약속 — 마지막 순간 취소 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Mil disculpas, no voy a poder ir esta noche, mi hijo está enfermo.', korean: '정말 미안해, 오늘 밤 못 갈 것 같아, 아들이 아파.', english: "A thousand apologies, I won't be able to go tonight, my son is sick.", chinese: '万分抱歉，今晚去不了，我儿子病了。' },
      { speaker: 'Amiga', spanish: 'Por supuesto, primero la familia. ¿Necesitás algo?', korean: '당연하지, 가족이 먼저야. 뭐 필요한 거 있어?', english: 'Of course, family first. Do you need anything?', chinese: '当然，家人优先。你需要什么吗？' },
      { speaker: 'Yo', spanish: 'Gracias, te aviso cuando esté libre.', korean: '고마워, 시간 되면 알려줄게.', english: "Thanks, I'll let you know when I'm free.", chinese: '谢谢，我有空再告诉你。' },
    ],
  },

  // ============ 추가 — 일상 회화 (3) ============
  daic_088: {
    id: 'daic_088', lessonId: 'ai', situation: '인사 — 오랜만에',
    lines: [
      { speaker: 'Amigo', spanish: '¡Tanto tiempo sin verte!', korean: '진짜 오랜만이다!', english: 'Long time no see!', chinese: '好久不见！' },
      { speaker: 'Yo', spanish: 'Sí, casi un año. ¿Cómo va todo?', korean: '응, 거의 일 년. 다 어때?', english: 'Yeah, almost a year. How\'s everything?', chinese: '是啊，快一年了。一切都好吗？' },
    ],
  },
  daic_089: {
    id: 'daic_089', lessonId: 'ai', situation: '도움 — 길 묻기',
    lines: [
      { speaker: 'Yo', spanish: 'Disculpá, ¿sabés dónde queda el baño?', korean: '저기, 화장실 어디 있는지 알아?', english: 'Excuse me, do you know where the bathroom is?', chinese: '不好意思，你知道洗手间在哪吗？' },
      { speaker: 'Persona', spanish: 'Al fondo a la derecha.', korean: '안쪽 오른편이야.', english: 'At the back to the right.', chinese: '在最里面右手边。' },
    ],
  },
  daic_090: {
    id: 'daic_090', lessonId: 'ai', situation: '대화 — 인생 철학 (B1)',
    lines: [
      { speaker: 'Veterana', spanish: 'El tango me enseñó que escuchar es más importante que hablar.', korean: '탱고는 말하기보다 듣기가 더 중요하단 걸 가르쳤어.', english: 'Tango taught me that listening is more important than speaking.', chinese: '探戈教会我聆听比说话更重要。' },
      { speaker: 'Yo', spanish: 'Eso aplica a todo en la vida, ¿no?', korean: '그건 인생 모든 것에 적용되지, 그치?', english: 'That applies to everything in life, right?', chinese: '这适用于人生的一切，对吗？' },
      { speaker: 'Veterana', spanish: 'Por eso digo que es una filosofía en movimiento.', korean: '그래서 이게 움직이는 철학이라 하는 거야.', english: "That's why I say it's a philosophy in motion.", chinese: '所以我说这是流动中的哲学。' },
    ],
  },
};
