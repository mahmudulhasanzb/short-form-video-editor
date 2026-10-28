from PIL import Image, ImageFilter
import os

img = Image.open('video-01/verification_frames/source_frame_10s.png')
w_src, h_src = img.size # 720x1280

# We want to produce a 1080x960 image for Layer B.
# Let's test 3 options:

# Option 1: Scale video to width 1080 (height 1920), but scale DOWN so full head fits!
# To fit head (5%) to collar (75%) into 960px:
# Height range in source = (0.75 - 0.03) * 1280 = 921.6px.
# If video height in Layer B is 1350px:
# width = 1350 * 720 / 1280 = 759px.
# If we place this 759x1350 video centered horizontally, with a blurred video background covering 1080x960:
bg = img.resize((1080, 1920)).filter(ImageFilter.GaussianBlur(30))
bg_crop = bg.crop((0, 480, 1080, 480 + 960)) # 1080x960 blurred background

vid_scaled = img.resize((int(1350 * 720 / 1280), 1350)) # 759x1350
# We want head top (5% of 1350 = 67.5px) to be ~30px below top of 960px.
# So y_offset = 30 - 67.5 = -37.5px.
opt1 = bg_crop.copy()
x_pos = (1080 - vid_scaled.width) // 2
opt1.paste(vid_scaled, (x_pos, -38))
opt1.save('video-01/verification_frames/opt1_blurred_sides.png')

# Option 2: Pure scale and crop (width 1080, but what if video is 1080 wide, and we shift it up so chin is at 90%):
# At width 1080, height is 1920:
# chin is at 0.64 * 1920 = 1228.8px.
# If chin is at 900px in Layer B (60px above bottom):
# y_offset = 900 - 1228.8 = -328.8px.
# Then head top (5% = 96px) is at 96 - 328.8 = -232.8px (head cut off!).
# This confirms Option 2 with full 1080 width ALWAYS cuts either head or chin if aspect ratio is preserved.

# Option 3: Scale video height so it fills 960px height directly:
# What if height = 960px? Then width = 960 * 720 / 1280 = 540px.

# Option 4: Slight zoom (scale = 0.85):
# height = 1500px, width = 844px.
# If we extend the background with the grey wall color (#8E8E93 / border replication or blurred video):
# Let's inspect opt1 first!

print("Saved opt1_blurred_sides.png")
