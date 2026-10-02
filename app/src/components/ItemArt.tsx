/**
 * Every item, drawn.
 *
 * There are no image files. Each item is vector art in the same 200 × 300 space
 * as the sorceress herself, which buys two things: the drawing is crisp at any
 * size, and the *same* drawing serves both the figure and the inventory grid —
 * no second set of icons to keep in sync.
 *
 * An inventory slot shows the item alone, so each entry also declares a `focus`
 * rectangle: the part of the stage worth looking at. The slot uses it as a
 * viewBox and keeps the aspect ratio, so a tall staff renders tall and thin
 * rather than being squashed into a square.
 */

import type { ReactNode } from 'react';
import { HEM_PATH, ROBE_PATH } from './avatarPaths';

export interface Drawing {
  /** A fragment in avatar coordinates — place it, do not scale it. */
  art: ReactNode;
  /** [x, y, width, height]: the crop an inventory slot should show. */
  focus: readonly [number, number, number, number];
}

/* Mirrors a group about the centre line of the stage, so only one side of a
   symmetrical item has to be drawn by hand. */
const MIRROR = 'scale(-1,1) translate(-200,0)';

/* ----------------------------------------------------------------- crowns */

const circlet: Drawing = {
  focus: [76, 42, 48, 36],
  art: (
    <g>
      <path
        d="M 83 70 C 88 60, 112 60, 117 70"
        fill="none"
        stroke="url(#qs-gold)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 85 67 C 89 59, 111 59, 115 67"
        fill="none"
        stroke="#f6e3b4"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* One mint stone — the single cool accent the art direction allows. */}
      <circle cx="100" cy="61" r="5.5" fill="url(#qs-spark)" opacity="0.8" />
      <path d="M 100 55 L 103.4 61 L 100 67 L 96.6 61 Z" fill="url(#qs-mint)" />
      <circle cx="90" cy="64" r="1.4" fill="url(#qs-gold)" />
      <circle cx="110" cy="64" r="1.4" fill="url(#qs-gold)" />
    </g>
  ),
};

const crown: Drawing = {
  focus: [72, 30, 56, 48],
  art: (
    <g>
      <circle cx="100" cy="52" r="18" fill="url(#qs-spark)" opacity="0.35" />
      <path
        d="M 81 70 L 85 47 L 92.5 60 L 100 38 L 107.5 60 L 115 47 L 119 70 Z"
        fill="url(#qs-gold)"
        stroke="#7d5f26"
        strokeWidth="0.6"
      />
      <path
        d="M 80 69 C 87 75, 113 75, 120 69 L 119 65 C 112 70, 88 70, 81 65 Z"
        fill="url(#qs-gold)"
      />
      <path
        d="M 100 42 L 103 58 L 100 62 L 97 58 Z"
        fill="url(#qs-mint)"
      />
      <circle cx="86.5" cy="52" r="1.7" fill="#f0b9cb" />
      <circle cx="113.5" cy="52" r="1.7" fill="#f0b9cb" />
      <path
        d="M 85 47 L 92.5 60"
        stroke="#f6e3b4"
        strokeWidth="0.7"
        opacity="0.7"
        fill="none"
      />
    </g>
  ),
};

/* ------------------------------------------------------------------ staff */

const wand: Drawing = {
  focus: [112, 48, 40, 118],
  art: (
    <g>
      <path
        d="M 136 276 C 133 206, 130 138, 129 74"
        fill="none"
        stroke="url(#qs-gold)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M 135 274 C 132 206, 129 138, 128 76"
        fill="none"
        stroke="#f6e3b4"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* Two twigs it never bothered to shed. */}
      <path
        d="M 129 94 C 136 89, 140 82, 141 74"
        fill="none"
        stroke="url(#qs-gold)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M 130 110 C 123 105, 120 98, 119 90"
        fill="none"
        stroke="url(#qs-gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 131 148 C 137 144, 140 139, 141 133"
        fill="none"
        stroke="url(#qs-gold)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="129" cy="68" r="11" fill="url(#qs-spark)" opacity="0.75" />
      <circle cx="129" cy="68" r="4.2" fill="url(#qs-mint)" />
      <circle cx="127.8" cy="66.6" r="1.4" fill="#fffaf0" opacity="0.9" />
    </g>
  ),
};

/* ------------------------------------------------------------------ cloak */

const mantle: Drawing = {
  focus: [8, 96, 184, 200],
  art: (
    <g>
      {/* It has to be clearly wider and clearly lighter than the robe, or it
          hides behind it and the player sees nothing for their third week. */}
      <path
        d="M 100 104 C 70 106, 54 130, 42 172 C 32 214, 20 254, 13 284 Q 100 302 187 284 C 180 254, 168 214, 158 172 C 146 130, 130 106, 100 104 Z"
        fill="url(#qs-cloak)"
      />
      {/* Folds, so it hangs instead of looking like a sheet of card. */}
      <g stroke="#4d8775" strokeWidth="0.9" fill="none" opacity="0.45">
        <path d="M 66 124 C 54 166, 40 228, 32 280" />
        <path d="M 134 124 C 146 166, 160 228, 168 280" />
        <path d="M 83 114 C 74 164, 64 230, 58 286" />
        <path d="M 117 114 C 126 164, 136 230, 142 286" />
      </g>
      {/* A lit edge all the way round, the same rim of light the panels have. */}
      <path
        d="M 100 104 C 70 106, 54 130, 42 172 C 32 214, 20 254, 13 284 Q 100 302 187 284 C 180 254, 168 214, 158 172 C 146 130, 130 106, 100 104 Z"
        fill="none"
        stroke="url(#qs-gold-soft)"
        strokeWidth="1.3"
      />
      {/* The clasp at her throat. */}
      <circle cx="100" cy="110" r="4.6" fill="url(#qs-gold)" />
      <circle cx="100" cy="110" r="1.6" fill="url(#qs-mint)" />
    </g>
  ),
};

/* --------------------------------------------------------------- familiar */

const moth: Drawing = {
  focus: [120, 96, 62, 58],
  art: (
    <g>
      <circle cx="150" cy="125" r="20" fill="url(#qs-spark)" opacity="0.3" />
      <g transform="rotate(-12 150 125) translate(-2 -20)">
        {/* Upper wings, then lower — gold with a blossom edge. */}
        <path
          d="M 152 140 C 140 125, 126 126, 128 139 C 130 151, 144 149, 152 145 Z"
          fill="url(#qs-gold-soft)"
          stroke="#e9a3b8"
          strokeWidth="0.7"
        />
        <path
          d="M 152 140 C 164 125, 178 126, 176 139 C 174 151, 160 149, 152 145 Z"
          fill="url(#qs-gold-soft)"
          stroke="#e9a3b8"
          strokeWidth="0.7"
        />
        <path
          d="M 152 146 C 145 155, 136 159, 136 150 C 136 144, 146 143, 152 146 Z"
          fill="#e9a3b8"
          opacity="0.72"
        />
        <path
          d="M 152 146 C 159 155, 168 159, 168 150 C 168 144, 158 143, 152 146 Z"
          fill="#e9a3b8"
          opacity="0.72"
        />
        <ellipse cx="152" cy="146" rx="2.3" ry="7.6" fill="#2a1d16" />
        <circle cx="152" cy="139" r="2.4" fill="#3a2b22" />
        <path
          d="M 151 137 C 148 132, 145 130, 143 130"
          stroke="#3a2b22"
          strokeWidth="0.7"
          fill="none"
        />
        <path
          d="M 153 137 C 156 132, 159 130, 161 130"
          stroke="#3a2b22"
          strokeWidth="0.7"
          fill="none"
        />
        <circle cx="152" cy="150" r="1.1" fill="#f0d695" />
      </g>
    </g>
  ),
};

/* ------------------------------------------------------------------- robe */

const robe: Drawing = {
  focus: [36, 100, 128, 190],
  art: (
    <g>
      <path d={ROBE_PATH} fill="url(#qs-robe-deep)" />
      {/* Gold thread: a vine down the front, and a band at the hem. */}
      <g fill="none" stroke="url(#qs-gold-soft)" strokeWidth="1.1">
        <path d="M 100 160 C 95 190, 105 220, 98 246 C 94 262, 96 272, 100 280" />
        <path d="M 99 178 C 91 174, 87 168, 86 162" />
        <path d="M 102 202 C 110 198, 114 192, 115 186" />
        <path d="M 99 228 C 90 224, 85 218, 84 212" />
        <path d="M 101 252 C 110 248, 115 242, 116 236" />
      </g>
      <path
        d="M 50 258 C 74 268, 126 268, 150 258"
        fill="none"
        stroke="url(#qs-gold-soft)"
        strokeWidth="1.3"
      />
      <path d={HEM_PATH} fill="none" stroke="url(#qs-gold)" strokeWidth="1.6" />
      {/* Rim of light down both edges, as on the glass panels. */}
      <path
        d="M 88 152 C 72 190, 54 232, 42 272"
        fill="none"
        stroke="#f0d695"
        strokeWidth="0.9"
        opacity="0.4"
      />
      <path
        d="M 112 152 C 128 190, 146 232, 158 272"
        fill="none"
        stroke="#f0d695"
        strokeWidth="0.9"
        opacity="0.25"
      />
      <path
        d="M 76 112 C 84 105, 116 105, 124 112"
        fill="none"
        stroke="url(#qs-gold-soft)"
        strokeWidth="1.1"
      />
    </g>
  ),
};

/* ------------------------------------------------------------------- aura */

const sigil: Drawing = {
  focus: [2, 66, 196, 196],
  art: (
    <g className="sigil-ring" opacity="0.85">
      <circle
        cx="100"
        cy="170"
        r="88"
        fill="none"
        stroke="url(#qs-mint)"
        strokeWidth="1.6"
        opacity="0.8"
      />
      <circle
        cx="100"
        cy="170"
        r="79"
        fill="none"
        stroke="#6fd8c0"
        strokeWidth="0.7"
        strokeDasharray="3 9"
        opacity="0.7"
      />
      {/* Eight stones on the ring, and a rune tick between each pair. */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 100 164)`}>
          <path
            d="M 100 66 L 104 72 L 100 78 L 96 72 Z"
            fill="url(#qs-mint)"
            opacity="0.9"
          />
          <path
            d="M 100 88 L 100 96"
            stroke="#6fd8c0"
            strokeWidth="0.8"
            opacity="0.45"
          />
        </g>
      ))}
      <circle
        cx="100"
        cy="170"
        r="88"
        fill="none"
        stroke="#6fd8c0"
        strokeWidth="4"
        opacity="0.18"
        filter="url(#qs-glow)"
      />
    </g>
  ),
};

/* ------------------------------------------------------------------ wings */

const WING_HALF = (
  <g>
    <path
      d="M 98 120 C 72 90, 40 82, 26 97 C 36 120, 70 128, 98 130 Z"
      fill="url(#qs-wing)"
      stroke="#e9a3b8"
      strokeWidth="0.6"
      strokeOpacity="0.5"
    />
    <path
      d="M 98 130 C 70 130, 38 138, 30 158 C 50 170, 80 156, 98 142 Z"
      fill="url(#qs-wing)"
      stroke="#e9a3b8"
      strokeWidth="0.6"
      strokeOpacity="0.5"
    />
    <path
      d="M 98 142 C 76 150, 58 164, 58 182 C 76 184, 92 160, 99 150 Z"
      fill="url(#qs-wing)"
      stroke="#e9a3b8"
      strokeWidth="0.6"
      strokeOpacity="0.5"
    />
    <g stroke="#f0d695" strokeWidth="0.6" fill="none" opacity="0.45">
      <path d="M 97 124 C 74 104, 50 94, 30 96" />
      <path d="M 97 135 C 74 135, 50 144, 33 156" />
      <path d="M 97 146 C 78 154, 64 166, 60 179" />
    </g>
  </g>
);

const wings: Drawing = {
  focus: [18, 74, 164, 116],
  art: (
    <g>
      {WING_HALF}
      <g transform={MIRROR}>{WING_HALF}</g>
    </g>
  ),
};

/* --------------------------------------------------------------- registry */

/**
 * `artAssetRef` on an Item indexes this map. A ref with no drawing renders
 * nothing rather than throwing — a missing picture should never take the
 * screen down with it.
 */
export const DRAWINGS: Record<string, Drawing> = {
  circlet,
  crown,
  wand,
  mantle,
  moth,
  robe,
  sigil,
  wings,
};

export const drawingFor = (ref: string): Drawing | undefined => DRAWINGS[ref];
