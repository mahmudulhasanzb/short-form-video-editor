import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { DashedBadgeCardProps } from "../types/ui-cards";
import { FONT_FAMILIES } from "../theme/fonts";

/**
 * Dashed Outline Card with Number Badge per visual-direction-draft.md Section 3 & 5
 * and User Spec for Scene 7 progressive build:
 * - Frame 1920+: Base dashed outline and card frame.
 * - Frame 1997+ (best parts): "Best Parts: High ROI" metric badge springs in.
 * - Frame 2060+ (notes): Paper note lined card and carousel indicator springs up.
 * - Frame 2091+ (handwritten): Handwritten script quote pops with yellow marker highlight and Hormozi pill pop.
 */
export const DashedBadgeCard: React.FC<DashedBadgeCardProps> = ({
  children,
  badgeText = "",
  badgeColor = "#2563EB",
  dashedColor = "#93C5FD",
  innerScale = 1.0,
  title = "",
  metric = "",
  subtitle = "",
  buildTimeline,
  sceneStartFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Resolve build milestone frames relative to scene
  const absBestParts = buildTimeline?.bestPartsFrame ?? (sceneStartFrame + 15);
  const absNotes = buildTimeline?.notesFrame ?? (sceneStartFrame + 30);
  const absHandwritten = buildTimeline?.handwrittenFrame ?? (sceneStartFrame + 45);

  const relBestParts =
    absBestParts >= sceneStartFrame ? absBestParts - sceneStartFrame : absBestParts;
  const relNotes =
    absNotes >= sceneStartFrame ? absNotes - sceneStartFrame : absNotes;
  const relHandwritten =
    absHandwritten >= sceneStartFrame
      ? absHandwritten - sceneStartFrame
      : absHandwritten;

  // Milestone 1: "best parts" spring (Frame 1997)
  const hasBestParts = frame >= relBestParts;
  const bestPartsSpring = spring({
    frame: Math.max(0, frame - relBestParts),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });
  const bestPartsScale = hasBestParts
    ? interpolate(bestPartsSpring, [0, 0.45, 1], [0.6, 1.18, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const bestPartsOpacity = hasBestParts
    ? interpolate(bestPartsSpring, [0, 0.5], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Milestone 2: "notes" spring (Frame 2060)
  const hasNotes = frame >= relNotes;
  const notesSpring = spring({
    frame: Math.max(0, frame - relNotes),
    fps,
    config: { damping: 14, stiffness: 150, mass: 0.7 },
  });
  const notesTranslateY = hasNotes
    ? interpolate(notesSpring, [0, 1], [16, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 16;
  const notesOpacity = hasNotes
    ? interpolate(notesSpring, [0, 0.6], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Milestone 3: "handwritten" spring (Frame 2091)
  const hasHandwritten = frame >= relHandwritten;
  const handwrittenSpring = spring({
    frame: Math.max(0, frame - relHandwritten),
    fps,
    config: { damping: 12, stiffness: 170, mass: 0.6 },
  });
  const handwrittenScale = hasHandwritten
    ? interpolate(handwrittenSpring, [0, 0.45, 1], [0.85, 1.15, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0.85;
  const handwrittenOpacity = hasHandwritten
    ? interpolate(handwrittenSpring, [0, 0.5], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Badge pop when handwritten triggers
  const badgePopScale = hasHandwritten
    ? interpolate(handwrittenSpring, [0, 0.45, 1], [1.0, 1.22, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1.0;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 36px",
        ...style,
      }}
    >
      {/* Dashed Bounding Frame */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: 28,
          border: `2.5px dashed ${dashedColor}`,
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      />

      {/* Metric Badge Pill in Upper Right Corner */}
      <div
        style={{
          position: "absolute",
          top: -14,
          right: 32,
          backgroundColor: badgeColor,
          color: "#FFFFFF",
          fontFamily: FONT_FAMILIES.sans,
          fontSize: 14,
          fontWeight: 700,
          padding: "5px 16px",
          borderRadius: 9999,
          boxShadow: `0 4px 14px ${badgeColor}60`,
          transform: `scale(${badgePopScale})`,
          zIndex: 5,
        }}
      >
        {badgeText}
      </div>

      {/* Downscaled Inner Element or Built-in Note Card */}
      <div
        style={{
          transform: `scale(${innerScale})`,
          transformOrigin: "center center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children ? (
          children
        ) : (
          <div
            style={{
              width: 520,
              minHeight: 270,
              backgroundColor: "#FFFDF9",
              borderRadius: 22,
              padding: "26px 30px",
              boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
            }}
          >
            <div>
              {/* Card Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILIES.sans,
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#64748B",
                  }}
                >
                  {title}
                </span>

                {/* Milestone 1 (f1997): Best Parts / High ROI Metric Pill */}
                <div
                  style={{
                    transform: `scale(${bestPartsScale})`,
                    opacity: bestPartsOpacity,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_FAMILIES.sans,
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#059669",
                      backgroundColor: "rgba(16, 185, 129, 0.14)",
                      padding: "4px 12px",
                      borderRadius: 9999,
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    {metric}
                  </span>
                </div>
              </div>

              {/* Milestone 2 (f2060): Paper Note Canvas with lined notebook texture */}
              <div
                style={{
                  transform: `translateY(${notesTranslateY}px)`,
                  opacity: notesOpacity,
                  padding: "10px 14px",
                  backgroundColor: "rgba(254, 252, 246, 0.8)",
                  borderRadius: 12,
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  backgroundImage:
                    "repeating-linear-gradient(transparent, transparent 27px, rgba(203, 213, 225, 0.4) 28px)",
                  backgroundSize: "100% 28px",
                  minHeight: 90,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Milestone 3 (f2091): Handwritten script quote with yellow highlighter stroke */}
                <div
                  style={{
                    transform: `scale(${handwrittenScale})`,
                    opacity: handwrittenOpacity,
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_FAMILIES.script,
                      fontSize: 32,
                      lineHeight: 1.25,
                      color: "#1E293B",
                      fontStyle: "italic",
                      backgroundColor: "rgba(254, 240, 138, 0.70)",
                      padding: "2px 8px",
                      borderRadius: 4,
                      boxDecorationBreak: "clone",
                      WebkitBoxDecorationBreak: "clone",
                    }}
                  >
                    "{subtitle}"
                  </span>
                </div>
              </div>
            </div>

            {/* Footer with carousel tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 18,
                borderTop: "1px solid rgba(0,0,0,0.07)",
                paddingTop: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: hasBestParts ? "#10B981" : "#3B82F6",
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_FAMILIES.sans,
                    fontSize: 12,
                    color: "#64748B",
                    fontWeight: 600,
                  }}
                >
                  High-Retention Visual Carousel Asset
                </span>
              </div>

              {hasNotes && (
                <span
                  style={{
                    fontFamily: FONT_FAMILIES.sans,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#2563EB",
                    backgroundColor: "rgba(37, 99, 235, 0.08)",
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  Paper Note
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
