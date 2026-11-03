# Cutting and Verification

This document describes reusable checks for preparing source footage and validating a final render. Use the actual source frame rate and the shared scene-plan contract; do not assume every video is 30 fps.

## 1. Transcription and cut-list review

1. Produce a word-timestamped transcript and retain the original transcript.
2. Review fillers, false starts, repeated takes, long silences, and sentence boundaries in context.
3. Create a cut list with source-time ranges and a reason for every proposed exclusion.
4. Preserve the complete onset and offset of spoken words. Do not cut on a word boundary if it clips a consonant, breath, or natural speech transient.
5. Preserve natural pauses where they support the speaker's cadence. Padding is allowed only into genuine silence, never into excluded speech or an adjacent kept segment.
6. Review the proposed cut list before applying it. Do not infer that every pause or filler should be removed.

## 2. Frame-accurate cutting

- Use frame-accurate FFmpeg re-encoding for editorial cuts. Never use stream copy (-c copy) to make precise cuts.
- Use the source's actual frame rate and dimensions unless the user or delivery specification requires a conversion.
- Keep video and audio trims aligned. Use short audio fades at joins only when needed to prevent clicks; verify that they do not clip speech.
- Keep the raw source unchanged and write the cleaned output and cut-list artifacts into the video's workspace.

## 3. Cleaned-video verification

Run the reusable verifier after cutting:

~~~bash
python scripts/verify_cleaned.py --video <cleaned-video-path> --cut-list <cut-list-path>
~~~

Check:

- Video and audio streams are present and decodable.
- Actual decoded frame count is consistent with the reported duration and frame rate.
- Frame rate matches the intended timeline and has not changed unexpectedly.
- The output duration is consistent with the kept segments and any documented padding.
- Presentation timestamps remain monotonic across joins.
- Audio is continuous, synchronized, and free of obvious clicks or clipped words.

If a mandatory check fails, stop before planning and report expected versus actual values. Do not label an unverified file as cleaned.

## 4. Render verification

Before the full render, render a representative test that covers the project's actual layouts, captions, motion, and sound cues. Inspect it and fix any problems before rendering the full composition. Do not require a fixed scene number or a specific set of layouts if the project does not use them.

For split scenes, inspect entry, middle, and exit frames to confirm that the speaker's head, eyes, mouth, and chin remain visible in the speaker region. Check caption placement and clipping at phone size.

After the full render, run:

~~~bash
python scripts/verify_render.py --video <final-video-path>
~~~

Also inspect:

- Resolution, frame rate, frame count, duration, and audio stream.
- Caption timing, text clipping, scene boundaries, and source-video synchronization.
- Crop geometry, unexpected blank frames, and preview/render consistency.
- Dialogue intelligibility, SFX/music balance, clipping, abrupt tails, and unintended silence.

Use scripts/check_audio_levels.py as an additional diagnostic when a clean voice track is available. Loudness and peak targets depend on the delivery specification; do not treat one fixed LUFS or dB value as universal unless the user or platform requires it.

A render is complete only after required checks pass and remaining warnings are reported honestly.
