/**
 * The quest engine: eligibility, selection, and the streak.
 *
 * Pure functions over data — no storage, no React — so every rule in
 * DATA-MODEL.md can be tested directly.
 */

import catalogue from '../content/quests.json';
import type {
  DailyQuest,
  Difficulty,
  Profile,
  QuestTemplate,
  Setting,
  Category,
} from '../types';

/** The 269-quest library, bundled with the app and never written at runtime. */
export const QUESTS = catalogue as QuestTemplate[];

export const DISMISSAL_COOLDOWN_DAYS = 14;

/* ----------------------------------------------------------------- dates */

/** Local calendar date as YYYY-MM-DD. Deliberately local, not UTC: a streak
 *  should follow the player's day, not Greenwich's. */
export function today(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* ------------------------------------------------------------ eligibility */

/** A template matches the player's stated preferences. */
export function matchesPreferences(t: QuestTemplate, p: Profile): boolean {
  return (
    p.settingPreferences.includes(t.requiredSetting) &&
    p.categoryPreferences.includes(t.category) &&
    t.difficulty === p.difficultyPreference
  );
}

/** A template is still inside its 14-day cooldown after being dismissed. */
export function inCooldown(
  templateId: string,
  history: DailyQuest[],
  now: Date = new Date(),
): boolean {
  const dismissals = history.filter(
    (q) => q.questTemplateId === templateId && q.status === 'dismissed' && q.dismissedAt,
  );
  if (dismissals.length === 0) return false;
  const latest = dismissals.reduce((a, b) =>
    (a.dismissedAt ?? '') > (b.dismissedAt ?? '') ? a : b,
  );
  const elapsed = (now.getTime() - Date.parse(latest.dismissedAt!)) / 86_400_000;
  return elapsed < DISMISSAL_COOLDOWN_DAYS;
}

/** Everything the player could be served right now. */
export function eligible(
  profile: Profile,
  history: DailyQuest[],
  now: Date = new Date(),
): QuestTemplate[] {
  return QUESTS.filter(
    (t) => matchesPreferences(t, profile) && !inCooldown(t.id, history, now),
  );
}

/**
 * Pick one quest at random.
 *
 * The library guarantees at least one quest for every setting × category ×
 * difficulty combination, so `matchesPreferences` can never return nothing.
 * Cooldowns can still empty the pool for a player who dismisses relentlessly —
 * in that case we ignore cooldowns rather than hand back nothing, because an
 * empty screen is a worse outcome than an early repeat.
 */
export function pickQuest(
  profile: Profile,
  history: DailyQuest[],
  now: Date = new Date(),
  random: () => number = Math.random,
): QuestTemplate | null {
  let pool = eligible(profile, history, now);
  if (pool.length === 0) pool = QUESTS.filter((t) => matchesPreferences(t, profile));
  if (pool.length === 0) return null;
  return pool[Math.floor(random() * pool.length)];
}

/* ---------------------------------------------------------------- streaks */

/**
 * Consecutive days, ending today or yesterday, on which at least one quest was
 * completed. Derived from the quests themselves — never stored — so it cannot
 * drift out of sync with the history that justifies it.
 *
 * Counting from yesterday matters: at 9am you have not completed anything yet,
 * and a streak that reads 0 until you do would be wrong and demoralising.
 */
export function streak(history: DailyQuest[], now: Date = new Date()): number {
  const days = new Set(
    history.filter((q) => q.status === 'completed').map((q) => q.date),
  );
  if (days.size === 0) return 0;

  const start = today(now);
  const yesterday = (() => {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return today(d);
  })();

  let cursor = days.has(start) ? start : days.has(yesterday) ? yesterday : null;
  if (cursor === null) return 0;

  let count = 0;
  while (days.has(cursor)) {
    count += 1;
    const d = new Date(`${cursor}T00:00:00`);
    d.setDate(d.getDate() - 1);
    cursor = today(d);
  }
  return count;
}

/** Completed weeks of streak — what unlocks items. 7 days = 1, 14 = 2. */
export const streakWeeks = (history: DailyQuest[], now: Date = new Date()): number =>
  Math.floor(streak(history, now) / 7);

/* ------------------------------------------------------------- catalogue */

export const templateById = (id: string): QuestTemplate | undefined =>
  QUESTS.find((t) => t.id === id);

/** Sanity check used by the dev-time self-test: every combination is covered. */
export function coverageGaps(): Array<[Setting, Category, Difficulty]> {
  const gaps: Array<[Setting, Category, Difficulty]> = [];
  const settings = [...new Set(QUESTS.map((q) => q.requiredSetting))];
  const categories = [...new Set(QUESTS.map((q) => q.category))];
  const difficulties = [...new Set(QUESTS.map((q) => q.difficulty))];
  for (const s of settings)
    for (const c of categories)
      for (const d of difficulties)
        if (
          !QUESTS.some(
            (q) => q.requiredSetting === s && q.category === c && q.difficulty === d,
          )
        )
          gaps.push([s, c, d]);
  return gaps;
}
