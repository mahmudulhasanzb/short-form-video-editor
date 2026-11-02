---
name: short-form-video-editor
description: "Edits vertical talking-head videos into polished short-form videos with transcript-grounded visuals, editable captions, motion, and sound design. Use when the user requests premium talking-head video editing or invokes /edit-video-auto, /cutout-video, or /make-video-edit-plan."
---

# Short Form Video Editor

## Commands

Preserve these exact command names and meanings:

- `/cutout-video`: prepare a cleaned video. Transcribe the source, create a reviewable cut list, cut with frame-accurate FFmpeg re-encoding, and verify the output. Stop after producing the cleaned video and its report.
- `/make-video-edit-plan`: analyze the cleaned video and transcript, create a structured scene plan, validate it, and open the interactive editor for user review. Do not render the final video.
- `/edit-video-auto`: orchestrate the complete workflow: preparation, planning, user review/editing, approval, rendering, and quality checks. Always stop for approval before final rendering.

## Workspace safety

1. Resolve the active project directory from the agent runtime.
2. Never create a video workspace inside the installed skill directory.
3. Create one workspace per video under the active project directory unless the user specifies another location.
4. Keep source copies/references, transcripts, cut lists, plans, generated assets, renders, and reports inside that video's workspace.
5. Never modify the installed skill's source files during normal editing.
6. If the active project directory cannot be determined safely, ask before writing.
7. Do not assume that a cloud agent can access the user's local disk. Use only files and mounts available in the current runtime.

## Core data rule

The validated `scene-plan.json` is the single source of truth for the editor, preview, and renderer. Do not maintain separate hand-edited scene data for these components. Validate every plan against the shared contract before opening it in the editor or rendering it.

## Editing principles

- Ground every visual decision in the current video's transcript or a user-provided source asset.
- Never invent facts, numbers, product interfaces, URLs, sound filenames, or image sources.
- Keep voice intelligible and dominant over music and effects.
- Use Full Speaker, 50/50 Split, and Full Canvas only when the visual content justifies the layout.
- A 50/50 split requires a relevant graphic or source visual; captions alone do not justify it.
- Offer genuinely different visual alternatives. Selecting an alternative must update the structured plan and preview.
- Caption chunks default to approximately 3–4 words, while preserving natural speech and readable timing.
- Allow word correction, split/merge, timing, highlighting, font, and animation edits.
- Camera motion and sound effects must be independently editable per scene.
- Unknown or unverifiable information must be flagged, not guessed.

## Quality gates

- Cutting must use frame-accurate re-encoding; never use FFmpeg stream copy for edit decisions.
- Verify cleaned-video frame rate, frame count, duration, and timestamp continuity before planning.
- Validate scene ranges, captions, crop geometry, visual assets, and sound assets before rendering.
- Test representative scenes and transitions before the full render.
- Run final video and audio quality checks. A failed mandatory check means the render is not complete.

## Workflows

Read only the workflow needed for the requested command:

- [Cutout workflow](workflows/cutout-video.md)
- [Video analysis](workflows/analyze-video.md)
- [Editing plan](workflows/create-editing-plan.md)
- [Final rendering](workflows/render-final-video.md)

Consult the root `references/` directory for detailed cutting, visual-direction, storyboard, and sound-design guidance. Treat reference frames as style guidance only; never copy their text, data, or scene content into a new video.
