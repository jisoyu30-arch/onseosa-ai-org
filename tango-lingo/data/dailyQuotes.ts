import { DailyQuote } from '../types';

export const dailyQuotes: DailyQuote[] = [
  {
    id: 'dq1',
    spanish: 'Mové el cuerpo, no los pies.',
    korean: '몸을 움직여, 발 말고.',
    english: 'Move your body, not your feet.',
    source: 'Tango class saying',
  },
  {
    id: 'dq2',
    spanish: 'El tango se baila con el corazón.',
    korean: '탱고는 마음으로 춘다.',
    english: 'Tango is danced with the heart.',
  },
  {
    id: 'dq3',
    spanish: 'Escuchá la música, no los pasos.',
    korean: '스텝이 아니라 음악을 들어.',
    english: 'Listen to the music, not the steps.',
  },
  {
    id: 'dq4',
    spanish: 'La conexión empieza con la mirada.',
    korean: '연결은 시선에서 시작된다.',
    english: 'Connection starts with the gaze.',
  },
  {
    id: 'dq5',
    spanish: 'Menos fuerza, más intención.',
    korean: '힘은 줄이고, 의도를 넣어.',
    english: 'Less force, more intention.',
  },
];

export function getTodayQuote(): DailyQuote {
  const dayIndex = new Date().getDate() % dailyQuotes.length;
  return dailyQuotes[dayIndex];
}
