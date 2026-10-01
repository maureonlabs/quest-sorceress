/**
 * First run. Three questions, because the engine cannot filter without answers
 * to all three — so none of them is skippable.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChipGroup } from '../components/ChipGroup';
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
import { useGame } from '../state';

const SETTING_OPTIONS = SETTINGS.map((v) => ({ value: v, label: SETTING_LABELS[v] }));
const CATEGORY_OPTIONS = CATEGORIES.map((v) => ({ value: v, label: CATEGORY_LABELS[v] }));
const DIFFICULTY_OPTIONS = DIFFICULTIES.map((v) => ({
  value: v,
  label: DIFFICULTY_LABELS[v],
  sub: v,
}));

export function Onboarding() {
  const { saveProfile } = useGame();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty[]>(['easy']);

  const steps = [
    {
      title: 'Where do you spend your days?',
      hint: 'Pick everywhere you actually go. She will only ever send you somewhere you have chosen.',
      ready: settings.length > 0,
      control: (
        <ChipGroup
          options={SETTING_OPTIONS}
          selected={settings}
          onChange={setSettings}
        />
      ),
    },
    {
      title: 'What kind of quests?',
      hint: 'Choose as many as you like. More choices, more variety.',
      ready: categories.length > 0,
      control: (
        <ChipGroup
          options={CATEGORY_OPTIONS}
          selected={categories}
          onChange={setCategories}
        />
      ),
    },
    {
      title: 'How hard should they be?',
      hint: 'One rank. You can change it whenever you like.',
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
    saveProfile({
      displayName: null,
      settingPreferences: settings,
      categoryPreferences: categories,
      difficultyPreference: difficulty[0],
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
