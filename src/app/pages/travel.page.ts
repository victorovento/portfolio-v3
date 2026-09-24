import { afterNextRender, Component, computed, effect, ElementRef, signal, viewChild } from '@angular/core';
import { travel } from '../config';
import { PixelComponent } from '../pixel/pixel.component';

// Shape of public/assets/travel-map.json, written by scripts/build-travel-map.mjs.
interface MapRegion {
  name: string;
  kind: 'state' | 'province' | 'country' | 'territory';
  country: string; // 'US' | 'CA' | 'MX' or the country's own name
}

interface MapData {
  cols: number;
  rows: number;
  projection: { lon0: number; lat1: number; kx: number; ky: number };
  insets: { name: string; col: number; row: number; w: number; h: number }[];
  regions: MapRegion[];
  data: number[][]; // run-length encoded rows: [value, count, value, count, ...]
}

const CELL = 4; // canvas pixels per map cell
const COUNTRY_NAMES: Record<string, string> = { US: 'USA', CA: 'Canada', MX: 'Mexico' };
const COLORS = {
  water: '#07101c',
  wave: '#0c1a2c',
  land: '#2b2b2b',
  visited: '#e53935',
  hoverVisited: '#ffd54f',
  hoverLand: '#5a5a5a',
  border: '#0b0b0b',
  inset: '#3a3a3a',
};

const key = (country: string, name: string) => `${country}:${name}`;

@Component({
  selector: 'app-travel-page',
  imports: [PixelComponent],
  template: `
    <h2>Where I've <span>Been</span></h2>
    <p class="intro">
      Every place I've set foot in, one pixel at a time. Born in Cuba, living in Florida, and slowly
      coloring in the rest of the map. Hover (or tap) a place to see its name.
    </p>

    <dl class="lcd">
      <div><dt>us states</dt><dd>{{ usCount }}/50</dd></div>
      <div><dt>mexican states</dt><dd>{{ travel.mexico.length }}/32</dd></div>
      <div><dt>canadian prov.</dt><dd>{{ travel.canada.length }}/13</dd></div>
      <div><dt>countries</dt><dd>{{ countryCount }}</dd></div>
    </dl>

    <section class="box map-box">
      <div class="box-title">travel_map.exe <span class="controls"><span></span><span></span><span></span></span></div>
      <div class="box-body">
        <div class="map" (pointerleave)="hover.set(null)">
          <canvas
            #canvas
            role="img"
            [attr.aria-label]="'Map of visited places: ' + usCount + ' US states plus DC, ' + countryCount + ' countries'"
            (pointermove)="onPointer($event)"
            (pointerdown)="onPointer($event)"
          ></canvas>

          @for (m of markers(); track m.label) {
            <span class="marker" [style.left.%]="m.x" [style.top.%]="m.y" [title]="m.label + ': ' + m.where">
              <app-pixel [name]="m.icon" [scale]="1" />
            </span>
          }

          @if (hover(); as h) {
            <div class="tip" [style.left.px]="h.x" [style.top.px]="h.y" [class.flip]="h.flip">
              <b>{{ h.region.name }}</b>
              @if (h.region.kind === 'state' || h.region.kind === 'province') {
                <span class="mini">{{ countryName(h.region.country) }}</span>
              }
              <span class="status" [class.yes]="h.visited">{{ h.visited ? '✓ been here' : 'not yet' }}</span>
              @if (h.cities) {
                <span class="mini">{{ h.cities }}</span>
              }
            </div>
          }
        </div>

        <ul class="legend">
          <li><i class="swatch visited"></i> visited</li>
          <li><i class="swatch land"></i> not yet</li>
          <li><app-pixel name="star" [scale]="1" /> born here (Cuba)</li>
          <li><app-pixel name="home" [scale]="1" /> home (Melbourne, FL)</li>
        </ul>
      </div>
    </section>

    <div class="lists">
      <section class="box">
        <div class="box-title">united states <span class="count">{{ usCount }} + DC</span></div>
        <ul class="box-body cols">
          @for (s of usSorted; track s) {
            <li>{{ s }}</li>
          }
        </ul>
      </section>

      <section class="box">
        <div class="box-title">mexico <span class="count">{{ travel.mexico.length }} states</span></div>
        <ul class="box-body">
          @for (p of travel.mexico; track p.region) {
            <li>{{ p.region }} @if (p.cities?.length) { <span class="mini">· {{ p.cities!.join(', ') }}</span> }</li>
          }
        </ul>
      </section>

      <section class="box">
        <div class="box-title">canada <span class="count">{{ travel.canada.length }} province</span></div>
        <ul class="box-body">
          @for (p of travel.canada; track p.region) {
            <li>{{ p.region }}</li>
          }
        </ul>
      </section>

      <section class="box">
        <div class="box-title">caribbean &amp; central america</div>
        <ul class="box-body">
          @for (c of travel.countries; track c) {
            <li>{{ c }} @if (c === 'Cuba') { <span class="mini">· where I was born ★</span> }</li>
          }
        </ul>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .intro { color: var(--text-muted); }
    .lcd { margin: 0; }
    .map {
      position: relative;
      line-height: 0;
      touch-action: manipulation;
    }
    canvas {
      width: 100%;
      height: auto;
      image-rendering: pixelated;
      cursor: crosshair;
      border: 1px solid var(--border);
    }
    .marker {
      position: absolute;
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: bob 1.2s steps(2) infinite;
      filter: drop-shadow(0 0 3px #000);
    }
    @keyframes bob { 50% { transform: translate(-50%, -65%); } }
    .tip {
      position: absolute;
      z-index: 2;
      transform: translate(12px, -50%);
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 120px;
      padding: 6px 8px;
      line-height: 1.3;
      font-size: 11px;
      background: #0b0b0b;
      border: 2px solid var(--red);
      box-shadow: 3px 3px 0 var(--red-dark);
      white-space: nowrap;
      &.flip { transform: translate(calc(-100% - 12px), -50%); }
      b { color: #fff; font-size: 12px; }
    }
    .status { color: var(--text-muted); }
    .status.yes { color: #6f6; }
    .legend {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 6px 16px;
      margin-top: 10px;
      font-size: 11px;
      color: var(--text-muted);
      li { display: flex; align-items: center; gap: 6px; }
    }
    .swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border: 1px solid #000;
      &.visited { background: #e53935; }
      &.land { background: #2b2b2b; }
    }
    .lists {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      align-items: start;
      section:first-child { grid-column: 1 / -1; }
    }
    .count { font-size: 7px; opacity: 0.85; }
    ul { list-style: none; }
    li { font-size: 12px; padding: 2px 0; }
    li::before { content: '✓ '; color: var(--red); }
    .legend li::before { content: none; }
    .cols {
      columns: 3 140px;
      column-gap: 16px;
    }
    .mini { font-size: 10px; color: var(--text-muted); }
  `],
})
export class TravelPage {
  readonly travel = travel;
  readonly usCount = travel.usStates.filter((s) => s !== 'District of Columbia').length;
  // The US, Canada and Mexico count as countries too.
  readonly countryCount = 3 + travel.countries.filter((c) => c !== 'Puerto Rico').length;
  readonly usSorted = [...travel.usStates].sort();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  readonly map = signal<MapData | null>(null);
  readonly hover = signal<{ index: number; region: MapRegion; visited: boolean; cities: string | null; x: number; y: number; flip: boolean } | null>(null);

  private readonly visited = new Set<string>([
    ...travel.usStates.map((s) => key('US', s)),
    ...travel.canada.map((p) => key('CA', p.region)),
    ...travel.mexico.map((p) => key('MX', p.region)),
    ...travel.countries.map((c) => key(c, c)),
  ]);
  private readonly cities = new Map(travel.mexico.map((p) => [key('MX', p.region), p.cities?.join(', ') ?? null]));

  /** Decoded grid: region index + 1 per cell, 0 for water. */
  private readonly grid = computed(() => {
    const m = this.map();
    if (!m) return null;
    const cells = new Uint16Array(m.cols * m.rows);
    m.data.forEach((runs, row) => {
      let col = 0;
      for (let i = 0; i < runs.length; i += 2) {
        cells.fill(runs[i], row * m.cols + col, row * m.cols + col + runs[i + 1]);
        col += runs[i + 1];
      }
    });
    return cells;
  });

  readonly markers = computed(() => {
    const m = this.map();
    if (!m) return [];
    const { lon0, lat1, kx, ky } = m.projection;
    return travel.markers.map((mk) => ({
      ...mk,
      x: (((mk.lon - lon0) * kx) / m.cols) * 100,
      y: (((lat1 - mk.lat) * ky) / m.rows) * 100,
    }));
  });

  constructor() {
    fetch('assets/travel-map.json')
      .then((r) => r.json())
      .then((d: MapData) => this.map.set(d))
      .catch(() => {});

    // Redraw whenever the data arrives or the hovered region changes.
    let ready = false;
    afterNextRender(() => {
      ready = true;
      this.draw();
    });
    effect(() => {
      this.grid();
      this.hover()?.index;
      if (ready) this.draw();
    });
  }

  countryName(code: string) {
    return COUNTRY_NAMES[code] ?? code;
  }

  isVisited(r: MapRegion) {
    return this.visited.has(key(r.country, r.name));
  }

  onPointer(e: PointerEvent) {
    const m = this.map();
    const grid = this.grid();
    if (!m || !grid) return;
    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const col = Math.floor(((e.clientX - rect.left) / rect.width) * m.cols);
    const row = Math.floor(((e.clientY - rect.top) / rect.height) * m.rows);
    const v = grid[row * m.cols + col];
    if (!v) {
      this.hover.set(null);
      return;
    }
    const region = m.regions[v - 1];
    const k = key(region.country, region.name);
    const x = e.clientX - rect.left;
    this.hover.set({
      index: v,
      region,
      visited: this.visited.has(k),
      cities: this.cities.get(k) ?? null,
      x,
      y: e.clientY - rect.top,
      flip: x > rect.width * 0.6,
    });
  }

  private draw() {
    const m = this.map();
    const grid = this.grid();
    if (!m || !grid) return;
    const canvas = this.canvas().nativeElement;
    canvas.width = m.cols * CELL;
    canvas.height = m.rows * CELL;
    const ctx = canvas.getContext('2d')!;
    const hovered = this.hover()?.index ?? 0;
    const visitedIdx = m.regions.map((r) => this.isVisited(r));

    for (let row = 0; row < m.rows; row++) {
      for (let col = 0; col < m.cols; col++) {
        const v = grid[row * m.cols + col];
        let color: string;
        if (!v) {
          // A sparse wave pattern keeps the ocean from looking flat.
          color = (col * 7 + row * 13) % 23 === 0 ? COLORS.wave : COLORS.water;
        } else {
          const seen = visitedIdx[v - 1];
          color = v === hovered ? (seen ? COLORS.hoverVisited : COLORS.hoverLand) : seen ? COLORS.visited : COLORS.land;
        }
        ctx.fillStyle = color;
        ctx.fillRect(col * CELL, row * CELL, CELL, CELL);

        // 1px border wherever two different land regions touch.
        if (v) {
          ctx.fillStyle = COLORS.border;
          const right = col + 1 < m.cols ? grid[row * m.cols + col + 1] : 0;
          const below = row + 1 < m.rows ? grid[(row + 1) * m.cols + col] : 0;
          if (right && right !== v) ctx.fillRect(col * CELL + CELL - 1, row * CELL, 1, CELL);
          if (below && below !== v) ctx.fillRect(col * CELL, row * CELL + CELL - 1, CELL, 1);
        }
      }
    }

    // Frames around the Alaska and Hawaii insets.
    ctx.strokeStyle = COLORS.inset;
    ctx.lineWidth = 1;
    for (const f of m.insets) {
      ctx.strokeRect(f.col * CELL - 1.5, f.row * CELL - 1.5, f.w * CELL + 3, f.h * CELL + 3);
    }
  }
}
