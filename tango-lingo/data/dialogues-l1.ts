export interface DialogueExample {
  id: string;
  lessonId: string;
  situation: string;
  lines: { speaker: string; spanish: string; korean: string; }[];
}

/**
 * Level 1 대화 예시 — 레슨당 2개 (2~3줄), 실전 탱고 수업 상황
 */
export const dialoguesL1: Record<string, DialogueExample> = {

  // ----- Lesson 1: 첫 인사 -----
  d1_01_1: {
    id: 'd1_01_1', lessonId: 'les1_01', situation: '수업장 입구에서 선생님과 인사',
    lines: [
      { speaker: 'Profesor', spanish: 'Hola, ¿todo bien?', korean: '안녕, 잘 지내?' },
      { speaker: 'Alumno', spanish: 'Sí, todo bien. Gracias.', korean: '응, 잘 지내. 고마워요.' },
      { speaker: 'Profesor', spanish: 'Bienvenidos a la clase.', korean: '수업에 오신 걸 환영해요.' },
    ],
  },
  d1_01_2: {
    id: 'd1_01_2', lessonId: 'les1_01', situation: '다른 학생에게 처음 인사',
    lines: [
      { speaker: 'Alumno A', spanish: 'Hola, mucho gusto. ¿Es tu primera vez?', korean: '안녕, 반가워. 처음이야?' },
      { speaker: 'Alumno B', spanish: 'Sí, soy nuevo. ¿Y vos?', korean: '응, 처음이야. 너는?' },
    ],
  },

  // ----- Lesson 2: 얼굴과 시선 -----
  d1_02_1: {
    id: 'd1_02_1', lessonId: 'les1_02', situation: '선생님이 얼굴 긴장을 풀어줄 때',
    lines: [
      { speaker: 'Profesor', spanish: 'Relajá la cara. No mires al piso.', korean: '얼굴 힘 빼. 바닥 보지 마.' },
      { speaker: 'Alumno', spanish: '¿Así está bien?', korean: '이렇게 하면 돼요?' },
      { speaker: 'Profesor', spanish: 'Sí, sonreí un poco.', korean: '응, 살짝 미소 지어.' },
    ],
  },
  d1_02_2: {
    id: 'd1_02_2', lessonId: 'les1_02', situation: '파트너와 시선 연습',
    lines: [
      { speaker: 'Profesor', spanish: 'Mirá a tu pareja. Conectá con los ojos.', korean: '파트너를 봐. 눈으로 연결해.' },
      { speaker: 'Alumno', spanish: 'Me da vergüenza.', korean: '부끄러워요.' },
      { speaker: 'Profesor', spanish: 'Está todo bien, es normal.', korean: '다 괜찮아, 정상이야.' },
    ],
  },

  // ----- Lesson 3: 어깨와 목 -----
  d1_03_1: {
    id: 'd1_03_1', lessonId: 'les1_03', situation: '선생님이 어깨 자세를 교정',
    lines: [
      { speaker: 'Profesor', spanish: 'Bajá los hombros. Soltá.', korean: '어깨 내려. 풀어.' },
      { speaker: 'Alumno', spanish: '¿Así?', korean: '이렇게요?' },
      { speaker: 'Profesor', spanish: 'Bien, así está mejor.', korean: '좋아, 그게 낫다.' },
    ],
  },
  d1_03_2: {
    id: 'd1_03_2', lessonId: 'les1_03', situation: '목과 등 자세 확인',
    lines: [
      { speaker: 'Profesor', spanish: 'El cuello largo. Espalda recta.', korean: '목은 길게. 등은 곧게.' },
      { speaker: 'Alumno', spanish: 'Me cuesta mantenerlo.', korean: '유지하기 힘들어요.' },
    ],
  },

  // ----- Lesson 4: 팔과 손의 연결 -----
  d1_04_1: {
    id: 'd1_04_1', lessonId: 'les1_04', situation: '손 위치를 잡아줄 때',
    lines: [
      { speaker: 'Profesor', spanish: 'La mano izquierda acá. Livianito.', korean: '왼손은 여기. 가볍게.' },
      { speaker: 'Alumno', spanish: '¿No agarro fuerte?', korean: '세게 안 잡아요?' },
      { speaker: 'Profesor', spanish: 'No, ofrecé la mano así.', korean: '아니, 이렇게 손을 내밀어.' },
    ],
  },
  d1_04_2: {
    id: 'd1_04_2', lessonId: 'les1_04', situation: '팔 긴장 교정',
    lines: [
      { speaker: 'Profesor', spanish: 'Aflojá los brazos. No empujes con la mano.', korean: '팔 힘 풀어. 손으로 밀지 마.' },
      { speaker: 'Alumno', spanish: 'Perdón, estoy nervioso.', korean: '미안해요, 긴장돼요.' },
    ],
  },

  // ----- Lesson 5: 힘 빼기와 호흡 -----
  d1_05_1: {
    id: 'd1_05_1', lessonId: 'les1_05', situation: '호흡 연습 시작',
    lines: [
      { speaker: 'Profesor', spanish: 'Cerrá los ojos un momento. Inhalá.', korean: '잠깐 눈 감아. 들이쉬어.' },
      { speaker: 'Alumno', spanish: '...', korean: '...' },
      { speaker: 'Profesor', spanish: 'Exhalá. Ahora sí, mucho mejor.', korean: '내쉬어. 이제 훨씬 나아.' },
    ],
  },
  d1_05_2: {
    id: 'd1_05_2', lessonId: 'les1_05', situation: '긴장 푸는 격려',
    lines: [
      { speaker: 'Profesor', spanish: 'No tengas miedo. Disfrutá.', korean: '무서워하지 마. 즐겨.' },
      { speaker: 'Alumno', spanish: 'Gracias, me siento mejor.', korean: '고마워요, 좀 나아요.' },
    ],
  },

  // ----- Lesson 6: 중심과 축 -----
  d1_06_1: {
    id: 'd1_06_1', lessonId: 'les1_06', situation: '축 세우기 연습',
    lines: [
      { speaker: 'Profesor', spanish: 'Crecé para arriba. Empujá el piso con los pies.', korean: '위로 자라. 발로 바닥을 밀어.' },
      { speaker: 'Alumno', spanish: '¿Así está bien?', korean: '이렇게 하면 돼요?' },
      { speaker: 'Profesor', spanish: 'Perfecto, ahí tenés el eje.', korean: '완벽해, 거기가 축이야.' },
    ],
  },
  d1_06_2: {
    id: 'd1_06_2', lessonId: 'les1_06', situation: '축 교정',
    lines: [
      { speaker: 'Profesor', spanish: 'No te vayas para adelante. Quedate arriba.', korean: '앞으로 쏠리지 마. 위에 머물러.' },
      { speaker: 'Alumno', spanish: 'Es difícil.', korean: '어려워요.' },
    ],
  },

  // ----- Lesson 7: 체중 이동 -----
  d1_07_1: {
    id: 'd1_07_1', lessonId: 'les1_07', situation: '무게 이동 기본 연습',
    lines: [
      { speaker: 'Profesor', spanish: 'Empezá con el peso a la derecha. Ahora pasá a la izquierda.', korean: '무게를 오른쪽에서 시작해. 이제 왼쪽으로 넘겨.' },
      { speaker: 'Alumno', spanish: '¿Despacio?', korean: '천천히요?' },
      { speaker: 'Profesor', spanish: 'Sí, despacio, sin apuro.', korean: '응, 천천히, 서두르지 않고.' },
    ],
  },
  d1_07_2: {
    id: 'd1_07_2', lessonId: 'les1_07', situation: '무게 이동 교정',
    lines: [
      { speaker: 'Profesor', spanish: 'Pasá completamente. No te quedes a mitad.', korean: '완전히 넘겨. 중간에 걸치지 마.' },
      { speaker: 'Alumno', spanish: 'Muy bien, así.', korean: '아주 좋아, 그렇게.' },
    ],
  },

  // ----- Lesson 8: 아브라소 -----
  d1_08_1: {
    id: 'd1_08_1', lessonId: 'les1_08', situation: '첫 아브라소 시도',
    lines: [
      { speaker: 'Profesor', spanish: 'Primero, abrazo abierto. Acercá el pecho.', korean: '먼저, 열린 아브라소. 가슴을 가까이.' },
      { speaker: 'Alumno', spanish: '¿Te molesta si me acerco más?', korean: '더 가까이 가도 괜찮아?' },
      { speaker: 'Profesor', spanish: 'No, está bien. El abrazo se arma de a poco.', korean: '아니, 괜찮아. 아브라소는 천천히 만들어 가는 거야.' },
    ],
  },
  d1_08_2: {
    id: 'd1_08_2', lessonId: 'les1_08', situation: '포옹 자세 확인',
    lines: [
      { speaker: 'Profesor', spanish: 'La mano en la espalda. Rodeá con el brazo.', korean: '손은 등에. 팔로 감싸.' },
      { speaker: 'Alumno', spanish: '¿Estás cómoda así?', korean: '이렇게 하면 편해?' },
    ],
  },

  // ----- Lesson 9: 연결 느끼기 -----
  d1_09_1: {
    id: 'd1_09_1', lessonId: 'les1_09', situation: '연결 느끼기 순간',
    lines: [
      { speaker: 'Profesor', spanish: 'Respiremos juntos. Escuchá la música juntos.', korean: '같이 숨 쉬자. 같이 음악을 들어.' },
      { speaker: 'Alumno', spanish: '¿No pienses, sentí?', korean: '생각하지 말고, 느끼라고요?' },
      { speaker: 'Profesor', spanish: 'Exacto. Eso es bailar.', korean: '맞아. 그게 춤추는 거야.' },
    ],
  },
  d1_09_2: {
    id: 'd1_09_2', lessonId: 'les1_09', situation: '파트너와 의도 기다리기',
    lines: [
      { speaker: 'Profesor', spanish: 'Esperá la intención. No te adelantes.', korean: '의도를 기다려. 앞서가지 마.' },
      { speaker: 'Alumno', spanish: 'Ahí, ¿sentiste eso?', korean: '거기, 그거 느꼈어?' },
    ],
  },

  // ----- Lesson 10: 첫 수업 역할극 -----
  d1_10_1: {
    id: 'd1_10_1', lessonId: 'les1_10', situation: '수업 마무리 복습',
    lines: [
      { speaker: 'Profesor', spanish: 'Repasemos lo de hoy. ¿Qué fue lo más difícil?', korean: '오늘 한 것 복습하자. 가장 어려웠던 게 뭐야?' },
      { speaker: 'Alumno', spanish: 'El eje. Me cuesta.', korean: '축이요. 힘들어요.' },
      { speaker: 'Profesor', spanish: 'Practicá en casa. La semana que viene seguimos.', korean: '집에서 연습해. 다음 주에 계속하자.' },
    ],
  },
  d1_10_2: {
    id: 'd1_10_2', lessonId: 'les1_10', situation: '첫 수업 끝 인사',
    lines: [
      { speaker: 'Profesor', spanish: '¡Muy bien la primera clase!', korean: '첫 수업 잘했어!' },
      { speaker: 'Alumno', spanish: 'Gracias, lo disfruté mucho.', korean: '고마워요, 정말 즐거웠어요.' },
    ],
  },
};
