import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Video,
  interpolate,
  useCurrentFrame,
} from "remotion";
import type { ScenePlan } from "@sfe/contracts";
import type { RenderInputProps } from "./types";
import { requireAsset } from "./types";
import { VisualLayer } from "./VisualLayer";
import { CaptionLayer } from "./CaptionLayer";
import { getSoundCueTiming } from "./soundCueTiming";

type SceneData = ScenePlan["scenes"][number];

const SpeakerVideo: React.FC<{
  src: string;
  scene: SceneData;
  split: boolean;
}> = ({ src, scene, split }) => {
  const frame = useCurrentFrame();
  const duration = scene.endFrame - scene.startFrame;
  const intensity = scene.cameraMotion.intensity;
  const motion = scene.cameraMotion.enabled ? scene.cameraMotion.type : null;
  const zoom = motion === "zoom-in"
    ? interpolate(frame, [0, Math.max(1, duration - 1)], [1, 1 + intensity], { extrapolateRight: "clamp" })
    : motion === "zoom-out"
      ? interpolate(frame, [0, Math.max(1, duration - 1)], [1 + intensity, 1], { extrapolateRight: "clamp" })
      : 1;
  const pan = motion === "pan-left"
    ? interpolate(frame, [0, Math.max(1, duration - 1)], [2, -2], { extrapolateRight: "clamp" })
    : motion === "pan-right"
      ? interpolate(frame, [0, Math.max(1, duration - 1)], [-2, 2], { extrapolateRight: "clamp" })
      : 0;

  const crop = scene.speakerCrop;
  const objectPosition = crop
    ? `${crop.x + crop.width / 2}% ${crop.y + crop.height / 2}%`
    : "50% 50%";

  return (
    <AbsoluteFill style={{ top: split ? "50%" : 0, height: split ? "50%" : "100%", overflow: "hidden" }}>
      <Video
        src={src}
        startFrom={scene.startFrame}
        endAt={scene.endFrame}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          transform: `scale(${zoom}) translateX(${pan}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Scene: React.FC<{
  scene: SceneData;
  input: RenderInputProps;
}> = ({ scene, input }) => {
  const sourceVideo = requireAsset(input.assets, input.plan.source.videoAssetId, "project source video");
  const selected = scene.visual.selectedAlternativeId
    ? scene.visual.alternatives.find((alternative) => alternative.id === scene.visual.selectedAlternativeId)
    : undefined;
  const split = scene.layout === "split-50-50";
  const fullCanvas = scene.layout === "full-canvas";

  return (
    <AbsoluteFill style={{ backgroundColor: "#080808" }}>
      {!fullCanvas && <SpeakerVideo src={sourceVideo} scene={scene} split={split} />}
      {scene.visual.type !== "none" && (
        <AbsoluteFill style={split ? { height: "50%", overflow: "hidden" } : undefined}>
          <VisualLayer alternative={selected} assets={input.assets} sceneDurationFrames={scene.endFrame - scene.startFrame} />
        </AbsoluteFill>
      )}
      <CaptionLayer scene={scene} />
      {scene.soundEffects.filter((effect) => effect.enabled).map((effect) => {
        const timing = getSoundCueTiming({
          sceneStartFrame: scene.startFrame,
          sceneEndFrame: scene.endFrame,
          cueStartFrame: effect.startFrame,
          cueDurationFrames: effect.durationFrames,
          volumeDb: effect.volumeDb,
        });
        if (!timing) return null;

        return (
          <Sequence
            key={effect.id}
            from={timing.from}
            durationInFrames={timing.durationInFrames}
            layout="none"
          >
            <Audio
              src={requireAsset(input.assets, effect.assetId, `sound effect "${effect.id}"`)}
              volume={timing.volume}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
