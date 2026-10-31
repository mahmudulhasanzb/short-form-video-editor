// Layout Components
export { FullSpeaker } from "./layouts/FullSpeaker";
export { SplitLayout } from "./layouts/SplitLayout";
export { FullCanvas } from "./layouts/FullCanvas";
export { PersonCropHelper } from "./layouts/PersonCrop";

// Caption Components
export { ModeATalkingCaption } from "./captions/ModeATalkingCaption";
export { ModeBStatementLockup } from "./captions/ModeBStatementLockup";
export { HighlightScriptWord } from "./captions/HighlightScriptWord";
export { CaptionBackground } from "./captions/CaptionBackground";

// Generic Composition Components, Phase 3b, old cards deleted
export { GenericComposition } from "./composition/GenericComposition";
export { AnimatedDiagram, MotionGraph } from "./composition/AnimatedDiagram";

// Motion Components (All Frame-Based!)
export { PopIn } from "./motion/PopIn";
export { SnapScale } from "./motion/SnapScale";
export { SpeakerPushIn } from "./motion/SpeakerPushIn";
export { ZoomOutSnap } from "./motion/ZoomOutSnap";
export { CameraTrackTyping } from "./motion/CameraTrackTyping";
export { BackgroundBlurDarken } from "./motion/BackgroundBlurDarken";

// Sound Components & Helpers
export { SoundTracks } from "./sound/SoundTracks";
export { SoundCuePlayer } from "./sound/SoundCuePlayer";
export { resolveSoundAsset, SFX_FOLDERS } from "./sound/sfx-manifest";

// Types & Schemas
export * from "./types/layout";
export * from "./types/captions";
export * from "./types/ui-cards";
export * from "./types/sound";
export * from "./types/scene-plan";

// Theme & Palette
export { LOCKED_PALETTE, getSameFamilyBlueGradient, createSameColorGradient } from "./theme/palette";
export { FONT_FAMILIES, loadProjectFonts, FONTS_AUDIT } from "./theme/fonts";

// Composition & Renderer
export { TemplateComposition } from "./composition/TemplateComposition";
export { SceneRenderer } from "./composition/SceneRenderer";

// Remotion Entry Point
import { registerRoot } from "remotion";
import { Root } from "./Root";

registerRoot(Root);
