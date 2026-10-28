import json

path = r'C:\Users\DELL\.gemini\antigravity\brain\5fcde24f-bc9f-4296-9fa8-40e6a2bc3539\.system_generated\logs\transcript_full.jsonl'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(len(lines) - 1, -1, -1):
    obj = json.loads(lines[i])
    if obj.get('type') == 'USER_INPUT':
        print('Found USER_INPUT at line', i + 1, 'step_index', obj.get('step_index'))
        content = obj.get('content', '')
        print('Content length:', len(content))
        print('Content preview:', content[:200])
        with open('video-01/scene-plan-user.json', 'w', encoding='utf-8') as out:
            out.write(content)
        break
