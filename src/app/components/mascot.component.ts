import { Component, DestroyRef, inject, signal } from '@angular/core';
import { PixelComponent } from '../pixel/pixel.component';

const LINES = [
  'meow!',
  'have you tried turning it off and on again?',
  'victor wrote this site. i supervised.',
  'purr... TypeScript > JavaScript',
  'i sat on the keyboard and fixed a bug',
  'psst... try the konami code',
  'nap time is sacred',
  'no mice were harmed making this site',
];

/** A clickable pixel cat with a speech bubble. */
@Component({
  selector: 'app-mascot',
  imports: [PixelComponent],
  template: `
    <button class="cat" type="button" (click)="pet()" aria-label="Pet the cat">
      <app-pixel [name]="blink() ? 'catBlink' : 'cat'" [scale]="4" [class.hop]="hop()" />
    </button>
    @if (line()) {
      <p class="bubble" aria-live="polite">{{ line() }}</p>
    }
    <p class="pets">pets: {{ pets() }}{{ pets() >= 10 ? ' ♥' : '' }}</p>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      text-align: center;
    }
    .cat {
      background: none;
      border: 0;
      cursor: pointer;
      padding: 0;
    }
    .hop { animation: hop 0.3s steps(2); }
    @keyframes hop { 50% { transform: translateY(-8px); } }
    .bubble {
      position: relative;
      background: #f0f0f0;
      color: #0b0b0b;
      border: 2px solid #0b0b0b;
      padding: 4px 6px;
      font-size: 11px;
      box-shadow: 2px 2px 0 var(--red);
    }
    .bubble::before {
      content: '';
      position: absolute;
      top: -8px;
      left: 50%;
      margin-left: -4px;
      border: 4px solid transparent;
      border-bottom-color: #0b0b0b;
    }
    .pets {
      font-size: 10px;
      color: var(--text-muted);
    }
  `],
})
export class MascotComponent {
  readonly blink = signal(false);
  readonly hop = signal(false);
  readonly line = signal('');
  readonly pets = signal(0);

  private lineTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const blinker = setInterval(() => {
      this.blink.set(true);
      setTimeout(() => this.blink.set(false), 150);
    }, 3500);
    inject(DestroyRef).onDestroy(() => clearInterval(blinker));
  }

  pet() {
    this.pets.update((n) => n + 1);
    const n = this.pets();
    this.line.set(n === 10 ? 'ok you are my favorite human now' : LINES[(Math.random() * LINES.length) | 0]);
    this.hop.set(false);
    requestAnimationFrame(() => this.hop.set(true));
    clearTimeout(this.lineTimer);
    this.lineTimer = setTimeout(() => this.line.set(''), 3500);
  }
}
