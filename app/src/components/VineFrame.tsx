/**
 * The flowering vines that wrap the quest card.
 *
 * Drawn as four corner sprays rather than one stretched border, because a
 * stretched SVG distorts its leaves and blossoms at different card heights.
 * Corners stay in proportion; thin stems run along the edges between them.
 *
 * The sprays sit ABOVE the glass and overhang its edge — per the art direction,
 * the vines must read as growing in front of the panel. A flat border printed
 * inside the edge collapses the whole look into ordinary glassmorphism.
 */

const LEAF = 'M0,0 C4,-5 11,-6 15,-2 C11,3 4,4 0,0 Z';

/** A five-petal blossom, the only warm note in a gold-and-green frame. */
function Blossom({ x, y, s = 1, r = 0 }: { x: number; y: number; s?: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          rx="3.4"
          ry="4.6"
          cy="-4"
          transform={`rotate(${a})`}
          fill="url(#petal)"
        />
      ))}
      <circle r="1.7" fill="#F6E3A8" />
    </g>
  );
}

function Leaf({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <path
      d={LEAF}
      transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
      fill="url(#leaf)"
      opacity="0.9"
    />
  );
}

/** One corner spray, drawn for the top-left and mirrored for the rest. */
function Spray({ dense }: { dense: boolean }) {
  return (
    <g>
      {/* main stem: up the left edge, around the corner, along the top */}
      <path
        d="M4,150 C10,120 14,92 26,68 C38,44 66,28 98,20 C122,14 146,12 170,11"
        fill="none"
        stroke="url(#stem)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* a second stem twisting around the first */}
      <path
        d="M11,148 C14,118 20,96 34,74 C50,49 76,36 104,28"
        fill="none"
        stroke="url(#stem)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* branches reaching inward over the glass */}
      <path
        d="M26,68 C36,78 52,82 70,78"
        fill="none"
        stroke="url(#stem)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M98,20 C100,34 96,48 86,58"
        fill="none"
        stroke="url(#stem)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      {dense ? (
        <path
          d="M140,12 C142,26 138,40 128,50"
          fill="none"
          stroke="url(#stem)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
      ) : null}

      <Leaf x={20} y={104} r={-60} s={0.9} />
      <Leaf x={17} y={128} r={-100} s={0.75} />
      <Leaf x={31} y={60} r={-30} s={0.85} />
      <Leaf x={54} y={37} r={-5} s={0.9} />
      <Leaf x={70} y={78} r={30} s={0.7} />
      <Leaf x={92} y={23} r={10} s={0.85} />
      <Leaf x={122} y={15} r={18} s={0.8} />
      {dense ? <Leaf x={150} y={13} r={6} s={0.7} /> : null}
      {dense ? <Leaf x={86} y={56} r={70} s={0.65} /> : null}

      <Blossom x={14} y={118} s={1.05} r={-15} />
      <Blossom x={30} y={74} s={0.8} r={20} />
      <Blossom x={64} y={28} s={1.1} r={-8} />
      {dense ? <Blossom x={108} y={18} s={0.9} r={14} /> : null}
      {dense ? <Blossom x={74} y={76} s={0.7} r={40} /> : null}
      {dense ? <Blossom x={136} y={14} s={0.85} r={-20} /> : null}
    </g>
  );
}

export function VineFrame() {
  return (
    <svg className="vines" viewBox="0 0 400 560" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="stem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E7C878" />
          <stop offset="45%" stopColor="#C9A34E" />
          <stop offset="100%" stopColor="#8A6B2C" />
        </linearGradient>
        <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9FD6A8" />
          <stop offset="100%" stopColor="#4C7E52" />
        </linearGradient>
        <radialGradient id="petal">
          <stop offset="0%" stopColor="#F7D3DE" />
          <stop offset="70%" stopColor="#E9A3B8" />
          <stop offset="100%" stopColor="#CE7E97" />
        </radialGradient>
        <filter id="vineglow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* hairline stems running the long edges, joining the corner sprays */}
      <g stroke="url(#stem)" fill="none" strokeWidth="1.1" opacity="0.45">
        <path d="M6,150 C2,250 10,330 6,410" />
        <path d="M394,150 C398,260 390,340 394,410" />
      </g>

      <g filter="url(#vineglow)">
        {/* top-left, heaviest — the eye enters here */}
        <g transform="translate(0 0)">
          <Spray dense />
        </g>
        {/* bottom-right, the counterweight */}
        <g transform="translate(400 560) rotate(180)">
          <Spray dense />
        </g>
        {/* the quieter two, so the frame is never symmetrical */}
        <g transform="translate(400 0) scale(-1 1)">
          <Spray dense={false} />
        </g>
        <g transform="translate(0 560) scale(1 -1)">
          <Spray dense={false} />
        </g>
      </g>
    </svg>
  );
}
