# Quest Sorceress — Feeling Taxonomy and Selection Rules

This is the ruling for how a quest is chosen. It is the contract `app/src/game/quests.ts`
implements, and the reason the daily check-in asks what it asks.

---

## The two feeling questions

The daily check-in asks **where you are**, **how you feel**, **what you want to feel**, and
**how hard you want it**. Two of those are feelings, and they do completely different jobs.

### Current feeling — where you are now

Six states. This never filters the library; it only adjusts how much the app asks of you.

| Value | Reads as | Effort shift |
|---|---|---|
| `drained` | Nothing left in the tank | **−1 rank** |
| `anxious` | Wired, head too loud | **−1 rank** |
| `flat` | Numb, nothing appeals | **−1 rank** |
| `restless` | Too much energy, cannot settle | as chosen |
| `steady` | Fine. Neither up nor down | as chosen |
| `bright` | Good, ready for anything | as chosen |

### Target feeling — where you want to go

Six states. This **is** the hard filter: a quest must be tagged with the target to be
eligible. Every quest carries one or more.

| Value | Reads as | Typically drawn from |
|---|---|---|
| `calm` | Settle me down | mindfulness, slow outdoor |
| `energised` | Wake me up | fitness, movement |
| `focused` | Clear my head | learning, single-task work |
| `accomplished` | Let me finish something | chores, admin, repair |
| `playful` | Make it fun | games, making things, novelty |
| `connected` | Put me near people | conversation, messages, shared rooms |

A quest may serve several targets — a walk at dusk is both `calm` and `energised` — so
`feels` is a list, never a single value.

---

## The rules

**R1 — Setting is a hard filter.** Today's check-in answer replaces the profile's general
list entirely. Being at the gym *today* is a stronger fact than usually going to the gym.

**R2 — Target feeling is a hard filter.** The quest must carry the chosen target in its
`feels` list. This replaces category as the primary filter; category survives only as a
label on the card.

**R3 — Difficulty is answered daily.** The profile's `difficultyPreference` is the default
the check-in offers, not the final word. What you pick today wins.

**R4 — Current feeling relaxes effort downward only, never upward.** A drained person who
asks for Master gets Adept. A bright person who asks for Apprentice gets Apprentice —
enthusiasm is not a reason to override someone's own stated limit. Easy is the floor.

> This is the oldest rule in the project. The first prototype relaxed symmetrically and
> handed a drained user a high-energy quest, which is the precise moment an app like this
> loses someone.

**R5 — Age gates content, and is never relaxed.** Every quest carries an age band. A quest
outside the player's band is not shown, ever — not when the pool is thin, not when
cooldowns have emptied it, not as a last resort. See the ordering in R7.

**R6 — Coverage guarantee.** The library holds at least one quest for every
**setting × target feeling × difficulty** combination: 7 × 6 × 3 = **126 minimum**. No
eligible combination can come back empty, which is why no runtime filter-relaxing is
needed for the ordinary case.

**R7 — Never hand back nothing, and relax in a fixed order.** If the pool empties, give up
constraints in this order and stop as soon as something is found:

1. the 14-day dismissal cooldown
2. the difficulty rank (widen to any)
3. the target feeling (widen to any)

**Setting and age are never given up.** An empty screen is bad; a gym quest for someone
sitting at home is worse; an adult quest for a child is unacceptable.

---

## Age bands

Chosen at onboarding, stored on the profile, changeable in Preferences.

`1–12` · `13–18` · `19–25` · `26–32` · `33–40` · `41–50` · `50+`

> The ranges as first sketched overlapped at 32 and 40 — a 32-year-old belonged to two
> bands at once. Normalised to `26–32` / `33–40` / `41–50` so every age lands in exactly
> one.

A quest's `ages` is the list of bands it suits. Most quests are suitable for everyone and
carry all seven. The bands exist to keep two specific things from happening:

- **Under 13** never sees quests involving going out alone, spending money, caffeine,
  late nights, workplace admin, or anything assuming independent adult life.
- **41+ and 50+** never sees high-impact or maximal-effort fitness as a *required* step.
  Gentler equivalents cover the same setting, feeling and difficulty.

Nothing about the age band changes the art, the items, or the streak. It only narrows
which quests are eligible.

---

## What the player sees

The check-in's four answers are summarised back in one line before the first quest of the
day — "Drained, and you want to feel calm. Here is something small." — so the matching is
legible rather than magic. An app that quietly adjusts difficulty without saying so reads
as broken when the player notices.
