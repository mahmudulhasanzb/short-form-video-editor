# Remotion renderer

The renderer consumes the same validated scene-plan.json contract as the editor. It does not reconstruct scenes from HTML or keep a second plan format.

## Asset manifest

Create an asset manifest JSON file in the per-video workspace. Keys are stable asset IDs referenced by the plan; values are exact paths relative to the manifest file or absolute paths.

~~~json
{
  "cleaned-video": "<path-to-cleaned-source-video>",
  "sound-effect-asset-id": "<exact-path-to-auditioned-sound-file>",
  "visual-asset-id": "<exact-path-to-verified-visual-file>"
}
~~~

Search assets/sound-effects/ and assets/fonts/ in the repository before sourcing assets elsewhere. Select sound effects by audition, not filename. Check font licenses and verify that the renderer can load the chosen font. Missing references must stop rendering; never substitute a generic asset.

## Render

From the repository root:

~~~bash
bun install
bun --filter @sfe/renderer render -- <workspace>/planning/scene-plan.json <workspace>/assets/asset-manifest.json <workspace>/renders/final.mp4
~~~

## Preview note

The Remotion Studio shortcut is not exposed yet. The Studio needs a user-selected plan and workspace asset manifest, rather than fake default video data. Use the validated render CLI until the plan-loading preview bridge is implemented.

## Current scope

Implemented: scene sequencing, full-speaker / split / full-canvas layouts, selected visual elements, caption chunks, camera zoom/pan, per-element motion, and per-scene sound cues.

Not yet complete: precise source crop transform, background music/voice mix, custom transition system, font asset registration, editor-to-render preview parity tests, and render QC pipeline. The renderer remains a functional foundation; verify unsupported features instead of assuming they are available.
