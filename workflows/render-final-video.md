# Render Final Video

## Preconditions
- The user has reviewed and explicitly approved the current scene plan.
- The plan passes schema and semantic validation.
- Every referenced image, font, and sound asset resolves.
- The cleaned source video passed media verification.

## Process
1. Load the approved `scene-plan.json`; do not reconstruct scene data from HTML or UI state.
2. Validate the plan and all asset references again.
3. Render a short representative test covering ordinary scenes, split layouts, captions, motion, and sound cues.
4. Inspect crop geometry, text clipping, scene transitions, audio balance, and preview/render consistency.
5. If the test passes, render the full composition with Remotion.
6. Run final video and audio quality checks.
7. Save the final video and machine-readable render report in the video's workspace.
8. Report warnings and failed checks honestly.

Never render an unapproved plan. Never silently substitute missing assets with generic/fake content.
