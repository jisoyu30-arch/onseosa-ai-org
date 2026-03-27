import { Request, Response } from 'express';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { runArko } from '../engines/arko';
import { runNoah } from '../engines/noah';
import { runEden } from '../engines/eden';
import { runRia } from '../engines/ria';
import { runLuka } from '../engines/luka';

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

type StepName = 'noah' | 'eden' | 'ria' | 'arko-review' | 'luka';

interface PipelineStep {
  name: StepName;
  label: string;
  taskType: WorkerPayload['taskType'];
  run: (payload: WorkerPayload) => Promise<EngineOutput>;
}

const PIPELINE_STEPS: PipelineStep[] = [
  { name: 'noah', label: '노아 분석', taskType: 'analyze', run: runNoah },
  { name: 'eden', label: '이든 기획', taskType: 'plan', run: runEden },
  { name: 'ria', label: '리아 창작', taskType: 'write', run: runRia },
  { name: 'arko-review', label: '아르코 검수', taskType: 'review', run: runArko },
  { name: 'luka', label: '루카 기록', taskType: 'record', run: runLuka },
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

  // Step 0: 아르코 총괄 분석 (프로젝트 타입 판별 + 방향 설정)
  broadcast('engine:status', { engine: 'arko', status: 'working', task: '프로젝트 분석' });
  try {
    const arkoResult = await runArko({
      projectId,
      projectName,
      projectType: projectType || 'playlist',
      taskType: 'orchestrate',
      instruction: goal,
    });
    results['orchestrate'] = arkoResult;
    broadcast('engine:done', { engine: 'arko', step: 'orchestrate', result: arkoResult });
  } catch (err) {
    broadcast('engine:error', { engine: 'arko', error: String(err) });
  }
  broadcast('engine:status', { engine: 'arko', status: 'idle' });

  // 파이프라인 실행
  let upstream: Record<string, unknown> = results['orchestrate']?.data || {};
  let retryCount = 0;

  for (let i = 0; i < PIPELINE_STEPS.length; i++) {
    const step = PIPELINE_STEPS[i];
    const engineName = step.name === 'arko-review' ? 'arko' : step.name;

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
          retry_count: step.name === 'arko-review' ? retryCount : undefined,
          // luka에게 전체 결과 전달
          ...(step.name === 'luka' ? {
            allResults: results,
            score: results['arko-review']?.score,
            outputData: results['ria']?.data,
            engineName: 'ria',
            resultStatus: results['arko-review']?.status,
            feedback: results['arko-review']?.summary,
          } : {}),
        },
      };

      const output = await step.run(payload);
      results[step.name] = output;

      broadcast('engine:done', { engine: engineName, step: step.name, result: output });
      broadcast('engine:status', { engine: engineName, status: 'idle' });

      // 검수에서 revise → 리아로 돌아가기 (최대 2회)
      if (step.name === 'arko-review' && output.status === 'revise' && retryCount < 2) {
        retryCount++;
        upstream = {
          ...upstream,
          weak_point: (output.data as Record<string, unknown>).weak_point,
          fix_instruction: (output.data as Record<string, unknown>).fix_instruction,
        };
        // ria 단계로 되돌아가기 (index 2)
        i = 1; // 루프 끝에서 i++되면 2(ria)가 됨
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

  broadcast('pipeline:done', { projectId, results });

  res.json({
    ok: true,
    projectId,
    results,
  });
}
