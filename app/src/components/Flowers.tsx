/**
 * Roses and lilies, drawn rather than stamped.
 *
 * A generic five-petal star reads as "flower icon". A rose reads as a rose
 * because of its spiral: overlapping petal rings that get smaller and darker as
 * they turn inward, so the eye finds a centre it cannot quite see into. A lily
 * reads as a lily because of six narrow recurved petals and prominent stamens.
 *
 * Each is built from the same petal path at different scales and rotations, so
 * the shading stays consistent as they tumble with the stem.
 */

/** One rounded petal, rising from the origin. */
const ROSE_PETAL = 'M0,0 C-6.4,-3.4 -6.8,-11.6 0,-14.4 C6.8,-11.6 6.4,-3.4 0,0 Z';

/** Narrow, pointed, slightly recurved — a lily's tepal. */
const LILY_PETAL = 'M0,0 C-3.6,-5.6 -3.4,-14 0,-20 C3.4,-14 3.6,-5.6 0,0 Z';

export function RoseDefs({ id }: { id: string }) {
  return (
    <>
      <radialGradient id={`${id}-rose-outer`} cx="42%" cy="26%" r="78%">
        <stop offset="0%" stopColor="#FFE2EA" />
        <stop offset="34%" stopColor="#F2A9BF" />
        <stop offset="74%" stopColor="#D4708F" />
        <stop offset="100%" stopColor="#9C3F5E" />
      </radialGradient>
      <radialGradient id={`${id}-rose-inner`} cx="44%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#F7BBCD" />
        <stop offset="60%" stopColor="#C85F80" />
        <stop offset="100%" stopColor="#7E2F4A" />
      </radialGradient>
      <radialGradient id={`${id}-lily`} cx="40%" cy="22%" r="82%">
        <stop offset="0%" stopColor="#FFFDF6" />
        <stop offset="45%" stopColor="#FDF0E2" />
        <stop offset="82%" stopColor="#F3D2CE" />
        <stop offset="100%" stopColor="#D8A2A6" />
      </radialGradient>
      <linearGradient id={`${id}-stamen`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F6E3A8" />
        <stop offset="100%" stopColor="#C89A3C" />
      </linearGradient>
    </>
  );
}

/**
 * A rose, seen from above: three rings of petals turning inward to a closed
 * centre. Each ring is rotated off the one beneath so petals sit in the gaps.
 */
export function Rose({ id, bloom = 1 }: { id: string; bloom?: number }) {
  const rings = [
    { n: 6, scale: 1, rot: 0, fill: `url(#${id}-rose-outer)`, opacity: 1 },
    { n: 5, scale: 0.72, rot: 34, fill: `url(#${id}-rose-outer)`, opacity: 0.97 },
    { n: 5, scale: 0.48, rot: 68, fill: `url(#${id}-rose-inner)`, opacity: 1 },
    { n: 4, scale: 0.3, rot: 100, fill: `url(#${id}-rose-inner)`, opacity: 1 },
  ];
  return (
    <g transform={`scale(${bloom})`}>
      {rings.map((ring, ri) =>
        Array.from({ length: ring.n }, (_, i) => (
          <path
            key={`${ri}-${i}`}
            d={ROSE_PETAL}
            fill={ring.fill}
            opacity={ring.opacity}
            transform={`rotate(${ring.rot + (360 / ring.n) * i}) scale(${ring.scale})`}
          />
        )),
      )}
      {/* the furled heart, too tight to see into */}
      <circle r="1.5" fill="#6B2440" />
      <circle r="0.7" cy="-0.4" fill="#8E3756" />
    </g>
  );
}

/**
 * A lily: six tepals in two offset rings of three, with stamens standing proud
 * of the flower — the detail that stops it reading as a daisy.
 */
export function Lily({ id, bloom = 1 }: { id: string; bloom?: number }) {
  return (
    <g transform={`scale(${bloom})`}>
      {[0, 120, 240].map((a) => (
        <path
          key={`b${a}`}
          d={LILY_PETAL}
          fill={`url(#${id}-lily)`}
          opacity="0.93"
          transform={`rotate(${a + 60}) scale(0.96)`}
        />
      ))}
      {[0, 120, 240].map((a) => (
        <g key={`f${a}`} transform={`rotate(${a})`}>
          <path d={LILY_PETAL} fill={`url(#${id}-lily)`} />
          {/* the pale rib down the centre of each tepal */}
          <path
            d="M0,-2 C-0.4,-8 -0.4,-14 0,-18.5"
            stroke="#E8B6B2"
            strokeWidth="0.8"
            fill="none"
            opacity="0.65"
          />
        </g>
      ))}
      {/* stamens: six filaments with heavy anthers, splayed off-centre */}
      {[14, 72, 130, 196, 254, 310].map((a, i) => (
        <g key={`s${a}`} transform={`rotate(${a})`}>
          <path
            d={`M0,0 C1,-3 1.6,-6 1.2,-${7.5 + (i % 3)}`}
            stroke={`url(#${id}-stamen)`}
            strokeWidth="0.85"
            fill="none"
          />
          <ellipse
            cx="1.2"
            cy={-(7.5 + (i % 3))}
            rx="1.5"
            ry="0.9"
            fill="#D8A33F"
            transform={`rotate(${18 + i * 4} 1.2 ${-(7.5 + (i % 3))})`}
          />
        </g>
      ))}
      <circle r="1.1" fill="#EFD9A8" />
    </g>
  );
}

/** A bud: a closed rose, still wrapped in its sepals. */
export function Bud({ id, bloom = 1 }: { id: string; bloom?: number }) {
  return (
    <g transform={`scale(${bloom})`}>
      <ellipse rx="3.6" ry="5" cy="-3.2" fill={`url(#${id}-rose-outer)`} />
      <path d="M-3.4,-2 C-2,-6 -0.6,-7.6 0,-9.2 C0.6,-7.6 2,-6 3.4,-2 Z" fill={`url(#${id}-rose-inner)`} opacity="0.75" />
      {/* sepals curling back off the bud */}
      <path d="M0,0 C-3,-1.4 -4.6,-4 -4.8,-7" stroke="#4F8553" strokeWidth="1" fill="none" />
      <path d="M0,0 C3,-1.4 4.6,-4 4.8,-7" stroke="#4F8553" strokeWidth="1" fill="none" />
    </g>
  );
}

/** A rose leaf: oval, pointed, with a serrated edge and a visible midrib. */
export function Leaf({ id, bloom = 1 }: { id: string; bloom?: number }) {
  return (
    <g transform={`scale(${bloom})`}>
      <path
        d="M0,0 C4,-7.5 13,-9.5 20,-5.5 C17,-2 15,1.5 12,4 C7,6.5 3,4 0,0 Z"
        fill={`url(#${id}-leaf)`}
      />
      {/* serrations along the upper edge */}
      <path
        d="M4,-5.4 l1.6,-1.4 l1.2,1.5 l1.7,-1.5 l1.2,1.5 l1.7,-1.5 l1.2,1.5 l1.7,-1.4"
        stroke="#2E5235"
        strokeWidth="0.55"
        fill="none"
        opacity="0.5"
      />
      <path d="M1,0 C7,-2.4 14,-3.8 19,-5.2" stroke="#2A4C30" strokeWidth="0.8" fill="none" opacity="0.6" />
    </g>
  );
}
