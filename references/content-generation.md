# Content Generation Rules & Dynamic UI Card Protocol

This document defines the core content generation protocol for editing vertical talking-head videos. It overrides any older template-following instructions.

---

## 1. Core Principles: Transcript-Driven Generation

### 1.1 Edit from the Transcript, Never from a Previous Video
For every beat, the agent must first write, in the scene plan, these three required fields:
- **`visualIdea`**: Exactly one sentence stating what visual would help a viewer understand this exact spoken idea, and why.
- **`transcriptEvidence`**: The exact spoken words from the transcript, plus start and end timestamps, that directly support this visual.
- **`visualSource`**: Either `transcript`, or a user-supplied source file (with exact filename if supplied). If no external source was supplied, write `transcript` only.

> [!CRITICAL]
> If any of these three fields is empty or missing, the beat CANNOT render. The edit must immediately fallback to **Full Speaker** with no UI card for that beat, and flag the missing field to the user.

### 1.2 Topic-Relevance Verification for UI Cards
A card, graphic, or UI element may **only** be used if its semantic topic strictly matches the `transcriptEvidence` for that beat. Starter cards must NOT be used for unrelated topics simply because they exist in the repository:
- **`BeginnerProSlider`**: Use ONLY when the transcript explicitly describes a beginner-to-professional progression, spectrum, or range.
- **`DarkGlassNumberedPill`**: Use ONLY when the transcript explicitly enumerates numbered steps, frameworks, or systems in order, using those exact names from the transcript.
- **`SoundWaveCard`**: Use ONLY when the transcript explicitly discusses audio, sound effects, waveforms, silence, or audio recording.
- **`TimelineCard`**: Use ONLY when the transcript explicitly lists sequential events, release schedules, platforms, or steps in chronological order.
- **`LoadingSegmentsCard` / Progress bars**: Use ONLY when the transcript explicitly discusses progress, loading, compilation, or staged processes.

**Fallback Rule**: If the topic does not match any existing component, DO NOT force the card. Either:
1. Generate a new, simple card from the transcript words for that beat inside the per-video project `remotion/src/` only, or
2. Use **Full Speaker** with no card.

### 1.3 Starter Components as Generic Building Blocks
Template components in `assets/remotion-starter/` are generic parts and stylistic inspiration, never a finished video to copy:
- Use components if their topic strictly matches.
- Use their stylistic signatures (dark translucent glass, rounded corners, soft drop shadow, subtle accent borders, thin background grids) as inspiration for new components.
- NEVER copy starter components directly with old placeholder text, numbers, or hardcoded structures for a new topic.
- NEVER use a starter component as a default without affirmative transcript evidence.

### 1.4 Zero Invented Facts, Metrics, or Mockup Elements
- Absolutely no invented statistics, metrics, percentages, dollar amounts, counts, button-like controls, product names, URLs, or platforms.
- Exception: If the user explicitly approves specific mockup props, they must be explicitly annotated as `mockup props` in the scene plan.

### 1.5 No Full Reference Videos or Online Sources Copied
- Reference frames and storyboard assets serve exclusively as visual style targets (framing, typography, motion curves, contrast, color relationships).
- Every text string, statistic, step name, and graphic displayed in a new video must originate directly from that video's own transcript or from user-supplied source assets matched to timestamps.

### 1.6 Source Reference Integration Rule
- When the user supplies a source image, video clip, code snippet, or UI capture:
  1. Inspect the source file thoroughly.
  2. Locate the exact spoken topic and matching timestamp in the transcript.
  3. Display the source file at that precise moment (either full screen or within the 50/50 Split graphic canvas).
  4. Display it ONLY for the duration of that spoken topic.
- If no source file was provided, construct clean UI cards from transcript words only. Never invent, crawl, or pull external stock footage or third-party assets.

### 1.7 Topic-Timed UI Lifespans
- Every card must define its own `startFrame` and `endFrame` tightly bound to its spoken topic, rather than spanning the entire scene.
- When the spoken topic concludes, the card must animate out over ~0.3 seconds (9-10 frames at 30fps).
- When a new topic begins, a new relevant card may enter.
- A card must NEVER remain static on screen simply because a scene continues.

### 1.8 Strict No-Blank-Split Rule
- The **50/50 Split** layout (Layer A graphic canvas on top, Layer B speaker on bottom) is permitted **ONLY** for beats containing:
  1. A relevant UI card matched to transcript evidence, OR
  2. A verified `sourceReference` file, OR
  3. Other verified visual artifacts.
- Captions alone NEVER justify a 50/50 Split.
- If a beat has no relevant visual, return immediately to **Full Speaker** for that beat.
- Transitions between Full Speaker and 50/50 Split must occur exclusively on caption chunk or word boundaries (never mid-word) with zero blank or empty frames in between.
- **100% Full Canvas** scenes are exempt from this restriction because the Mode B statement headline acts as the core visual.
