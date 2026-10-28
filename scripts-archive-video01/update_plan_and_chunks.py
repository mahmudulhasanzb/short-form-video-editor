import json
import re

with open('video-01/scene-plan-first-plan-backup.json', 'r', encoding='utf-8') as f:
    scenes = json.load(f)

with open('video-01/transcript.json', 'r', encoding='utf-8') as f:
    transcript = json.load(f)

with open('video-01/cut-list.json', 'r', encoding='utf-8') as f:
    cut_list = json.load(f)

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
            })
    accum_time += seg_dur

STOPWORDS = set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'to', 'for', 'with', 'in', 'on', 'at',
    'by', 'from', 'of', 'how', 'what', 'would', 'you', 'it', 'is', 'are', 'was', 'were',
    'that', 'this', 'there', 'they', 'we', 'i', 'my', 'your', 'so', 'can', 'do', 'lots',
    'etc', 'okay', 'like', 'just', 'as', 'into', 'up', 'down', 'be', 'have', 'having'
])

calibrated_crop = {
    'headTopPercent': 5,
    'eyeLinePercent': 35,
    'chinPercent': 64,
    'shouldersPercent': 85
}

for sc in scenes:
    s_num = sc['sceneNumber']
    mode = sc.get('captionMode')
    s_start = sc['startFrame']
    s_end = sc['endFrame']
    
    # Update split crop if Split layout
    if sc['layoutType'] == '50/50 Split':
        sc['splitPersonCrop'] = calibrated_crop

    # UI Cleanup (Bug 5)
    if s_num == 1:
        # Remove unlabeled 1, 2, 3 pill
        sc['uiCardNeed'] = 'none'
        sc['uiCardProps'] = {}
    elif s_num == 2:
        # Remove 85% slider value
        sc['uiCardProps'] = {
            'leftLabel': 'Zero Exposure',
            'rightLabel': 'High-Volume Podcasts',
            'accentColor': '#3B82F6'
        }
    elif s_num == 3:
        # Remove $3,000-$5,000 price and 30+ claim
        sc['uiCardProps'] = {
            'title': 'Offer Blueprint',
            'badge': 'AI System',
            'subtitle': '1 Long-form Video -> Distributed Content',
            'rotation': -4
        }
    elif s_num == 4:
        # Remove 4K and 0:00-45:00 timings
        sc['uiCardProps'] = {
            'title': 'Ingest Media Tracks',
            'tracks': [
                {'label': 'LinkedIn'},
                {'label': 'X Podcast'},
                {'label': 'YouTube'}
            ]
        }
    elif s_num == 9:
        # Replace SYS buttons with loading segments named from the script
        sc['uiCardProps'] = {
            'label': 'All 3 Systems Active: 100% Autonomous',
            'segments': ['Text Posts', 'Static Images', 'Video Clips'],
            'accentColor': '#10B981'
        }

    # Mode A chunking (Bug 2)
    if mode == 'Mode A':
        sc_words = [w for w in cleaned_words if w['startFrame'] >= s_start and w['startFrame'] < s_end]
        chunks = []
        i = 0
        while i < len(sc_words):
            rem = len(sc_words) - i
            if rem == 4:
                take = 2
            elif rem == 3:
                take = 3
            elif rem == 2:
                take = 2
            elif rem == 1:
                if chunks:
                    chunks[-1]['tokens'].append({'text': sc_words[i]['word'], 'isHighlighted': False})
                    chunks[-1]['endFrame'] = sc_words[i]['endFrame']
                    break
                else:
                    take = 1
            else:
                take = 3
                if i + 1 < len(sc_words) and any(sc_words[i+1]['word'].endswith(p) for p in [',', '.', '?', '!']):
                    take = 2
                    
            chunk_words = sc_words[i : i + take]
            words_text = [w['word'] for w in chunk_words]
            
            # Select at most 1 key word to highlight
            highlight_idx = -1
            for widx, w in enumerate(words_text):
                clean_w = re.sub(r'[^\w]', '', w.lower())
                if clean_w not in STOPWORDS and len(clean_w) > 3:
                    highlight_idx = widx
                    break
            
            tokens = []
            for widx, w in enumerate(words_text):
                tokens.append({
                    'text': w,
                    'isHighlighted': (widx == highlight_idx)
                })
            
            chunks.append({
                'startFrame': chunk_words[0]['startFrame'],
                'endFrame': chunk_words[-1]['endFrame'],
                'tokens': tokens
            })
            i += take
            
        sc['captionChunks'] = chunks

with open('video-01/scene-plan.json', 'w', encoding='utf-8') as f:
    json.dump(scenes, f, indent=2)

print("Updated video-01/scene-plan.json successfully with Mode A chunks and UI cleanup.")
