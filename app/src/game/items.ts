/**
 * The wardrobe: sixty items, and the rules for owning and wearing them.
 *
 * Pure data and pure functions, like the quest engine — no storage, no React —
 * so the unlock ladder can be tested without a browser.
 *
 * Items are earned by **weeks of unbroken streak**, never bought and never
 * awarded for XP (there is no XP). The ladder is front-loaded on purpose: four
 * pieces land in the first week, because a player who sees nothing for a month
 * has no reason to believe the rewards exist at all.
 */

import type { ArtSpec } from '../components/ItemArt';
import { ITEM_SLOTS, type Item, type ItemSlot, type OwnedItem } from '../types';

/** The same as `Item`, with the art narrowed to something the renderer accepts. */
export interface WardrobeItem extends Item {
  art: ArtSpec;
}

const item = (
  id: string,
  name: string,
  type: ItemSlot,
  week: number,
  flavor: string,
  art: ArtSpec,
): WardrobeItem => ({
  id,
  name,
  type,
  unlockAtStreakWeeks: week,
  flavor,
  art,
  artAssetRef: art,
});

/**
 * The fixed catalogue. Bundled, never written at runtime — the same for
 * everyone, like the quest library.
 */
export const ITEMS: WardrobeItem[] = [
  /* ---------------------------------------------------------------- week 1 */
  item('circlet-first-light', 'Circlet of First Light', 'crown', 1,
    'A single week, and the forest already knows your name.',
    { kind: 'crown', metal: 'gold', gem: 'mint', points: 3, height: 10 }),
  item('robe-deep-green', 'Robe of Deep Green', 'robe', 1,
    'Embroidered in gold thread, one stitch for every morning.',
    { kind: 'robe', cloth: 'emerald', trim: 'gold', motif: 'vine' }),
  item('slippers-soft-moss', 'Soft Moss Slippers', 'shoes', 1,
    'Quiet enough that the wood does not notice you arrive.',
    { kind: 'shoes', cloth: 'moss', trim: 'bronze', height: 'low' }),
  item('motes-first-light', 'First Light', 'aura', 1,
    'Not a spell so much as a habit the air picked up from you.',
    { kind: 'aura', shape: 'motes', glow: 'amber' }),

  /* ---------------------------------------------------------------- week 2 */
  item('branchwood-wand', 'Branchwood Wand', 'staff', 2,
    'Cut from a bough that fell on its own. It would not be rushed either.',
    { kind: 'staff', metal: 'bronze', head: 'orb', glow: 'mint' }),
  item('emberwing-moth', 'Emberwing Moth', 'familiar', 2,
    'It found you. Moths go where the light is steady.',
    { kind: 'familiar', creature: 'moth', metal: 'gold', glow: 'blossom' }),
  item('wings-dusk-petal', 'Dusk Petal Wings', 'wings', 2,
    'The blossom stopped falling and settled on you instead.',
    { kind: 'wings', shape: 'petal', a: 'blossom', b: 'amber' }),
  item('hair-loose-waves', 'Loose Waves', 'hair', 2,
    'You stopped tying it back. Nobody minded.',
    { kind: 'hair', style: 'waves' }),

  /* ---------------------------------------------------------------- week 3 */
  item('mantle-still-air', 'Mantle of Still Air', 'cloak', 3,
    'Three weeks of turning up. Nothing hurries you now.',
    { kind: 'cloak', cloth: 'teal', edge: 'gold', clasp: 'mint', long: true }),
  item('boots-mosswalk', 'Mosswalk Boots', 'shoes', 3,
    'Laced to the ankle. Made for ground that gives a little.',
    { kind: 'shoes', cloth: 'leather', trim: 'bronze', height: 'mid' }),
  item('crown-leafwrought', 'Leafwrought Circlet', 'crown', 3,
    'Beaten thin enough that the veins still show.',
    { kind: 'crown', metal: 'verdigris', gem: 'mint', points: 5, height: 13 }),
  item('ring-quiet-hour', 'Sigil of the Quiet Hour', 'aura', 3,
    'A spell, not a garment. It holds the hour open while you work.',
    { kind: 'aura', shape: 'ring', glow: 'mint' }),

  /* ---------------------------------------------------------------- week 4 */
  item('hair-short-crop', 'The Short Crop', 'hair', 4,
    'Cut on an impulse at the end of a long week. It suited you.',
    { kind: 'hair', style: 'short' }),
  item('rod-riverstone', 'Riverstone Rod', 'staff', 4,
    'Worn smooth by water that had nowhere particular to be.',
    { kind: 'staff', metal: 'moonsteel', head: 'crystal', glow: 'ice' }),
  item('robe-ashen-habit', 'The Ashen Habit', 'robe', 4,
    'Plain on purpose. The work is the ornament.',
    { kind: 'robe', cloth: 'ash', trim: 'silver', motif: 'panels' }),
  item('familiar-hearth-sparrow', 'Hearth Sparrow', 'familiar', 4,
    'It stays for the warmth and pretends that is not why.',
    { kind: 'familiar', creature: 'bird', metal: 'bronze', glow: 'amber' }),

  /* ---------------------------------------------------------------- week 5 */
  item('wings-mothlight', 'Mothlight Wings', 'wings', 5,
    'Broad, soft, and completely silent. Built for dusk.',
    { kind: 'wings', shape: 'moth', a: 'amber', b: 'ember' }),
  item('cloak-travellers-wrap', "Traveller's Wrap", 'cloak', 5,
    'Short enough to run in. It has been run in.',
    { kind: 'cloak', cloth: 'leather', edge: 'bronze', clasp: 'amber', long: false }),
  item('shoes-laced-brogues', 'Laced Brogues', 'shoes', 5,
    'Polished by somebody who had time that week. That somebody was you.',
    { kind: 'shoes', cloth: 'wine', trim: 'gold', height: 'low' }),
  item('crown-bramble', 'Bramble Crown', 'crown', 5,
    'Thorns included. You earned those as well.',
    { kind: 'crown', metal: 'obsidian', gem: 'ember', points: 7, height: 15 }),

  /* ---------------------------------------------------------------- week 6 */
  item('robe-plumwood', 'Plumwood Gown', 'robe', 6,
    'The colour of the hour after the sun has gone but the sky has not.',
    { kind: 'robe', cloth: 'plum', trim: 'rosegold', motif: 'stars' }),
  item('stave-crescent', 'Crescent Stave', 'staff', 6,
    'It only ever holds half the moon. The other half is somebody else’s.',
    { kind: 'staff', metal: 'silver', head: 'crescent', glow: 'ice' }),
  item('runes-six-weeks', 'Ring of Runes', 'aura', 6,
    'Twelve marks for twelve things you did not quit.',
    { kind: 'aura', shape: 'runes', glow: 'violet' }),
  item('familiar-cinder-cat', 'Cinder Cat', 'familiar', 6,
    'Arrived uninvited. Has no plans to leave.',
    { kind: 'familiar', creature: 'cat', metal: 'obsidian', glow: 'ember' }),

  /* ---------------------------------------------------------------- week 7 */
  item('hair-long-plait', 'The Long Plait', 'hair', 7,
    'Woven while thinking about something else entirely.',
    { kind: 'hair', style: 'braid' }),
  item('wings-leafwing', 'Leafwing', 'wings', 7,
    'Veined like something that grew rather than something that was made.',
    { kind: 'wings', shape: 'leaf', a: 'mint', b: 'amber' }),
  item('boots-ranger', 'Ranger’s Tall Boots', 'shoes', 7,
    'To the knee, and scuffed exactly where they should be.',
    { kind: 'shoes', cloth: 'leather', trim: 'gold', height: 'tall' }),
  item('crown-silver-diadem', 'Silver Diadem', 'crown', 7,
    'Cold to the touch and unreasonably flattering.',
    { kind: 'crown', metal: 'silver', gem: 'ice', points: 5, height: 12 }),

  /* ---------------------------------------------------------------- week 8 */
  item('robe-wine-vestment', 'Wine Vestment', 'robe', 8,
    'Deep enough to read as black until the light moves.',
    { kind: 'robe', cloth: 'wine', trim: 'gold', motif: 'vine' }),
  item('cloak-nightfall', 'Nightfall Cape', 'cloak', 8,
    'Two months in. You have stopped counting and started arriving.',
    { kind: 'cloak', cloth: 'ink', edge: 'moonsteel', clasp: 'ice', long: true }),
  item('sceptre-crystal', 'Crystal Sceptre', 'staff', 8,
    'Holds a light it did not make and refuses to say where it got it.',
    { kind: 'staff', metal: 'moonsteel', head: 'crystal', glow: 'violet' }),
  item('halo-of-ice', 'Halo of Ice', 'aura', 8,
    'The air goes quiet about a pace before you do.',
    { kind: 'aura', shape: 'halo', glow: 'ice' }),

  /* ---------------------------------------------------------------- week 9 */
  item('hair-topknot', 'The Topknot', 'hair', 9,
    'Out of the way, which is the entire argument for it.',
    { kind: 'hair', style: 'bun' }),
  item('familiar-dawn-fox', 'Dawn Fox', 'familiar', 9,
    'Seen only at the edges of the hour. Never twice in the same place.',
    { kind: 'familiar', creature: 'fox', metal: 'rosegold', glow: 'ember' }),
  item('wings-dragonveil', 'Dragonveil', 'wings', 9,
    'Strutted and angular. These are built to carry weight.',
    { kind: 'wings', shape: 'dragon', a: 'violet', b: 'ice' }),
  item('greaves-verdigris', 'Verdigris Greaves', 'shoes', 9,
    'Green with age before you ever put them on.',
    { kind: 'shoes', cloth: 'teal', trim: 'verdigris', height: 'tall' }),

  /* --------------------------------------------------------------- week 10 */
  item('crown-long-vigil', 'Crown of the Long Vigil', 'crown', 10,
    'Worn only by those who kept going when no one was counting.',
    { kind: 'crown', metal: 'gold', gem: 'mint', points: 5, height: 22 }),
  item('robe-ivory-rite', 'The Ivory Rite', 'robe', 10,
    'Impractical, undeniable, and seventy days in the making.',
    { kind: 'robe', cloth: 'ivory', trim: 'gold', motif: 'stars' }),
  item('staff-mooncaller', 'Mooncaller', 'staff', 10,
    'It does not call the moon. The moon turns up anyway.',
    { kind: 'staff', metal: 'silver', head: 'crescent', glow: 'mint' }),
  item('motes-ember', 'Ember Motes', 'aura', 10,
    'Sparks that do not burn and do not go out.',
    { kind: 'aura', shape: 'motes', glow: 'ember' }),

  /* --------------------------------------------------------------- week 12 */
  item('cloak-verdant-mantle', 'Verdant Mantle', 'cloak', 12,
    'Moss has started growing on the hem. You have decided to allow it.',
    { kind: 'cloak', cloth: 'moss', edge: 'verdigris', clasp: 'mint', long: true }),
  item('hair-falling-tail', 'The Falling Tail', 'hair', 12,
    'Gathered high and left to do as it likes.',
    { kind: 'hair', style: 'tail' }),
  item('wings-stormwing', 'Stormwing', 'wings', 12,
    'They arrived during a week you very nearly did not finish.',
    { kind: 'wings', shape: 'dragon', a: 'ice', b: 'violet' }),
  item('familiar-gilded-beetle', 'Gilded Beetle', 'familiar', 12,
    'Slow, armoured, and entirely unbothered. A role model.',
    { kind: 'familiar', creature: 'beetle', metal: 'gold', glow: 'mint' }),

  /* --------------------------------------------------------------- week 14 */
  item('crown-obsidian-band', 'Obsidian Band', 'crown', 14,
    'Light goes in and does not come back out.',
    { kind: 'crown', metal: 'obsidian', gem: 'violet', points: 3, height: 11 }),
  item('robe-inkfold', 'Inkfold Robe', 'robe', 14,
    'Pleated so deeply it keeps its own shadows.',
    { kind: 'robe', cloth: 'ink', trim: 'moonsteel', motif: 'panels' }),
  item('shoes-rosegold-steps', 'Rosegold Steps', 'shoes', 14,
    'Nobody needs these. That is rather the point by now.',
    { kind: 'shoes', cloth: 'blossom', trim: 'rosegold', height: 'mid' }),
  item('staff-thornwood', 'Thornwood Staff', 'staff', 14,
    'Grown, not carved. It kept the thorns out of principle.',
    { kind: 'staff', metal: 'bronze', head: 'leaf', glow: 'ember' }),

  /* --------------------------------------------------------------- week 16 */
  item('cloak-bronze-shroud', 'Bronze Shroud', 'cloak', 16,
    'Heavy. You have grown strong enough not to notice.',
    { kind: 'cloak', cloth: 'ash', edge: 'bronze', clasp: 'amber', long: false }),
  item('wings-blossomfall', 'Blossomfall', 'wings', 16,
    'Four months of mornings, and the tree finally gave you something.',
    { kind: 'wings', shape: 'petal', a: 'blossom', b: 'violet' }),
  item('round-violet', 'The Violet Round', 'aura', 16,
    'It turns slowly, and so does everything inside it.',
    { kind: 'aura', shape: 'ring', glow: 'violet' }),
  item('familiar-wisp', 'The Wisp', 'familiar', 16,
    'Not quite a creature. It has opinions all the same.',
    { kind: 'familiar', creature: 'sprite', metal: 'moonsteel', glow: 'ice' }),
  item('hair-crown-braid', 'The Crown Braid', 'hair', 16,
    'Takes twenty minutes. You have twenty minutes now.',
    { kind: 'hair', style: 'braid' }),

  /* --------------------------------------------------------------- week 18 */
  item('crown-rosegold-tiara', 'Rosegold Tiara', 'crown', 18,
    'Warm metal, for somebody who stopped needing to be cold about it.',
    { kind: 'crown', metal: 'rosegold', gem: 'blossom', points: 7, height: 17 }),
  item('robe-mosslight', 'Mosslight Gown', 'robe', 18,
    'The exact green of the floor of the wood at four in the afternoon.',
    { kind: 'robe', cloth: 'moss', trim: 'verdigris', motif: 'vine' }),
  item('rod-obsidian', 'Obsidian Rod', 'staff', 18,
    'Absolutely plain, and nobody has ever asked twice about it.',
    { kind: 'staff', metal: 'obsidian', head: 'orb', glow: 'violet' }),
  item('boots-moonsteel', 'Moonsteel Boots', 'shoes', 18,
    'They ring faintly on stone. You have stopped apologising for it.',
    { kind: 'shoes', cloth: 'ink', trim: 'moonsteel', height: 'tall' }),

  /* --------------------------------------------------------------- week 20 */
  item('crown-moonsteel', 'Moonsteel Crown', 'crown', 20,
    'A hundred and forty days. There is no bigger number to reach for.',
    { kind: 'crown', metal: 'moonsteel', gem: 'ice', points: 9, height: 24 }),
  item('robe-tealight', 'Tealight Vestment', 'robe', 20,
    'Lit from inside, which by now is simply accurate.',
    { kind: 'robe', cloth: 'teal', trim: 'moonsteel', motif: 'stars' }),
  item('cloak-ivory-mantle', 'Ivory Mantle', 'cloak', 20,
    'Pale, enormous, and entirely unearned by anybody else.',
    { kind: 'cloak', cloth: 'ivory', edge: 'gold', clasp: 'amber', long: true }),
  item('ring-last-week', 'Ring of the Last Week', 'aura', 20,
    'The final spell. It does nothing at all except say you got here.',
    { kind: 'aura', shape: 'runes', glow: 'mint' }),
];

export const itemById = (id: string): WardrobeItem | undefined =>
  ITEMS.find((i) => i.id === id);

/** Catalogue order for display: soonest unlock first, so the next goal is top-left. */
export const ladder = (): WardrobeItem[] =>
  [...ITEMS].sort(
    (a, b) =>
      a.unlockAtStreakWeeks - b.unlockAtStreakWeeks ||
      ITEM_SLOTS.indexOf(a.type) - ITEM_SLOTS.indexOf(b.type),
  );

/** Everything that fills one slot, for the dressing room's rails. */
export const itemsInSlot = (slot: ItemSlot): WardrobeItem[] =>
  ladder().filter((i) => i.type === slot);

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
): { items: OwnedItem[]; granted: WardrobeItem[] } {
  const granted = ITEMS.filter(
    (i) => i.unlockAtStreakWeeks <= streakWeeks && !owns(items, i.id),
  );
  if (granted.length === 0) return { items, granted: [] };

  const next = [...items];
  for (const earned of granted) {
    const at = next.findIndex((o) => o.itemId === earned.id);
    const record: OwnedItem = { itemId: earned.id, owned: true, equipped: false };
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
 * exclusive: crown, robe, boots and staff together is the intended outfit.
 */
export function equipItem(items: OwnedItem[], id: string): OwnedItem[] {
  const wanted = itemById(id);
  if (!wanted || !owns(items, id)) return items;

  const sameSlot = new Set(ITEMS.filter((i) => i.type === wanted.type).map((i) => i.id));

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
export function equippedItems(items: OwnedItem[]): WardrobeItem[] {
  return ITEMS.filter((i) => isEquipped(items, i.id)).sort(
    (a, b) => ITEM_SLOTS.indexOf(a.type) - ITEM_SLOTS.indexOf(b.type),
  );
}

/** What is worn in one slot, if anything. */
export const equippedInSlot = (
  items: OwnedItem[],
  slot: ItemSlot,
): WardrobeItem | null => equippedItems(items).find((i) => i.type === slot) ?? null;

/* ----------------------------------------------------------------- goals */

/** The next thing to work towards, or null once everything is earned. */
export const nextUnlock = (items: OwnedItem[]): WardrobeItem | null =>
  ladder().find((i) => !owns(items, i.id)) ?? null;

/** Whole days still to go before `item` is earned, given the current streak. */
export const daysUntil = (i: Item, streakDays: number): number =>
  Math.max(0, i.unlockAtStreakWeeks * 7 - streakDays);
