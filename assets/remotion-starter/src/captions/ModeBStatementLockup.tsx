import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ModeBStatementLockupProps, CaptionToken } from "../types/captions";
import { FONT_FAMILIES } from "../theme/fonts";
import { HighlightScriptWord } from "./HighlightScriptWord";

/**
 * Mode B: Statement Lockup per visual-direction-draft.md Section 2 & Fix 2:
 * - Use only in 100% Full Canvas scenes.
 * - Curated headline statement (small sans plus large script).
 * - Positioned top or centre with generous empty space.
 * - Apple-style staggered per-word spring entrance with blur, opacity, and scale.
 * - Font sizes: 52px sans, 84px script highlight, 700 weight.
 */
export const ModeBStatementLockup: React.FC<ModeBStatementLockupProps> = ({
  title,
  subtitle,
  position = "top",
  fontSize = 52,
  highlightFontSize = 84,
  textColor = "#0F172A",
  gradientStart,
  gradientEnd,
  glowColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const renderTokenItem = (token: string | CaptionToken, idx: number) => {
    const STAGGER_FRAMES = 2;
    const wordAge = frame - idx * STAGGER_FRAMES;

    const wordSpring = spring({
      frame: Math.max(0, wordAge),
      fps,
      config: {
        damping: 15,
        stiffness: 110,
        mass: 0.7,
      },
    });

    const wordTranslateY = wordAge < 0 ? 20 : interpolate(wordSpring, [0, 1], [20, 0]);
    const wordOpacity =
      wordAge < 0
        ? 0
        : interpolate(wordSpring, [0, 0.7], [0, 1], {
            extrapolateRight: "clamp",
          });
    const wordBlur = wordAge < 0 ? 6 : interpolate(wordSpring, [0, 1], [6, 0]);
    const wordScale = wordAge < 0 ? 0.96 : interpolate(wordSpring, [0, 1], [0.96, 1.0]);

    const wordStyle: React.CSSProperties = {
      display: "inline-block",
      transform: `translateY(${wordTranslateY}px) scale(${wordScale})`,
      opacity: wordOpacity,
      filter: wordBlur > 0.1 ? `blur(${wordBlur}px)` : undefined,
      padding: "0 6px",
    };

    if (typeof token === "string") {
      return (
        <span key={idx} style={wordStyle}>
          {token}
        </span>
      );
    }

    if (token.isHighlighted) {
      return (
        <span key={idx} style={wordStyle}>
          <HighlightScriptWord
            fontSize={highlightFontSize}
            gradientStart={token.gradientStart || gradientStart}
            gradientEnd={token.gradientEnd || gradientEnd}
            glowColor={token.highlightColor || glowColor}
          >
            {token.text}
          </HighlightScriptWord>
        </span>
      );
    }

    return (
      <span key={idx} style={wordStyle}>
        {token.text}
      </span>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: "100%",
        maxWidth: 960,
        margin: position === "top" ? "20px auto 40px auto" : "auto",
      }}
    >
      {/* Primary Statement Line */}
      <div
        style={{
          fontFamily: FONT_FAMILIES.sans,
          fontSize,
          fontWeight: 700,
          color: textColor,
          lineHeight: 1.25,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "center",
        }}
      >
        {Array.isArray(title)
          ? title.map((t, i) => renderTokenItem(t, i))
          : title}
      </div>

      {/* Optional Secondary Line */}
      {subtitle && (
        <div
          style={{
            fontFamily: FONT_FAMILIES.sans,
            fontSize: Math.round(fontSize * 0.72),
            fontWeight: 600,
            color: "rgba(15, 23, 42, 0.7)",
            marginTop: 16,
            letterSpacing: "0.02em",
          }}
        >
          {Array.isArray(subtitle)
            ? subtitle.map((s, i) => renderTokenItem(s, i))
            : subtitle}
        </div>
      )}
    </div>
  );
};
