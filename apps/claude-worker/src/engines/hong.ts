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

  // 2. Google Drive 저장
  try {
    // 제목 추출
    const titles = context.title_options || context.titles || [];
    const titleContent = Array.isArray(titles) ? titles.join('\n') : String(titles || '');

    // 설명문 추출
    const desc = context.description || context.descriptions || '';
    const descContent = Array.isArray(desc) ? desc.join('\n\n') : String(desc);

    // 카피 추출
    const copies = context.copy_variants || context.copies || [];
    const copyContent = Array.isArray(copies) ? copies.join('\n\n') : String(copies || '');

    console.log(`[hong] Drive data — titles: ${titleContent.length}ch, desc: ${descContent.length}ch, copy: ${copyContent.length}ch`);

    if (titleContent || descContent) {
      await savePlaylistToDrive({
        channelName: payload.projectName || 'default',
        date: new Date().toISOString().split('T')[0],
        titleContent: titleContent || '(제목 없음)',
        descriptionContent: descContent || JSON.stringify(context, null, 2),
        copyContent: copyContent || '',
      });
      savedTo.push('google-drive');
    } else {
      console.warn('[hong] No title/desc data found in context. Keys:', Object.keys(context).join(', '));
    }
  } catch (err) {
    console.warn('[hong] Drive save failed:', (err as Error).message);
  }

  return {
    engine: 'hong',
    status: 'done',
    summary: `홍사서 기록 완료 → ${savedTo.join(', ') || '(저장 대기)'}`,
    data: {
      saved: savedTo.length > 0,
      savedTo,
      projectId: payload.projectId,
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
