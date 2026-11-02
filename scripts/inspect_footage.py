#!/usr/bin/env python3
"""Inspect supplied footage and create a timestamped contact sheet.

Requires ffmpeg and ffprobe on PATH. The source file is never modified.
"""
from __future__ import annotations

import argparse
import json
import math
import shutil
import subprocess
import sys
from pathlib import Path


def run(command: list[str]) -> str:
    return subprocess.run(command, check=True, capture_output=True, text=True).stdout.strip()


def inspect_metadata(source: Path) -> dict:
    data = json.loads(run([
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height,avg_frame_rate,r_frame_rate,duration,nb_frames:format=duration",
        "-of", "json", str(source),
    ]))
    if not data.get("streams"):
        raise ValueError("No video stream found.")
    stream = data["streams"][0]
    duration = float(stream.get("duration") or data.get("format", {}).get("duration") or 0)
    rate = stream.get("avg_frame_rate") or stream.get("r_frame_rate") or "0/1"
    numerator, denominator = (int(value) for value in rate.split("/", 1))
    fps = numerator / denominator if denominator else 0
    if duration <= 0 or fps <= 0:
        raise ValueError("Could not determine a valid duration and frame rate.")
    return {
        "file": source.name,
        "durationSeconds": round(duration, 3),
        "width": int(stream["width"]),
        "height": int(stream["height"]),
        "fps": round(fps, 5),
        "frameCount": int(stream["nb_frames"]) if str(stream.get("nb_frames", "")).isdigit() else round(duration * fps),
    }


def create_contact_sheet(source: Path, output: Path, metadata: dict, interval: float, columns: int, thumb_width: int) -> list[dict]:
    output.mkdir(parents=True, exist_ok=True)
    count = max(1, math.ceil(metadata["durationSeconds"] / interval))
    samples = []
    for index in range(count):
        seconds = min(index * interval, max(0, metadata["durationSeconds"] - 0.05))
        image = output / f"sample-{index:04d}.jpg"
        # Burn the sample timestamp into the frame so it remains visible in the sheet.
        stamp = f"{int(seconds // 60):02d}:{seconds % 60:05.2f}"
        run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-ss", f"{seconds:.3f}", "-i", str(source), "-frames:v", "1",
            "-vf", f"scale={thumb_width}:-1,drawtext=text='{stamp}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.7",
            "-q:v", "3", str(image),
        ])
        samples.append({"index": index, "timestampSeconds": round(seconds, 3), "image": image.name})

    inputs = [item for sample in samples for item in ("-i", str(output / sample["image"]))]
    labels = ";".join(f"[{index}:v]scale={thumb_width}:-1[v{index}]" for index in range(count))
    stack = "".join(f"[v{index}]" for index in range(count))
    rows = math.ceil(count / columns)
    run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs,
        "-filter_complex", f"{labels};{stack}tile={columns}x{rows}:padding=12:margin=12",
        "-frames:v", "1", str(output / "contact-sheet.jpg"),
    ])
    return samples


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("video", type=Path, help="source footage file")
    parser.add_argument("--output", type=Path, default=Path("footage-inspection"))
    parser.add_argument("--interval", type=float, default=3.0, help="sample interval in seconds")
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--width", type=int, default=480, help="thumbnail width in pixels")
    args = parser.parse_args()
    if not args.video.is_file():
        parser.error(f"input video does not exist: {args.video}")
    if min(args.interval, args.columns, args.width) <= 0:
        parser.error("--interval, --columns, and --width must be positive")
    missing = [name for name in ("ffmpeg", "ffprobe") if shutil.which(name) is None]
    if missing:
        parser.error(f"required executable(s) missing from PATH: {', '.join(missing)}")

    try:
        metadata = inspect_metadata(args.video)
        samples = create_contact_sheet(args.video, args.output, metadata, args.interval, args.columns, args.width)
        manifest = {
            "source": metadata,
            "sampling": {"intervalSeconds": args.interval, "sampleCount": len(samples)},
            "contactSheet": "contact-sheet.jpg",
            "samples": samples,
            "note": "Use these samples to locate relevant footage. Scrub and verify exact source in/out boundaries before adding trims to a plan.",
        }
        (args.output / "footage.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        print(f"Contact sheet: {args.output / 'contact-sheet.jpg'}")
        print(f"Manifest: {args.output / 'footage.json'}")
        print(f"{metadata['durationSeconds']:.2f}s | {metadata['width']}x{metadata['height']} | {metadata['fps']} fps")
    except (subprocess.CalledProcessError, ValueError, KeyError, json.JSONDecodeError) as error:
        print(f"Footage inspection failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
