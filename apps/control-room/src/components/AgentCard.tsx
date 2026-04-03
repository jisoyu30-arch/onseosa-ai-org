import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { Shield, BarChart3, Lightbulb, Pen, Image, Save } from 'lucide-react';
import { EngineInfo, ENGINE_ACCENT, STATUS_LABEL } from '../types';

interface AgentCardProps {
  engine: EngineInfo;
  onClick?: () => void;
}

const LOTTIE_ENGINES = new Set(['arko', 'noah', 'eden', 'ria', 'luka']);

const ICON_MAP: Record<string, typeof Shield> = {
  arko: Shield, noah: BarChart3, eden: Lightbulb,
  ria: Pen, mika: Image, luka: Save,
};

export function AgentCard({ engine, onClick }: AgentCardProps) {
  const lottieRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const hasLottie = LOTTIE_ENGINES.has(engine.name);
  const accent = ENGINE_ACCENT[engine.name] || ENGINE_ACCENT.arko;
  const Icon = ICON_MAP[engine.name];
  const isWorking = engine.status === 'working';

  useEffect(() => {
    if (!hasLottie || !lottieRef.current) return;
    const anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: `/chars/${engine.name}.json`,
    });
    animRef.current = anim;
    anim.setSpeed(0.65);
    return () => anim.destroy();
  }, [engine.name, hasLottie]);

  useEffect(() => {
    if (!animRef.current) return;
    animRef.current.setSpeed(isWorking ? 1.8 : 0.65);
  }, [isWorking]);

  return (
    <div
      onClick={onClick}
      className="card-hover cursor-pointer select-none"
      style={{
        '--glow-color': accent.glow,
      } as React.CSSProperties}
    >
      <div
        className={`
          relative rounded-2xl p-4 flex flex-col items-center gap-2
          border transition-all duration-300
          ${isWorking
            ? `glow-pulse border-transparent ${accent.bg}`
            : 'border-slate-700/50 bg-slate-800/60 hover:border-slate-600'}
        `}
        style={isWorking ? { borderColor: accent.color + '40' } : undefined}
      >
        {/* 아이콘 뱃지 — 좌상단 */}
        {Icon && (
          <div className={`absolute top-2.5 left-2.5 ${accent.text} opacity-60`}>
            <Icon size={14} strokeWidth={2} />
          </div>
        )}

        {/* 상태 도트 — 우상단 */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${isWorking ? 'animate-pulse' : ''}`}
            style={{ backgroundColor: isWorking ? accent.color : '#475569' }}
          />
        </div>

        {/* 캐릭터 영역 */}
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-900/50 flex items-center justify-center">
          {hasLottie ? (
            <div ref={lottieRef} className="w-full h-full" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              {Icon && <Icon size={32} className={accent.text} strokeWidth={1.5} />}
              <span className={`text-lg font-bold ${accent.text}`}>
                {engine.label.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* 이름 + 부서 */}
        <div className="w-full text-center">
          <h3 className="text-sm font-bold text-white leading-tight">{engine.label}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{engine.department}</p>
        </div>

        {/* 현재 작업 */}
        {engine.currentTask && (
          <p className={`text-[10px] truncate w-full text-center ${accent.text}`}>
            {engine.currentTask}
          </p>
        )}

        {/* 상태 뱃지 */}
        <span
          className={`
            text-[10px] px-2.5 py-0.5 rounded-full font-medium tracking-wide
            ${isWorking ? accent.bg + ' ' + accent.text : 'bg-slate-700/50 text-slate-500'}
          `}
        >
          {STATUS_LABEL[engine.status]}
        </span>
      </div>
    </div>
  );
}
