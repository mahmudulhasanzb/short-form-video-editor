import React from "react";
import { useCurrentFrame } from "remotion";
import { LoadingSegmentsCardProps } from "../types/ui-cards";
import { FONT_FAMILIES } from "../theme/fonts";

export interface ExtendedLoadingSegmentsCardProps extends LoadingSegmentsCardProps {
  label?: string;
  segments?: string[];
  accentColor?: string;
}

/**
 * Loading Segments Card per visual-direction-draft.md Section 3 & 5 & Bug Fix 4 & 5:
 * - 3 progress segments that light up in order: "Text Posts", "Static Images", "Video Clips".
 * - Clear, non-button horizontal progress segments with smooth fill.
 * - Zero invented buttons or statistics.
 */
export const LoadingSegmentsCard: React.FC<ExtendedLoadingSegmentsCardProps> = ({
  headerLabel = "",
  counterText,
  segments = [],
  segmentColor = "#10B981",
  accentColor,
  label = "",
  width = 540,
  style,
}) => {
  const frame = useCurrentFrame();
  const activeColor = accentColor || segmentColor;
  const activeHeader = label || headerLabel;

  // Segments light up sequentially across scene
  // Segment 0: active at frame 10
  // Segment 1: active at frame 35
  // Segment 2: active at frame 60
  const isSeg0Active = frame >= 10;
  const isSeg1Active = frame >= 35;
  const isSeg2Active = frame >= 60;
  const activeStates = [isSeg0Active, isSeg1Active, isSeg2Active];

  return (
    <div
      style={{
        width,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        ...style,
      }}
    >
      {/* Header Metadata Label */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: FONT_FAMILIES.sans,
          padding: "0 8px",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#64748B",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {activeHeader}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: activeColor,
            backgroundColor: `${activeColor}15`,
            padding: "3px 10px",
            borderRadius: 9999,
          }}
        >
          AUTONOMOUS
        </span>
      </div>

      {/* Rounded Card Container */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          boxShadow: "0 16px 36px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          boxSizing: "border-box",
        }}
      >
        {/* Segmented Loading Bars */}
        <div style={{ display: "flex", gap: 10, width: "100%" }}>
          {segments.map((segLabel, idx) => {
            const isLit = activeStates[idx % activeStates.length];
            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    height: 10,
                    borderRadius: 9999,
                    backgroundColor: isLit ? activeColor : "#E2E8F0",
                    boxShadow: isLit ? `0 0 10px ${activeColor}80` : "none",
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_FAMILIES.sans,
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: "center",
                    color: isLit ? "#0F172A" : "#94A3B8",
                  }}
                >
                  {segLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
