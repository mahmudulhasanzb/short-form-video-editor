import json

with open('video-01/transcript.json', 'r', encoding='utf-8') as f:
    transcript = json.load(f)

with open('video-01/cut-list.json', 'r', encoding='utf-8') as f:
    cut_list = json.load(f)

print(f"Total transcript segments: {len(transcript.get('segments', []))}")
print(f"Total kept segments: {len(cut_list.get('kept_segments', []))}")

# Check sample word
first_seg = transcript['segments'][0]
print("First segment text:", first_seg['text'])
print("First segment words:", len(first_seg['words']))
for w in first_seg['words'][:5]:
    print(w)
