import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { getSupabase } from '../utils/supabase';
import { savePlaylistToDrive } from '../utils/google-drive';
import { saveToNotion } from '../utils/notion';

export async function runLuka(payload: WorkerPayload): Promise<EngineOutput> {
  const supabase = getSupabase();
  const context = payload.context || {};
  const savedTo: string[] = [];

  // 1. 태스크 히스토리 저장
  if (context.taskId || payload.projectId) {
    try {
      await supabase.from('task_history').insert({
        task_id: context.taskId || null,
        engine_name: (context.engineName as string) || 'ria',
        action_type: 'save',
        input_data: context.inputData || {},
        output_data: context.outputData || {},
        feedback: (context.feedback as string) || '',
        result_status: (context.resultStatus as string) || 'done',
      });
      savedTo.push('Supabase:task_history');
    } catch (err) {
      console.warn('[Luka] task_history save failed:', (err as Error).message);
    }
  }

  // 2. 엔진 기억 업데이트
  if (context.engineMemory) {
    const engineMem = context.engineMemory as { engineName: string; [key: string]: unknown };
    if (engineMem.engineName) {
      try {
        await supabase.from('engine_memory').update({
          strong_points: engineMem.strongPoints || [],
          weak_points: engineMem.weakPoints || [],
          success_patterns: engineMem.successPatterns || [],
          failure_patterns: engineMem.failurePatterns || [],
        }).eq('engine_name', engineMem.engineName);
        savedTo.push('Supabase:engine_memory');
      } catch (err) {
        console.warn('[Luka] engine_memory update failed:', (err as Error).message);
      }
    }
  }

  // 3. 프로젝트 기억 업데이트
  if (context.projectMemory && payload.projectId) {
    const memory = context.projectMemory as Record<string, unknown>;
    try {
      await supabase.from('project_memory').upsert({
        project_id: payload.projectId,
        ...memory,
      });
      savedTo.push('Supabase:project_memory');
    } catch (err) {
      console.warn('[Luka] project_memory upsert failed:', (err as Error).message);
    }
  }

  // 4. Notion 저장
  try {
    const outputData = (context.outputData || {}) as Record<string, unknown>;
    await saveToNotion({
      projectName: payload.projectName,
      projectType: payload.projectType || 'playlist',
      results: {
        ...outputData,
        score: context.score,
      },
    });
    savedTo.push('Notion');
  } catch (err) {
    console.warn('[Luka] Notion save failed:', (err as Error).message);
  }

  // 5. Google Drive 저장 (플레이리스트)
  if (payload.projectType === 'playlist' && context.outputData) {
    const output = context.outputData as Record<string, unknown>;
    const today = new Date().toISOString().split('T')[0];

    const titleOptions = (output.title_options as string[]) || [];
    const titleContent = [
      `추천 제목: ${output.recommended_title || titleOptions[0] || ''}`,
      ...titleOptions.map((t: string, i: number) => `후보 ${i + 1}: ${t}`),
      `검수 점수: ${context.score || '미정'}점`,
    ].join('\n');

    const descContent = [
      output.description || '',
      '---',
      `감정 톤: ${output.tone_used || ''}`,
      `첫 문장: ${output.first_sentence || ''}`,
    ].join('\n');

    const copyVariants = (output.copy_variants as string[]) || [];
    const copyContent = [
      `추천 카피: ${copyVariants[0] || ''}`,
      ...copyVariants.map((c: string, i: number) => `카피 ${i + 1}: ${c}`),
    ].join('\n');

    try {
      await savePlaylistToDrive({
        channelName: (context.channelName as string) || '기본채널',
        date: today,
        titleContent,
        descriptionContent: descContent,
        copyContent,
      });
      savedTo.push('Drive');
    } catch (err) {
      console.warn('[Luka] Drive save failed:', (err as Error).message);
    }
  }

  return {
    engine: 'luka',
    status: 'done',
    summary: `기록 완료: ${savedTo.length > 0 ? savedTo.join(', ') : '저장 대상 없음'}`,
    data: {
      saved: savedTo.length > 0,
      savedTo,
      projectId: payload.projectId,
    },
  };
}
