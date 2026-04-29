// Claude 직접 작성 dialogue — 배치 007
// 30개 (어린시절·한국문화·도시비교·음식깊이·바·패션·문학·놀이·다른춤·봉사)
import type { DialogueExample } from './dialogues-l1';

export const dialoguesClaude007: Record<string, DialogueExample> = {
  // ============ 어린 시절 (3) ============
  daic_181: {
    id: 'daic_181', lessonId: 'ai', situation: '어린시절 — 어디서 자람',
    lines: [
      { speaker: 'Amigo', spanish: '¿Dónde te criaste?', korean: '어디서 자랐어?', english: 'Where did you grow up?', chinese: '你在哪里长大？' },
      { speaker: 'Yo', spanish: 'En una ciudad pequeña al sur de Corea.', korean: '한국 남쪽 작은 도시에서.', english: 'In a small city in southern Korea.', chinese: '在韩国南部一座小城。' },
    ],
  },
  daic_182: {
    id: 'daic_182', lessonId: 'ai', situation: '어린시절 — 추억 단어',
    lines: [
      { speaker: 'Amiga', spanish: '¿Qué hacías de chica los veranos?', korean: '어렸을 때 여름엔 뭐 했어?', english: 'What did you do as a child in summers?', chinese: '小时候夏天你都做什么？' },
      { speaker: 'Yo', spanish: 'Iba al mar con mis primos, era mágico.', korean: '사촌들이랑 바다 갔어, 마법 같았지.', english: 'I went to the sea with my cousins, it was magical.', chinese: '我和表亲们去海边，很神奇。' },
    ],
  },
  daic_183: {
    id: 'daic_183', lessonId: 'ai', situation: '어린시절 — 부모님 영향 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: '¿Tus padres bailaban?', korean: '부모님은 춤추셨어?', english: 'Did your parents dance?', chinese: '你父母跳舞吗？' },
      { speaker: 'Yo', spanish: 'Mi mamá amaba bailar, fue ella quien me transmitió la pasión.', korean: '엄마가 춤을 정말 좋아했어, 그 열정을 물려줬지.', english: 'My mom loved to dance, she\'s the one who passed on the passion.', chinese: '我妈很爱跳舞，是她把这份热情传给我的。' },
      { speaker: 'Amigo', spanish: 'Esas cosas se heredan más allá de la sangre.', korean: '그런 건 핏줄 이상으로 물려져.', english: 'Those things are inherited beyond blood.', chinese: '这些是血缘之外的传承。' },
    ],
  },

  // ============ 한국 문화 소개 (3) ============
  daic_184: {
    id: 'daic_184', lessonId: 'ai', situation: '한국 — 김치 설명',
    lines: [
      { speaker: 'Amiga', spanish: '¿Qué es el kimchi exactamente?', korean: '김치가 정확히 뭐야?', english: 'What exactly is kimchi?', chinese: '泡菜到底是什么？' },
      { speaker: 'Yo', spanish: 'Repollo fermentado con condimentos picantes, lo comemos todos los días.', korean: '발효 배추랑 매운 양념, 매일 먹어.', english: 'Fermented cabbage with spicy seasonings, we eat it every day.', chinese: '发酵的卷心菜加辣调料，我们天天吃。' },
    ],
  },
  daic_185: {
    id: 'daic_185', lessonId: 'ai', situation: '한국 — K-pop 토론',
    lines: [
      { speaker: 'Amigo', spanish: '¿Te gusta el K-pop?', korean: 'K-pop 좋아해?', english: 'Do you like K-pop?', chinese: '你喜欢K-pop吗？' },
      { speaker: 'Yo', spanish: 'A veces, prefiero la música tradicional como el pansori.', korean: '가끔, 판소리 같은 전통 음악 더 좋아.', english: 'Sometimes, I prefer traditional music like pansori.', chinese: '偶尔，我更喜欢传统音乐比如盘索里。' },
    ],
  },
  daic_186: {
    id: 'daic_186', lessonId: 'ai', situation: '한국 — 정·예의 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: 'Me dicen que los coreanos son muy formales.', korean: '한국인들 정말 격식 차린다 들었어.', english: 'They say Koreans are very formal.', chinese: '听说韩国人很讲礼仪。' },
      { speaker: 'Yo', spanish: 'En lo público sí, pero en lo íntimo somos muy cálidos.', korean: '공적인 자리는 그래, 가까이선 매우 따뜻해.', english: 'In public yes, but intimately we\'re very warm.', chinese: '公共场合是的，但私下里我们很温暖。' },
      { speaker: 'Amiga', spanish: 'Como el tango, frío afuera y caliente adentro.', korean: '탱고 같네, 밖은 차갑고 안은 뜨거워.', english: 'Like tango, cold outside, hot inside.', chinese: '就像探戈，外冷内热。' },
    ],
  },

  // ============ 도시 비교 (3) ============
  daic_187: {
    id: 'daic_187', lessonId: 'ai', situation: '도시 — 부에노스 vs 서울',
    lines: [
      { speaker: 'Yo', spanish: 'Buenos Aires me recuerda a Seúl en algunas cosas.', korean: '부에노스가 어떤 면에선 서울 생각나.', english: 'Buenos Aires reminds me of Seoul in some ways.', chinese: '布宜诺斯艾利斯有些地方让我想起首尔。' },
      { speaker: 'Amigo', spanish: '¿En qué?', korean: '어떤 면에서?', english: 'In what way?', chinese: '哪些方面？' },
      { speaker: 'Yo', spanish: 'La energía nocturna, la gente vive de noche.', korean: '밤의 에너지, 사람들이 밤에 살아.', english: 'The night energy, people live at night.', chinese: '夜晚的能量，人们活在夜里。' },
    ],
  },
  daic_188: {
    id: 'daic_188', lessonId: 'ai', situation: '도시 — 멘도사 추천',
    lines: [
      { speaker: 'Amiga', spanish: '¿Conocés Mendoza?', korean: '멘도사 가봤어?', english: 'Do you know Mendoza?', chinese: '你去过门多萨吗？' },
      { speaker: 'Yo', spanish: 'Solo de fotos, dicen que el vino es increíble.', korean: '사진으로만, 와인이 끝내준대.', english: 'Only from photos, they say the wine is incredible.', chinese: '只看过照片，听说酒不可思议。' },
    ],
  },
  daic_189: {
    id: 'daic_189', lessonId: 'ai', situation: '도시 — 유럽 vs 라틴 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'En Europa el tango es más técnico, en Argentina más emocional.', korean: '유럽 탱고는 기술적, 아르헨은 감정적.', english: 'In Europe tango is more technical, in Argentina more emotional.', chinese: '欧洲探戈更技术，阿根廷更感性。' },
      { speaker: 'Yo', spanish: 'Tiene sentido, cada cultura imprime algo distinto.', korean: '말 되네, 각 문화가 뭔가 다르게 새겨.', english: 'Makes sense, each culture imprints something different.', chinese: '有道理，每种文化烙印不同。' },
    ],
  },

  // ============ 음식 깊이 (3) ============
  daic_190: {
    id: 'daic_190', lessonId: 'ai', situation: '음식 — 마테차',
    lines: [
      { speaker: 'Amiga', spanish: '¿Tomás mate?', korean: '마테차 마셔?', english: 'Do you drink mate?', chinese: '你喝马黛茶吗？' },
      { speaker: 'Yo', spanish: 'Empecé hace poco, todavía me cuesta.', korean: '얼마 전부터, 아직 어려워.', english: 'I started recently, still hard for me.', chinese: '最近开始的，还不太适应。' },
    ],
  },
  daic_191: {
    id: 'daic_191', lessonId: 'ai', situation: '음식 — 둘세 데 레체',
    lines: [
      { speaker: 'Amigo', spanish: '¿Probaste el dulce de leche?', korean: '둘세 데 레체 먹어봤어?', english: 'Did you try dulce de leche?', chinese: '你尝过焦糖牛奶酱吗？' },
      { speaker: 'Yo', spanish: 'Me volví adicta, lo pongo en todo.', korean: '중독됐어, 다 넣어 먹어.', english: "I'm addicted, I put it in everything.", chinese: '我上瘾了，什么都加。' },
    ],
  },
  daic_192: {
    id: 'daic_192', lessonId: 'ai', situation: '음식 — 한식 소개 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: '¿Cómo se llama esa comida coreana con carne?', korean: '고기 들어간 한국 음식 이름 뭐야?', english: 'What\'s that Korean food with meat called?', chinese: '那种带肉的韩国菜叫什么？' },
      { speaker: 'Yo', spanish: 'Bulgogi, marinado dulce, podrías cocinarlo en casa fácil.', korean: '불고기, 단 양념, 집에서 쉽게 만들 수 있어.', english: 'Bulgogi, sweet marinade, you could cook it easy at home.', chinese: '烤肉，甜口腌料，在家很容易做。' },
      { speaker: 'Amiga', spanish: 'Pasame la receta, este finde la pruebo.', korean: '레시피 보내줘, 이번 주말 해볼게.', english: 'Send me the recipe, I\'ll try it this weekend.', chinese: '给我食谱，这周末试做。' },
    ],
  },

  // ============ 술·바·나이트라이프 (3) ============
  daic_193: {
    id: 'daic_193', lessonId: 'ai', situation: '바 — 한 잔 마시러',
    lines: [
      { speaker: 'Amigo', spanish: '¿Vamos a tomar algo después?', korean: '끝나고 한 잔 마시러 갈래?', english: 'Want to grab a drink after?', chinese: '结束后去喝一杯吗？' },
      { speaker: 'Yo', spanish: 'Dale, conozco un bar de cócteles cerca.', korean: '좋아, 근처 칵테일 바 알아.', english: 'Yes, I know a cocktail bar nearby.', chinese: '好，附近有家鸡尾酒吧。' },
    ],
  },
  daic_194: {
    id: 'daic_194', lessonId: 'ai', situation: '술 — 술 안 마심',
    lines: [
      { speaker: 'Amiga', spanish: '¿Querés una copa de Malbec?', korean: '말벡 한 잔 할래?', english: 'Want a glass of Malbec?', chinese: '要杯马尔贝克吗？' },
      { speaker: 'Yo', spanish: 'No tomo alcohol, pero gracias.', korean: '술 안 마셔, 근데 고마워.', english: "I don't drink alcohol, but thanks.", chinese: '我不喝酒，谢谢。' },
    ],
  },
  daic_195: {
    id: 'daic_195', lessonId: 'ai', situation: '바 — 새벽 토론 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Después de la milonga, los mejores bares son los de Palermo.', korean: '밀롱가 후엔 팔레르모 바가 최고야.', english: 'After milonga, the best bars are in Palermo.', chinese: '米隆加后，最好的酒吧在帕勒莫。' },
      { speaker: 'Yo', spanish: 'Me llevás algún día, todavía no conozco bien la zona.', korean: '언제 데려가, 아직 그 동네 잘 몰라.', english: 'Take me sometime, I don\'t know the area well yet.', chinese: '改天带我去，我还不太熟那一带。' },
    ],
  },

  // ============ 패션·뷰티 (3) ============
  daic_196: {
    id: 'daic_196', lessonId: 'ai', situation: '패션 — 드레스 칭찬',
    lines: [
      { speaker: 'Amiga', spanish: '¡Qué vestido lindo!', korean: '드레스 너무 예쁘다!', english: 'What a beautiful dress!', chinese: '裙子真好看！' },
      { speaker: 'Yo', spanish: 'Lo compré en una tienda local, ¿te paso el contacto?', korean: '동네 가게에서 샀어, 연락처 줄까?', english: 'I bought it at a local store, want the contact?', chinese: '本地小店买的，给你联系方式？' },
    ],
  },
  daic_197: {
    id: 'daic_197', lessonId: 'ai', situation: '뷰티 — 메이크업',
    lines: [
      { speaker: 'Amiga', spanish: '¿Qué labial usás? ¡Ese rojo es perfecto!', korean: '무슨 립스틱 발라? 그 빨강 완벽해!', english: 'What lipstick do you use? That red is perfect!', chinese: '你用什么口红？那个红色完美！' },
      { speaker: 'Yo', spanish: 'Es uno coreano, te muestro la marca después.', korean: '한국 거야, 이따 브랜드 보여줄게.', english: "It's Korean, I'll show you the brand later.", chinese: '韩国牌子的，等下给你看。' },
    ],
  },
  daic_198: {
    id: 'daic_198', lessonId: 'ai', situation: '패션 — 미니멀 스타일 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Siempre tan elegante con poco, ¿cómo lo hacés?', korean: '항상 단순하게 우아해, 어떻게 해?', english: 'Always so elegant with little, how do you do it?', chinese: '总是简约又优雅，你怎么做到的？' },
      { speaker: 'Yo', spanish: 'Pocas piezas pero buenas, eso es todo.', korean: '적은데 좋은 거 몇 개, 그게 다야.', english: "Few pieces but good ones, that's all.", chinese: '少而精，仅此而已。' },
      { speaker: 'Amigo', spanish: 'La filosofía coreana del menos es más.', korean: '적을수록 좋다는 한국 철학.', english: 'The Korean philosophy of less is more.', chinese: '韩式的少即是多哲学。' },
    ],
  },

  // ============ 책·문학 (3) ============
  daic_199: {
    id: 'daic_199', lessonId: 'ai', situation: '책 — 추천',
    lines: [
      { speaker: 'Amiga', spanish: '¿Estás leyendo algo?', korean: '뭐 읽고 있어?', english: 'Are you reading anything?', chinese: '你在读什么书？' },
      { speaker: 'Yo', spanish: 'Borges, sus cuentos cortos.', korean: '보르헤스, 단편 모음.', english: 'Borges, his short stories.', chinese: '博尔赫斯，他的短篇。' },
    ],
  },
  daic_200: {
    id: 'daic_200', lessonId: 'ai', situation: '책 — 시',
    lines: [
      { speaker: 'Amigo', spanish: '¿Te gusta la poesía?', korean: '시 좋아해?', english: 'Do you like poetry?', chinese: '你喜欢诗吗？' },
      { speaker: 'Yo', spanish: 'Mucho, sobre todo Neruda.', korean: '많이, 특히 네루다.', english: 'A lot, especially Neruda.', chinese: '很喜欢，尤其是聂鲁达。' },
    ],
  },
  daic_201: {
    id: 'daic_201', lessonId: 'ai', situation: '책 — 한국 문학 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: '¿Me recomendás un autor coreano?', korean: '한국 작가 추천해줄래?', english: 'Could you recommend a Korean author?', chinese: '能推荐韩国作家吗？' },
      { speaker: 'Yo', spanish: 'Han Kang, ganó el Nobel hace poco. Sus libros son intensos.', korean: '한강, 얼마 전 노벨상 받았어. 책이 강렬해.', english: 'Han Kang, she won the Nobel recently. Her books are intense.', chinese: '韩江，最近获诺贝尔奖。她的书很强烈。' },
      { speaker: 'Amiga', spanish: 'La voy a buscar, gracias.', korean: '찾아볼게, 고마워.', english: "I'll look her up, thanks.", chinese: '我去找找，谢谢。' },
    ],
  },

  // ============ 게임·놀이 (3) ============
  daic_202: {
    id: 'daic_202', lessonId: 'ai', situation: '게임 — 보드게임',
    lines: [
      { speaker: 'Amigo', spanish: '¿Jugás juegos de mesa?', korean: '보드게임 해?', english: 'Do you play board games?', chinese: '你玩桌游吗？' },
      { speaker: 'Yo', spanish: 'Catan es mi favorito.', korean: '카탄이 제일 좋아.', english: "Catan is my favorite.", chinese: '卡坦岛是我的最爱。' },
    ],
  },
  daic_203: {
    id: 'daic_203', lessonId: 'ai', situation: '게임 — 비디오 게임',
    lines: [
      { speaker: 'Amigo', spanish: '¿Sos gamer?', korean: '게이머야?', english: 'Are you a gamer?', chinese: '你是游戏玩家吗？' },
      { speaker: 'Yo', spanish: 'Solo Tetris en el celular, soft-core.', korean: '폰으로 테트리스만, 가벼운 거.', english: 'Just Tetris on the phone, soft-core.', chinese: '只在手机上玩俄罗斯方块，轻度玩家。' },
    ],
  },
  daic_204: {
    id: 'daic_204', lessonId: 'ai', situation: '게임 — 친구 모임 (B1)',
    lines: [
      { speaker: 'Amiga', spanish: 'Organizo una noche de juegos el sábado, ¿venís?', korean: '토요일에 게임 나이트 하는데 올래?', english: "I'm organizing a game night Saturday, coming?", chinese: '周六组织游戏之夜，来吗？' },
      { speaker: 'Yo', spanish: 'Sería divertido, ¿hace falta llevar algo?', korean: '재미있겠다, 뭐 가져갈 거 있어?', english: 'Would be fun, do I need to bring anything?', chinese: '会很有趣，需要带什么吗？' },
      { speaker: 'Amiga', spanish: 'Vino y comida si querés compartir.', korean: '와인이랑 음식 나누고 싶으면.', english: 'Wine and food if you want to share.', chinese: '想分享的话带酒和食物。' },
    ],
  },

  // ============ 다른 춤 장르 (3) ============
  daic_205: {
    id: 'daic_205', lessonId: 'ai', situation: '춤 — 살사 비교',
    lines: [
      { speaker: 'Amigo', spanish: '¿Bailaste salsa antes del tango?', korean: '탱고 전에 살사 췄어?', english: 'Did you dance salsa before tango?', chinese: '探戈之前你跳过萨尔萨吗？' },
      { speaker: 'Yo', spanish: 'Sí, pero el tango me llegó más al alma.', korean: '응, 근데 탱고가 더 영혼에 닿아.', english: 'Yes, but tango touched my soul more.', chinese: '跳过，但探戈更触动我的心。' },
    ],
  },
  daic_206: {
    id: 'daic_206', lessonId: 'ai', situation: '춤 — 발레 백그라운드',
    lines: [
      { speaker: 'Amiga', spanish: 'Tu postura es muy estilizada, ¿hiciste ballet?', korean: '자세가 정형화돼있어, 발레 했어?', english: 'Your posture is very stylized, did you do ballet?', chinese: '你的姿态很优雅，跳过芭蕾吗？' },
      { speaker: 'Yo', spanish: 'De chica, doce años. Algo siempre queda.', korean: '어렸을 때 12년, 늘 뭔가 남아.', english: 'As a child, twelve years. Something always remains.', chinese: '小时候十二年，总有些东西留下。' },
    ],
  },
  daic_207: {
    id: 'daic_207', lessonId: 'ai', situation: '춤 — 다양성 토론 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Cada baile te enseña algo distinto del cuerpo.', korean: '각 춤이 몸에 대해 다른 걸 가르쳐.', english: 'Each dance teaches you something different about the body.', chinese: '每种舞蹈教你身体不同的东西。' },
      { speaker: 'Yo', spanish: 'Pero el tango es el único donde escuchás a otra persona.', korean: '근데 탱고는 다른 사람을 듣는 유일한 춤이야.', english: 'But tango is the only one where you listen to another person.', chinese: '但探戈是唯一聆听另一个人的舞。' },
      { speaker: 'Amigo', spanish: 'Por eso te transforma diferente.', korean: '그래서 다르게 변화시키지.', english: "That's why it transforms you differently.", chinese: '所以它的转变方式不同。' },
    ],
  },

  // ============ 봉사·기부 (3) ============
  daic_208: {
    id: 'daic_208', lessonId: 'ai', situation: '봉사 — 자선 밀롱가',
    lines: [
      { speaker: 'Amiga', spanish: 'Hay una milonga benéfica el viernes.', korean: '금요일에 자선 밀롱가 있어.', english: "There's a charity milonga Friday.", chinese: '周五有个慈善米隆加。' },
      { speaker: 'Yo', spanish: '¿A favor de qué causa?', korean: '어떤 명분이야?', english: 'For what cause?', chinese: '为什么事业？' },
      { speaker: 'Amiga', spanish: 'Para una escuela rural en el norte.', korean: '북쪽 시골 학교 위해.', english: 'For a rural school in the north.', chinese: '为北部一所乡村学校。' },
    ],
  },
  daic_209: {
    id: 'daic_209', lessonId: 'ai', situation: '봉사 — 노인 댄스 가르치기',
    lines: [
      { speaker: 'Amigo', spanish: 'Voy todos los miércoles a un geriátrico a bailar con los abuelos.', korean: '매주 수요일 노인 시설 가서 어르신들이랑 춤 춰.', english: 'I go every Wednesday to a nursing home to dance with elders.', chinese: '我每周三去养老院和老人们跳舞。' },
      { speaker: 'Yo', spanish: 'Qué hermoso lo que hacés.', korean: '하는 일 정말 아름다워.', english: 'What you do is so beautiful.', chinese: '你做的事真美。' },
    ],
  },
  daic_210: {
    id: 'daic_210', lessonId: 'ai', situation: '봉사 — 의미 깊이 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Me gustaría usar el tango para algo más que mi gozo personal.', korean: '내 즐거움 너머의 뭔가에 탱고를 쓰고 싶어.', english: 'I\'d like to use tango for something beyond my personal joy.', chinese: '我想把探戈用于个人快乐之外的事。' },
      { speaker: 'Veterana', spanish: 'Cuando das, recibís el doble. La pista lo enseña.', korean: '주면 두 배로 받아. 댄스플로어가 가르쳐.', english: 'When you give, you receive double. The floor teaches it.', chinese: '给予时收获双倍。舞池会教你。' },
      { speaker: 'Yo', spanish: 'Voy a buscar dónde puedo ayudar.', korean: '도울 수 있는 곳 찾아볼게.', english: 'I\'ll look where I can help.', chinese: '我会找能帮忙的地方。' },
    ],
  },
};
