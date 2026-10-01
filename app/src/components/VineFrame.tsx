/**
 * The flowering vines.
 *
 * Two earlier attempts failed in instructive ways. The first stretched a fixed
 * drawing over the card, so flowers floated off its edge. The second walked the
 * card's own outline at an even step, which put every flower exactly on the
 * line at identical spacing — a wallpaper trim, not a plant.
 *
 * This one grows stems that WANDER: Bézier curves that leave the frame by
 * 20–60px and come back, cross each other, and carry blossoms in irregular
 * clusters with long bare stretches between. Half the stems render behind the
 * glass and half in front, which is what makes the card read as a pane with a
 * plant growing around it rather than a panel with a border.
 */

import { useLayoutEffect, useRef, useState } from 'react';
import { Bud, Leaf, Lily, Rose, RoseDefs } from './Flowers';

type Layer = 'back' | 'front';

interface Decor {
  x: number;
  y: number;
  angle: number;
  kind: 'leaf' | 'bud' | 'rose' | 'lily';
  scale: number;
}

interface Stem {
  d: string;
  width: number;
  decor: Decor[];
}

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

/**
 * Grow one stem along a stretch of the card's perimeter, pushed off the edge by
 * a wandering amount so it never traces the rectangle.
 */
function growStem(
  w: number,
  h: number,
  from: number,
  to: number,
  R: () => number,
  /**
   * Front stems are biased outward so they overhang the pane's edge without
   * wandering across the writing — a vine in front of the glass is beautiful,
   * a vine across the title is a bug. Back stems are free to cross, because
   * they are behind 22px of blur and cannot obscure anything.
   */
  outwardOnly = false,
): { d: string; pts: Array<{ x: number; y: number }> } {
  // Walk the perimeter as a parameter 0..1 and displace outward/inward.
  const at = (t: number) => {
    const per = 2 * (w + h);
    let d = ((t % 1) + 1) % 1 * per;
    if (d < w) return { x: d, y: 0, nx: 0, ny: -1 };
    d -= w;
    if (d < h) return { x: w, y: d, nx: 1, ny: 0 };
    d -= h;
    if (d < w) return { x: w - d, y: h, nx: 0, ny: 1 };
    d -= w;
    return { x: 0, y: h - d, nx: -1, ny: 0 };
  };

  const steps = 9;
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= steps; i++) {
    const t = from + ((to - from) * i) / steps;
    const p = at(t);
    const wave = Math.sin(i * 1.15 + R() * 0.6);
    const swing = outwardOnly
      ? Math.abs(wave) * (16 + R() * 30) + 4
      : wave * (30 + R() * 38) - 10;
    pts.push({ x: p.x + p.nx * swing, y: p.y + p.ny * swing });
  }

  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  return { d, pts };
}

export function VineFrame({ layer }: { layer: Layer }) {
  const host = useRef<HTMLDivElement>(null);
  const probe = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [stems, setStems] = useState<Stem[]>([]);

  useLayoutEffect(() => {
    const el = host.current?.parentElement;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const svg = probe.current;
    if (!svg || box.w === 0) return;

    // Each layer gets its own stems, seeded so they interleave rather than overlap.
    const R = rng(layer === 'back' ? 9091 : 3137);
    const runs: Array<[number, number]> =
      layer === 'back'
        ? [
            [0.86, 1.12],
            [0.36, 0.6],
          ]
        : [
            [0.9, 1.18],
            [0.4, 0.66],
            [0.12, 0.26],
          ];

    const made: Stem[] = runs.map(([a, b], si) => {
      const { d } = growStem(box.w, box.h, a, b, R, layer === 'front');

      // Measure the curve so decorations can sit on it and face along it.
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      svg.appendChild(path);
      const len = path.getTotalLength();

      const decor: Decor[] = [];
      // Blossoms arrive in clusters with bare stem between them — punctuation,
      // not texture, which is what the art direction asks for.
      const clusters = 2 + Math.floor(R() * 2);
      for (let c = 0; c < clusters; c++) {
        const centre = (0.12 + R() * 0.76) * len;
        const clusterIsLily = R() > 0.58;
        const n = 2 + Math.floor(R() * 3);
        for (let k = 0; k < n; k++) {
          const at = Math.max(0, Math.min(len, centre + (R() - 0.5) * 46));
          const p = path.getPointAtLength(at);
          const q = path.getPointAtLength(Math.min(at + 1, len));
          // A cluster is mostly one species with the other appearing among it,
          // which is how a climbing rose and a lily actually share a trellis.
          const roll = R();
          const kind: Decor['kind'] =
            roll > 0.76 ? 'bud' : roll > (clusterIsLily ? 0.3 : 0.72) ? 'lily' : 'rose';
          decor.push({
            x: p.x + (R() - 0.5) * 15,
            y: p.y + (R() - 0.5) * 15,
            angle: (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + (R() - 0.5) * 80,
            kind,
            scale: (kind === 'bud' ? 0.8 : 0.62) + R() * 0.38,
          });
        }
      }
      // Leaves run the whole length, sparser.
      for (let d2 = 10; d2 < len; d2 += 26 + R() * 30) {
        const p = path.getPointAtLength(d2);
        const q = path.getPointAtLength(Math.min(d2 + 1, len));
        decor.push({
          x: p.x,
          y: p.y,
          angle:
            (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + (R() > 0.5 ? 58 : -58),
          kind: 'leaf',
          scale: 0.55 + R() * 0.5,
        });
      }

      svg.removeChild(path);
      return { d, width: 5.5 - si * 1.3, decor };
    });

    setStems(made);
  }, [box.w, box.h, layer]);

  return (
    <div className={`vines vines-${layer}`} ref={host} aria-hidden="true">
      {box.w > 0 ? (
        <svg
          ref={probe}
          width={box.w}
          height={box.h}
          viewBox={`0 0 ${box.w} ${box.h}`}
          overflow="visible"
        >
          <defs>
            <linearGradient id={`vf-stem-${layer}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F3E2B0" />
              <stop offset="30%" stopColor="#CDA55A" />
              <stop offset="70%" stopColor="#7E621F" />
              <stop offset="100%" stopColor="#E8CB86" />
            </linearGradient>
            <linearGradient id={`${layer}-leaf`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B6E6BC" />
              <stop offset="52%" stopColor="#56914F" />
              <stop offset="100%" stopColor="#274B2C" />
            </linearGradient>
            <RoseDefs id={layer} />
            <filter id={`vf-glow-${layer}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter={`url(#vf-glow-${layer})`}>
            {stems.map((st, i) => (
              <g key={i}>
                {/* a dark underside first, then the lit stem on top of it, which
                    is what gives a flat stroke the look of something round */}
                <path
                  d={st.d}
                  fill="none"
                  stroke="rgba(32, 24, 8, 0.55)"
                  strokeWidth={st.width + 2}
                  strokeLinecap="round"
                  transform="translate(1.2 1.6)"
                />
                <path
                  d={st.d}
                  fill="none"
                  stroke={`url(#vf-stem-${layer})`}
                  strokeWidth={st.width}
                  strokeLinecap="round"
                />
                <path
                  d={st.d}
                  fill="none"
                  stroke="rgba(255, 244, 206, 0.45)"
                  strokeWidth={Math.max(0.8, st.width * 0.28)}
                  strokeLinecap="round"
                  transform="translate(-0.6 -0.9)"
                />
              </g>
            ))}

            {stems.flatMap((st, si) =>
              st.decor.map((it, i) => (
                <g
                  key={`${si}-${i}`}
                  transform={`translate(${it.x.toFixed(1)} ${it.y.toFixed(1)}) rotate(${it.angle.toFixed(1)}) scale(${it.scale.toFixed(2)})`}
                >
                  {it.kind === 'leaf' ? (
                    <Leaf id={layer} bloom={1} />
                  ) : it.kind === 'bud' ? (
                    <Bud id={layer} bloom={1} />
                  ) : it.kind === 'lily' ? (
                    <Lily id={layer} bloom={1} />
                  ) : (
                    <Rose id={layer} bloom={1} />
                  )}
                </g>
              )),
            )}
          </g>
        </svg>
      ) : null}
    </div>
  );
}
