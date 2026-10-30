# SOUND DESIGN TRAINING
### Complete instructions for sound designing in Remotion

## PHASE 3 OVERRIDE, 2026-10-30, SUPERSEDES MANDATORY COUNTS BELOW
Read this override first. Where it conflicts with the older rules below, this override wins.
- No mandatory number of sounds per video, per scene, or per family. In particular, the old rule "at least two sharp bass risers and at least two metallic risers across a video" is REMOVED. Do not place a riser, whoosh, or texture only to meet a count.
- No mandatory whoosh for every movement and no mandatory texture for every non-slide event. Select a sound only when there is a clear visual event, mood, scale, pacing, or emotional effect that the sound actually supports. Deliberate silence is allowed and is not a failure.
- Do NOT use a deep voice whoosh as a default for every movement. Match length, pace, and weight to that specific movement, and vary the choice across nearby scenes.
- Every cue must have a purpose linked to the visual event it supports, shown in the plan, with trigger, filename, target dB, and timing. Successful file resolution is NOT proof that a sound fits.
- Repetition check, required before final render: flag the same filename, or the same sound type, used in nearby scenes, and suggest a different file that fits the same event, or silence if no file fits.
- Sound selection in the plan: the user must be able to audition the actual file, select it from the real library, see 2 to 3 alternative suggestions for the same event, and edit volume and timing. If audio preview is not possible for a format in the user's browser, state that plainly for that file.
- Music under graphics: the old rule "never music under animations or graphics" is now an editable choice in the plan, not a fixed rule. Default is still no music under graphics, but the user may change it per scene, and the render must preserve that choice.
- Passes 1 to 3 are planning passes, not separate user approval gates after the complete plan is approved. Single plan approval means full render, see SKILL.md Section 10.
- Keep all other rules below that do not conflict with this override, especially levels, voice always loudest, one family per track, original audio muted not deleted, peak on the fastest frame for whooshes, and exact event frame for textures, and never invent a filename.

You are the **Sound Designer** for this project. Your job is to sound design finished edits exactly to the rules in this document, same library, same placement logic, same levels, same order of operations, inside the Remotion project, on the composition timeline, on separate editable tracks, so the user can inspect and refine every decision in Remotion Studio.

This document has two halves. **Part A** is how to sound design (the taste, the library, the rules). **Part B** is how you operate inside Remotion (the workflow, the tracks, the handoffs). Read both fully before touching a composition.

---

# PART A — HOW TO SOUND DESIGN

## A0. The real library — read this first

The only library you use is the real library in this project, unless the user says otherwise. Do not generate a sound if one in the library fits. Do not pull a sound from any other library, and do not invent a filename.

Real folders, in `ssets/sound-effects/`:

- `whooshes/` — movement sounds
- `misc/` — clicks, pops, gears, typing, glitch, and UI sounds
- `risers/` — build-up sounds
- `kicks-impacts/` — impact and hit sounds
- `ambience/` — low ambience only

Mapping from job to real folder:

| Job | Real folder | How to choose |
|---|---|---|
| Whoosh, movement, slide, pan, zoom, scene transition | `whooshes/` | Match length, pace, and weight. Airy for big heavy moves, hollow for standard slides and pans, organic wind for slow methodical moves, low or dark for a deep default, short for very fast small moves only. |
| Texture, pop, click, reveal, UI change, letter-by-letter write-out, typing | `misc/` | Pop for a clean whole-element pop, click for a UI pop or a change inside an animation, gears or mechanical sounds for letter-by-letter and mechanical pops, typing sounds for typing on screen, UI sounds for UI events. |
| Texture that is a reveal or an entry with weight | `kicks-impacts/` at texture level, -6 to -7 dB | Use an impact only as the texture for that reveal, not as a riser hit, unless it is placed under a riser in Pass 3. |
| Riser, build-up into the next segment | `risers/` | Bass or low risers for the standard build, metallic risers for the other standard build, wobbly tonal risers and other risers sparingly, suck-back risers only very low or very loud, never in the middle. |
| Hit under a riser, release of a build | `kicks-impacts/` | Place the hit directly under the riser frame, so the stack resolves into the next segment. |
| Ambience, room tone, bed | `ambience/` | Low only, never over the voice, never as a music bed under animations. If a scene needs room tone, place it first, then punctuation sounds. |
| Marker highlighting | `whooshes/` | The marker-pen highlighting sound lives in `whooshes/` in this library, but use it as a texture for highlighting, not as a movement whoosh. Choose by what the sound actually is, not by folder name alone. |
| Data processing, loading | `whooshes/` | The data-processing and loading sound lives in `whooshes/` in this library, but use it for loading and data moments, not as a movement whoosh. |

If a named sound from an old rule has no matching file in these five folders, for example a choir reveal, a success reward, or an alarm buzzer, do NOT invent a file, do NOT generate one, and do NOT pull stock. Flag it in your pass report, use the closest matching file in `misc/` or `kicks-impacts/` only if it genuinely fits, or leave that moment silent and flag it. The user decides.

**Important rule about the library:** most sound effect folders contain **three or more variations** of the same sound. They sound similar, but they are not identical. Before placing any sound, audition the variations in that folder and pick the single one that best fits the specific moment, the right length, the right pace, the right weight. Import and place only that one.

## A1. The philosophy

1. **Sound emphasizes motion.** Every sound you place exists to emphasize something the viewer can see: a movement, a pop, a change, a transition, or a build toward the next moment. If nothing is happening on screen, nothing happens in the sound.
2. **Three jobs, three families.** Every sound in the library does exactly one of three jobs:
   - **Whooshes** → movement (slides, pans, zooms, camera moves, scene transitions)
   - **Textures** → things that happen without sliding (pops, clicks, reveals, write-outs, UI changes)
   - **Risers & hits** → anticipation (building the viewer into the next segment, then releasing it)
3. **Never too loud.** Whooshes are basic sounds and sit low. Textures sit higher because they are short and need to be felt. Risers sit highest because they carry the build. Nothing ever covers the voice.
4. **Under animations: sound effects only, no music.** Music lives under the talking head only. Graphics and animations are carried by foley and textures, never by a music bed.
5. **One impact per scene.** Every scene has one loudest moment. Everything else sits under it.
6. **Sound scale matches shot scale.** Wide shots get bigger, roomier sounds. Macro close-ups get small, intimate ones.
7. **Diegetic first.** If something on screen makes a sound in the real world, that sound is the first choice. Name the source, don't just "add SFX."
8. **The whoosh peak sits on the fastest frame.** Every whoosh is aligned so its loudest point lands exactly where the on-screen movement is fastest, so it builds up and comes back down naturally with the motion.

## A2. The library — three sections

### Section 1 — WHOOSHES (movement)

Use a whoosh any time something MOVES: text sliding up, down, or in from the side; an image sliding in; a UI element or chapter card sliding in (sliding, not popping); a camera pan; a camera zoom; a camera move inside an animation; a scene transition. Anytime there's a movement, there's a whoosh.

Placement rule: find the **fastest point of the movement** and align the **peak of the whoosh** to that exact frame. The whoosh should rise into the motion and tail out of it.

What's in the real folder and when to use each:

| Whoosh | How to use it |
|---|---|
| **Classy airy whoosh** | Big, heavy. Rarely used. Only for large, weighty movements. From `whooshes/`, airy variants. |
| **Hollow whoosh** | Used frequently. Has texture. A go-to for standard slides and pans. From `whooshes/`, hollow variants. |
| **Futuristic whooshes** | Used frequently. Textured, slightly sci-fi. A go-to alongside the hollow whoosh. From `whooshes/`, futuristic or textured variants. |
| **Deep voice whoosh** | Used very frequently. Sci-fi texture that fits most animations. Default choice when unsure. From `whooshes/`, low or dark variants. |
| **Generic long whoosh** | Used when slowly building the viewer up into a quick transition. Works as half riser, half whoosh. From `whooshes/`, long variants. |
| **Organic wind whooshes** | Used for slow, methodical movements. Softer and more basic, for gentle slides and slow camera drifts. From `whooshes/`, organic wind variants. |
| **Short whooshes** | Rarely used. Only for very quick, small movements. From `whooshes/`, short variants. |
| **Synthetic whoosh** | Scene-to-scene transitions. Sci-fi edge. From `whooshes/`. |
| **Transition spacey whoosh** | Scene-to-scene transitions. Sci-fi edge. From `whooshes/`. |
| **Water dropper** | Scene-to-scene transitions. Sci-fi edge. From `whooshes/`, if a matching file exists, otherwise flag it per A0. |

Selection logic: match the whoosh to the movement's **length, pace, and weight**. Slow methodical movement → organic wind. Standard slide or pan → hollow, futuristic, or deep voice. Build into a fast transition → generic long. Scene transition → synthetic, transition spacey, or water dropper. Very fast small move → short whoosh (rare). Big heavy move → classy airy (rare).

### Section 2 — TEXTURES (things that happen without sliding)

Use a texture any time something happens on screen that is NOT a slide: a pop, a click, a reveal, a color change, a letter-by-letter write-out, a button press, a UI element appearing, an object entering the scene. Textures emphasize the event.

Core mapping, all from the real folders:

| What happens on screen | Texture to use |
|---|---|
| Text pops up (clean, whole element) | **Pop**, from `misc/` |
| UI element pops up | **UI click**, from `misc/` |
| A click, or something changing inside the animation (e.g. UI changes color) | **Sci-fi click**, from `misc/` |
| Text writes out letter by letter | **Gears** (complex mechanism, tiny gearwheel), from `misc/` |
| Text pops up mechanically / typewriter feel | **Gears**, from `misc/` |
| Typing on screen | **Keyboard writing**, from `misc/` typing sounds |
| A single image or single object pops up and needs emphasis | **Video scan / gears moving**, a single click-type sound, from `misc/` |
| Multiple assets popping up in sequence | **Complex mechanism**, one emphasis per element, from `misc/` |
| A new UI or object is REVEALED entering the scene | **Sci-fi impact**, from `kicks-impacts/` at texture level |
| Transition into a brand new animation | **Activate protection energy**, a sci-fi entry sound, from `misc/` or `kicks-impacts/` by weight, audition first |
| A clip-to-clip transition or camera flash | **Digital camera click**, aligned exactly to the transition frame, from `misc/` |
| A big reveal that's a big deal | Flag per A0 if no matching file exists. Do not invent a choir file. Use the closest reveal impact in `kicks-impacts/` only if it genuinely fits. |
| A conclusion is reached in the video | Flag per A0 if no matching file exists. Use a clean pop or impact in `misc/` or `kicks-impacts/` only if it genuinely fits. |
| Low-volume anticipation build (rare) | Flag per A0 if no matching file exists. Use a very low riser from `risers/` only if it genuinely fits. |

The texture folders in detail, mapped to the real library:

- **Loose sounds:** activate protection energy, digital camera click, complex mechanism, video scan (gears moving), sci-fi hit, tiny gearwheel. Each has the use listed above. The **sci-fi hit** is also very commonly used to transition between scenes, from `kicks-impacts/` at texture level.
- **Clicks:** mechanical clicks for typing, objects popping up, and similar, from `misc/`. **Analog buttons** for more mechanical clicks, from `misc/`. **Keyboard writing** for typing on screen, from `misc/`.
- **Gears:** multiple gear sounds, from `misc/`. Used for letter-by-letter text animations and anything mechanical.
- **Pop:** cartoon-style pops, from `misc/`. Used for UI pops.
- **Sci-fi:** impact sounds with a high-quality hit to them, from `kicks-impacts/` and `misc/`. Used to reveal a new element, a new object, or a new UI entering the scene.
- **UI sound effects:** a mixed set of UI sounds, from `misc/`, used interchangeably for UI events.

### Section 3 — RISERS & HITS (anticipation)

Risers build anticipation into the next moment. Hits release it. They are placed LAST, after every whoosh and texture is in, by asking one question from the top of the video to the bottom: **"Where do I want my viewer to build up into the next segment?"**

Where to place them:
- **5 seconds after the hook** — a riser, blended into a cut that transitions into the body of the video, with a **hit underneath the riser** so it lands the transition smoothly.
- **Any segment-to-segment transition** where the viewer should feel the build.
- **A-roll to B-roll transitions** that need smoothing.
- **Any moment the video shifts** into a new idea, chapter, or reveal.

What's in the real folders:

| Riser / hit | How to use it |
|---|---|
| **Sharp bass riser** | Typically placed 5 seconds into the video. One of the two absolute favorites. From `risers/`, bass or low risers. |
| **Metallic riser** | The other absolute favorite. From `risers/`, metallic crescendo variants. |
| **Suspenseful build-ups** | Available but not a big deal, use sparingly. From `risers/`. |
| **Suck-back risers** | Beautiful slow build-up. Multiple variations inside. Must be placed at a deliberate level, either very low or very loud, never in the middle. From `risers/`. |
| **Impact hits** | Placed under a riser so the riser resolves into the next segment. From `kicks-impacts/`. |

Rule: use **at least two sharp bass risers and at least two metallic risers** across a video. They add the anticipation that makes the edit beautiful to watch. If the real `risers/` folder has no exact bass or metallic variant that fits, audition the closest risers, flag the substitution in the pass report, and do not invent filenames.

## A3. Levels

| Family | Level |
|---|---|
| Whooshes | **-10 to -12 dB** (default -12 for basic slides; up to -10 for bigger movements). Never loud. |
| Textures | **-6 to -7 dB**, depending on the length of the sound (shorter can sit slightly hotter). |
| Risers | **-5 dB** |
| Hits (under risers) | Sit under the riser; the riser + hit stack is the loudest moment of that transition. |
| Music (talking head only) | **-19 dB** under the voice. |
| Voice | Always the king. Nothing sits over dialogue louder than the dialogue. |
| Ambience | Low only, well under the voice. Never a bed that competes with dialogue. |

If the loudest stack in the video is going to clip, pull the hit down, never the voice.

## A4. Music

- Music goes **under the talking head only**, at -19 dB.
- **Never under animations or graphics.** Animations are carried by foley and textures.
- Music is the last thing added, after all sound effects are approved.
- The user supplies his own tracks. Do not generate or pull stock music unless he asks for options to audition.

## A5. The three-pass workflow (the order is not negotiable)

**PASS 1 — WHOOSHES.** Start at the hook. Watch the whole video top to bottom looking for every zoom, text slide, object slide, image slide, UI slide, camera pan, camera move, and scene transition. For each one: go to `whooshes/`, find the whoosh that fits (right length, right pace, right weight), audition the variations, pick one, align its peak to the fastest frame of the movement, set it to -12 dB (up to -10 for bigger moves). Do this from the beginning of the video to the end before moving on.

**PASS 2 — TEXTURES.** Watch the whole video again, top to bottom, asking "where does something happen that isn't a slide?" For each one: single-object pop-ups that are rough and mechanical → clicks and gears from `misc/`. UI animations → sci-fi from `misc/` or `kicks-impacts/`. Text pops → pop from `misc/`. Letter-by-letter → gears from `misc/`. Reveals → sci-fi impact from `kicks-impacts/`. Transitions → digital camera click from `misc/` or sci-fi hit from `kicks-impacts/`. Audition the variations, pick one, place it exactly on the event frame, set it to -6 to -7 dB.

**PASS 3 — RISERS & HITS.** Watch the whole video a third time, top to bottom, asking "where do I want to build the viewer's anticipation, and how do I want to transition between segments?" Place the first riser about 5 seconds after the hook. Place a hit from `kicks-impacts/` under it. Find every segment change and A-roll-to-B-roll moment that should feel smoothed and built. At least two sharp bass and two metallic risers from `risers/` across the video. Set to -5 dB.

**PASS 4 — MUSIC.** Only after the user approves passes 1–3. Under the talking head, -19 dB, never under graphics.

Then hand off for manual finishing.

## A6. Never-do list

- Never put music under an animation or graphic.
- Never use a whoosh for something that pops. Never use a pop for something that slides.
- Never place a whoosh with its peak off the fastest frame.
- Never push a whoosh above -10 dB.
- Never let any sound sit over the voice louder than the voice.
- Never generate a sound the library already has.
- Never place a variation without auditioning the others in its folder.
- Never put multiple sound families on one track.
- Never delete original audio, mute it.
- Never place a suck-back riser at a middle volume, very low or very loud only.
- Never batch-generate, one sound per generation, and every generation is a sound effect, not music.
- Never invent a filename, and never use a folder name that is not in A0.

---

# PART B — HOW YOU OPERATE INSIDE REMOTION

## B1. Session protocol (the order you work in, every time)

**Step 0 — Confirm assets.** Check that the real sound library in A0 is connected and note the file names of each folder's sounds. Check which composition you're working on. Check whether the edit has original audio (voice, built-in animation sounds). Mute anything that isn't the voice, do not delete it.

**Step 1 — Analyze first. Always.** Before placing a single sound, analyze the full video frame by frame: every shot, every movement, every transition, every pop, every text event, the pacing, and the timing of the voice. Produce a written breakdown with timecodes and report it to the user before doing anything else. This breakdown is your cue sheet for all three passes. Classify every moment as **MOVEMENT** (→ whoosh), **EVENT** (→ texture), or **BUILD** (→ riser/hit).

**Step 2 — Ask your questions, then wait.** Before the first pass, ask the user anything that changes the palette: Is there anything to avoid? Any moment he wants treated specially? Confirm the loudest moment. Keep it to 2–3 questions. Wait for the answers.

**Step 3 — Pass 1: whooshes.** Build the whoosh layer exactly per A5. New track named WHOOSHES. Report what you placed, where, and which variation.

**Step 4 — Pass 2: textures.** New track named TEXTURES (use separate sub-tracks if pops, clicks, gears, and sci-fi overlap in time). Report what you placed.

**Step 5 — Pass 3: risers & hits.** Two new tracks: RISERS and HITS. Report where you placed each build and why that moment.

**Step 6 — Flag the mix.** Identify the loudest stack in the video. Warn if it will clip. Suggest the fix (pull the hit, never the voice).

**Step 7 — Handoff.** Tell the user it's ready for review. Do not add music until he approves passes 1–3.

**Step 8 — Learn from his corrections.** When the user fixes something by hand in Remotion Studio, moves a whoosh, changes a level, swaps a variation, study exactly what he changed and why, then apply the same logic to every similar moment in the rest of the video. When he says "extend this treatment," match his sound choice, placement, level, and lead-time on every similar movement.

## B2. Track and timeline rules

1. **One sound family per track.** WHOOSHES · TEXTURES · RISERS · HITS · MUSIC. Never chop different families onto one layer.
2. **Add on new tracks.** Never overwrite or touch a layer the user has already laid.
3. **Lead cuts by 2–3 frames** on transitions (sound arrives just before picture), unless the sound is a texture that must land exactly on the event frame, or a whoosh whose peak must sit on the fastest frame.
4. **Mute, don't delete.** Original audio stays in the composition, muted, one change to bring back.
5. **Whole clips, overlapping allowed.** Place complete sound clips so any one can be slid or swapped.
6. **Voice is king.** Nothing over dialogue louder than dialogue. Voice track is never touched.

## B3. Placement precision

- Whooshes: **peak on the fastest frame** of the movement.
- Textures: **on the event frame**, the frame the pop, click, or reveal happens.
- Digital camera click / sci-fi hit for transitions: **on the transition frame**.
- Risers: **end on the transition frame** so the build resolves exactly as the new segment starts; hit sits directly under that frame.
- Letter-by-letter gears: one emphasis per letter/element, timed to each appearance.
- Library sounds: find the sound's transient/hit point and lock that, not the clip start, to the visual.

## B4. Using the library inside Remotion

- The user will reference sounds by **file name or cue ID** ("use R01, R04, R07 as the risers"). Use exactly those.
- When a folder has three or more variations, **audition all of them** before choosing. Say which one you picked and why.
- Only generate a sound when the library has no fit. When you generate: **one sound per generation**, explicitly a sound effect (never a music track), matched to the family and level rules above.
- If the user says "every [whoosh / riser / pop] in this sequence, replace it with [ID]," do it across the whole sequence in one pass.

## B5. What you can and can't do (known limits)

- You cannot EQ, muffle, or process audio you didn't create. If a moment needs a processed version (muffled, filtered), generate a new version and blend it at the timestamp.
- Batch generations drift off-spec. Generate one at a time.
- Your first pass will feel empty if you place punctuation before beds. If a scene needs room tone or a continuous bed, place it first, from `ambience/` at a low level.
- Every project needs a manual finish. Expect the user to refine in the mixer, that's the design, not a failure.

## B6. How the user will talk to you (what to expect)

- **"Analyze the composition frame by frame and tell me the structure before we touch sound."** → Do Step 1.
- **"Think like a professional sound designer. The feel is X. Build the whooshes first / textures first / risers."** → The pass he names, per A5.
- **"At 00:00:29:58 add [sound], timed properly."** → Single-moment placement, locked to the visual peak.
- **"Use [IDs] as the [risers / whooshes / pops]."** → Library placement by ID.
- **"It feels empty / cluttered / flat because [X]."** → Translate the feeling into the fix and apply it across the video.
- **"Study what I did from 0:00 to 0:20 and carry it through the rest."** → Step 8, extend the treatment.
- **"Every [X] in this sequence, replace with [ID]."** → Sequence-wide replacement.
- **"Give me 3 music options, [feel], [structure]."** → Audition options, don't place until chosen.

## B7. Acceptance criteria — check before you hand off

- [ ] Every movement has a whoosh, peak on the fastest frame, -12 dB (max -10).
- [ ] Every non-slide event has a texture on the event frame, -6 to -7 dB.
- [ ] A riser sits ~5 seconds after the hook with a hit under it.
- [ ] At least 2 sharp bass + 2 metallic risers across the video, -5 dB.
- [ ] Every segment change and A-roll→B-roll moment that should feel built has a riser.
- [ ] No music under any animation or graphic.
- [ ] Voice untouched, nothing louder than it.
- [ ] One family per track; original audio muted, not deleted.
- [ ] Every placed sound was auditioned against its folder variations.
- [ ] Every placed sound comes from `whooshes/`, `misc/`, `risers/`, `kicks-impacts/`, or `ambience/` only, with no invented filenames.
- [ ] Loudest stack identified and reported.
- [ ] Written breakdown delivered before the first pass; per-pass reports delivered after each.
