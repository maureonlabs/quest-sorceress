/**
 * Magic, synthesised.
 *
 * Every sound is generated with the Web Audio API rather than shipped as audio
 * files: no assets to license or download, a couple of kilobytes of code, and
 * each progression can be tuned by ear rather than re-exported.
 *
 * The chosen voice is "Fairy Harp": plucked rather than struck — a very fast
 * attack, a short decay, and a quiet twelfth above rather than an octave, which
 * is what makes a plucked string read as a string and not a bell. Every cue is a
 * run of notes close together, like a hand drawn across harp strings.
 *
 * All of it sits on a pentatonic scale, which has no semitones and so cannot
 * sound sour however the notes overlap.
 *
 * Browsers refuse to start audio before the visitor has interacted with the
 * page, so the context is created lazily and resumed on a gesture. Anything
 * that tries to play before then waits for the resume rather than being
 * dropped.
 *
 * **On iPhone the hardware silent switch mutes this**, as it mutes all Web
 * Audio in Safari, and no amount of code changes that — short of claiming the
 * 'playback' audio session, which would also stop whatever the visitor is
 * listening to. The sound test in Preferences exists so that case is
 * identifiable rather than mysterious.
 */

type Cue = 'enter' | 'deal' | 'complete' | 'dismiss' | 'select' | 'unlock';

/* Pentatonic — C major with the 4th and 7th removed. */
const N = {
  C4: 261.63,
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.0,
  C6: 1046.5,
  D6: 1174.66,
  E6: 1318.51,
  G6: 1567.98,
  A6: 1760.0,
  C7: 2093.0,
};

interface Note {
  f: number;
  /** seconds after the cue starts */
  at: number;
  dur?: number;
  gain?: number;
}

/**
 * One progression per cue. Rising for anything good, gently falling for a
 * dismissal — which should still sound courteous, because declining a quest is
 * a legitimate move and not a failure.
 */
const CUES: Record<Cue, Note[]> = {
  // The portal: a hand running the full length of the strings, two octaves up.
  enter: [
    { f: N.C4, at: 0, dur: 0.9 },
    { f: N.E4, at: 0.06, dur: 0.9 },
    { f: N.G4, at: 0.12, dur: 0.9 },
    { f: N.C5, at: 0.18, dur: 0.9 },
    { f: N.E5, at: 0.24, dur: 0.9 },
    { f: N.G5, at: 0.3, dur: 0.9 },
    { f: N.C6, at: 0.36, dur: 1.1, gain: 0.5 },
    { f: N.E6, at: 0.42, dur: 1.1, gain: 0.4 },
    { f: N.G6, at: 0.48, dur: 1.2, gain: 0.3 },
    { f: N.C7, at: 0.56, dur: 1.3, gain: 0.2 },
  ],
  // A card dealt: four quick notes, bright and over almost at once.
  deal: [
    { f: N.G5, at: 0, dur: 0.35 },
    { f: N.A5, at: 0.05, dur: 0.35 },
    { f: N.C6, at: 0.1, dur: 0.4 },
    { f: N.E6, at: 0.15, dur: 0.55, gain: 0.45 },
  ],
  // Finishing: the longest run, climbing past the top and falling back to rest.
  complete: [
    { f: N.C5, at: 0, dur: 0.45 },
    { f: N.E5, at: 0.05, dur: 0.45 },
    { f: N.G5, at: 0.1, dur: 0.45 },
    { f: N.C6, at: 0.15, dur: 0.5 },
    { f: N.E6, at: 0.2, dur: 0.55 },
    { f: N.G6, at: 0.25, dur: 0.6, gain: 0.45 },
    { f: N.C7, at: 0.32, dur: 0.9, gain: 0.3 },
    { f: N.G6, at: 0.42, dur: 0.9, gain: 0.22 },
    { f: N.C7, at: 0.5, dur: 1.1, gain: 0.18 },
  ],
  // Declining: three soft notes stepping down. Courteous, not a buzzer —
  // setting a quest aside is a legitimate move, not a failure.
  dismiss: [
    { f: N.E5, at: 0, dur: 0.3, gain: 0.28 },
    { f: N.C5, at: 0.06, dur: 0.45, gain: 0.24 },
    { f: N.A4, at: 0.12, dur: 0.5, gain: 0.2 },
  ],
  // Choosing a chip: one plucked string.
  select: [{ f: N.E6, at: 0, dur: 0.16, gain: 0.16 }],
  // Reserved for streak-milestone unlocks in a later phase.
  unlock: [
    { f: N.C5, at: 0, dur: 0.5 },
    { f: N.G5, at: 0.06, dur: 0.5 },
    { f: N.C6, at: 0.12, dur: 0.55 },
    { f: N.E6, at: 0.18, dur: 0.6 },
    { f: N.G6, at: 0.24, dur: 0.7, gain: 0.5 },
    { f: N.A6, at: 0.32, dur: 0.9, gain: 0.4 },
    { f: N.C7, at: 0.42, dur: 1.2, gain: 0.3 },
  ],
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

function ensure(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.26;

    // A short feedback delay stands in for reverb — enough to suggest a space
    // without the weight of a convolution impulse.
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.12;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.28;
    const wet = ctx.createGain();
    wet.gain.value = 0.34;

    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

/**
 * Ask the browser to start audio. Safe to call as often as you like.
 *
 * This used to run once, from one `{ once: true }` listener. On a phone that is
 * a coin flip: if the very first touch does not succeed in starting the context
 * — and on iOS it often does not — the listener has already been removed and
 * the app is silent for the rest of the session with no way back. Call it on
 * every interaction until `isRunning()` is true instead.
 */
export function arm(): void {
  const c = ensure();
  if (c && c.state !== 'running') void c.resume();
}

/** True once the browser has actually let audio start. */
export function isRunning(): boolean {
  return ctx?.state === 'running';
}

/** What the audio context is doing, for the sound test in Preferences. */
export function state(): 'unsupported' | AudioContextState {
  const c = ensure();
  return c ? c.state : 'unsupported';
}

export function setEnabled(on: boolean): void {
  enabled = on;
  if (on) arm();
}

export function isEnabled(): boolean {
  return enabled;
}

function bell(c: AudioContext, out: GainNode, n: Note, t0: number): void {
  const dur = n.dur ?? 0.6;
  const peak = n.gain ?? 0.4;
  const start = t0 + n.at;

  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = n.f;

  // A twelfth above rather than an octave: the interval a plucked string
  // actually rings at, which is what separates a harp from a bell.
  const high = c.createOscillator();
  high.type = 'sine';
  high.frequency.value = n.f * 3.01;

  const g = c.createGain();
  const gh = c.createGain();

  // Plucked: almost no attack at all, then straight into the decay.
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(peak, start + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);

  gh.gain.setValueAtTime(0.0001, start);
  gh.gain.exponentialRampToValueAtTime(peak * 0.14, start + 0.003);
  gh.gain.exponentialRampToValueAtTime(0.0001, start + dur * 0.55);

  osc.connect(g).connect(out);
  high.connect(gh).connect(out);

  osc.start(start);
  high.start(start);
  osc.stop(start + dur + 0.05);
  high.stop(start + dur + 0.05);
}

function sound(c: AudioContext, out: GainNode, cue: Cue): void {
  const t0 = c.currentTime + 0.02;
  for (const n of CUES[cue]) bell(c, out, n, t0);
}

export function play(cue: Cue): void {
  if (!enabled) return;
  const c = ensure();
  if (!c || !master) return;
  const out = master;

  if (c.state === 'running') {
    sound(c, out, cue);
    return;
  }

  /* Not running yet. `resume()` is a PROMISE — the old code called it and then
   * re-read `c.state` on the very next line, which is of course still
   * 'suspended', so it returned every time and nothing ever played. Wait for
   * the resume and play on the other side of it.
   *
   * This matters most on a phone, where the first cue of a session is usually
   * triggered by the same tap that is also unblocking audio. */
  void c
    .resume()
    .then(() => {
      if (enabled && c.state === 'running') sound(c, out, cue);
    })
    .catch(() => {
      /* Still blocked. The next gesture will arm it. */
    });
}
