import { Injectable, signal } from '@angular/core';

// A tiny WebAudio sequencer: square-wave lead, triangle bass, noise hi-hat.
// No audio files, and it never autoplays (browsers require a click anyway).

const BPM = 132;
const STEP = 60 / BPM / 2; // eighth notes

// MIDI note numbers, 0 = rest. 4 bars of 8 steps, looped.
const LEAD = [
  69, 0, 72, 76, 74, 72, 71, 72,
  69, 0, 64, 67, 69, 0, 67, 64,
  65, 0, 69, 72, 71, 69, 67, 69,
  71, 0, 67, 71, 74, 72, 71, 67,
];
const BASS = [
  45, 45, 57, 45, 45, 45, 57, 45,
  48, 48, 60, 48, 43, 43, 55, 43,
  41, 41, 53, 41, 41, 41, 53, 41,
  43, 43, 55, 43, 44, 44, 56, 44,
];

const freq = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

@Injectable({ providedIn: 'root' })
export class ChiptuneService {
  readonly playing = signal(false);
  readonly trackName = 'victor_theme.mid';

  private ctx?: AudioContext;
  private master?: GainNode;
  private noise?: AudioBuffer;
  private timer?: ReturnType<typeof setInterval>;
  private step = 0;
  private nextTime = 0;

  toggle() {
    this.playing() ? this.stop() : this.play();
  }

  play() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.06;
      this.master.connect(this.ctx.destination);
      this.noise = this.makeNoise(this.ctx);
    }
    this.ctx.resume();
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.05;
    // Look-ahead scheduler: wake every 25ms, schedule notes 100ms ahead.
    this.timer = setInterval(() => this.schedule(), 25);
    this.playing.set(true);
  }

  stop() {
    clearInterval(this.timer);
    this.ctx?.suspend();
    this.playing.set(false);
  }

  private schedule() {
    const ctx = this.ctx!;
    while (this.nextTime < ctx.currentTime + 0.1) {
      const i = this.step % LEAD.length;
      if (LEAD[i]) this.tone('square', freq(LEAD[i]), this.nextTime, STEP * 0.9, 0.5);
      if (BASS[i]) this.tone('triangle', freq(BASS[i]), this.nextTime, STEP * 0.8, 1);
      if (i % 2 === 1) this.hat(this.nextTime);
      this.nextTime += STEP;
      this.step++;
    }
  }

  private tone(type: OscillatorType, hz: number, t: number, dur: number, vol: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.value = hz;
    env.gain.setValueAtTime(vol, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(env).connect(this.master!);
    osc.start(t);
    osc.stop(t + dur);
  }

  private hat(t: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    const env = ctx.createGain();
    const hp = ctx.createBiquadFilter();
    src.buffer = this.noise!;
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    env.gain.setValueAtTime(0.4, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    src.connect(hp).connect(env).connect(this.master!);
    src.start(t);
    src.stop(t + 0.05);
  }

  private makeNoise(ctx: AudioContext) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }
}
