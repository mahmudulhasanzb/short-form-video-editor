import { describe, expect, it } from "vitest";
import { getCaptionContainerStyle } from "../src/CaptionLayer";

const style = {
  fontFamily: "Inter",
  fontSize: 48,
  fontWeight: 700,
  textColor: "#fff",
  highlightColor: "#ffe17a",
  animation: "word-pop" as const,
  position: "center" as const,
};

describe("caption layout positioning", () => {
  it("keeps split-layout captions inside the graphic half at its lower edge", () => {
    expect(getCaptionContainerStyle(style, "split-50-50")).toMatchObject({
      bottom: "5%",
      top: undefined,
      left: "7%",
      right: "7%",
    });
  });

  it("respects the selected caption position on full-speaker scenes", () => {
    expect(getCaptionContainerStyle(style, "full-speaker")).toMatchObject({
      top: "45%",
      bottom: undefined,
    });
  });

  it("respects the selected caption position on full-canvas scenes", () => {
    expect(getCaptionContainerStyle({ ...style, position: "top" }, "full-canvas")).toMatchObject({
      top: "9%",
      bottom: undefined,
    });
  });
});
