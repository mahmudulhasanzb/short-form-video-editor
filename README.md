# Short Form Video Editor

An installable agent skill and editing toolkit for turning talking-head footage into polished vertical short-form videos.

## User-facing commands

Keep these command names unchanged:

- **/cutout-video** — transcribe, prepare a cut list, cut, and verify a cleaned video.
- **/make-video-edit-plan** — analyze the cleaned video and transcript, then create a validated plan for interactive review.
- **/edit-video-auto** — orchestrate the complete workflow and stop for user approval before final rendering.

## Architecture

- **SKILL.md** — active agent instructions and command routing.
- **workflows/** — command-specific procedures.
- **references/** — reusable editing, visual-direction, sound-design, and verification guidance.
- **packages/contracts/** — shared validated scene-plan contract.
- **apps/editor/** — interactive scene-plan editor.
- **apps/renderer/** — Remotion-based renderer.
- **scripts/** — reusable media inspection and verification utilities.
- **assets/fonts/** — local font library; check each font's license before use.
- **assets/sound-effects/** — local sound-effect library, organized by category.

Per-video workspaces and generated outputs belong in the active project directory, never inside this repository or the installed skill. The repository does not contain a required example video, storyboard, or starter composition.

## Development

This repository uses Bun workspaces.

~~~bash
bun install
bun run typecheck
bun run test
bun run build
~~~

## Global skill installation

Install or clone the whole repository as the skill directory so that root SKILL.md and its supporting folders remain together. For example:

- Codex: ~/.agents/skills/short-form-video-editor/
- Antigravity: use the supported global skills directory for that installation.

The active project directory is separate from the skill installation directory. Video workspaces and generated outputs belong to the active project directory.
