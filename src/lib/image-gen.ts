import OpenAI from "openai";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isDriveConfigured, uploadToDrive } from "./google-drive";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// DALL-E 3 지원 사이즈
type DalleSize = "1024x1024" | "1024x1792" | "1792x1024";

const VALID_SIZES: DalleSize[] = ["1024x1024", "1024x1792", "1792x1024"];

function validateSize(size?: string): DalleSize {
  if (size && VALID_SIZES.includes(size as DalleSize)) {
    return size as DalleSize;
  }
  return "1024x1024";
}

export interface GeneratedImage {
  url: string; // 로컬 URL 경로
  revisedPrompt: string;
  originalUrl: string; // OpenAI 원본 URL
  driveFileId?: string; // Google Drive 파일 ID
  driveViewLink?: string; // Google Drive 웹 보기 링크
  driveDownloadLink?: string; // Google Drive 다운로드 링크
}

/**
 * DALL-E 3를 사용하여 이미지를 생성하고 로컬에 저장
 * @param prompt - 이미지 생성 프롬프트
 * @param size - 이미지 크기 (기본: 1024x1024)
 * @returns 생성된 이미지 정보 또는 null
 */
export async function generateImage(
  prompt: string,
  size?: string
): Promise<GeneratedImage | null> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("[image-gen] OPENAI_API_KEY가 설정되지 않았습니다.");
      return null;
    }

    const validSize = validateSize(size);

    console.log(`[image-gen] 이미지 생성 시작: "${prompt.slice(0, 80)}..." (${validSize})`);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: validSize,
      quality: "hd",
    });

    const imageData = response.data?.[0];
    if (!imageData?.url) {
      console.error("[image-gen] OpenAI에서 이미지 URL을 받지 못했습니다.");
      return null;
    }

    const openaiUrl = imageData.url;
    const revisedPrompt = imageData.revised_prompt || prompt;

    // 이미지를 로컬에 다운로드 및 저장
    const localResult = await downloadAndSaveImage(openaiUrl);
    if (!localResult) {
      // 다운로드 실패 시 원본 URL 반환
      return {
        url: openaiUrl,
        revisedPrompt,
        originalUrl: openaiUrl,
      };
    }

    console.log(`[image-gen] 이미지 저장 완료: ${localResult.localUrl}`);

    const result: GeneratedImage = {
      url: localResult.localUrl,
      revisedPrompt,
      originalUrl: openaiUrl,
    };

    // Google Drive에 업로드 (자격 증명이 설정된 경우)
    if (isDriveConfigured()) {
      try {
        const driveResult = await uploadToDrive(
          localResult.filePath,
          localResult.fileName,
          process.env.GOOGLE_DRIVE_FOLDER_ID || undefined
        );
        if (driveResult) {
          result.driveFileId = driveResult.fileId;
          result.driveViewLink = driveResult.webViewLink;
          result.driveDownloadLink = driveResult.webContentLink;
          console.log(
            `[image-gen] Google Drive 업로드 완료: ${driveResult.fileId}`
          );
        }
      } catch (driveError) {
        console.warn("[image-gen] Google Drive 업로드 실패 (계속 진행):", driveError);
      }
    }

    return result;
  } catch (error) {
    console.error("[image-gen] 이미지 생성 실패:", error);
    return null;
  }
}

interface LocalSaveResult {
  localUrl: string;
  filePath: string;
  fileName: string;
}

/**
 * OpenAI URL에서 이미지를 다운로드하여 public/uploads/generated/에 저장
 */
async function downloadAndSaveImage(imageUrl: string): Promise<LocalSaveResult | null> {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "generated");
    await mkdir(uploadDir, { recursive: true });

    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`[image-gen] 이미지 다운로드 실패: ${response.status}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileName = `dalle3_${timestamp}_${randomSuffix}.png`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return {
      localUrl: `/uploads/generated/${fileName}`,
      filePath,
      fileName,
    };
  } catch (error) {
    console.error("[image-gen] 이미지 다운로드/저장 실패:", error);
    return null;
  }
}

// 이미지 생성이 필요한 파이프라인 ID 목록
const IMAGE_PIPELINES = [
  "music-album",
  "music-video",
  "playlist",
  "short-form",
  "instagram-post",
];

/**
 * 파이프라인이 이미지 생성을 지원하는지 확인
 */
export function isImagePipeline(pipelineId: string): boolean {
  return IMAGE_PIPELINES.includes(pipelineId);
}

/**
 * 콘텐츠에서 이미지 프롬프트를 추출
 * 패턴:
 * - "이미지 프롬프트:" 또는 "Image prompt:" 뒤의 텍스트
 * - 백틱 블록 안의 프롬프트 (```prompt ... ``` 또는 ```image ... ```)
 * - "커버 이미지 프롬프트", "썸네일 프롬프트", "비주얼 프롬프트" 등
 */
export function extractImagePrompts(content: string): string[] {
  const prompts: string[] = [];

  // 패턴 1: 한국어/영어 이미지 프롬프트 레이블
  const labelPatterns = [
    /(?:이미지\s*프롬프트|Image\s*[Pp]rompt|커버\s*(?:이미지\s*)?프롬프트|썸네일\s*프롬프트|비주얼\s*프롬프트|앨범\s*커버\s*프롬프트|Cover\s*[Pp]rompt|Thumbnail\s*[Pp]rompt|Visual\s*[Pp]rompt)\s*[:\-]\s*(.+?)(?:\n\n|\n(?=[#\-*●■▶])|$)/gi,
  ];

  for (const pattern of labelPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const extracted = match[1].trim();
      if (extracted.length > 10) {
        prompts.push(extracted);
      }
    }
  }

  // 패턴 2: 백틱 코드 블록 (prompt, image, dalle 등)
  const codeBlockPattern = /```(?:prompt|image|dalle|cover|thumbnail|visual)[^\n]*\n([\s\S]*?)```/gi;
  let match;
  while ((match = codeBlockPattern.exec(content)) !== null) {
    const extracted = match[1].trim();
    if (extracted.length > 10) {
      prompts.push(extracted);
    }
  }

  // 패턴 3: DALL-E 또는 Midjourney 스타일 프롬프트 (영어로 된 긴 설명)
  const dallePattern = /(?:DALL[-·]?E|Midjourney|Stable\s*Diffusion)\s*(?:프롬프트|[Pp]rompt)\s*[:\-]\s*(.+?)(?:\n\n|\n(?=[#\-*●■▶])|$)/gi;
  while ((match = dallePattern.exec(content)) !== null) {
    const extracted = match[1].trim();
    if (extracted.length > 10) {
      prompts.push(extracted);
    }
  }

  // 중복 제거
  return [...new Set(prompts)];
}
