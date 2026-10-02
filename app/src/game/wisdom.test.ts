/**
 * The day's encouragement: when it is given, and the promise that it does not
 * repeat while ninety-nine others are waiting.
 */

import { describe, expect, it } from 'vitest';
import {
  PASSAGES,
  QUESTS_BEFORE_WISDOM,
  earnsWisdom,
  markSeen,
  passageById,
  pickPassage,
  shownToday,
} from './wisdom';
import type { WisdomState } from '../types';

const AT = new Date('2026-06-15T12:00:00');
const empty: WisdomState = { seen: [], shownOn: null };

describe('the book', () => {
  it('holds a hundred passages', () => {
    expect(PASSAGES).toHaveLength(100);
  });

  it('is half scripture and half written for the app', () => {
    expect(PASSAGES.filter((p) => p.kind === 'verse')).toHaveLength(50);
    expect(PASSAGES.filter((p) => p.kind === 'wisdom')).toHaveLength(50);
  });

  it('has unique ids and no empty text', () => {
    expect(new Set(PASSAGES.map((p) => p.id)).size).toBe(PASSAGES.length);
    for (const p of PASSAGES) expect(p.text.trim().length).toBeGreaterThan(10);
  });

  it('covers all four themes in both kinds', () => {
    for (const theme of ['positivity', 'wealth', 'success', 'love'] as const) {
      for (const kind of ['verse', 'wisdom'] as const) {
        expect(
          PASSAGES.filter((p) => p.theme === theme && p.kind === kind).length,
          `${kind}/${theme}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  /* Scripture gets a reference; the app's own lines are attributed to nobody,
     on purpose — a misattributed quote is worse than an anonymous one. */
  it('cites every verse and attributes no wisdom', () => {
    for (const p of PASSAGES) {
      if (p.kind === 'verse') expect(p.source, p.id).toBeTruthy();
      else expect(p.source, p.id).toBeUndefined();
    }
  });
});

describe('when it is earned', () => {
  it('says nothing before the third quest', () => {
    expect(earnsWisdom(1, empty, AT)).toBe(false);
    expect(earnsWisdom(2, empty, AT)).toBe(false);
  });

  it('is earned on the third', () => {
    expect(QUESTS_BEFORE_WISDOM).toBe(3);
    expect(earnsWisdom(3, empty, AT)).toBe(true);
  });

  /* A fourth and fifth quest must not produce a fourth and fifth popup. */
  it('is given once a day, however many quests follow', () => {
    const after = markSeen(empty, PASSAGES[0].id, AT);
    expect(earnsWisdom(4, after, AT)).toBe(false);
    expect(earnsWisdom(9, after, AT)).toBe(false);
  });

  it('comes round again tomorrow', () => {
    const after = markSeen(empty, PASSAGES[0].id, AT);
    const tomorrow = new Date('2026-06-16T09:00:00');
    expect(shownToday(after, tomorrow)).toBe(false);
    expect(earnsWisdom(3, after, tomorrow)).toBe(true);
  });
});

describe('choosing one', () => {
  it('never repeats while others are unseen', () => {
    let state = empty;
    const given: string[] = [];
    for (let i = 0; i < PASSAGES.length; i += 1) {
      const p = pickPassage(state, () => 0);
      given.push(p.id);
      state = markSeen(state, p.id, AT);
    }
    expect(new Set(given).size).toBe(PASSAGES.length);
  });

  /* Day 101 must not be silent. */
  it('starts the book again once it has been read through', () => {
    let state = empty;
    for (const p of PASSAGES) state = markSeen(state, p.id, AT);
    expect(state.seen).toEqual([]);
    expect(pickPassage(state, () => 0)).toBeDefined();
  });

  it('can find any passage by id', () => {
    for (const p of PASSAGES) expect(passageById(p.id)).toBe(p);
  });
});
