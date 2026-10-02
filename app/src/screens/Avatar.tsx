/**
 * The sorceress. Framed like the panels — vines and blossom around her, forest
 * behind — because she belongs to the same world as the quest card.
 *
 * Everything she owns is equipped from here or from the inventory; the two
 * screens are the same wardrobe seen two ways, so neither needs its own rules.
 */

import { Link } from 'react-router-dom';
import { AvatarDefs } from '../components/AvatarDefs';
import { Filigree } from '../components/Filigree';
import { Sorceress } from '../components/Sorceress';
import { VineFrame } from '../components/VineFrame';
import { daysUntil, ladder, owns } from '../game/items';
import { useGame } from '../state';
import { SLOT_LABELS } from '../types';

export function Avatar() {
  const { items, equipped, unequip, nextUnlock, streak } = useGame();

  /* Owning nothing and wearing nothing are different states, and telling
     someone who has earned all eight that "the first piece" is still ahead of
     them would be plainly false. */
  const ownedCount = ladder().filter((i) => owns(items, i.id)).length;

  const described =
    equipped.length > 0
      ? `Your sorceress, wearing ${equipped.map((i) => i.name).join(', ')}.`
      : 'Your sorceress, in a plain robe, with nothing equipped yet.';

  return (
    <div className="content">
      <AvatarDefs />

      <header>
        <p className="eyebrow">Your sorceress</p>
        <h1>She wears what you earn</h1>
      </header>

      <div className="card-stage">
        <VineFrame layer="back" />
        <section className="panel avatar-panel">
          <span className="sheen" aria-hidden="true" />
          <Filigree size={52} />
          <Sorceress equipped={equipped} label={described} />
        </section>
        <VineFrame layer="front" />
      </div>

      <section className="panel">
        <Filigree size={44} />
        <h2>Worn</h2>
        {equipped.length === 0 ? (
          <p className="dim">
            {ownedCount === 0
              ? 'Nothing yet. Keep a streak going for a week and the first piece is yours.'
              : `Nothing on. You have ${ownedCount} ${
                  ownedCount === 1 ? 'piece' : 'pieces'
                } waiting in your inventory.`}
          </p>
        ) : (
          <ul className="worn">
            {equipped.map((item) => (
              <li key={item.id}>
                <span className="worn-slot">{SLOT_LABELS[item.type]}</span>
                <span className="worn-name">{item.name}</span>
                <button
                  type="button"
                  className="btn quiet tiny"
                  onClick={() => unequip(item.id)}
                >
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
      ) : ownedCount > 0 ? (
        <section className="panel">
          <Filigree size={44} />
          <h2>Next</h2>
          <p className="dim">
            Every piece earned. There is nothing left to unlock — only the streak
            itself to keep.
          </p>
        </section>
      ) : null}

      <Link to="/inventory" className="btn tune">
        <span className="glyph" aria-hidden="true">
          ✧
        </span>
        Open your inventory
      </Link>
    </div>
  );
}
