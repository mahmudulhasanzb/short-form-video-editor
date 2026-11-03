---
name: short-form-video-editor
description: "Analyzes and edits vertical talking-head videos into transcript-grounded storyboards and polished short-form videos. Use when the user requests a storyboard, premium talking-head edit, or invokes /edit-video-auto, /cutout-video, or /make-video-edit-plan."
---

# Short Form Video Editor

## Commands

Preserve these exact command names and meanings:

- **/cutout-video**: prepare a cleaned video. Transcribe the source, create a reviewable cut list, cut with frame-accurate FFmpeg re-encoding, and verify the output. Stop after producing the cleaned video and its report.
- **/make-video-edit-plan**: analyze the cleaned video and transcript, create a structured scene plan, generate an editable storyboard with one real source-frame card per scene, validate it, and open it for user review. Do not render the final video.
- **/edit-video-auto**: orchestrate the complete workflow: preparation, planning, storyboard review/editing, approval, rendering, and quality checks. Always stop for approval before final rendering.

## Workspace safety

1. Resolve the active project directory from the agent runtime.
2. Never create a video workspace inside the installed skill directory.
3. Create one workspace per video under the active project directory unless the user specifies another location.
4. Keep source copies/references, transcripts, cut lists, plans, generated assets, storyboard exports, renders, and reports inside that video's workspace.
5. Never modify the installed skill's source files during normal editing.
6. If the active project directory cannot be determined safely, ask before writing.
7. Do not assume that a cloud agent can access the user's local disk. Use only files and mounts available in the current runtime.

## Core data rule

The validated scene-plan.json is the single source of truth for the storyboard, preview, and renderer. Do not maintain separate hand-edited scene data for these components. Validate every plan against the shared contract before opening it in the storyboard or rendering it.

The storyboard is the primary planning and approval artifact. This is not a conventional video editor: do not replace the storyboard with a full-screen player, timeline-first workspace, or separate property inspector.

## Storyboard requirements

- Produce a vertical sequence of scene cards, ordered by exact project frame range.
- Every scene card must show a real still sampled from the supplied source footage at a representative timestamp. Do not use stock photos, generated people, generic placeholders, or invented footage as if they came from the source. When source media is unavailable, state that clearly and do not fabricate a thumbnail.
- Each scene card exposes its scene name, exact start/end time, duration, transcript evidence, visual intent, selected composition, caption preview, and sound/motion status.
- Editing controls live inside the corresponding scene card. Users must not need to select a scene in a sidebar and then edit it in a separate inspector.
- The user can edit scene timing, layout, speaker crop where supported, transcript evidence, visual type, alternatives, visual element text/assets/position/size/rotation/opacity/style/entrance/exit, captions and their individual words/timing/highlights/font/style/animation, camera motion, and each sound cue's asset/enabled/timing/duration/level.
- Add, remove, split, merge, or replace actions must update the structured plan—not presentation-only markup.
- Show source-frame timestamps and clearly distinguish source-media frame ranges from project-timeline frames.
- Attach source footage and media locally in the browser. Do not upload private footage or store blob URLs in the JSON plan.
- Provide a validated JSON export. The exported JSON remains the renderer's source of truth.
- Do not autoplay footage or render a final video as part of storyboard generation.
- Keep the storyboard scannable: a compact real source frame alongside the detailed controls for that same scene. The preview thumbnail is not a replacement for the actual rendered output.

## Editing principles

- Ground every visual decision in the current video's transcript or a user-provided source asset.
- Never invent facts, numbers, product interfaces, URLs, sound filenames, or image sources.
- Keep voice intelligible and dominant over sound effects.
- Use Full Speaker, 50/50 Split, and Full Canvas only when the visual content justifies the layout.
- A 50/50 split requires a relevant graphic or source visual; captions alone do not justify it.
- Offer genuinely different visual alternatives. Selecting an alternative must update the structured plan and storyboard preview.
- Caption chunks default to approximately 3–4 words, while preserving natural speech and readable timing.
- Allow word correction, split/merge, timing, highlighting, font-family styling, and animation.
- Camera motion and sound effects must be independently editable per scene.
- Unknown or unverifiable information must be flagged, not guessed.

## Asset selection policy

- **Fonts:** Search assets/fonts/ first and inspect the actual files and bundled license terms. The current renderer applies the caption font-family CSS setting but does not register or bundle local font files. A local font file is not usable merely because it exists in the library. Use only a font already available to the rendering environment, or source/prepare a permitted font only when a supported loading method is available. Record source and license. Do not claim a local font is active unless it has been loaded and verified.
- **Sound effects:** Search assets/sound-effects/ first. Audition relevant local candidates and choose by the actual sound, duration, texture, and fit—not by filename alone. If none fits, use an external or generated sound only when the required source/tool is available; record its provenance and license. Never invent a filename or silently substitute an unrelated sound.
- Keep both local asset libraries intact. Do not delete, rename, or move their contents as part of routine editing.

## Quality gates

- Cutting must use frame-accurate re-encoding; never use FFmpeg stream copy for edit decisions.
- Run the cleaned-video verifier and inspect its report. Treat it as a technical diagnostic, not proof of audio continuity or word-safe cuts; listen to joins and inspect the actual footage.
- Validate scene ranges, captions, crop geometry, visual assets, supported font choices, and sound assets before rendering.
- Test representative scenes and transitions before the full render.
- Run final video and audio quality checks. Pass target resolution and frame rate explicitly when they differ from the verifier defaults. A failed mandatory check means the render is not complete.

## Editing craft integration

Read references/skill-integration.md for transcript-grounded visual decisions, non-repetitive motion, sound restraint, storyboard review, and QA. Use the public Impeccable design skill's Operate-mode hierarchy, real-content, typography, responsiveness, interaction-state, and craft-floor principles when changing the storyboard UI. Use evidence-based video workbench methods from the reviewed gitethanwoo/video-editing skill: inspect real media, preserve source evidence, separate analysis from editorial decisions, review contact sheets and transitions, and validate the delivered file. Do not copy another skill's fixed visual presets or license-restricted assets.

## Workflows

Read only the workflow needed for the requested command:

- Cutout workflow: workflows/cutout-video.md
- Video analysis: workflows/analyze-video.md
- Editing plan: workflows/create-editing-plan.md
- Final rendering: workflows/render-final-video.md

Consult references/ for reusable cutting, visual-direction, and sound-design guidance.
