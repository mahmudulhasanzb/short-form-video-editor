import { describe, expect, it } from "vitest";
import { getCameraTransform } from "../src/cameraMotion";

const motion = (type: NonNullable<Parameters<typeof getCameraTransform>[2]["type"]>) => ({
  enabled: true,
  type,
  intensity: 1,
});

describe("getCameraTransform", () => {
  it("keeps disabled motion static", () => {
    expect(getCameraTransform(15, 30, { ...motion("zoom-in"), enabled: false })).toEqual({
      scale: 1,
      translateX: 0,
    });
  });

  it("eases zoom-in from neutral framing to a restrained 12% push", () => {
    expect(getCameraTransform(0, 31, motion("zoom-in")).scale).toBe(1);
    expect(getCameraTransform(30, 31, motion("zoom-in")).scale).toBeCloseTo(1.12);
    expect(getCameraTransform(15, 31, motion("zoom-in")).scale).toBeCloseTo(1.06);
  });

  it("reverses the zoom for zoom-out", () => {
    expect(getCameraTransform(0, 31, motion("zoom-out")).scale).toBeCloseTo(1.12);
    expect(getCameraTransform(30, 31, motion("zoom-out")).scale).toBe(1);
  });

  it("pans smoothly in the selected direction", () => {
    expect(getCameraTransform(0, 31, motion("pan-left")).translateX).toBe(4);
    expect(getCameraTransform(30, 31, motion("pan-left")).translateX).toBe(-4);
    expect(getCameraTransform(0, 31, motion("pan-right")).translateX).toBe(-4);
    expect(getCameraTransform(30, 31, motion("pan-right")).translateX).toBe(4);
  });

  it("clamps frame progress and intensity to safe bounds", () => {
    expect(getCameraTransform(100, 10, { ...motion("zoom-in"), intensity: 3 }).scale).toBeCloseTo(1.12);
    expect(getCameraTransform(-10, 10, motion("zoom-in")).scale).toBe(1);
  });

  it("returns a neutral transform for one-frame scenes", () => {
    expect(getCameraTransform(0, 1, motion("zoom-in"))).toEqual({
      scale: 1,
      translateX: 0,
    });
  });
});
