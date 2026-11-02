import { describe, expect, it } from "vitest";
import { requireAsset } from "../src/types";

describe("renderer asset resolution", () => {
  it("resolves an explicitly mapped asset", () => {
    expect(requireAsset({ video: "/workspace/input.mp4" }, "video", "source")).toBe("/workspace/input.mp4");
  });

  it("fails instead of substituting a placeholder for a missing asset", () => {
    expect(() => requireAsset({}, "missing", "scene visual")).toThrow(/Missing asset "missing"/);
  });
});
