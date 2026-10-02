/**
 * Home. The whole point of the app lives here: one button, one quest.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../state';
import { parseDescription } from '../game/text';
import { QuestComplete } from '../components/QuestComplete';
import { ItemUnlock } from '../components/ItemUnlock';
import { VineFrame } from '../components/VineFrame';
import { Filigree } from '../components/Filigree';
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  MOOD_LABELS,
  WANT_PHRASE,
  type QuestTemplate,
} from '../types';
import { shiftDifficulty } from '../game/quests';

export function Home() {
  const {
    pending,
    pendingTemplate,
    streak,
    completedToday,
    generate,
    complete,
    justUnlocked,
    clearUnlocked,
    equip,
    here,
  } = useGame();

  /** Held so the congratulations can name the quest after it has left the board. */
  const [justFinished, setJustFinished] = useState<QuestTemplate | null>(null);

  const onComplete = () => {
    if (!pending || !pendingTemplate) return;
    setJustFinished(pendingTemplate);
    complete(pending.id);
  };

  /**
   * Closing the congratulations draws the next quest, rather than dropping you
   * back onto an empty screen — unless a streak milestone just landed, in which
   * case the unlock gets the screen to itself first. Two modals at once would
   * bury the reward under the next thing to do.
   */
  const onNext = () => {
    setJustFinished(null);
    if (justUnlocked.length === 0) generate();
  };

  const onUnlockSeen = () => {
    clearUnlocked();
    generate();
  };

  return (
    <div className="content">
      <header className="topbar">
        <p className="brand sm">Quest Sorceress</p>
        {streak > 0 ? (
          <p className="streak">
            <b>{streak}</b>
            <span>{streak === 1 ? 'day streak' : 'day streak'}</span>
          </p>
        ) : null}
      </header>

      {/* Say the matching out loud. An app that quietly lowers the difficulty
          without mentioning it reads as broken the moment somebody notices. */}
      {here ? (
        <p className="today-line">
          {MOOD_LABELS[here.mood]}, and you want to feel {WANT_PHRASE[here.want]}.
          {shiftDifficulty(here.difficulty, here.mood) !== here.difficulty
            ? ' So she is asking for a little less today.'
            : ''}
        </p>
      ) : null}

      {pending && pendingTemplate ? (
        /* "Not this" dismisses and deals again in one move — generate() already
           records the replaced quest as dismissed. */
        <QuestCard
          key={pending.id}
          template={pendingTemplate}
          onComplete={onComplete}
          onNext={generate}
        />
      ) : (
        <section className="panel dealt">
          <h1>Nothing in hand</h1>
          <p className="dim">
            {completedToday > 0
              ? `${completedToday} done today. Ask for another when you are ready.`
              : 'Ask and she will give you one thing to do. Only one.'}
          </p>
          <button type="button" className="btn primary big" onClick={generate}>
            Give me a quest
          </button>
        </section>
      )}

      <Link to="/preferences" className="btn tune">
        <span className="glyph" aria-hidden="true">
          ❖
        </span>
        Adjust your preferences
      </Link>

      {justFinished ? (
        <QuestComplete title={justFinished.title} streak={streak} onNext={onNext} />
      ) : justUnlocked.length > 0 ? (
        <ItemUnlock items={justUnlocked} onEquip={equip} onDone={onUnlockSeen} />
      ) : null}
    </div>
  );
}

function QuestCard({
  template,
  onComplete,
  onNext,
}: {
  template: QuestTemplate;
  onComplete: () => void;
  onNext: () => void;
}) {
  const { flavor, steps } = parseDescription(template.description);

  return (
    <div className="card-stage dealt">
      {/* behind the glass */}
      <VineFrame layer="back" />

      <section className="panel card">
        <span className="sheen" aria-hidden="true" />
        <Filigree size={56} />

      <div className="card-body">
        <p className="eyebrow">
          {CATEGORY_LABELS[template.category]} · {DIFFICULTY_LABELS[template.difficulty]}
        </p>
        <h1>{template.title}</h1>
        {flavor ? <p className="flavor">{flavor}</p> : null}

        {steps.length > 0 ? (
          <ul className="steps">
            {steps.map((s, i) => (
              <li key={i}>
                <span className="bullet" aria-hidden="true">
                  ◆
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

        <div className="row">
          <button type="button" className="btn primary" onClick={onComplete}>
            Done
          </button>
          <button type="button" className="btn" onClick={onNext}>
            Not this
          </button>
        </div>
      </section>

      {/* and in front of it, so the plant wraps the pane */}
      <VineFrame layer="front" />
    </div>
  );
}
