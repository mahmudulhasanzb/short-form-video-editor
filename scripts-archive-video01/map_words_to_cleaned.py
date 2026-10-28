import json

with open('video-01/transcript.json', 'r', encoding='utf-8') as f:
    transcript = json.load(f)

with open('video-01/cut-list.json', 'r', encoding='utf-8') as f:
    cut_list = json.load(f)

kept_segs = cut_list['keptSegments']

# Collect all words from transcript
all_words = []
for s in transcript.get('segments', []):
    for w in s.get('words', []):
        all_words.append(w)

print(f"Total words in raw transcript: {len(all_words)}")

# Map each word to cleaned timeline
cleaned_words = []
accum_time = 0.0

for seg in kept_segs:
    seg_start = seg['start']
    seg_end = seg['end']
    seg_dur = seg_end - seg_start
    
    # Find words in this segment
    for w in all_words:
        w_start = w['start']
        w_end = w['end']
        # If word falls within or overlaps this kept segment
        if w_start >= seg_start - 0.05 and w_end <= seg_end + 0.05:
            # Map time to cleaned timeline
            c_start = accum_time + max(0.0, w_start - seg_start)
            c_end = accum_time + min(seg_dur, w_end - seg_start)
            c_start_frame = int(round(c_start * 30))
            c_end_frame = int(round(c_end * 30))
            
            cleaned_words.append({
                'word': w['word'].strip(),
                'cleanStart': round(c_start, 3),
                'cleanEnd': round(c_end, 3),
                'startFrame': c_start_frame,
                'endFrame': c_end_frame
            })
    accum_time += seg_dur

print(f"Total words mapped to cleaned video: {len(cleaned_words)}")
print(f"Total cleaned duration from segments: {accum_time:.3f}s (frames: {accum_time * 30:.1f})")

# Print first 20 mapped words
for cw in cleaned_words[:20]:
    print(f"[{cw['startFrame']:4d} - {cw['endFrame']:4d}] ({cw['cleanStart']:05.2f}s - {cw['cleanEnd']:05.2f}s) {cw['word']}")
