import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { palette, sprites, SpriteName } from './sprites';

interface Px {
  x: number;
  y: number;
  fill: string;
}

/** Renders a sprite from sprites.ts as a crisp inline SVG. */
@Component({
  selector: 'app-pixel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.viewBox]="'0 0 ' + size().w + ' ' + size().h"
      [attr.width]="size().w * scale()"
      [attr.height]="size().h * scale()"
      shape-rendering="crispEdges"
      aria-hidden="true"
    >
      @for (p of pixels(); track $index) {
        <rect [attr.x]="p.x" [attr.y]="p.y" width="1" height="1" [attr.fill]="p.fill" />
      }
    </svg>
  `,
  styles: [`:host { display: inline-block; line-height: 0; flex-shrink: 0; } svg { display: block; }`],
})
export class PixelComponent {
  readonly name = input.required<SpriteName>();
  readonly scale = input(2);

  private readonly rows = computed<readonly string[]>(() => sprites[this.name()]);

  readonly size = computed(() => ({
    w: Math.max(...this.rows().map((r) => r.length)),
    h: this.rows().length,
  }));

  readonly pixels = computed<Px[]>(() => {
    const out: Px[] = [];
    this.rows().forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const fill = palette[ch];
        if (fill) out.push({ x, y, fill });
      });
    });
    return out;
  });
}
