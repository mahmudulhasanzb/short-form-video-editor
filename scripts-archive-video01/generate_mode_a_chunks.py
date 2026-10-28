import json
import re

with open('video-01/transcript.json', 'r', encoding='utf-8') as f:
    transcript = json.load(f)

with open('video-01/cut-list.json', 'r', encoding='utf-8') as f:
    cut_list = json.load(f)

with open('video-01/scene-plan.json', 'r', encoding='utf-8') as f:
    scenes = json.load(f)

kept_segs = cut_list['keptSegments']
all_words = []
for s in transcript.get('segments', []):
    for w in s.get('words', []):
        all_words.append(w)

cleaned_words = []
accum_time = 0.0

for seg in kept_segs:
    seg_start = seg['start']
    seg_end = seg['end']
    seg_dur = seg_end - seg_start
    for w in all_words:
        w_start = w['start']
        w_end = w['end']
        if w_start >= seg_start - 0.05 and w_end <= seg_end + 0.05:
            c_start = accum_time + max(0.0, w_start - seg_start)
            c_end = accum_time + min(seg_dur, w_end - seg_start)
            c_start_frame = int(round(c_start * 30))
            c_end_frame = int(round(c_end * 30))
            cleaned_words.append({
                'word': w['word'].strip(),
                'startFrame': c_start_frame,
                'endFrame': c_end_frame,
                'cleanStart': round(c_start, 2),
                'cleanEnd': round(c_end, 2)
            })
    accum_time += seg_dur

# Function to determine if a word is a good highlight candidate
# Key nouns/verbs/adjectives, not filler or common functional words
STOPWORDS = set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'to', 'for', 'with', 'in', 'on', 'at',
    'by', 'from', 'of', 'how', 'what', 'would', 'you', 'it', 'is', 'are', 'was', 'were',
    'that', 'this', 'there', 'they', 'we', 'i', 'my', 'your', 'so', 'can', 'do', 'lots',
    'etc', 'okay', 'like', 'just', 'as', 'into', 'up', 'down', 'be', 'have', 'having'
])

for sc in scenes:
    s_num = sc['sceneNumber']
    mode = sc.get('captionMode')
    s_start = sc['startFrame']
    s_end = sc['endFrame']
    
    if mode != 'Mode A':
        print(f"Scene {s_num}: {mode} (skipping chunking, preserved as curated statement lockup)")
        continue
        
    # Get words within this scene frame interval
    sc_words = [w for w in cleaned_words if w['startFrame'] >= s_start and w['startFrame'] < s_end]
    print(f"\n=== Scene {s_num} (Mode A, frames {s_start}-{s_end}): {len(sc_words)} words ===")
    
    # Chunk into 2-3 words
    chunks = []
    i = 0
    while i < len(sc_words):
        # Decide chunk size: 2 or 3
        # If remaining is 4, do 2 and 2; if remaining is 3, do 3; if remaining is 2, do 2; if 1, join with previous if exists
        rem = len(sc_words) - i
        if rem == 4:
            take = 2
        elif rem == 3:
            take = 3
        elif rem == 2:
            take = 2
        elif rem == 1:
            if chunks:
                # Add word to last chunk
                chunks[-1]['words'].append(sc_words[i])
                chunks[-1]['endFrame'] = sc_words[i]['endFrame']
                break
            else:
                take = 1
        else:
            # Default to 3 words unless punctuation suggests 2
            take = 3
            if i + 1 < len(sc_words) and any(sc_words[i+1]['word'].endswith(p) for p in [',', '.', '?', '!']):
                take = 2
                
        chunk_words = sc_words[i : i + take]
        chunks.append({
            'startFrame': chunk_words[0]['startFrame'],
            'endFrame': chunk_words[-1]['endFrame'],
            'words': chunk_words
        })
        i += take
        
    print(f"Generated {len(chunks)} chunks:")
    for c_idx, c in enumerate(chunks):
        words_text = [w['word'] for w in c['words']]
        # Pick one key word to highlight if appropriate
        highlight_idx = -1
        # Find first non-stopword
        for widx, w in enumerate(words_text):
            clean_w = re.sub(r'[^\w]', '', w.lower())
            if clean_w not in STOPWORDS and len(clean_w) > 3:
                highlight_idx = widx
                break
        
        # Format tokens
        tokens = []
        for widx, w in enumerate(words_text):
            tokens.append({
                'text': w,
                'isHighlighted': (widx == highlight_idx)
            })
        c['tokens'] = tokens
        
        hl_word = words_text[highlight_idx] if highlight_idx != -1 else "(none)"
        print(f"  Chunk {c_idx+1} [f {c['startFrame']:4d} - {c['endFrame']:4d}]: {' '.join(words_text)} | Highlight: {hl_word}")
