from PIL import Image
import numpy as np

img = Image.open("video-01/test_frame_380.png")
# Let's save a crop of Layer B with a grid of y-coordinates overlaid
layer_b = img.crop((0, 960, 1080, 1920))
layer_b.save("video-01/layer_b_crop_380.png")

# Let's inspect the math from PersonCrop.tsx:
# headTopPercent = 5, chinPercent = 64
# faceSpan = (64 - 5) / 100 = 0.59
# targetFaceHeight = 960 * 0.81 = 777.6px
# videoHeight = round(777.6 / 0.59) = 1318px
# targetHeadTop = round(960 * 0.035) = 34px
# yOffset = round(34 - 0.05 * 1318) = -32px
# In Layer B:
# top of video is at y = -32px.
# In source video (1280px tall):
# head top is at 5% of 1280 = 64px.
# In Layer B: -32 + (64 / 1280) * 1318 = -32 + 65.9 = 34px (in final frame: 960 + 34 = 994px = 51.8%)
# eyeLine is at 35% of 1280 = 448px.
# In Layer B: -32 + (448 / 1280) * 1318 = -32 + 461.3 = 429px (in final frame: 960 + 429 = 1389px = 72.3%)
# mouth is at 52% of 1280 = 665px.
# In Layer B: -32 + (665 / 1280) * 1318 = -32 + 685 = 653px (in final frame: 960 + 653 = 1613px = 84.0%)
# chin is at 64% of 1280 = 819px.
# In Layer B: -32 + (819 / 1280) * 1318 = -32 + 843.5 = 812px (in final frame: 960 + 812 = 1772px = 92.3%)
# Below chin: neck/shoulders are from 812px to 1318 - 32 = 1286px.
# The container cuts off at 960px.
# So chin is at 812px inside the 960px container!
# Clearance from chin (812px) to bottom edge (960px) is: 960 - 812 = 148px!

print("Expected exact geometry:")
print(f"  Head top:  y = 994px (51.8% down final frame)")
print(f"  Eye line:  y = 1389px (72.3% down final frame)")
print(f"  Mouth:     y = 1613px (84.0% down final frame)")
print(f"  Chin:      y = 1772px (92.3% down final frame)")
print(f"  Clearance: 148px above bottom edge (960 - 812 = 148px)")
