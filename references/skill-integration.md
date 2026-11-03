# Skill Integration: Editing Decisions, Motion, and Sound

This project borrows selected craft methods from reviewed open-source editing skills. It does not import their templates, visual identities, or separate render engines. The validated `scene-plan.json` remains the source of truth for storyboard, preview, and export. The storyboard is the review artifact; this is intentionally not a general-purpose video-editor UI.

## What was reviewed

| Source | Useful technique adopted | What is intentionally not copied |
|---|---|---|
| Liamrjohnston/remotion-motion-graphics-skill | Evidence-based visual research, reference observation, causal camera movement, independent visual critique | Mandatory research gates for every conceptual beat, fixed warm-light look, heavy cinematic camera world, hardcoded visual bans |
| TakeOff-Team/claude-shortform-video-editor | Visuals land on the spoken noun/phrase, face breathers, word-timed beats, creator feedback as lasting style guidance, storyboard QA | Its separate edit.json engine, fixed 1.2–2.5s beat rate, no-SFX default, and 1–3-word caption rule |
| tenfoldmarc/video-edit-skill | Face-safe composition, authentic assets, phone-size checks, inspect actual rendered frames | Its three preset creator looks, behind-head typography system, and HyperFrames-based pipeline |
| nateherkai/herk-edit-kit | Build → breathe → resolve rhythm, vary motion direction/easing/speed, topic-span coverage rather than arbitrary flashes | Its 406-card library, mandatory glass/paper styles, and HyperFrames-specific composition model |
| haidrrrry/claude-remotion-skill | Staggered entrances, clear holds, concise hierarchy, frame-based timing, render-and-inspect loop | Always-on Ken Burns, glow/mesh/grain stacks, mandatory SFX on every entrance, and constant ambient motion |
| iart-ai/motion-skills | Skill-sized reusable craft instructions and deliver/verify loops | Installing all packs or adding unrelated animation frameworks to this codebase |

## 1. Decide whether a visual is needed

For every transcript beat, write down:
- The exact spoken phrase and its word-level time range.
- The single idea the viewer should understand.
- The most literal truthful visual that helps explain it.
- The evidence source: transcript, user asset, or verified public source.
- The confidence and any missing evidence.

Choose in this order:
1. A relevant user-provided recording, screenshot, object, or B-roll.
2. A verified real product/interface image when the narration names a real product or interface.
3. A purpose-built graphic that expresses a real relationship, process, comparison, or number stated in the source.
4. Restrained typography for a key phrase.
5. Speaker-only when no graphic adds meaning.

Never create a fake dashboard, invented metric, decorative icon, generic success card, or unrelated stock visual to fill space. A missing asset is a reason to simplify or flag uncertainty, not to fabricate.

Use the spoken noun or phrase as the timing anchor. Do not reveal a graphic well before the thing is mentioned. A natural half-sentence can become a beat, but this is a pacing hint—not a quota. Keep a visual across a complete topic when the idea is still developing; do not split every sentence into a new card.

## 2. Give each beat a motion intention

Use motion to communicate an action, not to make a static composition look busy.

A useful motion plan has three phases:
- **Build:** one primary element enters; supporting elements may stagger behind it.
- **Breathe:** hold the readable information long enough to understand it. Stillness is intentional.
- **Resolve:** leave cleanly, or hand off to the next idea.

Rules:
- Give each beat one primary motion idea. Avoid animating every property of every element.
- Use a small stagger only when it reveals hierarchy or sequence. Do not make all elements enter together.
- Vary direction, scale, and timing across nearby scenes when the meaning supports it. Do not rotate through effects mechanically.
- Use restrained ease-out entrances and ease-in exits; keep the motion deterministic and frame-based.
- Prefer a hard cut when the narration changes subject. Use a continuous move only when it communicates continuity or a spatial relationship.
- Do not apply ambient zoom, parallax, blur, glow, grain, or camera motion to every scene.
- Keep text and key visual content readable at phone size and inside platform safe areas.
- A visual element's `motion` is structured scene data: `enter`, `exit`, `delayFrames`, and `durationFrames`. The editor exposes these values and preview/export use the same plan.
- If motion does not add meaning, set `enter: "none"` and `exit: "none"`.

Suggested starting point, not a fixed preset: a 10–16 frame entrance, 2–5 frame stagger between related elements, then a real hold. Use longer timing for weighty ideas and shorter timing for small UI feedback. Never let animation timing obscure the spoken word.

## 3. Keep captions and graphics separate in purpose

- Caption chunks default to 3–4 words, adjusted to natural speech boundaries and timing.
- Captions preserve what was said; a graphic headline should add hierarchy or explain a relationship, not repeat the whole sentence.
- Highlight only the few words that carry the idea.
- Keep captions away from the speaker's face and away from essential graphic text.
- Do not use a long sentence as a kinetic-typography graphic. Use a short phrase and let captions carry the speech.

## 4. Sound is editorial punctuation, not decoration

For each sound cue, state the visible event it supports:
- Movement: a meaningful camera move, transition, or object travel.
- Texture: a distinct reveal, click, typing action, or state change.
- Impact/riser: a genuinely important reveal or transition that needs anticipation.

Use the existing project sound library and audition the actual candidate files when available. Choose by timbre, duration, and weight—not filename alone. Avoid repeating the same sound on adjacent scenes unless it is a deliberate recurring motif. Do not add a whoosh to every movement or a click to every element. Do not invent filenames or substitute generic effects when no suitable asset exists; leave the event silent and flag it.

Voice remains dominant. Effects must not mask words or become louder than the moment warrants. No music or effect is mandatory merely because a scene contains animation.

## 5. Learn from creator feedback without overfitting

Keep lasting preferences separate from one-off notes:
- A lasting preference changes the project style guidance.
- A one-scene correction changes only that scene.
- A rejected visual pattern should be recorded with the reason, so the planner does not reproduce it in the next video.
- Do not infer approval from silence or reuse an unapproved design as a permanent style rule.

## 6. Verification

Before calling a plan ready:
- Confirm every graphic has transcript/source evidence.
- Review adjacent scenes for repeated composition, motion, and sound choices; retain repetition only when its purpose is clear.
- Check face and caption safe areas.
- Check that animation delays/durations fit within the scene and that the main idea gets a readable hold.
- Confirm sound assets resolve and are not repeated by default.
- Validate the scene plan and run automated tests.

After implementation phases are complete, manually inspect preview, representative rendered frames, exported video, and audio. CI passing is not proof of visual or audio quality.


## 7. Storyboard as the primary editorial surface

The storyboard is a visual shot list, not an editing-console dashboard.

- Show each scene as a single editorial card in sequence. Keep its source still and its editable decisions together.
- The thumbnail must be a real frame sampled from the supplied source video at a representative timestamp. Label it with the source time. Never substitute generated people, stock, or unrelated images and present them as source footage.
- Scene title, time range, duration, transcript evidence, visual intention, composition and caption state belong to that card.
- Keep controls in the scene card that owns the data. Avoid a scene sidebar plus detached properties panel. Do not make a giant preview player the primary surface.
- A storyboard thumbnail is a still for reviewing shot intent. It is not the final rendered frame and should not be described as such.
- Keep media File objects and browser Blob URLs in ephemeral UI state. The JSON plan must contain stable asset IDs, never browser-local URLs.
- Every edit must update the same validated scene plan used by the renderer. An export/reopen round-trip must retain all user edits.
- If a media frame cannot be decoded, show an explicit error for that card. Never silently draw a fake placeholder that looks like an actual source frame.

## 8. Design system and implementation references

The storyboard surface adopts operating-mode craft guidance from [pbakaus/impeccable](https://github.com/pbakaus/impeccable): content-led hierarchy, readable real data, spacing rhythm, meaningful interaction states, keyboard focus, contrast, responsive structure, and a strong ban on generic AI-dashboard decoration. Its Apache-2.0 source is reviewed as a design-method reference; this repository does not vendor its scripts or agents.

The video workflow also adopts selected evidence and validation techniques from [gitethanwoo/video-editing](https://github.com/gitethanwoo/video-editing): probe actual media, preserve source facts, separate observed evidence from editorial interpretation, use representative frame/contact-sheet review, render cheap review passes before a master, and validate the final file. Its MIT source is reviewed as an approach reference; no external code is copied into this repository.

These references inform craft and verification only. They do not impose a fixed look, scene count, transition style, music bed, effect quota, or reusable visual preset.
