import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { TimelineCardProps } from "../types/ui-cards";
import { FONT_FAMILIES } from "../theme/fonts";

export interface CustomTimelineTrack {
  label: string;
  time?: string;
  color?: string;
}

export interface ExtendedTimelineCardProps extends TimelineCardProps {
  title?: string;
  tracks?: CustomTimelineTrack[];
  playheadPosition?: number;
}

/**
 * Timeline Card per visual-direction-draft.md Section 3 & 5 & Bug Fix 4 & 5:
 * - Dynamic frame-based playhead scanning across timeline tracks throughout scene.
 * - Clean script-derived track labels: LinkedIn, X Podcast, YouTube (zero invented timings or resolutions).
 */
export const TimelineCard: React.FC<ExtendedTimelineCardProps> = ({
  title = "",
  tracks = [],
  playheadPosition,
  width = 480,
  height = 200,
  style,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Dynamic frame-based playhead scan from 12% to 88% across scene
  const animatedPlayhead =
    playheadPosition !== undefined
      ? playheadPosition
      : interpolate(frame, [0, durationInFrames], [12, 88], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const trackColors = ["#3B82F6", "#8B5CF6", "#10B981"];

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
        position: "relative",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Header with Title */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: FONT_FAMILIES.sans,
          fontSize: 14,
          fontWeight: 700,
          color: "#0F172A",
          letterSpacing: "0.04em",
          marginBottom: 14,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#EF4444" }} />
          {title}
        </span>
        <span
          style={{
            fontFamily: FONT_FAMILIES.sans,
            fontSize: 11,
            fontWeight: 700,
            color: "#64748B",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          ACTIVE INGEST
        </span>
      </div>

      {/* Tracks Container */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>
        {tracks.map((tr, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              backgroundColor: "#F8FAFC",
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                fontFamily: FONT_FAMILIES.sans,
                fontWeight: 700,
                color: "#1E293B",
              }}
            >
              <span>{tr.label}</span>
            </div>
            <div
              style={{
                height: 12,
                backgroundColor: "#E2E8F0",
                borderRadius: 4,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: `${(idx * 12) % 25}%`,
                  width: `${75 - idx * 8}%`,
                  height: "100%",
                  backgroundColor: tr.color || trackColors[idx % trackColors.length],
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        ))}

        {/* Vertical Animated Playhead Line */}
        <div
          style={{
            position: "absolute",
            top: -10,
            bottom: -6,
            left: `${animatedPlayhead}%`,
            width: 2,
            backgroundColor: "#EF4444",
            zIndex: 10,
            boxShadow: "0 0 8px rgba(239, 68, 68, 0.7)",
          }}
        >
          {/* Playhead arrow tip */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -5,
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "8px solid #EF4444",
            }}
          />
        </div>
      </div>
    </div>
  );
};
