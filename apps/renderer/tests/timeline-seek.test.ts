import { describe, expect, it } from "vitest";
import { getTimelineFrameFromPosition } from "../../editor/src/timelineSeek";

describe("timeline seeking", () => {
  const track = { trackLeft: 100, trackWidth: 400, durationFrames: 100 };

  it("maps the left edge to the first frame", () => {
    expect(getTimelineFrameFromPosition({ ...track, clientX: 100 })).toBe(0);
  });

  it("maps positions proportionally to timeline frames", () => {
    expect(getTimelineFrameFromPosition({ ...track, clientX: 300 })).toBe(50);
    expect(getTimelineFrameFromPosition({ ...track, clientX: 250 })).toBe(37);
  });

  it("clamps pointer positions outside the timeline", () => {
    expect(getTimelineFrameFromPosition({ ...track, clientX: -50 })).toBe(0);
    expect(getTimelineFrameFromPosition({ ...track, clientX: 900 })).toBe(99);
  });

  it("keeps the right edge on the final valid frame", () => {
    expect(getTimelineFrameFromPosition({ ...track, clientX: 500 })).toBe(99);
  });

  it("safely handles empty dimensions", () => {
    expect(getTimelineFrameFromPosition({ ...track, trackWidth: 0, clientX: 300 })).toBe(0);
    expect(getTimelineFrameFromPosition({ ...track, durationFrames: 0, clientX: 300 })).toBe(0);
  });
});
