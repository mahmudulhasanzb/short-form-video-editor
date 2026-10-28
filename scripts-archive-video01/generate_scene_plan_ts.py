import json

with open('video-01/scene-plan-3.json', 'r', encoding='utf-8') as f:
    plan = json.load(f)

ts_content = '''import { ScenePlanItem } from "../types/scene-plan";

/**
 * Approved Edit Plan for video-01 (Plan 4, 16 Beats):
 * - Never leave a 50/50 Split screen blank (per-beat layout).
 * - Full-face split crop with blurred synchronized side-fill.
 * - Apple-style smooth staggered per-word spring captions (Mode A).
 * - DarkGlassNumberedPill with activeStepTimeline and per-step spring pop & dimming.
 * - Scenes 3 and 7 reworked with speaker return and Mode A captions.
 */
export const VIDEO_01_SCENE_PLAN: ScenePlanItem[] = ''' + json.dumps(plan, indent=2) + ''';\n'''

with open('remotion-template/src/composition/video-01-scene-plan.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print('Generated remotion-template/src/composition/video-01-scene-plan.ts successfully')
