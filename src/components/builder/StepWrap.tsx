'use client';
import { GreeneryIcon } from '@/components/art/Greenery';
import {
  GREENERY_LABELS, GREENERY_TYPES, RIBBON_COLORS, RIBBON_LABELS, RIBBON_STYLES, WRAP_COLORS, WRAP_LABELS, WRAP_PAPERS,
} from '@/lib/letter/options';
import { ColorPicker } from './ColorPicker';
import type { StepProps } from './types';

export function StepWrap({ config, update }: StepProps) {
  const { greenery, wrap, ribbon } = config.bouquet;
  const setBouquet = (patch: Partial<typeof config.bouquet>) => update((c) => ({ ...c, bouquet: { ...c.bouquet, ...patch } }));

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Daun &amp; wrapping</h2>
          <p className="muted">Daun pengisi boleh lebih dari satu.</p>
        </div>
      </div>

      <div className="field">
        <h3 className="subhead">Daun pengisi</h3>
        <div className="option-grid">
          {GREENERY_TYPES.map((g) => {
            const on = greenery.includes(g);
            return (
              <button
                key={g}
                type="button"
                className="option-card"
                aria-pressed={on}
                onClick={() => setBouquet({ greenery: on ? greenery.filter((x) => x !== g) : [...greenery, g] })}
              >
                <span className="option-card-art"><GreeneryIcon type={g} /></span>
                {GREENERY_LABELS[g]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="field">
        <h3 className="subhead" id="wrap-paper">Kertas pembungkus</h3>
        <div className="chip-row" role="radiogroup" aria-labelledby="wrap-paper">
          {WRAP_PAPERS.map((p) => (
            <button key={p} type="button" role="radio" aria-checked={wrap.paper === p} className="chip" onClick={() => setBouquet({ wrap: { ...wrap, paper: p } })}>
              {WRAP_LABELS[p]}
            </button>
          ))}
        </div>
      </div>
      <ColorPicker label="Warna pembungkus" value={wrap.color} presets={WRAP_COLORS} onChange={(color) => setBouquet({ wrap: { ...wrap, color } })} />

      <div className="field">
        <h3 className="subhead" id="ribbon-style">Pita</h3>
        <div className="chip-row" role="radiogroup" aria-labelledby="ribbon-style">
          {RIBBON_STYLES.map((s) => (
            <button key={s} type="button" role="radio" aria-checked={ribbon.style === s} className="chip" onClick={() => setBouquet({ ribbon: { ...ribbon, style: s } })}>
              {RIBBON_LABELS[s]}
            </button>
          ))}
        </div>
      </div>
      <ColorPicker label="Warna pita" value={ribbon.color} presets={RIBBON_COLORS} onChange={(color) => setBouquet({ ribbon: { ...ribbon, color } })} />
    </>
  );
}
