import React from "react";
import { FONT_FAMILIES } from "../theme/fonts";
import { getSameFamilyBlueGradient, createSameColorGradient } from "../theme/palette";

export interface HighlightScriptWordProps {
  children: React.ReactNode;
  fontSize?: number;
  gradientStart?: string;
  gradientEnd?: string;
  glowColor?: string;
  fontFamily?: string;
  style?: React.CSSProperties;
}

/**
 * Script Word Highlight per visual-direction-draft.md Section 2:
 * - Premium gradient within the SAME color family only (lighter to deeper, top to bottom).
 * - Soft glow in the same color at low opacity.
 * - Instrument Serif italic typography.
 * - Never a flat solid with hard outline, never white glow, never multi-color gradient.
 */
export const HighlightScriptWord: React.FC<HighlightScriptWordProps> = ({
  children,
  fontSize = 72,
  gradientStart,
  gradientEnd,
  glowColor,
  fontFamily = FONT_FAMILIES.script,
  style,
}) => {
  const gradientStyles =
    gradientStart && gradientEnd
      ? createSameColorGradient(
          gradientStart,
          gradientEnd,
          glowColor || "rgba(59, 130, 246, 0.35)"
        )
      : getSameFamilyBlueGradient();

  return (
    <span
      style={{
        fontFamily,
        fontStyle: "italic",
        fontWeight: "normal",
        fontSize,
        lineHeight: 1.1,
        display: "inline-block",
        padding: "0 8px",
        ...gradientStyles,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
