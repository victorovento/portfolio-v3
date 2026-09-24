import { Component, DestroyRef, inject, signal } from '@angular/core';
import { PixelComponent } from '../pixel/pixel.component';
import { SpriteName } from '../pixel/sprites';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
];

interface Drop {
  id: number;
  sprite: SpriteName;
  left: number;
  delay: number;
  duration: number;
}

/** ↑↑↓↓←→←→BA makes it rain cats and hearts. */
@Component({
  selector: 'app-easter-egg',
  imports: [PixelComponent],
  template: `
    @if (active()) {
      <div class="rain" aria-hidden="true">
        @for (d of drops(); track d.id) {
          <app-pixel
            class="drop"
            [name]="d.sprite"
            [scale]="3"
            [style.left.%]="d.left"
            [style.animation-delay.s]="d.delay"
            [style.animation-duration.s]="d.duration"
          />
        }
      </div>
      <div class="toast box" role="status">
        <div class="box-title">★ achievement unlocked ★</div>
        <div class="box-body">
          <b>Old School Gamer</b><br />
          You know the code. Respect. 🕹️
        </div>
      </div>
    }
  `,
  styles: [`
    .rain {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 9998;
    }
    .drop {
      position: absolute;
      top: -60px;
      animation: fall linear forwards;
    }
    @keyframes fall {
      to { transform: translateY(calc(100vh + 80px)) rotate(360deg); }
    }
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 240px;
      z-index: 9999;
      animation: pop 0.3s steps(3);
    }
    @keyframes pop {
      from { transform: scale(0.5); opacity: 0; }
    }
  `],
})
export class EasterEggComponent {
  readonly active = signal(false);
  readonly drops = signal<Drop[]>([]);

  constructor() {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        this.trigger();
      }
    };
    addEventListener('keydown', onKey);
    inject(DestroyRef).onDestroy(() => removeEventListener('keydown', onKey));
  }

  trigger() {
    if (this.active()) return;
    const sprites: SpriteName[] = ['cat', 'heart', 'star', 'heart', 'coffee'];
    this.drops.set(
      Array.from({ length: 40 }, (_, id) => ({
        id,
        sprite: sprites[id % sprites.length],
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 3,
      })),
    );
    this.active.set(true);
    setTimeout(() => this.active.set(false), 8000);
  }
}
