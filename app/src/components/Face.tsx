/**
 * The head: skull, features, and the shading that keeps it from reading as an
 * egg with a drawing on it.
 *
 * Aimed at the Sims-style character renders in `design/AVATAR-ASSETS.md`, and
 * the specific things that make those read the way they do: strong brows, large
 * eyes with a heavy upper lash line, full lips with a highlight on the lower
 * one, and soft frontal light with blush rather than a hard terminator. A
 * dramatic side-light was tried first and removed — more "realistic", nothing
 * like the reference.
 *
 * The two faces are genuinely different rather than the same face with a
 * thicker eyebrow. A first attempt varied only the brow weight and a jaw line,
 * and the result was unmistakably one person: the skull, the brow line, the lid,
 * the lip and the shading all have to move together before a face reads
 * differently at this size.
 */

/** Feminine: narrow jaw, soft taper to a small chin. */
const SKULL_F =
  'M 100 53 C 110 53, 116.5 62, 116.5 74 C 116.5 83, 114.5 89.5, 110.5 94 C 107 98, 103.5 100, 100 100 C 96.5 100, 93 98, 89.5 94 C 85.5 89.5, 83.5 83, 83.5 74 C 83.5 62, 90 53, 100 53 Z';

/** Masculine: straight sides from temple to jaw, and a wide flat chin. */
const SKULL_M =
  'M 100 51 C 111 51, 118 60, 118 71 L 118 81 C 118 88.5, 116 94, 112 97.5 C 108.5 100.5, 104.5 102, 100 102 C 95.5 102, 91.5 100.5, 88 97.5 C 84 94, 82 88.5, 82 81 L 82 71 C 82 60, 89 51, 100 51 Z';

export const SKULL = SKULL_F;

export function Face({ masculine = false }: { masculine?: boolean }) {
  const skull = masculine ? SKULL_M : SKULL_F;

  /* Brows do more work than any other feature: lower, straighter and heavier
     reads masculine before the viewer has looked at anything else. */
  const browY = masculine ? 70 : 72.3;
  const browW = masculine ? 2.3 : 1.5;
  const browArch = masculine ? 1.1 : 2.3;

  /* A shallower lid and a shorter outer flick. */
  const lidH = masculine ? 2.4 : 3.1;
  const flick = masculine ? 1 : 1.8;
  const lashW = masculine ? 1.1 : 1.35;

  const eyeY = masculine ? 77.5 : 78.2;
  const noseBase = masculine ? 89.5 : 88.3;
  const mouthY = masculine ? 94 : 92.2;

  return (
    <g>
      {/* Ears first, so hair drawn over the top still covers them. */}
      <ellipse cx={masculine ? 83.5 : 84.5} cy="79" rx="2.3" ry="3.8" fill="#c9a384" />
      <ellipse cx={masculine ? 116.5 : 115.5} cy="79" rx="2.3" ry="3.8" fill="#c9a384" />

      <path d={skull} fill="url(#qs-skin)" />

      {/* Form before features. Kept soft: the reference light is frontal and
          almost shadowless, so this is a hint of roundness, not a terminator. */}
      <path
        d={
          masculine
            ? 'M 100 51 C 111 51, 118 60, 118 71 L 118 81 C 118 88.5, 116 94, 112 97.5 C 108.5 100.5, 104.5 102, 100 102 C 105 93, 107.5 83, 107.5 72 C 107.5 63, 104.5 55, 100 51 Z'
            : 'M 100 53 C 110 53, 116.5 62, 116.5 74 C 116.5 83, 114.5 89.5, 110.5 94 C 107 98, 103.5 100, 100 100 C 104.5 92, 107 83, 107 73 C 107 64, 104 57, 100 53 Z'
        }
        fill="#9c7055"
        opacity={masculine ? 0.13 : 0.16}
      />
      <ellipse cx="100" cy="69" rx="11" ry="4.5" fill="#fff0db" opacity="0.2" />

      {masculine ? (
        <>
          {/* A squarer jaw needs the shadow under it to be square too. */}
          <path
            d="M 86 88 C 88 96, 93 101, 100 101 C 107 101, 112 96, 114 88 C 113 95.5, 108 100.5, 100 100.5 C 92 100.5, 87 95.5, 86 88 Z"
            fill="#9c7055"
            opacity="0.3"
          />
          {/* The faintest stubble. Enough to read as a jaw, not as a beard. */}
          <path
            d="M 87 85 C 89 96, 94 101, 100 101 C 106 101, 111 96, 113 85 C 112 94, 107 98.5, 100 98.5 C 93 98.5, 88 94, 87 85 Z"
            fill="#4e3827"
            opacity="0.12"
          />
          <ellipse cx="100" cy="91.5" rx="6" ry="2.6" fill="#4e3827" opacity="0.1" />
        </>
      ) : null}

      {/* Brows. */}
      <path
        d={`M ${masculine ? 87.6 : 88.4} ${browY + 0.6} C ${masculine ? 90 : 90.4} ${browY - browArch}, ${masculine ? 94.6 : 94.4} ${browY - browArch - 0.2}, ${masculine ? 97.2 : 96.8} ${browY - 0.4}`}
        fill="none"
        stroke="#4e3827"
        strokeWidth={browW}
        strokeLinecap="round"
        opacity={masculine ? 0.95 : 0.9}
      />
      <path
        d={`M ${masculine ? 112.4 : 111.6} ${browY + 0.6} C ${masculine ? 110 : 109.6} ${browY - browArch}, ${masculine ? 105.4 : 105.6} ${browY - browArch - 0.2}, ${masculine ? 102.8 : 103.2} ${browY - 0.4}`}
        fill="none"
        stroke="#4e3827"
        strokeWidth={browW}
        strokeLinecap="round"
        opacity={masculine ? 0.95 : 0.9}
      />

      {/* Eyes. The lash line is far heavier than the lower lid — that asymmetry
          is what stops them reading as two circles. */}
      {[92.3, 107.7].map((cx, i) => {
        const out = i ? 1 : -1;
        return (
          <g key={cx}>
            <path
              d={`M ${cx - 4.2} ${eyeY} C ${cx - 2.2} ${eyeY - lidH}, ${cx + 2.2} ${eyeY - lidH}, ${cx + 4.2} ${eyeY} C ${cx + 2.2} ${eyeY + 2.8}, ${cx - 2.2} ${eyeY + 2.8}, ${cx - 4.2} ${eyeY} Z`}
              fill="#f7f1e7"
            />
            <circle cx={cx - out * 0.3} cy={eyeY} r="2.5" fill="#7a9b8e" />
            <circle cx={cx - out * 0.3} cy={eyeY} r="1.15" fill="#17120e" />
            <circle cx={cx - out * 1.1} cy={eyeY - 1} r="0.7" fill="#fffdf6" opacity="0.95" />
            <path
              d={`M ${cx - 4.4} ${eyeY - 0.2} C ${cx - 2.2} ${eyeY - lidH - 1.4}, ${cx + 2.2} ${eyeY - lidH - 1.4}, ${cx + 4.4} ${eyeY - 0.2}`}
              fill="none"
              stroke="#2e2119"
              strokeWidth={lashW}
              strokeLinecap="round"
            />
            <path
              d={`M ${cx + out * 4.2} ${eyeY - 0.4} L ${cx + out * (4.2 + flick)} ${eyeY - 1.4}`}
              stroke="#2e2119"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d={`M ${cx - 3.4} ${eyeY + 1.6} C ${cx - 1.6} ${eyeY + 2.8}, ${cx + 1.6} ${eyeY + 2.8}, ${cx + 3.4} ${eyeY + 1.6}`}
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
        d={`M ${masculine ? 98.2 : 98.6} ${eyeY + 2} C ${masculine ? 97.2 : 97.8} ${noseBase - 4.2}, ${masculine ? 96.6 : 97.2} ${noseBase - 2.1}, ${masculine ? 97.6 : 98} ${noseBase - 0.6}`}
        fill="none"
        stroke="#a9775a"
        strokeWidth={masculine ? 1.1 : 0.9}
        strokeLinecap="round"
        opacity={masculine ? 0.55 : 0.45}
      />
      <ellipse cx="100" cy={noseBase} rx={masculine ? 3.1 : 2.6} ry="1" fill="#a9775a" opacity="0.3" />
      <ellipse cx="100" cy={noseBase - 1.9} rx="1.9" ry="1.2" fill="#fff1dd" opacity="0.4" />

      {/* Lips: fuller and glossed on one face, thinner and matte on the other. */}
      {masculine ? (
        <>
          <path
            d={`M 94.6 ${mouthY} C 96.6 ${mouthY - 1.2}, 98.6 ${mouthY - 0.3}, 100 ${mouthY - 0.3} C 101.4 ${mouthY - 0.3}, 103.4 ${mouthY - 1.2}, 105.4 ${mouthY} C 103.4 ${mouthY + 2.2}, 96.6 ${mouthY + 2.2}, 94.6 ${mouthY} Z`}
            fill="#a4616d"
            opacity="0.6"
          />
          <path
            d={`M 95 ${mouthY + 0.1} C 97.4 ${mouthY + 0.9}, 102.6 ${mouthY + 0.9}, 105 ${mouthY + 0.1}`}
            fill="none"
            stroke="#6f3741"
            strokeWidth="0.6"
            opacity="0.6"
          />
        </>
      ) : (
        <>
          <path
            d={`M 95.4 ${mouthY} C 97 ${mouthY - 1.6}, 98.8 ${mouthY - 0.6}, 100 ${mouthY - 0.6} C 101.2 ${mouthY - 0.6}, 103 ${mouthY - 1.6}, 104.6 ${mouthY} C 102.6 ${mouthY + 3}, 97.4 ${mouthY + 3}, 95.4 ${mouthY} Z`}
            fill="#b06374"
            opacity="0.78"
          />
          <path
            d={`M 95.8 ${mouthY + 0.1} C 98 ${mouthY + 1}, 102 ${mouthY + 1}, 104.2 ${mouthY + 0.1}`}
            fill="none"
            stroke="#7a3b49"
            strokeWidth="0.55"
            opacity="0.6"
          />
          <ellipse cx="100" cy={mouthY + 1.4} rx="2.2" ry="0.7" fill="#ffd9dd" opacity="0.45" />
        </>
      )}

      {/* Blush, which the reference uses heavily on one face and barely at all
          on the other. */}
      <ellipse cx="89.8" cy="84.5" rx="4.6" ry="2.8" fill="#e9a3b8" opacity={masculine ? 0.1 : 0.26} />
      <ellipse cx="110.2" cy="84.5" rx="4.6" ry="2.8" fill="#e9a3b8" opacity={masculine ? 0.1 : 0.26} />
      {!masculine ? (
        <ellipse cx="100" cy="83.5" rx="3.4" ry="1.6" fill="#e9a3b8" opacity="0.15" />
      ) : null}
    </g>
  );
}
