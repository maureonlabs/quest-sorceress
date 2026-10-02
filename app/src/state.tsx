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
import {
  pickQuest,
  streak,
  streakWeeks,
  templateById,
  today,
  type Today,
} from './game/quests';
import {
  equipItem,
  equippedItems,
  grantItems,
  nextUnlock,
  unequipItem,
  type WardrobeItem,
} from './game/items';
import type {
  CheckIn,
  DailyQuest,
  HairColor,
  OwnedItem,
  Profile,
  QuestTemplate,
  SaveData,
} from './types';

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
  /**
   * Today's four answers, or null if the check-in has not happened yet. Where
   * they are, how they feel, what they want to feel, and how hard they want it.
   */
  here: Today | null;
  checkIn: (answers: Omit<CheckIn, 'date'>) => void;

  /* ---- the wardrobe ---- */
  items: OwnedItem[];
  /** What she is wearing, already in paint order. */
  equipped: WardrobeItem[];
  /** The next item the streak will earn, or null once everything is owned. */
  nextUnlock: WardrobeItem | null;
  /** Free from the start — a player with no items still deserves a choice. */
  setHairColor: (c: HairColor) => void;
  equip: (itemId: string) => void;
  unequip: (itemId: string) => void;
  /** Items earned by the completion just made, waiting to be announced. */
  justUnlocked: WardrobeItem[];
  clearUnlocked: () => void;

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

    /* Reconcile the wardrobe against the streak on the way in.
   
       Completing a quest grants on the spot, so this is for everything else: a
       save written before items existed, or a streak that crossed a milestone
       while the app was closed. Doing it here rather than in an effect avoids a
       second render, and it grants in silence — nobody wants a modal thrown at
       them for something they earned days ago. */
    const earned = grantItems(loaded.items, streakWeeks(loaded.quests, new Date()));
    if (earned.granted.length === 0) return loaded;
    return store.update((d) => ({
      ...d,
      items: grantItems(d.items, streakWeeks(d.quests, new Date())).items,
    }));
  });

  const apply = useCallback((fn: (current: SaveData) => SaveData) => {
    setData(store.update(fn));
  }, []);

  /** Items earned by the last completion, held until the player has seen them. */
  const [justUnlocked, setJustUnlocked] = useState<WardrobeItem[]>([]);
  const clearUnlocked = useCallback(() => setJustUnlocked([]), []);

  const saveProfile = useCallback(
    (profile: Profile) => apply((d) => ({ ...d, profile })),
    [apply],
  );

  /** Record today's answers. Good until midnight, then they are asked again. */
  const checkIn = useCallback(
    (answers: Omit<CheckIn, 'date'>) => {
      sound.play('select');
      apply((d) => ({ ...d, checkIn: { date: today(new Date()), ...answers } }));
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

      /* No check-in means no answers to filter on, so there is nothing to
         hand over. The shell routes to the check-in before Home, so this is a
         guard rather than a path anyone travels. */
      const fresh = d.checkIn && d.checkIn.date === today(now) ? d.checkIn : null;
      if (!fresh) return { ...d, quests };

      const template = pickQuest(d.profile, quests, fresh, now, Math.random);
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

  /**
   * Mark a quest done — and, in the same write, hand over anything the longer
   * streak has just earned. One write means the history and the wardrobe can
   * never disagree about whether an item was deserved.
   */
  const complete = useCallback(
    (id: string) => {
      sound.play('complete');

      // `apply` runs this reducer synchronously, exactly once, so reading the
      // grant back out through a local is safe — and it is the only way to tell
      // the difference between an item earned *now* and one granted quietly on
      // a later reconcile.
      let granted: WardrobeItem[] = [];

      apply((d) => {
        const quests = d.quests.map((q) =>
          q.id === id
            ? { ...q, status: 'completed' as const, completedAt: new Date().toISOString() }
            : q,
        );
        const earned = grantItems(d.items, streakWeeks(quests, new Date()));
        granted = earned.granted;
        return { ...d, quests, items: earned.items };
      });

      if (granted.length > 0) {
        setJustUnlocked(granted);
        sound.play('unlock');
      }
    },
    [apply],
  );

  const equip = useCallback(
    (itemId: string) => {
      sound.play('select');
      apply((d) => ({ ...d, items: equipItem(d.items, itemId) }));
    },
    [apply],
  );

  const unequip = useCallback(
    (itemId: string) => {
      sound.play('dismiss');
      apply((d) => ({ ...d, items: unequipItem(d.items, itemId) }));
    },
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

  const setHairColor = useCallback(
    (hairColor: HairColor) => {
      sound.play('select');
      apply((d) => (d.profile ? { ...d, profile: { ...d.profile, hairColor } } : d));
    },
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
    setJustUnlocked([]);
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
      here: fresh,
      checkIn,
      setHairColor,
      items: data.items,
      equipped: equippedItems(data.items),
      nextUnlock: nextUnlock(data.items),
      equip,
      unequip,
      justUnlocked,
      clearUnlocked,
      saveProfile,
      generate,
      complete,
      dismiss,
      startOver,
    };
  }, [
    data,
    saveProfile,
    generate,
    complete,
    dismiss,
    startOver,
    setSound,
    checkIn,
    equip,
    unequip,
    justUnlocked,
    clearUnlocked,
    setHairColor,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): Game {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
