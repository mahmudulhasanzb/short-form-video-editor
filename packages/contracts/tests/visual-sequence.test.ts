import { describe, expect, it } from "vitest";
import { getVisualSequenceWarnings } from "../src/visual-sequence.js";
import type { ScenePlan } from "../src/scene-plan.js";

const baseScene = {
  id: "scene-1",
  name: "First scene",
  startFrame: 0,
  endFrame: 100,
  layout: "split-50-50" as const,
  transcriptEvidence: { text: "Evidence", sourceStartMs: 0, sourceEndMs: 1000 },
  visual: {
    type: "ui" as const,
    alternatives: [{
      id: "alt-1",
      label: "UI card",
      compositionType: "ui-card" as const,
      rationale: "A real interface concept is being explained.",
      elements: [{
        id: "text-1",
        kind: "text" as const,
        x: 10, y: 10, width: 80, height: 20, zIndex: 1,
        text: "Example",
        style: {},
      }],
    }],
    selectedAlternativeId: "alt-1",
  },
  captions: {
    enabled: true,
    chunks: [],
    style: {
      fontFamily: "Inter", fontSize: 48, textColor: "#fff",
      highlightColor: "#0af", animation: "word-pop" as const, position: "bottom" as const,
    },
  },
  cameraMotion: { enabled: false, type: null, intensity: 0.2 },
  soundEffects: [],
};

describe("getVisualSequenceWarnings", () => {
  it("flags adjacent scenes with the same layout and composition structure", () => {
    const first = baseScene;
    const second = {
      ...baseScene,
      id: "scene-2",
      name: "Second scene",
      startFrame: 100,
      endFrame: 200,
      visual: {
        ...baseScene.visual,
        alternatives: baseScene.visual.alternatives.map((alternative) => ({
          ...alternative,
          id: "alt-2",
        })),
        selectedAlternativeId: "alt-2",
      },
    };
    const warnings = getVisualSequenceWarnings([second, first] as unknown as ScenePlan["scenes"]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({
      previousSceneName: "First scene",
      sceneName: "Second scene",
      compositionType: "ui-card",
    });
  });

  it("does not flag speaker-only scenes or genuinely different compositions", () => {
    const speakerOnly = {
      ...baseScene,
      id: "scene-2",
      startFrame: 100,
      endFrame: 200,
      visual: { type: "none" as const, alternatives: [], selectedAlternativeId: null },
    };
    expect(getVisualSequenceWarnings([baseScene, speakerOnly] as unknown as ScenePlan["scenes"])).toHaveLength(0);
  });
});
