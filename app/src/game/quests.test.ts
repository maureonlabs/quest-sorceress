/**
 * The quest engine, against the rules in design/TAXONOMY.md.
 *
 * These are the rules that decide what a person is actually handed when they
 * ask, so every one of them is pinned here rather than checked by eye.
 */

import { describe, expect, it } from 'vitest';
import {
  AGE_RANGES,
  DIFFICULTIES,
  MOODS,
  SETTINGS,
  WANTS,
  type AgeRange,
  type DailyQuest,
  type Difficulty,
  type Mood,
  type Profile,
  type Setting,
  type Want,
} from '../types';
import {
  DISMISSAL_COOLDOWN_DAYS,
  QUESTS,
  type Today,
  coverageGaps,
  eligible,
  inCooldown,
  matchesToday,
  pickQuest,
  shiftDifficulty,
  streak,
  streakWeeks,
  today,
} from './quests';

const AT = new Date('2026-06-15T12:00:00');

const profile = (over: Partial<Profile> = {}): Profile => ({
  displayName: null,
  settingPreferences: ['home'],
  difficultyPreference: 'easy',
  ageRange: '26-32',
  createdAt: '2026-01-01T00:00:00.000Z',
  ...over,
});

const day = (over: Partial<Today> = {}): Today => ({
  settings: ['home'],
  mood: 'steady',
  want: 'energised',
  difficulty: 'easy',
  ...over,
});

const quest = (over: Partial<DailyQuest> = {}): DailyQuest => ({
  id: crypto.randomUUID(),
  questTemplateId: 'x',
  date: '2026-06-15',
  status: 'pending',
  dismissedAt: null,
  completedAt: null,
  ...over,
});

const daysAgo = (n: number) => {
  const d = new Date(AT);
  d.setDate(d.getDate() - n);
  return d;
};

describe('the catalogue', () => {
  it('ships over 300 quests', () => {
    expect(QUESTS.length).toBeGreaterThanOrEqual(300);
  });

  /* The guarantee the whole engine rests on. Checked per age band, because
     checking the library as a whole hides the real failure: stripping what a
     child cannot be given leaves holes an adult never sees. */
  it('covers every setting x want x difficulty, in every age band', () => {
    expect(coverageGaps()).toEqual([]);
  });

  it('uses only the declared enum values', () => {
    for (const q of QUESTS) {
      expect(SETTINGS).toContain(q.requiredSetting);
      expect(DIFFICULTIES).toContain(q.difficulty);
      expect(q.feels.length).toBeGreaterThan(0);
      for (const f of q.feels) expect(WANTS).toContain(f);
      expect(q.ages.length).toBeGreaterThan(0);
      for (const a of q.ages) expect(AGE_RANGES).toContain(a);
    }
  });

  it('has unique ids and no empty text', () => {
    expect(new Set(QUESTS.map((q) => q.id)).size).toBe(QUESTS.length);
    for (const q of QUESTS) {
      expect(q.title.trim()).not.toBe('');
      expect(q.description.trim()).not.toBe('');
    }
  });

  it('has no unfilled template placeholders', () => {
    for (const q of QUESTS) {
      expect(`${q.title} ${q.description}`).not.toMatch(/\{[a-z]+\}/i);
    }
  });
});

describe('the mood shift', () => {
  /* The oldest rule in the project: relax downward only. */
  it('drops a rank when the player is drained, anxious or flat', () => {
    for (const mood of ['drained', 'anxious', 'flat'] as Mood[]) {
      expect(shiftDifficulty('hard', mood)).toBe('medium');
      expect(shiftDifficulty('medium', mood)).toBe('easy');
    }
  });

  it('never drops below easy', () => {
    expect(shiftDifficulty('easy', 'drained')).toBe('easy');
  });

  /* Enthusiasm is not a reason to override somebody's own stated limit. */
  it('never raises a rank, however good the player feels', () => {
    for (const mood of ['restless', 'steady', 'bright'] as Mood[]) {
      for (const d of DIFFICULTIES) expect(shiftDifficulty(d, mood)).toBe(d);
    }
  });

  it('is defined for every mood', () => {
    for (const mood of MOODS) expect(DIFFICULTIES).toContain(shiftDifficulty('medium', mood));
  });
});

describe('eligibility', () => {
  it('requires setting, want and difficulty all to match', () => {
    const t = QUESTS.find((q) => q.feels.includes('calm'))!;
    const d = day({
      settings: [t.requiredSetting],
      want: 'calm',
      difficulty: t.difficulty,
    });
    expect(matchesToday(t, profile(), d)).toBe(true);
    expect(matchesToday(t, profile(), { ...d, settings: ['gym'] })).toBe(
      t.requiredSetting === 'gym',
    );
  });

  /* A quest tagged Gym is never assigned to somebody sitting at home. */
  it('never serves somewhere the player is not today', () => {
    for (const t of eligible(profile(), [], day({ settings: ['home'] }), AT)) {
      expect(t.requiredSetting).toBe('home');
    }
  });

  it('never serves a quest outside the player’s age band', () => {
    const young = profile({ ageRange: '1-12' });
    for (const s of SETTINGS) {
      for (const w of WANTS) {
        const pool = eligible(young, [], day({ settings: [s], want: w }), AT);
        for (const t of pool) expect(t.ages).toContain('1-12');
      }
    }
  });

  /* The acceptance criterion: no combination anyone can pick comes back empty. */
  it('finds a quest for every age, place, want and difficulty', () => {
    for (const age of AGE_RANGES) {
      for (const s of SETTINGS) {
        for (const w of WANTS) {
          for (const d of DIFFICULTIES) {
            const got = pickQuest(
              profile({ ageRange: age as AgeRange }),
              [],
              day({ settings: [s as Setting], want: w as Want, difficulty: d as Difficulty }),
              AT,
              () => 0,
            );
            expect(got, `${age}/${s}/${w}/${d}`).not.toBeNull();
          }
        }
      }
    }
  });

  it('respects the mood shift when picking', () => {
    const got = pickQuest(
      profile(),
      [],
      day({ settings: ['home'], want: 'calm', difficulty: 'hard', mood: 'drained' }),
      AT,
      () => 0,
    );
    expect(got!.difficulty).toBe('medium');
  });
});

describe('the 14-day dismissal cooldown', () => {
  const dismissed = (n: number) =>
    quest({ status: 'dismissed', dismissedAt: daysAgo(n).toISOString() });

  it('is 14 days, as the spec requires', () => {
    expect(DISMISSAL_COOLDOWN_DAYS).toBe(14);
  });

  it('holds a dismissed quest back the next day', () => {
    expect(inCooldown('x', [dismissed(1)], AT)).toBe(true);
  });

  it('still holds it back on day 13', () => {
    expect(inCooldown('x', [dismissed(13)], AT)).toBe(true);
  });

  it('releases it after 14 days', () => {
    expect(inCooldown('x', [dismissed(15)], AT)).toBe(false);
  });

  it('ignores quests that were completed rather than dismissed', () => {
    expect(inCooldown('x', [quest({ status: 'completed' })], AT)).toBe(false);
  });

  it('removes a quest in cooldown from the eligible pool', () => {
    const d = day();
    const pool = eligible(profile(), [], d, AT);
    const victim = pool[0];
    const after = eligible(
      profile(),
      [quest({ questTemplateId: victim.id, status: 'dismissed', dismissedAt: daysAgo(1).toISOString() })],
      d,
      AT,
    );
    expect(after.map((t) => t.id)).not.toContain(victim.id);
  });

  /* An early repeat is a better outcome than an empty screen. */
  it('still returns a quest when every option is in cooldown', () => {
    const d = day();
    const history = eligible(profile(), [], d, AT).map((t) =>
      quest({
        questTemplateId: t.id,
        status: 'dismissed',
        dismissedAt: daysAgo(1).toISOString(),
      }),
    );
    expect(pickQuest(profile(), history, d, AT, () => 0)).not.toBeNull();
  });
});

describe('the streak', () => {
  const done = (date: string) => quest({ status: 'completed', date });

  it('is zero with no history', () => {
    expect(streak([], AT)).toBe(0);
  });

  it('counts consecutive completed days ending today', () => {
    expect(streak([done('2026-06-15'), done('2026-06-14'), done('2026-06-13')], AT)).toBe(3);
  });

  /* At 9am you have not done anything yet; a streak reading 0 would be wrong. */
  it('survives the morning before you have done anything', () => {
    expect(streak([done('2026-06-14'), done('2026-06-13')], AT)).toBe(2);
  });

  it('resets after a full missed day', () => {
    expect(streak([done('2026-06-13'), done('2026-06-12')], AT)).toBe(0);
  });

  it('counts a day once however many quests were completed', () => {
    expect(streak([done('2026-06-15'), done('2026-06-15'), done('2026-06-14')], AT)).toBe(2);
  });

  it('ignores pending and dismissed quests', () => {
    expect(
      streak([quest({ date: '2026-06-15' }), quest({ status: 'dismissed', date: '2026-06-14' })], AT),
    ).toBe(0);
  });

  it('converts to whole weeks for unlocks', () => {
    const days = Array.from({ length: 15 }, (_, i) => done(today(daysAgo(i))));
    expect(streak(days, AT)).toBe(15);
    expect(streakWeeks(days, AT)).toBe(2);
  });

  it('spans a month boundary', () => {
    const at = new Date('2026-07-02T12:00:00');
    expect(streak([done('2026-07-02'), done('2026-07-01'), done('2026-06-30')], at)).toBe(3);
  });
});
