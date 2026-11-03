import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import type { ScenePlan } from "@sfe/contracts";

type Scene = ScenePlan["scenes"][number];
type Chunk = Scene["captions"]["chunks"][number];
type CaptionStyle = Scene["captions"]["style"];

const CaptionChunk: React.FC<{ chunk: Chunk; style: CaptionStyle }> = ({ chunk, style }) => {
  const frame = useCurrentFrame();
  const entrance = Math.max(1, Math.min(8, chunk.endFrame - chunk.startFrame));
  const opacity = style.animation === "fade"
    ? interpolate(frame, [0, entrance], [0, 1], { extrapolateRight: "clamp" })
    : 1;
  const translateY = style.animation === "slide"
    ? interpolate(frame, [0, entrance], [14, 0], { extrapolateRight: "clamp" })
    : 0;

  return (
    <div style={{ position: "absolute", left: "7%", right: "7%", top: style.position === "top" ? "9%" : style.position === "center" ? "45%" : undefined, bottom: style.position === "bottom" ? "12%" : undefined, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.22em", color: style.textColor, fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: 1.12, textAlign: "center", textShadow: "0 3px 12px rgba(0,0,0,.72)", letterSpacing: "-0.025em", opacity, transform: `translateY(${translateY}px)` }}>
      {chunk.words.map((word, index) => {
        const wordFrame = Math.max(0, frame - index * 2);
        const scale = style.animation === "word-pop"
          ? interpolate(wordFrame, [0, 4], [0.72, 1], { extrapolateRight: "clamp" })
          : 1;
        const wordOpacity = style.animation === "word-pop"
          ? interpolate(wordFrame, [0, 3], [0, 1], { extrapolateRight: "clamp" })
          : 1;

        return <span key={word.id} style={{ color: word.highlighted ? style.highlightColor : style.textColor, display: "inline-block", transform: `scale(${scale})`, opacity: wordOpacity }}>{word.text}</span>;
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
