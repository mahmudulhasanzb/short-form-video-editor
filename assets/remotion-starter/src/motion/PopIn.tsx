import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export interface PopInProps {
  children: React.ReactNode;
  /** Frame at which pop begins (default: 0) */
  startFrame?: number;
  /** Spring stiffness (default: 130) */
  stiffness?: number;
  /** Spring damping (default: 14) */
  damping?: number;
  /** Mass (default: 0.8) */
  mass?: number;
  style?: React.CSSProperties;
}

/**
 * Frame-based Pop-In Motion Component:
 * - Uses spring() physics for crisp pop entry with subtle overshoot.
 * - ZERO CSS transitions or Tailwind classes.
 */
export const PopIn: React.FC<PopInProps> = ({
  children,
  startFrame = 0,
  stiffness = 130,
  damping = 14,
  mass = 0.8,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      stiffness,
      damping,
      mass,
    },
  });

  return (
    <div
      style={{
        transform: `scale(${progress})`,
        opacity: Math.min(1, progress * 1.5),
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
