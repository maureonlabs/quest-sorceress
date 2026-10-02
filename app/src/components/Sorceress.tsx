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
import { artUrl } from '../art/assets';
import { ArtLayer } from './ArtLayer';
import { Face } from './Face';
import { drawHair, drawItem, type ArtContext, type ArtSpec } from './ItemArt';
import {
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

/** `bust` crops to head and shoulders, the framing the reference renders use. */
const VIEWBOX = { full: `0 0 ${STAGE.w} ${STAGE.h}`, bust: '58 38 84 100' } as const;

interface Props {
  bodyType: BodyType;
  hairColor: HairColor;
  equipped: readonly WardrobeItem[];
  /** Describes the figure for anyone who cannot see it. */
  label: string;
  /**
   * How much of the figure to show. The whole wardrobe needs `full` — shoes and
   * a hem cannot be judged from a portrait — but the character screen leads
   * with `bust`, because that is where a face is worth looking at.
   */
  frame?: keyof typeof VIEWBOX;
}

export function Sorceress({ bodyType, hairColor, equipped, label, frame = 'full' }: Props) {
  const feminine = bodyType === 'sorceress';
  const ctx: ArtContext = {
    hair: HAIR_SWATCHES[hairColor],
    robePath: feminine ? ROBE_PATH : ROBE_PATH_M,
    hemPath: feminine ? HEM_PATH : HEM_PATH_M,
  };

  /* A portrait crop shows what a portrait shows. A staff, a pair of wings and
     a spell ring all extend well past the head, so in `bust` they arrive as
     stray fragments at the edge of the frame rather than as items. */
  const BUST_HIDES = new Set<ItemSlot>(['staff', 'wings', 'aura', 'shoes']);
  const visible =
    frame === 'bust' ? equipped.filter((i) => !BUST_HIDES.has(i.type)) : equipped;

  const wearing = (slot: ItemSlot) => visible.find((i) => i.type === slot) ?? null;

  /* A painted file for this item if one has been installed, preferring a cut
     made for this body over the shared one. */
  const imageFor = (id: string) => artUrl(`items/${id}.${bodyType}`, `items/${id}`);

  const draw = (items: readonly WardrobeItem[]): ReactNode[] =>
    items.map((i) => (
      <ArtLayer key={i.id} src={imageFor(i.id)}>
        <g>{drawItem(i.art, ctx)}</g>
      </ArtLayer>
    ));

  const behind = draw(visible.filter((i) => BEHIND.has(i.type)));
  const front = draw(visible.filter((i) => IN_FRONT.has(i.type)));
  const robeItem = wearing('robe');
  const shoeItem = wearing('shoes');

  /* No hair item means the default long style, in the player's colour. */
  const hairItem = wearing('hair');
  const hairSpec = (hairItem?.art ?? { kind: 'hair', style: 'long' }) as Extract<
    ArtSpec,
    { kind: 'hair' }
  >;
  /* Always routed through the same drawing, item or not, so the default style
     gets the same sheen and strands as anything unlocked. */
  const hair = drawHair(hairSpec, ctx);

  return (
    <svg className="sorceress" viewBox={VIEWBOX[frame]} role="img" aria-label={label}>
      {frame === 'full' ? (
        <>
          {/* A cast shadow offset away from the light, then the warm pool the
              panels sit in. Centred, the shadow reads as a glow; offset, it
              reads as a body standing on ground. */}
          <ellipse cx="108" cy="288" rx="62" ry="12" fill="url(#qs-shade)" />
          <ellipse cx="100" cy="286" rx="80" ry="15" fill="url(#qs-pool)" />
        </>
      ) : null}

      <g className="sorceress-figure">
        {behind}

        {hair.back}

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
        {feminine && shoeItem ? (
          <ArtLayer src={imageFor(shoeItem.id)}>
            <g>{drawItem(shoeItem.art, ctx)}</g>
          </ArtLayer>
        ) : null}

        <ArtLayer src={artUrl(`figures/${bodyType}`)}>
          <>
            <Body feminine={feminine} dressed={robeItem !== null} />
            <Face masculine={!feminine} />
          </>
        </ArtLayer>

        {!feminine && shoeItem ? (
          <ArtLayer src={imageFor(shoeItem.id)}>
            <g>{drawItem(shoeItem.art, ctx)}</g>
          </ArtLayer>
        ) : null}
        {robeItem ? (
          <ArtLayer src={imageFor(robeItem.id)}>
            <g>{drawItem(robeItem.art, ctx)}</g>
          </ArtLayer>
        ) : null}

        {/* The fringe, over the face. */}
        <ArtLayer
          src={hairItem ? artUrl(`hair/${hairSpec.style}`) : artUrl('hair/long')}
          filter={`url(#qs-hair-${hairColor})`}
        >
          <>{hair.front}</>
        </ArtLayer>

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
