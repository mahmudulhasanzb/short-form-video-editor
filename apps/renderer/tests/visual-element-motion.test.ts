import { describe, expect, it } from "vitest";
import { getVisualElementMotionStyle } from "../src/visual-element-motion.js";

const motion = {
  enter: "rise" as const,
  exit: "fade" as const,
  delayFrames: 4,
  durationFrames: 12,
};

describe("getVisualElementMotionStyle", () => {
  it("keeps the element hidden before its delayed entrance", () => {
    expect(getVisualElementMotionStyle(0, 90, 5, motion)).toMatchObject({
      opacity: 0,
      transform: "translate(0px, 28px) scale(1) rotate(5deg)",
    });
  });

  it("settles the element after its entrance", () => {
    expect(getVisualElementMotionStyle(16, 90, 0, motion)).toMatchObject({
      opacity: 1,
      transform: "translate(0px, 0px) scale(1) rotate(0deg)",
    });
  });

  it("fades during the final frames", () => {
    const result = getVisualElementMotionStyle(84, 90, 0, motion);
    expect(result.opacity).toBeLessThan(1);
    expect(result.opacity).toBeGreaterThanOrEqual(0);
  });

  it("does not animate elements without a motion plan", () => {
    expect(getVisualElementMotionStyle(10, 90, 12)).toEqual({
      opacity: 1,
      transform: "translate(0px, 0px) scale(1) rotate(12deg)",
    });
  });
});
