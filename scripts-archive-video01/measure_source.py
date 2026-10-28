from PIL import Image

img = Image.open('video-01/verification_frames/source_frame_10s.png')
w, h = img.size
print(f"Dimensions: {w}x{h}")

# In 720x1280:
# Where is top of hair?
# Let's inspect rows from top to bottom
# Top of hair is roughly around y=70-80 (6%)
# Eyes are around y=440!
# Wait! Let's check where the eyes actually are in source_frame_10s.png!

# Let's draw horizontal lines across the image every 10% (128px) with labels to visually verify exact percentages!
from PIL import ImageDraw, ImageFont

marked = img.copy()
draw = ImageDraw.Draw(marked)
for pct in range(5, 95, 5):
    y = int(pct * h / 100)
    color = "red" if pct in [6, 27, 40, 48, 65] else "yellow"
    draw.line([(0, y), (w, y)], fill=color, width=2)
    draw.text((10, y - 15), f"{pct}% ({y}px)", fill="white")

marked.save('video-01/verification_frames/measured_percentages.png')
print("Saved measured_percentages.png")
