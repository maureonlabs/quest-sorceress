/**
 * The flowering vines that wrap the quest card.
 *
 * The earlier version drew four corner sprays into a fixed viewBox and let the
 * browser stretch them over the card, so the flowers floated off its edge at
 * any size but the one it was drawn for.
 *
 * This version measures the card and draws at 1:1 pixel scale. The vine IS the
 * card's own rounded-rectangle outline, and every leaf and blossom is placed by
 * sampling that path with getPointAtLength and rotated to its tangent — so each
 * one sits on the line, facing the way the stem runs, at every size.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Decor {
  x: number;
  y: number;
  /** degrees, from the tangent of the stem at that point */
  angle: number;
  kind: 'leaf' | 'blossom' | 'bud';
  scale: number;
  side: 1 | -1;
}

/** Deterministic, so the same card is always wearing the same vine. */
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

/** The card's outline as a path: a rounded rectangle, inset so the vine rides its edge. */
function framePath(w: number, h: number, r: number, inset: number): string {
  const x = inset;
  const y = inset;
  const ww = w - inset * 2;
  const hh = h - inset * 2;
  const rr = Math.max(0, Math.min(r, ww / 2, hh / 2));
  return [
    `M${x + rr},${y}`,
    `H${x + ww - rr}`,
    `A${rr},${rr} 0 0 1 ${x + ww},${y + rr}`,
    `V${y + hh - rr}`,
    `A${rr},${rr} 0 0 1 ${x + ww - rr},${y + hh}`,
    `H${x + rr}`,
    `A${rr},${rr} 0 0 1 ${x},${y + hh - rr}`,
    `V${y + rr}`,
    `A${rr},${rr} 0 0 1 ${x + rr},${y}`,
    'Z',
  ].join(' ');
}

export function VineFrame({ radius = 18 }: { radius?: number }) {
  const host = useRef<HTMLDivElement>(null);
  const measure = useRef<SVGPathElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [decor, setDecor] = useState<Decor[]>([]);

  /* Track the card's real size. */
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

  /* Walk the outline and hang things off it. */
  useEffect(() => {
    const path = measure.current;
    if (!path || box.w === 0) return;

    const total = path.getTotalLength();
    if (!Number.isFinite(total) || total === 0) return;

    const R = rng(4242);
    const out: Decor[] = [];

    // Growth is heaviest near the top-left and bottom-right, thinning on the
    // other two corners, so the frame never reads as a symmetrical wreath.
    const density = (t: number) => {
      const near = (a: number) => {
        const d = Math.min(Math.abs(t - a), 1 - Math.abs(t - a));
        return Math.exp(-(d * d) / 0.012);
      };
      return 0.28 + 0.72 * Math.max(near(0.97), near(0.47));
    };

    const step = 13;
    for (let d = 0; d < total; d += step) {
      const t = d / total;
      if (R() > density(t)) continue;

      const p = path.getPointAtLength(d);
      const q = path.getPointAtLength(Math.min(d + 1, total));
      const angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      const side: 1 | -1 = R() > 0.45 ? 1 : -1;

      const roll = R();
      const kind: Decor['kind'] = roll > 0.72 ? 'blossom' : roll > 0.52 ? 'bud' : 'leaf';

      out.push({
        x: p.x,
        y: p.y,
        angle,
        kind,
        scale: kind === 'blossom' ? 0.8 + R() * 0.5 : 0.65 + R() * 0.5,
        side,
      });
    }
    setDecor(out);
  }, [box.w, box.h, radius]);

  const d = framePath(box.w, box.h, radius, 0);

  return (
    <div className="vines" ref={host} aria-hidden="true">
      {box.w > 0 ? (
        <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} overflow="visible">
          <defs>
            <linearGradient id="vf-stem" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F0DCA2" />
              <stop offset="35%" stopColor="#C9A34E" />
              <stop offset="70%" stopColor="#8A6B2C" />
              <stop offset="100%" stopColor="#E2C27C" />
            </linearGradient>
            <linearGradient id="vf-leaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A9DEB0" />
              <stop offset="55%" stopColor="#5E9A61" />
              <stop offset="100%" stopColor="#38603D" />
            </linearGradient>
            <radialGradient id="vf-petal" cx="40%" cy="32%">
              <stop offset="0%" stopColor="#FFF0F4" />
              <stop offset="38%" stopColor="#F3BACB" />
              <stop offset="80%" stopColor="#E08EA8" />
              <stop offset="100%" stopColor="#B96881" />
            </radialGradient>
            <radialGradient id="vf-centre" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#FFF6D8" />
              <stop offset="100%" stopColor="#D9A94C" />
            </radialGradient>
            <filter id="vf-glow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="3.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* invisible, used only to sample positions along the card's outline */}
          <path ref={measure} d={d} fill="none" stroke="none" />

          <g filter="url(#vf-glow)">
            {/* the stem, riding the card's own edge */}
            <path
              d={d}
              fill="none"
              stroke="url(#vf-stem)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* a thinner stem twisting around it, offset outward */}
            <path
              d={framePath(box.w + 7, box.h + 7, radius + 3, -3.5)}
              fill="none"
              stroke="url(#vf-stem)"
              strokeWidth="1.3"
              strokeDasharray="34 18"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* and one inside, so the stem reads as braided rather than drawn */}
            <path
              d={framePath(box.w - 7, box.h - 7, Math.max(0, radius - 3), 3.5)}
              fill="none"
              stroke="url(#vf-stem)"
              strokeWidth="1"
              strokeDasharray="22 30"
              strokeLinecap="round"
              opacity="0.45"
            />

            {decor.map((it, i) => (
              <g
                key={i}
                transform={`translate(${it.x} ${it.y}) rotate(${it.angle + it.side * 62})`}
              >
                {it.kind === 'leaf' ? (
                  <g transform={`scale(${it.scale})`}>
                    <path
                      d="M0,0 C5,-7 14,-8 19,-2 C14,4 5,6 0,0 Z"
                      fill="url(#vf-leaf)"
                    />
                    <path
                      d="M1,0 C7,-2 13,-2 18,-2"
                      stroke="#2E5235"
                      strokeWidth=".7"
                      fill="none"
                      opacity=".55"
                    />
                  </g>
                ) : it.kind === 'bud' ? (
                  <g transform={`scale(${it.scale})`}>
                    <ellipse cx="7" cy="0" rx="3.1" ry="4.2" fill="url(#vf-petal)" />
                    <path d="M0,0 C3,-1 5,-1 7,0" stroke="#5E9A61" strokeWidth="1" fill="none" />
                  </g>
                ) : (
                  <g transform={`scale(${it.scale})`}>
                    {/* five petals, each a touch different, so no two flowers match */}
                    {[0, 72, 144, 216, 288].map((a, k) => (
                      <ellipse
                        key={a}
                        rx={3.3 + ((k % 2) * 0.5)}
                        ry={4.7}
                        cy={-4.6}
                        transform={`rotate(${a + (k % 3) * 3})`}
                        fill="url(#vf-petal)"
                      />
                    ))}
                    <circle r="1.9" fill="url(#vf-centre)" />
                  </g>
                )}
              </g>
            ))}
          </g>
        </svg>
      ) : null}
    </div>
  );
}
