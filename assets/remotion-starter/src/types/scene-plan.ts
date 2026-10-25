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
  /** Content type from MD Section 3 */
  contentType: ContentType;
  /** Layout type: Full Speaker, 50/50 Split, or 100% Full Canvas */
  layoutType: LayoutType;
  /** Main focal point of this scene */
  mainFocus: string;

  /** Required Part 4: One sentence explanation of visual idea and why */
  visualIdea: string;
  /** Required Part 4: Exact spoken words and timestamps from transcript */
  transcriptEvidence: string;
  /** Required Part 4: 'transcript' or user-supplied source filename */
  visualSource: string;
  /** Required Part 6: Reason for sound cue with trigger */
  soundReason?: string;

  /** Caption mode: Mode A, Mode B, or None */
  captionMode: CaptionMode;
  /** Caption tokens or text */
  captionTokens?: CaptionToken[];
  captionText?: string;
  /** 2-3 word audio-timed caption chunks */
  captionChunks?: CaptionChunk[];
  /** UI card requirement */
  uiCardNeed: UICardType;
  /** Specific UI card props */
  uiCardProps?: Record<string, unknown>;
  /** Card lifespan within scene (absolute or relative frames) */
  uiCardStartFrame?: number | null;
  uiCardEndFrame?: number | null;
  /** User-supplied source reference */
  sourceReference?: SourceReference | null;
  /** Required person crop verification if layoutType is 50/50 Split */
  splitPersonCrop?: PersonCropMeasurements;
  /** Sound cues for this scene */
  soundCues: SoundCue[];
  /** Start and end timings */
  startTimestamp?: string;
  endTimestamp?: string;
  startFrame: number;
  endFrame: number;
  /** Font sizes for sans and script words */
  fontSize: number;
  highlightFontSize: number;
  /** Background variant if 100% Full Canvas */
  canvasVariant?: "warm-grid" | "plain-white" | "white-shadow-grid";
  /** Speaker asset URL / staticFile */
  speakerSrc?: string | null;
}

export interface SceneValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a scene plan against the strict specification.
 * Flags missing fields explicitly without guessing.
 */
export function validateScenePlanItem(scene: ScenePlanItem): SceneValidationResult {
  const errors: string[] = [];

  if (!scene.contentType) {
    errors.push(`Scene #${scene.sceneNumber}: Missing 'contentType' (must be one of the MD types).`);
  }
  if (!scene.layoutType) {
    errors.push(`Scene #${scene.sceneNumber}: Missing 'layoutType' (must be Full Speaker, 50/50 Split, or 100% Full Canvas).`);
  }
  if (!scene.mainFocus || scene.mainFocus.trim() === "") {
    errors.push(`Scene #${scene.sceneNumber}: Missing 'mainFocus' description.`);
  }

  // Part 4 Core Requirements: Transcript Evidence and Visual Idea
  if (!scene.visualIdea || scene.visualIdea.trim() === "") {
    errors.push(`Scene #${scene.sceneNumber}: Missing required 'visualIdea'.`);
  }
  if (!scene.transcriptEvidence || scene.transcriptEvidence.trim() === "") {
    errors.push(`Scene #${scene.sceneNumber}: Missing required 'transcriptEvidence'.`);
  }
  if (!scene.visualSource || scene.visualSource.trim() === "") {
    errors.push(`Scene #${scene.sceneNumber}: Missing required 'visualSource'.`);
  }

  if (!scene.captionMode) {
    errors.push(`Scene #${scene.sceneNumber}: Missing 'captionMode' (must be Mode A, Mode B, or None).`);
  }
  if (!scene.uiCardNeed) {
    errors.push(`Scene #${scene.sceneNumber}: Missing 'uiCardNeed' (specify card name or 'none').`);
  }
  if (scene.startFrame === undefined || scene.startFrame === null || scene.endFrame === undefined || scene.endFrame === null) {
    errors.push(`Scene #${scene.sceneNumber}: Missing 'startFrame' or 'endFrame'.`);
  }
  if (scene.fontSize === undefined || scene.fontSize === null || scene.fontSize <= 0) {
    errors.push(`Scene #${scene.sceneNumber}: Missing valid 'fontSize'.`);
  }
  if (scene.highlightFontSize === undefined || scene.highlightFontSize === null || scene.highlightFontSize <= 0) {
    errors.push(`Scene #${scene.sceneNumber}: Missing valid 'highlightFontSize'.`);
  }

  // Strict Split Rule Check
  if (scene.layoutType === "50/50 Split") {
    if (!scene.splitPersonCrop) {
      errors.push(
        `Scene #${scene.sceneNumber}: 50/50 Split requires 'splitPersonCrop' (headTopPercent, eyeLinePercent, chinPercent). Cannot take raw bottom 50%!`
      );
    } else {
      const { headTopPercent, eyeLinePercent, chinPercent } = scene.splitPersonCrop;
      if (headTopPercent === undefined || eyeLinePercent === undefined || chinPercent === undefined) {
        errors.push(
          `Scene #${scene.sceneNumber}: 'splitPersonCrop' missing headTop, eyeLine, or chin measurement.`
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const ScenePlanItemSchema = z.object({
  id: z.string(),
  sceneNumber: z.number(),
  contentType: z.enum([
    "Text Only",
    "Text + Object",
    "Text + Graphic",
    "Person in Center",
    "Person on Side",
    "Object (Middle) + Text",
    "Object + Graphic",
    "Graphic Centric Animation",
    "Documentary 3D",
  ]),
  layoutType: z.enum(["Full Speaker", "50/50 Split", "100% Full Canvas"]),
  mainFocus: z.string().min(1),
  visualIdea: z.string().min(1),
  transcriptEvidence: z.string().min(1),
  visualSource: z.string().min(1),
  soundReason: z.string().optional(),
  captionMode: z.enum(["Mode A", "Mode B", "None"]),
  uiCardNeed: z.enum([
    "none",
    "DarkGlassNumberedPill",
    "BeginnerProSlider",
    "TiltedMockupCard",
    "BrowserWindowMockup",
    "TimelineCard",
    "SoundWaveCard",
    "ProductLogoCard",
    "LoadingSegmentsCard",
    "ColorSwatchesCard",
    "DashedBadgeCard",
    "GlossyPlayCard",
    "SoundPadMatrixCard",
  ]),
  startFrame: z.number().int().nonnegative(),
  endFrame: z.number().int().positive(),
  fontSize: z.number().positive(),
  highlightFontSize: z.number().positive(),
  splitPersonCrop: z
    .object({
      headTopPercent: z.number(),
      eyeLinePercent: z.number(),
      chinPercent: z.number(),
      shouldersPercent: z.number().optional(),
    })
    .optional(),
});
