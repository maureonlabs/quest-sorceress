/**
 * The daily check-in. Four questions, asked fresh every day.
 *
 * Where you are, how you feel, what you want to feel, and how hard you want it.
 * All four are facts about *today* rather than standing preferences, which is
 * why none of them lives on the profile — see design/TAXONOMY.md.
 *
 * The questions are stepped rather than stacked on one screen. Four lists of
 * chips at once reads as a form, and nobody fills in a form before they are
 * allowed to use an app.
 */

import { useState } from 'react';
import { ChipGroup } from '../components/ChipGroup';
import { Filigree } from '../components/Filigree';
import { VineFrame } from '../components/VineFrame';
import { useGame } from '../state';
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  MOODS,
  MOOD_HINTS,
  MOOD_LABELS,
  SETTINGS,
  SETTING_LABELS,
  WANTS,
  WANT_HINTS,
  WANT_LABELS,
  type Difficulty,
  type Mood,
  type Setting,
  type Want,
} from '../types';

const SETTING_OPTIONS = SETTINGS.map((v) => ({ value: v, label: SETTING_LABELS[v] }));
const MOOD_OPTIONS = MOODS.map((v) => ({
  value: v,
  label: MOOD_LABELS[v],
  sub: MOOD_HINTS[v],
}));
const WANT_OPTIONS = WANTS.map((v) => ({
  value: v,
  label: WANT_LABELS[v],
  sub: WANT_HINTS[v],
}));
const DIFFICULTY_OPTIONS = DIFFICULTIES.map((v) => ({
  value: v,
  label: DIFFICULTY_LABELS[v],
  sub: v,
}));

export function CheckIn() {
  const { profile, checkIn } = useGame();

  const [step, setStep] = useState(0);
  /* Pre-ticked from the profile: somebody who never goes to a gym should not
     have to un-tick one every single morning. */
  const [places, setPlaces] = useState<Setting[]>(profile?.settingPreferences ?? []);
  const [mood, setMood] = useState<Mood[]>([]);
  const [want, setWant] = useState<Want[]>([]);
  /* The profile's stored rank is the default offered, not the final word. */
  const [difficulty, setDifficulty] = useState<Difficulty[]>(
    profile ? [profile.difficultyPreference] : ['easy'],
  );

  const steps = [
    {
      eyebrow: 'Today',
      title: 'Where are you?',
      hint: 'Only what is true today. She will not send you anywhere else.',
      ready: places.length > 0,
      control: (
        <ChipGroup options={SETTING_OPTIONS} selected={places} onChange={setPlaces} />
      ),
    },
    {
      eyebrow: 'Today',
      title: 'How are you?',
      hint: 'Answer honestly. A hard day means she asks for less, not more.',
      ready: mood.length === 1,
      control: <ChipGroup options={MOOD_OPTIONS} selected={mood} onChange={setMood} single wide />,
    },
    {
      eyebrow: 'Today',
      title: 'What do you want to feel?',
      hint: 'This is what she picks for. Not where you are — where you are going.',
      ready: want.length === 1,
      control: <ChipGroup options={WANT_OPTIONS} selected={want} onChange={setWant} single wide />,
    },
    {
      eyebrow: 'Today',
      title: 'How hard?',
      hint: 'Your pick is a ceiling, never a floor. She can ask for less.',
      ready: difficulty.length === 1,
      control: (
        <ChipGroup
          options={DIFFICULTY_OPTIONS}
          selected={difficulty}
          onChange={setDifficulty}
          single
          wide
        />
      ),
    },
  ];

  const current = steps[step];
  const last = step === steps.length - 1;

  const next = () => {
    if (!last) {
      setStep(step + 1);
      return;
    }
    checkIn({
      settings: places,
      mood: mood[0],
      want: want[0],
      difficulty: difficulty[0],
    });
  };

  return (
    <div className="content">
      <header className="center">
        <p className="brand sm">Quest Sorceress</p>
        <h1>Before she deals</h1>
      </header>

      <div className="card-stage">
        <VineFrame layer="back" />
        <section className="panel settings-lead dealt" key={step}>
          <Filigree size={48} />

          <div className="pips">
            {steps.map((_, i) => (
              <span key={i} className={i <= step ? 'pip on' : 'pip'} />
            ))}
          </div>

          <p className="eyebrow">{current.eyebrow}</p>
          <h2>{current.title}</h2>
          <p className="dim">{current.hint}</p>

          {current.control}

          <div className="row">
            {step > 0 ? (
              <button type="button" className="btn" onClick={() => setStep(step - 1)}>
                Back
              </button>
            ) : null}
            <button
              type="button"
              className="btn primary"
              onClick={next}
              disabled={!current.ready}
            >
              {last ? 'Deal me in' : 'Next'}
            </button>
          </div>
        </section>
        <VineFrame layer="front" />
      </div>
    </div>
  );
}
