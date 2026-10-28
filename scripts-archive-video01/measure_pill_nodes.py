from PIL import Image
import numpy as np

f1160 = np.array(Image.open('video-01/test_frames/scene5_f1160_step1_active.png'))
f1200 = np.array(Image.open('video-01/test_frames/scene5_f1200_step2_active.png'))
f1250 = np.array(Image.open('video-01/test_frames/scene5_f1250_step3_active.png'))

nodes = [
    ('Node 1 (Step 1)', (1682, 1702, 442, 462)),
    ('Node 2 (Step 2)', (1682, 1702, 530, 550)),
    ('Node 3 (Step 3)', (1682, 1702, 618, 638))
]

frames = [
    ('Frame 1160 (Step 1 Active)', f1160),
    ('Frame 1200 (Step 2 Active)', f1200),
    ('Frame 1250 (Step 3 Active)', f1250)
]

print(f'{"Frame":<28} | {"Node 1 Lum (RGB)":<22} | {"Node 2 Lum (RGB)":<22} | {"Node 3 Lum (RGB)":<22}')
print('-' * 105)

for f_name, arr in frames:
    results = []
    for n_name, (y1, y2, x1, x2) in nodes:
        patch = arr[y1:y2, x1:x2]
        mean_rgb = patch.mean(axis=(0,1))
        lum = 0.299 * mean_rgb[0] + 0.587 * mean_rgb[1] + 0.114 * mean_rgb[2]
        results.append(f'{lum:5.1f} ({int(mean_rgb[0])},{int(mean_rgb[1])},{int(mean_rgb[2])})')
    print(f'{f_name:<28} | {results[0]:<22} | {results[1]:<22} | {results[2]:<22}')
