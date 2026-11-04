'use client';
import { FONT_CSS, FONT_LABELS, LETTER_FONTS, LETTER_PAPERS, PAPER_LABELS, TEXT_SIZES, TEXT_SIZE_LABELS } from '@/lib/letter/options';
import type { StepProps } from './types';

export function StepLetter({ config, update }: StepProps) {
  const { letter } = config;
  const set = (patch: Partial<typeof letter>) => update((c) => ({ ...c, letter: { ...c.letter, ...patch } }));

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Tulis surat</h2>
          <p className="muted">Baris baru di isi surat ikut tampil.</p>
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="to">Nama penerima</label>
        <input id="to" className="input" maxLength={60} value={letter.to} onChange={(e) => set({ to: e.target.value })} placeholder="Misalnya: Sayang" />
      </div>
      <div className="field">
        <label className="label" htmlFor="body">Isi surat</label>
        <textarea id="body" className="textarea" maxLength={5000} value={letter.body} onChange={(e) => set({ body: e.target.value })} />
        <p className="hint">{letter.body.length} / 5000 karakter</p>
      </div>
      <div className="field">
        <label className="label" htmlFor="from">Nama pengirim</label>
        <input id="from" className="input" maxLength={60} value={letter.from} onChange={(e) => set({ from: e.target.value })} placeholder="Misalnya: Aku" />
      </div>

      <div className="field">
        <h3 className="subhead" id="font-label">Tulisan tangan</h3>
        <div className="option-grid" role="radiogroup" aria-labelledby="font-label">
          {LETTER_FONTS.map((f) => (
            <button key={f} type="button" role="radio" aria-checked={letter.font === f} className="option-card" onClick={() => set({ font: f })}>
              <span className="font-sample" style={{ fontFamily: FONT_CSS[f].family, fontSize: Math.round(26 * FONT_CSS[f].scale) }}>
                Sayang
              </span>
              {FONT_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <h3 className="subhead" id="paper-label">Kertas</h3>
        <div className="chip-row" role="radiogroup" aria-labelledby="paper-label">
          {LETTER_PAPERS.map((p) => (
            <button key={p} type="button" role="radio" aria-checked={letter.paper === p} className="chip" onClick={() => set({ paper: p })}>
              {PAPER_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <h3 className="subhead" id="size-label">Ukuran teks</h3>
        <div className="chip-row" role="radiogroup" aria-labelledby="size-label">
          {TEXT_SIZES.map((s) => (
            <button key={s} type="button" role="radio" aria-checked={letter.textSize === s} className="chip" onClick={() => set({ textSize: s })}>
              {TEXT_SIZE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
