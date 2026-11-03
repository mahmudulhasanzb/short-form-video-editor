import { describe, expect, it } from "vitest";
import { getRepeatedSoundCueWarnings } from "../src/repeated-sound-cues.js";
import type { ScenePlan } from "../src/scene-plan.js";

const scene = {
  id: "scene-1",
  name: "First",
  startFrame: 0,
  endFrame: 100,
  soundEffects: [{ id: "cue-1", assetId: "whoosh-a", startFrame: 10, durationFrames: 12, volumeDb: -18, enabled: true }],
} as ScenePlan["scenes"][number];

describe("getRepeatedSoundCueWarnings", () => {
  it("flags an enabled sound reused in the next scene", () => {
    const next = {
      ...scene,
      id: "scene-2",
      name: "Second",
      startFrame: 100,
      endFrame: 200,
      soundEffects: [{ ...scene.soundEffects[0]!, id: "cue-2" }],
    };
    expect(getRepeatedSoundCueWarnings([next, scene])).toEqual([{
      previousSceneId: "scene-1",
      previousSceneName: "First",
      sceneId: "scene-2",
      sceneName: "Second",
      assetIds: ["whoosh-a"],
    }]);
  });

  it("ignores disabled cues and different assets", () => {
    const next = {
      ...scene,
      id: "scene-2",
      startFrame: 100,
      endFrame: 200,
      soundEffects: [{ ...scene.soundEffects[0]!, id: "cue-2", enabled: false }],
    };
    expect(getRepeatedSoundCueWarnings([scene, next])).toHaveLength(0);
  });
});
