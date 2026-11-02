import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import type { ScenePlan } from "@sfe/contracts";
import type { RenderInputProps } from "./types";
import { Scene } from "./Scene";

export const VideoComposition: React.FC<RenderInputProps> = (input) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {input.plan.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.endFrame - scene.startFrame}
          layout="none"
        >
          <Scene scene={scene} input={input} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const getCompositionMetadata = (plan: ScenePlan) => ({
  width: plan.project.width,
  height: plan.project.height,
  fps: plan.project.fps,
  durationInFrames: plan.project.durationFrames,
});
