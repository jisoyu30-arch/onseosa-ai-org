import Anthropic from "@anthropic-ai/sdk";
import { PIPELINES, HEADQUARTERS, getHeadquartersForPipeline } from "./pipelines";
import { getRecentPages } from "./notion-memory";

// ============================================================
// 모닝리포트 생성 모듈
// ============================================================

interface PipelineActivity {
  pipelineId: string;
  pipelineName: string;
  pipelineIcon: string;
  headquartersName: string;
  recentPages: {
    id: string;
    title: string;
    createdTime: string;
  }[];
}

export interface MorningReport {
  generatedAt: string;
  report: string;
  pipelineActivities: PipelineActivity[];
}

/**
 * 모든 파이프라인의 Notion 페이지에서 최근 24시간 활동을 수집
 */
async function scanAllPipelines(): Promise<PipelineActivity[]> {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const activities: PipelineActivity[] = [];

  // 모든 파이프라인을 병렬로 스캔
  const results = await Promise.allSettled(
    PIPELINES.map(async (pipeline) => {
      const hq = getHeadquartersForPipeline(pipeline.id);
      const recentPages = await getRecentPages(pipeline.notionParentId, 20);

      // 최근 24시간 내 생성된 페이지만 필터
      const recentActivity = recentPages.filter((page) => {
        const createdAt = new Date(page.createdTime);
        return createdAt >= twentyFourHoursAgo;
      });

      return {
        pipelineId: pipeline.id,
        pipelineName: pipeline.name,
        pipelineIcon: pipeline.icon,
        headquartersName: hq?.name || "미지정",
        recentPages: recentActivity,
      };
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      activities.push(result.value);
    }
  }

  return activities;
}

/**
 * 수집된 활동 데이터를 기반으로 Claude AI가 모닝리포트 생성
 */
async function generateReportWithAI(activities: PipelineActivity[]): Promise<string> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return buildFallbackReport(activities);
  }

  const client = new Anthropic({ apiKey });

  // 활동 요약 텍스트 구성
  const activitySummary = activities
    .map((a) => {
      if (a.recentPages.length === 0) {
        return `${a.pipelineIcon} ${a.pipelineName} (${a.headquartersName}): 최근 24시간 활동 없음`;
      }
      const pageList = a.recentPages
        .map((p) => `  - "${p.title}" (${new Date(p.createdTime).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })})`)
        .join("\n");
      return `${a.pipelineIcon} ${a.pipelineName} (${a.headquartersName}): ${a.recentPages.length}건 생성\n${pageList}`;
    })
    .join("\n\n");

  // 본부별 통계
  const hqStats = HEADQUARTERS.map((hq) => {
    const hqPipelines = activities.filter(
      (a) => PIPELINES.find((p) => p.id === a.pipelineId)?.headquartersId === hq.id
    );
    const totalPages = hqPipelines.reduce((sum, a) => sum + a.recentPages.length, 0);
    return `${hq.icon} ${hq.name}: ${totalPages}건`;
  }).join("\n");

  const totalActivity = activities.reduce((sum, a) => sum + a.recentPages.length, 0);

  const prompt = `당신은 온서사(Onseosa) AI 에이전트 회사의 총괄운영실장입니다.
아래 데이터를 분석하여 대표에게 보고할 모닝리포트를 작성해주세요.

[조직 구조]
- 4개 본부: 운영기획본부, 콘텐츠창작본부, 제작배포본부, AI시스템플랫폼본부
- 총 ${PIPELINES.length}개 자동화 파이프라인 운영 중

[최근 24시간 본부별 활동 통계]
${hqStats}
총 활동: ${totalActivity}건

[파이프라인별 상세 활동]
${activitySummary}

위 데이터를 기반으로 아래 7개 섹션으로 구성된 모닝리포트를 작성하세요.
각 섹션은 실제 데이터에 근거해야 하며, 활동이 없는 경우 솔직히 "활동 없음"으로 기재하세요.
추측이나 허구 정보는 절대 포함하지 마세요.

## 오늘의 핵심 요약
(전체 활동을 2-3문장으로 요약)

## 밤사이 완료된 작업
(최근 24시간 내 생성된 페이지 목록, 파이프라인별 정리)

## 진행 중인 작업
(활동이 활발한 파이프라인 기반 추정)

## 막힌 작업과 원인
(활동이 없는 파이프라인 식별 및 가능한 원인 분석)

## 품질 검토 결과
(생성된 콘텐츠의 전반적 품질 상태 요약)

## 성장 기회 제안
(데이터 기반 개선 제안 1-2가지)

## 오늘 대표가 결정할 3가지
(우선순위가 높은 결정 사항 3가지)

보고서는 간결하고 실행 가능한 내용 위주로 작성하세요. 한국어로 작성합니다.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock?.text || buildFallbackReport(activities);
  } catch (error) {
    console.error("Claude API 호출 실패:", error);
    return buildFallbackReport(activities);
  }
}

/**
 * AI 호출 실패 시 기본 리포트 생성
 */
function buildFallbackReport(activities: PipelineActivity[]): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });
  const totalActivity = activities.reduce((sum, a) => sum + a.recentPages.length, 0);

  const activePipelines = activities.filter((a) => a.recentPages.length > 0);
  const inactivePipelines = activities.filter((a) => a.recentPages.length === 0);

  let report = `# 온서사 모닝리포트 - ${dateStr}\n\n`;

  report += `## 오늘의 핵심 요약\n`;
  report += `최근 24시간 동안 총 ${totalActivity}건의 작업이 ${activePipelines.length}개 파이프라인에서 수행되었습니다.\n\n`;

  report += `## 밤사이 완료된 작업\n`;
  if (activePipelines.length === 0) {
    report += `최근 24시간 내 완료된 작업이 없습니다.\n\n`;
  } else {
    for (const a of activePipelines) {
      report += `### ${a.pipelineIcon} ${a.pipelineName} (${a.headquartersName})\n`;
      for (const page of a.recentPages) {
        const time = new Date(page.createdTime).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
        report += `- ${page.title} (${time})\n`;
      }
      report += `\n`;
    }
  }

  report += `## 진행 중인 작업\n`;
  report += `AI 분석 없이 자동 생성된 리포트입니다. CLAUDE_API_KEY를 설정하면 상세 분석을 받을 수 있습니다.\n\n`;

  report += `## 막힌 작업과 원인\n`;
  if (inactivePipelines.length > 0) {
    report += `다음 파이프라인에서 최근 24시간 활동이 없습니다:\n`;
    for (const a of inactivePipelines) {
      report += `- ${a.pipelineIcon} ${a.pipelineName} (${a.headquartersName})\n`;
    }
    report += `\n`;
  } else {
    report += `모든 파이프라인이 활동 중입니다.\n\n`;
  }

  report += `## 품질 검토 결과\n`;
  report += `상세 분석을 위해 CLAUDE_API_KEY 설정이 필요합니다.\n\n`;

  report += `## 성장 기회 제안\n`;
  report += `상세 분석을 위해 CLAUDE_API_KEY 설정이 필요합니다.\n\n`;

  report += `## 오늘 대표가 결정할 3가지\n`;
  report += `상세 분석을 위해 CLAUDE_API_KEY 설정이 필요합니다.\n`;

  return report;
}

/**
 * 모닝리포트 메인 함수
 */
export async function generateMorningReport(): Promise<MorningReport> {
  // 1. 모든 파이프라인 Notion 페이지 스캔
  const activities = await scanAllPipelines();

  // 2. AI로 리포트 생성
  const report = await generateReportWithAI(activities);

  return {
    generatedAt: new Date().toISOString(),
    report,
    pipelineActivities: activities,
  };
}
