export type CameraMotion = {
  enabled: boolean;
  type: "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | null;
  intensity: number;
};

export type CameraTransform = {
  scale: number;
  translateX: number;
};

/** Smooth, restrained camera movement shared by preview and final rendering. */
export function getCameraTransform(
  frame: number,
  durationFrames: number,
  motion: CameraMotion,
): CameraTransform {
  if (!motion.enabled || !motion.type || durationFrames <= 1) {
    return { scale: 1, translateX: 0 };
  }

  const progress = Math.max(0, Math.min(1, frame / (durationFrames - 1)));
  // Smoothstep avoids the mechanical constant-speed movement of linear interpolation.
  const eased = progress * progress * (3 - 2 * progress);
  const intensity = Math.max(0, Math.min(1, motion.intensity));

  switch (motion.type) {
    case "zoom-in":
      return { scale: 1 + intensity * 0.12 * eased, translateX: 0 };
    case "zoom-out":
      return { scale: 1 + intensity * 0.12 * (1 - eased), translateX: 0 };
    case "pan-left":
      return { scale: 1, translateX: intensity * 4 * (1 - 2 * eased) };
    case "pan-right":
      return { scale: 1, translateX: intensity * 4 * (2 * eased - 1) };
  }
}
