const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';

export async function runWorkflow(payload: {
  projectName: string;
  projectType: string;
  goal: string;
  assets?: string[];
}) {
  const res = await fetch(`${N8N_WEBHOOK_URL}/ons-start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('워크플로우 실행 실패');
  return res.json();
}
