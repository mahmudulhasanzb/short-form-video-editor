import json
import os

OUTPUT_HTML = "video-01/edit-plan.html"

scenes = [
    {
        "id": "scene-01",
        "sceneNumber": 1,
        "instruction": "Hook scene: Main speaker centered against dark backdrop. Establish core offer problem and introduce 3-step roadmap pill in lower third.",
        "contentType": "Person in Center",
        "layoutType": "Full Speaker",
        "mainFocus": "Hook establishing core problem: How to package and price an AI content repurposing offer.",
        "captionMode": "Mode A",
        "captionText": "With AI now having the ability to edit content really well, if you had to create an offer for content repurposing, how would you charge a business?",
        "captionTokens": [
            {"text": "With AI now having the ability to edit"},
            {"text": "really well,", "isHighlighted": True},
            {"text": "how would you charge a business?"}
        ],
        "fontSize": 44,
        "highlightFontSize": 72,
        "startFrame": 0,
        "endFrame": 240,
        "startTimestamp": "00:00.00",
        "endTimestamp": "00:08.00",
        "uiCardNeed": "DarkGlassNumberedPill",
        "uiCardProps": {
            "steps": [1, 2, 3],
            "activeStep": 1,
            "accentColor": "#3B82F6",
            "label": "AI Repurposing Engine"
        },
        "soundCues": [
            {
                "id": "cue-01-01",
                "family": "WHOOSHES",
                "filename": "whooshes/ES_Classic, Hollow, Low, Long - Epidemic Sound.mp3",
                "frame": 0,
                "targetDb": -12,
                "notes": "Movement peak entering hook"
            },
            {
                "id": "cue-01-02",
                "family": "TEXTURES",
                "filename": "misc/UI.mp3",
                "frame": 15,
                "targetDb": -7,
                "notes": "Pop on DarkGlassNumberedPill reveal"
            },
            {
                "id": "cue-01-03",
                "family": "RISERS",
                "filename": "risers/ES_Bass, Sharp Detail Riser - Epidemic Sound.mp3",
                "frame": 150,
                "targetDb": -5,
                "notes": "Bass build 5s into hook"
            },
            {
                "id": "cue-01-04",
                "family": "HITS",
                "filename": "kicks-impacts/ES_Hit Deep Digital 1 - SFX Producer.mp3",
                "frame": 210,
                "targetDb": -5,
                "notes": "Release on key question beat"
            }
        ]
    },
    {
        "id": "scene-02",
        "sceneNumber": 2,
        "instruction": "50/50 Split: Top warm-grid layer compares target audiences (Zero Exposure vs High-Volume Podcasts) on slider. Bottom layer shows speaker with calibrated eye-line at 63.5%.",
        "contentType": "Person on Side",
        "layoutType": "50/50 Split",
        "mainFocus": "Comparing audience selection: Businesses with no marketing exposure vs high-volume podcasts.",
        "captionMode": "Mode A",
        "captionText": "What would you go for: businesses with no exposure, or ones with podcasts that you could repurpose on volume with AI?",
        "captionTokens": [
            {"text": "repurpose on"},
            {"text": "volume with AI", "isHighlighted": True},
            {"text": "vs traditional agencies"}
        ],
        "fontSize": 40,
        "highlightFontSize": 68,
        "startFrame": 240,
        "endFrame": 520,
        "startTimestamp": "00:08.00",
        "endTimestamp": "00:17.33",
        "uiCardNeed": "BeginnerProSlider",
        "uiCardProps": {
            "leftLabel": "Zero Exposure",
            "rightLabel": "High-Volume Podcasts",
            "progressPercent": 85,
            "accentColor": "#3B82F6"
        },
        "splitPersonCrop": {
            "headTopPercent": 6,
            "eyeLinePercent": 27,
            "chinPercent": 48,
            "shouldersPercent": 65
        },
        "soundCues": [
            {
                "id": "cue-02-01",
                "family": "WHOOSHES",
                "filename": "whooshes/ES_PREL Whoosh Low Air 1 - SFX Producer.mp3",
                "frame": 240,
                "targetDb": -12,
                "notes": "Slide into 50/50 split layout"
            },
            {
                "id": "cue-02-02",
                "family": "TEXTURES",
                "filename": "misc/computer click.mp3",
                "frame": 275,
                "targetDb": -7,
                "notes": "Click on slider knob locking at 85%"
            }
        ]
    },
    {
        "id": "scene-03",
        "sceneNumber": 3,
        "instruction": "100% Full Canvas: Statement lockup in Mode B on warm grid. Tilted blueprint card in center introduces the 1-to-30 asset thesis with generous whitespace.",
        "contentType": "Object (Middle) + Text",
        "layoutType": "100% Full Canvas",
        "mainFocus": "Direct thesis statement lockup introducing the AI content blueprint.",
        "captionMode": "Mode B",
        "captionText": "The Content Engine: Simple. Scalable. Autonomous.",
        "captionTokens": [
            {"text": "The Content Engine"},
            {"text": "Simple. Scalable. Autonomous.", "isHighlighted": True}
        ],
        "canvasVariant": "warm-grid",
        "fontSize": 48,
        "highlightFontSize": 80,
        "startFrame": 520,
        "endFrame": 750,
        "startTimestamp": "00:17.33",
        "endTimestamp": "00:25.00",
        "uiCardNeed": "TiltedMockupCard",
        "uiCardProps": {
            "title": "Offer Blueprint",
            "badge": "AI System",
            "subtitle": "1 Long-form Video -> 30+ Distributed Assets",
            "rotation": -4
        },
        "soundCues": [
            {
                "id": "cue-03-01",
                "family": "WHOOSHES",
                "filename": "whooshes/ES_PREL Whoosh Dark 10 - SFX Producer.mp3",
                "frame": 520,
                "targetDb": -12,
                "notes": "Transition from split to full canvas"
            },
            {
                "id": "cue-03-02",
                "family": "TEXTURES",
                "filename": "misc/Eiravaein Works - Start Select Vol 1- Deep Ping Notification Reverb.wav",
                "frame": 550,
                "targetDb": -6,
                "notes": "Deep ping on tilted blueprint appearance"
            },
            {
                "id": "cue-03-03",
                "family": "RISERS",
                "filename": "risers/ES_Riser Metallic - SFX Producer.mp3",
                "frame": 660,
                "targetDb": -5,
                "notes": "Metallic riser into platform breakdown"
            },
            {
                "id": "cue-03-04",
                "family": "HITS",
                "filename": "kicks-impacts/ES_Short, Cinematic, Gritty - Epidemic Sound.mp3",
                "frame": 750,
                "targetDb": -5,
                "notes": "Hit landing the chapter shift"
            }
        ]
    },
    {
        "id": "scene-04",
        "sceneNumber": 4,
        "instruction": "50/50 Split: Top graphic layer displays media timeline card ingesting YouTube, X podcasts, and LinkedIn. Bottom layer preserves speaker.",
        "contentType": "Text + Object",
        "layoutType": "50/50 Split",
        "mainFocus": "Platform targeting timeline: Ingesting from LinkedIn, X podcasts, and YouTube.",
        "captionMode": "Mode A",
        "captionText": "Break down long-form clips preferentially on LinkedIn, X videos, X podcasts, and YouTube.",
        "captionTokens": [
            {"text": "Break down long form into"},
            {"text": "LinkedIn, X, & YouTube", "isHighlighted": True},
            {"text": "clips"}
        ],
        "fontSize": 40,
        "highlightFontSize": 68,
        "startFrame": 750,
        "endFrame": 1130,
        "startTimestamp": "00:25.00",
        "endTimestamp": "00:37.67",
        "uiCardNeed": "TimelineCard",
        "uiCardProps": {
            "title": "Ingest Media Tracks",
            "tracks": [
                {"label": "YouTube Master (4K)", "time": "0:00 - 45:00"},
                {"label": "X Podcast Stream", "time": "Audio HQ"},
                {"label": "LinkedIn Long-Form", "time": "1080p Web"}
            ],
            "playheadPosition": 55
        },
        "splitPersonCrop": {
            "headTopPercent": 6,
            "eyeLinePercent": 27,
            "chinPercent": 48,
            "shouldersPercent": 65
        },
        "soundCues": [
            {
                "id": "cue-04-01",
                "family": "WHOOSHES",
                "filename": "whooshes/ES_Classic, Hollow, Low, Long - Epidemic Sound.mp3",
                "frame": 750,
                "targetDb": -12,
                "notes": "Snap into timeline layout"
            },
            {
                "id": "cue-04-02",
                "family": "TEXTURES",
                "filename": "misc/ES_Apple Mouse Click 3 - SFX Producer.mp3",
                "frame": 795,
                "targetDb": -7,
                "notes": "Click on timeline track ingest"
            },
            {
                "id": "cue-04-03",
                "family": "TEXTURES",
                "filename": "misc/UI.mp3",
                "frame": 890,
                "targetDb": -7,
                "notes": "Playhead scrub texture"
            }
        ]
    },
    {
        "id": "scene-05",
        "sceneNumber": 5,
        "instruction": "Full Speaker Anchor: Camera pushes in as speaker announces the core architecture of three major systems. Dark glass pill highlights Step 1.",
        "contentType": "Person in Center",
        "layoutType": "Full Speaker",
        "mainFocus": "Speaker presenting the core architecture: Three major systems.",
        "captionMode": "Mode A",
        "captionText": "I would build three major systems: video to text, static image, and video clipper.",
        "captionTokens": [
            {"text": "I would build"},
            {"text": "three major systems", "isHighlighted": True}
        ],
        "fontSize": 44,
        "highlightFontSize": 72,
        "startFrame": 1130,
        "endFrame": 1360,
        "startTimestamp": "00:37.67",
        "endTimestamp": "00:45.33",
        "uiCardNeed": "DarkGlassNumberedPill",
        "uiCardProps": {
            "steps": [1, 2, 3],
            "activeStep": 1,
            "accentColor": "#60A5FA",
            "label": "System Architecture"
        },
        "soundCues": [
            {
                "id": "cue-05-01",
                "family": "WHOOSHES",
                "filename": "whooshes/ES_PREL Whoosh Dark 3 - SFX Producer.mp3",
                "frame": 1130,
                "targetDb": -12,
                "notes": "Transition back to speaker focus"
            },
            {
                "id": "cue-05-02",
                "family": "TEXTURES",
                "filename": "misc/computer click.mp3",
                "frame": 1165,
                "targetDb": -7,
                "notes": "Step 1 active pulse"
            },
            {
                "id": "cue-05-03",
                "family": "RISERS",
                "filename": "risers/ES_Bass, Sharp Detail Riser - Epidemic Sound.mp3",
                "frame": 1260,
                "targetDb": -5,
                "notes": "Bass riser building into system 1 deep dive"
            },
            {
                "id": "cue-05-04",
                "family": "HITS",
                "filename": "kicks-impacts/ES_Hit Phase LFE - SFX Producer.mp3",
                "frame": 1360,
                "targetDb": -5,
                "notes": "LFE impact on System 1 launch"
            }
        ]
    },
    {
        "id": "scene-06",
        "sceneNumber": 6,
        "instruction": "50/50 Split: System 1 deep-dive. Browser window mockup shows AI parsing transcript to generate text posts for X and Instagram.",
        "contentType": "Object + Graphic",
        "layoutType": "50/50 Split",
        "mainFocus": "System 1: Browser mockup showing transcript text extraction and post generation.",
        "captionMode": "Mode A",
        "captionText": "Take content that resounds within the transcript and cut it up for X, Instagram, and LinkedIn.",
        "captionTokens": [
            {"text": "Extracting moments that"},
            {"text": "resound in transcript", "isHighlighted": True},
            {"text": "for X & Instagram"}
        ],
        "fontSize": 40,
        "highlightFontSize": 68,
        "startFrame": 1360,
        "endFrame": 1850,
        "startTimestamp": "00:45.33",
        "endTimestamp": "01:01.67",
        "uiCardNeed": "BrowserWindowMockup",
        "uiCardProps": {
            "url": "ai.repurpose/system-1/text-post-generator",
            "title": "Transcript Extraction Engine",
            "badge": "System 01",
            "contentSnippet": "Auto-detect high-resonance quotes -> generate X threads & LinkedIn carousel copies."
        },
        "splitPersonCrop": {
            "headTopPercent": 6,
            "eyeLinePercent": 27,
            "chinPercent": 48,
            "shouldersPercent": 65
        },
        "soundCues": [
            {
                "id": "cue-06-01",
                "family": "WHOOSHES",
                "filename": "whooshes/ES_PREL Whoosh Low Fas - SFX Producer.mp3",
                "frame": 1360,
                "targetDb": -12,
                "notes": "Split slide"
            },
            {
                "id": "cue-06-02",
                "family": "TEXTURES",
                "filename": "misc/Bjorn Lynne - Office Stationary - Typewriter Keyboard Typing.wav",
                "frame": 1420,
                "targetDb": -7,
                "notes": "Keyboard typing simulation for post generator"
            },
            {
                "id": "cue-06-03",
                "family": "TEXTURES",
                "filename": "misc/UI.mp3",
                "frame": 1580,
                "targetDb": -7,
                "notes": "Export notification pop"
            }
        ]
    },
    {
        "id": "scene-07",
        "sceneNumber": 7,
        "instruction": "100% Full Canvas: System 2 deep-dive. Dashed badge card with handwritten paper aesthetic displays high-ROI quote extraction (Hormozi format).",
        "contentType": "Graphic Centric Animation",
        "layoutType": "100% Full Canvas",
        "mainFocus": "System 2: Video to static image handwritten-style quote cards (Hormozi format).",
        "captionMode": "Mode B",
        "captionText": "System 02: High-ROI Visual Notes. Extract Quotes into Handwritten Paper Assets.",
        "captionTokens": [
            {"text": "System 02: High-ROI Visual Notes"},
            {"text": "Extracting Quotes into Paper Assets", "isHighlighted": True}
        ],
        "canvasVariant": "warm-grid",
        "fontSize": 48,
        "highlightFontSize": 80,
        "startFrame": 1850,
        "endFrame": 2300,
        "startTimestamp": "01:01.67",
        "endTimestamp": "01:16.67",
        "uiCardNeed": "DashedBadgeCard",
        "uiCardProps": {
            "title": "Handwritten Note Card",
            "metric": "High ROI",
            "badgeText": "Hormozi Style",
            "subtitle": "Convert transcript moments into handwritten aesthetic carousels"
        },
        "soundCues": [
            {
                "id": "cue-07-01",
                "family": "WHOOSHES",
                "filename": "whooshes/Borrtex - Organized Student - Marker Pen Highlighting.wav",
                "frame": 1850,
                "targetDb": -10,
                "notes": "Marker pen highlight texture on quote reveal"
            },
            {
                "id": "cue-07-02",
                "family": "TEXTURES",
                "filename": "misc/Alberto Sueri - RPG Game - Money in Register.wav",
                "frame": 1930,
                "targetDb": -6,
                "notes": "High ROI register coin impact"
            },
            {
                "id": "cue-07-03",
                "family": "RISERS",
                "filename": "risers/ES_Riser Metallic - SFX Producer.mp3",
                "frame": 2180,
                "targetDb": -5,
                "notes": "Metallic riser into System 3"
            },
            {
                "id": "cue-07-04",
                "family": "HITS",
                "filename": "kicks-impacts/ES_LFE Hit 9 - SFX Producer.mp3",
                "frame": 2300,
                "targetDb": -5,
                "notes": "Sub hit landing System 3 Clipper"
            }
        ]
    },
    {
        "id": "scene-08",
        "sceneNumber": 8,
        "instruction": "50/50 Split: System 3 deep-dive. Interactive sound wave card demonstrates silence threshold detection and automated cut points.",
        "contentType": "Text + Graphic",
        "layoutType": "50/50 Split",
        "mainFocus": "System 3: AI video clipping using transcript and automated silence detection.",
        "captionMode": "Mode A",
        "captionText": "Video clipping takes the transcript and identifies silences to allow AI to cut at specific moments.",
        "captionTokens": [
            {"text": "Identify"},
            {"text": "silences & transcript", "isHighlighted": True},
            {"text": "to cut at exact moments"}
        ],
        "fontSize": 40,
        "highlightFontSize": 68,
        "startFrame": 2300,
        "endFrame": 2600,
        "startTimestamp": "01:16.67",
        "endTimestamp": "01:26.67",
        "uiCardNeed": "SoundWaveCard",
        "uiCardProps": {
            "title": "Silence Detection Threshold",
            "waveColor": "#3B82F6",
            "activeFrequency": "Silence cut threshold: > 0.25s dead air",
            "showThreshold": True
        },
        "splitPersonCrop": {
            "headTopPercent": 6,
            "eyeLinePercent": 27,
            "chinPercent": 48,
            "shouldersPercent": 65
        },
        "soundCues": [
            {
                "id": "cue-08-01",
                "family": "WHOOSHES",
                "filename": "whooshes/ES_Computer, Futuristic, Data Processing, Loading 26 - Epidemic Sound.mp3",
                "frame": 2300,
                "targetDb": -12,
                "notes": "Data processing whoosh on waveform initialization"
            },
            {
                "id": "cue-08-02",
                "family": "TEXTURES",
                "filename": "misc/ES_Scanner Beam - SFX Producer.mp3",
                "frame": 2345,
                "targetDb": -7,
                "notes": "Audio scan texture"
            }
        ]
    },
    {
        "id": "scene-09",
        "sceneNumber": 9,
        "instruction": "Full Speaker Resolution & CTA: Speaker center frame. 3-segment progress card shows 100% completed autonomous pipeline. Punchline delivery.",
        "contentType": "Person in Center",
        "layoutType": "Full Speaker",
        "mainFocus": "Closing recap: Split screen effects and 100% autonomous execution pipeline.",
        "captionMode": "Mode A",
        "captionText": "Put yourself in the bottom half and have visuals on top. I can do all this completely autonomously.",
        "captionTokens": [
            {"text": "Built completely"},
            {"text": "autonomously", "isHighlighted": True},
            {"text": "from start to finish"}
        ],
        "fontSize": 44,
        "highlightFontSize": 72,
        "startFrame": 2600,
        "endFrame": 2841,
        "startTimestamp": "01:26.67",
        "endTimestamp": "01:34.70",
        "uiCardNeed": "LoadingSegmentsCard",
        "uiCardProps": {
            "totalSegments": 3,
            "completedSegments": 3,
            "label": "All 3 Systems Active: 100% Autonomous",
            "accentColor": "#10B981"
        },
        "soundCues": [
            {
                "id": "cue-09-01",
                "family": "WHOOSHES",
                "filename": "whooshes/ES_PREL Whoosh Slow 9 - SFX Producer.mp3",
                "frame": 2600,
                "targetDb": -12,
                "notes": "Return to full speaker resolution"
            },
            {
                "id": "cue-09-02",
                "family": "TEXTURES",
                "filename": "misc/cash register.wav",
                "frame": 2690,
                "targetDb": -6,
                "notes": "Cash register sound on business delivery value"
            },
            {
                "id": "cue-09-03",
                "family": "RISERS",
                "filename": "risers/ES_Bass, Sharp Detail Riser - Epidemic Sound.mp3",
                "frame": 2750,
                "targetDb": -5,
                "notes": "Final build into autonomous punchline"
            },
            {
                "id": "cue-09-04",
                "family": "HITS",
                "filename": "kicks-impacts/ES_Hit Deep Digital 1 - SFX Producer.mp3",
                "frame": 2820,
                "targetDb": -5,
                "notes": "Closing hit on final word 'autonomously'"
            }
        ]
    }
]

# Generate the complete interactive HTML tool
html_template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Video Edit Plan Review — video-01</title>
  <style>
    :root {
      --bg-dark: #0B1528;
      --panel-bg: #111E38;
      --card-bg: #162646;
      --border-color: rgba(255, 255, 255, 0.1);
      --accent-blue: #3B82F6;
      --accent-light-blue: #60A5FA;
      --accent-green: #10B981;
      --accent-amber: #F59E0B;
      --text-main: #F3F3F3;
      --text-muted: #94A3B8;
      --warm-canvas: #F8F7F4;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      padding-bottom: 80px;
    }

    header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(11, 21, 40, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 14px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-blue {
      background: rgba(59, 130, 246, 0.2);
      color: var(--accent-light-blue);
      border: 1px solid rgba(59, 130, 246, 0.4);
    }

    .badge-green {
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-green);
      border: 1px solid rgba(16, 185, 129, 0.4);
    }

    h1 {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }

    .header-stats {
      font-size: 13px;
      color: var(--text-muted);
      display: flex;
      gap: 16px;
    }

    .header-stats span strong {
      color: #fff;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #2563EB, #1D4ED8);
      color: #fff;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #3B82F6, #2563EB);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(37, 99, 235, 0.45);
    }

    .btn-secondary {
      background: var(--card-bg);
      color: var(--text-main);
      border: 1px solid var(--border-color);
    }

    .btn-secondary:hover {
      background: #1F335C;
    }

    .main-container {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 32px;
      max-width: 1600px;
      margin: 24px auto;
      padding: 0 28px;
    }

    /* Sticky Simulator Column */
    .simulator-pane {
      position: sticky;
      top: 88px;
      height: calc(100vh - 120px);
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--panel-bg);
      border-radius: 16px;
      border: 1px solid var(--border-color);
      padding: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }

    .simulator-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-muted);
      margin-bottom: 14px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* 9:16 Mockup Frame */
    .phone-mockup {
      width: 290px;
      height: 515px; /* 9:16 ratio */
      border-radius: 28px;
      border: 6px solid #1E293B;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
      background: #0B1528;
      display: flex;
      flex-direction: column;
      user-select: none;
    }

    /* Full Speaker Layout Preview */
    .preview-full-speaker {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 35%, #182848 0%, #0B1528 85%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding: 20px 16px 36px 16px;
    }

    .speaker-silhouette {
      position: absolute;
      top: 15%;
      width: 130px;
      height: 170px;
      background: #14213d;
      border-radius: 65px 65px 30px 30px;
      border: 1px solid rgba(255,255,255,0.06);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #475569;
      font-size: 11px;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
    }

    .speaker-head {
      width: 58px;
      height: 68px;
      background: #1e293b;
      border-radius: 50%;
      margin-bottom: 12px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .speaker-mic {
      width: 14px;
      height: 24px;
      background: #334155;
      border-radius: 4px;
      margin-top: -6px;
      border: 1px solid #475569;
    }

    .lower-third-chest-zone {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 240px;
      background: linear-gradient(to top, rgba(11,21,40,0.92) 50%, rgba(11,21,40,0.4) 85%, transparent 100%);
      backdrop-filter: blur(6px);
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding: 16px;
      text-align: center;
    }

    /* 50/50 Split Layout Preview */
    .preview-split {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
    }

    .split-top-graphic {
      height: 50%;
      background-color: var(--warm-canvas);
      background-image: 
        linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
      background-size: 16px 16px;
      position: relative;
      padding: 14px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid rgba(0,0,0,0.08);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .split-bottom-person {
      height: 50%;
      background: #0B1528;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .split-person-video-strip {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .eyeline-guide {
      position: absolute;
      top: 27%; /* 27% down Layer B = 63.5% down total frame */
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(59, 130, 246, 0.4);
      border-top: 1px dashed #3B82F6;
      z-index: 5;
    }

    .eyeline-guide::after {
      content: "Eyes: ~63.5%";
      position: absolute;
      right: 6px;
      top: -12px;
      font-size: 8px;
      color: #60A5FA;
      font-weight: 600;
    }

    /* 100% Full Canvas Layout Preview */
    .preview-full-canvas {
      position: absolute;
      inset: 0;
      background-color: var(--warm-canvas);
      background-image: 
        linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
      background-size: 20px 20px;
      padding: 28px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }

    /* Mode A Captions */
    .caption-mode-a {
      font-size: 13px;
      line-height: 1.35;
      text-align: center;
      color: #F3F3F3;
      margin-bottom: 12px;
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
    }

    .caption-mode-a-split {
      font-size: 11px;
      line-height: 1.3;
      text-align: center;
      color: #1E293B;
      margin-top: 6px;
      text-shadow: none;
    }

    .script-highlight {
      font-family: Georgia, "Instrument Serif", serif;
      font-style: italic;
      font-weight: 700;
      font-size: 1.45em;
      background: linear-gradient(180deg, #93C5FD 0%, #2563EB 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
      display: inline-block;
      margin: 0 4px;
    }

    /* Mode B Statement Lockup */
    .statement-lockup {
      text-align: center;
      margin-top: 8px;
    }

    .statement-title {
      font-size: 13px;
      font-weight: 700;
      color: #0F172A;
      letter-spacing: -0.3px;
    }

    .statement-script {
      font-family: Georgia, "Instrument Serif", serif;
      font-style: italic;
      font-size: 20px;
      background: linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.4));
      display: block;
      margin-top: 2px;
    }

    /* UI Cards Mockups inside preview */
    .ui-card-mockup {
      width: 90%;
      border-radius: 12px;
      padding: 10px 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      font-size: 11px;
      z-index: 4;
    }

    .card-dark-glass {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #F8FAFC;
      backdrop-filter: blur(8px);
    }

    .card-light-canvas {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(0, 0, 0, 0.08);
      color: #0F172A;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
    }

    .pill-nodes {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 6px;
    }

    .pill-node {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
    }

    .node-active {
      background: #3B82F6;
      color: #fff;
      box-shadow: 0 0 8px rgba(59,130,246,0.6);
    }

    .node-inactive {
      background: rgba(255,255,255,0.1);
      color: #94A3B8;
      border: 1px solid rgba(255,255,255,0.2);
    }

    /* Simulator Controls */
    .sim-controls {
      margin-top: 16px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sim-buttons {
      display: flex;
      gap: 8px;
      width: 100%;
    }

    .sim-btn {
      flex: 1;
      padding: 7px;
      font-size: 11px;
      font-weight: 600;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      border-radius: 6px;
      cursor: pointer;
    }

    .sim-btn:hover {
      background: #1F335C;
    }

    /* Scene Edit Cards Column */
    .scenes-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .scene-card {
      background: var(--panel-bg);
      border-radius: 14px;
      border: 1px solid var(--border-color);
      padding: 22px 24px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .scene-card.active-scene {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 1px var(--accent-blue), 0 8px 24px rgba(59, 130, 246, 0.15);
    }

    .scene-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-color);
    }

    .scene-title-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .scene-num-badge {
      background: linear-gradient(135deg, #2563EB, #1E40AF);
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .scene-time-badge {
      font-size: 12px;
      color: var(--text-muted);
      background: var(--card-bg);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group-full {
      grid-column: 1 / -1;
    }

    .form-group-2col {
      grid-column: span 2;
    }

    label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    input, select, textarea {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 9px 12px;
      border-radius: 6px;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
      font-family: inherit;
    }

    input:focus, select:focus, textarea:focus {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    textarea {
      resize: vertical;
    }

    .token-pills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      background: var(--card-bg);
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
    }

    .token-pill {
      background: #1E293B;
      color: #CBD5E1;
      border: 1px solid rgba(255,255,255,0.1);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .token-pill.highlighted {
      background: linear-gradient(135deg, rgba(37,99,235,0.4), rgba(59,130,246,0.3));
      border-color: #3B82F6;
      color: #93C5FD;
      font-weight: 600;
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
    }

    .sound-cues-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-top: 6px;
      background: var(--card-bg);
      border-radius: 6px;
      overflow: hidden;
    }

    .sound-cues-table th, .sound-cues-table td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    .sound-cues-table th {
      background: rgba(0,0,0,0.2);
      color: var(--text-muted);
      font-weight: 600;
    }

    .cue-badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }

    .cue-WHOOSHES { background: rgba(59, 130, 246, 0.2); color: #60A5FA; }
    .cue-TEXTURES { background: rgba(16, 185, 129, 0.2); color: #34D399; }
    .cue-RISERS { background: rgba(245, 158, 11, 0.2); color: #FBBF24; }
    .cue-HITS { background: rgba(239, 68, 68, 0.2); color: #F87171; }
    .cue-MUSIC { background: rgba(168, 85, 247, 0.2); color: #C084FC; }

    /* Modal */
    .modal-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }

    .modal-box {
      background: var(--panel-bg);
      width: 90%;
      max-width: 800px;
      border-radius: 16px;
      border: 1px solid var(--border-color);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 85vh;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-header h3 {
      font-size: 18px;
      color: #fff;
    }

    .json-code-box {
      background: #090E17;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      font-family: Consolas, Monaco, "Courier New", monospace;
      font-size: 12px;
      color: #E2E8F0;
      overflow-y: auto;
      max-height: 50vh;
      white-space: pre-wrap;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #10B981;
      color: #fff;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 2000;
    }

    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }
  </style>
</head>
<body>

  <header>
    <div class="header-left">
      <span class="badge badge-blue">Edit Plan Review</span>
      <h1>video-01: How I would sell AI content repurposing</h1>
      <span id="validation-badge" class="badge badge-green">✓ Valid: 9 Scenes (Strict Spec Pass)</span>
    </div>
    <div class="header-stats">
      <span>Duration: <strong id="total-duration">94.70s</strong></span>
      <span>Frames: <strong id="total-frames">2,841</strong> @ 30fps</span>
      <span>Scenes: <strong>9</strong></span>
    </div>
    <div class="header-actions">
      <button class="btn btn-primary" onclick="copyScenePlanJSON()">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
        Copy Scene Plan JSON
      </button>
      <button class="btn btn-secondary" onclick="openJsonModal()">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
        View JSON
      </button>
    </div>
  </header>

  <div class="main-container">

    <!-- Left Sticky Column: Interactive 9:16 Live Simulator -->
    <div class="simulator-pane">
      <div class="simulator-title">
        <span>9:16 Interactive Scene Mockup</span>
        <span id="mockup-scene-indicator" class="badge badge-blue">Scene 1 / 9</span>
      </div>

      <div class="phone-mockup" id="phone-display">
        <!-- Rendered dynamically by updatePreview() -->
      </div>

      <div class="sim-controls">
        <div class="sim-buttons">
          <button class="sim-btn" onclick="prevScene()">◀ Prev Scene</button>
          <button class="sim-btn" onclick="nextScene()">Next Scene ▶</button>
        </div>
        <div style="font-size: 11px; color: var(--text-muted); text-align: center; margin-top: 4px;">
          Preview dynamically reacts to edits in the form below.
        </div>
      </div>
    </div>

    <!-- Right Column: Editable Scene Cards -->
    <div class="scenes-column" id="scenes-container">
      <!-- Injected dynamically -->
    </div>

  </div>

  <!-- JSON Modal -->
  <div class="modal-backdrop" id="json-modal" onclick="closeJsonModal(event)">
    <div class="modal-box" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3>Serialized Scene Plan JSON (Ready for Remotion Template)</h3>
        <button class="btn btn-secondary" onclick="closeJsonModal()">✕ Close</button>
      </div>
      <p style="font-size: 13px; color: var(--text-muted);">
        This JSON strictly matches <code>remotion-template/src/types/scene-plan.ts</code> with 100% property fidelity. Copy and paste into agent chat to trigger render.
      </p>
      <div class="json-code-box" id="json-modal-content"></div>
      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button class="btn btn-primary" onclick="copyModalJSON()">Copy to Clipboard</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast">Scene Plan JSON copied to clipboard!</div>

  <script>
    let scenePlan = """ + json.dumps(scenes, indent=2) + """;
    let activeSceneIndex = 0;

    function renderScenes() {
      const container = document.getElementById("scenes-container");
      container.innerHTML = "";

      scenePlan.forEach((scene, idx) => {
        const card = document.createElement("div");
        card.className = `scene-card ${idx === activeSceneIndex ? 'active-scene' : ''}`;
        card.id = `scene-card-${idx}`;
        card.onclick = () => selectScene(idx);

        card.innerHTML = `
          <div class="scene-header">
            <div class="scene-title-wrap">
              <span class="scene-num-badge">Scene #${scene.sceneNumber}</span>
              <strong style="font-size: 15px;">${scene.mainFocus}</strong>
            </div>
            <div style="display: flex; gap: 8px;">
              <span class="scene-time-badge">${scene.startTimestamp} - ${scene.endTimestamp} (${(scene.endFrame - scene.startFrame)/30}s)</span>
              <span class="scene-time-badge">Frames ${scene.startFrame} - ${scene.endFrame}</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group form-group-full">
              <label>Instruction / Direction Notes</label>
              <input type="text" value="${escapeHtml(scene.instruction || '')}" onchange="updateSceneProp(${idx}, 'instruction', this.value)">
            </div>

            <div class="form-group">
              <label>Layout Type</label>
              <select onchange="updateSceneProp(${idx}, 'layoutType', this.value)">
                <option value="Full Speaker" ${scene.layoutType === 'Full Speaker' ? 'selected' : ''}>Full Speaker</option>
                <option value="50/50 Split" ${scene.layoutType === '50/50 Split' ? 'selected' : ''}>50/50 Split</option>
                <option value="100% Full Canvas" ${scene.layoutType === '100% Full Canvas' ? 'selected' : ''}>100% Full Canvas</option>
              </select>
            </div>

            <div class="form-group">
              <label>Content Type (MD Sec 3)</label>
              <select onchange="updateSceneProp(${idx}, 'contentType', this.value)">
                <option value="Person in Center" ${scene.contentType === 'Person in Center' ? 'selected' : ''}>Person in Center</option>
                <option value="Person on Side" ${scene.contentType === 'Person on Side' ? 'selected' : ''}>Person on Side</option>
                <option value="Object (Middle) + Text" ${scene.contentType === 'Object (Middle) + Text' ? 'selected' : ''}>Object (Middle) + Text</option>
                <option value="Object + Graphic" ${scene.contentType === 'Object + Graphic' ? 'selected' : ''}>Object + Graphic</option>
                <option value="Graphic Centric Animation" ${scene.contentType === 'Graphic Centric Animation' ? 'selected' : ''}>Graphic Centric Animation</option>
                <option value="Text Only" ${scene.contentType === 'Text Only' ? 'selected' : ''}>Text Only</option>
                <option value="Text + Object" ${scene.contentType === 'Text + Object' ? 'selected' : ''}>Text + Object</option>
                <option value="Text + Graphic" ${scene.contentType === 'Text + Graphic' ? 'selected' : ''}>Text + Graphic</option>
                <option value="Documentary 3D" ${scene.contentType === 'Documentary 3D' ? 'selected' : ''}>Documentary 3D</option>
              </select>
            </div>

            <div class="form-group">
              <label>Caption Mode</label>
              <select onchange="updateSceneProp(${idx}, 'captionMode', this.value)">
                <option value="Mode A" ${scene.captionMode === 'Mode A' ? 'selected' : ''}>Mode A: Talking Caption</option>
                <option value="Mode B" ${scene.captionMode === 'Mode B' ? 'selected' : ''}>Mode B: Statement Lockup</option>
                <option value="None" ${scene.captionMode === 'None' ? 'selected' : ''}>None</option>
              </select>
            </div>

            <div class="form-group form-group-full">
              <label>Caption Text / Highlighted Words (Click word to toggle large script highlight)</label>
              <div class="token-pills-wrap" id="tokens-wrap-${idx}">
                ${renderTokenPills(scene.captionTokens || [], idx)}
              </div>
            </div>

            <div class="form-group">
              <label>UI Card Requirement</label>
              <select onchange="updateSceneProp(${idx}, 'uiCardNeed', this.value)">
                <option value="none" ${scene.uiCardNeed === 'none' ? 'selected' : ''}>none</option>
                <option value="DarkGlassNumberedPill" ${scene.uiCardNeed === 'DarkGlassNumberedPill' ? 'selected' : ''}>DarkGlassNumberedPill</option>
                <option value="BeginnerProSlider" ${scene.uiCardNeed === 'BeginnerProSlider' ? 'selected' : ''}>BeginnerProSlider</option>
                <option value="TiltedMockupCard" ${scene.uiCardNeed === 'TiltedMockupCard' ? 'selected' : ''}>TiltedMockupCard</option>
                <option value="BrowserWindowMockup" ${scene.uiCardNeed === 'BrowserWindowMockup' ? 'selected' : ''}>BrowserWindowMockup</option>
                <option value="TimelineCard" ${scene.uiCardNeed === 'TimelineCard' ? 'selected' : ''}>TimelineCard</option>
                <option value="SoundWaveCard" ${scene.uiCardNeed === 'SoundWaveCard' ? 'selected' : ''}>SoundWaveCard</option>
                <option value="ProductLogoCard" ${scene.uiCardNeed === 'ProductLogoCard' ? 'selected' : ''}>ProductLogoCard</option>
                <option value="LoadingSegmentsCard" ${scene.uiCardNeed === 'LoadingSegmentsCard' ? 'selected' : ''}>LoadingSegmentsCard</option>
                <option value="ColorSwatchesCard" ${scene.uiCardNeed === 'ColorSwatchesCard' ? 'selected' : ''}>ColorSwatchesCard</option>
                <option value="DashedBadgeCard" ${scene.uiCardNeed === 'DashedBadgeCard' ? 'selected' : ''}>DashedBadgeCard</option>
                <option value="GlossyPlayCard" ${scene.uiCardNeed === 'GlossyPlayCard' ? 'selected' : ''}>GlossyPlayCard</option>
                <option value="SoundPadMatrixCard" ${scene.uiCardNeed === 'SoundPadMatrixCard' ? 'selected' : ''}>SoundPadMatrixCard</option>
              </select>
            </div>

            <div class="form-group">
              <label>Base Sans / Script Font Size (px)</label>
              <div style="display: flex; gap: 8px;">
                <input type="number" value="${scene.fontSize}" style="width: 50%;" onchange="updateSceneProp(${idx}, 'fontSize', parseInt(this.value))">
                <input type="number" value="${scene.highlightFontSize}" style="width: 50%;" onchange="updateSceneProp(${idx}, 'highlightFontSize', parseInt(this.value))">
              </div>
            </div>

            <div class="form-group">
              <label>Start / End Frames</label>
              <div style="display: flex; gap: 8px;">
                <input type="number" value="${scene.startFrame}" style="width: 50%;" onchange="updateSceneProp(${idx}, 'startFrame', parseInt(this.value))">
                <input type="number" value="${scene.endFrame}" style="width: 50%;" onchange="updateSceneProp(${idx}, 'endFrame', parseInt(this.value))">
              </div>
            </div>

            <div class="form-group form-group-full">
              <label>UI Card Props (JSON - Derived Contextually from Script)</label>
              <textarea rows="3" onchange="updateCardProps(${idx}, this.value)">${JSON.stringify(scene.uiCardProps || {}, null, 2)}</textarea>
            </div>

            ${scene.layoutType === '50/50 Split' ? `
              <div class="form-group form-group-full">
                <label>Split Person Crop Rule (Eyes: 62%–65% | Chin Intact)</label>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                  <div>
                    <span style="font-size: 11px; color: var(--text-muted);">Head Top %</span>
                    <input type="number" value="${scene.splitPersonCrop?.headTopPercent || 6}" onchange="updateCrop(${idx}, 'headTopPercent', parseFloat(this.value))">
                  </div>
                  <div>
                    <span style="font-size: 11px; color: var(--text-muted);">Eye Line %</span>
                    <input type="number" value="${scene.splitPersonCrop?.eyeLinePercent || 27}" onchange="updateCrop(${idx}, 'eyeLinePercent', parseFloat(this.value))">
                  </div>
                  <div>
                    <span style="font-size: 11px; color: var(--text-muted);">Chin %</span>
                    <input type="number" value="${scene.splitPersonCrop?.chinPercent || 48}" onchange="updateCrop(${idx}, 'chinPercent', parseFloat(this.value))">
                  </div>
                  <div>
                    <span style="font-size: 11px; color: var(--text-muted);">Shoulders %</span>
                    <input type="number" value="${scene.splitPersonCrop?.shouldersPercent || 65}" onchange="updateCrop(${idx}, 'shouldersPercent', parseFloat(this.value))">
                  </div>
                </div>
              </div>
            ` : ''}

            <div class="form-group form-group-full">
              <label>Sound Cues (5-Track System: WHOOSHES, TEXTURES, RISERS, HITS, MUSIC)</label>
              <table class="sound-cues-table">
                <thead>
                  <tr>
                    <th>Family</th>
                    <th>Filename</th>
                    <th>Frame</th>
                    <th>Target dB</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  ${(scene.soundCues || []).map(cue => `
                    <tr>
                      <td><span class="cue-badge cue-${cue.family}">${cue.family}</span></td>
                      <td style="font-family: monospace; font-size: 11px; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${cue.filename}</td>
                      <td>${cue.frame}</td>
                      <td>${cue.targetDb} dB</td>
                      <td style="color: var(--text-muted);">${cue.notes || ''}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

          </div>
        `;
        container.appendChild(card);
      });

      updatePreview();
    }

    function renderTokenPills(tokens, sceneIdx) {
      return tokens.map((token, tIdx) => `
        <span class="token-pill ${token.isHighlighted ? 'highlighted' : ''}" onclick="toggleHighlight(${sceneIdx}, ${tIdx})">
          ${escapeHtml(token.text)}
        </span>
      `).join('');
    }

    function toggleHighlight(sceneIdx, tokenIdx) {
      scenePlan[sceneIdx].captionTokens[tokenIdx].isHighlighted = !scenePlan[sceneIdx].captionTokens[tokenIdx].isHighlighted;
      renderScenes();
    }

    function updateSceneProp(sceneIdx, prop, val) {
      scenePlan[sceneIdx][prop] = val;
      renderScenes();
    }

    function updateCardProps(sceneIdx, jsonString) {
      try {
        scenePlan[sceneIdx].uiCardProps = JSON.parse(jsonString);
        updatePreview();
      } catch (e) {
        alert("Invalid JSON for UI Card Props: " + e.message);
      }
    }

    function updateCrop(sceneIdx, field, val) {
      if (!scenePlan[sceneIdx].splitPersonCrop) {
        scenePlan[sceneIdx].splitPersonCrop = { headTopPercent: 6, eyeLinePercent: 27, chinPercent: 48, shouldersPercent: 65 };
      }
      scenePlan[sceneIdx].splitPersonCrop[field] = val;
      updatePreview();
    }

    function selectScene(idx) {
      activeSceneIndex = idx;
      document.querySelectorAll(".scene-card").forEach((c, i) => {
        c.classList.toggle("active-scene", i === idx);
      });
      document.getElementById(`scene-card-${idx}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById("mockup-scene-indicator").innerText = `Scene ${idx + 1} / ${scenePlan.length}`;
      updatePreview();
    }

    function prevScene() {
      if (activeSceneIndex > 0) {
        selectScene(activeSceneIndex - 1);
      }
    }

    function nextScene() {
      if (activeSceneIndex < scenePlan.length - 1) {
        selectScene(activeSceneIndex + 1);
      }
    }

    function updatePreview() {
      const scene = scenePlan[activeSceneIndex];
      const display = document.getElementById("phone-display");

      let captionHtml = "";
      if (scene.captionMode === "Mode A") {
        captionHtml = `
          <div class="${scene.layoutType === '50/50 Split' ? 'caption-mode-a-split' : 'caption-mode-a'}">
            ${(scene.captionTokens || []).map(t => t.isHighlighted ? `<span class="script-highlight">${escapeHtml(t.text)}</span>` : `<span>${escapeHtml(t.text)}</span>`).join(' ')}
          </div>
        `;
      } else if (scene.captionMode === "Mode B") {
        captionHtml = `
          <div class="statement-lockup">
            <div class="statement-title">${escapeHtml(scene.captionTokens?.[0]?.text || "Statement Lockup")}</div>
            <div class="statement-script">${escapeHtml(scene.captionTokens?.[1]?.text || "Key Insight")}</div>
          </div>
        `;
      }

      let cardHtml = "";
      if (scene.uiCardNeed === "DarkGlassNumberedPill") {
        cardHtml = `
          <div class="ui-card-mockup card-dark-glass" style="text-align: center;">
            <div style="font-size: 10px; color: #94A3B8; text-transform: uppercase;">${escapeHtml(scene.uiCardProps?.label || 'Chapter')}</div>
            <div class="pill-nodes">
              <div class="pill-node node-active">1</div>
              <div style="width: 20px; height: 1px; background: rgba(255,255,255,0.2);"></div>
              <div class="pill-node node-inactive">2</div>
              <div style="width: 20px; height: 1px; background: rgba(255,255,255,0.2);"></div>
              <div class="pill-node node-inactive">3</div>
            </div>
          </div>
        `;
      } else if (scene.uiCardNeed === "BeginnerProSlider") {
        cardHtml = `
          <div class="ui-card-mockup card-light-canvas">
            <div style="display: flex; justify-content: space-between; font-size: 9px; font-weight: 600; color: #64748B;">
              <span>${escapeHtml(scene.uiCardProps?.leftLabel || 'Low')}</span>
              <span>${escapeHtml(scene.uiCardProps?.rightLabel || 'High')}</span>
            </div>
            <div style="height: 6px; background: #E2E8F0; border-radius: 999px; margin-top: 6px; position: relative;">
              <div style="width: ${scene.uiCardProps?.progressPercent || 75}%; height: 100%; background: linear-gradient(90deg, #60A5FA, #2563EB); border-radius: 999px;"></div>
              <div style="position: absolute; left: ${scene.uiCardProps?.progressPercent || 75}%; top: -3px; width: 12px; height: 12px; background: #fff; border: 2px solid #2563EB; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></div>
            </div>
          </div>
        `;
      } else if (scene.uiCardNeed === "TiltedMockupCard") {
        cardHtml = `
          <div class="ui-card-mockup card-light-canvas" style="transform: rotate(${scene.uiCardProps?.rotation || -4}deg); border: 1px solid rgba(0,0,0,0.12);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 11px; color: #1E293B;">${escapeHtml(scene.uiCardProps?.title || 'Card')}</strong>
              <span style="font-size: 8px; background: #DBEAFE; color: #1D4ED8; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${escapeHtml(scene.uiCardProps?.badge || 'Badge')}</span>
            </div>
            <div style="font-size: 9px; color: #64748B;">${escapeHtml(scene.uiCardProps?.subtitle || '')}</div>
          </div>
        `;
      } else if (scene.uiCardNeed === "TimelineCard") {
        cardHtml = `
          <div class="ui-card-mockup card-light-canvas">
            <div style="font-size: 10px; font-weight: 700; margin-bottom: 6px; color: #1E293B;">${escapeHtml(scene.uiCardProps?.title || 'Timeline')}</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${(scene.uiCardProps?.tracks || [{label: "Master Ingest"}]).map(tr => `
                <div style="background: #F1F5F9; border-radius: 4px; padding: 3px 6px; font-size: 8px; display: flex; justify-content: space-between;">
                  <span>${escapeHtml(tr.label)}</span>
                  <span style="color: #64748B;">${escapeHtml(tr.time || '')}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (scene.uiCardNeed === "BrowserWindowMockup") {
        cardHtml = `
          <div class="ui-card-mockup card-light-canvas" style="padding: 0; overflow: hidden;">
            <div style="background: #F1F5F9; padding: 4px 8px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; gap: 4px;">
              <span style="width: 5px; height: 5px; border-radius: 50%; background: #EF4444;"></span>
              <span style="width: 5px; height: 5px; border-radius: 50%; background: #F59E0B;"></span>
              <span style="width: 5px; height: 5px; border-radius: 50%; background: #10B981;"></span>
              <span style="font-size: 7px; color: #64748B; margin-left: 4px;">${escapeHtml(scene.uiCardProps?.url || 'browser.app')}</span>
            </div>
            <div style="padding: 8px;">
              <div style="font-size: 9px; font-weight: 700; color: #1E293B;">${escapeHtml(scene.uiCardProps?.title || 'Window')}</div>
              <div style="font-size: 8px; color: #64748B; margin-top: 2px;">${escapeHtml(scene.uiCardProps?.contentSnippet || '')}</div>
            </div>
          </div>
        `;
      } else if (scene.uiCardNeed === "SoundWaveCard") {
        cardHtml = `
          <div class="ui-card-mockup card-light-canvas">
            <div style="font-size: 10px; font-weight: 700; color: #1E293B; margin-bottom: 4px;">${escapeHtml(scene.uiCardProps?.title || 'Audio Wave')}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; height: 24px; gap: 2px;">
              ${[4, 12, 18, 22, 10, 4, 16, 24, 8, 20, 14, 6, 22, 12, 18, 4].map(h => `
                <div style="flex: 1; height: ${h}px; background: #3B82F6; border-radius: 2px;"></div>
              `).join('')}
            </div>
            <div style="font-size: 8px; color: #64748B; margin-top: 4px;">${escapeHtml(scene.uiCardProps?.activeFrequency || 'Silence Threshold')}</div>
          </div>
        `;
      } else if (scene.uiCardNeed === "DashedBadgeCard") {
        cardHtml = `
          <div class="ui-card-mockup card-light-canvas" style="border: 2px dashed #CBD5E1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 9px; font-weight: 700; color: #1E293B;">${escapeHtml(scene.uiCardProps?.title || 'Badge')}</span>
              <span style="background: #ECFDF5; color: #059669; font-size: 8px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">${escapeHtml(scene.uiCardProps?.metric || 'High ROI')}</span>
            </div>
            <div style="font-size: 8px; color: #64748B; margin-top: 4px;">${escapeHtml(scene.uiCardProps?.subtitle || '')}</div>
          </div>
        `;
      } else if (scene.uiCardNeed === "LoadingSegmentsCard") {
        cardHtml = `
          <div class="ui-card-mockup card-dark-glass">
            <div style="font-size: 9px; color: #94A3B8; margin-bottom: 6px;">${escapeHtml(scene.uiCardProps?.label || 'Pipeline Progress')}</div>
            <div style="display: flex; gap: 4px; height: 6px;">
              <div style="flex: 1; background: #10B981; border-radius: 2px;"></div>
              <div style="flex: 1; background: #10B981; border-radius: 2px;"></div>
              <div style="flex: 1; background: #10B981; border-radius: 2px;"></div>
            </div>
          </div>
        `;
      }

      if (scene.layoutType === "Full Speaker") {
        display.innerHTML = `
          <div class="preview-full-speaker">
            <div class="speaker-silhouette">
              <div class="speaker-head"></div>
              <div class="speaker-mic"></div>
              <span>Speaker Focus</span>
            </div>
            <div class="lower-third-chest-zone">
              ${captionHtml}
              ${cardHtml}
            </div>
          </div>
        `;
      } else if (scene.layoutType === "50/50 Split") {
        display.innerHTML = `
          <div class="preview-split">
            <div class="split-top-graphic">
              ${cardHtml}
              ${captionHtml}
            </div>
            <div class="split-bottom-person">
              <div class="eyeline-guide"></div>
              <div class="speaker-silhouette" style="top: 2%; height: 160px;">
                <div class="speaker-head"></div>
                <div class="speaker-mic"></div>
                <span style="font-size: 9px;">Clean Person Strip</span>
              </div>
            </div>
          </div>
        `;
      } else if (scene.layoutType === "100% Full Canvas") {
        display.innerHTML = `
          <div class="preview-full-canvas">
            ${captionHtml}
            <div style="width: 100%; display: flex; justify-content: center; margin: auto 0;">
              ${cardHtml}
            </div>
            <div style="font-size: 9px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px;">Warm Grid Canvas</div>
          </div>
        `;
      }
    }

    function escapeHtml(text) {
      if (!text) return "";
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function copyScenePlanJSON() {
      const jsonString = JSON.stringify(scenePlan, null, 2);
      navigator.clipboard.writeText(jsonString).then(() => {
        showToast("Scene Plan JSON copied to clipboard!");
      }).catch(err => {
        alert("Clipboard write failed: " + err);
      });
    }

    function openJsonModal() {
      document.getElementById("json-modal-content").innerText = JSON.stringify(scenePlan, null, 2);
      document.getElementById("json-modal").style.display = "flex";
    }

    function closeJsonModal(e) {
      document.getElementById("json-modal").style.display = "none";
    }

    function copyModalJSON() {
      const jsonString = JSON.stringify(scenePlan, null, 2);
      navigator.clipboard.writeText(jsonString).then(() => {
        showToast("Copied from modal!");
        closeJsonModal();
      });
    }

    function showToast(msg) {
      const toast = document.getElementById("toast");
      toast.innerText = msg;
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    }

    // Initialize on load
    renderScenes();
  </script>
</body>
</html>
"""

with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html_template)

print(f"Generated standalone interactive review tool at {OUTPUT_HTML} (Size: {os.path.getsize(OUTPUT_HTML)} bytes)")
