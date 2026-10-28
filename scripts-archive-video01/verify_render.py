import subprocess
import json
import os

render_file = os.path.abspath('video-01/final_render.mp4')
print(f"Target file: {render_file}")
if not os.path.exists(render_file):
    print("Error: File does not exist yet.")
    exit(1)

# Run ffprobe
cmd = [
    'ffprobe',
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,avg_frame_rate,r_frame_rate,nb_frames,duration,codec_name',
    '-of', 'json',
    render_file
]
p = subprocess.run(cmd, capture_output=True, text=True)
data = json.loads(p.stdout)
stream = data['streams'][0]

width = stream['width']
height = stream['height']
avg_fps = stream['avg_frame_rate']
nb_frames = stream.get('nb_frames', 'N/A')
duration = stream.get('duration', 'N/A')
codec = stream['codec_name']

print(f"=== Video Stream Info ===")
print(f"Resolution: {width}x{height}")
print(f"Codec: {codec}")
print(f"Average FPS: {avg_fps}")
print(f"Frames: {nb_frames}")
print(f"Duration: {duration}s")

# Audio check
cmd_a = [
    'ffprobe',
    '-v', 'error',
    '-select_streams', 'a:0',
    '-show_entries', 'stream=codec_name,sample_rate,channels,duration',
    '-of', 'json',
    render_file
]
p_a = subprocess.run(cmd_a, capture_output=True, text=True)
data_a = json.loads(p_a.stdout)
if data_a.get('streams'):
    a_stream = data_a['streams'][0]
    print(f"=== Audio Stream Info ===")
    print(f"Codec: {a_stream.get('codec_name')}")
    print(f"Sample Rate: {a_stream.get('sample_rate')}")
    print(f"Channels: {a_stream.get('channels')}")
    print(f"Duration: {a_stream.get('duration')}s")
else:
    print("[WARNING] No audio stream found!")
