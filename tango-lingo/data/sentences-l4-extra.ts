import { Sentence } from '../types';

export const sentencesL4Extra: Record<string, Sentence> = {

  // ----- L4-01: 다시 해볼까요 -----
  s4_01_4: { id: 's4_01_4', spanish: '¿Podemos repetir?', korean: '반복해도 될까요?', english: 'Can we repeat?', chinese: '我们可以重复吗？', pronunciation: 'po-DE-mos re-pe-TIR?', tags: ['연습', '피드백'], difficulty: 2 },
  s4_01_5: { id: 's4_01_5', spanish: 'Una más.', korean: '한 번만 더.', english: 'One more.', chinese: '再来一次。', pronunciation: 'U-na MÁS', tags: ['연습', '피드백'], difficulty: 1 },
  s4_01_6: { id: 's4_01_6', spanish: 'Quiero practicar esto.', korean: '이거 연습하고 싶어.', english: 'I want to practice this.', chinese: '我想练习这个。', pronunciation: 'KIE-ro prak-ti-KAR ES-to', tags: ['연습'], difficulty: 2 },
  s4_01_7: { id: 's4_01_7', spanish: 'Otra vez, pero despacio.', korean: '다시, 근데 천천히.', english: 'Again, but slowly.', chinese: '再来，但慢慢地。', pronunciation: 'O-tra VES, PE-ro des-PA-sio', tags: ['연습', '속도'], difficulty: 2 },
  s4_01_8: { id: 's4_01_8', spanish: '¿Desde dónde empezamos?', korean: '어디서부터 시작해?', english: 'Where do we start from?', chinese: '我们从哪里开始？', pronunciation: 'DES-de DÓN-de em-pe-SA-mos?', tags: ['연습'], difficulty: 2 },
  s4_01_9: { id: 's4_01_9', spanish: 'Desde la salida.', korean: '살리다부터.', english: 'From the salida.', chinese: '从salida开始。', pronunciation: 'DES-de la sa-LI-da', tags: ['연습'], difficulty: 2 },
  s4_01_10: { id: 's4_01_10', spanish: 'Listo, vamos de nuevo.', korean: '준비 됐어, 다시 하자.', english: "Ready, let's go again.", chinese: '准备好了，再来。', pronunciation: 'LIS-to, VA-mos de NUE-vo', tags: ['연습'], difficulty: 1 },

  // ----- L4-02: 더 좋아요 -----
  s4_02_4: { id: 's4_02_4', spanish: 'Eso estuvo genial.', korean: '그거 대단했어.', english: 'That was great.', chinese: '那太棒了。', pronunciation: 'E-so es-TU-vo he-niAL', tags: ['연습', '긍정'], difficulty: 2 },
  s4_02_5: { id: 's4_02_5', spanish: 'Se nota la diferencia.', korean: '차이가 느껴져.', english: 'You can feel the difference.', chinese: '感觉到了区别。', pronunciation: 'se NO-ta la di-fe-REN-sia', tags: ['연습', '긍정'], difficulty: 3 },
  s4_02_6: { id: 's4_02_6', spanish: '¡Eso!', korean: '바로 그거!', english: 'That\'s it!', chinese: '就是这个！', pronunciation: 'E-so!', tags: ['연습', '긍정'], difficulty: 1 },
  s4_02_7: { id: 's4_02_7', spanish: 'Vas muy bien.', korean: '아주 잘 하고 있어.', english: "You're doing very well.", chinese: '你做得很好。', pronunciation: 'VAS mui BIEN', tags: ['연습', '긍정'], difficulty: 1 },
  s4_02_8: { id: 's4_02_8', spanish: 'Me gusta cómo lo hacés.', korean: '네가 하는 방식이 좋아.', english: 'I like how you do it.', chinese: '我喜欢你做的方式。', pronunciation: 'me GUS-ta KÓ-mo lo a-SÉS', tags: ['연습', '긍정'], difficulty: 3 },
  s4_02_9: { id: 's4_02_9', spanish: 'Seguí así.', korean: '계속 그렇게.', english: 'Keep it up.', chinese: '继续这样。', pronunciation: 'se-GÍ a-SÍ', tags: ['연습', '긍정'], difficulty: 1 },
  s4_02_10: { id: 's4_02_10', spanish: 'Qué lindo se siente.', korean: '느낌이 좋다.', english: 'How nice it feels.', chinese: '感觉真好。', pronunciation: 'ke LIN-do se SIEN-te', tags: ['연습', '긍정', '정서'], difficulty: 2 },

  // ----- L4-03: 아직 아니에요 -----
  s4_03_4: { id: 's4_03_4', spanish: 'Casi, pero no.', korean: '거의, 근데 아직.', english: 'Almost, but no.', chinese: '差一点，但还没。', pronunciation: 'KA-si, PE-ro NO', tags: ['연습', '교정'], difficulty: 1 },
  s4_03_5: { id: 's4_03_5', spanish: 'Falta un poco más.', korean: '조금 더 부족해.', english: 'A bit more is needed.', chinese: '还差一点。', pronunciation: 'FAL-ta un PO-ko MÁS', tags: ['연습', '교정'], difficulty: 2 },
  s4_03_6: { id: 's4_03_6', spanish: 'Intentá de otra forma.', korean: '다른 방법으로 해봐.', english: 'Try a different way.', chinese: '试试另一种方式。', pronunciation: 'in-ten-TÁ de O-tra FOR-ma', tags: ['연습', '교정'], difficulty: 2 },
  s4_03_7: { id: 's4_03_7', spanish: 'Pensalo así.', korean: '이렇게 생각해봐.', english: 'Think of it this way.', chinese: '这样想。', pronunciation: 'pen-SA-lo a-SÍ', tags: ['연습', '교정'], difficulty: 2 },
  s4_03_8: { id: 's4_03_8', spanish: 'No es eso.', korean: '그게 아니야.', english: "That's not it.", chinese: '不是那个。', pronunciation: 'no es E-so', tags: ['연습', '교정'], difficulty: 1 },
  s4_03_9: { id: 's4_03_9', spanish: 'Probá esto.', korean: '이걸 해봐.', english: 'Try this.', chinese: '试试这个。', pronunciation: 'pro-BÁ ES-to', tags: ['연습', '교정'], difficulty: 1 },
  s4_03_10: { id: 's4_03_10', spanish: 'Ahí va, estás cerca.', korean: '거의 다 왔어.', english: "There you go, you're close.", chinese: '快了，你很接近了。', pronunciation: 'a-Í VA, es-TÁS SER-ka', tags: ['연습', '교정', '격려'], difficulty: 2 },

  // ----- L4-04: 천천히요 -----
  s4_04_4: { id: 's4_04_4', spanish: 'Sin prisa.', korean: '서두르지 말고.', english: 'No rush.', chinese: '不着急。', pronunciation: 'sin PRI-sa', tags: ['연습', '속도'], difficulty: 1 },
  s4_04_5: { id: 's4_04_5', spanish: 'Hay tiempo.', korean: '시간은 있어.', english: 'There\'s time.', chinese: '有时间。', pronunciation: 'ai TIEM-po', tags: ['연습', '속도'], difficulty: 1 },
  s4_04_6: { id: 's4_04_6', spanish: 'Paso a paso.', korean: '한 걸음씩.', english: 'Step by step.', chinese: '一步一步来。', pronunciation: 'PA-so a PA-so', tags: ['연습', '속도'], difficulty: 1 },
  s4_04_7: { id: 's4_04_7', spanish: 'Disfrutá el proceso.', korean: '과정을 즐겨.', english: 'Enjoy the process.', chinese: '享受过程。', pronunciation: 'dis-fru-TÁ el pro-SE-so', tags: ['연습', '정서'], difficulty: 2 },
  s4_04_8: { id: 's4_04_8', spanish: 'No es una carrera.', korean: '경주가 아니야.', english: "It's not a race.", chinese: '这不是比赛。', pronunciation: 'no es U-na ka-RRE-ra', tags: ['연습', '정서'], difficulty: 2 },
  s4_04_9: { id: 's4_04_9', spanish: 'Tomá tu tiempo.', korean: '시간을 가져.', english: 'Take your time.', chinese: '慢慢来。', pronunciation: 'to-MÁ tu TIEM-po', tags: ['연습', '속도'], difficulty: 1 },
  s4_04_10: { id: 's4_04_10', spanish: 'Así, con calma.', korean: '그래, 차분하게.', english: 'Like that, calmly.', chinese: '就这样，冷静地。', pronunciation: 'a-SÍ, kon KAL-ma', tags: ['연습', '피드백'], difficulty: 1 },

  // ----- L4-05~12: 나머지 8레슨 (각 7문장) -----

  // L4-05: 느낌이 안 와요
  s4_05_4: { id: 's4_05_4', spanish: 'No me sale.', korean: '안 돼.', english: "I can't do it.", chinese: '我做不到。', pronunciation: 'no me SA-le', tags: ['연습', '감각'], difficulty: 1 },
  s4_05_5: { id: 's4_05_5', spanish: 'No sé qué estoy haciendo mal.', korean: '뭘 잘못하는지 모르겠어.', english: "I don't know what I'm doing wrong.", chinese: '我不知道我哪里做错了。', pronunciation: 'no SÉ ke es-TOI a-SIEN-do MAL', tags: ['연습', '감각'], difficulty: 3 },
  s4_05_6: { id: 's4_05_6', spanish: 'Necesito ayuda.', korean: '도움이 필요해.', english: 'I need help.', chinese: '我需要帮助。', pronunciation: 'ne-se-SI-to a-YU-da', tags: ['연습', '요청'], difficulty: 2 },
  s4_05_7: { id: 's4_05_7', spanish: 'Hacelo vos primero.', korean: '먼저 해봐줘.', english: 'You do it first.', chinese: '你先做。', pronunciation: 'a-SE-lo VOS pri-ME-ro', tags: ['연습', '요청'], difficulty: 2 },
  s4_05_8: { id: 's4_05_8', spanish: 'Ahora sí lo siento.', korean: '이제 느껴져.', english: 'Now I feel it.', chinese: '现在我感觉到了。', pronunciation: 'a-O-ra SÍ lo SIEN-to', tags: ['연습', '감각'], difficulty: 2 },
  s4_05_9: { id: 's4_05_9', spanish: 'Ya lo tengo.', korean: '이제 됐어.', english: 'I got it now.', chinese: '我现在会了。', pronunciation: 'ya lo TEN-go', tags: ['연습', '감각'], difficulty: 1 },
  s4_05_10: { id: 's4_05_10', spanish: 'Es cuestión de práctica.', korean: '연습의 문제야.', english: "It's a matter of practice.", chinese: '这是练习的问题。', pronunciation: 'es kues-TIÓN de PRÁK-ti-ka', tags: ['연습', '정서'], difficulty: 3 },

  // L4-06: 연결이 끊겼어요
  s4_06_4: { id: 's4_06_4', spanish: 'Nos desconectamos.', korean: '연결이 끊겼어.', english: 'We disconnected.', chinese: '我们断开了。', pronunciation: 'nos des-ko-nek-TA-mos', tags: ['연습', '연결'], difficulty: 2 },
  s4_06_5: { id: 's4_06_5', spanish: 'Volvamos a conectar.', korean: '다시 연결하자.', english: "Let's reconnect.", chinese: '我们重新连接。', pronunciation: 'vol-VA-mos a ko-nek-TAR', tags: ['연습', '연결'], difficulty: 2 },
  s4_06_6: { id: 's4_06_6', spanish: 'Sentí mi pecho.', korean: '내 가슴을 느껴.', english: 'Feel my chest.', chinese: '感受我的胸。', pronunciation: 'sen-TÍ mi PE-cho', tags: ['연습', '연결'], difficulty: 2 },
  s4_06_7: { id: 's4_06_7', spanish: 'Ahí, justo ahí.', korean: '거기, 딱 거기.', english: 'There, right there.', chinese: '那里，就是那里。', pronunciation: 'a-Í, HUS-to a-Í', tags: ['연습', '연결'], difficulty: 1 },
  s4_06_8: { id: 's4_06_8', spanish: 'No te alejes.', korean: '멀어지지 마.', english: "Don't go far.", chinese: '不要走远。', pronunciation: 'no te a-LE-hes', tags: ['연습', '연결', '교정'], difficulty: 2 },
  s4_06_9: { id: 's4_06_9', spanish: 'Acá estoy.', korean: '여기 있어.', english: "I'm here.", chinese: '我在这里。', pronunciation: 'a-KÁ es-TOI', tags: ['연습', '연결', '정서'], difficulty: 1 },
  s4_06_10: { id: 's4_06_10', spanish: 'Ahora sí, te siento.', korean: '이제 느껴져.', english: 'Now I feel you.', chinese: '现在我感受到你了。', pronunciation: 'a-O-ra SÍ, te SIEN-to', tags: ['연습', '연결'], difficulty: 2 },

  // L4-07: 타이밍
  s4_07_4: { id: 's4_07_4', spanish: 'Llegaste tarde.', korean: '너무 늦게 왔어.', english: 'You came in late.', chinese: '你来晚了。', pronunciation: 'ye-GAS-te TAR-de', tags: ['연습', '타이밍'], difficulty: 2 },
  s4_07_5: { id: 's4_07_5', spanish: 'El timing es todo.', korean: '타이밍이 전부야.', english: 'Timing is everything.', chinese: '时机就是一切。', pronunciation: 'el TAI-ming es TO-do', tags: ['연습', '타이밍'], difficulty: 2 },
  s4_07_6: { id: 's4_07_6', spanish: 'Esperá el momento exacto.', korean: '정확한 순간을 기다려.', english: 'Wait for the exact moment.', chinese: '等待准确的时刻。', pronunciation: 'es-pe-RÁ el mo-MEN-to ek-SAK-to', tags: ['연습', '타이밍'], difficulty: 3 },
  s4_07_7: { id: 's4_07_7', spanish: 'Ni antes ni después.', korean: '빨라도 안 되고 늦어도 안 돼.', english: 'Neither before nor after.', chinese: '不早也不晚。', pronunciation: 'ni AN-tes ni des-PUÉS', tags: ['연습', '타이밍'], difficulty: 2 },
  s4_07_8: { id: 's4_07_8', spanish: 'Escuchá y después mové.', korean: '듣고 나서 움직여.', english: 'Listen and then move.', chinese: '先听再动。', pronunciation: 'es-ku-CHÁ i des-PUÉS mo-VÉ', tags: ['연습', '타이밍'], difficulty: 2 },
  s4_07_9: { id: 's4_07_9', spanish: 'Paciencia.', korean: '인내심.', english: 'Patience.', chinese: '耐心。', pronunciation: 'pa-SIEN-sia', tags: ['연습', '타이밍', '정서'], difficulty: 1 },
  s4_07_10: { id: 's4_07_10', spanish: 'Justo a tiempo.', korean: '딱 맞는 타이밍.', english: 'Just in time.', chinese: '恰好准时。', pronunciation: 'HUS-to a TIEM-po', tags: ['연습', '피드백'], difficulty: 1 },

  // L4-08: 감정 표현
  s4_08_4: { id: 's4_08_4', spanish: 'Me da vergüenza.', korean: '부끄러워.', english: "I'm embarrassed.", chinese: '我很害羞。', pronunciation: 'me da ver-GÜEN-sa', tags: ['연습', '감정'], difficulty: 2 },
  s4_08_5: { id: 's4_08_5', spanish: 'No te preocupes, es normal.', korean: '걱정 마, 정상이야.', english: "Don't worry, it's normal.", chinese: '别担心，这是正常的。', pronunciation: 'no te pre-o-KU-pes, es nor-MAL', tags: ['연습', '감정'], difficulty: 2 },
  s4_08_6: { id: 's4_08_6', spanish: 'Me encantó.', korean: '너무 좋았어.', english: 'I loved it.', chinese: '我非常喜欢。', pronunciation: 'me en-kan-TÓ', tags: ['연습', '감정'], difficulty: 1 },
  s4_08_7: { id: 's4_08_7', spanish: 'Estoy contento/a.', korean: '기뻐.', english: "I'm happy.", chinese: '我很开心。', pronunciation: 'es-TOI kon-TEN-to', tags: ['연습', '감정'], difficulty: 1 },
  s4_08_8: { id: 's4_08_8', spanish: 'Hoy fue un buen día.', korean: '오늘 좋은 날이었어.', english: 'Today was a good day.', chinese: '今天是美好的一天。', pronunciation: 'OI fue un BUEN DÍ-a', tags: ['연습', '감정'], difficulty: 2 },
  s4_08_9: { id: 's4_08_9', spanish: 'Me frustré un poco.', korean: '좀 답답했어.', english: 'I got a bit frustrated.', chinese: '我有点沮丧。', pronunciation: 'me frus-TRÉ un PO-ko', tags: ['연습', '감정'], difficulty: 2 },
  s4_08_10: { id: 's4_08_10', spanish: 'Pero valió la pena.', korean: '근데 가치 있었어.', english: 'But it was worth it.', chinese: '但值得。', pronunciation: 'PE-ro va-LIÓ la PE-na', tags: ['연습', '감정'], difficulty: 3 },

  // L4-09: 서로 피드백
  s4_09_4: { id: 's4_09_4', spanish: 'Fue cómodo.', korean: '편했어.', english: 'It was comfortable.', chinese: '很舒服。', pronunciation: 'fue KÓ-mo-do', tags: ['연습', '피드백'], difficulty: 1 },
  s4_09_5: { id: 's4_09_5', spanish: 'Me gustó mucho.', korean: '정말 좋았어.', english: 'I liked it a lot.', chinese: '我很喜欢。', pronunciation: 'me gus-TÓ MU-cho', tags: ['연습', '피드백'], difficulty: 1 },
  s4_09_6: { id: 's4_09_6', spanish: 'Tu abrazo mejoró.', korean: '아브라소가 나아졌어.', english: 'Your embrace improved.', chinese: '你的拥抱进步了。', pronunciation: 'tu a-BRA-so me-ho-RÓ', tags: ['연습', '피드백'], difficulty: 2 },
  s4_09_7: { id: 's4_09_7', spanish: 'Sentí más conexión hoy.', korean: '오늘 연결이 더 느껴졌어.', english: 'I felt more connection today.', chinese: '今天感觉到了更多连接。', pronunciation: 'sen-TÍ más ko-nek-SIÓN OI', tags: ['연습', '피드백'], difficulty: 2 },
  s4_09_8: { id: 's4_09_8', spanish: '¿Qué sentiste vos?', korean: '너는 뭘 느꼈어?', english: 'What did you feel?', chinese: '你感觉到了什么？', pronunciation: 'KÉ sen-TIS-te VOS?', tags: ['연습', '피드백'], difficulty: 2 },
  s4_09_9: { id: 's4_09_9', spanish: 'Quiero mejorar esto.', korean: '이걸 개선하고 싶어.', english: 'I want to improve this.', chinese: '我想改进这个。', pronunciation: 'KIE-ro me-ho-RAR ES-to', tags: ['연습', '피드백'], difficulty: 2 },
  s4_09_10: { id: 's4_09_10', spanish: 'Gracias por el feedback.', korean: '피드백 고마워.', english: 'Thanks for the feedback.', chinese: '谢谢反馈。', pronunciation: 'GRA-sias por el FID-bak', tags: ['연습', '피드백'], difficulty: 1 },

  // L4-10: 진전 대화
  s4_10_4: { id: 's4_10_4', spanish: '¿Te acordás cómo era antes?', korean: '전에 어땠는지 기억나?', english: 'Do you remember how it was before?', chinese: '你还记得以前是怎样吗？', pronunciation: 'te a-kor-DÁS KÓ-mo E-ra AN-tes?', tags: ['연습', '동기부여'], difficulty: 3 },
  s4_10_5: { id: 's4_10_5', spanish: 'Mirá cuánto avanzamos.', korean: '우리 얼마나 발전했는지 봐.', english: "Look how much we've progressed.", chinese: '看看我们进步了多少。', pronunciation: 'mi-RÁ KUÁN-to a-van-SA-mos', tags: ['연습', '동기부여'], difficulty: 3 },
  s4_10_6: { id: 's4_10_6', spanish: 'Esto ya me sale.', korean: '이건 이제 돼.', english: 'I can do this now.', chinese: '这个我现在会了。', pronunciation: 'ES-to ya me SA-le', tags: ['연습', '동기부여'], difficulty: 2 },
  s4_10_7: { id: 's4_10_7', spanish: 'Falta mucho todavía.', korean: '아직 멀었어.', english: "There's still a long way.", chinese: '还有很长的路。', pronunciation: 'FAL-ta MU-cho to-da-VÍ-a', tags: ['연습', '동기부여'], difficulty: 2 },
  s4_10_8: { id: 's4_10_8', spanish: 'Pero eso está bien.', korean: '근데 그래도 괜찮아.', english: "But that's okay.", chinese: '但那没关系。', pronunciation: 'PE-ro E-so es-TÁ BIEN', tags: ['연습', '동기부여', '정서'], difficulty: 2 },
  s4_10_9: { id: 's4_10_9', spanish: 'El tango es un camino largo.', korean: '탱고는 긴 여정이야.', english: 'Tango is a long journey.', chinese: '探戈是一段漫长的旅程。', pronunciation: 'el TAN-go es un ka-MI-no LAR-go', tags: ['연습', '동기부여'], difficulty: 3 },
  s4_10_10: { id: 's4_10_10', spanish: 'Y lo estamos caminando juntos.', korean: '그리고 우리 같이 걷고 있어.', english: "And we're walking it together.", chinese: '我们正在一起走。', pronunciation: 'i lo es-TA-mos ka-mi-NAN-do HUN-tos', tags: ['연습', '동기부여', '정서'], difficulty: 3 },

  // L4-11: 파트너 교체 인사
  s4_11_4: { id: 's4_11_4', spanish: 'Gracias, aprendí mucho.', korean: '고마워, 많이 배웠어.', english: 'Thanks, I learned a lot.', chinese: '谢谢，我学到了很多。', pronunciation: 'GRA-sias, a-pren-DÍ MU-cho', tags: ['수업', '교체'], difficulty: 2 },
  s4_11_5: { id: 's4_11_5', spanish: 'Sos muy buena pareja.', korean: '너 좋은 파트너야.', english: "You're a great partner.", chinese: '你是很好的搭档。', pronunciation: 'SOS mui BUE-na pa-RE-ha', tags: ['수업', '교체'], difficulty: 2 },
  s4_11_6: { id: 's4_11_6', spanish: 'Ojalá bailemos de nuevo.', korean: '다시 같이 추면 좋겠다.', english: 'I hope we dance again.', chinese: '希望我们再跳一次。', pronunciation: 'o-ha-LÁ bai-LE-mos de NUE-vo', tags: ['수업', '교체'], difficulty: 3 },
  s4_11_7: { id: 's4_11_7', spanish: 'Fue muy lindo.', korean: '너무 좋았어.', english: 'It was very nice.', chinese: '非常棒。', pronunciation: 'fue mui LIN-do', tags: ['수업', '교체'], difficulty: 1 },
  s4_11_8: { id: 's4_11_8', spanish: 'Me encantó tu energía.', korean: '너의 에너지가 좋았어.', english: 'I loved your energy.', chinese: '我喜欢你的能量。', pronunciation: 'me en-kan-TÓ tu e-ner-HÍ-a', tags: ['수업', '교체'], difficulty: 2 },
  s4_11_9: { id: 's4_11_9', spanish: 'Hasta la próxima.', korean: '다음에 봐요.', english: 'Until next time.', chinese: '下次见。', pronunciation: 'AS-ta la PROK-si-ma', tags: ['수업', '교체', '인사'], difficulty: 1 },
  s4_11_10: { id: 's4_11_10', spanish: 'Chau, gracias.', korean: '안녕, 고마워.', english: 'Bye, thanks.', chinese: '再见，谢谢。', pronunciation: 'CHAU, GRA-sias', tags: ['수업', '인사'], difficulty: 1 },

  // L4-12: 연습 역할극
  s4_12_4: { id: 's4_12_4', spanish: '¿Cómo te sentiste?', korean: '어땠어?', english: 'How did you feel?', chinese: '你感觉怎么样？', pronunciation: 'KÓ-mo te sen-TIS-te?', tags: ['연습', '역할극'], difficulty: 2 },
  s4_12_5: { id: 's4_12_5', spanish: 'Bien, cada vez más seguro.', korean: '좋아, 점점 자신감 생겨.', english: 'Good, more and more confident.', chinese: '好，越来越自信了。', pronunciation: 'BIEN, KA-da VES más se-GU-ro', tags: ['연습', '역할극'], difficulty: 2 },
  s4_12_6: { id: 's4_12_6', spanish: '¿Qué fue lo mejor?', korean: '뭐가 제일 좋았어?', english: 'What was the best part?', chinese: '最好的是什么？', pronunciation: 'KÉ fue lo me-HOR?', tags: ['연습', '역할극'], difficulty: 2 },
  s4_12_7: { id: 's4_12_7', spanish: 'La conexión fue lo mejor.', korean: '연결이 제일 좋았어.', english: 'The connection was the best.', chinese: '连接是最好的。', pronunciation: 'la ko-nek-SIÓN fue lo me-HOR', tags: ['연습', '역할극'], difficulty: 2 },
  s4_12_8: { id: 's4_12_8', spanish: 'Mañana seguimos.', korean: '내일 계속하자.', english: "Tomorrow we continue.", chinese: '明天继续。', pronunciation: 'ma-ÑA-na se-GI-mos', tags: ['연습', '역할극'], difficulty: 1 },
  s4_12_9: { id: 's4_12_9', spanish: 'Sí, con ganas.', korean: '응, 기대돼.', english: 'Yes, looking forward to it.', chinese: '是的，很期待。', pronunciation: 'SÍ, kon GA-nas', tags: ['연습', '역할극'], difficulty: 1 },
  s4_12_10: { id: 's4_12_10', spanish: 'Nos vemos mañana.', korean: '내일 봐.', english: 'See you tomorrow.', chinese: '明天见。', pronunciation: 'nos VE-mos ma-ÑA-na', tags: ['연습', '인사'], difficulty: 1 },
};
