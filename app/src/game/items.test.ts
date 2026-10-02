/**
 * The unlock ladder. These rules decide whether a player's week of effort
 * actually turns into something, so none of them is left to a manual check.
 */

import { describe, expect, it } from 'vitest';
import {
  ITEMS,
  daysUntil,
  equipItem,
  equippedItems,
  grantItems,
  isEquipped,
  itemById,
  ladder,
  nextUnlock,
  owns,
  unequipItem,
} from './items';
import { FOCUS, drawItem } from '../components/ItemArt';
import { HAIR_SWATCHES } from '../types';
import { HEM_PATH, ROBE_PATH } from '../components/avatarPaths';
import { ITEM_SLOTS, type OwnedItem } from '../types';

describe('the catalogue', () => {
  it('has a unique id for every item', () => {
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(ITEMS.length);
  });

  it('has over fifty items', () => {
    expect(ITEMS.length).toBeGreaterThan(50);
  });

  /* An art spec that renders nothing would ship as an item that is owned,
     equippable, and completely invisible — which is why this is a test and not
     a comment. */
  it('draws something for every item', () => {
    const ctx = { hair: HAIR_SWATCHES.black, robePath: ROBE_PATH, hemPath: HEM_PATH };
    for (const item of ITEMS) {
      expect(drawItem(item.art, ctx), `nothing drawn for ${item.id}`).toBeTruthy();
      expect(FOCUS[item.art.kind], `no focus for ${item.id}`).toBeDefined();
    }
  });

  /* Every slot must be reachable in the wardrobe, or a rail tab opens on an
     empty rack. */
  it('fills every slot with at least two items', () => {
    for (const slot of ITEM_SLOTS) {
      expect(ITEMS.filter((i) => i.type === slot).length, slot).toBeGreaterThanOrEqual(2);
    }
  });

  it('gives the first week more than one piece, so day seven feels like an event', () => {
    expect(ITEMS.filter((i) => i.unlockAtStreakWeeks === 1).length).toBeGreaterThan(1);
  });

  it('only uses slots the figure knows how to paint', () => {
    for (const item of ITEMS) expect(ITEM_SLOTS).toContain(item.type);
  });

  it('unlocks the first item inside the first week', () => {
    expect(Math.min(...ITEMS.map((i) => i.unlockAtStreakWeeks))).toBe(1);
  });

  it('lists the soonest unlock first', () => {
    const weeks = ladder().map((i) => i.unlockAtStreakWeeks);
    expect([...weeks].sort((a, b) => a - b)).toEqual(weeks);
  });
});

describe('granting', () => {
  it('gives nothing before the first week is done', () => {
    expect(grantItems([], 0).granted).toEqual([]);
  });

  it('gives the first-week pieces at one week, and nothing later', () => {
    const { granted } = grantItems([], 1);
    expect(granted.length).toBeGreaterThan(0);
    for (const i of granted) expect(i.unlockAtStreakWeeks).toBe(1);
  });

  it('grants nothing a second time', () => {
    const first = grantItems([], 1);
    const second = grantItems(first.items, 1);
    expect(second.granted).toEqual([]);
    expect(second.items).toBe(first.items);
  });

  /* Someone who comes back after a long absence can cross several milestones in
     one completion. All of them are owed, not just the latest. */
  it('catches up every milestone passed at once', () => {
    const { granted } = grantItems([], 4);
    expect(new Set(granted.map((i) => i.unlockAtStreakWeeks))).toEqual(
      new Set([1, 2, 3, 4]),
    );
  });

  it('never takes an item back when the streak breaks', () => {
    const earned = grantItems([], 3).items;
    const after = grantItems(earned, 0);
    expect(after.granted).toEqual([]);
    expect(owns(after.items, 'circlet-first-light')).toBe(true);
  });

  it('hands items over unequipped, so the player chooses', () => {
    const { items } = grantItems([], 1);
    expect(isEquipped(items, 'circlet-first-light')).toBe(false);
  });
});

describe('equipping', () => {
  const earned = (weeks: number): OwnedItem[] => grantItems([], weeks).items;

  it('refuses an item that is not owned', () => {
    const items = earned(1);
    expect(isEquipped(equipItem(items, 'crown-long-vigil'), 'crown-long-vigil')).toBe(
      false,
    );
  });

  it('puts an owned item on', () => {
    const items = equipItem(earned(1), 'circlet-first-light');
    expect(isEquipped(items, 'circlet-first-light')).toBe(true);
  });

  /* Several items at once is the whole point of slots — SPEC.md section 3. */
  it('lets different slots be worn together', () => {
    let items = earned(4);
    items = equipItem(items, 'circlet-first-light');
    items = equipItem(items, 'branchwood-wand');
    items = equipItem(items, 'mantle-still-air');
    items = equipItem(items, 'boots-mosswalk');
    expect(equippedItems(items)).toHaveLength(4);
  });

  /* Two crowns at once is not a style choice, it is a drawing bug. */
  it('replaces whatever already occupies the same slot', () => {
    let items = earned(12);
    items = equipItem(items, 'circlet-first-light');
    items = equipItem(items, 'crown-long-vigil');
    expect(isEquipped(items, 'circlet-first-light')).toBe(false);
    expect(isEquipped(items, 'crown-long-vigil')).toBe(true);
  });

  it('takes an item off without disowning it', () => {
    let items = equipItem(earned(1), 'circlet-first-light');
    items = unequipItem(items, 'circlet-first-light');
    expect(isEquipped(items, 'circlet-first-light')).toBe(false);
    expect(owns(items, 'circlet-first-light')).toBe(true);
  });

  /* The cloak has to hang behind the robe however it was equipped. */
  it('returns what is worn in paint order, not the order it was put on', () => {
    let items = earned(12);
    items = equipItem(items, 'crown-long-vigil');
    items = equipItem(items, 'ring-quiet-hour');
    items = equipItem(items, 'mantle-still-air');
    items = equipItem(items, 'boots-mosswalk');
    expect(equippedItems(items).map((i) => i.type)).toEqual([
      'aura',
      'cloak',
      'shoes',
      'crown',
    ]);
  });
});

describe('the next goal', () => {
  it('points at the first week when nothing is owned', () => {
    expect(nextUnlock([])?.unlockAtStreakWeeks).toBe(1);
  });

  it('moves on once the first week is earned', () => {
    expect(nextUnlock(grantItems([], 1).items)?.unlockAtStreakWeeks).toBe(2);
  });

  it('runs out once everything is owned', () => {
    expect(nextUnlock(grantItems([], 99).items)).toBeNull();
  });

  it('counts the days left, and never below zero', () => {
    const wand = itemById('branchwood-wand')!;
    expect(daysUntil(wand, 0)).toBe(14);
    expect(daysUntil(wand, 13)).toBe(1);
    expect(daysUntil(wand, 20)).toBe(0);
  });
});
