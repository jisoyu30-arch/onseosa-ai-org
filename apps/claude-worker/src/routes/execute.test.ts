import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { executeRoute } from './execute';

// 엔진 모듈 모킹
vi.mock('../engines/arko', () => ({
  runArko: vi.fn().mockResolvedValue({
    engine: 'arko',
    status: 'pass',
    summary: 'test ok',
    data: {},
  }),
}));
vi.mock('../engines/noah', () => ({
  runNoah: vi.fn().mockResolvedValue({
    engine: 'noah',
    status: 'pass',
    summary: 'analyzed',
    data: {},
  }),
}));
vi.mock('../engines/eden', () => ({ runEden: vi.fn().mockResolvedValue({ engine: 'eden', status: 'pass', summary: '', data: {} }) }));
vi.mock('../engines/ria', () => ({ runRia: vi.fn().mockResolvedValue({ engine: 'ria', status: 'pass', summary: '', data: {} }) }));
vi.mock('../engines/luka', () => ({ runLuka: vi.fn().mockResolvedValue({ engine: 'luka', status: 'pass', summary: '', data: {} }) }));

function mockReqRes(body: Record<string, unknown> = {}) {
  const req = { body } as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;
  return { req, res };
}

describe('executeRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('taskType 없으면 400 반환', async () => {
    const { req, res } = mockReqRes({ projectId: 'p1' });
    await executeRoute(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('projectId 없으면 400 반환', async () => {
    const { req, res } = mockReqRes({ taskType: 'analyze' });
    await executeRoute(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('잘못된 taskType이면 400 반환', async () => {
    const { req, res } = mockReqRes({ taskType: 'invalid', projectId: 'p1' });
    await executeRoute(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Unknown taskType') }),
    );
  });

  it('analyze → noah 엔진 실행', async () => {
    const { req, res } = mockReqRes({
      taskType: 'analyze',
      projectId: 'p1',
      projectName: 'Test',
    });
    await executeRoute(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ ok: true, engine: 'noah' }),
    );
  });

  it('orchestrate → arko 엔진 실행', async () => {
    const { req, res } = mockReqRes({
      taskType: 'orchestrate',
      projectId: 'p1',
      projectName: 'Test',
    });
    await executeRoute(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ ok: true, engine: 'arko' }),
    );
  });

  it('review → arko 엔진 실행', async () => {
    const { req, res } = mockReqRes({
      taskType: 'review',
      projectId: 'p1',
      projectName: 'Test',
    });
    await executeRoute(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ ok: true, engine: 'arko' }),
    );
  });
});
