import json
import subprocess
import os

CUT_LIST_PATH = "video-01/cut-list.json"
VIDEO_RAW = "video-01/raw/How I would sell AI content repurposing.mp4"
OUTPUT_CLEANED = "video-01/cleaned.mp4"

# New padded kept segments matching the Breath Rule
new_kept_segments = [
    {
        "start": 0.00,
        "end": 6.54,
        "text": "With AI now having the ability to edit content really well, if you had to create an offer for content repurposing slash content creation,"
    },
    {
        "start": 6.94,
        "end": 14.58,
        "text": "how would you charge a business? And what would you go for businesses with no marketing exposure, or ones with podcasts, et cetera, that you could repurpose on volume with AI?"
    },
    {
        "start": 15.21,
        "end": 24.93,
        "text": "How would you differentiate from existing agencies that aren't using AI to deliver? Okay, lots of questions there. How would you create an offer for content repurposing using AI?"
    },
    {
        "start": 25.29,
        "end": 33.43,
        "text": "Simple, straightforward. I would have AI break down long form clips into short form clips. I would target preferentially long form platforms like LinkedIn,"
    },
    {
        "start": 34.29,
        "end": 38.75,
        "text": "full length X videos and X podcasts, and then obviously YouTube videos like mine."
    },
    {
        "start": 39.21,
        "end": 40.13,
        "text": "I would build"
    },
    {
        "start": 44.92,
        "end": 45.81,
        "text": "three major systems."
    },
    {
        "start": 46.53,
        "end": 60.55,
        "text": "Video to text post converter, video to static image converter, and then video clipper. Video to text post converter is pretty straightforward. We've been able to do that for a very long time now, but basically you just take content that like resounds within the transcript of the main piece of long form content,"
    },
    {
        "start": 60.95,
        "end": 62.65,
        "text": "and then you cut it up for X,"
    },
    {
        "start": 63.05,
        "end": 63.57,
        "text": "Instagram,"
    },
    {
        "start": 63.97,
        "end": 79.63,
        "text": "whatever the hell else. Video to static image is basically the same thing, but there are really strong formats right now where people basically take what is said in a video in the transcript, cut it up into like really high ROI segments, whatever the best parts of it are, and then just turn those into like notes that look like they're handwritten."
    },
    {
        "start": 79.95,
        "end": 83.11,
        "text": "Or Mozi did this, a bunch of other guys do this. I mean it's like a very common thing to do."
    },
    {
        "start": 83.41,
        "end": 87.89,
        "text": "And then video clipping is where you basically take the transcript but also identify silences,"
    },
    {
        "start": 88.15,
        "end": 95.43,
        "text": "okay, and then you use both of those two things to feed into an AI model to allow you to like cut at specific moments. You can then add effects,"
    },
    {
        "start": 96.28,
        "end": 98.48,
        "text": "make the card a half as tall,"
    },
    {
        "start": 98.75,
        "end": 104.95,
        "text": "maybe put yourself in the bottom half and then have some like visuals and research done on the top half. And I can actually do all this stuff now basically"
    },
    {
        "start": 106.55,
        "end": 107.67,
        "text": "completely autonomously."
    }
]

new_excluded_segments = [
    {
        "start": 6.54,
        "end": 6.94,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 14.58,
        "end": 15.21,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 24.93,
        "end": 25.29,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 33.43,
        "end": 34.29,
        "text": "you know,",
        "reason": "dead air + filler word"
    },
    {
        "start": 38.75,
        "end": 39.21,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 40.13,
        "end": 44.92,
        "text": "two major systems. One would be like a video to text post converter. Sorry,",
        "reason": "aborted take / false start"
    },
    {
        "start": 45.81,
        "end": 46.53,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 60.55,
        "end": 60.95,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 62.65,
        "end": 63.05,
        "text": "you know,",
        "reason": "filler word"
    },
    {
        "start": 63.57,
        "end": 63.97,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 79.63,
        "end": 79.95,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 83.11,
        "end": 83.41,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 87.89,
        "end": 88.15,
        "text": "",
        "reason": "dead air"
    },
    {
        "start": 95.43,
        "end": 96.28,
        "text": "you know,",
        "reason": "dead air + filler word"
    },
    {
        "start": 98.48,
        "end": 98.75,
        "text": "you know,",
        "reason": "filler word"
    },
    {
        "start": 104.95,
        "end": 106.55,
        "text": "completely,",
        "reason": "repeated stutter take + dead air"
    },
    {
        "start": 107.67,
        "end": 107.79,
        "text": "",
        "reason": "trailing dead air"
    }
]

total_padded_duration = sum(seg["end"] - seg["start"] for seg in new_kept_segments)
print(f"Total padded kept duration: {total_padded_duration:.2f}s")
print(f"Expected frame count at 30fps: {round(total_padded_duration * 30)}")

# Update cut-list.json
cut_list_data = {
    "sourceVideo": VIDEO_RAW,
    "rawDuration": 107.787,
    "keptSegmentsCount": len(new_kept_segments),
    "excludedSegmentsCount": len(new_excluded_segments),
    "paddedDuration": round(total_padded_duration, 2),
    "keptSegments": new_kept_segments,
    "excludedSegments": new_excluded_segments
}

with open(CUT_LIST_PATH, "w", encoding="utf-8") as f:
    json.dump(cut_list_data, f, indent=2, ensure_ascii=False)
print(f"Updated {CUT_LIST_PATH}")

# Build filter_complex with 25ms audio fades and trim
filter_parts = []
concat_inputs = []

for i, seg in enumerate(new_kept_segments):
    s = seg["start"]
    e = seg["end"]
    dur = round(e - s, 3)
    v_tag = f"v{i}"
    a_tag = f"a{i}"
    filter_parts.append(f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS[{v_tag}]")
    fade_out_st = max(0.0, round(dur - 0.025, 3))
    filter_parts.append(f"[0:a]atrim=start={s}:end={e},asetpts=PTS-STARTPTS,afade=t=in:ss=0:d=0.025,afade=t=out:st={fade_out_st}:d=0.025[{a_tag}]")
    concat_inputs.append(f"[{v_tag}][{a_tag}]")

concat_line = "".join(concat_inputs) + f"concat=n={len(new_kept_segments)}:v=1:a=1[vconcat][aconcat]"
filter_parts.append(concat_line)
filter_parts.append("[vconcat]fps=30,scale=720:1280,format=yuv420p[outv]")
filter_parts.append("[aconcat]aresample=async=1000[outa]")

filter_complex_str = ";".join(filter_parts)

cmd = [
    "ffmpeg", "-y",
    "-i", VIDEO_RAW,
    "-filter_complex", filter_complex_str,
    "-map", "[outv]",
    "-map", "[outa]",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "18",
    "-r", "30",
    "-c:a", "aac",
    "-b:a", "192k",
    "-ar", "44100",
    OUTPUT_CLEANED
]

print("Running FFmpeg frame-accurate re-encode with Breath Rule & 25ms audio fades...")
res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
if res.returncode != 0:
    print("FFmpeg error:")
    print(res.stderr)
    exit(1)

print("FFmpeg finished successfully.")
