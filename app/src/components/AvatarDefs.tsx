/**
 * The paint box shared by the sorceress and every item she can wear.
 *
 * Rendered once per screen in a zero-sized SVG, with every gradient referenced
 * by id from the drawings elsewhere. Putting the defs in each figure instead
 * would duplicate them eight times over on the inventory grid — and, because
 * `url(#id)` resolves against the whole document rather than the enclosing SVG,
 * duplicate ids would silently all collapse onto the first copy anyway.
 *
 * Everything is tinted from the same palette as the UI: forest greens, two
 * golds, one mint, one blossom. Nothing pure black, nothing pure white.
 */

export function AvatarDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute' }}
    >
      <defs>
        {/* Gold, lit from the upper left like everything else in the scene. */}
        <linearGradient id="qs-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e3b4" />
          <stop offset="0.45" stopColor="#c9a34e" />
          <stop offset="1" stopColor="#7d5f26" />
        </linearGradient>

        <linearGradient id="qs-gold-soft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0d695" stopOpacity="0.9" />
          <stop offset="1" stopColor="#c9a34e" stopOpacity="0.35" />
        </linearGradient>

        {/* Her robe reads as the same frosted glass as the panels. */}
        <linearGradient id="qs-robe" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#2b4a40" />
          <stop offset="0.5" stopColor="#1a2f29" />
          <stop offset="1" stopColor="#0d1a16" />
        </linearGradient>

        <linearGradient id="qs-robe-deep" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#27574a" />
          <stop offset="0.55" stopColor="#15322a" />
          <stop offset="1" stopColor="#081310" />
        </linearGradient>

        {/* Lighter than the robe on purpose. A cloak the same value as the
            gown it hangs behind is a cloak nobody can see they earned. */}
        <linearGradient id="qs-cloak" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#36705f" />
          <stop offset="0.55" stopColor="#1d443a" />
          <stop offset="1" stopColor="#0a1a15" />
        </linearGradient>

        <linearGradient id="qs-hair" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#4a3326" />
          <stop offset="0.5" stopColor="#2a1d16" />
          <stop offset="1" stopColor="#150e0a" />
        </linearGradient>

        <linearGradient id="qs-skin" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#e9d0b7" />
          <stop offset="0.6" stopColor="#d8b795" />
          <stop offset="1" stopColor="#b8906d" />
        </linearGradient>

        <linearGradient id="qs-mint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a7f3e1" />
          <stop offset="1" stopColor="#3aa88f" />
        </linearGradient>

        <linearGradient id="qs-wing" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#f0b9cb" stopOpacity="0.62" />
          <stop offset="0.55" stopColor="#e9a3b8" stopOpacity="0.4" />
          <stop offset="1" stopColor="#c9a34e" stopOpacity="0.22" />
        </linearGradient>

        {/* Light pooling at her feet, as it pools under the panels. */}
        <radialGradient id="qs-pool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c9a34e" stopOpacity="0.4" />
          <stop offset="0.6" stopColor="#c9a34e" stopOpacity="0.12" />
          <stop offset="1" stopColor="#c9a34e" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="qs-spark" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.35" stopColor="#a7f3e1" stopOpacity="0.85" />
          <stop offset="1" stopColor="#6fd8c0" stopOpacity="0" />
        </radialGradient>

        <filter id="qs-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>

        <filter id="qs-glow-soft" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
    </svg>
  );
}
