/**
 * Painted art, when there is any.
 *
 * Every figure and every item can be replaced by an image without touching a
 * line of code: drop a file into `src/assets/avatar/` and it is picked up. Vite
 * resolves the whole folder at build time, so there is no manifest to maintain,
 * no script to remember to run, and no 404 on a file that does not exist yet.
 *
 * Anything with no image falls back to its vector drawing, per item. That is
 * the point: the wardrobe can be replaced one piece at a time, and the app is
 * never half-broken while that happens.
 *
 * Naming, and the alignment every image must share, are in
 * `design/AVATAR-ASSETS.md`.
 */

const FILES = import.meta.glob('../assets/avatar/**/*.{png,webp,jpg,jpeg,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/** `items/circlet-first-light.sorcerer` → the bundled URL for that file. */
const INDEX: Record<string, string> = {};
for (const [path, url] of Object.entries(FILES)) {
  const key = path
    .replace(/^.*\/assets\/avatar\//, '')
    .replace(/\.(png|webp|jpe?g|avif)$/i, '');
  INDEX[key] = url;
}

/**
 * The first of these keys that has a file, or null.
 *
 * Callers pass most specific first — a body-specific cut of a robe before the
 * shared one — so a single generic image keeps working until somebody bothers
 * to draw the variant.
 */
export const artUrl = (...keys: string[]): string | null => {
  for (const k of keys) if (INDEX[k]) return INDEX[k];
  return null;
};

/** How many painted files are installed. Used by the wardrobe's own diagnostics. */
export const artCount = (): number => Object.keys(INDEX).length;

/** Every key that resolved, for the asset-status panel in Preferences. */
export const artKeys = (): string[] => Object.keys(INDEX).sort();
