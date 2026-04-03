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

// 엔진별 네온 악센트 컬러 (Mission Control 테마)
export const ENGINE_ACCENT: Record<string, { color: string; glow: string; bg: string; text: string }> = {
  arko:      { color: '#06b6d4', glow: 'rgba(6,182,212,0.5)',   bg: 'bg-cyan-500/10',    text: 'text-cyan-400' },
  noah:      { color: '#f59e0b', glow: 'rgba(245,158,11,0.5)',  bg: 'bg-amber-500/10',   text: 'text-amber-400' },
  eden:      { color: '#10b981', glow: 'rgba(16,185,129,0.5)',  bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  ria:       { color: '#f43f5e', glow: 'rgba(244,63,94,0.5)',   bg: 'bg-rose-500/10',    text: 'text-rose-400' },
  mika:      { color: '#8b5cf6', glow: 'rgba(139,92,246,0.5)',  bg: 'bg-violet-500/10',  text: 'text-violet-400' },
  luka:      { color: '#3b82f6', glow: 'rgba(59,130,246,0.5)',  bg: 'bg-blue-500/10',    text: 'text-blue-400' },
};

// 엔진별 lucide 아이콘 이름
export const ENGINE_ICON: Record<string, string> = {
  arko: 'Shield',
  noah: 'BarChart3',
  eden: 'Lightbulb',
  ria: 'Pen',
  mika: 'Image',
  luka: 'Save',
};

export const ENGINES: EngineInfo[] = [
  { name: 'arko', label: '아르코', department: '총괄 디렉터 + 검수', model: 'GPT-4o', status: 'idle' },
  { name: 'noah', label: '노아', department: '분석', model: 'Gemini 2.5 Flash', status: 'idle' },
  { name: 'eden', label: '이든', department: '기획', model: 'GPT-4o-mini', status: 'idle' },
  { name: 'ria', label: '리아', department: '작가', model: 'Claude Haiku 4.5', status: 'idle' },
  { name: 'mika', label: '미카', department: '미디어 제작', model: 'DALL-E 3 + Remotion', status: 'idle' },
  { name: 'luka', label: '루카', department: '기록', model: 'Supabase + Drive', status: 'idle' },
];
