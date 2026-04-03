import { useState, useRef, useEffect } from 'react';
import { runSingleEngine } from '../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'secretary';
  content: string;
  eventLink?: string;
}

export function SecretaryChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 페이지 스크롤 없이 채팅 내부만 스크롤
  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const addMessage = (role: 'user' | 'secretary', content: string, eventLink?: string) => {
    setMessages(prev => [...prev, {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      role,
      content,
      eventLink,
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setLoading(true);

    try {
      const res = await runSingleEngine({
        projectId: `secretary_${Date.now()}`,
        projectName: 'secretary-session',
        projectType: 'assist',
        taskType: 'assist',
        instruction: userMessage,
      });

      const data = res.output?.data || {};
      addMessage('secretary', (data.reply as string) || '...', (data.eventLink as string) || undefined);
    } catch (err) {
      addMessage('secretary', `오류: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-purple-400 font-bold">💼 김비서</span>
          <span className="text-slate-500 text-xs">일정 관리 · 브리핑</span>
        </div>
        {/* 빠른 명령 버튼 */}
        <div className="flex flex-wrap gap-1 mt-2">
          {['오늘 브리핑', '금주 스케줄', '이번달', '올해'].map(q => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-0.5 rounded-full transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 채팅 영역 — 내부 스크롤만 */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
      >
        {messages.length === 0 ? (
          <p className="text-slate-500 text-xs mt-2">일정 추가, 브리핑 등 말씀해주세요.</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] rounded-lg px-3 py-2 text-xs whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-purple-700 text-white' : 'bg-slate-700 text-slate-200'
              }`}>
                {msg.content}
                {msg.eventLink && (
                  <a href={msg.eventLink} target="_blank" rel="noopener noreferrer"
                    className="block mt-1 text-purple-300 underline">
                    캘린더에서 보기 →
                  </a>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-400 rounded-lg px-3 py-2 text-xs animate-pulse">처리 중...</div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="px-3 py-3 border-t border-slate-700 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="일정을 말씀해주세요"
            disabled={loading}
            className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500 focus:outline-none disabled:opacity-50 text-xs"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-purple-700 hover:bg-purple-800 disabled:bg-slate-600 text-white py-2 px-3 rounded-lg transition-colors text-xs"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
