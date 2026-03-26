import { useState } from 'react';
import { runPipeline } from '../services/api';

interface ArkoInputProps {
  onResult?: (result: unknown) => void;
}

export function ArkoInput({ onResult }: ArkoInputProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || loading) return;
    setLoading(true);
    try {
      const res = await runPipeline({
        projectName: message.slice(0, 30),
        projectType: 'playlist',
        goal: message,
      });
      onResult?.(res);
    } catch (err) {
      onResult?.({ error: err instanceof Error ? err.message : '실행 실패' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-blue-600 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-400 text-lg font-bold">&#x1F537; 서 본부장</span>
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="오늘 뭐 만들까요?"
          disabled={loading}
          className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !message.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? '실행 중...' : '실행'}
        </button>
      </div>
    </div>
  );
}
