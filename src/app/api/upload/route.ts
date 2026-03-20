import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const pipelineId = formData.get("pipelineId") as string;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 파일 크기 제한 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 50MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    // 업로드 디렉토리 생성
    const uploadDir = path.join(process.cwd(), "public", "uploads", pipelineId || "general");
    await mkdir(uploadDir, { recursive: true });

    // 파일 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일명에 타임스탬프 추가
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext);
    const timestamp = Date.now();
    const safeFileName = `${baseName}_${timestamp}${ext}`;
    const filePath = path.join(uploadDir, safeFileName);

    await writeFile(filePath, buffer);

    // 파일 정보 반환
    const fileUrl = `/uploads/${pipelineId || "general"}/${safeFileName}`;
    const fileInfo = {
      name: file.name,
      savedName: safeFileName,
      size: file.size,
      type: file.type,
      url: fileUrl,
      pipelineId: pipelineId || "general",
      uploadedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, file: fileInfo });
  } catch (error) {
    console.error("파일 업로드 실패:", error);
    return NextResponse.json(
      { error: "파일 업로드에 실패했습니다." },
      { status: 500 }
    );
  }
}
