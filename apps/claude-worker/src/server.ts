import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { executeRoute } from './routes/execute';
import { pipelineRoute, sseRoute } from './routes/pipeline';
import { analyzeAlbumRoute, analyzeAlbumSSE, analyzeAlbumPreview } from './routes/analyze-album';

// .env 파일은 프로젝트 루트에서 로드
dotenv.config({ path: resolve(__dirname, '../../../.env'), override: true });

const app = express();
const PORT = process.env.CLAUDE_WORKER_PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));

// 시크릿 키 검증 미들웨어 (localhost는 면제 — 위젯/데스크톱)
app.use('/execute', (req, res, next) => {
  const secret = req.headers['x-secret'] as string;
  const expected = process.env.CLAUDE_WORKER_SECRET;
  const ip = req.socket.remoteAddress || '';
  const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
  if (expected && !isLocalhost && secret !== expected) {
    res.status(401).json({ ok: false, error: 'Unauthorized' });
    return;
  }
  next();
});

// 라우트
app.post('/execute', executeRoute);
app.post('/pipeline', pipelineRoute);
app.get('/events', sseRoute);

// 앨범 음원 분석
app.post('/analyze-album', analyzeAlbumRoute);
app.get('/analyze-album/events', analyzeAlbumSSE);
app.get('/analyze-album/preview', analyzeAlbumPreview);

// 헬스 체크
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'claude-worker',
    timestamp: new Date().toISOString(),
    engines: ['arko', 'noah', 'eden', 'ria', 'mika', 'luka'],
  });
});

app.listen(PORT, () => {
  console.log(`Claude Worker running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
