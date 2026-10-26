import React from "react";
import { ProductLogoCardProps } from "../types/ui-cards";
import { FONT_FAMILIES } from "../theme/fonts";

/**
 * Product or Logo Card per visual-direction-draft.md Section 3 & 5:
 * - Rounded white glossy card inside graphic canvas.
 * - Displays brand icon, tool name, and optional version tag with subtle border glow.
 */
export const ProductLogoCard: React.FC<ProductLogoCardProps> = ({
  title,
  versionTag,
  icon,
  borderColor = "#60A5FA",
  width = 540,
  height = 300,
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: "36px 48px",
        boxShadow: `0 20px 45px rgba(0, 0, 0, 0.07), 0 0 16px ${borderColor}40`,
        border: `2px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Brand / Tool Icon */}
      {icon && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}

      {/* Brand Title and Optional Version Tag */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          fontFamily: FONT_FAMILIES.sans,
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#0F172A",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </span>
        {versionTag && (
          <span
            style={{
              fontSize: 44,
              fontWeight: 600,
              color: "#3B82F6",
            }}
          >
            {versionTag}
          </span>
        )}
      </div>
    </div>
  );
};
