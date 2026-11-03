import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Video,
  useCurrentFrame,
} from "remotion";
import type { ScenePlan } from "@sfe/contracts";
import type { RenderInputProps } from "./types";
import { requireAsset } from "./types";
import { VisualLayer } from "./VisualLayer";
import { CaptionLayer } from "./CaptionLayer";
import { getSoundCueTiming } from "./soundCueTiming";
import { getCameraTransform } from "./cameraMotion";

type SceneData = ScenePlan["scenes"][number];

export function getSpeakerFraming(
  crop: SceneData["speakerCrop"],
  camera: ReturnType<typeof getCameraTransform>,
) {
  const cropScale = crop
    ? Math.max(100 / crop.width, 100 / crop.height)
    : 1;
  const objectPosition = crop
    ? `${crop.x + crop.width / 2}% ${crop.y + crop.height / 2}%`
    : "50% 50%";

  return {
    objectPosition,
    transform: `scale(${cropScale * camera.scale}) translateX(${camera.translateX}%)`,
    transformOrigin: "center center",
  };
}

const SpeakerVideo: React.FC<{
  src: string;
  scene: SceneData;
  split: boolean;
}> = ({ src, scene, split }) => {
  const frame = useCurrentFrame();
  const duration = scene.endFrame - scene.startFrame;
  const camera = getCameraTransform(frame, duration, scene.cameraMotion);
  const framing = getSpeakerFraming(scene.speakerCrop, camera);

  return (
    <AbsoluteFill
      style={{
        top: split ? "50%" : 0,
        height: split ? "50%" : "100%",
        overflow: "hidden",
      }}
    >
      <Video
        src={src}
        startFrom={scene.startFrame}
        endAt={scene.endFrame}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...framing,
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
