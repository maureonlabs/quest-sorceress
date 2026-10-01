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

export type Setting = (typeof SETTINGS)[number];
export type Category = (typeof CATEGORIES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type QuestStatus = (typeof STATUSES)[number];

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

/* --------------------------------------------------------------- entities */

/** The local player. Exactly one per browser — there are no accounts. */
export interface Profile {
  displayName: string | null;
  settingPreferences: Setting[];
  categoryPreferences: Category[];
  difficultyPreference: Difficulty;
  createdAt: string;
}

/** Read-only catalogue, bundled with the app. Never written at runtime. */
export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  requiredSetting: Setting;
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
  type: string;
  artAssetRef: string;
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

export interface SaveData {
  schemaVersion: number;
  profile: Profile | null;
  quests: DailyQuest[];
  items: OwnedItem[];
  settings: Settings;
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
