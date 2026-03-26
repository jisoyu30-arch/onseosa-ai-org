import { Request, Response } from 'express';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { runSeo } from '../engines/seo';
import { runBaek } from '../engines/baek';
import { runAhn } from '../engines/ahn';
import { runHan } from '../engines/han';
import { runHong } from '../engines/hong';
import { saveToNotion } from '../utils/notion';

// SSE 클라이언트 관리
const sseClients = new Set<Response>();

export function sseRoute(_req: Request, res: Response) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('data: {"type":"connected"}\n\n');
  sseClients.add(res);
  _req.on('close', () => sseClients.delete(res));
}

function broadcast(event: string, data: unknown) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    client.write(msg);
  }
}

type StepName = 'baek' | 'ahn' | 'han' | 'seo-review' | 'hong';

interface PipelineStep {
  name: StepName;
  label: string;
  taskType: WorkerPayload['taskType'];
  run: (payload: WorkerPayload) => Promise<EngineOutput>;
}

const PIPELINE_STEPS: PipelineStep[] = [
  { name: 'baek', label: '백박사 분석', taskType: 'analyze', run: runBaek },
  { name: 'ahn', label: '정수석 기획', taskType: 'plan', run: runAhn },
  { name: 'han', label: '한강작가 창작', taskType: 'write', run: runHan },
  { name: 'seo-review', label: '서본부장 검수', taskType: 'review', run: runSeo },
  { name: 'hong', label: '홍사서 기록', taskType: 'record', run: runHong },
];

export async function pipelineRoute(req: Request, res: Response) {
  const { projectName, projectType, goal } = req.body;

  if (!projectName || !goal) {
    res.status(400).json({ ok: false, error: 'projectName and goal are required' });
    return;
  }

  const projectId = `proj_${Date.now()}`;
  const results: Record<string, EngineOutput> = {};

  broadcast('pipeline:start', { projectId, projectName, projectType, goal });

  // Step 0: 서 본부장 오케스트레이션 (프로젝트 타입 판별)
  broadcast('engine:status', { engine: 'seo', status: 'working', task: '프로젝트 분석' });
  try {
    const seoResult = await runSeo({
      projectId,
      projectName,
      projectType: projectType || 'playlist',
      taskType: 'orchestrate',
      instruction: goal,
    });
    results['orchestrate'] = seoResult;
    broadcast('engine:done', { engine: 'seo', step: 'orchestrate', result: seoResult });
  } catch (err) {
    broadcast('engine:error', { engine: 'seo', error: String(err) });
  }
  broadcast('engine:status', { engine: 'seo', status: 'idle' });

  // 파이프라인 실행
  let upstream: Record<string, unknown> = results['orchestrate']?.data || {};
  let retryCount = 0;

  for (let i = 0; i < PIPELINE_STEPS.length; i++) {
    const step = PIPELINE_STEPS[i];
    const engineName = step.name === 'seo-review' ? 'seo' : step.name;

    broadcast('engine:status', { engine: engineName, status: 'working', task: step.label });

    try {
      const payload: WorkerPayload = {
        projectId,
        projectName,
        projectType: projectType || 'playlist',
        taskType: step.taskType,
        instruction: goal,
        context: {
          ...upstream,
          retry_count: step.name === 'seo-review' ? retryCount : undefined,
        },
      };

      const output = await step.run(payload);
      results[step.name] = output;

      broadcast('engine:done', { engine: engineName, step: step.name, result: output });
      broadcast('engine:status', { engine: engineName, status: 'idle' });

      // 검수에서 revise → 한강작가로 돌아가기 (최대 2회)
      if (step.name === 'seo-review' && output.status === 'revise' && retryCount < 2) {
        retryCount++;
        upstream = {
          ...upstream,
          weak_point: (output.data as Record<string, unknown>).weak_point,
          fix_instruction: (output.data as Record<string, unknown>).fix_instruction,
        };
        // han 단계로 되돌아가기 (index 2)
        i = 1; // 루프 끝에서 i++되면 2(han)가 됨
        broadcast('pipeline:retry', { retryCount, reason: output.summary });
        continue;
      }

      // 다음 단계로 upstream 전달
      upstream = { ...upstream, ...output.data };
    } catch (err) {
      broadcast('engine:error', { engine: engineName, step: step.name, error: String(err) });
      broadcast('engine:status', { engine: engineName, status: 'idle' });
    }
  }

  // 파이프라인 완료 후 Notion 자동 저장
  broadcast('engine:status', { engine: 'system', status: 'working', task: 'Notion 저장' });
  try {
    const hanData = results['han']?.data || {};
    const reviewData = results['seo-review']?.data || {};
    await saveToNotion({
      projectName,
      projectType: projectType || 'playlist',
      results: { ...hanData, score: reviewData.score },
    });
    broadcast('engine:done', { engine: 'system', step: 'notion', result: { summary: 'Notion 저장 완료' } });
  } catch (err) {
    console.warn('[Pipeline] Notion save failed:', (err as Error).message);
    broadcast('engine:error', { engine: 'system', step: 'notion', error: String(err) });
  }
  broadcast('engine:status', { engine: 'system', status: 'idle' });

  broadcast('pipeline:done', { projectId, results });

  res.json({
    ok: true,
    projectId,
    results,
  });
}
