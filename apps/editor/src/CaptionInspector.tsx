import React from "react";
import type { ScenePlan } from "@sfe/contracts";

type Scene = ScenePlan["scenes"][number];
type Chunk = Scene["captions"]["chunks"][number];

export function CaptionInspector({ scene, fps, onChange }: {
  scene: Scene;
  fps: number;
  onChange: (captions: Scene["captions"]) => void;
}) {
  const captions = scene.captions;
  const patchChunk = (id: string, patch: Partial<Chunk>) => onChange({
    ...captions,
    chunks: captions.chunks.map((chunk) => chunk.id === id ? { ...chunk, ...patch } : chunk),
  });
  const updateChunkTiming = (chunk: Chunk, field: "startFrame" | "endFrame", value: number) => {
    const nextValue = field === "startFrame"
      ? Math.max(scene.startFrame, Math.min(chunk.endFrame - 1, value))
      : Math.max(chunk.startFrame + 1, Math.min(scene.endFrame, value));
    patchChunk(chunk.id, { [field]: nextValue });
  };
  const patchWord = (chunkId: string, wordId: string, patch: Partial<Chunk["words"][number]>) => onChange({
    ...captions,
    chunks: captions.chunks.map((chunk) => chunk.id === chunkId
      ? { ...chunk, words: chunk.words.map((word) => word.id === wordId ? { ...word, ...patch } : word) }
      : chunk),
  });
  const splitChunk = (chunk: Chunk, at: number) => {
    if (at < 1 || at >= chunk.words.length) return;
    const frame = Math.max(chunk.startFrame + 1, Math.min(chunk.endFrame - 1,
      Math.round(chunk.startFrame + (chunk.endFrame - chunk.startFrame) * at / chunk.words.length)));
    const first: Chunk = { ...chunk, endFrame: frame, words: chunk.words.slice(0, at) };
    const second: Chunk = { ...chunk, id: chunk.id + "-split-" + Date.now().toString(36), startFrame: frame, words: chunk.words.slice(at) };
    onChange({ ...captions, chunks: captions.chunks.flatMap((c) => c.id === chunk.id ? [first, second] : [c]) });
  };
  const mergeNext = (index: number) => {
    const current = captions.chunks[index], next = captions.chunks[index + 1];
    if (!current || !next) return;
    const merged: Chunk = { ...current, endFrame: next.endFrame, words: [...current.words, ...next.words] };
    onChange({ ...captions, chunks: captions.chunks.flatMap((c, i) => i === index ? [merged] : i === index + 1 ? [] : [c]) });
  };

  return <section className="editor-section">
    <div className="inspector-summary"><span>CAPTIONS · {captions.chunks.length} CHUNKS</span>
      <label className="inline-toggle"><input type="checkbox" checked={captions.enabled} onChange={(e) => onChange({ ...captions, enabled: e.target.checked })}/> Show</label>
    </div>
    <div className="caption-style-grid">
      <label className="field-label">FONT FAMILY<input value={captions.style.fontFamily} onChange={(e) => onChange({ ...captions, style: { ...captions.style, fontFamily: e.target.value || "Arial" } })}/></label>
      <label className="field-label">FONT SIZE<input type="number" min="8" max="160" value={captions.style.fontSize} onChange={(e) => { const value = Number(e.target.value); if (Number.isFinite(value) && value >= 8 && value <= 160) onChange({ ...captions, style: { ...captions.style, fontSize: value } }); }}/></label>
      <label className="field-label">FONT WEIGHT<select value={captions.style.fontWeight} onChange={(e) => onChange({ ...captions, style: { ...captions.style, fontWeight: Number(e.target.value) } })}><option value={400}>Regular</option><option value={500}>Medium</option><option value={600}>Semibold</option><option value={700}>Bold</option><option value={800}>Extra bold</option><option value={900}>Black</option></select></label>
      <label className="field-label">ANIMATION<select value={captions.style.animation} onChange={(e) => onChange({ ...captions, style: { ...captions.style, animation: e.target.value as typeof captions.style.animation } })}><option value="word-pop">Word pop</option><option value="fade">Fade</option><option value="slide">Slide</option><option value="none">None</option></select></label>
      <label className="field-label">TEXT COLOR<input type="color" value={/^#[0-9a-fA-F]{6}$/.test(captions.style.textColor) ? captions.style.textColor : "#ffffff"} onChange={(e) => onChange({ ...captions, style: { ...captions.style, textColor: e.target.value } })}/></label>
      <label className="field-label">HIGHLIGHT COLOR<input type="color" value={/^#[0-9a-fA-F]{6}$/.test(captions.style.highlightColor) ? captions.style.highlightColor : "#f5c542"} onChange={(e) => onChange({ ...captions, style: { ...captions.style, highlightColor: e.target.value } })}/></label>
      <label className="field-label">POSITION<select value={captions.style.position} onChange={(e) => onChange({ ...captions, style: { ...captions.style, position: e.target.value as typeof captions.style.position } })}><option value="top">Top</option><option value="center">Center</option><option value="bottom">Bottom</option></select></label>
    </div>
    <div className="caption-chunk-list">{captions.chunks.map((chunk, index) => <article className="caption-chunk" key={chunk.id}>
      <div className="chunk-heading"><strong>Chunk {index + 1}</strong><span>{(chunk.startFrame / fps).toFixed(2)}s – {(chunk.endFrame / fps).toFixed(2)}s</span></div>
      <div className="chunk-timing">
        <label>START<input type="number" min={scene.startFrame} max={chunk.endFrame - 1} value={chunk.startFrame} onChange={(e) => updateChunkTiming(chunk, "startFrame", Number(e.target.value))}/></label>
        <label>END<input type="number" min={chunk.startFrame + 1} max={scene.endFrame} value={chunk.endFrame} onChange={(e) => updateChunkTiming(chunk, "endFrame", Number(e.target.value))}/></label>
      </div>
      {chunk.words.map((word, wi) => <div className="caption-word-row" key={word.id}>
        <input aria-label={"Caption word " + (wi + 1)} value={word.text} onChange={(e) => patchWord(chunk.id, word.id, { text: e.target.value })}/>
        <label title="Highlight"><input type="checkbox" checked={word.highlighted} onChange={(e) => patchWord(chunk.id, word.id, { highlighted: e.target.checked })}/> H</label>
        {wi > 0 && <button type="button" className="small-button" onClick={() => splitChunk(chunk, wi)}>Split</button>}
      </div>)}
      {index < captions.chunks.length - 1 && <button type="button" className="text-button" onClick={() => mergeNext(index)}>Merge with next</button>}
    </article>)}</div>
  </section>;
}
