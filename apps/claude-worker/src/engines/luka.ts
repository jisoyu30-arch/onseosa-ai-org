import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { getSupabase } from '../utils/supabase';
import { saveToNotion } from '../utils/notion';
import { writeArkoMemory } from '../utils/memory';

export async function runLuka(payload: WorkerPayload): Promise<EngineOutput> {
  const supabase = getSupabase();
  const context = payload.context || {};
  const today = new Date().toISOString().split('T')[0];
  const projectType = payload.projectType || 'general';
  const taskId = (context.taskId as string) || payload.projectId;

  // arko-review status 확인
  // pass / done / revise(soft-pass) → 저장 허용
  // fail → 보류
  const reviewStatus = (context.resultStatus as string) || '';
  const held = reviewStatus === 'fail';

  if (held) {
    console.log(`[Luka] 저장 보류 — 검수 미통과: ${reviewStatus}`);
    return {
      engine: 'luka',
      status: 'fail',
      summary: `저장 보류 — 검수 실패 (${reviewStatus})`,
      data: {
        task_id: taskId,
        domain: projectType,
        held: true,
        checklist: {
          review_passed: false,
          db_saved: false,
          notion_saved: false,
          youtube_saved: false,
        },
        incomplete_items: ['arko-review status = pass 미충족'],
        saved_paths: { notion: null, youtube: null },
        summary: `저장 보류 — 검수 상태: ${reviewStatus}`,
      },
    };
  }

  const canonicalType = projectType === 'publish' ? 'broadcast' : projectType;

  // 영상 도메인 여부
  const isVideoType = ['playlist', 'webdrama', 'broadcast', 'music_video'].includes(canonicalType);

  // 체크리스트 추적
  const checklist = {
    review_passed: reviewStatus === 'pass' || reviewStatus === 'done',
    db_saved: false,
    notion_saved: false,
    youtube_saved: false,
  };
  const incompleteItems: string[] = [];
  let notionUrl: string | null = null;
  let youtubeUrl: string | null = null;

  // 1. Notion 저장 (텍스트 결과물) — URL 먼저 확보
  try {
    const outputData = (context.outputData || {}) as Record<string, unknown>;
    const pageUrl = await saveToNotion({
      projectName: payload.projectName,
      projectType: canonicalType,
      results: { ...outputData, score: context.score },
    });
    checklist.notion_saved = true;
    notionUrl = pageUrl || null;
    console.log('[Luka] Notion 저장 완료:', notionUrl);
  } catch (err) {
    console.warn('[Luka] Notion save failed:', (err as Error).message);
    incompleteItems.push('Notion 저장 실패');
  }

  // 2. task_history 저장 (Supabase DB) — notion URL 포함해서 한 번에
  try {
    const outputData = (context.outputData || {}) as Record<string, unknown>;
    const { error } = await supabase.from('task_history').insert({
      task_id: null, // UUID 타입 — 커스텀 project_id는 input_data에 저장
      engine_name: (context.engineName as string) || 'ria',
      action_type: 'save',
      input_data: { project_id: taskId, goal: payload.instruction, projectName: payload.projectName, projectType: canonicalType },
      output_data: outputData,
      feedback: (context.feedback as string) || '',
      result_status: reviewStatus || 'done',
      score: (context.score as number) || null,
      saved_paths: { notion: notionUrl, youtube: null, cover: null },
    });
    if (error) throw new Error(error.message);
    checklist.db_saved = true;
    console.log('[Luka] Supabase task_history 저장 완료');
  } catch (err) {
    console.warn('[Luka] task_history save failed:', (err as Error).message);
    incompleteItems.push('DB 저장 실패');
  }

  // 3. 커버 이미지 Google Drive 업로드 (Mika 생성)
  const coverImagePath = (context.coverImagePath as string) || '';
  let coverDriveUrl: string | null = null;
  if (coverImagePath) {
    try {
      const { uploadBinaryViaN8n } = await import('../utils/google-drive');
      const rootId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
      if (rootId) {
        const coverFileName = `cover_${payload.projectName}_${today}.jpg`;
        await uploadBinaryViaN8n(coverFileName, coverImagePath, rootId);
        coverDriveUrl = `drive:${coverFileName}`;
        console.log(`[Luka] 커버 이미지 Drive 업로드 완료: ${coverFileName}`);
      }
    } catch (err) {
      console.warn('[Luka] 커버 이미지 Drive 업로드 실패:', (err as Error).message);
      incompleteItems.push('커버 이미지 Drive 업로드 실패');
    }
  }

  // 4. YouTube 업로드 (영상 파일이 있을 때만)
  const videoFilePath = (context.videoFilePath as string) || '';
  if (isVideoType && videoFilePath) {
    try {
      const { uploadToYouTube } = await import('../utils/youtube');
      const outputData = (context.outputData || {}) as Record<string, unknown>;
      const title = (outputData.recommended_title as string) || payload.projectName;
      const description = (outputData.description as string) || '';

      const result = await uploadToYouTube({
        title,
        description,
        filePath: videoFilePath,
        privacyStatus: 'private', // 기본 비공개 — 검수 후 수동 공개
        categoryId: canonicalType === 'music_video' ? '10' : '27',
      });
      checklist.youtube_saved = true;
      youtubeUrl = result.url;
      console.log(`[Luka] YouTube 업로드 완료: ${result.url}`);
    } catch (err) {
      console.warn('[Luka] YouTube upload failed:', (err as Error).message);
      incompleteItems.push('YouTube 업로드 실패');
    }
  } else if (isVideoType && !videoFilePath) {
    // 영상 도메인인데 파일 없음 — 준비중
    incompleteItems.push(`YouTube 업로드 보류 — 영상 파일 미전달 (${canonicalType})`);
    console.log(`[Luka] 영상 도메인(${canonicalType})이지만 videoFilePath 없음 — YouTube 업로드 건너뜀`);
  } else {
    // 텍스트 도메인 — YouTube 불필요
    checklist.youtube_saved = true; // 해당 없음으로 체크 통과
  }

  const allComplete = Object.values(checklist).every(Boolean);

  // memory_write
  await writeArkoMemory({
    projectName: payload.projectName,
    taskSummary: `${canonicalType} 작업 완료 — ${(context.outputData as Record<string, unknown>)?.recommended_title || '제목 미정'}`,
    domain: canonicalType,
    status: reviewStatus === 'pass' ? 'pass' : reviewStatus === 'done' ? 'done' : 'revise',
    score: (context.score as number) || undefined,
    savedPaths: { notion: notionUrl || undefined },
    nextAction: allComplete ? '다음 작업 대기' : `미완료 항목 처리: ${incompleteItems[0] || ''}`,
    confirmedFacts: [
      `도메인: ${canonicalType}`,
      `검수 점수: ${context.score || '미정'}`,
      ...(youtubeUrl ? [`YouTube: ${youtubeUrl}`] : []),
    ],
  }).catch(err => console.warn('[Luka] Memory write failed:', (err as Error).message));

  return {
    engine: 'luka',
    status: 'done',
    summary: allComplete
      ? `기록 완료 — ${canonicalType} 저장 완료`
      : `기록 완료 (일부 미완료: ${incompleteItems.join(', ')})`,
    data: {
      task_id: taskId,
      domain: canonicalType,
      held: false,
      checklist,
      incomplete_items: incompleteItems,
      saved_paths: { notion: notionUrl, youtube: youtubeUrl, cover: coverDriveUrl },
      summary: allComplete ? '전체 저장 완료' : `미완료 항목: ${incompleteItems.join(', ')}`,
    },
  };
}
