import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import type { ScenePlan } from "@sfe/contracts";

type Scene = ScenePlan["scenes"][number];

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
          <div
            style={{
              position: "absolute",
              left: "7%",
              right: "7%",
              top: style.position === "top" ? "9%" : style.position === "center" ? "45%" : undefined,
              bottom: style.position === "bottom" ? "12%" : undefined,
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
            }}
          >
            {chunk.words.map((word) => (
              <span key={word.id} style={{ color: word.highlighted ? style.highlightColor : style.textColor }}>
                {word.text}
              </span>
            ))}
          </div>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
