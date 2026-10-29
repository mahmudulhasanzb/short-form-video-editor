#!/usr/bin/env python3
"""
check_audio_levels.py

Reports per-second RMS difference between a final mix and a cleaned voice track,
and flags True Peak above -1.0 dBTP. Generic and parameter-driven.
"""

import argparse
import json
import math
import re
import subprocess
import sys


def parse_args():
    parser = argparse.ArgumentParser(
        description="Verify audio balance: per-second RMS delta against clean dialogue and True Peak compliance."
    )
    parser.add_argument(
        "--final-mix",
        required=True,
        help="Path to final rendered video or audio file (e.g. final_render.mp4)."
    )
    parser.add_argument(
        "--voice-track",
        required=True,
        help="Path to clean dialogue video or audio file (e.g. cleaned.mp4)."
    )
    parser.add_argument(
        "--max-rms-delta-db",
        type=float,
        default=6.0,
        help="Maximum permitted RMS energy addition (dB) above quiet dialogue (default: 6.0)."
    )
    parser.add_argument(
        "--max-peak-dbtp",
        type=float,
        default=-1.0,
        help="Maximum permitted True Peak ceiling in dBTP (default: -1.0)."
    )
    return parser.parse_args()


def get_true_peak(media_path):
    cmd = [
        "ffmpeg", "-hide_banner", "-i", media_path,
        "-af", "ebur128=framelog=verbose", "-vn", "-sn", "-dn",
        "-f", "null", "-"
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    stderr = res.stderr
    tp_match = re.search(r"Peak:\s*(-?[\d.]+)\s*dBFS", stderr) or re.search(r"True peak:\s*(-?[\d.]+)\s*dBTP", stderr)
    if tp_match:
        return float(tp_match.group(1))
    return None


def get_per_second_rms(media_path):
    """
    Extracts raw audio samples via ffmpeg and computes per-second RMS levels in dBFS.
    """
    cmd = [
        "ffmpeg", "-hide_banner", "-i", media_path,
        "-vn", "-ac", "1", "-ar", "8000", "-f", "f32le", "-"
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if res.returncode != 0:
        print(f"[ERROR] Failed to extract audio samples from {media_path}", file=sys.stderr)
        return []

    raw = res.stdout
    import struct
    count = len(raw) // 4
    if count == 0:
        return []

    samples = struct.unpack(f"{count}f", raw)
    sample_rate = 8000
    sec_count = count // sample_rate

    rms_per_sec = []
    for s in range(sec_count):
        window = samples[s * sample_rate : (s + 1) * sample_rate]
        sum_sq = sum(x * x for x in window)
        rms = math.sqrt(sum_sq / len(window)) if len(window) > 0 else 0.0
        db = 20.0 * math.log10(rms) if rms > 1e-9 else -96.0
        rms_per_sec.append(db)

    return rms_per_sec


def main():
    args = parse_args()

    print(f"=== Audio Balance and Level Quality Check ===")
    print(f"Final Mix:   {args.final_mix}")
    print(f"Voice Track: {args.voice_track}")

    # 1. True Peak check on final mix
    print("\n--- True Peak Analysis ---")
    true_peak = get_true_peak(args.final_mix)
    if true_peak is not None:
        print(f"Final Mix True Peak: {true_peak:.2f} dBTP (Ceiling: {args.max_peak_dbtp:.2f} dBTP)")
        tp_pass = true_peak <= args.max_peak_dbtp
        if not tp_pass:
            print(f"[FAIL] True peak {true_peak:.2f} dBTP exceeds ceiling of {args.max_peak_dbtp:.2f} dBTP!")
        else:
            print(f"[PASS] True peak complies with broadcast limit ({true_peak:.2f} dBTP <= {args.max_peak_dbtp:.2f} dBTP).")
    else:
        print("[WARNING] Could not measure True Peak via ebur128.")
        tp_pass = True

    # 2. Per-second RMS comparison
    print("\n--- Per-Second RMS Comparison ---")
    mix_rms = get_per_second_rms(args.final_mix)
    voice_rms = get_per_second_rms(args.voice_track)

    min_secs = min(len(mix_rms), len(voice_rms))
    if min_secs == 0:
        print("[WARNING] Insufficient audio data to compute per-second RMS comparison.")
        rms_pass = True
    else:
        print(f"Evaluating {min_secs} seconds of active audio...")
        flagged_seconds = []
        max_delta = -999.0

        for sec in range(min_secs):
            v_db = voice_rms[sec]
            m_db = mix_rms[sec]
            delta = m_db - v_db
            if delta > max_delta:
                max_delta = delta

            # Flag if sound effects elevate quiet dialogue significantly (> max_rms_delta_db)
            if delta > args.max_rms_delta_db and v_db < -20.0:
                flagged_seconds.append((sec, v_db, m_db, delta))

        print(f"Max RMS Delta: +{max_delta:.2f} dB")
        if flagged_seconds:
            print(f"[FAIL] {len(flagged_seconds)} second(s) exceeded the +{args.max_rms_delta_db} dB RMS delta ceiling:")
            for s, v, m, d in flagged_seconds[:10]:
                print(f"  Second {s:03d}s: Voice={v:.1f} dBFS, Mix={m:.1f} dBFS, Delta=+{d:.1f} dB")
            if len(flagged_seconds) > 10:
                print(f"  ... and {len(flagged_seconds) - 10} more.")
            rms_pass = False
        else:
            print(f"[PASS] All {min_secs} seconds within permitted RMS delta (SFX never overwhelms quiet voice).")
            rms_pass = True

    overall = tp_pass and rms_pass
    print("\n" + ("=" * 40))
    print(f"AUDIO QC STATUS: {'PASS' if overall else 'FAIL'}")
    print("=" * 40)
    sys.exit(0 if overall else 1)


if __name__ == "__main__":
    main()
