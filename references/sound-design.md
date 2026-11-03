# Sound Design

## Purpose

Sound design should reinforce meaningful editorial events while keeping dialogue clear and dominant. Silence is a valid choice. Do not add sound simply because an animation exists.

## Local library first

Always search the repository's assets/sound-effects/ library before looking elsewhere. The local library is organized into:

- **whooshes/** — movement, transitions, pans, and zooms.
- **misc/** — clicks, pops, typing, mechanical textures, glitches, and UI events.
- **risers/** — anticipation and build-ups.
- **kicks-impacts/** — impacts and transition accents.
- **ambience/** — room tone and environmental texture.

These folders are a discovery aid, not a rule that a sound must be used for a matching visual category. Listen to the actual file.

### Selection procedure

1. Identify the visible event and decide whether sound adds value.
2. Search the local library for plausible candidates.
3. Audition the candidates. Compare their actual timbre, duration, attack, tail, intensity, and rhythm.
4. Choose the best-fitting file and record its exact path in the plan.
5. If no local file fits, use an external or generated sound only when the source or generation tool is genuinely available. Record provenance and license/usage rights.
6. If no suitable sound can be obtained, leave the event silent and report the limitation. Never invent a filename or choose an unrelated file as a placeholder.

Do not choose a sound from its filename alone. Similar filenames can refer to very different sounds.

## Editorial restraint

- Use whooshes for meaningful movement, not every small slide, word entrance, or repeated UI animation.
- Use clicks, pops, or textures for discrete state changes only when they are audible and visually justified.
- Use risers and impacts only when the edit has a real anticipation-and-release moment.
- Do not force a riser at a fixed timestamp or require a minimum number of risers or impacts.
- Avoid repeating the same cue across adjacent scenes unless it is an intentional motif.
- Do not add ambience or music by default. They must serve the scene and must not compete with speech.

## Mixing

- Dialogue must remain intelligible and perceptually dominant.
- Set SFX and music levels according to the actual recording, the sound's transient and tail, and the intended delivery platform. Do not apply one fixed dB value to every cue.
- Check for clipping, masking, abrupt tails, unwanted overlaps, and changes in perceived loudness.
- Use listening as the primary quality check and quantitative tools as supporting evidence. The repository's scripts/check_audio_levels.py can compare a final mix with a clean voice track and report peak/RMS information.

## Editability and reporting

- Keep each sound cue independently editable in the scene plan: asset reference, enabled state, start frame, duration, and level.
- Report which cues were selected, why they fit, and whether they came from the local library, an external source, or generation.
- Preserve the local sound library. Do not move, rename, or delete its contents during cleanup or ordinary editing.
