from PIL import Image
import numpy as np

# Let's inspect test2_frame_400 and compare with frame 500/505
img400 = np.array(Image.open("video-01/verify_frame_400_full_speaker.png"))
img500 = np.array(Image.open("video-01/verify_frame_500_full_speaker.png"))
img505 = np.array(Image.open("video-01/verify_frame_505_full_speaker.png"))

# Let's find white pixels in img400
w400 = np.where((img400[:, :, 0] > 230) & (img400[:, :, 1] > 230) & (img400[:, :, 2] > 230))
print(f"img400 white pixels: {len(w400[0])}")
if len(w400[0]) > 0:
    print(f"img400 y range: {np.min(w400[0])} to {np.max(w400[0])}, x range: {np.min(w400[1])} to {np.max(w400[1])}")

# Let's find white pixels in img500 and img505
w500 = np.where((img500[:, :, 0] > 230) & (img500[:, :, 1] > 230) & (img500[:, :, 2] > 230))
print(f"img500 white pixels: {len(w500[0])}")
w505 = np.where((img505[:, :, 0] > 230) & (img505[:, :, 1] > 230) & (img505[:, :, 2] > 230))
print(f"img505 white pixels: {len(w505[0])}")
