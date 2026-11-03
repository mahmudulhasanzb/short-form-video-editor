import { describe, expect, it } from "vitest";
import { getVisualElementStyle } from "../src/visualElementStyle";

const element = {
  x: 12,
  y: 18,
  width: 44,
  height: 26,
  zIndex: 3,
  opacity: 0.8,
  rotation: -4,
  style: {},
};

describe("getVisualElementStyle", () => {
  it("uses structured geometry as the source of truth", () => {
    const style = getVisualElementStyle({
      ...element,
      style: {
        position: "fixed",
        left: "0",
        top: "0",
        width: "100vw",
        height: "100vh",
        zIndex: 999,
        opacity: 0,
        transform: "scale(20)",
        overflow: "visible",
        background: "#111827",
        borderRadius: 16,
      },
    });

    expect(style).toMatchObject({
      position: "absolute",
      left: "12%",
      top: "18%",
      width: "44%",
      height: "26%",
      zIndex: 3,
      opacity: 0.8,
      transform: "rotate(-4deg)",
      overflow: "hidden",
      background: "#111827",
      borderRadius: 16,
    });
  });

  it("preserves appearance styles and ignores undefined values", () => {
    const style = getVisualElementStyle({
      ...element,
      style: {
        color: "#fff",
        fontSize: 42,
        objectFit: "contain",
        textShadow: undefined,
      },
    });

    expect(style).toMatchObject({
      color: "#fff",
      fontSize: 42,
      objectFit: "contain",
    });
    expect("textShadow" in style).toBe(false);
  });
});
