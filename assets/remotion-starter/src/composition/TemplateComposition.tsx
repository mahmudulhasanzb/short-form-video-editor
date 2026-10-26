import React, { useEffect } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Audio } from "@remotion/media";
import { ScenePlanItem } from "../types/scene-plan";
import { SceneRenderer } from "./SceneRenderer";
import { SoundTracks } from "../sound/SoundTracks";
import { loadProjectFonts } from "../theme/fonts";

export interface TemplateCompositionProps {
  scenes?: ScenePlanItem[];
  voiceTrackSrc?: string;
}

/**
 * Main Template Composition Component:
 * - 9:16 Vertical composition (1080x1920 or 720x1280 at 30fps).
 * - Sequenced scenes driven entirely by ScenePlanItem data.
 * - Master voice track playing continuously across all scenes.
 * - Dedicated 5-track sound system (WHOOSHES, TEXTURES, RISERS, HITS, MUSIC).
 * - Deterministic font loading via @remotion/fonts.
 */
export const TemplateComposition: React.FC<TemplateCompositionProps> = ({
  scenes = [],
  voiceTrackSrc = "",
}) => {
  useEffect(() => {
    loadProjectFonts();
  }, []);

  // Collect all sound cues across all scenes for the global audio tracks
  const allSoundCues = scenes.flatMap((scene) => scene.soundCues || []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1528" }}>
      {/* Master Voice Track (Continuous dialogue across all scenes) */}
      {voiceTrackSrc && <Audio src={voiceTrackSrc} volume={1.0} />}

      {/* Visual Scene Sequences */}
      {scenes.map((scene) => {
        const durationInFrames = Math.max(1, scene.endFrame - scene.startFrame);

        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={durationInFrames}
            name={`Scene ${scene.sceneNumber}: ${scene.layoutType}`}
          >
            <SceneRenderer scene={scene} />
          </Sequence>
        );
      })}

      {/* Global Sound Tracks (WHOOSHES, TEXTURES, RISERS, HITS, MUSIC) */}
      <SoundTracks cues={allSoundCues} />
    </AbsoluteFill>
  );
};
