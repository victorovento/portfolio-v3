import { Component, computed } from '@angular/core';

const SYNODIC = 29.530588853; // days from one new moon to the next
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14); // reference new moon
const N = 16; // pixel grid size

const NAMES = [
  'new moon', 'waxing crescent', 'first quarter', 'waxing gibbous',
  'full moon', 'waning gibbous', 'last quarter', 'waning crescent',
];

// A few darker "craters" on the lit side, as grid coordinates.
const CRATERS = new Set(['5,5', '6,5', '10,4', '9,9', '10,9', '5,10', '11,11', '7,12']);

/** Tonight's moon phase as pixel art, computed locally. */
@Component({
  selector: 'app-moon',
  template: `
    <section class="box">
      <div class="box-title">tonight's moon</div>
      <div class="box-body moon">
        <svg [attr.viewBox]="'0 0 ' + size + ' ' + size" width="64" height="64" shape-rendering="crispEdges" role="img" [attr.aria-label]="name()">
          @for (p of pixels(); track $index) {
            <rect [attr.x]="p.x" [attr.y]="p.y" width="1" height="1" [attr.fill]="p.fill" />
          }
        </svg>
        <div class="info">
          <b>{{ name() }}</b>
          <span class="mini">{{ illumination() }}% lit</span>
          <span class="mini">{{ untilFull() }}</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .moon {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    svg {
      flex-shrink: 0;
      filter: drop-shadow(0 0 6px rgba(240, 230, 200, 0.25));
    }
    .info {
      display: flex;
      flex-direction: column;
      line-height: 1.35;
      b { font-size: 11px; color: #f0e6c8; }
    }
    .mini { font-size: 10px; color: var(--text-muted); }
  `],
})
export class MoonComponent {
  readonly size = N;

  /** 0 = new, 0.5 = full, back to 1. */
  readonly phase = computed(() => {
    const days = (Date.now() - KNOWN_NEW_MOON) / 864e5;
    return (((days % SYNODIC) + SYNODIC) % SYNODIC) / SYNODIC;
  });

  readonly name = computed(() => NAMES[Math.round(this.phase() * 8) % 8]);
  readonly illumination = computed(() => Math.round(((1 - Math.cos(2 * Math.PI * this.phase())) / 2) * 100));

  readonly untilFull = computed(() => {
    const p = this.phase();
    const days = Math.round(((0.5 - p + 1) % 1) * SYNODIC);
    return days === 0 ? 'full tonight!' : `full in ${days} day${days === 1 ? '' : 's'}`;
  });

  readonly pixels = computed(() => {
    const p = this.phase();
    const c = Math.cos(2 * Math.PI * p);
    const waxing = p < 0.5;
    const r = N / 2 - 0.5;
    const out: { x: number; y: number; fill: string }[] = [];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const dx = x - r;
        const dy = y - r;
        if (dx * dx + dy * dy > r * r + 1) continue;
        // Half-width of the disc on this row; the terminator sits at c * w.
        const w = Math.sqrt(Math.max(0, r * r - dy * dy));
        const lit = waxing ? dx > c * w : dx < -c * w;
        const fill = lit ? (CRATERS.has(`${x},${y}`) ? '#c9bf9f' : '#f0e6c8') : '#2a2a2a';
        out.push({ x, y, fill });
      }
    }
    return out;
  });
}
