/**
 * The painted-art lookup. Thin, but it decides whether a figure renders at all,
 * and it is the one place a naming mistake would silently show the wrong thing.
 */

import { describe, expect, it } from 'vitest';
import { artCount, artKeys, artUrl } from './assets';
import { ITEMS } from '../game/items';

describe('painted art', () => {
  it('returns null for anything not installed', () => {
    expect(artUrl('items/not-a-real-item')).toBeNull();
  });

  it('agrees with itself about how much is installed', () => {
    expect(artKeys()).toHaveLength(artCount());
  });

  /* Every installed file must belong to something. A typo'd filename would
     otherwise sit in the folder looking installed and never render. */
  it('has no file that matches nothing in the app', () => {
    const ids = new Set(ITEMS.map((i) => i.id));
    const styles = new Set(
      ITEMS.filter((i) => i.type === 'hair').map((i) =>
        i.art.kind === 'hair' ? i.art.style : '',
      ),
    );
    styles.add('long');

    for (const key of artKeys()) {
      const [folder, rest] = [key.slice(0, key.indexOf('/')), key.slice(key.indexOf('/') + 1)];
      const base = rest.replace(/\.(sorceress|sorcerer)$/, '');

      if (folder === 'figures') expect(['sorceress', 'sorcerer']).toContain(base);
      else if (folder === 'items') expect(ids, `${key} names no item`).toContain(base);
      else if (folder === 'hair') expect(styles, `${key} names no style`).toContain(base);
      else throw new Error(`${key} is in no known folder`);
    }
  });
});
