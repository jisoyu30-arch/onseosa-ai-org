import { Level, Unit, Lesson } from '../types';

export const levels: Level[] = [
  {
    id: 'lv1',
    title: 'Cuerpo y postura',
    titleKo: '몸과 자세',
    description: '탱고의 기본 — 몸의 감각에서 시작하기',
    unitIds: ['u1'],
    order: 1,
  },
];

export const units: Unit[] = [
  {
    id: 'u1',
    levelId: 'lv1',
    title: 'Nuestro cuerpo',
    titleKo: '우리 몸',
    lessonIds: ['les1', 'les2'],
    order: 1,
  },
];

export const lessons: Lesson[] = [
  {
    id: 'les1',
    unitId: 'u1',
    title: 'Cara y mirada',
    titleKo: '얼굴과 시선',
    situation: '수업 시작 — 선생님이 자세를 잡아줄 때',
    sentenceIds: ['s1', 's2', 's3'],
    quizIds: ['q1', 'q2', 'q3', 'q4'],
    roleplayId: 'rp1',
    order: 1,
  },
  {
    id: 'les2',
    unitId: 'u1',
    title: 'Parte superior del cuerpo',
    titleKo: '상체와 자세',
    situation: '수업 중 — 상체 자세 교정',
    sentenceIds: ['s4', 's5', 's6'],
    quizIds: ['q5', 'q6', 'q7', 'q8'],
    order: 2,
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getUnitById(id: string): Unit | undefined {
  return units.find((u) => u.id === id);
}

export function getLevelById(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}
