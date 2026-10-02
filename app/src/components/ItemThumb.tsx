/**
 * One item on its own, for the inventory grid.
 *
 * It is the very same drawing that appears on the figure — cropped to the
 * item's `focus` rectangle instead of redrawn at icon size. The aspect ratio is
 * preserved, so the staff stays tall and thin rather than being squashed into
 * its square slot; `preserveAspectRatio="none"` here would turn every circle
 * into an egg.
 */

import type { Item } from '../types';
import { drawingFor } from './ItemArt';

export function ItemThumb({ item, locked }: { item: Item; locked: boolean }) {
  const drawing = drawingFor(item.artAssetRef);
  if (!drawing) return null;

  const [x, y, w, h] = drawing.focus;

  return (
    <svg
      className={locked ? 'thumb locked' : 'thumb'}
      viewBox={`${x} ${y} ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {drawing.art}
    </svg>
  );
}
