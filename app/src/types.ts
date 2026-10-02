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
export type Setting = (typeof SETTINGS)[number];
export type Category = (typeof CATEGORIES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type QuestStatus = (typeof STATUSES)[number];
export type Mood = (typeof MOODS)[number];
export type Want = (typeof WANTS)[number];
export type AgeRange = (typeof AGE_RANGES)[number];
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

/**
 * Which encouragements have already been given, and whether today's has been.
 *
 * `seen` exists so the same passage does not come round twice while
 * ninety-eight others wait; it clears once the whole book has been read.
 */
export interface WisdomState {
  seen: string[];
  /** Local YYYY-MM-DD of the last day a passage was shown, or null. */
  shownOn: string | null;
}

export interface SaveData {
  schemaVersion: number;
  profile: Profile | null;
  quests: DailyQuest[];
  settings: Settings;
  checkIn: CheckIn | null;
  wisdom: WisdomState;
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
