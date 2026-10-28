import json

with open("video-01/scene-plan-3.json", "r", encoding="utf-8") as f:
    plan = json.load(f)

print(f"Total scenes in scene-plan-3.json: {len(plan)}")
for s in plan:
    card = s.get("uiCardNeed", "none")
    print(f"  {s['id']}: {s['layoutType']} (f {s['startFrame']}-{s['endFrame']}, dur {s['endFrame']-s['startFrame']}) [Card: {card}]")

total_dur = sum(s["endFrame"] - s["startFrame"] for s in plan)
print(f"Total duration: {total_dur} frames (expected 2841)")
assert total_dur == 2841, "Duration mismatch!"
assert plan[0]["startFrame"] == 0, "Does not start at 0!"
assert plan[-1]["endFrame"] == 2841, "Does not end at 2841!"
print("Verification passed! Plan 3 is 100% complete and valid.")
