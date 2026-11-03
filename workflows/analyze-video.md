# Analyze Video

## Goal

Understand the cleaned video, transcript, and supplied visual assets before making editing decisions. The result should feel authored for this source, not like interchangeable UI cards.

## Inputs

- Verified cleaned video.
- Word-level transcript with timestamps.
- Optional user-provided images, screen captures, brand assets, or reference material.
- Optional user-provided B-roll or additional footage, including long clips that may need source trimming.

## Inspect supplied footage first

For every supplied video asset, make a timestamped visual inventory before proposing placements:

1. Run the reusable footage inspector: `python scripts/inspect_footage.py <video-path> --output <workspace>/footage-inspection/<asset-id>`.
2. Open the generated contact sheet and inspect the corresponding samples. Read footage.json for exact sample timestamps, duration, dimensions, and frame rate.
3. If the sheet suggests a useful moment, scrub the original clip around that timestamp to verify the action and exact source in/out boundaries. A contact sheet is for discovery, not frame-accurate trimming.
4. Record what is actually visible, the strongest usable time range, and any uncertainty. Do not infer unseen content from a filename.
5. Treat each inspected clip as a set of candidate moments. A timestamp is a lead, not proof of the action between samples; inspect the original footage before choosing the exact trim.
6. Keep the asset ID tied to its manifest. Never mix timestamps from one clip with another clip's frame rate or duration.

## Process

1. Confirm that the cleaned video passed verification. Also inspect the source and listen around proposed cut joins; the verifier is not a substitute for editorial review.
2. Read the transcript and identify topic changes, key claims, examples, lists, contrasts, demonstrations, and emotional emphasis.
3. Map every proposed scene to exact transcript evidence and project-timeline frame/time ranges.
4. Inspect the corresponding speaker moments for framing, eye line, gestures, objects, and usable crop boundaries.
5. For each beat, write down the one thing the viewer should understand or feel.
6. Choose the simplest visual form that communicates that idea: speaker-only, restrained typography, comparison, process diagram, timeline, relevant supplied image/object, genuine product/UI demonstration, or another justified composition.
7. Choose Full Speaker, 50/50 Split, or Full Canvas only after the visual idea is clear.
8. Give each useful visual a motion intention: primary entrance, optional stagger, readable hold, and optional exit. Use structured element motion; vary direction and timing only when hierarchy or meaning calls for it. Stillness is valid.
9. Identify sound only for meaningful visible events. Search assets/sound-effects/ first, audition relevant files, and choose by actual sound and fit. Do not auto-attach a repeated whoosh or click to every animation.
10. Inspect assets/fonts/ and their license files before considering a local font. The current renderer uses the caption font-family CSS value but does not load/register font files from this directory. Do not plan a local font as active unless it is already available to the rendering environment or a verified font-loading method is provided.
11. Compare supplied images and footage against transcript beats. Recommend placement only when the visible content is relevant; record transcript evidence and intended screen treatment.
12. Record source-media in/out in source frames separately from scene-relative overlay start/end frames. Source trim selects the excerpt; overlay timing determines when it appears. Verify exact boundaries by scrubbing. Never fill time with unrelated footage.
13. Record uncertainty and missing source material explicitly. Do not invent facts, metrics, product interfaces, brands, or external assets.

## Anti-template visual direction

- Do not assign a UI card to every scene. Many beats should remain speaker-only or use restrained typography.
- A number or keyword alone is not a reason to add a card. Use UI metaphors only for actual tools, interfaces, workflows, or measurable states.
- Avoid repeating the same composition in adjacent beats unless continuity is intentional.
- Alternatives must be conceptually different, not the same card with different colors, labels, or decoration.
- Prefer one clear focal point and meaningful negative space over stacks of badges, pills, floating panels, or filler graphics.
- Use only details supported by transcript evidence or supplied assets. If evidence is missing, choose a simpler truthful treatment.
- There is no required storyboard or starter-component library. Do not copy old example scenes or hardcoded reference content.

## Output

Produce structured analysis for the planner. Do not generate final HTML as the source of truth. The planner must produce data conforming to the shared scene-plan contract.
