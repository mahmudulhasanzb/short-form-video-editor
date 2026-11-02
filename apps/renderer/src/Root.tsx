import React from "react";
import { Composition } from "remotion";
import { scenePlanSchema } from "@sfe/contracts";
import { VideoComposition } from "./VideoComposition";
import type { RenderInputProps } from "./types";
import { validateRenderAssets } from "./types";

const emptyProps = {
  plan: {
    schemaVersion: "1.0.0",
    project: { id: "load-a-plan", name: "Load scene-plan.json", width: 1080, height: 1920, fps: 30, durationFrames: 1 },
    source: { videoAssetId: "missing-source", transcriptAssetId: "missing-transcript" },
    scenes: [],
  },
  assets: {},
} as unknown as RenderInputProps;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ShortFormVideo"
    component={VideoComposition}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={1}
    defaultProps={emptyProps}
    calculateMetadata={({ props }) => {
      const plan = scenePlanSchema.parse(props.plan);
      return {
        width: plan.project.width,
        height: plan.project.height,
        fps: plan.project.fps,
        durationInFrames: plan.project.durationFrames,
      };
    }}
  />
);
