import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { ModeATalkingCaptionProps, CaptionToken } from "../types/captions";
import { FONT_FAMILIES } from "../theme/fonts";
import { HighlightScriptWord } from "./HighlightScriptWord";

/**
 * Mode A: Talking Caption Component per visual-direction-draft.md Section 2 & Fix 2:
 * - 2-3 word audio-timed chunks mapped from Whisper transcript.
 * - Staggered Apple-style per-word spring entrance:
 *     translateY +20px->0, opacity 0->1, blur 6px->0, scale 0.96->1.0 over ~0.3s per word.
 *     Stagger: 0.06s (~2 frames) per word.
 * - Exit: smoothly fades and blurs out over ~0.2s (6 frames) before the next chunk starts,
 *     ensuring zero overlap and only ONE chunk visible at any given frame.
 * - Font Size & Weight:
 *     Split scenes: 48px sans, 80px script highlight, 600 weight.
 *     Full speaker scenes: 52px sans, 84px script highlight, 600 weight.
 * - Contrast: Dark Navy (#0F172A) on light canvas, White (#FFFFFF) on dark speaker background.
 */
export const ModeATalkingCaption: React.FC<ModeATalkingCaptionProps> = ({
  chunks,
  tokens,
  sceneStartFrame = 0,
  variant = "dark-bg",
  fontSize = 48,
  highlightFontSize = 80,
  sansFontFamily = FONT_FAMILIES.sans,
  scriptFontFamily = FONT_FAMILIES.script,
  textColor,
  gradientStart,
  gradientEnd,
  glowColor,
  align = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Contrast configuration based on background variant
  const isLightBg = variant === "light-bg";
  const effectiveTextColor = textColor || (isLightBg ? "#0F172A" : "#FFFFFF");
  const effectiveTextShadow = isLightBg ? "none" : "0px 2px 8px rgba(0, 0, 0, 0.75)";
  const effectiveGradStart = gradientStart || (isLightBg ? "#2563EB" : "#60A5FA");
  const effectiveGradEnd = gradientEnd || (isLightBg ? "#1D4ED8" : "#2563EB");
  const effectiveGlow = glowColor || (isLightBg ? "rgba(37, 99, 235, 0.35)" : "rgba(96, 165, 250, 0.45)");

  // 1. If chunks are provided, render the single audio-timed active chunk
  if (chunks && chunks.length > 0) {
    // Normalize chunk frame times relative to current scene Sequence
    const normalizedChunks = chunks.map((c, i) => {
      const relStart = c.startFrame >= sceneStartFrame ? c.startFrame - sceneStartFrame : c.startFrame;
      const relEnd = c.endFrame >= sceneStartFrame ? c.endFrame - sceneStartFrame : c.endFrame;
      const nextChunk = chunks[i + 1];
      const nextRelStart = nextChunk
        ? (nextChunk.startFrame >= sceneStartFrame ? nextChunk.startFrame - sceneStartFrame : nextChunk.startFrame)
        : durationInFrames;

      // Keep chunk visible until next chunk starts, capped at 1.5s (45 frames)
      const hideFrame = Math.min(nextRelStart, Math.max(relEnd + 6, relStart + 45));

      return {
        tokens: c.tokens,
        startFrame: relStart,
        endFrame: hideFrame,
        duration: Math.max(1, hideFrame - relStart),
      };
    });

    // Find the currently active chunk
    const activeChunk = normalizedChunks.find(
      (c) => frame >= c.startFrame && frame < c.endFrame
    );

    if (!activeChunk) {
      return null;
    }

    const chunkAge = frame - activeChunk.startFrame;
    const framesRemaining = activeChunk.endFrame - frame;

    // Smooth exit over ~0.2s (6 frames) before next chunk arrives
    const EXIT_FRAMES = Math.min(6, Math.max(3, Math.floor(activeChunk.duration * 0.35)));
    const isExiting = framesRemaining <= EXIT_FRAMES;

    const exitProgress = isExiting
      ? interpolate(framesRemaining, [0, EXIT_FRAMES], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

    const chunkExitOpacity = isExiting ? interpolate(exitProgress, [0, 1], [1, 0]) : 1;
    const chunkExitBlur = isExiting ? interpolate(exitProgress, [0, 1], [0, 5]) : 0;
    const chunkExitTranslateY = isExiting ? interpolate(exitProgress, [0, 1], [0, -8]) : 0;
    const chunkExitScale = isExiting ? interpolate(exitProgress, [0, 1], [1.0, 0.98]) : 1.0;

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: align === "center" ? "center" : "flex-start",
          gap: "10px 16px",
          textAlign: align,
          maxWidth: 960,
          margin: "0 auto",
          opacity: chunkExitOpacity,
          transform: `translateY(${chunkExitTranslateY}px) scale(${chunkExitScale})`,
          filter: chunkExitBlur > 0.1 ? `blur(${chunkExitBlur}px)` : undefined,
          ...style,
        }}
      >
        {activeChunk.tokens.map((token: CaptionToken, idx: number) => {
          // Stagger: 0.06s (~2 frames) per word
          const STAGGER_FRAMES = 2;
          const wordAge = chunkAge - idx * STAGGER_FRAMES;

          // Word entrance spring over ~0.25-0.35s (8-11 frames)
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
          };

          if (token.isHighlighted) {
            return (
              <span key={idx} style={wordStyle}>
                <HighlightScriptWord
                  fontSize={highlightFontSize}
                  fontFamily={scriptFontFamily}
                  gradientStart={token.gradientStart || effectiveGradStart}
                  gradientEnd={token.gradientEnd || effectiveGradEnd}
                  glowColor={token.highlightColor || effectiveGlow}
                >
                  {token.text}
                </HighlightScriptWord>
              </span>
            );
          }

          return (
            <span
              key={idx}
              style={{
                ...wordStyle,
                fontFamily: sansFontFamily,
                fontSize,
                fontWeight: isLightBg ? 700 : 600,
                color: effectiveTextColor,
                textShadow: effectiveTextShadow,
                lineHeight: 1.2,
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    );
  }

  // 2. Fallback to token array if no chunks provided
  if (!tokens || tokens.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: "12px 18px",
        textAlign: align,
        maxWidth: 960,
        margin: "0 auto",
        ...style,
      }}
    >
      {tokens.map((token: CaptionToken, idx: number) => {
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
        };

        if (token.isHighlighted) {
          return (
            <span key={idx} style={wordStyle}>
              <HighlightScriptWord
                fontSize={highlightFontSize}
                fontFamily={scriptFontFamily}
                gradientStart={token.gradientStart || effectiveGradStart}
                gradientEnd={token.gradientEnd || effectiveGradEnd}
                glowColor={token.highlightColor || effectiveGlow}
              >
                {token.text}
              </HighlightScriptWord>
            </span>
          );
        }

        return (
          <span
            key={idx}
            style={{
              ...wordStyle,
              fontFamily: sansFontFamily,
              fontSize,
              fontWeight: isLightBg ? 700 : 600,
              color: effectiveTextColor,
              textShadow: effectiveTextShadow,
              lineHeight: 1.2,
            }}
          >
            {token.text}
          </span>
        );
      })}
    </div>
  );
};
