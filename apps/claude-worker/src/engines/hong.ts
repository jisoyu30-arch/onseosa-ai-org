import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { getSupabase } from '../utils/supabase';
import { savePlaylistToDrive } from '../utils/google-drive';

export async function runHong(payload: WorkerPayload): Promise<EngineOutput> {
  const supabase = getSupabase();
  const context = payload.context || {};
  const savedTo: string[] = [];

  // 1. Supabase 태스크 히스토리 저장
  try {
    await supabase.from('task_history').insert({
      task_id: context.taskId || payload.projectId,
      engine_name: 'hong',
      action_type: 'save',
      input_data: { projectName: payload.projectName, goal: payload.instruction },
      output_data: context,
      feedback: '',
      result_status: 'done',
    });
    savedTo.push('supabase');
  } catch (err) {
    console.warn('[hong] Supabase save skipped:', (err as Error).message);
  }

  // 2. Google Drive 저장 (폴더 생성 + n8n 업로드)
  try {
    const titles = context.title_options || context.titles || [];
    const titleContent = Array.isArray(titles) ? titles.join('\n') : String(titles);
    const descContent = context.description || context.descriptions
      ? (Array.isArray(context.descriptions) ? context.descriptions.join('\n\n') : String(context.description || context.descriptions || ''))
      : '';
    const copyContent = context.copy_variants || context.copies
      ? (Array.isArray(context.copy_variants || context.copies)
        ? (context.copy_variants as string[] || context.copies as string[]).join('\n\n')
        : String(context.copy_variants || context.copies || ''))
      : '';

    if (titleContent || descContent) {
      await savePlaylistToDrive({
        channelName: payload.projectName || 'default',
        date: new Date().toISOString().split('T')[0],
        titleContent: titleContent || '(제목 없음)',
        descriptionContent: descContent || JSON.stringify(context, null, 2),
        copyContent: copyContent || '',
      });
      savedTo.push('google-drive');
    }
  } catch (err) {
    console.warn('[hong] Drive save skipped:', (err as Error).message);
  }

  // 3. Notion 저장은 파이프라인에서 MCP로 처리
  // (내부 integration 연결 불필요, MCP가 직접 저장)

  return {
    engine: 'hong',
    status: 'done',
    summary: `홍사서 기록 완료 → ${savedTo.join(', ') || '(저장 대기)'}`,
    data: {
      saved: savedTo.length > 0,
      savedTo,
      projectId: payload.projectId,
      // Notion 저장용 데이터를 pipeline으로 전달
      notionReady: true,
      notionData: {
        projectName: payload.projectName,
        projectType: payload.projectType,
        score: context.score,
        results: context,
      },
    },
  };
}
