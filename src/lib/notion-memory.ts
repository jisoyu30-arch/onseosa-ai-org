const NOTION_BASE = "https://api.notion.com/v1";

interface NotionPage {
  id: string;
  title: string;
  createdTime: string;
}

interface NotionBlock {
  type: string;
  text: string;
}

// Notion API 헤더
function headers() {
  const key = process.env.NOTION_API_KEY;
  return {
    Authorization: `Bearer ${key}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };
}

// Parent 페이지의 하위 페이지 목록 가져오기 (최근 5개)
export async function getRecentPages(parentPageId: string, limit = 5): Promise<NotionPage[]> {
  if (!process.env.NOTION_API_KEY) return [];

  try {
    const res = await fetch(`${NOTION_BASE}/blocks/${parentPageId}/children?page_size=100`, {
      headers: headers(),
    });

    if (!res.ok) return [];

    const data = await res.json();
    const childPages: NotionPage[] = [];

    for (const block of data.results || []) {
      if (block.type === "child_page") {
        childPages.push({
          id: block.id,
          title: block.child_page?.title || "무제",
          createdTime: block.created_time,
        });
      }
    }

    // 최신순 정렬 후 limit개만 반환
    return childPages
      .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Notion 페이지 목록 조회 실패:", error);
    return [];
  }
}

// 페이지의 텍스트 블록 읽기
async function getPageBlocks(pageId: string): Promise<string> {
  if (!process.env.NOTION_API_KEY) return "";

  try {
    const res = await fetch(`${NOTION_BASE}/blocks/${pageId}/children?page_size=50`, {
      headers: headers(),
    });

    if (!res.ok) return "";

    const data = await res.json();
    const texts: string[] = [];

    for (const block of data.results || []) {
      const richTexts =
        block[block.type]?.rich_text ||
        block[block.type]?.text ||
        [];

      if (Array.isArray(richTexts)) {
        const text = richTexts.map((rt: { plain_text?: string }) => rt.plain_text || "").join("");
        if (text.trim()) texts.push(text);
      }
    }

    return texts.join("\n");
  } catch (error) {
    console.error("Notion 블록 읽기 실패:", error);
    return "";
  }
}

// 파이프라인의 이전 컨텍스트 가져오기
export async function getPipelineMemory(notionParentId: string, maxPages = 3): Promise<string> {
  if (!process.env.NOTION_API_KEY || !notionParentId) return "";

  try {
    const recentPages = await getRecentPages(notionParentId, maxPages);

    if (recentPages.length === 0) return "";

    // 모든 페이지 블록을 병렬로 조회
    const blockResults = await Promise.all(
      recentPages.map(async (page) => {
        const content = await getPageBlocks(page.id);
        const preview = content.slice(0, 800);
        const header = `\n--- ${page.title} (${new Date(page.createdTime).toLocaleDateString("ko-KR")}) ---`;
        return header + "\n" + (preview || "(내용 없음)");
      })
    );

    return `[이전 작업 기록 - 최근 ${recentPages.length}건]\n` + blockResults.join("\n");
  } catch (error) {
    console.error("파이프라인 기억 조회 실패:", error);
    return "";
  }
}
