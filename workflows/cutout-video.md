# /cutout-video

## Goal

Create a cleaned, verified video from the supplied talking-head source. This command does not create the visual edit plan or final edit.

## Steps

1. Resolve the active project directory and create a per-video workspace. Never write inside the installed skill.
2. Inspect the source file and record its duration, dimensions, frame rate, audio streams, and codec information.
3. Transcribe speech with word-level timestamps. Preserve the raw transcript.
4. Analyze fillers, false starts, repeated takes, long silences, and sentence boundaries. Do not remove meaningful pauses or alter the speaker's intended meaning.
5. Write a cut list with source-time ranges and a reason for each proposed cut.
6. Apply the project's breath-retention guidance from references/cutting-and-verification.md.
7. Cut with frame-accurate FFmpeg re-encoding. Never use -c copy for editorial cuts.
8. Verify frame rate, frame count, duration, audio continuity, and monotonic presentation timestamps.
9. If verification fails, stop and report the failure; do not label the output as cleaned or verified.
10. Save the cleaned video, transcript, cut list, and verification report in the video workspace.

## Output

- input/cleaned.mp4
- analysis/transcript.json
- analysis/cut-list.json
- reports/cleaned-video-verification.json

Actual filenames may be adjusted to the workspace convention, but the artifacts and their meanings must remain clear.
