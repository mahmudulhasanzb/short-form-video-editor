import json

with open("video-01/scene-plan-2.json", "r", encoding="utf-8") as f:
    plan = json.load(f)

s2b = next(s for s in plan if s["id"] == "scene-02-b")
sceneStartFrame = 370
durationInFrames = 150 # Scene 2B duration

chunks = s2b["captionChunks"]
normalizedChunks = []
for i, c in enumerate(chunks):
    relStart = c["startFrame"] - sceneStartFrame
    relEnd = c["endFrame"] - sceneStartFrame
    nextChunk = chunks[i + 1] if i + 1 < len(chunks) else None
    nextRelStart = (nextChunk["startFrame"] - sceneStartFrame) if nextChunk else durationInFrames
    hideFrame = min(nextRelStart, max(relEnd + 6, relStart + 45))
    normalizedChunks.append({
        "tokens": c["tokens"],
        "relStart": relStart,
        "relEnd": relEnd,
        "nextRelStart": nextRelStart,
        "hideFrame": hideFrame,
        "duration": max(1, hideFrame - relStart)
    })

for i, nc in enumerate(normalizedChunks):
    text = " ".join(t["text"] for t in nc["tokens"])
    print(f"Chunk {i+1}: relStart={nc['relStart']}, hideFrame={nc['hideFrame']}, nextRelStart={nc['nextRelStart']} -> {text}")

# Check at frame = 130 (timeline 500) and frame = 135 (timeline 505)
for f in [120, 125, 129, 130, 135, 140]:
    active = next((c for c in normalizedChunks if f >= c["relStart"] and f < c["hideFrame"]), None)
    text = " ".join(t["text"] for t in active["tokens"]) if active else "NONE"
    print(f"At scene frame {f} (timeline {f + 370}): Active Chunk = {text}")
