import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const COLORS = ['#e53935', '#ff8a80', '#ffffff', '#ffd54f'];

/** Pixel sparkles that trail the mouse. Off for touch and reduced motion. */
@Component({
  selector: 'app-sparkles',
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: [`
    canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    }
  `],
})
export class SparklesComponent {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => this.init());
  }

  private init() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(pointer: fine)').matches;
    if (reduced || !finePointer) return;

    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d')!;
    const sparkles: Sparkle[] = [];
    let raf = 0;
    let lastSpawn = 0;

    const resize = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    };
    resize();

    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05;
        s.life -= 0.02;
        if (s.life <= 0) {
          sparkles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        const x = Math.round(s.x);
        const y = Math.round(s.y);
        const n = s.size * 2;
        const t = s.size;
        // A little 4-point pixel star.
        ctx.fillRect(x, y - n, t, n * 2 + t);
        ctx.fillRect(x - n, y, n * 2 + t, t);
      }
      ctx.globalAlpha = 1;
      // Only keep the loop alive while there is something to draw.
      raf = sparkles.length ? requestAnimationFrame(frame) : 0;
    };

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawn < 30) return;
      lastSpawn = now;
      sparkles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.2,
        vy: Math.random() * -0.5,
        life: 1,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        size: Math.random() < 0.3 ? 2 : 1,
      });
      if (!raf) raf = requestAnimationFrame(frame);
    };

    addEventListener('mousemove', onMove, { passive: true });
    addEventListener('resize', resize);
    this.destroyRef.onDestroy(() => {
      removeEventListener('mousemove', onMove);
      removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    });
  }
}
