/**
 * Every item, drawn.
 *
 * There are no image files. Each item is vector art in the same 200 × 300 space
 * as the figure, which buys two things: it is crisp at any size, and the *same*
 * drawing serves both the figure and the inventory grid — no second set of
 * icons to keep in sync.
 *
 * Items are not sixty bespoke drawings. They are nine parameterised families,
 * so a new crown is a line of data rather than a morning of path editing, and
 * every piece in the wardrobe is lit from the same direction by construction.
 *
 * An inventory slot shows the item alone, so each family declares a `focus`
 * rectangle: the part of the stage worth looking at. The slot uses it as a
 * viewBox and keeps the aspect ratio — a tall staff renders tall and thin
 * rather than squashed into a square.
 */

import type { ReactNode } from 'react';
import { GLOWS, clothId, metalId, type Cloth, type Glow, type Metal } from './palette';

/* ------------------------------------------------------------------ specs */

export type ArtSpec =
  | { kind: 'crown'; metal: Metal; gem: Glow; points: number; height: number }
  | {
      kind: 'hair';
      /** `swept` is the sorcerer's default cut and is not an unlockable item. */
      style: 'long' | 'braid' | 'short' | 'waves' | 'bun' | 'tail' | 'swept';
    }
  | { kind: 'robe'; cloth: Cloth; trim: Metal; motif: 'vine' | 'stars' | 'panels' | 'plain' }
  | { kind: 'cloak'; cloth: Cloth; edge: Metal; clasp: Glow; long: boolean }
  | { kind: 'shoes'; cloth: Cloth; trim: Metal; height: 'low' | 'mid' | 'tall' }
  | { kind: 'wings'; shape: 'petal' | 'moth' | 'dragon' | 'leaf'; a: Glow; b: Glow }
  | { kind: 'staff'; metal: Metal; head: 'orb' | 'crescent' | 'leaf' | 'crystal'; glow: Glow }
  | { kind: 'familiar'; creature: 'moth' | 'bird' | 'cat' | 'fox' | 'sprite' | 'beetle'; metal: Metal; glow: Glow }
  | { kind: 'aura'; shape: 'ring' | 'runes' | 'motes' | 'halo'; glow: Glow };

/**
 * What an item needs to know about the body wearing it: hair takes its colour
 * from the player rather than the item, and a robe has to follow the
 * silhouette of whichever figure is underneath it.
 */
export interface ArtContext {
  hair: { lit: string; dark: string };
  robePath: string;
  hemPath: string;
}

/** The crop an inventory slot shows, one per family. */
export const FOCUS: Record<ArtSpec['kind'], readonly [number, number, number, number]> = {
  crown: [70, 30, 60, 56],
  hair: [58, 34, 84, 116],
  robe: [36, 100, 128, 190],
  cloak: [8, 96, 184, 200],
  shoes: [60, 200, 80, 100],
  wings: [10, 68, 180, 134],
  staff: [106, 46, 48, 132],
  familiar: [116, 92, 68, 66],
  aura: [2, 64, 196, 198],
};

const MIRROR = 'scale(-1,1) translate(-200,0)';

/* ----------------------------------------------------------------- crowns */

function crown({ metal, gem, points, height }: Extract<ArtSpec, { kind: 'crown' }>) {
  const cx = 100;
  const half = 21;
  const base = 72;

  let d = `M ${cx - half} ${base}`;
  for (let i = 0; i < points; i += 1) {
    const mid = (i + 0.5) / points;
    const end = (i + 1) / points;
    // The centre spike is the tallest; the outer ones taper away from it.
    const fromCentre = Math.abs(mid - 0.5) * 2;
    const h = height * (1 - 0.45 * fromCentre);
    d += ` L ${(cx - half + 2 * half * mid).toFixed(1)} ${(base - h).toFixed(1)}`;
    d += ` L ${(cx - half + 2 * half * end).toFixed(1)} ${base}`;
  }
  d += ' Z';

  const gemY = base - height * 0.55;

  return (
    <g>
      <circle cx={cx} cy={gemY} r={height * 0.8} fill="url(#qs-spark)" opacity="0.3" />
      <path d={d} fill={metalId(metal)} filter="url(#qs-metal)" />
      <path
        d={`M ${cx - half - 1} ${base - 1} C ${cx - half + 5} ${base + 6}, ${cx + half - 5} ${base + 6}, ${cx + half + 1} ${base - 1} L ${cx + half} ${base - 5} C ${cx + half - 6} ${base + 1}, ${cx - half + 6} ${base + 1}, ${cx - half} ${base - 5} Z`}
        fill={metalId(metal)}
        filter="url(#qs-metal)"
      />
      <path
        d={`M ${cx} ${gemY - height * 0.3} L ${cx + 3.2} ${gemY} L ${cx} ${gemY + height * 0.3} L ${cx - 3.2} ${gemY} Z`}
        fill={GLOWS[gem]}
      />
      <circle cx={cx - half * 0.55} cy={base - 8} r="1.6" fill={GLOWS[gem]} opacity="0.75" />
      <circle cx={cx + half * 0.55} cy={base - 8} r="1.6" fill={GLOWS[gem]} opacity="0.75" />
    </g>
  );
}

/* ------------------------------------------------------------------- hair */

/* Each style is a mass behind the head plus a fringe over it. Both take the
   player's colour, so one style covers all eight. */
const HAIR_SHAPES: Record<
  Extract<ArtSpec, { kind: 'hair' }>['style'],
  { back: string; fringe: string; extra?: string }
> = {
  long: {
    back: 'M 100 48 C 76 48, 66 68, 69 94 C 72 128, 65 158, 58 180 C 76 176, 90 162, 94 138 L 106 138 C 110 162, 124 176, 142 180 C 135 158, 128 128, 131 94 C 134 68, 124 48, 100 48 Z',
    fringe: 'M 81 76 C 80 35, 120 35, 119 76 C 115 61, 107 64, 100 63 C 92 62, 85 65, 81 76 Z',
  },
  waves: {
    back: 'M 100 47 C 74 47, 64 69, 68 96 C 72 122, 60 138, 66 158 C 70 174, 58 182, 54 196 C 76 192, 92 170, 95 140 L 105 140 C 108 170, 124 192, 146 196 C 142 182, 130 174, 134 158 C 140 138, 128 122, 132 96 C 136 69, 126 47, 100 47 Z',
    fringe: 'M 80 78 C 80 34, 120 34, 120 76 C 116 62, 108 66, 100 64 C 91 62, 84 66, 80 78 Z',
  },
  short: {
    back: 'M 100 48 C 77 48, 67 68, 70 93 C 72 110, 68 120, 65 128 C 76 126, 84 118, 87 108 L 113 108 C 116 118, 124 126, 135 128 C 132 120, 128 110, 130 93 C 133 68, 123 48, 100 48 Z',
    fringe: 'M 81 74 C 81 34, 119 34, 119 73 C 114 60, 106 65, 99 63 C 91 61, 85 65, 81 74 Z',
  },
  braid: {
    back: 'M 100 48 C 77 48, 67 68, 70 94 C 72 120, 66 142, 61 158 C 74 155, 86 144, 92 126 L 108 126 C 112 144, 122 155, 136 158 C 131 142, 128 120, 130 94 C 133 68, 123 48, 100 48 Z',
    fringe: 'M 81 76 C 80 35, 120 35, 119 76 C 115 61, 107 64, 100 63 C 92 62, 85 65, 81 76 Z',
    // A plait falling over one shoulder, drawn as stacked lozenges.
    extra: 'M 128 118 L 134 126 L 128 134 L 122 126 Z M 128 134 L 134 142 L 128 150 L 122 142 Z M 128 150 L 133 157 L 128 164 L 123 157 Z M 128 164 L 132 170 L 128 176 L 124 170 Z',
  },
  bun: {
    back: 'M 100 50 C 79 50, 70 68, 72 92 C 73 106, 70 114, 67 122 C 77 120, 85 113, 88 104 L 112 104 C 115 113, 123 120, 133 122 C 130 114, 127 106, 128 92 C 130 68, 121 50, 100 50 Z',
    fringe: 'M 82 74 C 82 35, 118 35, 118 73 C 114 61, 106 65, 99 63 C 92 61, 86 65, 82 74 Z',
    extra: 'M 100 32 C 112 32, 118 40, 118 48 C 118 56, 110 61, 100 61 C 90 61, 82 56, 82 48 C 82 40, 88 32, 100 32 Z',
  },
  swept: {
    back: 'M 100 47 C 80 47, 71 63, 72 85 C 72.5 92, 71 96, 69 100 C 77 98, 83 93, 85.5 86 L 114.5 86 C 117 93, 123 98, 131 100 C 129 96, 127.5 92, 128 85 C 129 63, 120 47, 100 47 Z',
    fringe: 'M 79 72 C 80 33, 120 33, 121 70 C 117 60, 110 57, 102 59 C 94 61, 85 66, 79 72 Z',
  },
  tail: {
    back: 'M 100 48 C 78 48, 68 68, 71 93 C 72 108, 69 117, 66 125 C 77 123, 85 115, 88 106 L 112 106 C 115 115, 123 123, 134 125 C 131 117, 128 108, 129 93 C 132 68, 122 48, 100 48 Z',
    fringe: 'M 81 75 C 81 34, 119 34, 119 74 C 114 61, 107 65, 100 63 C 92 61, 85 65, 81 75 Z',
    extra: 'M 128 96 C 142 104, 150 124, 146 146 C 143 164, 134 176, 126 182 C 132 168, 136 150, 134 134 C 132 118, 128 106, 122 100 Z',
  },
};

function hair({ style }: Extract<ArtSpec, { kind: 'hair' }>, ctx: ArtContext) {
  const shape = HAIR_SHAPES[style];

  /* Individual strands, and a band of sheen across the crown. In the reference
     renders the sheen is the single most recognisable thing about the hair —
     more than the cut — so it gets drawn explicitly rather than left to a
     gradient. */
  const strands = (n: number, y0: number, y1: number) => (
    <g>
      {Array.from({ length: n }, (_, i) => {
        /* Irregular spacing and weight on purpose. Evenly spaced strands of
           equal weight read as corduroy, which is exactly what the first
           attempt looked like. */
        const t = (i + 0.5) / n;
        const jitter = Math.sin(i * 12.9898) * 0.5;
        const x = 70 + (t + jitter * 0.04) * 60;
        const sweep = (t - 0.5) * 26;
        return (
          <path
            key={i}
            d={`M ${x.toFixed(1)} ${y0} C ${(x + sweep * 0.3).toFixed(1)} ${y0 + (y1 - y0) * 0.35}, ${(x + sweep * 0.8).toFixed(1)} ${y0 + (y1 - y0) * 0.75}, ${(x + sweep).toFixed(1)} ${y1}`}
            fill="none"
            stroke={ctx.hair.lit}
            strokeWidth={0.5 + Math.abs(jitter) * 0.8}
            strokeLinecap="round"
            opacity={0.12 + 0.2 * Math.abs(Math.sin(i * 2.4))}
          />
        );
      })}
    </g>
  );

  return {
    back: (
      <g>
        <path d={shape.back} fill={ctx.hair.dark} />
        <clipPath id={`qs-hairclip-${style}`}>
          <path d={shape.back} />
        </clipPath>
        <g clipPath={`url(#qs-hairclip-${style})`}>
          <path d={shape.back} fill={ctx.hair.lit} opacity="0.2" transform="translate(-1.5,-2)" />
          {strands(9, 56, 178)}
          {/* The sheen band, around the CROWN of the head. Lower down it reads
              as a headband drawn across the forehead, which is what the first
              attempt looked like. */}
          <ellipse cx="100" cy="58" rx="27" ry="8" fill={ctx.hair.lit} opacity="0.2" filter="url(#qs-glow)" />
          <ellipse cx="100" cy="56" rx="17" ry="3.6" fill="#ffffff" opacity="0.13" filter="url(#qs-glow)" />
        </g>
        {shape.extra ? <path d={shape.extra} fill={ctx.hair.dark} /> : null}
        {shape.extra ? (
          <path d={shape.extra} fill={ctx.hair.lit} opacity="0.22" transform="translate(-1.5,-2)" />
        ) : null}
      </g>
    ),
    front: (
      <g>
        <path d={shape.fringe} fill={ctx.hair.dark} />
        <clipPath id={`qs-fringeclip-${style}`}>
          <path d={shape.fringe} />
        </clipPath>
        <g clipPath={`url(#qs-fringeclip-${style})`}>
          <path d={shape.fringe} fill={ctx.hair.lit} opacity="0.28" transform="translate(-1.5,-2)" />
          <ellipse cx="100" cy="60" rx="15" ry="3.4" fill="#ffffff" opacity="0.12" filter="url(#qs-glow)" />
        </g>
      </g>
    ),
  };
}

/* ------------------------------------------------------------------- robe */

const MOTIFS: Record<Extract<ArtSpec, { kind: 'robe' }>['motif'], ReactNode> = {
  vine: (
    <g fill="none" strokeWidth="1.1">
      <path d="M 100 160 C 95 190, 105 220, 98 246 C 94 262, 96 272, 100 280" />
      <path d="M 99 178 C 91 174, 87 168, 86 162" />
      <path d="M 102 202 C 110 198, 114 192, 115 186" />
      <path d="M 99 228 C 90 224, 85 218, 84 212" />
      <path d="M 101 252 C 110 248, 115 242, 116 236" />
    </g>
  ),
  stars: (
    <g strokeWidth="0.9">
      <path d="M 86 176 l 2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" />
      <path d="M 116 198 l 2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" />
      <path d="M 92 224 l 2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" />
      <path d="M 118 248 l 2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" />
      <path d="M 74 252 l 2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" />
    </g>
  ),
  panels: (
    <g fill="none" strokeWidth="1">
      <path d="M 92 154 C 86 192, 76 232, 68 268" />
      <path d="M 108 154 C 114 192, 124 232, 132 268" />
      <path d="M 100 154 L 100 278" />
    </g>
  ),
  plain: <g />,
};

function robe({ cloth, trim, motif }: Extract<ArtSpec, { kind: 'robe' }>, ctx: ArtContext) {
  return (
    <g>
      <path d={ctx.robePath} fill={clothId(cloth)} />
      <path d={ctx.robePath} fill="url(#qs-sheen)" />
      <g stroke={metalId(trim)} opacity="0.85" fill={metalId(trim)}>
        {MOTIFS[motif]}
      </g>
      <path
        d="M 50 258 C 74 268, 126 268, 150 258"
        fill="none"
        stroke={metalId(trim)}
        strokeWidth="1.3"
        opacity="0.8"
      />
      <path d={ctx.hemPath} fill="none" stroke={metalId(trim)} strokeWidth="1.8" />
      <path
        d="M 76 112 C 84 105, 116 105, 124 112"
        fill="none"
        stroke={metalId(trim)}
        strokeWidth="1.2"
      />
      {/* Rim of light down both edges, as on the glass panels. */}
      <path
        d="M 88 152 C 72 190, 54 232, 42 272"
        fill="none"
        stroke="#fff4d8"
        strokeWidth="0.9"
        opacity="0.3"
      />
      <path
        d="M 112 152 C 128 190, 146 232, 158 272"
        fill="none"
        stroke="#000"
        strokeWidth="2"
        opacity="0.18"
      />
    </g>
  );
}

/* ------------------------------------------------------------------ cloak */

function cloak({ cloth, edge, clasp, long }: Extract<ArtSpec, { kind: 'cloak' }>) {
  const d = long
    ? 'M 100 104 C 70 106, 54 130, 42 172 C 32 214, 20 254, 13 284 Q 100 302 187 284 C 180 254, 168 214, 158 172 C 146 130, 130 106, 100 104 Z'
    : 'M 100 104 C 74 106, 60 126, 50 160 C 42 192, 34 218, 29 238 Q 100 254 171 238 C 166 218, 158 192, 150 160 C 140 126, 126 106, 100 104 Z';
  const foldY = long ? 280 : 236;

  return (
    <g>
      <path d={d} fill={clothId(cloth)} />
      <path d={d} fill="url(#qs-sheen)" />
      <g stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.2" fill="none">
        <path d={`M 66 124 C 54 166, 40 ${foldY - 52}, 32 ${foldY}`} />
        <path d={`M 134 124 C 146 166, 160 ${foldY - 52}, 168 ${foldY}`} />
        <path d={`M 83 114 C 74 164, 64 ${foldY - 50}, 58 ${foldY + 6}`} />
        <path d={`M 117 114 C 126 164, 136 ${foldY - 50}, 142 ${foldY + 6}`} />
      </g>
      <path d={d} fill="none" stroke={metalId(edge)} strokeWidth="1.4" />
      <circle cx="100" cy="110" r="4.8" fill={metalId(edge)} filter="url(#qs-metal)" />
      <circle cx="100" cy="110" r="1.8" fill={GLOWS[clasp]} />
    </g>
  );
}

/* ------------------------------------------------------------------ shoes */

function shoes({ cloth, trim, height }: Extract<ArtSpec, { kind: 'shoes' }>) {
  const top = { low: 268, mid: 246, tall: 214 }[height];
  const rungs = { low: 0, mid: 3, tall: 5 }[height];

  const boot = (x: number) => (
    <g>
      {/* Shaft. */}
      <path
        d={`M ${x - 8} ${top} L ${x + 8} ${top} L ${x + 8} 276 L ${x - 8} 276 Z`}
        fill={clothId(cloth)}
      />
      {/* Foot: a toe box that widens below the ankle, which is what stops the
          whole thing reading as a length of pipe. */}
      <path
        d={`M ${x - 8} 274 L ${x + 8} 274 C ${x + 11} 280, ${x + 11} 286, ${x + 8} 288 L ${x - 8} 288 C ${x - 11} 286, ${x - 11} 280, ${x - 8} 274 Z`}
        fill={clothId(cloth)}
      />
      <path
        d={`M ${x - 8} ${top} L ${x + 8} ${top} L ${x + 8} 276 C ${x + 11} 281, ${x + 11} 286, ${x + 8} 288 L ${x - 8} 288 C ${x - 11} 286, ${x - 11} 281, ${x - 8} 276 Z`}
        fill="url(#qs-sheen)"
      />
      {/* Sole. */}
      <path
        d={`M ${x - 11.5} 288 L ${x + 11.5} 288 C ${x + 12} 291, ${x + 11} 292, ${x + 9} 292 L ${x - 9} 292 C ${x - 11} 292, ${x - 12} 291, ${x - 11.5} 288 Z`}
        fill={metalId(trim)}
      />
      {/* Cuff at the top, so the shaft has somewhere to end. */}
      <path
        d={`M ${x - 9} ${top - 3} L ${x + 9} ${top - 3} L ${x + 8.5} ${top + 3} L ${x - 8.5} ${top + 3} Z`}
        fill={metalId(trim)}
        filter="url(#qs-metal)"
      />
      {/* Laces. */}
      <g stroke={metalId(trim)} strokeWidth="0.9" opacity="0.85">
        {Array.from({ length: rungs }, (_, i) => {
          const y = top + 8 + i * ((268 - top) / Math.max(rungs, 1));
          return <path key={i} d={`M ${x - 5} ${y} L ${x + 5} ${y - 2}`} />;
        })}
      </g>
      <path
        d={`M ${x - 7} 280 C ${x} 283, ${x} 283, ${x + 7} 280`}
        fill="none"
        stroke={metalId(trim)}
        strokeWidth="0.9"
        opacity="0.7"
      />
    </g>
  );

  return (
    <g>
      {boot(88)}
      {boot(113)}
    </g>
  );
}

/* ------------------------------------------------------------------ wings */

const WING_HALVES: Record<Extract<ArtSpec, { kind: 'wings' }>['shape'], string[]> = {
  petal: [
    'M 98 120 C 72 90, 40 82, 26 97 C 36 120, 70 128, 98 130 Z',
    'M 98 130 C 70 130, 38 138, 30 158 C 50 170, 80 156, 98 142 Z',
    'M 98 142 C 76 150, 58 164, 58 182 C 76 184, 92 160, 99 150 Z',
  ],
  moth: [
    'M 98 118 C 74 84, 34 78, 22 102 C 14 124, 48 136, 98 132 Z',
    'M 98 134 C 60 134, 28 148, 30 172 C 34 192, 74 174, 98 150 Z',
  ],
  dragon: [
    'M 98 120 C 78 92, 48 72, 26 76 C 34 96, 32 112, 24 126 C 46 130, 74 128, 98 132 Z',
    'M 98 134 C 70 138, 44 148, 32 168 C 52 176, 76 162, 98 148 Z',
  ],
  leaf: [
    'M 98 122 C 80 94, 52 74, 30 80 C 36 108, 62 126, 98 132 Z',
    'M 98 134 C 66 140, 40 156, 34 178 C 58 180, 82 158, 98 146 Z',
    'M 98 146 C 78 156, 62 172, 62 188 C 78 188, 92 166, 99 154 Z',
  ],
};

const WING_VEINS: Record<Extract<ArtSpec, { kind: 'wings' }>['shape'], string[]> = {
  petal: ['M 97 124 C 74 104, 50 94, 30 96', 'M 97 135 C 74 135, 50 144, 33 156', 'M 97 146 C 78 154, 64 166, 60 179'],
  moth: ['M 97 123 C 72 100, 44 90, 26 100', 'M 97 139 C 66 142, 40 154, 34 168'],
  dragon: ['M 97 124 C 76 104, 50 86, 30 82', 'M 97 128 C 74 116, 50 106, 28 110', 'M 97 139 C 72 146, 48 156, 36 166'],
  leaf: ['M 97 126 C 78 106, 56 90, 34 85', 'M 97 139 C 70 146, 46 160, 38 174', 'M 97 149 C 80 160, 68 172, 64 185'],
};

function wings({ shape, a, b }: Extract<ArtSpec, { kind: 'wings' }>) {
  const half = (
    <g>
      {WING_HALVES[shape].map((d, i) => (
        <path
          key={i}
          d={d}
          fill={i % 2 === 0 ? GLOWS[a] : GLOWS[b]}
          fillOpacity="0.42"
          stroke={GLOWS[b]}
          strokeOpacity="0.55"
          strokeWidth="0.7"
        />
      ))}
      <g stroke="#fff4d8" strokeWidth="0.6" fill="none" opacity="0.45">
        {WING_VEINS[shape].map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </g>
  );

  return (
    <g>
      {half}
      <g transform={MIRROR}>{half}</g>
    </g>
  );
}

/* ------------------------------------------------------------------ staff */

function staff({ metal, head, glow }: Extract<ArtSpec, { kind: 'staff' }>) {
  const topY = 74;
  const heads: Record<typeof head, ReactNode> = {
    orb: (
      <>
        <circle cx="129" cy={topY - 6} r="11" fill="url(#qs-spark)" opacity="0.7" />
        <circle cx="129" cy={topY - 6} r="4.6" fill={GLOWS[glow]} />
      </>
    ),
    crescent: (
      <>
        <circle cx="129" cy={topY - 8} r="13" fill="url(#qs-spark)" opacity="0.5" />
        <path
          d="M 121 66 A 10 10 0 1 1 129 78 A 7.5 7.5 0 1 0 121 66 Z"
          fill={metalId(metal)}
          filter="url(#qs-metal)"
        />
        <circle cx="130" cy="72" r="2" fill={GLOWS[glow]} />
      </>
    ),
    leaf: (
      <>
        <circle cx="129" cy={topY - 6} r="12" fill="url(#qs-spark)" opacity="0.45" />
        <path
          d="M 129 58 C 137 64, 138 76, 129 82 C 120 76, 121 64, 129 58 Z"
          fill={GLOWS[glow]}
          fillOpacity="0.75"
          stroke={metalId(metal)}
          strokeWidth="1"
        />
        <path d="M 129 59 L 129 81" stroke={metalId(metal)} strokeWidth="0.8" />
      </>
    ),
    crystal: (
      <>
        <circle cx="129" cy={topY - 7} r="12" fill="url(#qs-spark)" opacity="0.55" />
        <path d="M 129 56 L 136 70 L 129 84 L 122 70 Z" fill={GLOWS[glow]} />
        <path d="M 129 56 L 136 70 L 129 70 Z" fill="#fff" opacity="0.35" />
      </>
    ),
  };

  return (
    <g>
      <path
        d={`M 136 276 C 133 206, 130 138, 129 ${topY + 8}`}
        fill="none"
        stroke={metalId(metal)}
        strokeWidth="3.6"
        strokeLinecap="round"
        filter="url(#qs-metal)"
      />
      <path d="M 129 94 C 136 89, 140 82, 141 74" fill="none" stroke={metalId(metal)} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 130 110 C 123 105, 120 98, 119 90" fill="none" stroke={metalId(metal)} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 131 148 C 137 144, 140 139, 141 133" fill="none" stroke={metalId(metal)} strokeWidth="1.3" strokeLinecap="round" />
      {heads[head]}
    </g>
  );
}

/* --------------------------------------------------------------- familiar */

function familiar({ creature, metal, glow }: Extract<ArtSpec, { kind: 'familiar' }>) {
  const bodies: Record<typeof creature, ReactNode> = {
    moth: (
      <g transform="rotate(-12 150 125)">
        <path d="M 150 120 C 138 105, 124 106, 126 119 C 128 131, 142 129, 150 125 Z" fill={metalId(metal)} stroke={GLOWS[glow]} strokeWidth="0.7" />
        <path d="M 150 120 C 162 105, 176 106, 174 119 C 172 131, 158 129, 150 125 Z" fill={metalId(metal)} stroke={GLOWS[glow]} strokeWidth="0.7" />
        <path d="M 150 126 C 143 135, 134 139, 134 130 C 134 124, 144 123, 150 126 Z" fill={GLOWS[glow]} opacity="0.72" />
        <path d="M 150 126 C 157 135, 166 139, 166 130 C 166 124, 156 123, 150 126 Z" fill={GLOWS[glow]} opacity="0.72" />
        <ellipse cx="150" cy="126" rx="2.3" ry="7.6" fill="#2a1d16" />
      </g>
    ),
    bird: (
      <g>
        <path d="M 150 132 C 142 128, 139 118, 144 110 C 150 102, 160 104, 163 112 C 166 121, 160 131, 150 132 Z" fill={metalId(metal)} />
        <path d="M 152 116 C 160 108, 172 106, 178 112 C 170 118, 160 122, 152 122 Z" fill={GLOWS[glow]} opacity="0.65" />
        <path d="M 149 134 C 150 142, 152 148, 156 152" stroke={metalId(metal)} strokeWidth="1.6" fill="none" />
        <circle cx="147" cy="112" r="1.5" fill="#1a1310" />
        <path d="M 141 114 L 136 116 L 141 118 Z" fill={GLOWS[glow]} />
      </g>
    ),
    cat: (
      <g>
        <path d="M 148 136 C 140 136, 136 128, 138 120 C 140 112, 150 110, 156 114 C 162 118, 162 132, 154 136 Z" fill={metalId(metal)} />
        <path d="M 139 118 L 137 108 L 145 114 Z" fill={metalId(metal)} />
        <path d="M 157 116 L 160 106 L 163 116 Z" fill={metalId(metal)} />
        <path d="M 156 136 C 166 136, 172 128, 170 118" stroke={metalId(metal)} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="144" cy="120" r="1.6" fill={GLOWS[glow]} />
        <circle cx="152" cy="119" r="1.6" fill={GLOWS[glow]} />
      </g>
    ),
    fox: (
      <g>
        <path d="M 148 136 C 139 135, 135 126, 139 118 C 143 110, 154 110, 158 116 C 162 122, 158 134, 148 136 Z" fill={metalId(metal)} />
        <path d="M 139 117 L 136 106 L 146 112 Z" fill={metalId(metal)} />
        <path d="M 157 114 L 161 104 L 164 115 Z" fill={metalId(metal)} />
        <path d="M 156 134 C 170 136, 178 124, 174 112 C 172 122, 164 130, 154 130 Z" fill={GLOWS[glow]} opacity="0.6" />
        <circle cx="144" cy="121" r="1.4" fill="#1a1310" />
      </g>
    ),
    sprite: (
      <g>
        <circle cx="150" cy="124" r="15" fill="url(#qs-spark)" opacity="0.5" />
        <circle cx="150" cy="124" r="5" fill={GLOWS[glow]} />
        <path d="M 150 110 C 156 116, 158 122, 150 124 C 142 122, 144 116, 150 110 Z" fill={GLOWS[glow]} opacity="0.5" />
        <circle cx="162" cy="134" r="2.2" fill={GLOWS[glow]} opacity="0.8" />
        <circle cx="138" cy="136" r="1.6" fill={GLOWS[glow]} opacity="0.65" />
        <circle cx="158" cy="108" r="1.4" fill={GLOWS[glow]} opacity="0.7" />
      </g>
    ),
    beetle: (
      <g>
        <ellipse cx="150" cy="126" rx="11" ry="13" fill={metalId(metal)} filter="url(#qs-metal)" />
        <path d="M 150 114 L 150 139" stroke={GLOWS[glow]} strokeWidth="1.2" />
        <ellipse cx="150" cy="112" rx="5" ry="4" fill={metalId(metal)} />
        <path d="M 147 108 C 143 102, 140 100, 137 100" stroke={metalId(metal)} strokeWidth="1" fill="none" />
        <path d="M 153 108 C 157 102, 160 100, 163 100" stroke={metalId(metal)} strokeWidth="1" fill="none" />
        <circle cx="150" cy="122" r="2.4" fill={GLOWS[glow]} />
      </g>
    ),
  };

  return (
    <g>
      <circle cx="150" cy="124" r="21" fill="url(#qs-spark)" opacity="0.26" />
      {bodies[creature]}
    </g>
  );
}

/* ------------------------------------------------------------------- aura */

function aura({ shape, glow }: Extract<ArtSpec, { kind: 'aura' }>) {
  const c = GLOWS[glow];

  if (shape === 'motes') {
    const seeds = [
      [40, 110, 2.6], [162, 128, 3.2], [58, 206, 2.2], [150, 212, 2.8],
      [34, 160, 2], [172, 176, 2.4], [74, 86, 1.8], [128, 74, 2.2],
      [26, 240, 2.4], [178, 244, 2], [92, 62, 1.6], [112, 258, 2.6],
    ];
    return (
      <g className="sigil-ring">
        {seeds.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r * 4} fill={c} opacity="0.1" />
            <circle cx={x} cy={y} r={r} fill={c} opacity="0.85" />
          </g>
        ))}
      </g>
    );
  }

  if (shape === 'halo') {
    return (
      <g>
        <circle cx="100" cy="164" r="86" fill={c} opacity="0.07" />
        <circle cx="100" cy="164" r="86" fill="none" stroke={c} strokeWidth="5" opacity="0.16" filter="url(#qs-glow)" />
        <circle cx="100" cy="164" r="86" fill="none" stroke={c} strokeWidth="1.2" opacity="0.65" />
      </g>
    );
  }

  const ticks = shape === 'runes' ? [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] : [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <g className="sigil-ring" opacity="0.9">
      <circle cx="100" cy="164" r="92" fill="none" stroke={c} strokeWidth="1.6" opacity="0.8" />
      <circle cx="100" cy="164" r="83" fill="none" stroke={c} strokeWidth="0.7" strokeDasharray="3 9" opacity="0.7" />
      {ticks.map((deg) => (
        <g key={deg} transform={`rotate(${deg} 100 164)`}>
          {shape === 'runes' ? (
            <path d="M 96 66 L 104 66 M 100 66 L 100 76 M 96 76 L 104 72" stroke={c} strokeWidth="1.1" fill="none" />
          ) : (
            <path d="M 100 66 L 104 72 L 100 78 L 96 72 Z" fill={c} opacity="0.9" />
          )}
          <path d="M 100 88 L 100 96" stroke={c} strokeWidth="0.8" opacity="0.45" />
        </g>
      ))}
      <circle cx="100" cy="164" r="92" fill="none" stroke={c} strokeWidth="4" opacity="0.18" filter="url(#qs-glow)" />
    </g>
  );
}

/* --------------------------------------------------------------- dispatch */

/**
 * Draw one item. Hair is the exception: it returns two layers, because a
 * fringe belongs in front of the face and the mass behind the head, and a
 * single node cannot be in both places.
 */
export function drawItem(spec: ArtSpec, ctx: ArtContext): ReactNode {
  switch (spec.kind) {
    case 'crown':
      return crown(spec);
    case 'hair':
      return hair(spec, ctx).back;
    case 'robe':
      return robe(spec, ctx);
    case 'cloak':
      return cloak(spec);
    case 'shoes':
      return shoes(spec);
    case 'wings':
      return wings(spec);
    case 'staff':
      return staff(spec);
    case 'familiar':
      return familiar(spec);
    case 'aura':
      return aura(spec);
  }
}

export const drawHair = (spec: Extract<ArtSpec, { kind: 'hair' }>, ctx: ArtContext) =>
  hair(spec, ctx);

export const focusFor = (spec: ArtSpec) => FOCUS[spec.kind];
