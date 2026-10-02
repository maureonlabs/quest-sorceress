/**
 * First run. Four questions, and none of them is skippable.
 *
 * What is *not* asked here matters as much as what is. Mood, target feeling and
 * difficulty are asked daily instead, because they are facts about today rather
 * than standing preferences — see design/TAXONOMY.md.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChipGroup } from '../components/ChipGroup';
import {
  AGE_LABELS,
  AGE_RANGES,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  SETTINGS,
  SETTING_LABELS,
  type AgeRange,
  type Difficulty,
  type Setting,
} from '../types';
import { useGame } from '../state';

const SETTING_OPTIONS = SETTINGS.map((v) => ({ value: v, label: SETTING_LABELS[v] }));
const DIFFICULTY_OPTIONS = DIFFICULTIES.map((v) => ({
  value: v,
  label: DIFFICULTY_LABELS[v],
  sub: v,
}));
const AGE_OPTIONS = AGE_RANGES.map((v) => ({ value: v, label: AGE_LABELS[v] }));

export function Onboarding() {
  const { saveProfile } = useGame();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty[]>(['easy']);
  const [age, setAge] = useState<AgeRange[]>([]);

  const steps = [
    {
      title: 'Where do you spend your days?',
      hint: 'Everywhere you actually go. She asks again each morning which of these is true today.',
      ready: settings.length > 0,
      control: (
        <ChipGroup options={SETTING_OPTIONS} selected={settings} onChange={setSettings} />
      ),
    },
    {
      title: 'How hard, usually?',
      hint: 'A starting point. You can change it any morning, and a bad day lowers it on its own.',
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
    {
      title: 'How old are you?',
      hint: 'So she never hands you something meant for somebody else. Nothing leaves your device.',
      ready: age.length === 1,
      control: <ChipGroup options={AGE_OPTIONS} selected={age} onChange={setAge} single wide />,
    },
  ];

  const current = steps[step];
  const last = step === steps.length - 1;

  const next = () => {
    if (!last) {
      setStep(step + 1);
      return;
    }
    saveProfile({
      displayName: null,
      settingPreferences: settings,
      difficultyPreference: difficulty[0],
      ageRange: age[0],
      createdAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <div className="content">
      <header className="center">
        <p className="brand sm">Quest Sorceress</p>
        <h1>She deals one card only</h1>
      </header>

      <section className="panel dealt" key={step}>
        <div className="pips">
          {steps.map((_, i) => (
            <span key={i} className={i <= step ? 'pip on' : 'pip'} />
          ))}
        </div>

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
            {last ? 'Begin' : 'Next'}
          </button>
        </div>
      </section>
    </div>
  );
}
