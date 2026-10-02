# Avatar art — what to generate, and where it goes

The figures and items in the app are vector drawings. Every one of them can be
replaced by an image, **one at a time**, without touching code: drop a file into
`app/src/assets/avatar/` and the app uses it. Anything with no image keeps its
drawing. Nothing breaks while the folder is half full.

This is the agreed route to the look in the references: painted figures, with
the vector items layered on top until those are painted too.

---

## The look

Sims 4 CAS-style character renders. The specific things that make those read
the way they do, in the order they matter:

1. **Soft frontal light**, close to shadowless. Not dramatic side-light.
2. **Strong, defined brows** — the single most recognisable feature.
3. **Large eyes** with a heavy upper lash line and a catchlight.
4. **Full lips** with a highlight on the lower one.
5. **Hair in strands**, with a bright sheen band around the crown.
6. **Smooth skin** with blush on the cheeks and across the nose.
7. **Plain background, fully transparent** — no backdrop, no vignette, no floor.

The wood, the glass panels and the vines are drawn by the app behind and in
front of the figure. Any background baked into an image will sit as a flat
rectangle in the middle of the forest.

---

## The canvas

Every image — figures and items alike — is authored on **the same canvas**,
because they stack. Nothing aligns unless they all share it.

| | |
|---|---|
| Aspect | **2 : 3** (portrait) |
| Suggested size | **800 × 1200** px |
| Format | PNG with transparency (or WebP) |
| Background | fully transparent |

The app maps this onto a 200 × 300 grid. Positions below are given as
percentages so they hold at any resolution.

### Where the figure sits

| Landmark | Down from top | Across |
|---|---|---|
| Top of the head | **18%** | centred on 50% |
| Chin | **33%** | — |
| Shoulder line | **37%** | 38% to 62% |
| Waist | **51%** | — |
| Hem / ankles | **91%** | — |
| Soles | **97%** | — |
| Head width | — | **42%** to **58%** |

`design/avatar-template.svg` draws these as guides. Open it under your render
and line the head and feet up with the rules; everything else follows.

Feet apart, arms down and slightly away from the body, facing straight
forward. The figure must be **symmetrical left to right** and must not lean —
items are positioned against this grid, so a tilted body puts the crown on the
ear.

---

## File names

```
figures/sorceress.png              the whole body, feminine
figures/sorcerer.png               the whole body, masculine

items/<item-id>.png                one item, used on both bodies
items/<item-id>.sorcerer.png       a body-specific cut, preferred when present

hair/<style>.png                   greyscale; the app tints it
```

Item ids are the `id` values in `app/src/game/items.ts` — for example
`items/crown-moonsteel.png`, `items/robe-plumwood.png`. The wardrobe gallery
lists every one.

Hair styles are `long`, `waves`, `short`, `braid`, `bun`, `tail`.

### Items are layers, not pictures

Each item image contains **only that item**, in the position it occupies on the
body, on a transparent canvas the same size as the figure. A crown image is a
crown floating in the right place — not a crown on a head.

Robes, cloaks and shoes change shape with the body underneath, so those get a
`.sorcerer` variant. Crowns, staves, familiars and spells generally do not.

### Hair is greyscale

Hair is tinted in the app so one render covers all eight colours. Author it in
**neutral greys**: mid-grey for the body of the hair, near-white for the sheen,
near-black for the shadow. The app maps that range onto the chosen colour. A
hair image with colour baked in will come out muddy.

---

## Checking your work

Drop a file in, run the app, and look. There is no build step to remember and
no manifest to edit — the file list is resolved at build time, so a new file
appears the next time the app builds. Pushing to `main` rebuilds and deploys.

If an image looks wrong, it is nearly always one of three things: the canvas
was not 2:3, the background was not transparent, or the figure was not on the
landmarks above.
