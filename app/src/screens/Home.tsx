/**
 * Home. The whole point of the app lives here: one button, one quest.
 */

import { Link } from 'react-router-dom';
import { useGame } from '../state';
import { parseDescription } from '../game/text';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '../types';

export function Home() {
  const {
    pending,
    pendingTemplate,
    streak,
    completedToday,
    generate,
    complete,
    dismiss,
  } = useGame();

  return (
    <div className="content">
      <header className="meta" style={{ borderTop: 'none', paddingTop: 0 }}>
        <p className="eyebrow">Quest Sorceress</p>
        <div className="streak">
          <b>{streak}</b>
          <span>{streak === 1 ? 'day' : 'days'}</span>
        </div>
      </header>

      {pending && pendingTemplate ? (
        <QuestCard
          key={pending.id}
          onComplete={() => complete(pending.id)}
          onDismiss={() => dismiss(pending.id)}
          onReroll={generate}
          template={pendingTemplate}
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

      <p className="center">
        <Link to="/preferences" className="btn quiet" style={{ display: 'inline-block' }}>
          Change what she asks of you
        </Link>
      </p>
    </div>
  );
}

function QuestCard({
  template,
  onComplete,
  onDismiss,
  onReroll,
}: {
  template: import('../types').QuestTemplate;
  onComplete: () => void;
  onDismiss: () => void;
  onReroll: () => void;
}) {
  const { flavor, steps } = parseDescription(template.description);

  return (
    <>
      <section className="panel dealt">
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

        <div className="row">
          <button type="button" className="btn primary" onClick={onComplete}>
            Done
          </button>
          <button type="button" className="btn" onClick={onDismiss}>
            Not this
          </button>
        </div>
      </section>

      <p className="center">
        <button type="button" className="btn quiet" onClick={onReroll}>
          Give me another instead
        </button>
      </p>
    </>
  );
}
