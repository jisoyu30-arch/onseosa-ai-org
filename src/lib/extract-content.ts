/**
 * n8n 응답에서 콘텐츠 텍스트를 추출하는 공통 헬퍼
 */
export function extractContentText(result: unknown): string {
  if (typeof result === "string") return result;
  if (result && typeof result === "object") {
    const obj = result as Record<string, unknown>;
    if (typeof obj.output === "string") return obj.output;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.text === "string") return obj.text;
  }
  return JSON.stringify(result, null, 2);
}
