/**
 * The item catalogue, and the rules for owning and wearing items.
 *
 * Pure functions over data, like the quest engine — no storage, no React — so
 * the unlock ladder can be tested without a browser.
 *
 * Items are earned by **weeks of unbroken streak**, never bought and never
 * awarded for XP (there is no XP). The ladder is front-loaded on purpose: the
 * first reward lands after a single week, because a player who sees nothing for
 * a month has no reason to believe the rewards exist at all.
 */

import { ITEM_SLOTS, type Item, type ItemSlot, type OwnedItem } from '../types';

/**
 * The fixed catalogue. Bundled, never written at runtime — the same for
 * everyone, like the quest library.
 *
 * `artAssetRef` names a drawing in `components/ItemArt.tsx`. Nothing here
 * points at an image file, so there is no art pipeline and no missing-asset
 * state to design for.
 */
export const ITEMS: Item[] = [
  {
    id: 'circlet-first-light',
    name: 'Circlet of First Light',
    type: 'crown',
    artAssetRef: 'circlet',
    flavor: 'A single week, and the forest already knows your name.',
    unlockAtStreakWeeks: 1,
  },
  {
    id: 'branchwood-wand',
    name: 'Branchwood Wand',
    type: 'staff',
    artAssetRef: 'wand',
    flavor: 'Cut from a bough that fell on its own. It would not be rushed either.',
    unlockAtStreakWeeks: 2,
  },
  {
    id: 'mantle-still-air',
    name: 'Mantle of Still Air',
    type: 'cloak',
    artAssetRef: 'mantle',
    flavor: 'Three weeks of turning up. Nothing hurries you now.',
    unlockAtStreakWeeks: 3,
  },
  {
    id: 'emberwing-moth',
    name: 'Emberwing Moth',
    type: 'familiar',
    artAssetRef: 'moth',
    flavor: 'It found you. Moths go where the light is steady.',
    unlockAtStreakWeeks: 4,
  },
  {
    id: 'robe-deep-green',
    name: 'Robe of Deep Green',
    type: 'robe',
    artAssetRef: 'robe',
    flavor: 'Embroidered in gold thread, one stitch for every morning.',
    unlockAtStreakWeeks: 6,
  },
  {
    id: 'sigil-quiet-hour',
    name: 'Sigil of the Quiet Hour',
    type: 'aura',
    artAssetRef: 'sigil',
    flavor: 'A spell, not a garment. It holds the hour open while you work.',
    unlockAtStreakWeeks: 8,
  },
  {
    id: 'dusk-petal-wings',
    name: 'Dusk Petal Wings',
    type: 'wings',
    artAssetRef: 'wings',
    flavor: 'Ten weeks. The blossom stopped falling and settled on you instead.',
    unlockAtStreakWeeks: 10,
  },
  {
    id: 'crown-long-vigil',
    name: 'Crown of the Long Vigil',
    type: 'crown',
    artAssetRef: 'crown',
    flavor: 'Worn only by those who kept going when no one was counting.',
    unlockAtStreakWeeks: 12,
  },
];

export const itemById = (id: string): Item | undefined => ITEMS.find((i) => i.id === id);

/** Catalogue order for display: soonest unlock first, so the next goal is top-left. */
export const ladder = (): Item[] =>
  [...ITEMS].sort((a, b) => a.unlockAtStreakWeeks - b.unlockAtStreakWeeks);

/* -------------------------------------------------------------- ownership */

export const ownedRecord = (items: OwnedItem[], id: string): OwnedItem | undefined =>
  items.find((o) => o.itemId === id);

export const owns = (items: OwnedItem[], id: string): boolean =>
  ownedRecord(items, id)?.owned === true;

export const isEquipped = (items: OwnedItem[], id: string): boolean => {
  const record = ownedRecord(items, id);
  return record?.owned === true && record.equipped;
};

/**
 * Hand over everything the streak has earned.
 *
 * Granting is one-way: an item earned at seven days stays earned when the
 * streak breaks. Losing the thing you worked for because you missed a Tuesday
 * would punish the exact person the rewards are meant to encourage.
 *
 * Returns the newly granted items separately so a caller can announce them —
 * and so a caller that is merely reconciling (app start, an old save) can
 * ignore them and grant in silence.
 */
export function grantItems(
  items: OwnedItem[],
  streakWeeks: number,
): { items: OwnedItem[]; granted: Item[] } {
  const granted = ITEMS.filter(
    (i) => i.unlockAtStreakWeeks <= streakWeeks && !owns(items, i.id),
  );
  if (granted.length === 0) return { items, granted: [] };

  const next = [...items];
  for (const item of granted) {
    const at = next.findIndex((o) => o.itemId === item.id);
    const record: OwnedItem = { itemId: item.id, owned: true, equipped: false };
    if (at >= 0) next[at] = { ...next[at], ...record };
    else next.push(record);
  }
  return { items: next, granted };
}

/**
 * Put an item on.
 *
 * Several items can be worn at once — that is the point of slots. But two
 * crowns at once is not a style choice, it is a drawing bug, so equipping
 * replaces whatever already occupies the same slot. Across slots nothing is
 * exclusive: hat, robe and staff together is the intended outfit.
 */
export function equipItem(items: OwnedItem[], id: string): OwnedItem[] {
  const item = itemById(id);
  if (!item || !owns(items, id)) return items;

  const sameSlot = new Set(
    ITEMS.filter((i) => i.type === item.type).map((i) => i.id),
  );

  return items.map((o) =>
    o.itemId === id
      ? { ...o, equipped: true }
      : sameSlot.has(o.itemId)
        ? { ...o, equipped: false }
        : o,
  );
}

export function unequipItem(items: OwnedItem[], id: string): OwnedItem[] {
  return items.map((o) => (o.itemId === id ? { ...o, equipped: false } : o));
}

/** What she is wearing, back to front — ready to paint in order. */
export function equippedItems(items: OwnedItem[]): Item[] {
  const slotOrder = (slot: ItemSlot) => ITEM_SLOTS.indexOf(slot);
  return ITEMS.filter((i) => isEquipped(items, i.id)).sort(
    (a, b) => slotOrder(a.type) - slotOrder(b.type),
  );
}

/* ----------------------------------------------------------------- goals */

/** The next thing to work towards, or null once everything is earned. */
export const nextUnlock = (items: OwnedItem[]): Item | null =>
  ladder().find((i) => !owns(items, i.id)) ?? null;

/** Whole days still to go before `item` is earned, given the current streak. */
export const daysUntil = (item: Item, streakDays: number): number =>
  Math.max(0, item.unlockAtStreakWeeks * 7 - streakDays);
