import { describe, expect, it } from "vitest";
import { getSpeakerFraming } from "../src/speakerFraming";

const neutralCamera = { scale: 1, translateX: 0 };

describe("speaker framing", () => {
  it("keeps the original framing when no crop is configured", () => {
    expect(getSpeakerFraming(undefined, neutralCamera)).toEqual({
      objectPosition: "50% 50%",
      transform: "scale(1) translateX(0%)",
      transformOrigin: "center center",
    });
  });

  it("centres the configured crop and scales to cover its bounds", () => {
    expect(getSpeakerFraming(
      { x: 20, y: 10, width: 50, height: 40 },
      neutralCamera,
    )).toEqual({
      objectPosition: "45% 30%",
      transform: "scale(2.5) translateX(0%)",
      transformOrigin: "center center",
    });
  });

  it("composes camera movement with the crop scale", () => {
    expect(getSpeakerFraming(
      { x: 10, y: 15, width: 50, height: 50 },
      { scale: 1.1, translateX: -2 },
    ).transform).toBe("scale(2.2) translateX(-2%)");
  });
});
