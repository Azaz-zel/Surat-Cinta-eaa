export const FLOWER_TYPES = [
  'mawar', 'peony', 'tulip', 'lily', 'spider', 'daisy', 'sunflower', 'ranunculus', 'anemone',
  'carnation', 'dahlia', 'orchid', 'zinnia', 'lavender', 'hydrangea', 'cosmos', 'gerbera',
] as const;
export type FlowerType = (typeof FLOWER_TYPES)[number];

export const FLOWER_LABELS: Record<FlowerType, string> = {
  mawar: 'Mawar', peony: 'Peony', tulip: 'Tulip', lily: 'Lily', spider: 'Spider lily',
  daisy: 'Daisy', sunflower: 'Sunflower', ranunculus: 'Ranunculus', anemone: 'Anemone',
  carnation: 'Carnation', dahlia: 'Dahlia', orchid: 'Orchid', zinnia: 'Zinnia',
  lavender: 'Lavender', hydrangea: 'Hydrangea', cosmos: 'Cosmos', gerbera: 'Gerbera',
};

/** 8 preset colors per flower type; the first one is the default. */
export const FLOWER_PRESETS: Record<FlowerType, string[]> = {
  mawar: ['#D9343F', '#B0263B', '#E0505E', '#F2A7B8', '#FBE3E1', '#F5C46A', '#F28C5A', '#7A1B32'],
  peony: ['#F2A7B8', '#F7C4CF', '#E86A8E', '#FBE9EC', '#C2405A', '#F6C9A8', '#E8B4D8', '#D9343F'],
  tulip: ['#F26B1D', '#F58A3A', '#E0505E', '#F5C52B', '#F2A7B8', '#FBF4EA', '#9A3FA0', '#B0263B'],
  lily: ['#F29BB8', '#EC86A9', '#FBF4EA', '#F5C46A', '#F28C5A', '#8C7BD1', '#E0505E', '#F7C4CF'],
  spider: ['#E0485A', '#B0263B', '#FBF4EA', '#F5C46A', '#F29BB8', '#F26B1D', '#8C7BD1', '#7A1B32'],
  daisy: ['#CFE0E4', '#D8E6D9', '#FBF4EA', '#F7C4CF', '#F5D77A', '#C9C1E8', '#F2A7B8', '#A9DCD6'],
  sunflower: ['#F5C52B', '#F2A93B', '#F5D77A', '#E8862A', '#C9562A', '#F7E3A0', '#E0B23A', '#B0263B'],
  ranunculus: ['#F59A7E', '#F7C4CF', '#F5C52B', '#E0505E', '#FBF4EA', '#F26B1D', '#C2405A', '#E8B4D8'],
  anemone: ['#A9DCD6', '#FBF4EA', '#E0505E', '#8C7BD1', '#F2A7B8', '#2B3A5E', '#F5C46A', '#B0263B'],
  carnation: ['#F7A9A0', '#E0505E', '#F2A7B8', '#FBF4EA', '#D9343F', '#F5C46A', '#E8B4D8', '#7A1B32'],
  dahlia: ['#B0263B', '#D9343F', '#F28C5A', '#F2A7B8', '#F5C52B', '#7A1B32', '#E86A8E', '#FBF4EA'],
  orchid: ['#E9A6D8', '#FBF4EA', '#B985C9', '#F2A7B8', '#8C7BD1', '#F5C46A', '#E0505E', '#C2405A'],
  zinnia: ['#EC4FA8', '#F26B1D', '#E0505E', '#F5C52B', '#F2A7B8', '#B0263B', '#F59A7E', '#FBF4EA'],
  lavender: ['#9A86CC', '#8C7BD1', '#B9A7E0', '#7A5DB0', '#C9C1E8', '#E8B4D8', '#6A5AA8', '#A9DCD6'],
  hydrangea: ['#9DB8E6', '#B9A7E0', '#F2A7B8', '#A9DCD6', '#FBF4EA', '#8C7BD1', '#E8B4D8', '#7FB8B0'],
  cosmos: ['#F4B6CC', '#EC4FA8', '#FBF4EA', '#E0505E', '#F5C52B', '#F26B1D', '#B0263B', '#C9C1E8'],
  gerbera: ['#F7873B', '#F5C52B', '#EC4FA8', '#E0505E', '#F2A7B8', '#FBF4EA', '#B0263B', '#F26B1D'],
};

export const GREENERY_TYPES = ['eucalyptus', 'babysbreath', 'fern', 'ruscus', 'olive', 'monstera'] as const;
export type GreeneryType = (typeof GREENERY_TYPES)[number];
export const GREENERY_LABELS: Record<GreeneryType, string> = {
  eucalyptus: 'Eucalyptus', babysbreath: "Baby's breath", fern: 'Fern', ruscus: 'Ruscus', olive: 'Olive', monstera: 'Monstera',
};

export const WRAP_PAPERS = ['kraft', 'linen', 'tissue', 'newspaper', 'satin', 'clear'] as const;
export type WrapPaper = (typeof WRAP_PAPERS)[number];
export const WRAP_LABELS: Record<WrapPaper, string> = {
  kraft: 'Kraft', linen: 'Linen', tissue: 'Tissue berlapis', newspaper: 'Koran vintage', satin: 'Satin', clear: 'Transparan',
};
export const WRAP_COLORS = ['#D9B48A', '#F1C9CF', '#E8E2D6', '#FBF4EA', '#2A0710', '#7A1B32', '#C9D6C3', '#E9D8C4'];

export const RIBBON_STYLES = ['bow', 'long', 'twine'] as const;
export type RibbonStyle = (typeof RIBBON_STYLES)[number];
export const RIBBON_LABELS: Record<RibbonStyle, string> = { bow: 'Simpul', long: 'Pita panjang', twine: 'Tali rami' };
export const RIBBON_COLORS = ['#B4233F', '#7A1B32', '#C9A36A', '#FBF4EA', '#C25B72', '#2A0710', '#8C7BD1', '#A88B5C'];

export const LETTER_FONTS = ['caveat', 'dancing', 'homemade', 'greatvibes', 'kalam'] as const;
export type LetterFont = (typeof LETTER_FONTS)[number];
export const FONT_LABELS: Record<LetterFont, string> = {
  caveat: 'Caveat', dancing: 'Dancing Script', homemade: 'Homemade Apple', greatvibes: 'Great Vibes', kalam: 'Kalam',
};
/** CSS variable set by next/font in the root layout, plus a size factor so all fonts read at a similar size. */
export const FONT_CSS: Record<LetterFont, { family: string; scale: number }> = {
  caveat: { family: 'var(--font-caveat)', scale: 1 },
  dancing: { family: 'var(--font-dancing)', scale: 0.9 },
  homemade: { family: 'var(--font-homemade)', scale: 0.7 },
  greatvibes: { family: 'var(--font-greatvibes)', scale: 1 },
  kalam: { family: 'var(--font-kalam)', scale: 0.8 },
};

export const LETTER_PAPERS = ['plain', 'lined', 'aged', 'deckled'] as const;
export type LetterPaper = (typeof LETTER_PAPERS)[number];
export const PAPER_LABELS: Record<LetterPaper, string> = { plain: 'Polos', lined: 'Bergaris', aged: 'Kertas tua', deckled: 'Deckled edge' };

export const TEXT_SIZES = ['sm', 'md', 'lg'] as const;
export type TextSize = (typeof TEXT_SIZES)[number];
export const TEXT_SIZE_LABELS: Record<TextSize, string> = { sm: 'Kecil', md: 'Sedang', lg: 'Besar' };
export const TEXT_SIZE_PX: Record<TextSize, number> = { sm: 22, md: 25, lg: 28 };

export const SEAL_MOTIFS = ['heart', 'initial', 'rose', 'star', 'moon', 'infinity'] as const;
export type SealMotif = (typeof SEAL_MOTIFS)[number];
export const SEAL_LABELS: Record<SealMotif, string> = {
  heart: 'Hati', initial: 'Inisial', rose: 'Mawar', star: 'Bintang', moon: 'Bulan', infinity: 'Infinity',
};
export const ENVELOPE_COLORS = ['#7A1B32', '#5A1224', '#C25B72', '#E9D8C4', '#F1C9CF', '#2A0710', '#3F4E6B', '#C9D6C3'];
export const SEAL_COLORS = ['#A3132E', '#C9A36A', '#2A0710', '#E8B7C1', '#3F4E6B', '#1F5A43'];

export const PETAL_COLORS = ['#E8B7C1', '#C25B72', '#FBF4EA', '#C9A36A'];

export const MAX_MUSIC_BYTES = 10 * 1024 * 1024;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const MIN_STEMS = 3;
export const MAX_STEMS = 15;
