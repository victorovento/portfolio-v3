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
  size: number;
  opacity: number;
  baseOpacity: number;
}

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
      filter: blur(0.7px);
      opacity: 0.7;
    }
  `],
})
export class ParticleBgComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: -9999, y: -9999 };
  private rafId = 0;
  private cols = 0;
  private rows = 0;
  private spacing = 40;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.zone.runOutsideAngular(() => this.loop());
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rafId);
  }

  @HostListener('window:resize')
  resize() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
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
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.cols = Math.ceil(w / this.spacing) + 1;
    this.rows = Math.ceil(h / this.spacing) + 1;
    this.particles = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c * this.spacing;
        const y = r * this.spacing;
        const baseOpacity = 0.15 + Math.random() * 0.1;
        this.particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: 1.5,
          opacity: baseOpacity,
          baseOpacity,
        });
      }
    }
  }

  private loop() {
    this.update();
    this.draw();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  private update() {
    const mouseX = this.mouse.x;
    const mouseY = this.mouse.y;
    const lightRadius = 160;
    const waveRadius = 300;
    const pushStrength = 60;
    const friction = 0.85;
    const returnSpeed = 0.08;

    for (const p of this.particles) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Wave ripple displacement
      if (dist < waveRadius && dist > 0) {
        const waveFactor = (1 - dist / waveRadius);
        const angle = Math.atan2(dy, dx);
        const push = pushStrength * waveFactor * waveFactor;
        p.vx += Math.cos(angle) * push * 0.05;
        p.vy += Math.sin(angle) * push * 0.05;
      }

      // Apply velocity with friction
      p.vx *= friction;
      p.vy *= friction;

      // Snap back to base position
      p.vx += (p.baseX - p.x) * returnSpeed;
      p.vy += (p.baseY - p.y) * returnSpeed;

      p.x += p.vx;
      p.y += p.vy;

      // Light effect: brightness near cursor
      if (dist < lightRadius) {
        const glow = 1 - dist / lightRadius;
        p.opacity = p.baseOpacity + glow * 0.75;
      } else {
        p.opacity += (p.baseOpacity - p.opacity) * 0.06;
      }
    }
  }

  private draw() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mouseX = this.mouse.x;
    const mouseY = this.mouse.y;
    const lightRadius = 160;

    for (const p of this.particles) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Color: glow red near cursor, dim white otherwise
      let r = 240, g = 240, b = 240;
      if (dist < lightRadius) {
        const t = 1 - dist / lightRadius;
        r = Math.round(240 + (229 - 240) * t); // 240 → 229
        g = Math.round(240 + (57  - 240) * t); // 240 → 57
        b = Math.round(240 + (53  - 240) * t); // 240 → 53
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, p.opacity)})`;
      this.ctx.fill();
    }

    // Radial light halo around cursor
    if (mouseX > 0) {
      const grad = this.ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, lightRadius);
      grad.addColorStop(0,   'rgba(229,57,53,0.06)');
      grad.addColorStop(0.5, 'rgba(229,57,53,0.02)');
      grad.addColorStop(1,   'rgba(229,57,53,0)');
      this.ctx.beginPath();
      this.ctx.arc(mouseX, mouseY, lightRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();
    }
  }
}
