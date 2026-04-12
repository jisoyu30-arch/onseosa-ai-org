import { Sentence } from '../types';
import { sentencesL1Extra } from './sentences-l1-extra';
import { sentencesL2Extra } from './sentences-l2-extra';
import { sentencesL3Extra } from './sentences-l3-extra';
import { sentencesL4Extra } from './sentences-l4-extra';
import { sentencesL5Extra } from './sentences-l5-extra';

const baseSentences: Record<string, Sentence> = {
  // =====================================================
  // LEVEL 1: El primer abrazo (첫 아브라소) — 10 lessons
  // =====================================================

  // ----- Lesson 1: 첫 인사 -----
  s1_01_1: {
    id: 's1_01_1',
    spanish: 'Hola, ¿todo bien?',
    korean: '안녕, 잘 지내?',
    english: 'Hi, all good?',
    chinese: '嗨，一切都好吗？',
    pronunciation: 'O-la, TO-do BIEN?',
    tags: ['인사', '수업'],
    difficulty: 1,
  },
  s1_01_2: {
    id: 's1_01_2',
    spanish: 'Sí, todo bien.',
    korean: '응, 잘 지내.',
    english: "Yes, all good.",
    chinese: '是的，一切都好。',
    pronunciation: 'SI, TO-do BIEN',
    tags: ['인사', '수업'],
    difficulty: 1,
  },
  s1_01_3: {
    id: 's1_01_3',
    spanish: 'Gracias.',
    korean: '고마워요.',
    english: 'Thank you.',
    chinese: '谢谢。',
    pronunciation: 'GRA-sias',
    tags: ['인사', '기본'],
    difficulty: 1,
  },

  // ----- Lesson 2: 얼굴과 시선 -----
  s1_02_1: {
    id: 's1_02_1',
    spanish: 'Relajá la cara.',
    korean: '얼굴 힘 빼.',
    english: 'Relax your face.',
    chinese: '放松你的脸。',
    pronunciation: 're-la-HÁ la KA-ra',
    tags: ['수업', '자세', '얼굴'],
    difficulty: 1,
  },
  s1_02_2: {
    id: 's1_02_2',
    spanish: 'Mírame a los ojos.',
    korean: '눈을 봐.',
    english: 'Look me in the eyes.',
    chinese: '看着我的眼睛。',
    pronunciation: 'MÍ-ra-me a los O-hos',
    tags: ['수업', '시선'],
    difficulty: 1,
  },
  s1_02_3: {
    id: 's1_02_3',
    spanish: 'Mirá al frente.',
    korean: '앞을 봐.',
    english: 'Look ahead.',
    chinese: '看前方。',
    pronunciation: 'mi-RÁ al FREN-te',
    tags: ['수업', '시선'],
    difficulty: 1,
  },

  // ----- Lesson 3: 어깨와 목 -----
  s1_03_1: {
    id: 's1_03_1',
    spanish: 'Bajá los hombros.',
    korean: '어깨 내려.',
    english: 'Lower your shoulders.',
    chinese: '放下肩膀。',
    pronunciation: 'ba-HÁ los OM-bros',
    tags: ['수업', '자세', '어깨'],
    difficulty: 1,
  },
  s1_03_2: {
    id: 's1_03_2',
    spanish: 'Relajá el cuello.',
    korean: '목 힘 빼.',
    english: 'Relax your neck.',
    chinese: '放松你的脖子。',
    pronunciation: 're-la-HÁ el KUE-yo',
    tags: ['수업', '자세', '목'],
    difficulty: 1,
  },
  s1_03_3: {
    id: 's1_03_3',
    spanish: 'No te pongas rígida.',
    korean: '딱딱하게 굳지 마.',
    english: "Don't get stiff.",
    chinese: '不要僵硬。',
    pronunciation: 'no te PON-gas RÍ-hi-da',
    tags: ['수업', '자세'],
    difficulty: 2,
  },

  // ----- Lesson 4: 팔과 손의 연결 -----
  s1_04_1: {
    id: 's1_04_1',
    spanish: 'No uses fuerza en los brazos.',
    korean: '팔에 힘 쓰지 마.',
    english: "Don't use force in your arms.",
    chinese: '手臂不要用力。',
    pronunciation: 'no U-ses FUER-sa en los BRA-sos',
    tags: ['수업', '팔', '연결'],
    difficulty: 2,
  },
  s1_04_2: {
    id: 's1_04_2',
    spanish: 'Sentí la mano de tu pareja.',
    korean: '파트너 손을 느껴.',
    english: "Feel your partner's hand.",
    chinese: '感受你搭档的手。',
    pronunciation: 'sen-TÍ la MA-no de tu pa-RE-ha',
    tags: ['수업', '손', '연결'],
    difficulty: 2,
  },
  s1_04_3: {
    id: 's1_04_3',
    spanish: 'Más suave.',
    korean: '더 부드럽게.',
    english: 'Softer.',
    chinese: '更轻柔一些。',
    pronunciation: 'más SUA-ve',
    tags: ['수업', '피드백'],
    difficulty: 1,
  },

  // ----- Lesson 5: 힘 빼기와 호흡 -----
  s1_05_1: {
    id: 's1_05_1',
    spanish: 'Respirá profundo.',
    korean: '깊게 숨 쉬어.',
    english: 'Breathe deeply.',
    chinese: '深呼吸。',
    pronunciation: 'res-pi-RÁ pro-FUN-do',
    tags: ['수업', '호흡'],
    difficulty: 1,
  },
  s1_05_2: {
    id: 's1_05_2',
    spanish: 'No te apures.',
    korean: '서두르지 마.',
    english: "Don't rush.",
    chinese: '不要着急。',
    pronunciation: 'no te a-PU-res',
    tags: ['수업', '이완'],
    difficulty: 1,
  },
  s1_05_3: {
    id: 's1_05_3',
    spanish: 'Tranquila, despacio.',
    korean: '침착하게, 천천히.',
    english: 'Calm, slowly.',
    chinese: '放松，慢慢来。',
    pronunciation: 'tran-KI-la, des-PA-sio',
    tags: ['수업', '이완', '정서'],
    difficulty: 1,
  },

  // ----- Lesson 6: 중심과 축 -----
  s1_06_1: {
    id: 's1_06_1',
    spanish: 'Encontrá tu eje.',
    korean: '네 축을 찾아.',
    english: 'Find your axis.',
    chinese: '找到你的轴心。',
    pronunciation: 'en-kon-TRÁ tu E-he',
    tags: ['수업', '축', '중심'],
    difficulty: 2,
  },
  s1_06_2: {
    id: 's1_06_2',
    spanish: 'Volvé al centro.',
    korean: '중심으로 돌아와.',
    english: 'Come back to center.',
    chinese: '回到中心。',
    pronunciation: 'vol-VÉ al SEN-tro',
    tags: ['수업', '중심'],
    difficulty: 2,
  },
  s1_06_3: {
    id: 's1_06_3',
    spanish: 'No te vayas para atrás.',
    korean: '뒤로 빠지지 마.',
    english: "Don't lean back.",
    chinese: '不要往后倒。',
    pronunciation: 'no te VA-yas pa-ra a-TRÁS',
    tags: ['수업', '축', '교정'],
    difficulty: 2,
  },

  // ----- Lesson 7: 체중 이동 -----
  s1_07_1: {
    id: 's1_07_1',
    spanish: 'Cambiá el peso.',
    korean: '체중을 옮겨.',
    english: 'Shift your weight.',
    chinese: '转移重心。',
    pronunciation: 'kam-BIÁ el PE-so',
    tags: ['수업', '체중'],
    difficulty: 1,
  },
  s1_07_2: {
    id: 's1_07_2',
    spanish: 'Pasá el peso completo.',
    korean: '무게를 완전히 넘겨.',
    english: 'Transfer the weight fully.',
    chinese: '完全转移重心。',
    pronunciation: 'pa-SÁ el PE-so kom-PLE-to',
    tags: ['수업', '체중'],
    difficulty: 2,
  },
  s1_07_3: {
    id: 's1_07_3',
    spanish: 'Esperá.',
    korean: '기다려.',
    english: 'Wait.',
    chinese: '等一下。',
    pronunciation: 'es-pe-RÁ',
    tags: ['수업', '타이밍'],
    difficulty: 1,
  },

  // ----- Lesson 8: 아브라소 -----
  s1_08_1: {
    id: 's1_08_1',
    spanish: 'Abrí los brazos.',
    korean: '팔을 벌려.',
    english: 'Open your arms.',
    chinese: '张开双臂。',
    pronunciation: 'a-BRÍ los BRA-sos',
    tags: ['수업', '아브라소'],
    difficulty: 1,
  },
  s1_08_2: {
    id: 's1_08_2',
    spanish: 'Cerrá el abrazo.',
    korean: '아브라소를 닫아.',
    english: 'Close the embrace.',
    chinese: '合上拥抱。',
    pronunciation: 'se-RRÁ el a-BRA-so',
    tags: ['수업', '아브라소'],
    difficulty: 2,
  },
  s1_08_3: {
    id: 's1_08_3',
    spanish: 'No empujes.',
    korean: '밀지 마.',
    english: "Don't push.",
    chinese: '不要推。',
    pronunciation: 'no em-PU-hes',
    tags: ['수업', '아브라소', '교정'],
    difficulty: 1,
  },

  // ----- Lesson 9: 연결 느끼기 -----
  s1_09_1: {
    id: 's1_09_1',
    spanish: 'Sentí la conexión.',
    korean: '연결을 느껴.',
    english: 'Feel the connection.',
    chinese: '感受连接。',
    pronunciation: 'sen-TÍ la ko-nek-SIÓN',
    tags: ['수업', '연결'],
    difficulty: 2,
  },
  s1_09_2: {
    id: 's1_09_2',
    spanish: 'Quedate conmigo.',
    korean: '나한테 머물러.',
    english: 'Stay with me.',
    chinese: '留在我身边。',
    pronunciation: 'ke-DA-te kon-MI-go',
    tags: ['수업', '연결', '정서'],
    difficulty: 2,
  },
  s1_09_3: {
    id: 's1_09_3',
    spanish: 'No te vayas sola.',
    korean: '혼자 가지 마.',
    english: "Don't go on your own.",
    chinese: '不要一个人走。',
    pronunciation: 'no te VA-yas SO-la',
    tags: ['수업', '연결', '교정'],
    difficulty: 2,
  },

  // ----- Lesson 10: 첫 수업 역할극 (역할극 전용 문장) -----
  s1_10_1: {
    id: 's1_10_1',
    spanish: 'Otra vez.',
    korean: '다시.',
    english: 'Again.',
    chinese: '再来一次。',
    pronunciation: 'O-tra VES',
    tags: ['수업', '피드백'],
    difficulty: 1,
  },
  s1_10_2: {
    id: 's1_10_2',
    spanish: 'Ahora sí.',
    korean: '이제 맞아.',
    english: 'Now yes. / There it is.',
    chinese: '现在对了。',
    pronunciation: 'a-O-ra SÍ',
    tags: ['수업', '피드백'],
    difficulty: 1,
  },
  s1_10_3: {
    id: 's1_10_3',
    spanish: 'Mejor así.',
    korean: '이렇게 하는 게 더 나아.',
    english: 'Better like this.',
    chinese: '这样更好。',
    pronunciation: 'me-HOR a-SÍ',
    tags: ['수업', '피드백'],
    difficulty: 1,
  },

  // =====================================================
  // LEVEL 2: Caminar juntos (함께 걷기) — 12 lessons
  // =====================================================

  // ----- Lesson 1: 앞으로 걷기 -----
  s2_01_1: {
    id: 's2_01_1', spanish: 'Caminá derecho.', korean: '앞으로 똑바로 걸어.',
    english: 'Walk straight.', chinese: '直走。', pronunciation: 'ka-mi-NÁ de-RE-cho',
    tags: ['수업', '걷기'], difficulty: 1,
  },
  s2_01_2: {
    id: 's2_01_2', spanish: 'Un paso a la vez.', korean: '한 걸음씩.',
    english: 'One step at a time.', chinese: '一步一步来。', pronunciation: 'un PA-so a la VES',
    tags: ['수업', '걷기'], difficulty: 1,
  },
  s2_01_3: {
    id: 's2_01_3', spanish: 'No mires el piso.', korean: '바닥 보지 마.',
    english: "Don't look at the floor.", chinese: '不要看地板。', pronunciation: 'no MI-res el PI-so',
    tags: ['수업', '걷기', '교정'], difficulty: 1,
  },

  // ----- Lesson 2: 옆으로 이동 -----
  s2_02_1: {
    id: 's2_02_1', spanish: 'Un paso al costado.', korean: '옆으로 한 걸음.',
    english: 'One step to the side.', chinese: '向旁边迈一步。', pronunciation: 'un PA-so al kos-TA-do',
    tags: ['수업', '걷기', '방향'], difficulty: 1,
  },
  s2_02_2: {
    id: 's2_02_2', spanish: 'Abrí hacia el costado.', korean: '옆으로 벌려.',
    english: 'Open to the side.', chinese: '向旁边打开。', pronunciation: 'a-BRÍ A-sia el kos-TA-do',
    tags: ['수업', '걷기'], difficulty: 2,
  },
  s2_02_3: {
    id: 's2_02_3', spanish: 'No cruces todavía.', korean: '아직 교차하지 마.',
    english: "Don't cross yet.", chinese: '还不要交叉。', pronunciation: 'no KRU-ses to-da-VÍ-a',
    tags: ['수업', '걷기', '교정'], difficulty: 2,
  },

  // ----- Lesson 3: 뒤로 이동 -----
  s2_03_1: {
    id: 's2_03_1', spanish: 'Un paso atrás.', korean: '뒤로 한 걸음.',
    english: 'One step back.', chinese: '后退一步。', pronunciation: 'un PA-so a-TRÁS',
    tags: ['수업', '걷기', '방향'], difficulty: 1,
  },
  s2_03_2: {
    id: 's2_03_2', spanish: 'No te vayas muy lejos.', korean: '너무 멀리 가지 마.',
    english: "Don't go too far.", chinese: '不要走太远。', pronunciation: 'no te VA-yas mui LE-hos',
    tags: ['수업', '걷기', '교정'], difficulty: 2,
  },
  s2_03_3: {
    id: 's2_03_3', spanish: 'Volvé.', korean: '돌아와.',
    english: 'Come back.', chinese: '回来。', pronunciation: 'vol-VÉ',
    tags: ['수업', '걷기'], difficulty: 1,
  },

  // ----- Lesson 4: 멈추기 -----
  s2_04_1: {
    id: 's2_04_1', spanish: 'Pará.', korean: '멈춰.',
    english: 'Stop.', chinese: '停。', pronunciation: 'pa-RÁ',
    tags: ['수업', '멈춤'], difficulty: 1,
  },
  s2_04_2: {
    id: 's2_04_2', spanish: 'Esperá un momento.', korean: '잠깐 기다려.',
    english: 'Wait a moment.', chinese: '等一下。', pronunciation: 'es-pe-RÁ un mo-MEN-to',
    tags: ['수업', '멈춤'], difficulty: 1,
  },
  s2_04_3: {
    id: 's2_04_3', spanish: 'No salgas rápido.', korean: '빨리 출발하지 마.',
    english: "Don't start quickly.", chinese: '不要快速出发。', pronunciation: 'no SAL-gas RÁ-pi-do',
    tags: ['수업', '멈춤', '교정'], difficulty: 2,
  },

  // ----- Lesson 5: 리드와 팔로우 -----
  s2_05_1: {
    id: 's2_05_1', spanish: 'Yo lidero, vos seguís.', korean: '내가 리드하고, 네가 따라와.',
    english: 'I lead, you follow.', chinese: '我引导，你跟随。', pronunciation: 'yo li-DE-ro, vos se-GÍS',
    tags: ['수업', '리드', '역할'], difficulty: 2,
  },
  s2_05_2: {
    id: 's2_05_2', spanish: 'Esperá la marca.', korean: '리드 신호를 기다려.',
    english: 'Wait for the lead.', chinese: '等待引导信号。', pronunciation: 'es-pe-RÁ la MAR-ka',
    tags: ['수업', '리드'], difficulty: 2,
  },
  s2_05_3: {
    id: 's2_05_3', spanish: 'No te adelantes.', korean: '앞서가지 마.',
    english: "Don't get ahead.", chinese: '不要抢先。', pronunciation: 'no te a-de-LAN-tes',
    tags: ['수업', '팔로우', '교정'], difficulty: 2,
  },

  // ----- Lesson 6: 마르카 -----
  s2_06_1: {
    id: 's2_06_1', spanish: 'Marcá con el pecho.', korean: '가슴으로 리드해.',
    english: 'Lead with your chest.', chinese: '用胸口引导。', pronunciation: 'mar-KÁ kon el PE-cho',
    tags: ['수업', '리드', '마르카'], difficulty: 2,
  },
  s2_06_2: {
    id: 's2_06_2', spanish: 'La marca es suave.', korean: '리드는 부드럽게.',
    english: 'The lead is soft.', chinese: '引导是柔和的。', pronunciation: 'la MAR-ka es SUA-ve',
    tags: ['수업', '리드'], difficulty: 2,
  },
  s2_06_3: {
    id: 's2_06_3', spanish: 'No empujes con los brazos.', korean: '팔로 밀지 마.',
    english: "Don't push with your arms.", chinese: '不要用手臂推。', pronunciation: 'no em-PU-hes kon los BRA-sos',
    tags: ['수업', '리드', '교정'], difficulty: 2,
  },

  // ----- Lesson 7: 살리다 기초 -----
  s2_07_1: {
    id: 's2_07_1', spanish: 'Esta es la salida.', korean: '이게 살리다야.',
    english: 'This is the salida.', chinese: '这是salida。', pronunciation: 'ES-ta es la sa-LI-da',
    tags: ['수업', '살리다'], difficulty: 1,
  },
  s2_07_2: {
    id: 's2_07_2', spanish: 'Prepará el primer paso.', korean: '첫 걸음을 준비해.',
    english: 'Prepare the first step.', chinese: '准备第一步。', pronunciation: 'pre-pa-RÁ el pri-MER PA-so',
    tags: ['수업', '살리다'], difficulty: 2,
  },
  s2_07_3: {
    id: 's2_07_3', spanish: 'Sentí el inicio.', korean: '시작을 느껴.',
    english: 'Feel the beginning.', chinese: '感受开始。', pronunciation: 'sen-TÍ el i-NI-sio',
    tags: ['수업', '살리다', '감각'], difficulty: 2,
  },

  // ----- Lesson 8: 속도 조절 -----
  s2_08_1: {
    id: 's2_08_1', spanish: 'Más despacio.', korean: '더 천천히.',
    english: 'Slower.', chinese: '慢一点。', pronunciation: 'más des-PA-sio',
    tags: ['수업', '속도'], difficulty: 1,
  },
  s2_08_2: {
    id: 's2_08_2', spanish: 'Un poco más rápido.', korean: '조금 더 빠르게.',
    english: 'A little faster.', chinese: '快一点。', pronunciation: 'un PO-ko más RÁ-pi-do',
    tags: ['수업', '속도'], difficulty: 1,
  },
  s2_08_3: {
    id: 's2_08_3', spanish: 'Al tiempo de la música.', korean: '음악 박자에 맞춰.',
    english: 'In time with the music.', chinese: '跟着音乐的节拍。', pronunciation: 'al TIEM-po de la MÚ-si-ka',
    tags: ['수업', '음악', '리듬'], difficulty: 2,
  },

  // ----- Lesson 9: 리듬과 걷기 -----
  s2_09_1: {
    id: 's2_09_1', spanish: 'Escuchá la música.', korean: '음악을 들어.',
    english: 'Listen to the music.', chinese: '听音乐。', pronunciation: 'es-ku-CHÁ la MÚ-si-ka',
    tags: ['수업', '음악'], difficulty: 1,
  },
  s2_09_2: {
    id: 's2_09_2', spanish: 'Caminá con el compás.', korean: '박자에 맞춰 걸어.',
    english: 'Walk with the beat.', chinese: '跟着节拍走。', pronunciation: 'ka-mi-NÁ kon el kom-PÁS',
    tags: ['수업', '음악', '걷기'], difficulty: 2,
  },
  s2_09_3: {
    id: 's2_09_3', spanish: 'Marcá el tiempo.', korean: '박자를 짚어.',
    english: 'Mark the beat.', chinese: '打节拍。', pronunciation: 'mar-KÁ el TIEM-po',
    tags: ['수업', '음악'], difficulty: 2,
  },

  // ----- Lesson 10: 보폭 맞추기 -----
  s2_10_1: {
    id: 's2_10_1', spanish: 'Paso más corto.', korean: '보폭 더 짧게.',
    english: 'Shorter step.', chinese: '步子小一点。', pronunciation: 'PA-so más KOR-to',
    tags: ['수업', '걷기'], difficulty: 1,
  },
  s2_10_2: {
    id: 's2_10_2', spanish: 'No abras tanto.', korean: '너무 크게 벌리지 마.',
    english: "Don't open so much.", chinese: '不要迈太大。', pronunciation: 'no A-bras TAN-to',
    tags: ['수업', '걷기', '교정'], difficulty: 1,
  },
  s2_10_3: {
    id: 's2_10_3', spanish: 'Más pequeño.', korean: '더 작게.',
    english: 'Smaller.', chinese: '更小。', pronunciation: 'más pe-KE-ño',
    tags: ['수업', '걷기'], difficulty: 1,
  },

  // ----- Lesson 11: 함께 걷기 -----
  s2_11_1: {
    id: 's2_11_1', spanish: 'Caminemos juntos.', korean: '같이 걷자.',
    english: "Let's walk together.", chinese: '我们一起走。', pronunciation: 'ka-mi-NE-mos HUN-tos',
    tags: ['수업', '걷기', '연결'], difficulty: 2,
  },
  s2_11_2: {
    id: 's2_11_2', spanish: 'Sentí mi cuerpo.', korean: '내 몸을 느껴.',
    english: 'Feel my body.', chinese: '感受我的身体。', pronunciation: 'sen-TÍ mi KUER-po',
    tags: ['수업', '연결'], difficulty: 2,
  },
  s2_11_3: {
    id: 's2_11_3', spanish: 'Vamos al mismo ritmo.', korean: '같은 리듬으로 가자.',
    english: "Let's go at the same rhythm.", chinese: '我们保持同样的节奏。', pronunciation: 'VA-mos al MIS-mo RIT-mo',
    tags: ['수업', '걷기', '음악'], difficulty: 2,
  },

  // ----- Lesson 12: 걷기 역할극 -----
  s2_12_1: {
    id: 's2_12_1', spanish: '¿Así?', korean: '이렇게?',
    english: 'Like this?', chinese: '这样吗？', pronunciation: 'a-SÍ?',
    tags: ['수업', '역할극'], difficulty: 1,
  },
  s2_12_2: {
    id: 's2_12_2', spanish: 'Empezá de nuevo.', korean: '처음부터 다시 해.',
    english: 'Start again.', chinese: '重新开始。', pronunciation: 'em-pe-SÁ de NUE-vo',
    tags: ['수업', '역할극'], difficulty: 1,
  },
  s2_12_3: {
    id: 's2_12_3', spanish: 'Con calma.', korean: '차분하게.',
    english: 'Calmly.', chinese: '冷静地。', pronunciation: 'kon KAL-ma',
    tags: ['수업', '역할극', '정서'], difficulty: 1,
  },

  // =====================================================
  // LEVEL 3: Girar y construir (회전과 구조) — 14 lessons
  // =====================================================

  // ----- Lesson 1: 앞오초 -----
  s3_01_1: { id: 's3_01_1', spanish: 'Hacé un ocho para adelante.', korean: '앞으로 오초 해.', english: 'Do a forward ocho.', chinese: '做一个前ocho。', pronunciation: 'a-SÉ un O-cho pa-ra a-de-LAN-te', tags: ['수업', '오초'], difficulty: 2 },
  s3_01_2: { id: 's3_01_2', spanish: 'Pivotá.', korean: '피벗해.', english: 'Pivot.', chinese: '转轴。', pronunciation: 'pi-vo-TÁ', tags: ['수업', '오초', '피벗'], difficulty: 2 },
  s3_01_3: { id: 's3_01_3', spanish: 'Cruzá la pierna.', korean: '다리를 교차해.', english: 'Cross your leg.', chinese: '交叉腿。', pronunciation: 'kru-SÁ la PIER-na', tags: ['수업', '오초'], difficulty: 2 },

  // ----- Lesson 2: 뒤오초 -----
  s3_02_1: { id: 's3_02_1', spanish: 'Ahora para atrás.', korean: '이번엔 뒤로.', english: 'Now backwards.', chinese: '现在往后。', pronunciation: 'a-O-ra pa-ra a-TRÁS', tags: ['수업', '오초'], difficulty: 2 },
  s3_02_2: { id: 's3_02_2', spanish: 'Girá la cadera.', korean: '골반을 돌려.', english: 'Rotate your hips.', chinese: '转动臀部。', pronunciation: 'hi-RÁ la ka-DE-ra', tags: ['수업', '오초'], difficulty: 2 },
  s3_02_3: { id: 's3_02_3', spanish: 'Mantené el eje.', korean: '축을 유지해.', english: 'Keep your axis.', chinese: '保持轴心。', pronunciation: 'man-te-NÉ el E-he', tags: ['수업', '축'], difficulty: 2 },

  // ----- Lesson 3: 크루세 -----
  s3_03_1: { id: 's3_03_1', spanish: 'Cruzá.', korean: '교차해.', english: 'Cross.', chinese: '交叉。', pronunciation: 'kru-SÁ', tags: ['수업', '크루세'], difficulty: 1 },
  s3_03_2: { id: 's3_03_2', spanish: 'Esperá el cruce.', korean: '교차 타이밍을 기다려.', english: 'Wait for the cross.', chinese: '等待交叉。', pronunciation: 'es-pe-RÁ el KRU-se', tags: ['수업', '크루세'], difficulty: 2 },
  s3_03_3: { id: 's3_03_3', spanish: 'Juntá las piernas.', korean: '다리를 모아.', english: 'Bring your legs together.', chinese: '并拢双腿。', pronunciation: 'hun-TÁ las PIER-nas', tags: ['수업', '크루세'], difficulty: 2 },

  // ----- Lesson 4: 회전 시작 -----
  s3_04_1: { id: 's3_04_1', spanish: 'Empezá el giro.', korean: '회전 시작해.', english: 'Start the turn.', chinese: '开始转。', pronunciation: 'em-pe-SÁ el HI-ro', tags: ['수업', '히로'], difficulty: 2 },
  s3_04_2: { id: 's3_04_2', spanish: 'No corras la vuelta.', korean: '회전을 서두르지 마.', english: "Don't rush the turn.", chinese: '不要急着转。', pronunciation: 'no KO-rras la VUEL-ta', tags: ['수업', '히로', '교정'], difficulty: 2 },
  s3_04_3: { id: 's3_04_3', spanish: 'Sentí la vuelta completa.', korean: '전체 회전을 느껴.', english: 'Feel the complete turn.', chinese: '感受完整的转圈。', pronunciation: 'sen-TÍ la VUEL-ta kom-PLE-ta', tags: ['수업', '히로'], difficulty: 3 },

  // ----- Lesson 5: 회전 안에서 -----
  s3_05_1: { id: 's3_05_1', spanish: 'Adelante, costado, atrás.', korean: '앞, 옆, 뒤.', english: 'Forward, side, back.', chinese: '前，旁，后。', pronunciation: 'a-de-LAN-te, kos-TA-do, a-TRÁS', tags: ['수업', '히로'], difficulty: 2 },
  s3_05_2: { id: 's3_05_2', spanish: 'Cada paso tiene su lugar.', korean: '각 스텝에는 자리가 있어.', english: 'Each step has its place.', chinese: '每一步都有它的位置。', pronunciation: 'KA-da PA-so TIE-ne su lu-GAR', tags: ['수업', '히로'], difficulty: 3 },
  s3_05_3: { id: 's3_05_3', spanish: 'Volvé al centro.', korean: '중심으로 돌아와.', english: 'Come back to center.', chinese: '回到中心。', pronunciation: 'vol-VÉ al SEN-tro', tags: ['수업', '히로', '중심'], difficulty: 2 },

  // ----- Lesson 6: 기본이 먼저 -----
  s3_06_1: { id: 's3_06_1', spanish: 'Primero caminá bien.', korean: '먼저 잘 걸어.', english: 'First walk well.', chinese: '先走好。', pronunciation: 'pri-ME-ro ka-mi-NÁ BIEN', tags: ['수업', '마인드셋'], difficulty: 1 },
  s3_06_2: { id: 's3_06_2', spanish: 'Después girá.', korean: '그 다음에 돌아.', english: 'Then turn.', chinese: '然后再转。', pronunciation: 'des-PUÉS hi-RÁ', tags: ['수업', '마인드셋'], difficulty: 1 },
  s3_06_3: { id: 's3_06_3', spanish: 'Sin base, no funciona.', korean: '기본 없이는 안 돼.', english: 'Without the basics, it doesn\'t work.', chinese: '没有基础不行。', pronunciation: 'sin BA-se, no fun-SIO-na', tags: ['수업', '마인드셋'], difficulty: 2 },

  // ----- Lesson 7: 아도르노 -----
  s3_07_1: { id: 's3_07_1', spanish: 'Primero la base, después el adorno.', korean: '먼저 기본, 그 다음 장식.', english: 'First the base, then the adorno.', chinese: '先基础，再装饰。', pronunciation: 'pri-ME-ro la BA-se, des-PUÉS el a-DOR-no', tags: ['수업', '아도르노'], difficulty: 2 },
  s3_07_2: { id: 's3_07_2', spanish: 'Usá el pie libre.', korean: '프리 레그를 써.', english: 'Use your free foot.', chinese: '用你的自由脚。', pronunciation: 'u-SÁ el PIE LI-bre', tags: ['수업', '아도르노'], difficulty: 2 },
  s3_07_3: { id: 's3_07_3', spanish: 'Es tu momento.', korean: '이건 네 순간이야.', english: 'This is your moment.', chinese: '这是你的时刻。', pronunciation: 'es tu mo-MEN-to', tags: ['수업', '아도르노', '정서'], difficulty: 1 },

  // ----- Lesson 8: 사카다 -----
  s3_08_1: { id: 's3_08_1', spanish: 'Entrá con la pierna.', korean: '다리로 들어가.', english: 'Enter with your leg.', chinese: '用腿进入。', pronunciation: 'en-TRÁ kon la PIER-na', tags: ['수업', '사카다'], difficulty: 2 },
  s3_08_2: { id: 's3_08_2', spanish: 'Es una invitación.', korean: '이건 초대야.', english: 'It\'s an invitation.', chinese: '这是一个邀请。', pronunciation: 'es U-na in-vi-ta-SIÓN', tags: ['수업', '사카다'], difficulty: 2 },
  s3_08_3: { id: 's3_08_3', spanish: 'No empujes.', korean: '밀지 마.', english: 'Don\'t push.', chinese: '不要推。', pronunciation: 'no em-PU-hes', tags: ['수업', '사카다', '교정'], difficulty: 1 },

  // ----- Lesson 9: 파라다 -----
  s3_09_1: { id: 's3_09_1', spanish: 'Hacé una parada.', korean: '파라다를 해.', english: 'Do a parada.', chinese: '做一个parada。', pronunciation: 'a-SÉ U-na pa-RA-da', tags: ['수업', '파라다'], difficulty: 2 },
  s3_09_2: { id: 's3_09_2', spanish: 'Marcá el freno.', korean: '브레이크를 걸어.', english: 'Mark the stop.', chinese: '标记停顿。', pronunciation: 'mar-KÁ el FRE-no', tags: ['수업', '파라다'], difficulty: 2 },
  s3_09_3: { id: 's3_09_3', spanish: 'No pierdas la conexión.', korean: '연결을 잃지 마.', english: 'Don\'t lose the connection.', chinese: '不要失去连接。', pronunciation: 'no PIER-das la ko-nek-SIÓN', tags: ['수업', '파라다', '연결'], difficulty: 2 },

  // ----- Lesson 10: 볼레오 -----
  s3_10_1: { id: 's3_10_1', spanish: 'No lo hagas grande.', korean: '크게 하지 마.', english: 'Don\'t make it big.', chinese: '不要做大。', pronunciation: 'no lo A-gas GRAN-de', tags: ['수업', '볼레오'], difficulty: 2 },
  s3_10_2: { id: 's3_10_2', spanish: 'Dejá que salga natural.', korean: '자연스럽게 나오게 해.', english: 'Let it come out naturally.', chinese: '让它自然出来。', pronunciation: 'de-HÁ ke SAL-ga na-tu-RAL', tags: ['수업', '볼레오'], difficulty: 3 },
  s3_10_3: { id: 's3_10_3', spanish: 'No fuerces el boleo.', korean: '볼레오를 억지로 하지 마.', english: 'Don\'t force the boleo.', chinese: '不要强迫boleo。', pronunciation: 'no FUER-ses el bo-LE-o', tags: ['수업', '볼레오', '교정'], difficulty: 2 },

  // ----- Lesson 11: 강도 조절 -----
  s3_11_1: { id: 's3_11_1', spanish: 'Más suave.', korean: '더 부드럽게.', english: 'Softer.', chinese: '更柔和。', pronunciation: 'más SUA-ve', tags: ['수업', '피드백'], difficulty: 1 },
  s3_11_2: { id: 's3_11_2', spanish: 'Menos fuerza.', korean: '힘 좀 줄여.', english: 'Less force.', chinese: '少用力。', pronunciation: 'ME-nos FUER-sa', tags: ['수업', '피드백'], difficulty: 1 },
  s3_11_3: { id: 's3_11_3', spanish: 'Mejor así.', korean: '이게 더 나아.', english: 'Better like this.', chinese: '这样更好。', pronunciation: 'me-HOR a-SÍ', tags: ['수업', '피드백'], difficulty: 1 },

  // ----- Lesson 12: 실수 후 복구 -----
  s3_12_1: { id: 's3_12_1', spanish: 'No pasa nada.', korean: '괜찮아, 아무 일도 아니야.', english: 'It\'s okay, no problem.', chinese: '没关系。', pronunciation: 'no PA-sa NA-da', tags: ['수업', '정서'], difficulty: 1 },
  s3_12_2: { id: 's3_12_2', spanish: 'Volvamos desde acá.', korean: '여기서부터 다시 하자.', english: 'Let\'s go back from here.', chinese: '从这里重新开始。', pronunciation: 'vol-VA-mos DES-de a-KÁ', tags: ['수업', '정서'], difficulty: 2 },
  s3_12_3: { id: 's3_12_3', spanish: 'Otra vez, con calma.', korean: '다시, 차분하게.', english: 'Again, calmly.', chinese: '再来，冷静地。', pronunciation: 'O-tra VES, kon KAL-ma', tags: ['수업', '정서'], difficulty: 1 },

  // ----- Lesson 13: 수업 중 질문 -----
  s3_13_1: { id: 's3_13_1', spanish: '¿Puedo intentar de nuevo?', korean: '다시 해봐도 될까요?', english: 'Can I try again?', chinese: '我可以再试一次吗？', pronunciation: 'PUE-do in-ten-TAR de NUE-vo?', tags: ['수업', '질문'], difficulty: 2 },
  s3_13_2: { id: 's3_13_2', spanish: '¿Así está bien?', korean: '이렇게 하면 맞아요?', english: 'Is this okay?', chinese: '这样可以吗？', pronunciation: 'a-SÍ es-TÁ BIEN?', tags: ['수업', '질문'], difficulty: 1 },
  s3_13_3: { id: 's3_13_3', spanish: 'No entendí.', korean: '이해 못 했어요.', english: 'I didn\'t understand.', chinese: '我没听懂。', pronunciation: 'no en-ten-DÍ', tags: ['수업', '질문'], difficulty: 1 },

  // ----- Lesson 14: 회전 역할극 -----
  s3_14_1: { id: 's3_14_1', spanish: 'Prepará el pivote.', korean: '피벗 준비해.', english: 'Prepare the pivot.', chinese: '准备转轴。', pronunciation: 'pre-pa-RÁ el pi-VO-te', tags: ['수업', '역할극'], difficulty: 2 },
  s3_14_2: { id: 's3_14_2', spanish: 'Más desde el centro.', korean: '중심에서 더.', english: 'More from the center.', chinese: '更多从中心。', pronunciation: 'más DES-de el SEN-tro', tags: ['수업', '역할극'], difficulty: 2 },
  s3_14_3: { id: 's3_14_3', spanish: 'Primero la base.', korean: '먼저 기본.', english: 'First the base.', chinese: '先基础。', pronunciation: 'pri-ME-ro la BA-se', tags: ['수업', '역할극'], difficulty: 1 },

  // =====================================================
  // LEVEL 4: Hablar en la práctica (연습에서 말하기) — 12 lessons
  // =====================================================

  // ----- Lesson 1: 다시 해볼까요 -----
  s4_01_1: { id: 's4_01_1', spanish: 'Otra vez, por favor.', korean: '다시요, 제발.', english: 'Again, please.', chinese: '再来一次，拜托。', pronunciation: 'O-tra VES, por fa-VOR', tags: ['연습', '피드백'], difficulty: 1 },
  s4_01_2: { id: 's4_01_2', spanish: 'Hagámoslo de nuevo.', korean: '다시 해보자.', english: "Let's do it again.", chinese: '我们再做一次。', pronunciation: 'a-GÁ-mos-lo de NUE-vo', tags: ['연습', '피드백'], difficulty: 2 },
  s4_01_3: { id: 's4_01_3', spanish: 'Desde el principio.', korean: '처음부터.', english: 'From the beginning.', chinese: '从头开始。', pronunciation: 'DES-de el prin-SI-pio', tags: ['연습', '피드백'], difficulty: 2 },

  // ----- Lesson 2: 더 좋아요 -----
  s4_02_1: { id: 's4_02_1', spanish: 'Ahora está mejor.', korean: '이제 더 나아.', english: "Now it's better.", chinese: '现在好多了。', pronunciation: 'a-O-ra es-TÁ me-HOR', tags: ['연습', '긍정'], difficulty: 1 },
  s4_02_2: { id: 's4_02_2', spanish: 'Sí, así está bien.', korean: '응, 이렇게 하면 맞아.', english: "Yes, that's fine.", chinese: '对，这样可以。', pronunciation: 'SÍ, a-SÍ es-TÁ BIEN', tags: ['연습', '긍정'], difficulty: 1 },
  s4_02_3: { id: 's4_02_3', spanish: 'Mucho mejor.', korean: '훨씬 나아.', english: 'Much better.', chinese: '好多了。', pronunciation: 'MU-cho me-HOR', tags: ['연습', '긍정'], difficulty: 1 },

  // ----- Lesson 3: 아직 아니에요 -----
  s4_03_1: { id: 's4_03_1', spanish: 'Todavía no.', korean: '아직 아니야.', english: 'Not yet.', chinese: '还没有。', pronunciation: 'to-da-VÍ-a NO', tags: ['연습', '교정'], difficulty: 1 },
  s4_03_2: { id: 's4_03_2', spanish: 'No así.', korean: '그렇게는 아니야.', english: 'Not like that.', chinese: '不是这样。', pronunciation: 'no a-SÍ', tags: ['연습', '교정'], difficulty: 1 },
  s4_03_3: { id: 's4_03_3', spanish: 'Probemos diferente.', korean: '다르게 해보자.', english: "Let's try differently.", chinese: '试试不同的方法。', pronunciation: 'pro-BE-mos di-fe-REN-te', tags: ['연습', '교정'], difficulty: 2 },

  // ----- Lesson 4: 천천히요 -----
  s4_04_1: { id: 's4_04_1', spanish: 'Más despacio.', korean: '더 천천히.', english: 'Slower.', chinese: '慢一点。', pronunciation: 'más des-PA-sio', tags: ['연습', '속도'], difficulty: 1 },
  s4_04_2: { id: 's4_04_2', spanish: 'No tan rápido.', korean: '그렇게 빠르지 않게.', english: 'Not so fast.', chinese: '不要那么快。', pronunciation: 'no tan RÁ-pi-do', tags: ['연습', '속도'], difficulty: 1 },
  s4_04_3: { id: 's4_04_3', spanish: 'Tomate tu tiempo.', korean: '시간 갖고 해.', english: 'Take your time.', chinese: '慢慢来。', pronunciation: 'to-MA-te tu TIEM-po', tags: ['연습', '속도', '정서'], difficulty: 2 },

  // ----- Lesson 5: 느낌이 안 와요 -----
  s4_05_1: { id: 's4_05_1', spanish: 'No lo siento bien.', korean: '느낌이 안 와.', english: "I don't feel it right.", chinese: '我感觉不对。', pronunciation: 'no lo SIEN-to BIEN', tags: ['연습', '감각'], difficulty: 2 },
  s4_05_2: { id: 's4_05_2', spanish: 'No entiendo esta parte.', korean: '이 부분을 모르겠어.', english: "I don't understand this part.", chinese: '我不明白这部分。', pronunciation: 'no en-TIEN-do ES-ta PAR-te', tags: ['연습', '감각'], difficulty: 2 },
  s4_05_3: { id: 's4_05_3', spanish: 'Mostrame otra vez.', korean: '다시 보여줘.', english: 'Show me again.', chinese: '再给我看一次。', pronunciation: 'mos-TRA-me O-tra VES', tags: ['연습', '요청'], difficulty: 2 },

  // ----- Lesson 6: 연결이 끊겼어요 -----
  s4_06_1: { id: 's4_06_1', spanish: 'Perdimos la conexión.', korean: '연결이 끊겼어.', english: 'We lost the connection.', chinese: '我们失去了连接。', pronunciation: 'per-DI-mos la ko-nek-SIÓN', tags: ['연습', '연결'], difficulty: 2 },
  s4_06_2: { id: 's4_06_2', spanish: 'Quedate conmigo.', korean: '나한테 머물러.', english: 'Stay with me.', chinese: '留在我身边。', pronunciation: 'ke-DA-te kon-MI-go', tags: ['연습', '연결'], difficulty: 2 },
  s4_06_3: { id: 's4_06_3', spanish: 'No te vayas sola.', korean: '혼자 가지 마.', english: "Don't go on your own.", chinese: '不要一个人走。', pronunciation: 'no te VA-yas SO-la', tags: ['연습', '연결', '교정'], difficulty: 2 },

  // ----- Lesson 7: 타이밍 -----
  s4_07_1: { id: 's4_07_1', spanish: 'Entraste antes.', korean: '너무 일찍 들어왔어.', english: 'You came in early.', chinese: '你进早了。', pronunciation: 'en-TRAS-te AN-tes', tags: ['연습', '타이밍'], difficulty: 2 },
  s4_07_2: { id: 's4_07_2', spanish: 'Esperá un poco más.', korean: '조금만 더 기다려.', english: 'Wait a bit more.', chinese: '再等一下。', pronunciation: 'es-pe-RÁ un PO-ko más', tags: ['연습', '타이밍'], difficulty: 2 },
  s4_07_3: { id: 's4_07_3', spanish: 'Ahora sí, justo ahí.', korean: '이제 맞아, 딱 거기.', english: 'Now yes, right there.', chinese: '现在对了，就是那里。', pronunciation: 'a-O-ra SÍ, HUS-to a-Í', tags: ['연습', '타이밍', '긍정'], difficulty: 2 },

  // ----- Lesson 8: 감정 표현 -----
  s4_08_1: { id: 's4_08_1', spanish: 'Estoy nervioso.', korean: '나 긴장돼.', english: "I'm nervous.", chinese: '我很紧张。', pronunciation: 'es-TOI ner-VIO-so', tags: ['연습', '감정'], difficulty: 1 },
  s4_08_2: { id: 's4_08_2', spanish: 'Me siento más cómodo.', korean: '더 편해졌어.', english: 'I feel more comfortable.', chinese: '我感觉更舒服了。', pronunciation: 'me SIEN-to más KÓ-mo-do', tags: ['연습', '감정'], difficulty: 2 },
  s4_08_3: { id: 's4_08_3', spanish: 'Fue divertido.', korean: '재밌었어.', english: 'It was fun.', chinese: '很有趣。', pronunciation: 'fue di-ver-TI-do', tags: ['연습', '감정'], difficulty: 1 },

  // ----- Lesson 9: 서로 피드백 -----
  s4_09_1: { id: 's4_09_1', spanish: 'Estuvo muy bien.', korean: '아주 좋았어.', english: 'It was very good.', chinese: '非常好。', pronunciation: 'es-TU-vo mui BIEN', tags: ['연습', '피드백'], difficulty: 1 },
  s4_09_2: { id: 's4_09_2', spanish: 'Sentí algo raro.', korean: '뭔가 이상하게 느껴졌어.', english: 'I felt something weird.', chinese: '我感觉有点奇怪。', pronunciation: 'sen-TÍ AL-go RA-ro', tags: ['연습', '피드백'], difficulty: 2 },
  s4_09_3: { id: 's4_09_3', spanish: '¿Probamos de nuevo?', korean: '다시 해볼까?', english: 'Shall we try again?', chinese: '我们再试一次？', pronunciation: 'pro-BA-mos de NUE-vo?', tags: ['연습', '피드백'], difficulty: 2 },

  // ----- Lesson 10: 진전 대화 -----
  s4_10_1: { id: 's4_10_1', spanish: 'Estoy mejorando.', korean: '나 나아지고 있어.', english: "I'm improving.", chinese: '我在进步。', pronunciation: 'es-TOI me-ho-RAN-do', tags: ['연습', '동기부여'], difficulty: 2 },
  s4_10_2: { id: 's4_10_2', spanish: 'Antes no podía.', korean: '전에는 못 했어.', english: "Before I couldn't.", chinese: '以前我不行。', pronunciation: 'AN-tes no po-DÍ-a', tags: ['연습', '동기부여'], difficulty: 2 },
  s4_10_3: { id: 's4_10_3', spanish: 'Cada vez mejor.', korean: '갈수록 좋아져.', english: 'Better every time.', chinese: '每次都更好。', pronunciation: 'KA-da VES me-HOR', tags: ['연습', '동기부여'], difficulty: 1 },

  // ----- Lesson 11: 파트너 교체 인사 -----
  s4_11_1: { id: 's4_11_1', spanish: '¿Cambiamos?', korean: '바꿀까요?', english: 'Shall we switch?', chinese: '换一下？', pronunciation: 'kam-BIA-mos?', tags: ['수업', '교체'], difficulty: 1 },
  s4_11_2: { id: 's4_11_2', spanish: 'Fue un placer.', korean: '즐거웠어요.', english: 'It was a pleasure.', chinese: '很高兴。', pronunciation: 'fue un pla-SER', tags: ['수업', '교체', '인사'], difficulty: 1 },
  s4_11_3: { id: 's4_11_3', spanish: 'Gracias por bailar conmigo.', korean: '같이 춰줘서 고마워요.', english: 'Thank you for dancing with me.', chinese: '谢谢你和我跳舞。', pronunciation: 'GRA-sias por bai-LAR kon-MI-go', tags: ['수업', '교체', '인사'], difficulty: 2 },

  // ----- Lesson 12: 연습 역할극 -----
  s4_12_1: { id: 's4_12_1', spanish: '¿Así está mejor?', korean: '이게 더 나아요?', english: 'Is this better?', chinese: '这样好一点吗？', pronunciation: 'a-SÍ es-TÁ me-HOR?', tags: ['연습', '역할극'], difficulty: 1 },
  s4_12_2: { id: 's4_12_2', spanish: 'Sí, se siente mejor.', korean: '응, 느낌이 더 좋아.', english: 'Yes, it feels better.', chinese: '对，感觉更好。', pronunciation: 'SÍ, se SIEN-te me-HOR', tags: ['연습', '역할극'], difficulty: 2 },
  s4_12_3: { id: 's4_12_3', spanish: 'Probemos otra vez.', korean: '한 번 더 해보자.', english: "Let's try again.", chinese: '再试一次。', pronunciation: 'pro-BE-mos O-tra VES', tags: ['연습', '역할극'], difficulty: 1 },

  // =====================================================
  // LEVEL 5: Sobrevivir en la milonga (밀롱가 서바이벌) — 16 lessons
  // =====================================================

  // ----- Lesson 1: 밀롱가 도착 -----
  s5_01_1: { id: 's5_01_1', spanish: 'Buenas noches.', korean: '안녕하세요 (저녁 인사).', english: 'Good evening.', chinese: '晚上好。', pronunciation: 'BUE-nas NO-ches', tags: ['밀롱가', '인사'], difficulty: 1 },
  s5_01_2: { id: 's5_01_2', spanish: '¿Hay lugar?', korean: '자리 있어요?', english: 'Is there room?', chinese: '有位置吗？', pronunciation: 'ai lu-GAR?', tags: ['밀롱가', '자리'], difficulty: 1 },
  s5_01_3: { id: 's5_01_3', spanish: '¿Dónde me puedo sentar?', korean: '어디 앉을 수 있어요?', english: 'Where can I sit?', chinese: '我可以坐哪里？', pronunciation: 'DÓN-de me PUE-do sen-TAR?', tags: ['밀롱가', '자리'], difficulty: 2 },

  // ----- Lesson 2: 처음 만남 -----
  s5_02_1: { id: 's5_02_1', spanish: 'Es un placer.', korean: '반갑습니다.', english: "It's a pleasure.", chinese: '很高兴认识你。', pronunciation: 'es un pla-SER', tags: ['밀롱가', '인사'], difficulty: 1 },
  s5_02_2: { id: 's5_02_2', spanish: 'Soy de Corea.', korean: '한국에서 왔어요.', english: "I'm from Korea.", chinese: '我来自韩国。', pronunciation: 'soi de ko-RE-a', tags: ['밀롱가', '자기소개'], difficulty: 1 },
  s5_02_3: { id: 's5_02_3', spanish: 'Es mi primera vez acá.', korean: '여기 처음이에요.', english: "It's my first time here.", chinese: '这是我第一次来这里。', pronunciation: 'es mi pri-ME-ra VES a-KÁ', tags: ['밀롱가', '자기소개'], difficulty: 2 },

  // ----- Lesson 3: 카베세오 -----
  s5_03_1: { id: 's5_03_1', spanish: 'Te vi desde allá.', korean: '저쪽에서 봤어요.', english: 'I saw you from over there.', chinese: '我从那边看到你了。', pronunciation: 'te VI DES-de a-YÁ', tags: ['밀롱가', '카베세오'], difficulty: 2 },
  s5_03_2: { id: 's5_03_2', spanish: 'Nos cruzamos la mirada.', korean: '우리 눈이 마주쳤어요.', english: 'Our eyes met.', chinese: '我们目光交汇了。', pronunciation: 'nos kru-SA-mos la mi-RA-da', tags: ['밀롱가', '카베세오'], difficulty: 3 },
  s5_03_3: { id: 's5_03_3', spanish: 'Sí, te entendí.', korean: '네, 알겠어요.', english: 'Yes, I understood you.', chinese: '是的，我明白了。', pronunciation: 'SÍ, te en-ten-DÍ', tags: ['밀롱가', '카베세오'], difficulty: 1 },

  // ----- Lesson 4: 춤 신청 -----
  s5_04_1: { id: 's5_04_1', spanish: '¿Querés bailar esta tanda?', korean: '이 탄다 같이 출래요?', english: 'Want to dance this tanda?', chinese: '你想跳这一组吗？', pronunciation: 'ke-RÉS bai-LAR ES-ta TAN-da?', tags: ['밀롱가', '신청'], difficulty: 2 },
  s5_04_2: { id: 's5_04_2', spanish: 'Dale, vamos.', korean: '좋아요, 가요.', english: "Sure, let's go.", chinese: '好的，走吧。', pronunciation: 'DA-le, VA-mos', tags: ['밀롱가', '신청'], difficulty: 1 },
  s5_04_3: { id: 's5_04_3', spanish: 'Con mucho gusto.', korean: '기꺼이요.', english: 'With great pleasure.', chinese: '非常乐意。', pronunciation: 'kon MU-cho GUS-to', tags: ['밀롱가', '신청'], difficulty: 1 },

  // ----- Lesson 5: 춤 도중 배려 -----
  s5_05_1: { id: 's5_05_1', spanish: '¿Estás cómoda?', korean: '편해요?', english: 'Are you comfortable?', chinese: '你舒服吗？', pronunciation: 'es-TÁS KÓ-mo-da?', tags: ['밀롱가', '배려'], difficulty: 1 },
  s5_05_2: { id: 's5_05_2', spanish: 'Perdón, fue mi culpa.', korean: '미안, 내 잘못이야.', english: 'Sorry, it was my fault.', chinese: '对不起，是我的错。', pronunciation: 'per-DÓN, fue mi KUL-pa', tags: ['밀롱가', '배려'], difficulty: 2 },
  s5_05_3: { id: 's5_05_3', spanish: 'Tranquilo, no pasa nada.', korean: '괜찮아, 아무 일도 아니야.', english: "Relax, it's nothing.", chinese: '放松，没关系。', pronunciation: 'tran-KI-lo, no PA-sa NA-da', tags: ['밀롱가', '배려'], difficulty: 1 },

  // ----- Lesson 6: 음악 대화 -----
  s5_06_1: { id: 's5_06_1', spanish: '¿De qué orquesta es?', korean: '이거 어느 오케스트라예요?', english: 'Which orchestra is this?', chinese: '这是哪个乐队的？', pronunciation: 'de KÉ or-KES-ta ES?', tags: ['밀롱가', '음악'], difficulty: 2 },
  s5_06_2: { id: 's5_06_2', spanish: 'Me encanta esta canción.', korean: '이 노래 너무 좋아요.', english: 'I love this song.', chinese: '我很喜欢这首歌。', pronunciation: 'me en-KAN-ta ES-ta kan-SIÓN', tags: ['밀롱가', '음악'], difficulty: 2 },
  s5_06_3: { id: 's5_06_3', spanish: 'Me gusta bailar vals.', korean: '왈츠 추는 게 좋아요.', english: 'I like dancing vals.', chinese: '我喜欢跳华尔兹。', pronunciation: 'me GUS-ta bai-LAR VALS', tags: ['밀롱가', '음악'], difficulty: 2 },

  // ----- Lesson 7: 칭찬 -----
  s5_07_1: { id: 's5_07_1', spanish: 'Tu abrazo es muy cómodo.', korean: '당신 아브라소 너무 편해요.', english: 'Your embrace is very comfortable.', chinese: '你的拥抱很舒服。', pronunciation: 'tu a-BRA-so es mui KÓ-mo-do', tags: ['밀롱가', '칭찬'], difficulty: 2 },
  s5_07_2: { id: 's5_07_2', spanish: 'Bailás con mucho sentimiento.', korean: '감정을 담아서 추시네요.', english: 'You dance with a lot of feeling.', chinese: '你跳舞很有感情。', pronunciation: 'bai-LÁS kon MU-cho sen-ti-MIEN-to', tags: ['밀롱가', '칭찬'], difficulty: 3 },
  s5_07_3: { id: 's5_07_3', spanish: 'Me gusta cómo caminás.', korean: '걷는 게 좋아요.', english: 'I like how you walk.', chinese: '我喜欢你走路的方式。', pronunciation: 'me GUS-ta KÓ-mo ka-mi-NÁS', tags: ['밀롱가', '칭찬'], difficulty: 2 },

  // ----- Lesson 8: 바닥 문제 -----
  s5_08_1: { id: 's5_08_1', spanish: 'Cuidado.', korean: '조심.', english: 'Careful.', chinese: '小心。', pronunciation: 'kui-DA-do', tags: ['밀롱가', '바닥'], difficulty: 1 },
  s5_08_2: { id: 's5_08_2', spanish: 'Perdón, ¿te pisé?', korean: '미안, 밟았어요?', english: 'Sorry, did I step on you?', chinese: '对不起，我踩到你了吗？', pronunciation: 'per-DÓN, te pi-SÉ?', tags: ['밀롱가', '바닥'], difficulty: 2 },
  s5_08_3: { id: 's5_08_3', spanish: 'La pista está muy llena.', korean: '바닥이 꽉 찼네요.', english: 'The floor is very full.', chinese: '舞池很满。', pronunciation: 'la PIS-ta es-TÁ mui YE-na', tags: ['밀롱가', '바닥'], difficulty: 2 },

  // ----- Lesson 9: 탄다 마무리 -----
  s5_09_1: { id: 's5_09_1', spanish: 'Gracias por la tanda.', korean: '탄다 고마워요.', english: 'Thanks for the tanda.', chinese: '谢谢这一组舞。', pronunciation: 'GRA-sias por la TAN-da', tags: ['밀롱가', '감사'], difficulty: 1 },
  s5_09_2: { id: 's5_09_2', spanish: 'Fue muy lindo.', korean: '너무 좋았어요.', english: 'It was very nice.', chinese: '非常棒。', pronunciation: 'fue mui LIN-do', tags: ['밀롱가', '감사'], difficulty: 1 },
  s5_09_3: { id: 's5_09_3', spanish: '¿Te acompaño a tu mesa?', korean: '자리까지 모셔다 줄까요?', english: 'Shall I walk you to your table?', chinese: '我送你回座位？', pronunciation: 'te a-kom-PA-ño a tu ME-sa?', tags: ['밀롱가', '예절'], difficulty: 3 },

  // ----- Lesson 10: 정중한 거절 -----
  s5_10_1: { id: 's5_10_1', spanish: 'Ahora estoy descansando.', korean: '지금 쉬고 있어요.', english: "I'm resting now.", chinese: '我现在在休息。', pronunciation: 'a-O-ra es-TOI des-kan-SAN-do', tags: ['밀롱가', '거절'], difficulty: 2 },
  s5_10_2: { id: 's5_10_2', spanish: 'Quizás más tarde.', korean: '나중에요.', english: 'Maybe later.', chinese: '也许一会儿。', pronunciation: 'ki-SÁS más TAR-de', tags: ['밀롱가', '거절'], difficulty: 1 },
  s5_10_3: { id: 's5_10_3', spanish: 'Gracias igual.', korean: '그래도 고마워요.', english: 'Thanks anyway.', chinese: '还是谢谢。', pronunciation: 'GRA-sias i-GUAL', tags: ['밀롱가', '거절'], difficulty: 1 },

  // ----- Lesson 11: 휴식 -----
  s5_11_1: { id: 's5_11_1', spanish: '¿Descansamos?', korean: '쉴까요?', english: 'Shall we rest?', chinese: '我们休息一下？', pronunciation: 'des-kan-SA-mos?', tags: ['밀롱가', '휴식'], difficulty: 1 },
  s5_11_2: { id: 's5_11_2', spanish: 'Voy a tomar algo.', korean: '뭐 마시러 갈게요.', english: "I'm going to get a drink.", chinese: '我去喝点东西。', pronunciation: 'voi a to-MAR AL-go', tags: ['밀롱가', '휴식'], difficulty: 2 },
  s5_11_3: { id: 's5_11_3', spanish: '¿Querés agua?', korean: '물 줄까요?', english: 'Want some water?', chinese: '你要水吗？', pronunciation: 'ke-RÉS A-gua?', tags: ['밀롱가', '휴식'], difficulty: 1 },

  // ----- Lesson 12: 한 탄다 더 -----
  s5_12_1: { id: 's5_12_1', spanish: '¿Otra tanda?', korean: '한 탄다 더?', english: 'Another tanda?', chinese: '再来一组？', pronunciation: 'O-tra TAN-da?', tags: ['밀롱가', '재신청'], difficulty: 1 },
  s5_12_2: { id: 's5_12_2', spanish: 'Si querés, seguimos.', korean: '원하면 계속해요.', english: 'If you want, we continue.', chinese: '如果你想，我们继续。', pronunciation: 'si ke-RÉS, se-GI-mos', tags: ['밀롱가', '재신청'], difficulty: 2 },
  s5_12_3: { id: 's5_12_3', spanish: 'Con vos siempre.', korean: '당신이라면 언제든지.', english: 'With you, always.', chinese: '和你在一起，永远。', pronunciation: 'kon VOS SIEM-pre', tags: ['밀롱가', '재신청', '정서'], difficulty: 2 },

  // ----- Lesson 13: 소셜 대화 -----
  s5_13_1: { id: 's5_13_1', spanish: '¿Hace mucho que bailás?', korean: '춤 춘 지 오래됐어요?', english: 'Have you been dancing long?', chinese: '你跳舞很久了吗？', pronunciation: 'A-se MU-cho ke bai-LÁS?', tags: ['밀롱가', '소셜'], difficulty: 2 },
  s5_13_2: { id: 's5_13_2', spanish: '¿De dónde sos?', korean: '어디서 오셨어요?', english: 'Where are you from?', chinese: '你从哪里来？', pronunciation: 'de DÓN-de SOS?', tags: ['밀롱가', '소셜'], difficulty: 1 },
  s5_13_3: { id: 's5_13_3', spanish: 'Me gusta esta milonga.', korean: '이 밀롱가 좋아요.', english: 'I like this milonga.', chinese: '我喜欢这个milonga。', pronunciation: 'me GUS-ta ES-ta mi-LON-ga', tags: ['밀롱가', '소셜'], difficulty: 1 },

  // ----- Lesson 14: 플로어 예절 -----
  s5_14_1: { id: 's5_14_1', spanish: 'Cuidemos la ronda.', korean: '론다를 지키자.', english: "Let's keep the ronda.", chinese: '我们遵守ronda。', pronunciation: 'kui-DE-mos la RON-da', tags: ['밀롱가', '예절'], difficulty: 2 },
  s5_14_2: { id: 's5_14_2', spanish: 'Hay poco espacio.', korean: '공간이 좁아요.', english: "There's little space.", chinese: '空间很小。', pronunciation: 'ai PO-ko es-PA-sio', tags: ['밀롱가', '예절'], difficulty: 1 },
  s5_14_3: { id: 's5_14_3', spanish: 'No bloquees el paso.', korean: '길을 막지 마세요.', english: "Don't block the way.", chinese: '不要挡路。', pronunciation: 'no blo-KE-es el PA-so', tags: ['밀롱가', '예절'], difficulty: 2 },

  // ----- Lesson 15: 작별 -----
  s5_15_1: { id: 's5_15_1', spanish: 'Me voy yendo.', korean: '저 이제 갈게요.', english: "I'm heading out.", chinese: '我该走了。', pronunciation: 'me voi YEN-do', tags: ['밀롱가', '작별'], difficulty: 2 },
  s5_15_2: { id: 's5_15_2', spanish: 'Fue una noche hermosa.', korean: '아름다운 밤이었어요.', english: 'It was a beautiful night.', chinese: '这是美好的一晚。', pronunciation: 'fue U-na NO-che er-MO-sa', tags: ['밀롱가', '작별'], difficulty: 2 },
  s5_15_3: { id: 's5_15_3', spanish: 'Nos vemos la próxima.', korean: '다음에 봐요.', english: 'See you next time.', chinese: '下次见。', pronunciation: 'nos VE-mos la PROK-si-ma', tags: ['밀롱가', '작별'], difficulty: 2 },

  // ----- Lesson 16: 밀롱가 풀 역할극 -----
  s5_16_1: { id: 's5_16_1', spanish: '¿Bailamos?', korean: '출래요?', english: 'Shall we dance?', chinese: '我们跳舞吗？', pronunciation: 'bai-LA-mos?', tags: ['밀롱가', '역할극'], difficulty: 1 },
  s5_16_2: { id: 's5_16_2', spanish: 'Gracias, disfruté mucho.', korean: '고마워요, 정말 즐거웠어요.', english: 'Thank you, I enjoyed it a lot.', chinese: '谢谢，我非常享受。', pronunciation: 'GRA-sias, dis-fru-TÉ MU-cho', tags: ['밀롱가', '역할극'], difficulty: 2 },
  s5_16_3: { id: 's5_16_3', spanish: 'Nos vemos luego.', korean: '나중에 봐요.', english: 'See you later.', chinese: '回头见。', pronunciation: 'nos VE-mos LUE-go', tags: ['밀롱가', '역할극'], difficulty: 1 },
};

// 기본 문장 + 확장 문장 병합
export const sentences: Record<string, Sentence> = {
  ...baseSentences,
  ...sentencesL1Extra,
  ...sentencesL2Extra,
  ...sentencesL3Extra,
  ...sentencesL4Extra,
  ...sentencesL5Extra,
};
