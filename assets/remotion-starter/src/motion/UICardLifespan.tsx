import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface UICardLifespanProps {
  children: React.ReactNode;
  /** Start frame relative to current scene Sequence (default: 0) */
  startFrame?: number;
  /** End frame relative to current scene Sequence (default: durationInFrames) */
  endFrame?: number;
  style?: React.CSSProperties;
}

/**
 * UI Card Lifespan & Smooth Motion Component:
 * - Cards live only while their spoken topic is active.
 * - Enters with Apple-style soft spring ease-out (translateY +24px->0, opacity 0->1, blur 6px->0, scale 0.94->1.0).
 * - Exits over ~0.3s (9 frames) before endFrame (opacity 1->0, scale 1.0->0.94, blur 0->6px, translateY 0->+12px).
 * - Disappears completely outside [startFrame, endFrame], leaving canvas clean.
 */
export const UICardLifespan: React.FC<UICardLifespanProps> = ({
  children,
  startFrame = 0,
  endFrame,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const effectiveEndFrame = endFrame !== undefined ? endFrame : durationInFrames;

  // 1. Outside active lifespan window -> completely hidden
  if (frame < startFrame || frame > effectiveEndFrame) {
    return null;
  }

  // 2. Smooth entrance spring over ~0.3s (9 frames)
  const enterSpring = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 110,
      mass: 0.7,
    },
  });

  const enterTranslateY = interpolate(enterSpring, [0, 1], [24, 0]);
  const enterOpacity = interpolate(enterSpring, [0, 0.7], [0, 1], {
    extrapolateRight: "clamp",
  });
  const enterBlur = interpolate(enterSpring, [0, 1], [6, 0]);
  const enterScale = interpolate(enterSpring, [0, 1], [0.94, 1.0]);

  // 3. Smooth exit over ~0.3s (9 frames)
  const EXIT_FRAMES = 9;
  const isExiting = frame >= effectiveEndFrame - EXIT_FRAMES;
  const exitProgress = isExiting
    ? interpolate(frame, [effectiveEndFrame - EXIT_FRAMES, effectiveEndFrame], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitScale = interpolate(exitProgress, [0, 1], [1.0, 0.94]);
  const exitBlur = interpolate(exitProgress, [0, 1], [0, 6]);
  const exitTranslateY = interpolate(exitProgress, [0, 1], [0, 12]);

  const currentOpacity = isExiting ? exitOpacity : enterOpacity;
  const currentScale = isExiting ? exitScale : enterScale;
  const currentBlur = isExiting ? exitBlur : enterBlur;
  const currentTranslateY = isExiting ? exitTranslateY : enterTranslateY;

  return (
    <div
      style={{
        transform: `translateY(${currentTranslateY}px) scale(${currentScale})`,
        opacity: currentOpacity,
        filter: currentBlur > 0.1 ? `blur(${currentBlur}px)` : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
