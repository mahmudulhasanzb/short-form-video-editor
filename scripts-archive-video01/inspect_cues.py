import json

with open("video-01/scene-plan-2.json", "r", encoding="utf-8") as f:
    plan = json.load(f)

for s in plan:
    cues = s.get("soundCues", [])
    print(f"Scene #{s['sceneNumber']} ({s['startFrame']}-{s['endFrame']}) has {len(cues)} cues:")
    for c in cues:
        print(f"   f={c['frame']}: {c['family']} - {c.get('notes', '')} ({c['filename']})")
