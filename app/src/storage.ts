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
const SCHEMA_VERSION = 1;

export const emptySave = (): SaveData => ({
  schemaVersion: SCHEMA_VERSION,
  profile: null,
  quests: [],
  items: [],
  settings: { sound: true },
  checkIn: null,
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
 * Migrate older saves forward. Nothing to do yet, but the hook exists so a
 * future schema change can move people's data instead of discarding it.
 */
function migrate(data: SaveData): SaveData {
  const base = emptySave();
  // Spread defaults underneath so a save written before a field existed gains
  // it rather than arriving as undefined.
  return {
    ...base,
    ...data,
    settings: { ...base.settings, ...(data.settings ?? {}) },
    schemaVersion: SCHEMA_VERSION,
  };
}

/** Shape-check a parsed save. A corrupt or hand-edited blob must not crash the app. */
function isSaveData(value: unknown): value is SaveData {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<SaveData>;
  return (
    typeof v.schemaVersion === 'number' &&
    Array.isArray(v.quests) &&
    Array.isArray(v.items) &&
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
