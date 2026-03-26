export async function saveToNotion(data: {
  projectName: string;
  projectType: string;
  results: Record<string, unknown>;
}) {
  const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.log('[Notion] API key or database ID not set, skipping');
    return;
  }

  const titles = (data.results.title_options || data.results.titles || []) as string[];
  const title = Array.isArray(titles) && titles.length > 0 ? titles[0] : data.projectName;
  const summary = (data.results.summary || data.results.description || '') as string;
  const score = (data.results.score || 0) as number;

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        '이름': {
          title: [{ text: { content: title } }],
        },
        '프로젝트': {
          rich_text: [{ text: { content: data.projectName } }],
        },
        '유형': {
          select: { name: data.projectType || 'playlist' },
        },
        '점수': {
          number: score,
        },
        '상태': {
          select: { name: '완료' },
        },
        '날짜': {
          date: { start: new Date().toISOString().split('T')[0] },
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ text: { content: '파이프라인 결과' } }],
          },
        },
        {
          object: 'block',
          type: 'code',
          code: {
            rich_text: [{ text: { content: JSON.stringify(data.results, null, 2).slice(0, 2000) } }],
            language: 'json',
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Notion API error: ${response.status} ${err}`);
  }

  console.log('[Notion] Page created successfully');
}
