/**
 * The moment of reward. Shown once a quest is marked done.
 *
 * Both the X and the primary button lead to the next quest — the X is the
 * escape hatch, the button is the affirmative, and neither leaves you staring
 * at an empty screen.
 */

import { useEffect, useRef } from 'react';

interface Props {
  title: string;
  streak: number;
  onNext: () => void;
}

export function QuestComplete({ title, streak, onNext }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus the dialog so a keyboard or screen reader lands inside it, and let
  // Escape behave the way it does in every other dialog on the web.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNext]);

  return (
    <div className="scrim" onClick={onNext}>
      <div
        className="panel modal dealt"
        role="dialog"
        aria-modal="true"
        aria-labelledby="congrats-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="close"
          onClick={onNext}
          aria-label="Close and draw the next quest"
        >
          ✕
        </button>

        <p className="eyebrow">Quest complete</p>
        <h2 id="congrats-title">Congratulations</h2>
        <p className="flavor">You finished &ldquo;{title}&rdquo;.</p>

        {streak > 0 ? (
          <p className="dim">
            {streak === 1
              ? 'That is day one. Come back tomorrow to keep it alive.'
              : `${streak} days in a row now.`}
          </p>
        ) : null}

        <button type="button" className="btn primary big" onClick={onNext}>
          Next quest
        </button>
      </div>
    </div>
  );
}
