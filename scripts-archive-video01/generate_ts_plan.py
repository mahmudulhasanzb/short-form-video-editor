import json

with open("video-01/scene-plan-3.json", "r", encoding="utf-8") as f:
    scenes = json.load(f)

ts_content = """import { staticFile } from "remotion";
import { ScenePlanItem } from "../types/scene-plan";

/**
 * Approved Edit Plan for video-01 (Plan 3, 14 Beats):
 * - Never leave a 50/50 Split screen blank (per-beat layout).
 * - Full-face split crop with blurred synchronized side-fill.
 * - Apple-style smooth per-word spring typography motion.
 * - Increased font sizes (48/80 in split, 52/84 in full speaker) and 600 weight.
 * - Topic-tied UI card lifespans with smooth entrance and exit.
 * - Formal sourceReference schema (empty for video-01 with documented reason).
 */
export const VIDEO_01_SCENE_PLAN: ScenePlanItem[] = [
"""

for s in scenes:
    s_copy = dict(s)
    needs_speaker = s_copy.get("layoutType") in ["Full Speaker", "50/50 Split"]
    speaker_src_str = 'staticFile("video-01/cleaned.mp4")' if needs_speaker else 'undefined'
    if "speakerSrc" in s_copy:
        del s_copy["speakerSrc"]
    
    # Format json string
    raw_json = json.dumps(s_copy, indent=2)
    # Indent raw_json by 2 spaces
    indented = "\n".join("  " + line for line in raw_json.split("\n"))
    # Insert speakerSrc before the closing brace
    indented_with_speaker = indented[:-3] + f',\n    "speakerSrc": {speaker_src_str}\n  }},'
    ts_content += indented_with_speaker + "\n"

# Remove trailing comma from last item
ts_content = ts_content.rstrip().rstrip(",") + "\n];\n"

with open("remotion-template/src/composition/video-01-scene-plan.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Regenerated video-01-scene-plan.ts successfully!")
