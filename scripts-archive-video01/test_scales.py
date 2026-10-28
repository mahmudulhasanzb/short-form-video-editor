from PIL import Image, ImageFilter

img = Image.open('video-01/verification_frames/source_frame_10s.png')
w_src, h_src = img.size

# We want to find the optimal scale and y_offset where:
# 1. Head top has ~3-5% headroom (28-48px from top of 960px layer)
# 2. Chin is fully visible with at least 40-80px clearance from bottom of 960px layer
# 3. Mouth is 100% visible
# 4. Eyes land at 63% to 70% down final frame (which means 250px to 384px from top of 960px layer)
# Let's test a range of scales:

for h_target in [1300, 1400, 1480, 1550, 1620]:
    w_target = int(h_target * 720 / 1280)
    resized = img.resize((w_target, h_target), Image.Resampling.LANCZOS)
    
    # In this resized image:
    # head_top_px = 0.05 * h_target
    # eyes_px = 0.35 * h_target
    # chin_px = 0.64 * h_target
    
    # We want head_top to land at ~35px in Layer B:
    # y_offset = 35 - 0.05 * h_target
    y_offset = int(35 - 0.05 * h_target)
    
    # Chin position in Layer B:
    chin_layer_b = int(y_offset + 0.64 * h_target)
    eyes_layer_b = int(y_offset + 0.35 * h_target)
    eyes_final_pct = (960 + eyes_layer_b) / 1920 * 100
    
    # Clearance below chin:
    chin_clearance = 960 - chin_layer_b
    
    print(f"Height {h_target}px (Width {w_target}px):")
    print(f"  y_offset: {y_offset}px | Eyes in final: {eyes_final_pct:.1f}% | Chin clearance: {chin_clearance}px")
    
    # Create Layer B
    bg = img.resize((1080, 1920)).filter(ImageFilter.GaussianBlur(35)).crop((0, 480, 1080, 480 + 960))
    x_pos = (1080 - w_target) // 2
    bg.paste(resized, (x_pos, y_offset))
    bg.save(f'video-01/verification_frames/scale_{h_target}.png')
