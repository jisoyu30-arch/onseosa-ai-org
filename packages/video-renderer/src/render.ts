import path from 'path';
import os from 'os';
import fs from 'fs';

export interface PlaylistLoopProps {
  coverImageSrc: string;
  title: string;
  trackList: string[];
  mood: string;
  channelName: string;
}

export interface RenderPlaylistVideoOptions {
  coverImagePath: string;
  title: string;
  trackList: string[];
  mood: string;
  channelName: string;
  outputDir?: string;
  onProgress?: (progress: number) => void;
}

export async function renderPlaylistVideo(options: RenderPlaylistVideoOptions): Promise<string> {
  const {
    coverImagePath,
    title,
    trackList,
    mood,
    channelName,
    outputDir,
    onProgress,
  } = options;

  const outDir = outputDir || path.join(os.tmpdir(), 'ons-media', `video_${Date.now()}`);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outputPath = path.join(outDir, 'playlist-loop.mp4');

  console.log('[video-renderer] Remotion 번들링 시작...');

  const { bundle } = await import('@remotion/bundler');
  const { renderMedia, selectComposition } = await import('@remotion/renderer');

  const entryPoint = path.resolve(__dirname, 'compositions/Root.tsx');

  // 커버 이미지를 번들의 public 디렉토리에 복사
  // Remotion은 public/ 폴더 내 파일을 staticFile()로 접근 가능
  const publicDir = path.join(path.dirname(entryPoint), '..', 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const coverFileName = 'cover.jpg';
  fs.copyFileSync(coverImagePath, path.join(publicDir, coverFileName));
  console.log(`[video-renderer] 커버 이미지를 public/에 복사: ${coverFileName}`);

  const bundleLocation = await bundle({
    entryPoint,
    publicDir,
    onProgress: (p: number) => {
      if (p === 100) console.log('[video-renderer] 번들링 완료');
    },
  });

  // staticFile()으로 접근할 경로
  const inputProps: Record<string, unknown> = {
    coverImageSrc: coverFileName,
    title,
    trackList,
    mood,
    channelName,
  };

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'PlaylistLoop',
    inputProps,
  });

  console.log('[video-renderer] 렌더링 시작...');

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
    onProgress: ({ progress }: { progress: number }) => {
      const pct = Math.round(progress * 100);
      if (pct % 10 === 0) console.log(`[video-renderer] 렌더링 진행: ${pct}%`);
      onProgress?.(pct);
    },
  });

  console.log(`[video-renderer] 렌더링 완료: ${outputPath}`);

  // 클린업
  fs.rmSync(bundleLocation, { recursive: true, force: true });
  fs.rmSync(path.join(publicDir, coverFileName), { force: true });

  return outputPath;
}
