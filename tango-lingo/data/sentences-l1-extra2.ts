import { Sentence } from '../types';

/**
 * Level 1 확장 문장 2차 — 레슨당 5개 추가 (s1_XX_11 ~ s1_XX_15)
 * 실전 탱고 수업 표현, voseo 아르헨티나 스페인어
 */
export const sentencesL1Extra2: Record<string, Sentence> = {

  // ----- Lesson 1: 첫 인사 (추가 5개) -----
  s1_01_11: { id: 's1_01_11', spanish: '¿Es tu primera vez?', korean: '처음이야?', english: 'Is it your first time?', chinese: '你是第一次吗？', pronunciation: 'es tu pri-ME-ra VES?', tags: ['인사', '수업'], difficulty: 1 },
  s1_01_12: { id: 's1_01_12', spanish: 'Sí, soy nuevo.', korean: '응, 처음이야.', english: "Yes, I'm new.", chinese: '是的，我是新来的。', pronunciation: 'SÍ, soi NUE-vo', tags: ['인사', '수업'], difficulty: 1 },
  s1_01_13: { id: 's1_01_13', spanish: 'No te preocupes, acá todos empezamos igual.', korean: '걱정 마, 여기 다 똑같이 시작했어.', english: "Don't worry, we all started the same here.", chinese: '别担心，大家都是这样开始的。', pronunciation: 'no te pre-o-KU-pes, a-KÁ TO-dos em-pe-SA-mos i-GUAL', tags: ['인사', '격려'], difficulty: 2 },
  s1_01_14: { id: 's1_01_14', spanish: 'Ponete cómodo.', korean: '편하게 해.', english: 'Make yourself comfortable.', chinese: '放松一下。', pronunciation: 'po-NE-te KÓ-mo-do', tags: ['수업', '격려'], difficulty: 1 },
  s1_01_15: { id: 's1_01_15', spanish: 'Hoy vamos a pasarla bien.', korean: '오늘 재밌게 하자.', english: "We're going to have fun today.", chinese: '今天我们会玩得开心的。', pronunciation: 'oi VA-mos a pa-SAR-la BIEN', tags: ['수업', '격려'], difficulty: 2 },

  // ----- Lesson 2: 얼굴과 시선 (추가 5개) -----
  s1_02_11: { id: 's1_02_11', spanish: 'Suavizá la frente.', korean: '이마 힘 풀어.', english: 'Soften your forehead.', chinese: '放松额头。', pronunciation: 'sua-vi-SÁ la FREN-te', tags: ['수업', '얼굴'], difficulty: 2 },
  s1_02_12: { id: 's1_02_12', spanish: 'No mires al piso.', korean: '바닥 보지 마.', english: "Don't look at the floor.", chinese: '不要看地板。', pronunciation: 'no MI-res al PI-so', tags: ['수업', '시선', '교정'], difficulty: 1 },
  s1_02_13: { id: 's1_02_13', spanish: 'La mirada es tranquila.', korean: '시선은 편안하게.', english: 'The gaze is calm.', chinese: '目光是平静的。', pronunciation: 'la mi-RA-da es tran-KI-la', tags: ['수업', '시선'], difficulty: 2 },
  s1_02_14: { id: 's1_02_14', spanish: 'Dejá la mandíbula suelta.', korean: '턱 힘 빼.', english: 'Let your jaw go loose.', chinese: '放松下巴。', pronunciation: 'de-HÁ la man-DÍ-bu-la SUEL-ta', tags: ['수업', '얼굴'], difficulty: 2 },
  s1_02_15: { id: 's1_02_15', spanish: 'Conectá con los ojos.', korean: '눈으로 연결해.', english: 'Connect with your eyes.', chinese: '用眼神连接。', pronunciation: 'ko-nek-TÁ kon los O-hos', tags: ['수업', '시선', '연결'], difficulty: 2 },

  // ----- Lesson 3: 어깨와 목 (추가 5개) -----
  s1_03_11: { id: 's1_03_11', spanish: 'Sacudí los hombros.', korean: '어깨를 털어.', english: 'Shake your shoulders.', chinese: '抖抖肩膀。', pronunciation: 'sa-ku-DÍ los OM-bros', tags: ['수업', '어깨'], difficulty: 1 },
  s1_03_12: { id: 's1_03_12', spanish: 'Girá el cuello despacio.', korean: '목을 천천히 돌려.', english: 'Turn your neck slowly.', chinese: '慢慢转动脖子。', pronunciation: 'hi-RÁ el KUE-yo des-PA-sio', tags: ['수업', '목'], difficulty: 2 },
  s1_03_13: { id: 's1_03_13', spanish: 'Llevá los hombros para atrás.', korean: '어깨를 뒤로 보내.', english: 'Bring your shoulders back.', chinese: '把肩膀向后拉。', pronunciation: 'ye-VÁ los OM-bros pa-ra a-TRÁS', tags: ['수업', '어깨'], difficulty: 2 },
  s1_03_14: { id: 's1_03_14', spanish: 'Sentí el espacio entre las orejas y los hombros.', korean: '귀와 어깨 사이 공간을 느껴.', english: 'Feel the space between your ears and shoulders.', chinese: '感受耳朵和肩膀之间的空间。', pronunciation: 'sen-TÍ el es-PA-sio EN-tre las o-RE-has i los OM-bros', tags: ['수업', '어깨', '감각'], difficulty: 3 },
  s1_03_15: { id: 's1_03_15', spanish: 'Bien, así está mejor.', korean: '좋아, 그게 낫다.', english: 'Good, that is better.', chinese: '好，这样好多了。', pronunciation: 'BIEN, a-SÍ es-TÁ me-HOR', tags: ['수업', '피드백'], difficulty: 1 },

  // ----- Lesson 4: 팔과 손의 연결 (추가 5개) -----
  s1_04_11: { id: 's1_04_11', spanish: 'Los dedos juntos, no separados.', korean: '손가락 모아, 벌리지 말고.', english: 'Fingers together, not spread.', chinese: '手指并拢，不要分开。', pronunciation: 'los DE-dos HUN-tos, no se-pa-RA-dos', tags: ['수업', '손'], difficulty: 2 },
  s1_04_12: { id: 's1_04_12', spanish: 'El brazo tiene que flotar.', korean: '팔은 떠 있어야 해.', english: 'The arm has to float.', chinese: '手臂要浮着。', pronunciation: 'el BRA-so TIE-ne ke flo-TAR', tags: ['수업', '팔'], difficulty: 2 },
  s1_04_13: { id: 's1_04_13', spanish: 'No empujes con la mano.', korean: '손으로 밀지 마.', english: "Don't push with your hand.", chinese: '不要用手推。', pronunciation: 'no em-PU-hes kon la MA-no', tags: ['수업', '손', '교정'], difficulty: 2 },
  s1_04_14: { id: 's1_04_14', spanish: 'Ofrecé la mano así.', korean: '이렇게 손을 내밀어.', english: 'Offer your hand like this.', chinese: '这样伸出手。', pronunciation: 'o-fre-SÉ la MA-no a-SÍ', tags: ['수업', '손'], difficulty: 1 },
  s1_04_15: { id: 's1_04_15', spanish: 'La conexión empieza acá.', korean: '연결은 여기서 시작해.', english: 'The connection starts here.', chinese: '连接从这里开始。', pronunciation: 'la ko-nek-SIÓN em-PIE-sa a-KÁ', tags: ['수업', '연결'], difficulty: 2 },

  // ----- Lesson 5: 힘 빼기와 호흡 (추가 5개) -----
  s1_05_11: { id: 's1_05_11', spanish: 'Respirá por la nariz.', korean: '코로 숨 쉬어.', english: 'Breathe through your nose.', chinese: '用鼻子呼吸。', pronunciation: 'res-pi-RÁ por la na-RIS', tags: ['수업', '호흡'], difficulty: 1 },
  s1_05_12: { id: 's1_05_12', spanish: 'Sacá el aire por la boca.', korean: '입으로 내쉬어.', english: 'Let the air out through your mouth.', chinese: '从嘴巴呼气。', pronunciation: 'sa-KÁ el AI-re por la BO-ka', tags: ['수업', '호흡'], difficulty: 2 },
  s1_05_13: { id: 's1_05_13', spanish: 'Cerrá los ojos un momento.', korean: '잠깐 눈 감아.', english: 'Close your eyes for a moment.', chinese: '闭一下眼睛。', pronunciation: 'se-RRÁ los O-hos un mo-MEN-to', tags: ['수업', '이완'], difficulty: 1 },
  s1_05_14: { id: 's1_05_14', spanish: 'Mové los pies en el lugar.', korean: '제자리에서 발 움직여.', english: 'Move your feet in place.', chinese: '原地动动脚。', pronunciation: 'mo-VÉ los PIES en el lu-GAR', tags: ['수업', '이완'], difficulty: 2 },
  s1_05_15: { id: 's1_05_15', spanish: 'Ahora sí, mucho mejor.', korean: '이제 훨씬 나아.', english: 'Now yes, much better.', chinese: '现在好多了。', pronunciation: 'a-O-ra SÍ, MU-cho me-HOR', tags: ['수업', '피드백'], difficulty: 1 },

  // ----- Lesson 6: 중심과 축 (추가 5개) -----
  s1_06_11: { id: 's1_06_11', spanish: 'El eje es tu columna.', korean: '축은 네 척추야.', english: 'The axis is your spine.', chinese: '轴心就是你的脊柱。', pronunciation: 'el E-he es tu ko-LUM-na', tags: ['수업', '축'], difficulty: 2 },
  s1_06_12: { id: 's1_06_12', spanish: 'Crecé para arriba.', korean: '위로 자라.', english: 'Grow upward.', chinese: '向上生长。', pronunciation: 'kre-SÉ pa-ra a-RRI-ba', tags: ['수업', '축'], difficulty: 1 },
  s1_06_13: { id: 's1_06_13', spanish: 'Empujá el piso con los pies.', korean: '발로 바닥을 밀어.', english: 'Push the floor with your feet.', chinese: '用脚推地板。', pronunciation: 'em-pu-HÁ el PI-so kon los PIES', tags: ['수업', '발', '축'], difficulty: 2 },
  s1_06_14: { id: 's1_06_14', spanish: 'No te vayas para adelante.', korean: '앞으로 쏠리지 마.', english: "Don't lean forward.", chinese: '不要向前倾。', pronunciation: 'no te VA-yas pa-ra a-de-LAN-te', tags: ['수업', '축', '교정'], difficulty: 2 },
  s1_06_15: { id: 's1_06_15', spanish: 'Perfecto, ahí tenés el eje.', korean: '완벽해, 거기가 축이야.', english: "Perfect, there's your axis.", chinese: '完美，那就是你的轴心。', pronunciation: 'per-FEK-to, a-Í te-NÉS el E-he', tags: ['수업', '축', '피드백'], difficulty: 2 },

  // ----- Lesson 7: 체중 이동 (추가 5개) -----
  s1_07_11: { id: 's1_07_11', spanish: 'Empezá con el peso a la derecha.', korean: '무게를 오른쪽에서 시작해.', english: 'Start with your weight on the right.', chinese: '从右边开始。', pronunciation: 'em-pe-SÁ kon el PE-so a la de-RE-cha', tags: ['수업', '체중'], difficulty: 2 },
  s1_07_12: { id: 's1_07_12', spanish: 'Ahora pasá a la izquierda.', korean: '이제 왼쪽으로 넘겨.', english: 'Now transfer to the left.', chinese: '现在转移到左边。', pronunciation: 'a-O-ra pa-SÁ a la is-KIER-da', tags: ['수업', '체중'], difficulty: 2 },
  s1_07_13: { id: 's1_07_13', spanish: 'Sentí cuándo estás sobre una pierna.', korean: '한 다리 위에 있는 걸 느껴.', english: 'Feel when you are over one leg.', chinese: '感受你在一条腿上的时候。', pronunciation: 'sen-TÍ KUAN-do es-TÁS SO-bre U-na PIER-na', tags: ['수업', '체중', '감각'], difficulty: 3 },
  s1_07_14: { id: 's1_07_14', spanish: 'No arrastres el pie.', korean: '발 끌지 마.', english: "Don't drag your foot.", chinese: '不要拖脚。', pronunciation: 'no a-RRAS-tres el PIE', tags: ['수업', '발', '교정'], difficulty: 2 },
  s1_07_15: { id: 's1_07_15', spanish: 'Cerrá los pies al final.', korean: '마지막에 발 모아.', english: 'Close your feet at the end.', chinese: '最后把脚并拢。', pronunciation: 'se-RRÁ los PIES al fi-NAL', tags: ['수업', '발'], difficulty: 2 },

  // ----- Lesson 8: 아브라소 (추가 5개) -----
  s1_08_11: { id: 's1_08_11', spanish: 'Primero, abrazo abierto.', korean: '먼저, 열린 아브라소.', english: 'First, open embrace.', chinese: '首先，开放式拥抱。', pronunciation: 'pri-ME-ro, a-BRA-so a-BIER-to', tags: ['수업', '아브라소'], difficulty: 2 },
  s1_08_12: { id: 's1_08_12', spanish: 'Después podemos cerrar.', korean: '그 다음에 닫을 수 있어.', english: 'Then we can close.', chinese: '然后我们可以合拢。', pronunciation: 'des-PUÉS po-DE-mos se-RRAR', tags: ['수업', '아브라소'], difficulty: 2 },
  s1_08_13: { id: 's1_08_13', spanish: '¿Te molesta si me acerco más?', korean: '더 가까이 가도 괜찮아?', english: 'Do you mind if I get closer?', chinese: '我靠近一点你介意吗？', pronunciation: 'te mo-LES-ta si me a-SER-ko MÁS?', tags: ['수업', '아브라소', '배려'], difficulty: 3 },
  s1_08_14: { id: 's1_08_14', spanish: 'Apoyá la cabeza si querés.', korean: '원하면 머리 기대도 돼.', english: 'Rest your head if you want.', chinese: '如果你想的话可以靠头。', pronunciation: 'a-po-YÁ la ka-BE-sa si ke-RÉS', tags: ['수업', '아브라소', '배려'], difficulty: 2 },
  s1_08_15: { id: 's1_08_15', spanish: 'El abrazo se arma de a poco.', korean: '아브라소는 천천히 만들어 가는 거야.', english: 'The embrace is built little by little.', chinese: '拥抱是慢慢建立的。', pronunciation: 'el a-BRA-so se AR-ma de a PO-ko', tags: ['수업', '아브라소'], difficulty: 2 },

  // ----- Lesson 9: 연결 느끼기 (추가 5개) -----
  s1_09_11: { id: 's1_09_11', spanish: 'Escuchá la música juntos.', korean: '같이 음악을 들어.', english: 'Listen to the music together.', chinese: '一起听音乐。', pronunciation: 'es-ku-CHÁ la MÚ-si-ka HUN-tos', tags: ['수업', '연결', '음악'], difficulty: 2 },
  s1_09_12: { id: 's1_09_12', spanish: 'No te adelantes.', korean: '앞서가지 마.', english: "Don't get ahead.", chinese: '不要走在前面。', pronunciation: 'no te a-de-LAN-tes', tags: ['수업', '연결', '교정'], difficulty: 1 },
  s1_09_13: { id: 's1_09_13', spanish: 'Esperá la intención.', korean: '의도를 기다려.', english: 'Wait for the intention.', chinese: '等待意图。', pronunciation: 'es-pe-RÁ la in-ten-SIÓN', tags: ['수업', '연결'], difficulty: 2 },
  s1_09_14: { id: 's1_09_14', spanish: 'Ahí, ¿sentiste eso?', korean: '거기, 그거 느꼈어?', english: 'There, did you feel that?', chinese: '那里，你感觉到了吗？', pronunciation: 'a-Í, sen-TIS-te E-so?', tags: ['수업', '연결', '감각'], difficulty: 2 },
  s1_09_15: { id: 's1_09_15', spanish: 'Eso es bailar.', korean: '그게 춤추는 거야.', english: 'That is dancing.', chinese: '这就是跳舞。', pronunciation: 'E-so es bai-LAR', tags: ['수업', '연결', '정서'], difficulty: 1 },

  // ----- Lesson 10: 첫 수업 역할극 (추가 5개) -----
  s1_10_11: { id: 's1_10_11', spanish: 'Repasemos lo de hoy.', korean: '오늘 한 것 복습하자.', english: "Let's review what we did today.", chinese: '让我们复习今天的内容。', pronunciation: 're-pa-SE-mos lo de OI', tags: ['수업', '복습'], difficulty: 2 },
  s1_10_12: { id: 's1_10_12', spanish: '¿Qué fue lo más difícil?', korean: '가장 어려웠던 게 뭐야?', english: 'What was the hardest part?', chinese: '最难的是什么？', pronunciation: 'KÉ fue lo más di-FÍ-sil?', tags: ['수업', '피드백'], difficulty: 2 },
  s1_10_13: { id: 's1_10_13', spanish: 'Practicá en casa.', korean: '집에서 연습해.', english: 'Practice at home.', chinese: '在家练习。', pronunciation: 'prak-ti-KÁ en KA-sa', tags: ['수업', '숙제'], difficulty: 1 },
  s1_10_14: { id: 's1_10_14', spanish: '¡Muy bien la primera clase!', korean: '첫 수업 잘했어!', english: 'Great job on the first class!', chinese: '第一节课做得很好！', pronunciation: 'mui BIEN la pri-ME-ra KLA-se!', tags: ['수업', '격려'], difficulty: 1 },
  s1_10_15: { id: 's1_10_15', spanish: 'La semana que viene seguimos.', korean: '다음 주에 계속하자.', english: 'We continue next week.', chinese: '下周继续。', pronunciation: 'la se-MA-na ke VIE-ne se-GI-mos', tags: ['수업', '인사'], difficulty: 2 },
};
