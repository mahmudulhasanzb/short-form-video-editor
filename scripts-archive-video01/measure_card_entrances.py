import subprocess
import os
import numpy as np
from PIL import Image

targets = [
    ('timeline', 873, 895, 875, (200, 700, 100, 980), (246, 246, 244)),
    ('browser', 1368, 1390, 1370, (200, 700, 100, 980), (246, 246, 244)),
    ('soundwave', 2311, 2333, 2313, (200, 700, 100, 980), (246, 246, 244)),
    ('pill', 1134, 1156, 1136, (1400, 1850, 200, 880), None) # dark background
]

os.makedirs('video-01/audit_frames', exist_ok=True)

for name, f_start, f_end, expected_start, crop_box, bg_color in targets:
    print(f'=== Extracting {name} (frames {f_start}-{f_end}) ===')
    out_pattern = f'video-01/audit_frames/{name}_%03d.png'
    cmd = [
        'ffmpeg', '-y', '-i', 'video-01/final_render.mp4',
        '-vf', f'select=between(n\\,{f_start}\\,{f_end})',
        '-fps_mode', 'passthrough',
        out_pattern
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

print('All extractions complete. Analyzing pixel data...')

for name, f_start, f_end, expected_start, (y1, y2, x1, x2), bg_color in targets:
    print(f'\n--- Analysis for {name} (expected start {expected_start}) ---')
    files = sorted([f for f in os.listdir('video-01/audit_frames') if f.startswith(name + '_')])
    for idx, fn in enumerate(files, 1):
        actual_frame = f_start + (idx - 1)
        im = Image.open(os.path.join('video-01/audit_frames', fn)).convert('RGB')
        arr = np.array(im)
        region = arr[y1:y2, x1:x2]
        
        if bg_color is not None:
            # Measure difference from top canvas background
            diff = np.abs(region.astype(float) - np.array(bg_color))
            active_pixels = np.sum(diff > 30)
            print(f'Frame {actual_frame} (offset {actual_frame - expected_start:+2d}): active card pixels = {active_pixels}')
        else:
            # For pill, compare against frame before start (f1135)
            # We can measure difference from first frame (f1134)
            base_im = Image.open(os.path.join('video-01/audit_frames', f'{name}_001.png')).convert('RGB')
            base_arr = np.array(base_im)[y1:y2, x1:x2]
            diff = np.abs(region.astype(float) - base_arr.astype(float))
            active_pixels = np.sum(diff > 25)
            print(f'Frame {actual_frame} (offset {actual_frame - expected_start:+2d}): diff pixels = {active_pixels}')
