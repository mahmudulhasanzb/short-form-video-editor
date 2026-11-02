# /make-video-edit-plan

## Goal
Create an editable, validated scene plan and open it in the interactive editor. Do not render the final video. The plan should feel specific to the source video rather than like a preset slideshow.

## Process
1. Confirm that the cleaned video and transcript exist and passed verification.
2. Analyze the transcript and video using [analyze-video.md](analyze-video.md).
3. Build scene and beat data with transcript evidence, exact frame ranges, justified layouts, visual direction, caption timing, camera motion, and sound cues.
4. Create two or three genuinely distinct visual alternatives only when a graphic is useful and the content supports it. Do not create alternatives merely to satisfy a count when no graphic is appropriate.
5. Compare each proposed scene with its neighbors. Remove repeated card/layout patterns unless repetition communicates a deliberate progression or comparison.
6. Validate the plan against the shared contract. Reject invalid ranges, missing evidence, unresolved selected alternatives, and missing asset references.
7. Save the validated `scene-plan.json` in the video's planning directory.
8. Open the interactive editor using that exact plan.
9. Wait for the user to review and edit the plan. Persist edits back to the same source-of-truth plan.
10. Stop. Final rendering belongs to the approved render workflow.

## Visual selection rules
- Start with the idea, not the component library. Decide what the viewer needs to see before choosing a layout or visual element.
- Speaker-only is a valid and preferred choice when no supporting visual adds meaning.
- Use diagrams for relationships and processes, comparisons for contrasts, timelines for sequences, and real UI only for genuine interface concepts.
- Do not turn every sentence, keyword, or number into a card. Avoid generic dashboard panels, floating pills, badges, fake browser windows, and decorative widgets without a clear explanatory purpose.
- Do not repeat the same visual structure in consecutive scenes by default. Make alternatives meaningfully different in composition and information design, not just styling.
- Keep text concise. Captions preserve the spoken words; visual headlines and labels should add hierarchy, not restate the entire transcript.
- Never fabricate interface details, statistics, logos, product names, screenshots, or asset URLs. If evidence or assets are missing, simplify the visual and flag the limitation.
- Treat the storyboard and starter components as optional craft references, not mandatory templates or a default sequence.

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
