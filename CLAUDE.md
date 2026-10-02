# Quest Sorceress

See @SPEC.md — it is the source of truth for what this app should be. Read it before
planning or building anything here.

## What this is

A gamified to-do app. You tap **Give me a quest** and it hands you one real-world task,
drawn at random from a fixed library and filtered to your setting, category and
difficulty. Completing quests builds a daily streak, and the third quest of any day brings a
Bible verse or a line of wisdom.

**Built here, in Claude Code.** React + Vite + TypeScript, deployed as a static site on
Vercel. **No backend, no accounts, no database, no monthly cost.** Everything lives in
the visitor's browser.

Base44 and Supabase were both considered and both dropped — see `SPEC.md` §5 and §7.
Do not reintroduce a backend without an explicit decision to do so.

## The spec is the target

`SPEC.md` describes what this should be and is kept current as decisions are made.
Where the spec and the code disagree, fix one of them deliberately rather than letting
them drift.

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
- **Catalogues are bundled, not stored.** Quests and passages ship with the app.
- **No avatar, no items.** Both were built and then removed at the user's request —
  the app is a quest generator and a streak. Do not reintroduce a wardrobe without an
  explicit decision; it is in git history if it is ever wanted.
- **The day's passage** is shown on the third completed quest, once per calendar day,
  and does not repeat until all 100 have been seen. Scripture is the public-domain
  World English Bible; the other fifty lines are written for the app and attributed to
  nobody, because a misattributed quote is worse than an anonymous one.
- **`design/TAXONOMY.md` is the ruling for quest selection.** Mood shifts difficulty
  downward only; target feeling and setting are hard filters; the age band is never
  relaxed. Change the rules there first, then the code.
- **Category no longer filters anything.** The daily "what do you want to feel?"
  replaced it. It survives as a label on the card.

## Content

`app/src/content/quests.json` holds the library — **319 quests**, covering every
**setting × target feeling × difficulty** combination **in every age band**.

**Do not regenerate this content.** To change tags, edit `tools/retag.py` and run
`python3 tools/retag.py --write`, then `python3 tools/coverage.py` to prove no
combination went empty. Quests written by hand carry `manualTags: true` and the keyword
tagger leaves them alone.

## Design

`design/ART-DIRECTION.md` is the visual contract, with reference images in
`design/reference/`. Enchanted glass panels in a moonlit forest: frosted translucent
cards, ornate gold frames, golden vines overlapping the panel edges, pink blossom, one
mint accent per screen.

The vines must read as growing **in front of** the glass. Flat printed borders collapse
the whole look into ordinary glassmorphism.

## Deployment

- **Live:** https://quest-sorceress.vercel.app
- **Repo:** https://github.com/maureonlabs/quest-sorceress (public)

`git push` to `main` is the whole deploy. Vercel watches the repo, runs
`cd app && npm ci && npm run build` (set in `vercel.json`), and serves
`app/dist`. No manual deploy step, and no Vercel command to remember.

**If the build fails, the live site does not change** — Vercel only swaps in a
deployment that built successfully. A broken push is a failed deploy, never a
broken site.

Hash routing (`#/preferences`) is deliberate: a static host needs no rewrite
rules for deep links to work.

The original single-file prototype was removed once the real app took over the
URL. It is still in git history if it is ever wanted.

## Conventions

- Commit with `git add -A && git commit -m "..." && git push` — Vercel does the rest.
  `-A` stages **deletions** as well as edits, which is what keeps GitHub free of
  files that no longer exist locally. Deleting a file and pushing removes it from
  GitHub; it survives only in history.
- Run `npm run check` in `app/` before pushing anything substantial. It runs lint,
  typecheck, tests and a production build in one go — the same build Vercel will run.
- Dead code fails the build, it does not linger: `noUnusedLocals` and
  `noUnusedParameters` are on, so an unused variable, import or parameter is a
  compile error. When a feature is removed, its leftovers cannot quietly survive.
- Never commit credentials. `.gitignore` covers `Codes/`, `*recovery-codes*`, `.env*`,
  `*.key`, `*.pem`.
- All persistence goes through one storage module, so accounts can be added later
  without touching the rest of the app.
