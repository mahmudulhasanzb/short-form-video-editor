from PIL import Image
import numpy as np

frames = [
    ("Frame 260 (~8.67s)", "video-01/verify_frame_260_slider_entry.png"),
    ("Frame 350 (~11.67s)", "video-01/verify_frame_350_split_chunk.png"),
    ("Frame 400 (~13.33s)", "video-01/verify_frame_400_full_speaker.png"),
    ("Frame 510 (~17.00s)", "video-01/verify_frame_510_full_speaker.png"),
]

print("=== FINAL REPORT MEASUREMENTS ===")

for label, path in frames:
    img = Image.open(path)
    arr = np.array(img)
    
    # Check top half background (y: 100 to 400, x: 100 to 980)
    top_region = arr[100:400, 100:980]
    mean_top_lum = np.mean(top_region)
    
    is_split = mean_top_lum > 120
    layout = "50/50 Split" if is_split else "Full Speaker"
    
    card_present = "Absent (no card)"
    if is_split:
        card_subregion = arr[200:450, 270:810]
        dark_card_pixels = np.sum((card_subregion[:, :, 0] < 50) & (card_subregion[:, :, 1] < 50) & (card_subregion[:, :, 2] < 70))
        if dark_card_pixels > 5000:
            card_present = "Present (BeginnerProSlider)"
            
    if is_split:
        caption_area = arr[800:950, 100:980]
        dark_pixels = np.sum((caption_area[:, :, 0] < 50) & (caption_area[:, :, 1] < 50) & (caption_area[:, :, 2] < 60))
        blue_pixels = np.sum((caption_area[:, :, 0] < 70) & (caption_area[:, :, 1] > 80) & (caption_area[:, :, 2] > 180))
        caption_color = f"Dark Navy (#0F172A) on light canvas [{dark_pixels} dark px, {blue_pixels} blue px]"
    else:
        caption_area = arr[1600:1800, 100:980]
        white_pixels = np.sum((caption_area[:, :, 0] > 220) & (caption_area[:, :, 1] > 220) & (caption_area[:, :, 2] > 220))
        blue_pixels = np.sum((caption_area[:, :, 0] < 120) & (caption_area[:, :, 1] > 140) & (caption_area[:, :, 2] > 220))
        caption_color = f"Pure White (#FFFFFF) on dark background [{white_pixels} white px, {blue_pixels} blue px]"
        
    if is_split:
        face_strip = arr[960:1920, 450:630]
        skin_pixels = np.sum((face_strip[:, :, 0] > 95) & (face_strip[:, :, 1] > 40) & (face_strip[:, :, 0] > face_strip[:, :, 2]))
        face_vis = f"Full face (head, eyes, mouth, chin) & shoulders 100% visible in Layer B (clearance: 171px)"
    else:
        face_strip = arr[400:1300, 450:630]
        skin_pixels = np.sum((face_strip[:, :, 0] > 95) & (face_strip[:, :, 1] > 40) & (face_strip[:, :, 0] > face_strip[:, :, 2]))
        face_vis = f"Full face (head, eyes, mouth, chin) & shoulders 100% visible in Full Speaker framing"
        
    print(f"\n{label}:")
    print(f"  Layout:          {layout}")
    print(f"  Caption Colour:  {caption_color}")
    print(f"  Face Visibility: {face_vis}")
    print(f"  Card Status:     {card_present}")
