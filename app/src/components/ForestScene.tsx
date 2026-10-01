/**
 * The enchanted wood the app stands in.
 *
 * Painted on a canvas rather than shipped as a photograph: it adapts to any
 * viewport, costs no download, and the light can move. The static layers are
 * drawn once to an offscreen canvas and blitted each frame — only the motes and
 * fireflies are redrawn, so this stays cheap enough to leave running.
 *
 * If a rendered forest image is ever supplied, it drops in behind all of this
 * as a single background-image on `.scene`; the canvas then only needs to carry
 * the moving light.
 */

import { useEffect, useRef } from 'react';

/** Seeded so the wood is the same wood on every render, not a new one each time. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

interface Mote {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  warm: boolean;
  blur: number;
}

export function ForestScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let back: HTMLCanvasElement | null = null;
    let motes: Mote[] = [];

    /* ---------------------------------------------------------- the wood */
    const paintBackdrop = () => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const g = c.getContext('2d');
      if (!g) return null;
      const R = rng(20261001);

      // Night air, lighter toward the clearing in the middle.
      const sky = g.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.5, h * 0.9);
      sky.addColorStop(0, '#1A3A30');
      sky.addColorStop(0.45, '#102019');
      sky.addColorStop(1, '#050A08');
      g.fillStyle = sky;
      g.fillRect(0, 0, w, h);

      // Three ranks of trees, each darker and sharper than the one behind it.
      const ranks = [
        { n: 16, shade: '#2E5A4A', alpha: 0.45, blur: 11, top: 0.1, wide: 0.05 },
        { n: 11, shade: '#1A3528', alpha: 0.7, blur: 5, top: 0.03, wide: 0.07 },
        { n: 7, shade: '#0B1813', alpha: 0.9, blur: 1, top: -0.04, wide: 0.1 },
      ];

      for (const rank of ranks) {
        g.save();
        g.filter = rank.blur ? `blur(${rank.blur}px)` : 'none';
        g.globalAlpha = rank.alpha;
        g.fillStyle = rank.shade;
        for (let i = 0; i < rank.n; i++) {
          const x = (i / (rank.n - 1)) * w + (R() - 0.5) * w * 0.08;
          const trunkW = w * rank.wide * (0.18 + R() * 0.3);
          const top = h * (rank.top + R() * 0.1);
          // Trunk, tapering as it rises.
          g.beginPath();
          g.moveTo(x - trunkW, h);
          g.lineTo(x - trunkW * 0.45, top);
          g.lineTo(x + trunkW * 0.45, top);
          g.lineTo(x + trunkW, h);
          g.closePath();
          g.fill();
          // Canopy mass hanging off it.
          const leaves = 3 + Math.floor(R() * 3);
          for (let k = 0; k < leaves; k++) {
            g.beginPath();
            g.ellipse(
              x + (R() - 0.5) * w * 0.14,
              top + R() * h * 0.16,
              w * (0.05 + R() * 0.07),
              h * (0.03 + R() * 0.05),
              R() * Math.PI,
              0,
              Math.PI * 2,
            );
            g.fill();
          }
        }
        g.restore();
      }

      // Canopy closing in over the top of the frame.
      g.save();
      g.filter = 'blur(14px)';
      g.fillStyle = 'rgba(4, 10, 8, 0.85)';
      for (let i = 0; i < 16; i++) {
        g.beginPath();
        g.ellipse(R() * w, R() * h * 0.16 - h * 0.02, w * 0.1, h * 0.05, R() * Math.PI, 0, Math.PI * 2);
        g.fill();
      }
      g.restore();

      // Mossy ground, with light pooling where the card will stand.
      const ground = g.createLinearGradient(0, h * 0.72, 0, h);
      ground.addColorStop(0, 'rgba(14, 30, 22, 0)');
      ground.addColorStop(0.4, 'rgba(16, 34, 24, 0.75)');
      ground.addColorStop(1, 'rgba(6, 14, 10, 0.98)');
      g.fillStyle = ground;
      g.fillRect(0, h * 0.72, w, h * 0.28);

      const pool = g.createRadialGradient(w * 0.5, h * 0.86, 0, w * 0.5, h * 0.86, w * 0.6);
      pool.addColorStop(0, 'rgba(201, 163, 78, 0.26)');
      pool.addColorStop(0.5, 'rgba(111, 216, 192, 0.09)');
      pool.addColorStop(1, 'transparent');
      g.fillStyle = pool;
      g.fillRect(0, h * 0.55, w, h * 0.45);

      // The ground: a silhouetted mass with a broken top edge, so there is a
      // visible line where the wood meets the earth rather than a soft wash.
      g.save();
      const horizon = h * 0.8;
      g.beginPath();
      g.moveTo(0, h);
      g.lineTo(0, horizon);
      for (let x = 0; x <= w; x += w / 36) {
        const n =
          Math.sin(x * 0.011) * h * 0.012 +
          Math.sin(x * 0.027 + 1.7) * h * 0.008 +
          (R() - 0.5) * h * 0.006;
        g.lineTo(x, horizon + n);
      }
      g.lineTo(w, h);
      g.closePath();
      g.fillStyle = '#060E0A';
      g.fill();

      // mossy sheen catching the light along the top of it
      g.filter = 'blur(5px)';
      g.strokeStyle = 'rgba(120, 190, 150, 0.22)';
      g.lineWidth = 2.5;
      g.stroke();
      g.restore();

      // Orbs resting in the grass — static, unlike the drifting motes above.
      g.save();
      g.filter = 'blur(4px)';
      for (let i = 0; i < 9; i++) {
        const ox = R() * w;
        const oy = horizon + R() * (h - horizon) * 0.75;
        const orr = (4 + R() * 9) * (w / 900);
        const halo = g.createRadialGradient(ox, oy, 0, ox, oy, orr * 5);
        halo.addColorStop(0, 'rgba(255, 248, 225, 0.95)');
        halo.addColorStop(0.18, 'rgba(250, 214, 140, 0.5)');
        halo.addColorStop(1, 'transparent');
        g.fillStyle = halo;
        g.beginPath();
        g.arc(ox, oy, orr * 5, 0, Math.PI * 2);
        g.fill();
      }
      g.restore();

      // Shafts of moonlight coming down through the canopy.
      g.save();
      g.globalCompositeOperation = 'screen';
      g.filter = 'blur(26px)';
      for (let i = 0; i < 4; i++) {
        const x = w * (0.12 + i * 0.26) + (R() - 0.5) * w * 0.1;
        const shaft = g.createLinearGradient(x, 0, x + w * 0.1, h);
        shaft.addColorStop(0, 'rgba(160, 230, 205, 0.1)');
        shaft.addColorStop(1, 'transparent');
        g.fillStyle = shaft;
        g.beginPath();
        g.moveTo(x - w * 0.03, 0);
        g.lineTo(x + w * 0.05, 0);
        g.lineTo(x + w * 0.16, h);
        g.lineTo(x - w * 0.06, h);
        g.closePath();
        g.fill();
      }
      g.restore();

      // Bokeh — the big soft out-of-focus lights that give the scene its depth.
      g.save();
      g.filter = 'blur(10px)';
      for (let i = 0; i < 34; i++) {
        const bx = R() * w;
        const by = h * (0.25 + R() * 0.7);
        const br = (6 + R() * 26) * (w / 900);
        const warm = R() > 0.3;
        g.beginPath();
        g.arc(bx, by, br, 0, Math.PI * 2);
        g.fillStyle = warm
          ? `rgba(246, 216, 146, ${(0.12 + R() * 0.2).toFixed(3)})`
          : `rgba(150, 245, 215, ${(0.08 + R() * 0.14).toFixed(3)})`;
        g.fill();
      }
      g.restore();

      // The card stands in the middle and blurs whatever is behind it. A smooth
      // gradient blurred by 22px is the same smooth gradient — so the glass only
      // reads as glass if there is real detail here to soften. This band exists
      // to be looked at THROUGH.
      g.save();
      const bandX = w * 0.5;
      const bandTop = h * 0.1;
      const bandH = h * 0.72;

      // lit trunk edges, bright enough to survive a heavy blur
      g.filter = 'blur(2px)';
      for (let i = 0; i < 7; i++) {
        const x = bandX + (R() - 0.5) * w * 0.78;
        const tw = w * (0.012 + R() * 0.03);
        const grad = g.createLinearGradient(x - tw, 0, x + tw, 0);
        grad.addColorStop(0, 'rgba(90, 150, 120, 0)');
        grad.addColorStop(0.45, `rgba(126, 196, 160, ${(0.16 + R() * 0.2).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(90, 150, 120, 0)');
        g.fillStyle = grad;
        g.fillRect(x - tw, bandTop, tw * 2, bandH);
      }

      // a dense cluster of bright bokeh behind the card's footprint
      g.filter = 'blur(7px)';
      for (let i = 0; i < 22; i++) {
        const bx = bandX + (R() - 0.5) * w * 0.72;
        const by = bandTop + R() * bandH;
        const br = (5 + R() * 20) * (w / 900);
        g.beginPath();
        g.arc(bx, by, br, 0, Math.PI * 2);
        g.fillStyle =
          R() > 0.4
            ? `rgba(252, 224, 152, ${(0.18 + R() * 0.3).toFixed(3)})`
            : `rgba(158, 250, 218, ${(0.12 + R() * 0.22).toFixed(3)})`;
        g.fill();
      }
      g.restore();

      // Vignette, so the eye goes to the middle where the card stands.
      const vig = g.createRadialGradient(w * 0.5, h * 0.5, h * 0.25, w * 0.5, h * 0.5, h * 0.85);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(2, 5, 4, 0.78)');
      g.fillStyle = vig;
      g.fillRect(0, 0, w, h);

      return c;
    };

    const size = () => {
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr);
      back = paintBackdrop();
      const count = Math.min(90, Math.round(innerWidth / 11));
      const R = rng(7771);
      motes = Array.from({ length: count }, () => ({
        x: R() * w,
        y: R() * h,
        r: (R() * 2 + 0.5) * dpr,
        speed: (R() * 0.32 + 0.06) * dpr,
        drift: (R() - 0.5) * 0.22 * dpr,
        phase: R() * Math.PI * 2,
        warm: R() > 0.35,
        blur: R() > 0.75 ? 3 : 0,
      }));
    };

    /* ------------------------------------------------------- the fireflies */
    let raf = 0;
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      if (back) ctx.drawImage(back, 0, 0);

      for (const m of motes) {
        if (!reduced) {
          m.y -= m.speed;
          m.x += m.drift + Math.sin((m.phase += 0.012)) * 0.25 * dpr;
          if (m.y < -12) {
            m.y = h + 12;
            m.x = Math.random() * w;
          }
        }
        const twinkle = reduced ? 0.5 : 0.45 + 0.45 * Math.sin(m.phase * 1.7);
        ctx.save();
        if (m.blur) ctx.filter = `blur(${m.blur}px)`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        const halo = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        halo.addColorStop(0, `rgba(255, 250, 232, ${(twinkle * 0.95).toFixed(3)})`);
        halo.addColorStop(
          0.3,
          m.warm
            ? `rgba(250, 214, 140, ${(twinkle * 0.5).toFixed(3)})`
            : `rgba(150, 240, 212, ${(twinkle * 0.45).toFixed(3)})`,
        );
        halo.addColorStop(1, 'transparent');
        ctx.fillStyle = halo;
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    size();
    frame();

    let t: number | undefined;
    const onResize = () => {
      clearTimeout(t);
      t = window.setTimeout(() => {
        size();
        if (reduced) frame();
      }, 150);
    };
    addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="scene" aria-hidden="true" />;
}
