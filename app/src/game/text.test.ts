import { describe, expect, it } from 'vitest';
import { parseDescription } from './text';
import { QUESTS } from './quests';

describe('parsing a quest description', () => {
  it('splits the flavour line from the steps', () => {
    const { flavor, steps } = parseDescription(
      'An unread count is a debt collected in dread.\n\n1. Archive everything.\n2. Reply to three.',
    );
    expect(flavor).toBe('An unread count is a debt collected in dread.');
    expect(steps).toEqual(['Archive everything.', 'Reply to three.']);
  });

  it('strips the numbering, which the list renders itself', () => {
    const { steps } = parseDescription('Flavour.\n\n1. One.\n2. Two.\n3. Three.');
    expect(steps).toEqual(['One.', 'Two.', 'Three.']);
  });

  it('copes with a description that has no steps', () => {
    expect(parseDescription('Just a line.')).toEqual({ flavor: 'Just a line.', steps: [] });
  });

  it('copes with an empty description', () => {
    expect(parseDescription('')).toEqual({ flavor: '', steps: [] });
  });

  it('parses every quest in the shipped catalogue', () => {
    for (const q of QUESTS) {
      const { flavor, steps } = parseDescription(q.description);
      expect(flavor, q.id).not.toBe('');
      expect(steps.length, q.id).toBeGreaterThan(0);
      for (const s of steps) {
        expect(s, q.id).not.toMatch(/^\d+\./);
        expect(s.trim(), q.id).not.toBe('');
      }
    }
  });

  it('leaves no stray numbering anywhere in the catalogue', () => {
    const offenders = QUESTS.filter((q) =>
      parseDescription(q.description).steps.some((s) => /^\s*\d+[.)]/.test(s)),
    );
    expect(offenders.map((q) => q.id)).toEqual([]);
  });
});
