import { Request, Response } from 'express';
import type { WorkerPayload, WorkerResult } from '@ons/engine-contracts';
import { runSeo } from '../engines/seo';
import { runBaek } from '../engines/baek';
import { runAhn } from '../engines/ahn';
import { runHan } from '../engines/han';
import { runHong } from '../engines/hong';

const ENGINE_MAP = {
  orchestrate: { name: 'seo', handler: runSeo },
  analyze: { name: 'baek', handler: runBaek },
  plan: { name: 'ahn', handler: runAhn },
  write: { name: 'han', handler: runHan },
  review: { name: 'seo', handler: runSeo },
  record: { name: 'hong', handler: runHong },
} as const;

export async function executeRoute(req: Request, res: Response) {
  const payload = req.body as WorkerPayload;

  if (!payload.taskType || !payload.projectId) {
    res.status(400).json({ ok: false, error: 'taskType and projectId are required' });
    return;
  }

  const engine = ENGINE_MAP[payload.taskType];
  if (!engine) {
    res.status(400).json({ ok: false, error: `Unknown taskType: ${payload.taskType}` });
    return;
  }

  try {
    console.log(`[${engine.name}] Starting ${payload.taskType} for project: ${payload.projectName}`);
    const output = await engine.handler(payload);

    const result: WorkerResult = {
      ok: true,
      engine: engine.name,
      output,
    };

    console.log(`[${engine.name}] Completed with status: ${output.status}`);
    res.json(result);
  } catch (error) {
    console.error(`[${engine.name}] Error:`, error);
    const result: WorkerResult = {
      ok: false,
      engine: engine.name,
      output: {
        engine: engine.name,
        status: 'fail',
        summary: 'Engine execution failed',
        data: {},
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(result);
  }
}
