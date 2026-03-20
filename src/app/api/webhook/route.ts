import { NextRequest, NextResponse } from "next/server";

// n8n에서 콜백으로 결과를 보내줄 때 받는 엔드포인트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[Webhook 수신]", JSON.stringify(body, null, 2));

    // TODO: 실시간 업데이트가 필요하면 여기서 WebSocket/SSE로 클라이언트에 전달
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook 처리 실패" },
      { status: 500 }
    );
  }
}
