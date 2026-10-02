/**
 * One layer of the figure: a painted image if one has been installed for it,
 * otherwise the vector drawing.
 *
 * The fallback is per layer rather than all-or-nothing, so the wardrobe can be
 * repainted one piece at a time — a painted crown sits happily on a drawn
 * figure while the rest is still being made.
 */

import type { ReactNode } from 'react';
import { STAGE } from './avatarPaths';

export function ArtLayer({
  src,
  filter,
  children,
}: {
  /** A URL from `art/assets.ts`, or null when nothing has been installed. */
  src: string | null;
  /** Applied to the image only — used to tint greyscale hair. */
  filter?: string;
  /** The vector drawing, used when there is no image. */
  children: ReactNode;
}) {
  if (!src) return <>{children}</>;

  return (
    <image
      href={src}
      x="0"
      y="0"
      width={STAGE.w}
      height={STAGE.h}
      preserveAspectRatio="xMidYMid meet"
      filter={filter}
    />
  );
}
