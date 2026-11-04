import type { ReactNode } from 'react';
import type { GreeneryType } from '@/lib/letter/options';

const INK = '#2A1A1E';
/** Every sprig is drawn from its base at (0,0) pointing up to (0,-130). */
export const SPRIG_LENGTH = 130;

function Ink({ width = 1.4, children }: { width?: number; children: ReactNode }) {
  return (
    <g fill="none" stroke={INK} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" filter="url(#sc-ink)">
      {children}
    </g>
  );
}

const LEAF = 'M0 0C-6-6-6-18 0-24C6-18 6-6 0 0Z';
const NARROW = 'M0 0C-3-6-3-22 0-28C3-22 3-6 0 0Z';

function alternating(path: string, steps: number[], angle: number) {
  return steps.map((y, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    return <path key={y} d={path} transform={`translate(0 ${y}) rotate(${side * angle})`} />;
  });
}

const EUC: [number, number][] = [[-8, -40], [8, -54], [-9, -70], [8, -86], [-7, -102], [6, -116], [0, -128]];
const RUSCUS_Y = [-30, -46, -62, -78, -94, -110];
const OLIVE_Y = [-26, -40, -54, -68, -82, -96, -110];
const FERN_Y = Array.from({ length: 12 }, (_, i) => -14 - i * 9.5);

const ART: Record<GreeneryType, ReactNode> = {
  eucalyptus: (
    <>
      <g filter="url(#sc-wc)" fill="#8FAA9C">
        {EUC.map(([x, y]) => <circle key={y} cx={x} cy={y} r={8} />)}
      </g>
      <Ink>
        <path d="M0 0C-4-40 4-90-2-130" />
        {EUC.map(([x, y]) => <circle key={y} cx={x} cy={y} r={7} />)}
      </Ink>
    </>
  ),
  babysbreath: (
    <>
      <Ink width={1}>
        <path d="M0 0C0-50-4-90-10-126M-2-60C-14-80-24-96-28-112M0-80C10-96 18-108 22-124M-6-100C-2-110 2-116 6-122" />
      </Ink>
      <g fill="#FFFDF8" stroke={INK} strokeWidth={0.8} filter="url(#sc-ink)">
        {[[-10, -128], [-14, -122], [-6, -122], [-28, -114], [-32, -108], [-24, -108], [22, -126], [26, -120], [18, -120], [6, -124], [10, -118], [-20, -96], [12, -100]].map(([x, y]) => (
          <circle key={`${x},${y}`} cx={x} cy={y} r={3.2} />
        ))}
      </g>
    </>
  ),
  fern: (
    <>
      <g filter="url(#sc-wc)" fill="#6E9A5E">
        {FERN_Y.map((y, i) => {
          const s = 1 - i * 0.06;
          return (
            <g key={y}>
              <ellipse cx={-8 * s} cy={y} rx={3.2} ry={9 * s} transform={`rotate(-58 ${-8 * s} ${y})`} />
              <ellipse cx={8 * s} cy={y} rx={3.2} ry={9 * s} transform={`rotate(58 ${8 * s} ${y})`} />
            </g>
          );
        })}
      </g>
      <Ink width={1.1}>
        <path d="M0 0C2-50-2-100-6-130" />
        {FERN_Y.map((y, i) => {
          const s = 1 - i * 0.06;
          return (
            <g key={y}>
              <ellipse cx={-8 * s} cy={y} rx={3} ry={8.5 * s} transform={`rotate(-58 ${-8 * s} ${y})`} />
              <ellipse cx={8 * s} cy={y} rx={3} ry={8.5 * s} transform={`rotate(58 ${8 * s} ${y})`} />
            </g>
          );
        })}
      </Ink>
    </>
  ),
  ruscus: (
    <>
      <g filter="url(#sc-wc)" fill="#5F8F5A">{alternating(LEAF, RUSCUS_Y, 38)}</g>
      <Ink>
        <path d="M0 0C-3-40 3-90 0-124" />
        {alternating(LEAF, RUSCUS_Y, 38)}
      </Ink>
    </>
  ),
  olive: (
    <>
      <g filter="url(#sc-wc)" fill="#9AAE8E">{alternating(NARROW, OLIVE_Y, 42)}</g>
      <g filter="url(#sc-wc)" fill="#3E3A4A">
        <ellipse cx={-6} cy={-60} rx={3.5} ry={4.5} />
        <ellipse cx={6} cy={-88} rx={3.5} ry={4.5} />
      </g>
      <Ink width={1.2}>
        <path d="M0 0C2-40-2-90 2-124" />
        {alternating(NARROW, OLIVE_Y, 42)}
      </Ink>
    </>
  ),
  monstera: (
    <>
      <g filter="url(#sc-wc)" fill="#3F7A4E">
        <path d="M0-60C-30-62-48-84-44-108C-40-128-16-138 0-132C16-138 40-128 44-108C48-84 30-62 0-60Z" />
        <path d="M-2 0L2 0L2-60L-2-60Z" />
      </g>
      <g stroke="#FBF4EA" strokeWidth={3.5} strokeLinecap="round">
        <path d="M-45-100L-26-98M-41-118L-22-110M45-100L26-98M41-118L22-110M-32-70L-18-80M32-70L18-80" />
      </g>
      <Ink>
        <path d="M0-60C-30-62-48-84-44-108C-40-128-16-138 0-132C16-138 40-128 44-108C48-84 30-62 0-60Z" />
        <path d="M0 0V-128" />
      </Ink>
    </>
  ),
};

export function Sprig({ type }: { type: GreeneryType }) {
  return <>{ART[type]}</>;
}

/** Small standalone preview for the builder chips. */
export function GreeneryIcon({ type }: { type: GreeneryType }) {
  return (
    <svg viewBox="-50 -140 100 150" aria-hidden="true" focusable="false" style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}>
      <Sprig type={type} />
    </svg>
  );
}
