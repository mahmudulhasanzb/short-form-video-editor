# /make-video-edit-plan

## Goal

Create an editable, validated scene plan and open it as a storyboard. Do not render the final video. The storyboard is the primary editorial review artifact: one scene card per meaningful beat, in sequence, with real source-footage stills and the editable decisions for that scene beside the still. Do not build or launch a conventional video-editor workspace.

## Process

1. Confirm the cleaned video and transcript exist and passed verification.
2. Analyze transcript, speaker footage, and supplied visual assets using analyze-video.md. For supplied video files, create and inspect timestamped contact sheets before selecting excerpts.
3. Build scene and beat data with transcript evidence, exact project frame ranges, justified layouts, visual direction, caption timing, camera motion, structured per-element entrance/exit motion, and justified sound cues.
4. Place relevant supplied footage only after reviewing its timestamped contact sheet and scrubbing the original clip. Match visible action to the transcript's meaning, not merely matching keywords. If no clip genuinely supports a beat, do not force one.
5. For every accepted footage match, keep an evidence note during planning: transcript quote/time, asset ID, observed action, sample timestamp(s), verified source in/out, intended display window, and confidence/uncertainty. Use the asset's FPS for source frames and project FPS for timeline frames.
6. Set mediaStartFrame/mediaEndFrame to source-video frames, and timelineStartFrame/timelineEndFrame to the display window relative to the scene. Source trim selects the excerpt; timeline range controls when it appears. Keep it concise and transcript-relevant.
7. Create two or three genuinely distinct visual alternatives only when a graphic is useful and the content supports it. Do not manufacture alternatives just to meet a count.
8. Compare each scene with its immediate neighbors and the wider sequence. Check the selected layout, composition type, element-kind structure, animation approach, and information hierarchy. When adjacent scenes repeat the same structure, redesign one only if a different composition communicates that beat more clearly; do not add decorative elements or force variety. Keep repetition when it deliberately communicates a progression, comparison, or recurring motif, and note that rationale in the scene visual rationale.
9. Validate source trims and scene-relative overlay windows. Reject windows outside the scene, missing evidence, unresolved alternatives, and missing asset references.
10. Save the validated scene-plan.json in the video's planning directory.
11. Create the storyboard review surface from that exact validated JSON. The review surface is a scene-by-scene board—not a full video-editor dashboard. Each card includes:
    - a real still sampled from the source video at a recorded representative timestamp;
    - scene title, order, start/end time, and duration;
    - transcript evidence and the intended viewer takeaway;
    - visual treatment, alternative, and every editable layer;
    - caption preview plus editable chunk/word timing and highlighting;
    - per-scene camera motion and sound cues.
12. Attach source footage locally and generate the stills from actual frames. Do not use stock or generated replacement imagery. If the runtime cannot access the source video, stop thumbnail generation and report the access limitation; never claim that placeholders are real frames.
13. Keep controls inside their owning scene card. Every user-visible control must update the structured scene plan and the card's rendered preview. No inert controls, hardcoded sample data, or presentation-only edits.
14. Expose scene timing/layout/evidence; visual type, alternative choice, element text/assets/transforms/style/entrance/exit; caption visibility, chunk and word correction, split/merge, timing, highlights, font and animation; per-scene camera movement; and independently editable sound cues with enable, asset, timing, duration, and level.
15. Allow the user to review the whole sequence without a separate scene sidebar, giant central player, or a detached properties inspector. The output should read like a visual shot list / storyboard.
16. Export the validated scene-plan.json. Edits must stay in the plan object; local browser blob URLs and file objects must never be serialized.
17. Wait for the user to review and edit the storyboard. Do not render final video until explicit approval.
18. Stop.

## Visual selection rules

- Treat repetition warnings as a review prompt, not an automatic error. Inspect the actual meaning of both beats before changing either scene.
- Start with the idea, not a component library. Speaker-only is a valid and preferred choice when no supporting visual adds meaning.
- Use diagrams for relationships, comparisons for contrasts, timelines for sequences, and real UI only for genuine interface concepts.
- Do not turn every sentence, keyword, or number into a card. Avoid generic dashboard panels, floating pills, fake browser windows, and decorative widgets without clear explanatory purpose.
- Adjacent scenes should not repeat a visual structure by default. Alternatives differ in composition and information design, not only styling.
- Captions preserve spoken words; visual headlines and labels add hierarchy rather than restating the transcript.
- Never fabricate interface details, statistics, logos, screenshots, product names, or asset URLs. If evidence/assets are missing, simplify and flag the limitation.
- Search the local font and sound-effect libraries before sourcing assets externally. Audition sound effects and check font licenses; record external/generated asset provenance.

## Required scene data

Each scene defines:

- Stable scene ID and project frame range.
- Layout and speaker crop where relevant.
- Transcript evidence supporting the scene decision.
- Visual type and structured visual alternatives/elements.
- Caption chunks with editable words and frame timing.
- Per-scene camera motion settings.
- Sound effects with resolvable asset references.
- A representative source-frame timestamp retained in the storyboard output.

Never silently invent missing values. Explicitly use a no-graphic/speaker-only scene when appropriate.
