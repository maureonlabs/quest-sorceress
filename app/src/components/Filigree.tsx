/**
 * Art-nouveau corner brackets for the gold frame.
 *
 * A plain rounded rectangle terminates nowhere — it just stops. Period framing
 * resolves its corners with scrollwork, which is what makes a frame read as
 * made rather than drawn. One bracket, placed four times with rotation.
 *
 * Deliberately fine-lined: at hairline weight this reads as metalwork, while
 * anything heavier starts competing with the vines for the same job.
 */

function Bracket() {
  return (
    <g fill="none" stroke="url(#fil-gold)" strokeLinecap="round">
      {/* the corner itself, turning through a quarter circle */}
      <path d="M46,3 L17,3 C9,3 3,9 3,17 L3,46" strokeWidth="1.3" />

      {/* an inner line shadowing it, the way a struck moulding doubles */}
      <path d="M46,8 L19,8 C13,8 8,13 8,19 L8,46" strokeWidth="0.6" opacity="0.6" />

      {/* scroll running in off the top edge, curling back on itself */}
      <path d="M40,3 C33,6 29,11 27,18 C26,22 28,25 31,24 C34,23 34,19 31,19" strokeWidth="0.9" />

      {/* its mirror, running down the side */}
      <path d="M3,40 C6,33 11,29 18,27 C22,26 25,28 24,31 C23,34 19,34 19,31" strokeWidth="0.9" />

      {/* a lozenge seated in the elbow */}
      <path d="M13,13 l4.5,4.5 l-4.5,4.5 l-4.5,-4.5 Z" strokeWidth="0.8" fill="url(#fil-gold)" fillOpacity="0.5" />

      {/* two small buds terminating the scrolls */}
      <circle cx="31" cy="21.5" r="1.5" fill="url(#fil-gold)" stroke="none" opacity="0.85" />
      <circle cx="21.5" cy="31" r="1.5" fill="url(#fil-gold)" stroke="none" opacity="0.85" />
    </g>
  );
}

export function Filigree({ size = 52 }: { size?: number }) {
  /**
   * Four separate squares, one pinned to each corner — not one stretched SVG.
   * A single viewBox spanning the panel would have to stretch to a tall
   * rectangle, which distorts the scrollwork into ovals. Each corner keeps its
   * own square so the metalwork stays the shape it was drawn.
   */
  const corners = [
    { cls: 'tl', flip: '' },
    { cls: 'tr', flip: 'scaleX(-1)' },
    { cls: 'bl', flip: 'scaleY(-1)' },
    { cls: 'br', flip: 'scale(-1, -1)' },
  ];

  return (
    <div className="filigree" aria-hidden="true">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="fil-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBEFC6" />
            <stop offset="40%" stopColor="#D9B463" />
            <stop offset="75%" stopColor="#9A7A2E" />
            <stop offset="100%" stopColor="#F0D89A" />
          </linearGradient>
        </defs>
      </svg>

      {corners.map((c) => (
        <svg
          key={c.cls}
          className={`fil-corner fil-${c.cls}`}
          width={size}
          height={size}
          viewBox="0 0 52 52"
          style={{ transform: c.flip }}
          focusable="false"
        >
          <Bracket />
        </svg>
      ))}
    </div>
  );
}
