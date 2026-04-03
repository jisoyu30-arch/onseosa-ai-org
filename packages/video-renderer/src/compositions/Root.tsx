import { registerRoot, Composition } from 'remotion';
import { PlaylistLoop } from './PlaylistLoop';
import type { PlaylistLoopProps } from './PlaylistLoop';

function RemotionRoot() {
  return (
    <>
      <Composition
        id="PlaylistLoop"
        component={PlaylistLoop}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          coverImageSrc: '',
          title: '플레이리스트',
          trackList: ['Track 1', 'Track 2', 'Track 3'],
          mood: 'chill',
          channelName: 'ONS Studio',
        } satisfies PlaylistLoopProps}
      />
    </>
  );
}

registerRoot(RemotionRoot);
