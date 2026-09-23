# Quest Sorceress

See @SPEC.md — it is the source of truth for what this app should be. Read it before
planning or building anything here.

## Important: the spec is the target, not the current state

`SPEC.md` describes the intended product. What is currently deployed is an **earlier,
different prototype** and does not implement the spec. Do not assume code in this repo
matches `SPEC.md`.

**Currently deployed** (`index.html`, ~74KB, single self-contained file):

- One quest dealt on demand, chosen by intent / time available / energy level
- 190 hard-coded quest templates in the file itself
- Session-only onboarding; **no storage, no accounts, no backend**
- Dark "arcane tarot" visual direction (deep indigo, antique gold, cinnabar)
- No streaks, no avatar, no items, no XP, no persistence of any kind

**The spec additionally requires** a backend with real user accounts, persistent
per-user data, a daily 3–5 quest generation cycle, streaks, an avatar with unlockable
items, server-side ownership checks, PWA offline support, and a fantasy/nature art
direction (glowing vines, gold ornate borders, forest lighting).

Treat building toward `SPEC.md` as a rewrite, not an increment.

## Build order

Per the spec-first playbook: **data model → core user flows → auth → polish.**
Section 9's acceptance criteria are the pre-release QA checklist.

## Deployment

- **Live:** https://quest-sorceress.vercel.app
- **Repo:** https://github.com/maureonlabs/quest-sorceress (public)
- Vercel auto-deploys on every push to `main`. No manual deploy step.
- Static hosting only today. The spec's auth and per-user data will require a backend,
  so hosting needs revisiting before that work starts.

## Conventions

- Commit with `git add -A && git commit -m "..." && git push` — Vercel does the rest.
- Never commit credentials. `.gitignore` covers `Codes/`, `*recovery-codes*`, `.env*`,
  `*.key`, `*.pem`.
