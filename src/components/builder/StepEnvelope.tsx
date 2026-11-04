'use client';
import { ENVELOPE_COLORS, SEAL_COLORS, SEAL_LABELS, SEAL_MOTIFS } from '@/lib/letter/options';
import { ColorPicker } from './ColorPicker';
import type { StepProps } from './types';

export function StepEnvelope({ config, update }: StepProps) {
  const env = config.envelope;
  const set = (patch: Partial<typeof env>) => update((c) => ({ ...c, envelope: { ...c.envelope, ...patch } }));

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Amplop</h2>
          <p className="muted">Ini yang pertama dilihat penerima.</p>
        </div>
      </div>

      <ColorPicker label="Warna amplop" value={env.color} presets={ENVELOPE_COLORS} onChange={(color) => set({ color })} />

      <div className="field">
        <h3 className="subhead" id="seal-label">Motif stempel</h3>
        <div className="chip-row" role="radiogroup" aria-labelledby="seal-label">
          {SEAL_MOTIFS.map((m) => (
            <button key={m} type="button" role="radio" aria-checked={env.seal === m} className="chip" onClick={() => set({ seal: m })}>
              {SEAL_LABELS[m]}
            </button>
          ))}
        </div>
      </div>
      {env.seal === 'initial' && (
        <div className="field">
          <label className="label" htmlFor="initial">Inisial (maks. 2 huruf)</label>
          <input
            id="initial"
            className="input"
            style={{ maxWidth: 120 }}
            maxLength={2}
            value={env.initial ?? ''}
            onChange={(e) => set({ initial: e.target.value.toUpperCase() })}
          />
        </div>
      )}
      <ColorPicker label="Warna lilin" value={env.sealColor} presets={SEAL_COLORS} onChange={(sealColor) => set({ sealColor })} />

      <div className="field">
        <h3 className="subhead" id="liner-label">Lapisan dalam</h3>
        <div className="chip-row" role="radiogroup" aria-labelledby="liner-label">
          {(['plain', 'pattern'] as const).map((l) => (
            <button key={l} type="button" role="radio" aria-checked={env.liner === l} className="chip" onClick={() => set({ liner: l })}>
              {l === 'plain' ? 'Polos' : 'Bermotif'}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
