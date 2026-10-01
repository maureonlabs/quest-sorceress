/**
 * Asked once a day: where are you today?
 *
 * The profile says where the player goes in general; this says where they are
 * now, and quests are filtered to it. Being at the gym today is a stronger fact
 * than usually going to the gym.
 *
 * Only their own chosen places are offered — this is a narrowing question, not
 * a second onboarding.
 */

import { useState } from 'react';
import { ChipGroup } from '../components/ChipGroup';
import { useGame } from '../state';
import { SETTING_LABELS, type Setting } from '../types';

export function CheckIn() {
  const { profile, checkIn } = useGame();
  const [picked, setPicked] = useState<Setting[]>([]);
  if (!profile) return null;

  const options = profile.settingPreferences.map((v) => ({
    value: v,
    label: SETTING_LABELS[v],
  }));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="content">
      <header className="center">
        <p className="brand sm">Quest Sorceress</p>
      </header>

      <section className="panel dealt">
        <p className="eyebrow">{greeting}</p>
        <h1>Where are you today?</h1>
        <p className="dim">
          She will only send you somewhere you actually are. Pick more than one if your
          day moves around.
        </p>

        <ChipGroup options={options} selected={picked} onChange={setPicked} />

        <button
          type="button"
          className="btn primary big"
          disabled={picked.length === 0}
          onClick={() => checkIn(picked)}
        >
          {picked.length === 0 ? 'Pick at least one' : 'Begin the day'}
        </button>

        <button
          type="button"
          className="btn quiet"
          onClick={() => checkIn(profile.settingPreferences)}
        >
          I could be anywhere — use all of them
        </button>
      </section>
    </div>
  );
}
