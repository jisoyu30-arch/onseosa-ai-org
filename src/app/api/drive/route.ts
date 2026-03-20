import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { uploadToDrive, listFiles } from "@/lib/google-drive";

/**
 * POST /api/drive - 파일을 Google Drive에 업로드
 * FormData: file (필수), folderId (선택), fileName (선택)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folderId = formData.get("folderId") as string | null;
    const customFileName = formData.get("fileName") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "파일이 없습니다." },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 50MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    // 임시 파일로 저장
    const tempDir = path.join(process.cwd(), "tmp");
    await mkdir(tempDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const tempFileName = `upload_${timestamp}${ext}`;
    const tempFilePath = path.join(tempDir, tempFileName);

    await writeFile(tempFilePath, buffer);

    // Google Drive에 업로드
    const fileName = customFileName || file.name;
    const result = await uploadToDrive(
      tempFilePath,
      fileName,
      folderId || undefined
    );

    // 임시 파일 삭제
    await unlink(tempFilePath).catch(() => {});

    if (!result) {
      return NextResponse.json(
        {
          error:
            "Google Drive 업로드에 실패했습니다. 자격 증명을 확인해주세요.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      file: {
        id: result.fileId,
        name: fileName,
        webViewLink: result.webViewLink,
        webContentLink: result.webContentLink,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[api/drive] POST 실패:", error);
    return NextResponse.json(
      { error: "Google Drive 업로드에 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/drive?folderId=xxx&maxResults=50 - Google Drive 폴더의 파일 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("folderId");
    const maxResults = parseInt(searchParams.get("maxResults") || "50", 10);

    if (!folderId) {
      return NextResponse.json(
        { error: "folderId 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    const files = await listFiles(folderId, maxResults);

    return NextResponse.json({
      success: true,
      folderId,
      count: files.length,
      files,
    });
  } catch (error) {
    console.error("[api/drive] GET 실패:", error);
    return NextResponse.json(
      { error: "파일 목록 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
