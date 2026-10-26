import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export interface SpeakerPushInProps {
  children: React.ReactNode;
  /** Initial scale (default: 1.0) */
  fromScale?: number;
  /** Max push-in scale (default: 1.06) */
  toScale?: number;
  /** Transform origin (defaults to speaker face at 'center 35%') */
  transformOrigin?: string;
  style?: React.CSSProperties;
}

/**
 * Speaker Push-In Component per visual-direction-draft.md Section 4:
 * - Slow, steady push-in on talking head.
 * - Never a fast jump cut zoom.
 * - Frame-based via interpolate().
 */
export const SpeakerPushIn: React.FC<SpeakerPushInProps> = ({
  children,
  fromScale = 1.0,
  toScale = 1.06,
  transformOrigin = "center 35%",
  style,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [fromScale, toScale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `scale(${scale})`,
        transformOrigin,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
