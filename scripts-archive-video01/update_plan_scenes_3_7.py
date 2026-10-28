import json

with open('video-01/scene-plan-3.json', 'r', encoding='utf-8') as f:
    plan = json.load(f)

new_plan = []
for s in plan:
    if s['id'] == 'scene-03':
        # Split into scene-03-a and scene-03-b
        s3a = {
            'id': 'scene-03-a',
            'sceneNumber': 3,
            'instruction': '100% Full Canvas: Statement lockup in Mode B on warm grid. Tilted blueprint card introduces the AI content blueprint.',
            'contentType': 'Object (Middle) + Text',
            'layoutType': '100% Full Canvas',
            'mainFocus': 'Direct thesis statement lockup introducing the AI content blueprint.',
            'captionMode': 'Mode B',
            'captionText': 'The Content Engine: Simple. Scalable. Autonomous.',
            'captionTokens': [
                {'text': 'The Content Engine'},
                {'text': 'Simple. Scalable. Autonomous.', 'isHighlighted': True}
            ],
            'canvasVariant': 'warm-grid',
            'fontSize': 52,
            'highlightFontSize': 84,
            'startFrame': 520,
            'endFrame': 600,
            'startTimestamp': '00:17.33',
            'endTimestamp': '00:20.00',
            'uiCardNeed': 'TiltedMockupCard',
            'uiCardProps': {
                'title': 'Offer Blueprint',
                'badge': 'AI System',
                'subtitle': '1 Long-form Video -> Distributed Content',
                'rotation': -4
            },
            'soundCues': [
                {
                    'id': 'cue-03-01',
                    'family': 'WHOOSHES',
                    'filename': 'whooshes/ES_PREL Whoosh Dark 10 - SFX Producer.mp3',
                    'frame': 520,
                    'targetDb': -12,
                    'notes': 'Transition from split to full canvas'
                },
                {
                    'id': 'cue-03-02',
                    'family': 'TEXTURES',
                    'filename': 'misc/Eiravaein Works - Start Select Vol 1- Deep Ping Notification Reverb.wav',
                    'frame': 540,
                    'targetDb': -6,
                    'notes': 'Deep ping on tilted blueprint appearance'
                }
            ],
            'uiCardStartFrame': 525,
            'uiCardEndFrame': 600,
            'sourceReference': {
                'fileName': None,
                'showStartFrame': None,
                'showEndFrame': None,
                'layout': None,
                'notes': 'No user-supplied source media provided for video-01'
            }
        }
        s3b = {
            'id': 'scene-03-b',
            'sceneNumber': 3,
            'instruction': 'Full Speaker: Speaker returns to camera addressing core offer question and delivering direct answer (Simple, straightforward).',
            'contentType': 'Person in Center',
            'layoutType': 'Full Speaker',
            'speakerSrc': None,
            'mainFocus': 'Speaker returns addressing the offer creation question.',
            'captionMode': 'Mode A',
            'captionText': 'How would you create an offer for content repurposing using AI? Simple, straightforward.',
            'fontSize': 52,
            'highlightFontSize': 84,
            'startFrame': 600,
            'endFrame': 750,
            'startTimestamp': '00:20.00',
            'endTimestamp': '00:25.00',
            'uiCardNeed': 'none',
            'captionChunks': [
                {
                    'startFrame': 600,
                    'endFrame': 611,
                    'tokens': [
                        {'text': 'How', 'isHighlighted': False},
                        {'text': 'would', 'isHighlighted': False},
                        {'text': 'you', 'isHighlighted': False}
                    ]
                },
                {
                    'startFrame': 611,
                    'endFrame': 632,
                    'tokens': [
                        {'text': 'create', 'isHighlighted': False},
                        {'text': 'an', 'isHighlighted': False},
                        {'text': 'offer', 'isHighlighted': True}
                    ]
                },
                {
                    'startFrame': 632,
                    'endFrame': 679,
                    'tokens': [
                        {'text': 'for', 'isHighlighted': False},
                        {'text': 'content', 'isHighlighted': False},
                        {'text': 'repurposing', 'isHighlighted': True}
                    ]
                },
                {
                    'startFrame': 679,
                    'endFrame': 713,
                    'tokens': [
                        {'text': 'using', 'isHighlighted': False},
                        {'text': 'AI?', 'isHighlighted': True}
                    ]
                },
                {
                    'startFrame': 721,
                    'endFrame': 750,
                    'tokens': [
                        {'text': 'Simple,', 'isHighlighted': False},
                        {'text': 'straightforward.', 'isHighlighted': True}
                    ]
                }
            ],
            'soundCues': [
                {
                    'id': 'cue-03-b-01',
                    'family': 'WHOOSHES',
                    'filename': 'whooshes/ES_PREL Whoosh Dark 3 - SFX Producer.mp3',
                    'frame': 600,
                    'targetDb': -12,
                    'notes': 'Transition back to speaker focus'
                },
                {
                    'id': 'cue-03-03',
                    'family': 'RISERS',
                    'filename': 'risers/ES_Riser Metallic - SFX Producer.mp3',
                    'frame': 660,
                    'targetDb': -5,
                    'notes': 'Metallic riser into platform breakdown'
                },
                {
                    'id': 'cue-03-04',
                    'family': 'HITS',
                    'filename': 'kicks-impacts/ES_Short, Cinematic, Gritty - Epidemic Sound.mp3',
                    'frame': 750,
                    'targetDb': -5,
                    'notes': 'Hit landing the chapter shift'
                }
            ],
            'sourceReference': {
                'fileName': None,
                'showStartFrame': None,
                'showEndFrame': None,
                'layout': None,
                'notes': 'No user-supplied source media provided for video-01'
            }
        }
        new_plan.append(s3a)
        new_plan.append(s3b)
    elif s['id'] == 'scene-05':
        s_copy = dict(s)
        props = dict(s_copy.get('uiCardProps', {}))
        props['activeStepTimeline'] = [
            {'step': 1, 'startFrame': 1136, 'endFrame': 1183},
            {'step': 2, 'startFrame': 1188, 'endFrame': 1223},
            {'step': 3, 'startFrame': 1227, 'endFrame': 1290}
        ]
        s_copy['uiCardProps'] = props
        new_plan.append(s_copy)
    elif s['id'] == 'scene-07':
        s7a = {
            'id': 'scene-07-a',
            'sceneNumber': 7,
            'instruction': '100% Full Canvas: System 2 deep-dive. Dashed badge card with handwritten paper aesthetic displays high-ROI quote extraction (Hormozi format).',
            'contentType': 'Graphic Centric Animation',
            'layoutType': '100% Full Canvas',
            'mainFocus': 'System 2: Video to static image handwritten-style quote cards (Hormozi format).',
            'captionMode': 'Mode B',
            'captionText': 'System 02: High-ROI Visual Notes. Extract Quotes into Handwritten Paper Assets.',
            'captionTokens': [
                {'text': 'System 02: High-ROI Visual Notes'},
                {'text': 'Extracting Quotes into Paper Assets', 'isHighlighted': True}
            ],
            'canvasVariant': 'warm-grid',
            'fontSize': 52,
            'highlightFontSize': 84,
            'startFrame': 1850,
            'endFrame': 2103,
            'startTimestamp': '01:01.67',
            'endTimestamp': '01:10.10',
            'uiCardNeed': 'DashedBadgeCard',
            'uiCardProps': {
                'title': 'Handwritten Note Card',
                'metric': 'High ROI',
                'badgeText': 'Hormozi Style',
                'subtitle': 'Convert transcript moments into handwritten aesthetic carousels'
            },
            'soundCues': [
                {
                    'id': 'cue-07-01',
                    'family': 'WHOOSHES',
                    'filename': 'whooshes/Borrtex - Organized Student - Marker Pen Highlighting.wav',
                    'frame': 1850,
                    'targetDb': -10,
                    'notes': 'Marker pen highlight texture on quote reveal'
                },
                {
                    'id': 'cue-07-02',
                    'family': 'TEXTURES',
                    'filename': 'misc/Alberto Sueri - RPG Game - Money in Register.wav',
                    'frame': 1930,
                    'targetDb': -6,
                    'notes': 'High ROI register coin impact'
                }
            ],
            'uiCardStartFrame': 1865,
            'uiCardEndFrame': 2103,
            'sourceReference': {
                'fileName': None,
                'showStartFrame': None,
                'showEndFrame': None,
                'layout': None,
                'notes': 'No user-supplied source media provided for video-01'
            }
        }
        s7b = {
            'id': 'scene-07-b',
            'sceneNumber': 7,
            'instruction': 'Full Speaker: Speaker returns to camera discussing common agency practices (Hormozi/industry examples) and transitioning to System 3 video clipping.',
            'contentType': 'Person in Center',
            'layoutType': 'Full Speaker',
            'speakerSrc': None,
            'mainFocus': 'Speaker returns explaining industry adoption and transitioning to System 3.',
            'captionMode': 'Mode A',
            'captionText': "Or Mozi did this, a bunch of other guys do this. I mean it's like a very common thing to do. And then video clipping is where you basically take the transcript but also",
            'fontSize': 52,
            'highlightFontSize': 84,
            'startFrame': 2103,
            'endFrame': 2300,
            'startTimestamp': '01:10.10',
            'endTimestamp': '01:16.67',
            'uiCardNeed': 'none',
            'captionChunks': [
                {
                    'startFrame': 2110,
                    'endFrame': 2127,
                    'tokens': [
                        {'text': 'Or', 'isHighlighted': False},
                        {'text': 'Mozi', 'isHighlighted': True},
                        {'text': 'did', 'isHighlighted': False},
                        {'text': 'this,', 'isHighlighted': False}
                    ]
                },
                {
                    'startFrame': 2128,
                    'endFrame': 2145,
                    'tokens': [
                        {'text': 'a', 'isHighlighted': False},
                        {'text': 'bunch', 'isHighlighted': False},
                        {'text': 'of', 'isHighlighted': False},
                        {'text': 'other', 'isHighlighted': True},
                        {'text': 'guys', 'isHighlighted': False}
                    ]
                },
                {
                    'startFrame': 2145,
                    'endFrame': 2156,
                    'tokens': [
                        {'text': 'do', 'isHighlighted': False},
                        {'text': 'this.', 'isHighlighted': True}
                    ]
                },
                {
                    'startFrame': 2160,
                    'endFrame': 2172,
                    'tokens': [
                        {'text': 'I', 'isHighlighted': False},
                        {'text': 'mean', 'isHighlighted': False},
                        {'text': "it's", 'isHighlighted': False},
                        {'text': 'like', 'isHighlighted': False},
                        {'text': 'a', 'isHighlighted': False}
                    ]
                },
                {
                    'startFrame': 2172,
                    'endFrame': 2197,
                    'tokens': [
                        {'text': 'very', 'isHighlighted': False},
                        {'text': 'common', 'isHighlighted': True},
                        {'text': 'thing', 'isHighlighted': False},
                        {'text': 'to', 'isHighlighted': False},
                        {'text': 'do.', 'isHighlighted': False}
                    ]
                },
                {
                    'startFrame': 2205,
                    'endFrame': 2238,
                    'tokens': [
                        {'text': 'And', 'isHighlighted': False},
                        {'text': 'then', 'isHighlighted': False},
                        {'text': 'video', 'isHighlighted': True},
                        {'text': 'clipping', 'isHighlighted': False}
                    ]
                },
                {
                    'startFrame': 2238,
                    'endFrame': 2256,
                    'tokens': [
                        {'text': 'is', 'isHighlighted': False},
                        {'text': 'where', 'isHighlighted': True},
                        {'text': 'you', 'isHighlighted': False}
                    ]
                },
                {
                    'startFrame': 2256,
                    'endFrame': 2274,
                    'tokens': [
                        {'text': 'basically', 'isHighlighted': True},
                        {'text': 'take', 'isHighlighted': False},
                        {'text': 'the', 'isHighlighted': False}
                    ]
                },
                {
                    'startFrame': 2274,
                    'endFrame': 2300,
                    'tokens': [
                        {'text': 'transcript', 'isHighlighted': True},
                        {'text': 'but', 'isHighlighted': False},
                        {'text': 'also', 'isHighlighted': False}
                    ]
                }
            ],
            'soundCues': [
                {
                    'id': 'cue-07-b-01',
                    'family': 'WHOOSHES',
                    'filename': 'whooshes/ES_PREL Whoosh Dark 3 - SFX Producer.mp3',
                    'frame': 2103,
                    'targetDb': -12,
                    'notes': 'Transition back to speaker focus'
                },
                {
                    'id': 'cue-07-03',
                    'family': 'RISERS',
                    'filename': 'risers/ES_Riser Metallic - SFX Producer.mp3',
                    'frame': 2180,
                    'targetDb': -5,
                    'notes': 'Metallic riser into System 3'
                },
                {
                    'id': 'cue-07-04',
                    'family': 'HITS',
                    'filename': 'kicks-impacts/ES_LFE Hit 9 - SFX Producer.mp3',
                    'frame': 2300,
                    'targetDb': -5,
                    'notes': 'Sub hit landing System 3 Clipper'
                }
            ],
            'sourceReference': {
                'fileName': None,
                'showStartFrame': None,
                'showEndFrame': None,
                'layout': None,
                'notes': 'No user-supplied source media provided for video-01'
            }
        }
        new_plan.append(s7a)
        new_plan.append(s7b)
    else:
        new_plan.append(s)

with open('video-01/scene-plan-3.json', 'w', encoding='utf-8') as f:
    json.dump(new_plan, f, indent=2)
with open('video-01/scene-plan.json', 'w', encoding='utf-8') as f:
    json.dump(new_plan, f, indent=2)

print('Updated scene-plan-3.json and scene-plan.json successfully. Total scenes:', len(new_plan))
