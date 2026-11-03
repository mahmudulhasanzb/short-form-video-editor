export function getTimelineFrameFromPosition({
  clientX,
  trackLeft,
  trackWidth,
  durationFrames,
}: {
  clientX: number;
  trackLeft: number;
  trackWidth: number;
  durationFrames: number;
}): number {
  if (durationFrames <= 0) return 0;
  if (trackWidth <= 0) return 0;

  const position = Math.max(0, Math.min(1, (clientX - trackLeft) / trackWidth));
  return Math.min(durationFrames - 1, Math.floor(position * durationFrames));
}
