# Render Final Video

## Preconditions
- The user has reviewed and explicitly approved the current scene plan.
- The plan passes schema and semantic validation.
- Every referenced visual and enabled sound asset resolves through the workspace asset manifest.
- The cleaned source video passed media verification.
- Caption font-family values refer to fonts available in the render environment. The current renderer does not register local font files from assets/fonts/; do not treat a font file as loaded unless that loading has been separately implemented and verified.

## Process
1. Load the approved `scene-plan.json`; do not reconstruct scene data from HTML or UI state.
2. Validate the plan and all referenced visual and enabled sound asset paths again.
3. Render a short representative test covering the layouts, captions, motion, and sound cues actually used by the plan.
4. Inspect crop geometry, text clipping, scene transitions, audio balance, and preview/render consistency.
5. If the test passes, render the full composition with Remotion.
6. Run final video and audio quality checks. For `scripts/verify_render.py`, pass `--expected-width`, `--expected-height`, and `--expected-fps` when the delivery target differs from its defaults (1080×1920 at 30 fps). Treat its output as a technical check, not a complete subjective quality assessment.
7. Listen to the final audio and inspect the exported video. Use `scripts/check_audio_levels.py` as an additional dialogue-versus-mix diagnostic only when a clean voice track is available; review flagged intervals by listening.
8. Save the final video and machine-readable render report in the video's workspace.
9. Report warnings and failed checks honestly.

Never render an unapproved plan. Never silently substitute missing assets with generic/fake content.
