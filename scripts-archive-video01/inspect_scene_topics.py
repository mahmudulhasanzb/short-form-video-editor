import json

with open("video-01/scene-plan.json", "r", encoding="utf-8") as f:
    plan = json.load(f)

for s in plan:
    print(f"\n==========================================")
    print(f"SCENE #{s['sceneNumber']} ({s['id']}): frames {s['startFrame']} - {s['endFrame']} ({s['layoutType']})")
    print(f"Main Focus: {s['mainFocus']}")
    print(f"UI Card: {s['uiCardNeed']}")
    chunks = s.get("captionChunks", [])
    print(f"Total chunks: {len(chunks)}")
    for i, c in enumerate(chunks):
        text = " ".join(t["text"] for t in c["tokens"])
        print(f"  Chunk {i+1} [f {c['startFrame']}-{c['endFrame']}]: {text}")
