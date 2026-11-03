export type CaptionAnimation = "word-pop" | "fade" | "slide" | "none";

export type CaptionAnimationState = {
  opacity: number;
  translateY: number;
  scale: number;
  wordOpacity: number;
};

const progress = (frame: number, duration: number) =>
  Math.max(0, Math.min(1, frame / Math.max(1, duration)));

export const getCaptionAnimationState = (
  animation: CaptionAnimation,
  frame: number,
  chunkDuration: number,
  wordIndex = 0,
): CaptionAnimationState => {
  const entrance = Math.max(1, Math.min(8, chunkDuration));
  const fadeProgress = progress(frame, entrance);
  const wordFrame = Math.max(0, frame - wordIndex * 2);

  return {
    opacity: animation === "fade" ? fadeProgress : 1,
    translateY: animation === "slide" ? 14 * (1 - fadeProgress) : 0,
    scale: animation === "word-pop"
      ? 0.72 + 0.28 * progress(wordFrame, 4)
      : 1,
    wordOpacity: animation === "word-pop"
      ? progress(wordFrame, 3)
      : 1,
  };
};
