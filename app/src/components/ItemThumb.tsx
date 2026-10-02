/**
 * One item on its own, for the inventory grid and the dressing room.
 *
 * It is the very same drawing that appears on the figure — cropped to its
 * family's `focus` rectangle instead of redrawn at icon size. The aspect ratio
 * is preserved, so a staff stays tall and thin rather than being squashed into
 * its square slot; `preserveAspectRatio="none"` here would turn every circle
 * into an egg.
 */

import { drawItem, focusFor, type ArtSpec } from './ItemArt';
import { HAIR_SWATCHES, type HairColor } from '../types';
import { HEM_PATH, ROBE_PATH } from './avatarPaths';

export function ItemThumb({
  art,
  locked,
  hairColor = 'black',
}: {
  art: ArtSpec;
  locked: boolean;
  hairColor?: HairColor;
}) {
  const [x, y, w, h] = focusFor(art);

  return (
    <svg
      className={locked ? 'thumb locked' : 'thumb'}
      viewBox={`${x} ${y} ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {drawItem(art, {
        hair: HAIR_SWATCHES[hairColor],
        robePath: ROBE_PATH,
        hemPath: HEM_PATH,
      })}
    </svg>
  );
}
