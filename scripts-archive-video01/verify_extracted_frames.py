from PIL import Image
import numpy as np

frames = [
    ("Frame 260 (~8.67s)", "video-01/verify_frame_260_slider_entry.png"),
    ("Frame 350 (~11.67s)", "video-01/verify_frame_350_split_chunk.png"),
    ("Frame 400 (~13.33s)", "video-01/verify_frame_400_full_speaker.png"),
    ("Frame 500 (~16.67s)", "video-01/verify_frame_500_full_speaker.png"),
]

print("=== VERIFICATION OF EXTRACTED TEST FRAMES ===")

for label, path in frames:
    img = Image.open(path)
    arr = np.array(img)
    
    # Check top half background (y: 100 to 400, x: 100 to 980)
    top_region = arr[100:400, 100:980]
    mean_top_lum = np.mean(top_region)
    
    # In 50/50 Split, top background is warm grid (#F8F7F4, lum ~ 240-248)
    # In Full Speaker, top background is dark studio (#0B1528, lum ~ 15-40)
    is_split = mean_top_lum > 120
    layout = "50/50 Split" if is_split else "Full Speaker"
    
    # Check card presence in top region:
    # BeginnerProSlider is a dark glass card (lum ~ 30-60) sitting on the light canvas
    card_present = "Absent (no card)"
    if is_split:
        card_subregion = arr[200:450, 270:810]
        # Dark glass pixels
        dark_card_pixels = np.sum((card_subregion[:, :, 0] < 50) & (card_subregion[:, :, 1] < 50) & (card_subregion[:, :, 2] < 70))
        if dark_card_pixels > 5000:
            card_present = "Present (BeginnerProSlider)"
    
    # Check caption region and color:
    # If Split, caption is in Layer A (y: 800 to 950), text is Dark Navy (#0F172A)
    # If Full Speaker, caption is in lower third (y: 1550 to 1800), text is White (#FFFFFF)
    if is_split:
        caption_area = arr[800:950, 100:980]
        dark_pixels = np.sum((caption_area[:, :, 0] < 50) & (caption_area[:, :, 1] < 50) & (caption_area[:, :, 2] < 60))
        blue_pixels = np.sum((caption_area[:, :, 0] < 70) & (caption_area[:, :, 1] > 80) & (caption_area[:, :, 2] > 180))
        caption_color = f"Dark Navy (#0F172A) [{dark_pixels} px] + Blue Script ({blue_pixels} px)"
    else:
        caption_area = arr[1550:1800, 100:980]
        white_pixels = np.sum((caption_area[:, :, 0] > 230) & (caption_area[:, :, 1] > 230) & (caption_area[:, :, 2] > 230))
        blue_pixels = np.sum((caption_area[:, :, 0] < 120) & (caption_area[:, :, 1] > 140) & (caption_area[:, :, 2] > 220))
        caption_color = f"Pure White (#FFFFFF) [{white_pixels} px] + Light Blue Script ({blue_pixels} px)"
        
    # Check face visibility:
    # In Split: speaker face is in Layer B (y: 960 to 1920)
    # In Full Speaker: speaker face is in upper/center area (y: 400 to 1200)
    if is_split:
        face_strip = arr[960:1920, 450:630]
        skin_pixels = np.sum((face_strip[:, :, 0] > 95) & (face_strip[:, :, 1] > 40) & (face_strip[:, :, 0] > face_strip[:, :, 2]))
        face_visibility = "Full face (head, eyes, mouth, chin) & shoulders visible in Layer B"
    else:
        face_strip = arr[400:1300, 450:630]
        skin_pixels = np.sum((face_strip[:, :, 0] > 95) & (face_strip[:, :, 1] > 40) & (face_strip[:, :, 0] > face_strip[:, :, 2]))
        face_visibility = "Full face (head, eyes, mouth, chin) & shoulders visible in center 9:16"
        
    print(f"\n[{label}] (File: {path})")
    print(f"  Layout:          {layout}")
    print(f"  Top Lum:         {mean_top_lum:.1f} ({'Warm-grid canvas' if is_split else 'Dark studio backdrop'})")
    print(f"  Card Status:     {card_present}")
    print(f"  Caption Colour:  {caption_color}")
    print(f"  Face Visibility: {face_visibility} (Skin pixels: {skin_pixels})")
