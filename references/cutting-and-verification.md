# Frame-Accurate Cutting and Timeline Verification Protocol

This document defines the cutting procedure and verification checks required before scene planning and rendering.

---

## 1. Transcription & Segmentation

1. **Local Whisper Transcription**:
   - Run local Whisper (e.g. `whisper-timestamped` or `openai-whisper`) on raw audio.
   - Extract precise word-level start and end timestamps.
   - Output `<video-folder>/transcript.json`.

2. **Script Understanding & Cut-List Construction**:
   - Parse transcript to isolate:
     - Spoken filler words (`um`, `uh`, `like`, repeated stutters).
     - Unnatural dead air and silence exceeding 0.4 seconds.
     - False starts, aborted sentences, retakes, and stuttered loops.
   - Generate `<video-folder>/cut-list.json` containing:
     - `keptSegments`: Array of `{ start: number, end: number, text: string }`.
     - `excludedSegments`: Array of `{ start: number, end: number, text: string, reason: string }`.

---

## 2. Frame-Accurate Cutting & Breath Rule

### 2.1 Re-encoding Standard (Never Stream Copy)
- Cutting must ALWAYS use frame-accurate re-encoding.
- NEVER use stream copy (`-c copy`). Stream copy cuts at nearest keyframes, causing broken frames, desynced audio, and dropped words.
- Cut each kept segment by exact timestamps at native source fps and resolution.
- Encoding format: Video with `libx264` (CRF 18-20, preset medium/slow), Audio with `aac` (192kbps+).
- Use FFmpeg trim and concat filtergraph or per-segment re-encode concatenated with re-encode.

### 2.2 The Breath Rule
1. **Never Cut Exactly on Word Boundaries**:
   - Raw Whisper word boundaries clip speech transients.
   - Check segment edges: If a boundary cuts into a word (starts after word onset or ends before word offset), extend boundary to the complete word first.
2. **Padding into Dead Air Only**:
   - Expand each kept segment start by up to 0.20s and end by up to 0.20s into silence.
   - NEVER pad into excluded speech (filler words, aborted takes, false starts).
   - NEVER allow padding to overlap adjacent kept segments.
3. **Natural Pauses (0.20s - 0.30s)**:
   - Do NOT delete the entire dead-air gap between thoughts.
   - Preserve 0.20 to 0.30 seconds of original room tone / pause in the cleaned timeline between sentences for human breathing cadence.
4. **Click Prevention**:
   - Apply a 25-millisecond audio fade-in and fade-out at each join point to prevent audio clicks and popping artifacts.

---

## 3. Mandatory Cutting Verification (Pre-Planning Gate)

Immediately after generating `cleaned.mp4`, run `verify_cleaned.py` (or execute `ffprobe` checks) against `cut-list.json`:

1. **FPS Check**:
   - Inspect average frame rate (`r_frame_rate`, `avg_frame_rate`).
   - Must strictly match native source FPS (e.g., 30.000 or 29.970).
2. **Frame Count Check**:
   - Total frames must equal `duration * fps` within ±1 frame.
3. **Padded Duration Match**:
   - Cleaned duration must match the calculated sum of padded kept segments in `cut-list.json`.
4. **Timestamp Continuity**:
   - Analyze presentation timestamps (PTS). Zero timestamp collapse, zero backwards steps, and zero non-monotonic jumps across joins.

> [!CRITICAL]
> If any cutting verification check fails, STOP immediately. Report the exact numbers (expected vs actual fps, frame count, duration, PTS jumps) to the user. Do not proceed to scene planning.

---

## 4. Final Render Verification & Audio QC Gate

Before any render is declared complete or ready for delivery, the following gates must be satisfied:

### 4.1 Visual Verification Stages
1. **Stage 1 (Test Clip)**: Render scenes 1 to 2 only. Extract proof frames. Verify layout, caption sync, typography, and card motion. STOP.
2. **Stage 2 (Key Scene Verification)**: Render key transitional scenes (Hook, first 50/50 Split, first 100% Full Canvas, Ending CTA). Extract proof frames. Verify speaker framing and card lifespans. STOP.
3. **Stage 3 (Full Video Render)**: Render the entire video only after stages 1 and 2 pass.

### 4.2 Split-Face Framing Proof
- For every 50/50 Split scene, inspect at least 3 frames (entry, middle, exit).
- Verify: Head top, eye line, mouth, and chin are 100% visible inside the bottom 50% Layer B container with chin clearance and shoulders visible. No facial clipping allowed.

### 4.3 Audio QC Numbers Standard
Audio cannot be approved by casual observation; quantitative metrics are mandatory via FFmpeg `volumedetect` and `loudnorm`:
1. **Dialogue Loudness**: Integrated loudness between -14 LUFS and -16 LUFS.
2. **True Peak**: Must never exceed -1.0 dBTP.
3. **Voice Dominance**: Dialogue must be louder than all SFX and music at every second.
4. **RMS Difference**: Sound effects must not elevate quiet speech segments by more than +6 dB RMS.
