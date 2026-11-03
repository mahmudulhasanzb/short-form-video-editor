export type SoundCueTimingInput = {
  sceneStartFrame: number;
  sceneEndFrame: number;
  cueStartFrame: number;
  cueDurationFrames: number;
  volumeDb: number;
};

export type SoundCueTiming = {
  from: number;
  durationInFrames: number;
  volume: number;
};

export const getSoundCueTiming = ({
  sceneStartFrame,
  sceneEndFrame,
  cueStartFrame,
  cueDurationFrames,
  volumeDb,
}: SoundCueTimingInput): SoundCueTiming | null => {
  const sceneDuration = sceneEndFrame - sceneStartFrame;
  const from = cueStartFrame - sceneStartFrame;
  const remaining = sceneDuration - from;
  const durationInFrames = Math.min(cueDurationFrames, remaining);

  if (sceneDuration <= 0 || from < 0 || from >= sceneDuration || durationInFrames <= 0) {
    return null;
  }

  return {
    from,
    durationInFrames,
    volume: Math.pow(10, volumeDb / 20),
  };
};
