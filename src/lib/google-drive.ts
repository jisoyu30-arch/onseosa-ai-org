import { google, drive_v3 } from "googleapis";
import { Readable } from "stream";
import fs from "fs";
import path from "path";

/**
 * Google Drive API v3 integration
 * - Service account authentication using JSON credentials
 * - Env: GOOGLE_SERVICE_ACCOUNT_KEY (JSON string) or GOOGLE_DRIVE_CREDENTIALS (file path)
 */

let driveClient: drive_v3.Drive | null = null;

/**
 * Google Drive 클라이언트 초기화 (서비스 계정 인증)
 */
function getDriveClient(): drive_v3.Drive | null {
  if (driveClient) return driveClient;

  try {
    let credentials: Record<string, string>;

    // 방법 1: JSON 문자열로 직접 제공
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    }
    // 방법 2: 파일 경로로 제공
    else if (process.env.GOOGLE_DRIVE_CREDENTIALS) {
      const credPath = process.env.GOOGLE_DRIVE_CREDENTIALS;
      const raw = fs.readFileSync(credPath, "utf-8");
      credentials = JSON.parse(raw);
    } else {
      console.warn(
        "[google-drive] GOOGLE_SERVICE_ACCOUNT_KEY 또는 GOOGLE_DRIVE_CREDENTIALS가 설정되지 않았습니다."
      );
      return null;
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    driveClient = google.drive({ version: "v3", auth });
    console.log("[google-drive] Drive 클라이언트 초기화 완료");
    return driveClient;
  } catch (error) {
    console.error("[google-drive] 클라이언트 초기화 실패:", error);
    return null;
  }
}

/**
 * Google Drive 자격 증명이 설정되어 있는지 확인
 */
export function isDriveConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
    process.env.GOOGLE_DRIVE_CREDENTIALS
  );
}

/**
 * 파일을 Google Drive에 업로드
 * @param filePath - 업로드할 로컬 파일 경로
 * @param fileName - Drive에 저장할 파일명
 * @param folderId - 업로드할 폴더 ID (선택)
 * @returns 업로드된 파일 정보 또는 null
 */
export async function uploadToDrive(
  filePath: string,
  fileName: string,
  folderId?: string
): Promise<{
  fileId: string;
  webViewLink: string;
  webContentLink: string;
} | null> {
  const drive = getDriveClient();
  if (!drive) return null;

  try {
    const mimeType = getMimeType(filePath);
    const fileMetadata: drive_v3.Schema$File = {
      name: fileName,
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const media = {
      mimeType,
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id, webViewLink, webContentLink",
    });

    const file = response.data;
    if (!file.id) {
      console.error("[google-drive] 파일 업로드 후 ID를 받지 못했습니다.");
      return null;
    }

    // 파일을 누구나 볼 수 있도록 권한 설정 (링크가 있는 사람)
    await drive.permissions.create({
      fileId: file.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // 권한 설정 후 링크 다시 조회
    const updated = await drive.files.get({
      fileId: file.id,
      fields: "webViewLink, webContentLink",
    });

    console.log(`[google-drive] 파일 업로드 완료: ${fileName} (${file.id})`);

    return {
      fileId: file.id,
      webViewLink: updated.data.webViewLink || "",
      webContentLink: updated.data.webContentLink || "",
    };
  } catch (error) {
    console.error("[google-drive] 파일 업로드 실패:", error);
    return null;
  }
}

/**
 * Buffer를 Google Drive에 업로드 (로컬 파일 없이)
 * @param buffer - 업로드할 Buffer
 * @param fileName - Drive에 저장할 파일명
 * @param mimeType - MIME 타입
 * @param folderId - 업로드할 폴더 ID (선택)
 */
export async function uploadBufferToDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId?: string
): Promise<{
  fileId: string;
  webViewLink: string;
  webContentLink: string;
} | null> {
  const drive = getDriveClient();
  if (!drive) return null;

  try {
    const fileMetadata: drive_v3.Schema$File = {
      name: fileName,
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);

    const media = {
      mimeType,
      body: readable,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id, webViewLink, webContentLink",
    });

    const file = response.data;
    if (!file.id) return null;

    await drive.permissions.create({
      fileId: file.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const updated = await drive.files.get({
      fileId: file.id,
      fields: "webViewLink, webContentLink",
    });

    console.log(
      `[google-drive] Buffer 업로드 완료: ${fileName} (${file.id})`
    );

    return {
      fileId: file.id,
      webViewLink: updated.data.webViewLink || "",
      webContentLink: updated.data.webContentLink || "",
    };
  } catch (error) {
    console.error("[google-drive] Buffer 업로드 실패:", error);
    return null;
  }
}

/**
 * Google Drive에 폴더 생성
 * @param folderName - 폴더 이름
 * @param parentFolderId - 부모 폴더 ID (선택)
 * @returns 생성된 폴더 ID 또는 null
 */
export async function createFolder(
  folderName: string,
  parentFolderId?: string
): Promise<string | null> {
  const drive = getDriveClient();
  if (!drive) return null;

  try {
    const fileMetadata: drive_v3.Schema$File = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    };

    if (parentFolderId) {
      fileMetadata.parents = [parentFolderId];
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id",
    });

    const folderId = response.data.id;
    if (!folderId) {
      console.error("[google-drive] 폴더 생성 후 ID를 받지 못했습니다.");
      return null;
    }

    console.log(
      `[google-drive] 폴더 생성 완료: ${folderName} (${folderId})`
    );
    return folderId;
  } catch (error) {
    console.error("[google-drive] 폴더 생성 실패:", error);
    return null;
  }
}

/**
 * Google Drive 폴더의 파일 목록 조회
 * @param folderId - 조회할 폴더 ID
 * @param maxResults - 최대 결과 수 (기본: 50)
 * @returns 파일 목록
 */
export async function listFiles(
  folderId: string,
  maxResults: number = 50
): Promise<
  Array<{ id: string; name: string; mimeType: string; webViewLink: string }>
> {
  const drive = getDriveClient();
  if (!drive) return [];

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      pageSize: maxResults,
      fields: "files(id, name, mimeType, webViewLink)",
      orderBy: "createdTime desc",
    });

    const files = response.data.files || [];

    return files.map((file) => ({
      id: file.id || "",
      name: file.name || "",
      mimeType: file.mimeType || "",
      webViewLink: file.webViewLink || "",
    }));
  } catch (error) {
    console.error("[google-drive] 파일 목록 조회 실패:", error);
    return [];
  }
}

/**
 * 파일 확장자로 MIME 타입 추정
 */
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".wav": "audio/wav",
    ".txt": "text/plain",
    ".json": "application/json",
    ".csv": "text/csv",
  };
  return mimeTypes[ext] || "application/octet-stream";
}
