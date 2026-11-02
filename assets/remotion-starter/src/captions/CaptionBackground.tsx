import React from "react";

/**
 * Phase 3b: CaptionBackground, default fade-blur.
 * Tight around caption text only. No fixed 46% dark gradient, no glossy square card by default.
 * Top edge fades to transparent over about 50px, so the caption blends into the video above it.
 * The container is sized by its children, not by the full frame width or height.
 */
export type CaptionBackgroundStyle = "fade-blur" | "none" | "dark-pill";

export interface CaptionBackgroundProps {
  style?: CaptionBackgroundStyle;
  children: React.ReactNode;
}

export const CaptionBackground: React.FC<CaptionBackgroundProps> = ({ style = "fade-blur", children }) => {
  if (style === "none") {
    return <div style={{ display: "inline-block" }}>{children}</div>;
  }
  if (style === "dark-pill") {
    return (
      <div
        style={{
          display: "inline-block",
          padding: "10px 18px",
          borderRadius: 999,
          background: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {children}
      </div>
    );
  }
  // fade-blur default
  return (
    <div
      style={{
        display: "inline-block",
        maxWidth: 960,
        padding: "14px 20px 12px 20px",
        borderRadius: 16,
        background: "linear-gradient(to bottom, rgba(11, 21, 40, 0) 0%, rgba(11, 21, 40, 0.55) 35%, rgba(11, 21, 40, 0.75) 100%)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        // Mask the top edge so it fades out, instead of a hard box edge.
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 28%)",
      }}
    >
      {children}
    </div>
  );
};
