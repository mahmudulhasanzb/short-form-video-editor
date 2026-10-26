import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Video } from "@remotion/media";
import { FullSpeakerProps } from "../types/layout";

/**
 * Full Speaker Layout:
 * - Speaker fills vertical 9:16 frame, centred head-and-shoulders.
 * - Dark background, microphone visible.
 * - Slow push-in scale (frame-based via interpolate).
 * - Background behind lower-third UI darkened and blurred.
 */
export const FullSpeaker: React.FC<FullSpeakerProps> = ({
  children,
  speakerSrc,
  startFrom = 0,
  muted = true,
  pushIn = true,
  pushInScale = 1.06,
  lowerThird,
  darkenLowerThird = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Frame-based slow push-in animation (no CSS transitions!)
  const scale = pushIn
    ? interpolate(frame, [0, durationInFrames], [1.0, pushInScale], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1.0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1528", overflow: "hidden" }}>
      {/* Scaled Speaker Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: "center 35%", // Scales into speaker face/eyes
        }}
      >
        {speakerSrc ? (
          <Video
            src={speakerSrc}
            trimBefore={startFrom}
            muted={muted}
            objectFit="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          children || (
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
                fontSize: 32,
              }}
            >
              [Full Speaker Video Source]
            </AbsoluteFill>
          )
        )}
      </div>

      {/* Lower-third darkened and blurred backdrop for captions & UI */}
      {darkenLowerThird && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "46%",
            background:
              "linear-gradient(to top, rgba(11, 21, 40, 0.94) 0%, rgba(11, 21, 40, 0.75) 55%, rgba(11, 21, 40, 0) 100%)",
            backdropFilter: "blur(4px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Lower-third UI & Caption container (chest level, never covering eyes) */}
      {lowerThird && (
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            left: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 60px",
            boxSizing: "border-box",
            zIndex: 10,
          }}
        >
          {lowerThird}
        </div>
      )}
    </AbsoluteFill>
  );
};
