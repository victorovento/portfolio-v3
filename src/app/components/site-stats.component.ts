import { Component, computed, signal } from '@angular/core';
import { site } from '../config';

const DAY = 864e5;
const daysSince = (iso: string) => Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / DAY));

const STAMPS = [
  { src: 'assets/stamps/metal.svg', alt: 'Metal forever' },
  { src: 'assets/stamps/coffee.svg', alt: 'Coffee to code' },
  { src: 'assets/stamps/gamer.svg', alt: 'Gamer: PS5 and PC' },
  { src: 'assets/stamps/open-source.svg', alt: 'I love open source' },
  { src: 'assets/stamps/florida.svg', alt: 'Florida, the sunshine state' },
];

/** Site age, last build, days without a bug, and a stamp collection. */
@Component({
  selector: 'app-site-stats',
  template: `
    <section class="box">
      <div class="box-title">site stats</div>
      <dl class="box-body stats">
        <div><dt>online since</dt><dd>{{ site.onlineSince }}</dd></div>
        <div><dt>site age</dt><dd>{{ age() }} days</dd></div>
        @if (builtAt(); as b) {
          <div><dt>last updated</dt><dd>{{ b.slice(0, 10) }}</dd></div>
        }
        <div class="bug"><dt>days without a bug</dt><dd>{{ bugFree() }}</dd></div>
      </dl>
    </section>

    <section class="box">
      <div class="box-title">stamps</div>
      <div class="box-body stamps">
        @for (s of stamps; track s.src) {
          <img [src]="s.src" [alt]="s.alt" [title]="s.alt" width="99" height="56" loading="lazy" />
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .stats > div {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      padding: 3px 0;
      border-bottom: 1px dotted var(--border);
      font-size: 11px;
    }
    dt { color: var(--text-muted); }
    dd { color: #fff; white-space: nowrap; }
    .bug dd {
      font-family: var(--pixel);
      font-size: 9px;
      color: #6f6;
    }
    .stamps {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      img {
        width: 78px;
        height: auto;
        filter: drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.6));
        transition: transform 0.1s steps(2);
      }
      img:nth-child(odd) { transform: rotate(-3deg); }
      img:nth-child(even) { transform: rotate(2deg); }
      img:hover { transform: rotate(0) scale(1.08); }
    }
  `],
})
export class SiteStatsComponent {
  readonly site = site;
  readonly stamps = STAMPS;
  readonly builtAt = signal<string | null>(null);
  readonly age = computed(() => daysSince(site.onlineSince));
  readonly bugFree = computed(() => String(daysSince(site.lastBug)).padStart(3, '0'));

  constructor() {
    fetch('assets/build.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => this.builtAt.set(d?.builtAt ?? null))
      .catch(() => {});
  }
}
