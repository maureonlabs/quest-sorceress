/**
 * The sorceress herself, with whatever she is wearing.
 *
 * Drawn rather than photographed, and deliberately featureless beyond a pair of
 * closed eyes: at this size a face with detail reads as a cartoon, while a calm
 * silhouette reads as the serene figure the art direction asks for. Her robe is
 * the same frosted glass as the panels, lit from the upper left like everything
 * else in the wood.
 *
 * Items are not painted on top in the order they were earned — they are painted
 * in slot order, so a cloak hangs behind the robe and a crown sits over the
 * hair, whatever sequence the player equipped them in.
 */

import type { Item, ItemSlot } from '../types';
import { drawingFor } from './ItemArt';
import { HAIR_PATH, HEM_PATH, ROBE_PATH, STAGE } from './avatarPaths';

/** Slots that belong behind her: the spell ring, wings, a cloak. */
const BEHIND = new Set<ItemSlot>(['aura', 'wings', 'cloak']);
/** Slots painted over the finished figure. */
const IN_FRONT = new Set<ItemSlot>(['crown', 'staff', 'familiar']);

interface Props {
  equipped: readonly Item[];
  /** Describes the figure for anyone who cannot see it. */
  label: string;
}

export function Sorceress({ equipped, label }: Props) {
  const draw = (items: readonly Item[]) =>
    items.map((item) => {
      const drawing = drawingFor(item.artAssetRef);
      return drawing ? <g key={item.id}>{drawing.art}</g> : null;
    });

  const behind = draw(equipped.filter((i) => BEHIND.has(i.type)));
  const overRobe = draw(equipped.filter((i) => i.type === 'robe'));
  const front = draw(equipped.filter((i) => IN_FRONT.has(i.type)));

  return (
    <svg
      className="sorceress"
      viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
      role="img"
      aria-label={label}
    >
      {/* Light pooling at her feet, the way it pools under the glass panels. */}
      <ellipse cx="100" cy="280" rx="80" ry="16" fill="url(#qs-pool)" />

      <g className="sorceress-figure">
        {behind}

        <path d={HAIR_PATH} fill="url(#qs-hair)" />

        {/* Throat and shoulders, so the head is attached to a body. */}
        <path d="M 93 88 L 93 106 C 93 111, 107 111, 107 106 L 107 88 Z" fill="url(#qs-skin)" />
        <path
          d="M 93 100 C 96 106, 104 106, 107 100 L 107 106 C 107 111, 93 111, 93 106 Z"
          fill="#b8906d"
          opacity="0.45"
        />

        {/* The robe. An overlay item replaces its surface, not its shape. */}
        <path d={ROBE_PATH} fill="url(#qs-robe)" />
        {overRobe}
        {overRobe.length === 0 ? (
          <>
            <path
              d="M 76 112 C 84 105, 116 105, 124 112 C 121 127, 114 140, 112 152"
              fill="none"
              stroke="#f0d695"
              strokeWidth="0.8"
              opacity="0.3"
            />
            <path
              d={HEM_PATH}
              fill="none"
              stroke="url(#qs-gold-soft)"
              strokeWidth="1.2"
            />
          </>
        ) : null}

        {/* A shallow collar, which is most of what makes the bodice a bodice. */}
        <path
          d="M 86 109 C 92 124, 108 124, 114 109 C 108 112, 92 112, 86 109 Z"
          fill="#0d1a16"
          opacity="0.75"
        />

        {/* Bell sleeves, a shade LIGHTER than the robe — drawn darker they
            vanish into it and the hands read as two buttons on a cone. */}
        <path
          d="M 78 112 C 67 127, 61 147, 61 165 C 61 173, 76 175, 80 167 C 80 148, 82 128, 86 116 Z"
          fill="#27463d"
        />
        <path
          d="M 122 112 C 133 127, 139 147, 139 165 C 139 173, 124 175, 120 167 C 120 148, 118 128, 114 116 Z"
          fill="#1f3a32"
        />
        <ellipse cx="71" cy="176" rx="4.6" ry="6" fill="url(#qs-skin)" />
        <ellipse cx="129" cy="176" rx="4.6" ry="6" fill="url(#qs-skin)" />

        {/* A sash at the waist — the one line that says where the waist is. */}
        <path
          d="M 88 150 C 96 154, 104 154, 112 150 L 112 157 C 104 161, 96 161, 88 157 Z"
          fill="url(#qs-gold-soft)"
          opacity="0.85"
        />

        <ellipse cx="100" cy="76" rx="17" ry="20" fill="url(#qs-skin)" />
        {/* A fringe, which is what keeps the face from reading as a blank oval. */}
        <path
          d="M 83 72 C 83 55, 117 55, 117 72 C 112 62, 106 66, 100 64 C 93 63, 87 64, 83 72 Z"
          fill="url(#qs-hair)"
        />
        {/* Eyes closed. She is not watching you; she is listening to the wood. */}
        <path
          d="M 90 80 C 92 83, 95.5 83, 97.5 80"
          fill="none"
          stroke="#4a3326"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 102.5 80 C 104.5 83, 108 83, 110 80"
          fill="none"
          stroke="#4a3326"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <ellipse cx="88" cy="86" rx="3.2" ry="2" fill="#e9a3b8" opacity="0.25" />
        <ellipse cx="112" cy="86" rx="3.2" ry="2" fill="#e9a3b8" opacity="0.25" />

        {front}
      </g>
    </svg>
  );
}
