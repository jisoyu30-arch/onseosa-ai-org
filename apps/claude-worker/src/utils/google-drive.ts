import { google } from 'googleapis';
import { Readable } from 'stream';

function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  return google.drive({ version: 'v3', auth });
}

// 폴더 찾기 (없으면 null)
async function findFolder(drive: ReturnType<typeof google.drive>, name: string, parentId: string): Promise<string | null> {
  const res = await drive.files.list({
    q: `name='${name}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id)',
  });
  return res.data.files?.[0]?.id || null;
}

// 폴더 생성
async function createFolder(drive: ReturnType<typeof google.drive>, name: string, parentId: string): Promise<string> {
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
  });
  return res.data.id!;
}

// 폴더 찾기 or 생성
async function findOrCreateFolder(drive: ReturnType<typeof google.drive>, name: string, parentId: string): Promise<string> {
  const existing = await findFolder(drive, name, parentId);
  if (existing) return existing;
  return createFolder(drive, name, parentId);
}

// 텍스트 파일 업로드
async function uploadTextFile(drive: ReturnType<typeof google.drive>, fileName: string, content: string, folderId: string) {
  const stream = new Readable();
  stream.push(content);
  stream.push(null);

  await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: 'text/plain',
      body: stream,
    },
  });
}

// 플레이리스트 결과 Google Drive 저장
export async function savePlaylistToDrive(data: {
  channelName: string;
  date: string;
  titleContent: string;
  descriptionContent: string;
  copyContent: string;
}) {
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (!rootFolderId) {
    console.log('[Drive] GOOGLE_DRIVE_ROOT_FOLDER_ID not set, skipping Drive save');
    return;
  }

  try {
    const drive = getDriveClient();

    // 폴더 경로: onseosa_에이전트 / 유튜브 플레이리스트 / {채널명} / {YYYY-MM-DD}
    const playlistFolderId = await findOrCreateFolder(drive, '유튜브 플레이리스트', rootFolderId);
    const channelFolderId = await findOrCreateFolder(drive, data.channelName || '기본채널', playlistFolderId);
    const dateFolderId = await findOrCreateFolder(drive, data.date, channelFolderId);

    // 파일 3개 업로드
    await uploadTextFile(drive, '제목후보.txt', data.titleContent, dateFolderId);
    await uploadTextFile(drive, '설명문.txt', data.descriptionContent, dateFolderId);
    await uploadTextFile(drive, '카피.txt', data.copyContent, dateFolderId);

    console.log(`[Drive] Saved to 유튜브 플레이리스트/${data.channelName}/${data.date}/`);
  } catch (error) {
    console.error('[Drive] Save failed:', error);
    // Drive 저장 실패해도 워크플로우는 중단하지 않음
  }
}
