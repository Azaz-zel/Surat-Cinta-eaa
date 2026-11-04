import type { LetterConfig } from './schema';

export function randomSeed(): number {
  return Math.floor(Math.random() * 0xffffffff);
}

export function defaultConfig(): LetterConfig {
  return {
    bouquet: {
      flowers: [
        { type: 'mawar', color: '#D9343F' },
        { type: 'mawar', color: '#B0263B' },
        { type: 'mawar', color: '#E0505E' },
        { type: 'peony', color: '#F2A7B8' },
        { type: 'peony', color: '#F7C4CF' },
        { type: 'lily', color: '#F29BB8' },
        { type: 'lily', color: '#EC86A9' },
        { type: 'tulip', color: '#F26B1D' },
        { type: 'daisy', color: '#CFE0E4' },
        { type: 'daisy', color: '#D8E6D9' },
      ],
      greenery: ['eucalyptus'],
      wrap: { paper: 'kraft', color: '#D9B48A' },
      ribbon: { style: 'bow', color: '#B4233F' },
      seed: 20261104,
    },
    letter: { to: '', body: '', from: '', font: 'caveat', paper: 'lined', textSize: 'md' },
    envelope: { color: '#7A1B32', seal: 'heart', sealColor: '#A3132E', liner: 'pattern' },
    extras: { petals: { enabled: true, color: '#E8B7C1' } },
  };
}
