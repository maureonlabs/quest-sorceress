/**
 * Everything there is to own, in the order it can be earned.
 *
 * Locked items are **dimmed, not hidden** — seeing the next piece is most of
 * the reason to keep a streak, and a grid of empty squares would say nothing
 * about what is coming.
 */

import { Link } from 'react-router-dom';
import { AvatarDefs } from '../components/AvatarDefs';
import { Filigree } from '../components/Filigree';
import { ItemThumb } from '../components/ItemThumb';
import { daysUntil, isEquipped, ladder, owns } from '../game/items';
import { useGame } from '../state';
import { SLOT_LABELS } from '../types';

export function Inventory() {
  const { items, equip, unequip, streak } = useGame();
  const all = ladder();
  const ownedCount = all.filter((i) => owns(items, i.id)).length;

  return (
    <div className="content">
      <AvatarDefs />

      <header>
        <p className="eyebrow">Inventory</p>
        <h1>What she has gathered</h1>
        <p className="dim">
          {ownedCount} of {all.length} earned. Locked pieces are shown so you know what
          the next week is worth.
        </p>
      </header>

      <section className="panel">
        <Filigree size={44} />
        <ul className="slots">
          {all.map((item) => {
            const have = owns(items, item.id);
            const on = isEquipped(items, item.id);
            const left = daysUntil(item, streak);

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={['slot', have ? 'have' : 'locked', on ? 'on' : '']
                    .filter(Boolean)
                    .join(' ')}
                  disabled={!have}
                  aria-pressed={have ? on : undefined}
                  onClick={() => (on ? unequip(item.id) : equip(item.id))}
                >
                  <span className="slot-ring" aria-hidden="true" />
                  <ItemThumb item={item} locked={!have} />
                  {!have ? (
                    <span className="slot-lock" aria-hidden="true">
                      ✦
                    </span>
                  ) : null}
                </button>

                <p className="slot-name">{item.name}</p>
                <p className="slot-meta">
                  {have
                    ? on
                      ? 'Worn'
                      : SLOT_LABELS[item.type]
                    : left > 0
                      ? `${left} ${left === 1 ? 'day' : 'days'} away`
                      : `${item.unlockAtStreakWeeks}-week streak`}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <Link to="/avatar" className="btn tune">
        <span className="glyph" aria-hidden="true">
          ✦
        </span>
        Back to your sorceress
      </Link>
    </div>
  );
}
