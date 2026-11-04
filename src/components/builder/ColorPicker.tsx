'use client';
import { useId } from 'react';

export function ColorPicker({
  label,
  value,
  presets,
  onChange,
}: {
  label: string;
  value: string;
  presets: string[];
  onChange: (color: string) => void;
}) {
  const id = useId();
  const current = value.toLowerCase();
  return (
    <div className="field">
      <span className="label" id={`${id}-label`}>{label}</span>
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="chip-row" style={{ alignItems: 'center' }}>
        {presets.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={current === c.toLowerCase()}
            aria-label={c}
            className="swatch"
            style={{ background: c }}
            onClick={() => onChange(c)}
          />
        ))}
        <label className="chip" style={{ gap: 8 }}>
          <input
            type="color"
            className="color-input"
            style={{ width: 28, height: 24, border: 0 }}
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
          />
          Warna lain
        </label>
      </div>
    </div>
  );
}
