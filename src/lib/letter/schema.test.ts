import { describe, expect, it } from 'vitest';
import { defaultConfig } from './defaults';
import { letterConfigSchema, type LetterConfig } from './schema';

function valid(): LetterConfig {
  const cfg = defaultConfig();
  cfg.letter = { ...cfg.letter, to: 'Kamu', body: 'Halo sayang', from: 'Aku' };
  return cfg;
}

describe('letterConfigSchema', () => {
  it('accepts a complete letter', () => {
    expect(letterConfigSchema.safeParse(valid()).success).toBe(true);
  });

  it('rejects fewer than 3 stems', () => {
    const cfg = valid();
    cfg.bouquet.flowers = cfg.bouquet.flowers.slice(0, 2);
    expect(letterConfigSchema.safeParse(cfg).success).toBe(false);
  });

  it('rejects more than 15 stems', () => {
    const cfg = valid();
    cfg.bouquet.flowers = Array.from({ length: 16 }, () => ({ type: 'mawar' as const, color: '#D9343F' }));
    expect(letterConfigSchema.safeParse(cfg).success).toBe(false);
  });

  it('rejects an unknown flower type and a bad color', () => {
    const cfg = valid() as unknown as { bouquet: { flowers: unknown[] } };
    cfg.bouquet.flowers[0] = { type: 'kaktus', color: '#D9343F' };
    expect(letterConfigSchema.safeParse(cfg).success).toBe(false);

    const cfg2 = valid();
    cfg2.envelope.color = 'red';
    expect(letterConfigSchema.safeParse(cfg2).success).toBe(false);
  });

  it('requires an initial when the seal motif is "initial"', () => {
    const cfg = valid();
    cfg.envelope.seal = 'initial';
    expect(letterConfigSchema.safeParse(cfg).success).toBe(false);
    cfg.envelope.initial = 'A';
    expect(letterConfigSchema.safeParse(cfg).success).toBe(true);
  });

  it('rejects media paths outside an owner folder', () => {
    const cfg = valid();
    cfg.extras.musicPath = '../../etc/passwd';
    expect(letterConfigSchema.safeParse(cfg).success).toBe(false);
  });
});
