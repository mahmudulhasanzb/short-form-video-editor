import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { BeginnerProSliderProps } from "../types/ui-cards";
import { FONT_FAMILIES } from "../theme/fonts";

/**
 * Beginner-to-Professional Slider UI Card per visual-direction-draft.md Section 5 & Bug Fix 4 & 5:
 * - Dynamic frame-based animation: track fill and thumb slide smoothly from 0 to target position over ~1s.
 * - Zero invented percentages or stats.
 * - Mouse cursor tracks the knob.
 */
export const BeginnerProSlider: React.FC<BeginnerProSliderProps> = ({
  leftLabel = "",
  rightLabel = "",
  progressPercent = 0,
  showCursor = true,
  gradientStart = "#60A5FA",
  gradientEnd = "#2563EB",
  style,
}) => {
  const frame = useCurrentFrame();

  // Smooth frame-based slide over ~32 frames (~1.05s) starting at frame 6
  const animatedProgress = interpolate(frame, [6, 38], [0, progressPercent], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        width: 540,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 20,
        padding: "24px 32px 28px 32px",
        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Range Labels from Script */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: FONT_FAMILIES.sans,
          fontSize: 18,
          fontWeight: 700,
          color: "#F8FAFC",
          marginBottom: 18,
        }}
      >
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>

      {/* Slider Track Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 12,
          backgroundColor: "rgba(255, 255, 255, 0.18)",
          borderRadius: 9999,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Filled Blue Gradient Bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${Math.min(100, Math.max(0, animatedProgress))}%`,
            height: "100%",
            borderRadius: 9999,
            background: `linear-gradient(90deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
            boxShadow: `0 0 14px ${gradientStart}80`,
          }}
        />

        {/* Circular Thumb Control Knob */}
        <div
          style={{
            position: "absolute",
            left: `${Math.min(100, Math.max(0, animatedProgress))}%`,
            transform: "translateX(-50%)",
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          {/* Mouse Cursor Pointer Icon */}
          {showCursor && (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: "translate(2px, 3px)",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            >
              <path
                d="M5.5 3.5L11.5 20.5L14.5 13.5L21.5 10.5L5.5 3.5Z"
                fill="#0F172A"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
