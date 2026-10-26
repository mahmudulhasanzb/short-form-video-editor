import React from "react";
import { ColorSwatchesCardProps } from "../types/ui-cards";
import { FONT_FAMILIES } from "../theme/fonts";

/**
 * Three Colour Swatches Card per visual-direction-draft.md Section 5:
 * - Simple comparison of three color swatches (e.g. 60-30-10 palette).
 * - Rounded card with soft drop shadow.
 */
export const ColorSwatchesCard: React.FC<ColorSwatchesCardProps> = ({
  swatches = [
    { name: "Primary (60%)", hex: "#0B1528", label: "Dark Navy" },
    { name: "Secondary (30%)", hex: "#60A5FA", label: "Light Blue" },
    { name: "Accent (10%)", hex: "#2563EB", label: "Bright Blue" },
  ],
  width = 540,
  height = 180,
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: "20px 24px",
        boxShadow: "0 14px 36px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        display: "flex",
        gap: 16,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {swatches.map((swatch, idx) => (
        <div
          key={idx}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Swatch Color Box */}
          <div
            style={{
              width: "100%",
              flex: 1,
              backgroundColor: swatch.hex,
              borderRadius: 12,
              boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0,0,0,0.1)",
            }}
          />

          {/* Swatch Label */}
          <div
            style={{
              fontFamily: FONT_FAMILIES.sans,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
              {swatch.name}
            </div>
            {swatch.label && (
              <div style={{ fontSize: 11, color: "#64748B" }}>{swatch.label}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
