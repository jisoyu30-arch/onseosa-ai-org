import { RoleplayDialog } from '../types';

export const roleplays: Record<string, RoleplayDialog> = {
  rp1: {
    id: 'rp1',
    title: 'En la clase',
    titleKo: '수업 시간에',
    situation: '선생님이 자세를 교정하는 수업 장면',
    lines: [
      {
        role: 'A',
        roleLabel: 'Profesor',
        spanish: 'Relajá los hombros.',
        korean: '어깨 힘 빼.',
        english: 'Relax your shoulders.',
        chinese: '放松肩膀。',
      },
      {
        role: 'B',
        roleLabel: 'Alumno',
        spanish: '¿Así está bien?',
        korean: '이렇게 하면 맞나요?',
        english: 'Is this okay?',
        chinese: '这样可以吗？',
      },
      {
        role: 'A',
        roleLabel: 'Profesor',
        spanish: 'Sí, pero mové el cuerpo, no los pies.',
        korean: '맞아, 근데 발 말고 몸을 움직여.',
        english: "Yes, but move your body, not your feet.",
        chinese: '对，但是移动身体，不是脚。',
      },
      {
        role: 'B',
        roleLabel: 'Alumno',
        spanish: 'Ah, entiendo.',
        korean: '아, 이해됐어요.',
        english: 'Ah, I understand.',
        chinese: '啊，我明白了。',
      },
    ],
  },
};
