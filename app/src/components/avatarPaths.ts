/**
 * Geometry shared between the sorceress and the things she wears.
 *
 * Everything in the avatar is drawn in one 200 × 300 space, so an item's
 * coordinates mean the same thing whether it is painted on the figure or
 * cropped into an inventory slot. These constants are the handful of outlines
 * that more than one drawing needs — the robe, in particular, is drawn once by
 * the figure and again by the Robe of Deep Green laid over it.
 *
 * The silhouette is shoulders → waist → flared skirt rather than a single
 * taper. A straight cone from head to hem has no waist, and without a waist the
 * figure reads as a traffic cone wearing a face.
 */

/** The 200 × 300 stage every avatar drawing shares. */
export const STAGE = { w: 200, h: 300 } as const;

/** Her robe: shoulder line, in to the waist, then out to the hem. */
export const ROBE_PATH =
  'M 76 112 C 84 105, 116 105, 124 112 C 121 127, 114 140, 112 152 C 128 190, 146 232, 158 272 Q 100 288 42 272 C 54 232, 72 190, 88 152 C 86 140, 79 127, 76 112 Z';

/** The hem alone, for trim that follows it. */
export const HEM_PATH = 'M 42 272 Q 100 288 158 272';

/** The long hair that frames her face and falls behind her shoulders. */
export const HAIR_PATH =
  'M 100 48 C 76 48, 66 68, 69 94 C 72 128, 65 158, 58 180 C 76 176, 90 162, 94 138 L 106 138 C 110 162, 124 176, 142 180 C 135 158, 128 128, 131 94 C 134 68, 124 48, 100 48 Z';

/** The sorcerer's robe: the same garment, cut straight instead of flared. */
export const ROBE_PATH_M =
  'M 72 110 C 82 103, 118 103, 128 110 C 126 140, 128 190, 132 240 C 134 262, 136 272, 138 280 Q 100 292 62 280 C 64 272, 66 262, 68 240 C 72 190, 74 140, 72 110 Z';

export const HEM_PATH_M = 'M 62 280 Q 100 292 138 280';

/** Where a hand rests, so a staff can be put in one. */
export const HANDS = { left: { x: 71, y: 176 }, right: { x: 129, y: 176 } } as const;

/** The head, so a crown knows where to sit. */
export const HEAD = { cx: 100, cy: 76, rx: 17, ry: 20 } as const;
