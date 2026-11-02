import { z } from "zod";
import { LayoutType, PersonCropMeasurements } from "./layout";
import { CaptionMode, CaptionToken, CaptionChunk } from "./captions";
import { SoundCue } from "./sound";

export type ContentType =
  | "Text Only"
  | "Text + Object"
  | "Text + Graphic"
  | "Person in Center"
  | "Person on Side"
  | "Object (Middle) + Text"
  | "Object + Graphic"
  | "Graphic Centric Animation"
  | "Documentary 3D";

export type UICardType =
  | "none"
  | "DarkGlassNumberedPill"
  | "BeginnerProSlider"
  | "TiltedMockupCard"
  | "BrowserWindowMockup"
  | "TimelineCard"
  | "SoundWaveCard"
  | "ProductLogoCard"
  | "LoadingSegmentsCard"
  | "ColorSwatchesCard"
  | "DashedBadgeCard"
  | "GlossyPlayCard"
  | "SoundPadMatrixCard";

export type SceneVisualType =
  | "ui"
  | "diagram"
  | "object"
  | "image"
  | "typography"
  | "none";

export type CameraMotionType = "none" | "push-in" | "pull-out" | "pan-left" | "pan-right";

export interface SceneVisualElement {
  id: string;
  type: SceneVisualType;
  label: string;
  text?: string;
  source?: string;
  /** Position and size are percentages of the composition frame. */
  position: { x: number; y: number; width: number; height: number };
  zIndex: number;
  style?: Record<string, string | number | boolean>;
}

export interface SceneVisualAlternative {
  id: string;
  label: string;
  compositionType: string;
  elements: SceneVisualElement[];
  rationale?: string;
}

export interface SceneCameraMotion {
  enabled: boolean;
  type: CameraMotionType;
  intensity?: number;
  startFrame?: number;
  endFrame?: number;
}

export interface SceneSoundEffect extends SoundCue {
  /** Optional preview source; does not change the render source. */
  previewUrl?: string;
  /** Scene-relative frame offset when true. */
  relativeToScene?: boolean;
}

export interface SourceReference {
  fileName?: string | null;
  showStartFrame?: number | null;
  showEndFrame?: number | null;
  layout?: "full" | "split" | null;
  notes?: string;
}

export interface ScenePlanItem {
  id: string;
  sceneNumber: number;
  /** Scene direction / brief instruction */
  instruction?: string;
  contentType: ContentType;
  layoutType: LayoutType;
  mainFocus: string;
  visualIdea: string;
  transcriptEvidence: string;
  visualSource: string;
  soundReason?: string;
  captionMode: CaptionMode;
  captionTokens?: CaptionToken[];
  captionText?: string;
  /** Audio-timed caption chunks. Editor defaults to 3–4 words per chunk. */
  captionChunks?: CaptionChunk[];
  uiCardNeed: UICardType;
  uiCardProps?: Record<string, unknown>;
  uiCardStartFrame?: number | null;
  uiCardEndFrame?: number | null;
  sourceReference?: SourceReference | null;
  splitPersonCrop?: PersonCropMeasurements;
  soundCues: SoundCue[];
  startTimestamp?: string;
  endTimestamp?: string;
  startFrame: number;
  endFrame: number;
  fontSize: number;
  highlightFontSize: number;
  canvasVariant?: "warm-grid" | "plain-white" | "white-shadow-grid";
  speakerSrc?: string | null;

  /** Editor-first fields. Optional to keep existing plans readable. */
  visualType?: SceneVisualType;
  visualElements?: SceneVisualElement[];
  visualAlternatives?: SceneVisualAlternative[];
  selectedVisualAlternativeId?: string | null;
  cameraMotion?: SceneCameraMotion;
  captionStyle?: {
    fontFamily?: string;
    fontSize?: number;
    highlightFontFamily?: string;
    highlightFontSize?: number;
    textColor?: string;
    highlightColor?: string;
    chunkWordCount?: number;
  };
  editorNotes?: string;
}

const PercentPositionSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().positive().max(100),
  height: z.number().positive().max(100),
});

export const SceneVisualElementSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["ui", "diagram", "object", "image", "typography", "none"]),
  label: z.string().min(1),
  text: z.string().optional(),
  source: z.string().optional(),
  position: PercentPositionSchema,
  zIndex: z.number().int(),
  style: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export const SceneVisualAlternativeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  compositionType: z.string().min(1),
  elements: z.array(SceneVisualElementSchema),
  rationale: z.string().optional(),
});

export const SceneCameraMotionSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(["none", "push-in", "pull-out", "pan-left", "pan-right"]),
  intensity: z.number().min(0).max(1).optional(),
  startFrame: z.number().int().nonnegative().optional(),
  endFrame: z.number().int().nonnegative().optional(),
}).refine(
  (motion) => motion.startFrame === undefined || motion.endFrame === undefined || motion.endFrame >= motion.startFrame,
  { message: "Camera motion endFrame must be greater than or equal to startFrame." },
);

export interface SceneValidationResult {
  isValid: boolean;
  errors: string[];
}

/** Validates required legacy fields and editor fields without guessing missing values. */
export function validateScenePlanItem(scene: ScenePlanItem): SceneValidationResult {
  const errors: string[] = [];

  if (!scene.contentType) errors.push(`Scene #${scene.sceneNumber}: Missing 'contentType'.`);
  if (!scene.layoutType) errors.push(`Scene #${scene.sceneNumber}: Missing 'layoutType'.`);
  if (!scene.mainFocus?.trim()) errors.push(`Scene #${scene.sceneNumber}: Missing 'mainFocus'.`);
  if (!scene.visualIdea?.trim()) errors.push(`Scene #${scene.sceneNumber}: Missing 'visualIdea'.`);
  if (!scene.transcriptEvidence?.trim()) errors.push(`Scene #${scene.sceneNumber}: Missing 'transcriptEvidence'.`);
  if (!scene.visualSource?.trim()) errors.push(`Scene #${scene.sceneNumber}: Missing 'visualSource'.`);
  if (!scene.captionMode) errors.push(`Scene #${scene.sceneNumber}: Missing 'captionMode'.`);
  if (!scene.uiCardNeed) errors.push(`Scene #${scene.sceneNumber}: Missing 'uiCardNeed'.`);

  if (!Number.isInteger(scene.startFrame) || scene.startFrame < 0) {
    errors.push(`Scene #${scene.sceneNumber}: 'startFrame' must be a non-negative integer.`);
  }
  if (!Number.isInteger(scene.endFrame) || scene.endFrame <= scene.startFrame) {
    errors.push(`Scene #${scene.sceneNumber}: 'endFrame' must be greater than 'startFrame'.`);
  }
  if (!Number.isFinite(scene.fontSize) || scene.fontSize <= 0) errors.push(`Scene #${scene.sceneNumber}: Invalid 'fontSize'.`);
  if (!Number.isFinite(scene.highlightFontSize) || scene.highlightFontSize <= 0) errors.push(`Scene #${scene.sceneNumber}: Invalid 'highlightFontSize'.`);

  if (scene.layoutType === "50/50 Split") {
    if (!scene.splitPersonCrop) {
      errors.push(`Scene #${scene.sceneNumber}: 50/50 Split requires 'splitPersonCrop'.`);
    } else {
      const { headTopPercent, eyeLinePercent, chinPercent } = scene.splitPersonCrop;
      if ([headTopPercent, eyeLinePercent, chinPercent].some((value) => value === undefined || value < 0 || value > 100)) {
        errors.push(`Scene #${scene.sceneNumber}: Crop measurements must be between 0 and 100.`);
      }
      if (!(headTopPercent < eyeLinePercent && eyeLinePercent < chinPercent)) {
        errors.push(`Scene #${scene.sceneNumber}: Crop positions must follow head top < eye line < chin.`);
      }
    }
  }

  const editorSchemaResult = z.object({
    visualType: z.enum(["ui", "diagram", "object", "image", "typography", "none"]).optional(),
    visualElements: z.array(SceneVisualElementSchema).optional(),
    visualAlternatives: z.array(SceneVisualAlternativeSchema).optional(),
    selectedVisualAlternativeId: z.string().nullable().optional(),
    cameraMotion: SceneCameraMotionSchema.optional(),
    captionStyle: z.object({
      fontFamily: z.string().optional(),
      fontSize: z.number().positive().optional(),
      highlightFontFamily: z.string().optional(),
      highlightFontSize: z.number().positive().optional(),
      textColor: z.string().optional(),
      highlightColor: z.string().optional(),
      chunkWordCount: z.number().int().min(1).max(12).optional(),
    }).optional(),
    editorNotes: z.string().optional(),
  }).safeParse(scene);

  if (!editorSchemaResult.success) {
    errors.push(...editorSchemaResult.error.issues.map((issue) => `Scene #${scene.sceneNumber}: ${issue.path.join(".") || "editor fields"} — ${issue.message}`));
  }

  if (scene.selectedVisualAlternativeId && scene.visualAlternatives?.length &&
      !scene.visualAlternatives.some((alternative) => alternative.id === scene.selectedVisualAlternativeId)) {
    errors.push(`Scene #${scene.sceneNumber}: Selected visual alternative does not exist.`);
  }

  return { isValid: errors.length === 0, errors };
}

export const ScenePlanItemSchema = z.object({
  id: z.string(),
  sceneNumber: z.number().int().nonnegative(),
  instruction: z.string().optional(),
  contentType: z.enum([
    "Text Only", "Text + Object", "Text + Graphic", "Person in Center", "Person on Side",
    "Object (Middle) + Text", "Object + Graphic", "Graphic Centric Animation", "Documentary 3D",
  ]),
  layoutType: z.enum(["Full Speaker", "50/50 Split", "100% Full Canvas"]),
  mainFocus: z.string().min(1),
  visualIdea: z.string().min(1),
  transcriptEvidence: z.string().min(1),
  visualSource: z.string().min(1),
  soundReason: z.string().optional(),
  captionMode: z.enum(["Mode A", "Mode B", "None"]),
  captionTokens: z.array(z.any()).optional(),
  captionText: z.string().optional(),
  captionChunks: z.array(z.any()).optional(),
  uiCardNeed: z.enum([
    "none", "DarkGlassNumberedPill", "BeginnerProSlider", "TiltedMockupCard", "BrowserWindowMockup",
    "TimelineCard", "SoundWaveCard", "ProductLogoCard", "LoadingSegmentsCard", "ColorSwatchesCard",
    "DashedBadgeCard", "GlossyPlayCard", "SoundPadMatrixCard",
  ]),
  uiCardProps: z.record(z.string(), z.unknown()).optional(),
  uiCardStartFrame: z.number().int().nullable().optional(),
  uiCardEndFrame: z.number().int().nullable().optional(),
  sourceReference: z.any().optional(),
  splitPersonCrop: z.object({
    headTopPercent: z.number().min(0).max(100),
    eyeLinePercent: z.number().min(0).max(100),
    chinPercent: z.number().min(0).max(100),
    shouldersPercent: z.number().min(0).max(100).optional(),
  }).optional(),
  soundCues: z.array(z.any()),
  startTimestamp: z.string().optional(),
  endTimestamp: z.string().optional(),
  startFrame: z.number().int().nonnegative(),
  endFrame: z.number().int().positive(),
  fontSize: z.number().positive(),
  highlightFontSize: z.number().positive(),
  canvasVariant: z.enum(["warm-grid", "plain-white", "white-shadow-grid"]).optional(),
  speakerSrc: z.string().nullable().optional(),
  visualType: z.enum(["ui", "diagram", "object", "image", "typography", "none"]).optional(),
  visualElements: z.array(SceneVisualElementSchema).optional(),
  visualAlternatives: z.array(SceneVisualAlternativeSchema).optional(),
  selectedVisualAlternativeId: z.string().nullable().optional(),
  cameraMotion: SceneCameraMotionSchema.optional(),
  captionStyle: z.object({
    fontFamily: z.string().optional(),
    fontSize: z.number().positive().optional(),
    highlightFontFamily: z.string().optional(),
    highlightFontSize: z.number().positive().optional(),
    textColor: z.string().optional(),
    highlightColor: z.string().optional(),
    chunkWordCount: z.number().int().min(1).max(12).optional(),
  }).optional(),
  editorNotes: z.string().optional(),
}).superRefine((scene, ctx) => {
  if (scene.endFrame <= scene.startFrame) {
    ctx.addIssue({ code: "custom", path: ["endFrame"], message: "endFrame must be greater than startFrame." });
  }
  if (scene.selectedVisualAlternativeId && scene.visualAlternatives?.length &&
      !scene.visualAlternatives.some((alternative) => alternative.id === scene.selectedVisualAlternativeId)) {
    ctx.addIssue({ code: "custom", path: ["selectedVisualAlternativeId"], message: "Selected alternative must exist in visualAlternatives." });
  }
});
