import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import { EPISODES } from './episodes';
import { CastSheet } from './CastSheet';

// Every episode gets two compositions: <Id> (the film) and <Id>Board (one frame per shot, at its key frame, for the
// storyboard). Cast renders the cast sheet.
//   npx remotion studio src/index.ts --port 3430

export const Root: React.FC = () => {
  return (
    <>
      {EPISODES.map((e) => {
        const width = (e as any).width ?? STUDIO.width;
        const height = (e as any).height ?? STUDIO.height;
        const common = { width, height, fps: STUDIO.fps };
        return (
          <React.Fragment key={e.id}>
            <Composition id={e.id} component={e.Main} durationInFrames={Math.max(1, e.total)} {...common} />
            <Composition id={`${e.id}Board`} component={e.Board} durationInFrames={Math.max(1, e.shotCount)} {...common} />
          </React.Fragment>
        );
      })}
      <Composition id="Cast" component={CastSheet} durationInFrames={1} width={STUDIO.width} height={STUDIO.height} fps={STUDIO.fps} />
    </>
  );
};
