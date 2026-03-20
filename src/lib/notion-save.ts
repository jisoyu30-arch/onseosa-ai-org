const NOTION_BASE = "https://api.notion.com/v1";

interface NotionSaveResult {
  id: string;
  title: string;
  url: string;
}

function headers() {
  const key = process.env.NOTION_API_KEY;
  return {
    Authorization: `Bearer ${key}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };
}

// 텍스트를 2000자 단위로 분할
function splitText(text: string, maxLen = 2000): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxLen));
    i += maxLen;
  }
  if (chunks.length === 0) chunks.push("");
  return chunks;
}

// Notion에 페이지 생성
export async function saveToNotion(
  parentPageId: string,
  title: string,
  content: string,
  pipelineName: string
): Promise<NotionSaveResult | null> {
  if (!process.env.NOTION_API_KEY || !parentPageId) {
    console.error("NOTION_API_KEY 또는 parentPageId가 없습니다.");
    return null;
  }

  try {
    // 텍스트를 2000자 단위로 분할하여 블록 생성
    const chunks = splitText(content);
    const blocks = chunks
      .filter((chunk) => chunk.trim().length > 0)
      .map((chunk) => ({
        object: "block" as const,
        type: "paragraph" as const,
        paragraph: {
          rich_text: [
            {
              type: "text" as const,
              text: { content: chunk },
            },
          ],
        },
      }));

    // 파이프라인 라벨 블록 추가 (맨 위)
    const labelBlock = {
      object: "block" as const,
      type: "callout" as const,
      callout: {
        icon: { type: "emoji" as const, emoji: "📌" as const },
        rich_text: [
          {
            type: "text" as const,
            text: { content: `파이프라인: ${pipelineName} | 생성일: ${new Date().toLocaleDateString("ko-KR")}` },
          },
        ],
      },
    };

    const res = await fetch(`${NOTION_BASE}/pages`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        parent: { page_id: parentPageId },
        properties: {
          title: {
            title: [{ text: { content: title } }],
          },
        },
        children: [labelBlock, ...blocks].slice(0, 100), // Notion API 최대 100 블록
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Notion 페이지 생성 실패:", JSON.stringify(errorData));
      return null;
    }

    const data = await res.json();
    return {
      id: data.id,
      title: title,
      url: data.url,
    };
  } catch (error) {
    console.error("Notion 저장 실패:", error);
    return null;
  }
}
