import { getSupabase } from './supabase';
import { readdir, readFile } from 'fs/promises';
import { resolve, extname } from 'path';

export interface PastWorkResult {
  taskHistory: Array<{
    projectName: string;
    taskType: string;
    summary: string;
    createdAt: string;
  }>;
  localFiles: Array<{
    filename: string;
    snippet: string;
  }>;
}

// 과거 작업 통합 검색
export async function searchPastWork(query: string): Promise<PastWorkResult> {
  const [taskHistory, localFiles] = await Promise.all([
    searchTaskHistory(query),
    searchLocalFiles(query),
  ]);

  return { taskHistory, localFiles };
}

// Supabase task_history 검색
async function searchTaskHistory(query: string) {
  try {
    const supabase = getSupabase();
    const { data: rows } = await supabase
      .from('task_history')
      .select('project_name, task_type, feedback, result_status, created_at')
      .or(`feedback.ilike.%${query}%,project_name.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!rows?.length) return [];

    return rows.map((r: Record<string, unknown>) => ({
      projectName: (r.project_name as string) || '',
      taskType: (r.task_type as string) || '',
      summary: (r.feedback as string) || '',
      createdAt: (r.created_at as string) || '',
    }));
  } catch (err) {
    console.warn('[PastWork] task_history 검색 실패:', (err as Error).message);
    return [];
  }
}

// data/ 폴더 로컬 파일 검색
async function searchLocalFiles(query: string) {
  const results: Array<{ filename: string; snippet: string }> = [];
  const dataDir = resolve(__dirname, '../../../../data');
  const keywords = query.toLowerCase().split(/\s+/);

  try {
    await scanDir(dataDir, keywords, results);
  } catch {
    // data/ 폴더가 없으면 무시
  }

  return results.slice(0, 10);
}

async function scanDir(
  dir: string,
  keywords: string[],
  results: Array<{ filename: string; snippet: string }>,
) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (results.length >= 10) break;
    const fullPath = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      await scanDir(fullPath, keywords, results);
      continue;
    }

    const ext = extname(entry.name).toLowerCase();
    if (!['.json', '.md', '.txt'].includes(ext)) continue;

    // 파일명 매칭
    const nameMatch = keywords.some(k => entry.name.toLowerCase().includes(k));

    // 작은 파일은 내용도 검색
    let contentSnippet = '';
    try {
      const content = await readFile(fullPath, 'utf-8');
      if (content.length <= 50000) {
        const contentLower = content.toLowerCase();
        const contentMatch = keywords.some(k => contentLower.includes(k));
        if (nameMatch || contentMatch) {
          // 키워드 주변 500자 추출
          const idx = keywords.reduce((best, k) => {
            const i = contentLower.indexOf(k);
            return i >= 0 && (best < 0 || i < best) ? i : best;
          }, -1);
          const start = Math.max(0, idx - 100);
          contentSnippet = content.slice(start, start + 500).trim();
        }
      } else if (nameMatch) {
        contentSnippet = `(파일 크기: ${Math.round(content.length / 1024)}KB)`;
      }
    } catch {
      if (nameMatch) contentSnippet = '(읽기 실패)';
    }

    if (nameMatch || contentSnippet) {
      const relativePath = fullPath.replace(resolve(__dirname, '../../../..') + '/', '');
      results.push({ filename: relativePath, snippet: contentSnippet });
    }
  }
}
