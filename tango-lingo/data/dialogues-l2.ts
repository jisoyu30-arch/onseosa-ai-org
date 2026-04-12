export interface DialogueExample {
  id: string;
  lessonId: string;
  situation: string;
  lines: { speaker: string; spanish: string; korean: string; }[];
}

export const dialoguesL2: Record<string, DialogueExample> = {

  // ----- L2-01: 앞으로 걷기 -----
  d2_01_1: { id: 'd2_01_1', lessonId: 'les2_01', situation: '선생님이 걷기 자세를 교정해줄 때',
    lines: [
      { speaker: 'Profesor', spanish: 'Caminá derecho, sin mirar el piso.', korean: '바닥 보지 말고 똑바로 걸어.' },
      { speaker: 'Alumno', spanish: '¿Así está bien?', korean: '이렇게요?' },
      { speaker: 'Profesor', spanish: 'Sí, el pecho te lleva. Muy bien.', korean: '응, 가슴이 너를 데려가. 아주 좋아.' },
    ],
  },
  d2_01_2: { id: 'd2_01_2', lessonId: 'les2_01', situation: '파트너끼리 걷기 연습할 때',
    lines: [
      { speaker: 'A', spanish: 'Empujá el piso con cada paso.', korean: '매 걸음마다 바닥을 밀어.' },
      { speaker: 'B', spanish: 'Es más difícil de lo que pensé.', korean: '생각보다 어렵네.' },
    ],
  },

  // ----- L2-02: 옆으로 이동 -----
  d2_02_1: { id: 'd2_02_1', lessonId: 'les2_02', situation: '옆걸음을 처음 배울 때',
    lines: [
      { speaker: 'Profesor', spanish: 'Abrí al costado. Controlá la apertura.', korean: '옆으로 벌려. 폭을 조절해.' },
      { speaker: 'Alumno', spanish: '¿Más grande o más chico?', korean: '더 크게요, 더 작게요?' },
      { speaker: 'Profesor', spanish: 'Más chico. El paso es suave.', korean: '더 작게. 걸음은 부드럽게.' },
    ],
  },
  d2_02_2: { id: 'd2_02_2', lessonId: 'les2_02', situation: '축을 잃지 않는 연습',
    lines: [
      { speaker: 'A', spanish: 'Abrí sin perder el eje.', korean: '축을 잃지 않고 벌려.' },
      { speaker: 'B', spanish: 'Estoy tratando, pero me caigo.', korean: '노력 중인데 쓰러져.' },
    ],
  },

  // ----- L2-03: 뒤로 이동 -----
  d2_03_1: { id: 'd2_03_1', lessonId: 'les2_03', situation: '후진 걸음 교정',
    lines: [
      { speaker: 'Profesor', spanish: 'Caminá para atrás, despacio y seguro.', korean: '뒤로 걸어, 천천히 안정적으로.' },
      { speaker: 'Alumno', spanish: 'Me da un poco de miedo.', korean: '좀 무서워요.' },
      { speaker: 'Profesor', spanish: 'No tengas miedo. Buscá la tierra con el pie.', korean: '무서워하지 마. 발로 땅을 찾아.' },
    ],
  },
  d2_03_2: { id: 'd2_03_2', lessonId: 'les2_03', situation: '파트너 연습 중 후진',
    lines: [
      { speaker: 'A', spanish: 'Llevá el peso atrás.', korean: '무게를 뒤로 보내.' },
      { speaker: 'B', spanish: 'Paso chiquito, ¿verdad?', korean: '작은 걸음이지?' },
    ],
  },

  // ----- L2-04: 멈추기 -----
  d2_04_1: { id: 'd2_04_1', lessonId: 'les2_04', situation: '멈춤의 의미를 배울 때',
    lines: [
      { speaker: 'Profesor', spanish: 'La pausa tiene peso. Disfrutá el silencio.', korean: '멈춤에도 무게가 있어. 침묵을 즐겨.' },
      { speaker: 'Alumno', spanish: '¿Cuánto tiempo me quedo?', korean: '얼마나 있어요?' },
      { speaker: 'Profesor', spanish: 'Esperá con el cuerpo activo.', korean: '몸을 활성화한 채로 기다려.' },
    ],
  },
  d2_04_2: { id: 'd2_04_2', lessonId: 'les2_04', situation: '음악에 맞춰 멈추기',
    lines: [
      { speaker: 'A', spanish: 'Pará cuando la música para.', korean: '음악이 멈추면 멈춰.' },
      { speaker: 'B', spanish: 'Listo, ahora sí, salí.', korean: '준비됐어, 이제 출발해.' },
    ],
  },

  // ----- L2-05: 리드와 팔로우 -----
  d2_05_1: { id: 'd2_05_1', lessonId: 'les2_05', situation: '리드와 팔로우 개념을 처음 들을 때',
    lines: [
      { speaker: 'Profesor', spanish: 'Proponé, no empujes. Es un diálogo.', korean: '제안해, 밀지 마. 대화야.' },
      { speaker: 'Alumno', spanish: '¿Y cómo sabe mi pareja?', korean: '파트너가 어떻게 알아요?' },
      { speaker: 'Profesor', spanish: 'Esperá la respuesta. Bailar es escucharse.', korean: '응답을 기다려. 춤은 서로 듣는 거야.' },
    ],
  },
  d2_05_2: { id: 'd2_05_2', lessonId: 'les2_05', situation: '리더가 팔로워에게',
    lines: [
      { speaker: 'A', spanish: 'El líder escucha también.', korean: '리더도 듣는 거야.' },
      { speaker: 'B', spanish: 'Sí, sentí la intención.', korean: '응, 의도를 느껴.' },
    ],
  },

  // ----- L2-06: 마르카 -----
  d2_06_1: { id: 'd2_06_1', lessonId: 'les2_06', situation: '손으로 리드하려는 습관을 교정할 때',
    lines: [
      { speaker: 'Profesor', spanish: 'Menos manos, más torso. La marca es clara.', korean: '손은 줄이고 몸통을 써. 마르카는 명확해.' },
      { speaker: 'Alumno', spanish: 'Es difícil no usar las manos.', korean: '손을 안 쓰기 어려워요.' },
      { speaker: 'Profesor', spanish: 'Marcá con la respiración. Tu pareja lo va a sentir.', korean: '호흡으로 리드해. 파트너가 느낄 거야.' },
    ],
  },
  d2_06_2: { id: 'd2_06_2', lessonId: 'les2_06', situation: '마르카 연습 후 피드백',
    lines: [
      { speaker: 'A', spanish: 'No te apures en marcar.', korean: '리드를 서두르지 마.' },
      { speaker: 'B', spanish: 'Así, perfecto.', korean: '그렇게, 완벽해.' },
    ],
  },

  // ----- L2-07: 살리다 기초 -----
  d2_07_1: { id: 'd2_07_1', lessonId: 'les2_07', situation: '살리다를 시작하기 전',
    lines: [
      { speaker: 'Profesor', spanish: 'La salida es un acuerdo. Esperá a tu pareja.', korean: '살리다는 합의야. 파트너를 기다려.' },
      { speaker: 'Alumno', spanish: '¿Cuándo empiezo?', korean: '언제 시작해요?' },
      { speaker: 'Profesor', spanish: 'Respirá y salí. Que la salida sea suave.', korean: '숨 쉬고 출발해. 살리다는 부드럽게.' },
    ],
  },
  d2_07_2: { id: 'd2_07_2', lessonId: 'les2_07', situation: '파트너 연습 중 살리다',
    lines: [
      { speaker: 'A', spanish: 'Salí cuando estén listos.', korean: '둘 다 준비되면 출발해.' },
      { speaker: 'B', spanish: 'Listo, vamos.', korean: '준비됐어, 가자.' },
    ],
  },

  // ----- L2-08: 속도 조절 -----
  d2_08_1: { id: 'd2_08_1', lessonId: 'les2_08', situation: '속도 변화를 연습할 때',
    lines: [
      { speaker: 'Profesor', spanish: 'Jugá con la velocidad. Rápido y después lento.', korean: '속도를 가지고 놀아. 빠르게, 그다음 느리게.' },
      { speaker: 'Alumno', spanish: '¿Sigo la música?', korean: '음악을 따라가요?' },
      { speaker: 'Profesor', spanish: 'Sí. Cada canción tiene su tiempo.', korean: '응. 각 곡에는 고유의 템포가 있어.' },
    ],
  },
  d2_08_2: { id: 'd2_08_2', lessonId: 'les2_08', situation: '리듬 변주 연습',
    lines: [
      { speaker: 'A', spanish: 'Variá el ritmo. No todo es igual.', korean: '리듬을 바꿔. 다 똑같을 필요 없어.' },
      { speaker: 'B', spanish: 'Eso, así está bien.', korean: '그래, 그게 맞아.' },
    ],
  },

  // ----- L2-09: 리듬과 걷기 -----
  d2_09_1: { id: 'd2_09_1', lessonId: 'les2_09', situation: '음악 박자에 맞춰 걷기',
    lines: [
      { speaker: 'Profesor', spanish: 'Contá los tiempos. Uno, dos, tres, cuatro.', korean: '박자를 세어. 하나, 둘, 셋, 넷.' },
      { speaker: 'Alumno', spanish: '¿Camino en todos?', korean: '다 걸어요?' },
      { speaker: 'Profesor', spanish: 'Caminá en el tiempo fuerte. Dejá que el cuerpo responda.', korean: '강박에 걸어. 몸이 반응하게 둬.' },
    ],
  },
  d2_09_2: { id: 'd2_09_2', lessonId: 'les2_09', situation: '음악 연결 연습 후',
    lines: [
      { speaker: 'A', spanish: 'El cuerpo sigue la música.', korean: '몸이 음악을 따라.' },
      { speaker: 'B', spanish: '¿Sentís el compás?', korean: '박자 느껴져?' },
    ],
  },

  // ----- L2-10: 보폭 맞추기 -----
  d2_10_1: { id: 'd2_10_1', lessonId: 'les2_10', situation: '보폭을 줄이라는 교정',
    lines: [
      { speaker: 'Profesor', spanish: 'Paso natural. Como si caminaras en la calle.', korean: '자연스러운 걸음. 길에서 걷는 것처럼.' },
      { speaker: 'Alumno', spanish: '¿Así? ¿Más chico?', korean: '이렇게요? 더 작게요?' },
      { speaker: 'Profesor', spanish: 'Sin esfuerzo. Tu paso, tu estilo.', korean: '힘들이지 않고. 네 걸음, 네 스타일.' },
    ],
  },
  d2_10_2: { id: 'd2_10_2', lessonId: 'les2_10', situation: '바닥 적응 연습',
    lines: [
      { speaker: 'A', spanish: 'Adaptá tu paso al piso.', korean: '바닥에 맞춰 걸음을 조절해.' },
      { speaker: 'B', spanish: 'Mejor chiquito que grande.', korean: '크게보다 작게가 나아.' },
    ],
  },

  // ----- L2-11: 함께 걷기 -----
  d2_11_1: { id: 'd2_11_1', lessonId: 'les2_11', situation: '호흡 연결 연습',
    lines: [
      { speaker: 'Profesor', spanish: 'Respiremos juntos. Caminá al mismo tiempo.', korean: '같이 숨 쉬자. 같은 타이밍에 걸어.' },
      { speaker: 'Alumno', spanish: 'Es difícil sentir al otro.', korean: '상대를 느끼기 어려워요.' },
      { speaker: 'Profesor', spanish: 'Sentí el peso del otro. Juntos es mejor.', korean: '상대방의 무게를 느껴. 같이가 더 좋아.' },
    ],
  },
  d2_11_2: { id: 'd2_11_2', lessonId: 'les2_11', situation: '파트너 연결 대화',
    lines: [
      { speaker: 'A', spanish: 'Escuchate y escuchalo.', korean: '너를 듣고, 상대도 들어.' },
      { speaker: 'B', spanish: 'Así se camina en el tango.', korean: '이게 탱고에서 걷는 거야.' },
    ],
  },

  // ----- L2-12: 걷기 역할극 -----
  d2_12_1: { id: 'd2_12_1', lessonId: 'les2_12', situation: '수업 마무리 후',
    lines: [
      { speaker: 'A', spanish: '¿Una más?', korean: '한 번 더?' },
      { speaker: 'B', spanish: 'Dale, empecemos.', korean: '좋아, 시작하자.' },
      { speaker: 'A', spanish: 'Me divertí mucho. Gracias por practicar conmigo.', korean: '정말 재미있었어. 같이 연습해줘서 고마워.' },
    ],
  },
  d2_12_2: { id: 'd2_12_2', lessonId: 'les2_12', situation: '연습 마무리 대화',
    lines: [
      { speaker: 'A', spanish: 'Estamos mejorando.', korean: '우리 나아지고 있어.' },
      { speaker: 'B', spanish: 'La próxima va a ser mejor.', korean: '다음엔 더 잘할 거야.' },
    ],
  },
};
