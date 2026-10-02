/**
 * Choosing the day's encouragement.
 *
 * Pure functions over data, like the quest engine, so the "no repeats until
 * everything has been seen" rule can be tested without a browser.
 */

import { PASSAGES, type Passage } from '../content/wisdom';
import { today } from './quests';
import type { WisdomState } from '../types';

export { PASSAGES };

/** How many quests must be finished in a day before she says anything. */
export const QUESTS_BEFORE_WISDOM = 3;

export const passageById = (id: string): Passage | undefined =>
  PASSAGES.find((p) => p.id === id);

/**
 * Pick one that has not been seen.
 *
 * Once all hundred have been read the list clears and begins again, rather than
 * the app going quiet for ever on day one hundred and one.
 */
export function pickPassage(
  state: WisdomState,
  random: () => number = Math.random,
): Passage {
  const unseen = PASSAGES.filter((p) => !state.seen.includes(p.id));
  const pool = unseen.length > 0 ? unseen : PASSAGES;
  return pool[Math.floor(random() * pool.length)];
}

/** Record that one was given, resetting the list when the book runs out. */
export function markSeen(state: WisdomState, id: string, now: Date): WisdomState {
  const seen = state.seen.includes(id) ? state.seen : [...state.seen, id];
  return {
    seen: seen.length >= PASSAGES.length ? [] : seen,
    shownOn: today(now),
  };
}

/**
 * Has today's encouragement already been given?
 *
 * Tied to the calendar date rather than to a counter, so finishing a fourth and
 * fifth quest does not produce a fourth and fifth popup — and so tomorrow it
 * comes round again without anything needing to be reset by hand.
 */
export const shownToday = (state: WisdomState, now: Date = new Date()): boolean =>
  state.shownOn === today(now);

/**
 * Does finishing a quest right now earn the day's passage?
 *
 * `completedToday` is the count *including* the quest just finished.
 */
export const earnsWisdom = (
  completedToday: number,
  state: WisdomState,
  now: Date = new Date(),
): boolean => completedToday >= QUESTS_BEFORE_WISDOM && !shownToday(state, now);
