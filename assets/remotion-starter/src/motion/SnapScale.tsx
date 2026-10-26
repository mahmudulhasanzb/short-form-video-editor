import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export interface SnapScaleProps {
  children: React.ReactNode;
  /** Frame at which the snap starts (e.g. 15) */
  snapFrame: number;
  /** Initial scale before snap (default: 1.0 = 100%) */
  fromScale?: number;
  /** Target scale after snap (default: 0.75 = 75%) */
  toScale?: number;
  /** Snap duration in frames (default: 5 frames) */
  durationFrames?: number;
  style?: React.CSSProperties;
}

/**
 * Snap Scale Motion Component per visual-direction-draft.md Section 4:
 * - A graphic snaps quickly from one scale to another (e.g. 100% to 75%).
 * - The snap is quick and deliberate (default 5 frames).
 * - ZERO CSS transitions or animations.
 */
export const SnapScale: React.FC<SnapScaleProps> = ({
  children,
  snapFrame,
  fromScale = 1.0,
  toScale = 0.75,
  durationFrames = 5,
  style,
}) => {
  const frame = useCurrentFrame();

  const currentScale = interpolate(
    frame,
    [snapFrame, snapFrame + durationFrames],
    [fromScale, toScale],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0, 0, 1),
    }
  );

  return (
    <div
      style={{
        transform: `scale(${currentScale})`,
        transformOrigin: "center center",
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
