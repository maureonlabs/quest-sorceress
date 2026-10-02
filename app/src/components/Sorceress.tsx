/**
 * The figure, and whatever it is wearing.
 *
 * Drawn rather than photographed, and deliberately featureless beyond a pair of
 * closed eyes: at this size a face with detail reads as a cartoon, while a calm
 * silhouette reads as the serene figure the art direction asks for.
 *
 * **This is the placeholder for a painted figure.** The whole body is one
 * `<g>`; swapping it for a raster image means replacing `Body` and nothing
 * else, because every item is positioned against the shared 200 × 300 stage
 * rather than against these paths.
 *
 * Items are not painted in the order they were earned — they are painted in
 * slot order, so a cloak hangs behind the robe and a crown sits over the hair,
 * whatever sequence the player equipped them in.
 */

import type { ReactNode } from 'react';
import { HAIR_SWATCHES, type BodyType, type HairColor, type ItemSlot } from '../types';
import type { WardrobeItem } from '../game/items';
import { drawHair, drawItem, type ArtContext, type ArtSpec } from './ItemArt';
import {
  HAIR_PATH,
  HEM_PATH,
  HEM_PATH_M,
  ROBE_PATH,
  ROBE_PATH_M,
  STAGE,
} from './avatarPaths';

/** Slots that belong behind the body: the spell, a cloak, then wings on top of
 *  it — a cloak is wide enough to swallow a pair of wings entirely, and wings
 *  nobody can see are a reward nobody feels. */
const BEHIND = new Set<ItemSlot>(['aura', 'cloak', 'wings']);
/** Slots painted over the finished figure. */
const IN_FRONT = new Set<ItemSlot>(['crown', 'staff', 'familiar']);

interface Props {
  bodyType: BodyType;
  hairColor: HairColor;
  equipped: readonly WardrobeItem[];
  /** Describes the figure for anyone who cannot see it. */
  label: string;
}

export function Sorceress({ bodyType, hairColor, equipped, label }: Props) {
  const feminine = bodyType === 'sorceress';
  const ctx: ArtContext = {
    hair: HAIR_SWATCHES[hairColor],
    robePath: feminine ? ROBE_PATH : ROBE_PATH_M,
    hemPath: feminine ? HEM_PATH : HEM_PATH_M,
  };

  const wearing = (slot: ItemSlot) => equipped.find((i) => i.type === slot) ?? null;

  const draw = (items: readonly WardrobeItem[]): ReactNode[] =>
    items.map((i) => <g key={i.id}>{drawItem(i.art, ctx)}</g>);

  const behind = draw(equipped.filter((i) => BEHIND.has(i.type)));
  const front = draw(equipped.filter((i) => IN_FRONT.has(i.type)));
  const robeItem = wearing('robe');
  const shoeItem = wearing('shoes');

  /* No hair item means the default long style, in the player's colour. */
  const hairItem = wearing('hair');
  const hairSpec = (hairItem?.art ?? { kind: 'hair', style: 'long' }) as Extract<
    ArtSpec,
    { kind: 'hair' }
  >;
  const hair = hairItem ? drawHair(hairSpec, ctx) : null;

  return (
    <svg
      className="sorceress"
      viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
      role="img"
      aria-label={label}
    >
      {/* Light pooling at the feet, the way it pools under the glass panels. */}
      <ellipse cx="100" cy="286" rx="80" ry="15" fill="url(#qs-pool)" />

      <g className="sorceress-figure">
        {behind}

        {hair ? hair.back : <path d={HAIR_PATH} fill={ctx.hair.dark} />}

        {/* Throat and shoulders, so the head is attached to a body. */}
        <path d="M 93 88 L 93 106 C 93 111, 107 111, 107 106 L 107 88 Z" fill="url(#qs-skin)" />
        <path
          d="M 93 100 C 96 106, 104 106, 107 100 L 107 106 C 107 111, 93 111, 93 106 Z"
          fill="#b8906d"
          opacity="0.45"
        />

        {/* Shoes go in front of the legs but behind whatever reaches the
            floor. A gown always does, so they sit under the whole body and
            only the foot shows below the hem; a tunic and trousers do not, so
            the boot is drawn over them and the shaft shows. Painting them on
            top in every case put knee boots on the outside of a ball gown. */}
        {feminine && shoeItem ? <g>{drawItem(shoeItem.art, ctx)}</g> : null}
        <Body feminine={feminine} dressed={robeItem !== null} />
        {!feminine && shoeItem ? <g>{drawItem(shoeItem.art, ctx)}</g> : null}
        {robeItem ? <g>{drawItem(robeItem.art, ctx)}</g> : null}

        <ellipse cx="100" cy="76" rx="17" ry="20" fill="url(#qs-skin)" />
        {hair ? (
          hair.front
        ) : (
          <path
            d="M 83 72 C 83 55, 117 55, 117 72 C 112 62, 106 66, 100 64 C 93 63, 87 64, 83 72 Z"
            fill={ctx.hair.dark}
          />
        )}

        {/* Eyes closed. Not watching you; listening to the wood. */}
        <path d="M 90 80 C 92 83, 95.5 83, 97.5 80" fill="none" stroke="#4a3326" strokeWidth="1" strokeLinecap="round" />
        <path d="M 102.5 80 C 104.5 83, 108 83, 110 80" fill="none" stroke="#4a3326" strokeWidth="1" strokeLinecap="round" />
        <ellipse cx="88" cy="86" rx="3.2" ry="2" fill="#e9a3b8" opacity="0.25" />
        <ellipse cx="112" cy="86" rx="3.2" ry="2" fill="#e9a3b8" opacity="0.25" />

        {front}
      </g>
    </svg>
  );
}

/**
 * The body under the clothes.
 *
 * `dressed` drops the default garment's own trim when a robe item is going to
 * be laid over it — two sets of gold hem braid at slightly different heights is
 * the kind of detail that reads as a rendering fault rather than as layering.
 */
function Body({ feminine, dressed }: { feminine: boolean; dressed: boolean }) {
  if (feminine) {
    return (
      <g>
        <path d={ROBE_PATH} fill="url(#qs-robe)" />
        {!dressed ? (
          <>
            <path
              d="M 76 112 C 84 105, 116 105, 124 112 C 121 127, 114 140, 112 152"
              fill="none"
              stroke="#f0d695"
              strokeWidth="0.8"
              opacity="0.3"
            />
            <path d={HEM_PATH} fill="none" stroke="url(#qs-gold-soft)" strokeWidth="1.2" />
          </>
        ) : null}

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
        {!dressed ? (
          <path
            d="M 88 150 C 96 154, 104 154, 112 150 L 112 157 C 104 161, 96 161, 88 157 Z"
            fill="url(#qs-gold-soft)"
            opacity="0.85"
          />
        ) : null}
      </g>
    );
  }

  return (
    <g>
      {/* Trousers first, so the tunic hangs over them. */}
      <path d="M 79 170 C 77 206, 77 250, 79 288 L 97 288 C 98 250, 99 208, 100 172 Z" fill="#14241f" />
      <path d="M 100 172 C 101 208, 102 250, 103 288 L 121 288 C 123 250, 123 206, 121 170 Z" fill="#101d19" />

      <path
        d="M 70 110 C 80 102, 120 102, 130 110 C 127 132, 125 156, 124 182 C 116 188, 84 188, 76 182 C 75 156, 73 132, 70 110 Z"
        fill="url(#qs-robe)"
      />
      {!dressed ? (
        <>
          <path
            d="M 76 182 C 90 188, 110 188, 124 182"
            fill="none"
            stroke="url(#qs-gold-soft)"
            strokeWidth="1.2"
          />
          <path
            d="M 84 148 C 94 152, 106 152, 116 148 L 116 156 C 106 160, 94 160, 84 156 Z"
            fill="url(#qs-gold-soft)"
            opacity="0.8"
          />
        </>
      ) : null}

      <path
        d="M 88 108 C 93 126, 107 126, 112 108 C 106 112, 94 112, 88 108 Z"
        fill="#0d1a16"
        opacity="0.8"
      />
      <path
        d="M 72 112 C 65 134, 62 158, 63 174 C 67 178, 75 177, 78 170 C 77 148, 78 128, 80 115 Z"
        fill="#27463d"
      />
      <path
        d="M 128 112 C 135 134, 138 158, 137 174 C 133 178, 125 177, 122 170 C 123 148, 122 128, 120 115 Z"
        fill="#1f3a32"
      />
      <ellipse cx="70" cy="180" rx="4.8" ry="6.2" fill="url(#qs-skin)" />
      <ellipse cx="130" cy="180" rx="4.8" ry="6.2" fill="url(#qs-skin)" />
    </g>
  );
}
