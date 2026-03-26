import { google } from 'googleapis';
import { resolve } from 'path';

function getDriveClient() {
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || '';
  const absoluteKeyFile = resolve(__dirname, '../../../..', keyFile);

  const auth = new google.auth.GoogleAuth({
    keyFile: absoluteKeyFile,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  return google.drive({ version: 'v3', auth });
}

// 폴더 찾기
async function findFolder(drive: ReturnType<typeof google.drive>, name: string, parentId: string): Promise<string | null> {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id,name)',
    supportsAllDrives: true,
  });
  const trimmed = name.trim();
  const match = res.data.files?.find(f => f.name?.trim() === trimmed);
  return match?.id || null;
}

// 폴더 생성 (서비스 계정으로 가능)
async function createFolder(drive: ReturnType<typeof google.drive>, name: string, parentId: string): Promise<string> {
  console.log(`[Drive] Creating folder: ${name}`);
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
    supportsAllDrives: true,
  });
  return res.data.id!;
}

// 폴더 찾기 or 생성
async function findOrCreateFolder(drive: ReturnType<typeof google.drive>, name: string, parentId: string): Promise<string> {
  const existing = await findFolder(drive, name, parentId);
  if (existing) {
    console.log(`[Drive] Found folder: ${name} (${existing})`);
    return existing;
  }
  return createFolder(drive, name, parentId);
}

// n8n 웹훅으로 파일 업로드 위임 (OAuth 인증 사용)
async function uploadViaN8n(fileName: string, content: string, folderId: string) {
  const n8nBase = process.env.N8N_BASE_URL || 'http://localhost:5678';
  const secret = process.env.N8N_WEBHOOK_SECRET || '';

  const res = await fetch(`${n8nBase}/webhook/drive-upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'x-secret': secret } : {}),
    },
    body: JSON.stringify({ fileName, content, folderId }),
  });

  if (!res.ok) {
    throw new Error(`n8n upload failed: ${res.status}`);
  }
  console.log(`[Drive/n8n] Uploaded: ${fileName}`);
}

// 직접 업로드 시도, 실패 시 n8n 폴백
async function uploadTextFile(fileName: string, content: string, folderId: string) {
  // 먼저 n8n 시도
  try {
    await uploadViaN8n(fileName, content, folderId);
    return;
  } catch {
    console.log(`[Drive] n8n unavailable, trying direct upload...`);
  }

  // n8n 안 되면 서비스 계정으로 직접 시도
  try {
    const drive = getDriveClient();
    const { Readable } = await import('stream');
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
      supportsAllDrives: true,
    });
    console.log(`[Drive] Direct uploaded: ${fileName}`);
  } catch (err) {
    console.error(`[Drive] Upload failed for ${fileName}:`, (err as Error).message);
    throw err;
  }
}

// 플레이리스트 결과 Google Drive 저장
export async function savePlaylistToDrive(data: {
  channelName: string;
  date: string;
  titleContent: string;
  descriptionContent: string;
  copyContent: string;
}) {
  const playlistParentId = process.env.GOOGLE_DRIVE_PLAYLIST_FOLDER_ID || process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (!playlistParentId) {
    console.log('[Drive] GOOGLE_DRIVE_PLAYLIST_FOLDER_ID not set, skipping');
    return;
  }

  const drive = getDriveClient();

  // 폴더 생성 (서비스 계정으로 가능)
  const channelFolderId = await findOrCreateFolder(drive, data.channelName || 'default', playlistParentId);
  const dateFolderId = await findOrCreateFolder(drive, data.date, channelFolderId);

  // 파일 업로드 (n8n 우선, 실패 시 직접)
  const files = [
    { name: '제목후보.txt', content: data.titleContent },
    { name: '설명문.txt', content: data.descriptionContent },
    { name: '카피.txt', content: data.copyContent },
  ].filter(f => f.content);

  for (const f of files) {
    await uploadTextFile(f.name, f.content, dateFolderId);
  }

  console.log(`[Drive] Save complete: ${data.channelName}/${data.date}/`);
}
