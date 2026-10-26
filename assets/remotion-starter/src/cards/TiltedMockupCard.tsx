import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { TiltedMockupCardProps } from "../types/ui-cards";
import { FONT_FAMILIES } from "../theme/fonts";

export interface ExtendedTiltedMockupCardProps extends TiltedMockupCardProps {
  title?: string;
  badge?: string;
  subtitle?: string;
  rotation?: number;
}

/**
 * Tilted B-Roll Mockup Card per visual-direction-draft.md Section 3 & 5 & Bug Fix 4 & 5:
 * - Appears inside graphic canvas only, subtle rotation (-4 deg).
 * - Clean script-derived architecture: Long-form Source -> AI Core Extraction -> Multi-Channel Distribution.
 * - Zero invented pricing or inflated asset counts.
 * - Subtle ambient motion prevents frame-identical render.
 */
export const TiltedMockupCard: React.FC<ExtendedTiltedMockupCardProps> = ({
  contentSrc,
  children,
  rotationDeg = -4,
  rotation,
  borderRadius = 24,
  subCardThumbnails = [],
  subCardGlowColor = "#3B82F6",
  width = 540,
  height = 640,
  title = "",
  badge = "",
  subtitle = "",
  style,
}) => {
  const frame = useCurrentFrame();
  const activeRotation = rotation !== undefined ? rotation : rotationDeg;

  // Frame-based subtle ambient drift to prevent static freeze
  const ambientDrift = Math.sin(frame * 0.06) * 3;

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        transform: `translateY(${ambientDrift}px) rotate(${activeRotation}deg)`,
        backgroundColor: "#0B1528",
        border: "8px solid #FFFFFF",
        boxShadow:
          "0 30px 60px -12px rgba(0, 0, 0, 0.28), 0 0 25px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Card Content */}
      {contentSrc ? (
        <Img
          src={contentSrc}
          alt="Mockup Content"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : children ? (
        children
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "32px 28px",
            boxSizing: "border-box",
            backgroundColor: "#0F172A",
            color: "#FFFFFF",
            position: "relative",
          }}
        >
          {/* Subtle blueprint grid background */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                "linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              pointerEvents: "none",
            }}
          />

          {/* Header with Badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
            {badge && (
              <span
                style={{
                  fontFamily: FONT_FAMILIES.sans,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  color: "#60A5FA",
                  padding: "5px 14px",
                  borderRadius: 9999,
                  border: "1px solid rgba(96, 165, 250, 0.4)",
                }}
              >
                {badge}
              </span>
            )}
            <span
              style={{
                fontFamily: FONT_FAMILIES.sans,
                fontSize: 12,
                color: "#64748B",
                fontWeight: 600,
              }}
            >
              BLUEPRINT
            </span>
          </div>

          {/* Center Title & Blueprint Visual */}
          <div style={{ zIndex: 2, display: "flex", flexDirection: "column", gap: 14 }}>
            <h3
              style={{
                fontFamily: FONT_FAMILIES.sans,
                fontSize: 32,
                fontWeight: 800,
                lineHeight: 1.15,
                margin: 0,
                color: "#F8FAFC",
              }}
            >
              {title}
            </h3>

            {subtitle && (
              <p
                style={{
                  fontFamily: FONT_FAMILIES.sans,
                  fontSize: 17,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  margin: 0,
                  color: "#94A3B8",
                }}
              >
                {subtitle}
              </p>
            )}

            {/* Architecture diagram nodes */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 8,
                backgroundColor: "rgba(30, 41, 59, 0.7)",
                borderRadius: 14,
                padding: "16px 18px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#3B82F6" }} />
                <span style={{ fontFamily: FONT_FAMILIES.sans, fontSize: 14, color: "#E2E8F0" }}>
                  Long-form Source (YouTube / Podcast)
                </span>
              </div>
              <div style={{ width: 2, height: 10, backgroundColor: "#475569", marginLeft: 4 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10B981" }} />
                <span style={{ fontFamily: FONT_FAMILIES.sans, fontSize: 14, color: "#E2E8F0" }}>
                  AI Core: Extraction & Cut Pipeline
                </span>
              </div>
              <div style={{ width: 2, height: 10, backgroundColor: "#475569", marginLeft: 4 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
                <span style={{ fontFamily: FONT_FAMILIES.sans, fontSize: 14, color: "#E2E8F0" }}>
                  Multi-Channel Distributed Assets
                </span>
              </div>
            </div>
          </div>

          {/* Clean Footer Label without invented price */}
          <div
            style={{
              zIndex: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: 14,
            }}
          >
            <span style={{ fontFamily: FONT_FAMILIES.sans, fontSize: 13, color: "#64748B" }}>
              Architecture Delivery
            </span>
            <span
              style={{
                fontFamily: FONT_FAMILIES.sans,
                fontSize: 14,
                fontWeight: 700,
                color: "#10B981",
              }}
            >
              Autonomous Engine
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
