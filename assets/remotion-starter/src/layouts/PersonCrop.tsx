import React from "react";
import { AbsoluteFill } from "remotion";
import { Video } from "@remotion/media";
import { PersonCropMeasurements } from "../types/layout";

export interface PersonCropHelperProps {
  src?: string;
  startFrom?: number;
  muted?: boolean;
  children?: React.ReactNode;
  measurements?: PersonCropMeasurements;
  containerHeight?: number;
  style?: React.CSSProperties;
  /**
   * Phase 3b: sideFill default off. When off, the speaker fills the full width,
   * no blurred side strips. When on, blurred side fill is used only to fill gaps
   * left by a cropped face in Split.
   */
  sideFill?: boolean;
}

export const PersonCropHelper: React.FC<PersonCropHelperProps> = ({
  src,
  startFrom = 0,
  muted = true,
  children,
  measurements,
  containerHeight = 960,
  style,
  sideFill = false,
}) => {
  const { headTopPercent = 0, chinPercent = 0 } = measurements || {};
  const faceSpan = Math.max(0.45, (chinPercent - headTopPercent) / 100);
  const targetFaceHeight = containerHeight * 0.81;
  const videoHeight = Math.round(targetFaceHeight / faceSpan);
  const videoWidth = sideFill ? Math.round(videoHeight * (720 / 1280)) : 1080;
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
          {sideFill ? (
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
                  transform: "scale(1.12)",
                }}
              />
            </div>
          ) : null}
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
