import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { getSupabase } from '../utils/supabase';
import { savePlaylistToDrive } from '../utils/google-drive';

export async function runLuka(payload: WorkerPayload): Promise<EngineOutput> {
  const supabase = getSupabase();
  const context = payload.context || {};

  // 1. 태스크 히스토리 저장
  if (context.taskId) {
    await supabase.from('task_history').insert({
      task_id: context.taskId,
      engine_name: context.engineName || 'luka',
      action_type: 'save',
      input_data: context.inputData || {},
      output_data: context.outputData || {},
      feedback: context.feedback || '',
      result_status: context.resultStatus || 'done',
    });
  }

  // 2. 엔진 기억 업데이트
  if (context.engineMemory) {
    const engineMem = context.engineMemory as { engineName: string; [key: string]: unknown };
    if (engineMem.engineName) {
      await supabase.from('engine_memory').update({
        strong_points: engineMem.strongPoints || [],
        weak_points: engineMem.weakPoints || [],
        success_patterns: engineMem.successPatterns || [],
        failure_patterns: engineMem.failurePatterns || [],
      }).eq('engine_name', engineMem.engineName);
    }
  }

  // 3. 프로젝트 기억 업데이트
  if (context.projectMemory && payload.projectId) {
    const memory = context.projectMemory as Record<string, unknown>;
    await supabase.from('project_memory').upsert({
      project_id: payload.projectId,
      ...memory,
    });
  }

  // 4. Notion 저장 (TODO: Phase 1에서 구현)

  // 5. Google Drive 저장 (플레이리스트)
  if (payload.projectType === 'playlist' && context.outputData) {
    const output = context.outputData as Record<string, unknown>;
    const today = new Date().toISOString().split('T')[0];

    const titleOptions = (output.title_options as string[]) || [];
    const titleContent = [
      `추천 제목: ${output.recommended_title || titleOptions[0] || ''}`,
      ...titleOptions.map((t: string, i: number) => `후보 ${i + 1}: ${t}`),
      `칼 점수: ${context.score || '미정'}점`,
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
    } catch (err) {
      console.error('[Luka] Drive save failed, continuing:', err);
    }
  }

  return {
    engine: 'luka',
    status: 'done',
    summary: '기억 저장 완료',
    data: {
      saved: true,
      taskId: context.taskId || null,
      projectId: payload.projectId,
    },
  };
}
