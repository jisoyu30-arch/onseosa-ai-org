import { useState, useRef, useEffect } from 'react';
import { runSingleEngine, runPipeline } from '../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'arko';
  content: string;
  timestamp: number;
}

interface ArkoChatProps {
  onPipelineStart?: () => void;
  onResult?: (result: unknown) => void;
}

export function ArkoChat({ onPipelineStart, onResult }: ArkoChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<'chat' | 'searching' | 'pipeline' | 'hold'>('chat');
  const [heldDomain, setHeldDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [gatheredContext, setGatheredContext] = useState<Record<string, unknown>>({});
  const [pipelineDone, setPipelineDone] = useState(false); // 파이프라인 완료 후 새 작업 유도
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`clarify_${Date.now()}`);

  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const addMessage = (role: 'user' | 'arko', content: string) => {
    setMessages(prev => [...prev, {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      role,
      content,
      timestamp: Date.now(),
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading || phase === 'pipeline') return;
    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setLoading(true);

    const newHistory = [...conversationHistory, { role: 'user', content: userMessage }];
    setConversationHistory(newHistory);

    try {
      const res = await runSingleEngine({
        projectId: sessionId.current,
        projectName: 'clarify-session',
        projectType: 'unknown',
        taskType: 'clarify',
        instruction: userMessage,
        context: {
          conversationHistory: conversationHistory,
          pastWorkResults: gatheredContext.pastWorkResults || undefined,
        },
      });

      const data = res.output?.data || {};
      const arkoMessage = (data.message as string) || '...';

      addMessage('arko', arkoMessage);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: arkoMessage }]);

      if (data.gatheredContext) {
        setGatheredContext(prev => ({ ...prev, ...(data.gatheredContext as Record<string, unknown>) }));
      }
      if (data.pastWorkResults) {
        setGatheredContext(prev => ({ ...prev, pastWorkResults: data.pastWorkResults }));
      }

      // action 처리
      if (data.action === 'hold') {
        // 준비중 도메인 — 파이프라인 실행 금지, 리다이렉트 안내
        setPhase('hold');
        setHeldDomain((data.requestedDomain as string) || null);
        // phase를 chat으로 복귀시켜 계속 대화 가능하게
        setTimeout(() => setPhase('chat'), 100);
      } else if (data.action === 'search') {
        setPhase('searching');
        // 검색은 백엔드에서 이미 처리됨, 결과가 data에 포함
        setPhase('chat');
      } else if (data.action === 'ready') {
        // 파이프라인 실행
        setPhase('pipeline');
        onPipelineStart?.();

        try {
          const pipelineRes = await runPipeline({
            projectName: (data.gatheredContext as Record<string, unknown>)?.details as string || userMessage.slice(0, 30),
            projectType: (data.projectType as string) || 'playlist',
            goal: (data.enrichedInstruction as string) || userMessage,
            enrichedContext: {
              ...gatheredContext,
              ...(data.gatheredContext as Record<string, unknown> || {}),
              // 아르코 실행 브리프 — 하위 엔진이 원문 없이 이것만 사용
              executionBrief: data.executionBrief || null,
            },
          });

          onResult?.(pipelineRes);
          if (pipelineRes.ok) {
            // luka 결과에서 노션 URL 추출
            const lukaData = (pipelineRes.results as Record<string, unknown>)?.luka as Record<string, unknown> | undefined;
            const notionUrl = (lukaData?.data as Record<string, unknown>)?.saved_paths
              ? ((lukaData?.data as Record<string, unknown>)?.saved_paths as Record<string, unknown>)?.notion as string | undefined
              : undefined;
            addMessage('arko', notionUrl
              ? `✅ 파이프라인 완료! 노션에 저장됐어요.\n\n🔗 ${notionUrl}`
              : `✅ 파이프라인 완료! 결과가 노션에 저장되었어요.`
            );
          } else {
            addMessage('arko', `⚠️ 파이프라인 종료: ${pipelineRes.error || '결과를 확인해주세요.'}`);
          }
          // 파이프라인 완료 후 세션 초기화 — 후속 입력이 새 작업으로 처리되도록
          setConversationHistory([]);
          setGatheredContext({});
          sessionId.current = `clarify_${Date.now()}`;
          setPipelineDone(true);
        } catch (pipelineErr) {
          addMessage('arko', `파이프라인 오류: ${pipelineErr instanceof Error ? pipelineErr.message : '알 수 없는 오류'}`);
        } finally {
          setPhase('chat');
        }
      }
    } catch (err) {
      addMessage('arko', `오류가 발생했어요: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-blue-600 mb-6 flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <span className="text-blue-400 text-lg font-bold">&#x1F537; 아르코</span>
        {phase === 'pipeline' && (
          <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs animate-pulse">
            파이프라인 실행 중
          </span>
        )}
        {phase === 'searching' && (
          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-xs animate-pulse">
            과거 작업 검색 중
          </span>
        )}
        {phase === 'hold' && (
          <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full text-xs">
            {heldDomain} 준비중
          </span>
        )}
      </div>

      {/* 채팅 영역 */}
      <div ref={chatContainerRef} className="px-5 pb-3 h-64 overflow-y-auto flex flex-col gap-2">
        {messages.length === 0 ? (
          <p className="text-slate-500 text-sm mt-4">무엇을 만들까요? 아르코에게 말해주세요.</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-400 rounded-lg px-3 py-2 text-sm animate-pulse">
              생각 중...
            </div>
          </div>
        )}
      </div>

      {/* 파이프라인 완료 후 — 새 작업 시작 버튼 */}
      {pipelineDone && phase === 'chat' && (
        <div className="px-5 pb-2 flex gap-2 items-center">
          <span className="text-slate-500 text-xs">다음 작업:</span>
          {['음악 작업하기', '웹소설 쓰기', '숏폼 만들기'].map(label => (
            <button
              key={label}
              onClick={() => {
                setPipelineDone(false);
                setInput(label);
              }}
              className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-xs px-3 py-1.5 rounded-full border border-blue-600/50 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* hold 상태: LIVE 도메인 퀵 리플라이 */}
      {heldDomain && phase === 'chat' && (
        <div className="px-5 pb-2 flex gap-2">
          <span className="text-slate-500 text-xs self-center">LIVE 도메인:</span>
          {['음악 작업하기', '웹소설 쓰기', '숏폼 만들기'].map(label => (
            <button
              key={label}
              onClick={() => {
                setHeldDomain(null);
                setInput(label);
              }}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-1.5 rounded-full border border-slate-600 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* 입력 영역 */}
      <div className="px-5 pb-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={phase === 'pipeline' ? '파이프라인 실행 중...' : '메시지를 입력하세요'}
            disabled={loading || phase === 'pipeline'}
            className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim() || phase === 'pipeline'}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-3 px-5 rounded-lg transition-colors text-sm"
          >
            &#x27A4;
          </button>
        </div>
      </div>
    </div>
  );
}
