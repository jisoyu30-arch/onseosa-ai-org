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
  { name: 'arko', label: '아르코', department: '총괄 디렉터 + 검수', model: 'GPT-4o', status: 'idle' },
  { name: 'noah', label: '노아', department: '분석', model: 'Gemini 2.5 Flash', status: 'idle' },
  { name: 'eden', label: '이든', department: '기획', model: 'GPT-4o', status: 'idle' },
  { name: 'ria', label: '리아', department: '작가', model: 'Claude Sonnet', status: 'idle' },
  { name: 'luka', label: '루카', department: '기록', model: 'Supabase + Drive', status: 'idle' },
];
