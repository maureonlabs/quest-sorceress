# Quest Sorceress — Art Direction

Derived from the reference images in `design/reference/`. This is the visual contract
for the build. Everything below is observable in those references, not invented.

![Reference 1](reference/ui-reference-1.webp)
![Reference 2](reference/ui-reference-2.webp)

---

## The idea in one line

**Enchanted glass panels floating in a moonlit forest** — frosted translucent cards held
in ornate gold frames, wrapped in living vines and cherry blossom, lit by drifting
bioluminescence.

## What the references establish

**The world.** A dark forest at night. Deep teal-greens and browns, heavy bokeh depth,
mossy ground, soft glowing orbs resting in the grass. The UI is not *on* a background —
it is standing *in* a place.

**The surface.** Every panel is frosted translucent glass. You can see the forest through
it, blurred. Panels float upright, with a faint drop shadow and a rim of light along
their edges.

**The frame.** Thin ornate gold borders with art-nouveau corner filigree — decorative
brackets at each corner rather than a plain rectangle.

**The vines.** Golden-brass vines with small leaves grow around the frame, asymmetrically.
They overlap the panel edge in places, so the plant reads as in front of the glass, not
printed on it. This is the single most characteristic element — without it the design is
just glassmorphism.

**The blossoms.** Pink cherry blossoms scattered along the vines. The only warm non-gold
colour, and the thing that keeps it from feeling austere. Used sparingly.

**The light.** Warm gold bioluminescence: floating motes, soft orbs, glow pooling at the
base of panels. Light comes from *within* the scene.

**The accent.** A cool mint-teal glow marks the active or primary element (see the
compass sigil in reference 1). It is the one cool colour in a warm scene, which is
exactly why it draws the eye. Use it for one thing at a time.

**The type.** Gold serif small-caps for titles, with generous letter-spacing. Light,
quiet sans for everything else. Titles are ornament; body text gets out of the way.

**The controls.** Circular gold-rimmed icon buttons. List rows as rounded rectangles with
a hairline gold border and frosted fill. Selected rows have a brighter gold border.

---

## Tokens

Starting values, to be refined against real screens.

| Token | Value | Use |
|---|---|---|
| `--forest-deep` | `#0B1210` | page ground, furthest depth |
| `--forest-mid` | `#16211C` | mid-ground foliage |
| `--glass` | `rgba(226, 240, 234, 0.07)` | panel fill |
| `--glass-edge` | `rgba(255, 249, 232, 0.22)` | panel rim light |
| `--gold` | `#C9A34E` | frames, vines, borders |
| `--gold-lit` | `#F0D695` | title text, highlights, glow |
| `--blossom` | `#E9A3B8` | cherry blossom |
| `--mint` | `#6FD8C0` | the single active/primary accent |
| `--text` | `#F2EDE1` | body text, warm off-white |
| `--text-dim` | `#A8B5AE` | secondary text |

**Blur:** panels use a real backdrop blur (~16–20px) so the forest shows through softened.
**Radius:** panels ~18px, list rows ~10px, icon buttons fully round.

## Type

- **Display:** an elegant serif, small-caps, letter-spaced, in `--gold-lit`. Titles only.
- **Body:** a light humanist sans, generous line-height, in `--text`.

Exact families to be chosen at build time — the references show the *treatment*
(small-caps gold serif over quiet sans), which is the part that must survive.

## Motion

Slow and ambient, never bouncy. Light motes drift upward. Panels fade and rise a little
on entry. The quest-complete animation should feel like something *blooming* — the
blossom and glow vocabulary is already there to borrow from.

Respect `prefers-reduced-motion`: keep the scene, stop the drift.

---

## Applying it to the screens

| Screen | Treatment |
|---|---|
| **Home** | One hero glass panel holding the current quest. "Give me a quest" is the primary action — the one element that gets the mint glow. Streak counter sits small and gold near the top. |
| **Quest Detail** | The same panel, enlarged. Complete and Dismiss as the two actions. |
| **Quest Preferences** | Frosted list rows with hairline gold borders; selected rows brighten, as in reference 2. |
| **Avatar** | The sorceress framed like the panels — vines and blossom around her, forest behind. |
| **Inventory** | A grid of circular gold-rimmed item slots. Locked items dimmed, not hidden, so the next unlock is visible. |
| **Settings** | The quietest screen. Frame and glass, minimal vine. |

---

## What to avoid

- Vines as a flat printed border — they must overlap the panel edge and read as in front.
- Mint used on more than one element per screen; it stops being an accent.
- Pure black or pure white anywhere. The darkest value is forest, the lightest is warm.
- Heavy or bouncy animation. The scene is serene.
- Blossoms everywhere. They are punctuation, not texture.

---

## Note on the references

These are AI-generated concept images, so their UI text is nonsense and their layouts are
not literal screen designs. Take from them the **world, materials, palette, and framing** —
not the arrangement of controls. Section 4 of `SPEC.md` governs what is actually on each
screen.
