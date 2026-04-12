export interface DialogueExample {
  id: string;
  lessonId: string;
  situation: string;
  lines: { speaker: string; spanish: string; korean: string; }[];
}

export const dialoguesL3: Record<string, DialogueExample> = {

  // ----- L3-01: 앞오초 -----
  d3_01_1: { id: 'd3_01_1', lessonId: 'les3_01', situation: '오초 기본 동작을 배울 때',
    lines: [
      { speaker: 'Profesor', spanish: 'Girá desde la cadera. El pivote es suave.', korean: '골반에서 돌려. 피벗은 부드럽게.' },
      { speaker: 'Alumno', spanish: '¿Uso la planta del pie?', korean: '발바닥을 써요?' },
      { speaker: 'Profesor', spanish: 'Sí. El ocho nace de adentro.', korean: '응. 오초는 안에서 나와.' },
    ],
  },
  d3_01_2: { id: 'd3_01_2', lessonId: 'les3_01', situation: '오초 연습 후 피드백',
    lines: [
      { speaker: 'A', spanish: 'No fuerces la rotación.', korean: '회전에 힘 주지 마.' },
      { speaker: 'B', spanish: 'Muy bien el ocho.', korean: '오초 아주 잘했어.' },
    ],
  },

  // ----- L3-02: 뒤오초 -----
  d3_02_1: { id: 'd3_02_1', lessonId: 'les3_02', situation: '뒤오초에서 축을 잃을 때',
    lines: [
      { speaker: 'Profesor', spanish: 'No te vayas del eje. El torso se queda.', korean: '축에서 벗어나지 마. 몸통은 그 자리에.' },
      { speaker: 'Alumno', spanish: 'Es difícil atrás.', korean: '뒤로는 어렵네요.' },
      { speaker: 'Profesor', spanish: 'Buscá la espiral. Cada ocho es una conversación.', korean: '나선형을 찾아. 매 오초는 대화야.' },
    ],
  },
  d3_02_2: { id: 'd3_02_2', lessonId: 'les3_02', situation: '분리 운동 연습',
    lines: [
      { speaker: 'A', spanish: 'Controlá la cadera.', korean: '골반을 컨트롤해.' },
      { speaker: 'B', spanish: 'Arriba quieto, abajo se mueve.', korean: '위는 조용, 아래가 움직여.' },
    ],
  },

  // ----- L3-03: 크루세 -----
  d3_03_1: { id: 'd3_03_1', lessonId: 'les3_03', situation: '크루세 타이밍을 배울 때',
    lines: [
      { speaker: 'Profesor', spanish: 'Llegá al cruce con calma. No anticipes.', korean: '차분하게 도착해. 미리 하지 마.' },
      { speaker: 'Alumno', spanish: '¿Las piernas se juntan solas?', korean: '다리가 저절로 모여요?' },
      { speaker: 'Profesor', spanish: 'Sí. El cruce llega, no se busca.', korean: '응. 크루세는 오는 거야, 찾는 게 아니야.' },
    ],
  },
  d3_03_2: { id: 'd3_03_2', lessonId: 'les3_03', situation: '크루세 성공 후',
    lines: [
      { speaker: 'A', spanish: 'Qué lindo cruce.', korean: '크루세 아름답다.' },
      { speaker: 'B', spanish: 'Gracias, estoy aprendiendo.', korean: '고마워요, 배우고 있어요.' },
    ],
  },

  // ----- L3-04: 회전 시작 -----
  d3_04_1: { id: 'd3_04_1', lessonId: 'les3_04', situation: '히로를 시작하는 방법',
    lines: [
      { speaker: 'Profesor', spanish: 'El giro empieza despacio. Girá desde el centro.', korean: '히로는 천천히 시작해. 중심에서 돌려.' },
      { speaker: 'Alumno', spanish: '¿No con los hombros?', korean: '어깨로 아니에요?' },
      { speaker: 'Profesor', spanish: 'No. El giro es un abrazo que rota.', korean: '아니. 히로는 회전하는 아브라소야.' },
    ],
  },
  d3_04_2: { id: 'd3_04_2', lessonId: 'les3_04', situation: '연결을 유지하며 돌기',
    lines: [
      { speaker: 'A', spanish: 'Mantené la conexión al girar.', korean: '돌면서 연결을 유지해.' },
      { speaker: 'B', spanish: 'Estoy tratando, es difícil.', korean: '노력 중이야, 어렵네.' },
    ],
  },

  // ----- L3-05: 회전 안에서 -----
  d3_05_1: { id: 'd3_05_1', lessonId: 'les3_05', situation: '히로 스텝 분해',
    lines: [
      { speaker: 'Profesor', spanish: 'Adelante, costado, atrás. Completá cada paso.', korean: '앞, 옆, 뒤. 각 스텝을 완성해.' },
      { speaker: 'Alumno', spanish: '¿Puedo ir más despacio?', korean: '더 천천히 해도 돼요?' },
      { speaker: 'Profesor', spanish: 'Sí. El giro tiene su música.', korean: '응. 히로에도 음악이 있어.' },
    ],
  },
  d3_05_2: { id: 'd3_05_2', lessonId: 'les3_05', situation: '서두르지 않기',
    lines: [
      { speaker: 'A', spanish: 'No te adelantes.', korean: '앞서가지 마.' },
      { speaker: 'B', spanish: 'Cada paso tiene su lugar.', korean: '각 스텝에는 자리가 있어.' },
    ],
  },

  // ----- L3-06: 기본이 먼저 -----
  d3_06_1: { id: 'd3_06_1', lessonId: 'les3_06', situation: '기술보다 기본의 중요성',
    lines: [
      { speaker: 'Profesor', spanish: 'Sin base, no hay técnica. Primero caminá bien.', korean: '기본 없이 기술 없다. 먼저 잘 걸어.' },
      { speaker: 'Alumno', spanish: '¿Y cuándo aprendo más figuras?', korean: '그러면 언제 더 많은 피겨를 배워요?' },
      { speaker: 'Profesor', spanish: 'Después viene lo demás. La base es tu libertad.', korean: '그 다음에 나머지가 와. 기본이 너의 자유야.' },
    ],
  },
  d3_06_2: { id: 'd3_06_2', lessonId: 'les3_06', situation: '반복 연습 권유',
    lines: [
      { speaker: 'A', spanish: 'Repetí lo simple.', korean: '단순한 걸 반복해.' },
      { speaker: 'B', spanish: 'Sí, tenés razón.', korean: '맞아.' },
    ],
  },

  // ----- L3-07: 아도르노 -----
  d3_07_1: { id: 'd3_07_1', lessonId: 'les3_07', situation: '아도르노 기초 설명',
    lines: [
      { speaker: 'Profesor', spanish: 'El adorno es tuyo. Que salga natural.', korean: '아도르노는 네 거야. 자연스럽게 나오게 해.' },
      { speaker: 'Alumno', spanish: '¿Cuándo lo hago?', korean: '언제 해요?' },
      { speaker: 'Profesor', spanish: 'Un pequeño toque. El adorno no interrumpe.', korean: '작은 터치 하나. 아도르노는 방해하지 않아.' },
    ],
  },
  d3_07_2: { id: 'd3_07_2', lessonId: 'les3_07', situation: '과한 장식 교정',
    lines: [
      { speaker: 'A', spanish: 'No decores por decorar.', korean: '꾸미려고 꾸미지 마.' },
      { speaker: 'B', spanish: 'Entendido, menos es más.', korean: '알겠어, 적은 게 많은 거네.' },
    ],
  },

  // ----- L3-08: 사카다 -----
  d3_08_1: { id: 'd3_08_1', lessonId: 'les3_08', situation: '사카다 개념 설명',
    lines: [
      { speaker: 'Profesor', spanish: 'Entrá al espacio vacío. La sacada es una invitación.', korean: '빈 공간에 들어가. 사카다는 초대야.' },
      { speaker: 'Alumno', spanish: '¿No empujo la pierna?', korean: '다리를 밀면 안 돼요?' },
      { speaker: 'Profesor', spanish: 'No. La pierna sale, no entra.', korean: '안 돼. 다리가 빠지는 거야, 들어가는 게 아니야.' },
    ],
  },
  d3_08_2: { id: 'd3_08_2', lessonId: 'les3_08', situation: '사카다 타이밍',
    lines: [
      { speaker: 'A', spanish: 'Usá el momento justo.', korean: '정확한 타이밍을 써.' },
      { speaker: 'B', spanish: 'Otra vez, ¿puedo intentar?', korean: '다시, 해봐도 돼?' },
    ],
  },

  // ----- L3-09: 파라다 -----
  d3_09_1: { id: 'd3_09_1', lessonId: 'les3_09', situation: '파라다에서 아도르노',
    lines: [
      { speaker: 'Profesor', spanish: 'Pará el pie ahí. La parada es un momento.', korean: '발을 거기 세워. 파라다는 하나의 순간이야.' },
      { speaker: 'Alumno', spanish: '¿Y después?', korean: '그 다음엔요?' },
      { speaker: 'Profesor', spanish: 'Decorá en la parada. Disfrutá.', korean: '파라다에서 꾸며. 즐겨.' },
    ],
  },
  d3_09_2: { id: 'd3_09_2', lessonId: 'les3_09', situation: '파라다 나가기',
    lines: [
      { speaker: 'A', spanish: 'No apures la salida.', korean: '빠져나가기를 서두르지 마.' },
      { speaker: 'B', spanish: 'Disfrutá la parada.', korean: '파라다를 즐겨.' },
    ],
  },

  // ----- L3-10: 볼레오 -----
  d3_10_1: { id: 'd3_10_1', lessonId: 'les3_10', situation: '볼레오 원리 설명',
    lines: [
      { speaker: 'Profesor', spanish: 'El boleo sale solo. No levantes la pierna.', korean: '볼레오는 저절로 나와. 다리를 올리지 마.' },
      { speaker: 'Alumno', spanish: '¿Es la energía del giro?', korean: '회전의 에너지예요?' },
      { speaker: 'Profesor', spanish: 'Sí. Controlá la vuelta. El boleo tiene que ser libre.', korean: '맞아. 돌아오는 걸 컨트롤해. 볼레오는 자유로워야 해.' },
    ],
  },
  d3_10_2: { id: 'd3_10_2', lessonId: 'les3_10', situation: '볼레오 연습 후',
    lines: [
      { speaker: 'A', spanish: 'El boleo sale solo.', korean: '볼레오는 저절로 나와.' },
      { speaker: 'B', spanish: 'Ahora lo siento.', korean: '이제 느껴져.' },
    ],
  },

  // ----- L3-11: 강도 조절 -----
  d3_11_1: { id: 'd3_11_1', lessonId: 'les3_11', situation: '힘을 줄이는 교정',
    lines: [
      { speaker: 'Profesor', spanish: 'Menos fuerza, más suavidad. Aflojá los brazos.', korean: '힘은 줄이고 부드러움은 늘려. 팔을 풀어.' },
      { speaker: 'Alumno', spanish: 'Pero siento que se cae.', korean: '그런데 떨어질 것 같아요.' },
      { speaker: 'Profesor', spanish: 'No aprietes. La suavidad es poder.', korean: '꽉 쥐지 마. 부드러움이 힘이야.' },
    ],
  },
  d3_11_2: { id: 'd3_11_2', lessonId: 'les3_11', situation: '감각으로 느끼기',
    lines: [
      { speaker: 'A', spanish: 'Sentí, no fuerces.', korean: '느껴, 힘 주지 마.' },
      { speaker: 'B', spanish: 'Entendido, más suave.', korean: '알겠어, 더 부드럽게.' },
    ],
  },

  // ----- L3-12: 실수 후 복구 -----
  d3_12_1: { id: 'd3_12_1', lessonId: 'les3_12', situation: '실수 후 분위기 유지',
    lines: [
      { speaker: 'A', spanish: 'Perdón, me equivoqué.', korean: '미안, 실수했어.' },
      { speaker: 'B', spanish: 'No pasa nada, seguimos.', korean: '괜찮아, 계속하자.' },
      { speaker: 'A', spanish: 'Todos nos equivocamos. Lo importante es seguir.', korean: '모두 실수해. 중요한 건 계속하는 거야.' },
    ],
  },
  d3_12_2: { id: 'd3_12_2', lessonId: 'les3_12', situation: '긍정적 마인드',
    lines: [
      { speaker: 'A', spanish: 'El error es parte del proceso.', korean: '실수도 과정의 일부야.' },
      { speaker: 'B', spanish: 'Sonreí y volvé a empezar.', korean: '웃고 다시 시작해.' },
    ],
  },

  // ----- L3-13: 수업 중 질문 -----
  d3_13_1: { id: 'd3_13_1', lessonId: 'les3_13', situation: '이해가 안 될 때 질문',
    lines: [
      { speaker: 'Alumno', spanish: 'No entendí esa parte. ¿Me mostrás otra vez?', korean: '그 부분 이해 못 했어요. 한 번 더 보여줄래요?' },
      { speaker: 'Profesor', spanish: 'Claro. ¿Dónde pongo el pie?', korean: '물론. 발을 어디에 놓아야 해?' },
      { speaker: 'Alumno', spanish: '¿Podemos ir más despacio?', korean: '더 천천히 할 수 있어요?' },
    ],
  },
  d3_13_2: { id: 'd3_13_2', lessonId: 'les3_13', situation: '확인 질문',
    lines: [
      { speaker: 'A', spanish: '¿Está bien así?', korean: '이렇게 맞아요?' },
      { speaker: 'B', spanish: 'Sí, perfecto. Seguí así.', korean: '응, 완벽해. 계속 그렇게.' },
    ],
  },

  // ----- L3-14: 회전 역할극 -----
  d3_14_1: { id: 'd3_14_1', lessonId: 'les3_14', situation: '히로 종합 연습',
    lines: [
      { speaker: 'A', spanish: 'Practiquemos el giro completo. Vos girás, yo marco.', korean: '히로 전체를 연습하자. 네가 돌고, 내가 리드해.' },
      { speaker: 'B', spanish: '¿Probamos con música?', korean: '음악 틀고 해볼까?' },
      { speaker: 'A', spanish: 'Estuvo mucho mejor. Hoy aprendimos mucho.', korean: '훨씬 나았어. 오늘 많이 배웠어.' },
    ],
  },
  d3_14_2: { id: 'd3_14_2', lessonId: 'les3_14', situation: '역할극 마무리',
    lines: [
      { speaker: 'A', spanish: 'Hoy aprendimos mucho.', korean: '오늘 많이 배웠어.' },
      { speaker: 'B', spanish: 'Sí, la próxima va a ser mejor.', korean: '응, 다음엔 더 잘할 거야.' },
    ],
  },
};
