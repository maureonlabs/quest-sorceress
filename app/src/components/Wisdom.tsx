/**
 * The day's encouragement, shown once the third quest is done.
 *
 * It arrives after the congratulations rather than instead of it, and it is the
 * only thing on the screen when it does: a passage worth reading does not share
 * a dialog with a button marked "next quest".
 */

import { useEffect, useRef } from 'react';
import { Filigree } from './Filigree';
import type { Passage } from '../content/wisdom';

export function Wisdom({ passage, onDone }: { passage: Passage; onDone: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  return (
    <div className="scrim" onClick={onDone}>
      <div
        className="panel modal wisdom dealt"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wisdom-title"
        onClick={(e) => e.stopPropagation()}
      >
        <Filigree size={46} />

        <p className="eyebrow" id="wisdom-title">
          Three done today
        </p>

        <span className="wisdom-mark" aria-hidden="true">
          &ldquo;
        </span>

        <blockquote className="wisdom-text">{passage.text}</blockquote>

        {passage.source ? (
          <p className="wisdom-source">{passage.source}</p>
        ) : (
          <p className="wisdom-source">Words for the road</p>
        )}

        <button ref={closeRef} type="button" className="btn primary big" onClick={onDone}>
          Carry it with you
        </button>
      </div>
    </div>
  );
}
