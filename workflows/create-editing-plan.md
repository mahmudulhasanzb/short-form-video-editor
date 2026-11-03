# /make-video-edit-plan

## Goal
Create an editable, validated scene plan and open it in the interactive editor. Do not render the final video. The plan should be specific to the source video rather than a preset slideshow.

## Process
1. Confirm the cleaned video and transcript exist and passed verification.
2. Analyze transcript, speaker footage, and any supplied visual assets using [analyze-video.md](analyze-video.md). For supplied video files, create and inspect timestamped contact sheets before selecting excerpts.
3. Build scene and beat data with transcript evidence, exact project frame ranges, justified layouts, visual direction, caption timing, camera motion, structured per-element entrance/exit motion, and justified sound cues.
4. Place relevant supplied footage only after reviewing its timestamped contact sheet and scrubbing the original clip. Match visible action to the transcript's meaning, not merely matching keywords. If no clip genuinely supports a beat, do not force one.\n5. For every accepted footage match, keep an evidence note during planning: transcript quote/time, asset ID, observed action, sample timestamp(s), verified source in/out, intended display window, and confidence/uncertainty. Use the asset's FPS for source frames and project FPS for timeline frames.\n6. Set `mediaStartFrame`/`mediaEndFrame` to source-video frames, and `timelineStartFrame`/`timelineEndFrame` to the display window relative to the scene. Source trim selects the excerpt; timeline range controls when it appears. Keep it concise and transcript-relevant.
7. Create two or three genuinely distinct visual alternatives only when a graphic is useful and the content supports it. Do not manufacture alternatives just to meet a count.
8. Compare each scene with its immediate neighbors and the wider sequence. Check the selected layout, composition type, element-kind structure, animation approach, and information hierarchy. When adjacent scenes repeat the same structure, redesign one only if a different composition communicates that beat more clearly; do not add decorative elements or force variety. Keep repetition when it deliberately communicates a progression, comparison, or recurring motif, and note that rationale in the scene visual rationale.
9. Validate source trims and scene-relative overlay windows. Reject windows outside the scene, missing evidence, unresolved alternatives, and missing asset references.
10. Save the validated `scene-plan.json` in the video's planning directory.
11. Open the interactive editor using that exact plan.
12. Wait for the user to review and edit the plan. Persist edits back to the same source-of-truth plan.
13. The review surface must be genuinely editable, not a static HTML mockup: expose every generated scene, caption chunk, visual element, camera-motion choice, and sound cue that can be changed. Controls must write to the structured scene plan and refresh the preview from that same data. Do not hardcode generated wording, timings, sound selections, animation choices, or per-scene zoom settings into presentation-only markup.
14. Provide direct controls for caption text and split/merge, timing, highlight words, font/animation; per-scene zoom/motion on/off and settings; per-element entrance/exit, delay, and duration; and sound cue selection/disable. Offer sensible defaults, but keep them changeable. If a choice is unsupported by the plan schema/editor, flag it as unsupported instead of displaying a fake/inert control.
15. Stop. Final rendering belongs to the approved render workflow.

## Visual selection rules
- Treat the editor’s adjacent-scene repetition warning as a review prompt, not an automatic error. Inspect the actual meaning of both beats before changing either scene.
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
