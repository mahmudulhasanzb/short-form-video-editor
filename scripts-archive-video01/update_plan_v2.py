import json

with open("video-01/scene-plan.json", "r", encoding="utf-8") as f:
    scenes = json.load(f)

# Card lifespans by scene
card_timings = {
    1: {"start": None, "end": None},
    2: {"start": 247, "end": 370},
    3: {"start": 530, "end": 740},
    4: {"start": 860, "end": 1110},
    5: {"start": 1136, "end": 1290},
    6: {"start": 1370, "end": 1665},
    7: {"start": 1870, "end": 2280},
    8: {"start": 2313, "end": 2505},
    9: {"start": 2745, "end": 2838},
}

for s in scenes:
    sn = s["sceneNumber"]
    layout = s["layoutType"]
    
    # 1. Font size updates per Task 2
    if layout == "50/50 Split":
        s["fontSize"] = 48
        s["highlightFontSize"] = 80
    elif layout == "Full Speaker":
        s["fontSize"] = 52
        s["highlightFontSize"] = 84
    elif layout == "100% Full Canvas":
        s["fontSize"] = 52
        s["highlightFontSize"] = 84

    # 2. UI Card Lifespan per Task 3
    timing = card_timings.get(sn, {"start": None, "end": None})
    if timing["start"] is not None:
        s["uiCardStartFrame"] = timing["start"]
        s["uiCardEndFrame"] = timing["end"]
    else:
        s["uiCardStartFrame"] = None
        s["uiCardEndFrame"] = None

    # 3. Source Reference per Task 4
    s["sourceReference"] = {
        "fileName": None,
        "showStartFrame": None,
        "showEndFrame": None,
        "layout": None,
        "notes": "No user-supplied source media provided for video-01"
    }

# Save to scene-plan-2.json and scene-plan.json
with open("video-01/scene-plan-2.json", "w", encoding="utf-8") as f:
    json.dump(scenes, f, indent=2)

with open("video-01/scene-plan.json", "w", encoding="utf-8") as f:
    json.dump(scenes, f, indent=2)

print("Updated scene-plan-2.json and scene-plan.json successfully!")
