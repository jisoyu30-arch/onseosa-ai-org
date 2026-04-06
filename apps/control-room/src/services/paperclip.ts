const PAPERCLIP_URL = import.meta.env.VITE_PAPERCLIP_URL || '/paperclip';
const COMPANY_ID = import.meta.env.VITE_PAPERCLIP_COMPANY || 'd403b7ac-3dd0-49ed-ac86-4eab12b3fc2d';

export interface PaperClipAgent {
  id: string;
  name: string;
  title: string;
  role: string;
  status: 'idle' | 'running' | 'error' | 'paused';
  icon: string;
  capabilities: string;
  reportsTo: string | null;
}

export interface PaperClipIssue {
  id: string;
  key: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority: string;
  assigneeAgent?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${PAPERCLIP_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`Paper Clip API error: ${res.status}`);
  return res.json();
}

export async function getHealth(): Promise<{ status: string }> {
  return api('/api/health');
}

export async function getCompanies(): Promise<{ id: string; name: string }[]> {
  return api('/api/companies');
}

export async function getAgents(companyId: string): Promise<PaperClipAgent[]> {
  return api(`/api/companies/${companyId}/agents`);
}

export async function getIssues(companyId: string): Promise<PaperClipIssue[]> {
  return api(`/api/companies/${companyId}/issues`);
}

export async function createIssue(companyId: string, payload: {
  title: string;
  description?: string;
  assigneeAgentId?: string;
}): Promise<PaperClipIssue> {
  return api(`/api/companies/${companyId}/issues`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Auto-detect company ID on first load
let cachedCompanyId: string | null = null;

export async function getCompanyId(): Promise<string> {
  if (COMPANY_ID) return COMPANY_ID;
  if (cachedCompanyId) return cachedCompanyId;
  const companies = await getCompanies();
  // Use the latest ONSEOSA company (last created)
  const sorted = companies.sort((a: any, b: any) =>
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
  cachedCompanyId = sorted[0]?.id || companies[companies.length - 1]?.id || '';
  return cachedCompanyId;
}
