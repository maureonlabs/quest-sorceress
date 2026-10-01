import { useEffect, useState } from 'react';
import { HashRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Portal } from './components/Portal';
import { ForestScene } from './components/ForestScene';
import * as sound from './sound';
import { GameProvider, useGame } from './state';
import { Home } from './screens/Home';
import { Onboarding } from './screens/Onboarding';
import { Preferences } from './screens/Preferences';

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
  const { profile, remembers } = useGame();

  if (!profile) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
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
     portal of a session may open in silence. One listener unlocks it, after
     which every later cue — and every later portal — sounds. */
  useEffect(() => {
    const go = () => sound.unlock();
    window.addEventListener('pointerdown', go, { once: true });
    window.addEventListener('keydown', go, { once: true });
    return () => {
      window.removeEventListener('pointerdown', go);
      window.removeEventListener('keydown', go);
    };
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
