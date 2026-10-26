import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export interface ZoomOutSnapProps {
  children: React.ReactNode;
  /** Duration of the slow zoom out phase in frames */
  slowZoomDuration: number;
  /** Frame at which the quick snap occurs */
  snapFrame: number;
  /** Duration of the snap transition in frames (default: 4) */
  snapDuration?: number;
  /** Initial scale (default: 1.05) */
  initialScale?: number;
  /** Intermediate scale after slow zoom out (default: 1.0) */
  intermediateScale?: number;
  /** Final snapped scale (default: 0.8) */
  finalScale?: number;
  style?: React.CSSProperties;
}

/**
 * Slow Zoom Out then Snap Component per visual-direction-draft.md Section 4:
 * - Graphics zoom out slowly, then snap quickly to the next scale or layout.
 * - Frame-based via interpolate().
 */
export const ZoomOutSnap: React.FC<ZoomOutSnapProps> = ({
  children,
  slowZoomDuration,
  snapFrame,
  snapDuration = 4,
  initialScale = 1.05,
  intermediateScale = 1.0,
  finalScale = 0.8,
  style,
}) => {
  const frame = useCurrentFrame();

  let scale = initialScale;

  if (frame < snapFrame) {
    // Slow zoom out phase
    scale = interpolate(frame, [0, slowZoomDuration], [initialScale, intermediateScale], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else {
    // Quick snap phase
    scale = interpolate(
      frame,
      [snapFrame, snapFrame + snapDuration],
      [intermediateScale, finalScale],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.2, 0, 0, 1),
      }
    );
  }

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
