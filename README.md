# Short Form Video Editor

An installable agent skill and editing toolkit for turning talking-head footage into polished vertical short-form videos.

## User-facing commands

Keep these command names unchanged:

- `/cutout-video` — transcribe, prepare a cut list, cut and verify a cleaned video.
- `/make-video-edit-plan` — analyze the cleaned video and transcript, then create a validated plan and interactive editing experience.
- `/edit-video-auto` — orchestrate the complete workflow and stop for user review before final rendering.

## Architecture

- `SKILL.md`, `workflows/`, and `references/`: reusable agent instructions and editing guidance.
- `schemas/` and `packages/contracts/`: the plan contract shared across the system.
- `apps/editor/`: interactive React editing application.
- `apps/renderer/`: Remotion-based final video renderer.
- `packages/planner/`: structured planning and validation orchestration.
- `packages/media-pipeline/`: transcription, FFmpeg cutting, and media verification.
- `assets/`: reusable, reviewed fonts, sound effects, icons, and examples.
- Per-video workspaces are created in the active project directory, never inside the installed skill.

The repository is being migrated in stages. Legacy scripts and assets remain until their behavior and dependencies have been reviewed; their presence does not mean they are approved for reuse.

## Development

This repository uses pnpm workspaces.

```bash
pnpm install
pnpm typecheck
pnpm test
```

The first implementation milestone establishes the workspace and shared scene-plan contract. Editor and renderer applications are added against that contract in subsequent milestones.

## Global skill installation

Install or clone the **whole repository** as the skill directory so that root `SKILL.md` and its supporting folders remain together. For example:

- Codex: `~/.agents/skills/short-form-video-editor/`
- Antigravity: use the supported global skills directory for that installation.

The active project directory is separate from the skill installation directory. Video workspaces and generated outputs belong to the active project directory.
