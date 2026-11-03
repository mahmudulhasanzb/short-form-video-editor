import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { ScenePlan } from "@sfe/contracts";
import { getCaptionAnimationState } from "./captionAnimation";

type Scene = ScenePlan["scenes"][number];
type Chunk = Scene["captions"]["chunks"][number];
type CaptionStyle = Scene["captions"]["style"];

export function getCaptionContainerStyle(
  style: CaptionStyle,
  layout: Scene["layout"],
): React.CSSProperties {
  const splitLayout = layout === "split-50-50";
  const position = splitLayout ? "bottom" : style.position;

  return {
    position: "absolute",
    left: "7%",
    right: "7%",
    top: position === "top" ? "9%" : position === "center" ? "45%" : undefined,
    bottom: position === "bottom" ? (splitLayout ? "5%" : "12%") : undefined,
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "0.22em",
    color: style.textColor,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: 1.12,
    textAlign: "center",
    textShadow: "0 3px 12px rgba(0,0,0,.72)",
    letterSpacing: "-0.025em",
    overflowWrap: "anywhere",
    pointerEvents: "none",
  };
}

const CaptionChunk: React.FC<{
  chunk: Chunk;
  style: CaptionStyle;
  layout: Scene["layout"];
}> = ({ chunk, style, layout }) => {
  const frame = useCurrentFrame();
  const duration = chunk.endFrame - chunk.startFrame;
  const containerAnimation = getCaptionAnimationState(style.animation, frame, duration);
  const containerStyle = getCaptionContainerStyle(style, layout);

  return (
    <div
      style={{
        ...containerStyle,
        opacity: containerAnimation.opacity,
        transform: `translateY(${containerAnimation.translateY}px)`,
      }}
    >
      {chunk.words.map((word, index) => {
        const animation = getCaptionAnimationState(style.animation, frame, duration, index);
        return (
          <span
            key={word.id}
            style={{
              color: word.highlighted ? style.highlightColor : style.textColor,
              display: "inline-block",
              transform: `scale(${animation.scale})`,
              opacity: animation.wordOpacity,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};

export const CaptionLayer: React.FC<{ scene: Scene }> = ({ scene }) => {
  if (!scene.captions.enabled) return null;

  const style = scene.captions.style;
  const splitLayout = scene.layout === "split-50-50";

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        ...(splitLayout ? { height: "50%", overflow: "hidden" } : {}),
      }}
    >
      {scene.captions.chunks.map((chunk) => (
        <Sequence
          key={chunk.id}
          from={chunk.startFrame - scene.startFrame}
          durationInFrames={chunk.endFrame - chunk.startFrame}
          layout="none"
        >
          <CaptionChunk chunk={chunk} style={style} layout={scene.layout} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
