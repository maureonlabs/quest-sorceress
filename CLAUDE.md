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
per-user data, streaks, an avatar with unlockable items, server-side ownership checks,
PWA offline support, and a fantasy/nature art direction (glowing vines, gold ornate
borders, forest lighting).

Note the spec's Flow 1 now matches the prototype's *behaviour* — **one quest at a time,
on demand, via a "Give me a quest" button**, not a daily batch. The filtering differs
though (setting/category/difficulty, not intent/time/energy), and everything behind it
is different. Still a rewrite, not an increment.

## Platform: undecided

Supabase (free, open Postgres, more to build) vs Base44 ($40/month, auth and database
pre-built, two-way GitHub sync). `SPEC.md` section 7 still names Base44 — **update it
once the choice is made.**

`DATA-MODEL.md` is deliberately platform-neutral, so the first build stage commits to
neither. `BUILD-PROMPT.md` is spec sections 1–8, paste-ready for whichever builder.

**Decided:** whatever gets built replaces the prototype. The prototype is a first pass,
not a version to maintain. Do not reimplement the spec in `index.html`.

## Build order

Per the spec-first playbook: **data model → core user flows → auth → polish.**
Section 9's acceptance criteria are the pre-release QA checklist.

## Deployment

- **Live (prototype):** https://quest-sorceress.vercel.app
- **Repo:** https://github.com/maureonlabs/quest-sorceress (public)
- Vercel auto-deploys on every push to `main`. No manual deploy step.
- Base44 will host the spec version itself, so the live URL changes when it ships —
  either to Base44's hosting or a custom domain pointed at it.

## Conventions

- Commit with `git add -A && git commit -m "..." && git push` — Vercel does the rest.
- Never commit credentials. `.gitignore` covers `Codes/`, `*recovery-codes*`, `.env*`,
  `*.key`, `*.pem`.
