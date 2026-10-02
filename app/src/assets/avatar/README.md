# Painted avatar art

Drop image files here and the app uses them instead of its vector drawings.
Anything missing falls back to vector, per item, so this folder can be filled a
piece at a time.

```
figures/sorceress.png              the whole body
figures/sorcerer.png
items/<item-id>.png                one item, both bodies
items/<item-id>.sorcerer.png       a body-specific cut, used in preference
hair/<style>.png                   greyscale; tinted to the player's colour
```

Item ids are the `id` field in `src/game/items.ts` — for example
`items/crown-moonsteel.png`.

**Every image must share the same alignment.** See `design/AVATAR-ASSETS.md`
for the canvas, the guides, and what each layer should and should not include.
