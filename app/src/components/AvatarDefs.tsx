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

import { CLOTHS, METALS, type Ramp } from './palette';

/** One three-stop gradient per ramp, lit from the upper left like the scene. */
function rampStops(id: string, r: Ramp) {
  return (
    <linearGradient key={id} id={id} x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stopColor={r.lit} />
      <stop offset="0.45" stopColor={r.mid} />
      <stop offset="1" stopColor={r.dark} />
    </linearGradient>
  );
}

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
        {/* Every material in the wardrobe, emitted once for the whole page. */}
        {Object.entries(METALS).map(([k, r]) => rampStops(`qs-m-${k}`, r))}
        {Object.entries(CLOTHS).map(([k, r]) => rampStops(`qs-c-${k}`, r))}

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

        {/* A real lighting model rather than a painted-on highlight: this is
            what lets metal read as metal instead of as a pale shape. */}
        <filter id="qs-metal" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="bump" />
          <feSpecularLighting
            in="bump"
            surfaceScale="3"
            specularConstant="0.9"
            specularExponent="22"
            lightingColor="#fff6dd"
            result="spec"
          >
            <feDistantLight azimuth="235" elevation="58" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="lit" />
          <feComposite in="SourceGraphic" in2="lit" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>

        {/* Cloth gets a soft sheen rather than a texture. An feTurbulence weave
            was tried and removed: at inventory size it reads as television
            static, and at figure size it muddied every colour in the palette. */}
        <linearGradient id="qs-sheen" x1="0.1" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="0.4" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
      </defs>
    </svg>
  );
}
