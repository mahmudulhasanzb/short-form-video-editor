import json
import time
import subprocess
import numpy as np
from faster_whisper import WhisperModel

VIDEO_PATH = "video-01/raw/How I would sell AI content repurposing.mp4"
TRANSCRIPT_PATH = "video-01/transcript.json"

print(f"Decoding audio from {VIDEO_PATH} via ffmpeg...")
cmd = [
    "ffmpeg", "-nostdin", "-threads", "0",
    "-i", VIDEO_PATH,
    "-f", "s16le", "-ac", "1", "-ar", "16000", "-"
]
p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
raw_audio, _ = p.communicate()
audio = np.frombuffer(raw_audio, np.int16).flatten().astype(np.float32) / 32768.0
duration = len(audio) / 16000.0
print(f"Audio loaded: {duration:.2f} seconds.")

print("Loading Whisper model (medium.en)...")
model = WhisperModel("medium.en", device="cpu", compute_type="int8")

print("Transcribing with word timestamps...")
start_time = time.time()
segments_generator, info = model.transcribe(
    audio,
    beam_size=5,
    word_timestamps=True,
    vad_filter=True,
    vad_parameters=dict(min_silence_duration_ms=250)
)

segments = []
all_words = []
full_text = []

for seg in segments_generator:
    seg_words = []
    if seg.words:
        for w in seg.words:
            word_obj = {
                "word": w.word,
                "start": round(w.start, 3),
                "end": round(w.end, 3),
                "probability": round(w.probability, 3)
            }
            seg_words.append(word_obj)
            all_words.append(word_obj)
            
    seg_data = {
        "id": seg.id,
        "seek": seg.seek,
        "start": round(seg.start, 3),
        "end": round(seg.end, 3),
        "text": seg.text.strip(),
        "tokens": seg.tokens,
        "avg_logprob": round(seg.avg_logprob, 3),
        "compression_ratio": round(seg.compression_ratio, 3),
        "no_speech_prob": round(seg.no_speech_prob, 3),
        "words": seg_words
    }
    segments.append(seg_data)
    full_text.append(seg.text.strip())
    print(f"[{seg.start:6.2f}s -> {seg.end:6.2f}s] {seg.text.strip()}")

transcript_data = {
    "text": " ".join(full_text),
    "duration": round(duration, 3),
    "language": "en",
    "language_probability": round(info.language_probability, 3),
    "segments": segments,
    "words": all_words
}

with open(TRANSCRIPT_PATH, "w", encoding="utf-8") as f:
    json.dump(transcript_data, f, indent=2, ensure_ascii=False)

print(f"\nDone! Transcribed {len(all_words)} words across {len(segments)} segments in {time.time() - start_time:.1f}s.")
print(f"Transcript saved to {TRANSCRIPT_PATH}")
