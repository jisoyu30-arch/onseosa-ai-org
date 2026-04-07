import { useState, useEffect, useCallback, useRef } from 'react';
import { Send, RefreshCw, Circle, CheckCircle, AlertCircle, Loader2, Paperclip, X, Folder } from 'lucide-react';
import {
  getHealth,
  getCompanyId,
  getAgents,
  getIssues,
  createIssue,
  PaperClipAgent,
  PaperClipIssue,
} from '../services/paperclip';

const STATUS_ICON: Record<string, { color: string; label: string }> = {
  todo: { color: 'text-slate-400', label: 'Todo' },
  in_progress: { color: 'text-cyan-400', label: 'Live' },
  done: { color: 'text-emerald-400', label: 'Done' },
  blocked: { color: 'text-red-400', label: 'Blocked' },
};

const AGENT_STATUS_COLOR: Record<string, string> = {
  idle: 'bg-slate-600',
  running: 'bg-cyan-400',
  error: 'bg-red-400',
  paused: 'bg-amber-400',
};

const ENGINE_ICONS: Record<string, string> = {
  'CEO': 'crown',
  'Research Lead': 'search',
  'Novel Studio': 'sparkles',
  'Music/Album Studio': 'wand',
  'Video/Social Studio': 'flame',
  'App/Product Studio': 'code',
  'Publishing Studio': 'package',
  'Review Board': 'shield',
  'Video Lab': 'rocket',
  'Design/Packaging Lab': 'gem',
};

const PROJECTS = [
  { name: '최애엄마', type: 'universe', color: 'text-violet-400', border: 'border-violet-500/30' },
  { name: '기획의중국', type: 'tv', color: 'text-amber-400', border: 'border-amber-500/30' },
  { name: '독서플레이리스트', type: 'album', color: 'text-emerald-400', border: 'border-emerald-500/30' },
  { name: '레터브릭', type: 'app', color: 'text-cyan-400', border: 'border-cyan-500/30' },
  { name: '인스타홍보', type: 'campaign', color: 'text-rose-400', border: 'border-rose-500/30' },
];

export function PaperClipWidget() {
  const [connected, setConnected] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [agents, setAgents] = useState<PaperClipAgent[]>([]);
  const [issues, setIssues] = useState<PaperClipIssue[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    try {
      await getHealth();
      setConnected(true);
      const cid = await getCompanyId();
      setCompanyId(cid);
      const [a, i] = await Promise.all([getAgents(cid), getIssues(cid)]);
      setAgents(a);
      setIssues(Array.isArray(i) ? i : []);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const paths = Array.from(files).map(f => (f as any).path || f.name);
    setAttachedFiles(prev => [...prev, ...paths]);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!input.trim() || !companyId) return;
    setLoading(true);
    try {
      const ceo = agents.find(a => a.role === 'ceo');
      let description = '';
      if (attachedFiles.length > 0) {
        description = `\n\nAttached reference files:\n${attachedFiles.map(f => `- ${f}`).join('\n')}`;
      }
      await createIssue(companyId, {
        title: input.trim(),
        description: description || undefined,
        assigneeAgentId: ceo?.id,
      });
      setInput('');
      setAttachedFiles([]);
      await refresh();
    } catch (e) {
      console.error('Issue creation failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const liveCount = issues.filter(i => i.status === 'in_progress').length;
  const doneCount = issues.filter(i => i.status === 'done').length;

  return (
    <div className="space-y-6">

      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
          <span className="text-sm text-slate-400">
            {connected ? `${agents.length} engines connected` : 'Paper Clip disconnected — start server'}
          </span>
        </div>
        <button onClick={refresh} className="text-slate-500 hover:text-slate-300 transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Command Input */}
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="What do you want to create? (e.g. 로파이 앨범 만들어줘)"
            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
          />
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} accept="image/*,.json,.wav,.mp3,.pdf,.docx,.txt" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
            title="Attach files"
          >
            <Paperclip size={18} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-600/30 disabled:opacity-30 transition-all"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        {attachedFiles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {attachedFiles.map((file, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-900/30 border border-cyan-700/30 rounded text-xs text-cyan-300">
                <Paperclip size={10} />
                {file.split(/[/\\]/).pop()}
                <button onClick={() => removeFile(i)} className="hover:text-red-400 ml-1"><X size={10} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Engine Grid */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Engines</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {agents.map(agent => (
            <div
              key={agent.id}
              className="bg-slate-900/60 border border-slate-700/40 rounded-lg p-3 hover:border-slate-600 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full ${AGENT_STATUS_COLOR[agent.status] || 'bg-slate-600'}`} />
                <span className="text-xs font-medium text-slate-300 truncate">{agent.name}</span>
              </div>
              <p className="text-[10px] text-slate-600 truncate">{agent.capabilities?.slice(0, 40)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Issues + Projects side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Issues */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700/30 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Issues {issues.length > 0 && `(${issues.length})`}
            </h2>
            <div className="flex items-center gap-3 text-[10px] text-slate-600">
              {liveCount > 0 && <span className="text-cyan-400">{liveCount} live</span>}
              {doneCount > 0 && <span className="text-emerald-400">{doneCount} done</span>}
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50">
            {issues.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-600 text-sm">
                No issues yet — type a command above to start
              </div>
            ) : (
              issues.map(issue => {
                const st = STATUS_ICON[issue.status] || STATUS_ICON.todo;
                return (
                  <div key={issue.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex-shrink-0">
                      {issue.status === 'done' && <CheckCircle size={16} className="text-emerald-400" />}
                      {issue.status === 'in_progress' && <Loader2 size={16} className="text-cyan-400 animate-spin" />}
                      {issue.status === 'blocked' && <AlertCircle size={16} className="text-red-400" />}
                      {issue.status === 'todo' && <Circle size={16} className="text-slate-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-300">{issue.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-600">{issue.key}</span>
                        <span className={`text-[10px] ${st.color}`}>{st.label}</span>
                        {issue.assigneeAgent && (
                          <span className="text-[10px] text-slate-500">{issue.assigneeAgent.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700/30">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projects</h2>
          </div>
          <div className="divide-y divide-slate-800/50">
            {PROJECTS.map(proj => (
              <div key={proj.name} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-800/30 transition-colors">
                <Folder size={14} className={proj.color} />
                <div className="flex-1">
                  <div className="text-sm text-slate-300">{proj.name}</div>
                  <span className={`text-[10px] ${proj.color}`}>[{proj.type}]</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-slate-700">
        ONSEOSA V1 — {agents.length} engines — Paper Clip {connected ? 'connected' : 'disconnected'}
      </div>
    </div>
  );
}
