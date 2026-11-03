import { describe, expect, it } from "vitest";
import { getSoundCueTiming } from "../src/soundCueTiming";

describe("sound cue timing", () => {
  const base = {
    sceneStartFrame: 100,
    sceneEndFrame: 160,
    cueStartFrame: 112,
    cueDurationFrames: 20,
    volumeDb: -12,
  };

  it("converts project frames to scene-relative timing", () => {
    expect(getSoundCueTiming(base)).toEqual({
      from: 12,
      durationInFrames: 20,
      volume: expect.closeTo(0.2511886, 6),
    });
  });

  it("trims cues that would run beyond the scene", () => {
    expect(getSoundCueTiming({ ...base, cueStartFrame: 150, cueDurationFrames: 30 })).toEqual({
      from: 50,
      durationInFrames: 10,
      volume: expect.closeTo(0.2511886, 6),
    });
  });

  it("returns null when a cue starts outside the scene", () => {
    expect(getSoundCueTiming({ ...base, cueStartFrame: 160 })).toBeNull();
    expect(getSoundCueTiming({ ...base, cueStartFrame: 99 })).toBeNull();
  });

  it("converts decibels to linear gain", () => {
    expect(getSoundCueTiming({ ...base, volumeDb: 0 })?.volume).toBe(1);
    expect(getSoundCueTiming({ ...base, volumeDb: -6 })?.volume).toBeCloseTo(0.501187, 6);
    expect(getSoundCueTiming({ ...base, volumeDb: 6 })?.volume).toBeCloseTo(1.995262, 6);
  });
});
