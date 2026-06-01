// 단어별 이모지 매핑 — 자주 쓰는 700+ 단어 (3개 언어 통합)
// 매핑 안 되면 카테고리 이모지 fallback
export const WORD_EMOJI: Record<string, string> = {
  // ===== 동물 =====
  'dog':'🐕','cat':'🐈','bird':'🐦','fish':'🐟','horse':'🐎','cow':'🐄','pig':'🐖','sheep':'🐑',
  'lion':'🦁','tiger':'🐅','bear':'🐻','rabbit':'🐰','mouse':'🐁','elephant':'🐘','monkey':'🐒',
  'duck':'🦆','chicken':'🐔','eagle':'🦅','butterfly':'🦋','bee':'🐝','animal':'🐾',
  'perro':'🐕','gato':'🐈','pájaro':'🐦','pez':'🐟','caballo':'🐎','vaca':'🐄','animal':'🐾',
  '狗':'🐕','猫':'🐈','鸟':'🐦','鱼':'🐟','马':'🐎','牛':'🐄','动物':'🐾',

  // ===== 자연·날씨 =====
  'sun':'☀','moon':'🌙','star':'⭐','rain':'🌧','snow':'❄','wind':'💨','cloud':'☁','sky':'🌌',
  'tree':'🌳','flower':'🌸','grass':'🌿','leaf':'🍃','mountain':'⛰','sea':'🌊','river':'🏞','beach':'🏖',
  'fire':'🔥','water':'💧','earth':'🌍','rainbow':'🌈',
  'sol':'☀','luna':'🌙','estrella':'⭐','lluvia':'🌧','nieve':'❄','viento':'💨','nube':'☁','cielo':'🌌',
  'árbol':'🌳','flor':'🌸','montaña':'⛰','mar':'🌊','río':'🏞','playa':'🏖','fuego':'🔥','agua':'💧',
  '太阳':'☀','月':'🌙','星':'⭐','雨':'🌧','雪':'❄','风':'💨','云':'☁','天':'🌌',
  '树':'🌳','花':'🌸','山':'⛰','海':'🌊','河':'🏞','水':'💧','火':'🔥',

  // ===== 음식·음료 =====
  'food':'🍽','bread':'🍞','rice':'🍚','meat':'🥩','fish':'🐟','egg':'🥚','milk':'🥛','cheese':'🧀',
  'apple':'🍎','banana':'🍌','orange':'🍊','grape':'🍇','strawberry':'🍓','watermelon':'🍉',
  'tomato':'🍅','potato':'🥔','onion':'🧅','carrot':'🥕','corn':'🌽','salad':'🥗',
  'pizza':'🍕','hamburger':'🍔','sandwich':'🥪','pasta':'🍝','soup':'🍲','noodle':'🍜',
  'coffee':'☕','tea':'🍵','wine':'🍷','beer':'🍺','juice':'🧃','water':'💧','cake':'🍰','chocolate':'🍫',
  'comida':'🍽','pan':'🍞','arroz':'🍚','carne':'🥩','huevo':'🥚','leche':'🥛','queso':'🧀',
  'manzana':'🍎','naranja':'🍊','vino':'🍷','café':'☕','agua':'💧','cerveza':'🍺','asado':'🥩',
  '食物':'🍽','米饭':'🍚','面包':'🍞','肉':'🥩','蛋':'🥚','牛奶':'🥛','苹果':'🍎','咖啡':'☕','茶':'🍵',

  // ===== 신체 =====
  'head':'🧠','face':'😊','eye':'👁','ear':'👂','nose':'👃','mouth':'👄','tooth':'🦷','hair':'💇',
  'hand':'✋','finger':'☝','foot':'🦶','leg':'🦵','arm':'💪','heart':'❤','blood':'🩸','body':'🧍',
  'cabeza':'🧠','cara':'😊','ojo':'👁','oreja':'👂','nariz':'👃','mano':'✋','pie':'🦶','corazón':'❤',
  '头':'🧠','脸':'😊','眼睛':'👁','耳朵':'👂','嘴':'👄','手':'✋','脚':'🦶','心':'❤','身体':'🧍',

  // ===== 가족·사람 =====
  'man':'👨','woman':'👩','boy':'👦','girl':'👧','baby':'👶','child':'🧒','people':'👥','person':'🧑',
  'mother':'👩','father':'👨','mom':'👩','dad':'👨','brother':'👬','sister':'👭','son':'👦','daughter':'👧',
  'grandma':'👵','grandpa':'👴','family':'👨‍👩‍👧','friend':'🤝','couple':'💑','team':'👥',
  'hombre':'👨','mujer':'👩','niño':'👦','niña':'👧','bebé':'👶','gente':'👥','persona':'🧑',
  'madre':'👩','padre':'👨','hermano':'👬','hermana':'👭','familia':'👨‍👩‍👧','amigo':'🤝','pareja':'💑',
  '人':'🧑','男':'👨','女':'👩','孩子':'🧒','妈妈':'👩','爸爸':'👨','哥哥':'👬','姐姐':'👭','家':'🏠','朋友':'🤝',

  // ===== 집·사물 =====
  'house':'🏠','home':'🏠','door':'🚪','window':'🪟','room':'🛏','bed':'🛏','chair':'🪑','table':'🪑',
  'kitchen':'🍳','bathroom':'🛁','phone':'📱','computer':'💻','tv':'📺','book':'📖','pen':'🖊','paper':'📄',
  'key':'🔑','clock':'🕐','money':'💰','bag':'👜','box':'📦','bottle':'🍾',
  'casa':'🏠','puerta':'🚪','ventana':'🪟','cama':'🛏','silla':'🪑','mesa':'🪑','teléfono':'📱',
  'libro':'📖','dinero':'💰','llave':'🔑','reloj':'🕐',
  '家':'🏠','门':'🚪','床':'🛏','桌':'🪑','电话':'📱','电脑':'💻','书':'📖','钱':'💰','钥匙':'🔑',

  // ===== 교통·이동 =====
  'car':'🚗','bus':'🚌','train':'🚆','plane':'✈','ship':'🚢','bike':'🚴','taxi':'🚕','road':'🛣',
  'go':'🚶','come':'🚶','walk':'🚶','run':'🏃','drive':'🚗','fly':'✈','travel':'✈',
  'coche':'🚗','autobús':'🚌','tren':'🚆','avión':'✈','barco':'🚢','bici':'🚴','viaje':'✈','caminar':'🚶','correr':'🏃',
  '车':'🚗','汽车':'🚗','火车':'🚆','飞机':'✈','船':'🚢','走':'🚶','跑':'🏃','旅行':'✈',

  // ===== 행동·동사 =====
  'eat':'🍽','drink':'🥤','sleep':'😴','wake':'⏰','sit':'🪑','stand':'🧍','look':'👀','see':'👀',
  'hear':'👂','speak':'💬','talk':'💬','say':'💬','read':'📖','write':'✍','listen':'👂','sing':'🎤',
  'dance':'💃','play':'🎮','work':'💼','study':'📚','learn':'📚','teach':'👩‍🏫','think':'💭','dream':'💭',
  'love':'❤','like':'👍','hate':'👎','smile':'😊','cry':'😢','laugh':'😂','give':'🎁','take':'👐',
  'buy':'💳','sell':'💵','cook':'🍳','wash':'🧼','clean':'🧹','open':'🚪','close':'🚪',
  'comer':'🍽','beber':'🥤','dormir':'😴','sentar':'🪑','mirar':'👀','escuchar':'👂','hablar':'💬',
  'leer':'📖','escribir':'✍','cantar':'🎤','bailar':'💃','jugar':'🎮','trabajar':'💼','estudiar':'📚',
  'amar':'❤','querer':'❤','llorar':'😢','reír':'😂','cocinar':'🍳','comprar':'💳',
  '吃':'🍽','喝':'🥤','睡':'😴','看':'👀','听':'👂','说':'💬','读':'📖','写':'✍','学':'📚','工作':'💼',
  '跳舞':'💃','玩':'🎮','爱':'❤','哭':'😢','笑':'😂','做':'🍳','买':'💳',

  // ===== 감정·상태 =====
  'happy':'😊','sad':'😢','angry':'😠','tired':'😪','sick':'🤒','well':'💪','good':'👍','bad':'👎',
  'big':'🟢','small':'🔵','hot':'🔥','cold':'🥶','fast':'🏃','slow':'🐢','new':'✨','old':'👴',
  'feliz':'😊','triste':'😢','enojado':'😠','cansado':'😪','bueno':'👍','malo':'👎','grande':'🟢','nuevo':'✨',
  '开心':'😊','高兴':'😊','伤心':'😢','生气':'😠','累':'😪','病':'🤒','好':'👍','坏':'👎','大':'🟢','小':'🔵',

  // ===== 시간·숫자 =====
  'time':'⏰','day':'☀','night':'🌙','morning':'🌅','evening':'🌆','today':'📅','tomorrow':'📅','yesterday':'📅',
  'week':'📅','month':'📅','year':'📅','hour':'⏰','minute':'⏰','second':'⏱',
  'tiempo':'⏰','día':'☀','noche':'🌙','mañana':'🌅','tarde':'🌆','hoy':'📅','semana':'📅','año':'📅','hora':'⏰',
  '时间':'⏰','天':'☀','夜':'🌙','早':'🌅','晚':'🌆','今天':'📅','明天':'📅','昨天':'📅','年':'📅','小时':'⏰',

  // ===== 색깔 =====
  'red':'🔴','blue':'🔵','green':'🟢','yellow':'🟡','black':'⬛','white':'⬜','pink':'🌸','orange':'🟠','purple':'🟣',
  'rojo':'🔴','azul':'🔵','verde':'🟢','amarillo':'🟡','negro':'⬛','blanco':'⬜','rosa':'🌸',
  '红':'🔴','蓝':'🔵','绿':'🟢','黄':'🟡','黑':'⬛','白':'⬜','粉':'🌸',

  // ===== 탱고 전용 =====
  'tango':'💃','milonga':'🪩','bailar':'💃','baile':'💃','abrazo':'🤗','vals':'🎵',
  '探戈':'💃','跳舞':'💃','拥抱':'🤗',

  // ===== 학교·일 =====
  'school':'🏫','class':'📚','teacher':'👩‍🏫','student':'🧑‍🎓','test':'📝','grade':'💯',
  'office':'🏢','job':'💼','meeting':'👥','project':'📋','boss':'💼','email':'📧',
  'escuela':'🏫','clase':'📚','profesor':'👩‍🏫','alumno':'🧑‍🎓','examen':'📝','trabajo':'💼','oficina':'🏢',
  '学校':'🏫','老师':'👩‍🏫','学生':'🧑‍🎓','考试':'📝','工作':'💼','公司':'🏢',

  // ===== 기능어 =====
  'yes':'✅','no':'❌','ok':'👌','okay':'👌','hello':'👋','goodbye':'👋','please':'🙏','thanks':'🙏',
  'sí':'✅','hola':'👋','adiós':'👋','gracias':'🙏','por favor':'🙏',
  '是':'✅','不':'❌','好':'👌','你好':'👋','再见':'👋','谢谢':'🙏','请':'🙏',
};

/** 단어 → 이모지 (없으면 null) */
export function getWordEmoji(word: string): string | null {
  const w = word.toLowerCase().trim();
  return WORD_EMOJI[w] ?? WORD_EMOJI[word] ?? null;
}
