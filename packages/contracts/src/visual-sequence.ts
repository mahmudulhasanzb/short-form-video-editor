import type { ScenePlan } from "./scene-plan.js";

export type VisualSequenceWarning = {
  previousSceneId: string;
  previousSceneName: string;
  sceneId: string;
  sceneName: string;
  layout: ScenePlan["scenes"][number]["layout"];
  compositionType: string;
};

/**
 * Finds adjacent graphic scenes that reuse the same layout and visual
 * composition structure. This is advisory: repeated structures can be
 * intentional for a progression, comparison, or recurring visual motif.
 */
export function getVisualSequenceWarnings(
  scenes: ScenePlan["scenes"],
): VisualSequenceWarning[] {
  const ordered = [...scenes].sort((a, b) => a.startFrame - b.startFrame);
  const warnings: VisualSequenceWarning[] = [];

  for (let index = 1; index < ordered.length; index += 1) {
    const previous = ordered[index - 1];
    const current = ordered[index];
    if (!previous || !current) continue;
    if (previous.visual.type === "none" || current.visual.type === "none") continue;

    const previousAlternative = previous.visual.alternatives.find(
      (alternative) => alternative.id === previous.visual.selectedAlternativeId,
    );
    const currentAlternative = current.visual.alternatives.find(
      (alternative) => alternative.id === current.visual.selectedAlternativeId,
    );
    if (!previousAlternative || !currentAlternative) continue;

    const previousKinds = previousAlternative.elements.map((element) => element.kind).sort().join(",");
    const currentKinds = currentAlternative.elements.map((element) => element.kind).sort().join(",");
    const repeatsStructure =
      previous.layout === current.layout &&
      previousAlternative.compositionType === currentAlternative.compositionType &&
      previousKinds === currentKinds;

    if (repeatsStructure) {
      warnings.push({
        previousSceneId: previous.id,
        previousSceneName: previous.name,
        sceneId: current.id,
        sceneName: current.name,
        layout: current.layout,
        compositionType: currentAlternative.compositionType,
      });
    }
  }

  return warnings;
}
