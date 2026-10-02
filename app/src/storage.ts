/**
 * The only place anything is persisted.
 *
 * Everything the app saves goes through here, so swapping localStorage for real
 * accounts later is a change to this file rather than a rewrite of the app.
 *
 * Storage can fail or be unavailable — private windows, blocked site data,
 * a full quota. When that happens the app must keep working for the session
 * rather than crash; it simply will not remember anything. Every read and write
 * below is therefore wrapped, and `isPersistent()` tells the UI which world
 * it is in.
 */

import type { SaveData } from './types';

const KEY = 'quest-sorceress/v1';
const SCHEMA_VERSION = 3;

export const emptySave = (): SaveData => ({
  schemaVersion: SCHEMA_VERSION,
  profile: null,
  quests: [],
  settings: { sound: true },
  checkIn: null,
  wisdom: { seen: [], shownOn: null },
});

/** In-memory fallback, used when the browser will not persist for us. */
let memory: SaveData = emptySave();
let persistent: boolean | null = null;

/** True when writes actually survive a reload. Checked once, lazily. */
export function isPersistent(): boolean {
  if (persistent !== null) return persistent;
  try {
    const probe = `${KEY}/probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    persistent = true;
  } catch {
    persistent = false;
  }
  return persistent;
}

/**
 * Migrate older saves forward, so a schema change moves people's data instead
 * of discarding it.
 *
 * **v1 → v2** added the feeling taxonomy and age bands.
 *
 * **v2 → v3** removed the avatar and the wardrobe outright, and added the
 * encouragement shown on the day's third quest. Anything a v2 save stored about
 * owned or equipped items is dropped on the way through rather than carried
 * along: there is nothing left that could read it.
 *
 * - A v1 profile has no age band. There is no way to infer one, so it is
 *   defaulted to `26-32` and is editable in Preferences. Defaulting rather than
 *   re-onboarding keeps the player's streak and wardrobe intact; the trade is
 *   that an existing player must correct their own age if it matters to them.
 * - A v1 check-in has no mood, want or difficulty, so it is discarded entirely
 *   and the player is asked again today. Inventing answers on their behalf
 *   would silently pick the quests they get.
 */
function migrate(data: SaveData): SaveData {
  const base = emptySave();
  // Read as partial: a v1 profile genuinely lacks these keys at runtime, even
  // though the current type says every profile has them.
  const stored = data.profile as Partial<NonNullable<SaveData['profile']>> | null;
  const profile = stored
    ? ({ ageRange: '26-32', ...stored } as SaveData['profile'])
    : null;

  const saved = data.checkIn as Partial<SaveData['checkIn']> | null;
  const checkIn =
    saved && saved.mood && saved.want && saved.difficulty
      ? (saved as SaveData['checkIn'])
      : null;

  // Spread defaults underneath so a save written before a field existed gains
  // it rather than arriving as undefined.
  const next: SaveData = {
    ...base,
    ...data,
    profile,
    checkIn,
    settings: { ...base.settings, ...(data.settings ?? {}) },
    wisdom: { ...base.wisdom, ...(data.wisdom ?? {}) },
    schemaVersion: SCHEMA_VERSION,
  };

  // Drop anything a v2 save held about the wardrobe. Spreading `data` above
  // would otherwise carry `items` along for ever, invisible and unread.
  delete (next as unknown as Record<string, unknown>).items;
  return next;
}

/** Shape-check a parsed save. A corrupt or hand-edited blob must not crash the app. */
function isSaveData(value: unknown): value is SaveData {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<SaveData>;
  return (
    typeof v.schemaVersion === 'number' &&
    Array.isArray(v.quests) &&
    (v.profile === null || typeof v.profile === 'object')
  );
}

export function load(): SaveData {
  if (!isPersistent()) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptySave();
    const parsed: unknown = JSON.parse(raw);
    if (!isSaveData(parsed)) return emptySave();
    return migrate(parsed);
  } catch {
    // Unreadable or corrupt — start clean rather than leaving the app stuck.
    return emptySave();
  }
}

export function save(data: SaveData): void {
  memory = data;
  if (!isPersistent()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Quota exceeded or storage revoked mid-session. The in-memory copy above
    // keeps this session working; it just will not outlive the tab.
    persistent = false;
  }
}

/** Read, transform, write — the only way state changes. */
export function update(fn: (current: SaveData) => SaveData): SaveData {
  const next = fn(load());
  save(next);
  return next;
}

/** Wipe everything. Used by "start over" in Settings. */
export function clear(): void {
  memory = emptySave();
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to remove */
  }
}
