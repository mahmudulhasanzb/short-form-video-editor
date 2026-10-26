import React from "react";
import { GlossyPlayCardProps } from "../types/ui-cards";

/**
 * Glossy Play Card per visual-direction-draft.md Section 3 & 5:
 * - Glossy white rounded container with soft shadow.
 * - Glossy bright blue squircle containing white play triangle.
 * - Light-grey skeleton placeholder bars.
 */
export const GlossyPlayCard: React.FC<GlossyPlayCardProps> = ({
  buttonGradientStart = "#60A5FA",
  buttonGradientEnd = "#2563EB",
  showSkeletonBars = true,
  width = 300,
  height = 300,
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        borderRadius: 44,
        boxShadow:
          "0 25px 60px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.9)",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Glossy Bright Blue Play Squircle */}
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 36,
          background: `linear-gradient(135deg, ${buttonGradientStart} 0%, ${buttonGradientEnd} 100%)`,
          boxShadow: `0 14px 28px ${buttonGradientEnd}60, inset 0 2px 4px rgba(255, 255, 255, 0.45)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Solid White Play Triangle */}
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 5V19L19 12L8 5Z"
            fill="#FFFFFF"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
          />
        </svg>
      </div>

      {/* Skeleton Loading Bars */}
      {showSkeletonBars && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <div
            style={{
              width: 160,
              height: 10,
              borderRadius: 9999,
              backgroundColor: "#E2E8F0",
            }}
          />
          <div
            style={{
              width: 90,
              height: 8,
              borderRadius: 9999,
              backgroundColor: "#F1F5F9",
            }}
          />
        </div>
      )}
    </div>
  );
};
