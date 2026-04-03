import { Request, Response } from 'express';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';
import { runArko } from '../engines/arko';
import { runNoah } from '../engines/noah';
import { runEden } from '../engines/eden';
import { runRia } from '../engines/ria';
import { runLuka } from '../engines/luka';
import { runMika } from '../engines/mika';

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

type StepName = 'noah' | 'eden' | 'ria' | 'arko-review' | 'mika' | 'luka';

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
  { name: 'mika', label: '미카 미디어', taskType: 'render', run: runMika },
  { name: 'luka', label: '루카 기록', taskType: 'record', run: runLuka },
];

// 최대 revise 루프 횟수
const MAX_RETRY = 2;

export async function pipelineRoute(req: Request, res: Response) {
  const { projectName, projectType, goal, enrichedContext } = req.body;

  if (!projectName || !goal) {
    res.status(400).json({ ok: false, error: 'projectName and goal are required' });
    return;
  }

  const projectId = `proj_${Date.now()}`;
  const results: Record<string, EngineOutput> = {};

  broadcast('pipeline:start', { projectId, projectName, projectType, goal });

  // Step 0: 아르코 총괄 분석 (프로젝트 타입 판별 + 방향 설정)
  // enrichedContext에 arko-clarify가 생성한 executionBrief가 포함됨
  broadcast('engine:status', { engine: 'arko', status: 'working', task: '프로젝트 분석' });
  try {
    const arkoResult = await runArko({
      projectId,
      projectName,
      projectType: projectType || 'playlist',
      taskType: 'orchestrate',
      instruction: goal,
      context: { ...(enrichedContext || {}) },   // executionBrief 전달
    });
    results['orchestrate'] = arkoResult;
    broadcast('engine:done', { engine: 'arko', step: 'orchestrate', result: arkoResult });
  } catch (err) {
    broadcast('engine:error', { engine: 'arko', error: String(err) });
  }
  broadcast('engine:status', { engine: 'arko', status: 'idle' });

  // arko가 blocked를 반환했더라도 LIVE 도메인이면 강제 통과
  const LIVE_DOMAINS = ['music', 'webnovel', 'shortform', 'playlist', 'broadcast', 'book'];
  const canonicalDomain = projectType?.toLowerCase() || '';
  const orchestrateData = results['orchestrate']?.data as Record<string, unknown> | undefined;
  if (orchestrateData?.blocked && LIVE_DOMAINS.includes(canonicalDomain)) {
    console.log(`[pipeline] arko blocked but domain "${canonicalDomain}" is LIVE — overriding`);
    orchestrateData.blocked = false;
    orchestrateData.block_reason = '';
    // executionBrief가 비어 있으면 최소 브리프 생성 (camelCase + snake_case 둘 다 세팅)
    const existingBrief = orchestrateData.execution_brief as Record<string, unknown> | undefined;
    if (!existingBrief || Object.keys(existingBrief).length === 0) {
      const minimalBrief = {
        domain: canonicalDomain,
        goal: goal,
        target_output: `${canonicalDomain} 결과물`,
        required_inputs: [],
        applied_rules: [`${canonicalDomain} 도메인 기준으로 작업`],
        template_to_use: canonicalDomain,
        quality_checkpoints: ['방향 일치', '후킹력', '완성도'],
        engine_plan: [
          { engine: '노아', purpose: '자료 분석' },
          { engine: '이든', purpose: '기획안 도출' },
          { engine: '리아', purpose: '텍스트 창작' },
          { engine: '아르코(검수)', purpose: '품질 검수' },
          { engine: '루카', purpose: '저장' },
        ],
        blocked: false,
        block_reason: '',
      };
      orchestrateData.execution_brief = minimalBrief;
      orchestrateData.executionBrief = minimalBrief; // camelCase — arko.ts 단락 체크용
    }
  }

  // 파이프라인 실행
  let upstream: Record<string, unknown> = {
    ...(orchestrateData || {}),
    ...(enrichedContext || {}),
  };
  let retryCount = 0;
  let pipelineFailed = false;

  // 최고점 결과물 추적 — 재시도 중 점수가 떨어져도 최고점 버전으로 저장
  let bestScore = 0;
  let bestRiaResult: EngineOutput | null = null;

  for (let i = 0; i < PIPELINE_STEPS.length; i++) {
    const step = PIPELINE_STEPS[i];
    const engineName = step.name === 'arko-review' ? 'arko' : step.name;

    // fail 판정 후 luka도 건너뜀
    if (pipelineFailed) break;

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
          // luka에게 전체 결과 전달 (최고점 ria 결과물 사용)
          ...(step.name === 'luka' ? {
            allResults: results,
            score: bestScore || results['arko-review']?.score,
            outputData: (bestRiaResult || results['ria'])?.data,
            engineName: 'ria',
            // soft-pass 시 upstream.resultStatus가 'revise'로 설정됨 — arko raw status('fail') 대신 사용
            resultStatus: (upstream.resultStatus as string) || results['arko-review']?.status,
            feedback: results['arko-review']?.data?.next_action,
          } : {}),
        },
      };

      const output = await step.run(payload);
      results[step.name] = output;

      // ria 결과물이 나올 때마다 최고점 추적
      if (step.name === 'ria') {
        // 아직 검수 전이므로 일단 저장해두고 arko-review 후 점수 비교
        bestRiaResult = bestRiaResult ?? output;
      }

      broadcast('engine:done', { engine: engineName, step: step.name, result: output });
      broadcast('engine:status', { engine: engineName, status: 'idle' });

      // ── 아르코 검수 분기 처리 ────────────────────────────────────
      if (step.name === 'arko-review') {
        const reviewData = output.data as Record<string, unknown>;
        const nextAction = (reviewData.next_action as string) || '';
        const score = (output.score as number) ?? 0;

        // 이번 시도 점수가 역대 최고면 ria 결과물 갱신
        if (score > bestScore) {
          bestScore = score;
          bestRiaResult = results['ria'] || bestRiaResult;
        }

        if (output.status === 'revise' && retryCount < MAX_RETRY) {
          // revise → 리아 재작성 루프
          retryCount++;
          const fixInstruction = nextAction.replace(/^리아 재작성:\s*/i, '').trim();
          upstream = {
            ...upstream,
            fix_instruction: fixInstruction,
            reasons: reviewData.reasons,
            retry_count: retryCount,
            best_score: bestScore,
          };
          // ria 인덱스(2)로 돌아가기: 루프 i++되면 2가 됨
          i = 1;
          broadcast('pipeline:retry', { retryCount, reason: fixInstruction || output.summary });
          continue;

        } else if (output.status === 'fail' && score >= 50) {
          // fail이지만 score >= 50 → soft-pass (모델 불일치 안전장치)
          broadcast('pipeline:soft_pass', {
            projectId,
            message: `검수 fail이지만 ${bestScore}점 — soft-pass로 루카 저장`,
            score: bestScore,
            retryCount,
          });
          upstream = { ...upstream, resultStatus: 'revise', best_score: bestScore };

        } else if (output.status === 'fail' && score < 50) {
          if (bestScore >= 50) {
            // 이번 시도는 낮지만 과거에 50점 이상 기록 있음 → 최고점 결과물로 soft-pass
            broadcast('pipeline:soft_pass', {
              projectId,
              message: `현재 시도 ${score}점이지만 최고점 ${bestScore}점 결과물로 루카 저장`,
              score: bestScore,
              retryCount,
            });
            // luka가 최고점 ria 결과물을 쓰도록 results['ria'] 복원
            if (bestRiaResult) results['ria'] = bestRiaResult;
            upstream = { ...upstream, resultStatus: 'revise', best_score: bestScore };
          } else {
            // 한 번도 50점을 넘지 못함 → 완전 실패
            pipelineFailed = true;
            broadcast('pipeline:failed', {
              projectId,
              reason: nextAction || `검수 실패 — 최고점 ${bestScore}점 (기준: 50점)`,
              score: bestScore,
              retryCount,
            });
            broadcast('engine:status', { engine: engineName, status: 'idle' });
            break;
          }

        } else if (output.status === 'revise' && retryCount >= MAX_RETRY) {
          // 최대 재시도 초과 → 최고점 결과물로 soft-pass
          broadcast('pipeline:soft_pass', {
            projectId,
            message: `검수 ${MAX_RETRY}회 후 최고점 ${bestScore}점으로 루카 저장`,
            score: bestScore,
            retryCount,
          });
          if (bestRiaResult) results['ria'] = bestRiaResult;
          upstream = {
            ...upstream,
            resultStatus: 'revise',
            best_score: bestScore,
          };
          // luka로 계속 진행 (break 없음)
        }
        // pass 또는 soft-pass → 다음 단계(luka)로
      }

      // 다음 단계로 upstream 전달
      upstream = { ...upstream, ...output.data };
    } catch (err) {
      console.error(`[pipeline] ${step.name} 예외:`, err);
      broadcast('engine:error', { engine: engineName, step: step.name, error: String(err) });
      broadcast('engine:status', { engine: engineName, status: 'idle' });
    }
  }

  if (pipelineFailed) {
    return res.json({
      ok: false,
      projectId,
      error: 'pipeline_failed',
      results,
    });
  }

  broadcast('pipeline:done', { projectId, results });

  res.json({
    ok: true,
    projectId,
    results,
  });
}
