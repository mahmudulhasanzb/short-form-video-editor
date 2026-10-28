import json

with open("video-01/scene-plan.json", "r", encoding="utf-8") as f:
    plan = json.load(f)

for s in plan:
    print(f"Scene #{s['sceneNumber']} ({s['layoutType']}, {s['contentType']}):")
    print(f"  uiCardNeed: {s.get('uiCardNeed')}")
    print(f"  uiCardProps: {s.get('uiCardProps')}")
    print(f"  captionMode: {s.get('captionMode')}")
