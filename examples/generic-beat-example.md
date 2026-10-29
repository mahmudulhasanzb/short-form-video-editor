# Generic Beat Example

<!-- EXAMPLE ONLY, DO NOT COPY CONTENT -->

This example illustrates the exact structure and required fields for a single beat in a scene plan. All values below are purely generic placeholders to demonstrate schema conformance. Real plans must extract all words, timings, and visual ideas exclusively from the user's specific transcript.

---

```json
{
  "_comment": "EXAMPLE ONLY, DO NOT COPY CONTENT",
  "id": "beat-example-01",
  "sceneNumber": 1,
  "instruction": "Example talking beat transitioning into relevant topic card illustration",
  "contentType": "Text + Graphic",
  "layoutType": "50/50 Split",
  "mainFocus": "EXAMPLE TOPIC DEMONSTRATION",
  "visualIdea": "Display a generic topic badge illustrating the example concept to reinforce the spoken keyword.",
  "transcriptEvidence": "Spoken sentence: 'This is an EXAMPLE PHRASE highlighting the EXAMPLE TOPIC.' [00:01.000 -> 00:03.500]",
  "visualSource": "transcript",
  "soundReason": "Subtle UI pop on topic badge card entrance, synchronized with spoken emphasis on 'EXAMPLE TOPIC'",
  "captionMode": "Mode A",
  "captionChunks": [
    {
      "text": "This is an",
      "startFrame": 30,
      "endFrame": 50,
      "tokens": [
        { "text": "This", "isHighlight": false },
        { "text": "is", "isHighlight": false },
        { "text": "an", "isHighlight": false }
      ]
    },
    {
      "text": "EXAMPLE PHRASE",
      "startFrame": 51,
      "endFrame": 75,
      "tokens": [
        { "text": "EXAMPLE", "isHighlight": true },
        { "text": "PHRASE", "isHighlight": false }
      ]
    },
    {
      "text": "highlighting the topic",
      "startFrame": 76,
      "endFrame": 105,
      "tokens": [
        { "text": "highlighting", "isHighlight": false },
        { "text": "the", "isHighlight": false },
        { "text": "topic", "isHighlight": false }
      ]
    }
  ],
  "uiCardNeed": "DashedBadgeCard",
  "uiCardProps": {
    "title": "EXAMPLE TOPIC",
    "badgeText": "VERIFIED",
    "metric": "100%",
    "label": "CONCEPT EXAMPLE"
  },
  "uiCardStartFrame": 45,
  "uiCardEndFrame": 95,
  "sourceReference": null,
  "splitPersonCrop": {
    "headTopPercent": 6.0,
    "eyeLinePercent": 28.0,
    "chinPercent": 50.0,
    "shouldersPercent": 68.0
  },
  "soundCues": [
    {
      "id": "cue-01",
      "family": "TEXTURES",
      "filename": "misc/clean-click.wav",
      "frame": 45,
      "targetDb": -7.0,
      "notes": "Synchronized with DashedBadgeCard entrance"
    }
  ],
  "startTimestamp": "00:01.000",
  "endTimestamp": "00:03.500",
  "startFrame": 30,
  "endFrame": 105,
  "fontSize": 48,
  "highlightFontSize": 80,
  "canvasVariant": null,
  "speakerSrc": null
}
```
