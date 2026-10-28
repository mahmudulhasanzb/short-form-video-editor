import json

with open("video-01/scene-plan-2.json", "r", encoding="utf-8") as f:
    plan = json.load(f)

print("=== AUDIT OF ALL SCENES IN scene-plan-2.json FOR SPLIT SCREEN GAPS ===")
for s in plan:
    sn = s["sceneNumber"]
    sid = s["id"]
    layout = s["layoutType"]
    sf = s["startFrame"]
    ef = s["endFrame"]
    card = s.get("uiCardNeed")
    card_start = s.get("uiCardStartFrame")
    card_end = s.get("uiCardEndFrame")
    source = s.get("sourceReference")
    chunks = s.get("captionChunks", [])
    
    print(f"\nScene #{sn} ({sid}) | Layout: {layout} | Frames: {sf} - {ef} (duration: {ef - sf})")
    print(f"  UI Card: {card} (Lifespan: {card_start} - {card_end})")
    print(f"  Source Reference: {source.get('fileName') if source else None}")
    print(f"  Total Chunks: {len(chunks)}")
    
    if layout == "50/50 Split":
        # Check if there is a gap before card_start or after card_end
        gap_before = (card_start - sf) if card_start is not None else 0
        gap_after = (ef - card_end) if card_end is not None else (ef - sf if card == "none" else 0)
        
        print(f"  --> Gap before card: {gap_before} frames ({gap_before/30:.2f}s)")
        print(f"  --> Gap after card:  {gap_after} frames ({gap_after/30:.2f}s)")
        
        if card == "none":
            print(f"  [GAP VIOLATION] 50/50 Split has NO card! Must be Full Speaker!")
        elif gap_after > 9: # more than the 0.3s exit
            print(f"  [GAP VIOLATION] 50/50 Split stays on screen for {gap_after} frames after card exits!")
            # Find which chunks occur after card_end
            after_chunks = [c for c in chunks if c["startFrame"] >= (card_end or 0)]
            print(f"    Chunks after card exit ({len(after_chunks)} chunks):")
            for ac in after_chunks:
                text = " ".join(t["text"] for t in ac["tokens"])
                print(f"      [{ac['startFrame']}-{ac['endFrame']}]: {text}")
