import { google } from 'googleapis';
import { resolve } from 'path';

// 서비스 계정으로 Calendar 클라이언트 생성
// 주의: 캘린더를 서비스 계정 이메일에 공유해야 접근 가능
function getCalendarClient() {
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || '';
  const absoluteKeyFile = resolve(__dirname, '../../../..', keyFile);

  const auth = new google.auth.GoogleAuth({
    keyFile: absoluteKeyFile,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  return google.calendar({ version: 'v3', auth });
}

// 사용할 캘린더 ID (환경변수, 없으면 기본 'primary')
function getCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID || 'primary';
}

export interface CalendarEvent {
  summary: string;
  start: string; // ISO 8601 (KST)
  end: string;   // ISO 8601 (KST)
  description?: string;
  location?: string;
  allDay?: boolean;
}

// 일정 추가
export async function addCalendarEvent(event: CalendarEvent): Promise<{ id: string; link: string }> {
  const calendar = getCalendarClient();
  const calendarId = getCalendarId();

  const requestBody = event.allDay
    ? {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: { date: event.start.split('T')[0] },
        end: { date: event.end.split('T')[0] },
      }
    : {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: { dateTime: event.start, timeZone: 'Asia/Seoul' },
        end: { dateTime: event.end, timeZone: 'Asia/Seoul' },
      };

  const res = await calendar.events.insert({
    calendarId,
    requestBody,
  });

  return {
    id: res.data.id || '',
    link: res.data.htmlLink || '',
  };
}

// 특정 날짜 일정 조회 (기본: 오늘)
export async function getCalendarEvents(date?: string): Promise<
  Array<{ summary: string; start: string; end: string; allDay: boolean }>
> {
  const targetDate = date || new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
  return getCalendarEventsRange(`${targetDate}T00:00:00+09:00`, `${targetDate}T23:59:59+09:00`);
}

// 기간 범위 일정 조회
export async function getCalendarEventsRange(timeMin: string, timeMax: string): Promise<
  Array<{ summary: string; start: string; end: string; allDay: boolean }>
> {
  const calendar = getCalendarClient();
  const calendarId = getCalendarId();

  const res = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 100,
  });

  const items = res.data.items || [];
  return items.map(item => {
    const allDay = !item.start?.dateTime;
    const start = item.start?.dateTime || item.start?.date || '';
    const end = item.end?.dateTime || item.end?.date || '';
    return {
      summary: item.summary || '(제목 없음)',
      start,
      end,
      allDay,
    };
  });
}
