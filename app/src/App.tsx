import { useEffect, useState } from 'react';
import { HashRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Portal } from './components/Portal';
import { ForestScene } from './components/ForestScene';
import * as sound from './sound';
import { GameProvider, useGame } from './state';
import { Home } from './screens/Home';
import { Onboarding } from './screens/Onboarding';
import { Preferences } from './screens/Preferences';
import { CheckIn } from './screens/CheckIn';
const NAV = [
  { to: '/', glyph: '✦', label: 'Quest' },
  { to: '/preferences', glyph: '❖', label: 'Preferences' },
];

function Nav() {
  const { pathname } = useLocation();
  return (
    <nav className="nav">
      <p className="wordmark brand side">Quest Sorceress</p>
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          aria-current={pathname === item.to ? 'page' : undefined}
        >
          <span className="glyph" aria-hidden="true">
            {item.glyph}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/** No profile means the engine has nothing to filter on, so onboarding wins
 *  over any route — including a deep link someone pasted. */
function Shell() {
  const { profile, remembers, here } = useGame();

  if (!profile) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  }

  /* A new day: ask where they are before anything else, because every quest
     that follows depends on the answer. */
  if (here === null) {
    return (
      <Routes>
        <Route path="*" element={<CheckIn />} />
      </Routes>
    );
  }

  return (
    <div className="shell">
      <Nav />
      <main>
        {!remembers ? (
          <div className="content" style={{ paddingBottom: 0 }}>
            <p className="notice">
              This browser will not let the app save anything — a private window, or site
              data is blocked. You can play, but your streak will be gone when you close
              the tab.
            </p>
          </div>
        ) : null}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/onboarding" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  /* The portal runs once per app start, over the app rather than instead of it,
     so everything is mounted and ready by the time it clears. */
  const [entering, setEntering] = useState(true);

  /* Browsers block audio until the visitor has interacted, so the very first
     portal of a session may open in silence.
     
     Every interaction tries again until audio is actually running, and only
     then do the listeners come off. A single `{ once: true }` listener was the
     bug: on a phone the first touch frequently fails to start the context, and
     once that listener had removed itself there was no second chance for the
     rest of the session.
     
     `touchend` and `click` are here as well as `pointerdown` because not every
     mobile browser treats those as the same gesture for audio purposes. */
  useEffect(() => {
    const events = ['pointerdown', 'touchend', 'click', 'keydown'] as const;
    const go = () => {
      sound.arm();
      if (sound.isRunning()) stop();
    };
    const stop = () => events.forEach((e) => window.removeEventListener(e, go));
    events.forEach((e) => window.addEventListener(e, go));
    return stop;
  }, []);

  return (
    <GameProvider>
      <ForestScene />
      <HashRouter>
        <Shell />
      </HashRouter>
      {entering ? <Portal onDone={() => setEntering(false)} /> : null}
    </GameProvider>
  );
}
