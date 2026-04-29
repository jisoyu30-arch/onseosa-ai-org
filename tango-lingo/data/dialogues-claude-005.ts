// Claude 직접 작성 dialogue — 배치 005
// 30개 (가족갈등·직장·정치회피·음악깊이·결혼·위로·종교·취미·펫·운동)
import type { DialogueExample } from './dialogues-l1';

export const dialoguesClaude005: Record<string, DialogueExample> = {
  // ============ 가족 갈등 (3) ============
  daic_121: {
    id: 'daic_121', lessonId: 'ai', situation: '가족 — 부모와 의견 차이',
    lines: [
      { speaker: 'Yo', spanish: 'Mi mamá no entiende por qué bailo tango a mi edad.', korean: '엄마는 내가 이 나이에 왜 탱고 추는지 몰라.', english: "My mom doesn't understand why I dance tango at my age.", chinese: '我妈不理解我这年纪为什么跳探戈。' },
      { speaker: 'Amiga', spanish: 'Generación distinta, otros valores.', korean: '다른 세대니까, 가치관이 달라.', english: 'Different generation, other values.', chinese: '不同的世代，价值观不一样。' },
    ],
  },
  daic_122: {
    id: 'daic_122', lessonId: 'ai', situation: '가족 — 형제 다툼 후',
    lines: [
      { speaker: 'Yo', spanish: 'Discutí con mi hermana, necesito desconectar bailando.', korean: '언니랑 다퉜어, 추면서 머리 비워야겠어.', english: 'I argued with my sister, I need to disconnect dancing.', chinese: '我跟姐姐吵架了，需要跳舞放空一下。' },
      { speaker: 'Amigo', spanish: 'El tango es buena terapia para eso.', korean: '탱고는 그런 데 좋은 치료지.', english: 'Tango is good therapy for that.', chinese: '探戈是这种事很好的疗愈。' },
    ],
  },
  daic_123: {
    id: 'daic_123', lessonId: 'ai', situation: '가족 — 배우자 무관심 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Mi marido nunca quiso aprender, dice que no es lo suyo.', korean: '남편은 배우려고 한 적이 없어, 자기 거 아니래.', english: 'My husband never wanted to learn, says it\'s not his thing.', chinese: '我丈夫从没想学，说这不是他的菜。' },
      { speaker: 'Amiga', spanish: 'Al menos te respeta el espacio. Hay algo de eso valioso.', korean: '적어도 네 공간은 존중해주잖아. 그것도 가치가 있어.', english: 'At least he respects your space. There\'s value in that.', chinese: '至少他尊重你的空间。这点很可贵。' },
      { speaker: 'Yo', spanish: 'Sí, mejor así que prohibirme.', korean: '응, 막는 것보단 낫지.', english: 'Yes, better than forbidding me.', chinese: '是啊，总比禁止我好。' },
    ],
  },

  // ============ 직장 스트레스 (3) ============
  daic_124: {
    id: 'daic_124', lessonId: 'ai', situation: '직장 — 야근 핑계',
    lines: [
      { speaker: 'Amigo', spanish: '¿Por qué llegaste tan tarde?', korean: '왜 이렇게 늦게 왔어?', english: 'Why did you arrive so late?', chinese: '你怎么这么晚才来？' },
      { speaker: 'Yo', spanish: 'Tuve que quedarme en la oficina hasta las nueve.', korean: '9시까지 사무실에 있어야 했어.', english: 'I had to stay at the office until nine.', chinese: '我得在办公室待到九点。' },
    ],
  },
  daic_125: {
    id: 'daic_125', lessonId: 'ai', situation: '직장 — 상사 험담',
    lines: [
      { speaker: 'Yo', spanish: 'Mi jefe es insoportable últimamente.', korean: '요즘 상사 진짜 못 참겠어.', english: 'My boss is unbearable lately.', chinese: '我老板最近难以忍受。' },
      { speaker: 'Amiga', spanish: '¿Qué pasó esta vez?', korean: '이번엔 뭔 일이야?', english: 'What happened this time?', chinese: '这次又怎么了？' },
      { speaker: 'Yo', spanish: 'Nada nuevo, micromanaging puro.', korean: '새로울 거 없어, 그냥 마이크로 매니지.', english: 'Nothing new, pure micromanaging.', chinese: '老一套，纯粹的微观管理。' },
    ],
  },
  daic_126: {
    id: 'daic_126', lessonId: 'ai', situation: '직장 — 이직 고민 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Estoy pensando seriamente en cambiar de trabajo.', korean: '심각하게 이직 생각 중이야.', english: "I'm seriously thinking about changing jobs.", chinese: '我认真在考虑换工作。' },
      { speaker: 'Amigo', spanish: '¿Tenés algo concreto en vista o es por hartazgo?', korean: '구체적인 거 있는 거야, 아니면 그냥 지쳐서?', english: "Do you have something concrete in mind or is it from being fed up?", chinese: '你有具体的方向吗？还是只是受够了？' },
      { speaker: 'Yo', spanish: 'Las dos cosas. Tengo entrevistas la próxima semana.', korean: '둘 다. 다음 주에 면접 있어.', english: 'Both. I have interviews next week.', chinese: '都有。下周有面试。' },
    ],
  },

  // ============ 정치 회피 매너 (3) ============
  daic_127: {
    id: 'daic_127', lessonId: 'ai', situation: '매너 — 정치 토픽 회피',
    lines: [
      { speaker: 'Conocido', spanish: '¿Qué opinás del nuevo presidente?', korean: '새 대통령 어떻게 생각해?', english: 'What do you think of the new president?', chinese: '你怎么看新总统？' },
      { speaker: 'Yo', spanish: 'Prefiero no hablar de política en la milonga.', korean: '밀롱가에서는 정치 얘기 안 하고 싶어.', english: 'I\'d rather not talk politics in milonga.', chinese: '我在米隆加里不想谈政治。' },
    ],
  },
  daic_128: {
    id: 'daic_128', lessonId: 'ai', situation: '매너 — 토픽 전환',
    lines: [
      { speaker: 'Conocido', spanish: 'La economía está terrible, ¿no?', korean: '경제 진짜 안 좋지?', english: "The economy is terrible, right?", chinese: '经济很糟糕，对吧？' },
      { speaker: 'Yo', spanish: 'Sí, pero hablemos de algo más alegre. ¿Bailás bien hoy?', korean: '맞는데 더 즐거운 얘기하자. 오늘 잘 추고 있어?', english: 'Yes, but let\'s talk about something happier. Are you dancing well today?', chinese: '是啊，但聊点更开心的吧。今天跳得好吗？' },
    ],
  },
  daic_129: {
    id: 'daic_129', lessonId: 'ai', situation: '매너 — 다양성 존중 표현 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Acá hay gente de todas las ideologías y nos llevamos bien.', korean: '여기엔 모든 이념의 사람이 있는데 다 잘 지내.', english: "Here there are people of all ideologies and we get along.", chinese: '这里有各种意识形态的人，但大家相处融洽。' },
      { speaker: 'Yo', spanish: 'El tango trasciende eso, es lo lindo.', korean: '탱고가 그걸 초월해, 아름다운 점이지.', english: 'Tango transcends that, it\'s the beauty.', chinese: '探戈超越这些，这就是美。' },
      { speaker: 'Amigo', spanish: 'En la pista todos somos iguales.', korean: '댄스플로어에선 다 평등해.', english: 'On the floor we\'re all equal.', chinese: '在舞池上大家都平等。' },
    ],
  },

  // ============ 음악 깊이 (탱고 너머) (3) ============
  daic_130: {
    id: 'daic_130', lessonId: 'ai', situation: '음악 — 다른 장르 좋아함',
    lines: [
      { speaker: 'Amigo', spanish: '¿Qué música escuchás fuera del tango?', korean: '탱고 외엔 무슨 음악 들어?', english: 'What music do you listen to outside of tango?', chinese: '探戈之外你听什么音乐？' },
      { speaker: 'Yo', spanish: 'Jazz, sobre todo Bill Evans.', korean: '재즈, 특히 빌 에반스.', english: 'Jazz, especially Bill Evans.', chinese: '爵士，尤其是比尔·埃文斯。' },
    ],
  },
  daic_131: {
    id: 'daic_131', lessonId: 'ai', situation: '음악 — 콘서트 같이 가기',
    lines: [
      { speaker: 'Amiga', spanish: 'Hay un concierto de Piazzolla la próxima semana.', korean: '다음 주에 피아솔라 콘서트 있어.', english: 'There\'s a Piazzolla concert next week.', chinese: '下周有皮亚佐拉的音乐会。' },
      { speaker: 'Yo', spanish: '¿Sacamos entradas juntos?', korean: '같이 표 살까?', english: 'Shall we get tickets together?', chinese: '我们一起买票吗？' },
    ],
  },
  daic_132: {
    id: 'daic_132', lessonId: 'ai', situation: '음악 — 가사 해석 (B1)',
    lines: [
      { speaker: 'Yo', spanish: '¿Qué significa "garufa" en este tango?', korean: '이 탱고에서 garufa가 뭔 뜻이야?', english: 'What does "garufa" mean in this tango?', chinese: '这首探戈里"garufa"是什么意思？' },
      { speaker: 'Amigo', spanish: 'Es lunfardo, significa juerga, fiesta.', korean: '룬파르도야, 흥청망청 노는 거 뜻해.', english: "It's lunfardo, means party, revelry.", chinese: '这是隆法多语，意思是狂欢、派对。' },
      { speaker: 'Yo', spanish: 'Cuántas palabras tiene el lunfardo, fascinante.', korean: '룬파르도엔 단어가 정말 많네, 흥미로워.', english: 'How many words lunfardo has, fascinating.', chinese: '隆法多语词汇真多，太迷人了。' },
    ],
  },

  // ============ 결혼식·축하 (3) ============
  daic_133: {
    id: 'daic_133', lessonId: 'ai', situation: '축하 — 결혼 축하',
    lines: [
      { speaker: 'Amiga', spanish: '¡Me caso en marzo!', korean: '나 3월에 결혼해!', english: "I'm getting married in March!", chinese: '我三月结婚！' },
      { speaker: 'Yo', spanish: '¡Felicitaciones! ¡Qué noticia hermosa!', korean: '축하해! 정말 멋진 소식이야!', english: 'Congratulations! What beautiful news!', chinese: '恭喜！太棒的消息！' },
    ],
  },
  daic_134: {
    id: 'daic_134', lessonId: 'ai', situation: '축하 — 생일',
    lines: [
      { speaker: 'Amigo', spanish: '¡Feliz cumple! ¿Cuántos cumplís?', korean: '생일 축하해! 몇 살이야?', english: 'Happy birthday! How old are you turning?', chinese: '生日快乐！多大了？' },
      { speaker: 'Yo', spanish: 'Cuarenta y cinco. La edad ideal para bailar tango.', korean: '45살. 탱고 추기 딱 좋은 나이.', english: 'Forty-five. The ideal age for tango.', chinese: '四十五岁。跳探戈的理想年龄。' },
    ],
  },
  daic_135: {
    id: 'daic_135', lessonId: 'ai', situation: '축하 — 결혼식 첫 댄스 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: 'Para nuestra boda elegimos un tango como primer baile.', korean: '우리 결혼식에 첫 댄스로 탱고 골랐어.', english: 'For our wedding we chose a tango as first dance.', chinese: '我们婚礼第一支舞选了探戈。' },
      { speaker: 'Yo', spanish: '¡Qué romántico! ¿Cuál tema?', korean: '진짜 로맨틱하다! 어떤 곡?', english: 'How romantic! Which song?', chinese: '太浪漫了！哪首？' },
      { speaker: 'Amiga', spanish: '"La Cumparsita", clásico de clásicos.', korean: '"라 쿰파르시타", 고전 중의 고전.', english: '"La Cumparsita", classic of classics.', chinese: '《La Cumparsita》，经典中的经典。' },
    ],
  },

  // ============ 장례·위로 (3) ============
  daic_136: {
    id: 'daic_136', lessonId: 'ai', situation: '위로 — 슬픈 소식',
    lines: [
      { speaker: 'Amigo', spanish: 'Falleció mi tío hace dos semanas.', korean: '2주 전에 삼촌이 돌아가셨어.', english: 'My uncle passed away two weeks ago.', chinese: '我叔叔两周前去世了。' },
      { speaker: 'Yo', spanish: 'Lo siento mucho. Te acompaño en el sentimiento.', korean: '진심으로 안타까워. 함께 슬퍼할게.', english: "I'm so sorry. I share your feeling.", chinese: '我很遗憾。请节哀。' },
    ],
  },
  daic_137: {
    id: 'daic_137', lessonId: 'ai', situation: '위로 — 친구 위기',
    lines: [
      { speaker: 'Amiga', spanish: 'Estoy pasando un momento difícil.', korean: '지금 힘든 시기야.', english: "I'm going through a difficult time.", chinese: '我正经历艰难的时刻。' },
      { speaker: 'Yo', spanish: 'Estoy acá si necesitás hablar.', korean: '얘기 필요하면 여기 있어.', english: "I'm here if you need to talk.", chinese: '需要聊天我都在。' },
    ],
  },
  daic_138: {
    id: 'daic_138', lessonId: 'ai', situation: '위로 — 회복 응원 (B1)',
    lines: [
      { speaker: 'Veterana', spanish: 'Después de la pérdida, el tango fue lo único que me hizo sentir viva.', korean: '잃은 뒤에 탱고만이 나를 살아있게 했어.', english: 'After the loss, tango was the only thing that made me feel alive.', chinese: '失去后，探戈是唯一让我感到活着的东西。' },
      { speaker: 'Yo', spanish: 'A veces el cuerpo sabe sanar antes que la mente.', korean: '가끔 마음보다 몸이 먼저 치유하는 법 알아.', english: 'Sometimes the body knows how to heal before the mind.', chinese: '有时身体比心更懂得疗愈。' },
      { speaker: 'Veterana', spanish: 'Eso lo aprendí en estos años bailando.', korean: '그걸 추면서 배웠어, 이 몇 년 동안.', english: "I learned that dancing all these years.", chinese: '这是这些年跳舞学到的。' },
    ],
  },

  // ============ 종교·신앙 가벼움 (3) ============
  daic_139: {
    id: 'daic_139', lessonId: 'ai', situation: '신앙 — 종교 가볍게',
    lines: [
      { speaker: 'Amigo', spanish: '¿Sos de alguna religión?', korean: '종교 있어?', english: 'Do you have a religion?', chinese: '你有宗教信仰吗？' },
      { speaker: 'Yo', spanish: 'Espiritual sí, religiosa no.', korean: '영적이긴 한데 종교적이진 않아.', english: 'Spiritual yes, religious no.', chinese: '有精神追求，但不属于宗教。' },
    ],
  },
  daic_140: {
    id: 'daic_140', lessonId: 'ai', situation: '신앙 — 명상 추천',
    lines: [
      { speaker: 'Yo', spanish: 'Empecé a meditar todas las mañanas.', korean: '매일 아침 명상 시작했어.', english: 'I started meditating every morning.', chinese: '我开始每天早上冥想。' },
      { speaker: 'Amiga', spanish: '¿Y notás diferencia?', korean: '효과 느껴?', english: 'And do you notice a difference?', chinese: '感觉到差别吗？' },
      { speaker: 'Yo', spanish: 'Mucha. Bailo más conectada también.', korean: '많이. 출 때도 더 연결돼.', english: 'A lot. I dance more connected too.', chinese: '很多。跳舞时也更连接。' },
    ],
  },
  daic_141: {
    id: 'daic_141', lessonId: 'ai', situation: '신앙 — 깊은 믿음 공유 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: 'Para mí Dios está en cada abrazo, en cada pieza de tango.', korean: '나한테 신은 매 아브라소, 매 탱고 곡 안에 있어.', english: 'For me God is in every embrace, in every tango piece.', chinese: '对我来说，上帝在每个拥抱、每首探戈里。' },
      { speaker: 'Yo', spanish: 'Hermoso lo que decís, no necesitás iglesia.', korean: '말 정말 아름답다, 교회 안 필요해.', english: 'Beautiful what you say, you don\'t need a church.', chinese: '你说得真美，不需要教堂。' },
    ],
  },

  // ============ 취미 다양 (3) ============
  daic_142: {
    id: 'daic_142', lessonId: 'ai', situation: '취미 — 그림 그리기',
    lines: [
      { speaker: 'Amiga', spanish: 'Empecé clases de pintura los sábados.', korean: '토요일에 그림 수업 시작했어.', english: 'I started painting classes on Saturdays.', chinese: '我周六开始上绘画课。' },
      { speaker: 'Yo', spanish: '¡Qué bueno! ¿Acuarela u óleo?', korean: '좋다! 수채화? 유화?', english: 'How nice! Watercolor or oil?', chinese: '真好！水彩还是油画？' },
    ],
  },
  daic_143: {
    id: 'daic_143', lessonId: 'ai', situation: '취미 — 요리',
    lines: [
      { speaker: 'Amigo', spanish: 'Ayer hice empanadas caseras por primera vez.', korean: '어제 처음으로 집에서 엠파나다 만들었어.', english: 'Yesterday I made homemade empanadas for the first time.', chinese: '昨天我第一次做了自家的肉饺。' },
      { speaker: 'Yo', spanish: '¡Qué valiente! ¿Cómo salieron?', korean: '대단하다! 어떻게 나왔어?', english: 'How brave! How did they turn out?', chinese: '真勇敢！做得怎么样？' },
      { speaker: 'Amigo', spanish: 'Aceptables, mi abuela las hace mejor.', korean: '봐줄 만, 할머니가 더 잘 만드시지.', english: 'Acceptable, my grandma makes them better.', chinese: '勉强能吃，我奶奶做得更好。' },
    ],
  },
  daic_144: {
    id: 'daic_144', lessonId: 'ai', situation: '취미 — 글쓰기 깊이 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Estoy escribiendo un blog sobre mi viaje al tango.', korean: '내 탱고 여정에 대한 블로그 쓰고 있어.', english: "I'm writing a blog about my tango journey.", chinese: '我在写关于自己探戈旅程的博客。' },
      { speaker: 'Amiga', spanish: '¡Pasame el link cuando publiques!', korean: '올리면 링크 보내줘!', english: 'Send me the link when you publish!', chinese: '发布后给我链接！' },
      { speaker: 'Yo', spanish: 'En realidad me ayuda a procesar lo que aprendo.', korean: '사실 배우는 걸 정리하는 데 도움 돼.', english: 'It actually helps me process what I learn.', chinese: '其实它帮我整理所学。' },
    ],
  },

  // ============ 펫 (3) ============
  daic_145: {
    id: 'daic_145', lessonId: 'ai', situation: '펫 — 강아지 자랑',
    lines: [
      { speaker: 'Amiga', spanish: 'Mirá la foto de mi perrita.', korean: '내 강아지 사진 봐.', english: 'Look at my dog\'s photo.', chinese: '看我家狗狗的照片。' },
      { speaker: 'Yo', spanish: '¡Qué hermosa! ¿Cómo se llama?', korean: '예쁘다! 이름이 뭐야?', english: 'How beautiful! What\'s her name?', chinese: '好可爱！叫什么名字？' },
      { speaker: 'Amiga', spanish: 'Milonga, obviamente.', korean: '밀롱가, 당연히.', english: 'Milonga, obviously.', chinese: 'Milonga，当然。' },
    ],
  },
  daic_146: {
    id: 'daic_146', lessonId: 'ai', situation: '펫 — 고양이 키우기',
    lines: [
      { speaker: 'Yo', spanish: 'Adopté un gato hace un mes.', korean: '한 달 전에 고양이 입양했어.', english: 'I adopted a cat a month ago.', chinese: '我一个月前领养了一只猫。' },
      { speaker: 'Amigo', spanish: 'Los gatos son la mejor compañía para gente que vive sola.', korean: '혼자 사는 사람한텐 고양이가 최고 친구지.', english: 'Cats are the best company for people who live alone.', chinese: '猫是独居者最好的陪伴。' },
    ],
  },
  daic_147: {
    id: 'daic_147', lessonId: 'ai', situation: '펫 — 잃음 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: 'Se me murió mi gato la semana pasada.', korean: '지난주에 고양이 잃었어.', english: 'My cat died last week.', chinese: '我的猫上周走了。' },
      { speaker: 'Yo', spanish: 'Cuánto lo siento, sé el vínculo que tenías con él.', korean: '진짜 안타까워, 너희 사이 알아.', english: "I'm so sorry, I know the bond you had with him.", chinese: '我很遗憾，我知道你和它的感情。' },
      { speaker: 'Amiga', spanish: 'Quince años a mi lado, no es fácil.', korean: '15년 같이 살았는데, 쉽지 않아.', english: 'Fifteen years by my side, it\'s not easy.', chinese: '十五年陪伴，不容易。' },
    ],
  },

  // ============ 운동·취미 (3) ============
  daic_148: {
    id: 'daic_148', lessonId: 'ai', situation: '운동 — 요가 추천',
    lines: [
      { speaker: 'Yo', spanish: 'Empecé yoga, me ayuda mucho con la postura del tango.', korean: '요가 시작했어, 탱고 자세에 도움 많이 돼.', english: "I started yoga, it helps a lot with tango posture.", chinese: '我开始练瑜伽了，对探戈姿势有很大帮助。' },
      { speaker: 'Amiga', spanish: 'Lo probé pero no soy constante.', korean: '해봤는데 꾸준히 못 해.', english: "I tried but I'm not consistent.", chinese: '我试过但坚持不下来。' },
    ],
  },
  daic_149: {
    id: 'daic_149', lessonId: 'ai', situation: '운동 — 달리기 시작',
    lines: [
      { speaker: 'Amigo', spanish: 'Salgo a correr antes de ir a la oficina.', korean: '출근 전에 달리기 해.', english: 'I go running before going to the office.', chinese: '我上班前去跑步。' },
      { speaker: 'Yo', spanish: '¿A qué hora te levantás?', korean: '몇 시에 일어나?', english: 'What time do you get up?', chinese: '你几点起床？' },
      { speaker: 'Amigo', spanish: 'A las cinco y media, brutal pero adictivo.', korean: '5시 반, 가혹하지만 중독돼.', english: 'Five-thirty, brutal but addictive.', chinese: '五点半，残酷但上瘾。' },
    ],
  },
  daic_150: {
    id: 'daic_150', lessonId: 'ai', situation: '운동 — 부상 예방 토론 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Pilates me cambió, ya no me lastimo en milonga.', korean: '필라테스가 날 바꿨어, 이제 밀롱가에서 안 다쳐.', english: "Pilates changed me, I don't get hurt at milonga anymore.", chinese: '普拉提改变了我，现在跳米隆加不再受伤了。' },
      { speaker: 'Amigo', spanish: 'Entonces el core es la clave para el tango.', korean: '그럼 코어가 탱고의 핵심이네.', english: 'So the core is the key for tango.', chinese: '所以核心是探戈的关键。' },
      { speaker: 'Yo', spanish: 'Sin duda, todo nace ahí.', korean: '확실히, 모든 게 거기서 나와.', english: 'No doubt, everything comes from there.', chinese: '毫无疑问，一切都从那里出发。' },
    ],
  },
};
