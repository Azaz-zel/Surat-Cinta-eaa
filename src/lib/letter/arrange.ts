import type { FlowerType, GreeneryType } from './options';

/**
 * Bouquet coordinates live in a 320×380 box. The wrap's front edge sits around y≈190,
 * so flower heads are kept above that line.
 */
export const BOX_W = 320;
export const BOX_H = 380;

export type PlacedFlower = {
  index: number; // index in the input `flowers` array
  type: FlowerType;
  color: string;
  x: number; // center, box units
  y: number;
  size: number; // diameter, box units
  rotate: number; // degrees
  z: number; // paint order, 0 = back
  delay: number; // bloom delay in seconds
};

export type PlacedGreenery = {
  type: GreeneryType;
  x: number; // base of the sprig
  y: number;
  rotate: number; // degrees, 0 = pointing straight up
  length: number;
  flip: boolean;
};

export type Arrangement = { flowers: PlacedFlower[]; greenery: PlacedGreenery[] };

/** mulberry32: small, fast, seedable PRNG returning floats in [0, 1). */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIZE_FACTOR: Record<FlowerType, number> = {
  mawar: 1, peony: 1.15, tulip: 0.85, lily: 1.1, spider: 0.95, daisy: 0.75, sunflower: 1.1,
  ranunculus: 0.9, anemone: 0.95, carnation: 0.9, dahlia: 1.1, orchid: 0.95, zinnia: 0.9,
  lavender: 0.8, hydrangea: 1.2, cosmos: 0.85, gerbera: 0.95,
};

/** Flowers drawn in side view lean outward, like stems fanning from the wrap. */
const SIDE_VIEW: ReadonlySet<FlowerType> = new Set<FlowerType>(['tulip', 'lavender']);

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function arrangeBouquet(
  flowers: { type: FlowerType; color: string }[],
  greenery: GreeneryType[],
  seed: number,
): Arrangement {
  const rng = createRng(seed);
  const n = flowers.length;

  // Shuffle which stem gets which slot, so "acak susunan" changes the look but not the stems.
  const order = flowers.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const cx = 160;
  const cy = 128;
  const radius = 26 + 19 * Math.sqrt(n);
  const baseSize = Math.max(72, 122 - n * 3);
  const twist = rng() * Math.PI * 2;

  const placed: PlacedFlower[] = order.map((flowerIndex, slot) => {
    const f = flowers[flowerIndex];
    // Vogel spiral gives an even, natural-looking spread of points in a disc.
    const r = radius * Math.sqrt((slot + 0.5) / n);
    const theta = slot * GOLDEN_ANGLE + twist;
    let x = cx + r * Math.cos(theta) * 1.18 + (rng() - 0.5) * 10;
    let y = cy + r * Math.sin(theta) * 0.82 + (rng() - 0.5) * 10;
    if (y > 182) y = 182 - (y - 182) * 0.5;
    x = Math.min(Math.max(x, 40), BOX_W - 40);
    const size = baseSize * SIZE_FACTOR[f.type] * (0.9 + rng() * 0.2);
    const lean = SIDE_VIEW.has(f.type) ? ((x - cx) / 160) * 40 : 0;
    const rotate = lean + (rng() - 0.5) * 30;
    return { index: flowerIndex, type: f.type, color: f.color, x, y, size, rotate, z: 0, delay: 0 };
  });

  // Back to front: higher on the page sits behind; big center flowers come forward.
  placed.sort((a, b) => a.y - b.y || b.size - a.size);
  placed.forEach((p, i) => {
    p.z = i;
  });
  // Bloom from the center outward.
  const byDistance = [...placed].sort(
    (a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy),
  );
  byDistance.forEach((p, i) => {
    p.delay = Math.round(i * 0.14 * 100) / 100;
  });

  const angles = [50, 28, 68, 14, 82, 40];
  const placedGreenery: PlacedGreenery[] = [];
  greenery.forEach((type, i) => {
    const angle = angles[i % angles.length] + (rng() - 0.5) * 10;
    const length = radius + 60 + rng() * 20;
    placedGreenery.push({ type, x: cx - 6, y: 236, rotate: -angle, length, flip: false });
    placedGreenery.push({ type, x: cx + 6, y: 236, rotate: angle + (rng() - 0.5) * 8, length: length * (0.92 + rng() * 0.12), flip: true });
  });

  return { flowers: placed, greenery: placedGreenery };
}
