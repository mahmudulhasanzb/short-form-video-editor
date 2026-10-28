import subprocess
import os

frames_dir = os.path.abspath('video-01/verification_frames')
os.makedirs(frames_dir, exist_ok=True)
render_file = os.path.abspath('video-01/final_render.mp4')

time_offsets = [
    ("scene-01", 2.0),
    ("scene-02", 12.0),
    ("scene-03", 21.0),
    ("scene-04", 30.0),
    ("scene-06", 50.0),
    ("scene-07", 66.7),
    ("scene-08", 81.7),
    ("scene-09", 90.0),
]

for name, ts in time_offsets:
    out_img = os.path.join(frames_dir, f"{name}.png")
    cmd = [
        'ffmpeg', '-y',
        '-ss', str(ts),
        '-i', render_file,
        '-vframes', '1',
        '-q:v', '2',
        out_img
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Extracted {name} at {ts}s -> {os.path.exists(out_img)}")

print("Verification frames generated in video-01/verification_frames/")
