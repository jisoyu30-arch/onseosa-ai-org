// Claude (Sonnet 4.7) 직접 작성 dialogue — 배치 001
// 30개 (10 상황 × 3 레벨) — 자연스러운 아르헨 voseo + 4국어
import type { DialogueExample } from './dialogues-l1';

export const dialoguesClaude001: Record<string, DialogueExample> = {
  // ============ 카베세오 (3) ============
  daic_001: {
    id: 'daic_001', lessonId: 'ai', situation: '카베세오 — 멀리서 첫 시선',
    lines: [
      { speaker: 'Tanguero', spanish: 'Disculpá, ¿me estás mirando a mí?', korean: '저기, 저 보고 있는 거예요?', english: 'Excuse me, are you looking at me?', chinese: '不好意思，你是在看我吗？' },
      { speaker: 'Tanguera', spanish: 'Sí, ¿bailamos esta tanda?', korean: '네, 이 탄다 출까요?', english: 'Yes, shall we dance this tanda?', chinese: '是的，我们跳这首吗？' },
    ],
  },
  daic_002: {
    id: 'daic_002', lessonId: 'ai', situation: '카베세오 — 미묘한 거절',
    lines: [
      { speaker: 'Tanguero', spanish: '(la mira buscando cabeceo)', korean: '(카베세오를 찾으며 그녀를 본다)', english: '(looks at her seeking cabeceo)', chinese: '（用眼神寻找她的回应）' },
      { speaker: 'Tanguera', spanish: '(mira hacia otro lado, sonriendo amable)', korean: '(다른 쪽을 보며 부드럽게 미소)', english: '(looks the other way, smiling kindly)', chinese: '（看向别处，礼貌地微笑）' },
      { speaker: 'Tanguero', spanish: 'Entendido. Tal vez la próxima.', korean: '알겠어요. 다음 기회에.', english: 'Understood. Maybe next time.', chinese: '明白了。下次吧。' },
    ],
  },
  daic_003: {
    id: 'daic_003', lessonId: 'ai', situation: '카베세오 — 누구한테 한 건지 헷갈림',
    lines: [
      { speaker: 'Tanguera A', spanish: '¿A vos te miró o a mí?', korean: '너 본 거야, 나 본 거야?', english: 'Did he look at you or me?', chinese: '他是在看你还是看我？' },
      { speaker: 'Tanguera B', spanish: 'No estoy segura. Mirá de nuevo.', korean: '잘 모르겠어. 다시 봐봐.', english: "I'm not sure. Look again.", chinese: '我不确定。再看一次。' },
      { speaker: 'Tanguera A', spanish: 'Ahora sí, claramente a vos.', korean: '아 이번엔 확실히 너야.', english: 'Now yes, clearly at you.', chinese: '现在很明显是看你。' },
    ],
  },

  // ============ 탄다 초대 (3) ============
  daic_004: {
    id: 'daic_004', lessonId: 'ai', situation: '탄다 초대 — D\'Arienzo 좋아하는지 확인',
    lines: [
      { speaker: 'Tanguero', spanish: '¿Te gusta D\'Arienzo? Es esta tanda.', korean: '다리엔소 좋아해? 이번 탄다야.', english: "Do you like D'Arienzo? It's this tanda.", chinese: "你喜欢达里安佐吗？是这首。" },
      { speaker: 'Tanguera', spanish: '¡Me encanta! Vamos.', korean: '완전 좋아해요! 가요.', english: "I love him! Let's go.", chinese: '我超喜欢！走吧。' },
    ],
  },
  daic_005: {
    id: 'daic_005', lessonId: 'ai', situation: '탄다 초대 — 정중한 거절 (피곤함)',
    lines: [
      { speaker: 'Tanguero', spanish: '¿Me concedés esta tanda?', korean: '이 탄다 함께 해주실래요?', english: 'Would you grant me this tanda?', chinese: '可以邀请你跳这首吗？' },
      { speaker: 'Tanguera', spanish: 'Gracias, pero estoy descansando un rato. ¿La próxima?', korean: '감사한데 잠깐 쉬고 있어요. 다음 탄다는?', english: "Thanks, but I'm resting a bit. The next one?", chinese: '谢谢，但我正在休息一下。下一首吗？' },
      { speaker: 'Tanguero', spanish: 'Perfecto, te busco después.', korean: '좋아요, 이따 찾으러 올게요.', english: "Perfect, I'll find you later.", chinese: '好，等会儿来找你。' },
    ],
  },
  daic_006: {
    id: 'daic_006', lessonId: 'ai', situation: '탄다 초대 — 발스로 초대 (B1)',
    lines: [
      { speaker: 'Tanguero', spanish: 'Me encantaría compartir este vals con vos. ¿Aceptás?', korean: '이 발스를 같이 추면 정말 좋을 것 같아요. 받아주실래요?', english: "I'd love to share this vals with you. Will you accept?", chinese: '我很想和你跳这首华尔兹。你愿意吗？' },
      { speaker: 'Tanguera', spanish: 'Con mucho gusto. El vals es mi debilidad.', korean: '기꺼이요. 발스는 제 약점이에요.', english: 'With great pleasure. Vals is my weakness.', chinese: '非常乐意。华尔兹是我的最爱。' },
    ],
  },

  // ============ 코르티나 잡담 (3) ============
  daic_007: {
    id: 'daic_007', lessonId: 'ai', situation: '코르티나 — 어디서 왔어?',
    lines: [
      { speaker: 'Amigo', spanish: '¿De dónde sos?', korean: '어디서 왔어?', english: 'Where are you from?', chinese: '你从哪里来？' },
      { speaker: 'Yo', spanish: 'De Corea. ¿Y vos?', korean: '한국. 너는?', english: 'From Korea. And you?', chinese: '我从韩国来。你呢？' },
      { speaker: 'Amigo', spanish: 'De Buenos Aires, pero vivo en Madrid hace cinco años.', korean: '부에노스 출신인데 5년째 마드리드 살아.', english: "From Buenos Aires, but I've lived in Madrid for five years.", chinese: '我来自布宜诺斯艾利斯，但在马德里住了五年。' },
    ],
  },
  daic_008: {
    id: 'daic_008', lessonId: 'ai', situation: '코르티나 — 직업 얘기',
    lines: [
      { speaker: 'Amiga', spanish: '¿En qué trabajás?', korean: '무슨 일 해?', english: 'What do you do?', chinese: '你做什么工作？' },
      { speaker: 'Yo', spanish: 'Soy diseñadora. ¿Vos?', korean: '디자이너야. 너는?', english: "I'm a designer. You?", chinese: '我是设计师。你呢？' },
      { speaker: 'Amiga', spanish: 'Profesora de música. Por eso me encanta el tango.', korean: '음악 선생님. 그래서 탱고가 좋아.', english: "Music teacher. That's why I love tango.", chinese: '音乐老师。所以我特别喜欢探戈。' },
    ],
  },
  daic_009: {
    id: 'daic_009', lessonId: 'ai', situation: '코르티나 — 여행 계획 공유 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: '¿Tenés pensado viajar a Buenos Aires alguna vez?', korean: '언젠가 부에노스 여행 갈 생각 있어?', english: 'Are you thinking of traveling to Buenos Aires sometime?', chinese: '你想过什么时候去布宜诺斯艾利斯吗？' },
      { speaker: 'Yo', spanish: 'Sí, estoy ahorrando para ir el año que viene.', korean: '응, 내년에 가려고 모으는 중이야.', english: "Yes, I'm saving up to go next year.", chinese: '想啊，我正在存钱明年去。' },
      { speaker: 'Amigo', spanish: 'Te paso contactos cuando vayas. Conozco las mejores milongas.', korean: '갈 때 연락처 줄게. 좋은 밀롱가 다 알아.', english: "I'll give you contacts when you go. I know the best milongas.", chinese: '你去的时候我给你联系人。我知道最好的米隆加。' },
    ],
  },

  // ============ 아브라소·자세 (3) ============
  daic_010: {
    id: 'daic_010', lessonId: 'ai', situation: '아브라소 — 편안하다 칭찬',
    lines: [
      { speaker: 'Tanguera', spanish: 'Tu abrazo es muy cómodo.', korean: '당신 아브라소 정말 편해요.', english: 'Your embrace is very comfortable.', chinese: '你的拥抱很舒服。' },
      { speaker: 'Tanguero', spanish: 'Gracias, vos también te entregás muy bien.', korean: '고마워요, 당신도 정말 잘 맡겨주세요.', english: 'Thanks, you also surrender very well.', chinese: '谢谢，你也放得很好。' },
    ],
  },
  daic_011: {
    id: 'daic_011', lessonId: 'ai', situation: '아브라소 — 간격 조정 부탁',
    lines: [
      { speaker: 'Tanguera', spanish: '¿Podríamos abrir un poquito el abrazo?', korean: '아브라소 조금 열어도 될까요?', english: 'Could we open the embrace a little?', chinese: '我们可以稍微打开一点拥抱吗？' },
      { speaker: 'Tanguero', spanish: 'Por supuesto, decime cómo te queda mejor.', korean: '물론이죠, 어떻게가 편한지 알려줘요.', english: 'Of course, tell me what feels best for you.', chinese: '当然可以，你告诉我哪样最舒服。' },
    ],
  },
  daic_012: {
    id: 'daic_012', lessonId: 'ai', situation: '아브라소 — 어깨 힘 빼기 (선생) (B1)',
    lines: [
      { speaker: 'Profesor', spanish: 'Soltá los hombros, los tenés muy arriba.', korean: '어깨 풀어, 너무 올라가 있어.', english: "Drop your shoulders, they're up too high.", chinese: '放松肩膀，你抬得太高了。' },
      { speaker: 'Alumna', spanish: 'No me doy cuenta cuándo se me suben.', korean: '언제 올라가는지 인식이 안 돼요.', english: "I don't realize when they go up.", chinese: '我没意识到什么时候会抬起来。' },
      { speaker: 'Profesor', spanish: 'Respirá profundo y dejá caer el peso.', korean: '깊게 숨 쉬고 무게를 떨어뜨려.', english: 'Breathe deep and let the weight fall.', chinese: '深呼吸，让重量沉下去。' },
    ],
  },

  // ============ 칭찬 (3) ============
  daic_013: {
    id: 'daic_013', lessonId: 'ai', situation: '칭찬 — 걸음 칭찬',
    lines: [
      { speaker: 'Tanguero', spanish: 'Tu caminata es preciosa.', korean: '당신 걸음 정말 예뻐요.', english: 'Your walk is gorgeous.', chinese: '你的步伐很美。' },
      { speaker: 'Tanguera', spanish: '¡Gracias! Trabajo mucho en eso.', korean: '고마워요! 거기에 공들이고 있어요.', english: 'Thanks! I work a lot on that.', chinese: '谢谢！我在这上面下了很多功夫。' },
    ],
  },
  daic_014: {
    id: 'daic_014', lessonId: 'ai', situation: '칭찬 — 음악성 칭찬',
    lines: [
      { speaker: 'Tanguera', spanish: 'Bailás muy musical, escuchás cada detalle.', korean: '정말 음악적으로 추네요, 디테일 다 들어요.', english: 'You dance so musically, you hear every detail.', chinese: '你跳得很音乐性，每个细节都听得出来。' },
      { speaker: 'Tanguero', spanish: 'La música me lleva, yo solo la sigo.', korean: '음악이 절 이끌어요, 전 그냥 따라가요.', english: 'The music carries me, I just follow.', chinese: '音乐带着我，我只是跟着。' },
    ],
  },
  daic_015: {
    id: 'daic_015', lessonId: 'ai', situation: '칭찬 — 에너지 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Tenés una energía hermosa cuando bailás, se nota que disfrutás.', korean: '출 때 에너지가 정말 멋져, 즐기는 게 보여.', english: 'You have beautiful energy when you dance, you can tell you enjoy it.', chinese: '你跳舞时的能量很美，看得出你很享受。' },
      { speaker: 'Yo', spanish: 'Es que para mí el tango es terapia, no ejercicio.', korean: '나한테 탱고는 운동이 아니라 치료야.', english: 'For me tango is therapy, not exercise.', chinese: '对我来说探戈是疗愈，不是运动。' },
    ],
  },

  // ============ 사과 (3) ============
  daic_016: {
    id: 'daic_016', lessonId: 'ai', situation: '사과 — 발 밟기',
    lines: [
      { speaker: 'Tanguero', spanish: '¡Uy, perdón! ¿Te lastimé?', korean: '아, 미안해요! 다쳤어요?', english: 'Oh, sorry! Did I hurt you?', chinese: '哎呀，对不起！我弄疼你了吗？' },
      { speaker: 'Tanguera', spanish: 'Para nada, sigamos.', korean: '전혀요, 계속 해요.', english: "Not at all, let's continue.", chinese: '完全没事，继续吧。' },
    ],
  },
  daic_017: {
    id: 'daic_017', lessonId: 'ai', situation: '사과 — 충돌 후',
    lines: [
      { speaker: 'Tanguero', spanish: 'Disculpame, no vi a la pareja de atrás.', korean: '미안해요, 뒤 커플을 못 봤어요.', english: "Sorry, I didn't see the couple behind.", chinese: '对不起，我没看到后面的舞伴。' },
      { speaker: 'Tanguera', spanish: 'Tranquilo, pasa todo el tiempo en la ronda.', korean: '괜찮아요, 론다에서 늘 있는 일이에요.', english: 'Easy, it happens all the time in the ronda.', chinese: '没事，舞圈里经常发生。' },
    ],
  },
  daic_018: {
    id: 'daic_018', lessonId: 'ai', situation: '사과 — 신호 못 읽음 (B1)',
    lines: [
      { speaker: 'Tanguera', spanish: 'Perdón, no entendí esa marca.', korean: '죄송해요, 그 신호 못 읽었어요.', english: "Sorry, I didn't catch that lead.", chinese: '抱歉，我没看懂那个引导。' },
      { speaker: 'Tanguero', spanish: 'Mi culpa, fui muy sutil. Probemos de nuevo.', korean: '내 잘못이에요, 너무 미세했어요. 다시 해봐요.', english: 'My fault, I was too subtle. Let\'s try again.', chinese: '我的错，我做得太微弱了。再试一次。' },
      { speaker: 'Tanguera', spanish: 'Ahora sí, perfecto.', korean: '아 이제 됐어요, 완벽해요.', english: 'Now yes, perfect.', chinese: '现在懂了，完美。' },
    ],
  },

  // ============ 감사 (3) ============
  daic_019: {
    id: 'daic_019', lessonId: 'ai', situation: '감사 — 짧은 인사',
    lines: [
      { speaker: 'Tanguera', spanish: '¡Gracias, hermosa tanda!', korean: '감사해요, 아름다운 탄다였어요!', english: 'Thanks, beautiful tanda!', chinese: '谢谢，美好的探戈！' },
      { speaker: 'Tanguero', spanish: 'Gracias a vos, un placer.', korean: '제가 감사해요, 즐거웠어요.', english: 'Thank you, a pleasure.', chinese: '谢谢你，很愉快。' },
    ],
  },
  daic_020: {
    id: 'daic_020', lessonId: 'ai', situation: '감사 — 첫 만남',
    lines: [
      { speaker: 'Tanguera', spanish: 'Es la primera vez que bailamos, ¿no? Encantada.', korean: '처음 추는 거죠? 반가워요.', english: 'First time dancing together, right? Pleased to meet you.', chinese: '我们第一次跳吧？很高兴。' },
      { speaker: 'Tanguero', spanish: 'Encantado, espero que no sea la última.', korean: '저도요, 마지막이 아니길 바라요.', english: 'Pleased, hope it\'s not the last.', chinese: '我也是，希望不是最后一次。' },
    ],
  },
  daic_021: {
    id: 'daic_021', lessonId: 'ai', situation: '감사 — 울컥한 탄다 (B1)',
    lines: [
      { speaker: 'Tanguera', spanish: 'Esa última pieza me llegó al alma. Gracias por bailarla así.', korean: '마지막 곡 영혼에 닿았어요. 그렇게 춰주셔서 감사해요.', english: 'That last piece touched my soul. Thank you for dancing it like that.', chinese: '最后那首打动了我的心。谢谢你这样跳。' },
      { speaker: 'Tanguero', spanish: 'Lo sentí igual. Estos momentos son los que uno guarda.', korean: '저도 똑같이 느꼈어요. 이런 순간은 평생 간직하죠.', english: 'I felt the same. These are the moments one keeps.', chinese: '我也一样。这种时刻是会留在心里的。' },
    ],
  },

  // ============ DJ 신청곡 (3) ============
  daic_022: {
    id: 'daic_022', lessonId: 'ai', situation: 'DJ 신청 — Pugliese 부탁',
    lines: [
      { speaker: 'Bailarín', spanish: '¿Vas a poner Pugliese esta noche?', korean: '오늘 밤 푸글리에세 틀 거예요?', english: 'Are you going to play Pugliese tonight?', chinese: '今晚你会放普利亚吗？' },
      { speaker: 'DJ', spanish: 'Ya lo tengo programado, en la tercera tanda.', korean: '이미 셋업했어요, 세 번째 탄다에서.', english: "I have it programmed, in the third tanda.", chinese: '已经安排好了，第三首组曲。' },
    ],
  },
  daic_023: {
    id: 'daic_023', lessonId: 'ai', situation: 'DJ 신청 — 발스 더 부탁',
    lines: [
      { speaker: 'Bailarina', spanish: '¿Podés poner más valses? Hay poca gente bailando.', korean: '발스 좀 더 틀 수 있어요? 추는 사람이 적어요.', english: 'Can you play more valses? Few people are dancing.', chinese: '可以多放点华尔兹吗？跳的人不多。' },
      { speaker: 'DJ', spanish: 'Te escucho, en la próxima cortina cambio.', korean: '알겠어요, 다음 코르티나에서 바꿔요.', english: "I hear you, I'll change at the next cortina.", chinese: '听你的，下次过渡时换。' },
    ],
  },
  daic_024: {
    id: 'daic_024', lessonId: 'ai', situation: 'DJ 신청 — 클래식 vs 모던 토론 (B1)',
    lines: [
      { speaker: 'Bailarín A', spanish: 'A mí me cansa el tango electrónico, prefiero los clásicos.', korean: '나는 일렉트로 탱고 지쳐, 클래식이 좋아.', english: 'Electronic tango tires me, I prefer classics.', chinese: '电子探戈让我累，我更喜欢经典。' },
      { speaker: 'Bailarín B', spanish: 'Yo creo que hay que tener variedad para todos los gustos.', korean: '난 모두를 위한 다양성이 있어야 한다고 봐.', english: 'I think there should be variety for all tastes.', chinese: '我觉得应该有适合各种口味的多样性。' },
      { speaker: 'Bailarín A', spanish: 'Tenés razón, pero la golden age es insuperable.', korean: '맞아, 근데 황금기는 따라올 수가 없지.', english: "You're right, but the golden age is unbeatable.", chinese: '你说得对，但黄金时代是无可比拟的。' },
    ],
  },

  // ============ 신발·복장 (3) ============
  daic_025: {
    id: 'daic_025', lessonId: 'ai', situation: '신발 — 새 신발 자랑',
    lines: [
      { speaker: 'Amiga', spanish: '¡Qué lindos zapatos nuevos!', korean: '와, 새 신발 너무 예쁘다!', english: 'What lovely new shoes!', chinese: '新鞋真好看！' },
      { speaker: 'Yo', spanish: 'Me los traje de Buenos Aires, son Comme il Faut.', korean: '부에노스에서 가져왔어, Comme il Faut야.', english: 'I brought them from Buenos Aires, they\'re Comme il Faut.', chinese: '从布宜诺斯艾利斯带回来的，是Comme il Faut。' },
      { speaker: 'Amiga', spanish: '¡Te quedan increíbles!', korean: '진짜 잘 어울려!', english: 'They look amazing on you!', chinese: '你穿着好看极了！' },
    ],
  },
  daic_026: {
    id: 'daic_026', lessonId: 'ai', situation: '신발 — 굽 높이 고민',
    lines: [
      { speaker: 'Yo', spanish: 'Estos tacos de nueve son un poco altos para mí.', korean: '이 9cm 굽은 좀 높아.', english: 'These nine-cm heels are a bit high for me.', chinese: '这九厘米的鞋跟对我来说有点高。' },
      { speaker: 'Amiga', spanish: 'Probá con siete, es más cómodo para milongas largas.', korean: '7cm 신어봐, 긴 밀롱가에 더 편해.', english: 'Try seven, more comfortable for long milongas.', chinese: '试试七厘米的，长时间跳舞更舒服。' },
    ],
  },
  daic_027: {
    id: 'daic_027', lessonId: 'ai', situation: '신발 — 수리 얘기 (B1)',
    lines: [
      { speaker: 'Amigo', spanish: 'Se me despegó la suela en plena tanda, qué desastre.', korean: '탄다 중에 밑창 떨어져서 난리였어.', english: 'My sole came off in the middle of the tanda, what a disaster.', chinese: '探戈跳到一半鞋底掉了，惨不忍睹。' },
      { speaker: 'Yo', spanish: 'Llevalos a Diego, él arregla todos los zapatos de tango.', korean: 'Diego한테 가져가, 탱고화 다 고쳐줘.', english: 'Take them to Diego, he fixes all tango shoes.', chinese: '拿到迭戈那里，他修所有探戈鞋。' },
    ],
  },

  // ============ 밀롱가 잡담 (3) ============
  daic_028: {
    id: 'daic_028', lessonId: 'ai', situation: '잡담 — 추천 밀롱가 묻기',
    lines: [
      { speaker: 'Yo', spanish: '¿Qué milonga me recomendás para los miércoles?', korean: '수요일에 추천할 밀롱가 있어?', english: 'What milonga do you recommend for Wednesdays?', chinese: '你推荐周三去哪个米隆加？' },
      { speaker: 'Amiga', spanish: 'Cachirulo es la mejor, pero llegá temprano.', korean: 'Cachirulo가 최고야, 근데 일찍 가.', english: 'Cachirulo is the best, but arrive early.', chinese: 'Cachirulo最好，但要早点到。' },
    ],
  },
  daic_029: {
    id: 'daic_029', lessonId: 'ai', situation: '잡담 — 오케스트라 취향',
    lines: [
      { speaker: 'Amigo', spanish: '¿Cuál es tu orquesta favorita?', korean: '제일 좋아하는 오케스트라가 뭐야?', english: "What's your favorite orchestra?", chinese: '你最喜欢哪个乐团？' },
      { speaker: 'Yo', spanish: 'Di Sarli para bailar, Pugliese para escuchar.', korean: '추기엔 디 사를리, 듣기엔 푸글리에세.', english: 'Di Sarli for dancing, Pugliese for listening.', chinese: '跳舞听Di Sarli，欣赏听Pugliese。' },
      { speaker: 'Amigo', spanish: '¡Tenés muy buen criterio!', korean: '취향 정말 좋다!', english: 'You have very good taste!', chinese: '你的品味真好！' },
    ],
  },
  daic_030: {
    id: 'daic_030', lessonId: 'ai', situation: '잡담 — 새 학생 만남 (B1)',
    lines: [
      { speaker: 'Veterana', spanish: '¿Hace cuánto que estás bailando?', korean: '얼마나 췄어?', english: 'How long have you been dancing?', chinese: '你跳多久了？' },
      { speaker: 'Principiante', spanish: 'Empecé hace seis meses, todavía me siento perdida.', korean: '6개월 전에 시작했는데 아직 헤매.', english: 'I started six months ago, I still feel lost.', chinese: '我半年前开始的，还是感觉很迷茫。' },
      { speaker: 'Veterana', spanish: 'Es normal, el primer año todos nos sentimos así. Después se abre.', korean: '정상이야, 첫 해는 다 그래. 그 후에 열려.', english: "It's normal, the first year we all feel that way. Then it opens up.", chinese: '正常的，第一年我们都这样。之后就豁然开朗。' },
    ],
  },
};
