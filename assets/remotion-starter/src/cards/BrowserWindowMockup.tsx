import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BrowserWindowMockupProps } from "../types/ui-cards";
import { FONT_FAMILIES } from "../theme/fonts";

export interface ExtendedBrowserWindowMockupProps extends BrowserWindowMockupProps {
  url?: string;
  badge?: string;
  contentSnippet?: string;
}

/**
 * Browser Window Component per visual-direction-draft.md Section 3 & 5:
 * - Dynamic typing effect for snippet text.
 * - Clean macOS dark window styling with traffic light dots.
 */
export const BrowserWindowMockup: React.FC<ExtendedBrowserWindowMockupProps> = ({
  title = "",
  badgeText,
  badge = "",
  badgeColor = "rgba(59, 130, 246, 0.2)",
  badgeTextColor = "#60A5FA",
  terminalContent,
  contentSnippet,
  url = "",
  children,
  glowBorderColor = "rgba(59, 130, 246, 0.65)",
  width = 620,
  height = 340,
  style,
}) => {
  const frame = useCurrentFrame();
  const activeBadge = badge || badgeText;

  // Dynamic typing animation: reveals characters smoothly over 40 frames (~1.3s)
  const fullSnippet =
    contentSnippet ||
    "Auto-detect high-resonance quotes -> generate X threads & LinkedIn carousel copies.";

  const charsShown = Math.floor(
    interpolate(frame, [10, 50], [0, fullSnippet.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const visibleSnippet = fullSnippet.slice(0, charsShown);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#0B1120",
        borderRadius: 20,
        boxShadow: `0 24px 60px rgba(0, 0, 0, 0.55), 0 0 24px ${glowBorderColor}`,
        border: `1.5px solid ${glowBorderColor}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* macOS Window Top Bar */}
      <div
        style={{
          height: 48,
          backgroundColor: "#111827",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          boxSizing: "border-box",
        }}
      >
        {/* Window Controls */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#EF4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981" }} />
        </div>

        {/* URL Bar */}
        {url && (
          <div
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.7)",
              padding: "4px 18px",
              borderRadius: 6,
              fontFamily: "monospace",
              fontSize: 12,
              color: "#94A3B8",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ color: "#10B981" }}>🔒</span>
            <span>{url}</span>
          </div>
        )}

        {/* Right Corner Badge Pill */}
        {activeBadge ? (
          <div
            style={{
              backgroundColor: badgeColor,
              color: badgeTextColor,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: FONT_FAMILIES.sans,
              padding: "4px 12px",
              borderRadius: 9999,
              border: "1px solid rgba(96, 165, 250, 0.3)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {activeBadge}
          </div>
        ) : (
          <div style={{ width: 40 }} />
        )}
      </div>

      {/* Main Window Canvas Area */}
      <div
        style={{
          flex: 1,
          padding: 24,
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {title && (
            <div
              style={{
                fontFamily: FONT_FAMILIES.sans,
                fontSize: 20,
                fontWeight: 700,
                color: "#F8FAFC",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#3B82F6" }}>⚡</span>
              {title}
            </div>
          )}
          <div
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
              fontSize: 16,
              lineHeight: 1.6,
              color: "#E2E8F0",
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              padding: "16px 20px",
              borderRadius: 12,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              minHeight: 80,
            }}
          >
            {visibleSnippet}
            {charsShown < fullSnippet.length && (
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 18,
                  backgroundColor: "#3B82F6",
                  marginLeft: 4,
                  verticalAlign: "middle",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
