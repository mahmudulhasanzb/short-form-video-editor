# Editor app (foundation)

This is the first interactive editor shell. It imports a `scene-plan.json`, validates it with the shared Zod contract, exposes scene selection, timeline navigation, scene name/layout/visual type/alternative/camera-motion editing, and exports the validated plan.

Current intentional limitations:
- Source-media playback and frame scrubbing are not connected yet.
- Caption chunk editing and sound-effect audition/timing controls are not implemented yet.
- The visual preview currently renders structured plan elements only; it does not pretend to show the actual source video.
- Adding/deleting/reordering scenes and full element-level canvas manipulation are later milestones.

Run from the repository root after dependencies are installed:

```bash
pnpm --filter @sfe/editor dev
```
