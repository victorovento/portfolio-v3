import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { TweetsComponent } from '../components/tweets.component';
import { MoonComponent } from '../components/moon.component';
import { FortuneComponent } from '../components/fortune.component';
import { SiteStatsComponent } from '../components/site-stats.component';
import { CounterService } from '../services/counter.service';

export const buttons = [
  { src: 'assets/buttons/victorvento.svg', alt: 'Victor Vento', href: 'https://victorvento.net' },
  { src: 'assets/buttons/angular.svg', alt: 'Made with Angular', href: 'https://angular.dev' },
  { src: 'assets/buttons/typescript.svg', alt: 'Strictly typed with TypeScript', href: 'https://www.typescriptlang.org' },
  { src: 'assets/buttons/coffee.svg', alt: 'Powered by coffee' },
  { src: 'assets/buttons/no-cookies.svg', alt: 'This site has no cookies' },
  { src: 'assets/buttons/best-viewed.svg', alt: 'Best viewed with any browser' },
  { src: 'assets/buttons/dimden.svg', alt: 'Inspired by dimden.dev', href: 'https://dimden.dev' },
];

@Component({
  selector: 'app-right-sidebar',
  imports: [TweetsComponent, MoonComponent, FortuneComponent, SiteStatsComponent],
  template: `
    <section class="box">
      <div class="box-title">local time</div>
      <div class="box-body clock">
        <span class="time">{{ time() }}</span>
        <span class="where">in Melbourne, FL</span>
      </div>
    </section>

    <app-moon />

    <app-tweets />

    <app-fortune />

    <section class="box">
      <div class="box-title">visitors</div>
      <div class="box-body center">
        <div class="counter" [attr.aria-label]="counter.hits() + ' visitors'">
          @for (d of digits(); track $index) {
            <span>{{ d }}</span>
          }
        </div>
        <p class="note">you are visitor #{{ counter.hits() }}!</p>
      </div>
    </section>

    <app-site-stats />

    <section class="box">
      <div class="box-title">buttons</div>
      <div class="box-body buttons">
        @for (b of buttons; track b.src) {
          @if (b.href) {
            <a [href]="b.href" target="_blank" rel="noopener"><img [src]="b.src" [alt]="b.alt" [title]="b.alt" width="88" height="31" /></a>
          } @else {
            <img [src]="b.src" [alt]="b.alt" [title]="b.alt" width="88" height="31" />
          }
        }
      </div>
    </section>

    <div class="blinkies" aria-hidden="true">
      <span class="blinkie">i ♥ typescript</span>
      <span class="blinkie alt slow">coffee powered</span>
      <span class="blinkie">angular enjoyer</span>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .clock {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .time {
      font-family: var(--pixel);
      font-size: 13px;
      color: var(--red);
      text-shadow: 0 0 6px rgba(229, 57, 53, 0.6);
    }
    .where {
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .center { text-align: center; }
    .counter {
      display: inline-flex;
      gap: 2px;
      padding: 3px;
      background: #000;
      border: 2px inset #444;
    }
    .counter span {
      font-family: var(--pixel);
      font-size: 12px;
      color: #6f6;
      background: #111;
      padding: 4px 3px;
      border: 1px solid #222;
    }
    .note {
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 6px;
    }
    .buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
    }
    .buttons img {
      display: block;
      image-rendering: pixelated;
    }
    .buttons a:hover img { filter: brightness(1.2); }
    .blinkies {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
  `],
})
export class RightSidebarComponent {
  readonly counter = inject(CounterService);
  readonly buttons = buttons;

  readonly digits = computed(() => String(this.counter.hits()).padStart(6, '0').split(''));

  private readonly formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  readonly time = signal(this.formatter.format(new Date()));

  constructor() {
    const t = setInterval(() => this.time.set(this.formatter.format(new Date())), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(t));
  }
}
