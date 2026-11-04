import { describe, expect, it } from 'vitest';
import { arrangeBouquet } from './arrange';
import { defaultConfig } from './defaults';

const { flowers, greenery } = defaultConfig().bouquet;

describe('arrangeBouquet', () => {
  it('returns the same arrangement for the same seed', () => {
    expect(arrangeBouquet(flowers, greenery, 42)).toEqual(arrangeBouquet(flowers, greenery, 42));
  });

  it('returns a different arrangement for a different seed', () => {
    expect(arrangeBouquet(flowers, greenery, 42)).not.toEqual(arrangeBouquet(flowers, greenery, 43));
  });

  it('places every stem exactly once, above the wrap line', () => {
    const { flowers: placed } = arrangeBouquet(flowers, greenery, 7);
    expect(placed.map((p) => p.index).sort((a, b) => a - b)).toEqual(flowers.map((_, i) => i));
    for (const p of placed) expect(p.y).toBeLessThanOrEqual(182);
  });

  it('places two mirrored sprigs per greenery type', () => {
    expect(arrangeBouquet(flowers, ['fern', 'olive'], 1).greenery).toHaveLength(4);
  });
});
