import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { ScenePlan } from "@sfe/contracts";
import { getCaptionAnimationState } from "./captionAnimation";

type Scene = ScenePlan["scenes"][number];
type Chunk = Scene["captions"]["chunks"][number];
type CaptionStyle = Scene["captions"]["style"];

const CaptionChunk: React.FC<{ chunk: Chunk; style: CaptionStyle }> = ({ chunk, style }) => {
  const frame = useCurrentFrame();
  const duration = chunk.endFrame - chunk.startFrame;
  const containerAnimation = getCaptionAnimationState(style.animation, frame, duration);

  return (
    <div style={{ position: "absolute", left: "7%", right: "7%", top: style.position === "top" ? "9%" : style.position === "center" ? "45%" : undefined, bottom: style.position === "bottom" ? "12%" : undefined, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.22em", color: style.textColor, fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: 1.12, textAlign: "center", textShadow: "0 3px 12px rgba(0,0,0,.72)", letterSpacing: "-0.025em", opacity: containerAnimation.opacity, transform: `translateY(${containerAnimation.translateY}px)` }}>
      {chunk.words.map((word, index) => {
        const animation = getCaptionAnimationState(style.animation, frame, duration, index);
        return <span key={word.id} style={{ color: word.highlighted ? style.highlightColor : style.textColor, display: "inline-block", transform: `scale(${animation.scale})`, opacity: animation.wordOpacity }}>{word.text}</span>;
      })}
    </div>
  );
};

export const CaptionLayer: React.FC<{
  scene: Scene;
}> = ({ scene }) => {
  if (!scene.captions.enabled) return null;

  const style = scene.captions.style;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {scene.captions.chunks.map((chunk) => (
        <Sequence
          key={chunk.id}
          from={chunk.startFrame - scene.startFrame}
          durationInFrames={chunk.endFrame - chunk.startFrame}
          layout="none"
        >
          <CaptionChunk chunk={chunk} style={style} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
