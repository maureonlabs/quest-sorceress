/**
 * The way in. A green portal opens, fairy lights drift up through it, and the
 * app is on the other side.
 *
 * Runs once per app start. Deliberately short — an entrance you sit through
 * twice a day has to stay on the right side of charming.
 */

import { useEffect, useRef, useState } from 'react';
import * as sound from '../sound';

const DURATION = 2400;
const REDUCED_DURATION = 700;

export function Portal({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leaving, setLeaving] = useState(false);

  const reduced =
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;
  const total = reduced ? REDUCED_DURATION : DURATION;

  useEffect(() => {
    sound.play('enter');
    const fade = setTimeout(() => setLeaving(true), total - 450);
    const done = setTimeout(onDone, total);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, [onDone, total]);

  /* Fairy lights: motes rising through the portal, brighter near the middle. */
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = (canvas.width = innerWidth * dpr);
    let h = (canvas.height = innerHeight * dpr);

    const motes = Array.from({ length: 70 }, () => ({
      x: Math.random() * w,
      y: h * (0.5 + Math.random() * 0.8),
      r: (Math.random() * 1.8 + 0.5) * dpr,
      speed: (Math.random() * 0.9 + 0.35) * dpr,
      drift: (Math.random() - 0.5) * 0.4 * dpr,
      phase: Math.random() * Math.PI * 2,
      warm: Math.random() > 0.72,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.speed;
        m.x += m.drift + Math.sin((m.phase += 0.02)) * 0.3 * dpr;
        if (m.y < -10) m.y = h + 10;

        // Fade toward the edges so the light reads as coming through a doorway.
        const edge = 1 - Math.abs(m.x - w / 2) / (w / 2);
        const alpha = Math.max(0, edge) * (0.45 + 0.4 * Math.sin(m.phase));

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = m.warm
          ? `rgba(240, 214, 149, ${alpha.toFixed(3)})`
          : `rgba(139, 240, 210, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
    };
    addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', onResize);
    };
  }, [reduced]);

  return (
    <div className={leaving ? 'portal leaving' : 'portal'} aria-hidden="true">
      <canvas ref={canvasRef} className="portal-motes" />
      <div className="portal-ring" />
      <div className="portal-ring two" />
      <div className="portal-core" />
      <div className="portal-word">
        <p className="brand hero">Quest Sorceress</p>
        <p className="brand-rule">One card only</p>
      </div>
    </div>
  );
}
