// Claude 직접 작성 dialogue — 배치 004
// 30개 (비즈니스·철학·쇼핑·교통·숙박·의료·화상·미디어·환경·기억)
import type { DialogueExample } from './dialogues-l1';

export const dialoguesClaude004: Record<string, DialogueExample> = {
  // ============ 비즈니스·전문 (3) ============
  daic_091: {
    id: 'daic_091', lessonId: 'ai', situation: '비즈니스 — 직업 깊이 묻기',
    lines: [
      { speaker: 'Amigo', spanish: '¿Te gusta lo que hacés?', korean: '하는 일 좋아?', english: 'Do you like what you do?', chinese: '你喜欢你做的工作吗？' },
      { speaker: 'Yo', spanish: 'A veces sí, a veces no. Es complicado.', korean: '때론 좋고 때론 아니야. 복잡해.', english: 'Sometimes yes, sometimes no. It\'s complicated.', chinese: '有时喜欢，有时不喜欢。很复杂。' },
    ],
  },
  daic_092: {
    id: 'daic_092', lessonId: 'ai', situation: '비즈니스 — 명함 교환',
    lines: [
      { speaker: 'Yo', spanish: 'Si querés, te paso mi tarjeta.', korean: '원하면 내 명함 줄게.', english: 'If you want, I\'ll give you my card.', chinese: '如果你想要，我给你名片。' },
      { speaker: 'Conocido', spanish: 'Sí, podríamos colaborar en algo.', korean: '응, 뭐 같이 할 수 있을지도.', english: 'Yes, we could collaborate on something.', chinese: '好的，我们可以合作点什么。' },
    ],
  },
  daic_093: {
    id: 'daic_093', lessonId: 'ai', situation: '비즈니스 — 번아웃 대화 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Estoy quemado del trabajo, el tango es lo único que me salva.', korean: '일에 번아웃이야, 탱고만이 날 살려.', english: "I'm burned out at work, tango is the only thing that saves me.", chinese: '工作让我筋疲力尽，只有探戈救我。' },
      { speaker: 'Amigo', spanish: 'Te entiendo, necesitamos esa válvula de escape.', korean: '이해해, 우린 이런 탈출구가 필요해.', english: 'I understand, we need that escape valve.', chinese: '我懂，我们需要这种宣泄口。' },
    ],
  },

  // ============ 영적·철학 (3) ============
  daic_094: {
    id: 'daic_094', lessonId: 'ai', situation: '철학 — 명상으로서의 탱고',
    lines: [
      { speaker: 'Amiga', spanish: 'Para mí bailar es una meditación.', korean: '나한테 추는 건 명상이야.', english: 'For me dancing is a meditation.', chinese: '对我来说跳舞是一种冥想。' },
      { speaker: 'Yo', spanish: 'Sí, en pista no existe el pasado ni el futuro.', korean: '맞아, 댄스플로어엔 과거도 미래도 없어.', english: 'Yes, on the floor there\'s no past or future.', chinese: '对，在舞池上没有过去和未来。' },
    ],
  },
  daic_095: {
    id: 'daic_095', lessonId: 'ai', situation: '철학 — 신뢰',
    lines: [
      { speaker: 'Veterano', spanish: 'El tango se trata de confianza, no de control.', korean: '탱고는 통제가 아니라 신뢰야.', english: 'Tango is about trust, not control.', chinese: '探戈是关于信任，不是控制。' },
      { speaker: 'Yo', spanish: 'Eso me cuesta, soy muy controladora.', korean: '그게 어려워, 난 너무 통제하려고 해.', english: "That's hard for me, I'm very controlling.", chinese: '这对我很难，我控制欲很强。' },
    ],
  },
  daic_096: {
    id: 'daic_096', lessonId: 'ai', situation: '철학 — 인생 은유 (B1)',
    lines: [
      { speaker: 'Veterana', spanish: 'En el tango como en la vida, hay que aprender a esperar.', korean: '탱고도 인생도, 기다림을 배워야 해.', english: 'In tango as in life, you have to learn to wait.', chinese: '探戈和生活一样，要学会等待。' },
      { speaker: 'Yo', spanish: 'La pausa es donde realmente pasa lo bello.', korean: '잠깐 멈춤에서 진짜 아름다움이 일어나.', english: 'The pause is where the beautiful really happens.', chinese: '暂停才是美真正发生的地方。' },
      { speaker: 'Veterana', spanish: 'Exacto, no llenes cada espacio con movimiento.', korean: '바로 그거야, 모든 공간을 움직임으로 채우지 마.', english: "Exactly, don't fill every space with movement.", chinese: '没错，不要用动作填满每个空间。' },
    ],
  },

  // ============ 의류·쇼핑 (3) ============
  daic_097: {
    id: 'daic_097', lessonId: 'ai', situation: '쇼핑 — 드레스 사이즈',
    lines: [
      { speaker: 'Yo', spanish: '¿Tenés este vestido en talla M?', korean: '이 드레스 M 사이즈 있어요?', english: 'Do you have this dress in size M?', chinese: '这条裙子有M码吗？' },
      { speaker: 'Vendedora', spanish: 'Sí, te lo busco.', korean: '네, 찾아드릴게요.', english: "Yes, let me find it for you.", chinese: '有，我帮你找。' },
    ],
  },
  daic_098: {
    id: 'daic_098', lessonId: 'ai', situation: '쇼핑 — 가격 흥정',
    lines: [
      { speaker: 'Yo', spanish: '¿Hay descuento si compro dos pares?', korean: '두 켤레 사면 할인 돼요?', english: 'Is there a discount if I buy two pairs?', chinese: '买两双有折扣吗？' },
      { speaker: 'Vendedor', spanish: 'Te puedo hacer un diez por ciento.', korean: '10% 해드릴 수 있어요.', english: 'I can give you ten percent.', chinese: '我可以给你打九折。' },
    ],
  },
  daic_099: {
    id: 'daic_099', lessonId: 'ai', situation: '쇼핑 — 환불 요청 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Compré estos zapatos ayer pero me lastiman, ¿puedo devolverlos?', korean: '어제 산 신발인데 발 아파요, 환불 돼요?', english: 'I bought these shoes yesterday but they hurt, can I return them?', chinese: '我昨天买了这双鞋，但很挤脚，可以退货吗？' },
      { speaker: 'Vendedora', spanish: 'Sí, mientras tengas el ticket y no estén usados afuera.', korean: '네, 영수증 있고 밖에서 안 신었으면.', english: "Yes, as long as you have the receipt and they haven't been worn outside.", chinese: '可以，只要你有小票，且没在外面穿过。' },
      { speaker: 'Yo', spanish: 'Solo los probé en casa.', korean: '집에서 신어보기만 했어요.', english: 'I only tried them at home.', chinese: '我只在家试穿过。' },
    ],
  },

  // ============ 교통 (3) ============
  daic_100: {
    id: 'daic_100', lessonId: 'ai', situation: '교통 — 택시 호출',
    lines: [
      { speaker: 'Yo', spanish: '¿Cuánto cuesta hasta el centro?', korean: '시내까지 얼마예요?', english: 'How much to downtown?', chinese: '到市中心多少钱？' },
      { speaker: 'Taxista', spanish: 'Unos quinientos pesos.', korean: '한 500페소요.', english: 'About five hundred pesos.', chinese: '大概五百比索。' },
    ],
  },
  daic_101: {
    id: 'daic_101', lessonId: 'ai', situation: '교통 — 지하철 길 묻기',
    lines: [
      { speaker: 'Yo', spanish: '¿Qué subte tomo para llegar a Palermo?', korean: '팔레르모 가려면 어떤 지하철 타?', english: 'What subway do I take to get to Palermo?', chinese: '去帕勒莫坐哪条地铁？' },
      { speaker: 'Persona', spanish: 'La línea D, bajás en Plaza Italia.', korean: 'D선이야, 플라사 이탈리아에서 내려.', english: 'Line D, you get off at Plaza Italia.', chinese: 'D线，在意大利广场下车。' },
    ],
  },
  daic_102: {
    id: 'daic_102', lessonId: 'ai', situation: '교통 — 지각 해명 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Perdón por el atraso, había un corte de tráfico tremendo.', korean: '늦어서 미안, 교통 차단이 심했어.', english: 'Sorry for being late, there was a tremendous traffic block.', chinese: '抱歉迟到，路上严重堵车。' },
      { speaker: 'Amigo', spanish: 'Tranqui, en esta ciudad es habitual.', korean: '괜찮아, 이 도시에선 흔한 일이야.', english: "No worries, it's usual in this city.", chinese: '没关系，这城市常有的事。' },
    ],
  },

  // ============ 호텔·숙박 (3) ============
  daic_103: {
    id: 'daic_103', lessonId: 'ai', situation: '숙박 — 체크인',
    lines: [
      { speaker: 'Yo', spanish: 'Tengo una reserva a nombre de Kim.', korean: '김 이름으로 예약 있어요.', english: 'I have a reservation under Kim.', chinese: '我有一个金姓的预订。' },
      { speaker: 'Recepcionista', spanish: 'Aquí está, habitación 305.', korean: '여기 있네요, 305호실.', english: 'Here it is, room 305.', chinese: '在这里，305号房。' },
    ],
  },
  daic_104: {
    id: 'daic_104', lessonId: 'ai', situation: '숙박 — 와이파이 묻기',
    lines: [
      { speaker: 'Yo', spanish: '¿Cuál es la clave del wifi?', korean: '와이파이 비번 뭐예요?', english: "What's the wifi password?", chinese: 'WiFi密码是什么？' },
      { speaker: 'Recepcionista', spanish: 'Está en la tarjeta de la habitación.', korean: '객실 카드에 있어요.', english: "It's on the room card.", chinese: '在房卡上。' },
    ],
  },
  daic_105: {
    id: 'daic_105', lessonId: 'ai', situation: '숙박 — 불만 사항 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'La habitación es muy ruidosa, ¿podrían cambiarme?', korean: '방이 너무 시끄러워요, 바꿔주실 수 있어요?', english: 'The room is very noisy, could you change it?', chinese: '房间太吵了，能换房吗？' },
      { speaker: 'Recepcionista', spanish: 'Disculpe, voy a ver qué tengo disponible.', korean: '죄송해요, 가능한 거 있는지 볼게요.', english: 'Sorry, let me see what\'s available.', chinese: '抱歉，我看看有什么空房。' },
      { speaker: 'Yo', spanish: 'Gracias, una con vista al patio sería ideal.', korean: '고마워요, 안뜰 보이는 게 좋겠어요.', english: 'Thanks, one facing the courtyard would be ideal.', chinese: '谢谢，朝向庭院的最好。' },
    ],
  },

  // ============ 의료·응급 (3) ============
  daic_106: {
    id: 'daic_106', lessonId: 'ai', situation: '의료 — 약국 약 묻기',
    lines: [
      { speaker: 'Yo', spanish: '¿Tenés algo para el dolor de cabeza?', korean: '두통약 있어요?', english: 'Do you have something for headache?', chinese: '有头痛药吗？' },
      { speaker: 'Farmacéutico', spanish: 'Ibuprofeno o paracetamol, ¿cuál preferís?', korean: '이부프로펜이나 파라세타몰, 뭐 원해요?', english: 'Ibuprofen or paracetamol, which do you prefer?', chinese: '布洛芬或扑热息痛，你要哪个？' },
    ],
  },
  daic_107: {
    id: 'daic_107', lessonId: 'ai', situation: '의료 — 발 삠',
    lines: [
      { speaker: 'Yo', spanish: 'Me torcí el tobillo bailando, ¿qué hago?', korean: '추다가 발목 삤어, 뭐 해야 해?', english: 'I sprained my ankle dancing, what do I do?', chinese: '跳舞时扭伤了脚踝，怎么办？' },
      { speaker: 'Amigo', spanish: 'Hielo veinte minutos cada hora, y descanso.', korean: '한 시간마다 20분 얼음, 그리고 쉬어.', english: 'Ice twenty minutes every hour, and rest.', chinese: '每小时冰敷二十分钟，然后休息。' },
    ],
  },
  daic_108: {
    id: 'daic_108', lessonId: 'ai', situation: '의료 — 의사 상담 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Doctor, hace meses que tengo dolor en la cadera al bailar.', korean: '의사 선생님, 몇 달째 출 때 골반이 아파요.', english: "Doctor, for months I've had hip pain when dancing.", chinese: '医生，我跳舞时髋部疼了好几个月。' },
      { speaker: 'Doctor', spanish: 'Vamos a hacer una resonancia para descartar lesión.', korean: 'MRI 찍어서 손상 가능성 배제해보죠.', english: "Let's do an MRI to rule out injury.", chinese: '我们做个核磁排查损伤。' },
      { speaker: 'Yo', spanish: '¿Mientras tanto puedo seguir bailando?', korean: '그동안 춤은 계속 출 수 있어요?', english: "Meanwhile can I keep dancing?", chinese: '在此期间我能继续跳吗？' },
      { speaker: 'Doctor', spanish: 'Suave, sin movimientos extremos.', korean: '부드럽게, 극단적 동작은 안 돼요.', english: 'Gently, no extreme movements.', chinese: '轻柔点，不要做极端动作。' },
    ],
  },

  // ============ 화상 통화·온라인 (3) ============
  daic_109: {
    id: 'daic_109', lessonId: 'ai', situation: '온라인 — 줌 수업 시작',
    lines: [
      { speaker: 'Profesor', spanish: '¿Me ven y me escuchan bien?', korean: '저 보이고 잘 들려요?', english: 'Can you see and hear me well?', chinese: '能看到我，听清楚我说话吗？' },
      { speaker: 'Alumno', spanish: 'Sí, perfecto.', korean: '네, 완벽해요.', english: 'Yes, perfect.', chinese: '可以，很清楚。' },
    ],
  },
  daic_110: {
    id: 'daic_110', lessonId: 'ai', situation: '온라인 — 연결 문제',
    lines: [
      { speaker: 'Yo', spanish: 'Se me cortó el internet, perdón.', korean: '인터넷 끊겼어요, 미안해요.', english: 'My internet cut off, sorry.', chinese: '我网络断了，抱歉。' },
      { speaker: 'Profesora', spanish: 'No te preocupes, estábamos repasando lo de antes.', korean: '걱정 마, 아까 거 복습하고 있었어.', english: "Don't worry, we were reviewing the previous part.", chinese: '别担心，我们在复习之前的内容。' },
    ],
  },
  daic_111: {
    id: 'daic_111', lessonId: 'ai', situation: '온라인 — 영상 공유 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Te paso un link de YouTube, mirá esa giro.', korean: '유튜브 링크 보낼게, 그 회전 봐.', english: "I'll send you a YouTube link, look at that turn.", chinese: '我发你一个YouTube链接，看那个转。' },
      { speaker: 'Yo', spanish: 'Espectacular, ¿quién es la pareja?', korean: '대박, 누구 커플이야?', english: 'Spectacular, who\'s the couple?', chinese: '超棒，是哪对舞伴？' },
      { speaker: 'Amigo', spanish: 'Sebastián Achaval y Roxana Suárez.', korean: '세바스티안 아차발이랑 록사나 수아레스.', english: 'Sebastián Achaval and Roxana Suárez.', chinese: '塞巴斯蒂安·阿恰瓦尔和罗克萨娜·苏亚雷斯。' },
    ],
  },

  // ============ 미디어·문화 (3) ============
  daic_112: {
    id: 'daic_112', lessonId: 'ai', situation: '문화 — 영화 추천',
    lines: [
      { speaker: 'Amiga', spanish: '¿Viste "El Último Tango"?', korean: '"마지막 탱고" 봤어?', english: 'Did you watch "The Last Tango"?', chinese: '你看过《最后的探戈》吗？' },
      { speaker: 'Yo', spanish: 'Sí, María Nieves es una leyenda.', korean: '응, 마리아 니에베스는 전설이야.', english: 'Yes, María Nieves is a legend.', chinese: '看过，玛丽亚·涅维斯是传奇。' },
    ],
  },
  daic_113: {
    id: 'daic_113', lessonId: 'ai', situation: '문화 — 책 추천',
    lines: [
      { speaker: 'Amigo', spanish: '¿Querés leer algo sobre la historia del tango?', korean: '탱고 역사 책 읽고 싶어?', english: 'Want to read something about tango history?', chinese: '想读点探戈历史吗？' },
      { speaker: 'Yo', spanish: 'Sí, ¿qué me recomendás?', korean: '응, 뭐 추천해?', english: 'Yes, what do you recommend?', chinese: '想啊，你推荐什么？' },
      { speaker: 'Amigo', spanish: 'Cualquiera de Horacio Salas, son clásicos.', korean: '오라시오 살라스 책 아무거나, 다 고전이야.', english: 'Anything by Horacio Salas, they\'re classics.', chinese: '霍拉西奥·萨拉斯的任何一本，都是经典。' },
    ],
  },
  daic_114: {
    id: 'daic_114', lessonId: 'ai', situation: '문화 — 다큐 토론 (B1)',
    lines: [
      { speaker: 'Yo', spanish: 'Vi un documental sobre el tango queer, fascinante.', korean: '퀴어 탱고 다큐 봤어, 매력적이야.', english: 'I watched a documentary on queer tango, fascinating.', chinese: '我看了酷儿探戈纪录片，很吸引人。' },
      { speaker: 'Amigo', spanish: 'Es interesante cómo la tradición evoluciona.', korean: '전통이 어떻게 진화하는지 흥미롭지.', english: 'It\'s interesting how tradition evolves.', chinese: '传统如何演变很有意思。' },
      { speaker: 'Yo', spanish: 'Y siempre vuelve a su esencia: el abrazo.', korean: '그리고 항상 본질로 돌아와: 아브라소.', english: 'And it always returns to its essence: the embrace.', chinese: '它总是回归本质：拥抱。' },
    ],
  },

  // ============ 환경·일상 의식 (3) ============
  daic_115: {
    id: 'daic_115', lessonId: 'ai', situation: '환경 — 텀블러 자랑',
    lines: [
      { speaker: 'Amiga', spanish: '¡Qué linda tu botella reutilizable!', korean: '재사용 물병 예쁘다!', english: 'What a cute reusable bottle!', chinese: '你的环保水瓶真好看！' },
      { speaker: 'Yo', spanish: 'Trato de no usar plástico de un solo uso.', korean: '일회용 플라스틱 안 쓰려고 해.', english: 'I try not to use single-use plastic.', chinese: '我尽量不用一次性塑料。' },
    ],
  },
  daic_116: {
    id: 'daic_116', lessonId: 'ai', situation: '환경 — 자전거 출퇴근',
    lines: [
      { speaker: 'Amigo', spanish: 'Vine en bici, llegué transpirado.', korean: '자전거 타고 와서 땀 범벅이야.', english: 'I came by bike, I arrived sweaty.', chinese: '我骑车来的，到的时候浑身是汗。' },
      { speaker: 'Yo', spanish: 'Mejor el ejercicio que el subte lleno.', korean: '꽉 찬 지하철보다 운동이 낫지.', english: 'Better exercise than crowded subway.', chinese: '运动总比挤地铁好。' },
    ],
  },
  daic_117: {
    id: 'daic_117', lessonId: 'ai', situation: '환경 — 채식 토론 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Llevo seis meses vegetariano, me siento mucho mejor.', korean: '6개월째 채식 중, 훨씬 컨디션 좋아.', english: "I've been vegetarian for six months, I feel much better.", chinese: '我吃素六个月了，感觉好多了。' },
      { speaker: 'Yo', spanish: 'Yo no podría dejar el asado, pero respeto.', korean: '난 아사도는 못 끊지만 존중해.', english: 'I couldn\'t give up asado, but I respect it.', chinese: '我戒不掉烤肉，但我尊重。' },
      { speaker: 'Amigo', spanish: 'Cada uno a su ritmo, sin presión.', korean: '각자 페이스대로, 압박 없이.', english: 'Everyone at their own pace, no pressure.', chinese: '各自按自己的节奏，不必勉强。' },
    ],
  },

  // ============ 사진·기억 (3) ============
  daic_118: {
    id: 'daic_118', lessonId: 'ai', situation: '사진 — 같이 찍자',
    lines: [
      { speaker: 'Amiga', spanish: '¿Nos sacamos una foto juntos?', korean: '같이 사진 찍을래?', english: 'Shall we take a photo together?', chinese: '我们一起拍张照吧？' },
      { speaker: 'Yo', spanish: '¡Dale, así me acuerdo de la noche!', korean: '좋아, 오늘 밤 기억하게!', english: 'Sure, that way I\'ll remember the night!', chinese: '好啊，这样我能记住今晚！' },
    ],
  },
  daic_119: {
    id: 'daic_119', lessonId: 'ai', situation: '사진 — 단체 사진',
    lines: [
      { speaker: 'Organizador', spanish: '¡Foto grupal antes de irnos!', korean: '가기 전 단체 사진!', english: 'Group photo before we leave!', chinese: '走之前来张大合照！' },
      { speaker: 'Yo', spanish: 'Esperá, llamemos a Lucía también.', korean: '잠깐, 루시아도 부르자.', english: 'Wait, let\'s call Lucía too.', chinese: '等等，把露西亚也叫上。' },
    ],
  },
  daic_120: {
    id: 'daic_120', lessonId: 'ai', situation: '기억 — 옛 사진 회상 (B1)',
    lines: [
      { speaker: 'Veterano', spanish: 'Mirá esta foto del 95, todos jóvenes y soñadores.', korean: '이 95년 사진 봐, 다 어리고 꿈 가득했지.', english: 'Look at this photo from \'95, all young and dreamers.', chinese: '看这张95年的照片，大家都年轻又有梦想。' },
      { speaker: 'Yo', spanish: 'Cómo pasa el tiempo, pero el tango sigue uniéndolos.', korean: '시간 빨라, 근데 탱고가 계속 그들을 잇고 있어.', english: 'How time flies, but tango still unites them.', chinese: '时光飞逝，但探戈仍把他们连在一起。' },
      { speaker: 'Veterano', spanish: 'Eso es lo lindo, generaciones que se cruzan en la pista.', korean: '그게 아름다워, 댄스플로어에서 세대가 만나.', english: "That's the beauty, generations crossing on the floor.", chinese: '这就是美，几代人在舞池上相遇。' },
    ],
  },
};
