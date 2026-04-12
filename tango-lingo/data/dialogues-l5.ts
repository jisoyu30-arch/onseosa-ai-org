export interface DialogueExample {
  id: string;
  lessonId: string;
  situation: string;
  lines: { speaker: string; spanish: string; korean: string; }[];
}

export const dialoguesL5: Record<string, DialogueExample> = {

  // ----- L5-01: 밀롱가 도착 -----
  d5_01_1: { id: 'd5_01_1', lessonId: 'les5_01', situation: '밀롱가에 처음 들어서며',
    lines: [
      { speaker: 'A', spanish: 'Buenas noches. ¿Hay lugar para sentarse?', korean: '안녕하세요. 앉을 자리 있어요?' },
      { speaker: 'B', spanish: 'Sí, ahí hay una mesa. Qué buena energía hay hoy.', korean: '네, 저기 테이블 있어요. 오늘 에너지 좋네요.' },
      { speaker: 'A', spanish: 'Es mi primera vez acá. El piso está buenísimo.', korean: '여기 처음이에요. 바닥이 진짜 좋네요.' },
    ],
  },
  d5_01_2: { id: 'd5_01_2', lessonId: 'les5_01', situation: '아는 사람과 밀롱가에서 만남',
    lines: [
      { speaker: 'A', spanish: '¿Conocés esta milonga?', korean: '이 밀롱가 알아요?' },
      { speaker: 'B', spanish: 'Sí, me encanta. La música está muy buena.', korean: '네, 정말 좋아해요. 음악이 좋네요.' },
    ],
  },

  // ----- L5-02: 처음 만남 -----
  d5_02_1: { id: 'd5_02_1', lessonId: 'les5_02', situation: '밀롱가에서 처음 만나는 사람과 대화',
    lines: [
      { speaker: 'A', spanish: '¿Cómo te llamás? ¿Hace mucho que bailás tango?', korean: '이름이 뭐예요? 탱고 추신 지 오래됐어요?' },
      { speaker: 'B', spanish: 'Me llamo María. Hace poco, unos meses.', korean: '마리아예요. 얼마 안 됐어요, 몇 달요.' },
      { speaker: 'A', spanish: 'Qué bueno conocerte. Espero verte de nuevo.', korean: '만나서 반가워요. 다시 만나길 바라요.' },
    ],
  },
  d5_02_2: { id: 'd5_02_2', lessonId: 'les5_02', situation: '수업 선생님에 대해 대화',
    lines: [
      { speaker: 'A', spanish: '¿Con quién tomás clases?', korean: '누구한테 배워요?' },
      { speaker: 'B', spanish: 'Me gusta mucho este lugar. Somos de Corea.', korean: '이 장소가 정말 좋아요. 우리 한국에서 왔어요.' },
    ],
  },

  // ----- L5-03: 카베세오 -----
  d5_03_1: { id: 'd5_03_1', lessonId: 'les5_03', situation: '카베세오를 처음 시도할 때',
    lines: [
      { speaker: 'A', spanish: 'Mirá, te está mirando. Respondé con la mirada.', korean: '봐, 너를 보고 있어. 시선으로 응답해.' },
      { speaker: 'B', spanish: '¿Y si no quiero?', korean: '원하지 않으면요?' },
      { speaker: 'A', spanish: 'Si no querés, mirá para otro lado. El cabeceo es discreto.', korean: '원하지 않으면 다른 데 봐. 카베세오는 눈에 안 띄게.' },
    ],
  },
  d5_03_2: { id: 'd5_03_2', lessonId: 'les5_03', situation: '카베세오 성공',
    lines: [
      { speaker: 'A', spanish: 'Listo, aceptó. Vamos a la pista.', korean: '됐어, 수락했어. 플로어로 가자.' },
      { speaker: 'B', spanish: 'Sin palabras. Es la tradición.', korean: '말 없이. 이게 전통이야.' },
    ],
  },

  // ----- L5-04: 춤 신청 -----
  d5_04_1: { id: 'd5_04_1', lessonId: 'les5_04', situation: '말로 춤을 신청할 때',
    lines: [
      { speaker: 'A', spanish: '¿Te gustaría bailar esta tanda? Es una tanda de vals.', korean: '이 탄다 같이 출래요? 왈츠 탄다예요.' },
      { speaker: 'B', spanish: 'Sí, con mucho gusto.', korean: '네, 기꺼이요.' },
      { speaker: 'A', spanish: 'Vamos al piso.', korean: '플로어로 가요.' },
    ],
  },
  d5_04_2: { id: 'd5_04_2', lessonId: 'les5_04', situation: '다음 탄다 예약',
    lines: [
      { speaker: 'A', spanish: '¿Querés bailar la próxima?', korean: '다음 탄다 출래요?' },
      { speaker: 'B', spanish: 'Dale, la espero.', korean: '좋아, 기다릴게요.' },
    ],
  },

  // ----- L5-05: 춤 도중 배려 -----
  d5_05_1: { id: 'd5_05_1', lessonId: 'les5_05', situation: '실수로 발을 밟았을 때',
    lines: [
      { speaker: 'A', spanish: '¿Te lastimé? Disculpá, fue sin querer.', korean: '아프게 했어요? 미안해요, 일부러 그런 게 아니에요.' },
      { speaker: 'B', spanish: 'No, estoy bien. Tranquilo.', korean: '아니요, 괜찮아요. 걱정 마요.' },
      { speaker: 'A', spanish: 'Estoy disfrutando mucho.', korean: '정말 즐기고 있어요.' },
    ],
  },
  d5_05_2: { id: 'd5_05_2', lessonId: 'les5_05', situation: '물 권하기',
    lines: [
      { speaker: 'A', spanish: '¿Necesitás agua?', korean: '물 필요해요?' },
      { speaker: 'B', spanish: 'Sí, gracias. ¿Estás cómoda?', korean: '네, 고마워요. 편해요?' },
    ],
  },

  // ----- L5-06: 음악 대화 -----
  d5_06_1: { id: 'd5_06_1', lessonId: 'les5_06', situation: '음악에 대해 대화',
    lines: [
      { speaker: 'A', spanish: '¿Conocés esta orquesta? Es Di Sarli, me encanta.', korean: '이 오케스트라 알아요? 디 사를리예요, 정말 좋아해요.' },
      { speaker: 'B', spanish: 'Esta canción es hermosa.', korean: '이 노래 정말 아름다워요.' },
      { speaker: 'A', spanish: 'Esta milonga tiene buen DJ.', korean: '이 밀롱가 DJ 좋네요.' },
    ],
  },
  d5_06_2: { id: 'd5_06_2', lessonId: 'les5_06', situation: '장르 취향 대화',
    lines: [
      { speaker: 'A', spanish: '¿Te gusta la milonga o el vals?', korean: '밀롱가가 좋아요 아니면 왈츠?' },
      { speaker: 'B', spanish: 'El vals, me encanta.', korean: '왈츠요, 정말 좋아해요.' },
    ],
  },

  // ----- L5-07: 칭찬 -----
  d5_07_1: { id: 'd5_07_1', lessonId: 'les5_07', situation: '춤 후 진심 어린 칭찬',
    lines: [
      { speaker: 'A', spanish: 'Tenés muy buena pisada. Bailás muy rico.', korean: '걸음이 정말 좋으시네요. 춤이 정말 맛있어요.' },
      { speaker: 'B', spanish: 'Gracias, tu conexión es especial.', korean: '고마워요, 당신의 연결은 특별해요.' },
      { speaker: 'A', spanish: 'Me sentí muy cómodo con vos.', korean: '당신과 정말 편안했어요.' },
    ],
  },
  d5_07_2: { id: 'd5_07_2', lessonId: 'les5_07', situation: '음악성 칭찬',
    lines: [
      { speaker: 'A', spanish: 'Sos muy musical.', korean: '정말 음악적이시네요.' },
      { speaker: 'B', spanish: 'Qué lindo, gracias.', korean: '예쁜 말, 고마워요.' },
    ],
  },

  // ----- L5-08: 바닥 문제 -----
  d5_08_1: { id: 'd5_08_1', lessonId: 'les5_08', situation: '충돌이 생겼을 때',
    lines: [
      { speaker: 'A', spanish: 'Ojo, viene una pareja. Esperemos un poco.', korean: '조심, 커플이 와요. 좀 기다리자.' },
      { speaker: 'B', spanish: 'Hay mucho espacio allá.', korean: '저쪽에 공간이 많아요.' },
      { speaker: 'A', spanish: 'Cuidemos la ronda.', korean: '론다를 지키자.' },
    ],
  },
  d5_08_2: { id: 'd5_08_2', lessonId: 'les5_08', situation: '부딪힌 후 사과',
    lines: [
      { speaker: 'A', spanish: 'Perdón, nos chocamos.', korean: '미안해요, 부딪혔어요.' },
      { speaker: 'B', spanish: 'No pasa nada, tranquilo.', korean: '괜찮아요, 걱정 마요.' },
    ],
  },

  // ----- L5-09: 탄다 마무리 -----
  d5_09_1: { id: 'd5_09_1', lessonId: 'les5_09', situation: '탄다가 끝난 후 인사',
    lines: [
      { speaker: 'A', spanish: 'Fue una tanda hermosa. Gracias, lo disfruté mucho.', korean: '아름다운 탄다였어요. 고마워요, 정말 즐거웠어요.' },
      { speaker: 'B', spanish: 'Te acompaño a tu mesa.', korean: '자리까지 모셔다 드릴게요.' },
      { speaker: 'A', spanish: 'Muy amable, gracias. Ojalá bailemos otra vez.', korean: '정말 친절하시네요, 고마워요. 또 같이 추면 좋겠어요.' },
    ],
  },
  d5_09_2: { id: 'd5_09_2', lessonId: 'les5_09', situation: '감사 인사',
    lines: [
      { speaker: 'A', spanish: 'Gracias por la tanda.', korean: '탄다 고마워요.' },
      { speaker: 'B', spanish: 'Ojalá bailemos otra vez.', korean: '또 같이 추면 좋겠어요.' },
    ],
  },

  // ----- L5-10: 정중한 거절 -----
  d5_10_1: { id: 'd5_10_1', lessonId: 'les5_10', situation: '춤 신청을 정중히 거절',
    lines: [
      { speaker: 'A', spanish: '¿Bailamos?', korean: '출래요?' },
      { speaker: 'B', spanish: 'Ahora estoy descansando. Quizás más tarde.', korean: '지금 쉬고 있어요. 아마 나중에요.' },
      { speaker: 'A', spanish: 'No te lo tomes a mal. Gracias por la invitación.', korean: '기분 나쁘게 생각하지 마요. 초대 감사해요.' },
    ],
  },
  d5_10_2: { id: 'd5_10_2', lessonId: 'les5_10', situation: '파트너와 함께 왔을 때 거절',
    lines: [
      { speaker: 'A', spanish: '¿Querés bailar?', korean: '춤 출래요?' },
      { speaker: 'B', spanish: 'Estoy con mi pareja hoy. Gracias por la invitación.', korean: '오늘은 파트너랑 왔어요. 초대 감사해요.' },
    ],
  },

  // ----- L5-11: 휴식 -----
  d5_11_1: { id: 'd5_11_1', lessonId: 'les5_11', situation: '춤 사이 쉬는 시간',
    lines: [
      { speaker: 'A', spanish: 'Necesito agua. Mis pies necesitan descanso.', korean: '물 필요해요. 발이 쉬어야 해요.' },
      { speaker: 'B', spanish: 'Vamos a sentarnos un rato. ¿Querés tomar algo?', korean: '잠깐 앉자. 뭐 마실래요?' },
      { speaker: 'A', spanish: 'Ya estoy lista para volver.', korean: '다시 들어갈 준비 됐어요.' },
    ],
  },
  d5_11_2: { id: 'd5_11_2', lessonId: 'les5_11', situation: '물 마시며 대화',
    lines: [
      { speaker: 'A', spanish: '¿Querés tomar algo?', korean: '뭐 마실래요?' },
      { speaker: 'B', spanish: 'Sí, agua por favor.', korean: '네, 물 주세요.' },
    ],
  },

  // ----- L5-12: 한 탄다 더 -----
  d5_12_1: { id: 'd5_12_1', lessonId: 'les5_12', situation: '한 탄다 더 추고 싶을 때',
    lines: [
      { speaker: 'A', spanish: '¿Una tanda más? Esperemos una buena tanda.', korean: '한 탄다 더요? 좋은 탄다를 기다리자.' },
      { speaker: 'B', spanish: 'Dale, la última. Cada tanda con vos es especial.', korean: '좋아, 마지막으로. 당신과의 모든 탄다가 특별해요.' },
      { speaker: 'A', spanish: 'Me quiero quedar más.', korean: '더 있고 싶어요.' },
    ],
  },
  d5_12_2: { id: 'd5_12_2', lessonId: 'les5_12', situation: '마지막 탄다',
    lines: [
      { speaker: 'A', spanish: '¿Una tanda más?', korean: '한 탄다 더요?' },
      { speaker: 'B', spanish: 'Dale, la última.', korean: '좋아, 마지막으로.' },
    ],
  },

  // ----- L5-13: 소셜 대화 -----
  d5_13_1: { id: 'd5_13_1', lessonId: 'les5_13', situation: '밀롱가 추천 대화',
    lines: [
      { speaker: 'A', spanish: '¿Venís seguido acá? ¿Qué milongas me recomendás?', korean: '여기 자주 오세요? 어떤 밀롱가를 추천해요?' },
      { speaker: 'B', spanish: 'Sí, cada viernes. Los martes hay una muy linda.', korean: '네, 매주 금요일이요. 화요일에 좋은 데 하나 있어요.' },
      { speaker: 'A', spanish: 'Voy a probar. Gracias.', korean: '가볼게요. 고마워요.' },
    ],
  },
  d5_13_2: { id: 'd5_13_2', lessonId: 'les5_13', situation: '탱고 경력 대화',
    lines: [
      { speaker: 'A', spanish: '¿Hace mucho que bailás?', korean: '춤 추신 지 오래됐어요?' },
      { speaker: 'B', spanish: 'Unos años. ¿Y vos?', korean: '몇 년요. 당신은요?' },
    ],
  },

  // ----- L5-14: 플로어 예절 -----
  d5_14_1: { id: 'd5_14_1', lessonId: 'les5_14', situation: '플로어 예절 설명',
    lines: [
      { speaker: 'A', spanish: 'Respetá la línea de baile. No pases a la pareja de adelante.', korean: '댄스라인을 지켜. 앞 커플을 추월하지 마.' },
      { speaker: 'B', spanish: 'Mantené tu carril.', korean: '네 라인을 유지해.' },
      { speaker: 'A', spanish: 'El respeto es la base. No hagas figuras peligrosas.', korean: '존중이 기본이야. 위험한 피겨 하지 마.' },
    ],
  },
  d5_14_2: { id: 'd5_14_2', lessonId: 'les5_14', situation: '론다 규칙 대화',
    lines: [
      { speaker: 'A', spanish: 'Cuidemos la ronda.', korean: '론다를 지키자.' },
      { speaker: 'B', spanish: 'El respeto es la base.', korean: '존중이 기본이야.' },
    ],
  },

  // ----- L5-15: 작별 -----
  d5_15_1: { id: 'd5_15_1', lessonId: 'les5_15', situation: '밀롱가를 떠나며',
    lines: [
      { speaker: 'A', spanish: 'Ya me voy. Fue una noche increíble.', korean: '이제 가요. 놀라운 밤이었어요.' },
      { speaker: 'B', spanish: 'Nos vemos la próxima. Cuidate mucho.', korean: '다음에 봐요. 잘 지내요.' },
      { speaker: 'A', spanish: 'Gracias por esta noche.', korean: '이 밤을 감사해요.' },
    ],
  },
  d5_15_2: { id: 'd5_15_2', lessonId: 'les5_15', situation: '작별 인사',
    lines: [
      { speaker: 'A', spanish: 'Fue una noche hermosa.', korean: '아름다운 밤이었어요.' },
      { speaker: 'B', spanish: 'Cuidate mucho. Nos vemos.', korean: '잘 지내요. 또 봐요.' },
    ],
  },

  // ----- L5-16: 밀롱가 풀 역할극 -----
  d5_16_1: { id: 'd5_16_1', lessonId: 'les5_16', situation: '밀롱가 도착부터 출발까지',
    lines: [
      { speaker: 'A', spanish: 'Llegamos a la milonga. Buscá una buena mesa.', korean: '밀롱가에 도착했어. 좋은 자리 찾아.' },
      { speaker: 'B', spanish: 'Mirá la pista, ¿lista?', korean: '플로어 봐, 준비됐어?' },
      { speaker: 'A', spanish: 'Fue la mejor noche. Volvemos la semana que viene.', korean: '최고의 밤이었어. 다음 주에 또 오자.' },
    ],
  },
  d5_16_2: { id: 'd5_16_2', lessonId: 'les5_16', situation: '밀롱가 마무리',
    lines: [
      { speaker: 'A', spanish: 'Fue la mejor noche.', korean: '최고의 밤이었어.' },
      { speaker: 'B', spanish: 'Volvemos la semana que viene.', korean: '다음 주에 또 오자.' },
    ],
  },
};
