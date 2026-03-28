import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
  NgZone,
} from '@angular/core';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  opacity: number;
  baseOpacity: number;
}

const SIZE        = 1.5;
const SPACING     = 45;
const LIGHT_R     = 150;
const LIGHT_R2    = LIGHT_R * LIGHT_R;
const WAVE_R      = 280;
const WAVE_R2     = WAVE_R * WAVE_R;
const PUSH        = 3;
const FRICTION    = 0.84;
const RETURN      = 0.08;

@Component({
  selector: 'app-particle-bg',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  styles: [`
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }
  `],
})
export class ParticleBgComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: -9999, y: -9999 };
  private rafId = 0;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resize();
    this.zone.runOutsideAngular(() => this.loop());
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rafId);
  }

  @HostListener('window:resize')
  resize() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    this.buildGrid();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  @HostListener('window:mouseleave')
  onMouseLeave() {
    this.mouse.x = -9999;
    this.mouse.y = -9999;
  }

  private buildGrid() {
    const cols = Math.ceil(window.innerWidth  / SPACING) + 1;
    const rows = Math.ceil(window.innerHeight / SPACING) + 1;
    this.particles = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * SPACING;
        const y = r * SPACING;
        const baseOpacity = 0.15 + Math.random() * 0.1;
        this.particles.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0, opacity: baseOpacity, baseOpacity });
      }
    }
  }

  private loop() {
    this.update();
    this.draw();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  private update() {
    const mx = this.mouse.x;
    const my = this.mouse.y;

    for (const p of this.particles) {
      const dx = p.x - mx;
      const dy = p.y - my;
      const d2 = dx * dx + dy * dy;

      if (d2 < WAVE_R2 && d2 > 0) {
        const dist = Math.sqrt(d2);
        const f    = (1 - dist / WAVE_R);
        p.vx += (dx / dist) * PUSH * f * f;
        p.vy += (dy / dist) * PUSH * f * f;
      }

      p.vx = p.vx * FRICTION + (p.baseX - p.x) * RETURN;
      p.vy = p.vy * FRICTION + (p.baseY - p.y) * RETURN;
      p.x += p.vx;
      p.y += p.vy;

      if (d2 < LIGHT_R2) {
        const glow = 1 - Math.sqrt(d2) / LIGHT_R;
        p.opacity = p.baseOpacity + glow * 0.7;
      } else {
        p.opacity += (p.baseOpacity - p.opacity) * 0.06;
      }
    }
  }

  private draw() {
    const canvas = this.canvasRef.nativeElement;
    const ctx    = this.ctx;
    const mx     = this.mouse.x;
    const my     = this.mouse.y;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ── Dim dots (white) ──────────────────────────────────────────
    ctx.beginPath();
    for (const p of this.particles) {
      const dx = p.x - mx;
      const dy = p.y - my;
      if (dx * dx + dy * dy >= LIGHT_R2) {
        ctx.moveTo(p.x + SIZE, p.y);
        ctx.arc(p.x, p.y, SIZE, 0, 6.2832);
      }
    }
    ctx.fillStyle = `rgba(240,240,240,0.22)`;
    ctx.fill();

    // ── Lit dots (colour-shifted near cursor) ─────────────────────
    for (const p of this.particles) {
      const dx = p.x - mx;
      const dy = p.y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < LIGHT_R2) {
        const t = 1 - Math.sqrt(d2) / LIGHT_R;
        const r = Math.round(240 + (229 - 240) * t);
        const g = Math.round(240 + (57  - 240) * t);
        const b = Math.round(240 + (53  - 240) * t);
        ctx.beginPath();
        ctx.arc(p.x, p.y, SIZE, 0, 6.2832);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, p.opacity)})`;
        ctx.fill();
      }
    }

    // ── Cursor halo ───────────────────────────────────────────────
    if (mx > 0) {
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, LIGHT_R);
      grad.addColorStop(0,   'rgba(229,57,53,0.07)');
      grad.addColorStop(0.5, 'rgba(229,57,53,0.02)');
      grad.addColorStop(1,   'rgba(229,57,53,0)');
      ctx.beginPath();
      ctx.arc(mx, my, LIGHT_R, 0, 6.2832);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }
}
