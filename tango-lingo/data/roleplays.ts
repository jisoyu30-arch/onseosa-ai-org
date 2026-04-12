import { RoleplayDialog } from '../types';

export const roleplays: Record<string, RoleplayDialog> = {
  // =====================================================
  // LEVEL 1 — Lesson 10: 첫 수업 역할극
  // =====================================================

  rp1_10: {
    id: 'rp1_10',
    title: 'Mi primera clase',
    titleKo: '첫 수업 시뮬레이션',
    situation: '수업 시작부터 교정, 피드백, 마무리까지 — 선생님과 학생의 대화',
    lines: [
      {
        role: 'A',
        roleLabel: 'Profesor/a',
        spanish: 'Hola, ¿todo bien?',
        korean: '안녕, 잘 지내?',
        english: 'Hi, all good?',
        chinese: '嗨，一切都好吗？',
      },
      {
        role: 'B',
        roleLabel: 'Alumno/a',
        spanish: 'Sí, todo bien. Gracias.',
        korean: '네, 잘 지내요. 감사해요.',
        english: 'Yes, all good. Thanks.',
        chinese: '是的，一切都好。谢谢。',
      },
      {
        role: 'A',
        roleLabel: 'Profesor/a',
        spanish: 'Bajá los hombros. Relajá el cuello.',
        korean: '어깨 내려. 목 힘 빼.',
        english: 'Lower your shoulders. Relax your neck.',
        chinese: '放下肩膀。放松脖子。',
      },
      {
        role: 'A',
        roleLabel: 'Profesor/a',
        spanish: 'Más suave. No empujes.',
        korean: '더 부드럽게. 밀지 마.',
        english: 'Softer. Don\'t push.',
        chinese: '更轻柔。不要推。',
      },
      {
        role: 'B',
        roleLabel: 'Alumno/a',
        spanish: '¿Así está bien?',
        korean: '이렇게 하면 맞나요?',
        english: 'Is this okay?',
        chinese: '这样可以吗？',
      },
      {
        role: 'A',
        roleLabel: 'Profesor/a',
        spanish: 'Ahora sí. Mejor así.',
        korean: '이제 맞아. 이게 더 나아.',
        english: 'Now yes. Better like this.',
        chinese: '现在对了。这样更好。',
      },
      {
        role: 'A',
        roleLabel: 'Profesor/a',
        spanish: 'Sentí la conexión. Quedate conmigo.',
        korean: '연결을 느껴. 나한테 머물러.',
        english: 'Feel the connection. Stay with me.',
        chinese: '感受连接。留在我身边。',
      },
      {
        role: 'B',
        roleLabel: 'Alumno/a',
        spanish: 'Gracias.',
        korean: '감사해요.',
        english: 'Thank you.',
        chinese: '谢谢。',
      },
    ],
  },

  // =====================================================
  // LEVEL 2 — Lesson 12: 걷기 역할극
  // =====================================================

  rp2_12: {
    id: 'rp2_12',
    title: 'Caminata completa',
    titleKo: '걷기 종합 시뮬레이션',
    situation: '전진 → 멈춤 → 속도 조절 → 재출발 → 함께 걷기',
    lines: [
      {
        role: 'A', roleLabel: 'Profesor/a',
        spanish: 'Caminá derecho.', korean: '앞으로 똑바로 걸어.',
        english: 'Walk straight.', chinese: '直走。',
      },
      {
        role: 'B', roleLabel: 'Alumno/a',
        spanish: '¿Así?', korean: '이렇게?',
        english: 'Like this?', chinese: '这样吗？',
      },
      {
        role: 'A', roleLabel: 'Profesor/a',
        spanish: 'Más despacio. Escuchá la música.', korean: '더 천천히. 음악을 들어.',
        english: 'Slower. Listen to the music.', chinese: '慢一点。听音乐。',
      },
      {
        role: 'A', roleLabel: 'Profesor/a',
        spanish: 'Pará.', korean: '멈춰.',
        english: 'Stop.', chinese: '停。',
      },
      {
        role: 'A', roleLabel: 'Profesor/a',
        spanish: 'Empezá de nuevo. Con calma.', korean: '처음부터 다시. 차분하게.',
        english: 'Start again. Calmly.', chinese: '重新开始。冷静地。',
      },
      {
        role: 'B', roleLabel: 'Alumno/a',
        spanish: '¿Así está mejor?', korean: '이게 더 나아요?',
        english: 'Is this better?', chinese: '这样好一点吗？',
      },
      {
        role: 'A', roleLabel: 'Profesor/a',
        spanish: 'Sí, ahora caminemos juntos.', korean: '응, 이제 같이 걷자.',
        english: "Yes, now let's walk together.", chinese: '对，现在我们一起走。',
      },
    ],
  },

  // =====================================================
  // LEVEL 3 — Lesson 14: 회전 역할극
  // =====================================================

  rp3_14: {
    id: 'rp3_14', title: 'Giro completo', titleKo: '회전 종합 시뮬레이션',
    situation: '오초 → 히로 → 교정 → 질문 → 재시도',
    lines: [
      { role: 'A', roleLabel: 'Profesor/a', spanish: 'Hacé un ocho para adelante.', korean: '앞으로 오초 해.', english: 'Do a forward ocho.', chinese: '做一个前ocho。' },
      { role: 'A', roleLabel: 'Profesor/a', spanish: 'Pivotá. Girá la cadera.', korean: '피벗해. 골반을 돌려.', english: 'Pivot. Rotate your hips.', chinese: '转轴。转动臀部。' },
      { role: 'B', roleLabel: 'Alumno/a', spanish: '¿Así está bien?', korean: '이렇게 하면 맞아요?', english: 'Is this okay?', chinese: '这样可以吗？' },
      { role: 'A', roleLabel: 'Profesor/a', spanish: 'Más desde el centro. No te apures con el giro.', korean: '중심에서 더. 회전을 서두르지 마.', english: 'More from the center. Don\'t rush the turn.', chinese: '更多从中心。不要急着转。' },
      { role: 'B', roleLabel: 'Alumno/a', spanish: '¿Puedo intentar de nuevo?', korean: '다시 해봐도 될까요?', english: 'Can I try again?', chinese: '我可以再试一次吗？' },
      { role: 'A', roleLabel: 'Profesor/a', spanish: 'Sí. Primero la base. Después girá.', korean: '응. 먼저 기본. 그 다음에 돌아.', english: 'Yes. First the base. Then turn.', chinese: '好。先基础。然后转。' },
      { role: 'B', roleLabel: 'Alumno/a', spanish: 'Ahora sí. Mejor así.', korean: '이제 맞아. 이게 더 나아.', english: 'Now yes. Better like this.', chinese: '现在对了。这样更好。' },
    ],
  },

  // =====================================================
  // LEVEL 4 — Lesson 12: 연습 역할극
  // =====================================================

  rp4_12: {
    id: 'rp4_12', title: 'En la práctica', titleKo: '연습 시뮬레이션',
    situation: '연습 시작 → 피드백 → 교정 → 감정 → 마무리',
    lines: [
      { role: 'A', roleLabel: 'Pareja A', spanish: 'Otra vez, por favor.', korean: '다시요, 제발.', english: 'Again, please.', chinese: '再来一次，拜托。' },
      { role: 'B', roleLabel: 'Pareja B', spanish: 'Desde el principio?', korean: '처음부터?', english: 'From the beginning?', chinese: '从头开始？' },
      { role: 'A', roleLabel: 'Pareja A', spanish: 'Más despacio. Tomate tu tiempo.', korean: '더 천천히. 시간 갖고 해.', english: 'Slower. Take your time.', chinese: '慢一点。慢慢来。' },
      { role: 'B', roleLabel: 'Pareja B', spanish: '¿Así está mejor?', korean: '이게 더 나아요?', english: 'Is this better?', chinese: '这样好一点吗？' },
      { role: 'A', roleLabel: 'Pareja A', spanish: 'Sí, mucho mejor. Se siente bien.', korean: '응, 훨씬 나아. 느낌 좋아.', english: 'Yes, much better. It feels good.', chinese: '对，好多了。感觉很好。' },
      { role: 'B', roleLabel: 'Pareja B', spanish: 'Estoy mejorando, ¿no?', korean: '나 나아지고 있지?', english: "I'm improving, right?", chinese: '我在进步，对吧？' },
      { role: 'A', roleLabel: 'Pareja A', spanish: 'Cada vez mejor. Fue un placer.', korean: '갈수록 좋아져. 즐거웠어.', english: 'Better every time. It was a pleasure.', chinese: '每次都更好。很高兴。' },
    ],
  },

  // =====================================================
  // LEVEL 5 — Lesson 16: 밀롱가 풀 역할극
  // =====================================================

  rp5_16: {
    id: 'rp5_16', title: 'Una noche en la milonga', titleKo: '밀롱가의 한 밤',
    situation: '도착 → 카베세오 → 탄다 → 칭찬 → 코르티나 → 감사 → 작별',
    lines: [
      { role: 'A', roleLabel: 'Milonguero', spanish: 'Buenas noches.', korean: '안녕하세요.', english: 'Good evening.', chinese: '晚上好。' },
      { role: 'B', roleLabel: 'Milonguera', spanish: 'Buenas noches. Es un placer.', korean: '안녕하세요. 반갑습니다.', english: "Good evening. It's a pleasure.", chinese: '晚上好。很高兴。' },
      { role: 'A', roleLabel: 'Milonguero', spanish: '¿Querés bailar esta tanda?', korean: '이 탄다 같이 출래요?', english: 'Want to dance this tanda?', chinese: '你想跳这一组吗？' },
      { role: 'B', roleLabel: 'Milonguera', spanish: 'Con mucho gusto.', korean: '기꺼이요.', english: 'With great pleasure.', chinese: '非常乐意。' },
      { role: 'A', roleLabel: 'Milonguero', spanish: 'Me encanta esta canción.', korean: '이 노래 너무 좋아요.', english: 'I love this song.', chinese: '我很喜欢这首歌。' },
      { role: 'B', roleLabel: 'Milonguera', spanish: 'Tu abrazo es muy cómodo.', korean: '아브라소 너무 편해요.', english: 'Your embrace is very comfortable.', chinese: '你的拥抱很舒服。' },
      { role: 'A', roleLabel: 'Milonguero', spanish: 'Gracias por la tanda. Fue muy lindo.', korean: '탄다 고마워요. 너무 좋았어요.', english: 'Thanks for the tanda. It was lovely.', chinese: '谢谢这一组舞。非常棒。' },
      { role: 'B', roleLabel: 'Milonguera', spanish: 'Gracias, disfruté mucho.', korean: '고마워요, 정말 즐거웠어요.', english: 'Thank you, I enjoyed it a lot.', chinese: '谢谢，我非常享受。' },
      { role: 'A', roleLabel: 'Milonguero', spanish: 'Fue una noche hermosa. Nos vemos la próxima.', korean: '아름다운 밤이었어요. 다음에 봐요.', english: 'It was a beautiful night. See you next time.', chinese: '美好的一晚。下次见。' },
      { role: 'B', roleLabel: 'Milonguera', spanish: 'Nos vemos luego. Buenas noches.', korean: '나중에 봐요. 안녕히 가세요.', english: 'See you later. Good night.', chinese: '回头见。晚安。' },
    ],
  },
};
