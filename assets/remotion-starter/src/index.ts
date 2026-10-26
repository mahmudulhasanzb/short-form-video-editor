// Layout Components
export { FullSpeaker } from "./layouts/FullSpeaker";
export { SplitLayout } from "./layouts/SplitLayout";
export { FullCanvas } from "./layouts/FullCanvas";
export { PersonCropHelper } from "./layouts/PersonCrop";

// Caption Components
export { ModeATalkingCaption } from "./captions/ModeATalkingCaption";
export { ModeBStatementLockup } from "./captions/ModeBStatementLockup";
export { HighlightScriptWord } from "./captions/HighlightScriptWord";

// UI Card Components
export { DarkGlassNumberedPill } from "./cards/DarkGlassNumberedPill";
export { BeginnerProSlider } from "./cards/BeginnerProSlider";
export { TiltedMockupCard } from "./cards/TiltedMockupCard";
export { BrowserWindowMockup } from "./cards/BrowserWindowMockup";
export { TimelineCard } from "./cards/TimelineCard";
export { SoundWaveCard } from "./cards/SoundWaveCard";
export { ProductLogoCard } from "./cards/ProductLogoCard";
export { LoadingSegmentsCard } from "./cards/LoadingSegmentsCard";
export { ColorSwatchesCard } from "./cards/ColorSwatchesCard";
export { DashedBadgeCard } from "./cards/DashedBadgeCard";
export { GlossyPlayCard } from "./cards/GlossyPlayCard";
export { SoundPadMatrixCard } from "./cards/SoundPadMatrixCard";

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
