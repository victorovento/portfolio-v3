import { Component, signal } from '@angular/core';
import { fortunes } from '../config';
import { PixelComponent } from '../pixel/pixel.component';

/** Click the cookie for a random dev fortune (never the same one twice in a row). */
@Component({
  selector: 'app-fortune',
  imports: [PixelComponent],
  template: `
    <section class="box">
      <div class="box-title">fortune cookie</div>
      <div class="box-body center">
        <button type="button" class="cookie" [class.crack]="cracking()" (click)="crack()" aria-label="Crack a fortune cookie">
          <app-pixel name="cookie" [scale]="4" />
        </button>
        @if (fortune(); as f) {
          <p class="slip" aria-live="polite">"{{ f }}"</p>
          <p class="mini">lucky number: {{ lucky() }}</p>
        } @else {
          <p class="mini">click the cookie!</p>
        }
      </div>
    </section>
  `,
  styles: [`
    .center { text-align: center; }
    .cookie {
      background: none;
      border: 0;
      cursor: pointer;
      padding: 0;
      &:hover { transform: rotate(-6deg); }
    }
    .crack { animation: crack 0.3s steps(3); }
    @keyframes crack {
      33% { transform: rotate(-12deg) scale(1.1); }
      66% { transform: rotate(12deg) scale(1.1); }
    }
    .slip {
      margin-top: 6px;
      padding: 6px;
      font-size: 11px;
      line-height: 1.45;
      color: #0b0b0b;
      background: #f4efe6;
      border: 1px dashed #b8a98a;
      box-shadow: 2px 2px 0 var(--red-dark);
    }
    .mini {
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 4px;
    }
  `],
})
export class FortuneComponent {
  readonly fortune = signal<string | null>(null);
  readonly lucky = signal(0);
  readonly cracking = signal(false);

  crack() {
    let next: string;
    do {
      next = fortunes[(Math.random() * fortunes.length) | 0];
    } while (fortunes.length > 1 && next === this.fortune());
    this.fortune.set(next);
    this.lucky.set(1 + ((Math.random() * 99) | 0));
    this.cracking.set(false);
    requestAnimationFrame(() => this.cracking.set(true));
  }
}
