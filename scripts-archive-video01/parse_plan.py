import json

with open('video-01/scene-plan-user.json', 'r', encoding='utf-8') as f:
    raw = f.read()

# Find first '[' and last ']'
start_idx = raw.find('[')
end_idx = raw.rfind(']')

if start_idx != -1 and end_idx != -1:
    json_str = raw[start_idx:end_idx+1]
else:
    raise ValueError("Could not find JSON array in input")

scenes = json.loads(json_str)
print(f"Loaded {len(scenes)} scenes successfully.")
total_frames = 0
for sc in scenes:
    print(f"Scene {sc.get('sceneNumber')}: {sc.get('id')} [{sc.get('startFrame')}-{sc.get('endFrame')}] "
          f"({sc.get('startTimestamp')}-{sc.get('endTimestamp')}) "
          f"Layout: {sc.get('layoutType')} | Card: {sc.get('uiCardNeed')} | SFX: {len(sc.get('soundCues', []))}")
    total_frames = max(total_frames, sc.get('endFrame', 0))

print(f"Total composition frames: {total_frames} (at 30fps = {total_frames/30.0:.2f}s)")

with open('video-01/scene-plan.json', 'w', encoding='utf-8') as f:
    json.dump(scenes, f, indent=2)

print("Saved video-01/scene-plan.json")
