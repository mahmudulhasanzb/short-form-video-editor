import json

with open("video-01/scene-plan-2.json", "r", encoding="utf-8") as f:
    plan = json.load(f)

s2b = next(s for s in plan if s["id"] == "scene-02-b")
print(f"Scene 2B startFrame: {s2b['startFrame']}, endFrame: {s2b['endFrame']}")
for i, c in enumerate(s2b["captionChunks"]):
    print(f"Chunk {i+1}: f={c['startFrame']}-{c['endFrame']}: {' '.join(t['text'] for t in c['tokens'])}")
