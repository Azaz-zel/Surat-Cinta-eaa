const PETALS = [
  { left: 6, duration: 14, delay: 0 },
  { left: 18, duration: 17, delay: 3 },
  { left: 31, duration: 13, delay: 6 },
  { left: 44, duration: 18, delay: 1.5 },
  { left: 57, duration: 15, delay: 8 },
  { left: 69, duration: 16, delay: 4.5 },
  { left: 81, duration: 12, delay: 2 },
  { left: 92, duration: 19, delay: 7 },
];

/** Falling petals in the background. Hidden with prefers-reduced-motion (see globals.css). */
export function Petals({ color }: { color: string }) {
  return (
    <div className="petals" aria-hidden="true">
      {PETALS.map((p) => (
        <span
          key={p.left}
          className="petal"
          style={{ left: `${p.left}%`, background: color, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}
        />
      ))}
    </div>
  );
}
