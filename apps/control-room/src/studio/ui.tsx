// 대본 화면과 컷 보드가 같이 쓰는 작은 표시 부품.
export type Tone = 'ok' | 'warn' | 'bad' | 'idle';

const TONES: Record<Tone, string> = {
  ok: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  warn: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  bad: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  idle: 'bg-slate-700/40 text-slate-300 border-slate-600',
};

export function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${TONES[tone]}`}>{children}</span>;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold tracking-wider text-slate-400">{label}</span>
      {children}
    </label>
  );
}
