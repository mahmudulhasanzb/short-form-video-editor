# /make-video-edit-plan

## Goal
Create an editable, validated scene plan and open it in the interactive editor. Do not render the final video. The plan should be specific to the source video rather than a preset slideshow.

## Process
1. Confirm the cleaned video and transcript exist and passed verification.
2. Analyze transcript, speaker footage, and any supplied visual assets using [analyze-video.md](analyze-video.md). For supplied video files, create and inspect timestamped contact sheets before selecting excerpts.
3. Build scene and beat data with transcript evidence, exact project frame ranges, justified layouts, visual direction, caption timing, camera motion, and sound cues.
4. When a supplied clip fits a transcript beat, place a video visual element using that asset's ID. Set `mediaStartFrame` and `mediaEndFrame` to the verified source-media range (source FPS), not the scene's project-timeline range. Keep the excerpt concise and relevant; don't fill time with unrelated footage.
5. Create two or three genuinely distinct visual alternatives only when a graphic is useful and the content supports it. Do not manufacture alternatives just to meet a count.
6. Compare each scene with its neighbors. Remove repeated card/layout patterns unless repetition communicates a deliberate progression or comparison.
7. Validate the plan against the shared contract. Reject invalid ranges, missing evidence, unresolved selected alternatives, and missing asset references.
8. Save the validated `scene-plan.json` in the video's planning directory.
9. Open the interactive editor using that exact plan.
10. Wait for the user to review and edit the plan. Persist edits back to the same source-of-truth plan.
11. Stop. Final rendering belongs to the approved render workflow.

## Visual selection rules
- Start with the idea, not the component library. Speaker-only is a valid and preferred choice when no supporting visual adds meaning.
- Use diagrams for relationships, comparisons for contrasts, timelines for sequences, and real UI only for genuine interface concepts.
- Do not turn every sentence, keyword, or number into a card. Avoid generic dashboard panels, floating pills, fake browser windows, and decorative widgets without clear explanatory purpose.
- Adjacent scenes should not repeat a visual structure by default. Alternatives differ in composition and information design, not only styling.
- Captions preserve spoken words; visual headlines and labels add hierarchy rather than restating the transcript.
- Never fabricate interface details, statistics, logos, screenshots, product names, or asset URLs. If evidence/assets are missing, simplify and flag the limitation.
- Storyboards and starter components are optional craft references, not mandatory templates.

## Required scene data
Each scene defines:
- Stable scene ID and project frame range.
- Layout and speaker crop where relevant.
- Visual type and structured visual alternatives/elements.
- Caption chunks with editable words and frame timing.
- Per-scene camera motion settings.
- Sound effects with resolvable asset references.
- Transcript evidence supporting the visual decision.

Never silently invent missing values. Explicitly use a no-graphic/speaker-only scene when appropriate.
