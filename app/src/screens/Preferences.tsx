/**
 * The standing answers — the ones that are not asked every morning.
 *
 * Saves on every change; there is no save button, because there is nothing to
 * lose by changing your mind. What you want to feel and how you feel today are
 * deliberately absent: those belong to the daily check-in.
 */

import { useNavigate } from 'react-router-dom';
import { ChipGroup } from '../components/ChipGroup';
import { Filigree } from '../components/Filigree';
import { HairPicker } from '../components/HairPicker';
import { VineFrame } from '../components/VineFrame';
import { useGame } from '../state';
import {
  AGE_LABELS,
  AGE_RANGES,
  BODY_LABELS,
  BODY_TYPES,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  SETTINGS,
  SETTING_LABELS,
  type AgeRange,
  type BodyType,
  type Difficulty,
  type Setting,
} from '../types';

const SETTING_OPTIONS = SETTINGS.map((v) => ({ value: v, label: SETTING_LABELS[v] }));
const DIFFICULTY_OPTIONS = DIFFICULTIES.map((v) => ({
  value: v,
  label: DIFFICULTY_LABELS[v],
  sub: v,
}));
const AGE_OPTIONS = AGE_RANGES.map((v) => ({ value: v, label: AGE_LABELS[v] }));
const BODY_OPTIONS = BODY_TYPES.map((v) => ({ value: v, label: BODY_LABELS[v] }));

export function Preferences() {
  const { profile, saveProfile, startOver, soundOn, setSound, setHairColor } = useGame();
  const navigate = useNavigate();
  if (!profile) return null;

  /** Never let the player empty the list — the check-in would have nothing to offer. */
  const setSettings = (update: (c: readonly Setting[]) => Setting[]) => {
    const next = update(profile.settingPreferences);
    if (next.length > 0) saveProfile({ ...profile, settingPreferences: next });
  };
  const setDifficulty = (update: (c: readonly Difficulty[]) => Difficulty[]) => {
    const next = update([profile.difficultyPreference]);
    if (next[0]) saveProfile({ ...profile, difficultyPreference: next[0] });
  };
  const setAge = (update: (c: readonly AgeRange[]) => AgeRange[]) => {
    const next = update([profile.ageRange]);
    if (next[0]) saveProfile({ ...profile, ageRange: next[0] });
  };
  const setBody = (update: (c: readonly BodyType[]) => BodyType[]) => {
    const next = update([profile.bodyType]);
    if (next[0]) saveProfile({ ...profile, bodyType: next[0] });
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

      <div className="card-stage">
        <VineFrame layer="back" />
        <section className="panel settings-lead">
          <Filigree size={48} />
          <h2>Where you go</h2>
          <p className="dim">
            She asks each morning which of these is true today, and only offers what you
            tick here.
          </p>
          <ChipGroup
            options={SETTING_OPTIONS}
            selected={profile.settingPreferences}
            onChange={setSettings}
          />
        </section>
        <VineFrame layer="front" />
      </div>

      <section className="panel">
        <Filigree size={44} />
        <h2>How hard, usually</h2>
        <p className="dim">The rank the morning question starts on. Today's answer wins.</p>
        <ChipGroup
          options={DIFFICULTY_OPTIONS}
          selected={[profile.difficultyPreference]}
          onChange={setDifficulty}
          single
          wide
        />
      </section>

      <section className="panel">
        <Filigree size={44} />
        <h2>Your age</h2>
        <p className="dim">
          Keeps quests meant for somebody else off your card. It never leaves this device.
        </p>
        <ChipGroup options={AGE_OPTIONS} selected={[profile.ageRange]} onChange={setAge} single wide />
      </section>

      <section className="panel">
        <Filigree size={44} />
        <h2>Your figure</h2>
        <p className="dim">Looks only. It changes nothing about what she asks of you.</p>
        <ChipGroup options={BODY_OPTIONS} selected={[profile.bodyType]} onChange={setBody} single wide />
        <p className="dim sm">Hair</p>
        <HairPicker value={profile.hairColor} onChange={setHairColor} />
      </section>

      <section className="panel">
        <Filigree size={44} />
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
