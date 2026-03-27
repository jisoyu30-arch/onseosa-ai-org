import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { executeRoute } from './routes/execute';
import { pipelineRoute, sseRoute } from './routes/pipeline';

// .env 파일은 프로젝트 루트에서 로드
dotenv.config({ path: resolve(__dirname, '../../../.env'), override: true });

const app = express();
const PORT = process.env.CLAUDE_WORKER_PORT || 3001;

app.use(cors());
app.use(express.json());

// 시크릿 키 검증 미들웨어
app.use('/execute', (req, res, next) => {
  const secret = req.headers['x-secret'] as string;
  const expected = process.env.CLAUDE_WORKER_SECRET;
  if (expected && secret !== expected) {
    res.status(401).json({ ok: false, error: 'Unauthorized' });
    return;
  }
  next();
});

// 라우트
app.post('/execute', executeRoute);
app.post('/pipeline', pipelineRoute);
app.get('/events', sseRoute);

// 헬스 체크
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'claude-worker',
    timestamp: new Date().toISOString(),
    engines: ['arko', 'noah', 'eden', 'ria', 'luka'],
  });
});

app.listen(PORT, () => {
  console.log(`Claude Worker running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
