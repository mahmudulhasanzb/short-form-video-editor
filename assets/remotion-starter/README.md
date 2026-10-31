# Premium Video Editing: Reusable Remotion Template Library

A reusable, frame-based Remotion component library built exclusively from:
1. `visual-direction-draft.md` (Fixed Version)
2. `storyboard/Visual-Training-Storyboard.md` (20 reference frames)
3. `Sound-Design-Training.md`
4. The local `fonts/` folder and `sound effects/` folder

> **Core Tenet**:
> Every text, number, product, and graphic in this library is a **prop**. Reference words, claims, and numbers from the sample frames are examples only and are never hardcoded. This template is designed for any new vertical video project.

---

## 1. Folder Structure

```
remotion-template/
├── public/
│   ├── fonts/           -> Junction link to ../fonts
│   ├── sound-effects/   -> Junction link to ../sound-effects
│   └── sound effects/   -> Junction link to ../sound-effects
├── src/
│   ├── types/
│   │   ├── layout.ts          # Layout mode types & props
│   │   ├── captions.ts        # Caption mode tokens & gradient types
│   │   ├── ui-cards.ts        # UI card & graph component prop schemas
│   │   ├── sound.ts           # 5-family sound types & dB standards
│   │   └── scene-plan.ts      # Strict ScenePlanItem schema & validator
│   ├── theme/
│   │   ├── palette.ts         # 60-30-10 locked palette & same-color gradients
│   │   └── fonts.ts           # Deterministic font loaders & missing font audit
│   ├── layouts/
│   │   ├── FullSpeaker.tsx    # Full speaker layout with push-in & lower-third blur
│   │   ├── SplitLayout.tsx    # Strict 50/50 two-layer split (Layer A + Layer B)
│   │   ├── FullCanvas.tsx     # 100% Full Canvas with 3 background variants
│   │   └── PersonCrop.tsx     # Eye-line person crop helper (head top, eyes, chin)
│   ├── captions/
│   │   ├── ModeATalkingCaption.tsx # Word-by-word pop-up (<1.5s, rise, blur, fade)
│   │   ├── ModeBStatementLockup.tsx # Full Canvas headline lockup
│   │   └── HighlightScriptWord.tsx # Same-color gradient + soft glow script highlight
│   ├── cards/
│   │   ├── DarkGlassNumberedPill.tsx # Dark glass pill with numbered circle nodes
│   │   ├── BeginnerProSlider.tsx     # Slider with gradient fill & mouse cursor
│   │   ├── TiltedMockupCard.tsx      # Tilted B-roll mockup with nested sub-cards
│   │   ├── BrowserWindowMockup.tsx   # macOS dark window mockup with dots & badges
│   │   ├── TimelineCard.tsx          # Multi-track timeline with playhead needle
│   │   ├── SoundWaveCard.tsx         # Waveform bar chart with status indicator
│   │   ├── ProductLogoCard.tsx       # Branded logo/product card with border glow
│   │   ├── LoadingSegmentsCard.tsx   # Segmented loading blocks with metadata header
│   │   ├── ColorSwatchesCard.tsx     # Three-swatch color comparison card
│   │   ├── DashedBadgeCard.tsx       # Dashed boundary card with metric pill badge
│   │   ├── GlossyPlayCard.tsx        # Glossy squircle card with play button & skeleton
│   │   └── SoundPadMatrixCard.tsx    # 3x3 sound effect trigger pad matrix
│   ├── motion/
│   │   ├── PopIn.tsx                 # Frame-based spring entrance pop-in
│   │   ├── SnapScale.tsx             # Frame-based rapid deliberate scale snap
│   │   ├── SpeakerPushIn.tsx         # Slow steady push-in on talking head
│   │   ├── ZoomOutSnap.tsx           # Slow zoom out followed by quick snap
│   │   ├── CameraTrackTyping.tsx     # Typewriter effect tracking block cursor
│   │   └── BackgroundBlurDarken.tsx  # Contrast blur backdrop behind lower-third UI
│   ├── sound/
│   │   ├── SoundTracks.tsx           # 5 dedicated tracks: WHOOSHES, TEXTURES, RISERS, HITS, MUSIC
│   │   ├── SoundCuePlayer.tsx        # Audio player computing dB volume to linear gain
│   │   └── sfx-manifest.ts           # Asset resolver flagging missing sounds by name
│   ├── composition/
│   │   ├── SceneRenderer.tsx         # Dynamic scene renderer from validated scene plan
│   │   ├── TemplateComposition.tsx  # Main composition wrapping scenes & sound tracks
│   │   └── default-scene-plan.ts     # Generic reusable scene plan template
│   ├── index.ts                      # Central library barrel export
│   └── Root.tsx                      # Remotion Root (1080x1920 & 720x1280 @ 30fps)
├── package.json
├── remotion.config.ts
└── tsconfig.json
```

---

## 2. Components and Props

### Layout Components
All animations use `useCurrentFrame()`, `spring()`, and `interpolate()`. CSS transitions and Tailwind classes are forbidden.

#### `FullSpeaker`
- **Props**:
  - `speakerSrc?: string`: Path to speaker video file.
  - `pushIn?: boolean`: Whether to apply slow steady push-in (default: `true`).
  - `pushInScale?: number`: Maximum scale reached at scene end (default: `1.06`).
  - `lowerThird?: ReactNode`: UI card and talking caption container.
  - `darkenLowerThird?: boolean`: Darkens and blurs chest area behind UI (default: `true`).

#### `SplitLayout`
Built strictly as two separate layers per MD Section 3:
- **Layer A (Top 0%–50%)**: Warm off-white grid canvas holding all captions, UI cards, badges, and labels.
- **Layer B (Bottom 50%–100%)**: Clean person layer only. Zero overlays, zero text over face.
- **Props**:
  - `topGraphicContent: ReactNode`: All cards, badges, and captions positioned above head.
  - `speakerSrc?: string`: Source talking-head video.
  - `cropMeasurements?: PersonCropMeasurements`: Source frame eye-line measurements.
  - `canvasVariant?: CanvasBackgroundVariant`: `"warm-grid" | "plain-white" | "white-shadow-grid"`.

#### `PersonCropHelper`
Crops talking head from eye line rather than slicing raw bottom 50%:
- **Props**:
  - `measurements: { headTopPercent, eyeLinePercent, chinPercent, shouldersPercent? }`: Facial geometry percentages.
  - Math ensures head top sits 2%–5% below split line, and eyes land at 25%–30% down the strip (62%–65% of final 9:16 frame).

#### `FullCanvas`
- **Props**:
  - `statementLockup?: ReactNode`: Mode B headline lockup placed at top or center.
  - `variant?: CanvasBackgroundVariant`:
    1. `"warm-grid"`: Warm off-white (`#F8F7F4`) + thin grey grid + cast shadow.
    2. `"plain-white"`: Solid white (`#FFFFFF`) for simple statements.
    3. `"white-shadow-grid"`: White + gradient shadow + light grid.
  - `generousSpacing?: boolean`: Preserves generous negative space around central graphic.

---

### Caption Components

#### `ModeATalkingCaption`
Word-by-word rising pop animation under 1.5s total duration per word.
- **Props**:
  - `tokens: CaptionToken[]`: Array of word tokens (`text`, `isHighlighted`, `startFrame`).
  - `fontSize?: number`: Normal sans font size in px (default: `44`).
  - `highlightFontSize?: number`: Script highlight font size in px (default: `72`).
  - `textColor?: string`: Normal text color (default: `#F3F3F3`).
  - `gradientStart?: string`, `gradientEnd?: string`: Same-family gradient colors.
  - `glowColor?: string`: Script soft glow color.

#### `ModeBStatementLockup`
Curated headline statement for 100% Full Canvas scenes only.
- **Props**:
  - `title: string | CaptionToken[]`: Primary curated statement line.
  - `subtitle?: string | CaptionToken[]`: Optional secondary supporting line.
  - `fontSize?: number`: Sans font size (default: `48`).
  - `highlightFontSize?: number`: Script font size (default: `84`).
  - `position?: "top" | "center"`: Lockup placement.

#### `HighlightScriptWord`
- **Rule**: Single-colour family gradient only (light blue to deep blue), soft glow in same blue at low opacity. Never a multi-color rainbow or flat solid with hard stroke.

---

### UI Card Components (Glossy, Rounded, One Idea Per Card)

1. `DarkGlassNumberedPill`: Pill container with numbered circle nodes (`steps`, `activeStep`, `allCompleted`, `accentColor`).
2. `BeginnerProSlider`: Slider track with gradient progress fill (`progressPercent`, `leftLabel`, `rightLabel`, `showCursor`).
3. `TiltedMockupCard`: Tilted B-roll mockup card with drop shadow (`rotationDeg`, `subCardThumbnails`, `subCardGlowColor`).
4. `BrowserWindowMockup`: Dark macOS window with red/yellow/green dots (`title`, `badgeText`, `glowBorderColor`, `terminalContent`).
5. `TimelineCard`: Floating edit timeline with playhead needle (`timecode`, `videoSegments`, `audioSegments`, `playheadPercent`).
6. `SoundWaveCard`: Audio waveform bar chart with indicator status dot (`title`, `statusDotColor`, `barCount`, `barColor`).
7. `ProductLogoCard`: Branded product/tool card with version tag (`title`, `versionTag`, `icon`, `borderColor`).
8. `LoadingSegmentsCard`: Segmented progress loading blocks (`headerLabel`, `counterText`, `totalSegments`, `filledSegments`).
9. `ColorSwatchesCard`: Three-color swatches comparison card (`swatches: [{ name, hex, label }]`).
10. `DashedBadgeCard`: Dashed bounding outline box with metric badge pill (`badgeText`, `badgeColor`, `dashedColor`, `innerScale`).
11. `GlossyPlayCard`: Glossy white squircle card with bright blue rounded play button (`buttonGradientStart`, `buttonGradientEnd`, `showSkeletonBars`).
12. `SoundPadMatrixCard`: 3x3 interactive sound-effects trigger matrix (`pads`, `centerMasterLabel`, `glowColor`).

---

### Motion Components (All Frame-Based)

- `PopIn`: Uses `spring()` physics with subtle overshoot/settle.
- `SnapScale`: Frame-based rapid scale snap (e.g. 100% to 75% across 5 frames).
- `SpeakerPushIn`: Slow, steady push-in scale over scene duration.
- `ZoomOutSnap`: Slow zoom out followed by a quick snap to next layout.
- `CameraTrackTyping`: Types character-by-character while tracking a solid white block cursor `█`.
- `BackgroundBlurDarken`: Lower-third gradient darkening and blur backdrop.

---

### Sound Components (`Sound-Design-Training.md`)

- **5 Dedicated Tracks**:
  - `WHOOSHES`: `-10 to -12 dB` (linear gain ~0.25 to 0.316). Peak on the fastest frame of movement.
  - `TEXTURES`: `-6 to -7 dB` (linear gain ~0.446 to 0.501). Triggered on event frame.
  - `RISERS`: `-5 dB` (linear gain ~0.562). Ends on the transition frame.
  - `HITS`: `-5 dB`. Placed directly under the riser on the transition frame.
  - `MUSIC`: `-19 dB` (linear gain ~0.112). Under talking head only, never under animations or graphics.
  - `VOICE`: Original video audio muted (`linear gain 0`), never deleted.
- **Sound Asset Resolver**:
  - Files come strictly from `public/sound-effects/` (`whooshes/`, `misc/`, `risers/`, `kicks-impacts/`, `ambience/`).
  - Any missing file is flagged by name via `resolveSoundAsset()`. No silent substitution.

---

## 3. Scene-Plan Input Format

Feed scenes into the template via the `ScenePlanItem` JSON format:

```json
{
  "id": "scene-01",
  "sceneNumber": 1,
  "contentType": "Person in Center",
  "layoutType": "Full Speaker",
  "mainFocus": "Hook statement introducing core problem",
  "captionMode": "Mode A",
  "captionTokens": [
    { "text": "These" },
    { "text": "three mistakes", "isHighlighted": true },
    { "text": "make your animations slow" }
  ],
  "uiCardNeed": "DarkGlassNumberedPill",
  "uiCardProps": {
    "steps": [1, 2, 3],
    "activeStep": 1,
    "accentColor": "#3B82F6"
  },
  "startFrame": 0,
  "endFrame": 90,
  "fontSize": 44,
  "highlightFontSize": 72,
  "soundCues": [
    {
      "id": "cue-01",
      "family": "WHOOSHES",
      "filename": "whooshes/ES_Classic, Hollow, Low, Long - Epidemic Sound.mp3",
      "frame": 0,
      "targetDb": -12
    }
  ]
}
```

### Validation Rules:
The template validates every scene using `validateScenePlanItem()`. It flags:
1. Missing `contentType` (must be one of the 8 MD types).
2. Missing `layoutType`.
3. Missing `mainFocus`.
4. Missing `captionMode`.
5. Missing `uiCardNeed`.
6. Missing `startFrame` or `endFrame`.
7. Missing `fontSize` or `highlightFontSize`.
8. Missing `splitPersonCrop` when `layoutType` is `"50/50 Split"`.

---

## 4. How to Start a New Video Using the Remotion Skill

1. Navigate to the project directory:
   ```bash
   cd c:/Projects/test/Premium-Video-Editing/remotion-template
   ```
2. Open Remotion Studio interactive preview:
   ```bash
   npm run dev
   ```
3. In your new project or composition, import components directly:
   ```tsx
   import {
     TemplateComposition,
     FullSpeaker,
     SplitLayout,
     FullCanvas,
     ModeATalkingCaption,
     DEFAULT_SCENE_PLAN,
   } from "./src";
   ```
4. To render the final MP4 video:
   ```bash
   npx remotion render VideoTemplate out/video.mp4
   ```

---

## 5. Audit: What is Still Unknown (Marked Unknown, Not Guessed)

Per project guidelines, no hex codes, numbers, products, or caption words were invented. The following items remain explicitly marked **UNKNOWN**:

1. **60-30-10 Palette Hex Codes**:
   - `visual-direction-draft.md` Section 5 explicitly marked the locked palette as:
     - Primary (60%): dark navy `[HEX TO CONFIRM FROM STORYBOARD FRAMES]`
     - Secondary (30%): light blue `[HEX TO CONFIRM FROM STORYBOARD FRAMES]`
     - Accent (10%): bright blue `[HEX TO CONFIRM FROM STORYBOARD FRAMES]`
   - Default calibrated fallback values (`#0B1528`, `#60A5FA`, `#2563EB`) are provided in `src/theme/palette.ts`, and full prop overrides are supported.
2. **Font Status, Corrected 2026-10-30, Phase 3**:
   - `Creato Display` is **MISSING** from local files. Do NOT claim it is the rendered primary font.
   - Current Primary Sans stopgap, confirmed in `src/theme/fonts.ts`: **Nexa**, ExtraLight mapped to weight 400 and Heavy mapped to weight 700. This is a weight compromise, ExtraLight may be thin at 52px, and its commercial licence is unclear, so Nexa is acceptable for private push and test only. Add a true OFL sans with genuine 400/600/700 cuts, for example Inter, before public or commercial production delivery.
   - Secondary, confirmed present: **Instrument Serif** (Regular and Italic, OFL), loaded via `@remotion/fonts`.
   - Other folders present but unassigned for captions: `bryson` (Personal Use Only, serif), `built_titling` (all-caps only), `heading_now` (CC BY-NC 4.0, non-commercial only, removed as Primary Sans), `playfair_display` (OFL, serif).
   - Normal and highlighted fonts are independently selectable in the plan, see SKILL.md Section 12. The rendered font must be verified in Remotion, not assumed from this README.
3. **Reference Video Cut Timestamps**:
   - Exact start/end timestamps for individual cuts in the original reference videos are unknown. UI internal timecodes (e.g. `00:12` in Video 1 Frame 08, `00:06:07` in Video 2 Frame 02, `00:09:08` in Frame 03, Frame 244 in Frame 07) are noted in `storyboard/Visual-Training-Storyboard.md`. New videos supply their own deterministic frame numbers.
