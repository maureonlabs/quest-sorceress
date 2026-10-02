/**
 * The one thing about audio that can be tested without ears: that a cue
 * triggered while the browser is still blocking audio actually plays once the
 * block lifts, instead of being dropped.
 *
 * This is here because it shipped broken. `play()` called `resume()` and then
 * re-read `context.state` on the very next line — but `resume()` returns a
 * promise, so the state was always still 'suspended' and the function returned
 * every time. On desktop it was masked, because a listener had usually resumed
 * the context seconds earlier. On a phone, where the first cue rides on the
 * same tap that unblocks audio, it meant silence.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

interface FakeOsc {
  started: boolean;
}

/** Just enough of the Web Audio API for the scheduling path to run. */
function installFakeAudio(startState: AudioContextState) {
  const oscillators: FakeOsc[] = [];

  const node = () => ({
    connect: vi.fn(function (this: unknown, next: unknown) {
      return next;
    }),
    gain: { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    delayTime: { value: 0 },
  });

  class FakeContext {
    state: AudioContextState = startState;
    currentTime = 0;
    destination = node();
    createGain = () => node();
    createDelay = () => node();
    createOscillator = () => {
      const o: FakeOsc = { started: false };
      oscillators.push(o);
      return {
        ...node(),
        type: '',
        frequency: { value: 0 },
        start: () => {
          o.started = true;
        },
        stop: vi.fn(),
      };
    };
    /* Asynchronous, exactly like the real thing. */
    resume = () =>
      new Promise<void>((done) => {
        setTimeout(() => {
          this.state = 'running';
          done();
        }, 0);
      });
  }

  (globalThis as unknown as { window: unknown }).window = globalThis;
  (globalThis as unknown as { AudioContext: unknown }).AudioContext = FakeContext;
  return oscillators;
}

const flush = () => new Promise((r) => setTimeout(r, 5));

describe('playing a cue', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('plays immediately when audio is already running', async () => {
    const oscillators = installFakeAudio('running');
    const sound = await import('./sound');
    sound.setEnabled(true);

    sound.play('complete');
    expect(oscillators.length).toBeGreaterThan(0);
  });

  /* The regression this file exists for. */
  it('still plays when the cue arrives while audio is blocked', async () => {
    const oscillators = installFakeAudio('suspended');
    const sound = await import('./sound');
    sound.setEnabled(true);

    sound.play('complete');
    await flush();

    expect(oscillators.length, 'cue was dropped instead of waiting').toBeGreaterThan(0);
  });

  it('reports when audio is running, so the UI can say so', async () => {
    installFakeAudio('suspended');
    const sound = await import('./sound');

    expect(sound.isRunning()).toBe(false);
    sound.arm();
    await flush();
    expect(sound.isRunning()).toBe(true);
    expect(sound.state()).toBe('running');
  });

  it('plays nothing at all when sound is switched off', async () => {
    const oscillators = installFakeAudio('running');
    const sound = await import('./sound');

    sound.setEnabled(false);
    sound.play('complete');
    await flush();
    expect(oscillators).toHaveLength(0);
  });
});
