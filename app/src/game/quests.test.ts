import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  DIFFICULTIES,
  SETTINGS,
  type Category,
  type DailyQuest,
  type Difficulty,
  type Profile,
  type Setting,
} from '../types';
import {
  DISMISSAL_COOLDOWN_DAYS,
  QUESTS,
  coverageGaps,
  eligible,
  inCooldown,
  matchesPreferences,
  pickQuest,
  streak,
  streakWeeks,
  today,
} from './quests';

const AT = new Date('2026-06-15T12:00:00');

const profile = (over: Partial<Profile> = {}): Profile => ({
  displayName: null,
  settingPreferences: ['home'],
  categoryPreferences: ['fitness'],
  difficultyPreference: 'easy',
  createdAt: '2026-01-01T00:00:00.000Z',
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

const daysAgo = (n: number, from: Date = AT) => {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return today(d);
};

describe('the catalogue', () => {
  it('ships 269 quests', () => {
    expect(QUESTS).toHaveLength(269);
  });

  it('covers every setting x category x difficulty combination', () => {
    expect(coverageGaps()).toEqual([]);
  });

  it('uses only the declared enum values', () => {
    for (const q of QUESTS) {
      expect(SETTINGS).toContain(q.requiredSetting);
      expect(CATEGORIES).toContain(q.category);
      expect(DIFFICULTIES).toContain(q.difficulty);
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
      expect(`${q.title}${q.description}`).not.toMatch(/\{\w+\}/);
    }
  });
});

describe('eligibility', () => {
  it('requires setting, category and difficulty all to match', () => {
    const p = profile({
      settingPreferences: ['gym'],
      categoryPreferences: ['fitness'],
      difficultyPreference: 'hard',
    });
    const t = QUESTS.find((q) => matchesPreferences(q, p))!;
    expect(t.requiredSetting).toBe('gym');
    expect(t.category).toBe('fitness');
    expect(t.difficulty).toBe('hard');
  });

  it('never serves a setting the player did not choose', () => {
    const p = profile({ settingPreferences: ['home'] });
    for (const t of eligible(p, [], AT)) {
      expect(t.requiredSetting).toBe('home');
    }
  });

  it('finds at least one quest for every possible preference combination', () => {
    for (const s of SETTINGS as readonly Setting[])
      for (const c of CATEGORIES as readonly Category[])
        for (const d of DIFFICULTIES as readonly Difficulty[]) {
          const p = profile({
            settingPreferences: [s],
            categoryPreferences: [c],
            difficultyPreference: d,
          });
          expect(pickQuest(p, [], AT), `${s} / ${c} / ${d}`).not.toBeNull();
        }
  });
});

describe('the 14-day dismissal cooldown', () => {
  const dismissedDaysAgo = (n: number): DailyQuest[] => {
    const d = new Date(AT);
    d.setDate(d.getDate() - n);
    return [quest({ questTemplateId: 'abc', status: 'dismissed', dismissedAt: d.toISOString() })];
  };

  it('holds a dismissed quest back the next day', () => {
    expect(inCooldown('abc', dismissedDaysAgo(1), AT)).toBe(true);
  });

  it('still holds it back on day 13', () => {
    expect(inCooldown('abc', dismissedDaysAgo(13), AT)).toBe(true);
  });

  it('releases it after 14 days', () => {
    expect(inCooldown('abc', dismissedDaysAgo(15), AT)).toBe(false);
  });

  it('ignores quests that were completed rather than dismissed', () => {
    const history = [quest({ questTemplateId: 'abc', status: 'completed' })];
    expect(inCooldown('abc', history, AT)).toBe(false);
  });

  it('removes a quest in cooldown from the eligible pool', () => {
    const p = profile();
    const target = eligible(p, [], AT)[0];
    const history = [
      quest({
        questTemplateId: target.id,
        status: 'dismissed',
        dismissedAt: new Date(AT).toISOString(),
      }),
    ];
    expect(eligible(p, history, AT).map((t) => t.id)).not.toContain(target.id);
  });

  it('still returns a quest when every option is in cooldown', () => {
    const p = profile();
    const history = QUESTS.filter((t) => matchesPreferences(t, p)).map((t) =>
      quest({
        questTemplateId: t.id,
        status: 'dismissed',
        dismissedAt: new Date(AT).toISOString(),
      }),
    );
    expect(eligible(p, history, AT)).toHaveLength(0);
    expect(pickQuest(p, history, AT)).not.toBeNull();
  });
});

describe('the streak', () => {
  it('is zero with no history', () => {
    expect(streak([], AT)).toBe(0);
  });

  it('counts consecutive completed days ending today', () => {
    const history = [0, 1, 2].map((n) =>
      quest({ status: 'completed', date: daysAgo(n) }),
    );
    expect(streak(history, AT)).toBe(3);
  });

  it('survives the morning before you have done anything', () => {
    const history = [1, 2].map((n) => quest({ status: 'completed', date: daysAgo(n) }));
    expect(streak(history, AT)).toBe(2);
  });

  it('resets after a full missed day', () => {
    const history = [2, 3].map((n) => quest({ status: 'completed', date: daysAgo(n) }));
    expect(streak(history, AT)).toBe(0);
  });

  it('counts a day once however many quests were completed', () => {
    const history = [
      quest({ status: 'completed', date: daysAgo(0) }),
      quest({ status: 'completed', date: daysAgo(0) }),
      quest({ status: 'completed', date: daysAgo(0) }),
    ];
    expect(streak(history, AT)).toBe(1);
  });

  it('ignores pending and dismissed quests', () => {
    const history = [
      quest({ status: 'pending', date: daysAgo(0) }),
      quest({ status: 'dismissed', date: daysAgo(1) }),
    ];
    expect(streak(history, AT)).toBe(0);
  });

  it('converts to whole weeks for unlocks', () => {
    const run = (n: number) =>
      Array.from({ length: n }, (_, i) => quest({ status: 'completed', date: daysAgo(i) }));
    expect(streakWeeks(run(6), AT)).toBe(0);
    expect(streakWeeks(run(7), AT)).toBe(1);
    expect(streakWeeks(run(13), AT)).toBe(1);
    expect(streakWeeks(run(14), AT)).toBe(2);
  });

  it('spans a month boundary', () => {
    const atJul2 = new Date('2026-07-02T09:00:00');
    const history = ['2026-07-02', '2026-07-01', '2026-06-30'].map((date) =>
      quest({ status: 'completed', date }),
    );
    expect(streak(history, atJul2)).toBe(3);
  });
});

describe('cooldown constant', () => {
  it('is 14 days, as the spec requires', () => {
    expect(DISMISSAL_COOLDOWN_DAYS).toBe(14);
  });
});
