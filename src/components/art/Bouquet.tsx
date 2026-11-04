import type { ReactNode } from 'react';
import { arrangeBouquet, BOX_H, BOX_W } from '@/lib/letter/arrange';
import type { LetterConfig } from '@/lib/letter/schema';
import type { RibbonStyle, WrapPaper } from '@/lib/letter/options';
import { Flower } from './Flower';
import { Sprig, SPRIG_LENGTH } from './Greenery';

const INK = '#2A1A1E';
const BACK = 'M26 150Q160 104 294 150L184 345Q160 354 136 345Z';
const FRONT =
  'M14 182C40 174 60 196 86 190C110 184 132 202 160 196C188 202 210 184 234 190C260 196 282 174 306 182L188 352Q160 364 132 352Z';
const TISSUE =
  'M24 172C52 160 74 186 100 178C124 170 140 190 160 184C180 190 196 170 220 178C246 186 268 160 296 172L192 340Q160 352 128 340Z';

/** Rounded so the server-rendered style string matches the browser's exactly (no hydration mismatch). */
function pct(v: number): string {
  return `${(v * 100).toFixed(2)}%`;
}

function Paper({ d, paper, color, back }: { d: string; paper: WrapPaper; color: string; back?: boolean }) {
  const clear = paper === 'clear';
  return (
    <>
      <path d={d} fill={color} fillOpacity={clear ? 0.6 : 1} />
      {!clear && paper !== 'satin' && (
        <g filter="url(#sc-wc)" fill={color} opacity={0.9}>
          <path d={d} />
        </g>
      )}
      {paper === 'kraft' && <path d={d} fill="#fff" filter="url(#sc-grain)" />}
      {paper === 'linen' && <path d={d} fill="url(#sc-linen)" />}
      {paper === 'newspaper' && <path d={d} fill="url(#sc-news)" />}
      {paper === 'satin' && <path d={d} fill="url(#sc-sheen)" />}
      {back && <path d={d} fill="#000" fillOpacity={0.12} />}
    </>
  );
}

function Ribbon({ style, color }: { style: RibbonStyle; color: string }) {
  const outlined = (d: string, width: number) => (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={width + 2.6} strokeLinecap="round" strokeLinejoin="round" filter="url(#sc-ink)" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
  if (style === 'long') {
    return (
      <g>
        {outlined('M100 296Q160 312 220 296', 9)}
        {outlined('M158 302C146 326 170 344 152 372', 8)}
        {outlined('M164 302C182 324 160 346 178 370', 8)}
      </g>
    );
  }
  if (style === 'twine') {
    return (
      <g>
        {outlined('M100 296Q160 310 220 296', 2.6)}
        {outlined('M160 300C146 284 128 286 132 296C136 306 152 304 160 300', 2.4)}
        {outlined('M160 300C174 284 192 286 188 296C184 306 168 304 160 300', 2.4)}
        {outlined('M158 302C154 318 150 330 146 344M162 302C166 318 170 330 174 344', 2.4)}
      </g>
    );
  }
  const loops = [
    'M158 296C138 274 106 276 110 294C114 312 144 306 158 300Z',
    'M162 296C182 274 214 276 210 294C206 312 176 306 162 300Z',
    'M156 302C150 318 142 334 134 352L146 346L152 356C156 338 158 320 160 304Z',
    'M164 302C170 318 178 334 186 352L174 346L168 356C164 338 162 320 160 304Z',
  ];
  return (
    <g>
      <g fill={color}>
        {loops.map((d) => <path key={d} d={d} />)}
        <ellipse cx={160} cy={299} rx={8} ry={9} />
      </g>
      <g filter="url(#sc-wc)" fill="#000" opacity={0.12}>
        {loops.map((d) => <path key={d} d={d} />)}
      </g>
      <g fill="none" stroke={INK} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" filter="url(#sc-ink)">
        {loops.map((d) => <path key={d} d={d} />)}
        <ellipse cx={160} cy={299} rx={8} ry={9} />
        <path d="M122 290C130 286 140 288 148 294M198 290C190 286 180 288 172 294" strokeWidth={1} />
      </g>
    </g>
  );
}

function Layer({ children, front }: { children: ReactNode; front?: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${BOX_W} ${BOX_H}`}
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: front ? 'none' : undefined }}
    >
      {children}
    </svg>
  );
}

export function Bouquet({ bouquet, bloom = false }: { bouquet: LetterConfig['bouquet']; bloom?: boolean }) {
  const { flowers, greenery } = arrangeBouquet(bouquet.flowers, bouquet.greenery, bouquet.seed);
  const { paper, color: wrapColor } = bouquet.wrap;

  return (
    <div
      className={bloom ? 'bouquet bouquet-bloom' : 'bouquet'}
      role="img"
      aria-label={`Buket berisi ${bouquet.flowers.length} tangkai bunga`}
      style={{ position: 'relative', width: '100%', maxWidth: 360, margin: '0 auto', aspectRatio: `${BOX_W} / ${BOX_H}` }}
    >
      <Layer>
        <Paper d={BACK} paper={paper} color={wrapColor} back />
        <path d="M26 150Q160 104 294 150" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" filter="url(#sc-ink)" />
        {greenery.map((g, i) => (
          <g
            key={`${g.type}-${i}`}
            transform={`translate(${g.x} ${g.y}) rotate(${g.rotate}) scale(${(g.flip ? -1 : 1) * (g.length / SPRIG_LENGTH)} ${g.length / SPRIG_LENGTH})`}
          >
            <Sprig type={g.type} />
          </g>
        ))}
      </Layer>

      {flowers.map((f) => (
        <div
          key={f.index}
          style={{
            position: 'absolute',
            left: pct(f.x / BOX_W),
            top: pct(f.y / BOX_H),
            width: pct(f.size / BOX_W),
            aspectRatio: '1 / 1',
            transform: `translate(-50%, -50%) rotate(${f.rotate.toFixed(1)}deg)`,
          }}
        >
          <div className="bloom" style={{ width: '100%', height: '100%', animationDelay: `${f.delay}s` }}>
            <Flower type={f.type} color={f.color} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      ))}

      <Layer front>
        {paper === 'tissue' && <Paper d={TISSUE} paper="tissue" color="#FBF4EA" />}
        <Paper d={FRONT} paper={paper} color={wrapColor} />
        {paper === 'clear' && (
          <path d="M60 196L138 340M250 196L196 330" stroke="#fff" strokeOpacity={0.55} strokeWidth={5} strokeLinecap="round" />
        )}
        <g fill="none" stroke={INK} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" filter="url(#sc-ink)">
          <path d={FRONT} />
          <path d="M86 190L146 352M234 190L174 352M160 196L160 290" strokeWidth={1.1} />
        </g>
        <Ribbon style={bouquet.ribbon.style} color={bouquet.ribbon.color} />
      </Layer>
    </div>
  );
}
