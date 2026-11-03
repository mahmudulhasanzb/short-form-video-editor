# Agent Instructions

## Project identity
- Skill name: `short-form-video-editor`.
- Preserve these user-facing slash commands exactly: `/edit-video-auto`, `/cutout-video`, and `/make-video-edit-plan`.
- This repository is both the installable skill package and the source repository. Keep the discoverable `SKILL.md` at the repository root.

## Branch safety
- All work requested in this collaboration must be made only on the existing `ChatGPT` branch.
- Never create, switch to, or modify another branch.
- Do not modify `main` or merge/release without the user's explicit approval.

## Architecture rules
- Treat `scene-plan.json` as the single source of truth shared by planning, the editor, preview, and rendering.
- Keep agent instructions, reusable workflows, schemas/contracts, editor UI, renderer, media processing, assets, and per-video workspaces separated.
- Do not put per-video outputs inside this repository or the installed skill directory.
- Resolve the active project directory from the agent runtime. If it is unavailable or ambiguous, ask before writing files.
- Never modify installed skill source files during normal video editing.
- Keep each video's inputs, analysis, plan, generated assets, renders, and reports in its own workspace.
- Never invent transcript content, statistics, source assets, sound filenames, or visual data.
- A visual alternative must represent a genuinely different composition, not only a different label.
- Editor preview and final renderer must consume the same validated scene-plan contract.
- Validate input data and asset references before rendering; fail clearly rather than silently substituting fake content.
- Preserve `assets/fonts/` and `assets/sound-effects/`; inspect their contents and applicable licenses before selecting assets.

## Engineering rules
- Use Bun workspaces and the committed root `bun.lock`; do not introduce another package manager or lockfile.
- Run the explicit root `typecheck`, `test`, and `build` scripts. Do not use `--if-present` to silently skip required workspace validation.
- Add or update tests for schema, timeline, editing, and rendering behavior.
- Do not delete legacy files until their reusable logic has been reviewed and migrated.
- Keep modules small and give each module one clear responsibility.
- Do not add dependencies without a concrete need.
