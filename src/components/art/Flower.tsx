import type { ReactNode } from 'react';
import type { FlowerType } from '@/lib/letter/options';
import { FLOWER_PRESETS } from '@/lib/letter/options';

const INK = '#2A1A1E';

function angles(count: number, offset = 0): number[] {
  return Array.from({ length: count }, (_, i) => offset + (360 / count) * i);
}

function Ring({ href, count, offset = 0 }: { href: string; count: number; offset?: number }) {
  return (
    <>
      {angles(count, offset).map((a) => (
        <use key={a} href={`#${href}`} transform={a ? `rotate(${a})` : undefined} />
      ))}
    </>
  );
}

function Wash({ fill = 'currentColor', children }: { fill?: string; children: ReactNode }) {
  return (
    <g filter="url(#sc-wc)" fill={fill}>
      {children}
    </g>
  );
}

function Ink({ width = 1.8, filter = 'sc-ink', children }: { width?: number; filter?: string; children: ReactNode }) {
  return (
    <g fill="none" stroke={INK} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" filter={`url(#${filter})`}>
      {children}
    </g>
  );
}

function Dots({ pts, r = 1.1 }: { pts: [number, number][]; r?: number }) {
  return (
    <g fill={INK}>
      {pts.map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

const ART: Record<FlowerType, ReactNode> = {
  mawar: (
    <>
      <Wash><circle r={37} /></Wash>
      <Ink>
        <path d="M-36 4C-40-14-28-34-8-37C4-40 22-36 32-24C40-12 40 8 32 22C24 34 6 40-10 37C-26 34-34 20-36 4Z" />
        <path d="M-26 8C-30-8-20-24-2-27C14-29 27-18 28-2" />
        <path d="M28-2C29 14 16 27 0 27C-14 27-24 20-26 8" />
        <path d="M-18 2C-20-12-6-21 8-18C20-14 22 2 14 12C6 20-10 18-16 8" />
        <path d="M-9 0C-10-8-1-12 6-9C12-6 12 3 6 7C0 10-7 7-7 1" />
        <path d="M-2 0C-3-4 2-5 3-2C4 1 1 3-1 2" />
        <path d="M-36 4C-30 2-28-3-30-9M32 22C26 20 24 15 26 9M-8-37C-6-31-1-29 4-30" />
      </Ink>
    </>
  ),
  peony: (
    <>
      <Wash><circle r={42} /></Wash>
      <Wash fill="#E9B949"><circle r={8} /></Wash>
      <Ink>
        <use href="#sc-scal" />
        <use href="#sc-scal" transform="rotate(18) scale(.7)" />
        <use href="#sc-scal" transform="rotate(6) scale(.42)" />
        <path d="M-24-14C-20-20-14-22-8-20M22-16C26-10 27-4 26 2M-20 18C-14 24-6 26 2 25M18 20C22 16 24 12 24 8" />
      </Ink>
      <Dots pts={[[-3, -2], [2, -3], [3, 2], [-2, 3]]} r={1.2} />
    </>
  ),
  tulip: (
    <>
      <Wash fill="#7FA36E">
        <path d="M-3 20L3 20L3 48L-3 48Z" />
        <ellipse cx={11} cy={36} rx={6} ry={14} transform="rotate(30 11 36)" />
      </Wash>
      <Wash><ellipse cy={-2} rx={22} ry={30} /></Wash>
      <Ink>
        <path d="M-20 14C-24-6-18-26-8-30C-4-22-2-18 0-18C2-18 4-22 8-30C18-26 24-6 20 14C14 26-14 26-20 14Z" />
        <path d="M0-18C-4-6-4 8 0 22" />
        <path d="M-8-30C-13-14-11 4-4 20" />
        <path d="M8-30C13-14 11 4 4 20" />
        <path d="M0 24V48" />
        <path d="M2 46C10 40 18 30 16 22C10 26 4 36 2 46Z" />
      </Ink>
    </>
  ),
  lily: (
    <>
      <Wash><circle r={44} /></Wash>
      <Ink>
        <use href="#sc-lp" transform="rotate(60) scale(.9)" />
        <use href="#sc-lp" transform="rotate(180) scale(.9)" />
        <use href="#sc-lp" transform="rotate(300) scale(.9)" />
        <Ring href="sc-lp" count={3} />
        <g strokeWidth={1}>
          <Ring href="sc-lrib" count={3} />
        </g>
        <Ring href="sc-lst" count={6} offset={30} />
      </Ink>
      <Dots pts={[[-3, -14], [3, -18], [13, 6], [16, 11], [-14, 8], [-11, 12]]} r={1} />
    </>
  ),
  spider: (
    <>
      <Wash><circle r={32} /></Wash>
      <Ink width={1.7}>
        <Ring href="sc-slp" count={6} />
        <g strokeWidth={1.1}>
          <Ring href="sc-sst" count={6} offset={30} />
        </g>
      </Ink>
    </>
  ),
  daisy: (
    <>
      <Wash><circle r={38} /></Wash>
      <Wash fill="#E9A93A"><circle r={10} /></Wash>
      <Ink width={1.6}>
        <Ring href="sc-yp" count={18} />
        <circle r={9} />
      </Ink>
      <Dots pts={[[-3, -3], [3, -2], [0, 3], [-4, 2], [4, 3]]} r={1} />
    </>
  ),
  sunflower: (
    <>
      <Wash><circle r={44} /></Wash>
      <Wash fill="#7A4316"><circle r={22} /></Wash>
      <Ink width={1.5}>
        <Ring href="sc-sp" count={20} />
        <circle r={21} />
        <circle r={15} />
        <path strokeWidth={1} d="M-14-8L8 14M-10-14L14 10M-16 0L0 16M-4-16L16 4M8-14L-14 8M14-8L-8 14M0-16L-16 0M16 0L0-16" />
      </Ink>
    </>
  ),
  ranunculus: (
    <>
      <Wash><circle r={37} /></Wash>
      <Ink width={1.6}>
        <use href="#sc-scal" transform="scale(.8)" />
        <circle cx={0.8} r={25} />
        <circle cx={-1} cy={1} r={19} />
        <circle r={13} />
        <circle cx={1} r={8} />
        <circle r={4} />
        <path d="M-25 4C-22 14-12 20 0 20M24-6C22-14 14-20 6-21M-10-17C-4-20 4-20 10-16" />
      </Ink>
    </>
  ),
  anemone: (
    <>
      <Wash><circle r={42} /></Wash>
      <Wash fill="#2B3A5E"><circle r={13} /></Wash>
      <Ink>
        <Ring href="sc-ap" count={6} />
        <g strokeWidth={1}>
          <Ring href="sc-rib" count={6} />
        </g>
        <circle r={11} />
      </Ink>
      <g fill={INK}>
        <circle r={5} />
        {angles(12).map((a) => (
          <circle key={a} cx={15 * Math.cos((a * Math.PI) / 180)} cy={15 * Math.sin((a * Math.PI) / 180)} r={1.4} />
        ))}
      </g>
    </>
  ),
  carnation: (
    <>
      <Wash><circle r={40} /></Wash>
      <Ink width={1.6} filter="sc-frill">
        <use href="#sc-scal" transform="scale(.92)" />
        <use href="#sc-scal" transform="rotate(14) scale(.72)" />
        <use href="#sc-scal" transform="rotate(30) scale(.5)" />
        <use href="#sc-scal" transform="rotate(8) scale(.28)" />
      </Ink>
    </>
  ),
  dahlia: (
    <>
      <Wash><circle r={42} /></Wash>
      <Ink width={1.5}>
        <Ring href="sc-dp" count={16} />
        <g transform="rotate(11.25) scale(.68)">
          <Ring href="sc-dp" count={16} />
        </g>
        <g transform="scale(.4)">
          <Ring href="sc-dp" count={8} />
        </g>
        <circle r={4} />
      </Ink>
    </>
  ),
  orchid: (
    <>
      <Wash><ellipse rx={42} ry={34} /></Wash>
      <Ink>
        <path d="M0 0C-8-12-8-30 0-40C8-30 8-12 0 0Z" />
        <path d="M0 0C-8-12-8-30 0-40C8-30 8-12 0 0Z" transform="rotate(130)" />
        <path d="M0 0C-8-12-8-30 0-40C8-30 8-12 0 0Z" transform="rotate(230)" />
        <path d="M0 0C-10-6-42-16-42 4C-42 20-14 14 0 0Z" />
        <path d="M0 0C10-6 42-16 42 4C42 20 14 14 0 0Z" />
        <path d="M-7 3C-12 10-9 22 0 24C9 22 12 10 7 3C4 8-4 8-7 3Z" />
        <circle cy={-2} r={3} />
      </Ink>
      <Dots pts={[[-10, 2], [-14, -1], [10, 2], [14, -1], [-3, 13], [3, 15]]} r={1} />
    </>
  ),
  zinnia: (
    <>
      <Wash><circle r={40} /></Wash>
      <Wash fill="#E9B949"><circle r={9} /></Wash>
      <Ink width={1.6}>
        <Ring href="sc-zp" count={12} />
        <g transform="rotate(15) scale(.66)">
          <Ring href="sc-zp" count={12} />
        </g>
        <circle r={8} />
      </Ink>
      <Dots pts={[[0, -5], [4.5, -1.5], [3, 4], [-3, 4], [-4.5, -1.5]]} r={1} />
    </>
  ),
  lavender: (
    <>
      <Wash fill="#7FA36E"><path d="M-2 10L2 10L2 48L-2 48Z" /></Wash>
      <Wash><ellipse cy={-14} rx={11} ry={34} /></Wash>
      <Ink width={1.4}>
        <path d="M0 48V-44" />
        <ellipse cy={-46} rx={2.6} ry={4.5} />
        {[-38, -28, -18, -8, 4].map((y) => (
          <g key={y}>
            <ellipse cx={-4} cy={y} rx={3.2} ry={5.2} transform={`rotate(-25 -4 ${y})`} />
            <ellipse cx={4} cy={y + 4} rx={3.2} ry={5.2} transform={`rotate(25 4 ${y + 4})`} />
          </g>
        ))}
        <path d="M0 30C-6 26-12 26-16 30C-12 34-6 34 0 30Z" />
      </Ink>
    </>
  ),
  hydrangea: (
    <>
      <Wash><circle r={40} /></Wash>
      <Ink width={1.3}>
        {[[0, 0], [-19, -4], [19, -6], [-8, -21], [11, -24], [-27, 13], [-8, 17], [12, 15], [29, 9], [-25, -20], [0, -36], [-33, -4], [27, -24], [1, 31], [-17, 30], [20, 29]].map(([x, y]) => (
          <use key={`${x},${y}`} href="#sc-hf" x={x} y={y} />
        ))}
      </Ink>
    </>
  ),
  cosmos: (
    <>
      <Wash><circle r={42} /></Wash>
      <Wash fill="#E9B949"><circle r={8} /></Wash>
      <Ink width={1.7}>
        <Ring href="sc-cp" count={8} />
        <g strokeWidth={0.9}>
          <Ring href="sc-rib" count={8} />
        </g>
        <circle r={7} />
      </Ink>
      <Dots pts={[[-2, -2], [2.5, -1], [0, 2.5]]} r={1} />
    </>
  ),
  gerbera: (
    <>
      <Wash><circle r={42} /></Wash>
      <Wash fill="#5A2A10"><circle r={12} /></Wash>
      <Ink width={1.4}>
        <Ring href="sc-gp" count={24} />
        <g transform="rotate(7.5) scale(.75)">
          <Ring href="sc-gp" count={12} />
        </g>
        <circle r={12} />
        <circle r={6} />
      </Ink>
    </>
  ),
};

export function Flower({ type, color, className, style }: { type: FlowerType; color?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      className={className}
      style={{ display: 'block', overflow: 'visible', color: color ?? FLOWER_PRESETS[type][0], ...style }}
      aria-hidden="true"
      focusable="false"
    >
      {ART[type]}
    </svg>
  );
}
