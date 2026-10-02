/**
 * The wardrobe: everything there is to own, one slot at a time.
 *
 * Sixty-one items in a single grid is a wall. Slots are the natural division —
 * you come here to change *one* thing — so the screen opens on a rail of slots
 * and shows one slot's rack at a time, with the figure above it so the effect
 * of a tap is visible without leaving.
 *
 * Locked items are **dimmed, not hidden**. Seeing the next piece is most of the
 * reason to keep a streak, and a rack of empty squares says nothing about what
 * is coming.
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AvatarDefs } from '../components/AvatarDefs';
import { Filigree } from '../components/Filigree';
import { ItemThumb } from '../components/ItemThumb';
import { Sorceress } from '../components/Sorceress';
import {
  daysUntil,
  equippedInSlot,
  isEquipped,
  itemsInSlot,
  ladder,
  owns,
} from '../game/items';
import { useGame } from '../state';
import { ITEM_SLOTS, SLOT_LABELS, type ItemSlot } from '../types';

export function Inventory() {
  const { profile, items, equipped, equip, unequip, streak } = useGame();
  const [slot, setSlot] = useState<ItemSlot>('crown');
  const rail = useRef<HTMLElement>(null);

  /* Nine tabs do not fit a phone, so the rail scrolls — and the one that is
     selected has to be the one you can see. Without this the screen opens on
     Crown with Crown scrolled off the right-hand edge. */
  useEffect(() => {
    rail.current
      ?.querySelector('[aria-pressed="true"]')
      ?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [slot]);

  if (!profile) return null;

  const all = ladder();
  const ownedCount = all.filter((i) => owns(items, i.id)).length;
  const rack = itemsInSlot(slot);
  const wearing = equippedInSlot(items, slot);

  return (
    <div className="content">
      <AvatarDefs />

      <header>
        <p className="eyebrow">Wardrobe</p>
        <h1>What she has gathered</h1>
        <p className="dim">
          {ownedCount} of {all.length} earned. Locked pieces are shown so you know what the
          next week is worth.
        </p>
      </header>

      {/* The figure stays on screen, so a tap on the rack shows its effect. */}
      <section className="panel wardrobe-figure">
        <Filigree size={40} />
        <Sorceress
          bodyType={profile.bodyType}
          hairColor={profile.hairColor}
          equipped={equipped}
          label="Your figure, wearing everything currently equipped."
        />
      </section>

      <nav className="slot-rail" aria-label="Wardrobe slots" ref={rail}>
        {ITEM_SLOTS.map((s) => {
          const have = itemsInSlot(s).filter((i) => owns(items, i.id)).length;
          return (
            <button
              key={s}
              type="button"
              className={s === slot ? 'slot-tab on' : 'slot-tab'}
              aria-pressed={s === slot}
              onClick={() => setSlot(s)}
            >
              {SLOT_LABELS[s]}
              <span className="tab-count">{have}</span>
            </button>
          );
        })}
      </nav>

      <section className="panel">
        <Filigree size={44} />
        <h2>{SLOT_LABELS[slot]}</h2>
        <p className="dim">
          {wearing ? (
            <>
              Wearing <b className="gold">{wearing.name}</b>. Tap it again to take it off.
            </>
          ) : (
            'Nothing worn in this slot.'
          )}
        </p>

        <ul className="slots">
          {rack.map((i) => {
            const have = owns(items, i.id);
            const on = isEquipped(items, i.id);
            const left = daysUntil(i, streak);

            return (
              <li key={i.id}>
                <button
                  type="button"
                  className={['slot', have ? 'have' : 'locked', on ? 'on' : '']
                    .filter(Boolean)
                    .join(' ')}
                  disabled={!have}
                  aria-pressed={have ? on : undefined}
                  aria-label={have ? i.name : `${i.name}, locked`}
                  onClick={() => (on ? unequip(i.id) : equip(i.id))}
                >
                  <span className="slot-ring" aria-hidden="true" />
                  <ItemThumb art={i.art} locked={!have} hairColor={profile.hairColor} />
                  {!have ? (
                    <span className="slot-lock" aria-hidden="true">
                      ✦
                    </span>
                  ) : null}
                </button>

                <p className="slot-name">{i.name}</p>
                <p className="slot-meta">
                  {have
                    ? on
                      ? 'Worn'
                      : 'Owned'
                    : left > 0
                      ? `${left} ${left === 1 ? 'day' : 'days'} away`
                      : `${i.unlockAtStreakWeeks}-week streak`}
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
        Back to your figure
      </Link>
    </div>
  );
}
