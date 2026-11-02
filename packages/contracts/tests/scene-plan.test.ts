import { describe, expect, it } from "vitest";
import { scenePlanSchema } from "../src/scene-plan.js";

const validPlan = {
  schemaVersion: "1.0.0",
  project: {
    id: "project-01",
    name: "Example project",
    width: 1080,
    height: 1920,
    fps: 30,
    durationFrames: 300,
  },
  source: {
    videoAssetId: "source-video",
    transcriptAssetId: "source-transcript",
  },
  scenes: [
    {
      id: "scene-01",
      name: "Opening",
      startFrame: 0,
      endFrame: 150,
      layout: "full-speaker",
      transcriptEvidence: {
        text: "A real transcript excerpt supplied for this test.",
        sourceStartMs: 0,
        sourceEndMs: 5000,
      },
      visual: {
        type: "none",
        alternatives: [],
        selectedAlternativeId: null,
      },
      captions: {
        enabled: true,
        chunks: [
          {
            id: "caption-01",
            startFrame: 10,
            endFrame: 60,
            words: [
              { id: "word-01", text: "A", highlighted: false },
              { id: "word-02", text: "real", highlighted: true },
              { id: "word-03", text: "example", highlighted: false },
            ],
          },
        ],
        style: {
          fontFamily: "Inter",
          fontSize: 64,
          textColor: "#FFFFFF",
          highlightColor: "#FDE047",
        },
      },
      cameraMotion: {
        enabled: false,
        type: null,
      },
      soundEffects: [],
    },
  ],
};

describe("scenePlanSchema", () => {
  it("accepts a valid plan and applies documented defaults", () => {
    const parsed = scenePlanSchema.parse(validPlan);

    expect(parsed.project.defaultCaptionWordsPerChunk).toBe(4);
    expect(parsed.scenes[0]?.cameraMotion.intensity).toBe(0.2);
    expect(parsed.scenes[0]?.captions.style.animation).toBe("word-pop");
  });

  it("rejects scenes that extend beyond the project duration", () => {
    const result = scenePlanSchema.safeParse({
      ...validPlan,
      scenes: [{ ...validPlan.scenes[0], endFrame: 400 }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects overlapping scenes", () => {
    const first = validPlan.scenes[0];
    const result = scenePlanSchema.safeParse({
      ...validPlan,
      scenes: [
        first,
        { ...first, id: "scene-02", startFrame: 100, endFrame: 200 },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a selected alternative that does not exist", () => {
    const first = validPlan.scenes[0];
    const result = scenePlanSchema.safeParse({
      ...validPlan,
      scenes: [
        {
          ...first,
          visual: {
            type: "typography",
            alternatives: [],
            selectedAlternativeId: "missing",
          },
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects caption chunks outside their scene range", () => {
    const first = validPlan.scenes[0];
    const result = scenePlanSchema.safeParse({
      ...validPlan,
      scenes: [
        {
          ...first,
          captions: {
            ...first.captions,
            chunks: [
              {
                ...first.captions.chunks[0],
                startFrame: 140,
                endFrame: 160,
              },
            ],
          },
        },
      ],
    });

    expect(result.success).toBe(false);
  });
  it("accepts supplied footage as a video visual element with optional source trim", () => {
    const first = validPlan.scenes[0];
    const result = scenePlanSchema.safeParse({
      ...validPlan,
      scenes: [
        {
          ...first,
          visual: {
            type: "image",
            alternatives: [
              {
                id: "visual-01",
                label: "Relevant supplied footage",
                compositionType: "image-led",
                rationale: "The supplied clip illustrates the spoken topic.",
                elements: [
                  {
                    id: "footage-01",
                    kind: "video",
                    assetId: "b-roll-01",
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    zIndex: 1,
                    mediaStartFrame: 45,
                    mediaEndFrame: 135,
                    style: { objectFit: "cover" },
                  },
                ],
              },
            ],
            selectedAlternativeId: "visual-01",
          },
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a video visual element with an invalid source trim", () => {
    const first = validPlan.scenes[0];
    const result = scenePlanSchema.safeParse({
      ...validPlan,
      scenes: [
        {
          ...first,
          visual: {
            type: "image",
            alternatives: [
              {
                id: "visual-01",
                label: "Invalid trim",
                compositionType: "image-led",
                rationale: "Test invalid source trim.",
                elements: [
                  {
                    id: "footage-01",
                    kind: "video",
                    assetId: "b-roll-01",
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    zIndex: 1,
                    mediaStartFrame: 135,
                    mediaEndFrame: 45,
                  },
                ],
              },
            ],
            selectedAlternativeId: "visual-01",
          },
        },
      ],
    });

    expect(result.success).toBe(false);
  });

});
