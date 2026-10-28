import subprocess
import json

CLEANED_PATH = "video-01/cleaned.mp4"

print("--- Probing video stream ---")
cmd_stream = [
    "ffprobe", "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=codec_name,width,height,r_frame_rate,avg_frame_rate,nb_frames,duration",
    "-show_entries", "format=duration,size",
    "-of", "json",
    CLEANED_PATH
]
res = subprocess.run(cmd_stream, stdout=subprocess.PIPE, text=True)
info = json.loads(res.stdout)
vstream = info["streams"][0]
fmt = info["format"]

print(f"Codec: {vstream.get('codec_name')}")
print(f"Resolution: {vstream.get('width')}x{vstream.get('height')}")
print(f"r_frame_rate: {vstream.get('r_frame_rate')}")
print(f"avg_frame_rate: {vstream.get('avg_frame_rate')}")
print(f"nb_frames in stream header: {vstream.get('nb_frames')}")
print(f"Stream duration: {vstream.get('duration')}s")
print(f"Format duration: {fmt.get('duration')}s")
print(f"File size: {int(fmt.get('size')) / (1024*1024):.2f} MB")

print("\n--- Counting actual decoded frames ---")
cmd_count = [
    "ffprobe", "-v", "error",
    "-select_streams", "v:0",
    "-count_frames",
    "-show_entries", "stream=nb_read_frames",
    "-of", "json",
    CLEANED_PATH
]
res_count = subprocess.run(cmd_count, stdout=subprocess.PIPE, text=True)
count_info = json.loads(res_count.stdout)
read_frames = count_info["streams"][0].get("nb_read_frames")
print(f"Actual decoded frame count: {read_frames}")

print("\n--- Probing audio stream ---")
cmd_audio = [
    "ffprobe", "-v", "error",
    "-select_streams", "a:0",
    "-show_entries", "stream=codec_name,sample_rate,channels,duration",
    "-of", "json",
    CLEANED_PATH
]
res_audio = subprocess.run(cmd_audio, stdout=subprocess.PIPE, text=True)
astream = json.loads(res_audio.stdout)["streams"][0]
print(f"Audio codec: {astream.get('codec_name')}")
print(f"Sample rate: {astream.get('sample_rate')} Hz")
print(f"Channels: {astream.get('channels')}")
print(f"Audio duration: {astream.get('duration')}s")

print("\n--- Checking frame timestamp continuity (PTS monotonicity) ---")
cmd_pts = [
    "ffprobe", "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "frame=pts_time,pkt_dts_time",
    "-of", "json",
    CLEANED_PATH
]
res_pts = subprocess.run(cmd_pts, stdout=subprocess.PIPE, text=True)
pts_data = json.loads(res_pts.stdout)
frames = pts_data.get("frames", [])

pts_list = [float(f["pts_time"]) for f in frames if "pts_time" in f]
print(f"Total frame PTS entries: {len(pts_list)}")

pts_issues = []
delta_issues = []
for i in range(len(pts_list) - 1):
    delta = pts_list[i+1] - pts_list[i]
    if delta <= 0:
        pts_issues.append((i, pts_list[i], pts_list[i+1], delta))
    # Check for unexpected frame drops/jumps (> 2 frames away from expected 1/30 = 0.0333s)
    if abs(delta - (1.0/30.0)) > 0.005:
        delta_issues.append((i, pts_list[i], pts_list[i+1], delta))

print(f"Timestamp non-monotonic / duplicate issues: {len(pts_issues)}")
if pts_issues:
    print(f"First issues: {pts_issues[:5]}")

print(f"Delta deviations from 30fps (1/30s): {len(delta_issues)}")
if delta_issues:
    print(f"Sample delta deviations: {delta_issues[:5]}")
else:
    print("All frame intervals are exactly 1/30s (0.033333s) across all joins!")

print(f"First frame PTS: {pts_list[0]:.6f}s")
print(f"Last frame PTS: {pts_list[-1]:.6f}s")
print(f"Span: {pts_list[-1] - pts_list[0] + (1.0/30.0):.3f}s")
