/**
 * The head: skull, features, and the shading that keeps it from reading as an
 * egg with a drawing on it.
 *
 * Aimed at the Sims-style character renders in `design/AVATAR-ASSETS.md`, and
 * the specific things that make those read the way they do: large eyes with a
 * heavy lash line, strong brows, full lips with a highlight on the lower one,
 * and soft frontal light with blush rather than a hard terminator. A dramatic
 * side-light was tried first and removed — it is more "realistic" and looks
 * nothing like the reference.
 *
 * The previous version was deliberately featureless. That was right when the
 * brief was a serene silhouette; a blank face is the single thing that most
 * makes a figure read as a doll, so the features are here now.
 */

/** The skull: wide at the temples, tapering to a chin. Not an ellipse. */
export const SKULL =
  'M 100 53 C 110 53, 116.5 62, 116.5 74 C 116.5 83, 114.5 89.5, 110.5 94 C 107 98, 103.5 100, 100 100 C 96.5 100, 93 98, 89.5 94 C 85.5 89.5, 83.5 83, 83.5 74 C 83.5 62, 90 53, 100 53 Z';

export function Face({ masculine = false }: { masculine?: boolean }) {
  /* A heavier brow and a squarer jaw are most of what separates the two at this
     size. The features themselves are identical. */
  const browY = masculine ? 71 : 72.3;
  const brow = masculine ? 2.1 : 1.5;
  const lip = masculine ? 0.85 : 1;

  return (
    <g>
      {/* Ears first, so hair drawn behind still covers them. */}
      <ellipse cx="84.5" cy="79" rx="2.2" ry="3.6" fill="#c9a384" />
      <ellipse cx="115.5" cy="79" rx="2.2" ry="3.6" fill="#c9a384" />
      <path d={SKULL} fill="url(#qs-skin)" />
      {masculine ? (
        <path
          d="M 86 86 C 90 96, 110 96, 114 86 C 112 95, 106 100, 100 100 C 94 100, 88 95, 86 86 Z"
          fill="url(#qs-skin)"
        />
      ) : null}

      {/* Form first, features after. Kept soft: the reference light is frontal
          and almost shadowless, so this is a hint of roundness, not a terminator. */}
      <path
        d="M 100 53 C 110 53, 116.5 62, 116.5 74 C 116.5 83, 114.5 89.5, 110.5 94 C 107 98, 103.5 100, 100 100 C 104.5 92, 107 83, 107 73 C 107 64, 104 57, 100 53 Z"
        fill="#9c7055"
        opacity="0.16"
      />
      <ellipse cx="100" cy="69" rx="11" ry="4.5" fill="#fff0db" opacity="0.2" />

      {/* Brows: strong, slightly angular, the most Sims-ish thing on the face. */}
      <path
        d={`M 88.4 ${browY + 0.6} C 90.4 ${browY - 2.2}, 94.4 ${browY - 2.4}, 96.8 ${browY - 0.6}`}
        fill="none"
        stroke="#4e3827"
        strokeWidth={brow}
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d={`M 111.6 ${browY + 0.6} C 109.6 ${browY - 2.2}, 105.6 ${browY - 2.4}, 103.2 ${browY - 0.6}`}
        fill="none"
        stroke="#4e3827"
        strokeWidth={brow}
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Eyes. Large, with a lash line far heavier than the lower lid — that
          asymmetry is what stops them reading as two circles. */}
      {[92.3, 107.7].map((cx, i) => {
        const out = i ? 1 : -1;
        return (
          <g key={cx}>
            <path
              d={`M ${cx - 4.2} 78.2 C ${cx - 2.2} 75.1, ${cx + 2.2} 75.1, ${cx + 4.2} 78.2 C ${cx + 2.2} 81, ${cx - 2.2} 81, ${cx - 4.2} 78.2 Z`}
              fill="#f7f1e7"
            />
            <circle cx={cx - out * 0.3} cy="78.2" r="2.5" fill="#7a9b8e" />
            <circle cx={cx - out * 0.3} cy="78.2" r="1.15" fill="#17120e" />
            <circle cx={cx - out * 1.1} cy="77.2" r="0.7" fill="#fffdf6" opacity="0.95" />
            {/* Lash line, thickening toward the outer corner. */}
            <path
              d={`M ${cx - 4.4} 78 C ${cx - 2.2} 74.6, ${cx + 2.2} 74.6, ${cx + 4.4} 78`}
              fill="none"
              stroke="#2e2119"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d={`M ${cx + out * 4.2} 77.8 L ${cx + out * 6} 76.6`}
              stroke="#2e2119"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d={`M ${cx - 3.4} 79.8 C ${cx - 1.6} 81, ${cx + 1.6} 81, ${cx + 3.4} 79.8`}
              fill="none"
              stroke="#8a6246"
              strokeWidth="0.6"
              opacity="0.6"
            />
          </g>
        );
      })}

      {/* Nose: shadow and base only. An outlined nose reads as a cartoon. */}
      <path
        d="M 98.6 80 C 97.8 83.6, 97.2 86, 98 87.6"
        fill="none"
        stroke="#a9775a"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.45"
      />
      <ellipse cx="100" cy="88.3" rx="2.6" ry="1" fill="#a9775a" opacity="0.3" />
      <ellipse cx="100" cy="86.4" rx="1.8" ry="1.2" fill="#fff1dd" opacity="0.4" />

      {/* Lips: a bow, a fuller lower lip, and a highlight on it. */}
      <path
        d={`M 95.4 92.2 C 97 90.6, 98.8 91.6, 100 91.6 C 101.2 91.6, 103 90.6, 104.6 92.2 C 102.6 95.2, 97.4 95.2, 95.4 92.2 Z`}
        fill="#b06374"
        opacity={0.78 * lip}
      />
      <path
        d="M 95.8 92.3 C 98 93.2, 102 93.2, 104.2 92.3"
        fill="none"
        stroke="#7a3b49"
        strokeWidth="0.55"
        opacity="0.6"
      />
      <ellipse cx="100" cy="93.6" rx="2.2" ry="0.7" fill="#ffd9dd" opacity="0.45" />

      {/* Blush across the cheeks and over the nose, as in the references. */}
      <ellipse cx="89.8" cy="84.5" rx="4.6" ry="2.8" fill="#e9a3b8" opacity="0.26" />
      <ellipse cx="110.2" cy="84.5" rx="4.6" ry="2.8" fill="#e9a3b8" opacity="0.26" />
      <ellipse cx="100" cy="83.5" rx="3.4" ry="1.6" fill="#e9a3b8" opacity="0.15" />

    </g>
  );
}
