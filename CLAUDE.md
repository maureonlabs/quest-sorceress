# Quest Sorceress

See @SPEC.md — it is the source of truth for what this app should be. Read it before
planning or building anything here.

## What this is

A gamified to-do app. You tap **Give me a quest** and it hands you one real-world task,
drawn at random from a fixed library and filtered to your setting, category and
difficulty. Completing quests builds a daily streak; weekly streak milestones unlock
items for your sorceress avatar.

**Built here, in Claude Code.** React + Vite + TypeScript, deployed as a static site on
Vercel. **No backend, no accounts, no database, no monthly cost.** Everything lives in
the visitor's browser.

Base44 and Supabase were both considered and both dropped — see `SPEC.md` §5 and §7.
Do not reintroduce a backend without an explicit decision to do so.

## The spec is the target, not the current state

What is deployed today is still the **original prototype** (`index.html`, one
self-contained file): one quest on demand filtered by intent/time/energy, 190 inline
quests, no persistence, dark "arcane tarot" look.

The spec's app differs in almost every respect — different filtering, a persisted
profile, streaks, an avatar with unlockable items, and a fantasy/nature art direction.
**Treat it as a rewrite, not an increment.** Do not patch `index.html`; the new app
replaces it.

## Build order

Per the spec-first playbook: **data model → core user flows → polish.** (The auth stage
is gone — there are no accounts.) Section 9's acceptance criteria are the pre-release QA
checklist.

## Key decisions already made

- **One quest at a time, on demand.** No daily batch, no list. Tapping the button while
  one is pending replaces it, and the replaced quest counts as dismissed.
- **Difficulty** is stored as `easy`/`medium`/`hard`, displayed as
  **Apprentice/Adept/Master**. `difficultyPreference` is single-select.
- **Streak is derived, never stored** — computed from completed quests, so it cannot
  drift out of sync with them.
- **Several items can be equipped at once.**
- **Catalogues are bundled, not stored.** Quests and items ship with the app.

## Content

`content/quests.csv` and `content/quests.json` hold the finished library — **269 quests
covering all 126 setting × category × difficulty combinations**. 190 were retagged from
the prototype, 79 written to fill gaps. **Do not regenerate this content.** Every
combination is guaranteed non-empty, which is why no runtime fallback logic is needed.

## Design

`design/ART-DIRECTION.md` is the visual contract, with reference images in
`design/reference/`. Enchanted glass panels in a moonlit forest: frosted translucent
cards, ornate gold frames, golden vines overlapping the panel edges, pink blossom, one
mint accent per screen.

The vines must read as growing **in front of** the glass. Flat printed borders collapse
the whole look into ordinary glassmorphism.

## Deployment

- **Live:** https://quest-sorceress.vercel.app (currently the old prototype)
- **Repo:** https://github.com/maureonlabs/quest-sorceress (public)
- Vercel auto-deploys on every push to `main`. No manual deploy step.

## Conventions

- Commit with `git add -A && git commit -m "..." && git push` — Vercel does the rest.
- Never commit credentials. `.gitignore` covers `Codes/`, `*recovery-codes*`, `.env*`,
  `*.key`, `*.pem`.
- All persistence goes through one storage module, so accounts can be added later
  without touching the rest of the app.
