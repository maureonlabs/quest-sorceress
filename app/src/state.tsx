/**
 * Game state: one React context over the storage module.
 *
 * Nothing in the UI touches storage directly — every change goes through an
 * action here, which keeps the persistence layer swappable.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as store from './storage';
import * as sound from './sound';
import { pickQuest, streak, streakWeeks, templateById, today } from './game/quests';
import type { DailyQuest, Profile, QuestTemplate, SaveData, Setting } from './types';

interface Game {
  profile: Profile | null;
  quests: DailyQuest[];
  /** The one quest currently on the table, if any. */
  pending: DailyQuest | null;
  pendingTemplate: QuestTemplate | null;
  streak: number;
  streakWeeks: number;
  completedToday: number;
  /** False when the browser refuses to persist — private windows, blocked data. */
  remembers: boolean;
  soundOn: boolean;
  setSound: (on: boolean) => void;
  /** Where the player said they are today, or null if they have not been asked yet. */
  here: Setting[] | null;
  checkIn: (places: Setting[]) => void;

  saveProfile: (p: Profile) => void;
  generate: () => void;
  complete: (id: string) => void;
  dismiss: (id: string) => void;
  startOver: () => void;
}

const GameContext = createContext<Game | null>(null);

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `q-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function GameProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SaveData>(() => {
    const loaded = store.load();
    sound.setEnabled(loaded.settings.sound);
    return loaded;
  });

  const apply = useCallback((fn: (current: SaveData) => SaveData) => {
    setData(store.update(fn));
  }, []);

  const saveProfile = useCallback(
    (profile: Profile) => apply((d) => ({ ...d, profile })),
    [apply],
  );

  /** Record where they are today. Good until midnight, then they are asked again. */
  const checkIn = useCallback(
    (places: Setting[]) => {
      sound.play('select');
      apply((d) => ({ ...d, checkIn: { date: today(new Date()), settings: places } }));
    },
    [apply],
  );

  /**
   * Hand over one quest.
   *
   * Generating while something is already pending replaces it, and the replaced
   * quest is recorded as dismissed — so it enters the 14-day cooldown and will
   * not come straight back. SPEC.md flow 1, step 6.
   */
  const generate = useCallback(() => {
    apply((d) => {
      if (!d.profile) return d;
      const now = new Date();
      const stamp = now.toISOString();

      const quests = d.quests.map((q) =>
        q.status === 'pending' ? { ...q, status: 'dismissed' as const, dismissedAt: stamp } : q,
      );

      const hereToday =
        d.checkIn && d.checkIn.date === today(now) ? d.checkIn.settings : undefined;
      const template = pickQuest(d.profile, quests, now, Math.random, hereToday);
      if (!template) return { ...d, quests };
      sound.play('deal');

      const next: DailyQuest = {
        id: newId(),
        questTemplateId: template.id,
        date: today(now),
        status: 'pending',
        dismissedAt: null,
        completedAt: null,
      };
      return { ...d, quests: [...quests, next] };
    });
  }, [apply]);

  const complete = useCallback(
    (id: string) => (
      sound.play('complete'),
      apply((d) => ({
        ...d,
        quests: d.quests.map((q) =>
          q.id === id
            ? { ...q, status: 'completed' as const, completedAt: new Date().toISOString() }
            : q,
        ),
      }))
    ),
    [apply],
  );

  const dismiss = useCallback(
    (id: string) => (
      sound.play('dismiss'),
      apply((d) => ({
        ...d,
        quests: d.quests.map((q) =>
          q.id === id
            ? { ...q, status: 'dismissed' as const, dismissedAt: new Date().toISOString() }
            : q,
        ),
      }))
    ),
    [apply],
  );

  const setSound = useCallback(
    (on: boolean) => {
      sound.setEnabled(on);
      if (on) sound.play('select');
      apply((d) => ({ ...d, settings: { ...d.settings, sound: on } }));
    },
    [apply],
  );

  const startOver = useCallback(() => {
    store.clear();
    setData(store.emptySave());
  }, []);

  const value = useMemo<Game>(() => {
    const pending = data.quests.find((q) => q.status === 'pending') ?? null;
    const now = new Date();
    const fresh = data.checkIn && data.checkIn.date === today(now) ? data.checkIn : null;
    return {
      profile: data.profile,
      quests: data.quests,
      pending,
      pendingTemplate: pending ? (templateById(pending.questTemplateId) ?? null) : null,
      streak: streak(data.quests, now),
      streakWeeks: streakWeeks(data.quests, now),
      completedToday: data.quests.filter(
        (q) => q.status === 'completed' && q.date === today(now),
      ).length,
      remembers: store.isPersistent(),
      soundOn: data.settings.sound,
      setSound,
      here: fresh ? fresh.settings : null,
      checkIn,
      saveProfile,
      generate,
      complete,
      dismiss,
      startOver,
    };
  }, [data, saveProfile, generate, complete, dismiss, startOver, setSound, checkIn]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): Game {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
