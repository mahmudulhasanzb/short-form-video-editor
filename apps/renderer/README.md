# Remotion renderer

The renderer consumes the same validated `scene-plan.json` contract as the editor. It does not reconstruct scenes from HTML or keep a second plan format.

## Asset manifest

Create an asset manifest JSON file in the per-video workspace. Keys are the stable asset IDs referenced by the plan; values are paths relative to the manifest file or absolute paths.

```json
{
  "cleaned-video": "../input/cleaned.mp4",
  "sfx-whoosh-01": "../assets/whoosh-01.wav",
  "visual-product-shot": "../assets/product-shot.png"
}
```

The plan's `source.videoAssetId` must map to the cleaned source video. Image/icon and enabled sound-effect references must also resolve. Missing references stop rendering.

## Render

From the repository root:

```bash
pnpm install
pnpm --filter @sfe/renderer render -- <workspace>/planning/scene-plan.json <workspace>/assets/asset-manifest.json <workspace>/renders/final.mp4
```

## Current scope

Implemented: scene sequencing, full-speaker / split / full-canvas layouts, selected visual elements, caption chunks, camera zoom/pan, and per-scene sound cues.

Not yet complete: precise source crop transform, background music/voice mix, custom transition system, font asset registration, editor-to-render preview parity tests, and render QC pipeline. The current renderer is a functional foundation, not a release-ready final pipeline.
