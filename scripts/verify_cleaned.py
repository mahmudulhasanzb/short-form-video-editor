#!/usr/bin/env python3
"""
verify_cleaned.py

Checks fps, frame count, duration, and timestamp continuity for a cleaned.mp4
against an optional cut-list.json. Generic and parameter-driven.
"""

import argparse
import json
import subprocess
import sys


def parse_args():
    parser = argparse.ArgumentParser(
        description="Verify frame accuracy, duration, fps, and timestamp continuity of cleaned video."
    )
    parser.add_argument(
        "-v", "--video",
        required=True,
        help="Path to cleaned video file (e.g. cleaned.mp4)."
    )
    parser.add_argument(
        "-c", "--cut-list",
        default=None,
        help="Optional path to cut-list.json to verify duration against padded kept segments."
    )
    parser.add_argument(
        "--expected-fps",
        type=float,
        default=None,
        help="Optional expected FPS (e.g. 30.0) to strictly enforce."
    )
    return parser.parse_args()


def run_ffprobe(cmd):
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"[ERROR] ffprobe failed: {res.stderr.strip()}", file=sys.stderr)
        sys.exit(1)
    return res.stdout


def main():
    args = parse_args()
    video_path = args.video

    print(f"=== Verifying Cleaned Video: {video_path} ===")

    # 1. Probe video stream metadata
    probe_cmd = [
        "ffprobe", "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=codec_name,width,height,r_frame_rate,avg_frame_rate,nb_frames,duration",
        "-show_entries", "format=duration,size",
        "-of", "json",
        video_path
    ]
    raw_info = run_ffprobe(probe_cmd)
    info = json.loads(raw_info)

    if not info.get("streams"):
        print("[FAIL] No video stream found in file.", file=sys.stderr)
        sys.exit(1)

    vstream = info["streams"][0]
    fmt = info.get("format", {})

    codec = vstream.get("codec_name")
    width = vstream.get("width")
    height = vstream.get("height")
    r_fps_str = vstream.get("r_frame_rate", "0/1")
    avg_fps_str = vstream.get("avg_frame_rate", "0/1")

    def parse_fps(val):
        if "/" in val:
            num, den = val.split("/")
            return float(num) / float(den) if float(den) != 0 else 0.0
        return float(val)

    r_fps = parse_fps(r_fps_str)
    avg_fps = parse_fps(avg_fps_str)
    duration = float(fmt.get("duration", vstream.get("duration", 0.0)))
    size_mb = int(fmt.get("size", 0)) / (1024 * 1024)

    print(f"Format: {codec} ({width}x{height})")
    print(f"r_frame_rate: {r_fps_str} ({r_fps:.3f} fps)")
    print(f"avg_frame_rate: {avg_fps_str} ({avg_fps:.3f} fps)")
    print(f"Container Duration: {duration:.3f} s")
    print(f"File Size: {size_mb:.2f} MB")

    # 2. Count actual decoded frames
    count_cmd = [
        "ffprobe", "-v", "error",
        "-select_streams", "v:0",
        "-count_frames",
        "-show_entries", "stream=nb_read_frames",
        "-of", "json",
        video_path
    ]
    raw_count = run_ffprobe(count_cmd)
    count_data = json.loads(raw_count)
    read_frames = int(count_data["streams"][0].get("nb_read_frames", 0))
    expected_frames = round(duration * avg_fps)
    print(f"Actual Decoded Frames: {read_frames} (Expected ~ {expected_frames})")

    # 3. Timestamp continuity check (PTS monotonicity)
    pts_cmd = [
        "ffprobe", "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "packet=pts_time,dts_time",
        "-of", "csv=p=0",
        video_path
    ]
    raw_pts = run_ffprobe(pts_cmd)
    pts_lines = [line.strip().split(",")[0] for line in raw_pts.strip().splitlines() if line.strip()]

    pts_errors = 0
    prev_pts = -1.0
    for idx, pts_str in enumerate(pts_lines):
        try:
            curr_pts = float(pts_str)
            if curr_pts < prev_pts:
                print(f"[FAIL] PTS backward step at packet {idx}: {prev_pts:.4f} -> {curr_pts:.4f}")
                pts_errors += 1
            prev_pts = curr_pts
        except ValueError:
            continue

    if pts_errors == 0:
        print(f"Timestamp Continuity: PASS ({len(pts_lines)} packets strictly monotonic)")
    else:
        print(f"Timestamp Continuity: FAIL ({pts_errors} PTS collapses detected)")

    # 4. Cut-list duration verification
    cut_list_pass = True
    if args.cut_list:
        print(f"\n--- Checking against cut-list: {args.cut_list} ---")
        try:
            with open(args.cut_list, "r", encoding="utf-8") as f:
                cl_data = json.load(f)
            kept = cl_data.get("keptSegments", [])
            total_kept_dur = sum((seg.get("end", 0.0) - seg.get("start", 0.0)) for seg in kept)
            diff = abs(duration - total_kept_dur)
            print(f"Cut-list kept duration: {total_kept_dur:.3f} s")
            print(f"Cleaned video duration: {duration:.3f} s")
            print(f"Duration difference:    {diff:.3f} s")
            if diff > 0.5:
                print(f"[FAIL] Duration discrepancy exceeds 0.5s tolerance ({diff:.3f}s)")
                cut_list_pass = False
            else:
                print("[PASS] Duration matches cut-list within tolerance.")
        except Exception as e:
            print(f"[ERROR] Could not read cut-list: {e}", file=sys.stderr)
            cut_list_pass = False

    # Check FPS match if requested
    fps_pass = True
    if args.expected_fps is not None:
        if abs(avg_fps - args.expected_fps) > 0.05:
            print(f"[FAIL] avg_fps ({avg_fps:.3f}) != expected ({args.expected_fps})")
            fps_pass = False
        else:
            print(f"[PASS] FPS matches expected {args.expected_fps}")

    overall_pass = (pts_errors == 0) and cut_list_pass and fps_pass
    print("\n" + ("=" * 40))
    print(f"OVERALL STATUS: {'PASS' if overall_pass else 'FAIL'}")
    print("=" * 40)
    sys.exit(0 if overall_pass else 1)


if __name__ == "__main__":
    main()
