import React from "react";
import { useCurrentFrame } from "remotion";
import { SoundWaveCardProps } from "../types/ui-cards";
import { FONT_FAMILIES } from "../theme/fonts";

export interface ExtendedSoundWaveCardProps extends SoundWaveCardProps {
  waveColor?: string;
  activeFrequency?: string;
  showThreshold?: boolean;
}

/**
 * Sound Wave Card per visual-direction-draft.md Section 3 & 5 & Bug Fix 4:
 * - Dynamic waveform animation reacting across frames with subtle realistic envelope modulation.
 * - Silence cut threshold indicator.
 */
export const SoundWaveCard: React.FC<ExtendedSoundWaveCardProps> = ({
  title = "",
  statusDotColor = "#3B82F6",
  barCount = 28,
  barColor = "#3B82F6",
  waveColor,
  activeFrequency = "",
  showThreshold = true,
  width = 480,
  height = 160,
  style,
}) => {
  const frame = useCurrentFrame();
  const activeColor = waveColor || barColor;

  // Base envelope heights
  const baseHeights = [
    6, 12, 22, 38, 54, 70, 84, 62, 45, 68, 76, 58, 34, 18, 8, 4,
    4, 4, 14, 28, 48, 64, 78, 52, 32, 18, 10, 6,
  ];

  return (
    <div
      style={{
        width,
        minHeight: height,
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderRadius: 20,
        padding: "18px 24px",
        boxShadow: "0 18px 45px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 12,
        ...style,
      }}
    >
      {/* Header Label and Status Indicator Dot */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: FONT_FAMILIES.sans,
          fontSize: 13,
          fontWeight: 700,
          color: "#0F172A",
          letterSpacing: "0.04em",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: statusDotColor,
              boxShadow: `0 0 8px ${statusDotColor}90`,
            }}
          />
          {title}
        </span>
        <span
          style={{
            fontFamily: FONT_FAMILIES.sans,
            fontSize: 11,
            fontWeight: 700,
            color: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            padding: "2px 8px",
            borderRadius: 6,
          }}
        >
          LIVE ANALYZER
        </span>
      </div>

      {/* Dynamic Animated Waveform with Threshold */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
          gap: 3,
        }}
      >
        {/* Threshold Cut Line */}
        {showThreshold && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: 0,
              width: "100%",
              height: 1.5,
              backgroundColor: "rgba(239, 68, 68, 0.5)",
              borderTop: "1.5px dashed #EF4444",
              zIndex: 3,
            }}
          />
        )}

        {Array.from({ length: barCount }).map((_, idx) => {
          const baseH = baseHeights[idx % baseHeights.length];
          // Animate height dynamically based on frame
          const modulation = 0.8 + 0.35 * Math.sin(frame * 0.22 + idx * 0.65);
          const currentHeight = Math.max(4, Math.round(baseH * modulation));
          const isSilent = currentHeight <= 8;

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: currentHeight,
                backgroundColor: isSilent ? "#EF4444" : activeColor,
                borderRadius: 9999,
                opacity: isSilent ? 0.6 : 0.9,
              }}
            />
          );
        })}
      </div>

      {/* Active Frequency or Silence note */}
      {activeFrequency && (
        <div
          style={{
            fontFamily: FONT_FAMILIES.sans,
            fontSize: 12,
            fontWeight: 600,
            color: "#64748B",
            backgroundColor: "#F8FAFC",
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ color: "#EF4444" }}>✂</span>
          <span>{activeFrequency}</span>
        </div>
      )}
    </div>
  );
};
