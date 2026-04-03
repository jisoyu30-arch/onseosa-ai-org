import Anthropic from '@anthropic-ai/sdk';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { loadPrompt } from '../utils/prompt-loader';
import { addCalendarEvent, getCalendarEvents, getCalendarEventsRange } from '../utils/google-calendar';
import { getSecretaryMemory, upsertSecretaryMemory } from '../utils/memory';

interface SecretaryParsed {
  action: 'add_event' | 'briefing' | 'unknown';
  event?: {
    summary: string;
    start: string;
    end: string;
    description?: string;
    location?: string;
    allDay?: boolean;
  };
  reply: string;
}

export async function runSecretary(payload: WorkerPayload): Promise<EngineOutput> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const systemPrompt = loadPrompt('secretary');

  // ── memory_read: secretary 시작 전 장기 기억 로드 ──────────
  const pendingTasks = await getSecretaryMemory('pending').catch(() => []);
  const inProgressTasks = await getSecretaryMemory('in_progress').catch(() => []);
  const secretaryContext = {
    pendingReminders: pendingTasks.slice(0, 5).map(t => ({
      task: t.task_summary,
      due: t.due_date,
      nextCheck: t.next_check_date,
      project: t.project,
    })),
    inProgressCount: inProgressTasks.length,
  };

  const today = new Date().toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const todayIso = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });

  // 일정 조회 범위 판별
  const lowerInstruction = payload.instruction.toLowerCase();

  function getKSTDate(offsetDays = 0): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
  }

  function getScheduleRange(): { timeMin: string; timeMax: string; label: string } | null {
    if (lowerInstruction.includes('금주') || lowerInstruction.includes('이번 주') || lowerInstruction.includes('이번주')) {
      const now = new Date();
      const day = now.getDay(); // 0=일,1=월...6=토
      const monday = new Date(now); monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
      const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
      const from = monday.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
      const to = sunday.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
      return { timeMin: `${from}T00:00:00+09:00`, timeMax: `${to}T23:59:59+09:00`, label: '이번 주' };
    }
    if (lowerInstruction.includes('다음주') || lowerInstruction.includes('다음 주')) {
      const now = new Date();
      const day = now.getDay();
      const monday = new Date(now); monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + 7);
      const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
      const from = monday.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
      const to = sunday.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
      return { timeMin: `${from}T00:00:00+09:00`, timeMax: `${to}T23:59:59+09:00`, label: '다음 주' };
    }
    if (lowerInstruction.includes('이번달') || lowerInstruction.includes('이번 달') || lowerInstruction.includes('이번월') || lowerInstruction.includes('월간')) {
      const now = new Date();
      const from = `${todayIso.slice(0, 7)}-01`;
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const to = `${todayIso.slice(0, 7)}-${lastDay}`;
      return { timeMin: `${from}T00:00:00+09:00`, timeMax: `${to}T23:59:59+09:00`, label: '이번 달' };
    }
    if (lowerInstruction.includes('올해') || lowerInstruction.includes('연간') || lowerInstruction.includes('올 한해')) {
      const year = todayIso.slice(0, 4);
      return { timeMin: `${year}-01-01T00:00:00+09:00`, timeMax: `${year}-12-31T23:59:59+09:00`, label: '올해' };
    }
    if (lowerInstruction.includes('10년') || lowerInstruction.includes('향후')) {
      const year = parseInt(todayIso.slice(0, 4));
      return { timeMin: `${year}-01-01T00:00:00+09:00`, timeMax: `${year + 10}-12-31T23:59:59+09:00`, label: '향후 10년' };
    }
    return null;
  }

  let existingEvents: Awaited<ReturnType<typeof getCalendarEvents>> = [];
  let scheduleRangeLabel = '오늘';

  const isBriefingRequest =
    lowerInstruction.includes('브리핑') ||
    lowerInstruction.includes('일정') ||
    lowerInstruction.includes('스케줄') ||
    lowerInstruction.includes('뭐 있') ||
    lowerInstruction.includes('뭐있');

  if (isBriefingRequest) {
    const range = getScheduleRange();
    try {
      if (range) {
        scheduleRangeLabel = range.label;
        existingEvents = await getCalendarEventsRange(range.timeMin, range.timeMax);
      } else {
        existingEvents = await getCalendarEvents(todayIso);
      }
    } catch (err) {
      console.warn('[김비서] 캘린더 조회 실패:', (err as Error).message);
    }
  }

  const userMessage = JSON.stringify({
    today,
    todayIso,
    instruction: payload.instruction,
    scheduleRange: scheduleRangeLabel,
    existingEvents: existingEvents.length > 0 ? existingEvents : undefined,
  });

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  let parsed: SecretaryParsed;
  try {
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { action: 'unknown', reply: '요청을 이해하지 못했어요.' };
  } catch {
    parsed = { action: 'unknown', reply: '응답 파싱에 실패했어요.' };
  }

  // add_event 처리
  let eventLink = '';
  if (parsed.action === 'add_event' && parsed.event) {
    try {
      const result = await addCalendarEvent(parsed.event);
      eventLink = result.link;
      console.log(`[김비서] 일정 등록: ${parsed.event.summary} → ${result.link}`);
    } catch (err) {
      console.warn('[김비서] 캘린더 등록 실패:', (err as Error).message);
      parsed.reply = `일정 파싱은 완료했지만 캘린더 등록에 실패했어요: ${(err as Error).message}`;
    }
  }

  return {
    engine: 'secretary',
    status: 'done',
    summary: parsed.reply,
    data: {
      action: parsed.action,
      event: parsed.event || null,
      reply: parsed.reply,
      eventLink,
    },
  };
}
