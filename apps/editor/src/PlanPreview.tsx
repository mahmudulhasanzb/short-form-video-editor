import React from "react";
import { Player } from "@remotion/player";
import type { ScenePlan } from "@sfe/contracts";
import { VideoComposition } from "../../renderer/src/VideoComposition";
import type { RenderInputProps } from "../../renderer/src/types";

export function PlanPreview({ plan, assets, frame, onFrameChange }: {
  plan: ScenePlan;
  assets: Record<string, string>;
  frame: number;
  onFrameChange: (frame: number) => void;
}) {
  const inputProps: RenderInputProps = { plan, assets };
  return <Player
    component={VideoComposition}
    inputProps={inputProps}
    durationInFrames={plan.project.durationFrames}
    compositionWidth={plan.project.width}
    compositionHeight={plan.project.height}
    fps={plan.project.fps}
    initialFrame={frame}
    moveToBeginningWhenEnded
    clickToPlay
    style={{ width: "100%", height: "100%" }}
    acknowledgeRemotionLicense
    onFrameUpdate={onFrameChange}
  />;
}
