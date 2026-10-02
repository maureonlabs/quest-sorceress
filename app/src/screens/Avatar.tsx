/**
 * Your figure. Framed like the panels — vines and blossom around her, forest
 * behind — because she belongs to the same world as the quest card.
 *
 * Hair colour lives here rather than in the wardrobe, because it is the one
 * thing a player with nothing unlocked can still change. A character screen
 * that offers no choices at all on day one is a character screen nobody
 * revisits.
 */

import { Link } from 'react-router-dom';
import { AvatarDefs } from '../components/AvatarDefs';
import { Filigree } from '../components/Filigree';
import { HairPicker } from '../components/HairPicker';
import { Sorceress } from '../components/Sorceress';
import { VineFrame } from '../components/VineFrame';
import { daysUntil, ladder, owns } from '../game/items';
import { useGame } from '../state';
import { BODY_LABELS, SLOT_LABELS } from '../types';

export function Avatar() {
  const { profile, items, equipped, unequip, nextUnlock, streak, setHairColor } = useGame();
  if (!profile) return null;

  const ownedCount = ladder().filter((i) => owns(items, i.id)).length;
  const described =
    equipped.length > 0
      ? `Your ${BODY_LABELS[profile.bodyType].toLowerCase()}, wearing ${equipped
          .map((i) => i.name)
          .join(', ')}.`
      : `Your ${BODY_LABELS[profile.bodyType].toLowerCase()}, with nothing equipped yet.`;

  return (
    <div className="content">
      <AvatarDefs />

      <header>
        <p className="eyebrow">Your {BODY_LABELS[profile.bodyType].toLowerCase()}</p>
        <h1>She wears what you earn</h1>
      </header>

      <div className="card-stage">
        <VineFrame layer="back" />
        <section className="panel avatar-panel">
          <span className="sheen" aria-hidden="true" />
          <Filigree size={52} />
          <Sorceress
            bodyType={profile.bodyType}
            hairColor={profile.hairColor}
            equipped={equipped}
            label={described}
          />
        </section>
        <VineFrame layer="front" />
      </div>

      <section className="panel">
        <Filigree size={44} />
        <h2>Hair</h2>
        <p className="dim">Yours from the start. No streak required.</p>
        <HairPicker value={profile.hairColor} onChange={setHairColor} />
      </section>

      <section className="panel">
        <Filigree size={44} />
        <h2>Worn</h2>
        {equipped.length === 0 ? (
          <p className="dim">
            {ownedCount === 0
              ? 'Nothing yet. Keep a streak going for a week and the first pieces are yours.'
              : `Nothing on. You have ${ownedCount} ${
                  ownedCount === 1 ? 'piece' : 'pieces'
                } waiting in the wardrobe.`}
          </p>
        ) : (
          <ul className="worn">
            {equipped.map((i) => (
              <li key={i.id}>
                <span className="worn-slot">{SLOT_LABELS[i.type]}</span>
                <span className="worn-name">{i.name}</span>
                <button type="button" className="btn quiet tiny" onClick={() => unequip(i.id)}>
                  Take off
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {nextUnlock ? (
        <section className="panel">
          <Filigree size={44} />
          <h2>Next</h2>
          <p className="dim">
            <b className="gold">{nextUnlock.name}</b> — {SLOT_LABELS[nextUnlock.type]}, at{' '}
            {nextUnlock.unlockAtStreakWeeks === 1
              ? 'one week'
              : `${nextUnlock.unlockAtStreakWeeks} weeks`}{' '}
            of streak.
            {daysUntil(nextUnlock, streak) > 0
              ? ` ${daysUntil(nextUnlock, streak)} ${
                  daysUntil(nextUnlock, streak) === 1 ? 'day' : 'days'
                } to go.`
              : ''}
          </p>
        </section>
      ) : (
        <section className="panel">
          <Filigree size={44} />
          <h2>Next</h2>
          <p className="dim">
            Every piece earned. There is nothing left to unlock — only the streak itself to
            keep.
          </p>
        </section>
      )}

      <Link to="/inventory" className="btn tune">
        <span className="glyph" aria-hidden="true">
          ✧
        </span>
        Open the wardrobe
      </Link>
    </div>
  );
}
