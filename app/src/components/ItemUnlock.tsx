/**
 * The milestone screen. A week of streak just turned into something she can
 * wear, and this is the only moment the app ever interrupts to celebrate.
 *
 * More than one item can land at once — someone returning after a long absence
 * can cross two milestones in a single completion — so this steps through them
 * one at a time rather than presenting a pile.
 */

import { useEffect, useRef, useState } from 'react';
import { AvatarDefs } from './AvatarDefs';
import { ItemThumb } from './ItemThumb';
import { SLOT_LABELS, type Item } from '../types';

interface Props {
  items: readonly Item[];
  /** Puts the item on, so "wear it now" works without leaving the dialog. */
  onEquip: (itemId: string) => void;
  /** Called once every unlocked item has been seen. */
  onDone: () => void;
}

export function ItemUnlock({ items, onEquip, onDone }: Props) {
  const [at, setAt] = useState(0);
  const wearRef = useRef<HTMLButtonElement>(null);
  const item = items[at];

  const next = () => (at + 1 < items.length ? setAt(at + 1) : onDone());

  /* Focus the affirmative, not the X. A reward dialog whose default keyboard
     action is "dismiss" makes the reward easy to miss, and equipping is
     reversible from the inventory anyway. */
  useEffect(() => {
    wearRef.current?.focus();
  }, [at]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  if (!item) return null;

  return (
    <div className="scrim" onClick={onDone}>
      <AvatarDefs />
      <div
        className="panel modal unlock dealt"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlock-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close"
          onClick={onDone}
          aria-label="Close"
        >
          ✕
        </button>

        <p className="eyebrow">
          {item.unlockAtStreakWeeks === 1
            ? 'One week'
            : `${item.unlockAtStreakWeeks} weeks`}{' '}
          · unlocked
        </p>

        <div className="unlock-art">
          <span className="unlock-halo" aria-hidden="true" />
          <ItemThumb item={item} locked={false} />
        </div>

        <h2 id="unlock-title">{item.name}</h2>
        <p className="dim">{SLOT_LABELS[item.type]}</p>
        <p className="flavor">{item.flavor}</p>

        <div className="row">
          <button
            ref={wearRef}
            type="button"
            className="btn primary"
            onClick={() => {
              onEquip(item.id);
              next();
            }}
          >
            Wear it
          </button>
          <button type="button" className="btn" onClick={next}>
            Later
          </button>
        </div>

        {items.length > 1 ? (
          <p className="dim center sm">
            {at + 1} of {items.length}
          </p>
        ) : null}
      </div>
    </div>
  );
}
