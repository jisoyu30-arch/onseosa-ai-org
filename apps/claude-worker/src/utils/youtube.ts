import { google } from 'googleapis';
import { createReadStream, existsSync } from 'fs';
import { resolve } from 'path';

function getYouTubeClient() {
  const oauth2 = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    'urn:ietf:wg:oauth:2.0:oob'
  );
  oauth2.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  });
  return google.youtube({ version: 'v3', auth: oauth2 });
}

export interface YouTubeUploadParams {
  title: string;
  description?: string;
  tags?: string[];
  filePath: string;           // 로컬 영상 파일 경로
  privacyStatus?: 'public' | 'unlisted' | 'private';
  categoryId?: string;        // 10: Music, 27: Education, 22: People & Blogs
}

export async function uploadToYouTube(params: YouTubeUploadParams): Promise<{ videoId: string; url: string }> {
  const youtube = getYouTubeClient();

  const absolutePath = resolve(params.filePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`파일을 찾을 수 없음: ${absolutePath}`);
  }

  const res = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: params.title,
        description: params.description || '',
        tags: params.tags || [],
        categoryId: params.categoryId || '10', // 기본: Music
      },
      status: {
        privacyStatus: params.privacyStatus || 'private', // 기본: 비공개
      },
    },
    media: {
      body: createReadStream(absolutePath),
    },
  });

  const videoId = res.data.id!;
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  console.log(`[YouTube] 업로드 완료: ${params.title} → ${url}`);
  return { videoId, url };
}

export async function getChannelInfo(): Promise<{ channelId: string; title: string } | null> {
  try {
    const youtube = getYouTubeClient();
    const res = await youtube.channels.list({ part: ['snippet'], mine: true });
    const channel = res.data.items?.[0];
    if (!channel) return null;
    return {
      channelId: channel.id!,
      title: channel.snippet?.title || '',
    };
  } catch { return null; }
}
