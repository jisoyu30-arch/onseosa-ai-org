import { Request, Response } from 'express';
import { analyzeAlbum, parseTrackFolder } from '../engines/noah-audio';
import { saveResultsToDrive } from '../utils/google-drive';

// SSE 클라이언트 관리
let albumSSEClients: Response[] = [];

function broadcastAlbumProgress(data: Record<string, unknown>) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  albumSSEClients.forEach(client => client.write(msg));
}

/**
 * POST /analyze-album
 * Body: { folderPath: string, projectName?: string }
 *
 * 로컬 폴더의 WAV 파일들을 Gemini로 분석한다.
 * SSE /analyze-album/events 로 실시간 진행 상황 전송.
 */
export async function analyzeAlbumRoute(req: Request, res: Response) {
  const { folderPath, projectName } = req.body as {
    folderPath: string;
    projectName?: string;
  };

  if (!folderPath) {
    res.status(400).json({ ok: false, error: 'folderPath is required' });
    return;
  }

  // 먼저 파일 목록 확인
  const tracks = parseTrackFolder(folderPath);
  if (tracks.length === 0) {
    res.status(400).json({
      ok: false,
      error: `No WAV files found in: ${folderPath}`,
    });
    return;
  }

  console.log(`[analyze-album] Starting analysis: ${tracks.length} tracks from ${folderPath}`);

  // 비동기로 분석 시작 (SSE로 진행상황 전송)
  const startTime = Date.now();

  try {
    const output = await analyzeAlbum(folderPath, (current, total, title) => {
      broadcastAlbumProgress({
        type: 'progress',
        current,
        total,
        title,
        percent: Math.round((current / total) * 100),
      });
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    // Google Drive 저장
    const today = new Date().toISOString().split('T')[0];
    const albumName = projectName || 'Untitled Album';
    let driveResult: { uploadedCount: number } | undefined;
    try {
      const analysisData = output.data as Record<string, unknown>;
      const tracks = (analysisData?.tracks as unknown[]) || [];
      const files = [
        {
          name: 'album-analysis.json',
          content: JSON.stringify(analysisData, null, 2),
        },
        {
          name: 'track-summary.txt',
          content: tracks.map((t: unknown) => {
            const tr = t as Record<string, unknown>;
            return [
              `${tr.trackNumber}. ${tr.title}`,
              `  장르: ${tr.genre} | BPM: ${tr.bpm || tr.tempo} | 무드: ${(tr.mood as string[] || []).join(', ')}`,
              `  악기: ${(tr.instruments as string[] || []).join(', ')}`,
              `  ${tr.description_hints}`,
            ].join('\n');
          }).join('\n\n'),
        },
      ];
      driveResult = await saveResultsToDrive({ projectName: albumName, projectType: 'album', date: today, files });
    } catch (err) {
      console.warn('[analyze-album] Drive save failed:', (err as Error).message);
    }

    broadcastAlbumProgress({
      type: 'complete',
      elapsed: `${elapsed}s`,
      summary: output.summary,
      driveSaved: (driveResult?.uploadedCount ?? 0) > 0,
    });

    res.json({
      ok: true,
      projectName: albumName,
      output,
      elapsed: `${elapsed}s`,
      driveSaved: (driveResult?.uploadedCount ?? 0) > 0,
    });
  } catch (error) {
    console.error('[analyze-album] Error:', error);
    broadcastAlbumProgress({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * GET /analyze-album/events
 * SSE 스트림으로 분석 진행 상황을 전송한다.
 */
export function analyzeAlbumSSE(req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  albumSSEClients.push(res);

  req.on('close', () => {
    albumSSEClients = albumSSEClients.filter(c => c !== res);
  });
}

/**
 * GET /analyze-album/preview
 * 폴더의 WAV 파일 목록만 반환 (분석 전 확인용)
 */
export function analyzeAlbumPreview(req: Request, res: Response) {
  const folderPath = req.query.path as string;

  if (!folderPath) {
    res.status(400).json({ ok: false, error: 'path query param is required' });
    return;
  }

  try {
    const tracks = parseTrackFolder(folderPath);
    res.json({
      ok: true,
      folderPath,
      trackCount: tracks.length,
      tracks: tracks.map(t => ({
        trackNumber: t.trackNumber,
        title: t.title,
      })),
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Invalid folder path',
    });
  }
}
