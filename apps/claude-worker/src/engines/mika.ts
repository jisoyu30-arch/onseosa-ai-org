import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import os from 'os';
import type { WorkerPayload, EngineOutput } from '@ons/engine-contracts';

// 미디어 생성이 필요한 도메인
const MEDIA_DOMAINS = ['music', 'playlist', 'webdrama', 'broadcast', 'music_video'];

// 임시 파일 디렉토리
function getMediaDir(projectId: string): string {
  const dir = path.join(os.tmpdir(), 'ons-media', projectId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * 커버 콘셉트에서 DALL-E 프롬프트 조합
 */
function buildImagePrompt(coverConcept: Record<string, unknown>): string {
  const parts: string[] = [];

  if (coverConcept.image) parts.push(String(coverConcept.image));
  if (coverConcept.style) parts.push(`art style: ${coverConcept.style}`);
  if (coverConcept.color_palette) {
    const colors = Array.isArray(coverConcept.color_palette)
      ? coverConcept.color_palette.join(', ')
      : String(coverConcept.color_palette);
    parts.push(`color palette: ${colors}`);
  }
  if (coverConcept.mood) parts.push(`mood: ${coverConcept.mood}`);

  // DALL-E 텍스트 생성 방지
  parts.push('album cover art, square composition, no text, no letters, no typography, no words');

  return parts.join('. ') + '.';
}

/**
 * DALL-E 3으로 이미지 생성 → 로컬 파일로 저장
 */
async function generateCoverImage(
  prompt: string,
  outputPath: string,
): Promise<void> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  console.log('[mika] DALL-E 3 이미지 생성 시작...');
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  const imageUrl = response.data?.[0]?.url;
  if (!imageUrl) throw new Error('DALL-E 응답에 이미지 URL 없음');

  // URL에서 이미지 다운로드
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`이미지 다운로드 실패: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  fs.writeFileSync(outputPath, buffer);
  console.log(`[mika] 원본 이미지 저장: ${outputPath} (${(buffer.length / 1024).toFixed(0)}KB)`);
}

/**
 * sharp로 이미지 리사이즈
 */
async function resizeImage(
  inputPath: string,
  outputPath: string,
  width: number,
  height: number,
): Promise<void> {
  // sharp는 동적 import (native 모듈)
  const sharp = (await import('sharp')).default;
  await sharp(inputPath)
    .resize(width, height, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(outputPath);
  console.log(`[mika] 리사이즈 완료: ${outputPath} (${width}x${height})`);
}

export async function runMika(payload: WorkerPayload): Promise<EngineOutput> {
  const context = payload.context || {};
  const domain = String(context.domain || payload.projectType || '');

  // 미디어 불필요한 도메인은 즉시 패스
  if (!MEDIA_DOMAINS.includes(domain)) {
    console.log(`[mika] 도메인 "${domain}" — 미디어 생성 건너뜀`);
    return {
      engine: 'mika',
      status: 'pass',
      summary: '미디어 생성 불필요 (텍스트 전용 도메인)',
      data: {},
    };
  }

  const mediaDir = getMediaDir(payload.projectId);
  const results: Record<string, unknown> = { domain };

  // --- 커버 이미지 생성 ---
  try {
    const coverConcept = context.cover_concept as Record<string, unknown> | undefined;

    // cover_concept이 없으면 기본 정보로 프롬프트 생성
    let prompt: string;
    if (coverConcept && typeof coverConcept === 'object') {
      prompt = buildImagePrompt(coverConcept);
    } else {
      // fallback: 프로젝트 정보로 기본 프롬프트
      const title = context.recommended_title || context.playlist_title || payload.projectName;
      const tone = context.tone_used || context.tone || 'modern';
      prompt = `Album cover art for "${title}". Style: ${tone}. Square composition, no text, no letters, no typography.`;
    }

    console.log(`[mika] 이미지 프롬프트: ${prompt.slice(0, 150)}...`);

    // 1024x1024 원본 생성
    const originalPath = path.join(mediaDir, 'cover-original.png');
    await generateCoverImage(prompt, originalPath);

    // 3000x3000 커버 (유통사용)
    const coverPath = path.join(mediaDir, 'cover-3000.jpg');
    await resizeImage(originalPath, coverPath, 3000, 3000);
    results.coverImagePath = coverPath;

    // 1280x720 썸네일 (YouTube용)
    const thumbPath = path.join(mediaDir, 'thumbnail-1280x720.jpg');
    await resizeImage(originalPath, thumbPath, 1280, 720);
    results.thumbnailPath = thumbPath;

    // 원본 경로도 보존
    results.coverOriginalPath = originalPath;

    console.log('[mika] 커버 이미지 + 썸네일 생성 완료');
  } catch (err) {
    console.error('[mika] 이미지 생성 실패:', (err as Error).message);
    results.imageError = (err as Error).message;
    // 이미지 실패해도 파이프라인은 계속 진행
  }

  // --- 영상 렌더링 (Remotion) ---
  const VIDEO_DOMAINS = ['playlist', 'webdrama', 'broadcast', 'music_video'];
  if (VIDEO_DOMAINS.includes(domain) && results.coverImagePath) {
    try {
      console.log('[mika] Remotion 영상 렌더링 시작...');
      const { renderPlaylistVideo } = await import('../../../../packages/video-renderer/src/render');
      const trackList = (context.track_list as string[])
        || (context.trackList as string[])
        || ['Track 1', 'Track 2', 'Track 3'];
      const videoPath = await renderPlaylistVideo({
        coverImagePath: results.coverImagePath as string,
        title: String(context.recommended_title || context.playlist_title || payload.projectName),
        trackList: trackList.map(t => typeof t === 'string' ? t : (t as { title?: string })?.title || String(t)),
        mood: String(context.tone_used || context.mood || 'chill'),
        channelName: String(context.channelName || 'ONS Studio'),
        outputDir: mediaDir,
        onProgress: (pct) => {
          if (pct % 25 === 0) console.log(`[mika] 렌더링 ${pct}%`);
        },
      });
      results.videoFilePath = videoPath;
      console.log(`[mika] 영상 렌더링 완료: ${videoPath}`);
    } catch (err) {
      console.error('[mika] 영상 렌더링 실패:', (err as Error).message);
      results.videoError = (err as Error).message;
    }
  }

  const hasImage = !!results.coverImagePath;
  const hasVideo = !!results.videoFilePath;
  const parts: string[] = [];
  if (hasImage) parts.push('커버 이미지');
  if (hasVideo) parts.push('루프 영상');

  return {
    engine: 'mika',
    status: 'pass',
    summary: parts.length > 0
      ? `${parts.join(' + ')} 생성 완료`
      : '미디어 생성 시도 (실패)',
    data: results,
    nextHints: [
      ...(hasImage ? ['커버 3000x3000 + 썸네일 1280x720'] : []),
      ...(hasVideo ? ['10초 루프 영상 MP4'] : []),
    ],
  };
}
