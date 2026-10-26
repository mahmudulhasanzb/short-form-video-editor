import React from "react";

export interface BackgroundBlurDarkenProps {
  /** Height percentage or pixel string (default: "48%") */
  height?: string | number;
  /** Blur intensity in pixels (default: 8) */
  blurPx?: number;
  /** Gradient start dark color */
  darkColor?: string;
  style?: React.CSSProperties;
}

/**
 * Background Darkening & Blur Backdrop Component:
 * - Restricted to lower-thirds behind UI cards and captions in Full Speaker.
 * - Enhances contrast while keeping speaker face completely untouched.
 */
export const BackgroundBlurDarken: React.FC<BackgroundBlurDarkenProps> = ({
  height = "48%",
  blurPx = 8,
  darkColor = "rgba(11, 21, 40, 0.94)",
  style,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height,
        background: `linear-gradient(to top, ${darkColor} 0%, rgba(11, 21, 40, 0.7) 50%, rgba(11, 21, 40, 0) 100%)`,
        backdropFilter: `blur(${blurPx}px)`,
        WebkitBackdropFilter: `blur(${blurPx}px)`,
        pointerEvents: "none",
        zIndex: 5,
        ...style,
      }}
    />
  );
};
