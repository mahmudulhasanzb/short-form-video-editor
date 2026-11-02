# Shared scene-plan contract

This package owns the validated data model used by the planning agent, editor, and Remotion renderer.

## Frame convention

- All scene and caption frame ranges are absolute project-timeline frames.
- Ranges are half-open: `startFrame` is included and `endFrame` is excluded.
- Caption chunks and sound effects must fit inside their parent scene.
- `speakerCrop` values are normalized percentages of the source frame.
- Asset IDs are stable references; file paths belong in the workspace asset manifest, not in the reusable plan.

## Change policy

Update the schema, tests, editor, and renderer together when changing the contract. Increment `schemaVersion` for incompatible changes. Never add fake fallback content to make an invalid plan render.
