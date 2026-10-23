---
name: short-form-video-editor
description: "Edits vertical 9:16 talking-head videos into premium short-form videos with word-timed captions, motion graphics generated from the video transcript, and relevant sound design. Use when the user gives a talking-head video and asks for premium editing, or runs /edit-video-auto, /cutout-video, or /make-video-edit-plan."
---

# Short-Form Video Editor

## 1. When to Use This Skill
- The user provides a vertical (or portrait-oriented) talking-head video and requests premium short-form editing.
- The user triggers any of the specialized workflow commands:
  - `/edit-video-auto`: Automated transcription, cut-list generation, frame-accurate cutting, and HTML scene planning. Stops for user review before rendering.
  - `/cutout-video`: Step 1 only. Transcribes with local Whisper, removes filler/bad takes, cuts with FFmpeg applying the Breath Rule, and verifies timeline continuity. Stops after producing `cleaned.mp4`.
  - `/make-video-edit-plan`: Step 2 only. Generates the interactive `edit-plan.html` and `scene-plan.json` from `cleaned.mp4` and `transcript.json`. Stops for user review.

## 2. When NOT to Use This Skill
- Do NOT use this skill for videos that are not talking-head videos (e.g. gameplay recordings, pure screen tutorials, landscape vlogs, or faceless stock videos).
- Do NOT use this skill when the user asks only for a simple cut, trim, format conversion, or basic subtitles.
- Do NOT use this skill to copy or reproduce a previous video's text, numbers, layout, or scene structure.
- Do NOT use this skill when the user has not provided a video file or has not explicitly requested premium editing.

## 3. Workflow in Numbered Steps
1. **Directory Validation (Step 0)**: Resolve the current workspace directory. If it is the skill directory itself, halt immediately. Scaffold a per-video project.
2. **Transcription**: Run local Whisper on raw audio to obtain word-level timestamps in `transcript.json`.
3. **Script Analysis & Cut-List**: Detect fillers (`um`, `uh`), silences > 0.4s, false starts, and retakes. Generate `cut-list.json`.
4. **Frame-Accurate Cutting**: Re-encode with FFmpeg (`libx264` + `aac`) applying the Breath Rule (up to 0.20s silence padding, 0.20-0.30s breath retention, 25ms audio join fades). Never use `-c copy`. See [cutting-and-verification.md](references/cutting-and-verification.md).
5. **Timeline Verification Gate**: Run `scripts/verify_cleaned.py` to confirm exact FPS, frame count, padded duration match, and PTS monotonicity. Halt on error.
6. **Transcript-Driven Scene Planning**: For each beat, define `visualIdea`, `transcriptEvidence`, and `visualSource`. Map relevant UI cards or Full Speaker fallback.
7. **Interactive Plan Generation**: Build `edit-plan.html` with preview, sound cue triggers, crop proof metrics, and Copy Scene Plan JSON button. STOP and wait for user review.
8. **Render Verification & Execution**: Upon user plan approval, validate scenes with `validateScenePlanItem`. Render test clips (scenes 1-2, key transitions), verify crops and audio QC, then execute final 9:16 render via Remotion.

## 4. Content Generation Rule
This core protocol governs all visual and UI card planning. It overrides any older template-following instructions. See [content-generation.md](references/content-generation.md) for complete details.

1. **Edit from Transcript Only**: Every beat must provide three required fields:
   - `visualIdea`: One sentence explaining what visual helps the viewer understand this exact spoken idea, and why.
   - `transcriptEvidence`: Exact spoken words and timestamps from the transcript supporting this visual.
   - `visualSource`: `transcript` or user-supplied source filename.
   *If any field is missing, the beat cannot render. Fallback to Full Speaker with no card and flag.*
2. **Topic Relevance Verification**: UI cards may ONLY appear when transcript evidence explicitly matches:
   - `BeginnerProSlider`: Only for beginner-to-professional progressions or skill continuums.
   - `DarkGlassNumberedPill`: Only for enumerated steps or systems spoken in sequential order.
   - `SoundWaveCard`: Only when discussing audio, sound effects, waveforms, or silence.
   - `TimelineCard`: Only when discussing sequential timelines, multi-platform steps, or schedules.
   - `LoadingSegmentsCard`: Only when discussing staged progress, compilation, or loading states.
   *If no starter card matches, build a simple custom card in the per-video project or use Full Speaker.*
3. **Starter Components as Generic Parts**: Assets in `assets/remotion-starter/` provide styling guidelines (glassmorphism, subtle shadows, grids), not rigid layouts to duplicate.
4. **Zero Invented Elements**: Never fabricate statistics, metrics, button controls, product names, URLs, or dollar amounts.
5. **No Reference Asset Copying**: Storyboard frames in [storyboard.md](references/storyboard.md) illustrate styling targets only. All text and data must come from the current video's transcript.
6. **User Source References**: When user supplies an asset, match it to its spoken timestamp, showing it only for that duration. Otherwise, use clean transcript UI cards only.
7. **Topic-Timed UI Lifespans**: Cards animate in on their topic and exit in ~0.30s when the topic ends. Cards must never linger across an entire scene statically.
8. **No Blank Splits**: Use 50/50 Split ONLY when a relevant card, source image, or visual graphic occupies the top canvas. Captions alone never justify a split. Fallback to Full Speaker.

## 5. Sound Relevance Rule
Sound emphasizes motion. Voice is always the king; nothing sits louder than dialogue. See [sound-design.md](references/sound-design.md) for full library and pass workflows.

- **Jobs & Levels**:
  - `WHOOSHES` (-10 to -12 dB): Movement only (slides, pans, zooms, scene transitions). Peak aligns to fastest frame.
  - `TEXTURES` (-6 to -7 dB): Non-slide events (pops, clicks, reveals, UI state changes, write-outs).
  - `RISERS` (-5 dB): Anticipation building into next segment.
  - `HITS` (-5 dB): Resolves anticipation under risers.
  - `MUSIC` (-19 dB): Under talking head only, never under motion graphics or UI animations.
- **Cue Requirements**: Every cue requires: `trigger` (exact word or motion), `purpose`, `filename` (from `assets/sound-effects/`), and `targetDb`. If there is no trigger, there is no sound.
- **Pass Order**: Pass 1 Whooshes -> Pass 2 Textures -> Pass 3 Risers & Hits -> Pass 4 Music (only after passes 1-3 approved).
- **Audio QC Standard**: Run `scripts/check_audio_levels.py` and `scripts/verify_render.py`. Report `mean_volume`, `max_volume`, `loudnorm` integrated loudness (-14 to -16 LUFS), and True Peak (max -1.0 dBTP). Flag any SFX peak exceeding voice or adding > 6 dB RMS to quiet dialogue.

## 6. Caption and Motion Style
See [visual-direction.md](references/visual-direction.md) for deep aesthetic specifications.

- **Caption Modes**:
  - Mode A (Talking Caption): 2-3 word chunks synchronized to spoken audio. Only one chunk visible at a time.
  - Mode B (Statement Lockup): Full Canvas only. Curated headline phrase, not a literal transcription.
- **Motion Engine**: Frame-based only using Remotion `useCurrentFrame`, `spring`, and `interpolate`. Never use CSS transitions or Tailwind animation classes.
- **Apple-Style Spring**: Words enter over 0.25-0.35s, staggered 0.06s per word (`translateY` +20px -> 0, opacity 0 -> 1, blur 6px -> 0, scale 0.96 -> 1.0). Exit fade with light blur over 0.20s.
- **Typography & Font Roles**:
  - Sans Role: `Nexa` (replaces missing `Creato Display`; weight compromise: ExtraLight for regular, Heavy for bold). Files in `assets/fonts/nexa/`.
  - Script / Highlight Role: `Instrument Serif`, weight 400 italic. Files in `assets/fonts/instrument_serif/`.
  - Default Sizes: Full Speaker normal 52px, highlighted 84px. Split normal 48px, highlighted 80px. Full Canvas Mode B normal 52px, highlighted 84px. Step back 5% if frame check fails and report.
- **Color & Contrast**: Dark text on light canvas; pure white text on dark speaker background. Highlights use subtle same-family gradients (lighter to deeper blue) with low-opacity soft glow. Never flat solid highlights, never white glow, never multi-color.

## 7. Layout and Crop Procedure
- **Layout Modes**: `Full Speaker` (speaker with lower-third caption/card), `50/50 Split` (top graphic canvas + bottom speaker Layer B), `100% Full Canvas` (warm off-white background with subtle grid).
- **Universal Split Face Procedure**:
  1. Measure facial landmarks from a raw frame: head top, eye line, mouth, chin, and shoulders.
  2. Compute face span (`chinPercent - headTopPercent`).
  3. Scale speaker foreground so face span fills ~81% of the 960px container, leaving ~34px (3.5%) headroom below the split line and generous chin clearance above the bottom edge.
  4. Fill left and right margins with blurred speaker video background.
  5. *Do NOT hardcode video-01 crop values (5, 35, 64, 85, 1318px, -32px). Sizing math is universal; measurements are per video.*
  6. Prove framing at 3 frames per split scene using `scripts/check_crops.py` before final render.

## 8. Project Generation Rule
- **Step 0 Workspace Resolution**:
  - Before any editing, use the current Antigravity workspace directory as the video project folder, unless the user explicitly specifies a different directory in the same prompt.
  - Do NOT use a fixed path as default. Do NOT create the video project inside `C:\Projects\Short-Form-Video-Editor\`.
  - If current workspace IS `C:\Projects\Short-Form-Video-Editor\`, STOP and warn the user. Require a separate workspace folder to prevent contaminating the skill repository.
- **Scaffolded Per-Video Structure**:
  Inside the current workspace directory, create automatically:
  - `remotion/`: Isolated Remotion project created with `/remotion-create` following `/remotion-best-practices`. Copy generic components and configs from `assets/remotion-starter/` into this folder. Never edit `assets/remotion-starter/` in place.
  - `transcript.json`, `cut-list.json`, `cleaned.mp4`, `scene-plan.json`, `edit-plan.html`, and `final_render.mp4`.
  - `remotion/public/`: Copy or link necessary fonts from `assets/fonts/` and sound cues from `assets/sound-effects/` for this video only.
- **Safety**: If the workspace already contains an existing `scene-plan.json` or `remotion/` directory, flag it and ask for confirmation before overwriting. Custom cards for a specific video live in `remotion/src/` only.

## 9. Automatic Remotion Invocation
- When this skill executes, automatically invoke `/remotion-best-practices`, then follow its routing to `/remotion-create` for project scaffolding, `/remotion-captions`, `/remotion-multimedia`, and `/remotion-render`, without waiting for the user to mention Remotion.
- The user must NOT have to mention Remotion manually. The user triggers this skill by its commands or by requesting premium editing, and this skill is responsible for loading the Remotion skills.
- Do not ask the user "should I use Remotion?" and do not ask for permission to create the Remotion project folder, because creating it is part of the edit command the user already gave.
- If `/remotion-best-practices`, or any Remotion skill it routes to, is not found, installed, or discoverable in the current Antigravity workspace, STOP and tell the user exactly which skill is missing, by name. Do not build a Remotion project from scratch by guessing, and do not silently copy the starter and skip Remotion.
- Use Remotion best practices for all Remotion work: frame-based motion with `useCurrentFrame`, `spring`, and `interpolate`, vertical 9:16 composition, captions, audio, and rendering, as routed by `/remotion-best-practices`.

## 10. Verification Gates and Stop Points
1. **Gate 1 (Cutting Verification)**: Run `scripts/verify_cleaned.py`. Verify FPS, frame count, padded duration, and timestamp continuity. STOP if failed.
2. **Gate 2 (HTML Edit Plan Review)**: Output `edit-plan.html` and `scene-plan.json`. Provide Copy Scene Plan JSON button. STOP and wait for explicit user approval. Do NOT render.
3. **Gate 3 (Test Clips)**: Render scenes 1 to 2 only. Extract proof frames. Verify layout, caption sync, typography, and card motion. STOP.
4. **Gate 4 (Key Transitions)**: Render Hook, first 50/50 Split, first 100% Full Canvas, and Ending CTA. Inspect 3 proof frames per split scene using `scripts/check_crops.py`. STOP.
5. **Gate 5 (Full Render & Audio QC)**: Render full video via `/remotion-render`. Run `scripts/verify_render.py` and `scripts/check_audio_levels.py`. Confirm True Peak <= -1.0 dBTP, voice loudness dominance, and no SFX RMS elevation > 6 dB over quiet speech.

## 11. Error Handling: Flag Missing Files by Name
- Never guess, invent, or substitute missing assets silently.
- If a font is missing from `assets/fonts/`, flag it by its exact requested family and path.
- If a sound effect filename cannot be resolved in `assets/sound-effects/`, report the missing path and leave the cue slot silent.
- If a required scene plan field (`visualIdea`, `transcriptEvidence`, `visualSource`, `fontSize`) is empty, flag the scene number and field name.
- If a speaker crop measurement is missing for a 50/50 Split scene, flag `splitPersonCrop` and refuse to render until measured.
