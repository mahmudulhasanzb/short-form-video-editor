#!/usr/bin/env python3
"""
verify_render.py

Checks final render resolution, fps, frame count, duration, and audio
volumedetect and loudnorm metrics. Generic and parameter-driven.
"""

import argparse
import json
import re
import subprocess
import sys


def parse_args():
    parser = argparse.ArgumentParser(
        description="Verify final render video streams and audio levels (volumedetect, loudnorm)."
    )
    parser.add_argument(
        "-v", "--video",
        required=True,
        help="Path to final render video file (e.g. final_render.mp4)."
    )
    parser.add_argument(
        "--expected-width",
        type=int,
        default=1080,
        help="Expected video width (default: 1080)."
    )
    parser.add_argument(
        "--expected-height",
        type=int,
        default=1920,
        help="Expected video height (default: 1920)."
    )
    parser.add_argument(
        "--expected-fps",
        type=float,
        default=30.0,
        help="Expected video FPS (default: 30.0)."
    )
    return parser.parse_args()


def run_cmd(cmd):
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return res.stdout, res.stderr, res.returncode


def main():
    args = parse_args()
    video_path = args.video

    print(f"=== Verifying Final Render: {video_path} ===")

    # 1. Probe video stream
    probe_v_cmd = [
        "ffprobe", "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height,avg_frame_rate,r_frame_rate,nb_frames,duration,codec_name",
        "-show_entries", "format=duration,size",
        "-of", "json",
        video_path
    ]
    stdout, stderr, code = run_cmd(probe_v_cmd)
    if code != 0:
        print(f"[ERROR] Failed to probe video: {stderr.strip()}", file=sys.stderr)
        sys.exit(1)

    v_data = json.loads(stdout)
    if not v_data.get("streams"):
        print("[FAIL] No video stream detected.", file=sys.stderr)
        sys.exit(1)

    v_stream = v_data["streams"][0]
    fmt = v_data.get("format", {})

    width = v_stream.get("width")
    height = v_stream.get("height")
    codec = v_stream.get("codec_name")
    avg_fps_str = v_stream.get("avg_frame_rate", "0/1")

    def parse_fps(val):
        if "/" in val:
            num, den = val.split("/")
            return float(num) / float(den) if float(den) != 0 else 0.0
        return float(val)

    avg_fps = parse_fps(avg_fps_str)
    duration = float(fmt.get("duration", v_stream.get("duration", 0.0)))
    nb_frames = v_stream.get("nb_frames")

    print(f"\n--- Video Stream ---")
    print(f"Codec: {codec}")
    print(f"Resolution: {width}x{height} (Expected: {args.expected_width}x{args.expected_height})")
    print(f"FPS: {avg_fps:.3f} (Expected: {args.expected_fps})")
    print(f"Duration: {duration:.3f} s")
    print(f"Frames: {nb_frames}")

    res_ok = (width == args.expected_width and height == args.expected_height)
    fps_ok = abs(avg_fps - args.expected_fps) <= 0.05

    # 2. Probe audio stream
    probe_a_cmd = [
        "ffprobe", "-v", "error",
        "-select_streams", "a:0",
        "-show_entries", "stream=codec_name,sample_rate,channels,duration",
        "-of", "json",
        video_path
    ]
    stdout_a, _, code_a = run_cmd(probe_a_cmd)
    a_data = json.loads(stdout_a) if code_a == 0 else {}
    has_audio = bool(a_data.get("streams"))

    print(f"\n--- Audio Stream ---")
    if has_audio:
        a_stream = a_data["streams"][0]
        print(f"Codec: {a_stream.get('codec_name')}")
        print(f"Sample Rate: {a_stream.get('sample_rate')} Hz")
        print(f"Channels: {a_stream.get('channels')}")
        print(f"Audio Duration: {a_stream.get('duration')} s")
    else:
        print("[WARNING] No audio stream detected!")

    # 3. Audio volumedetect
    mean_volume = None
    max_volume = None
    if has_audio:
        print(f"\n--- Audio Volume Detection (volumedetect) ---")
        vol_cmd = [
            "ffmpeg", "-hide_banner", "-i", video_path,
            "-af", "volumedetect", "-vn", "-sn", "-dn",
            "-f", "null", "-"
        ]
        _, stderr_vol, _ = run_cmd(vol_cmd)
        mean_match = re.search(r"mean_volume:\s*(-?[\d.]+)\s*dB", stderr_vol)
        max_match = re.search(r"max_volume:\s*(-?[\d.]+)\s*dB", stderr_vol)
        if mean_match:
            mean_volume = float(mean_match.group(1))
            print(f"Mean Volume: {mean_volume:.2f} dB")
        if max_match:
            max_volume = float(max_match.group(1))
            print(f"Max Volume:  {max_volume:.2f} dB")

        # 4. Audio EBU R128 Loudnorm Analysis
        print(f"\n--- Audio EBU R128 Analysis (loudnorm) ---")
        loud_cmd = [
            "ffmpeg", "-hide_banner", "-i", video_path,
            "-af", "ebur128=framelog=verbose", "-vn", "-sn", "-dn",
            "-f", "null", "-"
        ]
        _, stderr_loud, _ = run_cmd(loud_cmd)

        i_match = re.search(r"I:\s*(-?[\d.]+)\s*LUFS", stderr_loud)
        tp_match = re.search(r"Peak:\s*(-?[\d.]+)\s*dBFS", stderr_loud) or re.search(r"True peak:\s*(-?[\d.]+)\s*dBTP", stderr_loud)
        lra_match = re.search(r"LRA:\s*([\d.]+)\s*LU", stderr_loud)

        integrated_loudness = float(i_match.group(1)) if i_match else None
        true_peak = float(tp_match.group(1)) if tp_match else None
        lra = float(lra_match.group(1)) if lra_match else None

        if integrated_loudness is not None:
            print(f"Integrated Loudness (I): {integrated_loudness:.2f} LUFS (Target: -14 to -16 LUFS)")
        if true_peak is not None:
            print(f"True Peak:               {true_peak:.2f} dBTP (Max permitted: -1.0 dBTP)")
        if lra is not None:
            print(f"Loudness Range (LRA):    {lra:.2f} LU")

        tp_ok = (true_peak is not None and true_peak <= -1.0)
        if not tp_ok and true_peak is not None:
            print(f"[FAIL] True peak {true_peak:.2f} dBTP exceeds ceiling of -1.0 dBTP!")
    else:
        tp_ok = False

    passed = res_ok and fps_ok and has_audio and (tp_ok or true_peak is None)
    print("\n" + ("=" * 40))
    print(f"VERIFICATION STATUS: {'PASS' if passed else 'FAIL'}")
    print("=" * 40)
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
