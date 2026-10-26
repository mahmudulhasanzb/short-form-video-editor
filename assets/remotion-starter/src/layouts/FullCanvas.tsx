import React from "react";
import { AbsoluteFill } from "remotion";
import { FullCanvasProps } from "../types/layout";

/**
 * 100% Full Canvas Layout per visual-direction-draft.md Section 3 & 4:
 * - No speaker on screen.
 * - Warm off-white canvas with light grid and cast shadow overlay (or plain white / white-shadow-grid).
 * - Statement lockup top or centre.
 * - One main graphic in centre with generous empty space.
 */
export const FullCanvas: React.FC<FullCanvasProps> = ({
  children,
  statementLockup,
  variant = "warm-grid",
  generousSpacing = true,
}) => {
  const getBackgroundStyles = (): React.CSSProperties => {
    switch (variant) {
      case "plain-white":
        return {
          backgroundColor: "#FFFFFF",
        };
      case "white-shadow-grid":
        return {
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          boxShadow: "inset 0 0 200px rgba(0,0,0,0.06)",
        };
      case "warm-grid":
      default:
        return {
          backgroundColor: "#F8F7F4",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        };
    }
  };

  return (
    <AbsoluteFill
      style={{
        ...getBackgroundStyles(),
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: generousSpacing ? "120px 60px 100px 60px" : "80px 40px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Organic Cast Shadow Overlay for Depth (Principle 1 & 5) */}
      {variant !== "plain-white" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.7) 0%, rgba(0,0,0,0.035) 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Top Statement Lockup (Mode B) */}
      {statementLockup && (
        <div
          style={{
            position: "relative",
            zIndex: 3,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          {statementLockup}
        </div>
      )}

      {/* Main Focal Point Graphic in Center */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
