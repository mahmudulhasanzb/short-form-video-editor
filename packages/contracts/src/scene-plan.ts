import { z } from "zod";

const frame = z.number().int().nonnegative();
const normalizedPercent = z.number().min(0).max(100);

export const layoutSchema = z.enum([
  "full-speaker",
  "split-50-50",
  "full-canvas",
]);

export const visualTypeSchema = z.enum([
  "ui",
  "diagram",
  "object",
  "image",
  "typography",
  "none",
]);

export const visualElementSchema = z
  .object({
    id: z.string().min(1),
    kind: z.enum(["text", "image", "video", "shape", "icon", "line"]),
    x: normalizedPercent,
    y: normalizedPercent,
    width: z.number().positive().max(100),
    height: z.number().positive().max(100),
    zIndex: z.number().int(),
    rotation: z.number().min(-360).max(360).default(0),
    opacity: z.number().min(0).max(1).default(1),
    text: z.string().optional(),
    assetId: z.string().min(1).optional(),
    /** Optional source-media trim in frames. Used by video elements only. */
    mediaStartFrame: frame.optional(),
    mediaEndFrame: frame.optional(),
    /** Scene-relative display window for video overlays. */
    timelineStartFrame: frame.optional(),
    timelineEndFrame: frame.optional(),
    style: z.record(z.unknown()).default({}),
  })
  .strict()
  .superRefine((element, context) => {
    if (element.x + element.width > 100) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["width"],
        message: "Element extends beyond the right edge of the canvas.",
      });
    }
    if (element.y + element.height > 100) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["height"],
        message: "Element extends beyond the bottom edge of the canvas.",
      });
    }
    if (element.kind === "text" && !element.text?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["text"],
        message: "Text elements require non-empty text.",
      });
    }
    if (["image", "icon", "video"].includes(element.kind) && !element.assetId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["assetId"],
        message: "Image, video, and icon elements require an assetId.",
      });
    }
    if (element.kind === "video") {
      if (
        element.mediaStartFrame !== undefined &&
        element.mediaEndFrame !== undefined &&
        element.mediaEndFrame <= element.mediaStartFrame
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mediaEndFrame"],
          message: "Video mediaEndFrame must be greater than mediaStartFrame.",
        });
      }
      if (element.timelineStartFrame !== undefined && element.timelineEndFrame !== undefined && element.timelineEndFrame <= element.timelineStartFrame) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["timelineEndFrame"], message: "Video timelineEndFrame must be greater than timelineStartFrame." });
      }
    } else if (
      element.mediaStartFrame !== undefined || element.mediaEndFrame !== undefined ||
      element.timelineStartFrame !== undefined || element.timelineEndFrame !== undefined
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mediaStartFrame"],
        message: "Source-media trim fields are only valid for video elements.",
      });
    }
  });

export const visualAlternativeSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    compositionType: z.enum([
      "ui-card",
      "diagram",
      "typography",
      "image-led",
      "object-led",
      "custom",
    ]),
    rationale: z.string().min(1),
    elements: z.array(visualElementSchema),
  })
  .strict();

export const captionWordSchema = z
  .object({
    id: z.string().min(1),
    text: z.string().min(1),
    highlighted: z.boolean().default(false),
  })
  .strict();

export const captionChunkSchema = z
  .object({
    id: z.string().min(1),
    startFrame: frame,
    endFrame: frame,
    words: z.array(captionWordSchema).min(1),
  })
  .strict()
  .refine((chunk) => chunk.endFrame > chunk.startFrame, {
    message: "Caption endFrame must be greater than startFrame.",
    path: ["endFrame"],
  });

export const captionStyleSchema = z
  .object({
    fontFamily: z.string().min(1),
    fontSize: z.number().positive(),
    fontWeight: z.number().int().min(100).max(900).default(700),
    textColor: z.string().min(1),
    highlightColor: z.string().min(1),
    animation: z.enum(["word-pop", "fade", "slide", "none"]).default("word-pop"),
    position: z.enum(["top", "center", "bottom"]).default("bottom"),
  })
  .strict();

export const cameraMotionSchema = z
  .object({
    enabled: z.boolean().default(false),
    type: z.enum(["zoom-in", "zoom-out", "pan-left", "pan-right"]).nullable(),
    intensity: z.number().min(0).max(1).default(0.2),
  })
  .strict()
  .superRefine((motion, context) => {
    if (motion.enabled && motion.type === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["type"],
        message: "Enabled camera motion requires a motion type.",
      });
    }
  });

export const soundEffectSchema = z
  .object({
    id: z.string().min(1),
    assetId: z.string().min(1),
    startFrame: frame,
    durationFrames: z.number().int().positive(),
    volumeDb: z.number().min(-60).max(6),
    enabled: z.boolean().default(true),
  })
  .strict();

export const speakerCropSchema = z
  .object({
    x: normalizedPercent,
    y: normalizedPercent,
    width: z.number().positive().max(100),
    height: z.number().positive().max(100),
    eyeLinePercent: normalizedPercent,
  })
  .strict()
  .refine((crop) => crop.x + crop.width <= 100 && crop.y + crop.height <= 100, {
    message: "Speaker crop must remain inside the source frame.",
  });

export const sceneSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    startFrame: frame,
    endFrame: frame,
    layout: layoutSchema,
    speakerCrop: speakerCropSchema.optional(),
    transcriptEvidence: z
      .object({
        text: z.string().min(1),
        sourceStartMs: z.number().nonnegative(),
        sourceEndMs: z.number().positive(),
      })
      .strict(),
    visual: z
      .object({
        type: visualTypeSchema,
        alternatives: z.array(visualAlternativeSchema),
        selectedAlternativeId: z.string().min(1).nullable(),
      })
      .strict(),
    captions: z
      .object({
        enabled: z.boolean().default(true),
        chunks: z.array(captionChunkSchema),
        style: captionStyleSchema,
      })
      .strict(),
    cameraMotion: cameraMotionSchema,
    soundEffects: z.array(soundEffectSchema),
  })
  .strict()
  .superRefine((scene, context) => {
    if (scene.endFrame <= scene.startFrame) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endFrame"],
        message: "Scene endFrame must be greater than startFrame.",
      });
    }

    const selectedId = scene.visual.selectedAlternativeId;
    if (
      selectedId !== null &&
      !scene.visual.alternatives.some((alternative) => alternative.id === selectedId)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["visual", "selectedAlternativeId"],
        message: "Selected visual alternative does not exist in this scene.",
      });
    }

    if (scene.visual.type === "none" && selectedId !== null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["visual", "selectedAlternativeId"],
        message: "A no-graphic scene cannot select a visual alternative.",
      });
    }

    for (const alternative of scene.visual.alternatives) {
      for (const element of alternative.elements) {
        if (element.kind !== "video") continue;
        const start = element.timelineStartFrame ?? 0;
        const end = element.timelineEndFrame ?? scene.endFrame - scene.startFrame;
        if (end > scene.endFrame - scene.startFrame || start >= end) {
          context.addIssue({ code: z.ZodIssueCode.custom, path: ["visual", "alternatives", alternative.id, "elements", element.id], message: "Video overlay timeline range must be positive and remain inside its scene." });
        }
      }
    }

    for (const [index, chunk] of scene.captions.chunks.entries()) {
      if (
        chunk.startFrame < scene.startFrame ||
        chunk.endFrame > scene.endFrame
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["captions", "chunks", index],
          message: "Caption timing must stay inside its parent scene.",
        });
      }
    }
  });

export const scenePlanSchema = z
  .object({
    schemaVersion: z.literal("1.0.0"),
    project: z
      .object({
        id: z.string().min(1),
        name: z.string().min(1),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        fps: z.number().positive(),
        durationFrames: z.number().int().positive(),
        defaultCaptionWordsPerChunk: z.number().int().min(1).max(8).default(4),
      })
      .strict(),
    source: z
      .object({
        videoAssetId: z.string().min(1),
        transcriptAssetId: z.string().min(1),
      })
      .strict(),
    scenes: z.array(sceneSchema).min(1),
  })
  .strict()
  .superRefine((plan, context) => {
    const sceneIds = new Set<string>();
    const orderedScenes = [...plan.scenes].sort(
      (a, b) => a.startFrame - b.startFrame,
    );

    for (const [index, scene] of plan.scenes.entries()) {
      if (sceneIds.has(scene.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["scenes", index, "id"],
          message: "Scene IDs must be unique.",
        });
      }
      sceneIds.add(scene.id);

      if (scene.endFrame > plan.project.durationFrames) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["scenes", index, "endFrame"],
          message: "Scene extends beyond the project duration.",
        });
      }
    }

    for (let index = 1; index < orderedScenes.length; index += 1) {
      const previous = orderedScenes[index - 1];
      const current = orderedScenes[index];
      if (previous && current && current.startFrame < previous.endFrame) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["scenes"],
          message: "Scenes must not overlap.",
        });
      }
    }
  });

export type ScenePlan = z.infer<typeof scenePlanSchema>;
export type ScenePlanInput = z.input<typeof scenePlanSchema>;
