/**
 * The quest engine: eligibility, selection, and the streak.
 *
 * Pure functions over data — no storage, no React — so every rule in
 * DATA-MODEL.md can be tested directly.
 */

import catalogue from '../content/quests.json';
import {
  AGE_RANGES,
  DIFFICULTIES,
  EFFORT_SHIFT,
  WANTS,
  type AgeRange,
  type DailyQuest,
  type Difficulty,
  type Mood,
  type Profile,
  type QuestTemplate,
  type Setting,
  type Want,
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

/**
 * Today's four answers. Every one of them comes from the daily check-in rather
 * than the stored profile, because where you are and how you feel are facts
 * about today, not preferences.
 */
export interface Today {
  settings: Setting[];
  mood: Mood;
  want: Want;
  difficulty: Difficulty;
}

/**
 * Apply the mood's effort shift — downward only, never upward (TAXONOMY.md R4).
 * Easy is the floor; there is nothing gentler to drop to.
 */
export function shiftDifficulty(chosen: Difficulty, mood: Mood): Difficulty {
  const at = DIFFICULTIES.indexOf(chosen);
  const shift = Math.min(0, EFFORT_SHIFT[mood]);
  return DIFFICULTIES[Math.max(0, at + shift)];
}

export const suitsAge = (t: QuestTemplate, age: AgeRange): boolean =>
  t.ages.includes(age);

/**
 * Could this quest be handed over today?
 *
 * Setting and age are hard: being at the gym today is a stronger fact than
 * usually going there, and an age band is never widened for any reason. Want
 * and difficulty are hard too in the ordinary case, but `pickQuest` is allowed
 * to give them up rather than return nothing.
 */
export function matchesToday(
  t: QuestTemplate,
  profile: Profile,
  today: Today,
  opts: { anyDifficulty?: boolean; anyWant?: boolean } = {},
): boolean {
  if (!today.settings.includes(t.requiredSetting)) return false;
  if (!suitsAge(t, profile.ageRange)) return false;
  if (!opts.anyWant && !t.feels.includes(today.want)) return false;
  if (!opts.anyDifficulty && t.difficulty !== shiftDifficulty(today.difficulty, today.mood))
    return false;
  return true;
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

/** Everything the player could be served right now, cooldowns included. */
export function eligible(
  profile: Profile,
  history: DailyQuest[],
  today: Today,
  now: Date = new Date(),
): QuestTemplate[] {
  return QUESTS.filter(
    (t) => matchesToday(t, profile, today) && !inCooldown(t.id, history, now),
  );
}

/**
 * Pick one quest at random.
 *
 * The library guarantees at least one quest for every setting × want ×
 * difficulty combination *within every age band*, so the ordinary case never
 * comes back empty. When a relentless dismisser or an unusual combination does
 * empty the pool, constraints are given up in a fixed order (TAXONOMY.md R7):
 * cooldown, then difficulty, then want.
 *
 * Setting and age are never given up. An empty screen is bad; a gym quest for
 * somebody sitting at home is worse; an adult quest for a child is not on the
 * table at any price.
 */
export function pickQuest(
  profile: Profile,
  history: DailyQuest[],
  today: Today,
  now: Date = new Date(),
  random: () => number = Math.random,
): QuestTemplate | null {
  const attempts: QuestTemplate[][] = [
    eligible(profile, history, today, now),
    QUESTS.filter((t) => matchesToday(t, profile, today)),
    QUESTS.filter((t) => matchesToday(t, profile, today, { anyDifficulty: true })),
    QUESTS.filter((t) =>
      matchesToday(t, profile, today, { anyDifficulty: true, anyWant: true }),
    ),
  ];

  for (const pool of attempts) {
    if (pool.length > 0) return pool[Math.floor(random() * pool.length)];
  }
  return null;
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

/**
 * The coverage guarantee, checked per age band (TAXONOMY.md R6).
 *
 * Every setting × want × difficulty must be non-empty for *every* age band —
 * checking the library as a whole would hide the real failure, which is that
 * stripping the quests a child cannot be given leaves holes an adult never sees.
 */
export function coverageGaps(): Array<[AgeRange, Setting, Want, Difficulty]> {
  const gaps: Array<[AgeRange, Setting, Want, Difficulty]> = [];
  const settings = [...new Set(QUESTS.map((q) => q.requiredSetting))];

  for (const age of AGE_RANGES) {
    const pool = QUESTS.filter((q) => q.ages.includes(age));
    for (const s of settings)
      for (const w of WANTS)
        for (const d of DIFFICULTIES)
          if (
            !pool.some(
              (q) => q.requiredSetting === s && q.feels.includes(w) && q.difficulty === d,
            )
          )
            gaps.push([age, s, w, d]);
  }
  return gaps;
}
