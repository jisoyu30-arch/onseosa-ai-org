import { Shield, BarChart3, Lightbulb, Pen, Image, Save, Check } from 'lucide-react';
import { EngineInfo, ENGINE_ACCENT } from '../types';

interface TaskFlowProps {
  engines: EngineInfo[];
}

const FLOW_STEPS = [
  { name: 'noah', label: '분석', Icon: BarChart3 },
  { name: 'eden', label: '기획', Icon: Lightbulb },
  { name: 'ria',  label: '창작', Icon: Pen },
  { name: 'arko', label: '검수', Icon: Shield },
  { name: 'mika', label: '미디어', Icon: Image },
  { name: 'luka', label: '기록', Icon: Save },
];

type StepState = 'idle' | 'active' | 'done';

function getStepState(engines: EngineInfo[], name: string, index: number): StepState {
  const engine = engines.find(e => e.name === name);
  if (engine?.status === 'working') return 'active';
  // 현재 활성 스텝보다 이전이면 done 처리
  const activeIdx = FLOW_STEPS.findIndex(s => {
    const e = engines.find(eng => eng.name === s.name);
    return e?.status === 'working';
  });
  if (activeIdx >= 0 && index < activeIdx) return 'done';
  return 'idle';
}

export function TaskFlow({ engines }: TaskFlowProps) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50">
      <div className="flex items-center gap-1 mb-4">
        <h2 className="text-sm font-bold text-slate-300 tracking-wide uppercase">Pipeline</h2>
      </div>

      <div className="flex items-center justify-between overflow-x-auto px-2">
        {FLOW_STEPS.map((step, i) => {
          const state = getStepState(engines, step.name, i);
          const accent = ENGINE_ACCENT[step.name] || ENGINE_ACCENT.arko;
          const engine = engines.find(e => e.name === step.name);

          return (
            <div key={step.name} className="flex items-center flex-1 min-w-0">
              {/* 스텝 노드 */}
              <div className="flex flex-col items-center min-w-[72px]">
                <div
                  className={`
                    w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300
                    ${state === 'active'
                      ? `glow-pulse ${accent.bg} border-2`
                      : state === 'done'
                        ? 'step-done bg-green-500/10 border border-green-500/30'
                        : 'bg-slate-800 border border-slate-700/50'}
                  `}
                  style={{
                    '--glow-color': accent.glow,
                    ...(state === 'active' ? { borderColor: accent.color } : {}),
                  } as React.CSSProperties}
                >
                  {state === 'done' ? (
                    <Check size={18} className="text-green-400" strokeWidth={2.5} />
                  ) : (
                    <step.Icon
                      size={18}
                      className={state === 'active' ? accent.text : 'text-slate-500'}
                      strokeWidth={state === 'active' ? 2 : 1.5}
                    />
                  )}
                </div>

                <span className={`
                  text-[11px] mt-1.5 font-medium
                  ${state === 'active' ? accent.text : state === 'done' ? 'text-green-400/70' : 'text-slate-500'}
                `}>
                  {step.label}
                </span>

                {engine?.currentTask && state === 'active' && (
                  <span className={`text-[9px] mt-0.5 truncate max-w-[72px] ${accent.text} opacity-80`}>
                    {engine.currentTask}
                  </span>
                )}
              </div>

              {/* 연결선 */}
              {i < FLOW_STEPS.length - 1 && (
                <div className="flex-1 mx-1 h-px relative min-w-[16px]">
                  <svg width="100%" height="4" className="overflow-visible">
                    <line
                      x1="0" y1="2" x2="100%" y2="2"
                      stroke={state === 'done' ? '#4ade80' : state === 'active' ? accent.color : '#334155'}
                      strokeWidth={state === 'idle' ? 1 : 2}
                      className={state === 'active' ? 'flow-line-active' : ''}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
