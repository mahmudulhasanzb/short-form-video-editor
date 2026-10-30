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

/** Phase 3 flexible composition types. Old card types remain as fallback, not defaults. */
export type CompositionType = "card" | "typography" | "diagram" | "object" | "image" | "none" | "custom";

export type CompositionElementKind = "text" | "shape" | "diagram" | "image" | "object" | "timeline" | "chart" | "card";

export interface CompositionElement {
  id: string;
  kind: CompositionElementKind;
  /** Text content for text, diagram, chart, or timeline elements. */
  text?: string;
  /** Source file for image, object, or card elements. */
  src?: string;
  /** Percent of the graphic canvas, 0 to 100. */
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  /** Higher layer renders on top. */
  layer: number;
  color?: string;
  background?: string;
  entrance?: "pop" | "fade" | "slide" | "zoom" | "none";
  exit?: "fade" | "slide" | "none";
  /** Absolute frames, or relative to scene start if smaller than scene.startFrame. */
  startFrame?: number;
  endFrame?: number;
}

export type CameraZoom = "none" | "zoom-in" | "zoom-out";

export interface CameraChoice {
  zoom: CameraZoom;
  /** Scale for zoom, for example 1.00 to 1.15. 1.00 means no zoom. */
  intensity?: number;
  direction?: "center" | "left" | "right" | "up" | "down";
}

/** Phase 3b video-level settings, one-time per video, not per scene. */
export interface VideoPlanSettings {
  sansFontFamily: string;
  scriptFontFamily: string;
  fontSize: number;
  highlightFontSize: number;
  captionBackgroundStyle: "fade-blur" | "none" | "dark-pill";
}

export interface PlanScreenshot {
  /** Path to a real frame extracted from cleaned.mp4, in the per-video project. */
  fileName: string;
  frame: number;
  kind: "start" | "mid" | "end" | "source";
}

export interface SoundSelection {
  /** Cue id in soundCues, for cross-reference. */
  cueId?: string;
  purpose: string;
  alternatives?: string[];
  /** True if the user explicitly selected this sound in the plan editor. */
  userSelected?: boolean;
  /** True if the user marked repetition as intentional. */
  intentionalRepetition?: boolean;
}

export interface VarietyFlag {
  sceneNumber: number;
  kind: "repeated-card" | "repeated-background" | "repeated-animation" | "repeated-sound" | "missing-sound" | "timing" | "readability" | "blank-split" | "clipping" | "overlap";
  message: string;
  suggestion?: string;
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

  /* Phase 3 plan editor fields. All are optional for backwards compatibility with old plans, but new plans must fill them where relevant. */
  /** Flexible composition choice. If omitted, old uiCardNeed behaviour applies as fallback. */
  compositionType?: CompositionType;
  /** Generic composition elements, in any order. Rendered in layer order by GenericComposition. */
  compositionElements?: CompositionElement[];
  /** 2 to 3 alternative visual approaches offered in the plan for this scene, not just card variants. */
  visualAlternatives?: string[];
  /** The alternative the user selected in the plan, if any. */
  userSelectedAlternative?: string;
  /** True if this scene's choices were explicitly selected by the user, false if they are automatic defaults. */
  userSelected?: boolean;
  /** Camera and zoom choice for this scene. */
  camera?: CameraChoice;
  /** Independent normal and highlighted font families, as selected in the plan. Must be preserved to render. */
  sansFontFamily?: string;
  scriptFontFamily?: string;
  /** Real screenshots extracted from cleaned.mp4 for this scene. */
  screenshots?: PlanScreenshot[];
  /** Sound selections with purpose and alternatives, in addition to soundCues. */
  soundSelections?: SoundSelection[];
  /** True if repetition in this scene was marked intentional by the user. */
  intentionalRepetition?: boolean;
  /** Editable graphic placement, as percentages of the graphic canvas. */
  graphicXPercent?: number;
  graphicYPercent?: number;
  graphicWidthPercent?: number;
  graphicHeightPercent?: number;
  /** Animation choice for this scene's graphic, editable in the plan. */
  animationType?: string;
  animationDirection?: string;
  animationIntensity?: number;

  /* Phase 3b fields. */
  /** Caption background style, default fade-blur. */
  captionBackgroundStyle?: "fade-blur" | "none" | "dark-pill";
  /** Card visuals on or off for this scene. Off clears compositionElements in preview and JSON. */
  cardVisualsEnabled?: boolean;
  /** Split side fill, default off. */
  sideFill?: boolean;
  /** Split bottom fade, default on. */
  splitBottomFade?: boolean;
  /** Video-level typography override for this scene only, if explicitly set. Otherwise use VideoPlanSettings. */
  sceneFontOverride?: boolean;
  /** True if this scene was added by Add Scene or Split Scene in the plan. */
  addedInPlan?: boolean;
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

  // Timing consistency: end must be after start, and UI card / composition elements must stay inside the scene.
  if (scene.endFrame <= scene.startFrame) {
    errors.push(`Scene #${scene.sceneNumber}: 'endFrame' must be greater than 'startFrame'.`);
  }
  if (scene.uiCardStartFrame !== undefined && scene.uiCardStartFrame !== null && scene.uiCardStartFrame < scene.startFrame) {
    errors.push(`Scene #${scene.sceneNumber}: 'uiCardStartFrame' is before the scene start.`);
  }
  if (scene.uiCardEndFrame !== undefined && scene.uiCardEndFrame !== null && scene.uiCardEndFrame > scene.endFrame) {
    errors.push(`Scene #${scene.sceneNumber}: 'uiCardEndFrame' is after the scene end.`);
  }
  if (scene.compositionElements) {
    for (const el of scene.compositionElements) {
      if (el.xPercent < 0 || el.xPercent > 100 || el.yPercent < 0 || el.yPercent > 100 || el.widthPercent <= 0 || el.widthPercent > 100 || el.heightPercent <= 0 || el.heightPercent > 100) {
        errors.push(`Scene #${scene.sceneNumber}: composition element '${el.id}' has out-of-range position or size percentages.`);
      }
      if (el.startFrame !== undefined && el.startFrame < scene.startFrame) {
        errors.push(`Scene #${scene.sceneNumber}: composition element '${el.id}' starts before the scene.`);
      }
      if (el.endFrame !== undefined && el.endFrame > scene.endFrame) {
        errors.push(`Scene #${scene.sceneNumber}: composition element '${el.id}' ends after the scene.`);
      }
    }
  }
  if (scene.soundCues) {
    for (const cue of scene.soundCues) {
      if (!cue.filename || cue.filename.trim() === "") {
        errors.push(`Scene #${scene.sceneNumber}: sound cue '${cue.id}' is missing a filename.`);
      }
      if (cue.frame < scene.startFrame || cue.frame > scene.endFrame) {
        errors.push(`Scene #${scene.sceneNumber}: sound cue '${cue.id}' frame is outside the scene.`);
      }
    }
  }

  // Blank-split guard, Phase 3 fix: a Split scene must have a valid visual artifact for the whole beat.
  // A valid artifact is: a non-none uiCardNeed, a non-empty compositionElements list, a sourceReference file,
  // or compositionType other than 'none'. If none of those exist, the scene is invalid as a Split and must
  // be changed to Full Speaker in the plan, not rendered with an empty top canvas.
  if (scene.layoutType === "50/50 Split") {
    const hasCard = scene.uiCardNeed !== undefined && scene.uiCardNeed !== null && scene.uiCardNeed !== "none";
    const hasElements = Array.isArray(scene.compositionElements) && scene.compositionElements.length > 0;
    const hasSource = Boolean(scene.sourceReference?.fileName);
    const hasComposition = scene.compositionType !== undefined && scene.compositionType !== null && scene.compositionType !== "none";
    if (!hasCard && !hasElements && !hasSource && !hasComposition) {
      errors.push(
        `Scene #${scene.sceneNumber}: 50/50 Split has no valid visual artifact (no card, no composition elements, no source reference). Change this beat to Full Speaker, do not render an empty split.`
      );
    }
    // If a card exists but its end frame is missing, the runtime guard cannot know when to fall back.
    // Flag it here so the plan editor must set uiCardEndFrame or provide a source or composition end.
    if (hasCard && !hasElements && !hasSource && (scene.uiCardEndFrame === undefined || scene.uiCardEndFrame === null)) {
      errors.push(
        `Scene #${scene.sceneNumber}: 50/50 Split with a card but no uiCardEndFrame. Set uiCardEndFrame, or add composition elements with end frames, so the split cannot stay empty after the card ends.`
      );
    }
  }

  // Phase 3b Full Canvas visual rule: text-only Full Canvas is invalid.
  if (scene.layoutType === "100% Full Canvas") {
    const hasElements = Array.isArray(scene.compositionElements) && scene.compositionElements.length > 0;
    const hasCard = scene.uiCardNeed !== undefined && scene.uiCardNeed !== null && scene.uiCardNeed !== "none";
    const hasSource = Boolean(scene.sourceReference?.fileName);
    if (!hasElements && !hasCard && !hasSource) {
      errors.push(
        `Scene #${scene.sceneNumber}: 100% Full Canvas has no visual or motion element, only text. Add a visual or motion element, or change this beat to Full Speaker, do not render plain text on white.`
      );
    }
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

/**
 * Variety and quality checks for a whole plan, Phase 3.
 * Returns flags, not errors. Repetition marked intentional by the user is not flagged.
 * This does not replace validateScenePlanItem, it runs after it.
 */
export function validatePlanVariety(scenes: ScenePlanItem[]): VarietyFlag[] {
  const flags: VarietyFlag[] = [];
  const sorted = [...scenes].sort((a, b) => a.sceneNumber - b.sceneNumber);
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    if (cur.intentionalRepetition || prev.intentionalRepetition) continue;
    if (cur.uiCardNeed !== "none" && cur.uiCardNeed === prev.uiCardNeed) {
      flags.push({
        sceneNumber: cur.sceneNumber,
        kind: "repeated-card",
        message: `Same card '${cur.uiCardNeed}' as previous scene.`,
        suggestion: "Consider a different composition, typography, or no graphic for this beat, or mark it intentional in the plan.",
      });
    }
    if (cur.canvasVariant && cur.canvasVariant === prev.canvasVariant && cur.layoutType !== "Full Speaker") {
      flags.push({
        sceneNumber: cur.sceneNumber,
        kind: "repeated-background",
        message: `Same background '${cur.canvasVariant}' as previous scene.`,
        suggestion: "Consider a different background treatment or a minimal scene.",
      });
    }
    if (cur.animationType && cur.animationType === prev.animationType) {
      flags.push({
        sceneNumber: cur.sceneNumber,
        kind: "repeated-animation",
        message: `Same animation '${cur.animationType}' as previous scene.`,
        suggestion: "Consider a different animation type, direction, or intensity.",
      });
    }
    const curSounds = new Set((cur.soundCues || []).map((c) => c.filename));
    const prevSounds = new Set((prev.soundCues || []).map((c) => c.filename));
    for (const f of curSounds) {
      if (prevSounds.has(f)) {
        flags.push({
          sceneNumber: cur.sceneNumber,
          kind: "repeated-sound",
          message: `Same sound file '${f}' as previous scene.`,
          suggestion: "Audition an alternative from the same folder that fits this event, or leave this moment silent.",
        });
      }
    }
  }
  for (const scene of sorted) {
    if (!scene.soundCues || scene.soundCues.length === 0) {
      flags.push({
        sceneNumber: scene.sceneNumber,
        kind: "missing-sound",
        message: "No sound cues. This is only a flag, silence is allowed if no event needs a sound.",
        suggestion: "Check if a visual event in this scene needs a sound, otherwise leave it silent.",
      });
    }
  }
  return flags;
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
  compositionType: z.enum(["card", "typography", "diagram", "object", "image", "none", "custom"]).optional(),
  compositionElements: z.array(z.object({
    id: z.string(),
    kind: z.enum(["text", "shape", "diagram", "image", "object", "timeline", "chart", "card"]),
    text: z.string().optional(),
    src: z.string().optional(),
    xPercent: z.number(),
    yPercent: z.number(),
    widthPercent: z.number(),
    heightPercent: z.number(),
    layer: z.number(),
    color: z.string().optional(),
    background: z.string().optional(),
    entrance: z.enum(["pop", "fade", "slide", "zoom", "none"]).optional(),
    exit: z.enum(["fade", "slide", "none"]).optional(),
    startFrame: z.number().optional(),
    endFrame: z.number().optional(),
  })).optional(),
  visualAlternatives: z.array(z.string()).optional(),
  userSelectedAlternative: z.string().optional(),
  userSelected: z.boolean().optional(),
  camera: z.object({
    zoom: z.enum(["none", "zoom-in", "zoom-out"]),
    intensity: z.number().optional(),
    direction: z.enum(["center", "left", "right", "up", "down"]).optional(),
  }).optional(),
  sansFontFamily: z.string().optional(),
  scriptFontFamily: z.string().optional(),
  intentionalRepetition: z.boolean().optional(),
  animationType: z.string().optional(),
  animationDirection: z.string().optional(),
  animationIntensity: z.number().optional(),
  splitPersonCrop: z
    .object({
      headTopPercent: z.number(),
      eyeLinePercent: z.number(),
      chinPercent: z.number(),
      shouldersPercent: z.number().optional(),
    })
    .optional(),
});
