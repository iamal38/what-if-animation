import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import {
  S1, S2, S3, S4, S5, S6, S7, S8, S8B, S9, S9B,
  S10, S11, S11B, S12, S12B, S13, S14, S15, S15B,
  S16, S17, S18,
} from './shots';

export const multiplayerDreams = defineEpisode('MultiplayerDreams', {
  width: 1080,
  height: 1920,
  timeline: timeline as Timeline,
  shots: {
    S1, S2, S3, S4, S5, S6, S7, S8, S8B, S9, S9B,
    S10, S11, S11B, S12, S12B, S13, S14, S15, S15B,
    S16, S17, S18,
  },
});
