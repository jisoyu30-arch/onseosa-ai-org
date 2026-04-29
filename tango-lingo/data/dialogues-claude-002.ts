// Claude 직접 작성 dialogue — 배치 002
// 30개 (새 카테고리: 프락티카, 음악 토론, 역사·문화, 여행, 관계 매너, 세대, 테크닉, 감정, 페스티벌, 학습)
import type { DialogueExample } from './dialogues-l1';

export const dialoguesClaude002: Record<string, DialogueExample> = {
  // ============ 프락티카·워크샵 (3) ============
  daic_031: {
    id: 'daic_031', lessonId: 'ai', situation: '프락티카 — 같이 연습 제안',
    lines: [
      { speaker: 'Amigo', spanish: '¿Querés practicar el ocho cortado?', korean: '오초 코르타도 같이 연습할래?', english: 'Want to practice the ocho cortado?', chinese: '想一起练切八字步吗？' },
      { speaker: 'Yo', spanish: 'Sí, justo me cuesta esa transición.', korean: '응, 그 전환이 딱 어려워.', english: "Yes, that transition is tough for me.", chinese: '好，那个转换我正觉得难。' },
    ],
  },
  daic_032: {
    id: 'daic_032', lessonId: 'ai', situation: '워크샵 — 등록 정보',
    lines: [
      { speaker: 'Tanguera', spanish: '¿Vas al workshop de Sebastián el sábado?', korean: '토요일 세바스티안 워크샵 가?', english: "Are you going to Sebastián's workshop Saturday?", chinese: '你去周六塞巴斯蒂安的工作坊吗？' },
      { speaker: 'Yo', spanish: 'Quería ir, pero ya no quedan lugares.', korean: '가고 싶었는데 자리가 없대.', english: 'I wanted to, but there are no spots left.', chinese: '想去，但已经没有名额了。' },
      { speaker: 'Tanguera', spanish: 'Te paso mi lugar, no puedo ir.', korean: '내 자리 줄게, 나 못 가.', english: "I'll give you my spot, I can't go.", chinese: '我把名额给你，我去不了。' },
    ],
  },
  daic_033: {
    id: 'daic_033', lessonId: 'ai', situation: '프락티카 — 영상 같이 분석 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: '¿Viste el último video de Chicho? Hace una giro impresionante.', korean: '치초 최근 영상 봤어? 진짜 멋진 회전 해.', english: 'Did you see Chicho\'s latest video? He does an impressive turn.', chinese: '你看了奇乔最新视频吗？转得很惊艳。' },
      { speaker: 'Yo', spanish: 'Lo vi, pero no entiendo cómo mantiene el eje así.', korean: '봤어, 근데 어떻게 축을 그렇게 유지하는지 모르겠어.', english: "I saw it, but I don't understand how he keeps the axis like that.", chinese: '看了，但我不明白他是怎么保持轴心的。' },
      { speaker: 'Amigo', spanish: 'Es todo trabajo de pie y rodilla relajada.', korean: '다 발 작업이랑 무릎 풀기야.', english: "It's all foot work and relaxed knee.", chinese: '都是脚的功夫和放松膝盖。' },
    ],
  },

  // ============ 음악 토론·가사 (3) ============
  daic_034: {
    id: 'daic_034', lessonId: 'ai', situation: '음악 — 가사 의미 묻기',
    lines: [
      { speaker: 'Yo', spanish: '¿Qué dice esta letra? No entiendo todo.', korean: '이 가사 뭐라는 거야? 다 이해 못 하겠어.', english: "What does this lyric say? I don't get it all.", chinese: '这歌词说什么？我没全听懂。' },
      { speaker: 'Amigo', spanish: 'Habla de un amor perdido, típico tango.', korean: '잃은 사랑 얘기야, 전형적인 탱고.', english: "It talks about a lost love, typical tango.", chinese: '讲失去的爱情，典型的探戈。' },
    ],
  },
  daic_035: {
    id: 'daic_035', lessonId: 'ai', situation: '음악 — Por una Cabeza',
    lines: [
      { speaker: 'Amiga', spanish: 'Adoro Por una Cabeza, me hace llorar.', korean: 'Por una Cabeza 너무 좋아, 울게 돼.', english: 'I adore Por una Cabeza, it makes me cry.', chinese: '我超爱《一步之遥》，听了就想哭。' },
      { speaker: 'Yo', spanish: 'Gardel sigue siendo el rey, ¿no?', korean: '가르델은 여전히 왕이지, 그치?', english: 'Gardel is still the king, right?', chinese: '加德尔还是王者，对吧？' },
    ],
  },
  daic_036: {
    id: 'daic_036', lessonId: 'ai', situation: '음악 — 오케스트라 비교 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Para mí D\'Arienzo es para principiantes y Pugliese para los que ya entienden el tango.', korean: '내 생각엔 다리엔소는 초보용이고 푸글리에세는 탱고를 이해한 사람용이야.', english: "For me D'Arienzo is for beginners and Pugliese for those who already understand tango.", chinese: '我觉得达里安佐适合初学者，普利亚适合已经懂探戈的人。' },
      { speaker: 'Yo', spanish: 'No coincido. D\'Arienzo tiene una energía que muchos avanzados no logran sentir.', korean: '동의 못 해. 다리엔소는 많은 고수도 못 느끼는 에너지가 있어.', english: "I don't agree. D'Arienzo has an energy many advanced dancers can't feel.", chinese: '我不同意。达里安佐有种能量，连很多高手都感受不到。' },
    ],
  },

  // ============ 탱고 역사·문화 (3) ============
  daic_037: {
    id: 'daic_037', lessonId: 'ai', situation: '문화 — 탱고 기원 묻기',
    lines: [
      { speaker: 'Yo', spanish: '¿Sabés cuándo nació el tango?', korean: '탱고가 언제 생겼는지 알아?', english: 'Do you know when tango was born?', chinese: '你知道探戈什么时候诞生的吗？' },
      { speaker: 'Amigo', spanish: 'A finales del siglo XIX, en los suburbios de Buenos Aires.', korean: '19세기 말, 부에노스 변두리에서.', english: 'Late 19th century, in the outskirts of Buenos Aires.', chinese: '十九世纪末，布宜诺斯艾利斯郊区。' },
    ],
  },
  daic_038: {
    id: 'daic_038', lessonId: 'ai', situation: '문화 — Golden Age',
    lines: [
      { speaker: 'Amiga', spanish: 'La época dorada fue de los años 30 a los 50, ¿no?', korean: '황금기가 30년대에서 50년대까지였지, 맞지?', english: 'The golden age was from the 30s to 50s, right?', chinese: '黄金时代是从三十年代到五十年代，对吗？' },
      { speaker: 'Yo', spanish: 'Exacto, después vino la dictadura y el tango se silenció.', korean: '맞아, 그 다음 독재가 와서 탱고가 침묵했어.', english: 'Exactly, then came the dictatorship and tango was silenced.', chinese: '没错，后来独裁来了，探戈沉寂了。' },
    ],
  },
  daic_039: {
    id: 'daic_039', lessonId: 'ai', situation: '문화 — 탱고 르네상스 (B1)',
    lines: [
      { speaker: 'Veterano', spanish: 'En los 80 hubo un renacimiento gracias a Tango Argentino en Broadway.', korean: '80년대에 브로드웨이의 Tango Argentino 덕분에 부흥기가 왔어.', english: "In the 80s there was a renaissance thanks to Tango Argentino on Broadway.", chinese: '八十年代因为百老汇的《探戈阿根廷》有了复兴。' },
      { speaker: 'Yo', spanish: 'Increíble cómo un show puede revivir toda una cultura.', korean: '쇼 하나가 문화 전체를 살릴 수 있다니 놀라워.', english: 'Amazing how one show can revive an entire culture.', chinese: '一个演出能让整个文化复活，太不可思议了。' },
    ],
  },

  // ============ 부에노스 여행·먹거리 (3) ============
  daic_040: {
    id: 'daic_040', lessonId: 'ai', situation: '여행 — 첫 부에노스 추천',
    lines: [
      { speaker: 'Yo', spanish: 'Voy a Buenos Aires por primera vez, ¿qué milongas me recomendás?', korean: '부에노스 처음 가는데 어떤 밀롱가 추천해?', english: "I'm going to Buenos Aires for the first time, what milongas do you recommend?", chinese: '我第一次去布宜诺斯艾利斯，推荐哪些米隆加？' },
      { speaker: 'Amigo', spanish: 'Salón Canning los lunes y La Viruta los sábados, imperdibles.', korean: '월요일 살론 캐닝, 토요일 라 비루타, 꼭 가.', english: 'Salón Canning on Mondays and La Viruta on Saturdays, must-go.', chinese: '周一去Salón Canning，周六去La Viruta，必去。' },
    ],
  },
  daic_041: {
    id: 'daic_041', lessonId: 'ai', situation: '먹거리 — 아사도 추천',
    lines: [
      { speaker: 'Amiga', spanish: 'Después de la milonga, vamos a comer un asado.', korean: '밀롱가 끝나고 아사도 먹으러 가자.', english: "After the milonga, let's go eat an asado.", chinese: '米隆加结束后我们去吃烤肉。' },
      { speaker: 'Yo', spanish: '¡Sí! Necesito probar la verdadera carne argentina.', korean: '좋아! 진짜 아르헨 고기 먹어봐야지.', english: 'Yes! I need to try real Argentine beef.', chinese: '好！我得尝尝真正的阿根廷牛肉。' },
    ],
  },
  daic_042: {
    id: 'daic_042', lessonId: 'ai', situation: '여행 — 안전·이동 팁 (B1)',
    lines: [
      { speaker: 'Yo', spanish: '¿Es seguro volver de la milonga a las 4 de la madrugada?', korean: '새벽 4시에 밀롱가에서 돌아오는 거 안전해?', english: 'Is it safe to come back from the milonga at 4 in the morning?', chinese: '凌晨四点从米隆加回来安全吗？' },
      { speaker: 'Amigo', spanish: 'Conviene pedir un Cabify, no caminar con los zapatos en la mano.', korean: 'Cabify 부르는 게 나아, 신발 들고 걸으면 안 돼.', english: "Better to call a Cabify, don't walk with your shoes in hand.", chinese: '叫Cabify比较好，别拿着鞋走路。' },
      { speaker: 'Yo', spanish: 'Anotado, gracias por el consejo.', korean: '알겠어, 조언 고마워.', english: 'Noted, thanks for the advice.', chinese: '记下了，谢谢建议。' },
    ],
  },

  // ============ 갈등·관계 매너 (3) ============
  daic_043: {
    id: 'daic_043', lessonId: 'ai', situation: '매너 — 너무 꽉 잡힘',
    lines: [
      { speaker: 'Tanguera', spanish: 'Disculpá, me apretás un poco fuerte el hombro.', korean: '죄송한데 어깨를 좀 세게 잡아요.', english: 'Sorry, you\'re holding my shoulder a bit tight.', chinese: '抱歉，你握我肩膀有点紧。' },
      { speaker: 'Tanguero', spanish: 'Perdón, no me di cuenta. ¿Mejor así?', korean: '미안해요, 몰랐어요. 이게 더 나아요?', english: "Sorry, I didn't realize. Better like this?", chinese: '抱歉，我没意识到。这样好些吗？' },
    ],
  },
  daic_044: {
    id: 'daic_044', lessonId: 'ai', situation: '매너 — 향수 강함 부탁',
    lines: [
      { speaker: 'Tanguera', spanish: 'Tu perfume es lindo pero un poco fuerte para abrazo cerrado.', korean: '향수는 좋은데 클로즈 아브라소엔 좀 진해요.', english: 'Your perfume is nice but a bit strong for close embrace.', chinese: '你的香水很好闻，但对紧握来说太浓了一点。' },
      { speaker: 'Tanguero', spanish: 'Gracias por decirlo, lo voy a tener en cuenta.', korean: '말해줘서 고마워요, 신경 쓸게요.', english: "Thanks for telling me, I'll keep it in mind.", chinese: '谢谢你告诉我，我会注意的。' },
    ],
  },
  daic_045: {
    id: 'daic_045', lessonId: 'ai', situation: '매너 — 무리한 부탁 거절 (B1)',
    lines: [
      { speaker: 'Conocido', spanish: '¿Me podés enseñar el sacada esa que hacés?', korean: '네가 하는 그 사카다 가르쳐줄 수 있어?', english: 'Can you teach me that sacada you do?', chinese: '你能教我你跳的那个推步吗？' },
      { speaker: 'Yo', spanish: 'Mejor que lo veas con un profe, yo no enseño bien.', korean: '선생님한테 배우는 게 나아, 나는 잘 못 가르쳐.', english: "Better see a teacher, I don't teach well.", chinese: '你跟老师学比较好，我不会教。' },
      { speaker: 'Conocido', spanish: 'Tenés razón, gracias igual.', korean: '맞네, 어쨌든 고마워.', english: "You're right, thanks anyway.", chinese: '你说得对，还是谢谢你。' },
    ],
  },

  // ============ 세대·나이 (3) ============
  daic_046: {
    id: 'daic_046', lessonId: 'ai', situation: '세대 — 나이차 친구',
    lines: [
      { speaker: 'Joven', spanish: '¡Qué bien bailás para tu edad!', korean: '나이에 비해 정말 잘 추시네요!', english: 'You dance so well for your age!', chinese: '您这年纪跳得真好！' },
      { speaker: 'Veterano', spanish: 'Llevo cuarenta años en esto, mijo.', korean: '40년째 하고 있단다, 친구.', english: "I've been doing this forty years, kid.", chinese: '我跳了四十年了，年轻人。' },
    ],
  },
  daic_047: {
    id: 'daic_047', lessonId: 'ai', situation: '세대 — 너무 늦게 시작?',
    lines: [
      { speaker: 'Yo', spanish: 'Empecé tango a los cincuenta, ¿es muy tarde?', korean: '50살에 탱고 시작했는데 너무 늦었나?', english: 'I started tango at fifty, is it too late?', chinese: '我五十岁开始跳探戈，太晚了吗？' },
      { speaker: 'Veterana', spanish: 'Para nada, la mayoría empieza así. El tango es para toda la vida.', korean: '전혀, 대부분 그렇게 시작해. 탱고는 평생이야.', english: 'Not at all, most start like that. Tango is for life.', chinese: '完全不晚，大多数人都这样开始的。探戈是一辈子的。' },
    ],
  },
  daic_048: {
    id: 'daic_048', lessonId: 'ai', situation: '세대 — 옛날 vs 지금 (B1)',
    lines: [
      { speaker: 'Veterano', spanish: 'En mi época, había códigos más estrictos en las milongas.', korean: '내 시절엔 밀롱가에 더 엄격한 규칙이 있었어.', english: 'In my time, there were stricter codes in milongas.', chinese: '在我那个时代，米隆加的规矩更严格。' },
      { speaker: 'Yo', spanish: 'Algunos códigos se mantienen, pero otros se relajaron.', korean: '어떤 규칙은 유지됐지만 다른 건 풀어졌죠.', english: 'Some codes are kept, but others have relaxed.', chinese: '一些规矩还保留着，但其他的放松了。' },
      { speaker: 'Veterano', spanish: 'Lo importante es respetar la pista.', korean: '중요한 건 댄스플로어를 존중하는 거야.', english: 'The important thing is to respect the floor.', chinese: '重要的是尊重舞池。' },
    ],
  },

  // ============ 테크닉 깊이 (3) ============
  daic_049: {
    id: 'daic_049', lessonId: 'ai', situation: '테크닉 — 무게 이동 질문',
    lines: [
      { speaker: 'Alumna', spanish: '¿Cómo sé cuándo cambiar el peso?', korean: '언제 무게를 옮길지 어떻게 알아요?', english: 'How do I know when to change weight?', chinese: '我怎么知道什么时候换重心？' },
      { speaker: 'Profesor', spanish: 'Sentí la marca antes de moverte, no anticipes.', korean: '움직이기 전에 신호 느껴, 미리 가지 마.', english: "Feel the lead before moving, don't anticipate.", chinese: '动之前先感觉引导，别抢拍。' },
    ],
  },
  daic_050: {
    id: 'daic_050', lessonId: 'ai', situation: '테크닉 — 디소시아시온',
    lines: [
      { speaker: 'Alumno', spanish: 'No logro la disociación entre torso y caderas.', korean: '상체랑 골반 분리가 안 돼요.', english: "I can't get the dissociation between torso and hips.", chinese: '我做不到上身和胯部的分离。' },
      { speaker: 'Profesora', spanish: 'Trabajalo lento frente al espejo, sin pareja.', korean: '거울 보면서 천천히 혼자 연습해.', english: 'Work it slow in front of the mirror, without a partner.', chinese: '对着镜子慢慢练，不要搭档。' },
    ],
  },
  daic_051: {
    id: 'daic_051', lessonId: 'ai', situation: '테크닉 — 칼레시타 깊이 (B1)',
    lines: [
      { speaker: 'Alumno', spanish: 'En la calesita, ¿el follower gira alrededor del leader o juntos?', korean: '칼레시타에서 팔로워가 리더 둘레를 돌아요, 같이 돌아요?', english: 'In the calesita, does the follower turn around the leader or both together?', chinese: '在卡莱西塔里，跟舞者绕着领舞转还是一起转？' },
      { speaker: 'Profesor', spanish: 'El leader es el eje, la follower orbita. Pero ambos respiran juntos.', korean: '리더가 축이고 팔로워가 궤도. 근데 둘이 같이 숨 쉬어.', english: 'The leader is the axis, the follower orbits. But both breathe together.', chinese: '领舞是轴心，跟舞者绕轨。但两人一起呼吸。' },
    ],
  },

  // ============ 감정 표현 (3) ============
  daic_052: {
    id: 'daic_052', lessonId: 'ai', situation: '감정 — 긴장됨',
    lines: [
      { speaker: 'Yo', spanish: 'Estoy muy nervioso, es mi primera vez en esta milonga.', korean: '진짜 긴장돼, 이 밀롱가 처음이야.', english: "I'm so nervous, it's my first time at this milonga.", chinese: '我好紧张，这是我第一次来这个米隆加。' },
      { speaker: 'Amigo', spanish: 'Tranquilo, todos somos amigables acá.', korean: '편안히 해, 여기 다 친절해.', english: "Easy, we're all friendly here.", chinese: '放松，我们这里大家都友好。' },
    ],
  },
  daic_053: {
    id: 'daic_053', lessonId: 'ai', situation: '감정 — 음악에 사로잡힘',
    lines: [
      { speaker: 'Tanguera', spanish: 'Esta orquestación me pone la piel de gallina.', korean: '이 편곡 들으면 소름 돋아.', english: 'This arrangement gives me goosebumps.', chinese: '这个编曲让我起鸡皮疙瘩。' },
      { speaker: 'Tanguero', spanish: 'A mí también, vamos a aprovecharla.', korean: '나도, 충분히 만끽하자.', english: "Me too, let's make the most of it.", chinese: '我也是，我们好好享受吧。' },
    ],
  },
  daic_054: {
    id: 'daic_054', lessonId: 'ai', situation: '감정 — 좌절 표현 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'A veces siento que no avanzo, como si estuviera estancada.', korean: '가끔 진전이 없는 것 같아, 정체된 느낌이야.', english: 'Sometimes I feel I\'m not progressing, like I\'m stuck.', chinese: '有时我觉得没进步，好像卡住了。' },
      { speaker: 'Veterana', spanish: 'Esos plateaus son normales, justo antes de un salto grande.', korean: '그런 정체기 정상이야, 큰 도약 직전이지.', english: 'Those plateaus are normal, just before a big leap.', chinese: '这种瓶颈很正常，就在大突破之前。' },
      { speaker: 'Yo', spanish: 'Espero que sea pronto.', korean: '곧 왔으면 좋겠다.', english: 'I hope it\'s soon.', chinese: '希望快点来。' },
    ],
  },

  // ============ 페스티벌·여행 (3) ============
  daic_055: {
    id: 'daic_055', lessonId: 'ai', situation: '페스티벌 — 어디 갈까',
    lines: [
      { speaker: 'Amiga', spanish: '¿A qué festival vas este año?', korean: '올해 어떤 페스티벌 가?', english: 'Which festival are you going to this year?', chinese: '今年你去哪个节？' },
      { speaker: 'Yo', spanish: 'Estoy entre Sitges y Berlín, no me decido.', korean: '시제스랑 베를린 사이에서 못 정하겠어.', english: "I'm between Sitges and Berlin, can't decide.", chinese: '我在锡切斯和柏林之间，决定不了。' },
    ],
  },
  daic_056: {
    id: 'daic_056', lessonId: 'ai', situation: '페스티벌 — 룸메이트 찾기',
    lines: [
      { speaker: 'Amigo', spanish: '¿Buscás compartir habitación en el festival?', korean: '페스티벌에서 방 같이 쓸 사람 찾아?', english: 'Are you looking to share a room at the festival?', chinese: '你在找节日期间合租房间的人吗？' },
      { speaker: 'Yo', spanish: 'Sí, sale más barato. ¿Te interesa?', korean: '응, 더 싸지. 관심 있어?', english: "Yes, it's cheaper. Are you interested?", chinese: '是啊，更便宜。你有兴趣吗？' },
    ],
  },
  daic_057: {
    id: 'daic_057', lessonId: 'ai', situation: '페스티벌 — 후기 공유 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: '¿Qué tal el festival de Belgrado?', korean: '베오그라드 페스티벌 어땠어?', english: 'How was the Belgrade festival?', chinese: '贝尔格莱德的节日怎么样？' },
      { speaker: 'Yo', spanish: 'Inolvidable, bailé hasta las 7 de la mañana cada noche.', korean: '못 잊을 거야, 매일 아침 7시까지 췄어.', english: 'Unforgettable, I danced until 7 in the morning every night.', chinese: '难忘的，每晚跳到早上七点。' },
      { speaker: 'Amiga', spanish: '¡Cómo te envidio! Yo no pude ir este año.', korean: '진짜 부럽다! 난 올해 못 갔어.', english: 'I envy you! I couldn\'t go this year.', chinese: '真羡慕你！我今年没能去。' },
    ],
  },

  // ============ 학습·연습 깊이 (3) ============
  daic_058: {
    id: 'daic_058', lessonId: 'ai', situation: '학습 — 혼자 연습 추천',
    lines: [
      { speaker: 'Alumna', spanish: '¿Qué puedo practicar sola en casa?', korean: '집에서 혼자 뭐 연습할 수 있어요?', english: 'What can I practice alone at home?', chinese: '我在家一个人能练什么？' },
      { speaker: 'Profesor', spanish: 'Caminata, equilibrio en una pierna y disociación frente al espejo.', korean: '걷기, 한 다리 균형, 거울 보고 디소시아시온.', english: 'Walk, balance on one leg, and dissociation in front of the mirror.', chinese: '行走、单腿平衡、对镜分离。' },
    ],
  },
  daic_059: {
    id: 'daic_059', lessonId: 'ai', situation: '학습 — 교사 추천 부탁',
    lines: [
      { speaker: 'Yo', spanish: '¿Conocés algún profe bueno para principiantes?', korean: '초보자에게 좋은 선생님 알아?', english: 'Do you know a good teacher for beginners?', chinese: '你认识适合初学者的好老师吗？' },
      { speaker: 'Amigo', spanish: 'Andate con María y Carlos, son pacientes y claros.', korean: '마리아랑 카를로스한테 가, 인내심 있고 명료해.', english: 'Go with María and Carlos, they\'re patient and clear.', chinese: '去找玛丽亚和卡洛斯，他们耐心又讲得清楚。' },
    ],
  },
  daic_060: {
    id: 'daic_060', lessonId: 'ai', situation: '학습 — 진로 깊이 토론 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'A veces pienso que el tango se volvió mi identidad, no solo un hobby.', korean: '가끔 탱고가 취미가 아니라 내 정체성이 된 것 같아.', english: 'Sometimes I think tango became my identity, not just a hobby.', chinese: '有时候我觉得探戈成了我的身份，不只是爱好。' },
      { speaker: 'Amigo', spanish: 'A muchos nos pasó, es una forma de ver el mundo.', korean: '많은 사람한테 그래, 세상 보는 방식이지.', english: "It happened to many of us, it's a way of seeing the world.", chinese: '我们很多人都这样，这是一种看世界的方式。' },
      { speaker: 'Yo', spanish: 'Sin tango, ya no sé quién sería.', korean: '탱고 없으면 내가 누군지 모르겠어.', english: "Without tango, I don't know who I'd be.", chinese: '没有探戈，我不知道我会是谁。' },
    ],
  },
};
