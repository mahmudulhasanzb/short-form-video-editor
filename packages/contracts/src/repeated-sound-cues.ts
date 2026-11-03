import type { ScenePlan } from "./scene-plan.js";

export type RepeatedSoundCueWarning = {
  previousSceneId: string;
  previousSceneName: string;
  sceneId: string;
  sceneName: string;
  assetIds: string[];
};

/** Flags the same enabled sound asset reused across adjacent scenes. */
export function getRepeatedSoundCueWarnings(
  scenes: ScenePlan["scenes"],
): RepeatedSoundCueWarning[] {
  const ordered = [...scenes].sort((a, b) => a.startFrame - b.startFrame);
  const warnings: RepeatedSoundCueWarning[] = [];

  for (let index = 1; index < ordered.length; index += 1) {
    const previous = ordered[index - 1];
    const current = ordered[index];
    if (!previous || !current) continue;

    const previousAssets = new Set(
      previous.soundEffects.filter((cue) => cue.enabled).map((cue) => cue.assetId),
    );
    const repeated = [...new Set(
      current.soundEffects
        .filter((cue) => cue.enabled && previousAssets.has(cue.assetId))
        .map((cue) => cue.assetId),
    )];
    if (repeated.length === 0) continue;

    warnings.push({
      previousSceneId: previous.id,
      previousSceneName: previous.name,
      sceneId: current.id,
      sceneName: current.name,
      assetIds: repeated,
    });
  }

  return warnings;
}
