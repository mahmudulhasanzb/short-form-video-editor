for fn in ['video-01/scene-plan-3.json', 'video-01/scene-plan.json']:
    with open(fn, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('"../video-01/cleaned.mp4"', 'null')
    with open(fn, 'w', encoding='utf-8') as f:
        f.write(c)

with open('remotion-template/src/composition/video-01-scene-plan.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('"../video-01/cleaned.mp4"', 'null')
with open('remotion-template/src/composition/video-01-scene-plan.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print('Replaced ../video-01/cleaned.mp4 with null!')
