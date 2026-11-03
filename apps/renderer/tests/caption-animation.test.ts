import { describe, expect, it } from "vitest";
import { getCaptionAnimationState } from "../src/captionAnimation";

describe("caption animation timing", () => {
  it("fades from transparent to opaque over the entrance window", () => {
    expect(getCaptionAnimationState("fade", 0, 20).opacity).toBe(0);
    expect(getCaptionAnimationState("fade", 4, 20).opacity).toBe(0.5);
    expect(getCaptionAnimationState("fade", 8, 20).opacity).toBe(1);
    expect(getCaptionAnimationState("fade", 20, 20).opacity).toBe(1);
  });

  it("slides upward and clamps at its final position", () => {
    expect(getCaptionAnimationState("slide", 0, 20).translateY).toBe(14);
    expect(getCaptionAnimationState("slide", 4, 20).translateY).toBe(7);
    expect(getCaptionAnimationState("slide", 8, 20).translateY).toBe(0);
    expect(getCaptionAnimationState("slide", 15, 20).translateY).toBe(0);
  });

  it("stagger-reveals words in word-pop mode", () => {
    expect(getCaptionAnimationState("word-pop", 0, 20, 0).wordOpacity).toBe(0);
    expect(getCaptionAnimationState("word-pop", 2, 20, 1).wordOpacity).toBe(0);
    expect(getCaptionAnimationState("word-pop", 5, 20, 1).wordOpacity).toBe(1);
    expect(getCaptionAnimationState("word-pop", 5, 20, 1).scale).toBe(1);
  });

  it("keeps the none animation static", () => {
    expect(getCaptionAnimationState("none", 0, 20, 3)).toEqual({
      opacity: 1,
      translateY: 0,
      scale: 1,
      wordOpacity: 1,
    });
  });

  it("uses a one-frame minimum entrance for very short captions", () => {
    expect(getCaptionAnimationState("fade", 0, 0).opacity).toBe(0);
    expect(getCaptionAnimationState("fade", 1, 0).opacity).toBe(1);
  });
});
