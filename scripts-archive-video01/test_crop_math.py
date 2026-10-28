import subprocess
from PIL import Image
import os

img = Image.open('video-01/verification_frames/source_frame_10s.png')
w_src, h_src = img.size
print(f"Source image size: {w_src}x{h_src}")

# Plan measurements for speaker:
# headTop: 6% (76.8px)
# eyeLine: 27% (345.6px)
# mouth: ~40% (512px)
# chin: 48% (614.4px)
# shoulders: 65% (832px)

# In final 1080x1920 video, Layer B is (0, 960) to (1080, 1920) - 1080x960.
# We want to crop/fit the person into 1080x960.
# Let's test different crop strategies:

# Strategy A:
# If we scale source so shoulders/chin fit in 960px height:
# Suppose we take source vertical range y_start to y_end.
# To keep headroom ~3%: y_start = 0.03 * h_src = 38.4px.
# Where should chin land? Chin is at 0.48 * h_src.
# Shoulders are at 0.65 * h_src.
# If y_end is at 0.68 * h_src (870.4px):
# The height of this slice is (0.68 - 0.03) * 1280 = 832px.
# If we scale this slice to 960px height:
# scale_factor = 960 / 832 = 1.1538.
# Then width = 720 * 1.1538 = 830.7px.
# If width is 830.7px, how do we fill 1080px?
# What if we scale to cover 1080px width?
# If width = 1080px, scale_factor = 1080 / 720 = 1.5.
# Then total height = 1280 * 1.5 = 1920px.
# If total height = 1920px:
# headTop = 0.06 * 1920 = 115px.
# chin = 0.48 * 1920 = 922px.
# Height from headTop to chin is 922 - 115 = 807px.
# Can 807px fit into 960px? YES! 807px < 960px!
# Headroom: 40px (headTop lands at 40px below top of Layer B).
# Then chin lands at 40 + 807 = 847px below top of Layer B!
# 847px < 960px! Chin has 960 - 847 = 113px of clearance above bottom of Layer B!
# And where do eyes land in final 1080x1920 frame?
# Eyes in video = 0.27 * 1920 = 518.4px.
# With top of video at y_offset:
# If headTop (115px) is at 40px in Layer B:
# y_offset = 40 - 115 = -75px.
# Eyes in Layer B = 518.4 - 75 = 443.4px.
# Eyes in final 1920 frame = 960 + 443.4 = 1403.4px!
# 1403.4 / 1920 = 73.09%!
# Head top in final frame = (960 + 40) / 1920 = 1000 / 1920 = 52.08% (4.16% below split line).
# Chin in final frame = (960 + 847) / 1920 = 1807 / 1920 = 94.11% (59px above bottom edge)!
# Mouth in final frame = 960 + (0.40 * 1920 - 75) = 960 + 693 = 1653px = 86.1%!

# Let's render this Strategy A crop and save as test_crop_A.png!
w_target = 1080
h_video = int(1080 * 1280 / 720) # 1920
resized = img.resize((w_target, h_video), Image.Resampling.LANCZOS)
# Crop 960px height starting at y = 75px:
layer_b_A = resized.crop((0, 75, 1080, 75 + 960))
layer_b_A.save('video-01/verification_frames/test_crop_A.png')
print("Saved test_crop_A.png")
