import { NextResponse } from "next/server";
import { generateMorningReport } from "@/lib/morning-report";

export async function GET() {
  try {
    if (!process.env.NOTION_API_KEY) {
      return NextResponse.json(
        { error: "NOTION_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const report = await generateMorningReport();

    return NextResponse.json({
      success: true,
      ...report,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("모닝리포트 생성 실패:", error);
    return NextResponse.json(
      { error: `모닝리포트 생성 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}
