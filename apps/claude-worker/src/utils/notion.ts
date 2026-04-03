interface NotionBlock {
  object: 'block';
  type: string;
  [key: string]: unknown;
}

function textBlock(content: string): NotionBlock {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{ text: { content: content.slice(0, 2000) } }],
    },
  };
}

function headingBlock(content: string, level: 2 | 3 = 2): NotionBlock {
  const key = `heading_${level}`;
  return {
    object: 'block',
    type: key,
    [key]: {
      rich_text: [{ text: { content } }],
    },
  };
}

function codeBlock(content: string, language = 'json'): NotionBlock {
  return {
    object: 'block',
    type: 'code',
    code: {
      rich_text: [{ text: { content: content.slice(0, 2000) } }],
      language,
    },
  };
}

function dividerBlock(): NotionBlock {
  return { object: 'block', type: 'divider', divider: {} };
}

function bulletBlock(content: string): NotionBlock {
  return {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [{ text: { content: content.slice(0, 2000) } }],
    },
  };
}

// ─── 완성 콘텐츠 블록 빌더 ───

/**
 * 앨범 프로젝트용: 완성 콘텐츠 + 트랙리스트 + 파이프라인 결과
 */
function buildAlbumPageBlocks(results: Record<string, unknown>): NotionBlock[] {
  const blocks: NotionBlock[] = [];
  const tracks = results.tracks as Array<Record<string, unknown>> | undefined;
  const overview = results.album_overview || results.overview;
  const albumIntro = results.album_intro as string | undefined;
  const albumConcept = results.album_concept as string | undefined;
  const coverConcept = results.cover_concept as string | undefined;

  // ── 1. 앨범 소개 (완성 콘텐츠) ──
  blocks.push(headingBlock('앨범 소개', 2));
  if (albumIntro) {
    blocks.push(textBlock(albumIntro));
  } else if (albumConcept) {
    blocks.push(textBlock(albumConcept));
  } else {
    blocks.push(textBlock('(파이프라인 완료 후 자동 생성됩니다)'));
  }

  blocks.push(dividerBlock());

  // ── 2. 트랙리스트 (완성 콘텐츠) ──
  if (tracks && Array.isArray(tracks)) {
    blocks.push(headingBlock('트랙리스트', 2));

    // 앨범 개요 요약
    if (overview) {
      const ov = overview as Record<string, unknown>;
      const instruments = Array.isArray(ov.all_instruments) ? ov.all_instruments.join(', ') : '';
      const moods = Array.isArray(ov.all_moods) ? ov.all_moods.join(', ') : '';
      const avgBpm = ov.average_bpm || '';
      const totalTracks = ov.total_tracks || tracks.length;
      blocks.push(textBlock(`전체 ${totalTracks}곡 | 평균 BPM ${avgBpm}\n악기: ${instruments}\n무드: ${moods}`));
      blocks.push(dividerBlock());
    }

    for (const track of tracks) {
      const num = track.trackNumber || track.track_number || '?';
      const title = track.title || 'Untitled';
      const instruments = Array.isArray(track.instruments) ? track.instruments.join(', ') : '';
      const mood = Array.isArray(track.mood) ? track.mood.join(', ') : (track.mood || '');
      const desc = (track.description_hints || track.description || '') as string;
      const bpm = track.bpm || '';
      const genre = track.genre || '';
      const vocal = (track.vocal || 'none') as string;

      // 곡 설명 (ria가 작성한 완성 카피)
      const trackCopy = (track.copy || track.track_description || '') as string;

      blocks.push(headingBlock(`${num}. ${title}`, 3));

      // 완성된 곡 설명이 있으면 먼저 표시
      if (trackCopy) {
        blocks.push(textBlock(trackCopy));
      }

      // 분석 정보
      const infoLines = [`악기: ${instruments}`, `장르: ${genre} | BPM: ${bpm} | 무드: ${mood}`];
      if (vocal !== 'none') infoLines.push(`보컬: ${vocal}`);
      if (desc && !trackCopy) infoLines.push(desc);
      blocks.push(textBlock(infoLines.join('\n')));
    }
  }

  blocks.push(dividerBlock());

  // ── 3. 앨범 자켓 컨셉 ──
  if (coverConcept) {
    blocks.push(headingBlock('앨범 자켓 컨셉', 2));
    blocks.push(textBlock(coverConcept));
    blocks.push(dividerBlock());
  }

  // ── 4. 파이프라인 결과 (과정 기록) ──
  blocks.push(headingBlock('파이프라인 결과', 2));
  const pipelineInfo = results.pipeline_summary as string | undefined;
  const score = results.score as number | undefined;
  if (score) {
    blocks.push(textBlock(`검수 점수: ${score}/100`));
  }
  if (pipelineInfo) {
    blocks.push(textBlock(pipelineInfo));
  }

  // ── 5. 발매 체크리스트 ──
  blocks.push(dividerBlock());
  blocks.push(headingBlock('발매 체크리스트', 2));
  const checklist = [
    '마스터 음원 (WAV 44.1kHz/16-bit)',
    '커버 이미지 (3000×3000 RGB JPG)',
    '메타데이터 시트 (아티스트, 트랙명, ISRC, UPC)',
    '크레딧/권리 자료 (AI 사용 노트 포함)',
    '발매 일정 (업로드 3~4주 전)',
    '프로모션 자료 (티저, 캡션)',
  ];
  for (const item of checklist) {
    blocks.push(bulletBlock(`☐ ${item}`));
  }

  // Notion API 한 번에 최대 100개 블록
  return blocks.slice(0, 100);
}

/**
 * 숏폼 프로젝트용: 대본 + 메타 정보
 */
function buildShortformPageBlocks(results: Record<string, unknown>): NotionBlock[] {
  const blocks: NotionBlock[] = [];

  // 훅 문장
  const hook = results.first_sentence as string | undefined;
  if (hook) {
    blocks.push(headingBlock('훅 (첫 문장)', 2));
    blocks.push(textBlock(hook));
    blocks.push(dividerBlock());
  }

  // 전체 대본
  const script = results.script as string | undefined;
  const description = results.description as string | undefined;
  const mainContent = script || description;
  if (mainContent) {
    blocks.push(headingBlock('대본', 2));
    // 2000자 제한으로 나눠서 저장
    const chunks = mainContent.match(/.{1,2000}/gs) || [mainContent];
    for (const chunk of chunks) {
      blocks.push(textBlock(chunk));
    }
    blocks.push(dividerBlock());
  }

  // 카피 변형
  const copies = results.copy_variants as string[] | undefined;
  if (copies && copies.length > 0) {
    blocks.push(headingBlock('카피 변형', 2));
    for (const copy of copies) blocks.push(bulletBlock(copy));
    blocks.push(dividerBlock());
  }

  // 검수 점수
  const score = results.score as number | undefined;
  const tone = results.tone_used as string | undefined;
  if (score || tone) {
    blocks.push(headingBlock('메타 정보', 2));
    if (score) blocks.push(textBlock(`검수 점수: ${score}/100`));
    if (tone) blocks.push(textBlock(`톤: ${tone}`));
  }

  return blocks.slice(0, 100);
}

/**
 * 일반 프로젝트용: 완성 콘텐츠 + 파이프라인 결과
 */
function buildGeneralPageBlocks(results: Record<string, unknown>): NotionBlock[] {
  const blocks: NotionBlock[] = [];

  // 완성 콘텐츠 — ria 출력 필드 우선순위대로 탐색
  const content = results.script
    || results.description
    || results.final_content
    || results.content
    || results.output;

  if (content) {
    blocks.push(headingBlock('완성 콘텐츠', 2));
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    // 2000자 제한으로 나눠서 저장
    const chunks = contentStr.match(/.{1,2000}/gs) || [contentStr];
    for (const chunk of chunks) {
      blocks.push(textBlock(chunk));
    }
    blocks.push(dividerBlock());
  }

  // 파이프라인 결과
  blocks.push(headingBlock('파이프라인 결과', 2));
  const score = results.score as number | undefined;
  const pipelineSummary = results.pipeline_summary as string | undefined;
  if (score) blocks.push(textBlock(`검수 점수: ${score}/100`));
  if (pipelineSummary) blocks.push(textBlock(pipelineSummary));
  blocks.push(codeBlock(JSON.stringify(results, null, 2)));

  return blocks.slice(0, 100);
}

// ─── 메인 함수 ───

export async function saveToNotion(data: {
  projectName: string;
  projectType: string;
  results: Record<string, unknown>;
}): Promise<string | null> {
  const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.log('[Notion] API key or database ID not set, skipping');
    return null;
  }

  const titles = (data.results.title_options || data.results.titles || []) as string[];
  const recommendedTitle = data.results.recommended_title as string | undefined;
  const title = recommendedTitle
    || (Array.isArray(titles) && titles.length > 0 ? titles[0] : null)
    || data.projectName;
  const score = (data.results.score || 0) as number;

  // 프로젝트 유형에 따라 페이지 구조 결정
  const hasTrackData = data.results.tracks && Array.isArray(data.results.tracks);
  const isShortform = data.projectType === 'shortform';
  const children: NotionBlock[] = hasTrackData
    ? buildAlbumPageBlocks(data.results)
    : isShortform
      ? buildShortformPageBlocks(data.results)
      : buildGeneralPageBlocks(data.results);

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
      children,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Notion API error: ${response.status} ${err}`);
  }

  const page = await response.json() as { id: string; url?: string };
  const pageUrl = page.url || `https://notion.so/${page.id.replace(/-/g, '')}`;
  console.log('[Notion] Page created:', pageUrl);
  return pageUrl;
}
