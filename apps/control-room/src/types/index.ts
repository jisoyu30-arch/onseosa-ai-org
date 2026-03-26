export type EngineStatus = 'idle' | 'working' | 'waiting' | 'needs_input' | 'reporting';

export interface EngineInfo {
  name: string;
  label: string;
  department: string;
  model: string;
  status: EngineStatus;
  currentTask?: string;
}

export const STATUS_COLOR: Record<EngineStatus, string> = {
  working: 'bg-green-500',
  waiting: 'bg-yellow-400',
  idle: 'bg-gray-400',
  needs_input: 'bg-orange-400',
  reporting: 'bg-purple-400',
};

export const STATUS_LABEL: Record<EngineStatus, string> = {
  working: '작업 중',
  waiting: '대기 중',
  idle: '대기',
  needs_input: '입력 필요',
  reporting: '보고 중',
};

export const ENGINES: EngineInfo[] = [
  { name: 'seo', label: '서 본부장', department: '총괄지휘 + 검수', model: 'GPT-4o', status: 'idle' },
  { name: 'baek', label: '백박사', department: '자료조사 + 분석', model: 'Gemini 2.5 Flash', status: 'idle' },
  { name: 'ahn', label: '정수석', department: '기획', model: 'GPT-4o', status: 'idle' },
  { name: 'han', label: '한강작가', department: '창작', model: 'Claude Sonnet', status: 'idle' },
  { name: 'hong', label: '홍사서', department: '기록관리', model: 'Supabase', status: 'idle' },
];
