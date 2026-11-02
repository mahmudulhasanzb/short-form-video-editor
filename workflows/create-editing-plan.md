# /make-video-edit-plan

## Goal
Create an editable, validated scene plan and open it in the interactive editor. Do not render the final video.

## Process
1. Confirm that the cleaned video and transcript exist and passed verification.
2. Analyze the transcript and video using [analyze-video.md](analyze-video.md).
3. Build scene and beat data with transcript evidence, exact frame ranges, layouts, visual direction, caption timing, camera motion, and sound cues.
4. Create at least two or three genuinely distinct visual alternatives when a graphic is useful and the content supports them. Do not create alternatives merely to satisfy a count when no graphic is appropriate.
5. Validate the plan against the shared contract. Reject invalid ranges, missing evidence, unresolved selected alternatives, and missing asset references.
6. Save the validated `scene-plan.json` in the video's planning directory.
7. Open the interactive editor using that exact plan.
8. Wait for the user to review and edit the plan. Persist edits back to the same source-of-truth plan.
9. Stop. Final rendering belongs to the approved render workflow.

## Required scene data
Each scene must define:
- Stable scene ID and frame range.
- Layout and speaker crop where relevant.
- Visual type and structured visual alternatives/elements.
- Caption chunks with editable words and frame timing.
- Per-scene camera motion settings.
- Sound effects with real, resolvable asset references.
- Transcript evidence supporting the visual decision.

Never silently invent missing values. Use an explicit no-graphic/speaker-only scene when that is the correct editorial choice.
