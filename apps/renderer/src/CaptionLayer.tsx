import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import type { ScenePlan } from "@sfe/contracts";

type Scene = ScenePlan["scenes"][number];\ntype Chunk = Scene["captions"]["chunks"][number];\ntype CaptionStyle = Scene["captions"]["style"];\n\nconst CaptionChunk: React.FC<{ chunk: Chunk; style: CaptionStyle }> = ({ chunk, style }) => {\n  const frame = useCurrentFrame();\n  const entrance = Math.max(1, Math.min(8, chunk.endFrame - chunk.startFrame));\n  const opacity = style.animation === "fade"\n    ? interpolate(frame, [0, entrance], [0, 1], { extrapolateRight: "clamp" })\n    : 1;\n  const translateY = style.animation === "slide"\n    ? interpolate(frame, [0, entrance], [14, 0], { extrapolateRight: "clamp" })\n    : 0;\n  return (\n    <div style={{ position: "absolute", left: "7%", right: "7%", top: style.position === "top" ? "9%" : style.position === "center" ? "45%" : undefined, bottom: style.position === "bottom" ? "12%" : undefined, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.22em", color: style.textColor, fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: 1.12, textAlign: "center", textShadow: "0 3px 12px rgba(0,0,0,.72)", letterSpacing: "-0.025em", opacity, transform: `translateY(${translateY}px)` }}>\n      {chunk.words.map((word, index) => {\n        const wordFrame = Math.max(0, frame - index * 2);\n        const scale = style.animation === "word-pop"\n          ? interpolate(wordFrame, [0, 4], [0.72, 1], { extrapolateRight: "clamp" })\n          : 1;\n        const wordOpacity = style.animation === "word-pop"\n          ? interpolate(wordFrame, [0, 3], [0, 1], { extrapolateRight: "clamp" })\n          : 1;\n        return <span key={word.id} style={{ color: word.highlighted ? style.highlightColor : style.textColor, display: "inline-block", transform: `scale(${scale})`, opacity: wordOpacity }}>{word.text}</span>;\n      })}\n    </div>\n  );\n};

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
