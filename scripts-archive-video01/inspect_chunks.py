import json

with open("video-01/scene-plan.json", "r", encoding="utf-8") as f:
    plan = json.load(f)

scene2 = next(s for s in plan if s["id"] == "scene-02")
print(f"Scene 2 total frames: {scene2['startFrame']} to {scene2['endFrame']} (duration {scene2['endFrame'] - scene2['startFrame']} frames)")
print("First 5 chunks in Scene 2:")
for i, c in enumerate(scene2["captionChunks"][:5]):
    words = " ".join(t["text"] + (" (HIGHLIGHTED)" if t.get("isHighlighted") else "") for t in c["tokens"])
    print(f"  Chunk {i+1}: startFrame={c['startFrame']}, endFrame={c['endFrame']}, tokens: {words}")
