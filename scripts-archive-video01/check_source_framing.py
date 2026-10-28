import cv2
import numpy as np

# Load a frame from cleaned.mp4
cap = cv2.VideoCapture('video-01/cleaned.mp4')
cap.set(cv2.CAP_PROP_POS_FRAMES, 300) # frame 300 (10s, in scene 2)
ret, frame = cap.read()
cap.release()

if ret:
    h, w, _ = frame.shape
    print(f"Source frame dimensions: {w}x{h}")
    # Save source frame
    cv2.imwrite('video-01/verification_frames/source_frame_300.png', frame)
    print("Saved source_frame_300.png")
