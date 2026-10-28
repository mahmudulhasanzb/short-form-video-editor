import os
import json
import subprocess
import shutil

VIDEO_RAW = "video-01/raw/How I would sell AI content repurposing.mp4"
OUTPUT_CLEANED = "video-01/cleaned.mp4"
CUT_LIST_PATH = "video-01/cut-list.json"
TEMP_DIR = "video-01/_temp_cuts"

# Segments definition based on Whisper word timestamps and content analysis
# Raw duration: 107.787s

kept_segments = [
    {
        "start": 0.00,
        "end": 6.42,
        "text": "With AI now having the ability to edit content really well, if you had to create an offer for content repurposing slash content creation,"
    },
    {
        "start": 7.06,
        "end": 14.46,
        "text": "how would you charge a business? And what would you go for businesses with no marketing exposure, or ones with podcasts, et cetera, that you could repurpose on volume with AI?"
    },
    {
        "start": 15.33,
        "end": 24.81,
        "text": "How would you differentiate from existing agencies that aren't using AI to deliver? Okay, lots of questions there. How would you create an offer for content repurposing using AI?"
    },
    {
        "start": 25.41,
        "end": 33.23,
        "text": "Simple, straightforward. I would have AI break down long form clips into short form clips. I would target preferentially long form platforms like LinkedIn,"
    },
    {
        "start": 34.31,
        "end": 38.63,
        "text": "full length X videos and X podcasts, and then obviously YouTube videos like mine."
    },
    {
        "start": 39.33,
        "end": 40.13,
        "text": "I would build"
    },
    {
        "start": 44.97,
        "end": 45.69,
        "text": "three major systems."
    },
    {
        "start": 46.65,
        "end": 60.43,
        "text": "Video to text post converter, video to static image converter, and then video clipper. Video to text post converter is pretty straightforward. We've been able to do that for a very long time now, but basically you just take content that like resounds within the transcript of the main piece of long form content,"
    },
    {
        "start": 61.07,
        "end": 62.55,
        "text": "and then you cut it up for X,"
    },
    {
        "start": 63.05,
        "end": 63.45,
        "text": "Instagram,"
    },
    {
        "start": 64.09,
        "end": 79.51,
        "text": "whatever the hell else. Video to static image is basically the same thing, but there are really strong formats right now where people basically take what is said in a video in the transcript, cut it up into like really high ROI segments, whatever the best parts of it are, and then just turn those into like notes that look like they're handwritten."
    },
    {
        "start": 80.07,
        "end": 82.99,
        "text": "Or Mozi did this, a bunch of other guys do this. I mean it's like a very common thing to do."
    },
    {
        "start": 83.53,
        "end": 87.77,
        "text": "And then video clipping is where you basically take the transcript but also identify silences,"
    },
    {
        "start": 88.27,
        "end": 95.23,
        "text": "okay, and then you use both of those two things to feed into an AI model to allow you to like cut at specific moments. You can then add effects,"
    },
    {
        "start": 96.33,
        "end": 98.40,
        "text": "make the card a half as tall,"
    },
    {
        "start": 98.75,
        "end": 104.95,
        "text": "maybe put yourself in the bottom half and then have some like visuals and research done on the top half. And I can actually do all this stuff now basically"
    },
    {
        "start": 106.75,
        "end": 107.47,
        "text": "completely autonomously."
    }
]

excluded_segments = [
    {
        "start": 6.42,
        "end": 7.06,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 14.46,
        "end": 15.33,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 24.81,
        "end": 25.41,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 33.23,
        "end": 34.31,
        "text": "you know,",
        "reason": "dead air + filler word"
    },
    {
        "start": 38.63,
        "end": 39.33,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 40.13,
        "end": 44.97,
        "text": "two major systems. One would be like a video to text post converter. Sorry,",
        "reason": "aborted take / false start"
    },
    {
        "start": 45.69,
        "end": 46.65,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 60.43,
        "end": 61.07,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 62.55,
        "end": 63.05,
        "text": "you know,",
        "reason": "filler word"
    },
    {
        "start": 63.45,
        "end": 64.09,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 79.51,
        "end": 80.07,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 82.99,
        "end": 83.53,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 87.77,
        "end": 88.27,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 95.23,
        "end": 96.33,
        "text": "you know,",
        "reason": "dead air + filler word"
    },
    {
        "start": 98.40,
        "end": 98.75,
        "text": "you know,",
        "reason": "filler word"
    },
    {
        "start": 104.95,
        "end": 106.75,
        "text": "completely,",
        "reason": "repeated stutter take + dead air"
    },
    {
        "start": 107.47,
        "end": 107.79,
        "text": "",
        "reason": "trailing dead air"
    }
]

cut_list_data = {
    "sourceVideo": VIDEO_RAW,
    "rawDuration": 107.787,
    "keptSegmentsCount": len(kept_segments),
    "excludedSegmentsCount": len(excluded_segments),
    "keptSegments": kept_segments,
    "excludedSegments": excluded_segments
}

print(f"Writing cut list to {CUT_LIST_PATH}...")
with open(CUT_LIST_PATH, "w", encoding="utf-8") as f:
    json.dump(cut_list_data, f, indent=2, ensure_ascii=False)

print(f"Prepared {len(kept_segments)} kept segments.")
print(f"Prepared {len(excluded_segments)} excluded segments.")

# Fast cutting with FFmpeg stream copy (-c copy)
os.makedirs(TEMP_DIR, exist_ok=True)
concat_list_file = os.path.join(TEMP_DIR, "concat.txt")

segment_files = []
print("Cutting segments with ffmpeg -c copy...")
for idx, seg in enumerate(kept_segments):
    start = seg["start"]
    end = seg["end"]
    duration = end - start
    seg_filename = f"seg_{idx:03d}.mp4"
    seg_path = os.path.join(TEMP_DIR, seg_filename)
    
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(start),
        "-t", str(duration),
        "-i", VIDEO_RAW,
        "-c", "copy",
        seg_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    segment_files.append(seg_filename)
    print(f"  Segment {idx+1}/{len(kept_segments)} [{start:.2f}s -> {end:.2f}s] ({duration:.2f}s) -> {seg_filename}")

with open(concat_list_file, "w", encoding="utf-8") as f:
    for seg_file in segment_files:
        f.write(f"file '{seg_file}'\n")

print(f"Concatenating into {OUTPUT_CLEANED}...")
concat_cmd = [
    "ffmpeg", "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_list_file,
    "-c", "copy",
    OUTPUT_CLEANED
]
subprocess.run(concat_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

# Probe cleaned file
probe_cmd = [
    "ffprobe", "-v", "error",
    "-show_entries", "format=duration,size",
    "-of", "json",
    OUTPUT_CLEANED
]
probe_res = subprocess.run(probe_cmd, stdout=subprocess.PIPE, text=True, check=True)
probe_data = json.loads(probe_res.stdout)
cleaned_duration = float(probe_data["format"]["duration"])
cleaned_size = int(probe_data["format"]["size"])

# Clean up temp
shutil.rmtree(TEMP_DIR, ignore_errors=True)

print(f"\nSUCCESS!")
print(f"Cleaned video saved: {OUTPUT_CLEANED}")
print(f"Cleaned duration: {cleaned_duration:.2f}s (reduced by {107.787 - cleaned_duration:.2f}s)")
print(f"Cleaned file size: {cleaned_size / (1024*1024):.2f} MB")
