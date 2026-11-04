'use client';
import { useState } from 'react';
import { Flower } from '@/components/art/Flower';
import { FLOWER_LABELS, FLOWER_PRESETS, FLOWER_TYPES, MAX_STEMS, MIN_STEMS, type FlowerType } from '@/lib/letter/options';
import { randomSeed } from '@/lib/letter/defaults';
import { ColorPicker } from './ColorPicker';
import type { StepProps } from './types';

export function StepFlowers({ config, update }: StepProps) {
  const stems = config.bouquet.flowers;
  const total = stems.length;
  const [selected, setSelected] = useState(0);
  const sel = Math.min(selected, total - 1);

  const counts = new Map<FlowerType, number>();
  for (const s of stems) counts.set(s.type, (counts.get(s.type) ?? 0) + 1);

  function add(type: FlowerType) {
    update((c) => ({ ...c, bouquet: { ...c.bouquet, flowers: [...c.bouquet.flowers, { type, color: FLOWER_PRESETS[type][0] }] } }));
    setSelected(total);
  }
  function remove(type: FlowerType) {
    update((c) => {
      const i = c.bouquet.flowers.map((f) => f.type).lastIndexOf(type);
      if (i < 0) return c;
      return { ...c, bouquet: { ...c.bouquet, flowers: c.bouquet.flowers.filter((_, j) => j !== i) } };
    });
  }
  function setColor(color: string) {
    update((c) => ({
      ...c,
      bouquet: { ...c.bouquet, flowers: c.bouquet.flowers.map((f, j) => (j === sel ? { ...f, color } : f)) },
    }));
  }

  const ordinal = new Map<FlowerType, number>();
  const stemLabels = stems.map((s) => {
    const n = (ordinal.get(s.type) ?? 0) + 1;
    ordinal.set(s.type, n);
    return `${FLOWER_LABELS[s.type]} ${n}`;
  });

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Pilih bunga</h2>
          <p className="muted">Tambah per tangkai. Minimal {MIN_STEMS}, maksimal {MAX_STEMS}.</p>
        </div>
        <p style={{ margin: 0, fontWeight: 600, color: total < MIN_STEMS ? 'var(--danger)' : undefined }} aria-live="polite">
          {total} / {MAX_STEMS} tangkai
        </p>
      </div>
      {total < MIN_STEMS && (
        <p className="alert alert-error" role="status">Tambahkan minimal {MIN_STEMS} tangkai supaya buketnya bisa disusun.</p>
      )}

      <div className="flower-grid">
        {FLOWER_TYPES.map((type) => {
          const n = counts.get(type) ?? 0;
          return (
            <div key={type} className={n > 0 ? 'flower-card is-on' : 'flower-card'}>
              <div className="flower-card-art">
                <Flower type={type} style={{ width: '100%', height: '100%' }} />
              </div>
              <span className="flower-card-name">{FLOWER_LABELS[type]}</span>
              <div className="stepper">
                <button type="button" className="stepper-btn" aria-label={`Kurangi ${FLOWER_LABELS[type]}`} disabled={n === 0} onClick={() => remove(type)}>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14" /></svg>
                </button>
                <span className="stepper-count">{n}</span>
                <button type="button" className="stepper-btn" aria-label={`Tambah ${FLOWER_LABELS[type]}`} disabled={total >= MAX_STEMS} onClick={() => add(type)}>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 className="subhead">Warna per tangkai</h3>
          <div className="chip-row" role="radiogroup" aria-label="Pilih tangkai">
            {stems.map((s, i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={i === sel}
                className="chip stem-chip"
                onClick={() => setSelected(i)}
              >
                <span className="stem-dot" style={{ background: s.color }} aria-hidden="true" />
                {stemLabels[i]}
              </button>
            ))}
          </div>
          <ColorPicker
            label={`Warna ${stemLabels[sel]}`}
            value={stems[sel].color}
            presets={FLOWER_PRESETS[stems[sel].type]}
            onChange={setColor}
          />
          <div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => update((c) => ({ ...c, bouquet: { ...c.bouquet, seed: randomSeed() } }))}
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5" /><path d="M4 20L21 3" /><path d="M21 16v5h-5" /><path d="M15 15l6 6" /><path d="M4 4l5 5" /></svg>
              Acak susunan
            </button>
          </div>
        </div>
      )}
    </>
  );
}
