# Analyze Video

## Goal
Understand the cleaned video, transcript, and supplied visual assets before making editing decisions. The result should feel authored for this source, not like interchangeable UI cards.

## Inputs
- Verified cleaned video.
- Word-level transcript with timestamps.
- Optional user-provided images, screen captures, brand assets, or reference material.
- Optional user-provided B-roll / additional footage, including long clips that may need source trimming.

## Inspect supplied footage first
For every supplied video asset, make a timestamped visual inventory before proposing placements:

1. Run `python scripts/inspect_footage.py <video-path> --output <workspace>/footage-inspection/<asset-id>` (requires ffmpeg and ffprobe).
2. Open the generated `contact-sheet.jpg` and inspect the corresponding samples. Read `footage.json` for exact sample timestamps, duration, dimensions, and frame rate.
3. If the sheet suggests a useful moment, scrub the original clip around that timestamp to verify the action and exact source in/out boundaries. A contact sheet is for discovery, not frame-accurate trimming.
4. Record what is actually visible, the strongest usable time range, and any uncertainty. Do not infer unseen content from a filename.

## Process
1. Confirm that the cleaned video passed verification.
2. Read the transcript and identify topic changes, key claims, examples, lists, contrasts, demonstrations, and emotional emphasis.
3. Map every proposed scene to exact transcript evidence and project-timeline frame/time ranges.
4. Inspect the corresponding speaker moments for framing, eye line, gestures, objects, and usable crop boundaries.
5. For each beat, write down the one thing the viewer should understand or feel.
6. Choose the simplest visual form that communicates that idea: speaker-only, restrained typography, comparison, process diagram, timeline, relevant supplied image/object, genuine product/UI demonstration, or another justified composition.
7. Choose Full Speaker, 50/50 Split, or Full Canvas only after the visual idea is clear.
8. Compare supplied images/footage against transcript beats. Recommend placement only when the visible content is relevant; record the transcript evidence and intended screen treatment.
9. For supplied footage, record source-media in/out in source frames, separately from project-timeline frames. Prefer a short, specific excerpt over placing an entire long clip. Do not stretch a short source excerpt to fill a scene; if timing is uncertain, leave it untrimmed and flag it for review.
10. Record uncertainty and missing source material explicitly. Do not invent facts, metrics, product interfaces, brands, or external assets.

## Anti-template visual direction
- Do not assign a UI card to every scene. Many beats should remain speaker-only or use restrained typography.
- A number or keyword alone is not a reason to add a card. Use UI metaphors only for actual tools, interfaces, workflows, or measurable states.
- Avoid repeating the same composition in adjacent beats unless continuity is intentional.
- Alternatives must be conceptually different, not the same card with different colors, labels, or decoration.
- Prefer one clear focal point and meaningful negative space over stacks of badges, pills, floating panels, or filler graphics.
- Use only details supported by transcript evidence or supplied assets. If evidence is missing, choose a simpler truthful treatment.
- Storyboards guide craft, motion, spacing, and hierarchy only. Never copy their example text, numbers, products, or sequence into an unrelated video.

## Output
Produce structured analysis for the planner. Do not generate final HTML as the source of truth. The planner must produce data conforming to the shared scene-plan contract.
