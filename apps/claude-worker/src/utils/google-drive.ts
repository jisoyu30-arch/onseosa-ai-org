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

// 폴더 생성 (서비스 계정 — 할당량 불필요)
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

// n8n 웹훅으로 파일 업로드 (OAuth 인증 — 할당량 문제 없음)
async function uploadViaN8n(fileName: string, content: string, folderId: string) {
  const n8nBase = process.env.N8N_BASE_URL || 'http://localhost:5678';
  const secret = process.env.N8N_WEBHOOK_SECRET || '';

  const res = await fetch(`${n8nBase}/webhook/drive-upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...(secret ? { 'x-secret': secret } : {}),
    },
    body: JSON.stringify({ fileName, content, folderId }),
  });

  if (!res.ok) {
    throw new Error(`n8n upload failed: ${res.status}`);
  }
  console.log(`[Drive/n8n] Uploaded: ${fileName}`);
}

// 파일 업로드 (n8n OAuth 경유)
// 서비스 계정은 저장소 할당량이 없어서 파일 업로드 불가
// 반드시 n8n(OAuth)을 통해 업로드해야 함
async function uploadFile(fileName: string, content: string, folderId: string) {
  try {
    await uploadViaN8n(fileName, content, folderId);
  } catch (err) {
    console.warn(`[Drive] Upload failed for "${fileName}": ${(err as Error).message}`);
    console.warn('[Drive] n8n이 실행 중이어야 파일 업로드 가능 (서비스 계정은 할당량 제한)');
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

  // 파일 업로드 (n8n OAuth 경유)
  const files = [
    { name: '제목후보.txt', content: data.titleContent },
    { name: '설명문.txt', content: data.descriptionContent },
    { name: '카피.txt', content: data.copyContent },
  ].filter(f => f.content);

  let uploadedCount = 0;
  for (const f of files) {
    try {
      await uploadFile(f.name, f.content, dateFolderId);
      uploadedCount++;
    } catch {
      // 개별 파일 실패해도 계속 진행
    }
  }

  if (uploadedCount > 0) {
    console.log(`[Drive] Save complete: ${data.channelName}/${data.date}/ (${uploadedCount}/${files.length} files)`);
  } else {
    console.log(`[Drive] Folders created but files pending (n8n required): ${data.channelName}/${data.date}/`);
  }

  return { folderId: dateFolderId, uploadedCount, totalFiles: files.length };
}
