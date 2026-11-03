# Visual Direction

## Purpose

Create a visual treatment that explains the current video's spoken ideas. The goal is not to reproduce a fixed look or fill every scene with graphics. Choose the simplest composition that makes the idea clearer.

## Decision order

For each beat:

1. Identify the exact spoken idea and its transcript evidence.
2. Decide what the viewer should understand or notice.
3. Choose the simplest visual that supports that point.
4. Select a layout only after the visual idea is clear.
5. Add motion only when it improves hierarchy, timing, or comprehension.
6. Add sound only when a meaningful visible event benefits from it.

If the visual does not add information, keep the speaker on screen.

## Layout choices

- **Full Speaker:** use when the speaker's expression, delivery, or gesture is the main content, or when no supporting visual is needed.
- **50/50 Split:** use only when a relevant graphic, supplied source, or verified visual artifact materially helps explain the spoken point. Keep the graphic and speaker areas purposeful; captions alone do not justify a split.
- **Full Canvas:** use when a diagram, comparison, source visual, or concise statement genuinely needs the full frame. Return to the speaker when the full-frame idea is complete.

Do not force a layout change simply to create variety. Repeated layouts can be correct when they communicate continuity, progression, or comparison.

## Composition and hierarchy

- Give each scene one clear primary idea and focal point.
- Use supporting elements only when they clarify the primary idea.
- Preserve negative space. Do not fill empty areas with decorative badges, cards, grids, or labels.
- Make the most important information readable at phone size.
- Keep text, graphics, and motion away from faces and other important source content.
- Prefer a truthful simple visual over a polished but unsupported mockup.

## Captions and typography

- Captions preserve the speaker's words; do not rewrite them as headlines.
- Aim for approximately 3–4 words per caption chunk, adjusted for natural phrasing, reading speed, and timing.
- Highlight only words that deserve emphasis. Do not style every word as a headline.
- Use a clear type hierarchy and sufficient contrast. Avoid overly small text, excessive font weights, and unnecessary effects.
- Choose typography and color for the current source, background, and subject. No font family, palette, or gradient is mandatory across all videos.

### Font asset policy

1. Search the repository's assets/fonts/ library before sourcing another font.
2. Inspect the actual font files and their bundled license documents. Some local fonts may have non-commercial or personal-use restrictions; do not use them for a use case their license does not permit.
3. Choose a local font only when its design and weights suit the content. Do not select a font from its filename alone.
4. If no local font is suitable and permitted, source an external font with a compatible license and record the source and license.
5. Do not claim to generate a font. Verify that the chosen font is actually available to the renderer; do not silently fall back when font loading is unsupported.

## Color and backgrounds

- Use color to establish hierarchy, distinguish information, or maintain contrast—not to imitate a reference video.
- Keep backgrounds quiet enough that the speaker and main visual remain dominant.
- Check contrast against the actual footage and graphic background.
- Use gradients, shadows, blur, texture, or grids only when they improve legibility or depth. They are optional treatments, not defaults.

## Motion

- Think in three stages: **build → breathe → resolve**.
- Use motion to reveal information, guide attention, or communicate a change.
- Let important text and diagrams remain still long enough to read.
- Vary motion only when the meaning or composition calls for it. Do not add motion merely to avoid stillness.
- Avoid stacking blur, scale, translation, and rotation without a clear reason.
- Review neighboring scenes for repeated composition or animation patterns. Treat repetition warnings as prompts for judgment, not automatic errors.

## UI, diagrams, and source material

- Use real UI only when the spoken idea is about a real interface or the user supplied a genuine source capture.
- Never invent dashboards, metrics, percentages, buttons, logos, URLs, product names, or screenshots.
- Use diagrams for relationships, comparisons for contrasts, and timelines for genuine sequences.
- Inspect supplied footage and images before assigning them to a beat. Verify the actual visible content and source timing; a filename or contact-sheet thumbnail is not proof.
- Do not use generic cards as filler. A component's presence in the codebase is not evidence that it belongs in a scene.

## Sequence review

Review each scene in context with its neighbors and the full sequence. Look for a clear progression of ideas, balanced pacing, and meaningful changes in visual structure. Keep a repeated motif when it serves the story; redesign a scene only when another treatment communicates its meaning better.

There is no required storyboard, fixed template, locked palette, or universal scene formula.
