import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, spring, staticFile } from 'remotion';

// coverImageSrc는 staticFile() 경로 (파일명만, e.g. "cover.jpg")

export interface PlaylistLoopProps {
  coverImageSrc: string;       // 커버 이미지 경로 (staticFile 또는 URL)
  title: string;               // 플레이리스트 제목
  trackList: string[];         // 트랙 목록 (최대 6개 표시)
  mood: string;                // 분위기 키워드
  channelName: string;         // 채널명
}

// 씬 타이밍 (30fps, 총 300프레임 = 10초)
const SCENE_1_END = 75;   // 0~2.5초: 커버 줌인 + 타이틀
const SCENE_2_END = 150;  // 2.5~5초: 트랙리스트 스크롤
const SCENE_3_END = 225;  // 5~7.5초: 무드/분위기 텍스트
const SCENE_4_END = 300;  // 7.5~10초: 채널 브랜딩 + CTA

// 씬 1: 커버 이미지 줌인 + 타이틀 오버레이
function Scene1({ frame, coverImageSrc: rawSrc, title }: { frame: number; coverImageSrc: string; title: string }) {
  const coverImageSrc = rawSrc.startsWith('http') ? rawSrc : staticFile(rawSrc);
  const scale = interpolate(frame, [0, SCENE_1_END], [1, 1.15], { extrapolateRight: 'clamp' });
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [20, 40], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0f1a' }}>
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <Img
          src={coverImageSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale})`,
          }}
        />
      </div>
      {/* 그라데이션 오버레이 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(transparent 40%, rgba(10,15,26,0.85) 100%)',
      }} />
      {/* 타이틀 */}
      <div style={{
        position: 'absolute', bottom: 80, left: 60, right: 60,
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
      }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// 씬 2: 트랙리스트 스크롤
function Scene2({ frame, trackList, title }: { frame: number; trackList: string[]; title: string }) {
  const localFrame = frame - SCENE_1_END;
  const tracks = trackList.slice(0, 6);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0f1a', padding: 60 }}>
      <div style={{ fontSize: 18, color: '#64748b', fontWeight: 600, marginBottom: 16, letterSpacing: 2 }}>
        TRACKLIST
      </div>
      <div style={{ fontSize: 28, color: '#fff', fontWeight: 700, marginBottom: 40 }}>
        {title}
      </div>
      {tracks.map((track, i) => {
        const delay = i * 8;
        const opacity = interpolate(localFrame, [delay, delay + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const x = interpolate(localFrame, [delay, delay + 15], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={i} style={{
            fontSize: 24, color: '#e2e8f0', marginBottom: 16,
            opacity, transform: `translateX(${x}px)`,
            display: 'flex', gap: 16, alignItems: 'center',
          }}>
            <span style={{ color: '#64748b', fontWeight: 600, width: 30 }}>{String(i + 1).padStart(2, '0')}</span>
            <span>{track}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// 씬 3: 무드/분위기 텍스트
function Scene3({ frame, mood, title }: { frame: number; mood: string; title: string }) {
  const localFrame = frame - SCENE_2_END;
  const { fps } = useVideoConfig();
  const scale = spring({ frame: localFrame, fps, config: { damping: 20, stiffness: 80 } });
  const moodOpacity = interpolate(localFrame, [15, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0a0f1a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* 배경 그라데이션 원 */}
      <div style={{
        position: 'absolute',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        transform: `scale(${scale})`,
      }} />
      <div style={{
        fontSize: 48, fontWeight: 800, color: '#fff',
        transform: `scale(${scale})`, textAlign: 'center',
      }}>
        {title}
      </div>
      <div style={{
        fontSize: 24, color: '#a78bfa', marginTop: 24,
        opacity: moodOpacity, letterSpacing: 4, fontWeight: 500,
      }}>
        {mood.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
}

// 씬 4: 채널 브랜딩 + CTA
function Scene4({ frame, channelName }: { frame: number; channelName: string }) {
  const localFrame = frame - SCENE_3_END;
  const opacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pulse = interpolate(localFrame, [0, 75], [0.95, 1.05], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0a0f1a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity,
    }}>
      <div style={{
        fontSize: 20, color: '#64748b', fontWeight: 600,
        letterSpacing: 6, marginBottom: 24,
      }}>
        PRESENTED BY
      </div>
      <div style={{
        fontSize: 44, fontWeight: 800, color: '#fff',
        transform: `scale(${pulse})`,
      }}>
        {channelName}
      </div>
      <div style={{
        fontSize: 18, color: '#06b6d4', marginTop: 32,
        fontWeight: 500,
      }}>
        구독 & 좋아요
      </div>
    </AbsoluteFill>
  );
}

// 메인 컴포지션
export function PlaylistLoop({
  coverImageSrc, title, trackList, mood, channelName,
}: PlaylistLoopProps) {
  const frame = useCurrentFrame();

  if (frame < SCENE_1_END) {
    return <Scene1 frame={frame} coverImageSrc={coverImageSrc} title={title} />;
  }
  if (frame < SCENE_2_END) {
    return <Scene2 frame={frame} trackList={trackList} title={title} />;
  }
  if (frame < SCENE_3_END) {
    return <Scene3 frame={frame} mood={mood} title={title} />;
  }
  return <Scene4 frame={frame} channelName={channelName} />;
}
