# Remotion renderer

The renderer consumes the same validated `scene-plan.json` contract as the editor. The editor's Remotion Player preview and the final render use the shared `VideoComposition`; the renderer does not reconstruct scenes from HTML or keep a second plan format.

## Asset manifest

Create an asset manifest JSON file in the per-video workspace. Keys are stable asset IDs referenced by the plan; values are exact paths relative to the manifest file or absolute paths.

~~~json
{
  "cleaned-video": "<path-to-cleaned-source-video>",
  "sound-effect-asset-id": "<exact-path-to-auditioned-sound-file>",
  "visual-asset-id": "<exact-path-to-verified-visual-file>"
}
~~~

Search `assets/sound-effects/` and `assets/fonts/` in the repository before sourcing assets elsewhere. Select sound effects by audition, not filename. Check font licenses and verify that the chosen font can actually be loaded by the renderer. The current renderer does not yet register or load custom font files; do not claim a local font is active in the final render until font loading is implemented and verified. Missing references must stop rendering; never substitute a generic asset.

## Render

From the repository root:

~~~bash
bun install --frozen-lockfile
bun --filter @sfe/renderer render -- <workspace>/planning/scene-plan.json <workspace>/assets/asset-manifest.json <workspace>/renders/final.mp4
~~~

## Preview

The editor provides an interactive Remotion Player preview backed by the same `VideoComposition` used for export. Standalone Remotion Studio plan/workspace loading is not exposed as a separate shortcut.

## Current scope

Implemented: scene sequencing, full-speaker / split / full-canvas layouts, selected visual elements, caption chunks and supported caption animation, camera zoom/pan, speaker crop framing, per-element motion and styles, and per-scene sound cues.

Not yet complete: background music/voice mix, custom transition system, custom font asset registration, full editor-to-render visual parity coverage, and automated render QC. Verify unsupported features instead of assuming they are available.
