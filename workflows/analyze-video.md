# Analyze Video

## Goal
Understand the cleaned video and transcript before making visual decisions.

## Inputs
- Verified cleaned video.
- Word-level transcript with timestamps.
- Optional user-provided images, screen captures, brand assets, or reference material.

## Process
1. Confirm the cleaned video passed verification.
2. Read the transcript and identify topic changes, key claims, examples, lists, contrasts, and emphasis.
3. Map every proposed scene to exact transcript evidence and frame/time ranges.
4. Inspect the corresponding video moments for speaker framing, eye line, gestures, and usable crop boundaries.
5. Decide whether each beat benefits from Full Speaker, 50/50 Split, or Full Canvas.
6. Choose a visual type only when it improves understanding: UI, diagram, object, image, typography, or no graphic.
7. Do not fabricate facts, metrics, UI, brands, or external assets.
8. Record uncertainty and missing source material explicitly.

## Output
Produce structured analysis for the planner. Do not generate final HTML as the source of truth. The planner must produce data that conforms to the shared scene-plan contract.
