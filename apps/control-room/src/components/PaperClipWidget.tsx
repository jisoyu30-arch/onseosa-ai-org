import { useState, useEffect, useCallback } from 'react';
import { Send, RefreshCw, Circle, CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';
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

const AGENT_STATUS: Record<string, string> = {
  idle: 'text-slate-500',
  running: 'text-cyan-400',
  error: 'text-red-400',
  paused: 'text-amber-400',
};

export function PaperClipWidget() {
  const [connected, setConnected] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [agents, setAgents] = useState<PaperClipAgent[]>([]);
  const [issues, setIssues] = useState<PaperClipIssue[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'issues' | 'agents'>('issues');

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
    const interval = setInterval(refresh, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [refresh]);

  const handleSubmit = async () => {
    if (!input.trim() || !companyId) return;
    setLoading(true);
    try {
      // Find CEO agent
      const ceo = agents.find(a => a.role === 'ceo');
      await createIssue(companyId, {
        title: input.trim(),
        assigneeAgentId: ceo?.id,
      });
      setInput('');
      await refresh();
    } catch (e) {
      console.error('Issue creation failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const liveCount = issues.filter(i => i.status === 'in_progress').length;
  const agentRunning = agents.filter(a => a.status === 'running').length;

  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
          <span className="text-sm font-semibold text-slate-200">ONSEOSA</span>
          <span className="text-xs text-slate-500">Paper Clip</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {agents.length} engines{liveCount > 0 && ` · ${liveCount} live`}
          </span>
          <button onClick={refresh} className="text-slate-500 hover:text-slate-300 transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Quick Issue Input */}
      <div className="px-4 py-3 border-b border-slate-700/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Issue to CEO... (e.g. 로파이 앨범 만들어줘)"
            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-600/30 disabled:opacity-30 transition-all"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700/30">
        <button
          onClick={() => setTab('issues')}
          className={`flex-1 px-4 py-2 text-xs font-medium transition-colors ${
            tab === 'issues' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Issues {issues.length > 0 && `(${issues.length})`}
        </button>
        <button
          onClick={() => setTab('agents')}
          className={`flex-1 px-4 py-2 text-xs font-medium transition-colors ${
            tab === 'agents' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Engines ({agents.length})
        </button>
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto">
        {tab === 'issues' && (
          <div className="divide-y divide-slate-800/50">
            {issues.length === 0 ? (
              <div className="px-4 py-6 text-center text-slate-600 text-sm">No issues yet</div>
            ) : (
              issues.map(issue => {
                const st = STATUS_ICON[issue.status] || STATUS_ICON.todo;
                return (
                  <div key={issue.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex-shrink-0">
                      {issue.status === 'done' && <CheckCircle size={14} className="text-emerald-400" />}
                      {issue.status === 'in_progress' && <Loader2 size={14} className="text-cyan-400 animate-spin" />}
                      {issue.status === 'blocked' && <AlertCircle size={14} className="text-red-400" />}
                      {issue.status === 'todo' && <Circle size={14} className="text-slate-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-300 truncate">{issue.title}</div>
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
        )}

        {tab === 'agents' && (
          <div className="divide-y divide-slate-800/50">
            {agents.map(agent => (
              <div key={agent.id} className="px-4 py-2 flex items-center gap-3 hover:bg-slate-800/30 transition-colors">
                <Circle size={8} className={`flex-shrink-0 fill-current ${AGENT_STATUS[agent.status] || 'text-slate-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-300">{agent.name}</div>
                  <div className="text-[10px] text-slate-600 truncate">{agent.capabilities?.slice(0, 50)}</div>
                </div>
                <span className="text-[10px] text-slate-600">{agent.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-700/30 flex items-center justify-between">
        <span className="text-[10px] text-slate-600">
          {connected ? 'Connected to Paper Clip' : 'Disconnected'}
        </span>
        <span className="text-[10px] text-slate-600">
          {agentRunning > 0 ? `${agentRunning} running` : 'All idle'}
        </span>
      </div>
    </div>
  );
}
