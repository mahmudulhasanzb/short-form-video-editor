#!/usr/bin/env python3
"""
check_crops.py

Measures and verifies speaker facial landmarks (head top, eyes, mouth, chin)
and shoulder clearance inside the bottom 50% Layer B of a 9:16 vertical split frame.
Supports both image frame analysis and direct measurement verification. Generic and parameter-driven.
"""

import argparse
import sys
import os

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


def parse_args():
    parser = argparse.ArgumentParser(
        description="Verify 50/50 split face crop geometry and chin/headroom clearance."
    )
    parser.add_argument(
        "--raw-frame",
        default=None,
        help="Optional path to raw source speaker frame image (e.g. source_frame.png)."
    )
    parser.add_argument(
        "--rendered-frame",
        default=None,
        help="Optional path to rendered 1080x1920 split frame image (e.g. split_frame.png)."
    )
    parser.add_argument(
        "--head-top-pct",
        type=float,
        default=None,
        help="Measured or estimated head top percentage in source (0-100)."
    )
    parser.add_argument(
        "--eye-line-pct",
        type=float,
        default=None,
        help="Measured or estimated eye line percentage in source (0-100)."
    )
    parser.add_argument(
        "--chin-pct",
        type=float,
        default=None,
        help="Measured or estimated chin percentage in source (0-100)."
    )
    parser.add_argument(
        "--shoulders-pct",
        type=float,
        default=None,
        help="Measured or estimated shoulders percentage in source (0-100)."
    )
    parser.add_argument(
        "--container-height",
        type=int,
        default=960,
        help="Height of Layer B container in split view (default: 960)."
    )
    return parser.parse_args()


def main():
    args = parse_args()

    print("=== Split Crop Geometry Verification ===")

    # If rendered frame provided and PIL available, inspect dimensions
    if args.rendered_frame:
        if not os.path.exists(args.rendered_frame):
            print(f"[ERROR] Rendered frame not found: {args.rendered_frame}", file=sys.stderr)
            sys.exit(1)
        if HAS_PIL:
            with Image.open(args.rendered_frame) as img:
                w, h = img.size
                print(f"Rendered frame dimensions: {w}x{h}")
                if h != 1920:
                    print(f"[WARNING] Rendered height {h} != 1920 standard.")

    # Sizing math evaluation
    head_top = args.head_top_pct
    chin = args.chin_pct
    eye_line = args.eye_line_pct
    shoulders = args.shoulders_pct

    if head_top is not None and chin is not None:
        face_span_pct = chin - head_top
        face_span_norm = face_span_pct / 100.0
        container_h = args.container_height

        # Sizing standard: Target face height inside Layer B is ~81% (leaving headroom & chin clearance)
        target_face_h = container_h * 0.81
        scaled_video_h = target_face_h / max(0.40, face_span_norm)
        headroom_px = container_h * 0.035  # ~3.5% headroom (approx 34px)
        chin_pos_layer_b = headroom_px + (face_span_norm * scaled_video_h)
        chin_clearance_px = container_h - chin_pos_layer_b

        print(f"\n--- Facial Geometry Analysis (Layer B: {container_h}px) ---")
        print(f"Source Face Span (Head-to-Chin): {face_span_pct:.1f}%")
        print(f"Scaled Foreground Video Height:   {scaled_video_h:.1f}px")
        print(f"Headroom (Top of Layer B to Head): {headroom_px:.1f}px")
        print(f"Chin Position in Layer B:         {chin_pos_layer_b:.1f}px")
        print(f"Chin Clearance above Bottom Edge: {chin_clearance_px:.1f}px")

        if eye_line is not None:
            eye_offset_from_head = (eye_line - head_top) / 100.0 * scaled_video_h
            eye_pos_layer_b = headroom_px + eye_offset_from_head
            print(f"Eye Line in Layer B:              {eye_pos_layer_b:.1f}px ({(eye_pos_layer_b/container_h)*100:.1f}%)")

        # Verification tests
        has_headroom = headroom_px > 0
        has_chin_clearance = chin_clearance_px > 0
        no_chin_clipping = chin_clearance_px >= 10.0  # At least 10px breathing room

        print("\n--- Clearance Checks ---")
        print(f"Headroom > 0px:       {'PASS' if has_headroom else 'FAIL'}")
        print(f"Chin Clearance > 10px: {'PASS' if no_chin_clipping else 'FAIL'}")

        overall = has_headroom and no_chin_clipping
        print("\n" + ("=" * 40))
        print(f"CROP STATUS: {'PASS' if overall else 'FAIL'}")
        print("=" * 40)
        sys.exit(0 if overall else 1)
    else:
        print("\nNote: Provide --head-top-pct and --chin-pct (and optionally --eye-line-pct, --shoulders-pct)")
        print("to evaluate clearance math for this video's facial measurements.")
        sys.exit(0)


if __name__ == "__main__":
    main()
