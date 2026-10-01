/**
 * Change the three answers from onboarding. Saves on every change — there is no
 * "save" button, because there is nothing to lose by changing your mind.
 */

import { useNavigate } from 'react-router-dom';
import { ChipGroup } from '../components/ChipGroup';
import { useGame } from '../state';
import {
  CATEGORIES,
  CATEGORY_LABELS,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  SETTINGS,
  SETTING_LABELS,
  type Category,
  type Difficulty,
  type Setting,
} from '../types';

const SETTING_OPTIONS = SETTINGS.map((v) => ({ value: v, label: SETTING_LABELS[v] }));
const CATEGORY_OPTIONS = CATEGORIES.map((v) => ({ value: v, label: CATEGORY_LABELS[v] }));
const DIFFICULTY_OPTIONS = DIFFICULTIES.map((v) => ({
  value: v,
  label: DIFFICULTY_LABELS[v],
  sub: v,
}));

export function Preferences() {
  const { profile, saveProfile, startOver, soundOn, setSound } = useGame();
  const navigate = useNavigate();
  if (!profile) return null;

  /** Never let the player empty a list — the engine would have nothing to filter. */
  const setSettings = (update: (c: readonly Setting[]) => Setting[]) => {
    const next = update(profile.settingPreferences);
    if (next.length > 0) saveProfile({ ...profile, settingPreferences: next });
  };
  const setCategories = (update: (c: readonly Category[]) => Category[]) => {
    const next = update(profile.categoryPreferences);
    if (next.length > 0) saveProfile({ ...profile, categoryPreferences: next });
  };
  const setDifficulty = (update: (c: readonly Difficulty[]) => Difficulty[]) => {
    const next = update([profile.difficultyPreference]);
    if (next[0]) saveProfile({ ...profile, difficultyPreference: next[0] });
  };

  const reset = () => {
    if (!confirm('Start over? Your streak, history and preferences will all go.')) return;
    startOver();
    navigate('/');
  };

  return (
    <div className="content">
      <header>
        <p className="eyebrow">Preferences</p>
        <h1>What she asks of you</h1>
      </header>

      <section className="panel">
        <h2>Where you go</h2>
        <p className="dim">She will only send you somewhere on this list.</p>
        <ChipGroup
          options={SETTING_OPTIONS}
          selected={profile.settingPreferences}
          onChange={setSettings}
        />
      </section>

      <section className="panel">
        <h2>What kind</h2>
        <p className="dim">More choices, more variety.</p>
        <ChipGroup
          options={CATEGORY_OPTIONS}
          selected={profile.categoryPreferences}
          onChange={setCategories}
          selectAll="random activities"
        />
      </section>

      <section className="panel">
        <h2>How hard</h2>
        <p className="dim">One rank at a time.</p>
        <ChipGroup
          options={DIFFICULTY_OPTIONS}
          selected={[profile.difficultyPreference]}
          onChange={setDifficulty}
          single
          wide
        />
      </section>

      <section className="panel">
        <h2>Sound</h2>
        <p className="dim">Chimes when a quest is dealt, finished or set aside.</p>
        <button
          type="button"
          className="toggle"
          role="switch"
          aria-checked={soundOn}
          onClick={() => setSound(!soundOn)}
        >
          <span className="track" aria-hidden="true">
            <span className="knob" />
          </span>
          {soundOn ? 'Sound on' : 'Sound off'}
        </button>
      </section>

      <p className="center">
        <button type="button" className="btn quiet" onClick={reset}>
          Start over
        </button>
      </p>
    </div>
  );
}
