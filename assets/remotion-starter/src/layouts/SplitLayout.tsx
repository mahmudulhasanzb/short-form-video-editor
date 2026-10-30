import React from "react";
import { AbsoluteFill } from "remotion";
import { SplitLayoutProps } from "../types/layout";
import { PersonCropHelper } from "./PersonCrop";

/**
 * 50/50 Split Layout per visual-direction-draft.md Section 3:
 * - Layer A (Top 0%–50%): Warm off-white grid canvas holding all graphics, UI cards,
 *   badges, and talking captions (positioned at the bottom of Layer A above head).
 * - Layer B (Bottom 50%–100%): Clean person layer only. Zero text, zero overlays.
 * - Split line: Clean horizontal split at 50%.
 * - Uses PersonCropHelper to ensure eye line lands at 62%–65% in final frame.
 */
export const SplitLayout: React.FC<SplitLayoutProps> = ({
  topGraphicContent,
  speakerSrc,
  startFrom = 0,
  muted = true,
  bottomPersonContent,
  cropMeasurements,
  canvasVariant = "warm-grid",
  sideFill = false,
}) => {
  const getTopBackgroundStyle = (): React.CSSProperties => {
    switch (canvasVariant) {
      case "plain-white":
        return { backgroundColor: "#FFFFFF" };
      case "white-shadow-grid":
        return {
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          boxShadow: "inset 0 -100px 140px rgba(0,0,0,0.04)",
        };
      case "warm-grid":
      default:
        return {
          backgroundColor: "#F8F7F4",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        };
    }
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* LAYER A: Top Graphic Layer (0% to 50% height) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "50px 40px 24px 40px",
          boxSizing: "border-box",
          zIndex: 2,
          // Phase 3b bottom fade: top canvas fades out over its last ~100px, about 20% of its height.
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
          ...getTopBackgroundStyle(),
        }}
      >
        {/* Soft cast shadow overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.7) 0%, rgba(0,0,0,0.03) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Top Graphic Content (Cards, badges, graphs, and captions above head) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3,
          }}
        >
          {topGraphicContent}
        </div>
      </div>

      {/* Phase 3b: No hard split line. The top canvas itself fades out at its bottom edge,
          over the last 100px, so the split does not look like a hard rectangle cut.
          This is implemented as a mask on the top canvas container in the code below,
          see getTopBackgroundStyle usage, not as a separate opaque band. */}

      {/* LAYER B: Bottom Person Layer (50% to 100% height) - PERSON ONLY */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: "50%",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {bottomPersonContent || (
          <PersonCropHelper
            src={speakerSrc}
            startFrom={startFrom}
            muted={muted}
            measurements={cropMeasurements}
            containerHeight={960}
            sideFill={sideFill}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
