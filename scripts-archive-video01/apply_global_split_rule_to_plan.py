import json

with open("video-01/scene-plan-2.json", "r", encoding="utf-8") as f:
    old_scenes = json.load(f)

new_scenes = []

for s in old_scenes:
    sid = s["id"]
    layout = s["layoutType"]
    
    if sid == "scene-01":
        new_scenes.append(s)
        
    elif sid == "scene-02":
        # Split Scene 2 into 2A (50/50 Split) and 2B (Full Speaker)
        chunks = s["captionChunks"]
        chunks_2a = [c for c in chunks if c["endFrame"] <= 370]
        chunks_2b = [c for c in chunks if c["startFrame"] >= 370]
        
        # 2A: 50/50 Split with BeginnerProSlider
        s2a = dict(s)
        s2a["id"] = "scene-02"
        s2a["instruction"] = "50/50 Split: Top warm-grid layer compares target audiences (Zero Exposure vs High-Volume Podcasts) on slider. Bottom layer shows speaker."
        s2a["startFrame"] = 240
        s2a["endFrame"] = 370
        s2a["startTimestamp"] = "00:08.00"
        s2a["endTimestamp"] = "00:12.33"
        s2a["uiCardNeed"] = "BeginnerProSlider"
        s2a["uiCardStartFrame"] = 247
        s2a["uiCardEndFrame"] = 370
        s2a["fontSize"] = 48
        s2a["highlightFontSize"] = 80
        s2a["captionChunks"] = chunks_2a
        s2a["captionText"] = "And what would you go for: businesses with no marketing exposure, or ones with podcasts, et cetera"
        s2a["captionTokens"] = [t for c in chunks_2a for t in c["tokens"]]
        s2a["soundCues"] = [c for c in s["soundCues"] if c["frame"] < 370]
        new_scenes.append(s2a)
        
        # 2B: Full Speaker, no card, white text on dark background
        s2b = dict(s)
        s2b["id"] = "scene-02-b"
        s2b["sceneNumber"] = 2.1
        s2b["instruction"] = "Full Speaker: Return to full speaker framing as speaker asks rhetorical question on volume repurposing and agency differentiation. No blank canvas."
        s2b["contentType"] = "Person in Center"
        s2b["layoutType"] = "Full Speaker"
        s2b["mainFocus"] = "Rhetorical question: Repurposing on volume with AI and differentiating from agencies."
        s2b["startFrame"] = 370
        s2b["endFrame"] = 520
        s2b["startTimestamp"] = "00:12.33"
        s2b["endTimestamp"] = "00:17.33"
        s2b["uiCardNeed"] = "none"
        s2b["uiCardProps"] = {}
        s2b["uiCardStartFrame"] = None
        s2b["uiCardEndFrame"] = None
        s2b["fontSize"] = 52
        s2b["highlightFontSize"] = 84
        s2b["captionChunks"] = chunks_2b
        s2b["captionText"] = "that you could repurpose on volume with AI? How would you differentiate from existing agencies that aren't using"
        s2b["captionTokens"] = [t for c in chunks_2b for t in c["tokens"]]
        s2b["soundCues"] = [c for c in s["soundCues"] if c["frame"] >= 370]
        if "splitPersonCrop" in s2b:
            del s2b["splitPersonCrop"]
        new_scenes.append(s2b)

    elif sid == "scene-03":
        new_scenes.append(s)

    elif sid == "scene-04":
        chunks = s["captionChunks"]
        chunks_4a = [c for c in chunks if c["endFrame"] <= 875]
        chunks_4b = [c for c in chunks if c["startFrame"] >= 875 and c["endFrame"] <= 1108]
        chunks_4c = [c for c in chunks if c["startFrame"] >= 1108]
        
        # 4A: Full Speaker (750 to 875)
        s4a = dict(s)
        s4a["id"] = "scene-04-a"
        s4a["sceneNumber"] = 4
        s4a["instruction"] = "Full Speaker: Speaker explains core breakdown strategy from long form to short form clips."
        s4a["contentType"] = "Person in Center"
        s4a["layoutType"] = "Full Speaker"
        s4a["startFrame"] = 750
        s4a["endFrame"] = 875
        s4a["uiCardNeed"] = "none"
        s4a["uiCardProps"] = {}
        s4a["uiCardStartFrame"] = None
        s4a["uiCardEndFrame"] = None
        s4a["fontSize"] = 52
        s4a["highlightFontSize"] = 84
        s4a["captionChunks"] = chunks_4a
        s4a["captionTokens"] = [t for c in chunks_4a for t in c["tokens"]]
        s4a["soundCues"] = [c for c in s["soundCues"] if c["frame"] < 875]
        if "splitPersonCrop" in s4a:
            del s4a["splitPersonCrop"]
        new_scenes.append(s4a)
        
        # 4B: 50/50 Split with TimelineCard (875 to 1108)
        s4b = dict(s)
        s4b["id"] = "scene-04-b"
        s4b["sceneNumber"] = 4.1
        s4b["instruction"] = "50/50 Split: Media timeline card displays platform ingest tracks (LinkedIn, X Podcast, YouTube)."
        s4b["layoutType"] = "50/50 Split"
        s4b["startFrame"] = 875
        s4b["endFrame"] = 1108
        s4b["uiCardNeed"] = "TimelineCard"
        s4b["uiCardStartFrame"] = 875
        s4b["uiCardEndFrame"] = 1108
        s4b["fontSize"] = 48
        s4b["highlightFontSize"] = 80
        s4b["captionChunks"] = chunks_4b
        s4b["captionTokens"] = [t for c in chunks_4b for t in c["tokens"]]
        s4b["soundCues"] = [c for c in s["soundCues"] if 875 <= c["frame"] < 1108]
        new_scenes.append(s4b)
        
        # 4C: Full Speaker (1108 to 1130)
        s4c = dict(s)
        s4c["id"] = "scene-04-c"
        s4c["sceneNumber"] = 4.2
        s4c["instruction"] = "Full Speaker: Speaker transitions verbally to the three major systems architecture."
        s4c["contentType"] = "Person in Center"
        s4c["layoutType"] = "Full Speaker"
        s4c["startFrame"] = 1108
        s4c["endFrame"] = 1130
        s4c["uiCardNeed"] = "none"
        s4c["uiCardProps"] = {}
        s4c["uiCardStartFrame"] = None
        s4c["uiCardEndFrame"] = None
        s4c["fontSize"] = 52
        s4c["highlightFontSize"] = 84
        s4c["captionChunks"] = chunks_4c
        s4c["captionTokens"] = [t for c in chunks_4c for t in c["tokens"]]
        s4c["soundCues"] = [c for c in s["soundCues"] if c["frame"] >= 1108]
        if "splitPersonCrop" in s4c:
            del s4c["splitPersonCrop"]
        new_scenes.append(s4c)

    elif sid == "scene-05":
        new_scenes.append(s)

    elif sid == "scene-06":
        chunks = s["captionChunks"]
        chunks_6a = [c for c in chunks if c["endFrame"] <= 1665]
        chunks_6b = [c for c in chunks if c["startFrame"] >= 1665]
        
        # 6A: 50/50 Split with BrowserWindowMockup (1360 to 1665)
        s6a = dict(s)
        s6a["id"] = "scene-06"
        s6a["startFrame"] = 1360
        s6a["endFrame"] = 1665
        s6a["uiCardNeed"] = "BrowserWindowMockup"
        s6a["uiCardStartFrame"] = 1370
        s6a["uiCardEndFrame"] = 1665
        s6a["fontSize"] = 48
        s6a["highlightFontSize"] = 80
        s6a["captionChunks"] = chunks_6a
        s6a["captionTokens"] = [t for c in chunks_6a for t in c["tokens"]]
        s6a["soundCues"] = [c for c in s["soundCues"] if c["frame"] < 1665]
        new_scenes.append(s6a)
        
        # 6B: Full Speaker (1665 to 1850)
        s6b = dict(s)
        s6b["id"] = "scene-06-b"
        s6b["sceneNumber"] = 6.1
        s6b["instruction"] = "Full Speaker: Speaker transitions verbally to System 2 static image quote formats. No blank canvas."
        s6b["contentType"] = "Person in Center"
        s6b["layoutType"] = "Full Speaker"
        s6b["startFrame"] = 1665
        s6b["endFrame"] = 1850
        s6b["uiCardNeed"] = "none"
        s6b["uiCardProps"] = {}
        s6b["uiCardStartFrame"] = None
        s6b["uiCardEndFrame"] = None
        s6b["fontSize"] = 52
        s6b["highlightFontSize"] = 84
        s6b["captionChunks"] = chunks_6b
        s6b["captionTokens"] = [t for c in chunks_6b for t in c["tokens"]]
        s6b["soundCues"] = [c for c in s["soundCues"] if c["frame"] >= 1665]
        if "splitPersonCrop" in s6b:
            del s6b["splitPersonCrop"]
        new_scenes.append(s6b)

    elif sid == "scene-07":
        new_scenes.append(s)

    elif sid == "scene-08":
        chunks = s["captionChunks"]
        chunks_8a = [c for c in chunks if c["endFrame"] <= 2505]
        chunks_8b = [c for c in chunks if c["startFrame"] >= 2505]
        
        # 8A: 50/50 Split with SoundWaveCard (2300 to 2505)
        s8a = dict(s)
        s8a["id"] = "scene-08"
        s8a["startFrame"] = 2300
        s8a["endFrame"] = 2505
        s8a["uiCardNeed"] = "SoundWaveCard"
        s8a["uiCardStartFrame"] = 2313
        s8a["uiCardEndFrame"] = 2505
        s8a["fontSize"] = 48
        s8a["highlightFontSize"] = 80
        s8a["captionChunks"] = chunks_8a
        s8a["captionTokens"] = [t for c in chunks_8a for t in c["tokens"]]
        s8a["soundCues"] = [c for c in s["soundCues"] if c["frame"] < 2505]
        new_scenes.append(s8a)
        
        # 8B: Full Speaker (2505 to 2600)
        s8b = dict(s)
        s8b["id"] = "scene-08-b"
        s8b["sceneNumber"] = 8.1
        s8b["instruction"] = "Full Speaker: Speaker describes visual composition and effects. No blank canvas."
        s8b["contentType"] = "Person in Center"
        s8b["layoutType"] = "Full Speaker"
        s8b["startFrame"] = 2505
        s8b["endFrame"] = 2600
        s8b["uiCardNeed"] = "none"
        s8b["uiCardProps"] = {}
        s8b["uiCardStartFrame"] = None
        s8b["uiCardEndFrame"] = None
        s8b["fontSize"] = 52
        s8b["highlightFontSize"] = 84
        s8b["captionChunks"] = chunks_8b
        s8b["captionTokens"] = [t for c in chunks_8b for t in c["tokens"]]
        s8b["soundCues"] = [c for c in s["soundCues"] if c["frame"] >= 2505]
        if "splitPersonCrop" in s8b:
            del s8b["splitPersonCrop"]
        new_scenes.append(s8b)

    elif sid == "scene-09":
        new_scenes.append(s)

# Save updated scene-plan-2.json and scene-plan.json
with open("video-01/scene-plan-2.json", "w", encoding="utf-8") as f:
    json.dump(new_scenes, f, indent=2)

with open("video-01/scene-plan.json", "w", encoding="utf-8") as f:
    json.dump(new_scenes, f, indent=2)

print(f"Plan successfully updated! Total scenes: {len(new_scenes)} (was {len(old_scenes)})")
