import json
import os

with open('video-01/scene-plan.json', 'r', encoding='utf-8') as f:
    scenes = json.load(f)

public_dir = os.path.abspath('remotion-template/public')
sound_effects_dir = os.path.join(public_dir, 'sound-effects')
video_file = os.path.join(public_dir, 'video-01', 'cleaned.mp4')

print(f"Checking video file: {video_file} exists: {os.path.exists(video_file)}")

missing_sfx = []
total_sfx = 0
for sc in scenes:
    cues = sc.get('soundCues', [])
    for cue in cues:
        total_sfx += 1
        fn = cue['filename']
        full_path = os.path.join(sound_effects_dir, fn)
        if not os.path.exists(full_path):
            missing_sfx.append((sc['sceneNumber'], cue['id'], fn, full_path))

print(f"Total SFX cues across 9 scenes: {total_sfx}")
if missing_sfx:
    print(f"FLAG: {len(missing_sfx)} SFX files missing!")
    for s_num, cid, fn, fp in missing_sfx:
        print(f" - Scene {s_num} ({cid}): {fn} -> not found at {fp}")
else:
    print("[OK] All sound effects exist and are resolved accurately in public/sound-effects!")
