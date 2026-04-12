import { Sentence } from '../types';

/**
 * Level 1 확장 문장 — 레슨당 기존 3개에 7개 추가 = 총 10개
 * ID 규칙: s1_XX_4 ~ s1_XX_10
 */
export const sentencesL1Extra: Record<string, Sentence> = {

  // ----- Lesson 1: 첫 인사 (추가 7개) -----
  s1_01_4: { id: 's1_01_4', spanish: '¿Cómo estás?', korean: '어떻게 지내?', english: 'How are you?', chinese: '你好吗？', pronunciation: 'KÓ-mo es-TÁS?', tags: ['인사'], difficulty: 1 },
  s1_01_5: { id: 's1_01_5', spanish: 'Bien, ¿y vos?', korean: '잘 지내, 너는?', english: 'Good, and you?', chinese: '我很好，你呢？', pronunciation: 'BIEN, i VOS?', tags: ['인사'], difficulty: 1 },
  s1_01_6: { id: 's1_01_6', spanish: 'Bienvenidos a la clase.', korean: '수업에 오신 걸 환영해요.', english: 'Welcome to the class.', chinese: '欢迎来上课。', pronunciation: 'bien-ve-NI-dos a la KLA-se', tags: ['인사', '수업'], difficulty: 1 },
  s1_01_7: { id: 's1_01_7', spanish: 'Mucho gusto.', korean: '반가워요.', english: 'Nice to meet you.', chinese: '很高兴认识你。', pronunciation: 'MU-cho GUS-to', tags: ['인사'], difficulty: 1 },
  s1_01_8: { id: 's1_01_8', spanish: 'Empezamos.', korean: '시작하자.', english: "Let's begin.", chinese: '我们开始吧。', pronunciation: 'em-pe-SA-mos', tags: ['수업'], difficulty: 1 },
  s1_01_9: { id: 's1_01_9', spanish: '¿Listos?', korean: '준비됐어?', english: 'Ready?', chinese: '准备好了吗？', pronunciation: 'LIS-tos?', tags: ['수업'], difficulty: 1 },
  s1_01_10: { id: 's1_01_10', spanish: 'Sí, estamos listos.', korean: '네, 준비됐어요.', english: "Yes, we're ready.", chinese: '是的，我们准备好了。', pronunciation: 'SÍ, es-TA-mos LIS-tos', tags: ['수업'], difficulty: 1 },

  // ----- Lesson 2: 얼굴과 시선 (추가 7개) -----
  s1_02_4: { id: 's1_02_4', spanish: 'No bajes la mirada.', korean: '시선을 내리지 마.', english: "Don't lower your gaze.", chinese: '不要低下目光。', pronunciation: 'no BA-hes la mi-RA-da', tags: ['수업', '시선'], difficulty: 2 },
  s1_02_5: { id: 's1_02_5', spanish: 'Mirá a tu pareja.', korean: '파트너를 봐.', english: 'Look at your partner.', chinese: '看你的搭档。', pronunciation: 'mi-RÁ a tu pa-RE-ha', tags: ['수업', '시선'], difficulty: 1 },
  s1_02_6: { id: 's1_02_6', spanish: 'Los ojos son importantes.', korean: '눈이 중요해.', english: 'The eyes are important.', chinese: '眼睛很重要。', pronunciation: 'los O-hos son im-por-TAN-tes', tags: ['수업', '시선'], difficulty: 2 },
  s1_02_7: { id: 's1_02_7', spanish: 'No cierres los ojos.', korean: '눈 감지 마.', english: "Don't close your eyes.", chinese: '不要闭上眼睛。', pronunciation: 'no SIE-rres los O-hos', tags: ['수업', '시선', '교정'], difficulty: 2 },
  s1_02_8: { id: 's1_02_8', spanish: 'Abrí los ojos.', korean: '눈을 떠.', english: 'Open your eyes.', chinese: '睁开眼睛。', pronunciation: 'a-BRÍ los O-hos', tags: ['수업', '시선'], difficulty: 1 },
  s1_02_9: { id: 's1_02_9', spanish: 'La expresión es suave.', korean: '표정은 부드럽게.', english: 'The expression is soft.', chinese: '表情是柔和的。', pronunciation: 'la ek-pre-SIÓN es SUA-ve', tags: ['수업', '얼굴'], difficulty: 2 },
  s1_02_10: { id: 's1_02_10', spanish: 'Sonreí un poco.', korean: '살짝 미소 지어.', english: 'Smile a little.', chinese: '微微笑一下。', pronunciation: 'son-re-Í un PO-ko', tags: ['수업', '얼굴', '정서'], difficulty: 1 },

  // ----- Lesson 3: 어깨와 목 (추가 7개) -----
  s1_03_4: { id: 's1_03_4', spanish: 'Soltá los hombros.', korean: '어깨를 놓아.', english: 'Release your shoulders.', chinese: '放开肩膀。', pronunciation: 'sol-TÁ los OM-bros', tags: ['수업', '어깨'], difficulty: 1 },
  s1_03_5: { id: 's1_03_5', spanish: 'No levantes los hombros.', korean: '어깨 올리지 마.', english: "Don't raise your shoulders.", chinese: '不要耸肩。', pronunciation: 'no le-VAN-tes los OM-bros', tags: ['수업', '어깨', '교정'], difficulty: 2 },
  s1_03_6: { id: 's1_03_6', spanish: 'El cuello largo.', korean: '목은 길게.', english: 'Long neck.', chinese: '脖子伸长。', pronunciation: 'el KUE-yo LAR-go', tags: ['수업', '목'], difficulty: 1 },
  s1_03_7: { id: 's1_03_7', spanish: 'Mantené la cabeza arriba.', korean: '머리를 위로 유지해.', english: 'Keep your head up.', chinese: '保持头部向上。', pronunciation: 'man-te-NÉ la ka-BE-sa a-RRI-ba', tags: ['수업', '머리'], difficulty: 2 },
  s1_03_8: { id: 's1_03_8', spanish: 'No inclines la cabeza.', korean: '머리 기울이지 마.', english: "Don't tilt your head.", chinese: '不要歪头。', pronunciation: 'no in-KLI-nes la ka-BE-sa', tags: ['수업', '머리', '교정'], difficulty: 2 },
  s1_03_9: { id: 's1_03_9', spanish: 'Abrí el pecho.', korean: '가슴 열어.', english: 'Open your chest.', chinese: '打开胸腔。', pronunciation: 'a-BRÍ el PE-cho', tags: ['수업', '가슴'], difficulty: 1 },
  s1_03_10: { id: 's1_03_10', spanish: 'Espalda recta.', korean: '등은 곧게.', english: 'Straight back.', chinese: '背挺直。', pronunciation: 'es-PAL-da REK-ta', tags: ['수업', '등'], difficulty: 1 },

  // ----- Lesson 4: 팔과 손의 연결 (추가 7개) -----
  s1_04_4: { id: 's1_04_4', spanish: 'Aflojá los brazos.', korean: '팔 힘 풀어.', english: 'Loosen your arms.', chinese: '放松手臂。', pronunciation: 'a-flo-HÁ los BRA-sos', tags: ['수업', '팔'], difficulty: 1 },
  s1_04_5: { id: 's1_04_5', spanish: 'No agarres fuerte.', korean: '세게 잡지 마.', english: "Don't grip hard.", chinese: '不要抓得太紧。', pronunciation: 'no a-GA-rres FUER-te', tags: ['수업', '손', '교정'], difficulty: 2 },
  s1_04_6: { id: 's1_04_6', spanish: 'La mano izquierda acá.', korean: '왼손은 여기.', english: 'Left hand here.', chinese: '左手放这里。', pronunciation: 'la MA-no is-KIER-da a-KÁ', tags: ['수업', '손'], difficulty: 2 },
  s1_04_7: { id: 's1_04_7', spanish: 'La mano derecha acá.', korean: '오른손은 여기.', english: 'Right hand here.', chinese: '右手放这里。', pronunciation: 'la MA-no de-RE-cha a-KÁ', tags: ['수업', '손'], difficulty: 2 },
  s1_04_8: { id: 's1_04_8', spanish: 'Mantené el contacto.', korean: '접촉을 유지해.', english: 'Keep the contact.', chinese: '保持接触。', pronunciation: 'man-te-NÉ el kon-TAK-to', tags: ['수업', '연결'], difficulty: 2 },
  s1_04_9: { id: 's1_04_9', spanish: 'No sueltes la mano.', korean: '손 놓지 마.', english: "Don't let go of the hand.", chinese: '不要放开手。', pronunciation: 'no SUEL-tes la MA-no', tags: ['수업', '손', '교정'], difficulty: 2 },
  s1_04_10: { id: 's1_04_10', spanish: 'Livianito.', korean: '가볍게.', english: 'Lightly.', chinese: '轻轻地。', pronunciation: 'li-via-NI-to', tags: ['수업', '피드백'], difficulty: 1 },

  // ----- Lesson 5: 힘 빼기와 호흡 (추가 7개) -----
  s1_05_4: { id: 's1_05_4', spanish: 'Soltá todo.', korean: '다 풀어.', english: 'Let go of everything.', chinese: '全部放松。', pronunciation: 'sol-TÁ TO-do', tags: ['수업', '이완'], difficulty: 1 },
  s1_05_5: { id: 's1_05_5', spanish: 'Aflojá el cuerpo.', korean: '몸 힘 풀어.', english: 'Loosen your body.', chinese: '放松身体。', pronunciation: 'a-flo-HÁ el KUER-po', tags: ['수업', '이완'], difficulty: 1 },
  s1_05_6: { id: 's1_05_6', spanish: 'Inhalá.', korean: '들이쉬어.', english: 'Breathe in.', chinese: '吸气。', pronunciation: 'in-a-LÁ', tags: ['수업', '호흡'], difficulty: 1 },
  s1_05_7: { id: 's1_05_7', spanish: 'Exhalá.', korean: '내쉬어.', english: 'Breathe out.', chinese: '呼气。', pronunciation: 'ek-sa-LÁ', tags: ['수업', '호흡'], difficulty: 1 },
  s1_05_8: { id: 's1_05_8', spanish: 'No tengas miedo.', korean: '무서워하지 마.', english: "Don't be afraid.", chinese: '不要害怕。', pronunciation: 'no TEN-gas MIE-do', tags: ['수업', '정서'], difficulty: 2 },
  s1_05_9: { id: 's1_05_9', spanish: 'Está todo bien.', korean: '다 괜찮아.', english: "Everything's fine.", chinese: '一切都好。', pronunciation: 'es-TÁ TO-do BIEN', tags: ['수업', '정서'], difficulty: 1 },
  s1_05_10: { id: 's1_05_10', spanish: 'Disfrutá.', korean: '즐겨.', english: 'Enjoy.', chinese: '享受。', pronunciation: 'dis-fru-TÁ', tags: ['수업', '정서'], difficulty: 1 },

  // ----- Lesson 6: 중심과 축 (추가 7개) -----
  s1_06_4: { id: 's1_06_4', spanish: 'El peso en el medio.', korean: '무게는 가운데에.', english: 'Weight in the middle.', chinese: '重心在中间。', pronunciation: 'el PE-so en el ME-dio', tags: ['수업', '축'], difficulty: 2 },
  s1_06_5: { id: 's1_06_5', spanish: 'No te caigas.', korean: '넘어지지 마.', english: "Don't fall.", chinese: '不要摔倒。', pronunciation: 'no te KAI-gas', tags: ['수업', '축', '교정'], difficulty: 1 },
  s1_06_6: { id: 's1_06_6', spanish: 'Quedate arriba.', korean: '위에 머물러.', english: 'Stay up.', chinese: '保持在上面。', pronunciation: 'ke-DA-te a-RRI-ba', tags: ['수업', '축'], difficulty: 2 },
  s1_06_7: { id: 's1_06_7', spanish: 'Desde la cintura para arriba, quieto.', korean: '허리 위로는 조용히.', english: 'From the waist up, still.', chinese: '腰以上保持不动。', pronunciation: 'DES-de la sin-TU-ra pa-ra a-RRI-ba, KIE-to', tags: ['수업', '축'], difficulty: 3 },
  s1_06_8: { id: 's1_06_8', spanish: 'Sentí el piso.', korean: '바닥을 느껴.', english: 'Feel the floor.', chinese: '感受地板。', pronunciation: 'sen-TÍ el PI-so', tags: ['수업', '감각'], difficulty: 1 },
  s1_06_9: { id: 's1_06_9', spanish: 'Apoyá bien los pies.', korean: '발을 제대로 딛어.', english: 'Plant your feet well.', chinese: '好好踩稳脚。', pronunciation: 'a-po-YÁ BIEN los PIES', tags: ['수업', '발'], difficulty: 2 },
  s1_06_10: { id: 's1_06_10', spanish: 'Imaginá una línea vertical.', korean: '수직선을 상상해.', english: 'Imagine a vertical line.', chinese: '想象一条垂直线。', pronunciation: 'i-ma-hi-NÁ U-na LÍ-ne-a ver-ti-KAL', tags: ['수업', '축'], difficulty: 3 },

  // ----- Lesson 7: 체중 이동 (추가 7개) -----
  s1_07_4: { id: 's1_07_4', spanish: 'Todo el peso a una pierna.', korean: '무게를 한쪽 다리로.', english: 'All the weight on one leg.', chinese: '所有重心到一条腿。', pronunciation: 'TO-do el PE-so a U-na PIER-na', tags: ['수업', '체중'], difficulty: 2 },
  s1_07_5: { id: 's1_07_5', spanish: 'La otra pierna queda libre.', korean: '다른 다리는 자유롭게.', english: 'The other leg stays free.', chinese: '另一条腿保持自由。', pronunciation: 'la O-tra PIER-na KE-da LI-bre', tags: ['수업', '체중'], difficulty: 2 },
  s1_07_6: { id: 's1_07_6', spanish: 'No te quedes a mitad.', korean: '중간에 걸치지 마.', english: "Don't stay in the middle.", chinese: '不要停在中间。', pronunciation: 'no te KE-des a mi-TAD', tags: ['수업', '체중', '교정'], difficulty: 2 },
  s1_07_7: { id: 's1_07_7', spanish: 'Pasá completamente.', korean: '완전히 넘겨.', english: 'Transfer completely.', chinese: '完全转移。', pronunciation: 'pa-SÁ kom-ple-ta-MEN-te', tags: ['수업', '체중'], difficulty: 2 },
  s1_07_8: { id: 's1_07_8', spanish: 'Sentí el cambio.', korean: '변화를 느껴.', english: 'Feel the change.', chinese: '感受变化。', pronunciation: 'sen-TÍ el KAM-bio', tags: ['수업', '감각'], difficulty: 2 },
  s1_07_9: { id: 's1_07_9', spanish: 'Despacio, sin apuro.', korean: '천천히, 서두르지 않고.', english: 'Slowly, without rushing.', chinese: '慢慢来，不要急。', pronunciation: 'des-PA-sio, sin a-PU-ro', tags: ['수업', '속도'], difficulty: 1 },
  s1_07_10: { id: 's1_07_10', spanish: 'Muy bien, así.', korean: '아주 좋아, 그렇게.', english: 'Very good, like that.', chinese: '非常好，就这样。', pronunciation: 'mui BIEN, a-SÍ', tags: ['수업', '피드백'], difficulty: 1 },

  // ----- Lesson 8: 아브라소 (추가 7개) -----
  s1_08_4: { id: 's1_08_4', spanish: 'Acercá el pecho.', korean: '가슴을 가까이.', english: 'Bring your chest closer.', chinese: '把胸靠近。', pronunciation: 'a-ser-KÁ el PE-cho', tags: ['수업', '아브라소'], difficulty: 2 },
  s1_08_5: { id: 's1_08_5', spanish: 'Mantené la distancia.', korean: '거리를 유지해.', english: 'Keep the distance.', chinese: '保持距离。', pronunciation: 'man-te-NÉ la dis-TAN-sia', tags: ['수업', '아브라소'], difficulty: 2 },
  s1_08_6: { id: 's1_08_6', spanish: 'El abrazo no es agarrar.', korean: '아브라소는 잡는 게 아니야.', english: "The embrace isn't grabbing.", chinese: '拥抱不是抓。', pronunciation: 'el a-BRA-so no es a-ga-RRAR', tags: ['수업', '아브라소'], difficulty: 2 },
  s1_08_7: { id: 's1_08_7', spanish: 'Es un abrazo, no una lucha.', korean: '포옹이지, 싸움이 아니야.', english: "It's an embrace, not a fight.", chinese: '这是拥抱，不是打架。', pronunciation: 'es un a-BRA-so, no U-na LU-cha', tags: ['수업', '아브라소', '유머'], difficulty: 2 },
  s1_08_8: { id: 's1_08_8', spanish: 'Rodeá con el brazo.', korean: '팔로 감싸.', english: 'Wrap with your arm.', chinese: '用手臂环绕。', pronunciation: 'ro-de-Á kon el BRA-so', tags: ['수업', '아브라소'], difficulty: 2 },
  s1_08_9: { id: 's1_08_9', spanish: 'La mano en la espalda.', korean: '손은 등에.', english: 'Hand on the back.', chinese: '手放在背上。', pronunciation: 'la MA-no en la es-PAL-da', tags: ['수업', '아브라소'], difficulty: 1 },
  s1_08_10: { id: 's1_08_10', spanish: '¿Estás cómoda así?', korean: '이렇게 하면 편해?', english: 'Are you comfortable like this?', chinese: '这样舒服吗？', pronunciation: 'es-TÁS KÓ-mo-da a-SÍ?', tags: ['수업', '아브라소', '배려'], difficulty: 2 },

  // ----- Lesson 9: 연결 느끼기 (추가 7개) -----
  s1_09_4: { id: 's1_09_4', spanish: 'Escuchá el cuerpo del otro.', korean: '상대의 몸을 들어.', english: "Listen to the other's body.", chinese: '倾听对方的身体。', pronunciation: 'es-ku-CHÁ el KUER-po del O-tro', tags: ['수업', '연결'], difficulty: 3 },
  s1_09_5: { id: 's1_09_5', spanish: 'No pienses, sentí.', korean: '생각하지 말고, 느껴.', english: "Don't think, feel.", chinese: '不要想，去感受。', pronunciation: 'no PIEN-ses, sen-TÍ', tags: ['수업', '연결', '정서'], difficulty: 2 },
  s1_09_6: { id: 's1_09_6', spanish: 'Estamos juntos.', korean: '우리 함께야.', english: "We're together.", chinese: '我们在一起。', pronunciation: 'es-TA-mos HUN-tos', tags: ['수업', '연결'], difficulty: 1 },
  s1_09_7: { id: 's1_09_7', spanish: 'No te apures, yo te espero.', korean: '서두르지 마, 기다릴게.', english: "Don't rush, I'll wait for you.", chinese: '不要急，我等你。', pronunciation: 'no te a-PU-res, yo te es-PE-ro', tags: ['수업', '연결', '정서'], difficulty: 2 },
  s1_09_8: { id: 's1_09_8', spanish: 'Seguí conmigo.', korean: '나한테 따라와.', english: 'Follow me.', chinese: '跟着我。', pronunciation: 'se-GÍ kon-MI-go', tags: ['수업', '연결'], difficulty: 1 },
  s1_09_9: { id: 's1_09_9', spanish: 'Respiremos juntos.', korean: '같이 숨 쉬자.', english: "Let's breathe together.", chinese: '我们一起呼吸。', pronunciation: 'res-pi-RE-mos HUN-tos', tags: ['수업', '연결', '호흡'], difficulty: 2 },
  s1_09_10: { id: 's1_09_10', spanish: 'Ahí está la conexión.', korean: '그게 연결이야.', english: "That's the connection.", chinese: '那就是连接。', pronunciation: 'a-Í es-TÁ la ko-nek-SIÓN', tags: ['수업', '연결'], difficulty: 2 },

  // ----- Lesson 10: 첫 수업 역할극 (추가 7개) -----
  s1_10_4: { id: 's1_10_4', spanish: '¿Entendiste?', korean: '이해했어?', english: 'Did you understand?', chinese: '你明白了吗？', pronunciation: 'en-ten-DIS-te?', tags: ['수업', '피드백'], difficulty: 1 },
  s1_10_5: { id: 's1_10_5', spanish: 'Sí, creo que sí.', korean: '응, 그런 것 같아.', english: 'Yes, I think so.', chinese: '是的，我想是的。', pronunciation: 'SÍ, KRE-o ke SÍ', tags: ['수업', '피드백'], difficulty: 2 },
  s1_10_6: { id: 's1_10_6', spanish: 'Perfecto.', korean: '완벽해.', english: 'Perfect.', chinese: '完美。', pronunciation: 'per-FEK-to', tags: ['수업', '피드백'], difficulty: 1 },
  s1_10_7: { id: 's1_10_7', spanish: 'Muy bien.', korean: '아주 좋아.', english: 'Very good.', chinese: '非常好。', pronunciation: 'mui BIEN', tags: ['수업', '피드백'], difficulty: 1 },
  s1_10_8: { id: 's1_10_8', spanish: 'Vamos de nuevo.', korean: '다시 하자.', english: "Let's go again.", chinese: '我们再来。', pronunciation: 'VA-mos de NUE-vo', tags: ['수업', '피드백'], difficulty: 1 },
  s1_10_9: { id: 's1_10_9', spanish: 'Lo estás haciendo bien.', korean: '잘 하고 있어.', english: "You're doing well.", chinese: '你做得很好。', pronunciation: 'lo es-TÁS a-SIEN-do BIEN', tags: ['수업', '피드백', '격려'], difficulty: 2 },
  s1_10_10: { id: 's1_10_10', spanish: 'Nos vemos la próxima clase.', korean: '다음 수업에 봐요.', english: 'See you next class.', chinese: '下次课见。', pronunciation: 'nos VE-mos la PROK-si-ma KLA-se', tags: ['수업', '인사'], difficulty: 2 },
};
