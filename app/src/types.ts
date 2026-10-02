/**
 * The domain model, per DATA-MODEL.md.
 *
 * There is no server and no database — every record here lives in the visitor's
 * own browser, written through src/storage.ts and nowhere else.
 */

/* ------------------------------------------------------------------ enums */

export const SETTINGS = [
  'home',
  'gym',
  'outdoors',
  'office/desk',
  'school',
  'park',
  'mall',
] as const;

export const CATEGORIES = [
  'fitness',
  'mindfulness',
  'productivity/chores',
  'learning',
  'fun activities',
  'random activities',
] as const;

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

export const STATUSES = ['pending', 'completed', 'dismissed'] as const;

/**
 * How you are right now. Asked daily. This never filters the library — it only
 * adjusts how much the app asks of you. See design/TAXONOMY.md.
 */
export const MOODS = ['drained', 'anxious', 'flat', 'restless', 'steady', 'bright'] as const;

/**
 * What you want to feel instead. Asked daily, and this one IS the hard filter:
 * a quest must carry the chosen want to be eligible. It replaced category as
 * the primary filter — category survives only as a label on the card.
 */
export const WANTS = [
  'calm',
  'energised',
  'focused',
  'accomplished',
  'playful',
  'connected',
] as const;

/**
 * Age bands, chosen at onboarding. The ranges as first sketched overlapped at
 * 32 and 40, so a 32-year-old belonged to two bands at once; normalised here so
 * every age lands in exactly one.
 */
export const AGE_RANGES = [
  '1-12',
  '13-18',
  '19-25',
  '26-32',
  '33-40',
  '41-50',
  '50+',
] as const;

/** Which figure is drawn. Cosmetic only — it changes nothing about the game. */
export const BODY_TYPES = ['sorceress', 'sorcerer'] as const;

/** Free from the start, because a player with no items still deserves a choice. */
export const HAIR_COLORS = [
  'black',
  'red',
  'pink',
  'white',
  'yellow',
  'green',
  'orange',
  'blue',
] as const;

/**
 * What an item is worn as — and, deliberately, the order it is painted in.
 *
 * Back to front: the spell ring hangs behind her, the familiar perches in
 * front. Having one array serve as both the slot list and the z-order means a
 * new slot cannot be added in the wrong layer by accident.
 */
export const ITEM_SLOTS = [
  'aura',
  'cloak',
  'wings',
  'hair',
  'robe',
  'shoes',
  'crown',
  'staff',
  'familiar',
] as const;

export type Setting = (typeof SETTINGS)[number];
export type Category = (typeof CATEGORIES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type QuestStatus = (typeof STATUSES)[number];
export type ItemSlot = (typeof ITEM_SLOTS)[number];
export type Mood = (typeof MOODS)[number];
export type Want = (typeof WANTS)[number];
export type AgeRange = (typeof AGE_RANGES)[number];
export type BodyType = (typeof BODY_TYPES)[number];
export type HairColor = (typeof HAIR_COLORS)[number];

/**
 * Difficulty is stored plainly so the data stays readable, and shown
 * thematically so the interface keeps its voice. See SPEC.md section 3.
 */
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Apprentice',
  medium: 'Adept',
  hard: 'Master',
};

export const SETTING_LABELS: Record<Setting, string> = {
  home: 'Home',
  gym: 'Gym',
  outdoors: 'Outdoors',
  'office/desk': 'Office or desk',
  school: 'School',
  park: 'Park',
  mall: 'Shops',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  fitness: 'Fitness',
  mindfulness: 'Mindfulness',
  'productivity/chores': 'Productivity',
  learning: 'Learning',
  'fun activities': 'Fun',
  'random activities': 'Anything',
};

export const SLOT_LABELS: Record<ItemSlot, string> = {
  aura: 'Spell',
  wings: 'Wings',
  cloak: 'Cloak',
  hair: 'Hair',
  robe: 'Robe',
  shoes: 'Shoes',
  crown: 'Crown',
  staff: 'Staff',
  familiar: 'Familiar',
};

export const MOOD_LABELS: Record<Mood, string> = {
  drained: 'Drained',
  anxious: 'Anxious',
  flat: 'Flat',
  restless: 'Restless',
  steady: 'Steady',
  bright: 'Bright',
};

export const MOOD_HINTS: Record<Mood, string> = {
  drained: 'Nothing left in the tank',
  anxious: 'Wired, head too loud',
  flat: 'Numb, nothing appeals',
  restless: 'Too much energy to settle',
  steady: 'Fine. Neither up nor down',
  bright: 'Good, ready for anything',
};

export const WANT_LABELS: Record<Want, string> = {
  calm: 'Calm',
  energised: 'Awake',
  focused: 'Clear',
  accomplished: 'Done',
  playful: 'Playful',
  connected: 'Less alone',
};

/** How a want reads inside a sentence: "you want to feel ___". */
export const WANT_PHRASE: Record<Want, string> = {
  calm: 'calm',
  energised: 'awake',
  focused: 'clear-headed',
  accomplished: 'like you finished something',
  playful: 'playful',
  connected: 'less alone',
};

export const WANT_HINTS: Record<Want, string> = {
  calm: 'Settle me down',
  energised: 'Wake me up',
  focused: 'Clear my head',
  accomplished: 'Let me finish something',
  playful: 'Make it fun',
  connected: 'Put me near people',
};

/**
 * How a mood shifts effort: downward only, never upward.
 *
 * A drained player who asks for Master gets Adept. A bright player who asks for
 * Apprentice still gets Apprentice — enthusiasm is not a reason to override
 * somebody's own stated limit. The first prototype relaxed symmetrically and
 * handed a drained user a high-energy quest, which is precisely the moment an
 * app like this loses someone.
 */
export const EFFORT_SHIFT: Record<Mood, number> = {
  drained: -1,
  anxious: -1,
  flat: -1,
  restless: 0,
  steady: 0,
  bright: 0,
};

export const AGE_LABELS: Record<AgeRange, string> = {
  '1-12': 'Under 13',
  '13-18': '13 to 18',
  '19-25': '19 to 25',
  '26-32': '26 to 32',
  '33-40': '33 to 40',
  '41-50': '41 to 50',
  '50+': 'Over 50',
};

export const BODY_LABELS: Record<BodyType, string> = {
  sorceress: 'Sorceress',
  sorcerer: 'Sorcerer',
};

/** The two tones each hair colour is built from: lit side, and shadow side. */
export const HAIR_SWATCHES: Record<HairColor, { lit: string; dark: string }> = {
  black: { lit: '#4a4247', dark: '#14110f' },
  red: { lit: '#c4542a', dark: '#5c1d10' },
  pink: { lit: '#f0a8c0', dark: '#9b4466' },
  white: { lit: '#f4ece0', dark: '#a9a195' },
  yellow: { lit: '#f0d58a', dark: '#9c7a30' },
  green: { lit: '#7fc08a', dark: '#2c5a3c' },
  orange: { lit: '#f0a257', dark: '#9b4e1a' },
  blue: { lit: '#8fb8e0', dark: '#2d4c75' },
};

/* --------------------------------------------------------------- entities */

/** The local player. Exactly one per browser — there are no accounts. */
export interface Profile {
  displayName: string | null;
  /**
   * Where they usually are. The daily check-in replaces this outright when
   * picking quests; it survives only to pre-fill that question, so somebody who
   * never goes to a gym is not offered one every morning.
   */
  settingPreferences: Setting[];
  /** The default the daily check-in offers, not the final word. */
  difficultyPreference: Difficulty;
  /** Narrows which quests are eligible. Never relaxed — see TAXONOMY.md R5. */
  ageRange: AgeRange;
  /** Cosmetic. Changes the figure drawn, nothing about the game. */
  bodyType: BodyType;
  hairColor: HairColor;
  createdAt: string;
}

/** Read-only catalogue, bundled with the app. Never written at runtime. */
export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  /** Kept as a label on the card. It is no longer what the engine filters on. */
  category: Category;
  difficulty: Difficulty;
  requiredSetting: Setting;
  /** Which target feelings this quest serves. At least one, often several. */
  feels: Want[];
  /** Which age bands it suits. Most quests suit everyone. */
  ages: AgeRange[];
  /** True when a human wrote the tags rather than the keyword tagger. */
  manualTags?: boolean;
}

/** One quest served to the player. Created on demand, never in a batch. */
export interface DailyQuest {
  id: string;
  questTemplateId: string;
  /** ISO date (YYYY-MM-DD) in the player's local timezone — groups quests for streaks. */
  date: string;
  status: QuestStatus;
  dismissedAt: string | null;
  completedAt: string | null;
}

/** Read-only catalogue, bundled with the app. */
export interface Item {
  id: string;
  name: string;
  type: ItemSlot;
  /**
   * How this item is drawn. There are no image files: every piece is vector
   * art built from one of nine parameterised families in
   * `components/ItemArt.tsx`, so it stays crisp at any size and a new colourway
   * is a line of data rather than a new drawing.
   *
   * Typed as `unknown` here to keep the domain model free of a dependency on
   * the renderer; `game/items.ts` narrows it to `ArtSpec`.
   */
  artAssetRef: unknown;
  /** One line of flavour, shown on the unlock screen and in the inventory. */
  flavor: string;
  /** Which weekly streak milestone unlocks it: 1 = 7 days, 2 = 14 days, and so on. */
  unlockAtStreakWeeks: number;
}

/** What the player owns and is wearing. Several items can be equipped at once. */
export interface OwnedItem {
  itemId: string;
  owned: boolean;
  equipped: boolean;
}

/* ------------------------------------------------------------ saved state */

export interface Settings {
  sound: boolean;
}

/**
 * Where the player actually is today.
 *
 * `Profile.settingPreferences` is where they go in general; this is where they
 * are right now, asked once a day. Quests are filtered to this, so a gym quest
 * never arrives on a day spent at home.
 */
export interface CheckIn {
  /** local YYYY-MM-DD — a check-in is good for one calendar day */
  date: string;
  settings: Setting[];
  /** How they are now. Shifts effort down, never up. */
  mood: Mood;
  /** What they want to feel. The hard filter. */
  want: Want;
  /** Asked daily. Overrides the profile's stored preference for today. */
  difficulty: Difficulty;
}

export interface SaveData {
  schemaVersion: number;
  profile: Profile | null;
  quests: DailyQuest[];
  items: OwnedItem[];
  settings: Settings;
  checkIn: CheckIn | null;
}

/* -------------------------------------------------------------- narrowing */

export const isSetting = (v: unknown): v is Setting =>
  SETTINGS.includes(v as Setting);
export const isCategory = (v: unknown): v is Category =>
  CATEGORIES.includes(v as Category);
export const isDifficulty = (v: unknown): v is Difficulty =>
  DIFFICULTIES.includes(v as Difficulty);
export const isStatus = (v: unknown): v is QuestStatus =>
  STATUSES.includes(v as QuestStatus);
export const isItemSlot = (v: unknown): v is ItemSlot =>
  ITEM_SLOTS.includes(v as ItemSlot);
export const isMood = (v: unknown): v is Mood => MOODS.includes(v as Mood);
export const isWant = (v: unknown): v is Want => WANTS.includes(v as Want);
export const isAgeRange = (v: unknown): v is AgeRange =>
  AGE_RANGES.includes(v as AgeRange);
export const isBodyType = (v: unknown): v is BodyType =>
  BODY_TYPES.includes(v as BodyType);
export const isHairColor = (v: unknown): v is HairColor =>
  HAIR_COLORS.includes(v as HairColor);
