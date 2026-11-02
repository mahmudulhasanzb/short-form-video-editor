import type { ScenePlan } from "@sfe/contracts";

export function referencedAssetIds(plan: ScenePlan): string[] {
  const ids = new Set<string>([plan.source.videoAssetId]);
  for (const scene of plan.scenes) {
    for (const alternative of scene.visual.alternatives) {
      for (const element of alternative.elements) {
        if (element.assetId) ids.add(element.assetId);
      }
    }
    for (const effect of scene.soundEffects) ids.add(effect.assetId);
  }
  return [...ids];
}
