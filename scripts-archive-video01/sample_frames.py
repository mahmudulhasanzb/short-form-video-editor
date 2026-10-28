import os
import subprocess
from PIL import Image
import numpy as np

# Extract frames 470, 480, 490, 500, 510, 515
for f in [460, 475, 485, 495, 510, 515]:
    sec = f / 30.0
    out = f"video-01/test_f_{f}.png"
    subprocess.run(["ffmpeg", "-y", "-ss", f"{sec:.3f}", "-i", "video-01/test_scenes_1_2.mp4", "-vframes", "1", out], capture_output=True)
    img = np.array(Image.open(out))
    # Count white pixels in lower third
    white = np.sum((img[1600:1800, :, 0] > 220) & (img[1600:1800, :, 1] > 220) & (img[1600:1800, :, 2] > 220))
    print(f"Frame {f} ({sec:.2f}s): white pixels in lower third = {white}")
