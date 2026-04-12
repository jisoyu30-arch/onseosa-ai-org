export interface DialogueExample {
  id: string;
  lessonId: string;
  situation: string;
  lines: { speaker: string; spanish: string; korean: string; }[];
}

export const dialoguesL4: Record<string, DialogueExample> = {

  // ----- L4-01: 다시 해볼까요 -----
  d4_01_1: { id: 'd4_01_1', lessonId: 'les4_01', situation: '반복 연습을 요청할 때',
    lines: [
      { speaker: 'A', spanish: '¿Podemos repetir? Una más.', korean: '반복해도 될까요? 한 번만 더.' },
      { speaker: 'B', spanish: 'Claro. Otra vez, pero despacio.', korean: '물론. 다시, 근데 천천히.' },
      { speaker: 'A', spanish: 'El cuerpo ya sabe. No te frustres.', korean: '몸이 이미 알아. 좌절하지 마.' },
    ],
  },
  d4_01_2: { id: 'd4_01_2', lessonId: 'les4_01', situation: '자신감을 주는 대화',
    lines: [
      { speaker: 'A', spanish: 'Repetí hasta que salga solo.', korean: '저절로 나올 때까지 반복해.' },
      { speaker: 'B', spanish: 'Ya va a salir.', korean: '곧 될 거야.' },
    ],
  },

  // ----- L4-02: 더 좋아요 -----
  d4_02_1: { id: 'd4_02_1', lessonId: 'les4_02', situation: '발전을 인정하는 순간',
    lines: [
      { speaker: 'A', spanish: 'Cada vez mejor. Lo sentiste, ¿no?', korean: '갈수록 좋아지네. 느꼈지, 그치?' },
      { speaker: 'B', spanish: 'Sí, se nota la diferencia.', korean: '응, 차이가 느껴져.' },
      { speaker: 'A', spanish: 'Estoy orgulloso de vos.', korean: '네가 자랑스러워.' },
    ],
  },
  d4_02_2: { id: 'd4_02_2', lessonId: 'les4_02', situation: '파트너 칭찬',
    lines: [
      { speaker: 'A', spanish: 'Tu cuerpo lo recuerda.', korean: '네 몸이 기억해.' },
      { speaker: 'B', spanish: 'Así se hace. Seguí así.', korean: '그렇게 하는 거야. 계속 그렇게.' },
    ],
  },

  // ----- L4-03: 아직 아니에요 -----
  d4_03_1: { id: 'd4_03_1', lessonId: 'les4_03', situation: '부드러운 교정 대화',
    lines: [
      { speaker: 'A', spanish: 'Todavía no, pero ya casi.', korean: '아직 아니야, 근데 거의 다 왔어.' },
      { speaker: 'B', spanish: '¿Qué hago mal?', korean: '뭘 잘못하고 있어?' },
      { speaker: 'A', spanish: 'Fijate en los pies. Con paciencia sale.', korean: '발을 봐. 인내하면 돼.' },
    ],
  },
  d4_03_2: { id: 'd4_03_2', lessonId: 'les4_03', situation: '세부 교정',
    lines: [
      { speaker: 'A', spanish: 'Ahí no, un poquito más.', korean: '거기 아니야, 조금만 더.' },
      { speaker: 'B', spanish: 'Prestá atención a la marca.', korean: '마르카에 집중해.' },
    ],
  },

  // ----- L4-04: 천천히요 -----
  d4_04_1: { id: 'd4_04_1', lessonId: 'les4_04', situation: '속도를 줄여달라고 할 때',
    lines: [
      { speaker: 'A', spanish: 'No hay apuro. Tomá tu tiempo.', korean: '서두를 필요 없어. 네 시간을 가져.' },
      { speaker: 'B', spanish: 'Primero lento, después rápido.', korean: '먼저 느리게, 그다음 빠르게.' },
      { speaker: 'A', spanish: 'Despacio se aprende mejor.', korean: '천천히 하면 더 잘 배워.' },
    ],
  },
  d4_04_2: { id: 'd4_04_2', lessonId: 'les4_04', situation: '속도와 연습의 관계',
    lines: [
      { speaker: 'A', spanish: 'La velocidad viene con la práctica.', korean: '속도는 연습과 함께 와.' },
      { speaker: 'B', spanish: 'Tomá tu tiempo.', korean: '네 시간을 가져.' },
    ],
  },

  // ----- L4-05: 느낌이 안 와요 -----
  d4_05_1: { id: 'd4_05_1', lessonId: 'les4_05', situation: '감각을 찾지 못할 때',
    lines: [
      { speaker: 'A', spanish: 'No sé qué estoy haciendo.', korean: '내가 뭘 하는지 모르겠어.' },
      { speaker: 'B', spanish: 'Cerrá los ojos y sentí. Dejá de pensar.', korean: '눈 감고 느껴. 생각을 멈춰.' },
      { speaker: 'A', spanish: 'El tango se siente, no se piensa.', korean: '탱고는 느끼는 거야, 생각하는 게 아니야.' },
    ],
  },
  d4_05_2: { id: 'd4_05_2', lessonId: 'les4_05', situation: '파트너 연결 시도',
    lines: [
      { speaker: 'A', spanish: 'Conectá con tu pareja.', korean: '파트너와 연결해.' },
      { speaker: 'B', spanish: 'Ahora lo siento.', korean: '이제 느껴져.' },
    ],
  },

  // ----- L4-06: 연결이 끊겼어요 -----
  d4_06_1: { id: 'd4_06_1', lessonId: 'les4_06', situation: '연결이 끊어졌을 때',
    lines: [
      { speaker: 'A', spanish: 'Esperá, no siento la marca.', korean: '잠깐, 마르카가 안 느껴져.' },
      { speaker: 'B', spanish: 'Acercate un poco más.', korean: '좀 더 가까이 와.' },
      { speaker: 'A', spanish: 'Ahora sí, te siento.', korean: '이제 느껴져.' },
    ],
  },
  d4_06_2: { id: 'd4_06_2', lessonId: 'les4_06', situation: '다시 연결하기',
    lines: [
      { speaker: 'A', spanish: 'Volvemos a conectar.', korean: '다시 연결하자.' },
      { speaker: 'B', spanish: 'La conexión se puede recuperar.', korean: '연결은 되찾을 수 있어.' },
    ],
  },

  // ----- L4-07: 타이밍 -----
  d4_07_1: { id: 'd4_07_1', lessonId: 'les4_07', situation: '타이밍 교정',
    lines: [
      { speaker: 'A', spanish: 'Entraste un poco antes. Esperá un toque más.', korean: '조금 빨리 들어왔어. 살짝만 더 기다려.' },
      { speaker: 'B', spanish: '¿Así?', korean: '이렇게?' },
      { speaker: 'A', spanish: 'Justo ahí, perfecto. El timing es todo.', korean: '바로 거기, 완벽해. 타이밍이 전부야.' },
    ],
  },
  d4_07_2: { id: 'd4_07_2', lessonId: 'les4_07', situation: '늦은 진입 교정',
    lines: [
      { speaker: 'A', spanish: 'Llegaste tarde.', korean: '늦었어.' },
      { speaker: 'B', spanish: 'Perdón, otra vez.', korean: '미안, 다시.' },
    ],
  },

  // ----- L4-08: 감정 표현 -----
  d4_08_1: { id: 'd4_08_1', lessonId: 'les4_08', situation: '수업 중 감정 나누기',
    lines: [
      { speaker: 'A', spanish: 'Me pongo nervioso cuando giro.', korean: '돌 때 긴장돼.' },
      { speaker: 'B', spanish: 'Estoy más tranquilo ahora. El tango me relaja.', korean: '이제 더 편안해. 탱고가 날 편안하게 해.' },
      { speaker: 'A', spanish: 'Me encanta bailar con vos.', korean: '너랑 추는 거 정말 좋아.' },
    ],
  },
  d4_08_2: { id: 'd4_08_2', lessonId: 'les4_08', situation: '기분 좋은 날',
    lines: [
      { speaker: 'A', spanish: 'Hoy me siento bien.', korean: '오늘 기분 좋아.' },
      { speaker: 'B', spanish: 'Se nota, bailás muy bien hoy.', korean: '티 나, 오늘 춤 되게 잘 춰.' },
    ],
  },

  // ----- L4-09: 서로 피드백 -----
  d4_09_1: { id: 'd4_09_1', lessonId: 'les4_09', situation: '춤 후 상호 피드백',
    lines: [
      { speaker: 'A', spanish: '¿Qué te pareció? Me gustó la conexión.', korean: '어떻게 느꼈어? 연결이 좋았어.' },
      { speaker: 'B', spanish: 'Tu abrazo estuvo muy cómodo.', korean: '네 아브라소 정말 편했어.' },
      { speaker: 'A', spanish: 'Sentí algo raro en el giro.', korean: '히로에서 뭔가 이상했어.' },
    ],
  },
  d4_09_2: { id: 'd4_09_2', lessonId: 'les4_09', situation: '제안 구하기',
    lines: [
      { speaker: 'A', spanish: '¿Puedo darte una sugerencia?', korean: '하나 제안해도 될까?' },
      { speaker: 'B', spanish: 'Claro, decime.', korean: '물론, 말해.' },
    ],
  },

  // ----- L4-10: 진전 대화 -----
  d4_10_1: { id: 'd4_10_1', lessonId: 'les4_10', situation: '성장을 실감하는 대화',
    lines: [
      { speaker: 'A', spanish: 'Siento que estoy mejorando. Hace un mes no podía.', korean: '나아지고 있는 느낌이야. 한 달 전엔 못 했어.' },
      { speaker: 'B', spanish: 'Estamos creciendo juntos.', korean: '우리 같이 성장하고 있어.' },
      { speaker: 'A', spanish: 'El tango es un camino.', korean: '탱고는 길이야.' },
    ],
  },
  d4_10_2: { id: 'd4_10_2', lessonId: 'les4_10', situation: '탱고 철학 대화',
    lines: [
      { speaker: 'A', spanish: 'No hay destino, solo el viaje.', korean: '목적지는 없어, 여정만 있을 뿐.' },
      { speaker: 'B', spanish: 'Qué lindo pensamiento.', korean: '아름다운 생각이다.' },
    ],
  },

  // ----- L4-11: 파트너 교체 인사 -----
  d4_11_1: { id: 'd4_11_1', lessonId: 'les4_11', situation: '파트너 교체 시 인사',
    lines: [
      { speaker: 'A', spanish: 'Cambiamos de pareja. Gracias por bailar conmigo.', korean: '파트너 바꾸자. 같이 춰줘서 고마워.' },
      { speaker: 'B', spanish: 'Fue un placer. Bailamos después otra vez.', korean: '즐거웠어. 나중에 또 추자.' },
      { speaker: 'A', spanish: 'Me gustó mucho bailar con vos.', korean: '너랑 추는 거 정말 좋았어.' },
    ],
  },
  d4_11_2: { id: 'd4_11_2', lessonId: 'les4_11', situation: '교체 후 감사',
    lines: [
      { speaker: 'A', spanish: 'Fue un placer.', korean: '즐거웠어.' },
      { speaker: 'B', spanish: 'Igualmente. Nos vemos.', korean: '나도. 또 보자.' },
    ],
  },

  // ----- L4-12: 연습 역할극 -----
  d4_12_1: { id: 'd4_12_1', lessonId: 'les4_12', situation: '연습 마무리',
    lines: [
      { speaker: 'A', spanish: '¿Practicamos un rato más?', korean: '좀 더 연습할까?' },
      { speaker: 'B', spanish: 'Me cansé un poco. Descansamos y seguimos.', korean: '좀 피곤해. 쉬고 계속하자.' },
      { speaker: 'A', spanish: 'Hoy fue muy productivo. Nos vemos la próxima.', korean: '오늘 정말 생산적이었어. 다음에 보자.' },
    ],
  },
  d4_12_2: { id: 'd4_12_2', lessonId: 'les4_12', situation: '연습 후 작별',
    lines: [
      { speaker: 'A', spanish: 'Hoy fue muy productivo.', korean: '오늘 정말 생산적이었어.' },
      { speaker: 'B', spanish: 'Nos vemos la próxima.', korean: '다음에 보자.' },
    ],
  },
};
