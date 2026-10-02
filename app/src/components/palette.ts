/**
 * The colour ramps every item is built from.
 *
 * Each ramp is three tones of one material — lit face, body, shadow side —
 * because a single flat fill is what makes vector art read as a sticker. The
 * set is fixed and small so `AvatarDefs` can emit one gradient per ramp up
 * front and every drawing can reference it by id, rather than each item
 * minting its own gradient and colliding with the others.
 */

export interface Ramp {
  lit: string;
  mid: string;
  dark: string;
}

/** Hard materials: crowns, staves, buckles, clasps. */
export const METALS = {
  gold: { lit: '#f6e3b4', mid: '#c9a34e', dark: '#7d5f26' },
  silver: { lit: '#eef3f5', mid: '#b9c4cb', dark: '#5e6a72' },
  rosegold: { lit: '#f7cdbb', mid: '#d99d84', dark: '#85503c' },
  bronze: { lit: '#e8b98a', mid: '#a9732f', dark: '#5c3a15' },
  obsidian: { lit: '#73718a', mid: '#332f40', dark: '#11101a' },
  verdigris: { lit: '#a8e0cf', mid: '#4e9b86', dark: '#1d4a3e' },
  moonsteel: { lit: '#dbe8f5', mid: '#8fa8c4', dark: '#3d5068' },
} as const satisfies Record<string, Ramp>;

/** Soft materials: robes, cloaks, boot leather. */
export const CLOTHS = {
  emerald: { lit: '#43826d', mid: '#1f4a3d', dark: '#0a1a15' },
  plum: { lit: '#7f5e8c', mid: '#452f50', dark: '#17101e' },
  wine: { lit: '#96505c', mid: '#562830', dark: '#200e14' },
  ink: { lit: '#415071', mid: '#222b40', dark: '#0b0f17' },
  moss: { lit: '#6f8049', mid: '#3c4726', dark: '#141a0d' },
  ash: { lit: '#8e938e', mid: '#4e534e', dark: '#1b1e1b' },
  blossom: { lit: '#e9adc1', mid: '#a86278', dark: '#42222d' },
  dusk: { lit: '#73709f', mid: '#403e63', dark: '#171628' },
  ivory: { lit: '#f4edde', mid: '#c2b79c', dark: '#62594a' },
  teal: { lit: '#43909a', mid: '#1f4f57', dark: '#091d21' },
  leather: { lit: '#a9814f', mid: '#6b4a27', dark: '#2a1a0c' },
} as const satisfies Record<string, Ramp>;

/** Light sources: gems, orbs, spell rings, wing membranes. */
export const GLOWS = {
  mint: '#6fd8c0',
  blossom: '#e9a3b8',
  amber: '#f0b452',
  violet: '#b58ae0',
  ice: '#9fd6f5',
  ember: '#f07a4e',
} as const;

export type Metal = keyof typeof METALS;
export type Cloth = keyof typeof CLOTHS;
export type Glow = keyof typeof GLOWS;

export const metalId = (m: Metal) => `url(#qs-m-${m})`;
export const clothId = (c: Cloth) => `url(#qs-c-${c})`;
