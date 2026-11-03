export type VisualElementMotion = {
  enter: "fade" | "rise" | "slide-left" | "slide-right" | "scale" | "pop" | "none";
  exit: "fade" | "drop" | "none";
  delayFrames: number;
  durationFrames: number;
};

export type VisualElementMotionStyle = {
  opacity: number;
  transform: string;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeOut = (value: number) => 1 - Math.pow(1 - clamp01(value), 3);
const easeIn = (value: number) => Math.pow(clamp01(value), 3);

/** Deterministic per-element entrance/exit motion; frame is scene-relative. */
export function getVisualElementMotionStyle(
  frame: number,
  sceneDurationFrames: number,
  rotation: number,
  motion?: VisualElementMotion,
): VisualElementMotionStyle {
  const config = motion ?? {
    enter: "none" as const,
    exit: "none" as const,
    delayFrames: 0,
    durationFrames: 12,
  };
  const duration = Math.max(1, config.durationFrames);
  const entranceProgress = easeOut((frame - config.delayFrames) / duration);
  const exitStart = Math.max(config.delayFrames + duration, sceneDurationFrames - duration);
  const exitProgress = config.exit === "none"
    ? 0
    : easeIn((frame - exitStart) / duration);

  let opacity = config.enter === "none" ? 1 : entranceProgress;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;

  switch (config.enter) {
    case "rise": translateY = 28 * (1 - entranceProgress); break;
    case "slide-left": translateX = -32 * (1 - entranceProgress); break;
    case "slide-right": translateX = 32 * (1 - entranceProgress); break;
    case "scale": scale = 0.92 + 0.08 * entranceProgress; break;
    case "pop": scale = 0.82 + 0.18 * entranceProgress; break;
    case "fade":
    case "none": break;
  }

  if (config.exit === "fade") opacity *= 1 - exitProgress;
  if (config.exit === "drop") {
    translateY += 24 * exitProgress;
    opacity *= 1 - exitProgress;
  }

  return {
    opacity,
    transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
  };
}
