import React from "react";
import { AbsoluteFill } from "remotion";
import { Video } from "@remotion/media";
import { PersonCropMeasurements } from "../types/layout";

export interface PersonCropHelperProps {
  /** Video or image source for the speaker */
  src?: string;
  /** Start frame in source video */
  startFrom?: number;
  /** Whether video audio is muted */
  muted?: boolean;
  /** Custom element if not using direct src */
  children?: React.ReactNode;
  /** Measurements from original talking-head frame */
  measurements?: PersonCropMeasurements;
  /** Custom height for Layer B container (defaults to 50% of frame, 960px on 1080x1920) */
  containerHeight?: number;
  /** Container style overrides */
  style?: React.CSSProperties;
}

/**
 * Person Crop Helper per visual-direction-draft.md Section 3 & User Fix Specification:
 * Ensures the FULL face (head top, eyes, mouth, chin) and shoulders are completely visible
 * in the bottom 50% Layer B without chin or mouth clipping.
 *
 * Sizing math:
 * - Uses exact speaker facial landmarks: headTop ~5-6%, eyeLine ~34-35%, chin ~64%.
 * - Dynamically scales foreground video to ~1350-1400px height so the full head-to-chin
 *   span (~780px) comfortably fits the 960px container with headroom and bottom chin clearance.
 * - Blurred video background fills 1080x960 Layer B seamlessly on the left and right.
 * - Person layer stays 100% clean: person only, zero captions, zero badges, zero overlays.
 */
export const PersonCropHelper: React.FC<PersonCropHelperProps> = ({
  src,
  startFrom = 0,
  muted = true,
  children,
  measurements,
  containerHeight = 960,
  style,
}) => {
  const { headTopPercent = 0, chinPercent = 0 } = measurements || {};

  // Face span as a percentage of source height
  const faceSpan = Math.max(0.45, (chinPercent - headTopPercent) / 100);

  // Target face height within Layer B: ~780px out of 960px leaves generous margins
  const targetFaceHeight = containerHeight * 0.81;
  const videoHeight = Math.round(targetFaceHeight / faceSpan); // ~1320 - 1380px
  const videoWidth = Math.round(videoHeight * (720 / 1280)); // ~740 - 780px

  // Leave ~3.5% headroom (approx 34px below the split line)
  const targetHeadTop = Math.round(containerHeight * 0.035);
  const yOffset = Math.round(targetHeadTop - (headTopPercent / 100) * videoHeight);

  return (
    <div
      style={{
        width: "100%",
        height: containerHeight,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#0B1528",
        ...style,
      }}
    >
      {src ? (
        <>
          {/* Synchronized blurred background video to seamlessly fill 1080px width */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            <Video
              src={src}
              trimBefore={startFrom}
              muted={muted}
              objectFit="cover"
              style={{
                width: "100%",
                height: "100%",
                filter: "blur(28px) brightness(0.92)",
                transform: "scale(1.12)", // Prevent edge bleed from blur
              }}
            />
          </div>

          {/* Foreground calibrated person video: 100% mouth & chin clearance */}
          <div
            style={{
              position: "absolute",
              top: yOffset,
              left: "50%",
              transform: "translateX(-50%)",
              width: videoWidth,
              height: videoHeight,
              zIndex: 2,
            }}
          >
            <Video
              src={src}
              trimBefore={startFrom}
              muted={muted}
              objectFit="cover"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </>
      ) : (
        children || (
          <AbsoluteFill
            style={{
              backgroundColor: "#1E293B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94A3B8",
              fontSize: 28,
            }}
          >
            [Speaker Video Placeholder]
          </AbsoluteFill>
        )
      )}
    </div>
  );
};
