import React, { useRef } from "react";
import type { ScenePlan } from "@sfe/contracts";

type Scene = ScenePlan["scenes"][number];
type SoundEffect = Scene["soundEffects"][number];

export function SoundInspector({ scene, fps, assets, onChange, onAssetUpload }: {
  scene: Scene;
  fps: number;
  assets: Record<string, string>;
  onChange: (effects: Scene["soundEffects"]) => void;
  onAssetUpload: (assetId: string, file: File) => void;
}) {
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});
  const update = (id: string, patch: Partial<SoundEffect>) => onChange(scene.soundEffects.map((effect) => effect.id === id ? { ...effect, ...patch } : effect));
  const addCue = () => {
    const id = "sfx-" + Date.now().toString(36);
    onChange([...scene.soundEffects, { id, assetId: id, startFrame: scene.startFrame, durationFrames: Math.max(1, Math.min(fps, scene.endFrame - scene.startFrame)), volumeDb: -12, enabled: true }]);
  };

  return <section className="editor-section">
    <div className="inspector-summary"><span>SOUND EFFECTS · {scene.soundEffects.length}</span><button type="button" className="small-button" onClick={addCue}>+ Add cue</button></div>
    {scene.soundEffects.map((effect, index) => <article className="sound-cue" key={effect.id}>
      <div className="chunk-heading"><strong>Cue {index + 1}</strong><label className="inline-toggle"><input type="checkbox" checked={effect.enabled} onChange={(e) => update(effect.id, { enabled: e.target.checked })}/> On</label></div>
      <div className="asset-picker"><span>{assets[effect.assetId] ? "Audio attached" : "No audio attached"}</span>
        <input ref={(node) => { inputs.current[effect.id] = node; }} type="file" accept="audio/*" hidden onChange={(e) => { const file = e.target.files?.[0]; if (file) onAssetUpload(effect.assetId, file); e.target.value = ""; }}/>
        <button type="button" className="small-button" onClick={() => inputs.current[effect.id]?.click()}>{assets[effect.assetId] ? "Replace" : "Attach audio"}</button>
      </div>
      {assets[effect.assetId] && <audio className="audio-audition" controls preload="metadata" src={assets[effect.assetId]}/>}
      <div className="chunk-timing">
        <label>START FRAME<input type="number" min={scene.startFrame} max={scene.endFrame - 1} value={effect.startFrame} onChange={(e) => update(effect.id, { startFrame: Number(e.target.value) })}/></label>
        <label>DURATION<input type="number" min={1} max={scene.endFrame - effect.startFrame} value={effect.durationFrames} onChange={(e) => update(effect.id, { durationFrames: Number(e.target.value) })}/></label>
      </div>
      <label className="field-label volume-field">VOLUME · {effect.volumeDb} dB<input type="range" min="-60" max="6" step="1" value={effect.volumeDb} onChange={(e) => update(effect.id, { volumeDb: Number(e.target.value) })}/></label>
      <button type="button" className="text-button danger" onClick={() => onChange(scene.soundEffects.filter((item) => item.id !== effect.id))}>Remove cue</button>
    </article>)}
    {!scene.soundEffects.length && <p className="helper-text">No sound cues. Add one and attach an audio file to audition it.</p>}
  </section>;
}
