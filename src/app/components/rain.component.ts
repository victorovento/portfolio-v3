import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';

interface Drop {
  x: number;
  y: number;
  speed: number;
  len: number;
  color: string;
}

interface Splash {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const WIND = 0.25; // horizontal drift per unit of fall
const COLORS = ['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.5)', 'rgba(229,57,53,0.6)', 'rgba(255,138,128,0.45)'];

/** Pixel rain behind the page. Off for reduced motion; pauses in hidden tabs. */
@Component({
  selector: 'app-rain',
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: [`
    canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 0;
      image-rendering: pixelated;
    }
  `],
})
export class RainComponent {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => this.init());
  }

  private init() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d')!;
    let drops: Drop[] = [];
    const splashes: Splash[] = [];
    let raf = 0;
    let last = performance.now();

    const makeDrop = (anywhere: boolean): Drop => ({
      x: Math.random() * (canvas.width + canvas.height * WIND) - canvas.height * WIND,
      y: anywhere ? Math.random() * canvas.height : -20 - Math.random() * 100,
      speed: 7 + Math.random() * 6,
      len: 10 + ((Math.random() * 6) | 0) * 2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
    });

    const resize = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      // Density scales with screen area.
      const count = Math.round((canvas.width * canvas.height) / 5000);
      drops = Array.from({ length: count }, () => makeDrop(true));
    };
    resize();

    const frame = (now: number) => {
      // Normalise to 60fps so speed is the same on 120Hz screens.
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const d of drops) {
        d.y += d.speed * dt;
        d.x += d.speed * WIND * dt;
        if (d.y > canvas.height) {
          if (Math.random() < 0.5) {
            for (let i = 0; i < 3; i++) {
              splashes.push({
                x: d.x,
                y: canvas.height - 2,
                vx: (Math.random() - 0.5) * 2,
                vy: -1 - Math.random() * 1.5,
                life: 1,
              });
            }
          }
          Object.assign(d, makeDrop(false));
        }
        // Draw as a stair-stepped 1px line so it stays pixel-crisp.
        ctx.fillStyle = d.color;
        const x = Math.round(d.x);
        const y = Math.round(d.y);
        for (let i = 0; i < d.len; i += 2) {
          ctx.fillRect(x - Math.round(i * WIND), y - i, 1, 2);
        }
      }

      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 0.15 * dt;
        s.life -= 0.04 * dt;
        if (s.life <= 0) {
          splashes.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(255,255,255,${s.life * 0.7})`;
        ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
      }

      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    raf = requestAnimationFrame(frame);
    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    });
  }
}
