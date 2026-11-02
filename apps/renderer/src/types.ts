import type { ScenePlan } from "@sfe/contracts";

export type RenderInputProps = {
  plan: ScenePlan;
  /** Maps stable asset IDs from scene-plan.json to absolute or public URLs. */
  assets: Record<string, string>;
};

export function requireAsset(
  assets: Record<string, string>,
  assetId: string,
  context: string,
): string {
  const resolved = assets[assetId];
  if (!resolved) {
    throw new Error(`Missing asset "${assetId}" referenced by ${context}.`);
  }
  return resolved;
}

export function validateRenderAssets(props: RenderInputProps): void {
  requireAsset(props.assets, props.plan.source.videoAssetId, "project source video");

  for (const scene of props.plan.scenes) {
    const selectedId = scene.visual.selectedAlternativeId;
    const selected = selectedId
      ? scene.visual.alternatives.find((alternative) => alternative.id === selectedId)
      : undefined;

    for (const element of selected?.elements ?? []) {
      if (element.assetId) {
        requireAsset(props.assets, element.assetId, `scene "${scene.id}" visual element "${element.id}"`);
      }
    }

    for (const effect of scene.soundEffects) {
      if (effect.enabled) {
        requireAsset(props.assets, effect.assetId, `scene "${scene.id}" sound effect "${effect.id}"`);
      }
    }
  }
}
