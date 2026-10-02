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
import { DRAWINGS } from '../components/ItemArt';
import { ITEM_SLOTS, type OwnedItem } from '../types';

describe('the catalogue', () => {
  it('has a unique id for every item', () => {
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(ITEMS.length);
  });

  /* A typo in artAssetRef would ship as an item that is owned, equippable, and
     completely invisible — which is why this is a test and not a comment. */
  it('has a drawing for every item', () => {
    for (const item of ITEMS) {
      expect(DRAWINGS[item.artAssetRef], `no drawing for ${item.id}`).toBeDefined();
    }
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

  it('gives the one-week item at one week', () => {
    const { granted } = grantItems([], 1);
    expect(granted.map((i) => i.id)).toEqual(['circlet-first-light']);
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
    expect(granted.map((i) => i.unlockAtStreakWeeks)).toEqual([1, 2, 3, 4]);
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
    expect(equippedItems(items)).toHaveLength(3);
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
    items = equipItem(items, 'sigil-quiet-hour');
    items = equipItem(items, 'mantle-still-air');
    expect(equippedItems(items).map((i) => i.type)).toEqual(['aura', 'cloak', 'crown']);
  });
});

describe('the next goal', () => {
  it('points at the first week when nothing is owned', () => {
    expect(nextUnlock([])?.unlockAtStreakWeeks).toBe(1);
  });

  it('moves on once an item is earned', () => {
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
